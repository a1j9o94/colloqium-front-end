<script lang="ts">
    import type { Sender, Campaign, Interaction } from '$lib/model';
    import { campaignStore } from '$lib/stores/campaignStore';
    import { onDestroy, onMount } from 'svelte';
    import { API_URL } from '$lib/utility';
    import { writable, type Writable } from 'svelte/store';
    import { Socket, io } from 'socket.io-client';
	import InteractionToConfirm from './InteractionToConfirm.svelte';

    export let campaign_id: string = "";

    let interactions: Writable<Interaction[]> = writable([] as Interaction[]);
    let socket: Socket;
    let localCampaign: Campaign = {} as Campaign

    onMount(async () => {

        console.log("Campaign id: ", campaign_id);

        localCampaign.id = campaign_id 

        socket = io(`${API_URL}`);

        socket.emit('subscribe_campaign_initialization', { "campaign_id": campaign_id });

        socket.on('interaction_initialized', async (data) => {
            console.log("Interaction initialized");
            console.log(data);
            let interaction_id = data.interaction_id;
            const response = await fetch(`${API_URL}/interaction?interaction_id=${interaction_id}`);
            const interactionData = await response.json();
            const interaction: Interaction = interactionData.interaction as Interaction;

            console.log("Interaction from server:");
            console.log(interaction);

            // Add the interaction to the interactions array and refresh the table
            interactions.set([...$interactions, interaction]);
            console.log("Interactions:");
            console.log($interactions);
        });

        socket.onAny((event, ...args) => {
            console.log(event, args);
        });
        
        //get current campaign from api
        const res = await fetch(`${API_URL}/campaign?campaign_id=${localCampaign?.id}`);
        const data = await res.json();
        let campaign = data.campaign;
        localCampaign = campaign;

        console.log("Campaign on mount :");
        console.log(localCampaign);

        //get interactions with campaign id
        const res2 = await fetch(`${API_URL}/interaction?campaign_id=${localCampaign?.id}`);
        const data2 = await res2.json();
        let interactionsData = data2.interactions;

        //filter interactions with an interaction_status less than 4 which means they have not been sent yet
        interactionsData = interactionsData.filter((interaction) => {
            return interaction.interaction_status < 4 && interaction.conversation.length > 0;
        });

        interactions.set(interactionsData);
        console.log("Interactions on mount :");
        console.log($interactions);

        return () => {
            socket.disconnect();
        };
    });

    async function sendAllInteractions() {
        // Loop through the interactions and send each one
        for (let i = 0; i < $interactions.length; i++) {
            await sendInteraction(i);
        }
    }

    async function sendInteraction(interactionIndex: number) {
        const interaction = $interactions[interactionIndex];
        let interactionId = interaction.id;
        //check for text_message, robo_call, and email and send to the appropriate endpoint
        let interactionMethod = interaction.interaction_type == "text_message" ? "send_text" : interaction.interaction_type == "robo_call" ? "make_robo_call" : "send_email"; 
        let url = `${API_URL}/${interactionMethod}`;

        try {
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ interaction_status: 3, interaction_id: interactionId})
            });

            if (response.status != 200) {
                throw new Error('Response not OK');
            }

            // Update the interaction after successfully sending the text
            interaction.sent = true;
        } catch (error) {
            console.error("Error: ", error);

            // Mark the interaction as error
            interaction.error = true;
        }

        // This assignment will trigger Svelte's reactivity
        $interactions[interactionIndex] = interaction;
        interactions.set([...$interactions]);
    }

</script>


<!-- Button to confirm all messages. -->
<button class="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" on:click={sendAllInteractions}>
    <svg class="w-4 h-4 fill-current text-slate-500 dark:text-slate-400 shrink-0" viewBox="0 0 16 16">
        <path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z"></path>
    </svg>
    
    
    <span class="ml-2">Send All</span></button>

<div class="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
    <header class="px-5 py-4">
        <h2 class="font-semibold text-slate-800 dark:text-slate-100">Interactions to Confirm</h2>
    </header>
    <div class="overflow-x-auto">
        <table class="table-auto w-full dark:text-slate-300 text-slate-800">
            <thead class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
                <tr>
                    <th class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap font-semibold text-left" >Voter</th>
                    <th class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px font-semibold text-left" scope="col">Interaction Message</th>
                    <th class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px font-semibold text-left" scope="col">Action</th>
                </tr>
            </thead>
            <tbody class="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                {#each $interactions as interaction, interactionIndex (interaction.id)}
                    {#if interaction}
                        <InteractionToConfirm {interaction} {interactionIndex} {sendInteraction} /> 
                    {/if}
                {/each}
            </tbody>
        </table>
    </div>
</div>