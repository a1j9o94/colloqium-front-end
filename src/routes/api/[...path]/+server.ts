import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_URL } from '$lib/utility';

const API_BASE_URL = API_URL;

export const GET: RequestHandler = async ({ url, params }) => {
    const targetUrl = new URL(params.path, API_BASE_URL);
    url.searchParams.forEach((value, key) => targetUrl.searchParams.append(key, value));

    const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Add any other headers you need here
        },
    });

    const data = await response.json();
    return json(data);
};

export const POST: RequestHandler = async ({ request, params }) => {
    const targetUrl = new URL(params.path, API_BASE_URL);
    
    const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add any other headers you need here
        },
        body: await request.text(),
    });

    const data = await response.json();
    return json(data);
};

// Add other methods (PUT, DELETE, etc.) as needed, following the same pattern
