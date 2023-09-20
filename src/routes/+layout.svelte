<script lang="ts">
	import Nav from '$lib/components/landing/Nav.svelte';
	import Footer from '$lib/components/landing/Footer.svelte';
  //load post.css from top level src
  import '../app.postcss';


</script>

<div
	class="leading-normal tracking-normal text-white gradient flex flex-col items-stretch"
	style="font-family: 'Source Sans Pro', sans-serif;"
>
	<div class="flex flex-col">
		<div><Nav /></div>
	
  		<div class="pt-20"><slot/></div>

		<div><Footer /></div>
	</div>
</div>

<style>
	.gradient {
		@apply bg-gradient-to-r from-teal-700 to-teal-200;
	}
</style>