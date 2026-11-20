import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {Stroke, Write} from "./chalk";
import {CLAMP, LOOK, box, grow, hand, line, ring, sec} from "./look";

// Chalk drawings used across the board. Each draws itself from `at` (seconds); `s` scales
// it around its own anchor (x, y). Strokes are staggered so a drawing builds up like a hand.

type Base = {x: number; y: number; at: number; s?: number; until?: number; color?: string; seed?: number};

const Scaled = ({x, y, s = 1, children}: {x: number; y: number; s?: number; children: React.ReactNode}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>{children}</g>
);

export const Figure = ({x, y, at, s = 1, until, color = LOOK.chalk, pose = "down", seed = 300}: Base & {pose?: "down" | "up" | "shrug" | "walk"}) => {
  const arms: Record<string, [number, number][][]> = {
    down: [[[0, 40], [-26, 80], [-34, 120]], [[0, 40], [26, 80], [34, 120]]],
    up: [[[0, 40], [-36, -10], [-50, -60]], [[0, 40], [36, -10], [50, -60]]],
    shrug: [[[0, 40], [-40, 60], [-58, 20]], [[0, 40], [40, 60], [58, 20]]],
    walk: [[[0, 40], [-20, 80], [-40, 110]], [[0, 40], [24, 80], [40, 104]]],
  };
  return (
    <Scaled x={x} y={y} s={s}>
      <Stroke d={ring(0, -34, 30, 30, seed)} at={at} frames={9} until={until} color={color} />
      <Stroke d={hand([[0, -2], [0, 70], [0, 140]], 1.5, seed + 1)} at={at + 0.15} frames={7} until={until} color={color} />
      {arms[pose].map((a, i) => (
        <Stroke key={i} d={hand(a, 1.5, seed + 2 + i)} at={at + 0.25} frames={7} until={until} color={color} />
      ))}
      <Stroke d={hand([[0, 140], [-22, 200], [-30, 250]], 1.5, seed + 5)} at={at + 0.3} frames={7} until={until} color={color} />
      <Stroke d={hand([[0, 140], [22, 200], [30, 250]], 1.5, seed + 6)} at={at + 0.3} frames={7} until={until} color={color} />
    </Scaled>
  );
};

// A classical bank: pediment, four columns, steps.
export const Bank = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 320}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={hand([[-170, -90], [0, -190], [170, -90], [-170, -90]], 2, seed)} at={at} frames={14} until={until} color={color} />
    <Stroke d={line(-150, -70, 150, -70, seed + 1)} at={at + 0.2} frames={8} until={until} color={color} />
    {[-110, -37, 37, 110].map((cx, i) => (
      <Stroke key={i} d={line(cx, -60, cx, 110, seed + 2 + i)} at={at + 0.3 + i * 0.08} frames={8} until={until} color={color} />
    ))}
    <Stroke d={line(-170, 120, 170, 120, seed + 7)} at={at + 0.6} frames={8} until={until} color={color} />
    <Stroke d={line(-195, 145, 195, 145, seed + 8)} at={at + 0.7} frames={8} until={until} color={color} />
    <Write text="$" x={0} y={-108} size={50} weight={700} anchor="middle" at={at + 0.5} until={until} color={color} />
  </Scaled>
);

// A government building: dome, flag-less, columns.
export const Capitol = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 340}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={hand([[-90, -60], [-80, -130], [-40, -175], [0, -185], [40, -175], [80, -130], [90, -60]], 2, seed)} at={at} frames={14} until={until} color={color} />
    <Stroke d={line(0, -185, 0, -220, seed + 1)} at={at + 0.3} frames={5} until={until} color={color} />
    <Stroke d={box(-170, -60, 340, 40, 4, seed + 2)} at={at + 0.3} frames={10} until={until} color={color} />
    {[-130, -65, 0, 65, 130].map((cx, i) => (
      <Stroke key={i} d={line(cx, -20, cx, 110, seed + 3 + i)} at={at + 0.45 + i * 0.06} frames={7} until={until} color={color} />
    ))}
    <Stroke d={line(-190, 125, 190, 125, seed + 9)} at={at + 0.8} frames={8} until={until} color={color} />
  </Scaled>
);

// A small shop for "the brand".
export const Shop = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 360}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={hand([[-150, -150], [-130, -80], [130, -80], [150, -150], [-150, -150]], 2, seed)} at={at} frames={12} until={until} color={color} />
    <Stroke d={hand([[-130, -80], [-100, -58], [-70, -80], [-40, -58], [-10, -80], [20, -58], [50, -80], [80, -58], [110, -80], [130, -66]], 1.2, seed + 1)} at={at + 0.2} frames={10} width={4} until={until} color={color} />
    <Stroke d={line(-130, -80, -130, 130, seed + 2)} at={at + 0.3} frames={8} until={until} color={color} />
    <Stroke d={line(130, -80, 130, 130, seed + 3)} at={at + 0.35} frames={8} until={until} color={color} />
    <Stroke d={box(-105, -30, 110, 90, 6, seed + 4)} at={at + 0.5} frames={8} width={4} until={until} color={color} />
    <Stroke d={hand([[40, 130], [40, -20], [105, -20], [105, 130]], 1.2, seed + 5)} at={at + 0.55} frames={8} width={4} until={until} color={color} />
    <Stroke d={line(-190, 130, 190, 130, seed + 6)} at={at + 0.6} frames={8} until={until} color={color} />
  </Scaled>
);

export const Phone = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 380}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={box(-60, -115, 120, 230, 18, seed)} at={at} frames={10} until={until} color={color} />
    <Stroke d={line(-15, -100, 15, -100, seed + 1)} at={at + 0.25} frames={4} width={4} until={until} color={color} />
    <Stroke d={ring(0, 96, 8, 8, seed + 2)} at={at + 0.3} frames={4} width={3} until={until} color={color} />
  </Scaled>
);

export const Coin = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 400, label = "$"}: Base & {label?: string}) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={ring(0, 0, 34, 34, seed)} at={at} frames={7} until={until} color={color} />
    <Write text={label} x={0} y={16} size={46} weight={700} anchor="middle" at={at + 0.1} cps={40} until={until} color={color} />
  </Scaled>
);

// An arrow along a gentle curve from a to b, with a drawn head.
export const Arrow = ({from, to, at, bend = 0, frames = 14, until, color = LOOK.chalk, dash, width = 5, seed = 420}: {
  from: [number, number];
  to: [number, number];
  at: number;
  bend?: number;
  frames?: number;
  until?: number;
  color?: string;
  dash?: string;
  width?: number;
  seed?: number;
}) => {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const mx = (x1 + x2) / 2 + nx * bend;
  const my = (y1 + y2) / 2 + ny * bend;
  // Head direction from the last stretch of the curve.
  const ang = Math.atan2(y2 - (my + y2) / 2, x2 - (mx + x2) / 2);
  const h = 22;
  const a1: [number, number] = [x2 - Math.cos(ang - 0.45) * h, y2 - Math.sin(ang - 0.45) * h];
  const a2: [number, number] = [x2 - Math.cos(ang + 0.45) * h, y2 - Math.sin(ang + 0.45) * h];
  return (
    <g>
      <Stroke d={hand([[x1, y1], [mx, my], [x2, y2]], 1.5, seed)} at={at} frames={frames} until={until} color={color} dash={dash} width={width} />
      <Stroke d={hand([a1, [x2, y2], a2], 0.6, seed + 1)} at={at + frames / 30} frames={5} until={until} color={color} width={width} />
    </g>
  );
};

// A strike-through drawn across something that turned out false.
export const Strike = ({x1, y1, x2, y2, at, until, color = LOOK.chalk, seed = 440}: {x1: number; y1: number; x2: number; y2: number; at: number; until?: number; color?: string; seed?: number}) => (
  <Stroke d={line(x1, y1, x2, y2, seed)} at={at} frames={8} until={until} color={color} width={6} />
);

// Diagonal chalk hatching filling a rectangle from left to right (a bar being filled).
export const Hatch = ({x, y, w, h, at, frames = 20, until, color = LOOK.coral, gap = 16, from = 0}: {
  x: number; y: number; w: number; h: number; at: number; frames?: number; until?: number; color?: string; gap?: number; from?: number;
}) => {
  const frame = useCurrentFrame();
  if (frame < sec(at)) return null;
  const p = grow(frame, at, frames);
  const o = until === undefined ? 1 : interpolate(frame, [sec(until), sec(until) + 8], [1, 0], CLAMP);
  if (o <= 0) return null;
  const id = `hatch-${Math.round(x)}-${Math.round(y)}-${Math.round(at * 100)}`;
  const lines = [];
  for (let k = -h; k < w; k += gap) lines.push(<line key={k} x1={x + k} y1={y + h} x2={x + k + h} y2={y} stroke={color} strokeWidth={4} strokeLinecap="round" />);
  return (
    <g opacity={o}>
      <clipPath id={id}>
        <rect x={x + w * from} y={y} width={w * (p * (1 - from))} height={h} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{lines}</g>
    </g>
  );
};

export const Card = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 460}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={box(-300, -185, 600, 370, 30, seed)} at={at} frames={14} until={until} color={color} />
    <Stroke d={box(-230, -80, 90, 66, 10, seed + 1)} at={at + 0.3} frames={8} width={4} until={until} color={color} />
    <Stroke d={line(-120, -47, -140, -47, seed + 2)} at={at + 0.4} frames={4} width={3} until={until} color={color} />
    <Write text="•••• •••• •••• 4021" x={-230} y={60} size={46} at={at + 0.5} cps={50} until={until} color={color} />
    <Write text="CREDIT" x={230} y={-110} size={40} weight={700} anchor="end" at={at + 0.4} until={until} color={color} />
  </Scaled>
);

export const Padlock = ({x, y, at, s = 1, until, color = LOOK.coral, seed = 480}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={hand([[-38, 0], [-38, -50], [-20, -80], [20, -80], [38, -50], [38, 0]], 1.5, seed)} at={at} frames={8} until={until} color={color} width={7} />
    <Stroke d={box(-60, 0, 120, 100, 12, seed + 1)} at={at + 0.15} frames={8} until={until} color={color} width={7} />
    <Stroke d={line(0, 34, 0, 64, seed + 2)} at={at + 0.35} frames={4} until={until} color={color} width={7} />
  </Scaled>
);

// A side-on head facing right, with room for a brain.
export const Head = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 500}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke
      d={hand([[-150, 300], [-170, 160], [-230, 40], [-240, -100], [-180, -240], [-40, -320], [120, -300], [230, -190], [260, -60], [250, 20], [300, 90], [260, 110], [270, 170], [240, 200], [250, 250], [150, 270], [130, 330]], 3, seed)}
      at={at} frames={30} until={until} color={color}
    />
  </Scaled>
);

export const Brain = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 520}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={hand([[-180, 60], [-200, -20], [-160, -100], [-80, -140], [20, -150], [120, -120], [190, -50], [190, 30], [140, 90], [40, 110], [-60, 100], [-140, 100], [-180, 60]], 4, seed)} at={at} frames={20} until={until} color={color} />
    <Stroke d={hand([[-140, -40], [-90, -80], [-40, -40], [10, -90], [60, -40], [120, -70]], 3, seed + 1)} at={at + 0.4} frames={12} width={4} until={until} color={color} />
    <Stroke d={hand([[-120, 40], [-60, 0], [0, 50], [60, 10], [130, 40]], 3, seed + 2)} at={at + 0.55} frames={12} width={4} until={until} color={color} />
    <Stroke d={hand([[0, -150], [-10, -90], [10, -20], [-5, 60]], 3, seed + 3)} at={at + 0.7} frames={10} width={4} until={until} color={color} />
  </Scaled>
);

export const Pill = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 540}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={box(-160, -50, 320, 100, 50, seed)} at={at} frames={10} until={until} color={color} />
    <Stroke d={line(0, -48, 0, 48, seed + 1)} at={at + 0.2} frames={5} until={until} color={color} />
    <Write text="No-Cost EMI" x={0} y={16} size={44} weight={700} anchor="middle" at={at + 0.25} cps={50} until={until} color={color} />
  </Scaled>
);

export const Laptop = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 560}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={box(-90, -70, 180, 120, 8, seed)} at={at} frames={8} until={until} color={color} />
    <Stroke d={hand([[-120, 50], [120, 50], [100, 72], [-100, 72], [-120, 50]], 1, seed + 1)} at={at + 0.2} frames={7} until={until} color={color} />
  </Scaled>
);

export const Headphones = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 580}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={hand([[-70, 30], [-75, -30], [-40, -75], [0, -85], [40, -75], [75, -30], [70, 30]], 1.5, seed)} at={at} frames={9} until={until} color={color} />
    <Stroke d={box(-92, 10, 36, 64, 12, seed + 1)} at={at + 0.2} frames={6} until={until} color={color} />
    <Stroke d={box(56, 10, 36, 64, 12, seed + 2)} at={at + 0.25} frames={6} until={until} color={color} />
  </Scaled>
);

export const Mattress = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 600}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={box(-130, -30, 260, 70, 24, seed)} at={at} frames={9} until={until} color={color} />
    {[-70, 0, 70].map((cx, i) => (
      <Stroke key={i} d={ring(cx, 5, 6, 6, seed + 1 + i)} at={at + 0.2 + i * 0.05} frames={3} width={3} until={until} color={color} />
    ))}
  </Scaled>
);

export const Car = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 620}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={hand([[-150, 30], [-150, -10], [-90, -20], [-50, -70], [60, -70], [100, -20], [150, -10], [150, 30], [-150, 30]], 1.5, seed)} at={at} frames={10} until={until} color={color} />
    <Stroke d={ring(-85, 34, 26, 26, seed + 1)} at={at + 0.2} frames={6} until={until} color={color} />
    <Stroke d={ring(85, 34, 26, 26, seed + 2)} at={at + 0.25} frames={6} until={until} color={color} />
  </Scaled>
);

export const Tv = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 640}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={box(-130, -85, 260, 160, 10, seed)} at={at} frames={9} until={until} color={color} />
    <Stroke d={hand([[-40, 105], [0, 78], [40, 105]], 1, seed + 1)} at={at + 0.2} frames={5} until={until} color={color} />
  </Scaled>
);

export const Wrench = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 660}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={hand([[-90, 90], [30, -30], [30, -60], [55, -90], [85, -88], [62, -62], [72, -40], [96, -48], [92, -20], [60, 0], [-60, 120], [-90, 90]], 1.2, seed)} at={at} frames={14} until={until} color={color} />
  </Scaled>
);

export const Jar = ({x, y, at, s = 1, until, color = LOOK.chalk, seed = 680}: Base) => (
  <Scaled x={x} y={y} s={s}>
    <Stroke d={hand([[-90, -120], [-100, -80], [-100, 130], [-70, 160], [70, 160], [100, 130], [100, -80], [90, -120]], 2, seed)} at={at} frames={14} until={until} color={color} />
    <Stroke d={box(-110, -160, 220, 40, 10, seed + 1)} at={at + 0.3} frames={8} until={until} color={color} />
  </Scaled>
);

// A speech bubble with handwritten words.
export const Bubble = ({x, y, w, h, at, text, size = 54, until, color = LOOK.chalk, seed = 700, tail = "left"}: {
  x: number; y: number; w: number; h: number; at: number; text: string; size?: number; until?: number; color?: string; seed?: number; tail?: "left" | "right";
}) => (
  <g>
    <Stroke d={box(x, y, w, h, h / 2.2, seed)} at={at} frames={12} until={until} color={color} />
    <Stroke d={tail === "left" ? hand([[x + w * 0.2, y + h - 2], [x + w * 0.1, y + h + 50], [x + w * 0.32, y + h - 2]], 1, seed + 1) : hand([[x + w * 0.68, y + h - 2], [x + w * 0.9, y + h + 50], [x + w * 0.8, y + h - 2]], 1, seed + 1)}
      at={at + 0.3} frames={5} until={until} color={color} />
    <Write text={text} x={x + w / 2} y={y + h / 2 + size * 0.32} size={size} anchor="middle" at={at + 0.3} until={until} color={color} />
  </g>
);

// A small dim credit line, bottom-left of a view: the claim tag and its source (STYLE.md).
export const Credit = ({x, y, at, text, until}: {x: number; y: number; at: number; text: string; until?: number}) => (
  <Write text={text} x={x} y={y} size={34} color={LOOK.dim} at={at} cps={80} until={until} />
);
