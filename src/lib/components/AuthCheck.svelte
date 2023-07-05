<script lang="ts">
    import { user } from "$lib/firebase";
    import Login from "./Login.svelte";
</script>

{#if $user}
    <slot />
{:else}
    <p class="text-error">You are not signed in!</p>
    <Login />
{/if}