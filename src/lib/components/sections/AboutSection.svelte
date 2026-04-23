<script lang="ts">
	const skills = [
		{ label: 'Frontend', items: ['React', 'SvelteKit', 'TypeScript', 'Tailwind'] },
		{ label: 'Mobile', items: ['Flutter', 'React Native', 'Kotlin', 'Android'] },
		{ label: 'Backend', items: ['Rust', 'Node.js', 'Django', 'Python'] }
	];

	const facts = [
		'Full-stack, mobile, and somehow still not satisfied.',
		'Kotlin to Rust. React to Django.',
		'Chasing the intersection of clean architecture and beautiful interfaces.',
		'Drawing, coding, building.',
		'I make things work. Then I make them pretty. Then I refactor.'
	];
</script>

<section
	class="relative flex h-screen snap-start items-center justify-center overflow-hidden p-6 sm:p-10 md:p-20 lg:p-32"
>

	<span
		aria-hidden="true"
		class="pointer-events-none absolute top-1/2 right-[-0.1em] -translate-y-1/2 font-forum text-[28vw] md:text-[22vw] leading-none text-white/[0.025] select-none"
	>
		&amp;
	</span>

	<div class="grid w-full max-w-7xl grid-cols-1 items-center gap-10 sm:gap-14 md:grid-cols-2 md:gap-24">

		<div class="flex flex-col gap-6 sm:gap-8">
			<div>
				<p class="mb-3 font-mono text-xs tracking-[0.25em] text-white/30 uppercase">About</p>
				<h2 class="font-forum text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
					Hi, I'm<br />
					<em class="text-white/60 not-italic">Wreck.</em>
				</h2>
			</div>

			<p class="max-w-md font-forum text-base sm:text-lg md:text-xl leading-relaxed text-white/50">
				A developer who values clean architecture and scalable system design. I enjoy building
				well-structured software and pairing it with thoughtful frontend experiences that make
				powerful systems easy to use.
			</p>
			<!-- Divider -->
			<div class="h-px w-12 bg-white/20"></div>

			<!-- Quick facts -->
			<ul class="flex flex-col gap-2">
				{#each facts as fact, i}
					<li class="flex items-start gap-3 font-forum text-sm sm:text-base text-white/40">
						<span class="mt-[0.35em] shrink-0 font-mono text-xs text-white/20">
							{String(i + 1).padStart(2, '0')}
						</span>
						{fact}
					</li>
				{/each}
			</ul>
		</div>

		<!-- RIGHT — skills grid + contact -->
		<div class="flex flex-col gap-8 sm:gap-10">
			<!-- Skills -->
			<div class="grid grid-cols-3 gap-4 sm:gap-6">
				{#each skills as group}
					<div class="flex flex-col gap-3">
						<p class="font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase">
							{group.label}
						</p>
						<ul class="flex flex-col gap-1.5">
							{#each group.items as item}
								<li
									class="cursor-default font-forum text-xs sm:text-sm text-white/50 transition-colors duration-300 hover:text-white/80"
								>
									{item}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>

			<!-- Thin separator -->
			<div class="h-px w-full bg-white/10"></div>

			<!-- Contact / links -->
			<div class="flex flex-col gap-4">
				<p class="font-mono text-[10px] tracking-[0.2em] text-white/25 uppercase">Find me</p>
				<div class="flex flex-wrap gap-4 sm:gap-6">
					{#each [{ label: 'GitHub', href: 'https://github.com/Wreck-X' }, { label: 'Email', href: 'mailto:hemanthkrishnakumar@gmail.com' }, { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hemanth-krishnakumar/' }] as link}
						<a
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							class="group flex items-center gap-2 font-forum text-sm text-white/40 transition-colors duration-300 hover:text-white"
						>
							<!-- Animated arrow -->
							<span
								class="inline-block h-px w-4 bg-current transition-all duration-300 group-hover:w-6"
							></span>
							{link.label}
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* Entrance animation — mirrors the subtle feel of the rest of the page */
	section {
		animation: fadeUp 0.6s ease both;
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
</style>
