<script lang="ts">
    import type { Campaign, Interaction } from '$lib/model';
    import { onMount } from 'svelte';
    import { writable, type Writable } from 'svelte/store';
    import InteractionToConfirm from './InteractionToConfirm.svelte';

    export let campaign_id: string = "";

    let interactions: Writable<Interaction[]> = writable([]);
    let isLoading = true;
    let error: string | null = null;
    let loadedCount = 0;
    let totalCount = 0;

    async function fetchInteraction(interactionId: number): Promise<Interaction> {
        const response = await fetch(`/api/interaction?interaction_id=${interactionId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.interaction;
    }

    onMount(async () => {
        try {
            console.log("Campaign id: ", campaign_id);

            // Fetch interaction IDs
            const res = await fetch(`/api/interaction?campaign_id=${campaign_id}`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            const interactionIds = data.interaction_ids;
            totalCount = interactionIds.length;

            // Fetch each interaction
            for (const id of interactionIds) {
                try {
                    const interaction = await fetchInteraction(id);
                    if (interaction.interaction_status < 4 && interaction.conversation.length > 0) {
                        interactions.update(items => [interaction, ...items]);
                    }
                    loadedCount++;
                } catch (err) {
                    console.error(`Error fetching interaction ${id}:`, err);
                    loadedCount++;
                }
            }
        } catch (err) {
            console.error("Error loading interactions:", err);
            error = "Failed to load interactions. Please try refreshing the page.";
        } finally {
            isLoading = false;
        }
    });

    async function sendAllInteractions() {
        for (let i = 0; i < $interactions.length; i++) {
            await sendInteraction(i);
        }
    }

    async function sendInteraction(interactionIndex: number) {
        const interaction = $interactions[interactionIndex];
        let interactionId = interaction.id;
        let interactionMethod = interaction.interaction_type == "text_message" ? "send_text" : interaction.interaction_type == "robo_call" ? "make_robo_call" : "send_email"; 
        let url = `/api/${interactionMethod}`;

        try {
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ interaction_status: 3, interaction_id: interactionId})
            });

            if (response.status != 200) {
                throw new Error('Response not OK');
            }

            interaction.sent = true;
        } catch (error) {
            console.error("Error: ", error);
            interaction.error = true;
        }

        $interactions[interactionIndex] = interaction;
        interactions.set([...$interactions]);
    }
</script>

{#if error}
    <p class="text-red-500">{error}</p>
{:else}
    <button class="btn dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300" on:click={sendAllInteractions}>
        <svg class="w-4 h-4 fill-current text-slate-500 dark:text-slate-400 shrink-0" viewBox="0 0 16 16">
            <path d="M18.3 11.3l-1.4 1.4 4.3 4.3H11v2h10.2l-4.3 4.3 1.4 1.4L25 18z"></path>
        </svg>
        <span class="ml-2">Send All</span>
    </button>

    <div class="bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <header class="px-5 py-4">
            <h2 class="font-semibold text-slate-800 dark:text-slate-100">Interactions to Confirm</h2>
        </header>
        <div class="overflow-x-auto">
            <table class="table-auto w-full dark:text-slate-300 text-slate-800">
                <thead class="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/20 border-t border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <th class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap font-semibold text-left">Voter</th>
                        <th class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px font-semibold text-left" scope="col">Interaction Message</th>
                        <th class="px-2 first:pl-5 last:pr-5 py-3 whitespace-nowrap w-px font-semibold text-left" scope="col">Action</th>
                    </tr>
                </thead>
                <tbody class="text-sm divide-y divide-slate-200 dark:divide-slate-700">
                    {#each $interactions as interaction, interactionIndex (interaction.id)}
                        <InteractionToConfirm {interaction} {interactionIndex} {sendInteraction} />
                    {/each}
                    {#if isLoading || loadedCount < totalCount}
                        <tr>
                            <td colspan="3" class="px-2 first:pl-5 last:pr-5 py-3">
                                <div class="flex items-center justify-center">
                                    <span class="loading loading-spinner loading-md mr-2"></span>
                                    Loading interactions... ({loadedCount} / {totalCount})
                                </div>
                            </td>
                        </tr>
                    {/if}
                </tbody>
            </table>
        </div>
    </div>
{/if}