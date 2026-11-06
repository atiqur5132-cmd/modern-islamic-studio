// "Quran mein zameen flat?" graphics (projects/flat-earth/beats.md). Every `at` is a
// source time: the spoken word the beat lands on. Quranic words are read from the
// verified Ayah JSON by Ayah key and word number, never typed.

type Timed = {start: number; end: number};

// Lines 1-2, speaker off: the flat map with its claim, then a hard cut to the egg
// claim, the egg and the globe side by side, and a "?" on each.
export type FlatHookOverlay = Timed & {
  type: "flathook";
  tag: string;
  line: string;
  // On "flat": the map jumps closer.
  punchAt: number;
  flatPost: {headline: string; at: number};
  eggPost: {headline: string; at: number};
  snapAt: number;
  marksAt: number;
};

// Line 3, speaker full screen: the two claims as small cards beside the head, each
// stamped at "galat".
export type VerdictsOverlay = Timed & {
  type: "verdicts";
  left: string;
  right: string;
  at: number;
  stamp: string;
  stampAt: number;
};

// A torn paper card with one or more fetched Ayahs as strips. `ring` circles a word
// at `ringAt`; `photo` sits under the last strip (desert ground for 88:20).
export type AyahStripsOverlay = Timed & {
  type: "ayahstrips";
  tag: string;
  strips: {ayah: string; at: number; gloss?: string}[];
  ring?: {ayah: string; word: number; at: number; label?: string; term?: string};
  translation?: {text: string; at: number};
  photo?: string;
  push?: boolean;
  // A held card at the end of the reel: no exit.
  hold?: boolean;
};

// Real footage or a photo over the whole frame, with its claim tag, a line, labels
// that land on spoken words, and an optional coded camera move (tilt, push).
export type FlatFootageOverlay = Timed & {
  type: "flatfootage";
  tag: string;
  src: string;
  image?: boolean;
  // Seconds into the clip where this beat starts.
  trim?: number;
  // `arabic`: a non-Quranic word in Arabic script (its source is in credits.txt).
  line?: {text: string; at: number; term?: string; arabic?: string};
  labels?: {text: string; at: number; x: number; y: number; strike?: number}[];
  // Camera inside the picture: scale and the focus point (0..1) at the start and end.
  move?: {from: [number, number, number]; to: [number, number, number]; at?: number; frames?: number};
  // A scholarly source line shown on the picture (picture credits are not shown;
  // they are in credits.txt and the upload description).
  source?: string;
  // A small globe with "planet shape" struck out (line 10).
  notPlanet?: {at: number; strikeAt: number};
  // "Phir bhi gol hai": hard cut to this picture, centred and round.
  globe?: {src: string; at: number; text: string};
};

// The stack layout: the speaker in the top window, a board below.
export type FlatBoardOverlay = Timed & {
  type: "flatboard";
  tag: string;
  heading?: string;
  // Photos cut on each spoken word, each with its English label.
  shots?: {src: string; at: number; label: string; focus?: [number, number]}[];
  // An Ayah with its ringed word, and the viral post under it.
  ayah?: {key: string; word: number; at: number; ringAt: number; label: string; term: string};
  post?: {headline: string; at: number};
};

// A scholar's view as an index card over the chest; the captions give way to it.
export type QuoteCardOverlay = Timed & {
  type: "quotecard";
  tag: string;
  title: string;
  quote: string;
  source: string;
};

// Al-Razi on 88:20: a huge ball with a tiny figure; the view drops to his eye level
// and the curve flattens.
export type BallOverlay = Timed & {
  type: "ball";
  tag: string;
  dropAt: number;
  quote: {text: string; at: number};
  source: string;
};

// Line 15: the egg labelled EGG, a lexicon card over it, EGG struck and SPREAD OUT
// written beside it.
export type EggCheckOverlay = Timed & {
  type: "eggcheck";
  tag: string;
  lexiconAt: number;
  strikeAt: number;
  term: string;
  meaning: string;
  source: string;
};

// Line 16, the speaker in the circle: the nest scrape, NEST lands, EGG fades.
export type NestOverlay = Timed & {type: "nest"; tag: string; nestAt: number; line: string};

// Line 18: both claims back, each stamped the same.
export type ReadIntoOverlay = Timed & {
  type: "readinto";
  tag: string;
  leftAt: number;
  rightAt: number;
  stamp: string;
};

export type FlatOverlay =
  | FlatHookOverlay
  | VerdictsOverlay
  | AyahStripsOverlay
  | FlatFootageOverlay
  | FlatBoardOverlay
  | QuoteCardOverlay
  | BallOverlay
  | EggCheckOverlay
  | NestOverlay
  | ReadIntoOverlay;
