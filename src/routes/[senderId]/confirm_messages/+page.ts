import { API_URL } from '$lib/utility';
import type { Interaction, Sender } from '$lib/model';
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
    const { senderId } = params;

    const fetchInteraction = async (): Promise<Interaction[]> => {
        const response = await fetch(`${API_URL}/interaction?sender_id=${senderId}`);
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        let response_json: Interaction[] = await response.json();
    
        //filter out any interactions without an interaction_status of 'initialized'
        response_json = response_json.filter((interaction: Interaction) => interaction.interaction_status === 'initialized');

        return response_json;
    }

    const fetchSender = async () => {
        const response = await fetch(`${API_URL}/sender?sender_id=${senderId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const response_json = await response.json();
        const sender = response_json.sender as Sender;
        return sender;
    }

    return {
            interactions: await fetchInteraction(),
            sender: await fetchSender(),
    };
}) satisfies PageLoad;