import type { PageLoad } from './$types';
import type { Campaign } from '$lib/model';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch, params }) => {
    const { campaignId } = params;

    try {
        const response = await fetch(`/api/campaign?campaign_id=${campaignId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        const campaign = jsonResponse.campaign as Campaign;

        // Don't extract audience IDs here, we'll do it in the component

        return {
            campaign
        };
    } catch (err) {
        console.error("Error fetching campaign:", err);
        throw error(500, 'Error fetching campaign data');
    }
}) satisfies PageLoad;