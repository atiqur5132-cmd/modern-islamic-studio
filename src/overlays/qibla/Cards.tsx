import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from "remotion";
import {AYAHS} from "../../data/quran";
import {ARABIC_FONT} from "../../theme";
import {
  QAyahOverlay,
  QBoardOverlay,
  QChestOverlay,
  QCompassOverlay,
  QFootageOverlay,
  QQuoteOverlay,
} from "../../timeline/qiblaTypes";
import {Cue} from "../falak/common";
import {STACK_HEIGHT, STACK_MOVE_FRAMES} from "../yawm/look";
import {arrive, CARD, INK, leave, MONO, MUTED, PAPER, PAPER_DEEP, QIBLA, RAIL, SANS, SIDE, TEXT_TOP} from "./look";
import {Chip, Dial, land, Stamp, Tag} from "./parts";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// The board under the speaker (the stack layout): it rises as the speaker slides into
// the top window. Its text stays above y 1326.
export const QBoard = ({o, cue}: {o: QBoardOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, STACK_MOVE_FRAMES], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const focus = o.focus ?? [0.5, 0.5];
  const style = {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`,
    filter: o.gray ? "grayscale(1) contrast(1.12)" : undefined,
    transform: `scale(${1.04 + frame * 0.0012})`,
  };
  const heading = o.heading ? cue(o.heading.at) : Infinity;
  const sphere = o.sphere ? cue(o.sphere.at) : Infinity;
  const drawn = o.sphere ? interpolate(frame, [sphere, sphere + 18], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)}) : 0;
  return (
    <AbsoluteFill style={{transform: `translateY(${(1 - rise) * (1920 - STACK_HEIGHT)}px)`}}>
      <div style={{position: "absolute", top: STACK_HEIGHT, left: 0, right: 0, bottom: 0, overflow: "hidden", backgroundColor: PAPER, borderTop: `6px solid ${INK}`}}>
        {o.video ? (
          <OffthreadVideo muted src={staticFile(`footage/${o.src}`)} trimBefore={Math.round((o.trim ?? 0) * 30)} playbackRate={o.rate ?? 1} style={style} />
        ) : (
          <Img src={staticFile(`footage/${o.src}`)} style={style} />
        )}
        <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(243,238,228,0.96) 0%, rgba(243,238,228,0.82) 26%, rgba(243,238,228,0) 46%)"}} />
        <div style={{position: "absolute", top: 34, left: SIDE, right: RAIL}}>
          <Tag text={o.tag} />
          {frame >= heading ? (
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 62, lineHeight: 1.02, color: INK, marginTop: 12, transform: `scale(${land(frame, heading)})`, transformOrigin: "left top"}}>
              {o.heading!.text}
            </div>
          ) : null}
          {o.note ? <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: MUTED, marginTop: 8}}>{o.note}</div> : null}
        </div>
        {frame >= sphere ? (
          // A spherical triangle on a small globe: the geometry the astronomers used.
          <div style={{position: "absolute", left: 620, top: 300, width: 300, height: 300, opacity: arrive(frame, sphere, 8)}}>
            <svg width={300} height={300} viewBox="0 0 300 300">
              <circle cx={150} cy={150} r={130} fill={CARD} stroke={INK} strokeWidth={6} />
              <ellipse cx={150} cy={150} rx={130} ry={42} fill="none" stroke={INK} strokeWidth={3} opacity={0.5} />
              <ellipse cx={150} cy={150} rx={48} ry={130} fill="none" stroke={INK} strokeWidth={3} opacity={0.5} />
              <path
                d="M 150 28 Q 112 120 92 186 Q 160 214 226 176 Q 196 104 150 28"
                fill="rgba(255,107,26,0.18)"
                stroke={QIBLA}
                strokeWidth={8}
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - drawn}
              />
            </svg>
            <div style={{position: "absolute", left: -40, right: -40, top: 300, textAlign: "center", fontFamily: SANS, fontWeight: 900, fontSize: 36, color: INK, backgroundColor: CARD, borderRadius: 10, padding: "6px 0"}}>
              {o.sphere!.text}
            </div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// A compass dial on chart paper.
export const QCompass = ({o, cue}: {o: QCompassOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const turn = cue(o.turnAt);
  const t = interpolate(frame, [turn, turn + 18], [0, 1], {...CLAMP, easing: Easing.out(Easing.back(1.5))});
  const roll = interpolate(frame, [turn, turn + 18], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const angle = o.mode === "1953" ? 56.55 * t : 56.5;
  const cx = 540;
  const cy = 860;
  const r = 290;
  const degrees = Math.floor(56.554 * roll);
  const minutes = Math.floor((56.554 * roll - degrees) * 60);
  const enter = arrive(frame, 0, 10);
  const stringIn = o.mode === "match" ? interpolate(frame, [turn, turn + 16], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)}) : 0;
  const rad = (angle * Math.PI) / 180;
  return (
    <AbsoluteFill style={{backgroundColor: PAPER}}>
      <div style={{position: "absolute", left: SIDE, right: SIDE, top: TEXT_TOP}}>
        <Tag text={o.tag} />
        <div style={{display: "flex", alignItems: "baseline", gap: 18, marginTop: 14}}>
          {o.mode === "1953" ? (
            <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 132, letterSpacing: -4, color: frame >= turn ? QIBLA : INK}}>
              {degrees}°{String(minutes).padStart(2, "0")}′
            </span>
          ) : (
            <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 132, letterSpacing: -4, color: QIBLA}}>56° NE</span>
          )}
        </div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 52, lineHeight: 1.05, color: INK, marginTop: 4}}>{o.line}</div>
        {o.source ? <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: MUTED, marginTop: 10}}>{o.source}</div> : null}
        {o.sub ? <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, color: INK, marginTop: 10}}>{o.sub}</div> : null}
      </div>
      <div style={{position: "absolute", inset: 0, opacity: enter, transform: `scale(${0.92 + 0.08 * enter})`, transformOrigin: `${cx}px ${cy}px`}}>
        <Dial cx={cx} cy={cy} r={r} needle={angle} face={CARD} showNeedle={o.mode === "match" || frame >= turn} />
        {o.mode === "1953" ? (
          // The mosque seen from above: its hall, with the qibla wall marked, turning to its bearing.
          <div style={{position: "absolute", left: cx - 90, top: cy - 110, width: 180, height: 220, transform: `rotate(${angle}deg)`, transformOrigin: "90px 110px"}}>
            <div style={{position: "absolute", inset: 0, border: `8px solid ${INK}`, borderRadius: 8, backgroundColor: "rgba(16,32,58,0.08)"}} />
            <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 22, backgroundColor: frame >= turn ? QIBLA : INK}} />
            <div style={{position: "absolute", left: 70, top: -26, width: 40, height: 30, borderRadius: "20px 20px 0 0", backgroundColor: frame >= turn ? QIBLA : INK}} />
          </div>
        ) : (
          <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
            <path
              d={`M ${cx + r * 0.84 * Math.sin(rad)} ${cy - r * 0.84 * Math.cos(rad)} Q ${cx + r * 1.25 * Math.sin(rad + 0.25)} ${cy - r * 1.32 * Math.cos(rad + 0.25)} ${cx + r * 1.5 * Math.sin(rad + 0.7)} ${cy - r * 1.2 * Math.cos(rad + 0.7)}`}
              fill="none"
              stroke={QIBLA}
              strokeWidth={12}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - stringIn}
              strokeOpacity={0.9}
            />
          </svg>
        )}
      </div>
    </AbsoluteFill>
  );
};

// A chip on the chest.
export const QChest = ({o, cue}: {o: QChestOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const at = cue(o.chip.at);
  if (frame < at) {
    return null;
  }
  return (
    <AbsoluteFill>
      <Chip size={54} accent style={{left: 540, top: 975, transform: `translateX(-50%) scale(${land(frame, at, 1.3)})`}}>
        ✓ {o.chip.text}
      </Chip>
    </AbsoluteFill>
  );
};

// What people said at the time, on a paper card; the speaker is in the corner circle.
export const QQuote = ({o, cue}: {o: QQuoteOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const card = arrive(frame, 2, 12);
  return (
    <AbsoluteFill style={{backgroundColor: PAPER_DEEP}}>
      <div style={{position: "absolute", left: SIDE, top: TEXT_TOP}}>
        <Tag text={o.tag} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 690,
          padding: "44px 52px 40px",
          backgroundColor: CARD,
          borderRadius: 10,
          boxShadow: "0 24px 50px rgba(16,32,58,0.22)",
          opacity: card,
          transform: `translateY(${(1 - card) * 120}px) rotate(${-1.2 * card}deg)`,
        }}
      >
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 3, color: MUTED}}>{o.who}</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 66, lineHeight: 1.06, letterSpacing: -1, color: INK, marginTop: 16}}>{o.quote}</div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: MUTED, marginTop: 20}}>{o.source}</div>
        <Stamp text={o.stamp.text} at={cue(o.stamp.at)} size={64} rotate={-8} style={{left: 30, top: -50}} />
      </div>
    </AbsoluteFill>
  );
};

// Real footage over the whole frame.
export const QFootage = ({o, cue}: {o: QFootageOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const lineAt = o.line ? cue(o.line.at) : Infinity;
  return (
    <AbsoluteFill style={{backgroundColor: INK}}>
      <OffthreadVideo
        muted
        src={staticFile(`footage/${o.src}`)}
        trimBefore={Math.round((o.trim ?? 0) * 30)}
        style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + frame * 0.001})`}}
      />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(10,20,38,0.7) 0%, rgba(10,20,38,0) 34%)"}} />
      <div style={{position: "absolute", left: SIDE, right: SIDE, top: TEXT_TOP}}>
        <Tag text={o.tag} color="#FFFFFF" />
        {frame >= lineAt ? (
          <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 92, lineHeight: 1, letterSpacing: -2, color: "#FFFFFF", marginTop: 14, textShadow: "0 4px 20px rgba(0,0,0,0.5)", transform: `scale(${land(frame, lineAt)})`, transformOrigin: "left top"}}>
            {o.line!.text}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// The Ayah card: only the tokens from..to of the verified Ayah, never typed.
export const QAyah = ({o, cue}: {o: QAyahOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const entry = (AYAHS as Record<string, {textUthmani: string}>)[o.ayah];
  if (!entry) {
    throw new Error(`Ayah ${o.ayah} is missing. Run scripts/fetch_ayah.py ${o.ayah}`);
  }
  const tokens = entry.textUthmani.split(/\s+/).slice(o.from - 1, o.to);
  const card = arrive(frame, 0, 12);
  const noteAt = cue(o.note.at);
  const note = arrive(frame, noteAt, 12);
  return (
    <AbsoluteFill style={{backgroundColor: PAPER}}>
      <div style={{position: "absolute", left: SIDE, top: TEXT_TOP}}>
        <Tag text={o.tag} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 290,
          padding: "34px 44px 38px",
          backgroundColor: CARD,
          borderRadius: 12,
          boxShadow: "0 22px 44px rgba(16,32,58,0.18)",
          opacity: card,
          transform: `translateY(${(1 - card) * 80}px)`,
        }}
      >
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
          <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 34, color: QIBLA}}>{o.label}</span>
          <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 26, color: MUTED}}>{o.translationSource}</span>
        </div>
        <div style={{direction: "rtl", textAlign: "center", fontFamily: ARABIC_FONT, fontSize: 88, lineHeight: 1.75, color: INK, marginTop: 4, marginBottom: 18}}>
          {tokens.join(" ")}
        </div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 42, lineHeight: 1.16, color: INK}}>{o.translation}</div>
      </div>
      {frame >= noteAt ? (
        <div
          style={{
            position: "absolute",
            left: 60,
            right: RAIL,
            top: 840,
            padding: "24px 36px 26px",
            backgroundColor: INK,
            borderRadius: 12,
            opacity: note,
            transform: `translateY(${(1 - note) * 60}px)`,
          }}
        >
          <Tag text={o.note.tag} color="#FFFFFF" size={26} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, lineHeight: 1.15, color: "#FFFFFF", marginTop: 10}}>{o.note.text}</div>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: "rgba(255,255,255,0.75)", marginTop: 8}}>{o.note.sub}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export {leave};
