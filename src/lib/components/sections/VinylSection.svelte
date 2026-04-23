<script>
	// @ts-nocheck
	import { onMount } from 'svelte';
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

	function handleClick() {
		if (!transitioning) {
			clickedCard = cards[currentIndex];
			transitioning = true;
			setTimeout(() => {
				transitionDone = true;
			}, 700);
		}
	}

	function goBack() {
		transitionDone = false;
		transitioning = false;
		clickedCard = null;
	}

	$: faceRotations = cards.map((_, i) => (i === currentIndex ? '0deg' : '90deg'));
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<section class="relative flex h-screen snap-start items-center justify-center">
	<div class="root">
		<div class="screen carousel-screen" class:slide-out={transitioning}>
			<div class="bg-glow"></div>
			<div class="bg-scanlines"></div>
			<div class="bg-vignette"></div>

			<header class="site-header">
				<div class="header-left">
					<span class="header-label">Projects</span>
				</div>
				<div class="header-right">
					<span class="header-count">{String(cards.length).padStart(2, '0')} records</span>
				</div>
			</header>

			<div class="scene">
				<button class="nav-btn" on:click={prev}>←</button>

				<div class="stage-wrap">
					<div
						class="stage"
						style="transform: rotateX(-15deg) rotateY({angle}deg); transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);"
					>
						{#each cards as card, i}
							{@const cardAngle = stepAngle * i}
							{@const isActive = i === currentIndex}
							<div
								class="card-wrap"
								style="transform: rotateY({cardAngle}deg) translateZ({RADIUS}px) rotateY({faceRotations[
									i
								]}); transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);"
								on:click={handleClick}
								on:keydown={(e) => (e.key === 'Enter' || e.key === ' ' ? handleClick() : null)}
								role="button"
								tabindex="0"
							>
								<div
									class="vinyl"
									style="
                  transform: {isActive
										? 'translateZ(40px) scale(1.25)'
										: 'translateZ(0px) scale(1)'};
                  transition: transform 0.4s ease;
                  cursor: {isActive ? 'pointer' : 'default'};
                  filter: {isActive
										? 'drop-shadow(0 0 32px rgba(255,255,255,0.1)) drop-shadow(0 16px 48px rgba(0,0,0,0.95))'
										: 'drop-shadow(0 8px 32px rgba(0,0,0,0.7))'};
                "
								>
									<VinylRecord
										title={card.title}
										sub={card.sub}
										isActive={card.isActive}
										index={i}
									/>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Right button -->
				<button class="nav-btn" on:click={next}>→</button>
			</div>

			<div class="card-info-strip">
				<div class="card-info-inner active">
					<span class="card-info-index"
						>{String(currentIndex + 1).padStart(2, '0')} / {String(cards.length).padStart(
							2,
							'0'
						)}</span
					>
					<span class="card-info-sep">—</span>
					<span class="card-info-title">{cards[currentIndex].title}</span>
					<span class="card-info-sub">{cards[currentIndex].sub}</span>
					<span class="card-info-cta">click to open ↗</span>
				</div>
			</div>
		</div>

		<!-- DETAIL SCREEN -->
		<div class="screen blank-screen" class:slide-in={transitioning}>
			{#if transitionDone && clickedCard}
				<div class="detail-page">
					<button class="back-btn" on:click={goBack}>← back</button>
					<div class="detail-box">
						<div class="pane pane-left">
							<div class="detail-vinyl">
								<VinylRecord
									title={clickedCard.title}
									sub={clickedCard.sub}
									isActive={clickedCard.isActive}
									index={0}
								/>
							</div>
						</div>
						<div class="pane-divider"></div>
						<div class="pane pane-right">
							<p class="detail-sub">{clickedCard.sub}</p>
							<h1 class="detail-title">{clickedCard.title}</h1>
							<p class="detail-desc">{clickedCard.description}</p>
							<a
								class="github-btn"
								href={clickedCard.url}
								target="_blank"
								rel="noopener noreferrer"
							>
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
		width: 100vw;
		height: 100vh;
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

	.bg-glow {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse 65% 50% at 50% 58%, rgba(255, 255, 255, 0.028) 0%, transparent 70%),
			radial-gradient(ellipse 35% 25% at 15% 85%, rgba(60, 60, 110, 0.07) 0%, transparent 60%),
			radial-gradient(ellipse 35% 25% at 85% 15%, rgba(60, 100, 70, 0.055) 0%, transparent 60%);
		pointer-events: none;
		z-index: 0;
	}

	.bg-scanlines {
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 3px,
			rgba(0, 0, 0, 0.055) 3px,
			rgba(0, 0, 0, 0.055) 4px
		);
		pointer-events: none;
		z-index: 0;
	}
	.bg-vignette {
		position: absolute;
		inset: 0;
		background: radial-gradient(
			ellipse 100% 100% at 50% 50%,
			transparent 35%,
			rgba(0, 0, 0, 0.78) 100%
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
		border-bottom: 1px solid rgba(255, 255, 255, 0.055);
	}
	@media (min-width: 768px) {
		.site-header {
			padding: 1.5rem 2.2rem;
		}
	}
	.header-left {
		display: flex;
		align-items: center;
		gap: 0.8rem;
	}
	.header-label {
		font-family: 'Space Mono', monospace;
		font-size: 0.62rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgba(255, 255, 255);
	}
	.header-right {
		font-family: 'Space Mono', monospace;
		font-size: 0.62rem;
		letter-spacing: 0.2em;
		color: rgba(255, 255, 255);
	}
	.scene {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		user-select: none;
		position: relative;
		z-index: 5;
	}
	.stage-wrap {
		position: relative;
		height: 340px;
		width: 900px;
		perspective: 1200px;
		transform: scale(0.32);
		overflow: visible;
		flex-shrink: 0;
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
		border-top: 1px solid rgba(255, 255, 255, 0.055);
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
		color: rgba(255, 255, 255, 0.18);
	}
	.card-info-sep {
		color: rgba(255, 255, 255, 0.1);
		font-family: 'Space Mono', monospace;
	}
	.card-info-title {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.05rem;
		letter-spacing: 0.14em;
		color: rgba(255, 255, 255, 0.88);
	}
	.card-info-sub {
		font-family: 'Space Mono', monospace;
		font-size: 0.58rem;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.28);
	}
	.card-info-cta {
		display: none;
		font-family: 'Space Mono', monospace;
		font-size: 0.58rem;
		letter-spacing: 0.14em;
		color: rgba(255, 255, 255);
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
		background: #09090b;
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
		color: rgba(255, 255, 255, 0.28);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
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
		color: rgba(255, 255, 255, 0.72);
	}

	.detail-box {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 860px;
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 4px;
		overflow: hidden;
		background: #0d0d0f;
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
		background: #0a0a0c;
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

	.detail-sub {
		font-family: 'Space Mono', monospace;
		font-size: 0.62rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.3);
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
		color: rgba(255, 255, 255, 0.42);
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
		color: #09090b;
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

	.nav-btn {
		font-family: 'Space Mono', monospace;
		font-size: 1.4rem;
		color: rgba(255, 255, 255, 0.08);
		background: none;
		border: none;
		padding: 1rem 0.6rem;
		cursor: pointer;
		transition: color 0.3s ease;
		z-index: 10;
		flex-shrink: 0;
		align-self: stretch; /* fills full height of the flex row */
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
		color: rgba(255, 255, 255, 0.35);
	}
</style>
