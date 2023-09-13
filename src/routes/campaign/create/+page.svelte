<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from '$app/navigation';
    import type { Campaign, Sender } from "$lib/model";
    import { campaignStore } from "$lib/stores/campaignStore.js";
    import { senderStore } from "$lib/stores/senderStore.js";
    import { API_URL } from "$lib/utility";
    import { getCampaignOptions, CampaignOption} from "$lib/campaignOptions";
    
    let campaign_name = "";
    let campaign_prompt = "";
    let campaign_goal = "";
    let campaign_fallback = "";
    let example_interactions = "";
    let localSender: Sender | null = null;
    let campaign_end_date: Date = new Date();
    let localCampaign: Campaign | null;
    let existingCampaign = false;
    let campaign_options: CampaignOption[] | [] = [];
    let option_label: string | null = null;
    let campaign_option: CampaignOption | null = null;
    let fields: [string, string][] | [] = [];
    let fieldValues: { [key: string]: string } = {};

    $: { 
        const selected_option = campaign_options.find(option => option.label === option_label)
        console.log(selected_option);
        campaign_option = selected_option ? selected_option : null;
        if (campaign_option) {
            fields = campaign_option.fields;
        }
    }

    campaignStore.subscribe((campaign) => {
        campaign = campaign;
    });

    senderStore.subscribe((sender) => {
        localSender = sender;
    });
  
    async function handleSubmit() {

        console.log(fieldValues)

        if (!localSender) {
            console.error('No sender selected');
            return;
        }

        if (!localSender.id) {
            console.error('No sender id');
            return;
        }

        //populate the local Sender object with the sender object form the api
        const response = await fetch(`${API_URL}/sender?sender_id=${localSender.id}`);
        const data = await response.json();
        localSender = data.sender;

        if (!localSender) {
            console.error('No sender found');
            return;
        }


        console.log(localSender);

        if(!localSender) {
            console.error('No sender selected');
            return;
        }
        if (!localCampaign) {
            return;
        }

        if(!campaign_option) {
            console.error('No campaign option selected');
            return;
        }

        campaign_option.prepareCampaign(localSender, fieldValues);
        
        localCampaign.campaign_name = campaign_option.getCampaignName();
        localCampaign.campaign_prompt = campaign_option.getCampaignPrompt();
        localCampaign.campaign_goal = campaign_option.getCampaignGoal();
        localCampaign.sender = localSender;
        localCampaign.campaign_end_date = campaign_option.getCampaignEndDate();
  
        const campaignApiObject = {
            campaign_name: localCampaign.campaign_name,
            campaign_prompt: localCampaign.campaign_prompt,
            campaign_goal: localCampaign.campaign_goal,
            campaign_end_date: localCampaign.campaign_end_date,
        };

        if (!existingCampaign) {
            campaignApiObject['sender_id'] = localSender.id;
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
        campaign_options = getCampaignOptions();
        console.log(campaign_options);
        if (localCampaign?.id) {

            campaign_name = localCampaign.campaign_name;
            campaign_prompt = localCampaign.campaign_prompt;
            campaign_goal = localCampaign.campaign_goal;
            campaign_fallback = localCampaign.campaign_fallback;
            example_interactions = localCampaign.example_interactions;
            localSender = localCampaign.sender;
            campaign_end_date = new Date(localCampaign.campaign_end_date);
            existingCampaign = true;

        }else {
            existingCampaign = false;
        }
        option_label = campaign_options[0].label;
    });
  </script>
  
  <div class="flex flex-col justify-center items-center h-screen">
    <form class="w-full max-w-lg" on:submit|preventDefault={handleSubmit}>
        <div class="flex flex-wrap -mx-3 mb-6"> 

            {#if campaign_option}

                <div class="w-full px-3">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="option_label">Campaign Option:</label>
                    <select id="option_label" class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" bind:value={option_label} required>
                        {#each campaign_options as option (option.label)}
                            <option value={option.label}>{option.label}</option>
                        {/each}
                    </select>
                </div>

                {#each campaign_option.fields as field }
                    <div class="w-full px-3">
                        <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for={field[0]}>{field[0]}</label>
                    </div>

                    {#if field[1] == "text_input"}
                        <div class="w-full px-3">
                            <!-- Bind input to fieldValues object -->
                            <input id={field[0]} type="text" bind:value={fieldValues[field[0]]} class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">
                        </div>
                    {:else if field[1] == "date_input"}
                        <div class="w-full px-3">
                            <!-- Bind input to fieldValues object -->
                            <input id={field[0]} type="date" bind:value={fieldValues[field[0]]} class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">
                        </div>
                    {:else if field[1] == "text_area"}
                        <div class="w-full px-3">
                            <!-- Bind input to fieldValues object -->
                            <textarea id={field[0]} bind:value={fieldValues[field[0]]} class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"></textarea>
                        </div>

                    {:else }
                        <div class="w-full px-3">
                            <!-- Bind input to fieldValues object -->
                            <input id={field[0]} type="text" bind:value={fieldValues[field[0]]} class="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white">
                        </div>
                    {/if}
                {/each}
            {/if}

            <div class="w-full px-3">
                <button type="submit" class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create Campaign</button>
            </div>
        </div>
    </form>
</div>