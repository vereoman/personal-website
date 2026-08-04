import { CellBand } from "./cell-band";

export function Footer() {
  return (
    <footer class="section-tone-footer w-full">
      <div class="border-border relative mx-auto h-[var(--band-size)] w-full max-w-[var(--frame-w)] border-x">
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

        <CellBand />
      </div>
    </footer>
  );
}
