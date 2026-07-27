import { For, type Accessor } from "solid-js";

import { PageFrame } from "../components/page-frame";
import { customFavicons } from "../config/custom-favicons";
import { getMidiUrl, midiTracks } from "../config/midi-tracks";

interface TweaksPageProps {
  selectedCustomFaviconId: Accessor<string | null>;
  selectedMidiTrackUrl: Accessor<string | null>;
  areCustomFaviconsEnabled: Accessor<boolean>;
  isMusicPlayerEnabled: Accessor<boolean>;
  isStealthModeEnabled: Accessor<boolean>;
  onCustomFaviconsToggle: () => void;
  onCustomFaviconSelect: (id: string) => void;
  onMusicPlayerToggle: () => void;
  onStealthModeToggle: () => void;
  onMidiTrackSelect: (url: string) => void;
}

export function TweaksPage(props: TweaksPageProps) {
  return (
    <PageFrame>
      <div class="flex flex-1 flex-col">
        <section class="border-b border-[var(--grid-surface)]">
          <SettingToggle
            title="Stealth mode"
            description="Use the site's darker appearance."
            enabled={props.isStealthModeEnabled}
            onToggle={props.onStealthModeToggle}
          />
        </section>

        <section class="border-b border-[var(--grid-surface)]">
          <SettingToggle
            title="Music player"
            description="Show a music player in the site header."
            enabled={props.isMusicPlayerEnabled}
            onToggle={props.onMusicPlayerToggle}
            controls="music-player-options"
          />

          <fieldset
            id="music-player-options"
            class={`min-w-0 divide-y divide-[var(--grid-surface)] border-t border-[var(--grid-surface)] transition-opacity ${props.isMusicPlayerEnabled() ? "opacity-100" : "opacity-45"}`}
            disabled={!props.isMusicPlayerEnabled()}
          >
            <legend class="sr-only">Music player song</legend>
            {midiTracks.map((track) => {
              const url = getMidiUrl(track);
              const selected = () => props.selectedMidiTrackUrl() === url;

              return (
                <label
                  class={`flex min-h-16 items-center justify-between gap-5 px-6 py-3 transition-colors sm:px-8 ${props.isMusicPlayerEnabled() ? "cursor-pointer hover:bg-[var(--hover-surface)]" : "cursor-not-allowed"} ${selected() ? "bg-[var(--selected-surface)]" : ""}`}
                >
                  <span class="min-w-0">
                    <span class="block text-sm leading-snug font-medium tracking-wide text-card-foreground sm:text-base">
                      {track.title}
                    </span>
                    <span class="mt-1 block text-[0.6875rem] tracking-wide text-[var(--text-muted)] sm:text-xs">
                      {track.artist}
                    </span>
                  </span>
                  <input
                    class="sr-only"
                    type="radio"
                    name="midi-track"
                    value={url}
                    checked={selected()}
                    onChange={() => props.onMidiTrackSelect(url)}
                  />
                  <RadioIndicator selected={selected()} />
                </label>
              );
            })}
          </fieldset>
        </section>

        <section>
          <SettingToggle
            title="Custom icon"
            description="Replace the default browser tab icon."
            enabled={props.areCustomFaviconsEnabled}
            onToggle={props.onCustomFaviconsToggle}
            controls="custom-icon-options"
          />

          <fieldset
            id="custom-icon-options"
            class={`flex min-w-0 flex-wrap gap-4 border-t border-[var(--grid-surface)] px-6 py-6 transition-opacity sm:px-8 ${props.areCustomFaviconsEnabled() ? "opacity-100" : "opacity-45"}`}
            disabled={!props.areCustomFaviconsEnabled()}
          >
            <legend class="sr-only">Custom icon</legend>
            <For each={customFavicons}>
              {(favicon) => {
                const selected = () => props.selectedCustomFaviconId() === favicon.id;

                return (
                  <label
                    class={`group block size-16 ${props.areCustomFaviconsEnabled() ? "cursor-pointer" : "cursor-not-allowed"}`}
                  >
                    <input
                      class="peer sr-only"
                      type="radio"
                      name="custom-favicon"
                      value={favicon.id}
                      aria-label={favicon.label}
                      checked={selected()}
                      onChange={() => props.onCustomFaviconSelect(favicon.id)}
                    />
                    <img
                      class={`size-full rounded-2xl border-2 object-cover transition-transform peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-primary ${props.areCustomFaviconsEnabled() ? "group-hover:scale-[1.03] group-active:scale-[.98]" : ""} ${selected() ? "border-primary" : "border-transparent"}`}
                      src={favicon.src}
                      alt=""
                      width="64"
                      height="64"
                    />
                  </label>
                );
              }}
            </For>
          </fieldset>
        </section>
      </div>
    </PageFrame>
  );
}

interface SettingToggleProps {
  title: string;
  description: string;
  enabled: Accessor<boolean>;
  onToggle: () => void;
  controls?: string;
}

function SettingToggle(props: SettingToggleProps) {
  return (
    <label class="bg-background hover:bg-[var(--hover-surface)] flex min-h-20 cursor-pointer items-center justify-between gap-6 px-6 py-4 text-left transition-colors sm:px-8">
      <span class="min-w-0">
        <span class="block text-sm leading-snug font-medium tracking-wide text-card-foreground sm:text-base">
          {props.title}
        </span>
        <span class="mt-1 block text-xs leading-relaxed font-normal text-[var(--text-muted)] sm:text-sm">
          {props.description}
        </span>
      </span>
      <input
        class="peer sr-only"
        type="checkbox"
        role="switch"
        checked={props.enabled()}
        aria-controls={props.controls}
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
      class={`relative h-5 w-9 shrink-0 rounded-full border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-primary ${props.enabled ? "border-primary bg-primary" : "border-[var(--text-muted)] bg-transparent"}`}
    >
      <span
        class={`absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all ${props.enabled ? "left-[17px] bg-primary-foreground" : "left-0.5 bg-[var(--text-muted)]"}`}
      />
    </span>
  );
}

function RadioIndicator(props: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      class={`flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-primary ${props.selected ? "border-primary" : "border-[var(--text-muted)]"}`}
    >
      <span
        class={`size-2.5 rounded-full bg-primary transition-transform ${props.selected ? "scale-100" : "scale-0"}`}
      />
    </span>
  );
}
