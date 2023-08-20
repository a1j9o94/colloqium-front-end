<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from '$app/navigation';
    import type { Campaign, Sender } from "$lib/model";
    import { campaignStore } from "$lib/stores/campaignStore.js";
    import { API_URL } from "$lib/utility";
  
    export let data;
    
    const { senders } = data;
  
    let campaign_name = "";
    let campaign_prompt = "";
    let campaign_goal = "";
    let campaign_fallback = "";
    let example_interactions = "";
    let sender_id: string | null = null;
    let campaign_end_date: Date = new Date();
    let localCampaign: Campaign | null;
    let existingCampaign = false;

    campaignStore.subscribe((campaign) => {
        campaign = campaign;
    });
  
    async function handleSubmit() {
        if (!sender_id) {
              console.error('No sender selected');
              return;
        }

        let sender: Sender | undefined = senders.find(sender => sender.id === sender_id) ? senders.find(sender => sender.id === sender_id) : {} as Sender;
      
        if(!sender) {
            console.error('No sender selected');
            return;
        }
        if (!localCampaign) {
            return;
        }
        
        localCampaign.campaign_name = campaign_name;
        localCampaign.campaign_prompt = campaign_prompt;
        localCampaign.campaign_goal = campaign_goal;
        localCampaign.campaign_fallback = campaign_fallback;
        localCampaign.example_interactions = example_interactions;
        localCampaign.sender = sender;
        localCampaign.campaign_end_date = campaign_end_date;
  
        const campaignApiObject = {
            campaign_name: localCampaign.campaign_name,
            campaign_prompt: localCampaign.campaign_prompt,
            campaign_goal: localCampaign.campaign_goal,
            campaign_fallback: localCampaign.campaign_fallback,
            example_interactions: localCampaign.example_interactions,
            campaign_end_date: localCampaign.campaign_end_date,
        };

        if (!existingCampaign) {
            campaignApiObject['sender_id'] = sender.id;
            const res = await fetch(`${API_URL}/campaign`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(campaignApiObject)
            });
    
            const data = await res.json();
    
            if (!res.ok) {
                console.error(data);
                return;
            }

            campaignStore.set(data.campaign);
        } else {

            campaignApiObject['campaign_id'] = localCampaign.id;
            const res = await fetch(`${API_URL}/campaign?campaign_id=${localCampaign.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(campaignApiObject)
            });
    
            const data = await res.json();
    
            if (!res.ok) {
                console.error(data);
                return;
            }
            campaignStore.set(localCampaign);
        }
      goto('/campaign/create/audience');
    }
  
    onMount(() => {
        //Load the campaign from the store, and if it has an ID, use it to prepopulate the form
        campaignStore.subscribe((campaign) => {
            localCampaign = campaign;
        });
        if (localCampaign?.id) {
            campaign_name = localCampaign.campaign_name;
            campaign_prompt = localCampaign.campaign_prompt;
            campaign_goal = localCampaign.campaign_goal;
            campaign_fallback = localCampaign.campaign_fallback;
            example_interactions = localCampaign.example_interactions;
            sender_id = localCampaign.sender?.id;
            campaign_end_date = new Date(localCampaign.campaign_end_date);
            existingCampaign = true;
        }
    });
  </script>
  
  <div class="flex flex-col justify-center items-center h-screen">
    <form class="w-full max-w-lg" on:submit|preventDefault={handleSubmit}>
        <div class="flex flex-wrap -mx-3 mb-6">
            <div class="w-full px-3">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="campaign_name">Campaign Name:</label>
                <input id="campaign_name" type="text" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" bind:value={campaign_name} required>
            </div>
            <div class="w-full px-3">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="campaign_prompt">Campaign Prompt:</label>
                <textarea id="campaign_prompt" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" bind:value={campaign_prompt} required></textarea>
            </div>
            <div class="w-full px-3">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="sender_id">Sender:</label>
                <select id="sender_id" class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" bind:value={sender_id} required>
                    {#each senders as sender (sender.id)}
                        <option value={sender.id}>{sender.sender_name}</option>
                    {/each}
                </select>
            </div>
            <div class="w-full px-3">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="campaign_goal">Campaign Goal:</label>
                <input id="campaign_goal" type="text" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" bind:value={campaign_goal} required>
            </div>
            <div class="w-full px-3">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="campaign_fallback">Campaign Fallback:</label>
                <input id="campaign_fallback" type="text" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" bind:value={campaign_fallback} required>
            </div>
            <div class="w-full px-3">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="example_interactions">Example Interactions:</label>
                <input id="example_interactions" type="text" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" bind:value={example_interactions} required>
            </div>
            <div class="w-full px-3">
                <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="campaign_end_date">Campaign End Date:</label>
                <input id="campaign_end_date" type="date" class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" bind:value={campaign_end_date} required>
            </div>
            <div class="w-full px-3">
                <button type="submit" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create Campaign</button>
            </div>
        </div>
    </form>
</div>