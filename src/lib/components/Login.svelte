<script lang="ts">
    import { auth, user } from '$lib/firebase';
    import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        console.log(user);
    }
</script>


<h1>Sign In</h1>
<button on:click={signInWithGoogle} class="btn btn-primary">Sign in with Google</button>