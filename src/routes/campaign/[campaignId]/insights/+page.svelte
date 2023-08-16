<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
	import type { Interaction } from '$lib/model.js';
    import { API_URL } from '$lib/utility';
	import { onMount } from 'svelte';
    import 'c3/c3.css';
    
    export let data;
    const { campaign } = data;
    let interactions: Interaction[];
    let evaluated_interactions: Interaction[] = [];
    let summaries = [
        { title: 'Campaign Manager Summary', content: campaign.campaign_manager_summary },
        { title: 'Communications Summary', content: campaign.communications_director_summary },
        { title: 'Field Summary', content: campaign.field_director_summary }
    ];
    let carousel;
    import { browser } from '$app/environment';

    async function refreshEvaluations() {
        const res = await fetch(`${API_URL}/campaign/insights`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                campaign_id: campaign.id,
                refresh_interaction_evaluations: true })
        });
        const data = await res.json();
        console.log(data);
    }

    async function refreshFunnel() {
        const res = await fetch(`${API_URL}/campaign/insights`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                campaign_id: campaign.id,
                refresh_funnel: true })
        });
        const data = await res.json();
        console.log(data);
    }

    async function refreshInsights() {
        const res = await fetch(`${API_URL}/campaign/insights`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                campaign_id: campaign.id,
                refresh_campaign_insights: true })
        });
        const data = await res.json();
        console.log(data);
    }

    onMount(async () => {
        console.log(campaign);

        // Get interactions from ${API_URL}/interaction?campaign_id=${campaign.id}
        const res = await fetch(`${API_URL}/interaction?campaign_id=${campaign.id}`);
        const data = await res.json();
        console.log(data);
        interactions = data.interactions;

        console.log(summaries)

        // Filter for interactions where campaign_relevance_score is not null
        evaluated_interactions = interactions.filter(interaction => interaction.campaign_relevance_score != null);
        evaluated_interactions.sort((a, b) => b.campaign_relevance_score - a.campaign_relevance_score);


        const object = await import('c3');
        const c3 = object.default;

        var chart = c3.generate({
            bindto: '#funnelChart', // make sure to bind to an element with this ID
            data: {
                columns: [
                    ['Sent', campaign.interactions_sent],
                    ['Delivered', campaign.interactions_delivered],
                    ['Responded', campaign.interactions_responded],
                    ['Converted', campaign.interactions_converted]
                ],
                type: 'bar'
            },
            bar: {
                width: {
                    ratio: 0.5
                }
            }
        });
    });
</script>

<AuthCheck>
    <!-- Three buttons for "Refresh Evaluations", "Refresh Funnel", "Refresh Insights"-->
    
    <div id="funnelChart-container">
    <h1>Funnel</h1>
    <div id="funnelChart"></div>
    <btn class="btn btn-primary" on:click={refreshFunnel()}>Refresh Funnel</btn>
    </div>

    <div class="p-20">
            <h1 class="text-lg font-bold mb-2">Campaign Summaries</h1>
                {#each summaries as summary}
                <div class="mb-4">
                    <h2 class="text-md font-semibold">{summary.title}</h2>
                    <p class="text-sm">{summary.content}</p>
                </div>
                {/each}
    
        <!-- Check if campaign.policy_insights is a string. If so, do not show it -->
        {#if campaign.policy_insights && typeof campaign.policy_insights === 'object' && !(campaign.policy_insights instanceof String)}
        <div class="mt-6">
            <h2 class="text-lg font-bold mb-2">Policy Insights</h2>
            {#each Object.entries(campaign.policy_insights) as [policy_area, insight]}
            <p class="text-md"><span class="font-semibold">{policy_area}:</span> {insight}</p>
            {/each}
        </div>
        {/if}
    
        <button class="btn btn-primary mt-4" on:click={refreshInsights}>Refresh Insights</button>
    </div>
    

    
    <button class="btn btn-primary mb-4" on:click={refreshEvaluations}>Refresh Evaluations</button>
    <table class="min-w-full bg-base-100 text-base">
        <thead>
            <tr>
                <th class="px-4 py-2">Campaign Relevance Score</th>
                <th class="px-4 py-2">Relevance Summary</th>
                <th class="px-4 py-2">Policy Insights</th>
                <th class="px-4 py-2">Voter Insights</th>
                <th class="px-4 py-2">Action</th>
            </tr>
        </thead>
        <tbody>
            {#each evaluated_interactions as interaction}
            <tr>
                <td class="px-4 py-2">{interaction.campaign_relevance_score}</td>
                <td class="px-4 py-2">{interaction.campaign_relevance_summary}</td>
                <td class="px-4 py-2">
                    {#if interaction.insights_about_issues && typeof interaction.insights_about_issues === 'object' && !(interaction.insights_about_issues instanceof String)}
                        {#each Object.entries(interaction.insights_about_issues) as [policy_area, insight]}
                            <p>{policy_area}: {insight}</p>
                        {/each}
                    {:else}
                        No Policy Insights
                    {/if}
                </td>
                <td class="px-4 py-2">{interaction.insights_about_voter}</td>
                <td class="px-4 py-2"><a href="/interaction/{interaction.id}">View Interaction</a></td>
            </tr>
            {/each}
        </tbody>
    </table>


</AuthCheck>

<style>
    #funnelChart-container {
        width: 100%; /* Ensure the parent container takes the full available width */
    }

    #funnelChart {
        width: 66.67%; /* 2/3rds of the parent container's width */
        margin: 0 auto; /* Centering the chart within its parent container */
    }


</style>