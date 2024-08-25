<script lang="ts">
    import type { Interaction } from '$lib/model';

    export let interaction: Interaction | null;
    export let interactionIndex: number;
    export let sendInteraction: (interactionIndex: number) => void;

    let loading = false;

    async function handleSend(interactionIndex: number) {
        loading = true;
        await sendInteraction(interactionIndex);
        loading = false;
    }

    $: lastMessage = interaction?.conversation && interaction.conversation.length > 0
        ? interaction.conversation[interaction.conversation.length - 1].content
        : 'Loading message content...';
</script>

<tr class="">
    <td class="px-2 first:pl-5 last:pr-5 py-3 w-px">
        {#if interaction}
            {interaction.voter?.voter_name || 'Unknown Voter'}
        {:else}
            <div class="animate-pulse bg-slate-200 h-4 w-24 rounded"></div>
        {/if}
    </td>
    <td class="px-2 first:pl-5 last:pr-5 py-3 w-px">
        {#if interaction}
            {lastMessage.slice(0, 300)}
        {:else}
            <div class="animate-pulse bg-slate-200 h-4 w-full rounded"></div>
        {/if}
    </td>
    <td>
        <button 
            type="button" 
            class="btn bg-indigo-500 hover:bg-indigo-600 text-white" 
            on:click={() => handleSend(interactionIndex)} 
            disabled={!interaction || interaction.sent || interaction.error}
        >
            {#if loading}
                <span class="loading loading-spinner loading-md"></span>
            {:else if interaction?.sent}
                Sent
            {:else if interaction?.error}
                Error
            {:else if interaction}
                Send
            {:else}
                Loading
            {/if}
        </button>
    </td>
</tr>