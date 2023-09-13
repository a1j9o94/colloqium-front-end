import {writable} from 'svelte/store';
import type {Sender} from '../model';

export const senderStore = writable<Sender>({id: 2} as Sender);