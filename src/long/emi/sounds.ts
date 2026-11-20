import {sec} from "./look";

// The sound map (SOUND.md; beats.md "Sound"). No music. Every cue has a cause on screen:
// the receipt printing (soft ticks), the camera travelling across the board (whooshes,
// three takes in turn), a ring drawn round a number (pen), strikes and section numbers
// (ticks), the receipt sliding (paper). Three impacts and one sub-hit, the most allowed.

export type Cue = {at: number; sound: string; volume: number};

const ticks = ["tick-soft-1", "tick-soft-2", "tick-soft-3"];
const whooshes = ["whoosh", "whoosh-2", "whoosh-3"];
const pens = ["pen-circle-1", "pen-circle-2", "pen-circle-3"];

// Receipt rows (Receipt.tsx ROWS) and its entrance and zoom.
const RECEIPT_ROWS = [8.0, 21.2, 24.9, 126.2, 148.4, 165.8, 170.1, 187.6, 255.9, 281.1];
// Camera travels to a far part of the board (partA/B/C `travel`).
const TRAVELS = [38.0, 59.8, 84.0, 127.4, 151.0, 177.3, 200.8, 243.4, 262.5, 291.3, 302.0, 322.4, 349.4];
// Rings drawn round the word being said.
const RINGS = [1.6, 7.8, 108.6, 120.4, 192.8, 257.7];
// Strikes and the numbered chapters.
const MARKS = [47.0, 66.0, 95.6, 128.0, 151.4, 177.7, 243.8, 262.9, 286.6, 332.5];

export const CUES: Cue[] = [
  {at: 7.6, sound: "paper-slide-1", volume: 0.35},
  ...RECEIPT_ROWS.map((at, i) => ({at, sound: ticks[i % 3], volume: 0.4})),
  {at: 122.8, sound: "paper-slide-2", volume: 0.4},
  {at: 127.6, sound: "paper-slide-1", volume: 0.3},
  // A whoosh peaks on the cut, so it starts a few frames before the camera leaves.
  ...TRAVELS.map((at, i) => ({at: at - 0.2, sound: whooshes[i % 3], volume: 0.22})),
  ...RINGS.map((at, i) => ({at, sound: pens[i % 3], volume: 0.35})),
  ...MARKS.map((at, i) => ({at, sound: ticks[(i + 1) % 3], volume: 0.3})),
  {at: 38.6, sound: "impact", volume: 0.35}, // "Banks are not charities."
  {at: 196.3, sound: "impact", volume: 0.3}, // utilisation hits 80%
  {at: 260.6, sound: "impact", volume: 0.3}, // "three times what you planned"
  {at: 281.1, sound: "sub-hit", volume: 0.35}, // 40% of the paycheck already spoken for
].sort((a, b) => a.at - b.at);

// Room tone under the whole video, pulled out before the last line so it lands in near
// silence (SOUND.md §3.5), and never back.
export const bedVolume = (frame: number) => {
  const fadeIn = Math.min(1, frame / 15);
  const out = sec(367.3);
  const fadeOut = frame < out ? 1 : Math.max(0, 1 - (frame - out) / 10);
  return 0.14 * fadeIn * fadeOut;
};

export const cueFrame = (c: Cue) => sec(c.at);
