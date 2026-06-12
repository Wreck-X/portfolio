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

	const sectionLabels = ['Intro', 'About', 'Projects'];

	onMount(() => {
		sections = detectSections(container);
		const observer = createScrollObserver(sections, {
			root: container,
			onSectionChange: (index) => (active = index)
		});

		sections.forEach((s) => observer.observe(s));

		return () => observer.disconnect();
	});

	function scrollToSection(i: number) {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		sections[i]?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
	}
</script>

<svelte:head>
	<title>Wreck — Software Developer</title>
	<meta
		name="description"
		content="Portfolio of Wreck — building software products and petting cats. Full-stack and mobile developer working across SvelteKit, Rust, Kotlin and more."
	/>
</svelte:head>

<div bind:this={container} class="h-dvh snap-y snap-mandatory overflow-y-scroll scroll-smooth">
	<HeroSection onExplore={() => scrollToSection(1)} />
	<AboutSection />
	<VinylSection />
</div>

<Vscrollbar {active} labels={sectionLabels} onNavigate={scrollToSection} />
