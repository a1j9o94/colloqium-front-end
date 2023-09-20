<script lang="ts">
	import Card from './components/Card.svelte';

	export let title: string;
	export let cards: { title: string; content: string }[];
</script>

<section class="bg-white border-b py-1">
	<div class="container mx-auto flex flex-wrap pt-4 pb-4">
		<h1 class="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">{title}</h1>
		<div class="w-full mb-4">
			<div class="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t" />
		</div>

		{#each cards as { title, content }}
			<Card title={title} content={content} />
		{/each}
  	</div>
</section>
