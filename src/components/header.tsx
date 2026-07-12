import { For, Show, type Accessor } from "solid-js";

import { createBatteryStatus } from "../lib/use-battery-status";
import type { MidiPlaybackSnapshot } from "../lib/use-sound";
import { MusicPlayer } from "./music-player";

const batterySegments = Array.from({ length: 36 });

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
  isBatteryStatusEnabled: Accessor<boolean>;
  isPlaying: Accessor<boolean>;
  midiPlayback: Accessor<MidiPlaybackSnapshot | null>;
};

export function Header(props: HeaderProps) {
  const battery = createBatteryStatus(batterySegments.length);
  const batteryStatus = () => (props.isBatteryStatusEnabled() ? battery.status() : undefined);

  const batteryCellClass = (index: number) => {
    const isWithinLevel = index < battery.litSegments();
    const isChargingActive = battery.isCharging() && index < battery.chargingSegments();
    const borderClass = index > 0 ? "border-l border-border" : "";

    if (!isWithinLevel) return `bg-transparent ${borderClass}`;

    const fillClass =
      isChargingActive || !battery.isCharging() ? "bg-[var(--meter-fill)]" : "bg-card";

    return `${fillClass} ${borderClass}`;
  };

  return (
    <header class="relative z-10 w-full">
      <div class="border-border relative mx-auto h-[max(6rem,calc((100vh-660px)/2))] w-full max-w-5xl overflow-visible border-x sm:h-[max(8rem,calc((100vh-660px)/2))]">
        <span
          aria-hidden="true"
          class="bg-border pointer-events-none absolute bottom-[-1px] left-1/2 h-px w-screen -translate-x-1/2"
        />
        <HeaderCorners />

        <Show
          when={props.isMusicPlayerEnabled()}
          fallback={
            <Show when={batteryStatus()}>
              <output
                aria-label={`Device battery ${battery.level()} percent${battery.isCharging() ? ", charging" : ""}`}
                class="relative h-full"
              >
                <div aria-hidden="true" class="grid h-full grid-cols-36">
                  <For each={batterySegments}>
                    {(_, index) => <div class={batteryCellClass(index())} />}
                  </For>
                </div>
              </output>
            </Show>
          }
        >
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
