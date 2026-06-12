<script lang="ts">
	import Blog from '../ui/Blog.svelte';
	import Spotify from '../ui/Spotify.svelte';

	let { onExplore }: { onExplore?: () => void } = $props();
</script>

<section
	class="relative flex h-dvh snap-start items-center justify-center p-6 mix-blend-difference sm:p-12 md:p-20 lg:p-32"
>
	<div class="hero-copy w-full max-w-7xl">
		<p class="mb-3 font-mono text-xs tracking-[0.25em] text-white/50 uppercase">
			Software Developer
		</p>
		<h1 class="font-forum text-5xl sm:text-6xl md:text-7xl lg:text-8xl">Wreck</h1>
		<p class="font-forum text-base text-white/60 sm:text-lg md:text-xl lg:text-2xl">
			Building Software Products and Petting Cats
		</p>
	</div>

	<div class="absolute bottom-6 left-6 z-40 flex flex-col gap-3 md:bottom-10 md:left-10">
		<Spotify />
		<Blog />
	</div>

	<button
		type="button"
		onclick={() => onExplore?.()}
		class="group absolute bottom-6 left-1/2 hidden -translate-x-1/2 cursor-pointer flex-col items-center gap-2 sm:flex md:bottom-10"
	>
		<span
			class="font-mono text-[10px] tracking-[0.3em] text-white/40 uppercase transition-colors duration-300 group-hover:text-white/80"
		>
			Scroll
		</span>
		<span class="scroll-line block h-8 w-px bg-white/15" aria-hidden="true"></span>
		<span class="sr-only">to the About section</span>
	</button>
</section>

<style>
	.hero-copy {
		animation: fadeUp 0.7s ease both;
	}

	@keyframes fadeUp {
		from {
			opacity: 0;
			transform: translateY(18px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.scroll-line {
		position: relative;
		overflow: hidden;
	}
	.scroll-line::after {
		content: '';
		position: absolute;
		left: 0;
		top: -100%;
		height: 100%;
		width: 100%;
		background: rgba(255, 255, 255, 0.8);
		animation: drip 2.4s ease-in-out infinite;
	}
	@keyframes drip {
		0% {
			top: -100%;
		}
		65%,
		100% {
			top: 100%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.scroll-line::after {
			animation: none;
		}
	}
</style>
