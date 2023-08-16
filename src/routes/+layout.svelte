<script lang="ts">
  import "../app.css";
  import { page } from '$app/stores';
  import { user } from "$lib/firebase";
</script>

<div class="flex flex-col items-center h-screen bg-white bg-gradient-to-b from-white to-[rgb(142.03,234.07,236.73)] w-full">
  <div class="relative w-full px-8 lg:px-32 xl:px-64 h-[96px]">
    <div class="flex justify-between items-center w-full h-full">
      <div class="text-center text-[14px] leading-[14px] font-semibold text-black">Colloqium</div>
    
      <div class="flex space-x-4">
        {#if !$user} 
          <div class="text-center text-[14px] leading-[14px] text-black">
            <a href="/login">Login</a>
          </div>
        {:else}   
          <div class="text-center text-[14px] leading-[14px] text-black">
            <a href="/campaign">Campaigns</a>
          </div>
          <div class="text-center text-[14px] leading-[14px] text-black">
            <a href="/logout">Logout</a>
          </div>
        {/if}
      </div>
    </div>
  </div>
  <slot/>
</div>