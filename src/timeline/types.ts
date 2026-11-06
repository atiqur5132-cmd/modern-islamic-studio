import {FlatOverlay} from "./flatTypes";

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

// "Yawm 365" graphics. Quranic words are named by Ayah and word number (as the
// Quranic Arabic Corpus counts them) and read from the verified Ayah, never typed.
export type QuranWord = {ayah: string; word: number; bare?: boolean};

// The opening, over the voice: the claim with the bare word, then the year it matches.
// Covers the frame; the speaker is not on screen.
export type YawmHookOverlay = Timed & {
  type: "yawmhook";
  tag: string;
  word: QuranWord;
  value: number;
  claim: string;
  yearAt: number;
  yearLine: string;
};

// Every word checked: the 114 surahs as bars by length, a scan line crossing them,
// a dot wherever the root y-w-m occurs ([surah, position 0..1 inside it]), and a
// running total of words read.
export type ScanOverlay = Timed & {
  type: "scan";
  tag: string;
  heading: string;
  totalLabel: string;
  surahWords: number[];
  hits: [number, number][];
  source: string;
};

// The question on "us din bhi toh din hi hua na?" and similar asides: a card in the
// headroom (HeadCardOverlay) can carry an icon.
export type CardIcon = "question" | "book";

// The counting board under the speaker (the "stack" layout). `steps` are the spoken
// totals, `entries` the forms taken out, each at the word that names it.
export type LedgerOverlay = Timed & {
  type: "ledger";
  tag: string;
  source: string;
  steps: {at: number; value: number; label: string}[];
  // One letter per occurrence of the root, in the Quran's order: "s" singular (in the
  // 365), "p" plural, "d" dual, "i" yawma'idhin, "x" with a pronoun suffix.
  dots: string[];
  // Each form is listed when it is named and struck through when the count drops.
  entries: {
    form: string;
    minus: number;
    struckAt: number;
    words: {word: QuranWord; roman: string; meaning: string; at: number; meaningAt?: number}[];
  }[];
  finalAt: number;
};

// Four rules side by side, each with the number it gives.
export type RulesOverlay = Timed & {
  type: "rules";
  tag: string;
  heading: string;
  rows: {rule: string; value: number; final?: boolean}[];
  // A dashed line at this value with its label: the number the claim needs.
  reference: {value: number; label: string};
};

// Illustrative social posts (no platform, no account) flying in around the speaker
// while the viral claim is described; `burstAt` is the reaction ("wah!").
export type PostsOverlay = Timed & {
  type: "posts";
  posts: {headline: string; likes: string; at: number}[];
  burstAt: number;
};

// Full-screen footage (the speaker off screen) with one number landing on it.
export type FactFootageOverlay = Timed & {
  type: "factfootage";
  tag: string;
  src: string;
  value: string;
  label: string;
  valueAt: number;
  source: string;
  credit: string;
  // A row of this many small moons after the number lands (the lunar months).
  moons?: number;
};

// A card in the headroom above the speaker: a word and its meaning, a scholarly
// view with its source, or the closing line. `lines` reveal at their own times.
export type HeadCardOverlay = Timed & {
  type: "headcard";
  tag?: string;
  word?: QuranWord;
  lines: {text: string; at: number; term?: boolean}[];
  source?: string;
  icon?: CardIcon;
  // Registered as headroom: the camera holds the full frame and skips punches under it.
  headroom?: boolean;
};

// Calls to follow, like and comment. `top` sits small in the headroom above the
// speaker mid-reel; `caption` is the large end card in the caption band, which
// replaces the captions while it shows. `y` moves a `top` card for other framings;
// `text` is the engage card's line, in English.
export type CtaOverlay = Timed & {
  type: "cta";
  placement?: "top" | "caption";
  tone?: "light" | "dark";
  y?: number;
} & ({mode: "follow"} | {mode: "engage"; text: string});

export type Overlay =
  | FlatOverlay
  | CtaOverlay
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
  | SceneOverlay
  | YawmHookOverlay
  | ScanOverlay
  | LedgerOverlay
  | RulesOverlay
  | FactFootageOverlay
  | HeadCardOverlay
  | PostsOverlay;

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
  "scan",
  "rules",
  "nest",
];

// The speaker moves into the top window and the graphic takes the space below.
export const STACK_TYPES: Overlay["type"][] = ["ledger", "flatboard", "readinto"];

// These cover the whole frame with the speaker off screen (drawn over the speaker);
// they join a full-screen stretch they touch, so the circle never flashes between them.
export const COVER_TYPES: Overlay["type"][] = ["factfootage", "flathook", "ayahstrips", "flatfootage", "ball", "eggcheck"];

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
  // "ledger": white words with an ink edge, the spoken word inverted on an ink tab,
  // numbers in mono in the count colour, quoted Arabic terms in a serif italic.
  captionStyle?: "pill" | "highlight" | "ledger";
  // Words the "ledger" captions set as terms (compared without quotes or punctuation).
  captionTerms?: string[];
  // The reel's ground, ink and accent; the circle, grain and backdrop take them.
  palette?: {ground: string; ink: string; accent: string};
  // Source-time stretches where a graphic is the hero (recitation, letter by letter):
  // no caption starts inside them.
  captionHide?: {start: number; end: number; why?: string}[];
  // Files in public/footage the reel's components draw by name, for the GitHub render.
  assets?: string[];
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
