<script lang="ts">
    import type { Campaign } from "$lib/model";
    import { onMount } from "svelte";

    export let campaignId: number;
    let campaign: Campaign | null = null;
    let isLoading = true;
    let error: string | null = null;

    onMount(async () => {
        try {
            const response = await fetch(`/api/campaign?campaign_id=${campaignId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            campaign = data.campaign;
        } catch (err) {
            console.error(`Error fetching campaign ${campaignId}:`, err);
            error = `Failed to load campaign ${campaignId}`;
        } finally {
            isLoading = false;
        }
    });
</script>

{#if isLoading}
    <div class="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-5">
        <div class="animate-pulse flex space-x-4">
            <div class="flex-1 space-y-6 py-1">
                <div class="h-2 bg-slate-200 rounded"></div>
                <div class="space-y-3">
                    <div class="grid grid-cols-3 gap-4">
                        <div class="h-2 bg-slate-200 rounded col-span-2"></div>
                        <div class="h-2 bg-slate-200 rounded col-span-1"></div>
                    </div>
                    <div class="h-2 bg-slate-200 rounded"></div>
                </div>
            </div>
        </div>
    </div>
{:else if error}
    <div class="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700 p-5">
        <p class="text-red-500">{error}</p>
    </div>
{:else if campaign}
    <div class="col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <div class="flex flex-col h-full p-5">
            <header>
                <div class="flex items-center justify-between">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-500">
                        <svg class="w-9 h-9 fill-current text-indigo-50" viewBox="0 0 36 36">
                            <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
                        </svg>
                    </div>
                </div>
            </header>
            <div class="grow mt-2">
                <a class="inline-flex text-slate-800 dark:text-slate-100 hover:text-slate-900 dark:hover:text-white mb-1" href="/campaign/{campaign.id}">
                    <h2 class="text-xl leading-snug font-semibold">{campaign.campaign_name}</h2>
                </a>
                <div class="text-sm text-slate-800 dark:text-slate-100">{campaign.campaign_goal}</div>
            </div>
            <footer class="mt-5">
                <div class="text-sm font-medium text-slate-500 mb-2">{new Date(campaign.campaign_end_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                })}</div>
                <div class="flex justify-between items-center">
                    <div>
                        <a class="text-sm font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400" href="/campaign/{campaign.id}">View -&gt;</a>
                    </div>
                </div>
            </footer>
        </div>
    </div>
{/if}