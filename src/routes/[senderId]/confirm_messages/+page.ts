import { API_URL } from '$lib/utility';
import type { Interaction } from '$lib/model';

export async function load({ fetch, params }) {
    const { senderId } = params;

    const fetchInteraction = async () => {
        const response = await fetch(`${API_URL}/interaction?sender_id=${senderId}`);
    
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        let response_json = await response.json();
    
        //filter out any interactions without an interaction_status of 'initialized'
        response_json = response_json.filter((interaction: Interaction) => interaction.interaction_status === 'initialized');

        return response_json;
    }

    return {
            interactions: fetchInteraction(),
    };
};
