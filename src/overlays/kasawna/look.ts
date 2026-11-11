import {Easing, interpolate} from "remotion";
import {AYAHS} from "../../data/quran";
import {FONTS} from "../../fonts";

// "Fa-kasawnā" (projects/muminun-kasawna/beats.md, Look). A dark, warm page: deep
// aubergine ground, ivory ink, a muted mauve for what steps back, and one rose-clay
// accent that only ever marks the Quran's own word at each step and the shape it names
// (the flesh layer included).
export const GROUND = "#231A21";
export const GROUND_DEEP = "#1A1318";
export const INK = "#F1E8DC";
export const MUTED = "#A39298";
export const ACCENT = "#C98170";

// Two Latin faces by fixed rules: words and credits in Plus Jakarta Sans, meanings and
// emphasis in Newsreader (italic for transliterations). Arabic is Amiri Quran.
export const SANS = FONTS["Plus Jakarta Sans"];
export const SERIF = FONTS.Newsreader;

// Text that must be read stays inside y 168-1330, with side margins of at least 90 px
// and clear of the right rail in the lower half.
export const SIDE = 92;
export const RAIL = 140;
export const TEXT_TOP = 236;

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// Calm motion (STYLE.md): arrivals of 16-18 frames eased out, no bounce; exits about
// half as long.
// A beat that never comes (Infinity) has simply not happened yet.
export const arrive = (frame: number, at: number, frames = 16) =>
  Number.isFinite(at) ? interpolate(frame, [at, at + frames], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)}) : 0;
export const leave = (frame: number, at: number, frames = 8) =>
  Number.isFinite(at) ? interpolate(frame, [at, at + frames], [1, 0], {...CLAMP, easing: Easing.in(Easing.cubic)}) : 1;
export const draw = (frame: number, at: number, frames = 24) =>
  Number.isFinite(at) ? interpolate(frame, [at, at + frames], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)}) : 0;

const HAS_LETTER = /\p{L}/u;

// The Ayah's tokens as written, each with its word number as the Quranic Arabic Corpus
// counts (pause marks get no number), from the verified JSON only.
export const ayahTokens = (key: string) => {
  const ayah = (AYAHS as Record<string, {textUthmani: string}>)[key];
  if (!ayah) {
    throw new Error(`Ayah ${key} is missing. Run scripts/fetch_ayah.py ${key}`);
  }
  let word = 0;
  return ayah.textUthmani.split(/\s+/).map((text) => ({text, word: HAS_LETTER.test(text) ? ++word : null}));
};

// Words `from` to `to` (inclusive, Corpus numbers) joined as written.
export const ayahWords = (key: string, from: number, to = from) => {
  const tokens = ayahTokens(key).filter((t) => t.word !== null && t.word >= from && t.word <= to);
  if (tokens.length !== to - from + 1) {
    throw new Error(`Ayah ${key} has no words ${from}-${to}`);
  }
  return tokens.map((t) => t.text).join(" ");
};

// "*nutfah*: a drop" -> parts with the starred text marked italic.
// A "\n" in the text is a deliberate line break and comes back as its own part.
export const starParts = (text: string) =>
  text
    .split(/(\*[^*]+\*|\n)/)
    .filter(Boolean)
    .map((part) => ({text: part.replace(/\*/g, ""), italic: part.startsWith("*")}));
