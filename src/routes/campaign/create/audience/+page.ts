import type { PageLoad } from './$types';
import type { Campaign, Sender } from '$lib/model';
import { API_URL } from '$lib/utility';
import { campaignStore } from '$lib/store';

const fetchCampaign = async (): Promise<Campaign> => {
    return new Promise((resolve) => {
        const unsubscribe = campaignStore.subscribe((campaign) => {
          resolve(campaign);
          unsubscribe();
        });
      });
}

const fetchSender = async (campaign: Campaign): Promise<Sender> => {
    return campaign.sender;
}

export const load = (async () => {
    const campaign = await fetchCampaign();
    const sender = await fetchSender(campaign);
    return {
        sender,
        campaign,
    };
}) satisfies PageLoad;