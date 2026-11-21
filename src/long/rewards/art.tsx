import React from "react";
import {SANS} from "./look";

// Flat object icons for the chapters, drawn on a 100×100 box: one rounded, filled style, an
// `a` (accent) and an `ink` colour from the chapter palette, a pale `s` fill for bodies.

export type Art = {size?: number; a: string; ink: string; s?: string};

const Box = ({size = 100, children, w = 100, h = 100}: {size?: number; children: React.ReactNode; w?: number; h?: number}) => (
  <svg width={size * (w / 100)} height={size * (h / 100)} viewBox={`0 0 ${w} ${h}`} style={{overflow: "visible", fontFamily: SANS}}>
    {children}
  </svg>
);

export const Coffee = ({size, a, ink, s = "#fff"}: Art) => (
  <Box size={size}>
    <path d="M22 34 H72 L66 88 Q64 94 58 94 H36 Q30 94 28 88 Z" fill={s} stroke={ink} strokeWidth={4} />
    <rect x={18} y={26} width={58} height={10} rx={4} fill={ink} />
    <rect x={26} y={52} width={42} height={18} fill={a} />
    <path d="M72 46 Q90 46 86 62 Q83 72 68 70" fill="none" stroke={ink} strokeWidth={5} />
    <path d="M38 8 Q34 14 40 20 M52 6 Q48 12 54 18" stroke={ink} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={0.6} />
  </Box>
);

export const Cart = ({size, a, ink}: Art) => (
  <Box size={size}>
    <path d="M6 18 H20 L32 66 H80 L90 32 H26" fill="none" stroke={ink} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
    <rect x={34} y={36} width={16} height={22} rx={3} fill={a} />
    <rect x={54} y={30} width={14} height={28} rx={3} fill={a} opacity={0.7} />
    <circle cx={38} cy={82} r={8} fill={ink} />
    <circle cx={74} cy={82} r={8} fill={ink} />
  </Box>
);

export const Laptop = ({size, a, ink, s = "#fff"}: Art) => (
  <Box size={size}>
    <rect x={16} y={18} width={68} height={48} rx={5} fill={s} stroke={ink} strokeWidth={5} />
    <rect x={26} y={28} width={30} height={6} rx={2} fill={a} />
    <rect x={26} y={40} width={48} height={4} rx={2} fill={ink} opacity={0.25} />
    <rect x={56} y={50} width={18} height={9} rx={3} fill={a} />
    <path d="M4 72 H96 L90 82 H10 Z" fill={ink} />
  </Box>
);

// Card terminal; `ripple` 0..1 shows the contactless tap.
export const Terminal = ({size, a, ink, s = "#fff", ripple = 0}: Art & {ripple?: number}) => (
  <Box size={size}>
    <rect x={24} y={14} width={52} height={80} rx={9} fill={ink} />
    <rect x={31} y={22} width={38} height={26} rx={4} fill={s} />
    <text x={50} y={40} textAnchor="middle" fontSize={11} fontWeight={800} fill={ink}>$4.80</text>
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={33 + c * 12} y={56 + r * 11} width={9} height={7} rx={2} fill={s} opacity={0.75} />))}
    {ripple > 0
      ? [0, 1, 2].map((i) => (
          <path key={i} d={`M ${84 + i * 8} 26 A ${14 + i * 8} ${14 + i * 8} 0 0 1 ${84 + i * 8} 52`} fill="none" stroke={a} strokeWidth={4} strokeLinecap="round" opacity={Math.max(0, Math.min(1, ripple * 3 - i))} />
        ))
      : null}
  </Box>
);

export const Store = ({size, a, ink, s = "#fff"}: Art) => (
  <Box size={size}>
    <rect x={14} y={40} width={72} height={52} fill={s} stroke={ink} strokeWidth={4} />
    <path d="M8 40 L16 16 H84 L92 40 Z" fill={a} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M ${8 + i * 21} 40 q 10.5 12 21 0`} fill={i % 2 ? s : a} stroke={ink} strokeWidth={3} />
    ))}
    <rect x={24} y={58} width={22} height={34} fill={ink} opacity={0.85} />
    <rect x={54} y={58} width={24} height={18} fill={a} opacity={0.5} stroke={ink} strokeWidth={3} />
  </Box>
);

export const Bank = ({size, a, ink, s = "#fff"}: Art) => (
  <Box size={size}>
    <path d="M10 34 L50 10 L90 34 Z" fill={a} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    {[22, 40, 58, 76].map((x) => (
      <rect key={x} x={x - 5} y={38} width={10} height={40} fill={s} stroke={ink} strokeWidth={3.5} />
    ))}
    <rect x={8} y={80} width={84} height={10} rx={2} fill={ink} />
  </Box>
);

export const Network = ({size, a, ink}: Art) => (
  <Box size={size}>
    {[
      [50, 50, 20, 22],
      [50, 50, 82, 24],
      [50, 50, 18, 78],
      [50, 50, 84, 76],
      [20, 22, 82, 24],
      [18, 78, 84, 76],
    ].map(([x1, y1, x2, y2], i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth={4} opacity={0.5} />
    ))}
    <circle cx={50} cy={50} r={16} fill={a} stroke={ink} strokeWidth={4} />
    {[
      [20, 22],
      [82, 24],
      [18, 78],
      [84, 76],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={9} fill={ink} />
    ))}
  </Box>
);

export const Product = ({size, a, ink, s = "#fff", kind}: Art & {kind: "box" | "bottle" | "can" | "bread" | "jar"}) => (
  <Box size={size}>
    {kind === "box" ? (
      <>
        <rect x={22} y={10} width={56} height={84} rx={4} fill={a} stroke={ink} strokeWidth={4} />
        <circle cx={50} cy={44} r={14} fill={s} />
        <rect x={30} y={70} width={40} height={8} rx={3} fill={s} opacity={0.8} />
      </>
    ) : kind === "bottle" ? (
      <>
        <path d="M42 6 H58 V24 Q72 32 72 46 V88 Q72 94 66 94 H34 Q28 94 28 88 V46 Q28 32 42 24 Z" fill={s} stroke={ink} strokeWidth={4} />
        <rect x={28} y={52} width={44} height={22} fill={a} />
      </>
    ) : kind === "can" ? (
      <>
        <rect x={26} y={18} width={48} height={76} rx={8} fill={a} stroke={ink} strokeWidth={4} />
        <rect x={26} y={44} width={48} height={20} fill={s} opacity={0.85} />
      </>
    ) : kind === "bread" ? (
      <>
        <path d="M10 60 Q10 30 50 30 Q90 30 90 60 V86 H10 Z" fill="#e3b77a" stroke={ink} strokeWidth={4} />
        <path d="M34 42 L40 56 M50 40 L54 56 M66 42 L68 56" stroke={ink} strokeWidth={3} opacity={0.5} />
      </>
    ) : (
      <>
        <rect x={24} y={14} width={52} height={14} rx={4} fill={ink} />
        <rect x={20} y={28} width={60} height={66} rx={10} fill={s} stroke={ink} strokeWidth={4} />
        <rect x={20} y={46} width={60} height={26} fill={a} />
      </>
    )}
  </Box>
);

// A swing price tag; `text` printed on it.
export const PriceTag = ({size = 140, a, ink, s = "#fff", text, hot = false}: Art & {text: string; hot?: boolean}) => (
  <Box size={size} w={150} h={80}>
    <path d="M30 6 H140 Q146 6 146 12 V68 Q146 74 140 74 H30 L6 40 Z" fill={hot ? a : s} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={26} cy={40} r={6} fill="none" stroke={ink} strokeWidth={3.5} />
    <text x={88} y={52} textAnchor="middle" fontSize={34} fontWeight={800} fill={hot ? s : ink}>
      {text}
    </text>
  </Box>
);

// A flat credit card, tilted by its holder.
export const Card2D = ({size = 160, a, ink, s = "#fff", metal = false}: Art & {metal?: boolean}) => (
  <Box size={size} w={160} h={100}>
    <defs>
      <linearGradient id="c2dmetal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#3a5654" />
        <stop offset="1" stopColor="#111f20" />
      </linearGradient>
    </defs>
    <rect x={2} y={2} width={156} height={96} rx={12} fill={metal ? "url(#c2dmetal)" : a} stroke={ink} strokeWidth={metal ? 0 : 3} />
    <rect x={20} y={34} width={28} height={22} rx={4} fill="#e2b85c" />
    <rect x={20} y={70} width={70} height={7} rx={3} fill={s} opacity={0.7} />
    <circle cx={128} cy={78} r={9} fill={s} opacity={0.5} />
    <circle cx={140} cy={78} r={9} fill={s} opacity={0.35} />
  </Box>
);

export const Bill = ({size = 170, ink, value = "20"}: Art & {value?: string}) => (
  <Box size={size} w={170} h={86}>
    <rect x={2} y={2} width={166} height={82} rx={8} fill="#cfe0c8" stroke="#3d5a36" strokeWidth={4} />
    <rect x={12} y={12} width={146} height={62} rx={5} fill="none" stroke="#3d5a36" strokeWidth={2} opacity={0.6} />
    <circle cx={85} cy={43} r={20} fill="none" stroke="#3d5a36" strokeWidth={3.5} />
    <text x={85} y={52} textAnchor="middle" fontSize={24} fontWeight={800} fill="#3d5a36">$</text>
    <text x={30} y={36} textAnchor="middle" fontSize={20} fontWeight={800} fill="#3d5a36">{value}</text>
    <text x={140} y={70} textAnchor="middle" fontSize={20} fontWeight={800} fill="#3d5a36">{value}</text>
    <circle cx={0} cy={0} r={0} fill={ink} />
  </Box>
);

export const Gear = ({size, a, ink}: Art) => (
  <Box size={size}>
    {Array.from({length: 8}).map((_, i) => (
      <rect key={i} x={44} y={4} width={12} height={20} rx={3} fill={a} transform={`rotate(${i * 45} 50 50)`} />
    ))}
    <circle cx={50} cy={50} r={32} fill={a} stroke={ink} strokeWidth={4} />
    <circle cx={50} cy={50} r={12} fill={ink} />
  </Box>
);

// A mousetrap; `snap` 0..1 brings the bar over.
export const Mousetrap = ({size, a, ink, s = "#fff", snap = 0}: Art & {snap?: number}) => (
  <Box size={size}>
    <rect x={8} y={60} width={84} height={22} rx={4} fill="#d9b98a" stroke={ink} strokeWidth={4} />
    <rect x={58} y={52} width={18} height={10} rx={2} fill="#f2d16b" stroke={ink} strokeWidth={3} />
    <g transform={`rotate(${-150 + snap * 150} 30 60)`}>
      <path d="M30 60 L82 60 L82 58 L30 58" stroke={ink} strokeWidth={6} fill="none" strokeLinejoin="round" />
    </g>
    <circle cx={30} cy={60} r={5} fill={ink} />
    {snap > 0.9 ? <path d="M84 40 l6 -8 M90 48 l10 -3 M84 30 l2 -10" stroke={a} strokeWidth={4} strokeLinecap="round" /> : null}
    <rect x={0} y={0} width={0} height={0} fill={s} />
  </Box>
);

export const Medical = ({size, a, ink, s = "#fff"}: Art) => (
  <Box size={size}>
    <rect x={18} y={8} width={64} height={86} rx={6} fill={s} stroke={ink} strokeWidth={4} />
    <rect x={42} y={18} width={16} height={40} rx={3} fill={a} />
    <rect x={30} y={30} width={40} height={16} rx={3} fill={a} />
    <rect x={28} y={66} width={44} height={5} rx={2} fill={ink} opacity={0.3} />
    <rect x={28} y={78} width={30} height={5} rx={2} fill={ink} opacity={0.3} />
  </Box>
);

export const Car = ({size, a, ink, s = "#fff"}: Art) => (
  <Box size={size}>
    <path d="M10 64 V52 Q10 46 16 44 L28 26 Q30 22 36 22 H64 Q70 22 72 26 L84 44 Q90 46 90 52 V64 Z" fill={a} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    <path d="M32 42 L38 30 H62 L68 42 Z" fill={s} opacity={0.85} />
    <circle cx={28} cy={68} r={10} fill={ink} />
    <circle cx={72} cy={68} r={10} fill={ink} />
    <path d="M70 84 L86 94 M80 80 l10 4 l-4 10" stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
  </Box>
);

export const CalendarX = ({size, a, ink, s = "#fff", label = "DUE"}: Art & {label?: string}) => (
  <Box size={size}>
    <rect x={10} y={16} width={80} height={76} rx={10} fill={s} stroke={ink} strokeWidth={5} />
    <rect x={10} y={16} width={80} height={22} rx={10} fill={ink} />
    <text x={50} y={33} textAnchor="middle" fontSize={13} fontWeight={800} fill={s} letterSpacing={1}>{label}</text>
    <path d="M34 50 L66 82 M66 50 L34 82" stroke={a} strokeWidth={9} strokeLinecap="round" />
  </Box>
);

export const Trophy = ({size, a, ink}: Art) => (
  <Box size={size}>
    <path d="M28 10 H72 V36 Q72 60 50 62 Q28 60 28 36 Z" fill={a} stroke={ink} strokeWidth={4} />
    <path d="M28 18 H14 Q12 40 30 44 M72 18 H86 Q88 40 70 44" fill="none" stroke={ink} strokeWidth={4} />
    <rect x={44} y={62} width={12} height={16} fill={a} stroke={ink} strokeWidth={3} />
    <rect x={30} y={78} width={40} height={12} rx={3} fill={ink} />
  </Box>
);

export const Checklist = ({size, a, ink, s = "#fff", k = 1}: Art & {k?: number}) => (
  <Box size={size}>
    <rect x={16} y={8} width={68} height={86} rx={8} fill={s} stroke={ink} strokeWidth={4} />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <path d={`M28 ${32 + i * 22} l6 6 l12 -12`} fill="none" stroke={a} strokeWidth={5} strokeLinecap="round" opacity={k * 3 - i > 0 ? 1 : 0} />
        <rect x={52} y={30 + i * 22} width={22} height={5} rx={2} fill={ink} opacity={0.3} />
      </g>
    ))}
  </Box>
);

export const Flask = ({size, a, ink, s = "#fff"}: Art) => (
  <Box size={size}>
    <path d="M38 8 H62 M42 8 V38 L16 84 Q12 92 22 92 H78 Q88 92 84 84 L58 38 V8" fill={s} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    <path d="M26 70 L74 70 L84 86 Q86 90 80 90 H20 Q14 90 16 86 Z" fill={a} />
    <circle cx={44} cy={78} r={4} fill={s} />
    <circle cx={58} cy={74} r={3} fill={s} />
  </Box>
);

// An auction paddle with a word on it.
export const Paddle = ({size, a, ink, s = "#fff", text}: Art & {text: string}) => (
  <Box size={size}>
    <rect x={44} y={56} width={12} height={42} rx={4} fill={ink} />
    <circle cx={50} cy={34} r={30} fill={a} stroke={ink} strokeWidth={4} />
    <text x={50} y={42} textAnchor="middle" fontSize={20} fontWeight={800} fill={s}>{text}</text>
  </Box>
);

export const Basket = ({size, a, ink, fill = 1}: Art & {fill?: number}) => (
  <Box size={size}>
    {Array.from({length: Math.round(5 * fill)}).map((_, i) => (
      <rect key={i} x={20 + i * 12} y={30 - (i % 2) * 10} width={10} height={26} rx={3} fill={i % 2 ? a : ink} opacity={0.85} />
    ))}
    <path d="M8 44 H92 L82 88 Q80 94 74 94 H26 Q20 94 18 88 Z" fill={a} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
    <path d="M30 56 L34 84 M50 56 V84 M70 56 L66 84" stroke={ink} strokeWidth={3} opacity={0.4} />
  </Box>
);

export const Controller = ({size, a, ink, s = "#fff"}: Art) => (
  <Box size={size}>
    <path d="M24 30 H76 Q94 30 96 56 Q98 82 82 80 Q74 79 68 66 H32 Q26 79 18 80 Q2 82 4 56 Q6 30 24 30 Z" fill={a} stroke={ink} strokeWidth={4} />
    <path d="M26 46 V62 M18 54 H34" stroke={s} strokeWidth={6} strokeLinecap="round" />
    <circle cx={70} cy={48} r={5} fill={s} />
    <circle cx={80} cy={58} r={5} fill={s} />
  </Box>
);

export const Phone = ({size, ink, s = "#fff", children}: Art & {children?: React.ReactNode}) => (
  <div style={{position: "relative", width: (size ?? 100) * 0.56, height: size ?? 100, borderRadius: (size ?? 100) * 0.08, background: ink, padding: (size ?? 100) * 0.025, boxSizing: "border-box"}}>
    <div style={{width: "100%", height: "100%", borderRadius: (size ?? 100) * 0.06, background: s, overflow: "hidden", position: "relative"}}>{children}</div>
  </div>
);

export const Plate = ({size, a, ink, s = "#fff"}: Art) => (
  <Box size={size}>
    <ellipse cx={50} cy={60} rx={44} ry={20} fill={s} stroke={ink} strokeWidth={4} />
    <path d="M26 58 Q50 20 74 58 Z" fill={a} stroke={ink} strokeWidth={3} />
    <rect x={46} y={26} width={8} height={10} rx={3} fill={ink} />
  </Box>
);

export const Headphones = ({size, a, ink}: Art) => (
  <Box size={size}>
    <path d="M16 60 V48 Q16 14 50 14 Q84 14 84 48 V60" fill="none" stroke={ink} strokeWidth={7} />
    <rect x={8} y={54} width={22} height={34} rx={8} fill={a} stroke={ink} strokeWidth={4} />
    <rect x={70} y={54} width={22} height={34} rx={8} fill={a} stroke={ink} strokeWidth={4} />
  </Box>
);

export const Hourglass = ({size, a, ink, s = "#fff", k = 0.5}: Art & {k?: number}) => (
  <Box size={size}>
    <rect x={20} y={6} width={60} height={8} rx={3} fill={ink} />
    <rect x={20} y={86} width={60} height={8} rx={3} fill={ink} />
    <path d="M26 14 H74 Q74 40 54 50 Q74 60 74 86 H26 Q26 60 46 50 Q26 40 26 14 Z" fill={s} stroke={ink} strokeWidth={4} />
    <path d={`M${34 + k * 10} ${22 + k * 18} H${66 - k * 10} Q60 40 50 48 Q40 40 ${34 + k * 10} ${22 + k * 18} Z`} fill={a} />
    <path d={`M30 84 Q50 ${84 - 26 * k} 70 84 Z`} fill={a} />
  </Box>
);

export const Moon = ({size, a, ink}: Art) => (
  <Box size={size}>
    <path d="M62 10 A40 40 0 1 0 90 66 A32 32 0 1 1 62 10 Z" fill={a} stroke={ink} strokeWidth={4} />
    <circle cx={80} cy={20} r={3} fill={ink} />
    <circle cx={88} cy={36} r={2} fill={ink} />
  </Box>
);

// Points coin with a star; `shrink` 0..1 halves its value.
export const PointsCoin = ({size, a, ink, s = "#fff"}: Art) => (
  <Box size={size}>
    <circle cx={50} cy={50} r={42} fill={a} stroke={ink} strokeWidth={4} />
    <circle cx={50} cy={50} r={32} fill="none" stroke={s} strokeWidth={3} opacity={0.6} />
    <path d="M50 28 L56 44 L73 44 L59 54 L64 71 L50 61 L36 71 L41 54 L27 44 L44 44 Z" fill={s} />
  </Box>
);

export const Scissors = ({size, a, ink, open = 0.5}: Art & {open?: number}) => (
  <Box size={size}>
    <g transform={`rotate(${-12 - open * 14} 50 50)`}>
      <path d="M50 50 L96 44" stroke={ink} strokeWidth={6} strokeLinecap="round" />
      <circle cx={22} cy={36} r={13} fill="none" stroke={a} strokeWidth={7} />
      <path d="M32 42 L50 50" stroke={a} strokeWidth={7} />
    </g>
    <g transform={`rotate(${12 + open * 14} 50 50)`}>
      <path d="M50 50 L96 56" stroke={ink} strokeWidth={6} strokeLinecap="round" />
      <circle cx={22} cy={64} r={13} fill="none" stroke={a} strokeWidth={7} />
      <path d="M32 58 L50 50" stroke={a} strokeWidth={7} />
    </g>
    <circle cx={50} cy={50} r={4} fill={ink} />
  </Box>
);

export const Envelope = ({size, a, ink, s = "#fff", label = "CASH"}: Art & {label?: string}) => (
  <Box size={size}>
    <rect x={6} y={24} width={88} height={56} rx={6} fill={s} stroke={ink} strokeWidth={4} />
    <path d="M6 28 L50 58 L94 28" fill="none" stroke={ink} strokeWidth={4} />
    <text x={50} y={76} textAnchor="middle" fontSize={13} fontWeight={800} fill={a}>{label}</text>
  </Box>
);

export const Rulebook = ({size, a, ink, s = "#fff"}: Art) => (
  <Box size={size}>
    <rect x={18} y={8} width={64} height={84} rx={6} fill={a} stroke={ink} strokeWidth={4} />
    <rect x={18} y={8} width={12} height={84} fill={ink} opacity={0.35} />
    <text x={56} y={44} textAnchor="middle" fontSize={13} fontWeight={800} fill={s}>BANK</text>
    <text x={56} y={60} textAnchor="middle" fontSize={13} fontWeight={800} fill={s}>RULES</text>
  </Box>
);

export const Toggle = ({size, a, ink, s = "#fff", on = 0}: Art & {on?: number}) => (
  <Box size={size} w={120} h={60}>
    <rect x={4} y={6} width={112} height={48} rx={24} fill={on > 0.5 ? a : "#cfcfcf"} stroke={ink} strokeWidth={3} />
    <circle cx={30 + on * 60} cy={30} r={19} fill={s} stroke={ink} strokeWidth={3} />
  </Box>
);

export const Clock = ({size, a, ink, s = "#fff", t = 0}: Art & {t?: number}) => (
  <Box size={size}>
    <circle cx={50} cy={50} r={40} fill={s} stroke={ink} strokeWidth={5} />
    <path d={`M50 50 L${50 + 26 * Math.sin(t * 6.283)} ${50 - 26 * Math.cos(t * 6.283)}`} stroke={a} strokeWidth={6} strokeLinecap="round" />
    <path d="M50 50 L50 30" stroke={ink} strokeWidth={6} strokeLinecap="round" />
    <circle cx={50} cy={50} r={5} fill={ink} />
  </Box>
);

export const Target = ({size, a, ink, s = "#fff"}: Art) => (
  <Box size={size}>
    <circle cx={50} cy={50} r={42} fill={a} stroke={ink} strokeWidth={4} />
    <circle cx={50} cy={50} r={28} fill={s} />
    <circle cx={50} cy={50} r={14} fill={a} />
  </Box>
);

export const Chip = ({size, a, ink, s = "#fff"}: Art) => (
  <Box size={size}>
    <circle cx={50} cy={50} r={42} fill={a} stroke={ink} strokeWidth={4} />
    {Array.from({length: 8}).map((_, i) => (
      <rect key={i} x={46} y={8} width={8} height={14} rx={2} fill={s} transform={`rotate(${i * 45} 50 50)`} />
    ))}
    <circle cx={50} cy={50} r={24} fill={s} />
    <text x={50} y={58} textAnchor="middle" fontSize={22} fontWeight={800} fill={ink}>BET</text>
  </Box>
);

export const Lounge = ({size, a, ink}: Art) => (
  <Box size={size}>
    <rect x={20} y={20} width={60} height={34} rx={10} fill={a} stroke={ink} strokeWidth={4} />
    <rect x={8} y={40} width={18} height={34} rx={7} fill={a} stroke={ink} strokeWidth={4} />
    <rect x={74} y={40} width={18} height={34} rx={7} fill={a} stroke={ink} strokeWidth={4} />
    <rect x={24} y={54} width={52} height={20} rx={4} fill={a} stroke={ink} strokeWidth={4} />
    <path d="M16 74 V86 M84 74 V86" stroke={ink} strokeWidth={5} strokeLinecap="round" />
  </Box>
);

export const Cross = ({size = 100, color}: {size?: number; color: string}) => (
  <Box size={size}>
    <path d="M14 14 L86 86 M86 14 L14 86" stroke={color} strokeWidth={12} strokeLinecap="round" />
  </Box>
);

export const Question = ({size = 100, color}: {size?: number; color: string}) => (
  <Box size={size}>
    <text x={50} y={78} textAnchor="middle" fontSize={84} fontWeight={800} fill={color}>?</text>
  </Box>
);
