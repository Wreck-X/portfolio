<script>
  export let active = 0;

  // The indicator is 1/3 tall and translates by thirds
  $: offset = `${active * 100}%`;
$: opacity = active === 1 || active === 2 ? 0 : 1;
  $: console.log("offset:", offset, active);
</script>

<div
  class="fixed right-32 bottom-20 top-20 w-1 bg-[#1A1A1A] rounded-full transition-opacity duration-500 z-50"
  style="opacity: {opacity};"
>
  <div
    class="bg-white h-1/3 rounded-full transition-transform duration-500 ease-out"
    style="transform: translateY({offset})"
  ></div>
</div>