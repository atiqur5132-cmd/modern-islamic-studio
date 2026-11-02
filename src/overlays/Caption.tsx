import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {GOLD, HINDI_FONT, IVORY, NAVY, SAFE_AREA} from "../theme";

export type TimedCaptionWord = {text: string; emphasis: boolean; frame: number};

const CARD_TOP_FROM_BOTTOM = 640;
const OUTLINE = 12;

export const Caption = ({words, aboveCard}: {words: TimedCaptionWord[]; aboveCard: boolean}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame, fps, config: {damping: 18, stiffness: 220}});

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: aboveCard ? CARD_TOP_FROM_BOTTOM + 20 : SAFE_AREA.bottom + 40,
        paddingLeft: SAFE_AREA.side,
        paddingRight: SAFE_AREA.side,
      }}
    >
      <div
        style={{
          fontFamily: HINDI_FONT,
          fontWeight: 800,
          fontSize: 74,
          lineHeight: 1.35,
          textAlign: "center",
          opacity: entrance,
          transform: `scale(${interpolate(entrance, [0, 1], [0.92, 1])})`,
        }}
      >
        {words.map((word, index) => {
          const active = frame >= word.frame && frame < (words[index + 1]?.frame ?? Infinity);
          const highlighted = active || (word.emphasis && frame >= word.frame);
          const lift = active
            ? spring({frame: frame - word.frame, fps, config: {damping: 14, stiffness: 300}})
            : 0;
          return (
            <span
              key={`${word.frame}-${word.text}`}
              style={{
                display: "inline-block",
                margin: "0 10px",
                color: highlighted ? GOLD : IVORY,
                WebkitTextStroke: `${OUTLINE}px ${NAVY}`,
                paintOrder: "stroke fill",
                textShadow: `0 6px 18px ${NAVY}B3`,
                transform: `scale(${1 + 0.06 * lift})`,
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
