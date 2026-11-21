import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {CH, CHAPTERS, CLAMP, fade, grow, Palette, pop, SANS, sec, SERIF} from "./look";

// Layout pieces shared by the chapters: the tinted ground with its circle wipe, timed
// show/pop wrappers, words that sit beside a visual, and the claim credit.

export const Ground = ({skipFirst = false}: {skipFirst?: boolean}) => {
  const frame = useCurrentFrame();
  const layers = CHAPTERS.map((c, i) => {
    if (skipFirst && i === 0) return null;
    const p = c.at === 0 ? 1 : interpolate(frame, [sec(c.at), sec(c.at) + 24], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
    if (p <= 0) return null;
    const next = CHAPTERS[i + 1];
    if (next && frame > sec(next.at) + 26) return null;
    const pal = CH[c.key];
    const r = p * 2300;
    return (
      <AbsoluteFill
        key={i}
        style={{
          background: `radial-gradient(ellipse 75% 70% at 50% 42%, #fbfcfb 0%, ${pal.ground} 55%, ${pal.ground2} 100%)`,
          clipPath: p < 1 ? `circle(${r}px at ${c.origin[0]}px ${c.origin[1]}px)` : undefined,
        }}
      />
    );
  });
  return <AbsoluteFill>{layers}</AbsoluteFill>;
};

// Children shown from `from` to `to` seconds, fading in and out.
export const Show = ({from, to, children, rise = 24}: {from: number; to: number; children: React.ReactNode; rise?: number}) => {
  const frame = useCurrentFrame();
  if (frame < sec(from) - 1 || frame > sec(to) + 12) return null;
  const k = grow(frame, from, 14) * fade(frame, to, 12);
  return <AbsoluteFill style={{opacity: k, transform: `translateY(${(1 - grow(frame, from, 18)) * rise}px)`}}>{children}</AbsoluteFill>;
};

// An object that pops in at `at`, centred on (x, y), with a soft drop shadow for depth.
export const Pop = ({at, x, y, children, out, scale = 1, shadow = true, rotate = 0}: {at: number; x: number; y: number; children: React.ReactNode; out?: number; scale?: number; shadow?: boolean; rotate?: number}) => {
  const frame = useCurrentFrame();
  const k = pop(frame, at);
  const o = out === undefined ? 1 : fade(frame, out, 10);
  if (k <= 0 || o <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${k * scale}) rotate(${rotate}deg)`,
        opacity: Math.min(1, k * 1.5) * o,
        filter: shadow ? "drop-shadow(0 18px 22px rgba(20,20,20,0.16))" : undefined,
      }}
    >
      {children}
    </div>
  );
};

// A few words beside a visual (never a screen of text on its own).
export const Words = ({at, x, y, children, size = 64, color, weight = 800, align = "left", out, serif = false}: {at: number; x: number; y: number; children: React.ReactNode; size?: number; color: string; weight?: number; align?: "left" | "center" | "right"; out?: number; serif?: boolean}) => {
  const frame = useCurrentFrame();
  const k = grow(frame, at, 12);
  const o = out === undefined ? 1 : fade(frame, out, 10);
  if (k <= 0 || o <= 0) return null;
  const tx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${tx}, ${(1 - k) * 16}px)`,
        opacity: k * o,
        fontFamily: serif ? SERIF : SANS,
        fontStyle: serif ? "italic" : "normal",
        fontWeight: serif ? 500 : weight,
        fontSize: size,
        color,
        letterSpacing: serif ? 0 : -1,
        whiteSpace: "nowrap",
        lineHeight: 1.05,
      }}
    >
      {children}
    </div>
  );
};

export const Credit = ({from, to, text, pal}: {from: number; to: number; text: string; pal: Palette}) => {
  const frame = useCurrentFrame();
  const k = grow(frame, from, 14) * fade(frame, to, 10);
  if (k <= 0) return null;
  return <div style={{position: "absolute", left: 120, bottom: 60, fontFamily: SANS, fontWeight: 600, fontSize: 26, color: pal.inkSoft, opacity: k * 0.9}}>{text}</div>;
};

// A number that counts from `from` to `to` between two times.
export const useCount = (a: number, b: number, from: number, to: number) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [sec(a), sec(b)], [from, to], {...CLAMP, easing: Easing.out(Easing.quad)});
};

// A dashed path that draws itself between two times.
export const DrawPath = ({d, a, b, color, width = 5, dash}: {d: string; a: number; b: number; color: string; width?: number; dash?: string}) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [sec(a), sec(b)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  if (k <= 0) return null;
  return (
    <svg width={1920} height={1080} style={{position: "absolute", inset: 0, overflow: "visible"}}>
      <mask id={`m-${a}-${b}`}>
        <path d={d} fill="none" stroke="#fff" strokeWidth={width + 6} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
      </mask>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash} mask={`url(#m-${a}-${b})`} />
    </svg>
  );
};
