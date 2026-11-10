import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {GOLD, IVORY, LATIN_FONT, NAVY, SAFE_AREA} from "../theme";
import {COUNT, INK, MONO, PAPER, SANS, TERM} from "./yawm/look";
import {FONTS, FontName} from "../fonts";
import {CaptionDesign} from "../timeline/types";

const LEDGER = {sans: SANS, mono: MONO, term: TERM, ink: INK, paper: PAPER, count: COUNT, white: "#FFFDF8"};

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

const LEDGER_WIPE_FRAMES = 3;
const LEDGER_ENTER_FRAMES = 5;
const NUMBER = /^\d[\d,.]*$/;
const bareToken = (text: string) => text.replace(/[*"“”.,!?:;…]/g, "").toLowerCase();

// The "ledger" look (Yawm 365): sentence-case words, white with an ink edge so they
// read on the wall, the chest and the paper alike. Three roles by fixed rules: words
// in Inter Tight, numbers in IBM Plex Mono in the count colour, the reel's Arabic
// terms in Fraunces italic. The spoken word is wiped onto an ink tab (a number onto
// a count-coloured tab), like a line being ticked off.
const LedgerCaption = ({
  words,
  bottom,
  terms,
}: {
  words: TimedCaptionWord[];
  bottom: number;
  terms: string[];
}) => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, LEDGER_ENTER_FRAMES], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: bottom,
        paddingLeft: SAFE_AREA.rail,
        paddingRight: SAFE_AREA.rail,
      }}
    >
      <div
        style={{
          fontSize: 76,
          lineHeight: 1.22,
          textAlign: "center",
          opacity: enter,
          transform: `translateY(${(1 - enter) * 12}px)`,
        }}
      >
        {words.map((word, index) => {
          const active = frame >= word.frame && frame < (words[index + 1]?.frame ?? Infinity);
          const wipe = active
            ? interpolate(frame, [word.frame, word.frame + LEDGER_WIPE_FRAMES], [0, 1], {
                extrapolateRight: "clamp",
                easing: Easing.out(Easing.cubic),
              })
            : 0;
          const token = bareToken(word.text);
          const isNumber = NUMBER.test(token);
          const isTerm = terms.includes(token);
          const inverted = wipe > 0.5;
          // A number waits for its word: the graphics reveal each total as it is said,
          // and the caption must not give it away first. Its space is kept.
          const hidden = isNumber && frame < word.frame;
          return (
            <span
              key={`${word.frame}-${word.text}`}
              style={{
                position: "relative",
                display: "inline-block",
                margin: "2px 10px",
                padding: "0 6px",
                opacity: hidden ? 0 : 1,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: "8px -8px 4px",
                  borderRadius: 10,
                  backgroundColor: isNumber ? LEDGER.count : LEDGER.ink,
                  transform: `scaleX(${wipe})`,
                  transformOrigin: "0 50%",
                }}
              />
              <span
                style={{
                  position: "relative",
                  fontFamily: isNumber ? LEDGER.mono : isTerm ? LEDGER.term : LEDGER.sans,
                  fontWeight: isNumber ? 700 : isTerm ? 600 : 900,
                  fontStyle: isTerm ? "italic" : "normal",
                  letterSpacing: isNumber ? -2 : 0,
                  color: inverted ? LEDGER.paper : isNumber ? LEDGER.count : LEDGER.white,
                  WebkitTextStroke: inverted ? "0px" : `9px ${LEDGER.ink}`,
                  paintOrder: "stroke fill",
                  textShadow: inverted ? "none" : `0 5px 14px ${LEDGER.ink}66`,
                }}
              >
                {word.text.replaceAll("*", "")}
              </span>
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

type TypeLook = "editorial" | "punch" | "quiet";

// Soft, layered shadow: reads on the pale wall and on footage without the hard
// sticker outline of template captions.
const softShadow = (ink: string) => `0 1px 2px ${ink}99, 0 3px 14px ${ink}59`;

// The newer looks (STYLE.md, Captions). Fonts and size come from the reel's
// captionDesign; the accent is the reel's one accent colour.
const TypeCaption = ({
  words,
  bottom,
  look,
  design,
  accent,
  ink,
}: {
  words: TimedCaptionWord[];
  bottom: number;
  look: TypeLook;
  design: CaptionDesign;
  accent: string;
  ink?: string;
}) => {
  const frame = useCurrentFrame();
  const sans = FONTS[(design.sans ?? (look === "punch" ? "Anton" : "Inter Tight")) as FontName];
  const serif = FONTS[(design.serif ?? "Instrument Serif") as FontName];
  // Over footage: warm white, and emphasis keeps that white (an accent on skin or
  // clothes turns muddy) unless the reel sets one. On a light page: the reel's ink,
  // no shadow, emphasis in the accent.
  const onPage = Boolean(ink);
  const color = onPage ? ink! : design.color ?? "#FBF8F2";
  const accentColor = onPage ? accent : design.accent ?? color;
  const shade = "#0B0D12";
  const size = design.size ?? {editorial: 68, punch: 100, quiet: 54}[look];
  const enter = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.exp)});

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: bottom,
        paddingLeft: SAFE_AREA.rail,
        paddingRight: SAFE_AREA.rail,
      }}
    >
      <div
        style={{
          fontSize: size,
          lineHeight: look === "punch" ? 1.02 : 1.18,
          textAlign: "center",
          opacity: enter,
          transform: `translateY(${(1 - enter) * 10}px)`,
        }}
      >
        {words.map((word, index) => {
          const spoken = frame >= word.frame;
          const active = spoken && frame < (words[index + 1]?.frame ?? Infinity);
          const lit = interpolate(frame, [word.frame, word.frame + 3], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const text = word.text.replaceAll("*", "");
          const base = {
            display: "inline-block",
            margin: look === "punch" ? "0 0.12em" : "0 0.13em",
            textShadow: onPage ? "none" : softShadow(shade),
          } as const;
          if (look === "punch") {
            return (
              <span
                key={`${word.frame}-${text}`}
                style={{
                  ...base,
                  fontFamily: sans,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  color: word.emphasis ? design.accent ?? accent : color,
                  WebkitTextStroke: onPage ? "0px" : `5px ${shade}D9`,
                  paintOrder: "stroke fill",
                  transform: `scale(${active ? 1 + 0.05 * lit : 1})`,
                }}
              >
                {text}
              </span>
            );
          }
          const italic = word.emphasis;
          return (
            <span
              key={`${word.frame}-${text}`}
              style={{
                ...base,
                fontFamily: italic ? serif : sans,
                fontStyle: italic ? "italic" : "normal",
                fontWeight: italic ? 400 : look === "quiet" ? 600 : 700,
                // The serif is lighter and smaller on the body: lift it to match.
                fontSize: italic ? "1.28em" : "1em",
                lineHeight: 0.9,
                letterSpacing: italic ? 0 : -0.5,
                color: italic && look === "editorial" ? accentColor : color,
                // Editorial: words not yet said wait at half strength, then light up.
                opacity: look === "editorial" ? 0.5 + 0.5 * lit : 1,
              }}
            >
              {text}
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
  // New reels default to "editorial" (STYLE.md); earlier reels name their look.
  look = "editorial",
  bottom,
  terms = [],
  design = {},
  accent = GOLD,
  ink,
}: {
  words: TimedCaptionWord[];
  aboveCard: boolean;
  look?: "pill" | "highlight" | "ledger" | TypeLook;
  // Distance of the caption's foot from the frame's bottom edge, for layouts that
  // move the speaker (the stack window); the band default otherwise.
  bottom?: number;
  terms?: string[];
  design?: CaptionDesign;
  accent?: string;
  // Set when the caption sits on a light page graphic: words take this ink colour.
  ink?: string;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 11, stiffness: 260, mass: 0.7}});
  if (look === "editorial" || look === "punch" || look === "quiet") {
    return (
      <TypeCaption
        words={words}
        look={look}
        design={design}
        accent={accent}
        ink={ink}
        bottom={bottom ?? (aboveCard ? CARD_TOP_FROM_BOTTOM + 24 : SAFE_AREA.bottom + 20)}
      />
    );
  }
  if (look === "highlight") {
    return <HighlightCaption words={words} aboveCard={aboveCard} />;
  }
  if (look === "ledger") {
    return (
      <LedgerCaption
        words={words}
        terms={terms}
        bottom={bottom ?? (aboveCard ? CARD_TOP_FROM_BOTTOM + 24 : SAFE_AREA.bottom + 20)}
      />
    );
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
