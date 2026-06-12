<script lang="ts">
	let {
		active = 0,
		labels = [],
		onNavigate
	}: {
		active?: number;
		labels?: string[];
		onNavigate?: (index: number) => void;
	} = $props();
</script>

<nav
	aria-label="Page sections"
	class="fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 flex-col items-center gap-1 mix-blend-difference sm:flex md:right-8 lg:right-12"
>
	{#each labels as label, i}
		<button
			type="button"
			aria-label="Go to {label}"
			aria-current={active === i ? 'true' : undefined}
			onclick={() => onNavigate?.(i)}
			class="group flex h-8 w-8 cursor-pointer items-center justify-center"
		>
			<span
				class="block w-px rounded-full transition-all duration-300 {active === i
					? 'h-6 bg-white'
					: 'h-3 bg-white/30 group-hover:h-5 group-hover:bg-white/70'}"
			></span>
		</button>
	{/each}
</nav>
