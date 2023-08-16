<script lang="ts">
	import { onMount } from 'svelte';
    import type { PageData } from './$types';
    
    export let data: PageData;

    let { interaction } = data;

    type Message = {content: string, role: string};
    let conversation: Message[] = [{content:"", role:""}];

    onMount(() => {
        console.log(interaction);

        // remove the first element from interaction.conversation and assign the remaining array to conversation
        conversation = interaction.conversation.slice(1) as Message[];
    });
</script>

<h1>Interaction: {interaction.id}</h1>

<h1>Conversation</h1>
{#each conversation as message}
    <p>{message.content}</p>
{/each}