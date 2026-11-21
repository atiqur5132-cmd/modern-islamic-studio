import React from "react";
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {CLAMP, fade, grow, PAPER, pop, SANS, sec, SERIF, View} from "./look";

// Pieces of the paper board: the board and its camera, photo prints, logo cards, pay stubs,
// clippings, stamps and strikes. Everything is placed in board coordinates (px).

export const Board = ({view, children}: {view: View; children: React.ReactNode}) => (
  <AbsoluteFill style={{overflow: "hidden"}}>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: 1,
        height: 1,
        transformOrigin: "0 0",
        transform: `translate(960px, 540px) scale(${view.s}) translate(${-view.x}px, ${-view.y}px)`,
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

// The paper itself: warm ground, soft light from the upper left, fine halftone dots.
export const Paper = ({night = 0}: {night?: number}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: `radial-gradient(ellipse 80% 75% at 40% 35%, #fbf8f1 0%, ${PAPER.ground} 55%, ${PAPER.ground2} 100%)`}} />
    <AbsoluteFill
      style={{
        backgroundImage: `radial-gradient(${PAPER.ink} 0.9px, transparent 1.3px)`,
        backgroundSize: "9px 9px",
        opacity: 0.045,
      }}
    />
    {night > 0 ? <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 70% at 50% 45%, #232a33 0%, ${PAPER.night} 100%)`, opacity: night}} /> : null}
  </AbsoluteFill>
);

// Placed at (x, y) on the board, centred, with an arrival `k` (0..1) and a tilt.
export const At = ({x, y, k = 1, rot = 0, scale = 1, children, from = "pop", z}: {x: number; y: number; k?: number; rot?: number; scale?: number; children: React.ReactNode; from?: "pop" | "drop" | "left" | "right" | "up"; z?: number}) => {
  if (k <= 0) return null;
  const off = from === "drop" ? `0px, ${(1 - k) * -220}px` : from === "left" ? `${(1 - k) * -360}px, 0px` : from === "right" ? `${(1 - k) * 360}px, 0px` : from === "up" ? `0px, ${(1 - k) * 200}px` : "0px, 0px";
  const sc = from === "pop" ? 0.6 + 0.4 * k : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: z,
        transform: `translate(-50%, -50%) translate(${off}) rotate(${rot + (1 - k) * (from === "pop" ? 0 : rot * 2)}deg) scale(${sc * scale})`,
        opacity: Math.min(1, k * 1.6),
      }}
    >
      {children}
    </div>
  );
};

const SHADOW = "0 2px 3px rgba(40,30,20,0.18), 0 22px 40px -12px rgba(40,30,20,0.35)";

// A real photo printed on paper: white border, tilt from <At>, soft shadow, a name strip.
export const PhotoPrint = ({src, w = 420, h = 520, pos = "50% 20%", name, nameK = 1, accent, zoom = 1}: {src: string; w?: number; h?: number; pos?: string; name?: string; nameK?: number; accent: string; zoom?: number}) => (
  <div style={{position: "relative", width: w + 32, background: PAPER.white, padding: "16px 16px 22px", boxShadow: SHADOW, borderRadius: 3}}>
    <div style={{width: w, height: h, overflow: "hidden", borderRadius: 1}}>
      <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${zoom})`, filter: "contrast(1.04) saturate(0.92)"}} />
    </div>
    {name ? (
      <div
        style={{
          position: "absolute",
          left: 16,
          bottom: -34,
          transform: `translateY(${(1 - nameK) * 20}px)`,
          opacity: nameK,
          background: PAPER.ink,
          color: PAPER.white,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 2,
          padding: "10px 18px 9px",
          whiteSpace: "nowrap",
          boxShadow: "0 10px 20px -8px rgba(0,0,0,0.4)",
          borderLeft: `8px solid ${accent}`,
        }}
      >
        {name}
      </div>
    ) : null}
  </div>
);

// An official logo, unaltered, on a small white card (editorial use: names the company).
export const LogoCard = ({src, w = 220, h = 120, pad = 26}: {src: string; w?: number; h?: number; pad?: number}) => (
  <div style={{width: w, height: h, background: "#ffffff", borderRadius: 18, boxShadow: SHADOW, display: "flex", alignItems: "center", justifyContent: "center", padding: pad, boxSizing: "border-box"}}>
    <Img src={staticFile(src)} style={{maxWidth: "100%", maxHeight: "100%", objectFit: "contain"}} />
  </div>
);

// A pay stub: perforated top, "ANNUAL SALARY", and an amount that punches in at `k`.
export const PayStub = ({amount = "$1", k = 1, label = "ANNUAL SALARY", accent, w = 380, tick = 0, small = false}: {amount?: string; k?: number; label?: string; accent: string; w?: number; tick?: number; small?: boolean}) => {
  const big = small ? 120 : 170;
  return (
    <div style={{position: "relative", width: w, background: PAPER.white, boxShadow: SHADOW, padding: "34px 30px 26px", boxSizing: "border-box", fontFamily: SANS}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 10, backgroundImage: `radial-gradient(circle at 8px 0px, ${PAPER.ground} 5px, transparent 5.5px)`, backgroundSize: "16px 10px"}} />
      <div style={{fontWeight: 700, fontSize: 22, letterSpacing: 3, color: PAPER.inkSoft}}>{label}</div>
      <div style={{height: 2, background: PAPER.ground2, margin: "12px 0 6px"}} />
      <div style={{position: "relative", height: big * 1.02}}>
        <div style={{position: "absolute", left: 0, top: big * 0.42, width: "70%", height: 4, background: PAPER.ground2, opacity: 1 - k}} />
        <div
          style={{
            fontWeight: 800,
            fontSize: big,
            letterSpacing: -6,
            color: accent,
            lineHeight: 1,
            transform: `scale(${k > 0 ? 1 + (1 - k) * 0.5 : 0})`,
            transformOrigin: "20% 60%",
            opacity: Math.min(1, k * 2),
          }}
        >
          {amount}
          <span style={{fontSize: big * 0.24, letterSpacing: 0, color: PAPER.inkSoft, fontWeight: 700, marginLeft: 10}}>/ year</span>
        </div>
        {tick > 0 ? <TickMark k={tick} color={accent} size={70} style={{position: "absolute", right: -6, top: -6}} /> : null}
      </div>
      <div style={{display: "flex", gap: 10, marginTop: 8}}>
        {[0.55, 0.3, 0.42].map((f, i) => (
          <div key={i} style={{height: 8, width: `${f * 100}%`, background: PAPER.ground2, borderRadius: 4}} />
        ))}
      </div>
    </div>
  );
};

export const TickMark = ({k, color, size = 80, style}: {k: number; color: string; size?: number; style?: React.CSSProperties}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <circle cx={50} cy={50} r={46} fill={color} opacity={Math.min(1, k * 2)} transform={`scale(${0.7 + 0.3 * Math.min(1, k * 2)})`} style={{transformOrigin: "50px 50px"}} />
    <path d="M28 52 L44 67 L73 36" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, Math.min(1, k * 1.6 - 0.4))} />
  </svg>
);

// A rubber stamp that hits the paper: overshoots, then settles with a little ink spread.
export const Stamp = ({text, at, color, size = 64, rot = -8}: {text: string; at: number; color: string; size?: number; rot?: number}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [sec(at), sec(at) + 7], [0, 1], {...CLAMP, easing: Easing.in(Easing.quad)});
  if (t <= 0) return null;
  const scale = 1.9 - 0.9 * t;
  return (
    <div
      style={{
        transform: `rotate(${rot}deg) scale(${scale})`,
        opacity: Math.min(1, t * 1.4) * 0.92,
        border: `6px solid ${color}`,
        borderRadius: 10,
        color,
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: 4,
        padding: "4px 22px 2px",
        whiteSpace: "nowrap",
        mixBlendMode: "multiply",
      }}
    >
      {text}
    </div>
  );
};

// Big words with an optional red strike that draws across them.
export const Struck = ({text, k, strike = 0, size = 110, color = PAPER.ink, serif = false, strikeColor = PAPER.red}: {text: string; k: number; strike?: number; size?: number; color?: string; serif?: boolean; strikeColor?: string}) => (
  <div
    style={{
      position: "relative",
      display: "inline-block",
      opacity: k,
      transform: `translateY(${(1 - k) * 22}px)`,
      fontFamily: serif ? SERIF : SANS,
      fontStyle: serif ? "italic" : "normal",
      fontWeight: serif ? 500 : 800,
      fontSize: size,
      letterSpacing: serif ? 0 : -2,
      color: strike > 0.5 ? PAPER.inkSoft : color,
      whiteSpace: "nowrap",
      lineHeight: 1.05,
    }}
  >
    {text}
    {strike > 0 ? <svg style={{position: "absolute", left: -14, top: "48%", width: "calc(100% + 28px)", height: 20, overflow: "visible"}} viewBox="0 0 100 10" preserveAspectRatio="none">
      <path d="M0 7 L100 2" stroke={strikeColor} strokeWidth={size * 0.09} vectorEffect="non-scaling-stroke" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike} fill="none" />
    </svg> : null}
  </div>
);

// A newspaper clipping: torn edges, a serif headline, a few column lines. No real masthead.
export const Clipping = ({headline, w = 520, sub, rot = 0}: {headline: string; w?: number; sub?: string; rot?: number}) => (
  <div
    style={{
      width: w,
      background: "#f1ead9",
      padding: "26px 30px 30px",
      boxSizing: "border-box",
      boxShadow: SHADOW,
      transform: `rotate(${rot}deg)`,
      clipPath: "polygon(0% 2%, 6% 0%, 14% 1.5%, 22% 0%, 31% 1%, 40% 0%, 52% 1.6%, 63% 0%, 74% 1.2%, 85% 0%, 94% 1.5%, 100% 0%, 99% 30%, 100% 62%, 99% 100%, 90% 98.5%, 78% 100%, 66% 98.4%, 54% 100%, 41% 98.6%, 29% 100%, 17% 98.5%, 6% 100%, 0% 98%, 1% 60%, 0% 30%)",
    }}
  >
    <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 50, lineHeight: 1.04, color: PAPER.ink, letterSpacing: -0.5}}>{headline}</div>
    {sub ? <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 26, color: PAPER.inkSoft, marginTop: 10}}>{sub}</div> : null}
    <div style={{display: "flex", gap: 18, marginTop: 18}}>
      {[0, 1, 2].map((c) => (
        <div key={c} style={{flex: 1, display: "flex", flexDirection: "column", gap: 9}}>
          {[1, 0.92, 0.97, 0.8, 0.95, 0.6].map((f, i) => (
            <div key={i} style={{height: 6, width: `${f * 100}%`, background: "#bdb39f", borderRadius: 2}} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

// A US one-dollar bill drawn as an engraved note (no portrait), for the "$1" idea.
export const DollarBill = ({w = 640, glow = 0}: {w?: number; glow?: number}) => {
  const h = w * 0.425;
  const g = "#2f5a3a";
  return (
    <div style={{position: "relative", width: w, height: h, filter: `drop-shadow(0 26px 30px rgba(30,40,25,0.32))${glow > 0 ? ` drop-shadow(0 0 ${60 * glow}px rgba(255,236,170,${0.9 * glow}))` : ""}`}}>
      <svg width={w} height={h} viewBox="0 0 640 272">
        <defs>
          <linearGradient id="billPaper" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#e4ecd9" />
            <stop offset="1" stopColor="#cfdcc2" />
          </linearGradient>
          <pattern id="billLines" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="6" stroke={g} strokeWidth="0.7" opacity="0.18" />
          </pattern>
        </defs>
        <rect x="2" y="2" width="636" height="268" rx="10" fill="url(#billPaper)" />
        <rect x="2" y="2" width="636" height="268" rx="10" fill="url(#billLines)" />
        <rect x="16" y="16" width="608" height="240" rx="6" fill="none" stroke={g} strokeWidth="5" />
        <rect x="28" y="28" width="584" height="216" rx="4" fill="none" stroke={g} strokeWidth="1.6" opacity="0.7" />
        <ellipse cx="320" cy="136" rx="92" ry="98" fill="#dfe8d3" stroke={g} strokeWidth="4" />
        <ellipse cx="320" cy="136" rx="78" ry="84" fill="none" stroke={g} strokeWidth="1.5" opacity="0.6" />
        <text x="320" y="176" textAnchor="middle" fontFamily={SERIF} fontWeight={500} fontSize="120" fill={g}>1</text>
        {[
          [70, 74],
          [570, 74],
          [70, 214],
          [570, 214],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="30" fill="#dfe8d3" stroke={g} strokeWidth="3" />
            <text x={x} y={y + 14} textAnchor="middle" fontFamily={SERIF} fontWeight={500} fontSize="40" fill={g}>1</text>
          </g>
        ))}
        <text x="320" y="60" textAnchor="middle" fontFamily={SERIF} fontSize="22" letterSpacing="6" fill={g}>ONE DOLLAR</text>
        <text x="320" y="252" textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize="14" letterSpacing="5" fill={g} opacity="0.75">ANNUAL SALARY · ONE DOLLAR</text>
      </svg>
    </div>
  );
};

// Clapping hands mark (applause), drawn as two palms and three motion lines.
export const Clap = ({size = 120, color, k = 1}: {size?: number; color: string; k?: number}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: "visible"}}>
    <g transform={`rotate(${(1 - k) * -18} 50 70)`}>
      <path d="M30 88 C18 72 20 52 34 38 L52 22 C56 18 62 22 58 27 L46 40 L62 26 C66 22 72 27 68 31 L54 45 L66 35 C70 31 76 36 72 40 L58 54 L66 48 C70 45 75 50 71 54 L52 74 C44 82 38 90 30 88 Z" fill="#fffdf8" stroke={color} strokeWidth={4.5} strokeLinejoin="round" />
    </g>
    {[0, 1, 2].map((i) => (
      <line key={i} x1={70 + i * 8} y1={14 + i * 4} x2={78 + i * 9} y2={4 + i * 6} stroke={color} strokeWidth={5} strokeLinecap="round" opacity={k} />
    ))}
  </svg>
);

// A short fade-in-out wrapper on time, for whole groups.
export const During = ({from, to, children}: {from: number; to: number; children: React.ReactNode}) => {
  const frame = useCurrentFrame();
  if (frame < sec(from) - 1 || frame > sec(to) + 14) return null;
  const k = grow(frame, from, 12) * fade(frame, to, 12);
  return <div style={{position: "absolute", left: 0, top: 0, opacity: k}}>{children}</div>;
};

export const popK = pop;

// Credit line for a claim, bottom-left on the screen (outside the board).
export const Note = ({from, to, text, color = PAPER.inkSoft}: {from: number; to: number; text: string; color?: string}) => {
  const frame = useCurrentFrame();
  const k = grow(frame, from, 14) * fade(frame, to, 10);
  if (k <= 0) return null;
  return <div style={{position: "absolute", left: 110, bottom: 52, fontFamily: SANS, fontWeight: 600, fontSize: 25, color, opacity: k * 0.9}}>{text}</div>;
};
