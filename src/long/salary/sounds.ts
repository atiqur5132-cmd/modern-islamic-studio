import {interpolate} from "remotion";
import {CLAMP, sec} from "./look";

// The sound map: foley and interface cues from public/sfx (every cue has a cause on screen),
// and the music bed (beats.md "Music"): ~18 LU under the voice, out for ~1 s before each big
// reveal, a small swell on chapter changes, lifted after the last word.

export type Cue = {at: number; sound: string; volume: number};

export const HOOK_CUES: Cue[] = [
  {at: 0.44, sound: "impact", volume: 0.26}, // 2013 stamp
  {at: 1.72, sound: "paper-slide-1", volume: 0.26}, // name strip
  {at: 1.95, sound: "tick-soft-1", volume: 0.26}, // Facebook card
  {at: 3.54, sound: "tick", volume: 0.32}, // $1
  {at: 5.2, sound: "whoosh-2", volume: 0.16}, // pan
  {at: 5.4, sound: "paper-slide-1", volume: 0.26}, // Jobs print
  {at: 6.0, sound: "tick-soft-2", volume: 0.26}, // Apple card
  {at: 6.42, sound: "paper-slide-2", volume: 0.26},
  {at: 7.4, sound: "tick-soft-3", volume: 0.26}, // tick
  {at: 8.2, sound: "whoosh-3", volume: 0.16},
  {at: 8.56, sound: "tick-soft-1", volume: 0.26}, // Google card
  {at: 9.5, sound: "paper-slide-1", volume: 0.26},
  {at: 10.3, sound: "paper-slide-2", volume: 0.26},
  {at: 11.55, sound: "whoosh", volume: 0.18}, // pull back
  {at: 12.02, sound: "page-turn-1", volume: 0.3}, // clipping
  {at: 12.34, sound: "page-turn-2", volume: 0.3},
  {at: 13.84, sound: "tick-soft-2", volume: 0.22},
  {at: 14.1, sound: "tick-soft-3", volume: 0.22},
  {at: 15.0, sound: "whoosh-2", volume: 0.16},
  {at: 16.4, sound: "pen-circle-1", volume: 0.24}, // humility
  {at: 18.5, sound: "cloth", volume: 0.26}, // FREE tag
  {at: 19.6, sound: "tick-soft-1", volume: 0.22}, // hearts
  {at: 21.1, sound: "whoosh-3", volume: 0.18}, // into the night
  {at: 21.4, sound: "sub-hit", volume: 0.3}, // vault rolls in
  {at: 24.4, sound: "tick-soft-2", volume: 0.24}, // jar
  {at: 25.89, sound: "pen-circle-2", volume: 0.3}, // charity struck
  {at: 26.6, sound: "whoosh", volume: 0.16},
  {at: 27.31, sound: "tick", volume: 0.28}, // $1
  {at: 29.35, sound: "pen-circle-3", volume: 0.3}, // sacrifice struck
  {at: 29.95, sound: "page-turn-1", volume: 0.32}, // bill flips to the book
  {at: 30.6, sound: "page-turn-2", volume: 0.28}, // book opens
  {at: 30.65, sound: "tick-soft-1", volume: 0.24},
  {at: 31.53, sound: "tick-soft-2", volume: 0.24},
  {at: 33.27, sound: "tick-soft-3", volume: 0.24},
  {at: 34.2, sound: "whoosh-2", volume: 0.16},
  {at: 35.4, sound: "tick-soft-1", volume: 0.2}, // calculator keys
  {at: 35.9, sound: "tick-soft-2", volume: 0.2},
  {at: 36.4, sound: "tick-soft-3", volume: 0.2},
  {at: 37.55, sound: "paper-slide-1", volume: 0.3}, // paycheck
  {at: 38.97, sound: "paper-tear-1", volume: 0.38}, // torn
];

export const CH1_CUES: Cue[] = [
  {at: 40.1, sound: "whoosh", volume: 0.2}, // fly down to row three
  {at: 40.6, sound: "paper-slide-1", volume: 0.26}, // bill
  {at: 45.15, sound: "tick", volume: 0.28}, // label tag
  {at: 47.67, sound: "tick-soft-1", volume: 0.22},
  {at: 47.85, sound: "tick-soft-2", volume: 0.22},
  {at: 48.55, sound: "pen-circle-1", volume: 0.26}, // not equal
  {at: 49.3, sound: "whoosh-2", volume: 0.16},
  {at: 50.53, sound: "cloth", volume: 0.28}, // buckets land
  {at: 51.43, sound: "tick-soft-3", volume: 0.24},
  {at: 52.91, sound: "tick-soft-1", volume: 0.24},
  {at: 56.3, sound: "paper-slide-2", volume: 0.3}, // salary drops in
  {at: 57.25, sound: "tick", volume: 0.26}, // IRS
  {at: 59.75, sound: "whoosh-3", volume: 0.16},
  ...[63.3, 63.6, 63.9, 64.2, 64.5, 64.8].map((at, i) => ({at, sound: `tick-soft-${(i % 3) + 1}`, volume: 0.2})), // stairs
  {at: 65.4, sound: "impact", volume: 0.3}, // 37%
  {at: 66.5, sound: "whoosh", volume: 0.14},
  {at: 67.36, sound: "tick-soft-2", volume: 0.24},
  {at: 68.46, sound: "tick-soft-3", volume: 0.24},
  {at: 70.52, sound: "tick-soft-1", volume: 0.24}, // California
  {at: 71.28, sound: "tick-soft-2", volume: 0.24}, // New York
  {at: 72.26, sound: "pen-circle-2", volume: 0.28}, // half line
  {at: 75.4, sound: "whoosh-2", volume: 0.16},
  {at: 76.6, sound: "paper-slide-1", volume: 0.26},
  {at: 78.79, sound: "paper-slide-2", volume: 0.3}, // cash stacks
  {at: 81.39, sound: "tick", volume: 0.28}, // half turns red
  {at: 82.81, sound: "whoosh-3", volume: 0.22}, // half flies off
  {at: 84.9, sound: "whoosh", volume: 0.16},
  {at: 85.6, sound: "cloth", volume: 0.26}, // doors
  {at: 89.05, sound: "tick", volume: 0.26}, // -50% sign
  {at: 91.61, sound: "impact", volume: 0.28}, // front door shut
  {at: 92.75, sound: "paper-slide-1", volume: 0.24}, // $1 slips through
  {at: 94.4, sound: "riser", volume: 0.2}, // back door opens
  {at: 94.75, sound: "page-turn-1", volume: 0.26}, // shares pour out
];

export const CH2_CUES: Cue[] = [
  {at: 96.9, sound: "whoosh-2", volume: 0.18}, // drop to row four
  {at: 97.4, sound: "paper-slide-1", volume: 0.26}, // $1 stub
  {at: 100.9, sound: "pen-circle-1", volume: 0.26}, // "free" struck
  {at: 104.24, sound: "paper-slide-2", volume: 0.26}, // shares
  {at: 105.08, sound: "tick-soft-1", volume: 0.24}, // options
  {at: 105.98, sound: "tick-soft-2", volume: 0.24}, // equity
  {at: 108.6, sound: "impact", volume: 0.26}, // RULE #1 stamp
  {at: 110.6, sound: "whoosh-3", volume: 0.16},
  ...Array.from({length: 12}, (_, i) => ({at: 112.9 + i * 0.125, sound: `tick-soft-${(i % 3) + 1}`, volume: 0.16})), // months
  {at: 114.51, sound: "tick", volume: 0.28}, // one year
  {at: 116.81, sound: "pen-circle-2", volume: 0.26}, // salary struck
  {at: 118.59, sound: "paper-slide-1", volume: 0.22},
  {at: 120.2, sound: "whoosh", volume: 0.16},
  {at: 124.3, sound: "tick-soft-3", volume: 0.24}, // 20%
  {at: 126.36, sound: "tick-soft-1", volume: 0.24}, // +3.8
  {at: 129.34, sound: "tick", volume: 0.28}, // 23.8%
  {at: 130.8, sound: "whoosh-2", volume: 0.16},
  {at: 133.34, sound: "tick-soft-2", volume: 0.24}, // 37 bar
  {at: 136.44, sound: "tick-soft-3", volume: 0.24}, // 20 bar
  {at: 140.54, sound: "page-turn-1", volume: 0.3}, // label flips
  {at: 143.14, sound: "riser", volume: 0.14}, // bill drops to half
  {at: 145.9, sound: "whoosh-3", volume: 0.16},
  {at: 150.38, sound: "pen-circle-3", volume: 0.26}, // payroll struck
  {at: 153.42, sound: "tick-soft-1", volume: 0.24}, // punished
  {at: 155.74, sound: "tick-soft-2", volume: 0.24}, // rewarded
];

export const CH3_CUES: Cue[] = [
  {at: 156.8, sound: "whoosh-2", volume: 0.18}, // drop to row five
  {at: 161.49, sound: "paper-slide-1", volume: 0.28}, // layer two slides out
  ...[163.5, 163.9, 164.3, 164.7].map((at, i) => ({at, sound: `tick-soft-${(i % 3) + 1}`, volume: 0.18})), // 20 → 0
  {at: 165.39, sound: "sub-hit", volume: 0.34}, // ZERO (music is out)
  {at: 166.53, sound: "tick-soft-2", volume: 0.22}, // the secret
  {at: 171.13, sound: "tick", volume: 0.3}, // SELL button
  {at: 171.6, sound: "whoosh-3", volume: 0.16},
  {at: 172.6, sound: "riser", volume: 0.14}, // stock climbs
  {at: 176.28, sound: "pen-circle-1", volume: 0.24}, // lock
  {at: 179.34, sound: "tick", volume: 0.3}, // $0
  {at: 181.85, sound: "pen-circle-2", volume: 0.24}, // bracket
  {at: 186.72, sound: "tick-soft-1", volume: 0.24}, // IRS
  {at: 188.8, sound: "whoosh", volume: 0.16},
  {at: 189.6, sound: "paper-slide-2", volume: 0.24}, // bubble
  {at: 192.26, sound: "tick-soft-2", volume: 0.24}, // yacht
  {at: 192.9, sound: "tick-soft-3", volume: 0.24}, // mansion
  {at: 194.1, sound: "pen-circle-3", volume: 0.26}, // shares crossed
  {at: 197.44, sound: "impact", volume: 0.28}, // "No."
  {at: 199.3, sound: "whoosh-2", volume: 0.16},
  {at: 202.22, sound: "pen-circle-1", volume: 0.24}, // tax bill struck
  {at: 203.9, sound: "cloth", volume: 0.28}, // bank rises
  {at: 205.42, sound: "tick-soft-1", volume: 0.22},
  {at: 207.84, sound: "tick-soft-2", volume: 0.22},
  {at: 209.4, sound: "paper-slide-1", volume: 0.28}, // cash out
  {at: 210.3, sound: "paper-slide-2", volume: 0.26}, // shares in
  {at: 211.08, sound: "tick", volume: 0.26}, // COLLATERAL
  {at: 215.07, sound: "tick", volume: 0.28}, // SBLOC
  {at: 216.7, sound: "whoosh-3", volume: 0.16},
  {at: 217.6, sound: "page-turn-1", volume: 0.22}, // assets pile
  {at: 220.4, sound: "tick-soft-3", volume: 0.22}, // dial
  {at: 224.75, sound: "sub-hit", volume: 0.3}, // Debt is not income (music is out)
  {at: 226.79, sound: "paper-slide-1", volume: 0.24},
  {at: 229.5, sound: "whoosh", volume: 0.16},
  {at: 230.75, sound: "tick-soft-1", volume: 0.24},
  {at: 233.85, sound: "tick-soft-2", volume: 0.24},
  {at: 235.99, sound: "tick-soft-3", volume: 0.24},
  {at: 237.85, sound: "riser", volume: 0.14}, // the race
];

export const CH4_CUES: Cue[] = [
  {at: 240.6, sound: "whoosh-2", volume: 0.18}, // drop to row six
  {at: 241.37, sound: "pen-circle-1", volume: 0.24}, // taxes struck
  {at: 243.65, sound: "paper-slide-1", volume: 0.26}, // card 1
  {at: 243.95, sound: "paper-slide-2", volume: 0.26}, // card 2
  {at: 247.8, sound: "whoosh-3", volume: 0.16},
  {at: 248.83, sound: "tick", volume: 0.26}, // megaphone
  {at: 252.35, sound: "cloth", volume: 0.24}, // Wall St sign
  {at: 253.11, sound: "tick-soft-1", volume: 0.2},
  {at: 254.27, sound: "paper-slide-1", volume: 0.24}, // the four prints
  {at: 259.7, sound: "whoosh", volume: 0.16},
  ...[262.13, 262.33, 262.53].map((at, i) => ({at, sound: `tick-soft-${i + 1}`, volume: 0.2})), // BUY tickets
  {at: 263.3, sound: "riser", volume: 0.14}, // price rises
  {at: 268.61, sound: "impact", volume: 0.26}, // net worth explodes
  {at: 271.09, sound: "tick-soft-2", volume: 0.2}, // tiny salary bar
  {at: 272.6, sound: "whoosh-2", volume: 0.16},
  {at: 273.75, sound: "tick-soft-3", volume: 0.24}, // Meta, control
  {at: 276.45, sound: "page-turn-1", volume: 0.24}, // votes drain
  {at: 278.6, sound: "page-turn-2", volume: 0.24}, // votes back
  {at: 280.11, sound: "tick", volume: 0.28}, // crown
  {at: 282.8, sound: "whoosh-3", volume: 0.16},
  {at: 285.23, sound: "pen-circle-2", volume: 0.26}, // humility struck
  {at: 287.4, sound: "page-turn-1", volume: 0.26}, // rule book opens
  {at: 289.9, sound: "whoosh", volume: 0.16},
  ...Array.from({length: 6}, (_, i) => ({at: 295.2 + i * 0.27, sound: `tick-soft-${(i % 3) + 1}`, volume: 0.16})), // monthly slices
  {at: 297.2, sound: "whoosh-2", volume: 0.16},
  {at: 299.57, sound: "paper-slide-2", volume: 0.26}, // price tag
  {at: 301.9, sound: "whoosh-3", volume: 0.16},
  {at: 304.4, sound: "pen-circle-3", volume: 0.26}, // earn struck
  {at: 305.75, sound: "sub-hit", volume: 0.3}, // own (music is out)
  {at: 306.7, sound: "whoosh", volume: 0.2}, // pull back over the whole board
  {at: 310.37, sound: "tick", volume: 0.28}, // subscribe
  {at: 311.15, sound: "tick-soft-1", volume: 0.26}, // subscribed
  {at: 312.29, sound: "paper-slide-1", volume: 0.22}, // watch next
];

// Room tone under everything, quiet: the music carries the bed in this channel.
export const roomVolume = (frame: number) => 0.08 * Math.min(1, frame / 15);

// Reveals where the music steps out for ~1 s (seconds of the word that lands).
const DROPS = [165.4, 224.75, 305.75];
const SWELLS = [40.3, 97.2, 157.1, 240.9, 282.1];
const BASE = 1; // the bed file is already levelled and ducked (projects/en/rr-03/build_music.py)

export const musicVolume = (frame: number, end: number) => {
  const t = frame / 30;
  let v = BASE * Math.min(1, frame / 20);
  for (const d of DROPS) {
    const k = interpolate(t, [d - 1.3, d - 1.0, d + 0.2, d + 0.9], [1, 0, 0, 1], CLAMP);
    v *= k;
  }
  for (const s of SWELLS) v *= 1 + 0.4 * interpolate(t, [s - 0.6, s, s + 1.2], [0, 1, 0], CLAMP);
  v *= interpolate(t, [end - 6, end - 4.5], [1, 1.6], CLAMP); // lift after the last word
  v *= interpolate(t, [end - 1.5, end], [1, 0], CLAMP);
  return v;
};

export const cueFrame = (c: Cue) => sec(c.at);
