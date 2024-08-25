import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { user, userData } from '$lib/firebase';

export const load: PageLoad = async ({ fetch }) => {
    const currentUser = get(user);
    const currentUserData = get(userData);

    if (!currentUser || !currentUserData) {
        return { campaignIds: [] };
    }

    const campaignIds: number[] = [];

    for (const sender of currentUserData.associated_senders) {
        try {
            const response = await fetch(`/api/campaign?sender_id=${sender}`);
            if (!response.ok) {
                console.error(`Failed to fetch campaign IDs for sender ${sender}: ${response.statusText}`);
                continue;
            }
            const data = await response.json();
            campaignIds.push(...data.campaign_ids);
        } catch (err) {
            console.error(`Error fetching campaign IDs for sender ${sender}:`, err);
        }
    }

    return {
        campaignIds
    };
};