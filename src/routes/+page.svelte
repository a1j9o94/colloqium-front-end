<script lang="ts">
	import Hero from '$lib/components/landing/Hero.svelte';
	import Features from '$lib/components/landing/Features.svelte';
	import Cards from '$lib/components/landing/Cards.svelte';
	import Pricing from '$lib/components/landing/Pricing.svelte';
	import CallToAction from '$lib/components/landing/CallToAction.svelte';
</script>

<div class="gradient p-0">
	<Hero />

	<Features />

	<div class="bg-white border-b"><Cards title="We can help you ..."
	
		cards={[
			{
				title: 'Drive Fundraising',
				content: 'Increase fundraising by focusing on what matters with each voter'
			},
			{
				title: 'Recruit Volunteers',
				content: 'Recruit more volunteers with personalized messaging'
			},
			{
				title: 'Build Voting Plans',
				content: 'Ensure turnout with targeted voting plans'
			}
		]}
	/></div>

	<CallToAction />
</div>
