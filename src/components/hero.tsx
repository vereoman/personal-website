export function Hero() {
  return (
    <section class="relative w-full">
      <div class="site-pattern pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2" />

      <div class="border-border bg-background relative mx-auto w-full max-w-5xl cursor-crosshair overflow-hidden border-x border-t">
        <span aria-hidden="true" class="pointer-events-none absolute top-0 left-0 z-10">
          <span class="absolute top-[-1px] left-[-1px] h-px w-2 bg-[var(--corner)]" />
          <span class="absolute top-[-8px] left-[-1px] h-4 w-px bg-[var(--corner)]" />
        </span>
        <div
          class="absolute top-1/2 left-1/2 rounded-full blur-[24px]"
          style={{
            width: "min(90vw, 980px)",
            height: "min(90vw, 980px)",
            background:
              "radial-gradient(circle, transparent 41%, var(--hero-ring-outer) 55%, var(--hero-ring-outer-soft) 64%, transparent 75%)",
            transform: "translate(-50%, -50%)",
            opacity: 0.72,
          }}
        />
        <div
          class="absolute top-1/2 left-1/2 rounded-full blur-[20px]"
          style={{
            width: "min(72vw, 760px)",
            height: "min(72vw, 760px)",
            background:
              "radial-gradient(circle, transparent 31%, var(--hero-ring-middle) 47%, var(--hero-ring-middle-soft) 57%, transparent 67%)",
            transform: "translate(-50%, -50%)",
            opacity: 0.8,
          }}
        />
        <div
          class="absolute top-1/2 left-1/2 rounded-full blur-[16px]"
          style={{
            width: "min(50vw, 520px)",
            height: "min(50vw, 520px)",
            background:
              "radial-gradient(circle, transparent 20%, var(--hero-ring-inner) 36%, var(--hero-ring-inner-soft) 47%, transparent 58%)",
            transform: "translate(-50%, -50%)",
            opacity: 0.78,
          }}
        />
        <div
          class="absolute top-1/2 left-1/2 rounded-full blur-[12px]"
          style={{
            width: "min(24vw, 220px)",
            height: "min(24vw, 220px)",
            background:
              "radial-gradient(circle, var(--hero-core) 36%, color-mix(in oklab, var(--hero-core) 72%, transparent) 60%, transparent 80%)",
            transform: "translate(-50%, -50%)",
          }}
        />

        <div
          class="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 48%, var(--hero-vignette) 76%, var(--hero-core) 90%)",
          }}
        />

        <svg class="pointer-events-none absolute inset-0 h-full w-full opacity-[0.36] mix-blend-overlay">
          <filter id="n1">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="1"
              stitchTiles="stitch"
            />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 8 -3" />
          </filter>
          <rect width="100%" height="100%" filter="url(#n1)" />
        </svg>

        <svg class="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08] mix-blend-screen">
          <filter id="n2">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.2"
              numOctaves="1"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#n2)" />
        </svg>

        <h1 class="sr-only">Arman Kar, Software Developer</h1>
        <div class="h-[min(66vw,660px)] min-h-[360px]" />
      </div>
    </section>
  );
}
