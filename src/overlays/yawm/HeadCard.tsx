import {useCurrentFrame, useVideoConfig} from "remotion";
import {ARABIC_FONT} from "../../theme";
import {Cue} from "../falak/common";
import {HeadCardOverlay} from "../../timeline/types";
import {CTA_TOP_Y} from "../Cta";
import {BookIcon} from "./icons";
import {arrive, ayahWord, bareLetters, INK, leave, MUTED, PAPER, SANS, TERM} from "./look";

const SIDE = 70;

// The claim-kind label used across this reel: small spaced capitals after an ink square.
export const Tag = ({text, color = INK}: {text: string; color?: string}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: 28,
      letterSpacing: 4,
      color,
    }}
  >
    <div style={{width: 12, height: 12, backgroundColor: color}} />
    {text}
  </div>
);

// An index card in the headroom above the speaker. It lands, then each line arrives
// on the word that says it and holds still.
export const HeadCard = ({card, cue}: {card: HeadCardOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const life = Math.min(arrive(frame, 0, 10), leave(frame, durationInFrames - 6));
  const word = card.word ? ayahWord(card.word.ayah, card.word.word) : null;

  return (
    <div
      style={{
        position: "absolute",
        top: CTA_TOP_Y,
        left: SIDE,
        right: SIDE,
        display: "flex",
        justifyContent: "center",
        opacity: life,
        transform: `translateY(${(1 - life) * -18}px)`,
        filter: `blur(${(1 - life) * 6}px)`,
      }}
    >
      <div
        style={{
          backgroundColor: PAPER,
          border: `3px solid ${INK}`,
          borderRadius: 18,
          boxShadow: "0 14px 34px rgba(27,27,27,0.18)",
          padding: "22px 34px 24px",
          display: "flex",
          alignItems: "center",
          gap: 30,
          maxWidth: 940,
        }}
      >
        {word ? (
          <div
            style={{
              fontFamily: ARABIC_FONT,
              fontSize: card.word?.bare ? 110 : 92,
              lineHeight: 1,
              height: 120,
              display: "flex",
              alignItems: "center",
              color: INK,
              direction: "rtl",
              // Amiri Quran draws low in its line box; vowel marks above need less lift.
              transform: `translateY(${card.word?.bare ? -44 : -26}px)`,
            }}
          >
            {card.word?.bare ? bareLetters(word) : word}
          </div>
        ) : null}
        {card.icon === "book" ? <BookIcon size={84} color={INK} strokeWidth={1.8} /> : null}
        <div style={{display: "flex", flexDirection: "column", gap: 8}}>
          {card.tag ? <Tag text={card.tag} /> : null}
          {card.lines.map((line) => {
            const shown = arrive(frame, Math.max(0, cue(line.at)), 10);
            return (
              <div
                key={line.text}
                style={{
                  fontFamily: line.term ? TERM : SANS,
                  fontStyle: line.term ? "italic" : "normal",
                  fontWeight: line.term ? 600 : 800,
                  fontSize: 50,
                  lineHeight: 1.12,
                  color: INK,
                  textWrap: "balance",
                  opacity: shown,
                  transform: `translateY(${(1 - shown) * 12}px)`,
                }}
              >
                {line.text}
              </div>
            );
          })}
          {card.source ? (
            <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, lineHeight: 1.3, color: MUTED, marginTop: 4}}>
              {card.source}
            </div>
          ) : null}
        </div>
        {card.icon === "question" ? <QuestionMark at={cue(card.lines[card.lines.length - 1].at)} /> : null}
      </div>
    </div>
  );
};

// A big question mark that drops in on the question's last words and settles.
const QuestionMark = ({at}: {at: number}) => {
  const frame = useCurrentFrame();
  const drop = arrive(frame, at, 10);
  const wobble = Math.sin(Math.max(0, frame - at) / 3) * 6 * Math.exp(-Math.max(0, frame - at) / 10);
  return (
    <div
      style={{
        width: 104,
        height: 104,
        borderRadius: 52,
        backgroundColor: INK,
        color: PAPER,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: 76,
        lineHeight: 1,
        flexShrink: 0,
        opacity: drop,
        transform: `translateY(${(1 - drop) * -30}px) rotate(${wobble}deg) scale(${0.7 + 0.3 * drop})`,
      }}
    >
      ?
    </div>
  );
};
