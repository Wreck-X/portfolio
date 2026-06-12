<script>
	// @ts-nocheck
	import { tick } from 'svelte';
	import VinylRecord from '../ui/VinylRecord.svelte';

	const cards = [
		{
			id: 1,
			title: 'Ink',
			sub: 'The Epub Reader',
			url: 'https://github.com/Wreck-X/ink',
			description:
				'A minimal, distraction-free reading app built for long-form content. Ink strips away the noise and lets the words breathe — clean typography, quiet interface, pure focus.'
		},
		{
			id: 2,
			title: 'Browser',
			sub: 'Prototype',
			url: 'https://github.com/Wreck-X/browser-prototype',
			description:
				'An experimental browser prototype exploring alternative paradigms for navigating the web. Built to question assumptions about tabs, history, and how we move through information.'
		},
		{
			id: 3,
			title: 'News',
			sub: 'Block',
			url: 'https://github.com/Wreck-X/news-block',
			description:
				'A focused news aggregator that surfaces signal over noise. News Block curates headlines into digestible blocks, giving you a clear picture of the day without the scroll-bait.'
		},
		{
			id: 4,
			title: 'Root',
			sub: 'Club Backend',
			url: 'https://github.com/Wreck-X/root',
			description:
				'The backbone of a club management system. Root handles memberships, events, and permissions — a robust backend built to keep communities organised and running smoothly.'
		},
		{
			id: 5,
			title: 'Terrace',
			sub: 'Kotlin App',
			url: 'https://github.com/Wreck-X/terrace',
			description:
				'A native Android app written in Kotlin. Terrace brings a calm, structured space to your phone — designed with modern Android architecture and a considered, minimal UI.'
		}
	];

	const RADIUS = 320;
	const total = cards.length;
	const stepAngle = 360 / total;

	let currentIndex = 0;
	let angle = 0;

	let transitioning = false;
	let transitionDone = false;
	let clickedCard = null;

	let sectionEl;
	let backBtnEl;
	let cardEls = [];

	let swipeStartX = null;
	let suppressClick = false;

	function goTo(i) {
		currentIndex = ((i % total) + total) % total;
		angle = -currentIndex * stepAngle;
	}

	function prev() {
		goTo(currentIndex - 1);
	}
	function next() {
		goTo(currentIndex + 1);
	}

	function openCard(i) {
		if (suppressClick || transitioning) return;
		if (i !== currentIndex) {
			goTo(i);
			return;
		}
		clickedCard = cards[currentIndex];
		transitioning = true;
		setTimeout(() => {
			transitionDone = true;
		}, 700);
	}

	function goBack() {
		transitionDone = false;
		transitioning = false;
		clickedCard = null;
		// wait for the inert attribute to clear before moving focus back
		tick().then(() => cardEls[currentIndex]?.focus());
	}

	function onSwipeStart(e) {
		swipeStartX = e.clientX;
	}
	function onSwipeEnd(e) {
		if (swipeStartX === null) return;
		const dx = e.clientX - swipeStartX;
		swipeStartX = null;
		if (Math.abs(dx) > 40) {
			suppressClick = true;
			setTimeout(() => (suppressClick = false), 350);
			if (dx > 0) prev();
			else next();
		}
	}

	function sectionInView() {
		if (!sectionEl) return false;
		const r = sectionEl.getBoundingClientRect();
		const mid = window.innerHeight / 2;
		return r.top <= mid && r.bottom >= mid;
	}

	function onKeydown(e) {
		if (!sectionInView()) return;
		if (transitioning) {
			if (e.key === 'Escape') goBack();
			return;
		}
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prev();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			next();
		}
	}

	$: faceRotations = cards.map((_, i) => (i === currentIndex ? '0deg' : '90deg'));
	$: if (transitionDone && backBtnEl) backBtnEl.focus();
</script>

<svelte:window on:keydown={onKeydown} />

<!-- opaque-ish scrim, no blend: a blend mode here would flatten the 3D carousel,
     and the transformed .screen layers isolate any blend inside them anyway -->
<section
	bind:this={sectionEl}
	class="relative flex h-dvh snap-start items-center justify-center bg-ink/85"
	aria-label="Projects"
>
	<div class="root">
		<div class="screen carousel-screen" class:slide-out={transitioning} inert={transitioning}>
			<div class="bg-glow" aria-hidden="true"></div>

			<header class="site-header">
				<h2 class="header-label">Projects</h2>
				<span class="header-count">{String(cards.length).padStart(2, '0')} records</span>
			</header>

			<div class="scene" role="group" aria-roledescription="carousel" aria-label="Project records">
				<button class="nav-btn" on:click={prev} aria-label="Previous project">
					<span aria-hidden="true">←</span>
				</button>

				<!-- Swipe is a redundant input: buttons and arrow keys cover the same action -->
				<div
					class="stage-wrap"
					role="presentation"
					on:pointerdown={onSwipeStart}
					on:pointerup={onSwipeEnd}
				>
					<div
						class="stage"
						style="transform: rotateX(-15deg) rotateY({angle}deg); transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);"
					>
						{#each cards as card, i}
							{@const cardAngle = stepAngle * i}
							{@const isActive = i === currentIndex}
							<div
								bind:this={cardEls[i]}
								class="card-wrap"
								style="transform: rotateY({cardAngle}deg) translateZ({RADIUS}px) rotateY({faceRotations[
									i
								]}); transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);"
								on:click={() => openCard(i)}
								on:keydown={(e) => (e.key === 'Enter' || e.key === ' ' ? openCard(i) : null)}
								role="button"
								tabindex={isActive ? 0 : -1}
								aria-label={isActive
									? `Open details for ${card.title} — ${card.sub}`
									: `Bring ${card.title} to the front`}
							>
								<div
									class="vinyl"
									style="
                  transform: {isActive
										? 'translateZ(40px) scale(1.25)'
										: 'translateZ(0px) scale(1)'};
                  transition: transform 0.4s ease;
                  cursor: pointer;
                  filter: {isActive
										? 'drop-shadow(0 0 32px rgba(255,255,255,0.1)) drop-shadow(0 16px 48px rgba(0,0,0,0.95))'
										: 'drop-shadow(0 8px 32px rgba(0,0,0,0.7))'};
                "
								>
									<VinylRecord title={card.title} sub={card.sub} {isActive} index={i} />
								</div>
							</div>
						{/each}
					</div>
				</div>

				<button class="nav-btn" on:click={next} aria-label="Next project">
					<span aria-hidden="true">→</span>
				</button>
			</div>

			<div class="card-info-strip" aria-live="polite">
				{#key currentIndex}
					<div class="card-info-inner active">
						<span class="card-info-index"
							>{String(currentIndex + 1).padStart(2, '0')} / {String(cards.length).padStart(
								2,
								'0'
							)}</span
						>
						<span class="card-info-sep" aria-hidden="true">—</span>
						<span class="card-info-title">{cards[currentIndex].title}</span>
						<span class="card-info-sub">{cards[currentIndex].sub}</span>
						<span class="card-info-cta" aria-hidden="true">click to open ↗</span>
					</div>
				{/key}
			</div>
		</div>

		<!-- DETAIL SCREEN -->
		<div class="screen blank-screen" class:slide-in={transitioning}>
			{#if transitionDone && clickedCard}
				<div class="detail-page">
					<button bind:this={backBtnEl} class="back-btn" on:click={goBack}>
						<span aria-hidden="true">←</span> back
					</button>
					<div class="detail-box">
						<div class="pane pane-left">
							<div class="detail-vinyl">
								<VinylRecord title={clickedCard.title} sub={clickedCard.sub} isActive={false} index={total} />
							</div>
						</div>
						<div class="pane-divider" aria-hidden="true"></div>
						<div class="pane pane-right">
							<p class="detail-sub">{clickedCard.sub}</p>
							<h3 class="detail-title">{clickedCard.title}</h3>
							<p class="detail-desc">{clickedCard.description}</p>
							<a class="github-btn" href={clickedCard.url} target="_blank" rel="noopener noreferrer">
								View on GitHub ↗
							</a>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.root {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.screen {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		transition: transform 0.7s cubic-bezier(0.76, 0, 0.24, 1);
		will-change: transform;
	}

	.carousel-screen {
		transform: translateY(0);
		z-index: 1;
		overflow: hidden;
	}
	.carousel-screen.slide-out {
		transform: translateY(-100%);
	}

	/* Single monochrome glow behind the records — same language as the global background */
	.bg-glow {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse 65% 50% at 50% 58%,
			rgba(255, 255, 255, 0.035) 0%,
			transparent 70%
		);
		pointer-events: none;
		z-index: 0;
	}

	.site-header {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.2rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.07);
	}
	@media (min-width: 768px) {
		.site-header {
			padding: 1.5rem 2.2rem;
		}
	}
	.header-label {
		font-family: 'Space Mono', monospace;
		font-size: 0.62rem;
		font-weight: 400;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.9);
		margin: 0;
	}
	.header-count {
		font-family: 'Space Mono', monospace;
		font-size: 0.62rem;
		letter-spacing: 0.2em;
		color: rgba(255, 255, 255, 0.55);
	}
	.scene {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		height: 100%;
		user-select: none;
		position: relative;
		z-index: 5;
	}
	@media (min-width: 768px) {
		.scene {
			gap: 2rem;
		}
	}
	.stage-wrap {
		position: relative;
		height: 340px;
		width: 900px;
		max-width: calc(100vw - 7rem);
		perspective: 1200px;
		transform: scale(0.32);
		overflow: visible;
		flex-shrink: 0;
		touch-action: pan-y;
	}
	@media (min-width: 480px) {
		.stage-wrap {
			transform: scale(0.4);
		}
	}
	@media (min-width: 768px) {
		.stage-wrap {
			transform: scale(0.5);
		}
	}
	.stage {
		position: absolute;
		inset: 0;
		transform-style: preserve-3d;
		transform-origin: center center;
	}
	.card-wrap {
		position: absolute;
		width: 300px;
		height: 300px;
		left: 50%;
		top: 50%;
		margin-left: -150px;
		margin-top: -150px;
		transform-style: preserve-3d;
	}
	.vinyl {
		width: 300px;
		height: 300px;
		border-radius: 50%;
		transform-style: preserve-3d;
	}
	.card-info-strip {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 10;
		padding: 0.9rem 1.2rem;
		border-top: 1px solid rgba(255, 255, 255, 0.07);
		min-height: 52px;
		display: flex;
		align-items: center;
	}
	@media (min-width: 768px) {
		.card-info-strip {
			padding: 1.2rem 2.2rem;
		}
	}
	.card-info-inner {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.6rem;
		width: 100%;
	}
	@media (min-width: 768px) {
		.card-info-inner {
			flex-wrap: nowrap;
			gap: 1rem;
		}
	}
	.card-info-inner.active {
		animation: fadeSlideUp 0.25s ease forwards;
	}
	.card-info-index {
		font-family: 'Space Mono', monospace;
		font-size: 0.58rem;
		letter-spacing: 0.14em;
		color: rgba(255, 255, 255, 0.5);
	}
	.card-info-sep {
		color: rgba(255, 255, 255, 0.2);
		font-family: 'Space Mono', monospace;
	}
	.card-info-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.05rem;
		letter-spacing: 0.14em;
		color: rgba(255, 255, 255, 0.92);
	}
	.card-info-sub {
		font-family: 'Space Mono', monospace;
		font-size: 0.58rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
	}
	.card-info-cta {
		display: none;
		font-family: 'Space Mono', monospace;
		font-size: 0.58rem;
		letter-spacing: 0.14em;
		color: rgba(255, 255, 255, 0.6);
		font-style: italic;
		margin-left: auto;
	}
	@media (min-width: 768px) {
		.card-info-cta {
			display: inline;
		}
	}
	@keyframes fadeSlideUp {
		from {
			opacity: 0;
			transform: translateY(5px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.blank-screen {
		background: var(--color-ink, #0a0a0b);
		transform: translateY(100%);
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.blank-screen.slide-in {
		transform: translateY(0);
	}

	.detail-page {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		box-sizing: border-box;
		animation: fadeIn 0.4s ease forwards;
	}
	@media (min-width: 768px) {
		.detail-page {
			padding: 2rem;
		}
	}

	.back-btn {
		position: absolute;
		top: 1rem;
		left: 1.2rem;
		font-family: 'Space Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.15em;
		color: rgba(255, 255, 255, 0.6);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.4rem;
		transition: color 0.2s ease;
		z-index: 20;
	}
	@media (min-width: 768px) {
		.back-btn {
			top: 1.5rem;
			left: 2.2rem;
		}
	}
	.back-btn:hover {
		color: rgba(255, 255, 255, 0.95);
	}

	.detail-box {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 860px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		border-radius: 4px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.02);
		margin-top: 3rem;
	}
	@media (min-width: 768px) {
		.detail-box {
			flex-direction: row;
			margin-top: 0;
		}
	}
	.pane {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
	}
	@media (min-width: 768px) {
		.pane {
			padding: 3rem;
		}
	}
	.pane-left {
		background: rgba(0, 0, 0, 0.35);
	}
	@media (min-width: 768px) {
		.pane-left {
			flex: 0 0 340px;
		}
	}
	.pane-divider {
		height: 1px;
		width: 100%;
		background: rgba(255, 255, 255, 0.1);
		flex-shrink: 0;
	}
	@media (min-width: 768px) {
		.pane-divider {
			width: 1px;
			height: auto;
		}
	}
	.pane-right {
		flex: 1;
		flex-direction: column;
		align-items: flex-start;
		gap: 0;
	}

	.detail-vinyl {
		width: 160px;
		height: 160px;
		border-radius: 50%;
		animation: spinSlow 18s linear infinite;
	}
	.detail-vinyl :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}
	@media (min-width: 768px) {
		.detail-vinyl {
			width: 220px;
			height: 220px;
		}
	}
	@keyframes spinSlow {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.detail-vinyl {
			animation: none;
		}
	}

	.detail-sub {
		font-family: 'Space Mono', monospace;
		font-size: 0.62rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.55);
		margin: 0 0 0.6rem 0;
	}
	.detail-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2.8rem;
		letter-spacing: 0.06em;
		color: #ffffff;
		margin: 0 0 1rem 0;
		line-height: 1;
	}
	@media (min-width: 768px) {
		.detail-title {
			font-size: 4.5rem;
			margin: 0 0 1.4rem 0;
		}
	}
	.detail-desc {
		font-family: 'Space Mono', monospace;
		font-size: 0.7rem;
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.65);
		margin: 0 0 1.6rem 0;
		max-width: 340px;
	}
	@media (min-width: 768px) {
		.detail-desc {
			line-height: 1.9;
			margin: 0 0 2.2rem 0;
		}
	}
	.github-btn {
		display: inline-block;
		font-family: 'Space Mono', monospace;
		font-size: 0.68rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-ink, #0a0a0b);
		background: #ffffff;
		border: none;
		padding: 0.65rem 1.4rem;
		cursor: pointer;
		text-decoration: none;
		transition: background 0.2s ease;
	}
	.github-btn:hover {
		background: rgba(255, 255, 255, 0.82);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.nav-btn {
		font-family: 'Space Mono', monospace;
		font-size: 1.4rem;
		color: rgba(255, 255, 255, 0.45);
		background: none;
		border: none;
		padding: 1rem 0.6rem;
		cursor: pointer;
		transition: color 0.3s ease;
		z-index: 10;
		flex-shrink: 0;
		align-self: stretch;
		display: flex;
		align-items: center;
	}
	@media (min-width: 768px) {
		.nav-btn {
			font-size: 2rem;
			padding: 1rem 2rem;
		}
	}
	.nav-btn:hover {
		color: rgba(255, 255, 255, 0.9);
	}
</style>
