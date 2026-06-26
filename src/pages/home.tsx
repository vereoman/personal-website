import type { Accessor } from "solid-js";

import { About } from "../components/about";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
// import { Project1 } from "../components/project-1";
// import { Project2 } from "../components/project-2";
import { Work } from "../components/work";
import type { MidiPlaybackSnapshot } from "../lib/use-sound";

interface HomePageProps {
  activeTrackUrl: Accessor<string | null>;
  isBatteryStatusEnabled: Accessor<boolean>;
  isMusicPlayerInHeader: Accessor<boolean>;
  isMidiPlaying: Accessor<boolean>;
  midiPlayback: Accessor<MidiPlaybackSnapshot | null>;
  onPress: () => void;
}

export function HomePage(props: HomePageProps) {
  return (
    <div class="bg-background text-foreground flex min-h-screen flex-col px-4 sm:px-6">
      <Header
        isBatteryStatusEnabled={props.isBatteryStatusEnabled}
        isMusicPlayerEnabled={props.isMusicPlayerInHeader}
        activeTrackUrl={props.activeTrackUrl}
        isPlaying={props.isMidiPlaying}
        midiPlayback={props.midiPlayback}
      />
      <Hero />
      <About onPress={props.onPress} />
      <Work onPress={props.onPress} />
      {/* <Project1 onPress={props.onPress} /> */}
      {/* <Project2 onPress={props.onPress} /> */}
      <Footer />
    </div>
  );
}
