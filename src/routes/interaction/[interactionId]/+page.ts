import type { PageLoad } from './$types';
import type { Interaction } from '$lib/model';
import { API_URL } from '$lib/utility';

export const load = (async ({fetch, params}) => {
    
    const { interactionId } = params;

    const fetchInteraction = async (): Promise<Interaction> => {

        try{
            const response = await fetch(`${API_URL}/interaction?interaction_id=${interactionId}`, { method: 'GET' });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonResponse = await response.json();

            return jsonResponse.interaction as Promise<Interaction>;

        } catch (error) {
            return {} as Interaction;
        }
    }
    
    return {
        interaction: await fetchInteraction(),
    };
}) satisfies PageLoad;