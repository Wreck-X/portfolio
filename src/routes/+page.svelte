<script lang="ts">
	import AboutSection from '$lib/components/sections/AboutSection.svelte';
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import VinylSection from '$lib/components/sections/VinylSection.svelte';
	import { createScrollObserver, detectSections } from '$lib/utils/scroll.js';
	import Vscrollbar from '$lib/components/layout/Vscrollbar.svelte';
	import { onMount } from 'svelte';

	let container!: HTMLDivElement;
	let sections: HTMLElement[] = [];
	let active = 0;

	onMount(() => {
		sections = detectSections(container);
		const observer = createScrollObserver(sections, {
			root: container,
			onSectionChange: (index) => (active = index)
		});

		sections.forEach((s) => observer.observe(s));

		return () => observer.disconnect();
	});
</script>

<div bind:this={container} class="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth">
	<HeroSection />
	<AboutSection />
	<VinylSection />
</div>

<Vscrollbar {active} />
