<script lang="ts">
  const skills = [
    { label: "Frontend", items: ["React", "SvelteKit", "TypeScript", "Tailwind"] },
    { label: "Mobile",   items: ["Flutter", "React Native", "Kotlin", "Android"] },
    { label: "Backend",  items: ["Rust", "Node.js", "Django", "Python", ] },
  ];

const facts = [
  "Full-stack, mobile, and somehow still not satisfied.",
  "Kotlin to Rust. React to Django.",
  "Chasing the intersection of clean architecture and beautiful interfaces.",
  "Drawing, coding, building.",
  "I make things work. Then I make them pretty. Then I refactor.",
];
</script>

<section
  class="h-screen snap-start flex items-center justify-center p-12 md:p-32 relative overflow-hidden"
>
  <!-- Subtle background glyph -->
  <span
    aria-hidden="true"
    class="absolute right-[-0.1em] top-1/2 -translate-y-1/2 font-forum text-[22vw] leading-none text-white/[0.025] select-none pointer-events-none"
  >
    &amp;
  </span>

  <div class="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

    <!-- LEFT — intro copy -->
    <div class="flex flex-col gap-8">
      <div>
        <p class="font-mono text-xs uppercase tracking-[0.25em] text-white/30 mb-3">
          About
        </p>
        <h2 class="font-forum text-6xl md:text-7xl leading-[1.05] text-white">
          Hi, I'm<br />
          <em class="not-italic text-white/60">Wreck.</em>
        </h2>
      </div>

      <p class="font-forum text-xl text-white/50 leading-relaxed max-w-md">
      A developer who values clean architecture and scalable system design.
      I enjoy building well-structured software and pairing it with thoughtful
      frontend experiences that make powerful systems easy to use.
      </p>
      <!-- Divider -->
      <div class="w-12 h-px bg-white/20"></div>

      <!-- Quick facts -->
      <ul class="flex flex-col gap-2">
        {#each facts as fact, i}
          <li class="flex items-start gap-3 text-white/40 font-forum text-base">
            <span class="font-mono text-xs text-white/20 mt-[0.35em] shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            {fact}
          </li>
        {/each}
      </ul>
    </div>

    <!-- RIGHT — skills grid + contact -->
    <div class="flex flex-col gap-10">

      <!-- Skills -->
      <div class="grid grid-cols-3 gap-6">
        {#each skills as group}
          <div class="flex flex-col gap-3">
            <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
              {group.label}
            </p>
            <ul class="flex flex-col gap-1.5">
              {#each group.items as item}
                <li class="font-forum text-sm text-white/50 hover:text-white/80 transition-colors duration-300 cursor-default">
                  {item}
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>

      <!-- Thin separator -->
      <div class="w-full h-px bg-white/10"></div>

      <!-- Contact / links -->
      <div class="flex flex-col gap-4">
        <p class="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
          Find me
        </p>
        <div class="flex flex-wrap gap-6">
          {#each [
            { label: "GitHub",   href: "https://github.com/Wreck-X" },
            { label: "Email",    href: "mailto:hemanthkrishnakumar@gmail.com" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/hemanth-krishnakumar/"}
          ] as link}
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              class="group flex items-center gap-2 font-forum text-sm text-white/40 hover:text-white transition-colors duration-300"
            >
              <!-- Animated arrow -->
              <span
                class="inline-block w-4 h-px bg-current transition-all duration-300 group-hover:w-6"
              ></span>
              {link.label}
            </a>
          {/each}
        </div>
      </div>

    </div>
  </div>
</section>

<style>
  /* Entrance animation — mirrors the subtle feel of the rest of the page */
  section {
    animation: fadeUp 0.6s ease both;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>