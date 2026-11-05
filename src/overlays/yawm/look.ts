import {loadFont as loadFraunces} from "@remotion/google-fonts/Fraunces";
import {loadFont as loadPlexMono} from "@remotion/google-fonts/IBMPlexMono";
import {loadFont as loadInterTight} from "@remotion/google-fonts/InterTight";
import {Easing, interpolate} from "remotion";
import {AYAHS} from "../../data/quran";

// "Yawm 365": a ledger being counted. Warm paper (the creator's white wall reads as
// the same page), black ink, and one accent that only ever marks the running count.
export const PAPER = "#F4EFE6";
export const PAPER_DEEP = "#EAE2D4"; // ruled lines, the board's lower margin
export const INK = "#1B1B1B";
export const MUTED = "#6E665C";
export const COUNT = "#D9480F";

// Three type roles, by fixed rules: words in Inter Tight, every number in IBM Plex
// Mono (tabular, so a rolling count never jitters), and transliterated Arabic terms
// in Fraunces italic. Arabic itself is Amiri Quran (theme.ts).
export const {fontFamily: SANS} = loadInterTight("normal", {
  weights: ["600", "800", "900"],
  subsets: ["latin", "latin-ext"],
});
export const {fontFamily: MONO} = loadPlexMono("normal", {weights: ["500", "700"], subsets: ["latin"]});
export const {fontFamily: TERM} = loadFraunces("italic", {weights: ["600"], subsets: ["latin", "latin-ext"]});

// The speaker on top, the board below (the "stack" layout): the speaker's window is
// this tall, and the face is kept at this height inside it.
export const STACK_HEIGHT = 820;
export const STACK_FACE_Y = 420;
export const STACK_MOVE_FRAMES = 9;
// Text in the board stays above the platform's caption and buttons.
export const BOARD_TEXT_BOTTOM = 1326;

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// Arrivals ease out on a long tail; exits take about half the time (QUALITY.md).
export const arrive = (frame: number, at: number, frames = 12) =>
  interpolate(frame, [at, at + frames], [0, 1], {...CLAMP, easing: Easing.out(Easing.exp)});
export const leave = (frame: number, at: number, frames = 6) =>
  interpolate(frame, [at, at + frames], [1, 0], {...CLAMP, easing: Easing.in(Easing.cubic)});

// A count rolling from one value to the next, landing exactly on `at`.
export const ROLL_FRAMES = 14;
export const rollValue = (frame: number, steps: {frame: number; value: number}[], from = 0) => {
  let value = from;
  for (const step of steps) {
    const t = interpolate(frame, [step.frame - ROLL_FRAMES, step.frame], [0, 1], {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    });
    value = value + (step.value - value) * t;
  }
  return Math.round(value);
};

// Quranic words come only from Ayahs that scripts/fetch_ayah.py verified: word
// `index` (counted as the Quranic Arabic Corpus counts, pause marks skipped).
const HAS_LETTER = /\p{L}/u;
export const ayahWord = (key: string, index: number) => {
  const ayah = (AYAHS as Record<string, {textUthmani: string}>)[key];
  if (!ayah) {
    throw new Error(`Ayah ${key} is missing. Run scripts/fetch_ayah.py ${key}`);
  }
  const words = ayah.textUthmani.split(/\s+/).filter((token) => HAS_LETTER.test(token));
  const word = words[index - 1];
  if (!word) {
    throw new Error(`Ayah ${key} has no word ${index}`);
  }
  return word;
};

// The bare written letters of a word: every vowel and sign removed, letters untouched.
export const bareLetters = (word: string) => word.normalize("NFC").replace(/\p{M}/gu, "");
