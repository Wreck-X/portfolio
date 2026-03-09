<script>
// @ts-nocheck
  import { onMount } from 'svelte';

  const cards = [
    { id: 1, title: "Ink", sub: "The Epub Reader", url: "https://github.com/Wreck-X/ink", description: "A minimal, distraction-free reading app built for long-form content. Ink strips away the noise and lets the words breathe — clean typography, quiet interface, pure focus." },
    { id: 2, title: "Browser", sub: "Prototype", url: "https://github.com/Wreck-X/browser-prototype", description: "An experimental browser prototype exploring alternative paradigms for navigating the web. Built to question assumptions about tabs, history, and how we move through information." },
    { id: 3, title: "News", sub: "Block", url: "https://github.com/Wreck-X/news-block", description: "A focused news aggregator that surfaces signal over noise. News Block curates headlines into digestible blocks, giving you a clear picture of the day without the scroll-bait." },
    { id: 4, title: "Root", sub: "Club Backend", url: "https://github.com/Wreck-X/root", description: "The backbone of a club management system. Root handles memberships, events, and permissions — a robust backend built to keep communities organised and running smoothly." },
    { id: 5, title: "Terrace", sub: "Kotlin App", url: "https://github.com/Wreck-X/terrace", description: "A native Android app written in Kotlin. Terrace brings a calm, structured space to your phone — designed with modern Android architecture and a considered, minimal UI." },
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

  function prev() { goTo(currentIndex - 1); }
  function next() { goTo(currentIndex + 1); }

  function handleClick() {
    if (!transitioning) {
      clickedCard = cards[currentIndex];
      transitioning = true;
      setTimeout(() => { transitionDone = true; }, 700);
    }
  }

  function goBack() {
    transitionDone = false;
    transitioning = false;
    clickedCard = null;
  }

  $: faceRotations = cards.map((_, i) => i === currentIndex ? '0deg' : '90deg');
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
</svelte:head>

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
        <span class="header-count">{String(cards.length).padStart(2,'0')} records</span>
      </div>
    </header>

    <div class="scene">
      <!-- Left button -->
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
              style="transform: rotateY({cardAngle}deg) translateZ({RADIUS}px) rotateY({faceRotations[i]}); transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);"
              on:click={handleClick}
              role="button"
              tabindex="0"
            >
              <div
                class="vinyl"
                style="
                  transform: {isActive ? 'translateZ(40px) scale(1.25)' : 'translateZ(0px) scale(1)'};
                  transition: transform 0.4s ease;
                  cursor: {isActive ? 'pointer' : 'default'};
                  filter: {isActive
                    ? 'drop-shadow(0 0 32px rgba(255,255,255,0.1)) drop-shadow(0 16px 48px rgba(0,0,0,0.95))'
                    : 'drop-shadow(0 8px 32px rgba(0,0,0,0.7))'};
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
                  <circle cx="150" cy="150" r="148" fill={`url(#vinylGrad${i})`} />
                  {#each Array(28) as _, g}
                    <circle cx="150" cy="150" r={142 - g * 4.2} fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1.2" />
                  {/each}
                  <circle cx="150" cy="150" r="68" fill={`url(#labelGrad${i})`} />
                  <circle cx="150" cy="150" r="65" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>
                  <circle cx="150" cy="150" r="58" fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="0.8"/>
                  <text x="150" y="140" text-anchor="middle" font-family="'Bebas Neue', sans-serif" font-size="20" fill="rgba(0,0,0,0.8)" letter-spacing="3">{card.title}</text>
                  <text x="150" y="158" text-anchor="middle" font-family="'Space Mono', monospace" font-size="7.5" fill="rgba(0,0,0,0.45)" letter-spacing="2">{card.sub}</text>
                  {#if isActive}
                    <text x="150" y="176" text-anchor="middle" font-family="'Space Mono', monospace" font-size="5.5" fill="rgba(0,0,0,0.35)" letter-spacing="1.5">open ↗</text>
                  {:else}
                    <text x="150" y="176" text-anchor="middle" font-family="'Space Mono', monospace" font-size="6" fill="rgba(0,0,0,0.3)" letter-spacing="1">33⅓ RPM</text>
                  {/if}
                  <circle cx="150" cy="150" r="5" fill="#111" />
                  <circle cx="150" cy="150" r="3" fill="#1a1a1a" />
                  <circle cx="150" cy="150" r="148" fill={`url(#shineGrad${i})`} />
                </svg>
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
        <span class="card-info-index">{String(currentIndex + 1).padStart(2,'0')} / {String(cards.length).padStart(2,'0')}</span>
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
              <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="dVinylGrad" cx="50%" cy="35%" r="65%">
                    <stop offset="0%" stop-color="#3a3a3a" />
                    <stop offset="40%" stop-color="#0f0f0f" />
                    <stop offset="100%" stop-color="#050505" />
                  </radialGradient>
                  <radialGradient id="dShineGrad" cx="35%" cy="30%" r="55%">
                    <stop offset="0%" stop-color="rgba(255,255,255,0.18)" />
                    <stop offset="60%" stop-color="rgba(255,255,255,0.03)" />
                    <stop offset="100%" stop-color="rgba(255,255,255,0)" />
                  </radialGradient>
                  <radialGradient id="dLabelGrad" cx="45%" cy="38%" r="60%">
                    <stop offset="0%" stop-color="#ffffff" />
                    <stop offset="100%" stop-color="#e8e8e8" />
                  </radialGradient>
                </defs>
                <circle cx="150" cy="150" r="148" fill="url(#dVinylGrad)" />
                {#each Array(28) as _, g}
                  <circle cx="150" cy="150" r={142 - g * 4.2} fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1.2" />
                {/each}
                <circle cx="150" cy="150" r="68" fill="url(#dLabelGrad)" />
                <circle cx="150" cy="150" r="65" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1"/>
                <circle cx="150" cy="150" r="58" fill="none" stroke="rgba(0,0,0,0.07)" stroke-width="0.8"/>
                <text x="150" y="140" text-anchor="middle" font-family="'Bebas Neue', sans-serif" font-size="20" fill="rgba(0,0,0,0.8)" letter-spacing="3">{clickedCard.title}</text>
                <text x="150" y="158" text-anchor="middle" font-family="'Space Mono', monospace" font-size="7.5" fill="rgba(0,0,0,0.45)" letter-spacing="2">{clickedCard.sub}</text>
                <text x="150" y="176" text-anchor="middle" font-family="'Space Mono', monospace" font-size="6" fill="rgba(0,0,0,0.3)" letter-spacing="1">33⅓ RPM</text>
                <circle cx="150" cy="150" r="5" fill="#111" />
                <circle cx="150" cy="150" r="3" fill="#1a1a1a" />
                <circle cx="150" cy="150" r="148" fill="url(#dShineGrad)" />
              </svg>
            </div>
          </div>
          <div class="pane-divider"></div>
          <div class="pane pane-right">
            <p class="detail-sub">{clickedCard.sub}</p>
            <h1 class="detail-title">{clickedCard.title}</h1>
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
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 65% 50% at 50% 58%, rgba(255,255,255,0.028) 0%, transparent 70%),
      radial-gradient(ellipse 35% 25% at 15% 85%, rgba(60,60,110,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 35% 25% at 85% 15%, rgba(60,100,70,0.055) 0%, transparent 60%);
    pointer-events: none; z-index: 0;
  }

  .bg-scanlines {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      0deg, transparent, transparent 3px,
      rgba(0,0,0,0.055) 3px, rgba(0,0,0,0.055) 4px
    );
    pointer-events: none; z-index: 0;
  }
  .bg-vignette {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 100% 100% at 50% 50%, transparent 35%, rgba(0,0,0,0.78) 100%);
    pointer-events: none; z-index: 0;
  }

  .site-header {
    position: absolute; top: 0; left: 0; right: 0; z-index: 10;
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.5rem 2.2rem;
    border-bottom: 1px solid rgba(255,255,255,0.055);
  }
  .header-left { display: flex; align-items: center; gap: 0.8rem; }
  .header-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem; letter-spacing: 0.18em; color: #fff;
  }
  .header-divider {
    color: rgba(255,255,255,0.13);
    font-family: 'Space Mono', monospace; font-size: 0.75rem;
  }
  .header-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.62rem; letter-spacing: 0.22em;
    text-transform: uppercase; color: rgba(255,255,255);
  }
  .header-right {
    font-family: 'Space Mono', monospace;
    font-size: 0.62rem; letter-spacing: 0.2em; color: rgba(255,255,255);
  }

  .hint-corner {
    position: absolute; top: 5.2rem; right: 2.2rem; z-index: 10;
    font-family: 'Space Mono', monospace;
    font-size: 0.57rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,255,255);
    display: flex; align-items: center; gap: 0.5rem;
  }

  .scene {
    display: flex; align-items: center; justify-content: center;
    width: 100%; height: 100%;
    user-select: none; position: relative; z-index: 5;
  }
  .stage-wrap {
    position: relative; height: 340px; width: 900px;
    perspective: 1200px; transform: scale(0.5); overflow: visible;
  }
  .stage {
    position: absolute; inset: 0;
    transform-style: preserve-3d; transform-origin: center center;
  }
  .card-wrap {
    position: absolute; width: 300px; height: 300px;
    left: 50%; top: 50%; margin-left: -150px; margin-top: -150px;
    transform-style: preserve-3d;
  }
  .vinyl {
    width: 300px; height: 300px;
    border-radius: 50%; transform-style: preserve-3d;
  }
  .grooves { width: 300px; height: 300px; border-radius: 50%; display: block; }

  .card-info-strip {
    position: absolute; bottom: 0; left: 0; right: 0; z-index: 10;
    padding: 1.2rem 2.2rem;
    border-top: 1px solid rgba(255,255,255,0.055);
    min-height: 52px; display: flex; align-items: center;
  }
  .card-info-inner { display: flex; align-items: center; gap: 1rem; width: 100%; }
  .card-info-inner.active { animation: fadeSlideUp 0.25s ease forwards; }
  .card-info-index {
    font-family: 'Space Mono', monospace;
    font-size: 0.58rem; letter-spacing: 0.14em; color: rgba(255,255,255,0.18);
  }
  .card-info-sep { color: rgba(255,255,255,0.1); font-family: 'Space Mono', monospace; }
  .card-info-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.05rem; letter-spacing: 0.14em; color: rgba(255,255,255,0.88);
  }
  .card-info-sub {
    font-family: 'Space Mono', monospace;
    font-size: 0.58rem; letter-spacing: 0.18em;
    text-transform: uppercase; color: rgba(255,255,255,0.28);
  }
  .card-info-cta {
    font-family: 'Space Mono', monospace;
    font-size: 0.58rem; letter-spacing: 0.14em;
    color: rgba(255,255,255); font-style: italic; margin-left: auto;
  }
  .card-info-hint {
    font-family: 'Space Mono', monospace;
    font-size: 0.58rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(255,255,255,0.1); font-style: italic;
  }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(5px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .blank-screen {
    background: #09090b; transform: translateY(100%);
    z-index: 2; display: flex; align-items: center; justify-content: center;
  }
  .blank-screen.slide-in { transform: translateY(0); }

  .detail-page {
    position: relative;
    width: 100%; height: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem; box-sizing: border-box;
    animation: fadeIn 0.4s ease forwards;
  }

  .back-btn {
    position: absolute;
    top: 1.5rem;
    left: 2.2rem;
    font-family: 'Space Mono', monospace;
    font-size: 0.72rem; letter-spacing: 0.15em;
    color: rgba(255,255,255,0.28); background: none; border: none;
    cursor: pointer; padding: 0;
    transition: color 0.2s ease;
  }
  .back-btn:hover { color: rgba(255,255,255,0.72); }

  .detail-box {
    display: flex; flex-direction: row;
    width: 100%; max-width: 860px;
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 4px; overflow: hidden; background: #0d0d0f;
  }
  .pane { display: flex; align-items: center; justify-content: center; padding: 3rem; }
  .pane-left { flex: 0 0 340px; background: #0a0a0c; }
  .pane-divider { width: 1px; background: rgba(255,255,255,0.1); flex-shrink: 0; }
  .pane-right { flex: 1; flex-direction: column; align-items: flex-start; gap: 0; }

  .detail-vinyl {
    width: 220px; height: 220px; border-radius: 50%;
    animation: spinSlow 18s linear infinite;
  }
  .detail-vinyl svg { width: 100%; height: 100%; border-radius: 50%; display: block; }
  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .detail-sub {
    font-family: 'Space Mono', monospace;
    font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); margin: 0 0 0.6rem 0;
  }
  .detail-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 4.5rem; letter-spacing: 0.06em;
    color: #ffffff; margin: 0 0 1.4rem 0; line-height: 1;
  }
  .detail-desc {
    font-family: 'Space Mono', monospace;
    font-size: 0.7rem; line-height: 1.9;
    color: rgba(255,255,255,0.42); margin: 0 0 2.2rem 0; max-width: 340px;
  }
  .github-btn {
    display: inline-block; font-family: 'Space Mono', monospace;
    font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: #09090b; background: #ffffff; border: none;
    padding: 0.65rem 1.4rem; cursor: pointer; text-decoration: none;
    transition: background 0.2s ease;
  }
  .github-btn:hover { background: rgba(255,255,255,0.82); }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

    .scene {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    width: 100%; height: 100%;
    user-select: none; position: relative; z-index: 5;
  }

.nav-btn {
  font-family: 'Space Mono', monospace;
  font-size: 2rem;
  color: rgba(255,255,255,0.08);
  background: none;
  border: none;
  padding: 1rem 2rem;
  cursor: pointer;
  transition: color 0.3s ease;
  z-index: 10;
  flex-shrink: 0;
  align-self: stretch; /* fills full height of the flex row */
  display: flex;
  align-items: center;
}
.nav-btn:hover {
  color: rgba(255,255,255,0.35);
}
</style>