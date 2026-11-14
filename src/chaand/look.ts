import {Easing, interpolate} from "remotion";
import {FONTS} from "../fonts";

// "Suraj chiragh hai, chaand nahi" (projects/chaand-nur/beats.md, Look). A night sky:
// deep blue-ink ground, moon-ivory ink, a stone grey for what steps back, and one amber
// accent with one meaning: a light of its own (the Sun, the lamp, the word siraj). The
// Moon is never amber.
export const GROUND = "#151A26";
export const GROUND_DEEP = "#0E121B";
export const INK = "#ECE5D5";
export const MUTED = "#8E8C86";
export const ACCENT = "#E1A24A";
// The translation page (lines 6-7) is a light, moon-paper page with its own dark ink.
export const PAPER = "#E7E1D3";
export const PAPER_INK = "#1D2230";
export const PAPER_MUTED = "#6F6D68";

// One sans, one serif: labels, credits and numbers in Plus Jakarta Sans; the big lines,
// meanings and quotes in Newsreader. Arabic is the whole Amiri Quran font.
export const SANS = FONTS["Plus Jakarta Sans"];
export const SERIF = FONTS.Newsreader;
export {ARABIC, ayahTokens, ayahWords} from "../overlays/kasawna/look";

// Text that must be read stays inside y 168-1330, side margins of at least 90 px, clear of
// the right rail; graphics keep their text above the caption band (foot at y 1310).
export const SIDE = 96;
export const RAIL = 140;
export const TEXT_TOP = 240;
export const CREDIT_Y = 1036;

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// Calm motion (STYLE.md): arrivals of 14-18 frames eased out on a long tail, no bounce;
// exits about half as long. A beat that never comes (Infinity) has not happened yet.
export const arrive = (frame: number, at: number, frames = 16) =>
  Number.isFinite(at) ? interpolate(frame, [at, at + frames], [0, 1], {...CLAMP, easing: Easing.out(Easing.exp)}) : 0;
export const leave = (frame: number, at: number, frames = 8) =>
  Number.isFinite(at) ? interpolate(frame, [at, at + frames], [1, 0], {...CLAMP, easing: Easing.in(Easing.cubic)}) : 1;
export const draw = (frame: number, at: number, frames = 18) =>
  Number.isFinite(at) ? interpolate(frame, [at, at + frames], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)}) : 0;
export const snap = (frame: number, at: number, frames = 5) =>
  Number.isFinite(at) ? interpolate(frame, [at, at + frames], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)}) : 0;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
