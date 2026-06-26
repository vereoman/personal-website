import type { Accessor } from "solid-js";

import { PageFrame } from "../components/page-frame";
import { getMidiUrl, midiTracks } from "../config/midi-tracks";

interface TweaksPageProps {
  selectedMidiTrackUrl: Accessor<string | null>;
  isMusicPlayerEnabled: Accessor<boolean>;
  isBatteryStatusEnabled: Accessor<boolean>;
  isGoogleSansCodeEnabled: Accessor<boolean>;
  isDarkModeEnabled: Accessor<boolean>;
  themePreference: Accessor<"auto" | "dark" | "light">;
  isScrollSoundEnabled: Accessor<boolean>;
  onMusicPlayerToggle: () => void;
  onBatteryStatusToggle: () => void;
  onGoogleSansCodeToggle: () => void;
  onDarkModeToggle: () => void;
  onScrollSoundToggle: () => void;
  onMidiTrackSelect: (url: string) => void;
}

export function TweaksPage(props: TweaksPageProps) {
  return (
    <PageFrame>
      <div class="flex flex-1 flex-col">
        <div class="grid flex-1 gap-px bg-[var(--grid-surface)] lg:grid-cols-2">
          <div class="bg-background flex flex-col">
            {[
              {
                title: () =>
                  `Theme: ${
                    props.themePreference() === "auto"
                      ? props.isDarkModeEnabled()
                        ? "Auto night"
                        : "Auto day"
                      : props.themePreference() === "dark"
                        ? "Night"
                        : "Day"
                  }`,
                enabled: () => props.themePreference() === "auto",
                onToggle: props.onDarkModeToggle,
              },
              {
                title: "Switch to monospaced font",
                enabled: props.isGoogleSansCodeEnabled,
                onToggle: props.onGoogleSansCodeToggle,
              },
              {
                title: "Show the music player",
                enabled: props.isMusicPlayerEnabled,
                onToggle: props.onMusicPlayerToggle,
              },
              {
                title: "Show battery level (Google Chrome only)",
                enabled: props.isBatteryStatusEnabled,
                onToggle: props.onBatteryStatusToggle,
              },
              {
                title: "Enable sound on scroll",
                enabled: props.isScrollSoundEnabled,
                onToggle: props.onScrollSoundToggle,
              },
            ].map((tile) => (
              <SettingTile {...tile} />
            ))}
          </div>
          <div class="bg-background flex flex-col">
            {midiTracks.map((track) => {
              const url = getMidiUrl(track);
              const selected = () => props.selectedMidiTrackUrl() === url;

              return (
                <button
                  type="button"
                  aria-pressed={selected()}
                  onClick={() => props.onMidiTrackSelect(url)}
                  class={`bg-background flex h-14 items-center border-b border-[var(--grid-surface)] px-6 text-left transition-colors sm:px-8 ${
                    selected()
                      ? "text-card-foreground bg-[var(--selected-surface)]"
                      : "hover:text-card-foreground text-[var(--text-muted)] hover:bg-[var(--hover-surface)]"
                  }`}
                >
                  <span class="text-sm leading-snug font-normal tracking-wide sm:text-base">
                    {track.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </PageFrame>
  );
}

interface SettingTileProps {
  title: string | Accessor<string>;
  enabled: Accessor<boolean>;
  onToggle: () => void;
}

function getSettingTitle(title: SettingTileProps["title"]): string {
  return typeof title === "function" ? title() : title;
}

function SettingTile(props: SettingTileProps) {
  return (
    <button
      type="button"
      onClick={props.onToggle}
      class={`flex h-14 items-center justify-between gap-6 border-b border-[var(--grid-surface)] px-6 text-left transition-colors sm:px-8 ${
        props.enabled() ? "bg-[var(--selected-surface)]" : "bg-background"
      } hover:bg-[var(--hover-surface)]`}
    >
      <p
        class={`text-sm leading-snug font-normal tracking-wide transition-colors sm:text-base ${props.enabled() ? "text-card-foreground" : "text-[var(--text-muted)]"}`}
      >
        {getSettingTitle(props.title)}
      </p>
    </button>
  );
}
