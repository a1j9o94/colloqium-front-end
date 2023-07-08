<script lang="ts">
    import { goto } from '$app/navigation';
    import { auth } from '$lib/firebase';
    import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

    async function signOutUser() {
        await signOut(auth);
    }

    signOutUser();
    goto('/');
</script>
