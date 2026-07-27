export const midiTrack = {
  title: "I Was Made for Lovin' You",
  artist: "KISS",
  fileName: "i-was-made-for-loving-you.mid",
} as const;

export const midiTrackUrl = `/${encodeURIComponent(midiTrack.fileName)}`;
