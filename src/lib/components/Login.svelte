<script lang="ts">
	import { goto } from '$app/navigation';
    import { auth, user } from '$lib/firebase';
    import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        //reroute to the campaigns page
        goto('/');
        console.log(user);
    }
</script>

<main class="card w-4/6 bg-teal-950 text-neutral-content mx-auto">
    <div class="card-body items-center text-center">
        <p class="text-error">You are not signed in!</p>
        <h1>Sign In</h1>
        <button on:click={signInWithGoogle} class="btn btn-primary">Sign in with Google</button>
    </div>
</main>