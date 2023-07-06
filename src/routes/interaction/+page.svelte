<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from '$app/navigation';
  import papa from "papaparse";
  import type { Campaign, Recipient } from "$lib/model";
  import { formatDate, formatPhoneNumber, API_URL } from "$lib/utility.js";

  export let data;

  const { senders, interaction_types, campaigns} = data; 

  let senderId = "";
  let senderName = "";
  let senderPhoneNumber = "";
  let senderInformation = "";
  let campaignId = "";
  let campaignName = "";
  let campaignInformation = "";
  let campaignEndDate = "";
  let interactionType = "";
  let availableCampaigns: Campaign[] = [];
  let recipients: Recipient[] = [];

  $: {
    availableCampaigns = campaigns.filter(campaign => campaign.sender.id === senderId && new Date(campaign.campaign_end_date) > new Date());

    // If the selected campaign is no longer available, reset these values
    if (!availableCampaigns.find(campaign => campaign.id === campaignId)) {
        campaignId = "";
        campaignName = "";
        campaignInformation = "";
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
        campaignInformation = "";
        campaignEndDate = "";
    }
}


  // Update Campaign details when the selected campaign changes
  $: {
    const selectedCampaign = availableCampaigns.find(campaign => campaign.id === campaignId);
    if (selectedCampaign) {
        campaignInformation = selectedCampaign.campaign_information;
        campaignEndDate = formatDate(new Date(selectedCampaign.campaign_end_date));
    } else {
        // Reset campaign details if no matching campaign is found
        campaignInformation = "";
        campaignEndDate = formatDate(new Date());
    }
  }


  onMount(async () => {
      senderId = senders[0].id;
      interactionType = interaction_types[0];

      console.log("API_URL: ", API_URL);
  });

  async function handleSubmit() {
    // Ensure that we have a campaign selected
    if (!campaignId) {
        console.error('No campaign selected');
        return;
    }
    for (let recipient of recipients) {
        // Format phone number, replace placeholder with actual format function
        const formattedPhoneNumber = formatPhoneNumber(recipient["recipient_phone_number"]); 

        let recipientResponse = await fetch(`${API_URL}/recipient?recipient_phone_number=${formattedPhoneNumber}`);

        if (recipientResponse) {
            if (!recipientResponse.ok) {
                let newRecipient = {
                    "recipient_name": recipient["recipient_name"],
                    "recipient_phone_number": formattedPhoneNumber,
                    "recipient_information": recipient["recipient_information"]
                };

                recipientResponse = await fetch(`${API_URL}/recipient`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newRecipient)
                });

                if (recipientResponse && !recipientResponse.ok) {
                    console.error(`Error creating recipient ${newRecipient["recipient_name"]}`);
                    continue;
                }
            }

            if (recipientResponse) {
                // At this point, recipient either existed or has been created
                const recipientData = await recipientResponse.json();
                console.log(recipientData);
                const recipientId = recipientData["recipient_id"];
                console.log(recipientId);

                // Now create an interaction for this recipient
                let interaction = {
                    recipient_id: recipientId, // assuming recipient is of type Recipient
                    campaign_id: campaignId, // assuming campaign is of type Campaign
                    interaction_type: 'text_message' // or any other valid interaction type
                };
                console.log(interaction);

                let interactionResponse = await fetch(`${API_URL}/interaction`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(interaction)
                });

                if (!interactionResponse || !interactionResponse.ok) {
                    console.error(`Error sending interaction for recipient ${recipient["recipient_name"]}`);
                }
            }
        } else {
            console.error(`Error fetching recipient ${formattedPhoneNumber}`);
        }

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
                  
                    let raw_recipients = results.data as Record<string, any>[];

                    recipients = raw_recipients.map((recipient): Recipient => {
                      return {
                        id: "",
                        recipient_name: recipient["Recipient Name"],
                        recipient_phone_number: formatPhoneNumber(recipient["Phone Number"]),
                        recipient_information: recipient["Recipient Information"]
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
        <label for="campaignInfo" class="block mb-2 text-sm">Campaign Information</label>
        <textarea id="campaignInfo" bind:value={campaignInformation} rows="3" class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" disabled></textarea>
      </div> 
      <div class="mb-5">
        <label for="endDate" class="block mb-2 text-sm">Campaign End Date</label>
        <input type="date" id="endDate" bind:value={campaignEndDate} class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" disabled />
      </div>
      <div class="mb-5">
        <label for="recipientCSV" class="block mb-2 text-sm">Recipient CSV</label>
        <input type="file" id="recipientCSV" on:change={handleChange} class="w-full px-5 py-1 text-gray-700 bg-gray-200 rounded" />
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
        <button type="submit" class="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none">Submit</button>
      </div>
    </form>
  </div>
</div>
</div>
</div>