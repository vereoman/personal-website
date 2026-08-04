import { For, type Accessor } from "solid-js";

import { midiTrackUrl } from "../config/midi-tracks";
import { cellTracks, createCellCount } from "../lib/cells";
import type { MidiPlaybackSnapshot } from "../lib/use-sound";

type MusicPlayerProps = {
  midiPlayback: Accessor<MidiPlaybackSnapshot | null>;
};

export function MusicPlayer(props: MusicPlayerProps) {
  const cells = createCellCount("width");
  const progressRatio = () => {
    const playback = props.midiPlayback();

    if (!playback || playback.url !== midiTrackUrl || playback.durationSeconds <= 0) {
      return 0;
    }

    return Math.min(playback.progressSeconds / playback.durationSeconds, 1);
  };
  const litSegments = () => Math.round(progressRatio() * cells.count());
  const progressCellClass = (index: number) => {
    const isWithinProgress = index < litSegments();
    const borderClass = index > 0 ? "border-l border-border" : "";
    const fillClass = isWithinProgress ? "bg-[var(--meter-fill)]" : "bg-transparent";

    return `${fillClass} ${borderClass}`;
  };

  return (
    <div class="h-full w-full">
      <output
        aria-label={`Playback progress ${Math.round(progressRatio() * 100)} percent`}
        class="relative h-full"
      >
        <div
          aria-hidden="true"
          class="grid h-full"
          ref={cells.ref}
          style={{ "grid-template-columns": cellTracks(cells.count()) }}
        >
          <For each={Array.from({ length: cells.count() })}>
            {(_, index) => <div class={progressCellClass(index())} />}
          </For>
        </div>
      </output>
    </div>
  );
}
