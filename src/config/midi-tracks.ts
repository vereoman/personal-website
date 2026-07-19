export type MidiTrack = {
  title: string;
  artist: string;
  fileName: string;
};

export const midiTracks = [
  {
    title: "I Was Made for Lovin' You",
    artist: "KISS",
    fileName: "i-was-made-for-loving-you.mid",
  },
  {
    title: "Sono Chi No Sadame",
    artist: "Hiroaki Tominaga",
    fileName: "sono-chi-no-sadame.mid",
  },
  {
    title: "Bloody Stream",
    artist: "Coda",
    fileName: "bloody-stream.mid",
  },
  {
    title: "Uragirimono No Requiem",
    artist: "Daisuke Hasegawa",
    fileName: "uragirimonono-requiem.mid",
  },
  {
    title: "Il Vento D'oro",
    artist: "Yugo Kanno",
    fileName: "il-vento-doro.mid",
  },
] satisfies MidiTrack[];

export function getMidiUrl(track: MidiTrack): string {
  return `/${encodeURIComponent(track.fileName)}`;
}
