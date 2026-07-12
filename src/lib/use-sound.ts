let ctx: AudioContext | null = null;
let masterGainNode: GainNode | null = null;
let masterCompressorNode: DynamicsCompressorNode | null = null;
let resumePromise: Promise<boolean> | null = null;
let midiSources: AudioScheduledSourceNode[] = [];
const midiPromises = new Map<string, Promise<ParsedMidiSong | null>>();
const MASTER_OUTPUT_GAIN = 2;

interface MidiPlaybackState {
  url: string;
  preset: SoundPreset;
  startedAt: number;
  offsetSeconds: number;
  durationSeconds: number;
  status: "playing" | "paused";
}

export interface MidiPlaybackSnapshot {
  url: string;
  status: "playing" | "paused";
  progressSeconds: number;
  durationSeconds: number;
}

let currentMidiPlayback: MidiPlaybackState | null = null;

export const soundPresetLabels = [
  "Soft Tap",
  "Glass Tick",
  "Wood Knock",
  "Digital Pop",
  "Chime Dot",
  "Arcade Blip",
  "Warm Pulse",
  "Bright Ping",
  "Hollow Click",
  "Orbit Drift",
  "Velvet Pluck",
  "Crystal Bloom",
] as const;

export type SoundPreset = (typeof soundPresetLabels)[number];

interface ToneOptions {
  frequency: number;
  duration?: number;
  gain?: number;
  type?: OscillatorType;
  attack?: number;
  release?: number;
  detune?: number;
}

interface NoiseOptions {
  duration?: number;
  gain?: number;
  bandFrequency?: number;
  bandQ?: number;
  highpassFrequency?: number;
}

interface LensClickOptions {
  direction: 1 | -1;
  intensity?: number;
}

interface ScheduledToneOptions extends ToneOptions {
  startTime: number;
}

interface ParsedMidiSong {
  ticksPerBeat: number;
  tempos: TempoEvent[];
  notes: MidiNote[];
}

interface TempoEvent {
  ticks: number;
  microsecondsPerBeat: number;
}

interface MidiNote {
  pitch: number;
  velocity: number;
  channel: number;
  startTicks: number;
  endTicks: number;
}

function readText(view: DataView, offset: number, length: number): string {
  let value = "";

  for (let i = 0; i < length; i += 1) {
    value += String.fromCharCode(view.getUint8(offset + i));
  }

  return value;
}

function readVariableLength(view: DataView, position: { value: number }): number {
  let value = 0;
  let byte = 0;

  do {
    byte = view.getUint8(position.value);
    position.value += 1;
    value = (value << 7) | (byte & 0x7f);
  } while (byte & 0x80);

  return value;
}

function parseMidi(arrayBuffer: ArrayBuffer): ParsedMidiSong {
  const view = new DataView(arrayBuffer);
  let offset = 0;

  if (readText(view, offset, 4) !== "MThd") {
    throw new Error("Invalid MIDI header");
  }

  offset += 4;
  const headerLength = view.getUint32(offset);
  offset += 4;
  const format = view.getUint16(offset);
  offset += 2;
  const trackCount = view.getUint16(offset);
  offset += 2;
  const division = view.getUint16(offset);
  offset += 2;
  offset += headerLength - 6;

  if (format > 1 || division & 0x8000) {
    throw new Error("Unsupported MIDI format");
  }

  const ticksPerBeat = division;
  const tempos: TempoEvent[] = [{ ticks: 0, microsecondsPerBeat: 500000 }];
  const notes: MidiNote[] = [];

  for (let trackIndex = 0; trackIndex < trackCount; trackIndex += 1) {
    if (readText(view, offset, 4) !== "MTrk") {
      throw new Error("Invalid MIDI track");
    }

    offset += 4;
    const trackLength = view.getUint32(offset);
    offset += 4;
    const trackEnd = offset + trackLength;

    const position = { value: offset };
    const activeNotes = new Map<string, MidiNote[]>();
    let currentTicks = 0;
    let runningStatus = 0;

    while (position.value < trackEnd) {
      currentTicks += readVariableLength(view, position);

      let status = view.getUint8(position.value);
      if (status & 0x80) {
        position.value += 1;
        runningStatus = status;
      } else {
        status = runningStatus;
      }

      if (status === 0xff) {
        const type = view.getUint8(position.value);
        position.value += 1;
        const length = readVariableLength(view, position);

        if (type === 0x51 && length === 3) {
          tempos.push({
            ticks: currentTicks,
            microsecondsPerBeat:
              (view.getUint8(position.value) << 16) |
              (view.getUint8(position.value + 1) << 8) |
              view.getUint8(position.value + 2),
          });
        }

        position.value += length;
        continue;
      }

      if (status === 0xf0 || status === 0xf7) {
        position.value += readVariableLength(view, position);
        continue;
      }

      const eventType = status & 0xf0;
      const channel = status & 0x0f;
      const firstDataByte = view.getUint8(position.value);
      position.value += 1;

      if (eventType === 0xc0 || eventType === 0xd0) continue;

      const secondDataByte = view.getUint8(position.value);
      position.value += 1;

      if (eventType !== 0x80 && eventType !== 0x90) continue;

      const key = `${channel}:${firstDataByte}`;
      const openNotes = activeNotes.get(key) ?? [];

      if (eventType === 0x90 && secondDataByte > 0) {
        openNotes.push({
          pitch: firstDataByte,
          velocity: secondDataByte,
          channel,
          startTicks: currentTicks,
          endTicks: currentTicks,
        });
        activeNotes.set(key, openNotes);
      } else {
        const activeNote = openNotes.shift();
        if (!activeNote) continue;

        activeNote.endTicks = currentTicks;
        if (activeNote.endTicks > activeNote.startTicks) notes.push(activeNote);

        if (openNotes.length > 0) activeNotes.set(key, openNotes);
        else activeNotes.delete(key);
      }
    }

    offset = trackEnd;
  }

  tempos.sort((a, b) => a.ticks - b.ticks);
  notes.sort((a, b) => a.startTicks - b.startTicks);

  return { ticksPerBeat, tempos, notes };
}

function midiTicksToSeconds(ticks: number, ticksPerBeat: number, tempos: TempoEvent[]): number {
  let seconds = 0;
  let previousTicks = 0;
  let tempo = tempos[0]?.microsecondsPerBeat ?? 500000;

  for (const event of tempos) {
    if (event.ticks > ticks) break;

    seconds += ((event.ticks - previousTicks) / ticksPerBeat) * (tempo / 1000000);
    previousTicks = event.ticks;
    tempo = event.microsecondsPerBeat;
  }

  return seconds + ((ticks - previousTicks) / ticksPerBeat) * (tempo / 1000000);
}

function midiPitchToFrequency(pitch: number): number {
  return 440 * 2 ** ((pitch - 69) / 12);
}

function scheduleMidiDrum(
  context: AudioContext,
  startTime: number,
  duration: number,
  velocity: number,
  pitch: number,
) {
  const durationSec = Math.min(Math.max(duration, 0.035), 0.12);
  const frameCount = Math.max(1, Math.floor(context.sampleRate * durationSec));
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i += 1) {
    channel[i] = Math.random() * 2 - 1;
  }

  const source = context.createBufferSource();
  const highpass = context.createBiquadFilter();
  const bandpass = context.createBiquadFilter();
  const gainNode = context.createGain();
  const endTime = startTime + durationSec;
  const gain = (velocity / 127) * 0.055;

  source.buffer = buffer;
  highpass.type = "highpass";
  highpass.frequency.setValueAtTime(pitch < 45 ? 90 : 700, startTime);
  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(pitch < 45 ? 180 : 2200, startTime);
  bandpass.Q.setValueAtTime(pitch < 45 ? 0.9 : 2.8, startTime);

  gainNode.gain.setValueAtTime(0.0001, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.002);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);

  source.connect(highpass);
  highpass.connect(bandpass);
  bandpass.connect(gainNode);
  gainNode.connect(getAudioOutput(context));

  source.addEventListener("ended", () => {
    source.disconnect();
    highpass.disconnect();
    bandpass.disconnect();
    gainNode.disconnect();
  });

  trackMidiSource(source);
  source.start(startTime);
  source.stop(endTime);
}

async function loadMidiFile(url: string): Promise<ParsedMidiSong | null> {
  const existingPromise = midiPromises.get(url);
  if (existingPromise) return existingPromise;

  const promise = fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to load MIDI: ${url}`);

      return response.arrayBuffer();
    })
    .then(parseMidi)
    .catch((error) => {
      console.warn("Could not load MIDI", error);

      return null;
    });

  midiPromises.set(url, promise);

  return promise;
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;

  const AudioContextCtor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextCtor) return null;
  if (!ctx) ctx = new AudioContextCtor();

  return ctx;
}

function getAudioOutput(context: AudioContext): AudioNode {
  if (!masterGainNode || !masterCompressorNode) {
    masterGainNode = context.createGain();
    masterCompressorNode = context.createDynamicsCompressor();

    masterGainNode.gain.setValueAtTime(MASTER_OUTPUT_GAIN, context.currentTime);
    masterCompressorNode.threshold.setValueAtTime(-18, context.currentTime);
    masterCompressorNode.knee.setValueAtTime(18, context.currentTime);
    masterCompressorNode.ratio.setValueAtTime(6, context.currentTime);
    masterCompressorNode.attack.setValueAtTime(0.003, context.currentTime);
    masterCompressorNode.release.setValueAtTime(0.25, context.currentTime);

    masterGainNode.connect(masterCompressorNode);
    masterCompressorNode.connect(context.destination);
  }

  return masterGainNode;
}

export function unlockAudio(): Promise<boolean> {
  const context = getCtx();
  if (!context) return Promise.resolve(false);
  if (context.state === "running") return Promise.resolve(true);
  if (resumePromise) return resumePromise;

  resumePromise = context
    .resume()
    .then(() => context.state === "running")
    .catch(() => false)
    .finally(() => {
      resumePromise = null;
    });

  return resumePromise;
}

function scheduleTone(options: ScheduledToneOptions): boolean {
  const {
    frequency,
    duration = 70,
    gain = 0.12,
    type = "sine",
    attack = 0.001,
    release = 0.055,
    detune = 0,
    startTime,
  } = options;

  const context = getCtx();
  if (!context || context.state !== "running") return false;

  const now = startTime;
  const durationSec = duration / 1000;
  const releaseStart = Math.max(now + attack, now + durationSec - release);
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.detune.setValueAtTime(detune, now);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.linearRampToValueAtTime(gain, now + attack);
  gainNode.gain.exponentialRampToValueAtTime(Math.max(gain * 0.6, 0.0001), releaseStart);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  oscillator.connect(gainNode);
  gainNode.connect(getAudioOutput(context));

  oscillator.addEventListener("ended", () => {
    oscillator.disconnect();
    gainNode.disconnect();
  });

  oscillator.start(now);
  oscillator.stop(now + durationSec);

  return true;
}

function playTone(options: ToneOptions): boolean {
  const context = getCtx();
  if (!context) return false;

  return scheduleTone({ ...options, startTime: context.currentTime });
}

function trackMidiSource(source: AudioScheduledSourceNode) {
  midiSources.push(source);

  source.addEventListener("ended", () => {
    midiSources = midiSources.filter((item) => item !== source);
  });
}

function stopMidiSources() {
  for (const source of midiSources) {
    try {
      source.stop();
    } catch {
      // Scheduled one-shot nodes may already be stopped or ended.
    }
  }

  midiSources = [];
}

export function stopMidiPlayback() {
  stopMidiSources();
  currentMidiPlayback = null;
}

function getMidiSongDuration(song: ParsedMidiSong): number {
  const lastNote = song.notes.reduce((latest, note) => {
    return note.endTicks > latest.endTicks ? note : latest;
  }, song.notes[0]);

  return midiTicksToSeconds(lastNote.endTicks, song.ticksPerBeat, song.tempos);
}

export function getMidiPlaybackSnapshot(): MidiPlaybackSnapshot | null {
  const context = getCtx();
  if (!context || !currentMidiPlayback) return null;

  const elapsedSeconds =
    currentMidiPlayback.status === "playing"
      ? Math.max(context.currentTime - currentMidiPlayback.startedAt, 0)
      : 0;
  const progressSeconds = Math.min(
    currentMidiPlayback.offsetSeconds + elapsedSeconds,
    currentMidiPlayback.durationSeconds,
  );

  return {
    url: currentMidiPlayback.url,
    status: currentMidiPlayback.status,
    progressSeconds,
    durationSeconds: currentMidiPlayback.durationSeconds,
  };
}

function getPresetVoice(
  preset: SoundPreset,
): Pick<ToneOptions, "type" | "gain" | "attack" | "release" | "detune"> {
  switch (preset) {
    case "Glass Tick":
    case "Bright Ping":
    case "Crystal Bloom":
      return { type: "sine", gain: 0.12, attack: 0.004, release: 0.18 };
    case "Wood Knock":
    case "Hollow Click":
    case "Velvet Pluck":
      return { type: "triangle", gain: 0.16, attack: 0.002, release: 0.09 };
    case "Digital Pop":
    case "Arcade Blip":
      return { type: "square", gain: 0.08, attack: 0.001, release: 0.07 };
    case "Warm Pulse":
    case "Orbit Drift":
      return { type: "sawtooth", gain: 0.075, attack: 0.01, release: 0.16, detune: -7 };
    case "Chime Dot":
      return { type: "sine", gain: 0.13, attack: 0.003, release: 0.22 };
    case "Soft Tap":
      return { type: "triangle", gain: 0.13, attack: 0.002, release: 0.08 };
  }
}

export async function playMidiFile(
  url: string,
  preset: SoundPreset,
  offsetSeconds = 0,
): Promise<boolean> {
  const ready = await unlockAudio();
  const context = getCtx();
  if (!ready || !context || context.state !== "running") return false;

  const song = await loadMidiFile(url);
  if (!song || song.notes.length === 0) return false;

  stopMidiSources();

  const voice = getPresetVoice(preset);
  const durationSeconds = getMidiSongDuration(song);
  const startOffset = context.currentTime + 0.06;
  let scheduled = false;

  for (const note of song.notes) {
    const noteStart = midiTicksToSeconds(note.startTicks, song.ticksPerBeat, song.tempos);
    const noteEnd = midiTicksToSeconds(note.endTicks, song.ticksPerBeat, song.tempos);
    if (noteEnd <= offsetSeconds) continue;

    const startTime = startOffset + Math.max(noteStart - offsetSeconds, 0);
    const endTime = startOffset + noteEnd - offsetSeconds;
    const duration = endTime - startTime;
    if (duration <= 0.015) continue;

    if (note.channel === 9) {
      scheduleMidiDrum(context, startTime, duration, note.velocity, note.pitch);
      scheduled = true;
      continue;
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const attack = voice.attack ?? 0.002;
    const release = Math.min(voice.release ?? 0.08, duration * 0.65);
    const releaseStart = Math.max(startTime + attack, endTime - release);
    const peakGain = (voice.gain ?? 0.1) * (note.velocity / 127) * 0.32;

    oscillator.type = voice.type ?? "sine";
    oscillator.frequency.setValueAtTime(midiPitchToFrequency(note.pitch), startTime);
    oscillator.detune.setValueAtTime(voice.detune ?? 0, startTime);

    gainNode.gain.setValueAtTime(0.0001, startTime);
    gainNode.gain.linearRampToValueAtTime(peakGain, startTime + attack);
    gainNode.gain.setValueAtTime(Math.max(peakGain * 0.72, 0.0001), releaseStart);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, endTime);

    oscillator.connect(gainNode);
    gainNode.connect(getAudioOutput(context));

    oscillator.addEventListener("ended", () => {
      oscillator.disconnect();
      gainNode.disconnect();
    });

    trackMidiSource(oscillator);
    oscillator.start(startTime);
    oscillator.stop(endTime);
    scheduled = true;
  }

  if (scheduled) {
    currentMidiPlayback = {
      url,
      preset,
      startedAt: context.currentTime,
      offsetSeconds,
      durationSeconds,
      status: "playing",
    };
  }

  return scheduled;
}

function pauseMidiPlayback(): boolean {
  const context = getCtx();

  if (!context || !currentMidiPlayback || currentMidiPlayback.status !== "playing") {
    return false;
  }

  currentMidiPlayback = {
    ...currentMidiPlayback,
    offsetSeconds:
      currentMidiPlayback.offsetSeconds +
      Math.max(context.currentTime - currentMidiPlayback.startedAt, 0),
    status: "paused",
  };

  stopMidiSources();

  return true;
}

export async function toggleMidiFile(
  url: string,
  preset: SoundPreset,
): Promise<"playing" | "paused" | "failed"> {
  if (currentMidiPlayback?.url === url && currentMidiPlayback.status === "playing") {
    return pauseMidiPlayback() ? "paused" : "failed";
  }

  const offsetSeconds =
    currentMidiPlayback?.url === url && currentMidiPlayback.status === "paused"
      ? currentMidiPlayback.offsetSeconds
      : 0;
  const played = await playMidiFile(url, preset, offsetSeconds);

  return played ? "playing" : "failed";
}

function playToneStack(...tones: ToneOptions[]): boolean {
  let played = false;

  for (const tone of tones) {
    played = playTone(tone) || played;
  }

  return played;
}

function playNoiseTick(options: NoiseOptions = {}): boolean {
  const {
    duration = 42,
    gain = 0.08,
    bandFrequency = 1400,
    bandQ = 2.4,
    highpassFrequency = 600,
  } = options;

  const context = getCtx();
  if (!context || context.state !== "running") return false;

  const now = context.currentTime;
  const durationSec = duration / 1000;
  const frameCount = Math.max(1, Math.floor(context.sampleRate * durationSec));
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i += 1) {
    channel[i] = Math.random() * 2 - 1;
  }

  const source = context.createBufferSource();
  const highpass = context.createBiquadFilter();
  const bandpass = context.createBiquadFilter();
  const gainNode = context.createGain();

  source.buffer = buffer;

  highpass.type = "highpass";
  highpass.frequency.setValueAtTime(highpassFrequency, now);

  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(bandFrequency, now);
  bandpass.Q.setValueAtTime(bandQ, now);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.linearRampToValueAtTime(gain, now + 0.002);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  source.connect(highpass);
  highpass.connect(bandpass);
  bandpass.connect(gainNode);
  gainNode.connect(getAudioOutput(context));

  source.addEventListener("ended", () => {
    source.disconnect();
    highpass.disconnect();
    bandpass.disconnect();
    gainNode.disconnect();
  });

  source.start(now);
  source.stop(now + durationSec);

  return true;
}

export function playLensClick(options: LensClickOptions): boolean {
  const context = getCtx();
  if (!context || context.state !== "running") return false;

  const intensity = Math.min(Math.max(options.intensity ?? 0.45, 0), 1);
  const now = context.currentTime;
  const directionOffset = options.direction > 0 ? 1 : -1;
  const settings = { duration: 0.016, gain: 0.011, band: 3600, sweep: 180, q: 10.5, tone: 720 };
  const durationSec = settings.duration + intensity * 0.01;
  const frameCount = Math.max(1, Math.floor(context.sampleRate * durationSec));
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channel = buffer.getChannelData(0);

  for (let i = 0; i < frameCount; i += 1) {
    const envelope = 1 - i / frameCount;
    channel[i] = (Math.random() * 2 - 1) * envelope;
  }

  const source = context.createBufferSource();
  const highpass = context.createBiquadFilter();
  const bandpass = context.createBiquadFilter();
  const clickGain = context.createGain();
  const endTime = now + durationSec;
  const baseFrequency = settings.band + intensity * 360 + directionOffset * 90;
  const gain = settings.gain + intensity * 0.012;

  source.buffer = buffer;
  highpass.type = "highpass";
  highpass.frequency.setValueAtTime(820 + intensity * 320, now);
  bandpass.type = "bandpass";
  bandpass.frequency.setValueAtTime(baseFrequency, now);
  bandpass.frequency.exponentialRampToValueAtTime(
    Math.max(baseFrequency + directionOffset * settings.sweep, 80),
    endTime,
  );
  bandpass.Q.setValueAtTime(settings.q, now);

  clickGain.gain.setValueAtTime(0.0001, now);
  clickGain.gain.linearRampToValueAtTime(gain, now + 0.002);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  source.connect(highpass);
  highpass.connect(bandpass);
  bandpass.connect(clickGain);
  clickGain.connect(getAudioOutput(context));

  source.addEventListener("ended", () => {
    source.disconnect();
    highpass.disconnect();
    bandpass.disconnect();
    clickGain.disconnect();
  });

  source.start(now);
  source.stop(endTime);

  if (settings.tone > 0) {
    const tooth = context.createOscillator();
    const toothGain = context.createGain();

    tooth.type = "sine";
    tooth.frequency.setValueAtTime(settings.tone + intensity * 80 + directionOffset * 22, now);
    tooth.frequency.exponentialRampToValueAtTime(
      Math.max(settings.tone + intensity * 60 - directionOffset * 18, 80),
      endTime,
    );
    toothGain.gain.setValueAtTime(0.0001, now);
    toothGain.gain.linearRampToValueAtTime(gain * 0.36, now + 0.0015);
    toothGain.gain.exponentialRampToValueAtTime(0.0001, now + Math.min(0.02, durationSec));
    tooth.connect(toothGain);
    toothGain.connect(getAudioOutput(context));
    tooth.addEventListener("ended", () => {
      tooth.disconnect();
      toothGain.disconnect();
    });
    tooth.start(now);
    tooth.stop(now + Math.min(0.022, durationSec));
  }

  return true;
}

export function playPresetSound(preset: SoundPreset): boolean {
  switch (preset) {
    case "Soft Tap":
      return playToneStack(
        {
          frequency: 420,
          duration: 48,
          gain: 0.18,
          type: "triangle",
          release: 0.04,
        },
        {
          frequency: 640,
          duration: 30,
          gain: 0.09,
          type: "sine",
          detune: 6,
          release: 0.025,
        },
      );
    case "Glass Tick":
      return playToneStack(
        {
          frequency: 920,
          duration: 42,
          gain: 0.12,
          type: "sine",
          release: 0.03,
        },
        {
          frequency: 1380,
          duration: 28,
          gain: 0.08,
          type: "triangle",
          release: 0.02,
        },
      );
    case "Wood Knock":
      return playToneStack(
        {
          frequency: 240,
          duration: 60,
          gain: 0.22,
          type: "triangle",
          release: 0.05,
        },
        {
          frequency: 360,
          duration: 36,
          gain: 0.1,
          type: "sine",
          release: 0.025,
        },
      );
    case "Digital Pop":
      return playToneStack(
        {
          frequency: 760,
          duration: 38,
          gain: 0.15,
          type: "square",
          release: 0.028,
        },
        {
          frequency: 980,
          duration: 22,
          gain: 0.08,
          type: "sine",
          release: 0.018,
        },
      );
    case "Chime Dot":
      return playToneStack(
        {
          frequency: 680,
          duration: 72,
          gain: 0.13,
          type: "sine",
          release: 0.06,
        },
        {
          frequency: 1020,
          duration: 60,
          gain: 0.07,
          type: "triangle",
          release: 0.05,
        },
        {
          frequency: 1360,
          duration: 40,
          gain: 0.045,
          type: "sine",
          release: 0.03,
        },
      );
    case "Arcade Blip":
      return playToneStack(
        {
          frequency: 560,
          duration: 44,
          gain: 0.16,
          type: "square",
          release: 0.03,
        },
        {
          frequency: 840,
          duration: 24,
          gain: 0.08,
          type: "triangle",
          release: 0.02,
        },
      );
    case "Warm Pulse":
      return playToneStack(
        {
          frequency: 330,
          duration: 64,
          gain: 0.16,
          type: "sine",
          release: 0.05,
        },
        {
          frequency: 334,
          duration: 64,
          gain: 0.08,
          type: "sawtooth",
          detune: -8,
          release: 0.045,
        },
      );
    case "Bright Ping":
      return playToneStack(
        {
          frequency: 1240,
          duration: 34,
          gain: 0.13,
          type: "sine",
          release: 0.022,
        },
        {
          frequency: 1860,
          duration: 22,
          gain: 0.06,
          type: "triangle",
          release: 0.015,
        },
      );
    case "Hollow Click":
      return (
        playNoiseTick({
          duration: 36,
          gain: 0.065,
          bandFrequency: 1600,
          bandQ: 3.2,
          highpassFrequency: 780,
        }) ||
        playToneStack(
          {
            frequency: 290,
            duration: 34,
            gain: 0.08,
            type: "triangle",
            release: 0.025,
          },
          {
            frequency: 430,
            duration: 24,
            gain: 0.05,
            type: "sine",
            release: 0.018,
          },
        )
      );
    case "Orbit Drift":
      return playToneStack(
        {
          frequency: 510,
          duration: 78,
          gain: 0.1,
          type: "sawtooth",
          detune: -10,
          release: 0.06,
        },
        {
          frequency: 510,
          duration: 78,
          gain: 0.1,
          type: "sawtooth",
          detune: 10,
          release: 0.06,
        },
        {
          frequency: 765,
          duration: 40,
          gain: 0.05,
          type: "sine",
          release: 0.026,
        },
      );
    case "Velvet Pluck":
      return playToneStack(
        {
          frequency: 372,
          duration: 58,
          gain: 0.16,
          type: "triangle",
          release: 0.044,
        },
        {
          frequency: 558,
          duration: 30,
          gain: 0.06,
          type: "sine",
          release: 0.02,
        },
      );
    case "Crystal Bloom":
      return playToneStack(
        {
          frequency: 540,
          duration: 88,
          gain: 0.11,
          type: "sine",
          release: 0.07,
        },
        {
          frequency: 810,
          duration: 80,
          gain: 0.075,
          type: "triangle",
          release: 0.06,
        },
        {
          frequency: 1215,
          duration: 66,
          gain: 0.045,
          type: "sine",
          release: 0.05,
        },
      );
  }
}
