import type { JSX } from "solid-js";

import { SidePattern } from "./side-pattern";

interface PageFrameProps {
  children: JSX.Element;
  clean?: boolean;
}

export function PageFrame(props: PageFrameProps) {
  if (props.clean) {
    return (
      <main class="bg-background text-foreground relative flex min-h-screen items-center px-4 py-20 sm:px-6 sm:py-28">
        <section class="relative w-full">
          <div class="bg-background relative mx-auto flex w-full max-w-4xl flex-col md:min-h-[660px]">
            {props.children}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main class="bg-background text-foreground relative flex min-h-screen items-center px-4 py-20 sm:px-6 sm:py-28">
      <section class="relative w-full">
        <div class="border-border bg-background relative mx-auto flex w-full max-w-5xl flex-col border-x border-y md:min-h-[660px]">
          <SidePattern />
          <span
            aria-hidden="true"
            class="bg-border pointer-events-none absolute z-10 top-[-1px] left-1/2 h-px w-screen -translate-x-1/2"
          />
          <span
            aria-hidden="true"
            class="bg-border pointer-events-none absolute z-10 bottom-[-1px] left-1/2 h-px w-screen -translate-x-1/2"
          />
          <span
            aria-hidden="true"
            class="bg-border pointer-events-none absolute z-10 top-1/2 left-[-1px] h-screen w-px -translate-y-1/2"
          />
          <span
            aria-hidden="true"
            class="bg-border pointer-events-none absolute z-10 top-1/2 right-[-1px] h-screen w-px -translate-y-1/2"
          />
          <span aria-hidden="true" class="pointer-events-none absolute top-0 left-0 z-10">
            <span class="absolute top-[-1px] left-[-1px] h-px w-2 bg-[var(--corner)]" />
            <span class="absolute top-[-8px] left-[-1px] h-4 w-px bg-[var(--corner)]" />
          </span>
          <span aria-hidden="true" class="pointer-events-none absolute top-0 right-0 z-10">
            <span class="absolute top-[-1px] right-[-1px] h-px w-2 bg-[var(--corner)]" />
            <span class="absolute top-[-8px] right-[-1px] h-4 w-px bg-[var(--corner)]" />
          </span>
          <span aria-hidden="true" class="pointer-events-none absolute bottom-0 left-0 z-10">
            <span class="absolute bottom-[-1px] left-[-1px] h-px w-2 bg-[var(--corner)]" />
            <span class="absolute bottom-[-8px] left-[-1px] h-4 w-px bg-[var(--corner)]" />
          </span>
          <span aria-hidden="true" class="pointer-events-none absolute right-0 bottom-0 z-10">
            <span class="absolute right-[-1px] bottom-[-1px] h-px w-2 bg-[var(--corner)]" />
            <span class="absolute right-[-1px] bottom-[-8px] h-4 w-px bg-[var(--corner)]" />
          </span>

          {props.children}
        </div>
      </section>
    </main>
  );
}
