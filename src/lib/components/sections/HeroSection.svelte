<script>
	import Blog from "../ui/Blog.svelte";
	import Spotify from "../ui/Spotify.svelte";
</script>

<section class="relative flex h-screen snap-start items-center justify-center p-6 sm:p-12 md:p-20 lg:p-32">
  <div class="w-full max-w-7xl">
    <h1 class="font-forum text-5xl sm:text-6xl md:text-7xl lg:text-8xl pt-2">Wreck</h1>
    <h2 class="font-forum text-base sm:text-lg md:text-xl lg:text-2xl text-white/60">Building Software Products and Petting Cats</h2>
  </div>
  <div class="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex flex-col gap-3 z-50">
    <Spotify/>
    <Blog/>
  </div>
</section>
