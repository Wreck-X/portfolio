<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} — Wreck</title>
</svelte:head>

<section class="flex min-h-dvh items-center justify-center p-6 mix-blend-difference">
	<div class="flex flex-col items-center gap-6 text-center">
		<p class="font-mono text-xs tracking-[0.25em] text-white/50 uppercase">Error {page.status}</p>
		<h1 class="font-forum text-5xl sm:text-7xl md:text-8xl">
			{page.status === 404 ? 'Lost the groove.' : 'The needle skipped.'}
		</h1>
		<p class="max-w-md font-forum text-lg text-white/60">
			{page.status === 404
				? "This track doesn't exist — maybe it was never pressed."
				: (page.error?.message ?? 'Something went wrong.')}
		</p>
		<a
			href="/"
			class="group mt-2 flex items-center gap-2 font-forum text-sm text-white/60 transition-colors duration-300 hover:text-white"
		>
			<span
				aria-hidden="true"
				class="inline-block h-px w-4 bg-current transition-all duration-300 group-hover:w-6"
			></span>
			Back home
		</a>
	</div>
</section>
