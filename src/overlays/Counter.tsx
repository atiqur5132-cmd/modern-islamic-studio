import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {GOLD, IVORY, LATIN_FONT, NAVY, SAFE_AREA} from "../theme";
import {EmphasisText} from "./Emphasis";

const COUNT_FRAMES = [4, 40];

// A hook number that counts up, with a label and a short line under it.
export const Counter = ({value, label, text}: {value: number; label: string; text: string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const panel = spring({frame, fps, config: {damping: 200}});
  const count = interpolate(frame, COUNT_FRAMES, [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const landed = spring({frame: frame - COUNT_FRAMES[1], fps, config: {damping: 10, stiffness: 200}});
  const line = spring({frame: frame - 30, fps, config: {damping: 200}});

  return (
    <AbsoluteFill style={{paddingTop: SAFE_AREA.top - 20, alignItems: "center"}}>
      <div
        style={{
          backgroundColor: `${NAVY}E6`,
          borderBottom: `6px solid ${GOLD}`,
          padding: "14px 56px 24px",
          textAlign: "center",
          fontFamily: LATIN_FONT,
          opacity: panel,
          transform: `translateY(${(1 - panel) * -40}px)`,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: 172,
            lineHeight: 1,
            color: GOLD,
            fontVariantNumeric: "tabular-nums",
            textShadow: `0 0 ${30 + 30 * landed}px ${GOLD}66`,
            transform: `scale(${1 + 0.06 * landed * (1 - landed)})`,
          }}
        >
          {Math.round(count)}
        </div>
        <div style={{fontWeight: 800, fontSize: 44, letterSpacing: 10, color: IVORY}}>{label}</div>
        <div
          style={{
            fontWeight: 600,
            fontSize: 38,
            color: IVORY,
            marginTop: 10,
            opacity: line,
            transform: `translateY(${(1 - line) * 14}px)`,
          }}
        >
          <EmphasisText text={text} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
