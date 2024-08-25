import type { PageLoad } from './$types';
import type { Campaign } from '$lib/model';
import { error } from '@sveltejs/kit';

// Custom fetch function with timeout
async function fetchWithTimeout(fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>, url: string, options: RequestInit = {}, timeout = 60000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
        ...options,
        signal: controller.signal
    });
    clearTimeout(id);

    return response;
}

export const load: PageLoad = async ({ fetch, params }) => {
    const { campaignId } = params;

    try {
        const response = await fetchWithTimeout(fetch, `/api/campaign?campaign_id=${campaignId}`, {}, 60000);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse = await response.json();
        const campaign = jsonResponse.campaign as Campaign;

        return {
            campaign
        };
    } catch (err) {
        console.error("Error fetching campaign:", err);
        if (err.name === 'AbortError') {
            throw error(504, 'Request timeout: The server took too long to respond');
        }
        throw error(500, 'Error fetching campaign data');
    }
};