import type { PageLoad } from './$types';
import { API_URL } from '$lib/utility';
import type { Campaign } from '$lib/model';

export const load = (async () => {

    const fetchCampaigns = async (): Promise<Campaign[]> => {
        try {
            // Fetching the data from the API
            const response = await fetch(`${API_URL}/campaign`, {
              method: 'GET'
            });
        
            // Error handling if the fetch fails
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            // Extracting the JSON from the response
            const jsonResponse = await response.json();
        
            // Assuming 'senders' is the key in the returned JSON that contains the list of senders
            return jsonResponse.campaigns as Promise<Campaign[]>;
        
          } catch (error) {
            console.error("Error fetching campaigns: ", error);
            return []; // Return an empty array if there was an error fetching the data
          }
    }
    
    return {
        campaigns: await fetchCampaigns()
    };
}) satisfies PageLoad;