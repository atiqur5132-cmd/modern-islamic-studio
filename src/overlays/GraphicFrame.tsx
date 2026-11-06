import {ReactNode} from "react";
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {GOLD, IVORY, LATIN_FONT, NAVY, NAVY_LIGHT, SAFE_AREA} from "../theme";
import {EmphasisText} from "./Emphasis";

// The shared look of full-screen graphics: navy field, faint grid, a label that
// says what kind of claim this is, and a heading. The speaker sits top right.
export const GraphicFrame = ({
  tag,
  heading,
  children,
}: {
  tag: string;
  heading?: string;
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});
  const headingIn = spring({frame: frame - 6, fps, config: {damping: 18, stiffness: 160}});

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 60%, ${NAVY_LIGHT} 0%, ${NAVY} 70%)`,
        opacity: enter,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${IVORY}0A 1px, transparent 1px), linear-gradient(90deg, ${IVORY}0A 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: SAFE_AREA.top,
          left: SAFE_AREA.side,
          width: 540,
          fontFamily: LATIN_FONT,
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: 4,
            color: NAVY,
            backgroundColor: GOLD,
            padding: "8px 16px",
          }}
        >
          {tag}
        </div>
        {heading ? (
        <div
          style={{
            marginTop: 22,
            fontWeight: 900,
            fontSize: 70,
            lineHeight: 1.1,
            color: IVORY,
            opacity: headingIn,
            transform: `translateX(${(1 - headingIn) * -40}px)`,
          }}
        >
          <EmphasisText text={heading} />
        </div>
        ) : null}
      </div>
      {children}
    </AbsoluteFill>
  );
};
