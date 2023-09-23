import type { PageLoad } from './$types';
import { API_URL } from '$lib/utility';
import type { Campaign } from '$lib/model';

export const load = (async ({fetch, params}) => {
    
    const { campaignId } = params;

    const fetchCampaign = async (): Promise<Campaign> => {
        try {
            // Fetching the data from the API
            const response = await fetch(`${API_URL}/campaign?campaign_id=${campaignId}`, {
              method: 'GET'
            });
        
            // Error handling if the fetch fails
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            // Extracting the JSON from the response
            const jsonResponse = await response.json();

            console.log(jsonResponse);
        
            // Assuming 'senders' is the key in the returned JSON that contains the list of senders
            return jsonResponse.campaign as Promise<Campaign>;
        
          } catch (error) {
            console.error("Error fetching campaigns: ", error);
            return {} as Campaign; // Return an empty array if there was an error fetching the data
          }
    }

    return {
        campaign: fetchCampaign(),
    };
}) satisfies PageLoad;