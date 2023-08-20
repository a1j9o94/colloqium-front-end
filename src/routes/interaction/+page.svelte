<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import papa from "papaparse";
  import type { Campaign, Voter } from "$lib/model";
  import { formatDate, formatPhoneNumber, API_URL } from "$lib/utility.js";

  export let data;
  let isLoading = false;

  const { senders, interaction_types, campaigns} = data; 

  let senderId = "";
  let senderName = "";
  let senderPhoneNumber = "";
  let senderInformation = "";
  let campaignId = "";
  let campaignName = "";
  let campaignPrompt = "";
  let campaignEndDate = "";
  let interactionType = "";
  let availableCampaigns: Campaign[] = [];
  let voters: Voter[] = [];

  $: {
    availableCampaigns = campaigns.filter(campaign => campaign.sender.id === senderId && new Date(campaign.campaign_end_date) > new Date());

    // If the selected campaign is no longer available, reset these values
    if (!availableCampaigns.find(campaign => campaign.id === campaignId)) {
        campaignId = "";
        campaignName = "";
        campaignPrompt = "";
        campaignEndDate = "";
    }
}

  // Update Sender details when the selected sender changes
  $: {
    const selectedSender = senders.find(sender => sender.id === senderId);
    if (selectedSender) {
        senderName = selectedSender.sender_name;
        senderPhoneNumber = selectedSender.phone_numbers[0];
        senderInformation = selectedSender.sender_information;

        // Reset the campaign details
        campaignId = "";
        campaignName = "";
        campaignPrompt = "";
        campaignEndDate = "";
    }
}


  // Update Campaign details when the selected campaign changes
  $: {
    const selectedCampaign = availableCampaigns.find(campaign => campaign.id === campaignId);
    if (selectedCampaign) {
        campaignPrompt = selectedCampaign.campaign_prompt;
        campaignEndDate = formatDate(new Date(selectedCampaign.campaign_end_date));
    } else {
        // Reset campaign details if no matching campaign is found
        campaignPrompt = "";
        campaignEndDate = formatDate(new Date());
    }
  }


  onMount(async () => {
      senderId = senders[0].id;
      interactionType = interaction_types[0];
  });

  async function handleSubmit() {
    isLoading = true;
    // Ensure that we have a campaign selected
    if (!campaignId) {
        console.error('No campaign selected');
        isLoading = false;
        return;
    }

    //check if a csv was submitted by seeing the voters array is empty
    if (voters.length != 0) {
      //create a new audience with the voters
      let audienceResponse = await fetch(`${API_URL}/audience`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          audience_name: campaignName + " Audience " + Date.now(),
          sender_id: senderId,
          audience_information: "This is an audience for the campaign " + campaignName
        })
      });

      if (audienceResponse && !audienceResponse.ok) {
        console.error(`Error creating audience for ${campaignName}`);
        isLoading = false;
        return;
      }

      // At this point, audience has been created
      const audienceData = await audienceResponse.json();
      const audienceId = audienceData['audience']["id"];

      //create an array that will hold all of the voter ids for the audience
      let voterIds = [];

      for (let voter of voters) {
          // Format phone number, replace placeholder with actual format function
          const formattedPhoneNumber = formatPhoneNumber(voter["voter_phone_number"]); 

          let voterResponse = await fetch(`${API_URL}/voter?voter_phone_number=${formattedPhoneNumber}`);

          if (voterResponse) {
              if (!voterResponse.ok) {
                  let newvoter = {
                      "voter_name": voter["voter_name"],
                      "voter_phone_number": formattedPhoneNumber,
                      "voter_profile": voter["voter_profile"]
                  };

                  voterResponse = await fetch(`${API_URL}/voter`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(newvoter)
                  });

                  if (voterResponse && !voterResponse.ok) {
                      console.error(`Error creating voter ${newvoter["voter_name"]}`);
                      continue;
                  }
              }

              if (voterResponse) {
                  // At this point, voter either existed or has been created
                  const voterData = await voterResponse.json();
                  const voterId = voterData['voter']["id"];

                  // Add voter to audience
                  voterIds.push(voterId);

              }
          } else {
              console.error(`Error fetching voter ${formattedPhoneNumber}`);
          }

      }
      let audience = {
                      audience_id: audienceId,
                      voters: voterIds,
                      campaigns: [campaignId]
                  };

      //create a PUT request to the audience endpoint to add the voters to the audience
      let audienceUpdateResponse = await fetch(`${API_URL}/audience`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(audience)
      });

      if (audienceUpdateResponse && !audienceUpdateResponse.ok) {
        console.error(`Error updating audience for ${campaignName}`);
        isLoading = false;
        return;
      }

    }

    //call the interaction route with a post including the campaign id and interaction type to generate the messages
    let interactionResponse = await fetch(`${API_URL}/interaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        campaign_id: campaignId,
        interaction_type: interactionType
      })
    });

    if (interactionResponse && !interactionResponse.ok) {
      console.error(`Error creating interaction for ${campaignName}`);
      isLoading = false;
      return;
    }
    
    goto(`${senderId}/confirm_messages`)
  }


  function handleChange(event: Event) {
    let files = (event.target as HTMLInputElement).files;
    if (files) {
        for (let f of files) {
            papa.parse(f, {
                header: true,
                complete: function (results) {
                  
                    let raw_voters = results.data as Record<string, any>[];

                    voters = raw_voters.map((voter): Voter => {
                      return {
                        id: "",
                        voter_name: voter["Voter Name"],
                        voter_phone_number: formatPhoneNumber(voter["Phone Number"]),
                        voter_profile: {
                          interests: voter["Voter Information"]
                        }
                      };
                    });
                }
            });
        }
    }
  }
</script>

<div class="min-h-screen py-6 flex justify-center">
<div class="relative py-3 sm:mx-auto">
<div class="relative shadow sm:p-10">
  <div class="">
    <form on:submit|preventDefault={handleSubmit}>
      <div class="mb-5">
        <label for="senderName" class="block mb-2 text-sm">Sender Name</label>
        <select id="senderName" bind:value={senderId} class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded">
            {#each senders as sender (sender.id)}
                <option value={sender.id}>{sender.sender_name}</option>
            {/each}
        </select>
    </div>
      <!-- Hidden sender Id field-->
      <input type="hidden" id="senderId" bind:value={senderId} />
      <div class="mb-5">
        <label for="senderPhone" class="block mb-2 text-sm">Sender Phone Number</label>
        <input type="text" id="senderPhone" bind:value={senderPhoneNumber} class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" disabled />
      </div>
      <div class="mb-5">
        <label for="senderInfo" class="block mb-2 text-sm">Sender Information</label>
        <textarea id="senderInfo" bind:value={senderInformation} rows="3" class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" disabled></textarea>
      </div>
      <div class="mb-5">
        <label for="campaignName" class="block mb-2 text-sm">Campaign Name</label>
        <input type="hidden" id="campaignId" bind:value={campaignId} />
        <select id="campaignName" bind:value={campaignId} class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded">
            {#each availableCampaigns as campaign (campaign.id)}
                {#if new Date(campaign.campaign_end_date) > new Date()}
                    <option value={campaign.id}>{campaign.campaign_name}</option>
                {/if}
            {/each}
        </select>
      </div>
    
      <div class="mb-5">
        <label for="campaignInfo" class="block mb-2 text-sm">Campaign Prompt</label>
        <textarea id="campaignInfo" bind:value={campaignPrompt} rows="3" class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" disabled></textarea>
      </div> 
      <div class="mb-5">
        <label for="endDate" class="block mb-2 text-sm">Campaign End Date</label>
        <input type="date" id="endDate" bind:value={campaignEndDate} class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" disabled />
      </div>
      <div class="mb-5">
        <label for="voterCSV" class="block mb-2 text-sm">voter CSV</label>
        <input type="file" id="voterCSV" on:change={handleChange} class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" />
      </div>
      <div class="mb-5">
        <label for="interactionType" class="block mb-2 text-sm">Interaction Type</label>
        <select id="interactionType" bind:value={interactionType} class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded">
          {#each interaction_types as type (type)}
            <option value={type}>{type}</option>
          {/each}
        </select>
      </div>
      <div class="mb-8 text-center">
        <button type="submit" class="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none">
          {#if isLoading}
            <span class="loading loading-spinner loading-md"></span>
          {:else}
            Submit
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
</div>
</div>