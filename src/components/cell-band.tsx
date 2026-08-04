import { For } from "solid-js";

import { cellTracks, createCellCount } from "../lib/cells";

/* The header meter's cell strip without the meter: a plain run of cells across a band. */
export function CellBand() {
  const cells = createCellCount("width");

  return (
    <div
      aria-hidden="true"
      class="grid h-full w-full"
      ref={cells.ref}
      style={{ "grid-template-columns": cellTracks(cells.count()) }}
    >
      <For each={Array.from({ length: cells.count() })}>
        {(_, index) => <div class={index() > 0 ? "border-border border-l" : ""} />}
      </For>
    </div>
  );
}
