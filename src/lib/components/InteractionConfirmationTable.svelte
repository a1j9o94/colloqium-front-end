<script lang="ts">
    import type { Sender, Campaign, Interaction } from '$lib/model';
    import { campaignStore } from '$lib/stores/campaignStore';
    import { onDestroy, onMount } from 'svelte';
    import { API_URL } from '$lib/utility';
    import { writable, type Writable } from 'svelte/store';
    import { Socket, io } from 'socket.io-client';

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
    });

    onDestroy(() => {
        if (socket){
            socket.disconnect();
        }
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
        let interactionMethod = "send_text";
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
<div class="btn btn-primary" on:click={sendAllInteractions}>Send All</div>
<div class="container">
    <h1 class="my-4">Interactions</h1>
        <table class="table table-striped">
            <thead class="thead-light">
                <tr>
                    <th scope="col">Voter</th>
                    <th scope="col">Interaction Message</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody>
                {#each $interactions as interaction, interactionIndex (interaction.id)}
                    {#if interaction}
                        <tr>
                            <td>{interaction.voter.voter_name}</td>
                            <!-- Get the last item in the conversation array -->
                            <td>{interaction.conversation[interaction.conversation.length - 1].content}</td>
                            <td>
                                <button type="button" class="btn btn-primary" on:click={() => sendInteraction(interactionIndex)} disabled={interaction.sent || interaction.error}>
                                    {interaction.sent ? 'Sent' : interaction.error ? 'Error' : 'Send'}
                                </button>
                            </td>
                        </tr>
                    {/if}
                {/each}
            </tbody>
        </table>
</div>