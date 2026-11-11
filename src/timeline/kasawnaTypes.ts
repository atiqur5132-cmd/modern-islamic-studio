// "Fa-kasawnā: We clothed the bones" graphics (projects/muminun-kasawna/beats.md).
// Every `at` is a source time: the spoken word the beat lands on. Quranic words are
// named by Ayah and word number, counted as the Quranic Arabic Corpus counts them
// (pause marks skipped), and read from the verified Ayah, never typed.

type Timed = {start: number; end: number};
type Beat = {text: string; at: number};
export type KWordRef = {ayah: string; from: number; to?: number};

// The one drawn form that tells the story, from a drop to a clothed body. Each page
// names the stages it shows and the spoken words they change on.
export type KForm = {
  // drop: a single drop. cling: the drop pressed against the wall. lump: a soft piece of
  // flesh. bones: a curled skeleton drawn in line. clothed: flesh pulled over the bones.
  stage: "drop" | "cling" | "lump" | "bones" | "clothed";
  // The stage before it on the same page, and the word the change lands on.
  from?: "drop" | "cling" | "lump" | "bones";
  at?: number;
  // A second moment inside the stage: the drop swells, the contact ring lands, the
  // lump's edge is noticed, the cloth starts to be pulled on.
  pulseAt?: number;
  // Drawn smaller in a corner, or large in the middle of the page.
  size?: number;
  x?: number;
  y?: number;
  // How strong the form shows (behind type it steps back).
  opacity?: number;
};

// The hook (stack layout): the speaker in the top window, a falling drop below with the
// opening line. The drop crowns, the shot jumps tight, shrinks to a point of light and a
// fine ring marks where it almost vanishes.
// "khookpip" is the same drop filling the frame behind the speaker's circle.
export type KHookOverlay = Timed & {
  type: "khook" | "khookpip";
  line: string;
  src: string;
  trim: number;
  markAt: number;
  tightAt: number;
  pointAt: number;
  ringAt: number;
};

// A Quranic word on the dark page with its meaning, the drawn form, and one credit line.
export type KWordOverlay = Timed & {
  type: "kword";
  credit: string;
  word?: KWordRef & {at: number};
  // *stars* set the transliteration in italic.
  meaning?: Beat;
  sub?: Beat;
  // An underline drawn under this phrase of the meaning.
  mark?: Beat;
  form?: KForm;
  // The page drifts down as the form moves to the wall.
  pan?: {at: number};
};

// A real drawing set as a plate on the page (the implantation drawing), a count that
// lands and a ring on the point that matters.
export type KPlateOverlay = Timed & {
  type: "kplate";
  credit: string;
  src: string;
  count: Beat;
  // The ring's centre on the plate image, 0..1.
  ring: {x: number; y: number; at: number};
  note?: Beat;
};

// An Ayah on the dark page. `kayahpip` keeps the speaker in the corner circle; `kayah`
// covers the frame. Words light in the accent as they are named or recited.
export type KAyahOverlay = Timed & {
  type: "kayah" | "kayahpip";
  credit: string;
  ayah: string;
  from: number;
  to: number;
  size: number;
  lights: {from: number; to?: number; at: number}[];
  // A thin bracket closes round the verse, with a short line.
  bracket?: Beat;
  translation?: Beat & {source: string};
  // The reel's drawn steps, small in one row.
  stepsAt?: number;
};

// The board under the speaker (the stack layout). "galen": the 1538 title page with
// his name underlined. "kasawna": the payoff word, its meaning, the bare skeleton that
// is clothed on "kapde", then *joined* struck and *clothed* landing.
export type KStackOverlay = Timed & {
  type: "kstack";
  credit: string;
  mode: "galen" | "kasawna";
  // galen
  src?: string;
  underlineAt?: number;
  // kasawna
  word?: KWordRef & {at: number; bigTo?: number};
  meaning?: Beat;
  formAt?: number;
  clothAt?: number;
  joined?: Beat & {strikeAt: number};
  clothed?: Beat;
  // A second credit that replaces the first on a spoken word.
  creditLater?: Beat;
};

// A science page: the limb section with cartilage and muscle forming side by side.
// Or a pull phrase on the page with the clothed form faint behind it.
export type KScienceOverlay = Timed & {
  type: "kscience";
  credit: string;
  mode: "limb" | "phrase";
  pulseAt?: number;
  lines?: (Beat & {big?: boolean})[];
};

// Real footage. `kfootage` covers the frame (speaker off); `kfootagepip` keeps the
// speaker in the corner circle over it.
export type KFootageOverlay = Timed & {
  type: "kfootage" | "kfootagepip";
  src: string;
  trim?: number;
  rate?: number;
  credit?: string;
  // Focus point and zoom of the picture.
  focus?: [number, number];
  zoom?: number;
};

// A title set on the wall above the creator's head while they speak full screen (the
// Surah's name, "One verse."), in the page's dark ink. *stars* set italic.
export type KTitleOverlay = Timed & {type: "ktitle"; text: string};

export type KasawnaOverlay =
  | KTitleOverlay
  | KHookOverlay
  | KWordOverlay
  | KPlateOverlay
  | KAyahOverlay
  | KStackOverlay
  | KScienceOverlay
  | KFootageOverlay;
