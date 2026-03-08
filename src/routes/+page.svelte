<script lang="ts">
  import Vinyl from "$lib/components/vinyl.svelte";
  import Vscrollbar from "$lib/components/vscrollbar.svelte";
  import { onMount } from "svelte";

  let container!: HTMLDivElement;
  let sections: HTMLElement[] = [];
  let active = 0;

  let track = {
    name: "Loading...",
    artist: "",
    url: "#",
    isPlaying: false,
  };

  onMount(async () => {
    sections = Array.from(container.querySelectorAll<HTMLElement>("section"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            active = sections.indexOf(entry.target as HTMLElement);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );
    sections.forEach((s) => observer.observe(s));

    try {
      const res = await fetch("/api/now-playing");
      if (res.ok) track = await res.json();
    } catch {
      track = { name: "No track playing", artist: "", url: "#", isPlaying: false };
    }
  });
</script>

<!-- Scroll container -->
<div
  bind:this={container}
  class="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth"
>
<section class="h-screen snap-start flex items-center justify-center p-32 relative">
  <div class="max-w-7xl w-full">
    <h1 class="font-forum text-8xl pt-2">Wreck</h1>
    <h2 class="font-forum text-2xl text-white/60">Building Software Products and Petting Cats</h2>
  </div>

  <!-- Spotify + Blog -->
  <div class="absolute bottom-10 left-10 flex flex-col gap-3 z-50">
    <!-- Spotify Now Playing -->
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      class="group flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-300"
    >
      <svg
        class="w-4 h-4 shrink-0 {track.isPlaying ? 'text-[#1DB954]' : 'text-white/30'} transition-colors duration-500"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
      <div class="flex flex-col leading-tight">
        <span class="text-xs font-mono uppercase tracking-widest text-white/30">
          {track.isPlaying ? "now playing" : "last played"}
        </span>
        <span class="text-sm font-forum truncate max-w-[180px]">
          {track.name}{track.artist ? ` — ${track.artist}` : ""}
        </span>
      </div>
    </a>
      <!-- spotify svg -->


    <!-- Blog link -->
  <a
    href="/blog"
    class="group flex items-center gap-3 text-white/60 hover:text-white transition-colors duration-300"
  >
    <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
    </svg>
    <span class="text-sm font-forum">Blog</span>
  </a>
      <!-- blog svg -->

  </div>
</section>

  <section class="h-screen snap-start flex items-center justify-center relative">
    <h2 class="font-forum text-5xl absolute top-32">Projects</h2>
    <Vinyl />
  </section>
</div>

<!-- Fixed UI — lives outside the scroll container so it never moves -->
<Vscrollbar {active} />

