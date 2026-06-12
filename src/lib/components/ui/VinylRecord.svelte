<script lang="ts">
	export let title: string;
	export let sub: string;
	export let isActive: boolean;
	export let index: number;
	export let spinning = false;
	export let spinDuration = 10; // seconds per revolution

	// Deterministic pseudo-random seeded by index, so SSR and hydration agree
	function rand(seed: number) {
		const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
		return x - Math.floor(x);
	}

	// Faint pressing scratches — anisotropic detail that makes the groove
	// layer's rotation visible (concentric circles alone read as static)
	const scratches = Array.from({ length: 7 }, (_, s) => {
		const r = 78 + rand(index * 13 + s) * 60;
		const start = rand(index * 29 + s * 7) * 360;
		const len = 16 + rand(index * 53 + s * 3) * 48;
		const a0 = (start * Math.PI) / 180;
		const a1 = ((start + len) * Math.PI) / 180;
		return {
			d: `M ${150 + r * Math.cos(a0)} ${150 + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${150 + r * Math.cos(a1)} ${150 + r * Math.sin(a1)}`,
			o: 0.05 + rand(index * 7 + s * 11) * 0.08
		};
	});

	// Dust specks sitting in the grooves
	const specks = Array.from({ length: 24 }, (_, s) => {
		const r = 74 + rand(index * 97 + s * 17) * 66;
		const a = rand(index * 41 + s * 5) * Math.PI * 2;
		return {
			x: 150 + r * Math.cos(a),
			y: 150 + r * Math.sin(a),
			rad: 0.5 + rand(index * 3 + s) * 0.8,
			o: 0.05 + rand(index * 19 + s * 23) * 0.1
		};
	});

	// Static light streaks (the classic vinyl reflection bar) — wedges masked
	// to the groove annulus, fixed in place while the grooves spin beneath
	function wedge(centerDeg: number, halfSpan: number) {
		const a0 = ((centerDeg - halfSpan) * Math.PI) / 180;
		const a1 = ((centerDeg + halfSpan) * Math.PI) / 180;
		const R = 150;
		return `M 150 150 L ${150 + R * Math.cos(a0)} ${150 + R * Math.sin(a0)} A ${R} ${R} 0 0 1 ${150 + R * Math.cos(a1)} ${150 + R * Math.sin(a1)} Z`;
	}
</script>

<!-- Decorative: the title/sub are always announced by adjacent text -->
<svg
	class="grooves"
	class:spinning
	style="--spin-duration: {spinDuration}s"
	viewBox="0 0 300 300"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
	focusable="false"
>
	<defs>
		<radialGradient id="vinylGrad{index}" cx="50%" cy="35%" r="65%">
			<stop offset="0%" stop-color="#3a3a3a" />
			<stop offset="40%" stop-color="#0f0f0f" />
			<stop offset="100%" stop-color="#050505" />
		</radialGradient>
		<radialGradient id="shineGrad{index}" cx="35%" cy="30%" r="55%">
			<stop offset="0%" stop-color="rgba(255,255,255,0.18)" />
			<stop offset="60%" stop-color="rgba(255,255,255,0.03)" />
			<stop offset="100%" stop-color="rgba(255,255,255,0)" />
		</radialGradient>
		<radialGradient id="labelGrad{index}" cx="45%" cy="38%" r="60%">
			<stop offset="0%" stop-color="#ffffff" />
			<stop offset="100%" stop-color="#e8e8e8" />
		</radialGradient>
		<radialGradient id="streakGrad{index}" cx="50%" cy="50%" r="50%">
			<stop offset="0%" stop-color="rgba(255,255,255,0)" />
			<stop offset="55%" stop-color="rgba(255,255,255,0.10)" />
			<stop offset="80%" stop-color="rgba(255,255,255,0.03)" />
			<stop offset="100%" stop-color="rgba(255,255,255,0)" />
		</radialGradient>
		<mask id="grooveMask{index}">
			<circle cx="150" cy="150" r="146" fill="white" />
			<circle cx="150" cy="150" r="70" fill="black" />
		</mask>
	</defs>

	<!-- spinning layer: disc body, grooves, scratches, dust -->
	<g class="spin-layer">
		<circle cx="150" cy="150" r="148" fill={`url(#vinylGrad${index})`} />
		{#each Array(28) as _, g}
			<circle
				cx="150"
				cy="150"
				r={142 - g * 4.2}
				fill="none"
				stroke="rgba(255,255,255,0.035)"
				stroke-width="1.2"
			/>
		{/each}
		{#each scratches as s}
			<path d={s.d} fill="none" stroke="rgba(255,255,255,{s.o})" stroke-width="0.7" />
		{/each}
		{#each specks as p}
			<circle cx={p.x} cy={p.y} r={p.rad} fill="rgba(255,255,255,{p.o})" />
		{/each}
	</g>

	<!-- fixed light streaks: the light source doesn't rotate with the disc -->
	<g mask={`url(#grooveMask${index})`}>
		<path d={wedge(-115, 16)} fill={`url(#streakGrad${index})`} />
		<path d={wedge(65, 16)} fill={`url(#streakGrad${index})`} />
	</g>

	<!-- label stays upright for readability -->
	<circle cx="150" cy="150" r="68" fill={`url(#labelGrad${index})`} />
	<circle cx="150" cy="150" r="65" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1" />
	<circle cx="150" cy="150" r="58" fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="0.8" />
	<text
		x="150"
		y="140"
		text-anchor="middle"
		font-family="'Bebas Neue', sans-serif"
		font-size="20"
		fill="rgba(0,0,0,0.8)"
		letter-spacing="3">{title}</text
	>
	<text
		x="150"
		y="158"
		text-anchor="middle"
		font-family="'Space Mono', monospace"
		font-size="7.5"
		fill="rgba(0,0,0,0.45)"
		letter-spacing="2">{sub}</text
	>
	{#if isActive}
		<text
			x="150"
			y="176"
			text-anchor="middle"
			font-family="'Space Mono', monospace"
			font-size="5.5"
			fill="rgba(0,0,0,0.35)"
			letter-spacing="1.5">open ↗</text
		>
	{:else}
		<text
			x="150"
			y="176"
			text-anchor="middle"
			font-family="'Space Mono', monospace"
			font-size="6"
			fill="rgba(0,0,0,0.3)"
			letter-spacing="1">33⅓ RPM</text
		>
	{/if}
	<circle cx="150" cy="150" r="5" fill="#111" />
	<circle cx="150" cy="150" r="3" fill="#1a1a1a" />
	<circle cx="150" cy="150" r="148" fill={`url(#shineGrad${index})`} />
</svg>

<style>
	.grooves {
		width: 300px;
		height: 300px;
		border-radius: 50%;
		display: block;
	}
	.spin-layer {
		transform-box: fill-box;
		transform-origin: center;
	}
	.spinning .spin-layer {
		animation: grooveSpin var(--spin-duration, 10s) linear infinite;
	}
	@keyframes grooveSpin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.spinning .spin-layer {
			animation: none;
		}
	}
</style>
