<script>
	export let active = 0;
	$: offset = `${active * 100}%`;
	$: opacity = active === 1 || active === 2 ? 0 : 1;
	$: console.log('offset:', offset, active);
</script>

<div
	class="fixed top-16 right-4 bottom-16 z-50 hidden w-1 rounded-full bg-[#1A1A1A] transition-opacity duration-500 sm:block md:top-20 md:right-10 md:bottom-20 lg:right-32"
	style="opacity: {opacity};"
>
	<div
		class="h-1/3 rounded-full bg-white transition-transform duration-500 ease-out"
		style="transform: translateY({offset})"
	></div>
</div>
