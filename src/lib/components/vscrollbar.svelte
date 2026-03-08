<script>
  export let active = 0;
  let offset = "0%";

  $: offset = `${active * 100}%`;
  $: opacity = active === 1 ? 0 : 1;
</script>

<div class="fixed right-32 bottom-20 top-20 w-1 bg-[#1A1A1A] rounded-full self-stretch transition-opacity duration-500" style="opacity: {opacity};">
  <div class="bg-white h-1/2 transition-transform duration-500 ease-out" style="transform: translateY({offset})" ></div>
</div>