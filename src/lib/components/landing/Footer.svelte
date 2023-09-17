<script lang="ts">
	import LogoSVG from '$lib/components/landing/components/LogoSVG.svelte';
	import FooterSection from './components/FooterSection.svelte';
</script>


<!--Footer-->
<footer class="bg-white">
	<div class="container mx-auto px-8">
		<div class="w-full flex flex-col md:flex-row py-6">
			<div class="flex-1 mb-6 text-black">
				<!-- svelte-ignore a11y-invalid-attribute -->
				<a
					class="text-pink-600 no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
					href="/"
				>
				<LogoSVG />
				Colloqium
				</a>
			</div>
			<FooterSection title="Social" links={[{ text: 'Linkedin', href: 'https://www.linkedin.com/company/colloqium' }]} />
			<FooterSection title="Company" links={[{ text: 'Contact', href: 'mailto:adrian@colloqium.com' }]} />	
		</div>
	</div>
</footer>
