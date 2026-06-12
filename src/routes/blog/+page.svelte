<script lang="ts">
	let { data } = $props();

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Blog — Wreck</title>
	<meta name="description" content="Thoughts and notes from Wreck — software, design, and everything in between." />
</svelte:head>

<section class="min-h-dvh p-6 mix-blend-difference sm:p-10 md:p-20 lg:p-32">
	<div class="mx-auto w-full max-w-3xl">
		<header class="mb-12 flex items-start justify-between gap-6">
			<div>
				<p class="mb-3 font-mono text-xs tracking-[0.25em] text-white/50 uppercase">Journal</p>
				<h1 class="font-forum text-5xl leading-[1.05] text-white sm:text-6xl md:text-7xl">Blog</h1>
			</div>
			<nav
				aria-label="Blog"
				class="flex flex-col items-end gap-2 pt-2 font-mono text-xs tracking-[0.2em] uppercase"
			>
				<a href="/" class="text-white/60 transition-colors hover:text-white">← Home</a>
				<a href="/blog/new" class="text-white/60 transition-colors hover:text-white">+ New</a>
			</nav>
		</header>

		<div class="h-px w-full bg-white/10" aria-hidden="true"></div>

		{#if data.posts.length === 0}
			<p class="mt-12 font-forum text-lg text-white/60">
				Nothing here yet.
				<a href="/blog/new" class="underline transition-colors hover:text-white">Write the first post.</a>
			</p>
		{:else}
			<ul class="mt-8 flex flex-col">
				{#each data.posts as post}
					<li>
						<a
							href="/blog/{post.slug}"
							class="group flex flex-col gap-1 border-b border-white/10 py-6 transition-colors hover:bg-white/[0.02]"
						>
							<time
								datetime={post.date}
								class="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase"
							>
								{formatDate(post.date)}
							</time>
							<h2
								class="font-forum text-2xl leading-snug text-white/80 transition-colors group-hover:text-white sm:text-3xl"
							>
								{post.title}
							</h2>
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>
