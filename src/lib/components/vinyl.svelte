<script>
  import { onMount, onDestroy } from 'svelte';

  const cards = [
    { id: 1, title: "Aurora", sub: "Northern Lights", from: "#ffffff", to: "#ffffff" },
    { id: 2, title: "Solaris", sub: "Solar Flares", from: "#ffffff", to: "#ffffff" },
    { id: 3, title: "Nebula", sub: "Deep Space", from: "#ffffff", to: "#ffffff" },
    { id: 4, title: "Abyssal", sub: "Ocean Floor", from: "#ffffff", to: "#ffffff" },
    { id: 5, title: "Terra", sub: "Forest Depths", from: "#ffffff", to: "#ffffff" },
    { id: 6, title: "Terra", sub: "Forest Depths", from: "#ffffff", to: "#ffffff" },
    { id: 7, title: "Terra", sub: "Forest Depths", from: "#ffffff", to: "#ffffff" },
    { id: 8, title: "Terra", sub: "Forest Depths", from: "#ffffff", to: "#ffffff" },
    { id: 9, title: "Terra", sub: "Forest Depths", from: "#ffffff", to: "#ffffff" },
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

  $: faceRotations = cards.map((_, i) => i === snappedIndex ? '0deg' : '90deg');
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
</svelte:head>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="scene" on:mouseleave={unsnap}>
  <div class="stage-wrap">
    <div
      class="stage"
      style="transform: rotateX(-15deg) rotateY({angle}deg); transition: {snappedIndex !== null ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none'};"
    >
      {#each cards as card, i}
        {@const cardAngle = stepAngle * i}
        {@const isActive = i === snappedIndex}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="card-wrap"
          style="transform: rotateY({cardAngle}deg) translateZ({RADIUS}px) rotateY({faceRotations[i]}); transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);"
          on:mouseenter={() => snapToCard(i)}
        >
          <div
            class="card"
            style="
              background: linear-gradient(135deg, {card.from}, {card.to});
              opacity: {isActive ? 1 : 0.5};
              transform: {isActive ? 'translateZ(40px) scale(1.08)' : 'translateZ(0px) scale(1)'};
              transition: opacity 0.4s ease, transform 0.4s ease;
              transform-style: preserve-3d;
            "
          >
            <div class="card-text">
              <div class="card-title">{card.title}</div>
              <div class="card-sub">{card.sub}</div>
            </div>
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
    cursor: pointer;
  }
  .card {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }
  .card-text { text-align: center; }
  .card-title {
    color: #09090b;
    font-size: 36px;
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.15em;
  }
  .card-sub {
    color: rgba(0,0,0,0.45);
    font-size: 11px;
    font-family: 'Space Mono', monospace;
    letter-spacing: 0.3em;
    margin-top: 4px;
  }
</style>