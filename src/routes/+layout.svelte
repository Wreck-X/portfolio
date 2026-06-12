<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import LiquidBackground from '$lib/components/layout/LiquidBackground.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<LiquidBackground />

<!-- pixel-wise text inversion happens per section (mix-blend-difference), not here:
     a blend mode on this wrapper would flatten the 3D vinyl carousel -->
<main class="contents">{@render children()}</main>
