<script lang="ts">
    import type { Interaction } from '$lib/model';


    export let interaction: Interaction;
    export let interactionIndex: number;
    export let sendInteraction: (interactionIndex: number) => void;
</script>


<tr class="">
    <td class="px-2 first:pl-5 last:pr-5 py-3 w-px">{interaction.voter.voter_name}</td>
    <!-- Get the last item in the conversation array -->
    <td class="px-2 first:pl-5 last:pr-5 py-3 w-px">{interaction.conversation[interaction.conversation.length - 1].content}</td>
    <td>
        <button type="button" class=" btn bg-indigo-500 hover:bg-indigo-600 text-white" on:click={() => sendInteraction(interactionIndex)} disabled={interaction.sent || interaction.error}>
            {interaction.sent ? 'Sent' : interaction.error ? 'Error' : 'Send'}
        </button>
    </td>
</tr>