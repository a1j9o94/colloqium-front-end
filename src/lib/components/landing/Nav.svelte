<script lang="ts">
  import { clickOutside, clickOutsideAction } from '$lib/actions/clickOutside'
  import Button from './components/Button.svelte'
  import { user } from '$lib/firebase'
  import { goto } from '$app/navigation'
  import LogoSVG from './components/LogoSVG.svelte'

  let y: number
  let navFloat = false
  $: navFloat = y > 10

  let showMenu = false
  const toggleMenu = () => (showMenu = !showMenu)
  let hambugerEl

  const onClickOutsideAction = ({ target }) => {
    if (!hambugerEl.contains(target)) showMenu = false
  }
  const onClickOutside = ({ detail: { event: { target } } }) => {
    if (!hambugerEl.contains(target)) showMenu = false
  }

  const gotoLogin = () => {
    goto('/login')
  }

  const gotoCampaign = () => {
    goto('/campaign')
  }

  const logout = () => {
    goto('/logout')
  }

  let darkMode = false;

  if (typeof window !== 'undefined') {
      darkMode = localStorage.getItem('dark-mode') === 'true';
  }

  $: {
    if (typeof window !== 'undefined') {
      if (darkMode) { 
          document.body.classList.add('dark');
      } else {
          document.body.classList.remove('dark');
      }
      localStorage.setItem('dark-mode', darkMode);
    } else {
      console.log('window is undefined');
    }
  }

  const handleLightSwitchChange = (event) => {

    console.log(event.target.checked);
    darkMode = event.target.checked;
    document.documentElement.classList.add('[&_*]:!transition-none');
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.querySelector('body').style.colorScheme = 'dark';
      localStorage.setItem('dark-mode', 'true');
      document.dispatchEvent(new CustomEvent('darkMode', { detail: { mode: 'on' } }));
    } else {
      document.documentElement.classList.remove('dark');
      document.querySelector('body').style.colorScheme = 'light';
      localStorage.setItem('dark-mode', 'false');
      document.dispatchEvent(new CustomEvent('darkMode', { detail: { mode: 'off' } }));
    }
    setTimeout(() => {
      document.documentElement.classList.remove('[&_*]:!transition-none');
    }, 1);
  }
</script>

<svelte:window bind:scrollY={y} />
<!--Nav-->
<nav
  id="header"
  class={`
  fixed w-full z-30 top-0 text-white
  ${navFloat && 'bg-white'}
  `}
>
  <div class="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
    <div class="pl-4 flex items-center">
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        class:text-gray-800={navFloat}
        class:text-white={!navFloat}
        class="no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
        href="/"
      >
      <LogoSVG />
        Colloqium
      </a>
    </div>
    <div bind:this={hambugerEl} class="block lg:hidden pr-4">
      <button
        on:click={toggleMenu}
        id="nav-toggle"
        class="flex items-center p-1 text-pink-800 hover:text-gray-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
      >
        <svg class="fill-current h-6 w-6" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </button>
    </div>
    <!-- use:clickOutsideAction={onClickOutsideAction} -->
    <!-- use:clickOutside on:clickOutside={onClickOutside} -->
    <div
      use:clickOutside on:clickOutside={onClickOutside}
      class:hidden={!showMenu}
      class="hidden w-full flex-grow lg:flex lg:items-center lg:w-auto mt-2 lg:mt-0 bg-white lg:bg-transparent text-black p-4 lg:p-0 z-20"
      id="nav-content"
    >
    <ul class="list-reset lg:flex justify-end flex-1 items-center">
      {#if !$user}
        <li class="mr-3">
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a
            class="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
            href="/login">Login</a
          >
        </li>
      {:else}
        <li class="mr-3">
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a class="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4" href="/campaign" >
              Campaigns
          </a>
        </li>
        <li class="mr-3">
          <!-- svelte-ignore a11y-invalid-attribute -->
          <a
            class="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4"
            href="/logout">Logout</a
          >
        </li>
        <li>
          <!-- Dark mode toggle -->
          <div>
              <input type="checkbox" name="light-switch" id="light-switch" class="light-switch sr-only"  bind:checked={darkMode} on:change={handleLightSwitchChange}/>
              <label class="flex items-center justify-center cursor-pointer w-8 h-8 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 rounded-full" for="light-switch">
                  <svg class="w-4 h-4 dark:hidden" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path class="fill-current text-slate-400" d="M7 0h2v2H7V0Zm5.88 1.637 1.414 1.415-1.415 1.413-1.414-1.414 1.415-1.414ZM14 7h2v2h-2V7Zm-1.05 7.433-1.415-1.414 1.414-1.414 1.415 1.413-1.414 1.415ZM7 14h2v2H7v-2Zm-4.02.363L1.566 12.95l1.415-1.414 1.414 1.415-1.415 1.413ZM0 7h2v2H0V7Zm3.05-5.293L4.465 3.12 3.05 4.535 1.636 3.121 3.05 1.707Z" />
                      <path class="fill-current text-slate-500" d="M8 4C5.8 4 4 5.8 4 8s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4Z" />
                  </svg>
                  <svg class="w-4 h-4 hidden dark:block" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path class="fill-current text-slate-400" d="M6.2 2C3.2 2.8 1 5.6 1 8.9 1 12.8 4.2 16 8.1 16c3.3 0 6-2.2 6.9-5.2C9.7 12.2 4.8 7.3 6.2 2Z" />
                      <path class="fill-current text-slate-500" d="M12.5 6a.625.625 0 0 1-.625-.625 1.252 1.252 0 0 0-1.25-1.25.625.625 0 1 1 0-1.25 1.252 1.252 0 0 0 1.25-1.25.625.625 0 1 1 1.25 0c.001.69.56 1.249 1.25 1.25a.625.625 0 1 1 0 1.25c-.69.001-1.249.56-1.25 1.25A.625.625 0 0 1 12.5 6Z" />
                  </svg>
                  <span class="sr-only">Switch to light / dark version</span>
              </label>
          </div>
        </li>
      {/if}
    </ul>
    </div>
  </div>
  <hr class="border-b border-gray-100 opacity-25 my-0 py-0" />
</nav>
