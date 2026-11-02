import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {StarField} from "../scenes/StarField";
import {IVORY, LATIN_FONT, NAVY, NAVY_LIGHT} from "../theme";
import {EmphasisText} from "./Emphasis";

const LINE_STAGGER_FRAMES = 14;

export const EndCard = ({lines}: {lines: string[]}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 55%, ${NAVY_LIGHT} 0%, ${NAVY} 75%)`,
        opacity: enter,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: LATIN_FONT,
      }}
    >
      <StarField />
      {/* A dark centre so the lines stay readable over the lit stars. */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, ${NAVY}F5 0%, ${NAVY}D0 30%, ${NAVY}00 70%)`}} />
      {lines.map((line, index) => {
        const land = spring({
          frame: frame - 8 - index * LINE_STAGGER_FRAMES,
          fps,
          config: {damping: 16, stiffness: 160},
        });
        return (
          <div
            key={line}
            style={{
              position: "relative",
              fontWeight: 900,
              fontSize: 96,
              lineHeight: 1.2,
              color: IVORY,
              opacity: land,
              transform: `translateY(${(1 - land) * 40}px)`,
            }}
          >
            <EmphasisText text={line} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
