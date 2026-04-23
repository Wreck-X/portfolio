<script lang="ts">  
  export let title: string;  
  export let sub: string;  
  export let isActive: boolean;  
  export let index: number;  
</script>  

<svg class="grooves" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
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
    </defs>
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
    <circle cx="150" cy="150" r="68" fill={`url(#labelGrad${index})`} />
    <circle
        cx="150"
        cy="150"
        r="65"
        fill="none"
        stroke="rgba(0,0,0,0.12)"
        stroke-width="1"
    />
    <circle
        cx="150"
        cy="150"
        r="58"
        fill="none"
        stroke="rgba(0,0,0,0.07)"
        stroke-width="0.8"
    />
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
</style>