import { Show, type Accessor } from "solid-js";

import type { MidiPlaybackSnapshot } from "../lib/use-sound";
import { MusicPlayer } from "./music-player";

function HeaderCorners() {
  return (
    <>
      <span aria-hidden="true" class="pointer-events-none absolute bottom-0 left-0 z-10">
        <span class="absolute bottom-[-1px] left-[-1px] h-px w-2 bg-[var(--corner)]" />
        <span class="absolute bottom-[-8px] left-[-1px] h-4 w-px bg-[var(--corner)]" />
      </span>
      <span aria-hidden="true" class="pointer-events-none absolute right-0 bottom-0 z-10">
        <span class="absolute right-[-1px] bottom-[-1px] h-px w-2 bg-[var(--corner)]" />
        <span class="absolute right-[-1px] bottom-[-8px] h-4 w-px bg-[var(--corner)]" />
      </span>
    </>
  );
}

type HeaderProps = {
  activeTrackUrl: Accessor<string | null>;
  isMusicPlayerEnabled: Accessor<boolean>;
  isPlaying: Accessor<boolean>;
  midiPlayback: Accessor<MidiPlaybackSnapshot | null>;
};

export function Header(props: HeaderProps) {
  return (
    <header class="relative z-10 w-full">
      <div class="border-border relative mx-auto h-[max(6rem,calc((100vh-660px)/2))] w-full max-w-5xl overflow-visible border-x sm:h-[max(8rem,calc((100vh-660px)/2))]">
        <span
          aria-hidden="true"
          class="bg-border pointer-events-none absolute bottom-[-1px] left-1/2 h-px w-screen -translate-x-1/2"
        />
        <HeaderCorners />

        <Show when={props.isMusicPlayerEnabled()}>
          <MusicPlayer
            activeTrackUrl={props.activeTrackUrl}
            isPlaying={props.isPlaying}
            midiPlayback={props.midiPlayback}
          />
        </Show>
      </div>
    </header>
  );
}
