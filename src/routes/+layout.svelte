<script lang="ts">
  import "../app.css";
  import { user } from "$lib/firebase";
</script>

<div class="flex flex-col items-center ">
  <div class="relative w-full px-8 lg:px-32 xl:px-64 h-[96px]">
    <div class="flex justify-between items-center w-full h-full">
      <a href="/"><div class="text-center text-[14px] leading-[14px] font-semibold text-black">Colloqium</div></a>
    
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
  <div class="relative w-full px-8 lg:px-32 xl:px-64 h-[96px]"><slot/></div>
  
</div>