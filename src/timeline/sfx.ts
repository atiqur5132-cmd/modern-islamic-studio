import {COUNTER_LANDS_FRAME} from "../overlays/Counter";
import {HEART_FRAME, TAP_FRAME} from "../overlays/Cta";
import {MATCH_FRAME} from "../overlays/Fingerprint";
import {boneLandingFrame} from "../scenes/BonesScene";
import {buildSkeleton} from "../scenes/skeleton";
import {FPS, Overlay, Segment, segmentFrames, sourceToOutputFrame} from "./types";

// Where sound effects fall, worked out from the edit itself, so they move when
// the cuts or graphics move. Kept sparse: a sound marks a change, nothing more.

export type Sound =
  | "whoosh"
  | "whoosh-2"
  | "whoosh-3"
  | "impact"
  | "tick"
  | "tick-soft-1"
  | "tick-soft-2"
  | "tick-soft-3"
  | "riser"
  | "sub-hit"
  | "shimmer";
export type SoundCue = {frame: number; sound: Sound; volume: number};

// Seconds of each file (scripts/make_sfx.py), so no sound is cut short.
export const SOUND_SECONDS: Record<Sound, number> = {
  whoosh: 0.7,
  "whoosh-2": 0.6,
  "whoosh-3": 0.8,
  impact: 0.9,
  tick: 0.05,
  "tick-soft-1": 0.12,
  "tick-soft-2": 0.12,
  "tick-soft-3": 0.12,
  riser: 1.2,
  "sub-hit": 1.4,
  shimmer: 1.9,
};

// A repeated sound rotates through its takes (QUALITY.md).
const WHOOSHES: Sound[] = ["whoosh", "whoosh-2", "whoosh-3"];
const SOFT_TICKS: Sound[] = ["tick-soft-1", "tick-soft-2", "tick-soft-3"];

const WHOOSH_LEAD_FRAMES = 6;
// A whoosh swells to its loudest about a third of a second in; a whip's cut sits there.
const WHOOSH_PEAK_FRAMES = 10;
// Effects peak one frame after the picture that causes them (QUALITY.md).
const AFTER_PICTURE = 1;
// The effect files all peak at -3 dB; these keep them under the voice.
const WHOOSH_VOLUME = 0.45;
const EXIT_WHOOSH_VOLUME = 0.25;
const IMPACT_VOLUME = 0.5;
const TICK_VOLUME = 0.18;
const LETTER_TICK_VOLUME = 0.24;
const RISER_VOLUME = 0.22;
const SUB_HIT_VOLUME = 0.28; // it lands on the spoken "Same"; louder clips
const SHIMMER_VOLUME = 0.22;
const NUMBER_LANDS_VOLUME = 0.3;
const CTA_TICK_VOLUME = 0.3;
const TICK_EVERY_NTH_BONE = 3;

export const soundCues = (
  segments: Segment[],
  overlays: Overlay[],
  stretches: {start: number; end: number}[],
): SoundCue[] => {
  const cues: SoundCue[] = [];
  const at = (seconds: number) => sourceToOutputFrame(segments, seconds);
  const endPhraseStarts = overlays.filter((o) => o.type === "endphrase").map((o) => at(o.start));

  stretches.forEach(({start, end}, index) => {
    cues.push({frame: start - WHOOSH_LEAD_FRAMES, sound: WHOOSHES[index % 3], volume: WHOOSH_VOLUME});
    // No exit sound where the end card already covers the speaker's return.
    if (!endPhraseStarts.some((f) => f <= end)) {
      cues.push({frame: end - WHOOSH_LEAD_FRAMES, sound: WHOOSHES[(index + 1) % 3], volume: EXIT_WHOOSH_VOLUME});
    }
  });

  // The whip between sections.
  let cursor = 0;
  segments.forEach((segment, index) => {
    if (segment.transition === "whip") {
      cues.push({frame: cursor - WHOOSH_PEAK_FRAMES, sound: WHOOSHES[(index + 2) % 3], volume: WHOOSH_VOLUME});
    }
    cursor += segmentFrames(segment);
  });

  let ctaTakes = 0;
  for (const overlay of overlays) {
    const start = at(overlay.start);
    if (overlay.type === "cta") {
      // The tap on Follow, or the heart filling.
      const beat = overlay.mode === "follow" ? TAP_FRAME : HEART_FRAME;
      cues.push({frame: start + beat + AFTER_PICTURE, sound: SOFT_TICKS[ctaTakes++ % 3], volume: CTA_TICK_VOLUME});
    } else if (overlay.type === "counter") {
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
    } else if (overlay.type === "hook") {
      // The punch on "ulta" and its mirror line: a light swish.
      cues.push({frame: at(overlay.mirrorAt) - WHOOSH_PEAK_FRAMES + AFTER_PICTURE, sound: "whoosh-2", volume: WHOOSH_VOLUME * 0.6});
    } else if (overlay.type === "palindrome") {
      overlay.letters.forEach((letter, index) => {
        cues.push({frame: at(letter.at) + AFTER_PICTURE, sound: SOFT_TICKS[index % 3], volume: LETTER_TICK_VOLUME});
      });
      // A riser through the read-back that stops dead on "Same", where the sub hits.
      const same = at(overlay.sameAt);
      cues.push({frame: same - Math.round(SOUND_SECONDS.riser * FPS) + AFTER_PICTURE, sound: "riser", volume: RISER_VOLUME});
      cues.push({frame: same + AFTER_PICTURE, sound: "sub-hit", volume: SUB_HIT_VOLUME});
    } else if (overlay.type === "falak") {
      // The rings settling into the whorl.
      cues.push({frame: at(overlay.morphAt) - WHOOSH_PEAK_FRAMES + 12, sound: "whoosh-3", volume: WHOOSH_VOLUME * 0.5});
    } else if (overlay.type === "galaxy") {
      cues.push({frame: at(overlay.speed.at) + AFTER_PICTURE, sound: "impact", volume: NUMBER_LANDS_VOLUME});
      cues.push({frame: at(overlay.period.at) + AFTER_PICTURE, sound: "impact", volume: NUMBER_LANDS_VOLUME});
    } else if (overlay.type === "ring") {
      // The orbit drawing itself in.
      cues.push({frame: start + 6, sound: "shimmer", volume: SHIMMER_VOLUME});
    } else if (overlay.type === "yawmhook") {
      // The year of days ticking in: three soft ticks across the fill.
      const year = at(overlay.yearAt);
      [2, 14, 26].forEach((offset, index) => {
        cues.push({frame: year + offset + AFTER_PICTURE, sound: SOFT_TICKS[index % 3], volume: TICK_VOLUME * 1.4});
      });
    } else if (overlay.type === "ledger") {
      // The board rising under the speaker, each total landing, the last one heavier.
      cues.push({frame: start - WHOOSH_LEAD_FRAMES + 4, sound: "whoosh-2", volume: WHOOSH_VOLUME * 0.7});
      overlay.steps.forEach((step) => {
        const final = step.at === overlay.finalAt;
        cues.push({
          frame: at(step.at) + AFTER_PICTURE,
          sound: final ? "sub-hit" : "impact",
          volume: final ? SUB_HIT_VOLUME : NUMBER_LANDS_VOLUME,
        });
      });
      cues.push({frame: at(overlay.finalAt) + 4, sound: "shimmer", volume: SHIMMER_VOLUME});
      overlay.entries.forEach((entry) => {
        entry.words.forEach((word, index) => {
          cues.push({frame: at(word.at) + AFTER_PICTURE, sound: SOFT_TICKS[index % 3], volume: TICK_VOLUME * 1.4});
        });
      });
    } else if (overlay.type === "factfootage") {
      cues.push({frame: start - WHOOSH_LEAD_FRAMES, sound: "whoosh-3", volume: WHOOSH_VOLUME * 0.8});
      cues.push({frame: at(overlay.valueAt) + AFTER_PICTURE, sound: "impact", volume: NUMBER_LANDS_VOLUME});
    } else if (overlay.type === "posts") {
      // Each post landing, and the burst on the reaction.
      overlay.posts.forEach((post, index) => {
        cues.push({frame: at(post.at) - WHOOSH_LEAD_FRAMES + 4, sound: WHOOSHES[index % 3], volume: WHOOSH_VOLUME * 0.45});
      });
      cues.push({frame: at(overlay.burstAt) + AFTER_PICTURE, sound: "impact", volume: IMPACT_VOLUME * 0.6});
    } else if (overlay.type === "scan") {
      // The scan line crossing the Quran.
      cues.push({frame: start + 6, sound: "riser", volume: RISER_VOLUME * 0.8});
    } else if (overlay.type === "flathook") {
      // Frame 0 hits under the voice; the post slides, the cut whips, the egg and the
      // globe snap, and each "?" stamps.
      cues.push({frame: start, sound: "impact", volume: IMPACT_VOLUME});
      cues.push({frame: at(overlay.punchAt) + AFTER_PICTURE, sound: "tick", volume: TICK_VOLUME * 1.6});
      cues.push({frame: at(overlay.flatPost.at) - WHOOSH_LEAD_FRAMES + 4, sound: "whoosh", volume: WHOOSH_VOLUME * 0.6});
      cues.push({frame: at(overlay.eggPost.at) - WHOOSH_PEAK_FRAMES + AFTER_PICTURE, sound: "whoosh-2", volume: WHOOSH_VOLUME * 0.7});
      cues.push({frame: at(overlay.snapAt) - WHOOSH_PEAK_FRAMES + AFTER_PICTURE, sound: "whoosh-3", volume: WHOOSH_VOLUME * 0.6});
      cues.push({frame: at(overlay.marksAt) + AFTER_PICTURE, sound: "impact", volume: IMPACT_VOLUME * 0.6});
      cues.push({frame: at(overlay.marksAt) + 6 + AFTER_PICTURE, sound: "tick-soft-2", volume: CTA_TICK_VOLUME});
    } else if (overlay.type === "verdicts" || overlay.type === "readinto") {
      // The same two stamp hits on "galat" and again at the payoff.
      const first = overlay.type === "verdicts" ? at(overlay.stampAt) : at(overlay.leftAt) + 2;
      const second = overlay.type === "verdicts" ? first + 4 : at(overlay.rightAt) + 2;
      if (overlay.type === "verdicts") {
        cues.push({frame: at(overlay.at) - WHOOSH_LEAD_FRAMES + 4, sound: "whoosh-3", volume: WHOOSH_VOLUME * 0.45});
      }
      cues.push({frame: first + AFTER_PICTURE, sound: "impact", volume: IMPACT_VOLUME * 0.6});
      cues.push({frame: second + AFTER_PICTURE, sound: "impact", volume: IMPACT_VOLUME * 0.6});
    } else if (overlay.type === "ayahstrips") {
      overlay.strips.forEach((strip, index) => {
        if (strip.at > overlay.start) {
          cues.push({frame: at(strip.at) + AFTER_PICTURE, sound: SOFT_TICKS[index % 3], volume: TICK_VOLUME * 1.4});
        }
      });
      if (overlay.ring) {
        cues.push({frame: at(overlay.ring.at) + AFTER_PICTURE, sound: "tick", volume: TICK_VOLUME * 1.4});
      }
    } else if (overlay.type === "flatfootage") {
      (overlay.labels ?? []).forEach((label, index) => {
        cues.push({frame: at(label.at) + AFTER_PICTURE, sound: SOFT_TICKS[index % 3], volume: TICK_VOLUME * 1.4});
      });
      if (overlay.notPlanet) {
        cues.push({frame: at(overlay.notPlanet.at) + AFTER_PICTURE, sound: "tick-soft-3", volume: TICK_VOLUME * 1.4});
        cues.push({frame: at(overlay.notPlanet.strikeAt) + AFTER_PICTURE, sound: "tick", volume: TICK_VOLUME * 1.6});
      }
      if (overlay.globe) {
        cues.push({frame: at(overlay.globe.at) + AFTER_PICTURE, sound: "sub-hit", volume: SUB_HIT_VOLUME * 0.8});
      }
    } else if (overlay.type === "flatboard") {
      cues.push({frame: start - WHOOSH_LEAD_FRAMES + 4, sound: "whoosh-2", volume: WHOOSH_VOLUME * 0.6});
      (overlay.shots ?? []).forEach((shot, index) => {
        cues.push({frame: at(shot.at) + AFTER_PICTURE, sound: SOFT_TICKS[index % 3], volume: TICK_VOLUME * 1.5});
      });
      if (overlay.ayah) {
        cues.push({frame: at(overlay.ayah.ringAt) + AFTER_PICTURE, sound: "tick", volume: TICK_VOLUME * 1.4});
      }
    } else if (overlay.type === "quotecard") {
      cues.push({frame: start + AFTER_PICTURE, sound: "tick-soft-2", volume: CTA_TICK_VOLUME * 0.8});
    } else if (overlay.type === "ball") {
      cues.push({frame: at(overlay.dropAt) + 4, sound: "whoosh-3", volume: WHOOSH_VOLUME * 0.6});
      cues.push({frame: at(overlay.dropAt) + 24 + AFTER_PICTURE, sound: "impact", volume: NUMBER_LANDS_VOLUME});
    } else if (overlay.type === "eggcheck") {
      cues.push({frame: at(overlay.lexiconAt) - WHOOSH_LEAD_FRAMES + 4, sound: "whoosh", volume: WHOOSH_VOLUME * 0.5});
      cues.push({frame: at(overlay.strikeAt) + AFTER_PICTURE, sound: "tick", volume: TICK_VOLUME * 1.6});
    } else if (overlay.type === "nest") {
      cues.push({frame: at(overlay.nestAt) + AFTER_PICTURE, sound: "impact", volume: NUMBER_LANDS_VOLUME});
    } else if (overlay.type === "headcard" && (overlay.tag || overlay.word || overlay.icon)) {
      cues.push({frame: start + AFTER_PICTURE, sound: "tick-soft-2", volume: CTA_TICK_VOLUME * 0.8});
    }
  }
  return cues.filter((cue) => cue.frame >= 0).sort((a, b) => a.frame - b.frame);
};
