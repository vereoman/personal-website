type InteractiveProps = {
  onPress: () => void;
};

export function About(props: InteractiveProps) {
  return (
    <section class="w-full">
      <div
        id="about"
        class="border-border bg-background relative mx-auto grid w-full max-w-6xl content-center border-x border-t px-8 py-14 sm:px-12 md:h-[min(66vw,660px)] md:min-h-[360px] md:px-16 md:py-0"
        onPointerDown={props.onPress}
      >
        <span
          aria-hidden="true"
          class="bg-border pointer-events-none absolute top-[-1px] left-1/2 h-px w-screen -translate-x-1/2"
        />
        <span aria-hidden="true" class="pointer-events-none absolute top-0 left-0 z-10">
          <span class="absolute top-[-1px] left-[-1px] h-px w-2 bg-[var(--corner)]" />
          <span class="absolute top-[-8px] left-[-1px] h-4 w-px bg-[var(--corner)]" />
        </span>
        <span aria-hidden="true" class="pointer-events-none absolute top-0 right-0 z-10">
          <span class="absolute top-[-1px] right-[-1px] h-px w-2 bg-[var(--corner)]" />
          <span class="absolute top-[-8px] right-[-1px] h-4 w-px bg-[var(--corner)]" />
        </span>

        <div class="mx-auto max-w-xl">
          <h2 class="text-foreground text-left text-xl font-semibold sm:text-2xl">What I do?</h2>
          <p class="mt-6 text-left text-lg leading-relaxed text-[var(--text-subtle)] sm:text-xl md:text-justify">
            I'm Arman Kar, a software developer. I thrive on building clear, practical interfaces at
            the application layer where humans meet software. Most of my work is on the frontend,
            shaping how products behave rather than just how they look.
          </p>
          <p class="mt-6 text-left text-lg leading-relaxed text-[var(--text-subtle)] sm:text-xl md:text-justify">
            Here are my most active socials. View my work on{" "}
            <a
              href="https://github.com/armancurr"
              class="hover:text-foreground inline-flex items-baseline gap-1.5 font-semibold transition-colors"
              rel="noreferrer"
              target="_blank"
            >
              <span
                aria-hidden="true"
                class="inline-block size-[0.9em] shrink-0 translate-y-[0.08em] bg-current [mask:url('/github.svg')_center/contain_no-repeat]"
              />
              GitHub
            </a>
            and follow me on{" "}
            <a
              href="https://twitter.com/rrucnamra"
              class="hover:text-foreground inline-flex items-baseline gap-1.5 font-semibold transition-colors"
              rel="noreferrer"
              target="_blank"
            >
              <span
                aria-hidden="true"
                class="inline-block size-[0.95em] shrink-0 translate-y-[0.1em] bg-current [mask:url('/twitter.svg')_center/contain_no-repeat]"
              />
              Twitter
            </a>
            .
            {/* , connect on{" "}
            <a
              href="https://www.linkedin.com/in/armancurr/"
              class="hover:text-foreground inline-flex items-baseline gap-1.5 font-semibold transition-colors"
              rel="noreferrer"
              target="_blank"
            >
              <span
                aria-hidden="true"
                class="inline-block size-[0.95em] shrink-0 translate-y-[0.1em] bg-current [mask:url('/linkedin.svg')_center/contain_no-repeat]"
              />
              LinkedIn
            </a> */}
          </p>
        </div>
      </div>
    </section>
  );
}
