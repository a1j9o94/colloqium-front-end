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

<a href="/campaign/{interaction.campaign_id}/insights">Back to Insights</a>
<h1>Conversation</h1>
<div class="conversation-container">
    {#each conversation as message}
        {#if message.content && message.role != "function"}
            <div class="bubble {message.role}"><p class="text-black">{message.content}</p></div>
        {/if}
    {/each}
</div>

<style>
    .bubble {
        border-radius: 15px;
        padding: 10px;
        margin: 5px;
        max-width: 80%;
        display: inline-block;
    }

    .user {
        text-align: right;
        background-color: #f0f0f0;
    }

    .assistant {
        text-align: left;
        background-color: #d0e5f5;
    }

    .conversation-container {
        max-width: 375px; /* iPhone X width */
        max-height: 812px; /* iPhone X height */
        border: 2px solid #000;
        overflow-y: scroll;
        padding: 20px;
    }


</style>