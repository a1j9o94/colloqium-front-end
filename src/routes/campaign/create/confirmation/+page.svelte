<script lang="ts">
	import type { Sender, Campaign } from '$lib/model';
	import { campaignStore } from '$lib/stores/campaignStore';
	import { onMount } from 'svelte';
	import { API_URL } from '$lib/utility';
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
    
    let sender: Sender = {} as Sender;
    let localCampaign: Campaign | null = {} as Campaign;
    let interactions = writable([]);

    onMount(async () => {
        campaignStore.subscribe((campaign) => {
            localCampaign = campaign;
        });

        if(!localCampaign?.id) {
            console.error("No campaign id");
            goto("/campaign/create");
        }
        
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

        //filter interactions with an interaction_status less than 4
        interactionsData = interactionsData.filter((interaction) => {
            return interaction.interaction_status < 4;
        });

        interactions.set(interactionsData);
    });

    async function sendInteraction(interactionIndex) {
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
        interactions.update(interactions => {
            interactions[interactionIndex] = interaction;
            return [...interactions];
        });
    }
</script>

<!-- Path: src/routes/campaign/audience/+page.svelte -->
<h1>Confirm Creation</h1>
<a href="/campaign/{localCampaign?.id}" class="btn">Go to campaign page</a>
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
                {#if interaction.conversation}
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