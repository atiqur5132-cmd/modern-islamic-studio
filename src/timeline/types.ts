// All times are in seconds on the source footage, so overlays stay on the
// same spoken words when the cuts change. Text marked with *stars* is emphasised.

// `push` replaces the default drift with a slower, eased creep of that size for
// serious lines; `gain` matches the shot's exposure to the others; `transition`
// marks a section change, the only place a whip is allowed; `hold` freezes the
// shot's last frame in silence for that many seconds (a beat after a reveal, the end).
export type Segment = {
  from: number;
  to: number;
  zoom: number;
  cutDifference?: number;
  push?: number;
  gain?: number;
  transition?: "whip";
  hold?: number;
};

type Timed = {start: number; end: number};

export type TitleOverlay = Timed & {type: "title"; text: string};

export type AyahOverlay = Timed & {type: "ayah"; ayah: string};

export type CounterOverlay = Timed & {type: "counter"; value: number; label: string; text: string};

export type FingerprintOverlay = Timed & {
  type: "fingerprint";
  mode: "unique" | "scan";
  tag: string;
  heading: string;
  fact: string;
};

export type StatementOverlay = Timed & {type: "statement"; tag: string; lines: string[]};

export type EndCardOverlay = Timed & {type: "endcard"; lines: string[]};

export type BrollOverlay = Timed & {type: "broll"; src: string; blur?: number};

// Code-built 3D scenes, named by what they show.
export type SceneOverlay = Timed & {type: "scene"; scene: "bones" | "fingertip"};

// Kullun fi falak graphics (G1-G9). Every `*At` is a source time: the spoken word
// the beat lands on.
export type HookOverlay = Timed & {type: "hook"; title: string; ayah: string; mirrorAt: number};

export type VerseIcon = "night" | "day" | "sun" | "moon";
export type VerseTagOverlay = Timed & {type: "versetag"; label: string; icons: {icon: VerseIcon; at: number}[]};

// Quick cuts of photographs, one per spoken word, at source times.
export type MontageOverlay = Timed & {
  type: "montage";
  tag: string;
  shots: {src: string; at: number; zoom?: number; focusY?: number; contain?: boolean}[];
};

export type PalindromeOverlay = Timed & {
  type: "palindrome";
  ayah: string;
  romanisation: string;
  translation: string;
  // Recited words, right to left, then the beats of the reveal.
  wordsAt: number[];
  translationAt: number;
  fourthWordGoesAt: number;
  marksGoAt: number;
  separateAt: number;
  // The seven letter names as spoken, right to left.
  letters: {name: string; at: number}[];
  sweepAt: number;
  sameAt: number;
};

export type SplitOverlay = Timed & {
  type: "split";
  ayah: string;
  tag: string;
  left: string;
  right: string;
  // Loudness of the spoken phrase, 0..1, oldest first; drawn and then reversed.
  waveform: number[];
  // The verdicts land on "likhawat" and on "awaaz".
  leftAt: number;
  rightAt: number;
};

export type FalakOverlay = Timed & {
  type: "falak";
  ayah: string;
  wordAt: number;
  // "gol cheez, gol raasta": the rings brighten.
  roundAt: number;
  morphAt: number;
  source: string;
};

export type GalaxyOverlay = Timed & {
  type: "galaxy";
  tag: string;
  sunAt: number;
  speed: {text: string; at: number};
  period: {text: string; sub: string; at: number};
  source: string;
};

export type NoteOverlay = Timed & {type: "note"; text: string};

// runAt..homeAt: two lights go round from Ya both ways and come home.
export type RingOverlay = Timed & {type: "ring"; ayah: string; runAt: number; homeAt: number; phraseAt: number};

// The last beat: everything gives way to the bare phrase on navy, held to the end,
// so the final frame matches the dark Arabic look the reel loops back into.
export type EndPhraseOverlay = Timed & {type: "endphrase"; ayah: string};

export type Overlay =
  | HookOverlay
  | VerseTagOverlay
  | MontageOverlay
  | PalindromeOverlay
  | SplitOverlay
  | FalakOverlay
  | GalaxyOverlay
  | NoteOverlay
  | RingOverlay
  | EndPhraseOverlay
  | TitleOverlay
  | AyahOverlay
  | CounterOverlay
  | FingerprintOverlay
  | StatementOverlay
  | EndCardOverlay
  | BrollOverlay
  | SceneOverlay;

// These cover the frame; the speaker moves into a small circle while they play.
export const FULL_SCREEN_TYPES: Overlay["type"][] = [
  "fingerprint",
  "statement",
  "endcard",
  "broll",
  "scene",
  "montage",
  "palindrome",
  "split",
  "falak",
  "galaxy",
  "ring",
];

export type CaptionWord = {text: string; start: number; end: number; emphasis: boolean};

// Written by scripts/track_face.py: the face's aim point every `step` seconds, in
// footage pixels.
export type FaceTrack = {step: number; points: [number, number][]};

// The look on the speaker: a documentary grade (contrast, cool shadows, warm
// highlights) and a vignette of at most `vignette` darkening at the corners.
export type Grade = {contrast: number; saturation: number; vignette: number};

export type Edit = {
  footage: string;
  segments: Segment[];
  overlays: Overlay[];
  captions: CaptionWord[][];
  face?: FaceTrack;
  grade?: Grade;
  // Emphasised words punch the camera to this zoom instead of a small push.
  punchToZoom?: number;
  // For picture-edit previews: keep caption timing for the punches, show no captions.
  hideCaptions?: boolean;
  // "pill": the spoken word on a gold pill (default). "highlight": ivory words, the
  // spoken one turns gold with a small pop.
  captionStyle?: "pill" | "highlight";
  // Source-time stretches where a graphic is the hero (recitation, letter by letter):
  // no caption starts inside them.
  captionHide?: {start: number; end: number; why?: string}[];
};

export const FPS = 30;

export const toFrames = (seconds: number) => Math.round(seconds * FPS);

// Frames of real footage in a shot, and frames it fills in the edit (with its hold).
export const footageFrames = (segment: Segment) => toFrames(segment.to) - toFrames(segment.from);

export const segmentFrames = (segment: Segment) => footageFrames(segment) + toFrames(segment.hold ?? 0);

export const editDurationInFrames = (edit: Edit) =>
  edit.segments.reduce((total, segment) => total + segmentFrames(segment), 0);

// A time inside a removed part maps to the start of the next kept segment.
export const sourceToOutputFrame = (segments: Segment[], seconds: number) => {
  const frame = toFrames(seconds);
  let output = 0;
  for (const segment of segments) {
    if (frame < toFrames(segment.from)) {
      return output;
    }
    if (frame < toFrames(segment.to)) {
      return output + frame - toFrames(segment.from);
    }
    output += segmentFrames(segment);
  }
  return output;
};
