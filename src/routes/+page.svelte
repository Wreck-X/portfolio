<script lang="ts">
	import Vinyl from "$lib/components/vinyl.svelte";
  import Vscrollbar from "$lib/components/vscrollbar.svelte"
  import { onMount } from "svelte";

  let container!: HTMLDivElement;
  let sections: HTMLElement[] = []
  let active = 0;

  onMount(() => {
    sections = Array.from(container.querySelectorAll<HTMLElement>("section"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry)=>{
          if (entry.isIntersecting) {
            active = sections.indexOf(entry.target as HTMLElement);
          }
        });
      },
      {
        root: container,
        threshold:0.6,
      }
    );

    sections.forEach((s) =>observer.observe(s));
  })
</script>

<div bind:this={container} class="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth">
  <section class="h-screen snap-start flex items-center justify-center p-32">
    <div class="max-w-7xl w-full">
      <h1 class="font-forum text-8xl pt-8">Wreck</h1>
      <h2 class="font-forum text-2xl">Building Software Products and Petting Cats</h2>
    </div>
  </section>
  <section class="h-screen snap-start flex items-center justify-center relative">
    <h2 class="font-forum text-5xl absolute top-32">Projects</h2>
    <Vinyl/>
  </section>
  <Vscrollbar {active}/>
</div>

