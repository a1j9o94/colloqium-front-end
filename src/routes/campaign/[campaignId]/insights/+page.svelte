<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
	import type { Interaction } from '$lib/model.js';
    import { API_URL } from '$lib/utility';
	import { onMount } from 'svelte';
    
    export let data;
    const { campaign } = data;
    let interactions: Interaction[];
    let evaluated_interactions: Interaction[] = [];

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

        // Filter for interactions where campaign_relevance_score is not null
        evaluated_interactions = interactions.filter(interaction => interaction.campaign_relevance_score != null);
    });
</script>

<AuthCheck>
    <!-- Three buttons for "Refresh Evaluations", "Refresh Funnel", "Refresh Insights"-->
    
    <div>
    <h1>Funnel</h1>
    <p>Sent: {campaign.interactions_sent}</p>
    <p>Delivered: {campaign.interactions_delivered}</p>
    <p>Responded: {campaign.interactions_responded}</p>
    <p>Converted: {campaign.interactions_converted}</p>
    <btn class="btn btn-primary" on:click={refreshFunnel()}>Refresh Funnel</btn>
    </div>

    <div>
        <h1>Campaign Summaries</h1>
        <h2>Campaign Manager Summarry</h2>
        <p>{campaign.campaign_manager_summary}</p>
        <h2>Communications Summary</h2>
        <p>{campaign.communications_director_summary}</p>
        <h2>Field Summary</h2>
        <p>{campaign.field_director_summary}</p>
        <!-- Check if campaign.policy_insights is a string. If so, do not show it-->
        {#if campaign.policy_insights && typeof campaign.policy_insights === 'object' && !(campaign.policy_insights instanceof String)}
            <h2>Policy Insights</h2>

            {#each Object.entries(campaign.policy_insights) as [policy_area, insight] }
                <p>{policy_area}: {insight}</p>
            {/each}
        {/if}
        <btn class="btn btn-primary" on:click={refreshInsights}>Refresh Insights</btn>
    </div>

    
    <btn class="btn btn-primary" on:click={refreshEvaluations}>Refresh Evaluations</btn>
    {#each evaluated_interactions as interaction}
        <div class="card bg-base-100">
            <div class="card-body">
                <h2>Campaign Relevance Score: {interaction.campaign_relevance_score}</h2>
                <p>{interaction.campaign_relevance_summary}</p>
                {#if interaction.insights_about_issues && typeof interaction.insights_about_issues === 'object' && !(interaction.insights_about_issues instanceof String)}
                    <h2>Policy Insights</h2>

                    {#each Object.entries(interaction.insights_about_issues) as [policy_area, insight] }
                        <p>{policy_area}: {insight}</p>
                    {/each}
                {:else}
                    <h2>No Policy Insights</h2>
                {/if}
                <p>{interaction.insights_about_voter}</p>
                <a href="/interaction/{interaction.id}" >View Interaction</a>
            </div>
        </div>
    {/each}

</AuthCheck>