import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {BallOverlay, QuoteCardOverlay} from "../../timeline/flatTypes";
import {Cue} from "../falak/common";
import {arrive, CARD, INK, leave, MARK, MUTED, RAIL, SAND, SANS, SIDE, TERM, TEXT_TOP} from "./look";
import {Tag} from "./parts";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// A scholar's view on an index card in the caption band (the captions give way to it),
// clear of the face and the right rail.
export const QuoteCard = ({q}: {q: QuoteCardOverlay}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const life = Math.min(arrive(frame, 0, 12), leave(frame, durationInFrames - 6, 6));
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        right: RAIL,
        top: 990,
        boxSizing: "border-box",
        padding: "22px 30px 22px",
        backgroundColor: CARD,
        border: `3px solid ${INK}`,
        borderRadius: 16,
        boxShadow: "0 18px 36px rgba(27,27,27,0.25)",
        opacity: life,
        transform: `translateY(${(1 - life) * 40}px) rotate(${-1.2 * life}deg)`,
      }}
    >
      <Tag text={q.tag} />
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, color: INK, marginTop: 10}}>{q.title}</div>
      <div style={{fontFamily: TERM, fontStyle: "italic", fontWeight: 600, fontSize: 42, lineHeight: 1.12, color: INK, marginTop: 8}}>{q.quote}</div>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, lineHeight: 1.25, color: MUTED, marginTop: 10}}>{q.source}</div>
    </div>
  );
};

// Al-Razi on 88:20, drawn: an enormous ball with a tiny person on top. The view drops
// to his eye level; the more the ball fills the view, the flatter the curve under him.
export const Ball = ({b, cue}: {b: BallOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const drop = cue(b.dropAt);
  const zoom = interpolate(frame, [0, drop, drop + 24], [1, 1.25, 26], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const quote = arrive(frame, cue(b.quote.at), 12);
  const flat = arrive(frame, drop + 24, 10);
  // The figure stands on top of the ball; the camera keeps him at (540, PIN_Y).
  const PIN_Y = 900;
  const radius = 380 * zoom;
  const person = 26 * Math.min(zoom, 6) ** 0.55;

  return (
    <AbsoluteFill style={{backgroundColor: SAND}}>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        <defs>
          <radialGradient id="ball-shade" cx="40%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#D9C7A4" />
            <stop offset="100%" stopColor="#B49D76" />
          </radialGradient>
        </defs>
        <circle cx={540} cy={PIN_Y + radius} r={radius} fill="url(#ball-shade)" stroke={INK} strokeWidth={6} />
        {/* A tiny person: head and body, standing on the top of the ball. */}
        <g transform={`translate(540 ${PIN_Y}) scale(${person / 26})`}>
          <circle cx={0} cy={-46} r={8} fill={INK} />
          <rect x={-6} y={-37} width={12} height={26} rx={5} fill={INK} />
          <rect x={-6} y={-13} width={5} height={13} fill={INK} />
          <rect x={1} y={-13} width={5} height={13} fill={INK} />
        </g>
        {/* His line of sight, once the view is at his eye level. */}
        <line x1={60} x2={1020} y1={PIN_Y} y2={PIN_Y} stroke={MARK} strokeWidth={5} strokeDasharray="14 12" opacity={flat} />
      </svg>
      <div style={{position: "absolute", left: 0, right: 0, top: PIN_Y + 40, textAlign: "center", opacity: flat}}>
        <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 64, letterSpacing: 2, color: MARK}}>LOOKS FLAT</span>
      </div>
      <div style={{position: "absolute", top: TEXT_TOP, left: SIDE, right: SIDE}}>
        <Tag text={b.tag} />
        <div style={{opacity: quote, transform: `translateY(${(1 - quote) * 16}px)`, marginTop: 16}}>
          <div style={{fontFamily: TERM, fontStyle: "italic", fontWeight: 600, fontSize: 58, lineHeight: 1.1, color: INK}}>{b.quote.text}</div>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, lineHeight: 1.3, color: MUTED, marginTop: 12}}>{b.source}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
