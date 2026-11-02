import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {GOLD, HINDI_FONT, IVORY, NAVY, SAFE_AREA} from "../theme";

export const Title = ({text}: {text: string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame, fps, config: {damping: 200}});

  return (
    <AbsoluteFill
      style={{
        paddingTop: SAFE_AREA.top,
        paddingLeft: SAFE_AREA.side,
        paddingRight: SAFE_AREA.side,
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: HINDI_FONT,
          fontWeight: 800,
          fontSize: 68,
          lineHeight: 1.3,
          color: IVORY,
          textAlign: "center",
          backgroundColor: `${NAVY}E6`,
          borderBottom: `6px solid ${GOLD}`,
          padding: "22px 40px",
          opacity: entrance,
          transform: `translateY(${(1 - entrance) * -30}px)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
