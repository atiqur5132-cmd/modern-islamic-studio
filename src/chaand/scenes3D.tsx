import {CSSProperties, ReactNode, useMemo} from "react";
import {AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame} from "remotion";
import {Cues} from "../long/scroll/types";
import {ACCENT, ARABIC, arrive, ayahTokens, ayahWords, draw, INK, leave, MUTED, PAPER_INK, PAPER_MUTED, SANS, SERIF, SIDE, snap, TEXT_TOP} from "./look";
import {Credit, Photo} from "./parts";
import {lerp3, Space3D, SpaceState, V3} from "./Space3D";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const t01 = (frame: number, a: number, b: number, e: (t: number) => number = Easing.inOut(Easing.cubic)) => interpolate(frame, [a, b], [0, 1], {...CLAMP, easing: e});
const SHADE = "0 2px 18px rgba(8,10,16,0.9)";

// ---------- Shared parts ----------

// The sky the reel lives in: the Moon lit from the left, the camera drifting round it.
// `frame` drives the drift; `look` picks where the Moon sits in the frame.
const sky = (frame: number, look: "high" | "low" | "right" | "close" = "high", light = 1, front = false): SpaceState => {
  const a = 0.35 + frame * 0.0016;
  const d = look === "close" ? 7.6 : 15;
  const targets: Record<string, V3> = {high: [0, -3.4, 0], low: [0, 3.6, 0], right: [-2.6, 1.2, 0], close: [0.4, 0.3, 0]};
  return {
    cam: [Math.sin(a) * d, 0.8, Math.cos(a) * d],
    target: targets[look],
    moon: {pos: [0, 0, 0], r: 3, light, spin: 0.3},
    sun: {pos: [-60, 12, -40], r: 4, power: 0},
    lightFrom: front ? [Math.sin(a - 0.5) * 60, 18, Math.cos(a - 0.5) * 60] : [-50, 14, 22],
  };
};

export const Sky = ({look = "high", light = 1, dim = 0, offset = 0, blur = 0, front = false}: {look?: "high" | "low" | "right" | "close"; light?: number; dim?: number; offset?: number; blur?: number; front?: boolean}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{filter: blur ? `blur(${blur}px)` : undefined}}>
      <Space3D s={sky(frame + offset, look, light, front)} time={(frame + offset) / 30} />
      {dim > 0 ? <AbsoluteFill style={{background: `rgba(8,10,16,${dim})`}} /> : null}
    </AbsoluteFill>
  );
};

// A deckled paper edge: a polygon with small random steps, fixed per seed.
const deckle = (seed: string, n = 26, amp = 1.1) => {
  const pts: string[] = [];
  const side = (from: [number, number], to: [number, number], key: string, normal: [number, number]) => {
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const j = (random(`${seed}${key}${i}`) - 0.5) * 2 * amp;
      pts.push(`${from[0] + (to[0] - from[0]) * t + normal[0] * j}% ${from[1] + (to[1] - from[1]) * t + normal[1] * j}%`);
    }
  };
  side([1, 1], [99, 1], "t", [0, 1]);
  side([99, 1], [99, 99], "r", [1, 0]);
  side([99, 99], [1, 99], "b", [0, 1]);
  side([1, 99], [1, 1], "l", [1, 0]);
  return `polygon(${pts.join(",")})`;
};

// A real-feel paper card floating in the sky: warm paper, fibre grain, torn edges, a soft
// shadow, a slight 3D tilt that drifts.
export const PaperCard = ({x, y, w, h, seed, enter = 1, tilt = [6, -8], children, style}: {x: number; y: number; w: number; h: number; seed: string; enter?: number; tilt?: [number, number]; children: ReactNode; style?: CSSProperties}) => {
  const frame = useCurrentFrame();
  const clip = useMemo(() => deckle(seed), [seed]);
  const rx = tilt[0] * (1 - 0.4 * Math.sin(frame / 60)) + (1 - enter) * 30;
  const ry = tilt[1] + 2 * Math.sin(frame / 75);
  return (
    <div style={{position: "absolute", left: x, top: y, width: w, height: h, perspective: 1800, opacity: Math.min(1, enter * 1.6), ...style}}>
      <div style={{position: "absolute", inset: 0, transform: `translateY(${(1 - enter) * 260}px) rotateX(${rx}deg) rotateY(${ry}deg)`, transformStyle: "preserve-3d", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))"}}>
        <div style={{position: "absolute", inset: 0, clipPath: clip, background: "linear-gradient(160deg, #F1EADB 0%, #E8DFCB 55%, #DDD2BA 100%)"}}>
          <svg width="100%" height="100%" style={{position: "absolute", inset: 0, opacity: 0.35, mixBlendMode: "multiply"}}>
            <filter id={`fibre-${seed}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={3} seed={7} />
              <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.55 0" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#fibre-${seed})`} />
          </svg>
          <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.35), rgba(0,0,0,0) 60%)"}} />
          {children}
        </div>
      </div>
    </div>
  );
};

// A ring drawn by hand round a word: an uneven loop that overshoots its start.
export const HandRing = ({progress, color = PAPER_INK, width = 6, pad = [26, 14], aspect = 2.4, box}: {progress: number; color?: string; width?: number; pad?: [number, number]; aspect?: number; box?: number}) => {
  const W = 100 * aspect;
  const x = (v: number) => (v * W) / 100;
  // Stroke in viewBox units for a ring about `box` px tall (its height in px / 100).
  const sw = (width * 100) / (box ?? 110);
  const d = `M ${x(62)} 6 C ${x(88)} 6 ${x(99)} 26 ${x(98)} 50 C ${x(97)} 78 ${x(78)} 95 ${x(50)} 95 C ${x(20)} 95 ${x(2)} 78 ${x(2)} 50 C ${x(2)} 22 ${x(22)} 4 ${x(56)} 5 C ${x(70)} 5 ${x(80)} 9 ${x(86)} 14`;
  return (
    <svg viewBox={`0 0 ${W} 100`} preserveAspectRatio="none" style={{position: "absolute", left: -pad[0], top: -pad[1], width: `calc(100% + ${2 * pad[0]}px)`, height: `calc(100% + ${2 * pad[1]}px)`, overflow: "visible", pointerEvents: "none"}}>
      <path d={d} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - progress} opacity={progress > 0 ? 1 : 0} />
    </svg>
  );
};

// A phone held in the sky, tilted in 3D, with the forward on its screen (no app, no
// account: a generic message).
export const Phone = ({enter, tilt = 0, fall = 0, mark = 0}: {enter: number; tilt?: number; fall?: number; mark?: number}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: 250, top: 470, width: 580, height: 1060, perspective: 1600}}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 74,
          background: "#0E1119",
          boxShadow: "0 0 0 3px #2A303D, 0 40px 80px rgba(0,0,0,0.6)",
          transform: `translateY(${(1 - enter) * 900 + fall * 1400}px) rotateY(${-16 + 3 * Math.sin(frame / 50)}deg) rotateX(${8 + tilt}deg) rotateZ(${tilt * 1.4 + fall * 25}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        <div style={{position: "absolute", inset: 18, borderRadius: 58, background: "linear-gradient(180deg, #1A1F2B, #141822)", overflow: "hidden"}}>
          <div style={{position: "absolute", left: "50%", top: 18, width: 130, height: 34, marginLeft: -65, borderRadius: 20, background: "#07090E"}} />
          <div style={{position: "absolute", left: 30, right: 40, top: 150, padding: "26px 30px 30px", borderRadius: "10px 30px 30px 30px", background: "#2A3142", opacity: arrive(frame, 8, 10)}}>
            <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 28, color: MUTED, marginBottom: 10}}>↪ Forwarded many times</div>
            <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 40, lineHeight: 1.25, color: INK}}>
              The Quran said it{" "}
              <span style={{position: "relative", display: "inline-block"}}>
                1400 years ago
                <span style={{position: "absolute", left: 0, bottom: -4, height: 5, width: `${mark * 100}%`, background: INK, borderRadius: 3}} />
              </span>
              : the Moon’s light is reflected.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// One big phrase over the sky.
const Big = ({children, at, y, size = 110, color = INK, align = "left", italic = true, style}: {children: ReactNode; at: number; y: number; size?: number; color?: string; align?: "left" | "center"; italic?: boolean; style?: CSSProperties}) => {
  const frame = useCurrentFrame();
  const t = arrive(frame, at, 16);
  return (
    <div style={{position: "absolute", left: SIDE, right: SIDE, top: y, textAlign: align, fontFamily: SERIF, fontStyle: italic ? "italic" : "normal", fontWeight: 500, fontSize: size, lineHeight: 1.04, letterSpacing: -0.5, color, textWrap: "balance", textShadow: SHADE, opacity: t, transform: `translateY(${(1 - t) * 26}px)`, ...style}}>
      {children}
    </div>
  );
};

// ---------- Scenes ----------

// Line 3: the forward arrives on a phone in the sky; "1400 years ago" bursts out of it.
export const Claim3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const numAt = cues.word(3, 9);
  const burst = snap(frame, numAt, 8);
  return (
    <AbsoluteFill>
      <Sky look="high" dim={0.25} offset={200} />
      <div style={{position: "absolute", inset: 0, opacity: 1 - 0.55 * burst, transform: `scale(${1 - 0.06 * burst})`}}>
        <Phone enter={t01(frame, 0, 16, easeOut)} mark={draw(frame, numAt, 10)} />
      </div>
      {frame >= numAt ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", opacity: burst, transform: `scale(${0.6 + 0.4 * burst})`, textShadow: SHADE}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 260, lineHeight: 1, color: INK, letterSpacing: -4}}>1400</div>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 76, color: INK}}>years ago?</div>
        </div>
      ) : null}
      <Credit text="Viral claim · a forward shared widely" at={10} />
    </AbsoluteFill>
  );
};

// Line 4: 71:16 on a paper card in the sky; each half darkens as recited, nur ringed in
// ink, siraj ringed in amber.
export const Ayah3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const tokens = ayahTokens("71:16").filter((t) => t.word !== null);
  const moonAt = cues.word(4, 6);
  const sunAt = cues.word(4, 11);
  const nurAt = cues.word(4, 10);
  const sirajAt = cues.word(4, 14);
  const push = t01(frame, sunAt - 4, sunAt + 20);
  const row = (from: number, to: number, at: number, ringWord: number, ringAt: number, ringColor: string) => (
    <div style={{direction: "rtl", textAlign: "center", fontFamily: ARABIC, fontSize: 92, lineHeight: 2.0, color: PAPER_INK, opacity: 0.32 + 0.68 * arrive(frame, at, 10)}}>
      {tokens
        .filter((t) => t.word! >= from && t.word! <= to)
        .map((t) => (
          <span key={t.word} style={{position: "relative", display: "inline-block", margin: "0 10px"}}>
            {t.text}
            {t.word === ringWord ? <HandRing progress={draw(frame, ringAt, 12)} color={ringColor} width={7} pad={[22, -10]} aspect={1.9} box={150} /> : null}
          </span>
        ))}
    </div>
  );
  return (
    <AbsoluteFill>
      <Sky look="low" dim={0.35} offset={340} blur={2} />
      <div style={{position: "absolute", inset: 0, transform: `scale(${1 + 0.1 * push}) translateY(${-60 * push}px)`, transformOrigin: "50% 60%"}}>
        <PaperCard x={70} y={360} w={940} h={620} seed="ayah7116" enter={t01(frame, 0, 18, easeOut)}>
          <div style={{position: "absolute", left: 50, top: 40, fontFamily: SANS, fontWeight: 700, fontSize: 32, color: "#A4572A"}}>Surah Nuh · 71:16</div>
          <div style={{position: "absolute", left: 30, right: 30, top: 120}}>
            {row(1, 4, moonAt, 4, nurAt, PAPER_INK)}
            {row(5, 7, sunAt, 7, sirajAt, ACCENT)}
          </div>
        </PaperCard>
      </div>
      <Credit text="Quranic text · Nuh 71:16" at={6} />
    </AbsoluteFill>
  );
};

// Line 5: the 3D Moon above, nur beside it; the frame splits and the real lamp rises
// below, siraj in amber: a burning lamp.
export const NurSiraj3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const nurAt = cues.word(5, 3);
  const splitAt = cues.word(5, 4);
  const sirajAt = cues.word(5, 7);
  const lampAt = cues.word(5, 9);
  const split = snap(frame, splitAt, 8);
  const top = 1920 - 1100 * split;
  return (
    <AbsoluteFill>
      <Space3D
        time={frame / 30}
        s={{cam: [-1.58, -5.25, 26 - frame * 0.01], target: [-1.58, -5.25, 0], fov: 40, moon: {pos: [0, 0, 0], r: 3, light: 1, spin: 0.9 + frame * 0.001}, sun: {pos: [-60, 12, -40], r: 4, power: 0}, lightFrom: [-8, 5, 60]}}
      />
      <div style={{position: "absolute", left: SIDE, top: 300, width: 400, opacity: arrive(frame, nurAt, 12), textShadow: SHADE, lineHeight: 1.1}}>
        <div style={{fontFamily: ARABIC, fontSize: 140, color: INK, lineHeight: 1.6}}>{ayahWords("71:16", 4)}</div>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 66, color: INK}}>nur, light</div>
      </div>
      <div style={{position: "absolute", left: 0, top, width: 1080, height: 1100, overflow: "hidden", boxShadow: "0 -20px 40px rgba(0,0,0,0.5)"}}>
        <div style={{position: "absolute", left: 0, top: -410, width: 1080, height: 1920}}>
          <Photo src="cn-lamp.jpg" fileAspect={4 / 3} focus={[0.66, 0.6]} from={1.0} to={1.1} frames={120} filter={`brightness(${0.8 + 0.25 * arrive(frame, lampAt, 10)})`} />
        </div>
        <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 300, background: "linear-gradient(180deg, rgba(8,10,16,0.9) 0%, rgba(8,10,16,0) 100%)"}} />
        <div style={{position: "absolute", left: SIDE, top: 24, lineHeight: 1.25, whiteSpace: "nowrap", opacity: arrive(frame, sirajAt, 12), textShadow: SHADE}}>
          <span style={{fontFamily: ARABIC, fontSize: 120, color: ACCENT}}>{ayahWords("71:16", 7)}</span>
          <span style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 60, color: INK, marginLeft: 26}}>siraj,</span>
          <span style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 60, color: INK, marginLeft: 14, opacity: arrive(frame, lampAt, 12)}}>a burning lamp</span>
        </div>
      </div>
      <Credit text="Quranic context · Nuh 71:16 · Photo: Saral Shots, CC0" at={splitAt + 8} />
    </AbsoluteFill>
  );
};

// Line 6: the translation on a paper card; "[reflected]" marked, the camera pushes into
// it, a hand ring closes round it on "bracket".
export const Bracket3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const markAt = cues.word(6, 6);
  const pushAt = cues.word(6, 10);
  const ringAt = cues.word(6, 11);
  const push = t01(frame, pushAt, pushAt + 16, easeOut);
  return (
    <AbsoluteFill>
      <Sky look="low" dim={0.4} offset={640} blur={3} />
      <div style={{position: "absolute", inset: 0, transform: `scale(${1 + 0.32 * push})`, transformOrigin: "40% 40%"}}>
        <PaperCard x={60} y={380} w={960} h={600} seed="saheeh" enter={t01(frame, 0, 16, easeOut)} tilt={[4, 6]}>
          <div style={{position: "absolute", left: 60, top: 44, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#A4572A"}}>English translation · 71:16</div>
          <div style={{position: "absolute", left: 60, right: 50, top: 130, fontFamily: SERIF, fontWeight: 500, fontSize: 82, lineHeight: 1.18, color: PAPER_INK, textWrap: "balance"}}>
            <span style={{marginLeft: -32}}>“</span>And made the moon therein a{" "}
            <span style={{position: "relative", display: "inline-block", whiteSpace: "nowrap"}}>
              <span style={{position: "absolute", left: -6, right: -6, top: "20%", height: "66%", background: "rgba(225,162,74,0.0)", boxShadow: "inset 0 -40px 0 rgba(164,87,42,0.18)", transform: `scaleX(${draw(frame, markAt, 12)})`, transformOrigin: "left center"}} />
              [reflected]
              <HandRing progress={draw(frame, ringAt, 14)} color="#A4572A" width={7} pad={[30, 14]} aspect={3.4} box={125} />
            </span>{" "}
            light”
          </div>
        </PaperCard>
      </div>
      <Credit text="Translation · Saheeh International, 71:16 (quran.com)" at={8} />
    </AbsoluteFill>
  );
};

// Line 7: the Arabic words on the card; "[reflected]" has no word above it and falls off
// the card into the dark.
export const NoWord3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const tokens = ayahTokens("71:16").filter((t) => t.word !== null && t.word <= 4);
  const glosses = ["and made", "the moon", "therein", "a light"];
  const inAt = cues.word(7, 3);
  const fallAt = cues.word(7, 5);
  const fall = interpolate(frame, [fallAt, fallAt + 18], [0, 1], {...CLAMP, easing: (t) => t * t});
  const xs = [790, 600, 410, 70];
  return (
    <AbsoluteFill>
      <Sky look="low" dim={0.4} offset={790} blur={3} />
      <PaperCard x={60} y={420} w={960} h={460} seed="words" tilt={[3, -4]}>
        {tokens.map((t, i) => (
          <div key={t.word} style={{position: "absolute", left: xs[i], top: 70, width: 170, textAlign: "center", opacity: arrive(frame, i * 2, 10)}}>
            <div style={{fontFamily: ARABIC, fontSize: 80, lineHeight: 1.8, color: PAPER_INK}}>{t.text}</div>
            <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 38, color: PAPER_INK}}>{glosses[i]}</div>
          </div>
        ))}
        <div style={{position: "absolute", left: 260, top: 100, width: 110, height: 110, borderRadius: 14, border: `4px dashed ${PAPER_MUTED}`, opacity: arrive(frame, inAt, 8) * (1 - fall)}} />
      </PaperCard>
      <div style={{position: "absolute", left: 160, width: 320, top: 700, textAlign: "center", fontFamily: SERIF, fontSize: 58, color: INK, textShadow: SHADE, opacity: arrive(frame, inAt, 8) * (1 - 0.7 * fall), transform: `translateY(${fall * 900}px) rotate(${fall * 38}deg) scale(${1 - 0.4 * fall})`}}>[reflected]</div>
      <Credit text="Linguistic observation · the Arabic of 71:16, word by word" at={4} />
    </AbsoluteFill>
  );
};

// Line 8: "nur" is not borrowed light (struck on "udhaar"); then 24:35 on a card: Allah is
// nur, the word ringed.
export const NurAllah3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const strikeAt = cues.word(8, 4);
  const ayahAt = cues.word(8, 11);
  const nurAt = cues.word(8, 16);
  const onAyah = frame >= ayahAt;
  const tokens = ayahTokens("24:35").filter((t) => t.word !== null && t.word <= 4);
  return (
    <AbsoluteFill>
      <Sky look={onAyah ? "low" : "close"} dim={onAyah ? 0.4 : 0.35} offset={900} blur={onAyah ? 3 : 0} front={!onAyah} />
      {!onAyah ? (
        <>
          <Big at={0} y={330} size={200} align="center">nur</Big>
          <div style={{position: "absolute", left: 0, right: 0, top: 600, textAlign: "center", opacity: arrive(frame, 6, 14)}}>
            <span style={{position: "relative", display: "inline-block", fontFamily: SERIF, fontStyle: "italic", fontSize: 80, color: INK, textShadow: SHADE}}>
              borrowed light?
              <span style={{position: "absolute", left: -10, top: "52%", height: 7, width: `calc(${draw(frame, strikeAt, 10) * 100}% + 20px)`, background: INK, borderRadius: 4, transform: "rotate(-3deg)", transformOrigin: "left center"}} />
            </span>
          </div>
        </>
      ) : (
        <PaperCard x={70} y={400} w={940} h={520} seed="nur2435" enter={t01(frame, ayahAt, ayahAt + 16, easeOut)} tilt={[5, 5]}>
          <div style={{position: "absolute", left: 50, top: 38, fontFamily: SANS, fontWeight: 700, fontSize: 30, color: "#A4572A"}}>Surah An-Nur · 24:35</div>
          <div style={{position: "absolute", left: 20, right: 20, top: 100, direction: "rtl", textAlign: "center", fontFamily: ARABIC, fontSize: 88, lineHeight: 2, color: PAPER_INK, whiteSpace: "nowrap"}}>
            {tokens.map((t) => (
              <span key={t.word} style={{position: "relative", display: "inline-block", margin: "0 8px"}}>
                {t.text}
                {t.word === 2 ? <HandRing progress={draw(frame, nurAt, 12)} color="#A4572A" width={7} pad={[20, -12]} aspect={1.6} box={150} /> : null}
              </span>
            ))}
          </div>
          <div style={{position: "absolute", left: 50, right: 50, top: 340, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 50, lineHeight: 1.15, color: PAPER_INK, opacity: arrive(frame, ayahAt + 10, 12)}}>
            Allah is the Light of the heavens and the earth.
          </div>
        </PaperCard>
      )}
      <Credit text={onAyah ? "Quranic text · An-Nur 24:35 · Saheeh International" : "Linguistic observation"} at={onAyah ? ayahAt + 8 : 8} />
    </AbsoluteFill>
  );
};

// Line 9: the phone returns, tilts on "galat", falls on "poora nahi" ("Not entirely."),
// and siraj lands huge in amber over the lamp's flame.
export const Turn3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const galat = cues.word(9, 2);
  const poora = cues.word(9, 4);
  const sirajAt = cues.word(9, 11);
  const siraj = frame >= sirajAt;
  return (
    <AbsoluteFill>
      {!siraj ? (
        <>
          <Sky look="high" dim={0.3} offset={1060} />
          <Phone enter={t01(frame, 0, 12, easeOut)} mark={1} tilt={6 * t01(frame, galat, galat + 10, easeOut)} fall={t01(frame, poora + 2, poora + 20, (t) => t * t)} />
          <Big at={poora} y={TEXT_TOP + 60} size={120}>Not entirely.</Big>
        </>
      ) : (
        <>
          <Photo src="cn-lamp.jpg" fileAspect={4 / 3} focus={[0.71, 0.52]} from={1.5} to={1.6} frames={40} filter="brightness(0.7)" />
          <AbsoluteFill style={{background: "radial-gradient(circle at 50% 45%, rgba(8,10,16,0.1), rgba(8,10,16,0.75) 70%)"}} />
          <div style={{position: "absolute", left: 0, right: 0, top: 360, textAlign: "center", opacity: snap(frame, sirajAt, 5), transform: `scale(${1.15 - 0.15 * snap(frame, sirajAt, 8)})`, textShadow: SHADE}}>
            <div style={{fontFamily: ARABIC, fontSize: 280, lineHeight: 1.5, color: ACCENT}}>{ayahWords("71:16", 7)}</div>
            <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 80, color: INK}}>siraj</div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

const PLACES = [
  {key: "25:61", word: 9, to: "sun"},
  {key: "33:46", word: 5, to: "prophet"},
  {key: "71:16", word: 7, to: "sun"},
  {key: "78:13", word: 2, to: "sun"},
] as const;

// Lines 10-11, in the sky: four siraj words light in a row and "4" lands; then three fly
// into the burning Sun, one to the Prophet ﷺ, and the Moon gets none: 0.
export const Count3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const fourAt = cues.word(10, 6);
  const sortAt = cues.word(11, 2);
  const prophetAt = cues.word(11, 7);
  const moonAt = cues.word(11, 14); // "chaand"
  const zeroAt = cues.word(11, 17); // "Ek baar bhi nahi"
  const sorting = frame >= cues.word(11, 0);
  const sunGrow = t01(frame, cues.word(11, 0), cues.word(11, 0) + 14, easeOut);
  const s: SpaceState = {
    cam: [0, 0, 30],
    target: [0, 0, 0],
    fov: 40,
    moon: {pos: [2.75, 0, 0], r: 1.6, light: 1, spin: 0.3},
    sun: {pos: [-2.4, 5, 0], r: 2.3 * (0.3 + 0.7 * sunGrow), power: sunGrow},
    lightFrom: [-2.4, 5, 0],
  };
  // Screen positions of the Sun, the Prophet's place and the Moon (measured on stills).
  const SUN_XY = [330, 520];
  const PROPHET_XY = [790, 470];
  const MOON_XY = [782, 960];
  let sunSlot = 0;
  return (
    <AbsoluteFill>
      <Space3D s={s} time={frame / 30} />
      <div style={{position: "absolute", left: 0, right: 0, top: TEXT_TOP - 30, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 240, lineHeight: 1, color: INK, textShadow: SHADE, opacity: snap(frame, fourAt, 6) * leave(frame, cues.word(11, 0), 8), transform: `scale(${1.2 - 0.2 * snap(frame, fourAt, 6)})`}}>4</div>
      {PLACES.map((p, i) => {
        const lightAt = cues.word(10, 2) + i * 5;
        const lit = arrive(frame, lightAt, 8);
        const goAt = p.to === "sun" ? sortAt + sunSlot * 4 : prophetAt;
        if (p.to === "sun") sunSlot++;
        const go = t01(frame, goAt, goAt + 12, (t) => t * t);
        const start = [165 + i * 250, 700];
        const end = p.to === "sun" ? SUN_XY : PROPHET_XY;
        const x = start[0] + (end[0] - start[0]) * go;
        const y = start[1] + (end[1] - start[1]) * go;
        const into = p.to === "sun" ? 1 - go : 1 - 0.35 * go;
        return (
          <div key={p.key} style={{position: "absolute", left: x - 120, top: y - 80, width: 240, textAlign: "center", opacity: (0.3 + 0.7 * lit) * (p.to === "sun" ? Math.min(1, into * 3) : 1), transform: `scale(${p.to === "sun" ? 0.4 + 0.6 * into : 1 - 0.2 * go})`, textShadow: SHADE}}>
            <div style={{fontFamily: ARABIC, fontSize: 84, lineHeight: 1.5, color: lit > 0.5 ? ACCENT : INK}}>{ayahWords(p.key, p.word)}</div>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: INK, opacity: 0.85}}>{p.key}</div>
          </div>
        );
      })}
      {sorting ? (
        <>
          <div style={{position: "absolute", left: SUN_XY[0] - 150, width: 300, top: SUN_XY[1] + 190, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 100, color: ACCENT, textShadow: SHADE, opacity: arrive(frame, sortAt + 18, 8)}}>3</div>
          <div style={{position: "absolute", left: PROPHET_XY[0] - 170, width: 340, top: PROPHET_XY[1] - 170, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 50, color: INK, textShadow: SHADE, opacity: arrive(frame, prophetAt - 4, 10)}}>
            the Prophet <span style={{fontFamily: ARABIC, fontStyle: "normal"}}>ﷺ</span>
          </div>
          <div style={{position: "absolute", left: PROPHET_XY[0] - 150, width: 300, top: PROPHET_XY[1] + 110, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 100, color: ACCENT, textShadow: SHADE, opacity: arrive(frame, prophetAt + 12, 8)}}>1</div>
          <div style={{position: "absolute", left: MOON_XY[0] - 420, width: 200, top: MOON_XY[1] - 120, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 190, color: INK, textShadow: SHADE, opacity: snap(frame, zeroAt, 5), transform: `scale(${1.3 - 0.3 * snap(frame, zeroAt, 7)})`}}>0</div>
          <div style={{position: "absolute", left: MOON_XY[0] - 300, width: 600, top: MOON_XY[1] - 300, height: 600, borderRadius: "50%", border: `4px dashed rgba(236,229,213,0.55)`, opacity: arrive(frame, moonAt, 10) * 0}} />
        </>
      ) : null}
      <Credit text="Numerical observation · Quranic Arabic Corpus, root s-r-j" at={6} />
    </AbsoluteFill>
  );
};

// Line 12: a lamp burns its own oil (real photo), the Sun its own fuel (3D, close on its
// surface), the Moon burns nothing (3D, cold and grey).
export const Burns3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const lampAt = cues.word(12, 6);
  const sunAt = cues.word(12, 11);
  const moonAt = cues.word(12, 14);
  const shot = frame >= moonAt ? "moon" : frame >= sunAt ? "sun" : "lamp";
  const since = shot === "moon" ? frame - moonAt : shot === "sun" ? frame - sunAt : frame;
  return (
    <AbsoluteFill>
      {shot === "lamp" ? (
        <Photo src="cn-lamp.jpg" fileAspect={4 / 3} focus={[0.66, 0.56]} from={frame >= lampAt ? 1.38 : 1.12} to={frame >= lampAt ? 1.46 : 1.2} frames={60} filter={`brightness(${0.55 + 0.5 * arrive(frame, 0, 30)})`} />
      ) : shot === "sun" ? (
        <Space3D
          time={(frame + 400) / 30}
          s={{cam: lerp3([0, 0, 9.4], [0, 0, 8.6], since / 30), target: [0.6, 0.2, 0], fov: 40, moon: {pos: [0, 0, -400], r: 1, light: 0}, sun: {pos: [0, 0, 0], r: 6, power: 0.62}}}
        />
      ) : (
        <Space3D
          time={(frame + 400) / 30}
          s={{cam: lerp3([0, 0.6, 6.4], [0.2, 0.6, 5.9], since / 30), target: [0.6, 0.6, 0], fov: 40, moon: {pos: [0, 0, 0], r: 3, light: 0.55, spin: 0.8}, sun: {pos: [0, 0, 400], r: 1, power: 0}, lightFrom: [-40, 6, 10]}}
        />
      )}
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(8,10,16,0.7) 0%, rgba(8,10,16,0) 30%)"}} />
      {shot === "lamp" && frame >= lampAt ? <Big key="l" at={lampAt} y={TEXT_TOP + 170}>A lamp burns its own oil.</Big> : null}
      {shot === "sun" ? <Big key="s" at={sunAt} y={TEXT_TOP + 170}>The Sun, its own fuel.</Big> : null}
      {shot === "moon" ? <Big key="m" at={moonAt} y={TEXT_TOP + 170}>The Moon burns nothing.</Big> : null}
      <Credit key={shot} text={shot === "lamp" ? "Photo: Saral Shots, CC0" : shot === "sun" ? "Established science · nuclear fusion · NASA" : "Established science · NASA, “Moonlight”"} at={shot === "lamp" ? 6 : (shot === "sun" ? sunAt : moonAt) + 4} />
    </AbsoluteFill>
  );
};

// Line 13: the honest half. Parmenides on a paper card in the sky, his line, then the gap
// to the Quran drawn as a line of light.
export const Greek3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const quoteAt = cues.word(13, 4);
  const gapAt = cues.word(13, 10);
  const nameAt = cues.word(13, 14);
  const line = draw(frame, gapAt + 2, 18);
  return (
    <AbsoluteFill>
      <Sky look="right" dim={0.3} offset={1500} />
      <PaperCard x={580} y={240} w={420} h={480} seed="parmenides" enter={t01(frame, 0, 16, easeOut)} tilt={[3, -10]}>
        <div style={{position: "absolute", inset: 20, overflow: "hidden"}}>
          <Img src={staticFile("footage/cn-parmenides.jpg")} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%", filter: "sepia(0.35) saturate(0.6) contrast(1.05)", transform: `scale(${1 + frame * 0.0006})`}} />
        </div>
      </PaperCard>
      <div style={{position: "absolute", left: 590, top: 732, width: 420, fontFamily: SANS, fontWeight: 600, fontSize: 34, color: INK, opacity: 0.85 * arrive(frame, nameAt, 12), textShadow: SHADE}}>Parmenides, Greek poet</div>
      <div style={{position: "absolute", left: SIDE, top: 330, width: 450, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 76, lineHeight: 1.06, color: INK, textShadow: SHADE, opacity: arrive(frame, quoteAt, 16), transform: `translateY(${(1 - arrive(frame, quoteAt, 16)) * 22}px)`}}>
        <span style={{marginLeft: -34}}>“</span>Shining by night with borrowed light”
      </div>
      <div style={{position: "absolute", left: SIDE, right: SIDE, top: 820, opacity: arrive(frame, gapAt, 10), textShadow: SHADE}}>
        <div style={{position: "relative", height: 110}}>
          <div style={{position: "absolute", left: 0, top: 54, height: 6, width: `${line * 100}%`, background: `linear-gradient(90deg, ${INK}, ${ACCENT})`, borderRadius: 3}} />
          <div style={{position: "absolute", left: 0, right: 0, top: -6, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 62, color: INK, opacity: arrive(frame, gapAt + 12, 10)}}>about 1,100 years</div>
        </div>
        <div style={{display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 600, fontSize: 32, color: INK, opacity: 0.8}}>
          <span>c. 475 BCE</span>
          <span style={{opacity: line > 0.98 ? 1 : 0}}>610 CE, the Quran</span>
        </div>
      </div>
      <Credit text="Historical record · Parmenides fr. 14, tr. Burnet · Photo: S. Spolti, CC BY-SA" at={quoteAt + 6} />
    </AbsoluteFill>
  );
};

// Line 14: the verdict over the sky, the Sun burning and the Moon lit beside it.
export const Verdict3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const halvesAt = cues.word(14, 5);
  const mistakeAt = cues.word(14, 10);
  const crossAt = cues.word(14, 15);
  const back = arrive(frame, mistakeAt, 10);
  const s: SpaceState = {
    cam: [frame * 0.004, 0, 30],
    target: [frame * 0.004, 0, 0],
    fov: 40,
    moon: {pos: [2.95, -7.3, 0], r: 1.5, light: 1, spin: 0.3},
    sun: {pos: [-2.7, -6.9, 0], r: 2.1, power: 1},
    lightFrom: [-2.7, -6.9, 0],
  };
  return (
    <AbsoluteFill>
      <Space3D s={s} time={frame / 30} />
      <div style={{position: "absolute", left: SIDE, top: TEXT_TOP, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 190, lineHeight: 1, color: INK, textShadow: SHADE, opacity: snap(frame, 1, 6), transform: `scale(${1.08 - 0.08 * snap(frame, 1, 10)})`, transformOrigin: "left top"}}>Half true.</div>
      <div style={{position: "absolute", left: SIDE, right: SIDE, top: 500, fontFamily: SANS, fontWeight: 600, fontSize: 46, lineHeight: 1.28, color: INK, textShadow: SHADE, opacity: 1 - 0.6 * back}}>
        <div style={{opacity: arrive(frame, halvesAt, 12)}}>“Reflected” was added by the translator.</div>
        <div style={{marginTop: 24, opacity: arrive(frame, halvesAt + 10, 12)}}>
          The Sun is a <span style={{color: ACCENT}}>lamp</span>. The Moon, never.
        </div>
      </div>
      <div style={{position: "absolute", left: SIDE, top: 760, opacity: back, transform: `translateY(${(1 - back) * 20}px)`, textShadow: SHADE}}>
        <span style={{position: "relative", display: "inline-block", fontFamily: SERIF, fontStyle: "italic", fontSize: 92, color: INK}}>
          “The Moon is a lamp”
          <span style={{position: "absolute", left: -10, top: "54%", height: 8, width: `calc(${draw(frame, crossAt, 10) * 100}% + 20px)`, background: INK, borderRadius: 4, transform: "rotate(-3deg)", transformOrigin: "left center"}} />
        </span>
      </div>
      <Credit text="Interpretation · our verdict" at={6} />
    </AbsoluteFill>
  );
};

// Line 15: the payoff. A slow orbit: one lamp burning in the sky, the Moon lit by it; on
// "usi" siraj rises over the Sun.
export const Payoff3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const lineAt = cues.word(15, 2);
  const usiAt = cues.word(15, 10);
  const z = 31 - frame * 0.02;
  const s: SpaceState = {
    cam: [0.3 - frame * 0.003, 0, z],
    target: [0, 0, 0],
    fov: 40,
    moon: {pos: [2.95, -0.6, 0], r: 1.2, light: 1, spin: 0.3},
    sun: {pos: [-2.4, 1.6, 0], r: 2.0, power: 1},
    lightFrom: [-2.4, 1.6, 0],
  };
  return (
    <AbsoluteFill>
      <Space3D s={s} time={frame / 30} />
      <Big at={lineAt} y={TEXT_TOP} size={112}>One lamp in the sky.</Big>
      <div style={{position: "absolute", left: 120, width: 420, top: 470, textAlign: "center", fontFamily: ARABIC, fontSize: 104, lineHeight: 1.4, color: ACCENT, textShadow: SHADE, opacity: arrive(frame, usiAt, 14), transform: `translateY(${(1 - arrive(frame, usiAt, 14)) * 30}px)`}}>
        {ayahWords("71:16", 7)}
      </div>
    </AbsoluteFill>
  );
};

// Line 16: the Moon rises close; the comment ask, then Follow (Chaand.tsx places the CTAs).
export const End3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const rise = t01(frame, 0, 100, easeOut);
  const s: SpaceState = {
    cam: [1.2, lerp3([0, -9, 0], [0, -3.6, 0], rise)[1], 15],
    target: [0, lerp3([0, -9, 0], [0, -3.6, 0], rise)[1] + 0.4, 0],
    moon: {pos: [0, 0, 0], r: 3, light: 1, spin: 0.3 + frame * 0.001},
    sun: {pos: [-60, 12, -40], r: 4, power: 0},
    lightFrom: [-40, 12, 30],
  };
  return (
    <AbsoluteFill>
      <Space3D s={s} time={frame / 30} />
      <Credit text="Moon map: Solar System Scope, CC BY 4.0 (NASA data)" at={cues.line(16) + 6} />
    </AbsoluteFill>
  );
};
