// "America mein qibla north-east kyun?" graphics (projects/qibla-north-east/beats.md).
// Every `at` is a source time: the spoken word the beat lands on.

type Timed = {start: number; end: number};
type Beat = {text: string; at: number};

// Lines 1-2, speaker off: worshippers in the Islamic Center of Washington under a compass
// that locks on NE, the minaret with the NE arrow, then the classroom map whose straight
// line to Makkah runs south-east.
export type QHookOverlay = Timed & {
  type: "qhook";
  tag: string;
  line: string;
  lockAt: number;
  minaretAt: number;
  mapAt: number;
  lineAt: number;
  seAt: number;
};

// The stack layout: the speaker in the top window, a picture or clip on the board below
// with its tag, a heading and labels that land on spoken words.
export type QBoardOverlay = Timed & {
  type: "qboard";
  tag: string;
  src: string;
  video?: boolean;
  // Seconds into the clip where this beat starts, and its playback rate.
  trim?: number;
  rate?: number;
  // Focus point of the picture, 0..1.
  focus?: [number, number];
  gray?: boolean;
  heading?: Beat;
  note?: string;
  // A small globe with a spherical triangle drawing on it, and its term.
  sphere?: Beat;
};

// A compass dial on chart paper. "1953": the mosque turns from north to its recorded
// bearing as the number rolls. "match": the string's first direction drops into the dial.
export type QCompassOverlay = Timed & {
  type: "qcompass";
  mode: "1953" | "match";
  tag: string;
  turnAt: number;
  line: string;
  sub?: string;
  source?: string;
};

// A chip on the speaker's chest, below the chin and above the captions.
export type QChestOverlay = Timed & {
  type: "qchest";
  chip: Beat;
};

// What people said at the time, as a paper card over chart paper, with its source; a
// stamp lands on a spoken word. The speaker sits in the corner circle.
export type QQuoteOverlay = Timed & {
  type: "qquote";
  tag: string;
  quote: string;
  who: string;
  source: string;
  stamp: Beat;
};

// Real footage over the whole frame (speaker off) with its tag and a line.
export type QFootageOverlay = Timed & {
  type: "qfootage";
  tag: string;
  src: string;
  trim?: number;
  line?: Beat;
};

// The Earth scenes: one surface that is a globe, an orange's peel or a flat map. "qglobe"
// covers the frame (speaker off); "qglobepip" keeps the speaker in the corner circle.
export type EarthScene = "flatround" | "peel" | "mapline" | "string" | "depart" | "ride" | "alaska" | "payoff";
export type QGlobeOverlay = Timed & {
  type: "qglobe" | "qglobepip";
  scene: EarthScene;
  tag: string;
  // The scene's beats by name (source times); each scene reads the ones it needs.
  beats: Record<string, number>;
  // Lines of English that land on beats.
  lines?: Beat[];
};

// The Ayah card: an Ayah from the verified JSON cut by token index (pause marks count),
// its translation, and a scholarly note that slides up on a spoken word.
export type QAyahOverlay = Timed & {
  type: "qayah";
  tag: string;
  ayah: string;
  label: string;
  // First and last whitespace token of the Ayah to show (1-based, inclusive).
  from: number;
  to: number;
  translation: string;
  translationSource: string;
  note: Beat & {tag: string; sub: string};
};

export type QiblaOverlay =
  | QHookOverlay
  | QBoardOverlay
  | QCompassOverlay
  | QChestOverlay
  | QQuoteOverlay
  | QFootageOverlay
  | QGlobeOverlay
  | QAyahOverlay;
