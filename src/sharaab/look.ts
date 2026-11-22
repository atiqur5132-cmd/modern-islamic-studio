import {Easing, interpolate} from "remotion";
import {FONTS} from "../fonts";

// "Sharaab mein fayda?" (projects/sharaab-fayda/beats.md, Look). A walnut-and-brass study
// at night: a warm umber ground, parchment ink, and one rust accent with one meaning: the
// harm side of the scale (the word ithm, the deaths, the verdict). Benefit is never rust.
export const GROUND = "#15110D";
export const INK = "#EFE6D6";
export const MUTED = "#A39887";
export const ACCENT = "#C4593B";
// The mushaf page (the Ayah lines): warm paper with a dark brown ink.
export const PAPER = "#EDE4D3";
export const PAPER_INK = "#2A1F17";
export const PAPER_MUTED = "#7A6B5A";

// One sans and one serif: labels, credits and numbers in Bricolage Grotesque; big lines and
// meanings in Instrument Serif (italic for emphasis). Arabic is the whole Amiri Quran font.
export const SANS = FONTS["Bricolage Grotesque"];
export const SERIF = FONTS["Instrument Serif"];
export {ARABIC} from "../overlays/kasawna/look";

// Text that must be read stays inside y 168-1330 with side margins of at least 90 px.
export const SIDE = 96;
export const TEXT_TOP = 230;

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const t01 = (frame: number, a: number, b: number, e: (t: number) => number = Easing.inOut(Easing.cubic)) =>
  interpolate(frame, [a, b], [0, 1], {...CLAMP, easing: e});
// Calm motion (STYLE.md): arrivals of 14-20 frames eased out, no bounce; exits half as long.
export const arrive = (frame: number, at: number, frames = 16) =>
  Number.isFinite(at) ? interpolate(frame, [at, at + frames], [0, 1], {...CLAMP, easing: Easing.out(Easing.exp)}) : 0;
export const leave = (frame: number, at: number, frames = 8) =>
  Number.isFinite(at) ? interpolate(frame, [at, at + frames], [1, 0], {...CLAMP, easing: Easing.in(Easing.cubic)}) : 1;
export const draw = (frame: number, at: number, frames = 14) =>
  Number.isFinite(at) ? interpolate(frame, [at, at + frames], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)}) : 0;

// A weight falling from `height` metres and landing `frames` frames after `at`.
export const fall = (frame: number, at: number, height = 1.4, frames = 8) => {
  if (frame < at) return height;
  const t = Math.min(1, (frame - at) / frames);
  return height * (1 - t * t);
};

// The beam's swing toward a new angle: a damped spring from the moment the load changes.
export const swing = (frame: number, at: number, delta: number, w = 0.32, k = 0.11) => {
  if (frame < at) return 0;
  const t = frame - at;
  return delta * (1 - Math.exp(-k * t) * Math.cos(w * t));
};
