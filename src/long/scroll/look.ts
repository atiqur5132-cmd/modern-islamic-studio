import {Easing, interpolate} from "remotion";
import {FONTS} from "../../fonts";

// "Scroll kyun nahi rukta?" look (projects/scroll-kyun/beats.md). A phone at night:
// a deep graphite-blue ground, warm ivory ink, and one amber accent that always means
// "the reward" (the grain, the jackpot, the good reel, the dopamine signal). Paper for
// the things a person reads (quotes, the hadith, the receipt).
export const LOOK = {
  ground: "#191c23",
  ground2: "#232731",
  line: "#3a3f4b",
  ivory: "#efe8dc",
  muted: "#9298a3",
  amber: "#e3a33c",
  paper: "#efe8db",
  paperInk: "#2a2622",
  paperMuted: "#7d746a",
} as const;

export const SANS = FONTS["Bricolage Grotesque"];
export const SERIF = FONTS.Newsreader;

export const W = 1920;
export const H = 1080;
export const MARGIN = 120;

export const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// Arrivals: 14–20 frames, eased out on a long tail, no bounce (STYLE.md).
export const arrive = (frame: number, at: number, length = 18) =>
  interpolate(frame, [at, at + length], [0, 1], {...CLAMP, easing: Easing.out(Easing.exp)});

// Exits about half the arrival.
export const leave = (frame: number, at: number, length = 9) =>
  interpolate(frame, [at, at + length], [1, 0], {...CLAMP, easing: Easing.in(Easing.cubic)});

export const between = (frame: number, a: number, b: number) => frame >= a && frame < b;
