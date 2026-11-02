import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {GOLD, IVORY, LATIN_FONT, NAVY, NAVY_LIGHT, SAFE_AREA} from "../theme";
import {EmphasisText} from "./Emphasis";

const LINE_STAGGER_FRAMES = 10;

// Full-screen kinetic statement: each line lands in turn.
export const Statement = ({tag, lines}: {tag: string; lines: string[]}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${NAVY_LIGHT} 0%, ${NAVY} 60%)`,
        opacity: enter,
        justifyContent: "center",
        paddingLeft: SAFE_AREA.side,
        paddingRight: SAFE_AREA.side,
        fontFamily: LATIN_FONT,
      }}
    >
      <div
        style={{
          alignSelf: "flex-start",
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: 5,
          color: NAVY,
          backgroundColor: GOLD,
          padding: "8px 16px",
          marginBottom: 36,
        }}
      >
        {tag}
      </div>
      {lines.map((line, index) => {
        const land = spring({
          frame: frame - 6 - index * LINE_STAGGER_FRAMES,
          fps,
          config: {damping: 14, stiffness: 170},
        });
        return (
          <div
            key={line}
            style={{
              fontWeight: 900,
              fontSize: 84,
              lineHeight: 1.12,
              color: IVORY,
              opacity: land,
              transform: `scale(${interpolate(land, [0, 1], [1.25, 1])})`,
              transformOrigin: "left center",
            }}
          >
            <EmphasisText text={line} />
          </div>
        );
      })}
      <div
        style={{
          marginTop: 40,
          height: 8,
          backgroundColor: GOLD,
          width: `${interpolate(frame, [20, 45], [0, 60], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}%`,
        }}
      />
    </AbsoluteFill>
  );
};
