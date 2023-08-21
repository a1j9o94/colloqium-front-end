<script lang="ts">
	import { goto, afterNavigate } from '$app/navigation';
    import { auth } from '$lib/firebase';
    import { base } from '$app/paths';
    import { GoogleAuthProvider, createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, updateEmail, updatePassword } from 'firebase/auth';

    let email = '';
    let password = '';
    let previousPage: string = base;


    async function handleSubmit() {
        if(password === '') {
            alert('Please enter a password');
            return;
        }

        if(!email) {
            alert('Please enter an email');
            return;
        }

        try{
            await login(email, password);
            goto(previousPage);
        } catch (error) {
            alert(error.message);
        }
    }

    async function signInWithGoogle() {
        const provider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, provider);
        //reroute to the campaigns page
        goto(previousPage);
        console.log(user);
    }

    async function login(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email, password);
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

    afterNavigate(({ from }) => {
        previousPage = from?.url.pathname || previousPage;
    });
</script>

<main class="card w-4/6 bg-teal-950 text-neutral-content mx-auto">
    <div class="card-body items-center text-center container">
        <p class="text-error">You are not signed in!</p>
        <h1>Sign In</h1>
        <form>
            <label class="label">
                <input bind:value={email} type="email" name="email" placeholder="Email" />
            </label>
            <label class="label">
                <input bind:value={password} type="password" name="password" placeholder="Password" />
            </label>
        </form>
        <button class="btn btn-primary" on:click={handleSubmit}>Submit</button>
        <button on:click={signInWithGoogle} class="btn btn-secondary">Sign in with Google</button>
        <a href="/forgotpassword" class="text underline">Forgot Password</a>
        <a href="/signup" class="text underline">Don't have an account? Sign up</a>
    </div>
</main>

<style>
    .container form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>