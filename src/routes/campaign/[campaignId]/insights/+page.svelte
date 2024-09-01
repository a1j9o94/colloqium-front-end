<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
    import type { Interaction } from '$lib/model.js';
    import { API_URL, refreshSingleEvaluation } from '$lib/utility';
    import { onMount, tick } from 'svelte';
    import 'c3/c3.css';
    import Cards from '$lib/components/landing/Cards.svelte';
    import { writable, type Writable } from 'svelte/store';

    export let data;
    let { campaign } = data;
    let interactions: Writable<Interaction[]> = writable([]);
    let isLoading = true;
    let error: string | null = null;
    let loadedCount = 0;
    let totalCount = 0;
    let funnelLoading = false;
    let insightsLoading = false;
    let summaries = [
        { title: 'Campaign Manager Summary', content: campaign.campaign_manager_summary },
        { title: 'Communications Summary', content: campaign.communications_director_summary },
        { title: 'Field Summary', content: campaign.field_director_summary }
    ];

    async function fetchInteraction(interactionId: number): Promise<Interaction> {
        const response = await fetch(`/api/interaction?interaction_id=${interactionId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.interaction;
    }

    async function refreshEvaluations() {
        for (const interaction of responded_interactions) {
            interaction.loading = true;
        }
        responded_interactions = [...responded_interactions];
        await tick();

        for (const interaction of responded_interactions) {
            try {
                await Promise.race([
                    refreshSingleEvaluation(campaign.id, interaction.id),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 300000)) // 5 minutes timeout
                ]);
                await updateInteraction(interaction);
            } catch (error) {
                console.error(`Error refreshing evaluation for interaction ${interaction.id}:`, error);
                interaction.loading = false;
            }
        }
        responded_interactions = [...responded_interactions];
    }

    async function singleRefreshRequest(event: MouseEvent) {
        const interaction_id = (event.currentTarget as HTMLElement).dataset.interactionId;

        if (!interaction_id) {
            console.log('No interaction ID found');
            return;
        }

        const interaction = responded_interactions.find(interaction => interaction.id == interaction_id);
        if (!interaction) {
            console.log('Interaction not found');
            return;
        }

        interaction.loading = true;
        responded_interactions = [...responded_interactions];
        await tick();

        try {
            await Promise.race([
                refreshSingleEvaluation(campaign.id, interaction_id),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 300000)) // 5 minutes timeout
            ]);
            await updateInteraction(interaction);
        } catch (error) {
            console.error(`Error refreshing evaluation for interaction ${interaction_id}:`, error);
            interaction.loading = false;
        }
        responded_interactions = [...responded_interactions];
    }

    async function refreshFunnel() {
        funnelLoading = true;
        try {
            const res = await Promise.race([
                fetch(`/api/campaign/insights`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        campaign_id: campaign.id,
                        refresh_funnel: true 
                    })
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 300000)) // 5 minutes timeout
            ]);
            const data = await res.json();
            console.log(data);
            await updateCampaign();
            renderChart();
        } catch (error) {
            console.error('Error refreshing funnel:', error);
        } finally {
            funnelLoading = false;
        }
    }

    async function refreshInsights() {
        insightsLoading = true;
        try {
            const res = await Promise.race([
                fetch(`/api/campaign/insights`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        campaign_id: campaign.id,
                        refresh_campaign_insights: true 
                    })
                }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 300000)) // 5 minutes timeout
            ]);
            const data = await res.json();
            console.log(data);
            await updateCampaign();
        } catch (error) {
            console.error('Error refreshing insights:', error);
        } finally {
            insightsLoading = false;
        }
    }

    async function updateInteraction(interaction: Interaction) {
        const response = await fetch(`/api/interaction?interaction_id=${interaction.id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const interaction_response = await response.json();
        Object.assign(interaction, interaction_response.interaction);
        interaction.loading = false;
        responded_interactions = [...responded_interactions];
    }

    async function updateCampaign() {
        const response = await fetch(`/api/campaign?campaign_id=${campaign.id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const campaign_response = await response.json();
        Object.assign(campaign, campaign_response.campaign);
        campaign = campaign;
    }

    async function renderChart() {
        const object = await import('c3');
        const c3 = object.default;
        const categories = ['Sent', 'Delivered', 'Responded', 'Converted'];

        var chart = c3.generate({
            bindto: '#funnelChart',
            data: {
                columns: [
                    ['Campaign', campaign.interactions_sent, campaign.interactions_delivered, campaign.interactions_responded, campaign.interactions_converted]
                ],
                colors: {
                    Campaign: '#FFFFFF'
                },
                type: 'bar'
            },
            bar: {
                width: {
                    ratio: 0.5
                }
            },
            axis: {
                x: {
                    type: 'category',
                    categories: ['Sent', 'Delivered', 'Responded', 'Converted']
                }
            },
            tooltip: {
                format: {
                    title: function (d) { return categories[d]; },
                    name: function (name, ratio, id, index) { return ""; },
                    value: function (value, ratio, id, index) {
                        return value;
                    }
                }
            }
        });
        console.log(chart);
    }

    onMount(async () => {
        console.log(campaign);

        try {
            // Get interaction IDs from /api/interaction?campaign_id=${campaign.id}
            const interaction_status_threshold = 6;
            const res = await fetch(`/api/interaction?campaign_id=${campaign.id}&min_interaction_status=${interaction_status_threshold}`);
            const data = await res.json();
            console.log(data);
            const interactionIds = data.interaction_ids;
            totalCount = interactionIds.length;

            // Initialize interactions with placeholders
            interactions.set(interactionIds.map(id => ({ id, loading: true })));

            // Fetch interactions asynchronously
            interactionIds.forEach(async (id, index) => {
                try {
                    const interaction = await fetchInteraction(id);
                    if (interaction.interaction_status >= 6) {
                        interactions.update(items => {
                            const newItems = [...items];
                            newItems[index] = interaction;
                            return newItems;
                        });
                    }
                } catch (err) {
                    console.error(`Error fetching interaction ${id}:`, err);
                } finally {
                    loadedCount++;
                    if (loadedCount === totalCount) {
                        // Sort interactions by campaign_relevance_score
                        interactions.update(items => items.sort((a, b) => b.campaign_relevance_score - a.campaign_relevance_score));
                        isLoading = false;
                    }
                }
            });

        } catch (err) {
            console.error("Error loading interactions:", err);
            error = "Failed to load interactions. Please try refreshing the page.";
            isLoading = false;
        }

        console.log(summaries);
        renderChart();
    });

    // ... existing code ...
</script>

<div class="px-20">
    <AuthCheck>
        
        <!-- Three buttons for "Refresh Evaluations", "Refresh Funnel", "Refresh Insights"-->
        
        <div class="w-full">
        <h1>Goal</h1>
        {#if funnelLoading}
            <span class="loading loading-spinner loading-lg h-max"></span>
        {:else}
            <div class="">
                <div class="text-5xl">{campaign.campaign_goal}</div>
            </div>
            <div class="flex justify-between h-max pt-5">
                <div class="w-1/3 flex flex-col justify-center items-center">
                    <div class="flex flex-col justify-between h-full">
                        <div class="h-1/2">
                            <h2 class="text-8xl">{campaign.interactions_sent}</h2>
                            <p>Messages Sent</p>
                        </div>
                        <div class=" h-1/2">
                            <h2 class="text-8xl">{campaign.interactions_converted}</h2>
                            <p>Converted</p>
                        </div>
                    </div>
                </div>
                <div id="funnelChart" class="w-2/3 h-full"></div>
            </div>
        {/if}
        <btn class="btn btn-primary" on:click={refreshFunnel}>Refresh Funnel</btn>
        </div>

        <div class="pt-10">
            {#if insightsLoading}
                <span class="loading loading-spinner loading-lg h-max"></span>
            {:else} 
                <!-- Check if campaign.policy_insights is a string. If so, do not show it -->
                {#if campaign.policy_insights && typeof campaign.policy_insights === 'object' && !(campaign.policy_insights instanceof String)}
                    
                <div class="pt-5"><Cards title="Policy Insights" cards={Object.entries(campaign.policy_insights).map(([policy_area, insight]) => ({ title: policy_area, content: insight }))}/></div>
                {/if}
            {/if}
            <button class="btn btn-primary mt-4" on:click={refreshInsights}>Refresh Insights</button>
        </div>
        

        
        <div class="pt-10">
            <table class="min-w-full bg-base-100 text-base table table-zebra">
                <thead>
                    <tr>
                        <th class="px-4 py-2">Voter</th>
                        <th class="px-4 py-2">Summary</th>
                        <th class="px-4 py-2">Policy Insights</th>
                        <th class="px-4 py-2">Voter Insights</th>
                        <th class="px-4 py-2">Conversation</th>
                    </tr>
                </thead>
                <tbody>
                    {#each $interactions as interaction}
                        <tr>
                            {#if interaction.loading}
                                <span class="loading loading-spinner loading-md h-28"></span>
                            {:else}
                                <td class="px-4 py-2"><div class="h-28 overflow-y-auto">{interaction.voter.voter_name} ({interaction.voter.voter_phone_number})</div></td>
                                <td class="px-4 py-2"><div class="h-28 overflow-y-auto">{interaction.campaign_relevance_summary}</div></td>
                                <td class="px-4 py-2">
                                    <div class="h-28 overflow-y-auto">
                                        {#if interaction.insights_about_issues && typeof interaction.insights_about_issues === 'object' && !(interaction.insights_about_issues instanceof String)}
                                            {#each Object.entries(interaction.insights_about_issues) as [policy_area, insight]}
                                                <p><span class="font-semibold">{policy_area}</span>: {insight}</p>
                                            {/each}
                                        {:else}
                                            No Policy Insights
                                        {/if}
                                    </div>
                                </td>
                                <td class="px-4 py-2"><div class="h-28 overflow-y-auto">{interaction.insights_about_voter}</div></td>
                                <td class="px-4 py-2 btn btn-primary m-2"><a href="/interaction/{interaction.id}">View Conversation</a></td> 
                                <!-- Add a data attribute to store the interaction ID -->
                                <td class=" btn btn-primary mt-2 mx-2" data-interaction-id={interaction.id} on:click={singleRefreshRequest}>Refresh Evaluation</td>
                            {/if}
                        </tr>
                    {/each}
                    {#if isLoading || loadedCount < totalCount}
                        <tr>
                            <td colspan="6" class="px-4 py-2">
                                <div class="flex items-center justify-center">
                                    <span class="loading loading-spinner loading-md mr-2"></span>
                                    Loading interactions... ({loadedCount} / {totalCount})
                                </div>
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
            <button class="btn btn-primary my-5" on:click={refreshEvaluations}>Refresh Evaluations</button>
        </div>


    </AuthCheck>
</div>

<style>
    :global(.c3-tooltip-container .c3-tooltip-name--Campaign-Funnel),
    :global(.c3-tooltip-container .name),
    :global(.c3-tooltip-container .value) {
        color: #000000 !important;
    }
</style>