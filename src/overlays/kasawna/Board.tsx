import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {KStackOverlay} from "../../timeline/kasawnaTypes";
import {Cue} from "../falak/common";
import {STACK_HEIGHT, STACK_MOVE_FRAMES} from "../yawm/look";
import {Form} from "./Form";
import {ACCENT, ARABIC, arrive, ayahWords, draw, GROUND, INK, leave, MUTED, RAIL, SANS, SERIF, SIDE} from "./look";
import {Arabic} from "./Pages";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
// Text on the board stays above the platform's caption and buttons.
const BOTTOM = 1326;

const BoardCredit = ({text, at, until}: {text: string; at: number; until?: number}) => {
  const frame = useCurrentFrame();
  const [kind, ...rest] = text.split(" · ");
  const shown = arrive(frame, at, 14) * (until === undefined ? 1 : leave(frame, until, 6));
  return (
    <div style={{position: "absolute", left: SIDE, right: RAIL, bottom: 1920 - BOTTOM, fontFamily: SANS, fontWeight: 600, fontSize: 28, lineHeight: 1.35, color: MUTED, opacity: shown}}>
      <span style={{color: INK, fontWeight: 700}}>{kind}</span>
      {rest.length ? ` · ${rest.join(" · ")}` : ""}
    </div>
  );
};

// Galen's collected works in Greek (Basel, 1538), title page: where the board shows it,
// in pixels of public/footage/mk-galen.jpg (1800 px wide). The title "GALENI PERGAMENI"
// runs x 295-1240 with its baseline near y 556 (measured on the image).
const GALEN = {scale: 1, left: -227, top: -350, line: {x1: 295, x2: 1240, y: 566}};

// The board under the speaker (beats 10, 12-13).
export const KStack = ({o, cue}: {o: KStackOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, STACK_MOVE_FRAMES], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill style={{transform: `translateY(${(1 - rise) * (1920 - STACK_HEIGHT)}px)`}}>
      <div style={{position: "absolute", top: STACK_HEIGHT, left: 0, right: 0, bottom: 0, overflow: "hidden", backgroundColor: GROUND, borderTop: `2px solid ${MUTED}55`}}>
        <div style={{position: "absolute", inset: 0, top: -STACK_HEIGHT}}>{o.mode === "galen" ? <Galen o={o} cue={cue} /> : <Kasawna o={o} cue={cue} />}</div>
      </div>
    </AbsoluteFill>
  );
};

const Galen = ({o, cue}: {o: KStackOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const underline = draw(frame, o.underlineAt !== undefined ? cue(o.underlineAt) : Infinity, 14);
  const {scale, left, top, line} = GALEN;
  const y0 = STACK_HEIGHT + top;
  return (
    <>
      <div style={{position: "absolute", left, top: y0, transform: `scale(${1 + frame * 0.0005})`, transformOrigin: `540px ${STACK_HEIGHT}px`}}>
        <Img src={staticFile(`footage/${o.src}`)} style={{width: 1800 * scale, display: "block", filter: "sepia(0.15) brightness(0.92)"}} />
        <svg width={1800 * scale} height={1000} style={{position: "absolute", left: 0, top: 0}}>
          <line x1={line.x1 * scale} y1={line.y * scale} x2={(line.x1 + (line.x2 - line.x1) * underline) * scale} y2={line.y * scale} stroke={ACCENT} strokeWidth={6} strokeLinecap="round" />
        </svg>
      </div>
      {/* The page fades into the ground above the credit. */}
      <div style={{position: "absolute", left: 0, right: 0, top: 1060, height: 150, background: `linear-gradient(180deg, ${GROUND}00 0%, ${GROUND} 100%)`}} />
      <div style={{position: "absolute", left: 0, right: 0, top: 1209, bottom: 0, backgroundColor: GROUND}} />
      <BoardCredit text={o.credit} at={4} />
    </>
  );
};

// The payoff word (beats 12-13): the Arabic large as it is recited; on the cut it steps
// up beside the bare skeleton with its meaning; on "kapde" the flesh is pulled on; then
// *joined* comes and is struck through, and *clothed* lands.
const Kasawna = ({o, cue}: {o: KStackOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const word = o.word!;
  const wordAt = cue(word.at);
  const formAt = o.formAt !== undefined ? cue(o.formAt) : Infinity;
  const clothAt = o.clothAt !== undefined ? cue(o.clothAt) : Infinity;
  const joinedAt = o.joined ? cue(o.joined.at) : Infinity;
  const strikeAt = o.joined ? cue(o.joined.strikeAt) : Infinity;
  const clothedAt = o.clothed ? cue(o.clothed.at) : Infinity;
  // Before the cut: the phrase large, centred. After: the word steps up to the right.
  const settle = draw(frame, formAt, 18);
  const phrase = arrive(frame, wordAt, 18);
  const joined = arrive(frame, joinedAt, 14);
  const strike = draw(frame, strikeAt, 10);
  const clothed = arrive(frame, clothedAt, 16);
  const meaning = arrive(frame, formAt + 6, 16) * leave(frame, joinedAt - 2, 8);
  const top = STACK_HEIGHT;
  return (
    <>
      {/* The recited phrase, the payoff word largest. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: top + 70 - 30 * settle,
          display: "flex",
          justifyContent: "center",
          opacity: phrase * (1 - settle),
          transform: `translateY(${(1 - phrase) * 22}px)`,
        }}
      >
        <div style={{direction: "rtl", display: "flex", alignItems: "baseline", gap: 26}}>
          <Arabic ayah={word.ayah} from={word.from} size={210} />
          <div style={{fontFamily: ARABIC, fontSize: 96, color: INK, opacity: 0.8}}>{ayahWords(word.ayah, word.from + 1, word.bigTo ?? word.from + 2)}</div>
        </div>
      </div>
      {/* After the cut: the bare skeleton, then the flesh pulled on. */}
      <div style={{position: "absolute", left: 50, top: top + 40, opacity: settle}}>
        <Form state={{bones: draw(frame, formAt, 26), cloth: draw(frame, clothAt, 30), breathe: frame}} size={380} />
      </div>
      <div style={{position: "absolute", left: 480, right: RAIL - 40, top: top + 24, opacity: settle}}>
        <Arabic ayah={word.ayah} from={word.from} size={128} />
        <div style={{position: "relative", height: 190, marginTop: -16}}>
          <div style={{position: "absolute", left: 0, top: 0, opacity: meaning}}>
            <div style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 64, color: INK, lineHeight: 1.05}}>{o.meaning?.text.split(":")[0].replace(/\*/g, "").trim()}</div>
            <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 64, color: INK, lineHeight: 1.1}}>{o.meaning?.text.split(":")[1]?.replace(/\*/g, "").trim()}</div>
          </div>
          <div style={{position: "absolute", left: 0, top: 0, opacity: joined * (1 - 0.55 * strike)}}>
            <div style={{position: "relative", display: "inline-block", fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 72, color: MUTED}}>
              {o.joined?.text}
              <div style={{position: "absolute", left: -6, top: "54%", height: 4, width: `calc(${strike * 100}% + 12px)`, backgroundColor: INK}} />
            </div>
          </div>
          <div style={{position: "absolute", left: 0, top: 78, opacity: clothed, transform: `translateY(${(1 - clothed) * 16}px)`}}>
            <div style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 100, color: ACCENT, lineHeight: 1}}>{o.clothed?.text}</div>
          </div>
        </div>
      </div>
      <BoardCredit text={o.credit} at={formAt + 10} until={o.joined ? joinedAt - 4 : undefined} />
      {o.creditLater ? <BoardCredit text={o.creditLater.text} at={cue(o.creditLater.at)} /> : null}
    </>
  );
};
