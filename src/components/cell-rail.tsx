import { For } from "solid-js";

import { cellTracks, createCellCount } from "../lib/cells";

type CellRailProps = {
  side: "left" | "right";
};

/* The side panel beside a section: the header meter's cells turned on their side. */
export function CellRail(props: CellRailProps) {
  const cells = createCellCount("height");

  return (
    <span
      aria-hidden="true"
      class={`pointer-events-none absolute top-0 grid h-full w-[var(--band)] ${
        props.side === "left" ? "right-[calc(100%+1px)]" : "left-[calc(100%+1px)]"
      }`}
      ref={cells.ref}
      style={{ "grid-template-rows": cellTracks(cells.count()) }}
    >
      <For each={Array.from({ length: cells.count() })}>
        {(_, index) => <span class={index() > 0 ? "border-border border-t" : ""} />}
      </For>
    </span>
  );
}
