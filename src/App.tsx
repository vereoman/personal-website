import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

import { getMidiUrl, midiTracks } from "./config/midi-tracks";
import { haptics } from "./lib/use-haptics";
import {
  getMidiPlaybackSnapshot,
  playLensClick,
  soundPresetLabels,
  toggleMidiFile,
  type MidiPlaybackSnapshot,
  type SoundPreset,
  unlockAudio,
} from "./lib/use-sound";
import { HomePage } from "./pages/home";
import { NotFoundPage } from "./pages/not-found";
import { TweaksPage } from "./pages/tweaks";

const soundPresetStorageKey = "site:sound-preset";
const musicPlayerStorageKey = "site:music-player-enabled";
const selectedMidiTrackStorageKey = "site:selected-midi-track";
const darkModeStorageKey = "site:dark-mode-enabled";
const themePreferenceStorageKey = "site:theme-preference";

type AppRoute = { name: "home" } | { name: "tweaks" } | { name: "not-found" };
type ThemePreference = "auto" | "dark" | "light";

function getRoute(pathname: string): AppRoute {
  if (pathname === "/") return { name: "home" };
  if (pathname === "/tweaks") return { name: "tweaks" };

  return { name: "not-found" };
}

function getStoredSoundPreset(): SoundPreset {
  if (typeof window === "undefined") return "Soft Tap";

  const storedPreset = window.localStorage.getItem(soundPresetStorageKey);

  if (soundPresetLabels.includes(storedPreset as SoundPreset)) {
    return storedPreset as SoundPreset;
  }

  return "Soft Tap";
}

function getStoredBoolean(key: string): boolean {
  if (typeof window === "undefined") return false;

  return window.localStorage.getItem(key) === "true";
}

function isIndiaDaytime(date = new Date()): boolean {
  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Asia/Kolkata",
    }).format(date),
  );

  return hour >= 7 && hour < 19;
}

function getStoredThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "auto";

  const storedPreference = window.localStorage.getItem(themePreferenceStorageKey);

  if (storedPreference === "auto" || storedPreference === "dark" || storedPreference === "light") {
    return storedPreference;
  }

  const storedDarkMode = window.localStorage.getItem(darkModeStorageKey);

  if (storedDarkMode === "true") return "dark";
  if (storedDarkMode === "false") return "light";

  return "auto";
}

function getStoredMidiTrackUrl(): string {
  const fallbackUrl = getMidiUrl(midiTracks[0]);

  if (typeof window === "undefined") return fallbackUrl;

  const storedUrl = window.localStorage.getItem(selectedMidiTrackStorageKey);

  return storedUrl && midiTracks.some((track) => getMidiUrl(track) === storedUrl)
    ? storedUrl
    : fallbackUrl;
}

export default function App() {
  const usesMacCommandKey =
    typeof navigator !== "undefined" && navigator.platform.toUpperCase().startsWith("MAC");
  const initialMusicPlayerEnabled = getStoredBoolean(musicPlayerStorageKey);
  const [selectedPreset] = createSignal<SoundPreset>(getStoredSoundPreset());
  const [isMusicPlayerEnabled, setIsMusicPlayerEnabled] = createSignal(initialMusicPlayerEnabled);
  const [themePreference, setThemePreference] = createSignal<ThemePreference>(
    getStoredThemePreference(),
  );
  const [isIndiaDay, setIsIndiaDay] = createSignal(isIndiaDaytime());
  const isDarkModeEnabled = () =>
    themePreference() === "auto" ? !isIndiaDay() : themePreference() === "dark";
  const [activeMidiUrl, setActiveMidiUrl] = createSignal<string | null>(getStoredMidiTrackUrl());
  const [isMidiPlaying, setIsMidiPlaying] = createSignal(false);
  const [playbackTick, setPlaybackTick] = createSignal(Date.now());
  const route = getRoute(window.location.pathname);
  const isMusicPlayerInHeader = () => isMusicPlayerEnabled();

  createEffect(() => {
    document.documentElement.classList.toggle("light", !isDarkModeEnabled());
  });

  onMount(() => {
    const primeAudio = () => {
      void unlockAudio();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      const hasTweaksModifier = usesMacCommandKey
        ? event.metaKey && !event.ctrlKey
        : event.ctrlKey && !event.metaKey;

      if (hasTweaksModifier && !event.altKey && event.code === "Comma") {
        event.preventDefault();
        window.location.href = route.name === "tweaks" ? "/" : "/tweaks";
        return;
      }

      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;

      if (!isMusicPlayerEnabled() || isTyping || event.code !== "Space") return;

      event.preventDefault();
      handleMidiToggle(activeMidiUrl() ?? getMidiUrl(midiTracks[0]));
    };

    window.addEventListener("pointerdown", primeAudio, { capture: true });
    window.addEventListener("keydown", primeAudio, { capture: true });
    window.addEventListener("keydown", handleKeyDown);

    const progressInterval = window.setInterval(() => {
      setPlaybackTick(Date.now());
    }, 250);
    const themeInterval = window.setInterval(() => {
      setIsIndiaDay(isIndiaDaytime());
    }, 60_000);

    onCleanup(() => {
      window.removeEventListener("pointerdown", primeAudio, { capture: true });
      window.removeEventListener("keydown", primeAudio, { capture: true });
      window.removeEventListener("keydown", handleKeyDown);
      window.clearInterval(progressInterval);
      window.clearInterval(themeInterval);
    });
  });

  const midiPlayback = (): MidiPlaybackSnapshot | null => {
    playbackTick();
    return getMidiPlaybackSnapshot();
  };

  const handlePress = () => {
    void unlockAudio().then((ready) => {
      if (ready) playLensClick({ direction: 1, intensity: 0.7 });
    });

    haptics.click();
  };

  const handleMidiToggle = (url: string) => {
    void toggleMidiFile(url, selectedPreset()).then((status) => {
      if (status === "failed") return;

      setActiveMidiUrl(url);
      setIsMidiPlaying(status === "playing");
    });

    haptics.click();
  };

  const handleMidiTrackSelect = (url: string) => {
    setActiveMidiUrl(url);
    window.localStorage.setItem(selectedMidiTrackStorageKey, url);
    haptics.click();
  };

  const handleMusicPlayerToggle = () => {
    const nextValue = !isMusicPlayerEnabled();

    setIsMusicPlayerEnabled(nextValue);
    window.localStorage.setItem(musicPlayerStorageKey, String(nextValue));
    haptics.click();
  };

  const handleDarkModeToggle = () => {
    const nextPreference: ThemePreference =
      themePreference() === "auto" ? "dark" : themePreference() === "dark" ? "light" : "auto";

    setThemePreference(nextPreference);
    window.localStorage.setItem(themePreferenceStorageKey, nextPreference);
    window.localStorage.setItem(darkModeStorageKey, String(nextPreference === "dark"));
    haptics.click();
  };

  if (route.name === "tweaks") {
    return (
      <TweaksPage
        isMusicPlayerEnabled={isMusicPlayerEnabled}
        isDarkModeEnabled={isDarkModeEnabled}
        themePreference={themePreference}
        onMusicPlayerToggle={handleMusicPlayerToggle}
        onDarkModeToggle={handleDarkModeToggle}
        onMidiTrackSelect={handleMidiTrackSelect}
        selectedMidiTrackUrl={activeMidiUrl}
      />
    );
  }

  if (route.name === "not-found") {
    return <NotFoundPage shortcutLabel={usesMacCommandKey ? "⌘+," : "Ctrl+,"} />;
  }

  return (
    <HomePage
      activeTrackUrl={activeMidiUrl}
      isMusicPlayerInHeader={isMusicPlayerInHeader}
      isMidiPlaying={isMidiPlaying}
      midiPlayback={midiPlayback}
      onPress={handlePress}
    />
  );
}
