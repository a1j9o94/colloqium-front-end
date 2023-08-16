<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import io from 'socket.io-client';
    import type { Socket } from 'socket.io-client';
	import type { Interaction } from '$lib/model.js';
    import { API_URL } from '$lib/utility.js';
    import { writable } from 'svelte/store';
    import type { Writable } from 'svelte/store';
    
    export let data;
    const { campaign } = data;

    let socket: Socket;
    let interactions: Writable<Interaction[]> = writable([]);

    async function fetchInteraction(interactionId: number) {
        const response = await fetch(`${API_URL}/interaction?interaction_id=${interactionId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        
        const interaction = await response.json();
        //console.log(interaction);

        return interaction;
    }

    onMount(() => {
        // Connect to the server
        socket = io(`${API_URL}`);

        // Join the room for the current campaign
        socket.emit('subscribe_campaign_initialization', { campaign_id: campaign.id });

        // Listen for the 'interaction_initialized' event
        socket.on('interaction_initialized', async (data) => {
            // Fetch the interaction object from the API
            const interaction = await fetchInteraction(data.interaction_id);
            //log the json representation of the interaction object
            //console.log(JSON.stringify(interaction));

            // Add the new interaction to the list
            interactions.update(value => [...value, interaction]);
            console.log("Interactions:", interactions);
        });

        socket.on('message', async (data) => {
            console.log(data);
        })
    });

    onDestroy(() => {
        // Disconnect from the server when the component is destroyed
        if (socket) {
            socket.disconnect();
        }
    });
</script>

<div class="w-2/3 grid grid-cols-1 place-self-center">
    <h1 class="text-4xl font-bold mb-4 flex justify-center items-center pt-5">{campaign.campaign_name}</h1>
    <a href="/campaign/{campaign.id}/insights" class="btn">Insights</a>
    <p>{campaign.campaign_goal}</p>
    
    {#each campaign.audiences as audience, index}
        <div class="collapse bg-base-200 mt-4">
            <input type="checkbox" id={"audience" + index} />
            <label for={"audience" + index} class="collapse-title text-xl font-medium">
                {audience.audience_name}
            </label>
            <div class="collapse-content">
                <p>{audience.audience_information}</p>
                
                {#each audience.voters as voter, rindex}
                    <div class="collapse bg-base-300 mt-2">
                        <input type="checkbox" id={"voter" + index + "-" + rindex} />
                        <label for={"voter" + index + "-" + rindex} class="collapse-title text-lg font-medium">
                            {voter.voter_name}
                        </label>
                        <div class="collapse-content">
                            <p>{voter.voter_profile.interests}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>  
    {/each}

    {#each $interactions as interaction (interaction.id)}
        <div>
            Interaction ID: {interaction.id}
            Interaction Type: {interaction.interaction_type}
            voter Name: {interaction.voter.voter_name}
        </div>
    {/each}

</div>