import {Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {GOLD, LATIN_FONT, NAVY} from "../../theme";

// Arrivals ease out on a long tail; exits run in about half the time (QUALITY.md).
export const ENTER_FRAMES = 12;
export const EXIT_FRAMES = 6;

export type Cue = (seconds: number) => number;

// 0 -> 1 from `from` over `frames`, eased out, clamped.
export const rise = (frame: number, from: number, frames = ENTER_FRAMES) =>
  interpolate(frame, [from, from + frames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

// 1 -> 0 from `from` over `frames`, eased in.
export const fall = (frame: number, from: number, frames = EXIT_FRAMES) =>
  interpolate(frame, [from, from + frames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });

// Whole-graphic visibility: in at the start, out at the end of its Sequence.
export const useLife = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return Math.min(rise(frame, 0), fall(frame, durationInFrames - EXIT_FRAMES));
};

// A small source line: never under 28 px (QUALITY.md), quiet, and readable.
export const SourceLine = ({text, top, left}: {text: string; top: number; left: number}) => (
  <div
    style={{
      position: "absolute",
      top,
      left,
      maxWidth: 460, // clear of the speaker's circle, top right
      fontFamily: LATIN_FONT,
      fontWeight: 600,
      fontSize: 28,
      lineHeight: 1.3,
      color: GOLD,
      textShadow: `0 2px 8px ${NAVY}`,
    }}
  >
    {text}
  </div>
);
