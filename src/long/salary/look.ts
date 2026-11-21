import {Easing, interpolate} from "remotion";
import {CLAMP, sec} from "../rewards/look";

export {CLAMP, drop, fade, grow, mix, pop, SANS, sec, SERIF, W, H} from "../rewards/look";

// "The $1 Salary" look (projects/en/rr-03/beats.md): a warm editorial collage on one paper
// board, real photos printed on paper, one colour of meaning per chapter.
export const PAPER = {
  ground: "#f4f0e7",
  ground2: "#e7e0d1",
  ink: "#1c1a16",
  inkSoft: "#6b655a",
  white: "#fffdf8",
  night: "#14171c",
  red: "#cf4a3a",
} as const;

export type Tone = {accent: string; soft: string};
export const TONE = {
  hook: {accent: "#2e7d4f", soft: "#cfe3d4"},
  tax: {accent: "#cf4a3a", soft: "#f2d2cb"},
  owner: {accent: "#2d63c8", soft: "#d3def4"},
  zero: {accent: "#b8862a", soft: "#efe0bd"},
  power: {accent: "#6a4cc4", soft: "#ddd4f2"},
} as const;

// A 2D camera over the paper board: it looks at (x, y) at scale s.
export type Move2 = {at: number; frames?: number; x: number; y: number; s: number};
export type View = {x: number; y: number; s: number};

export const viewAt = (frame: number, moves: Move2[]): View => {
  let v: View = {x: moves[0].x, y: moves[0].y, s: moves[0].s};
  for (const m of moves) {
    const start = sec(m.at);
    if (frame < start) break;
    const t = interpolate(frame, [start, start + (m.frames ?? 34)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
    // Scale moves in log space so zooms feel even.
    const s = Math.exp(Math.log(v.s) + (Math.log(m.s) - Math.log(v.s)) * t);
    v = {x: v.x + (m.x - v.x) * t, y: v.y + (m.y - v.y) * t, s};
  }
  return v;
};

// When set, the camera pulls back over the whole board and every chapter draws its final state.
export const OVERVIEW_AT = 9999; // off: a whole-board pull-back read as a thin strip (2026-11-21)
