import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {GOLD, IVORY, LATIN_FONT, NAVY, SAFE_AREA} from "../theme";

export type TimedCaptionWord = {text: string; emphasis: boolean; frame: number};

const CARD_TOP_FROM_BOTTOM = 640;
const OUTLINE = 10;

// Short-form caption style: a few big uppercase words that pop in together; the
// word being spoken sits on a gold pill, and key words stay gold and larger.
export const Caption = ({words, aboveCard}: {words: TimedCaptionWord[]; aboveCard: boolean}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 11, stiffness: 260, mass: 0.7}});

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: aboveCard ? CARD_TOP_FROM_BOTTOM + 24 : SAFE_AREA.bottom + 50,
        paddingLeft: SAFE_AREA.side,
        paddingRight: SAFE_AREA.side,
      }}
    >
      <div
        style={{
          fontFamily: LATIN_FONT,
          fontWeight: 900,
          fontSize: 84,
          lineHeight: 1.18,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: -1,
          opacity: interpolate(pop, [0, 0.4], [0, 1], {extrapolateRight: "clamp"}),
          transform: `scale(${interpolate(pop, [0, 1], [0.6, 1])}) rotate(${interpolate(pop, [0, 1], [-4, 0])}deg)`,
        }}
      >
        {words.map((word, index) => {
          const active = frame >= word.frame && frame < (words[index + 1]?.frame ?? Infinity);
          const hit = spring({frame: frame - word.frame, fps, config: {damping: 9, stiffness: 320}});
          const keyword = word.emphasis;
          const size = keyword ? 1.18 : 1;
          return (
            <span
              key={`${word.frame}-${word.text}`}
              style={{
                display: "inline-block",
                margin: "4px 8px",
                padding: active ? "0 16px" : "0 2px",
                borderRadius: 14,
                backgroundColor: active ? GOLD : "transparent",
                color: active ? NAVY : keyword ? GOLD : IVORY,
                WebkitTextStroke: active ? "0px" : `${OUTLINE}px ${NAVY}`,
                paintOrder: "stroke fill",
                textShadow: active
                  ? "none"
                  : keyword
                    ? `0 0 28px ${GOLD}AA, 0 6px 16px ${NAVY}CC`
                    : `0 6px 16px ${NAVY}CC`,
                boxShadow: active ? `0 8px 24px ${NAVY}99` : "none",
                transform: `scale(${size * (active ? 1 + 0.08 * hit : 1)}) translateY(${active ? -4 * hit : 0}px)`,
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
