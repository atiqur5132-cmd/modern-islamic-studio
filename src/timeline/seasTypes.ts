// "Do samandar jo mix nahi hote?" graphics (projects/two-seas/beats.md). Every `at` is a
// source time: the spoken word the beat lands on. Quranic words are named by Ayah and
// word number (Quranic Arabic Corpus count, pause marks skipped) and read from the
// verified Ayah, never typed.

import type {Sound} from "./sfx";

type Timed = {start: number; end: number};
type Beat = {text: string; at: number};
// Sound effects placed on spoken words; each one has its cause on screen.
export type SeasSound = {at: number; sound: Sound; volume?: number};

// A shot of footage or a still: `src` in public/footage, `trim` seconds into a clip,
// `focus` the point the zoom grows from (0..1), `zoom` the scale it starts at.
export type SeasShot = {at: number; src: string; trim?: number; focus?: [number, number]; zoom?: number};

// The hook (creator off screen, by the creator's wish): full-screen water, the claim set
// beside it. `line` points trace the real colour line on the first clip (frame pixels).
// At `plateAt` the picture shrinks into a plate on the ground with the claim as shared.
export type SHookOverlay = Timed & {
  type: "shook";
  shots: SeasShot[];
  title: Beat;
  question: Beat;
  // `src` is the clip the line was measured on; the stroke shows only on that shot.
  line: {points: [number, number][]; at: number; src?: string};
  plate: {at: number; quote: string; credit: string; swapAt: number; swapSrc: string};
  sounds?: SeasSound[];
};

// Footage or a still filling the frame. `sfootage` covers it (speaker off screen);
// `sfootagepip` keeps the speaker in the corner circle. `labels` are short words set on
// the picture at a point; `ring` circles a point; `trace` draws a line along points.
export type SFootageOverlay = Timed & {
  type: "sfootage" | "sfootagepip";
  shots: SeasShot[];
  credit?: string;
  labels?: (Beat & {x: number; y: number; strikeAt?: number})[];
  ring?: {x: number; y: number; r: number; at: number};
  note?: Beat & {y?: number};
  sounds?: SeasSound[];
};

// An Ayah on the sea-ink page. `sayahpip` keeps the speaker in the corner circle.
// `lights` colour words as they are recited or named; `glosses` set one word's meaning.
export type SAyahOverlay = Timed & {
  type: "sayah" | "sayahpip";
  ayah: string;
  from: number;
  to: number;
  size: number;
  credit: string;
  lights: {from: number; to?: number; at: number; accent?: boolean}[];
  glosses: (Beat & {until?: number})[];
  sounds?: SeasSound[];
};

// The board under the speaker (the stack layout). "place": a NASA picture with its
// place name, struck off and replaced by a second picture. "ayah": a verse in the board
// with its words lit and their meanings.
export type SBoardOverlay = Timed & {
  type: "sboard";
  mode: "place" | "ayah";
  credit: string;
  // place
  first?: {src: string; label: string; strikeAt: number; focus?: [number, number]};
  second?: {src: string; label: string; at: number; focus?: [number, number]; ring?: {x: number; y: number}};
  // ayah
  ayah?: string;
  from?: number;
  to?: number;
  size?: number;
  lights?: {from: number; to?: number; at: number; accent?: boolean}[];
  glosses?: (Beat & {accent?: boolean})[];
  sounds?: SeasSound[];
};

// The Strait of Gibraltar drawn from the side: heavy Mediterranean water out along the
// floor, light Atlantic water in on top, the pycnocline between them, which then blurs
// as the layers mix. `scrosspip` keeps the speaker in the corner circle.
export type SCrossOverlay = Timed & {
  type: "scross" | "scrosspip";
  credit: string;
  beats: {
    med: number; // the Mediterranean side fills
    heavy: number; // "saltier, heavier"
    out: number; // the lower flow starts
    atlantic: number; // the Atlantic label
    in: number; // the upper flow starts
    band: number; // the band is named
    density: number; // "a layer of density"
    blur: number; // the band blurs, eddies form
    verdict: number; // the verdict line
  };
  sounds?: SeasSound[];
};

export type SeasOverlay = SHookOverlay | SFootageOverlay | SAyahOverlay | SBoardOverlay | SCrossOverlay;
