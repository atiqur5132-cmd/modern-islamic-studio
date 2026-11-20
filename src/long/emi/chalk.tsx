import React from "react";
import {Easing, interpolate, useCurrentFrame} from "remotion";
import {CLAMP, HAND, LOOK, grow, sec} from "./look";

// The chalk board's building blocks. Everything lives in world coordinates inside the
// Board's camera group; `at` is seconds on the voiceover, `until` when it is wiped.

const wipe = (frame: number, until?: number) =>
  until === undefined ? 1 : interpolate(frame, [sec(until), sec(until) + 8], [1, 0], CLAMP);

// A path that draws itself from start to end.
export const Stroke = ({d, at, frames = 20, until, color = LOOK.chalk, width = 5, dash, fill}: {
  d: string;
  at: number;
  frames?: number;
  until?: number;
  color?: string;
  width?: number;
  dash?: string;
  fill?: string;
}) => {
  const frame = useCurrentFrame();
  if (frame < sec(at)) return null;
  const p = grow(frame, at, frames, Easing.inOut(Easing.cubic));
  const opacity = wipe(frame, until);
  if (opacity <= 0) return null;
  if (dash) {
    // Dashed lines reveal through a mask so the dashes keep their rhythm while drawing.
    const id = `dash-${Math.round(at * 100)}-${d.length}`;
    return (
      <g opacity={opacity}>
        <mask id={id} maskUnits="userSpaceOnUse" x="-20000" y="-20000" width="40000" height="40000">
          <path d={d} pathLength={1} fill="none" stroke="#fff" strokeWidth={width * 3} strokeLinecap="round"
            strokeDasharray="1 1" strokeDashoffset={1 - p} />
        </mask>
        <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash} mask={`url(#${id})`} />
      </g>
    );
  }
  return (
    <g opacity={opacity}>
      {fill ? <path d={d} fill={fill} opacity={p} stroke="none" /> : null}
      <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round"
        strokeLinejoin="round" strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </g>
  );
};

// Handwritten text written left to right. Width is estimated from Caveat's average glyph.
export const Write = ({text, x, y, size = 64, at, cps = 42, until, color = LOOK.chalk, anchor = "start", weight = 600, rotate = 0, family = HAND, italic = false}: {
  text: string;
  x: number;
  y: number;
  size?: number;
  at: number;
  cps?: number; // characters written per second
  until?: number;
  color?: string;
  anchor?: "start" | "middle" | "end";
  weight?: number;
  rotate?: number;
  family?: string;
  italic?: boolean;
}) => {
  const frame = useCurrentFrame();
  if (frame < sec(at)) return null;
  const opacity = wipe(frame, until);
  if (opacity <= 0) return null;
  const est = text.length * size * 0.5;
  const frames = Math.max(6, Math.round((text.length / cps) * 30));
  const p = grow(frame, at, frames, Easing.out(Easing.quad));
  const left = anchor === "start" ? x : anchor === "middle" ? x - est / 2 : x - est;
  const id = `w-${Math.round(x)}-${Math.round(y)}-${Math.round(at * 100)}`;
  return (
    <g opacity={opacity} transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}>
      <clipPath id={id}>
        <rect x={left - size * 0.3} y={y - size * 1.2} width={(est + size * 0.6) * p} height={size * 1.7} />
      </clipPath>
      <text x={x} y={y} fill={color} fontFamily={family} fontWeight={weight} fontSize={size} textAnchor={anchor}
        fontStyle={italic ? "italic" : "normal"} clipPath={p >= 1 ? undefined : `url(#${id})`}>
        {text}
      </text>
    </g>
  );
};

// Something that appears whole (a group of strokes drawn earlier, a filled shape).
export const Show = ({at, until, frames = 12, children}: {at: number; until?: number; frames?: number; children: React.ReactNode}) => {
  const frame = useCurrentFrame();
  if (frame < sec(at)) return null;
  const o = Math.min(grow(frame, at, frames), wipe(frame, until));
  if (o <= 0) return null;
  return <g opacity={o}>{children}</g>;
};

// The chalk texture: a light static displacement (hand wobble) and a dusty alpha mask,
// applied in screen space so it does not scale with the camera.
export const ChalkDefs = () => (
  <defs>
    <filter id="chalk" x="0" y="0" width="100%" height="100%" filterUnits="userSpaceOnUse">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={4} result="wob" />
      <feDisplacementMap in="SourceGraphic" in2="wob" scale={3} xChannelSelector="R" yChannelSelector="G" result="moved" />
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves={2} seed={9} result="dust" />
      <feColorMatrix in="dust" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.75" result="dustAlpha" />
      <feComposite in="moved" in2="dustAlpha" operator="in" />
    </filter>
  </defs>
);
