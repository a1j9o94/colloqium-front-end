<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    
    export let data: PageData;
    $: ( { campaigns } = data );

    onMount(() => {
        console.log(campaigns);
    });

</script>

<!-- Path: src/routes/campaign/+layout.svelte -->

<div class="px-20">
<AuthCheck>
    <h1>Campaigns Page</h1>

    <!--For each campaign in campaigns list the campaign name and have a link to go to campaign page at /campaign/id-->
    {#each campaigns as campaign}
        <div class="mt-3">
            <div class="card bg-base-100 ">
                <div class="card-body">
                    <h2>{campaign.campaign_name}</h2>
                    <a href="/campaign/{campaign.id}"><btn class="btn">View Campaign</btn></a>
                </div>
            </div>
        </div>
    {/each}

    <btn class="btn btn-primary my-3"><a href="/campaign/create">Create Campaign</a></btn>
</AuthCheck>
</div>