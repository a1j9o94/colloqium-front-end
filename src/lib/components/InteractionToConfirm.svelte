<script lang="ts">
    import type { Interaction } from '$lib/model';


    export let interaction: Interaction;
    export let interactionIndex: number;
    export let sendInteraction: (interactionIndex: number) => void;

    let loading = false;

    async function handleSend(interactionIndex: number) {
        loading = true;
        await sendInteraction(interactionIndex);
        loading = false;
    }
</script>


<tr class="">
    <td class="px-2 first:pl-5 last:pr-5 py-3 w-px">{interaction.voter.voter_name}</td>
    <!-- Get the last item in the conversation array -->
    <td class="px-2 first:pl-5 last:pr-5 py-3 w-px">{interaction.conversation[interaction.conversation.length - 1].content.slice(0, 300)}</td>
    <td>
        <button type="button" class="btn bg-indigo-500 hover:bg-indigo-600 text-white" on:click={() => handleSend(interactionIndex)} disabled={interaction.sent || interaction.error}>
            {#if loading}
                <span class="loading loading-spinner loading-md"></span>
            {:else if interaction.sent}
                Sent
            {:else if interaction.error}
                Error
            {:else}
                Send
            {/if}
        </button>
    </td>
</tr>