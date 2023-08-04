<script>
    import { onMount, onDestroy } from 'svelte';
    import io from 'socket.io-client';
    import { API_URL } from '$lib/utility';
    import { writable } from 'svelte/store';
    import AuthCheck from '$lib/components/AuthCheck.svelte';

    export let data;
    const { sender } = data;

    let socket;
    let interactions = writable(data.interactions);

    async function sendInteraction(interactionIndex) {
        const interaction = $interactions[interactionIndex];
        let interactionId = interaction.id;
        let interactionMethod = "send_text";
        let url = `${API_URL}/${interactionMethod}`;

        try {
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ interaction_status: 3, interaction_id: interactionId})
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
        interactions.update(interactions => {
            interactions[interactionIndex] = interaction;
            return [...interactions];
        });
    }

    onMount(() => {

        console.log("Sender:", sender);
        // Connect to the server
        socket = io(`${API_URL}`);

        // Join the room for the current sender
        socket.emit('subscribe_sender_confirmation', { "sender_id": sender.id });
        console.log(`Emitted subscribe_sender_confirmation for sender id: , ${sender.id}`)

        // Listen for the 'interaction_initialized' event
        socket.on('interaction_initialized', async (data) => {
            // Fetch the interaction object from the API
            const response = await fetch(`${API_URL}/interaction?interaction_id=${data.interaction_id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const interaction_response = await response.json();
            console.log("Interaction:", interaction_response.interaction);

            const interaction = interaction_response.interaction;

            // Add the new interaction to the top of the list
            interactions.update(value => [interaction, ...value]);
        });

        socket.on('message', async (data) => {
            console.log(data);
        })
    });

    onDestroy(() => {
        // Disconnect from the server when the component is destroyed
        if (socket) {
            socket.disconnect();
        }
    });
</script>

<AuthCheck>
<div class="container">
    <h1 class="my-4">Interactions</h1>
    <table class="table table-striped">
        <thead class="thead-light">
            <tr>
                <th scope="col">Voter</th>
                <th scope="col">Interaction Message</th>
                <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            {#each $interactions as interaction, interactionIndex (interaction.id)}
                <tr>
                    <td>{interaction.voter.voter_name}</td>
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