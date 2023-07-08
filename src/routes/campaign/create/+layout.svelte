<script lang="ts">
    import { page } from '$app/stores'; 
     import AnimatedRoute from '$lib/components/AnimatedRoute.svelte';
 </script>
 
 <nav class="flex justify-center my-6">
     <ul class="steps">
         <a href="/campaign/create" class="step step-primary">Create Campaign</a>
         <a href="/campaign/create/audience" class="step" class:step-primary={$page.route.id?.match(/audience|confirmation/g)}>Choose Audience</a>
         <a href="/campaign/create/confirmation" class="step" class:step-primary={$page.route.id?.match(/confirmation/g)}>Confirm Campaign</a>
     </ul>
 </nav>
 
 <AnimatedRoute>
     <main class="card w-4/6 bg-neutral text-neutral-content mx-auto">
         <div class="card-body items-center text-center">
             <slot></slot>
         </div>
     </main>
 </AnimatedRoute> 