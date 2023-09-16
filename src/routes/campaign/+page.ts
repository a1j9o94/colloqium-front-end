import type { PageLoad } from './$types';
import { API_URL } from '$lib/utility';
import type { Campaign } from '$lib/model';
import { userData } from '$lib/firebase'; // Import userData store

export const load: PageLoad = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = userData.subscribe(async ($userData) => {
      if ($userData) {
        try {
          let campaigns: Campaign[] = [];

          console.log($userData);

          for (const sender of $userData.associated_senders) {
            const response = await fetch(`${API_URL}/campaign?sender_id=${sender}`, {
              method: 'GET'
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonResponse = await response.json();
            campaigns = [...campaigns, ...jsonResponse.campaigns];
          }

          resolve({ campaigns }); // Resolve the promise with the fetched campaigns
        } catch (error) {
          reject(error); // Reject the promise if there was an error
        }
      }
    });

    // Unsubscribe when the promise is settled
    Promise.resolve().finally(() => unsubscribe());
  });
};