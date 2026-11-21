import {sec} from "./look";

// The hook's sound map (SOUND.md). No music. Every cue has a cause on screen. Impacts:
// "deadbeats" and "you're not"; the one sub-hit on $130B.

export type Cue = {at: number; sound: string; volume: number};

export const CUES: Cue[] = [
  {at: 3.0, sound: "paper-slide-1", volume: 0.3}, // calendar pages fan in
  ...[5.8, 6.25, 6.7, 7.15, 7.55].map((at, i) => ({at, sound: `tick-soft-${(i % 3) + 1}`, volume: 0.28})), // ticks
  {at: 9.36, sound: "tick", volume: 0.3}, // medal
  {at: 10.15, sound: "pen-circle-1", volume: 0.32}, // strike
  {at: 11.42, sound: "tick-soft-2", volume: 0.3}, // shield
  {at: 12.05, sound: "pen-circle-2", volume: 0.32}, // strike
  {at: 13.65, sound: "impact", volume: 0.34}, // DEADBEAT
  {at: 15.25, sound: "whoosh-2", volume: 0.2}, // pull back, bank rises
  {at: 17.25, sound: "whoosh-3", volume: 0.18}, // close on the card
  {at: 22.3, sound: "cloth", volume: 0.3}, // gifts land
  {at: 24.2, sound: "tick-soft-1", volume: 0.32}, // coin
  {at: 25.7, sound: "paper-slide-1", volume: 0.3}, // lounge pass
  {at: 27.55, sound: "paper-slide-2", volume: 0.3}, // hotel key
  {at: 29.0, sound: "whoosh", volume: 0.2}, // plane, boarding pass
  {at: 33.46, sound: "tick", volume: 0.3}, // glitch
  {at: 36.22, sound: "whoosh-2", volume: 0.18}, // podium
  {at: 36.5, sound: "tick-soft-3", volume: 0.3}, // scoreboard
  {at: 38.98, sound: "impact", volume: 0.3}, // "you're not"
  {at: 40.1, sound: "whoosh-3", volume: 0.18},
  {at: 42.9, sound: "cloth", volume: 0.25}, // gifts back
  {at: 46.0, sound: "whoosh", volume: 0.16}, // the hook comes down
  {at: 49.0, sound: "sub-hit", volume: 0.34}, // $130B
  {at: 50.76, sound: "tick-soft-1", volume: 0.26},
  {at: 51.38, sound: "tick-soft-2", volume: 0.26},
  {at: 52.4, sound: "whoosh-2", volume: 0.18},
  {at: 54.3, sound: "paper-slide-2", volume: 0.28}, // FREE tag
  {at: 55.46, sound: "pen-circle-3", volume: 0.3}, // struck
  {at: 56.3, sound: "paper-slide-1", volume: 0.34}, // the check slides in
  {at: 58.9, sound: "cloth", volume: 0.34}, // curtain shuts
  {at: 60.05, sound: "whoosh-3", volume: 0.2}, // curtain opens
  {at: 61.6, sound: "tick-soft-3", volume: 0.26},
  {at: 64.39, sound: "tick-soft-1", volume: 0.26},
  {at: 65.25, sound: "tick-soft-2", volume: 0.26},
  {at: 66.7, sound: "tick-soft-3", volume: 0.24},
  {at: 68.97, sound: "tick", volume: 0.28}, // "You?"
].sort((a, b) => a.at - b.at);

// Room tone under the whole video; it steps out under the payoff line ("be the exact kind
// of deadbeat", 371.9 s) so the line lands in near silence (SOUND.md §3.5), then returns.
export const bedVolume = (frame: number) => {
  const dipOut = sec(371.5);
  const back = sec(375.2);
  const dip = frame < dipOut ? 1 : frame < dipOut + 10 ? 1 - (frame - dipOut) / 10 : frame < back ? 0 : Math.min(1, (frame - back) / 15);
  return 0.14 * Math.min(1, frame / 15) * dip;
};
export const cueFrame = (c: Cue) => sec(c.at);
