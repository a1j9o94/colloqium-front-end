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
	<div><Nav /></div>
	
  <div class="pt-20"><slot/></div>

	<div><Footer /></div>
</div>

<style>
	.gradient {
		@apply bg-gradient-to-r from-pink to-yellow;
	}
</style>