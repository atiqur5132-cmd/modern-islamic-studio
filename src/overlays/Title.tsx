import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {GOLD, HINDI_FONT, IVORY, NAVY, SAFE_AREA} from "../theme";

const WORD_STAGGER_FRAMES = 3;

// Words between *stars* turn gold.
const parseWords = (text: string) => {
  let emphasis = false;
  return text.split(" ").map((token) => {
    emphasis = emphasis || token.startsWith("*");
    const word = {text: token.replaceAll("*", ""), emphasis};
    if (token.endsWith("*")) {
      emphasis = false;
    }
    return word;
  });
};

export const Title = ({text}: {text: string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const panel = spring({frame, fps, config: {damping: 200}});

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
          textAlign: "center",
          backgroundColor: `${NAVY}E6`,
          borderBottom: `6px solid ${GOLD}`,
          padding: "22px 40px",
          opacity: panel,
          transform: `translateY(${(1 - panel) * -30}px)`,
        }}
      >
        {parseWords(text).map((word, index) => {
          const reveal = spring({
            frame: frame - index * WORD_STAGGER_FRAMES,
            fps,
            config: {damping: 16, stiffness: 180},
          });
          return (
            <span
              key={`${index}-${word.text}`}
              style={{
                display: "inline-block",
                margin: "0 10px",
                color: word.emphasis ? GOLD : IVORY,
                opacity: reveal,
                transform: `translateY(${(1 - reveal) * 24}px)`,
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
