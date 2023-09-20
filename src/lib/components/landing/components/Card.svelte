<script lang="ts">
	import Button from './Button.svelte';

  export let title = 'Lorem ipsum dolor sit amet.';
  export let content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at ipsum eu nunc commodo posuere et sit amet ligula.';
</script>

<div class="w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
  <div class="flex-1 bg-white rounded-t rounded-b-none overflow-hidden shadow pb-10">
    <!-- svelte-ignore a11y-invalid-attribute -->
      <div class="w-full font-bold text-xl text-gray-800 px-6">{title}</div>
      <p class="text-gray-800 text-base px-6 mb-5">
        {content}
      </p>
  </div>
</div>