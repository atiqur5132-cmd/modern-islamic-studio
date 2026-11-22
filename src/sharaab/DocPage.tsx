import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {arrive, MUTED, SANS} from "./look";

// A real document brought up from the table to face the viewer, full screen and lit, then
// the camera moves in on the line being spoken while a highlighter runs under it. The image
// is the 3x capture (public/footage, research.md), drawn at its zoomed size, so type stays
// crisp. Replaces the sheets lying on the dark table, which could not be read (creator,
// 2026-11-22).

export type Shot = {at: number; u: number; v: number; scale: number};
export type Mark = {at: number; end: number; u0: number; u1: number; v: number; h: number};

const CARD_W = 980;
const CENTER: [number, number] = [540, 760];
const ease = Easing.inOut(Easing.cubic);

export const DocPage = ({src, aspect, shots, marks, credit}: {src: string; aspect: number; shots: Shot[]; marks: Mark[]; credit: string}) => {
  const frame = useCurrentFrame();
  // Camera: between shots it moves over 18 frames, eased.
  let cur = shots[0];
  for (let i = 1; i < shots.length; i++) {
    const s = shots[i];
    if (frame >= s.at) {
      const k = ease(Math.min(1, (frame - s.at) / 18));
      const p = shots[i - 1];
      cur = {at: s.at, u: p.u + (s.u - p.u) * k, v: p.v + (s.v - p.v) * k, scale: p.scale + (s.scale - p.scale) * k};
      if (k < 1) break;
    }
  }
  // Arrival: lifted from the table, tilting up to face the lens.
  const up = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  const drift = frame * 0.0006;
  const scale = cur.scale * (1 + drift);
  const W = CARD_W * scale;
  const H = W * aspect;
  const left = CENTER[0] - cur.u * W;
  const top = CENTER[1] - cur.v * H;
  const tilt = (1 - up) * 58 + 4 / cur.scale;
  return (
    <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 40%, #3A2C20 0%, #1B1511 60%, #120E0B 100%)"}}>
      <AbsoluteFill style={{perspective: 2200}}>
        <div
          style={{
            position: "absolute",
            left,
            top,
            width: W,
            height: H,
            transform: `translateY(${(1 - up) * 700}px) rotateX(${tilt}deg)`,
            transformOrigin: `${cur.u * 100}% ${cur.v * 100}%`,
            boxShadow: "0 50px 140px rgba(0,0,0,0.65), 0 8px 24px rgba(0,0,0,0.4)",
            background: "#FBFAF7",
            opacity: Math.min(1, up * 1.6),
          }}
        >
          <Img src={staticFile(src)} style={{width: "100%", height: "100%", display: "block"}} />
          {marks.map((m, i) => {
            const p = interpolate(frame, [m.at, m.end], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease});
            if (p <= 0) return null;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: m.u0 * W,
                  top: (m.v - m.h / 2) * H,
                  width: (m.u1 - m.u0) * W * p,
                  height: m.h * H,
                  background: "rgba(242, 196, 82, 0.55)",
                  mixBlendMode: "multiply",
                  borderRadius: 3,
                }}
              />
            );
          })}
          {/* Paper light: a soft falloff so the sheet reads as lit paper, not a screen grab. */}
          <div style={{position: "absolute", inset: 0, background: "radial-gradient(ellipse at 45% 35%, rgba(255,248,235,0) 40%, rgba(120,90,60,0.16) 100%)", pointerEvents: "none"}} />
        </div>
      </AbsoluteFill>
      {/* Lower shade so the credit and captions read over the page. */}
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(18,14,11,0) 52%, rgba(18,14,11,0.86) 60%, rgba(18,14,11,0.92) 100%)"}} />
      <div style={{position: "absolute", left: 96, right: 140, top: 1160, fontFamily: SANS, fontWeight: 600, fontSize: 29, color: MUTED, opacity: arrive(frame, 10, 14), whiteSpace: "nowrap"}}>{credit}</div>
    </AbsoluteFill>
  );
};
