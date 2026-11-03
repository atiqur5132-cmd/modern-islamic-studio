import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {GOLD, IVORY, LATIN_FONT, NAVY, SAFE_AREA} from "../theme";

export type TimedCaptionWord = {text: string; emphasis: boolean; frame: number};

// The Ayah card is about 260 px tall above its safe-area margin.
const CARD_TOP_FROM_BOTTOM = SAFE_AREA.bottom + 260;
const OUTLINE = 10;

const HIGHLIGHT_ENTER_FRAMES = 4;
const HIGHLIGHT_POP = 0.08;
const WORD_GAP = 32;
const CHAR_WIDTH = 56; // Montserrat Black capitals at 84 px, on average
// Space a growing word may take on each side: the gap, less the outline of both words.
const POP_ROOM = WORD_GAP / 2 - OUTLINE / 2 - 2;

// The calmer look: ivory words with a dark outline rise in together; the word being
// spoken turns gold and grows 8%, with no bounce, and key words stay gold.
const HighlightCaption = ({words, aboveCard}: {words: TimedCaptionWord[]; aboveCard: boolean}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = interpolate(frame, [0, HIGHLIGHT_ENTER_FRAMES], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: aboveCard ? CARD_TOP_FROM_BOTTOM + 24 : SAFE_AREA.bottom + 20,
        paddingLeft: SAFE_AREA.rail,
        paddingRight: SAFE_AREA.rail,
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
          opacity: enter,
          transform: `translateY(${(1 - enter) * 14}px)`,
        }}
      >
        {words.map((word, index) => {
          const active = frame >= word.frame && frame < (words[index + 1]?.frame ?? Infinity);
          const lit = spring({frame: frame - word.frame, fps, config: {damping: 200, stiffness: 300}});
          const gold = active || word.emphasis;
          // A long word grows into its neighbour; cap the growth at what the gap allows.
          const pop = Math.min(HIGHLIGHT_POP, (2 * POP_ROOM) / (word.text.length * CHAR_WIDTH));
          return (
            <span
              key={`${word.frame}-${word.text}`}
              style={{
                display: "inline-block",
                margin: `4px ${WORD_GAP / 2}px`,
                color: gold ? GOLD : IVORY,
                WebkitTextStroke: `${OUTLINE}px ${NAVY}`,
                paintOrder: "stroke fill",
                textShadow: `0 6px 18px ${NAVY}CC`,
                transform: `scale(${active ? 1 + pop * lit : 1})`,
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

// Short-form caption style: a few big uppercase words that pop in together; the
// word being spoken sits on a gold pill, and key words stay gold and larger.
export const Caption = ({
  words,
  aboveCard,
  look = "pill",
}: {
  words: TimedCaptionWord[];
  aboveCard: boolean;
  look?: "pill" | "highlight";
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 11, stiffness: 260, mass: 0.7}});
  if (look === "highlight") {
    return <HighlightCaption words={words} aboveCard={aboveCard} />;
  }

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: aboveCard ? CARD_TOP_FROM_BOTTOM + 24 : SAFE_AREA.bottom + 20,
        paddingLeft: SAFE_AREA.rail,
        paddingRight: SAFE_AREA.rail,
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
