<script lang="ts">
	let { form } = $props();
</script>

<svelte:head>
	<title>New post — Wreck</title>
</svelte:head>

<section class="min-h-dvh p-6 mix-blend-difference sm:p-10 md:p-20 lg:p-32">
	<div class="mx-auto w-full max-w-2xl">
		<nav class="mb-12">
			<a
				href="/blog"
				class="font-mono text-xs tracking-[0.2em] text-white/60 uppercase transition-colors hover:text-white"
			>
				← Blog
			</a>
		</nav>

		<header class="mb-10">
			<p class="mb-3 font-mono text-xs tracking-[0.25em] text-white/50 uppercase">Compose</p>
			<h1 class="font-forum text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl">
				New post
			</h1>
		</header>

		<div class="h-px w-12 bg-white/20" aria-hidden="true"></div>

		<form method="POST" class="mt-10 flex flex-col gap-6">
			<label class="flex flex-col gap-2">
				<span class="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">Title</span>
				<input
					name="title"
					type="text"
					required
					value={form?.title ?? ''}
					class="w-full border-0 border-b border-white/20 bg-transparent px-0 py-2 font-forum text-2xl text-white placeholder-white/20 focus:border-white/60 focus:ring-0 focus:outline-none"
					placeholder="A thought..."
				/>
			</label>

			<label class="flex flex-col gap-2">
				<span class="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">Content</span>
				<textarea
					name="content"
					required
					rows="16"
					class="w-full resize-y border border-white/10 bg-transparent p-4 font-forum text-base leading-relaxed text-white/80 placeholder-white/20 focus:border-white/40 focus:ring-0 focus:outline-none"
					placeholder="Separate paragraphs with a blank line.">{form?.content ?? ''}</textarea>
			</label>

			<label class="flex flex-col gap-2">
				<span class="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">Password</span>
				<input
					name="password"
					type="password"
					required
					class="w-full border-0 border-b border-white/20 bg-transparent px-0 py-2 font-mono text-sm text-white placeholder-white/20 focus:border-white/60 focus:ring-0 focus:outline-none"
				/>
			</label>

			{#if form?.error}
				<p class="font-mono text-xs text-red-400/80">{form.error}</p>
			{/if}

			<div class="flex items-center gap-4 pt-4">
				<button
					type="submit"
					class="group flex items-center gap-3 font-forum text-sm text-white/60 transition-colors duration-300 hover:text-white"
				>
					<span class="inline-block h-px w-4 bg-current transition-all duration-300 group-hover:w-6"></span>
					Publish
				</button>
				<a
					href="/blog"
					class="font-forum text-sm text-white/30 transition-colors hover:text-white/60"
				>
					Cancel
				</a>
			</div>
		</form>
	</div>
</section>
