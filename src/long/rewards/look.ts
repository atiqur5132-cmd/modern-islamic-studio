import {Easing, interpolate} from "remotion";
import {FONTS} from "../../fonts";
import {FPS} from "../../timeline/types";

// "Deadbeats" look (projects/en/card-rewards/beats.md): one bright studio, a glossy metal
// card as the hero, and one colour of meaning per chapter. The hook is teal: the bank's game.
export const HOOK = {
  ground: "#eef2f1",
  ground2: "#dfe7e5",
  ink: "#13302e",
  inkSoft: "#4f6664",
  teal: "#0f6b66",
  tealLight: "#5fa8a1",
  gold: "#c9962e",
  coral: "#e0634c",
} as const;

export const SANS = FONTS["Inter Tight"];
export const SERIF = FONTS.Newsreader;

export const W = 1920;
export const H = 1080;

export const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

export const sec = (s: number) => Math.round(s * FPS);

// 0→1 from `at` seconds over `frames`, eased out (arrivals).
export const grow = (frame: number, at: number, frames = 18, ease = Easing.out(Easing.cubic)) =>
  interpolate(frame, [sec(at), sec(at) + frames], [0, 1], {...CLAMP, easing: ease});

// 1→0 from `at` seconds over `frames`.
export const fade = (frame: number, at: number, frames = 12) =>
  interpolate(frame, [sec(at), sec(at) + frames], [1, 0], {...CLAMP, easing: Easing.inOut(Easing.cubic)});

// A drop that lands with one small bounce.
export const drop = (frame: number, at: number, frames = 16) =>
  interpolate(frame, [sec(at), sec(at) + frames], [0, 1], {...CLAMP, easing: Easing.bounce});

// A pop with a little overshoot (icons, labels).
export const pop = (frame: number, at: number, frames = 14) =>
  interpolate(frame, [sec(at), sec(at) + frames], [0, 1], {...CLAMP, easing: Easing.out(Easing.back(1.8))});

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// One colour of meaning per chapter (beats.md "Look"). `ground` tints the page, `ink` is the
// chapter's dark text, `accent` carries the chapter's meaning, `soft` is a pale fill of it.
export type Palette = {ground: string; ground2: string; ink: string; inkSoft: string; accent: string; soft: string};
export const CH: Record<"hook" | "cash" | "revolve" | "game" | "rules", Palette> = {
  hook: {ground: HOOK.ground, ground2: HOOK.ground2, ink: HOOK.ink, inkSoft: HOOK.inkSoft, accent: HOOK.teal, soft: "#cfe4e1"},
  cash: {ground: "#eff2ea", ground2: "#e1e7d8", ink: "#1f2c1c", inkSoft: "#5a6a54", accent: "#6f8f5a", soft: "#d4e0c8"},
  revolve: {ground: "#f6eeea", ground2: "#ecdcd4", ink: "#331c17", inkSoft: "#7a5a52", accent: "#e0634c", soft: "#f3cfc5"},
  game: {ground: "#f0edf5", ground2: "#e2dcec", ink: "#241b33", inkSoft: "#665c78", accent: "#7a5bc4", soft: "#d9cff0"},
  rules: {ground: "#f6f1e6", ground2: "#ebe1cc", ink: "#2e2410", inkSoft: "#75684a", accent: "#c9962e", soft: "#f0dfb4"},
};

// Chapter changes: the new ground opens as a circle from `origin` (px) at `at` seconds.
export const CHAPTERS: {at: number; key: keyof typeof CH; origin: [number, number]}[] = [
  {at: 0, key: "hook", origin: [960, 540]},
  {at: 70.2, key: "cash", origin: [470, 760]},
  {at: 149.0, key: "revolve", origin: [960, 540]},
  {at: 217.9, key: "game", origin: [960, 540]},
  {at: 305.3, key: "rules", origin: [960, 540]},
  {at: 353.7, key: "hook", origin: [960, 540]},
];

export const chapterAt = (t: number) => {
  let c = CHAPTERS[0];
  for (const x of CHAPTERS) if (t >= x.at) c = x;
  return c;
};
