<script lang="ts">
	import type { Sender, Campaign, Voter, Audience } from '$lib/model';
	import { campaignStore } from '$lib/stores/campaignStore';
	import { onMount } from 'svelte';
	import { API_URL, formatPhoneNumber } from '$lib/utility';
    import papa from 'papaparse';
	import { goto } from '$app/navigation';
    
    let sender: Sender = {} as Sender;
    let localCampaign: Campaign | null = {} as Campaign;
    let voters: Voter[] = [];
    let campaignAudiences: Audience[] = [];
    let senderAudiences: Audience[] = [];
    let audienceName = "";
    let isLoading = false;

    onMount(async () => {
        campaignStore.subscribe((campaign) => {
            localCampaign = campaign;
        });

        if(!localCampaign?.id) {
            console.error("No campaign id");
            goto("/campaign/create");
        }

        if(!localCampaign?.campaign_name) {
            console.log("ID exists, but not populated. Fetching from API.");
            const res = await fetch(`${API_URL}/campaign?campaign_id=${localCampaign?.id}`);
            const data = await res.json();
            let campaign = data.campaign;
            sender = campaign.sender; 
            campaignStore.set(campaign);
            localCampaign = campaign;
            campaignAudiences = campaign.audiences;
            console.log("Campaign audiences:");
            console.log(campaignAudiences);


            //get sender audiences from the API with the sender id at the audience route
            const res2 = await fetch(`${API_URL}/audience?sender_id=${sender.id}`);
            const data2 = await res2.json();
            senderAudiences = data2.audiences;
            console.log("Sender audiences:");
            console.log(senderAudiences);
        } else {
            console.log("Populated campaign on audience page");
        }
    });

    function handleChange(event: Event) {
        let files = (event.target as HTMLInputElement).files;
        if (files) {
            for (let f of files) {
                papa.parse(f, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function (results) {
                    
                        let raw_voters = results.data as Record<string, any>[];

                        voters = raw_voters.map((voter): Voter => {
                            return {
                                id: "",
                                voter_name: voter["Voter Name"],
                                voter_phone_number: formatPhoneNumber(voter["Phone Number"]),
                                voter_email: voter["Email"],
                                voter_profile: {
                                    interests: voter["Voter Information"]
                                }
                            };
                        });
                        console.log(voters);
                    }
                });
            }
        }
    }

    async function handleSubmit() {
        isLoading = true;

        if (voters.length != 0) {

            let voters_payload = {
                voters: voters,
                bulk_create_or_update: true,
                audience_data: {
                    audience_name: audienceName,
                    sender_id: localCampaign?.sender.id,
                    campaigns: [localCampaign?.id],
                    audience_information: "This is an audience for the campaign " + localCampaign?.campaign_name
                }
            };

            let voters_response = await fetch(`${API_URL}/voter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(voters_payload)
            });

            if (voters_response && !voters_response.ok) {
                console.error(`Error creating voters for ${localCampaign?.campaign_name}`);
                isLoading = false;
                return;
            }
        }

        // Update existing audiences associated with the campaign
        for (let audienceId of campaignAudiences) {
            const request_body = JSON.stringify({
                audience_id: audienceId,
                campaigns: [localCampaign?.id]
            });

            let audienceUpdateResponse = await fetch(`${API_URL}/audience`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: request_body
            });

            if (audienceUpdateResponse && !audienceUpdateResponse.ok) {
                console.error(`Error updating audience for ${localCampaign?.campaign_name}`);
                continue;
            }
        }

        let interaction_body = JSON.stringify({
            campaign_id: localCampaign?.id,
            interaction_type: localCampaign?.campaign_type,
        });

        // Create the interaction
        let interactionResponse = await fetch(`${API_URL}/interaction`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: interaction_body
        });

        if (interactionResponse && !interactionResponse.ok) {
            console.error(`Error creating interaction for ${localCampaign?.campaign_name}`);
            console.error(interactionResponse);
            isLoading = false;
            return;
        }

        isLoading = false;
        goto(`/campaign/create/confirmation`);
    }
</script>

<!-- Path: src/routes/campaign/audience/+page.svelte -->
<h1>Choose Audience</h1>




<h2>Existing Audiences</h2>
<ul>
    {#each senderAudiences as audience (audience.id)}
        <li>
            <label>
                <input type="checkbox" bind:group={campaignAudiences} value={audience.id}>
                {audience.audience_name}
            </label>
        </li>
    {/each}
</ul>

<div class="mb-5">
    <label for="audienceName" class="block mb-2 text-sm">Audience Name</label>
    <input type="text" id="audienceName" bind:value={audienceName} class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" />
</div>
<div class="mb-5">
    <label for="voterCSV" class="block mb-2 text-sm">voter CSV</label>
    <input type="file" id="voterCSV" on:change={handleChange} class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" />
</div>
<button type="submit" on:click={handleSubmit} class="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
    {#if isLoading}
        <span class="loading loading-spinner loading-md"></span>
    {:else}
        Submit
    {/if}
</button>

