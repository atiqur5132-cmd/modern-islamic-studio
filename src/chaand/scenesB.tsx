import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {Cues} from "../long/scroll/types";
import {ACCENT, ARABIC, arrive, ayahWords, draw, GROUND, INK, leave, MUTED, SANS, SERIF, SIDE, snap, TEXT_TOP} from "./look";
import {Credit, Forward, Label, Line, Moon, Photo, Stars, Strike, Sun} from "./parts";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

// Line 9: the forward comes back, tilts on "galat", "Not entirely." on "poora nahi", slides
// away; "nur" steps back and siraj lands big in amber over the lamp.
export const Turn = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const galat = cues.word(9, 2);
  const poora = cues.word(9, 4);
  const away = cues.word(9, 6);
  const nurAt = cues.word(9, 8);
  const sirajAt = cues.word(9, 11);
  const tilt = interpolate(frame, [galat, galat + 10], [0, -4], {...CLAMP, easing: easeOut});
  const gone = interpolate(frame, [away, away + 8], [0, 1], {...CLAMP, easing: (t) => t * t});
  const siraj = frame >= sirajAt;
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      {siraj ? (
        <AbsoluteFill style={{opacity: 0.5 * arrive(frame, sirajAt, 10)}}>
          <Photo src="cn-lamp.jpg" fileAspect={4 / 3} focus={[0.7, 0.52]} from={1.25} to={1.32} frames={40} />
        </AbsoluteFill>
      ) : null}
      <Stars count={30} seed="turn" opacity={siraj ? 0 : 0.5} />
      <div style={{position: "absolute", inset: 0, transform: `translateX(${-1100 * gone}px)`}}>
        <Forward x={SIDE} y={430} enter={arrive(frame, 0, 12)} mark={1} tilt={tilt} dim={1 - 0.35 * arrive(frame, galat, 10)} />
        <Line at={poora} y={900} size={96}>Not entirely.</Line>
      </div>
      {frame >= nurAt && !siraj ? <Line at={nurAt} y={600} size={150} align="center" color={MUTED}>nur</Line> : null}
      {siraj ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 420, textAlign: "center", opacity: snap(frame, sirajAt, 5), transform: `scale(${1.15 - 0.15 * snap(frame, sirajAt, 8)})`}}>
          <div style={{fontFamily: ARABIC, fontSize: 260, lineHeight: 1.6, color: ACCENT}}>{ayahWords("71:16", 7)}</div>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 76, color: INK}}>siraj</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// The four places siraj occurs (root s-r-j, Quranic Arabic Corpus), each as fetched.
const PLACES = [
  {key: "25:61", word: 9, to: "sun"},
  {key: "33:46", word: 5, to: "prophet"},
  {key: "71:16", word: 7, to: "sun"},
  {key: "78:13", word: 2, to: "sun"},
] as const;

// Lines 10-11: four lamps light in a row and "4" lands on "chaar"; then they sort: three
// to the Sun, one to the Prophet ﷺ, and the Moon's place stays empty: 0.
export const Count = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const fourAt = cues.word(10, 6);
  const sortAt = cues.word(11, 2); // "suraj"
  const prophetAt = cues.word(11, 7); // "Nabi"
  const moonAt = cues.word(11, 12); // "chaand"
  const zeroAt = cues.word(11, 15); // "Ek baar bhi nahi"
  const colsIn = arrive(frame, cues.word(11, 0), 14);
  const cols = {sun: 220, prophet: 540, moon: 860};
  const four = arrive(frame, fourAt, 8) * leave(frame, cues.word(11, 0), 8);
  // Where each sorted token lands, stacked in its column.
  let sunSlot = 0;
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Stars count={30} seed="count" opacity={0.4} />
      <div style={{position: "absolute", left: 0, right: 0, top: TEXT_TOP - 40, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 210, color: INK, opacity: four, transform: `scale(${1.2 - 0.2 * snap(frame, fourAt, 6)})`}}>4</div>
      <Label at={fourAt + 4} x={0} y={TEXT_TOP + 230} width={1080} align="center" color={MUTED} size={38} weight={600}>
        {four > 0.05 ? "times in the whole Quran" : ""}
      </Label>
      {/* The three columns: Sun, the Prophet ﷺ, Moon. */}
      <div style={{opacity: colsIn}}>
        <Sun x={cols.sun} y={330} d={150} light={1} />
        <div style={{position: "absolute", left: cols.prophet - 150, width: 300, top: 285, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 44, lineHeight: 1.1, color: INK}}>the Prophet <span style={{fontFamily: ARABIC, fontStyle: "normal"}}>ﷺ</span></div>
        <Moon x={cols.moon} y={330} d={150} light={1} />
      </div>
      {PLACES.map((p, i) => {
        const startX = 180 + i * 240;
        const startY = 640;
        const lightAt = cues.word(10, 2) + i * 5;
        const lit = arrive(frame, lightAt, 8);
        const goAt = p.to === "sun" ? sortAt + sunSlot * 4 : prophetAt;
        const slot = p.to === "sun" ? sunSlot++ : 0;
        const go = interpolate(frame, [goAt, goAt + 12], [0, 1], {...CLAMP, easing: easeOut});
        const endX = p.to === "sun" ? cols.sun : cols.prophet;
        const endY = 510 + slot * 125;
        const x = startX + (endX - startX) * go;
        const y = startY + (endY - startY) * go;
        return (
          <div key={p.key} style={{position: "absolute", left: x - 110, top: y - 70, width: 220, textAlign: "center", opacity: 0.35 + 0.65 * lit}}>
            <div style={{fontFamily: ARABIC, fontSize: 70, lineHeight: 1.5, color: lit > 0.5 ? ACCENT : INK}}>{ayahWords(p.key, p.word)}</div>
            <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: MUTED}}>{p.key}</div>
          </div>
        );
      })}
      {/* The Moon's place: empty, then 0. */}
      <div style={{position: "absolute", left: cols.moon - 90, top: 470, width: 180, height: 150, borderRadius: 18, border: `4px dashed ${MUTED}`, opacity: arrive(frame, moonAt, 10)}} />
      <div style={{position: "absolute", left: cols.moon - 150, width: 300, top: 640, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 170, color: INK, opacity: snap(frame, zeroAt, 5), transform: `scale(${1.25 - 0.25 * snap(frame, zeroAt, 7)})`}}>0</div>
      {/* Counts under the Sun and the Prophet ﷺ. */}
      <div style={{position: "absolute", left: cols.sun - 100, width: 200, top: 880, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 90, color: ACCENT, opacity: arrive(frame, sortAt + 16, 10)}}>3</div>
      <div style={{position: "absolute", left: cols.prophet - 100, width: 200, top: 880, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 90, color: ACCENT, opacity: arrive(frame, prophetAt + 12, 10)}}>1</div>
      <Credit text="Numerical observation · Quranic Arabic Corpus, root s-r-j" at={6} />
    </AbsoluteFill>
  );
};

// Line 12: three real pictures, hard cuts: a lamp burns its own oil, the Sun its own fuel,
// the Moon burns nothing.
export const Burns = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const lampAt = cues.word(12, 6);
  const sunAt = cues.word(12, 11);
  const moonAt = cues.word(12, 14);
  const shot = frame >= moonAt ? "moon" : frame >= sunAt ? "sun" : "lamp";
  const since = shot === "moon" ? frame - moonAt : shot === "sun" ? frame - sunAt : frame;
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      {shot === "lamp" ? (
        <Photo src="cn-lamp.jpg" fileAspect={4 / 3} focus={[0.66, 0.56]} from={frame >= lampAt ? 1.35 : 1.12} to={frame >= lampAt ? 1.42 : 1.2} frames={60} filter={`brightness(${0.55 + 0.5 * arrive(frame, 0, 40)})`} />
      ) : shot === "sun" ? (
        <AbsoluteFill style={{transform: `scale(${1.05 + since * 0.002})`}}>
          <Photo src="cn-sun-close.jpg" fileAspect={1300 / 2310} focus={[0.5, 0.45]} from={1.14} to={1.14} />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{transform: `scale(${1.08 + since * 0.0015})`}}>
          <Photo src="cn-moon-close.jpg" fileAspect={1300 / 2310} focus={[0.5, 0.5]} from={1.0} to={1.0} filter="saturate(0) brightness(0.8) contrast(1.05)" />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(14,18,27,0.75) 0%, rgba(14,18,27,0) 34%, rgba(14,18,27,0) 62%, rgba(14,18,27,0.7) 100%)`}} />
      {shot === "lamp" && frame >= lampAt ? <Line key="l" at={lampAt} y={TEXT_TOP + 170} size={92}>A lamp burns its own oil.</Line> : null}
      {shot === "sun" ? <Line key="s" at={sunAt} y={TEXT_TOP + 170} size={92}>The Sun, its own fuel.</Line> : null}
      {shot === "moon" ? <Line key="m" at={moonAt} y={TEXT_TOP + 170} size={92}>The Moon burns nothing.</Line> : null}
      <Credit
        key={shot}
        text={shot === "lamp" ? "Photo: Saral Shots, CC0" : shot === "sun" ? "Established science · nuclear fusion · NASA/SDO" : "Established science · NASA/GSFC/Arizona State Univ."}
        at={shot === "lamp" ? 6 : (shot === "sun" ? sunAt : moonAt) + 4}
      />
    </AbsoluteFill>
  );
};

// Line 13: the honest half. Parmenides, the line he wrote, then the gap to the Quran.
export const Greek = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const quoteAt = cues.word(13, 4); // "udhaar"
  const gapAt = cues.word(13, 10); // "hazaar saal"
  const nameAt = cues.word(13, 14); // "Greek"
  const line = draw(frame, gapAt + 2, 18);
  const quoteUp = interpolate(frame, [gapAt, gapAt + 12], [0, 1], {...CLAMP, easing: easeOut});
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <div style={{position: "absolute", left: 440, top: 150, width: 640, height: 860, overflow: "hidden", opacity: arrive(frame, 0, 12)}}>
        <Photo src="cn-parmenides.jpg" fileAspect={1410 / 1712} focus={[0.45, 0.35]} from={1.0} to={1.05} frames={160} filter="saturate(0.5) brightness(0.75)" />
        <AbsoluteFill style={{background: `linear-gradient(90deg, ${GROUND} 0%, rgba(21,26,38,0.4) 30%, rgba(21,26,38,0) 55%), linear-gradient(0deg, ${GROUND} 0%, rgba(21,26,38,0) 30%), linear-gradient(180deg, ${GROUND} 0%, rgba(21,26,38,0) 20%)`}} />
      </div>
      <Label at={nameAt} x={SIDE} y={TEXT_TOP} color={MUTED} size={34} weight={600}>Parmenides, Greek poet, c. 475 BCE</Label>
      <div style={{position: "absolute", left: SIDE, top: 400 - 20 * quoteUp, width: 560, opacity: arrive(frame, quoteAt, 16), transform: `translateY(${(1 - arrive(frame, quoteAt, 16)) * 20}px)`}}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 78, lineHeight: 1.08, color: INK, textShadow: "0 2px 14px rgba(14,18,27,0.9)"}}>
          <span style={{marginLeft: -32}}>“</span>Shining by night with borrowed light”
        </div>
      </div>
      {/* The gap: Parmenides to the first revelation (610 CE). */}
      <div style={{position: "absolute", left: SIDE, top: 820, width: 1080 - 2 * SIDE - 40, opacity: arrive(frame, gapAt, 10)}}>
        <div style={{position: "relative", height: 120}}>
          <div style={{position: "absolute", left: 0, top: 56, height: 6, width: `${line * 100}%`, background: INK, borderRadius: 3}} />
          <div style={{position: "absolute", left: 0, top: 44, width: 30, height: 30, borderRadius: "50%", background: INK}} />
          <div style={{position: "absolute", right: 0, top: 44, width: 30, height: 30, borderRadius: "50%", background: INK, opacity: line > 0.98 ? 1 : 0}} />
          <div style={{position: "absolute", left: 0, right: 0, top: -14, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 60, color: INK, opacity: arrive(frame, gapAt + 14, 10)}}>about 1,100 years</div>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 600, fontSize: 32, color: MUTED}}>
          <span>c. 475 BCE</span>
          <span style={{opacity: line > 0.98 ? 1 : 0}}>610 CE, the Quran</span>
        </div>
      </div>
      <Credit text="Historical record · Parmenides, fr. 14, tr. Burnet · Photo: S. Spolti, CC BY-SA 4.0" at={quoteAt + 6} />
    </AbsoluteFill>
  );
};

// Line 14: the verdict, set as an editor would: "Half true." and its two halves; on
// "galti" the easy mistake appears and is crossed out on "aasaan".
export const Verdict = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const halvesAt = cues.word(14, 5); // "khoj"
  const mistakeAt = cues.word(14, 10); // "galti"
  const crossAt = cues.word(14, 15); // "aasaan"
  const back = arrive(frame, mistakeAt, 10);
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Stars count={24} seed="verdict" opacity={0.35} />
      <div style={{position: "absolute", left: SIDE, top: TEXT_TOP, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 170, lineHeight: 1, color: INK, opacity: snap(frame, 1, 6), transform: `scale(${1.08 - 0.08 * snap(frame, 1, 10)})`, transformOrigin: "left top"}}>Half true.</div>
      <div style={{position: "absolute", left: SIDE, right: SIDE, top: 470, fontFamily: SANS, fontWeight: 600, fontSize: 44, lineHeight: 1.3, color: INK, opacity: 1 - 0.55 * back}}>
        <div style={{opacity: arrive(frame, halvesAt, 12)}}>“Reflected” is the translator’s word, not the Quran’s.</div>
        <div style={{marginTop: 28, opacity: arrive(frame, halvesAt + 10, 12)}}>
          The Sun is called a <span style={{color: ACCENT}}>lamp</span>. The Moon, never.
        </div>
      </div>
      <div style={{position: "absolute", left: SIDE, top: 790, opacity: back, transform: `translateY(${(1 - back) * 20}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 32, color: MUTED, marginBottom: 8}}>the easy mistake</div>
        <span style={{position: "relative", display: "inline-block", fontFamily: SERIF, fontStyle: "italic", fontSize: 96, color: INK}}>
          “The Moon is a lamp”
          <Strike progress={draw(frame, crossAt, 10)} width={7} />
        </span>
      </div>
      <Credit text="Interpretation · our verdict" at={6} />
    </AbsoluteFill>
  );
};

// Line 15: the payoff. One lamp in the sky; on "usi" siraj rises over the Sun.
export const Payoff = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const lineAt = cues.word(15, 2); // "chiragh"
  const usiAt = cues.word(15, 10);
  const z = 1 + frame * 0.0006;
  return (
    <AbsoluteFill style={{backgroundColor: GROUND_TINT}}>
      <Stars count={90} seed="payoff" />
      <div style={{position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "40% 55%"}}>
        <Sun x={330} y={770} d={460} light={1} />
        <Moon x={810} y={990} d={200} light={1} side={0.9} />
      </div>
      <Line at={lineAt} y={TEXT_TOP} size={104}>One lamp in the sky.</Line>
      <div style={{position: "absolute", left: 330 - 200, width: 400, top: 365, textAlign: "center", fontFamily: ARABIC, fontSize: 110, lineHeight: 1.5, color: ACCENT, opacity: arrive(frame, usiAt, 14), transform: `translateY(${(1 - arrive(frame, usiAt, 14)) * 30}px)`}}>
        {ayahWords("71:16", 7)}
      </div>
    </AbsoluteFill>
  );
};
const GROUND_TINT = GROUND;

// Line 16: the real Moon rises; the comment ask, then Follow (src/overlays/Cta.tsx).
export const End = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, 90], [180, 0], {...CLAMP, easing: easeOut});
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Stars count={70} seed="end" />
      <Moon x={540} y={840 + rise} d={520} light={1} />
      <Credit text="Image: NASA/GSFC/Arizona State Univ." at={cues.line(16) + 6} />
    </AbsoluteFill>
  );
};
