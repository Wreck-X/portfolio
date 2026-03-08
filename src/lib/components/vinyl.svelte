<script>
  import { onMount } from 'svelte';

  const cards = [
    { id: 1, title: "Ink", sub: "The Reader", url: "https://github.com/Wreck-X/ink" },
    { id: 2, title: "Browser", sub: "Prototype", url: "https://github.com/Wreck-X/browser-prototype" },
    { id: 3, title: "News", sub: "Block", url: "https://github.com/Wreck-X/news-block" },
    { id: 4, title: "Root", sub: "Club Backend", url: "https://github.com/Wreck-X/root" },
    { id: 5, title: "Terrace", sub: "Kotlin App", url: "https://github.com/Wreck-X/terrace" },
  ];

  const RADIUS = 320;
  const total = cards.length;
  const stepAngle = 360 / total;

  let angle = 0;
  let targetAngle = 0;
  let rafId;
  let paused = false;
  let snappedIndex = null;
  const speed = 0.3;

  function tick() {
    if (!paused) angle += speed;
    rafId = requestAnimationFrame(tick);
  }

  onMount(() => { rafId = requestAnimationFrame(tick); });

  function snapToCard(i) {
    paused = true;
    snappedIndex = i;
    const cardFrontAngle = -i * stepAngle;
    let current = targetAngle % 360;
    let diff = ((cardFrontAngle - current) % 360 + 540) % 360 - 180;
    targetAngle = targetAngle + diff;
    angle = targetAngle;
  }

  function unsnap() {
    angle = targetAngle;
    paused = false;
    snappedIndex = null;
  }

  function handleClick(i) {
    if (snappedIndex === i) {
      window.open(cards[i].url, '_blank');
    }
  }

  $: faceRotations = cards.map((_, i) => i === snappedIndex ? '0deg' : '90deg');
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="scene" on:mouseleave={unsnap}>
  <div class="stage-wrap">
    <div
      class="stage"
      style="transform: rotateX(-15deg) rotateY({angle}deg); transition: {snappedIndex !== null ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none'};"
    >
      {#each cards as card, i}
        {@const cardAngle = stepAngle * i}
        {@const isActive = i === snappedIndex}
        <div
          class="card-wrap"
          style="transform: rotateY({cardAngle}deg) translateZ({RADIUS}px) rotateY({faceRotations[i]}); transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);"
          on:mouseenter={() => snapToCard(i)}
          on:click={() => handleClick(i)}
          role="button"
          tabindex="0"
        >
          <div
            class="vinyl"
            style="
              opacity: {isActive ? 1 : 0.55};
              transform: {isActive ? 'translateZ(40px) scale(1.08)' : 'translateZ(0px) scale(1)'};
              transition: opacity 0.4s ease, transform 0.4s ease;
              cursor: {isActive ? 'pointer' : 'default'};
            "
          >
            <svg class="grooves" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="vinylGrad{i}" cx="50%" cy="35%" r="65%">
                  <stop offset="0%" stop-color="#3a3a3a" />
                  <stop offset="40%" stop-color="#0f0f0f" />
                  <stop offset="100%" stop-color="#050505" />
                </radialGradient>
                <radialGradient id="shineGrad{i}" cx="35%" cy="30%" r="55%">
                  <stop offset="0%" stop-color="rgba(255,255,255,0.18)" />
                  <stop offset="60%" stop-color="rgba(255,255,255,0.03)" />
                  <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                </radialGradient>
                <radialGradient id="labelGrad{i}" cx="45%" cy="38%" r="60%">
                  <stop offset="0%" stop-color="#ffffff" />
                  <stop offset="100%" stop-color="#e8e8e8" />
                </radialGradient>
              </defs>
              <!-- Base disc -->
              <circle cx="150" cy="150" r="148" fill={`url(#vinylGrad${i})`} />
              <!-- Groove rings -->
              {#each Array(28) as _, g}
                <circle
                  cx="150" cy="150"
                  r={142 - g * 4.2}
                  fill="none"
                  stroke="rgba(255,255,255,0.035)"
                  stroke-width="1.2"
                />
              {/each}
              <!-- White label -->
              <circle cx="150" cy="150" r="68" fill={`url(#labelGrad${i})`} />
              <!-- Label rings -->
              <circle cx="150" cy="150" r="65" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>
              <circle cx="150" cy="150" r="58" fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="0.8"/>
              <!-- Label text -->
              <text x="150" y="140" text-anchor="middle" font-family="'Bebas Neue', sans-serif" font-size="20" fill="rgba(0,0,0,0.8)" letter-spacing="3">{card.title}</text>
              <text x="150" y="158" text-anchor="middle" font-family="'Space Mono', monospace" font-size="7.5" fill="rgba(0,0,0,0.45)" letter-spacing="2">{card.sub}</text>
              <!-- "Click to visit" hint only on active -->
              {#if isActive}
                <text x="150" y="176" text-anchor="middle" font-family="'Space Mono', monospace" font-size="5.5" fill="rgba(0,0,0,0.35)" letter-spacing="1.5">github ↗</text>
              {:else}
                <text x="150" y="176" text-anchor="middle" font-family="'Space Mono', monospace" font-size="6" fill="rgba(0,0,0,0.3)" letter-spacing="1">33⅓ RPM</text>
              {/if}
              <!-- Spindle hole -->
              <circle cx="150" cy="150" r="5" fill="#111" />
              <circle cx="150" cy="150" r="3" fill="#1a1a1a" />
              <!-- Shine overlay -->
              <circle cx="150" cy="150" r="148" fill={`url(#shineGrad${i})`} />
            </svg>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    background: #09090b;
  }
  .scene {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    user-select: none;
  }
  .stage-wrap {
    position: relative;
    height: 340px;
    width: 900px;
    perspective: 1200px;
    overflow: visible;
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
    filter: drop-shadow(0 8px 32px rgba(0,0,0,0.7));
  }
  .grooves {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    display: block;
  }
</style>