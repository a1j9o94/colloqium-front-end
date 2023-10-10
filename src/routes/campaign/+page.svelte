<script lang="ts">
    import AuthCheck from '$lib/components/AuthCheck.svelte';
    import { onMount } from 'svelte';
    import CampaignCard from '$lib/components/campaign/CampaignCard.svelte';
	import { goto } from '$app/navigation';
    import { campaignStore } from "$lib/stores/campaignStore.js";
    import type { Campaign, Sender } from "$lib/model";
    import { userData, user } from "$lib/firebase";
    import { API_URL } from "$lib/utility";

    
    let campaigns: Campaign[] = [];
    let isLoading = true;
    
    onMount(async () => {
        await user;
        await userData;

        if(!$user){
            await goto("/login");
            return;
        } 
        if(!$userData || $userData === undefined){
            console.log("no user data");
            await goto("/login");
            return;
        } 

        console.log($userData);

        for (const sender of $userData.associated_senders) {
            get_campaign(sender).then((data) => {
                campaigns = [...campaigns, ...data];
            });
        }

        isLoading = false;
    });

    async function get_campaign(sender_id: string): Promise<Campaign[]> {
        const response = await fetch(`${API_URL}/campaign?sender_id=${sender_id}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        return jsonResponse.campaigns;
    }

    function create_campaign(): void {
        //empty the campaign store
        campaignStore.set({} as Campaign);
        goto("/campaign/create");
    }

</script>

<!-- Path: src/routes/campaign/+layout.svelte -->


{#if isLoading}
    <div class="flex items-center justify-center h-screen">
        <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
    </div>
{:else}

<AuthCheck>

    <main class="grow">
        <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            <!-- Page header -->
            <div class="sm:flex sm:justify-between sm:items-center mb-8">

                <!-- Left: Title -->
                <div class="mb-4 sm:mb-0">
                    <h1 class="text-2xl md:text-3xl text-slate-800 dark:text-slate-100 font-bold">Campaigns</h1>
                </div>

                <!-- Right: Actions -->
                <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                    <!-- Create campaign button -->
                    <button class="btn bg-indigo-500 hover:bg-indigo-600 text-white" on:click={create_campaign}>
                        <svg class="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
                            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
                        </svg>
                        <span class="xs:block ml-2">Create Campaign</span>
                    </button>

                </div>

            </div>

            <!-- Cards -->
            <div class="grid grid-cols-12 gap-6">
                {#each campaigns as campaign}
                    <CampaignCard campaign={campaign} />
                {/each}

            </div>
        </div>
    </main>
</AuthCheck>

{/if}