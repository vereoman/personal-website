interface FooterProps {
  usesMacCommandKey: boolean;
}

export function Footer(props: FooterProps) {
  return (
    <footer class="section-tone-footer w-full">
      <div class="border-border relative mx-auto flex h-[max(6rem,calc((100vh-660px)/2))] w-full max-w-5xl items-center justify-end border-x px-6 sm:h-[max(8rem,calc((100vh-660px)/2))] sm:px-8">
        <span
          aria-hidden="true"
          class="bg-border pointer-events-none absolute z-10 top-[-1px] left-1/2 h-px w-screen -translate-x-1/2"
        />
        <span aria-hidden="true" class="pointer-events-none absolute top-0 left-0 z-10">
          <span class="absolute top-[-1px] left-[-1px] h-px w-2 bg-[var(--corner)]" />
          <span class="absolute top-[-8px] left-[-1px] h-4 w-px bg-[var(--corner)]" />
        </span>
        <span aria-hidden="true" class="pointer-events-none absolute top-0 right-0 z-10">
          <span class="absolute top-[-1px] right-[-1px] h-px w-2 bg-[var(--corner)]" />
          <span class="absolute top-[-8px] right-[-1px] h-4 w-px bg-[var(--corner)]" />
        </span>
        <p class="text-xs tracking-wide text-[var(--text-muted)] sm:text-sm">
          Press{" "}
          <span class="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-[var(--selected-surface)] px-1.5 align-middle text-[0.85em] text-[var(--text-subtle)]">
            <kbd
              aria-label={props.usesMacCommandKey ? "Command" : undefined}
              class="inline-flex font-mono"
            >
              {props.usesMacCommandKey ? (
                <svg
                  aria-hidden="true"
                  class="size-[1em]"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M180,144H160V112h20a36,36,0,1,0-36-36V96H112V76a36,36,0,1,0-36,36H96v32H76a36,36,0,1,0,36,36V160h32v20a36,36,0,1,0,36-36ZM160,76a20,20,0,1,1,20,20H160ZM56,76a20,20,0,0,1,40,0V96H76A20,20,0,0,1,56,76ZM96,180a20,20,0,1,1-20-20H96Zm16-68h32v32H112Zm68,88a20,20,0,0,1-20-20V160h20a20,20,0,0,1,0,40Z" />
                </svg>
              ) : (
                "ctrl"
              )}
            </kbd>
            +,
          </span>{" "}
          to tweak.
        </p>
      </div>
    </footer>
  );
}
