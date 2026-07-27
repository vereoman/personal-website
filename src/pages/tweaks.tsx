import type { Accessor } from "solid-js";

import { PageFrame } from "../components/page-frame";

interface TweaksPageProps {
  isMusicPlayerEnabled: Accessor<boolean>;
  isDarkModeEnabled: Accessor<boolean>;
  onMusicPlayerToggle: () => void;
  onDarkModeToggle: () => void;
}

export function TweaksPage(props: TweaksPageProps) {
  return (
    <PageFrame>
      <div class="flex flex-1 flex-col">
        <section class="border-b border-[var(--grid-surface)]">
          <SettingToggle
            title="Dark mode"
            description="Use the site's darker appearance."
            enabled={props.isDarkModeEnabled}
            onToggle={props.onDarkModeToggle}
          />
        </section>

        <section class="border-b border-[var(--grid-surface)]">
          <SettingToggle
            title="Music player"
            description="Show a music player in the site header."
            enabled={props.isMusicPlayerEnabled}
            onToggle={props.onMusicPlayerToggle}
          />
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
