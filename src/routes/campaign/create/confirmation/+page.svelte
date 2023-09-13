<script lang="ts">
	import type { Sender, Campaign } from '$lib/model';
	import { campaignStore } from '$lib/stores/campaignStore';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
    import InteractionConfirmationTable from '$lib/components/InteractionConfirmationTable.svelte';
    
    let sender: Sender = {} as Sender;
    let localCampaign: Campaign = { id: "" } as Campaign;

    onMount(async () => {
        campaignStore.subscribe((campaign) => {
            localCampaign = campaign;
        });

        if(!localCampaign?.id) {
            console.error("No campaign id");
            goto("/campaign/create");
        }
    });

    async function goToCampaign() {
        let new_campaign_id = localCampaign?.id;
        campaignStore.set({ id: new_campaign_id } as Campaign);
        goto(`/campaign/${new_campaign_id}`);
    }
</script>

<!-- Path: src/routes/campaign/audience/+page.svelte -->
<h1>Confirm Creation</h1>
<div on:click={goToCampaign} class="btn">Go to campaign page</div>

{#if localCampaign.id}
    <InteractionConfirmationTable campaign_id={localCampaign.id} />
{/if}