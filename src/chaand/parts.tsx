import {CSSProperties, ReactNode} from "react";
import {AbsoluteFill, Img, random, staticFile, useCurrentFrame} from "remotion";
import {ACCENT, arrive, CREDIT_Y, GROUND, INK, MUTED, PAPER_MUTED, SANS, SERIF, SIDE} from "./look";

// The real NASA Moon (LRO nearside mosaic): the disc fills the file edge to edge.
// `light` 1 = full, 0 = dark (only a faint rim left). `side` lights it from the left:
// 0 = no terminator, 1 = only the left half lit.
export const Moon = ({x, y, d, light = 1, side = 0, style}: {x: number; y: number; d: number; light?: number; side?: number; style?: CSSProperties}) => (
  <div
    style={{
      position: "absolute",
      left: x - d / 2,
      top: y - d / 2,
      width: d,
      height: d,
      borderRadius: "50%",
      overflow: "hidden",
      boxShadow: `0 0 0 2px rgba(236,229,213,${0.06 + 0.12 * (1 - light)})`,
      ...style,
    }}
  >
    <Img
      src={staticFile("footage/cn-moon.jpg")}
      style={{width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${0.04 + 0.96 * light}) saturate(0.6)`}}
    />
    {side > 0 ? (
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, rgba(14,18,27,0) ${100 - 50 * side}%, rgba(14,18,27,0.94) ${100 - 50 * side + 14}%)`,
        }}
      />
    ) : null}
  </div>
);

// The real NASA SDO Sun. The disc sits at the file's centre with a radius of 0.39 of its
// width; the mask keeps the corona and drops the time stamp. `light` 0 = gone black.
export const Sun = ({x, y, d, light = 1, style}: {x: number; y: number; d: number; light?: number; style?: CSSProperties}) => {
  const frame = useCurrentFrame();
  const w = d / 0.78; // file width for a disc of diameter d
  const breathe = 1 + 0.008 * Math.sin(frame / 9);
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - w / 2,
        width: w,
        height: w,
        transform: `scale(${breathe})`,
        WebkitMaskImage: "radial-gradient(circle at 50% 49%, black 41%, transparent 49%)",
        maskImage: "radial-gradient(circle at 50% 49%, black 41%, transparent 49%)",
        ...style,
      }}
    >
      <Img
        src={staticFile("footage/cn-sun.jpg")}
        style={{width: "100%", height: "100%", filter: `brightness(${0.02 + 1.18 * light}) saturate(${0.75 + 0.35 * light})`}}
      />
    </div>
  );
};

// A few dim, fixed stars: the subject is the night sky.
export const Stars = ({count = 70, seed = "cn", opacity = 1}: {count?: number; seed?: string; opacity?: number}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity}}>
      {Array.from({length: count}, (_, i) => {
        const x = random(`${seed}x${i}`) * 1080;
        const y = random(`${seed}y${i}`) * 1920;
        const r = 1 + random(`${seed}r${i}`) * 1.8;
        const tw = 0.35 + 0.25 * Math.sin(frame / (14 + 9 * random(`${seed}t${i}`)) + i);
        return <div key={i} style={{position: "absolute", left: x, top: y, width: r, height: r, borderRadius: "50%", background: INK, opacity: tw}} />;
      })}
    </AbsoluteFill>
  );
};

// A photo filling the frame. `focus` is the point of the file (0-1) kept at the frame's
// centre; `zoom` grows slowly from `from` over the shot.
export const Photo = ({src, focus = [0.5, 0.5], from = 1.0, to = 1.06, frames = 150, filter, fileAspect}: {src: string; focus?: [number, number]; from?: number; to?: number; frames?: number; filter?: string; fileAspect: number}) => {
  const frame = useCurrentFrame();
  const z = from + (to - from) * Math.min(1, frame / frames);
  // Cover the 1080x1920 frame at zoom z, then slide the focus to the centre (clamped).
  const coverH = Math.max(1920, 1080 / fileAspect) * z;
  const coverW = coverH * fileAspect;
  const left = Math.min(0, Math.max(1080 - coverW, 540 - focus[0] * coverW));
  const top = Math.min(0, Math.max(1920 - coverH, 960 - focus[1] * coverH));
  return (
    <AbsoluteFill style={{overflow: "hidden", backgroundColor: GROUND}}>
      <Img src={staticFile(`footage/${src}`)} style={{position: "absolute", left, top, width: coverW, height: coverH, filter}} />
    </AbsoluteFill>
  );
};

// The documentary credit line: claim tag and source, one line, sentence case.
export const Credit = ({text, at = 4, paper = false, y = CREDIT_Y}: {text: string; at?: number; paper?: boolean; y?: number}) => {
  const frame = useCurrentFrame();
  const t = arrive(frame, at, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: SIDE,
        right: 150,
        top: y,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 29,
        letterSpacing: 0.2,
        color: paper ? PAPER_MUTED : MUTED,
        opacity: t,
        transform: `translateY(${(1 - t) * 8}px)`,
        whiteSpace: "nowrap",
        textShadow: paper ? undefined : "0 2px 10px rgba(14,18,27,0.95), 0 0 3px rgba(14,18,27,0.9)",
      }}
    >
      {text}
    </div>
  );
};

// A big serif line that lands and holds still.
export const Line = ({children, at, x = SIDE, y, size = 96, color = INK, italic = true, align = "left", width = 1080 - 2 * SIDE, frames = 16, style}: {children: ReactNode; at: number; x?: number; y: number; size?: number; color?: string; italic?: boolean; align?: "left" | "center"; width?: number; frames?: number; style?: CSSProperties}) => {
  const frame = useCurrentFrame();
  const t = arrive(frame, at, frames);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        fontFamily: SERIF,
        fontStyle: italic ? "italic" : "normal",
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: -0.5,
        color,
        textAlign: align,
        textWrap: "balance",
        opacity: t,
        transform: `translateY(${(1 - t) * 22}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// A small sans label.
export const Label = ({children, at, x, y, color = INK, size = 34, weight = 700, align = "left", width}: {children: ReactNode; at: number; x: number; y: number; color?: string; size?: number; weight?: number; align?: "left" | "center"; width?: number}) => {
  const frame = useCurrentFrame();
  const t = arrive(frame, at, 14);
  return (
    <div style={{position: "absolute", left: x, top: y, width, textAlign: align, fontFamily: SANS, fontWeight: weight, fontSize: size, letterSpacing: 0.3, color, opacity: t, transform: `translateY(${(1 - t) * 10}px)`}}>
      {children}
    </div>
  );
};

// A hand-drawn line through text, drawn left to right.
export const Strike = ({progress, color = INK, width = 6, tilt = -3}: {progress: number; color?: string; width?: number; tilt?: number}) => (
  <div
    style={{
      position: "absolute",
      left: -8,
      top: "54%",
      height: width,
      width: `calc(${progress * 100}% + ${progress * 16}px)`,
      background: color,
      borderRadius: width,
      transform: `rotate(${tilt}deg)`,
      transformOrigin: "left center",
    }}
  />
);

// The generic forward the viewer has seen (no app, no account), set as the claim.
export const Forward = ({x, y, enter, mark = 0, tilt = 0, dim = 1}: {x: number; y: number; enter: number; mark?: number; tilt?: number; dim?: number}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 1080 - 2 * SIDE - 40,
      padding: "34px 40px 38px",
      borderRadius: "14px 34px 34px 34px",
      background: "#222838",
      opacity: enter * dim,
      transform: `translateY(${(1 - enter) * 140}px) rotate(${tilt}deg)`,
      transformOrigin: "left top",
    }}
  >
    <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: MUTED, marginBottom: 14}}>↪ Forwarded many times</div>
    <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 52, lineHeight: 1.22, color: INK}}>
      The Quran said it{" "}
      <span style={{position: "relative", display: "inline-block"}}>
        1400 years ago
        <span style={{position: "absolute", left: 0, bottom: -6, height: 6, width: `${mark * 100}%`, background: INK, borderRadius: 3}} />
      </span>
      : the Moon’s light is reflected.
    </div>
  </div>
);

// The paper page's credit colour, for scenes on PAPER.
export const paperCredit = (text: string, at = 4) => <Credit text={text} at={at} paper />;

export const amber = ACCENT;
