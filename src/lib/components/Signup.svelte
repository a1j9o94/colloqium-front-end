<script lang="ts">
	import { goto } from '$app/navigation';
    import { auth } from '$lib/firebase';
    import { GoogleAuthProvider, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithPopup, updateEmail, updatePassword } from 'firebase/auth';

    let email = '';
    let password = '';
    let confirmPassword = '';

    async function handleSubmit() {
        if(password === '') {
            alert('Please enter a password');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if(!email) {
            alert('Please enter an email');
            return;
        }
        try{
            await signUp(email, password);
            goto('/login');
        } catch (error) {
            alert(error.message);
        }
    }

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        //reroute to the campaigns page
        goto('/');
        console.log(user);
    }

    async function signUp(email: string, password: string) {
        await createUserWithEmailAndPassword(auth, email, password);
    }

    async function resetPassword(email: string) {
        await sendPasswordResetEmail(auth, email);
    }

    async function changeEmail(email: string) {
        await updateEmail(auth.currentUser, email);
    }

    async function changePassword(password: string) {
        await updatePassword(auth.currentUser, password);
    }

</script>

<main class="card w-4/6 bg-teal-950 text-neutral-content mx-auto">
    <div class="card-body items-center text-center container">
        <h1>Sign Up</h1>
        <form>
            <label class="label">
                <input bind:value={email} type="email" name="email" placeholder="Email" />
            </label>
            <label class="label">
                <input bind:value={password} type="password" name="password" placeholder="Password" />
            </label>
            <label class="label">
                <input bind:value={confirmPassword} type="password" name="confirmPassword" placeholder="Confirm Password" />
            </label>
        </form>
        <button class="btn btn-primary" on:click={handleSubmit}>Submit</button>
        <a href="/login" class="text underline">Already have an account? Login</a>
    </div>
</main>

<style>

    .container form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>