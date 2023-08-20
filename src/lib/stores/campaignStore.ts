import { writable } from 'svelte/store';
import type { Campaign } from '../model';

export const campaignStore = writable<Campaign>({} as Campaign);