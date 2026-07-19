import type { Accessor } from "solid-js";

import { PageFrame } from "../components/page-frame";
import { getMidiUrl, midiTracks } from "../config/midi-tracks";

interface TweaksPageProps {
  selectedMidiTrackUrl: Accessor<string | null>;
  isMusicPlayerEnabled: Accessor<boolean>;
  isStealthModeEnabled: Accessor<boolean>;
  onMusicPlayerToggle: () => void;
  onStealthModeToggle: () => void;
  onMidiTrackSelect: (url: string) => void;
}

export function TweaksPage(props: TweaksPageProps) {
  return (
    <PageFrame>
      <div class="flex flex-1 flex-col">
        <div class="grid flex-1 gap-px bg-[var(--grid-surface)] lg:grid-cols-2">
          <div class="bg-background flex flex-col">
            <SettingToggle
              title="Stealth Mode"
              enabled={props.isStealthModeEnabled}
              onToggle={props.onStealthModeToggle}
            />
            <SettingToggle
              title="Show the music player"
              enabled={props.isMusicPlayerEnabled}
              onToggle={props.onMusicPlayerToggle}
            />
          </div>
          <div class="bg-background flex flex-col" role="radiogroup" aria-label="Song">
            {midiTracks.map((track) => {
              const url = getMidiUrl(track);
              const selected = () => props.selectedMidiTrackUrl() === url;

              return (
                <label class="bg-background hover:bg-[var(--hover-surface)] flex h-14 cursor-pointer items-center justify-between gap-6 border-b border-[var(--grid-surface)] px-6 text-left transition-colors sm:px-8">
                  <span
                    class={`text-sm leading-snug font-normal tracking-wide transition-colors sm:text-base ${selected() ? "text-card-foreground" : "text-[var(--text-muted)]"}`}
                  >
                    {track.title}
                  </span>
                  <input
                    class="sr-only"
                    type="radio"
                    name="midi-track"
                    value={url}
                    checked={selected()}
                    onChange={() => props.onMidiTrackSelect(url)}
                  />
                  <ToggleIndicator enabled={selected()} />
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

interface SettingToggleProps {
  title: string;
  enabled: Accessor<boolean>;
  onToggle: () => void;
}

function SettingToggle(props: SettingToggleProps) {
  return (
    <label class="bg-background hover:bg-[var(--hover-surface)] flex h-14 cursor-pointer items-center justify-between gap-6 border-b border-[var(--grid-surface)] px-6 text-left transition-colors sm:px-8">
      <span class="text-card-foreground text-sm leading-snug font-normal tracking-wide sm:text-base">
        {props.title}
      </span>
      <input
        class="sr-only"
        type="checkbox"
        role="switch"
        checked={props.enabled()}
        onChange={props.onToggle}
      />
      <ToggleIndicator enabled={props.enabled()} />
    </label>
  );
}

function ToggleIndicator(props: { enabled: boolean }) {
  return (
    <span
      aria-hidden="true"
      class={`relative h-5 w-9 shrink-0 rounded-full border transition-colors ${props.enabled ? "border-primary bg-primary" : "border-[var(--text-muted)] bg-transparent"}`}
    >
      <span
        class={`absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all ${props.enabled ? "left-[17px] bg-primary-foreground" : "left-0.5 bg-[var(--text-muted)]"}`}
      />
    </span>
  );
}
