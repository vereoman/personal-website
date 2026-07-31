import type { Accessor } from "solid-js";

import { About } from "../components/about";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Project1 } from "../components/project-1";
import { Work } from "../components/work";
import type { MidiPlaybackSnapshot } from "../lib/use-sound";

interface HomePageProps {
  isMusicPlayerInHeader: Accessor<boolean>;
  midiPlayback: Accessor<MidiPlaybackSnapshot | null>;
  onPress: () => void;
  usesMacCommandKey: boolean;
}

export function HomePage(props: HomePageProps) {
  return (
    <div class="bg-background text-foreground flex min-h-screen flex-col">
      <Header
        isMusicPlayerEnabled={props.isMusicPlayerInHeader}
        midiPlayback={props.midiPlayback}
      />
      <h1 class="sr-only">Arman Kar, Software Developer</h1>
      <About onPress={props.onPress} />
      <Work onPress={props.onPress} />
      <Project1 onPress={props.onPress} />
      <Footer usesMacCommandKey={props.usesMacCommandKey} />
    </div>
  );
}
