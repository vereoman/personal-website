export function Footer() {
  return (
    <footer class="w-full">
      <div class="border-border relative mx-auto flex h-[max(6rem,calc((100vh-660px)/2))] w-full max-w-5xl items-center border-x sm:h-[max(8rem,calc((100vh-660px)/2))]">
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
      </div>
    </footer>
  );
}
