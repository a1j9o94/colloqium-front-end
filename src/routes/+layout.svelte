<script lang="ts">
    import "../app.css";
    import { page } from '$app/stores';
    import { user } from "$lib/firebase";
</script>

<div class="navbar bg-base-100">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl" href="/">Colloqium</a>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
       <!--If not logged in show login, otherwise show Insights and Campaigns lins-->
        {#if !$user} 
       <li><a href='/login'>Login</a></li>
        {:else}   
            <li><a href='/insights'>Insights</a></li>
            <li><a href='/campaign'>Campaigns</a></li>
            <li><a href='/logout'>Logout</a></li>
        {/if}
       
      </ul>
    </div>
  </div>

<div class="min-h-screen flex flex-col">
    <slot/>    
</div>