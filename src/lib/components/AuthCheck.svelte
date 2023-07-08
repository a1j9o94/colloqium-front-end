<script lang="ts">
    import { user } from "$lib/firebase";
    import Login from "./Login.svelte";
</script>

{#if $user}
    <slot />
{:else}
    <Login />
{/if}