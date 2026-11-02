import {COUNTER_LANDS_FRAME} from "../overlays/Counter";
import {MATCH_FRAME} from "../overlays/Fingerprint";
import {boneLandingFrame} from "../scenes/BonesScene";
import {buildSkeleton} from "../scenes/skeleton";
import {Overlay, Segment, sourceToOutputFrame} from "./types";

// Where sound effects fall, worked out from the edit itself, so they move when
// the cuts or graphics move. Kept sparse: a sound marks a change, nothing more.

export type Sound = "whoosh" | "impact" | "tick";
export type SoundCue = {frame: number; sound: Sound; volume: number};

const WHOOSH_LEAD_FRAMES = 6;
// The effect files all peak at -3 dB; these keep them under the voice.
const WHOOSH_VOLUME = 0.45;
const IMPACT_VOLUME = 0.5;
const TICK_VOLUME = 0.18;
const TICK_EVERY_NTH_BONE = 3;

export const soundCues = (
  segments: Segment[],
  overlays: Overlay[],
  stretches: {start: number; end: number}[],
): SoundCue[] => {
  const cues: SoundCue[] = [];
  for (const {start, end} of stretches) {
    cues.push({frame: start - WHOOSH_LEAD_FRAMES, sound: "whoosh", volume: WHOOSH_VOLUME});
    cues.push({frame: end - WHOOSH_LEAD_FRAMES, sound: "whoosh", volume: WHOOSH_VOLUME * 0.7});
  }
  for (const overlay of overlays) {
    const start = sourceToOutputFrame(segments, overlay.start);
    if (overlay.type === "counter") {
      cues.push({frame: start + COUNTER_LANDS_FRAME, sound: "impact", volume: IMPACT_VOLUME});
    } else if (overlay.type === "statement") {
      cues.push({frame: start + 6, sound: "impact", volume: IMPACT_VOLUME});
    } else if (overlay.type === "fingerprint" && overlay.mode === "scan") {
      cues.push({frame: start + MATCH_FRAME, sound: "impact", volume: IMPACT_VOLUME * 0.8});
    } else if (overlay.type === "scene" && overlay.scene === "bones") {
      const bones = buildSkeleton().length;
      for (let index = 0; index < bones; index += TICK_EVERY_NTH_BONE) {
        cues.push({frame: start + Math.round(boneLandingFrame(index)), sound: "tick", volume: TICK_VOLUME});
      }
      cues.push({frame: start + Math.round(boneLandingFrame(bones - 1)), sound: "impact", volume: IMPACT_VOLUME * 0.7});
    }
  }
  return cues.filter((cue) => cue.frame >= 0).sort((a, b) => a.frame - b.frame);
};
