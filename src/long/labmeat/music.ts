import {interpolate} from "remotion";
import {FPS} from "../../timeline/types";

// The music bed (LONG_FORM_HI.md Sound, lowered by the creator 2026-11-24). Each file in
// public/footage/lab-music-*.wav is cut, filtered (120 Hz-7 kHz) and set to -30 LUFS by projects/lab-meat/build_music.py.
// The voice is at -19.2 LUFS, so under it the music plays at -47 LUFS (28 dB below) and lifts only to
// -39 LUFS once the voice has ended. It is out for the Ayah card (290.65-297.23 s) and for the
// payoff line (out by 431.4 s, back at 435.4 s), and dips 6 dB under the hadith card.

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const db = (d: number) => Math.pow(10, d / 20);
const UNDER_VOICE = db(-47 - -30);
const NO_VOICE = db(-39 - -30);

export type MusicCue = {file: string; from: number; to: number; fadeIn: number; fadeOut: number};
export const MUSIC: MusicCue[] = [
  {file: "footage/lab-music-laniakea.wav", from: 6.8, to: 130.5, fadeIn: 2.0, fadeOut: 1.5},
  {file: "footage/lab-music-ebb.wav", from: 129.0, to: 290.65, fadeIn: 1.5, fadeOut: 1.0},
  {file: "footage/lab-music-singularity.wav", from: 297.23, to: 404.6, fadeIn: 2.0, fadeOut: 1.5},
  {file: "footage/lab-music-sunrise.wav", from: 403.1, to: 465.3, fadeIn: 1.5, fadeOut: 3.0},
];

// Gain for a cue, `f` being the frame inside its Sequence.
export const musicGain = (cue: MusicCue) => (f: number) => {
  const t = cue.from + f / FPS;
  const fade = interpolate(t, [cue.from, cue.from + cue.fadeIn, cue.to - cue.fadeOut, cue.to], [0, 1, 1, 0], CLAMP);
  const level = interpolate(t, [445.26, 446.5], [UNDER_VOICE, NO_VOICE], CLAMP);
  const hadith = interpolate(t, [214.7, 215.22, 221.42, 222.0], [1, 0.5, 0.5, 1], CLAMP);
  const payoff = interpolate(t, [430.4, 431.4, 435.4, 436.9], [1, 0, 0, 1], CLAMP);
  return fade * level * hadith * payoff;
};
