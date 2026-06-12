<script>
	// @ts-nocheck
	import { onDestroy, onMount, tick } from 'svelte';
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
	const TRACK_LEN = 213; // 3:33 — every side plays the same imaginary single

	let currentIndex = 0;
	let angle = 0; // continuous, never unwound — keeps drag + buttons seamless

	let transitioning = false;
	let transitionDone = false;
	let clickedCard = null;

	let sectionEl;
	let backBtnEl;
	let cardEls = [];

	let reducedMotion = false;

	// ---- drag-to-spin with inertia ----
	const DEG_PER_PX = 0.28;
	let dragging = false;
	let dragMoved = 0;
	let dragStartX = 0;
	let dragStartAngle = 0;
	let lastX = 0;
	let lastT = 0;
	let velocity = 0; // deg per ms
	let suppressClick = false;

	function mod(n, m) {
		return ((n % m) + m) % m;
	}

	function goTo(i) {
		const target = mod(i, total);
		// rotate by the shortest path from wherever the disc currently sits
		const desired = -target * stepAngle;
		let delta = mod(desired - angle, 360);
		if (delta > 180) delta -= 360;
		angle += delta;
		currentIndex = target;
	}

	function prev() {
		goTo(currentIndex - 1);
	}
	function next() {
		goTo(currentIndex + 1);
	}

	function onDragStart(e) {
		if (transitioning) return;
		dragging = true;
		dragMoved = 0;
		dragStartX = lastX = e.clientX;
		dragStartAngle = angle;
		lastT = performance.now();
		velocity = 0;
	}

	function onDragMove(e) {
		if (!dragging) return;
		const dx = e.clientX - dragStartX;
		dragMoved = Math.max(dragMoved, Math.abs(dx));
		angle = dragStartAngle + dx * DEG_PER_PX;
		// records flip to face you live as the platter passes
		currentIndex = mod(Math.round(-angle / stepAngle), total);
		const now = performance.now();
		const dt = now - lastT;
		if (dt > 0) velocity = ((e.clientX - lastX) / dt) * DEG_PER_PX;
		lastX = e.clientX;
		lastT = now;
	}

	function onDragEnd() {
		if (!dragging) return;
		dragging = false;
		// fling: project the throw forward, clamp to a couple of records, snap
		const fling = Math.max(-2.4 * stepAngle, Math.min(2.4 * stepAngle, velocity * 160));
		const snapped = Math.round((angle + fling) / stepAngle) * stepAngle;
		angle = snapped;
		currentIndex = mod(Math.round(-snapped / stepAngle), total);
		if (dragMoved > 8) {
			suppressClick = true;
			setTimeout(() => (suppressClick = false), 250);
		}
	}

	// ---- mouse parallax tilt ----
	let tiltTarget = { x: 0, y: 0 };
	let tiltCur = { x: 0, y: 0 };

	function onParallax(e) {
		if (e.pointerType !== 'mouse' || !sectionEl) return;
		const r = sectionEl.getBoundingClientRect();
		const px = (e.clientX - r.left) / r.width;
		const py = (e.clientY - r.top) / r.height;
		tiltTarget = { x: (0.5 - py) * 7, y: (px - 0.5) * 12 };
	}
	function resetParallax() {
		tiltTarget = { x: 0, y: 0 };
	}

	onMount(() => {
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reducedMotion) return;
		let raf;
		const loop = () => {
			tiltCur = {
				x: tiltCur.x + (tiltTarget.x - tiltCur.x) * 0.07,
				y: tiltCur.y + (tiltTarget.y - tiltCur.y) * 0.07
			};
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	});

	// ---- dust motes (seeded so SSR and hydration agree) ----
	function rand(seed) {
		const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
		return x - Math.floor(x);
	}
	const motes = Array.from({ length: 18 }, (_, i) => ({
		left: rand(i * 7 + 1) * 100,
		top: 20 + rand(i * 13 + 2) * 70,
		size: 1 + rand(i * 3 + 5) * 2.2,
		drift: (rand(i * 17 + 3) - 0.5) * 60,
		dur: 9 + rand(i * 23 + 4) * 14,
		delay: -rand(i * 31 + 6) * 20
	}));

	// ---- detail screen: turntable, now-playing timer, crackle ----
	let elapsed = 0;
	let timerId = null;

	function startNeedle() {
		elapsed = 0;
		clearInterval(timerId);
		timerId = setInterval(() => (elapsed += 1), 1000);
	}
	function stopNeedle() {
		clearInterval(timerId);
		timerId = null;
	}
	function fmt(s) {
		const t = mod(s, TRACK_LEN);
		return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
	}

	let crackleOn = false;
	let audioCtx = null;
	let crackleNode = null;

	function toggleCrackle() {
		crackleOn = !crackleOn;
		if (crackleOn) startCrackle();
		else stopCrackle();
	}
	function startCrackle() {
		audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
		const sr = audioCtx.sampleRate;
		const len = sr * 4;
		const buf = audioCtx.createBuffer(1, len, sr);
		const d = buf.getChannelData(0);
		// soft surface-noise floor with sparse decaying pops
		for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * 0.012;
		for (let p = 0; p < 90; p++) {
			const at = Math.floor(Math.random() * len);
			const amp = 0.04 + Math.random() * 0.22;
			const decay = 40 + Math.random() * 220;
			for (let j = 0; j < decay && at + j < len; j++)
				d[at + j] += (Math.random() * 2 - 1) * amp * (1 - j / decay);
		}
		const filter = audioCtx.createBiquadFilter();
		filter.type = 'lowpass';
		filter.frequency.value = 3200;
		const gain = audioCtx.createGain();
		gain.gain.value = 0.5;
		crackleNode = audioCtx.createBufferSource();
		crackleNode.buffer = buf;
		crackleNode.loop = true;
		crackleNode.connect(filter);
		filter.connect(gain);
		gain.connect(audioCtx.destination);
		crackleNode.start();
	}
	function stopCrackle() {
		try {
			crackleNode?.stop();
		} catch {
			/* already stopped */
		}
		crackleNode = null;
	}

	onDestroy(() => {
		stopNeedle();
		stopCrackle();
		audioCtx?.close?.();
	});

	// ---- open / close ----
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
			startNeedle();
		}, 700);
	}

	function goBack() {
		transitionDone = false;
		transitioning = false;
		clickedCard = null;
		stopNeedle();
		stopCrackle();
		crackleOn = false;
		// wait for the inert attribute to clear before moving focus back;
		// preventScroll: the carousel screen is still translating back into
		// place, so a scrolling focus would snap the page to the section above
		tick().then(() => cardEls[currentIndex]?.focus({ preventScroll: true }));
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

	// counter-rotate each record by the stage's rotation so every disc always
	// faces the viewer — continuous, so nothing ever flips on its own axis
	$: faceRotations = cards.map((_, i) => -(angle + stepAngle * i));
	$: if (transitionDone && backBtnEl) backBtnEl.focus();
	$: stageTransition = dragging ? 'none' : 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)';
</script>

<svelte:window
	on:keydown={onKeydown}
	on:pointermove={onDragMove}
	on:pointerup={onDragEnd}
	on:pointercancel={onDragEnd}
/>

<!-- opaque-ish scrim, no blend: a blend mode here would flatten the 3D carousel,
     and the transformed .screen layers isolate any blend inside them anyway -->
<section
	bind:this={sectionEl}
	class="relative flex h-dvh snap-start items-center justify-center bg-ink/85"
	aria-label="Projects"
	on:pointermove={onParallax}
	on:pointerleave={resetParallax}
>
	<div class="root">
		<div class="screen carousel-screen" class:slide-out={transitioning} inert={transitioning}>
			<div class="bg-glow" aria-hidden="true"></div>

			<div class="dust" aria-hidden="true">
				{#each motes as m}
					<span
						class="mote"
						style="left:{m.left}%; top:{m.top}%; width:{m.size}px; height:{m.size}px; --drift:{m.drift}px; animation-duration:{m.dur}s; animation-delay:{m.delay}s;"
					></span>
				{/each}
			</div>

			<header class="site-header">
				<h2 class="header-label">Projects</h2>
				<span class="header-count">{String(cards.length).padStart(2, '0')} records</span>
			</header>

			<div class="scene" role="group" aria-roledescription="carousel" aria-label="Project records">
				<button class="nav-btn" on:click={prev} aria-label="Previous project">
					<span aria-hidden="true">←</span>
				</button>

				<!-- Drag is a redundant input: buttons and arrow keys cover the same action -->
				<div class="stage-wrap" class:dragging role="presentation" on:pointerdown={onDragStart}>
					<div
						class="parallax"
						style="transform: rotateX({-15 + tiltCur.x}deg) rotateY({tiltCur.y}deg);"
					>
						<div
							class="stage"
							style="transform: rotateY({angle}deg); transition: {stageTransition};"
						>
							{#each cards as card, i}
								{@const cardAngle = stepAngle * i}
								{@const isActive = i === currentIndex}
								<div
									bind:this={cardEls[i]}
									class="card-wrap"
									style="transform: rotateY({cardAngle}deg) translateZ({RADIUS}px) rotateY({faceRotations[
										i
									]}deg); transition: {stageTransition};"
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
										<div class="float" class:floating={isActive && !dragging}>
											<VinylRecord
												title={card.title}
												sub={card.sub}
												{isActive}
												index={i}
												spinning={isActive && !transitioning}
												spinDuration={11}
											/>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
					<div class="floor-glow" aria-hidden="true"></div>
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
						<span class="card-info-title">
							<span class="sr-only">{cards[currentIndex].title}</span>
							{#each cards[currentIndex].title.split('') as ch, ci}
								<span class="ch" aria-hidden="true" style="animation-delay: {ci * 45}ms">{ch}</span>
							{/each}
						</span>
						<span class="card-info-sub">{cards[currentIndex].sub}</span>
						<span class="card-info-cta" aria-hidden="true">drag to spin · click to open ↗</span>
					</div>
				{/key}
			</div>
		</div>

		<!-- DETAIL SCREEN: the turntable -->
		<div class="screen blank-screen" class:slide-in={transitioning}>
			{#if transitionDone && clickedCard}
				<div class="detail-page">
					<button bind:this={backBtnEl} class="back-btn" on:click={goBack}>
						<span aria-hidden="true">←</span> back
					</button>
					<button
						class="crackle-btn"
						class:on={crackleOn}
						on:click={toggleCrackle}
						aria-pressed={crackleOn}
					>
						<span aria-hidden="true">♪</span> crackle {crackleOn ? 'on' : 'off'}
					</button>

					<div class="detail-box">
						<div class="pane pane-left">
							<div class="turntable" class:reduced={reducedMotion}>
								<div class="platter" aria-hidden="true"></div>
								<div class="tt-record">
									<VinylRecord
										title={clickedCard.title}
										sub={clickedCard.sub}
										isActive={false}
										index={total}
										spinning={true}
										spinDuration={4}
									/>
								</div>
								<svg
									class="tonearm"
									viewBox="0 0 120 290"
									xmlns="http://www.w3.org/2000/svg"
									aria-hidden="true"
								>
									<!-- counterweight -->
									<rect
										x="50"
										y="2"
										width="20"
										height="26"
										rx="4"
										fill="#222"
										stroke="rgba(255,255,255,0.18)"
										stroke-width="1"
									/>
									<!-- arm -->
									<line
										x1="60"
										y1="46"
										x2="60"
										y2="228"
										stroke="#2e2e2e"
										stroke-width="6"
										stroke-linecap="round"
									/>
									<line
										x1="60"
										y1="46"
										x2="60"
										y2="228"
										stroke="rgba(255,255,255,0.25)"
										stroke-width="1.4"
										stroke-linecap="round"
									/>
									<!-- pivot base -->
									<circle
										cx="60"
										cy="46"
										r="17"
										fill="#161616"
										stroke="rgba(255,255,255,0.22)"
										stroke-width="1.2"
									/>
									<circle
										cx="60"
										cy="46"
										r="6"
										fill="#0a0a0a"
										stroke="rgba(255,255,255,0.3)"
										stroke-width="1"
									/>
									<!-- headshell + stylus -->
									<g transform="rotate(-22 60 228)">
										<rect
											x="52"
											y="226"
											width="16"
											height="34"
											rx="3"
											fill="#262626"
											stroke="rgba(255,255,255,0.22)"
											stroke-width="1"
										/>
										<rect x="56" y="258" width="8" height="7" rx="1.5" fill="#dadada" />
									</g>
								</svg>
							</div>
						</div>
						<div class="pane-divider" aria-hidden="true"></div>
						<div class="pane pane-right">
							<p class="detail-sub">{clickedCard.sub}</p>
							<h3 class="detail-title">{clickedCard.title}</h3>
							<p class="detail-desc">{clickedCard.description}</p>

							<div class="now-playing" aria-hidden="true">
								<span class="np-dot"></span>
								<span class="np-label">now playing</span>
								<span class="np-side">A1 · 33⅓ rpm</span>
								<span class="np-time">{fmt(elapsed)} / 3:33</span>
							</div>
							<div class="np-bar" aria-hidden="true">
								<div
									class="np-fill"
									style="width: {(mod(elapsed, TRACK_LEN) / TRACK_LEN) * 100}%"
								></div>
							</div>

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

	/* dust motes drifting through the light */
	.dust {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 1;
		overflow: hidden;
	}
	.mote {
		position: absolute;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.55);
		opacity: 0;
		animation-name: moteFloat;
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
	}
	@keyframes moteFloat {
		0% {
			transform: translate(0, 0);
			opacity: 0;
		}
		25% {
			opacity: 0.45;
		}
		75% {
			opacity: 0.15;
		}
		100% {
			transform: translate(var(--drift, 20px), -90px);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mote {
			animation: none;
			opacity: 0;
		}
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
		cursor: grab;
	}
	.stage-wrap.dragging {
		cursor: grabbing;
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
	.parallax {
		position: absolute;
		inset: 0;
		transform-style: preserve-3d;
		transform-origin: center center;
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
	.float {
		width: 100%;
		height: 100%;
	}
	.float.floating {
		animation: recordBob 5.5s ease-in-out infinite;
	}
	@keyframes recordBob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-9px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.float.floating {
			animation: none;
		}
	}

	/* pool of light on the floor beneath the platter */
	.floor-glow {
		position: absolute;
		left: 50%;
		bottom: -130px;
		width: 700px;
		height: 160px;
		transform: translateX(-50%);
		background: radial-gradient(
			ellipse 50% 50% at 50% 50%,
			rgba(255, 255, 255, 0.06) 0%,
			transparent 70%
		);
		pointer-events: none;
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
		display: inline-flex;
	}
	.card-info-title .ch {
		display: inline-block;
		animation: chRise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
	}
	@keyframes chRise {
		from {
			opacity: 0;
			transform: translateY(0.55em) rotate(6deg);
		}
		to {
			opacity: 1;
			transform: translateY(0) rotate(0deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.card-info-title .ch {
			animation: none;
		}
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

	.crackle-btn {
		position: absolute;
		top: 1rem;
		right: 1.2rem;
		font-family: 'Space Mono', monospace;
		font-size: 0.62rem;
		letter-spacing: 0.15em;
		color: rgba(255, 255, 255, 0.45);
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 2px;
		cursor: pointer;
		padding: 0.4rem 0.7rem;
		transition:
			color 0.2s ease,
			border-color 0.2s ease;
		z-index: 20;
	}
	@media (min-width: 768px) {
		.crackle-btn {
			top: 1.5rem;
			right: 2.2rem;
		}
	}
	.crackle-btn:hover {
		color: rgba(255, 255, 255, 0.9);
		border-color: rgba(255, 255, 255, 0.4);
	}
	.crackle-btn.on {
		color: rgba(255, 255, 255, 0.95);
		border-color: rgba(255, 255, 255, 0.55);
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
		overflow: hidden;
	}
	@media (min-width: 768px) {
		.pane-left {
			flex: 0 0 360px;
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

	/* ---- turntable ---- */
	.turntable {
		position: relative;
		width: 252px;
		height: 252px;
		margin: 0.4rem 1.6rem 0.4rem 0.4rem;
	}
	@media (min-width: 768px) {
		.turntable {
			width: 264px;
			height: 264px;
		}
	}
	.platter {
		position: absolute;
		inset: -14px;
		border-radius: 50%;
		background: radial-gradient(circle at 42% 36%, #1d1d1d 0%, #101010 55%, #090909 100%);
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 18px 50px rgba(0, 0, 0, 0.8);
	}
	/* strobe dots on the platter rim, spinning with the record */
	.platter::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 50%;
		background: repeating-conic-gradient(
			rgba(255, 255, 255, 0.22) 0deg 1.6deg,
			transparent 1.6deg 7.2deg
		);
		-webkit-mask: radial-gradient(
			circle,
			transparent 0 calc(50% - 8px),
			black calc(50% - 7px) calc(50% - 2px),
			transparent calc(50% - 1px)
		);
		mask: radial-gradient(
			circle,
			transparent 0 calc(50% - 8px),
			black calc(50% - 7px) calc(50% - 2px),
			transparent calc(50% - 1px)
		);
		animation: platterSpin 4s linear infinite;
	}
	@keyframes platterSpin {
		to {
			transform: rotate(360deg);
		}
	}
	.tt-record {
		position: absolute;
		inset: 0;
		border-radius: 50%;
		filter: drop-shadow(0 6px 20px rgba(0, 0, 0, 0.7));
		animation: recordDrop 0.85s cubic-bezier(0.22, 0.9, 0.3, 1.08) both;
	}
	.tt-record :global(svg.grooves) {
		width: 100%;
		height: 100%;
	}
	/* the disc only starts turning once the needle has landed */
	.tt-record :global(.grooves.spinning .spin-layer) {
		animation-delay: 1.6s;
	}
	@keyframes recordDrop {
		from {
			opacity: 0;
			transform: translateY(-56px) scale(1.06);
		}
		60% {
			opacity: 1;
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
	.tonearm {
		position: absolute;
		width: 110px;
		height: 266px;
		top: -34px;
		right: -52px;
		transform-origin: 55px 42px;
		filter: drop-shadow(0 8px 14px rgba(0, 0, 0, 0.7));
		animation: armDrop 1s 0.75s cubic-bezier(0.4, 0, 0.2, 1) both;
	}
	@keyframes armDrop {
		from {
			transform: rotate(24deg);
		}
		to {
			transform: rotate(-13deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.platter::after {
			animation: none;
		}
		.tt-record {
			animation: none;
		}
		.tonearm {
			animation: none;
			transform: rotate(-13deg);
		}
	}
	.turntable.reduced .tonearm {
		animation: none;
		transform: rotate(-13deg);
	}

	/* ---- now playing ---- */
	.now-playing {
		display: flex;
		align-items: baseline;
		gap: 0.7rem;
		font-family: 'Space Mono', monospace;
		font-size: 0.56rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.5);
		margin-bottom: 0.5rem;
		width: 100%;
	}
	.np-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #fff;
		align-self: center;
		animation: pulse 1.6s ease-in-out infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.25;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.np-dot {
			animation: none;
		}
	}
	.np-label {
		color: rgba(255, 255, 255, 0.8);
	}
	.np-time {
		margin-left: auto;
		font-variant-numeric: tabular-nums;
	}
	.np-bar {
		width: 100%;
		height: 2px;
		background: rgba(255, 255, 255, 0.1);
		margin-bottom: 1.6rem;
		overflow: hidden;
	}
	.np-fill {
		height: 100%;
		background: rgba(255, 255, 255, 0.75);
		transition: width 1s linear;
	}
	@media (min-width: 768px) {
		.np-bar {
			margin-bottom: 2rem;
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
