<script>
    import { onMount } from 'svelte';
    import { API_URL } from '$lib/utility';
	import AuthCheck from '$lib/components/AuthCheck.svelte';

    export let data;
    
    // Assign interactions to a local variable so Svelte can react to changes
    let interactions = data.interactions;

    async function sendInteraction(interactionIndex) {
        const interaction = interactions[interactionIndex];
        let interactionId = interaction.id;
        let interactionMethod = "send_text";
        let url = `${API_URL}/${interactionMethod}`;

        try {
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ interaction_status: "human_confirmed", interaction_id: interactionId})
            });

            if (response.status != 200) {
                throw new Error('Response not OK');
            }

            // Update the interaction after successfully sending the text
            interaction.sent = true;
        } catch (error) {
            console.error("Error: ", error);

            // Mark the interaction as error
            interaction.error = true;
        }

        // This assignment will trigger Svelte's reactivity
        interactions = [...interactions];
    }

    onMount(async () => {
        console.log('interactions: ', interactions);
    })
</script>

<AuthCheck>
<div class="container">
    <h1 class="my-4">Interactions</h1>
    <table class="table table-striped">
        <thead class="thead-light">
            <tr>
                <th scope="col">Recipient Name</th>
                <th scope="col">Interaction Type</th>
                <th scope="col">Interaction Message</th>
                <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            {#each interactions as interaction, interactionIndex (interaction.id)}
                <tr>
                    <td>{interaction.recipient.recipient_name}</td>
                    <td>{interaction.interaction_type}</td>
                    <!-- Get the last item in the conversation array -->
                    <td>{interaction.conversation[interaction.conversation.length - 1].content}</td>
                    <td>
                        <button type="button" class="btn btn-primary" on:click={() => sendInteraction(interactionIndex)} disabled={interaction.sent || interaction.error}>
                            {interaction.sent ? 'Sent' : interaction.error ? 'Error' : 'Send'}
                        </button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>
</AuthCheck>