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

	const links = [
		{ label: 'GitHub', href: 'https://github.com/Wreck-X' },
		{ label: 'Email', href: 'mailto:hemanthkrishnakumar@gmail.com' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/hemanth-krishnakumar/' }
	];
</script>

<section
	class="relative flex min-h-dvh snap-start items-center justify-center overflow-hidden px-6 py-16 sm:p-10 md:p-20 lg:p-32"
>
	<!-- scrim: darkens the smoke under the text columns (sides) while leaving
	     the centre clearer, so text stays legible over any smoke brightness -->
	<div class="scrim pointer-events-none absolute inset-0" aria-hidden="true"></div>

	<span
		aria-hidden="true"
		class="pointer-events-none absolute top-1/2 right-[-0.1em] -translate-y-1/2 font-forum text-[28vw] leading-none text-white/[0.025] select-none md:text-[22vw]"
	>
		&amp;
	</span>

	<div
		class="relative z-10 grid w-full max-w-7xl grid-cols-1 items-center gap-10 sm:gap-14 md:grid-cols-2 md:gap-24"
	>
		<div class="flex flex-col gap-6 sm:gap-8">
			<div>
				<p class="mb-3 font-mono text-xs tracking-[0.25em] text-white/65 uppercase">About</p>
				<h2 class="font-forum text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
					Hi, I'm<br />
					<em class="text-white/60 not-italic">Wreck.</em>
				</h2>
			</div>

			<p class="max-w-md font-forum text-base leading-relaxed text-white/85 sm:text-lg md:text-xl">
				A developer who values clean architecture and scalable system design. I enjoy building
				well-structured software and pairing it with thoughtful frontend experiences that make
				powerful systems easy to use.
			</p>

			<div class="h-px w-12 bg-white/20" aria-hidden="true"></div>

			<ul class="flex flex-col gap-2">
				{#each facts as fact, i}
					<li class="flex items-start gap-3 font-forum text-sm text-white/60 sm:text-base">
						<span aria-hidden="true" class="mt-[0.35em] shrink-0 font-mono text-xs text-white/30">
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
						<h3 class="font-mono text-[10px] tracking-[0.2em] text-white/65 uppercase">
							{group.label}
						</h3>
						<ul class="flex flex-col gap-1.5">
							{#each group.items as item}
								<li
									class="cursor-default font-forum text-xs text-white/60 transition-colors duration-300 hover:text-white/90 sm:text-sm"
								>
									{item}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>

			<div class="h-px w-full bg-white/10" aria-hidden="true"></div>

			<!-- Contact / links -->
			<div class="flex flex-col gap-4">
				<h3 class="font-mono text-[10px] tracking-[0.2em] text-white/65 uppercase">Find me</h3>
				<ul class="flex flex-wrap gap-4 sm:gap-6">
					{#each links as link}
						<li>
							<a
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								class="group flex items-center gap-2 font-forum text-sm text-white/60 transition-colors duration-300 hover:text-white"
							>
								<span
									aria-hidden="true"
									class="inline-block h-px w-4 bg-current transition-all duration-300 group-hover:w-6"
								></span>
								{link.label}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</section>

<style>
	section {
		animation: fadeUp 0.6s ease both;
	}

	/* Strong on the left/right text columns, light through the centre so the
	   smoke still reads. A small blur keeps high-frequency smoke from fighting
	   the text. Sits behind the content (z-0); content is z-10 below. */
	.scrim {
		z-index: 0;
		background: linear-gradient(
			90deg,
			rgba(0, 0, 0, 0.82) 0%,
			rgba(0, 0, 0, 0.55) 20%,
			rgba(0, 0, 0, 0.34) 50%,
			rgba(0, 0, 0, 0.55) 80%,
			rgba(0, 0, 0, 0.82) 100%
		);
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
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
