<script lang="ts">
    import { onMount } from 'svelte';
    import type { Interaction, Audience, Campaign } from '$lib/model.js';
    import { writable } from 'svelte/store';
    import type { Writable } from 'svelte/store';
    import InteractionConfirmationTable from '$lib/components/InteractionConfirmationTable.svelte';
    
    export let data;
    let campaign: Campaign | null = null;
    let audienceIds: number[] = [];
    let audiences: Audience[] = [];
    let isLoadingAudiences = true;
    let audienceError: string | null = null;

    let interactions: Writable<Interaction[]> = writable([]);

    async function fetchAudience(audienceId: number) {
        if (isNaN(audienceId)) {
            throw new Error(`Invalid audience ID: ${audienceId}`);
        }
        const response = await fetch(`/api/audience?audience_id=${audienceId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.audience;
    }

    onMount(async () => {
        try {
            // Ensure campaign data is loaded
            campaign = data.campaign;
            console.log("Campaign on mount:", campaign);

            if (campaign) {
                // Extract audience IDs from the campaign
                audienceIds = campaign.audiences.map(audience => audience.id).filter(id => id !== undefined && id !== null);
                console.log("Audience IDs:", audienceIds);

                // Fetch audiences
                if (audienceIds.length > 0) {
                    audiences = await Promise.all(audienceIds.map(id => fetchAudience(id)));
                }
            }
        } catch (error) {
            console.error("Error fetching audiences:", error);
            audienceError = "Failed to load audiences. Please try refreshing the page.";
        } finally {
            isLoadingAudiences = false;
        }
    });
</script>

{#if campaign}
    <div class="px-20">
        <h1 class="text-4xl font-bold mb-4 flex justify-center items-center pt-5">{campaign.campaign_name}</h1>
        <a href="/campaign/{campaign.id}/insights" class="btn">Insights</a>

        <InteractionConfirmationTable campaign_id={campaign.id} />
        
        {#if isLoadingAudiences}
            <p>Loading audiences...</p>
        {:else if audienceError}
            <p class="text-red-500">{audienceError}</p>
        {:else if audiences.length === 0}
            <p>No audiences available for this campaign.</p>
        {:else}
            {#each audiences as audience, index}
                <div class="collapse bg-base-200 mt-4">
                    <input type="checkbox" id={"audience" + index} />
                    <label for={"audience" + index} class="collapse-title text-xl font-medium">
                        {audience.audience_name}
                    </label>
                    <div class="collapse-content">
                        <p>{audience.audience_information}</p>
                        
                        {#if audience.voters && audience.voters.length > 0}
                            {#each audience.voters as voter, rindex}
                                {#if voter}
                                    <div class="collapse bg-base-300 mt-2">
                                        <input type="checkbox" id={"voter" + index + "-" + rindex} />
                                        <label for={"voter" + index + "-" + rindex} class="collapse-title text-lg font-medium">
                                            {voter.voter_name}
                                        </label>
                                        {#if voter.voter_profile}
                                            <div class="collapse-content">
                                                <p>{voter.voter_profile.interests}</p>
                                            </div>
                                        {/if}
                                    </div>
                                {/if}
                            {/each}
                        {:else}
                            <p>No voters in this audience.</p>
                        {/if}
                    </div>
                </div>  
            {/each}
        {/if}

        <h2 class="text-2xl font-bold mt-8 mb-4">Recent Interactions</h2>
        {#each $interactions as interaction (interaction.id)}
            <div class="bg-white shadow-md rounded-lg p-4 mb-4">
                <p>Interaction ID: {interaction.id}</p>
                <p>Interaction Type: {interaction.interaction_type}</p>
                <p>Voter Name: {interaction.voter.voter_name}</p>
            </div>
        {/each}
    </div>
{:else}
    <p>Loading campaign data...</p>
{/if}