<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
import type { PageData } from './$types';
    
    export let data: PageData;
    const { campaigns } = data;
</script>

<!-- Path: src/routes/campaign/+layout.svelte -->

<AuthCheck>
    <h1>Campaigns Page</h1>

    <!--For each campaign in campaigns list the campaign name and have a link to go to campaign page at /campaign/id-->
    {#each campaigns as campaign}
        <div class="card bg-base-100">
            <div class="card-body">
                <h2>{campaign.campaign_name}</h2>
                <p>{campaign.campaign_prompt}</p>
                <a href="/campaign/{campaign.id}"><btn class="btn">View Campaign</btn></a>
            </div>
        </div>
    {/each}

    <btn class="btn btn-primary"><a href="/campaign/create">Create Campaign</a></btn>
</AuthCheck>