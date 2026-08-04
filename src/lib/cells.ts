import { createSignal, onCleanup } from "solid-js";

/*
 * One cell pitch for the whole frame: the header meter's original 36 cells across
 * a 64rem frame. Every cell strip measures itself, rounds its length to the
 * nearest whole number of cells at this pitch, and lays them out as 1fr tracks —
 * so cells stay a consistent size and always divide the strip exactly, with no
 * partial cell left at either end.
 */
export const CELL_PITCH = (64 * 16) / 36;

export function createCellCount(axis: "width" | "height") {
  const [count, setCount] = createSignal(1);
  let observer: ResizeObserver | undefined;

  onCleanup(() => observer?.disconnect());

  const ref = (element: HTMLElement) => {
    const measure = () => {
      const length = axis === "width" ? element.clientWidth : element.clientHeight;

      setCount(Math.max(1, Math.round(length / CELL_PITCH)));
    };

    observer?.disconnect();
    observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
  };

  return { count, ref };
}

export function cellTracks(count: number) {
  return `repeat(${count}, minmax(0, 1fr))`;
}
