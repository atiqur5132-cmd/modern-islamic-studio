import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {arrive, CLAMP, LOOK, MARGIN, SANS, SERIF} from "./look";

// The documentary credit line: who or what, then the claim tag and the source on one
// quiet line (STYLE.md). It is where CLAUDE.md's claim tag lives.
export const Credit = ({
  at,
  tag,
  source,
  paper = false,
  left = MARGIN,
  bottom = 150,
  align = "left",
}: {
  at: number;
  tag: string;
  source: string;
  paper?: boolean;
  left?: number;
  bottom?: number;
  align?: "left" | "right";
}) => {
  const frame = useCurrentFrame();
  const a = arrive(frame, at, 16);
  return (
    <div
      style={{
        position: "absolute",
        [align]: left,
        bottom,
        opacity: a * 0.78,
        transform: `translateY(${(1 - a) * 10}px)`,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 28,
        color: paper ? LOOK.paperMuted : LOOK.muted,
        letterSpacing: 0.1,
      }}
    >
      <span style={{color: paper ? LOOK.paperInk : LOOK.ivory, opacity: 0.9}}>{tag}</span> · {source}
    </div>
  );
};

// One phrase big, in the serif. Lands and holds still; a slow drift keeps it alive.
export const Big = ({
  at,
  children,
  size = 120,
  left = MARGIN,
  top = 300,
  width = 1300,
  color = LOOK.ivory,
  italic = false,
  serif = true,
  outAt,
}: {
  at: number;
  children: React.ReactNode;
  size?: number;
  left?: number;
  top?: number;
  width?: number;
  color?: string;
  italic?: boolean;
  serif?: boolean;
  outAt?: number;
}) => {
  const frame = useCurrentFrame();
  const a = arrive(frame, at, 18);
  const out = outAt === undefined ? 1 : interpolate(frame, [outAt, outAt + 9], [1, 0], CLAMP);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        opacity: a * out,
        transform: `translateY(${(1 - a) * 26 - Math.max(0, frame - at) * 0.05}px)`,
        fontFamily: serif ? SERIF : SANS,
        fontStyle: italic ? "italic" : "normal",
        fontWeight: serif ? 500 : 800,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: serif ? -1 : -2,
        color,
        textWrap: "balance",
      }}
    >
      {children}
    </div>
  );
};

// Small sans label.
export const Label = ({
  at,
  children,
  left,
  top,
  size = 34,
  color = LOOK.muted,
  weight = 700,
  center = false,
  width,
}: {
  at: number;
  children: React.ReactNode;
  left: number;
  top: number;
  size?: number;
  color?: string;
  weight?: number;
  center?: boolean;
  width?: number;
}) => {
  const frame = useCurrentFrame();
  const a = arrive(frame, at, 16);
  return (
    <div
      style={{
        position: "absolute",
        left: center && width ? left - width / 2 : left,
        top,
        width,
        textAlign: center ? "center" : "left",
        opacity: a,
        transform: `translateY(${(1 - a) * 12}px)`,
        fontFamily: SANS,
        fontWeight: weight,
        fontSize: size,
        color,
      }}
    >
      {children}
    </div>
  );
};

// A marker sweep drawn under a phrase as it is spoken.
export const Mark = ({at, children, color = LOOK.amber}: {at: number; children: React.ReactNode; color?: string}) => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [at, at + 12], [0, 1], CLAMP);
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(transparent 62%, ${color}70 62%, ${color}70 94%, transparent 94%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${sweep * 100}% 100%`,
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
};

export const Ground = ({color = LOOK.ground, children}: {color?: string; children?: React.ReactNode}) => (
  <AbsoluteFill style={{backgroundColor: color}}>{children}</AbsoluteFill>
);

// Paper with a faint fibre, for things a person reads.
export const Paper = ({children}: {children?: React.ReactNode}) => (
  <AbsoluteFill
    style={{
      backgroundColor: LOOK.paper,
      backgroundImage:
        "radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.35), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(120,100,70,0.10), transparent 55%)",
    }}
  >
    {children}
  </AbsoluteFill>
);

// A slow camera move over a whole scene: scale and drift, so no frame holds dead still.
export const Drift = ({children, from = 1, to = 1.04, frames = 300, x = 0, y = 0}: {children: React.ReactNode; from?: number; to?: number; frames?: number; x?: number; y?: number}) => {
  const frame = useCurrentFrame();
  const p = Math.min(1, frame / frames);
  const s = from + (to - from) * p;
  return <AbsoluteFill style={{transform: `translate(${x * p}px, ${y * p}px) scale(${s})`}}>{children}</AbsoluteFill>;
};
