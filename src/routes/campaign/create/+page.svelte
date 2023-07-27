<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from '$app/navigation';
    import type { Campaign, Sender } from "$lib/model";
    import { campaignStore } from "$lib/store";
    import { API_URL, formatDate } from "$lib/utility";
  
    export let data;
    
    const { senders } = data;
  
    let campaign_name = "";
    let campaign_prompt = "";
    let campaign_goal = "";
    let campaign_fallback = "";
    let example_interactions = "";
    let sender_id: string | null = null;
    let campaign_end_date: Date = new Date();
  
    async function handleSubmit() {
      if (!sender_id) {
          console.error('No sender selected');
          return;
      }

      let sender: Sender = senders.find(sender => sender.id === sender_id) ? senders.find(sender => sender.id === sender_id) : {} as Sender;
      
      const campaign: Campaign = {
        campaign_name,
        campaign_prompt,
        campaign_goal,
        campaign_fallback,
        example_interactions,
        sender,
        campaign_end_date,
      };
  
        const campaignApiObject = {
            campaign_name: campaign.campaign_name,
            campaign_prompt: campaign.campaign_prompt,
            campaign_goal: campaign.campaign_goal,
            campaign_fallback: campaign.campaign_fallback,
            example_interactions: campaign.example_interactions,
            sender_id: campaign.sender?.id,
            campaign_end_date: campaign.campaign_end_date,
        };

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
  
      campaignStore.set(data);
      goto('/campaign/create/audience');
    }
  
    onMount(() => {
      sender_id = senders[0]?.id;
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