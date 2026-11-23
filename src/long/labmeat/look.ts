import {Easing, interpolate} from "remotion";
import {FONTS} from "../../fonts";
import {FPS} from "../../timeline/types";

// "Night lab" (projects/lab-meat/beats.md, Look): a quiet cultivation lab at night. Slate-teal
// ground, brushed steel, pink culture medium, cool ivory ink, and one amber accent with one
// meaning: the three questions (a tag, or the condition the voice is on).
export const LAB = {
  ground: "#0F1A1E",
  ground2: "#16252B",
  wall: "#132227",
  steel: "#8C989E",
  medium: "#D9897A",
  cell: "#F1C9BD",
  ink: "#E9ECE8",
  inkSoft: "#9DAAAD",
  amber: "#E0A23A",
  amberLight: "#F2C46E",
  paper: "#F4F1EA",
  paperInk: "#1F2A2E",
} as const;

export const SERIF = FONTS["Instrument Serif"];
export const SANS = FONTS["Inter Tight"];

export const W = 1920;
export const H = 1080;
// Text that must be read keeps 96 px side margins.
export const SIDE = 120;

export const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const sec = (s: number) => Math.round(s * FPS);

export const t01 = (frame: number, a: number, b: number, e: (t: number) => number = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [a, b], [0, 1], {...CLAMP, easing: e});
// Calm motion (STYLE.md): arrivals of 14-20 frames eased out, no bounce; exits half as long.
export const arrive = (frame: number, at: number, frames = 16) =>
  Number.isFinite(at) ? interpolate(frame, [at, at + frames], [0, 1], {...CLAMP, easing: Easing.out(Easing.exp)}) : 0;
export const leave = (frame: number, at: number, frames = 8) =>
  Number.isFinite(at) ? interpolate(frame, [at, at + frames], [1, 0], {...CLAMP, easing: Easing.in(Easing.cubic)}) : 1;

export type V3 = [number, number, number];
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const lerp3 = (a: V3, b: V3, t: number): V3 => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

// Small seeded random, so every render worker draws the same cells and grain.
export const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
