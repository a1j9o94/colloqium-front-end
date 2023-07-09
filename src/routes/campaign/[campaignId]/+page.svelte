<script lang="ts">
    import type { PageData } from './$types';
    import { onMount } from 'svelte';
    
    export let data: PageData;
    const { campaign } = data;

    onMount(async () => {
        console.log('campaign: ', campaign);
    })
</script>

<div class="w-2/3 grid grid-cols-1 place-self-center">
    <h1 class="text-4xl font-bold mb-4 flex justify-center items-center pt-5">{campaign.campaign_name}</h1>
    <p>{campaign.campaign_information}</p>
    
    {#each campaign.audiences as audience, index}
        <div class="collapse bg-base-200 mt-4">
            <input type="checkbox" id={"audience" + index} />
            <label for={"audience" + index} class="collapse-title text-xl font-medium">
                {audience.audience_name}
            </label>
            <div class="collapse-content">
                <p>{audience.audience_information}</p>
                
                {#each audience.recipients as recipient, rindex}
                    <div class="collapse bg-base-300 mt-2">
                        <input type="checkbox" id={"recipient" + index + "-" + rindex} />
                        <label for={"recipient" + index + "-" + rindex} class="collapse-title text-lg font-medium">
                            {recipient.recipient_name}
                        </label>
                        <div class="collapse-content">
                            <p>{recipient.recipient_information}</p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>  
    {/each}
</div>