<script lang="ts">
	let { data } = $props();

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	const paragraphs = $derived(
		data.post.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
	);
</script>

<svelte:head>
	<title>{data.post.title} — Wreck</title>
</svelte:head>

<section class="min-h-dvh p-6 mix-blend-difference sm:p-10 md:p-20 lg:p-32">
	<article class="mx-auto w-full max-w-2xl">
		<nav class="mb-12">
			<a
				href="/blog"
				class="font-mono text-xs tracking-[0.2em] text-white/60 uppercase transition-colors hover:text-white"
			>
				← Blog
			</a>
		</nav>

		<header class="mb-10 flex flex-col gap-4">
			<time datetime={data.post.date} class="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">
				{formatDate(data.post.date)}
			</time>
			<h1 class="font-forum text-4xl leading-[1.1] text-white sm:text-5xl md:text-6xl">
				{data.post.title}
			</h1>
		</header>

		<div class="h-px w-12 bg-white/20" aria-hidden="true"></div>

		<div class="mt-10 flex flex-col gap-6">
			{#each paragraphs as p}
				<p class="font-forum text-base leading-relaxed text-white/70 sm:text-lg">
					{p}
				</p>
			{/each}
		</div>
	</article>
</section>
