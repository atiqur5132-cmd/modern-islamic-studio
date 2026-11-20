import {loadFont as loadCaveat} from "@remotion/google-fonts/Caveat";
import {Easing, interpolate} from "remotion";
import {FONTS} from "../../fonts";
import {FPS} from "../../timeline/types";

// "No-Cost EMI" look (projects/en/finance-vo/beats.md): a slate blackboard, warm chalk,
// and one coral accent that always means "what it really costs you".
export const LOOK = {
  ground: "#15191d",
  ground2: "#1d2228",
  chalk: "#ece8df",
  dim: "#8d939b",
  coral: "#ef7f6c",
} as const;

export const HAND = loadCaveat("normal", {weights: ["600", "700"], subsets: ["latin"]}).fontFamily;
export const SERIF = FONTS.Newsreader;

export const W = 1920;
export const H = 1080;

export const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

export const sec = (s: number) => Math.round(s * FPS);

// 0→1 from `at` seconds over `frames`, eased out on a long tail (STYLE.md arrivals).
export const grow = (frame: number, at: number, frames = 18, ease = Easing.out(Easing.cubic)) =>
  interpolate(frame, [sec(at), sec(at) + frames], [0, 1], {...CLAMP, easing: ease});

// Deterministic jitter so hand-drawn shapes look the same on every frame.
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const j = (seed: number, amount: number) => (rand(seed) - 0.5) * 2 * amount;

type P = [number, number];

// A smooth hand-drawn path through points (Catmull-Rom as cubic Béziers), each point nudged.
export const hand = (points: P[], wobble = 2.5, seed = 1, closed = false): string => {
  const pts = points.map(([x, y], i) => [x + j(seed + i * 2, wobble), y + j(seed + i * 2 + 1, wobble)] as P);
  if (closed) pts.push(pts[0], pts[1]);
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
};

// A straight chalk line with a slight bow in the middle, as a hand draws it.
export const line = (x1: number, y1: number, x2: number, y2: number, seed = 1): string => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const bow = Math.min(6, len * 0.012);
  const nx = -(y2 - y1) / (len || 1);
  const ny = (x2 - x1) / (len || 1);
  const b = j(seed, bow);
  return hand([[x1, y1], [(x1 + x2) / 2 + nx * b, (y1 + y2) / 2 + ny * b], [x2, y2]], 1.2, seed);
};

// A rounded box drawn in one stroke, ending a little past where it started.
export const box = (x: number, y: number, w: number, h: number, r = 18, seed = 1): string => {
  const pts: P[] = [
    [x + r, y], [x + w * 0.5, y], [x + w - r, y], [x + w, y + r], [x + w, y + h * 0.5], [x + w, y + h - r],
    [x + w - r, y + h], [x + w * 0.5, y + h], [x + r, y + h], [x, y + h - r], [x, y + h * 0.5], [x, y + r],
    [x + r + 4, y - 2], [x + r + 18, y + 1],
  ];
  return hand(pts, 2, seed);
};

// An ellipse drawn in one stroke that overshoots its start, like a hand-drawn ring.
export const ring = (cx: number, cy: number, rx: number, ry: number, seed = 1, turns = 1.08): string => {
  const n = 28;
  const pts: P[] = [];
  for (let i = 0; i <= n * turns; i++) {
    const a = -Math.PI * 0.6 + (i / n) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return hand(pts, Math.min(rx, ry) * 0.03, seed);
};
