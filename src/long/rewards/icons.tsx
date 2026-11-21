import {HOOK, SANS} from "./look";

// Line icons for the 2D layer, all on a 100×100 box, drawn in one stroke weight so they
// read as one family next to the 3D props.

type P = {color?: string; size?: number; stroke?: number};

const Box = ({size = 100, children}: {size?: number; children: React.ReactNode}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{overflow: "visible", fontFamily: SANS}}>
    {children}
  </svg>
);

export const CalendarIcon = ({color = HOOK.ink, size, stroke = 5, label}: P & {label: string}) => (
  <Box size={size}>
    <rect x={10} y={16} width={80} height={76} rx={10} fill="#fbf8f1" stroke={color} strokeWidth={stroke} />
    <rect x={10} y={16} width={80} height={22} rx={10} fill={HOOK.teal} />
    <rect x={10} y={30} width={80} height={8} fill={HOOK.teal} />
    <line x1={30} y1={8} x2={30} y2={24} stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    <line x1={70} y1={8} x2={70} y2={24} stroke={color} strokeWidth={stroke} strokeLinecap="round" />
    <text x={50} y={33} textAnchor="middle" fontSize={13} fontWeight={800} fill="#e8f1ef" letterSpacing={1}>
      {label}
    </text>
  </Box>
);

// A tick drawn on as `k` goes 0 → 1.
export const Tick = ({k, color = HOOK.teal, size}: P & {k: number}) => (
  <Box size={size}>
    <path d="M24 54 L42 72 L78 32" fill="none" stroke={color} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
  </Box>
);

// A ribbon medal; `crack` splits it in two.
export const MedalIcon = ({color = HOOK.ink, size, stroke = 5, crack = 0}: P & {crack?: number}) => (
  <Box size={size}>
    <path d="M34 8 L44 40 M66 8 L56 40" stroke={HOOK.teal} strokeWidth={10} strokeLinecap="round" />
    <g transform={`translate(${-crack * 10} ${crack * 30}) rotate(${-crack * 25} 50 64)`}>
      <path d="M50 40 A24 24 0 0 0 50 88 L54 76 L47 64 L53 52 Z" fill={HOOK.gold} stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
    </g>
    <g transform={`translate(${crack * 10} ${crack * 36}) rotate(${crack * 30} 50 64)`}>
      <path d="M50 40 A24 24 0 0 1 50 88 L54 76 L47 64 L53 52 Z" fill={HOOK.gold} stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
    </g>
  </Box>
);

export const ShieldIcon = ({color = HOOK.ink, size, stroke = 5, crack = 0}: P & {crack?: number}) => (
  <Box size={size}>
    <g transform={`translate(${-crack * 12} ${crack * 34}) rotate(${-crack * 22} 50 50)`}>
      <path d="M50 8 L16 20 L16 48 C16 70 32 84 50 92 L46 68 L54 50 L45 30 Z" fill={HOOK.tealLight} stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
    </g>
    <g transform={`translate(${crack * 12} ${crack * 40}) rotate(${crack * 26} 50 50)`}>
      <path d="M50 8 L84 20 L84 48 C84 70 68 84 50 92 L46 68 L54 50 L45 30 Z" fill={HOOK.tealLight} stroke={color} strokeWidth={stroke} strokeLinejoin="round" />
    </g>
  </Box>
);

export const PlaneIcon = ({color = HOOK.teal, size}: P) => (
  <Box size={size}>
    <path
      d="M50 6 Q56 12 55 40 L92 58 L92 66 L55 56 L54 80 L66 88 L66 94 L50 89 L34 94 L34 88 L46 80 L45 56 L8 66 L8 58 L45 40 Q44 12 50 6 Z"
      fill={color}
    />
  </Box>
);

// A person: head and shoulders.
export const PersonIcon = ({color = HOOK.ink, size, dashed = false}: P & {dashed?: boolean}) => (
  <Box size={size}>
    <circle cx={50} cy={30} r={17} fill={dashed ? "none" : color} stroke={color} strokeWidth={dashed ? 4 : 0} strokeDasharray={dashed ? "7 6" : undefined} />
    <path d="M14 94 C14 66 30 54 50 54 C70 54 86 66 86 94 Z" fill={dashed ? "none" : color} stroke={color} strokeWidth={dashed ? 4 : 0} strokeDasharray={dashed ? "7 6" : undefined} />
  </Box>
);

export const GiftIcon = ({color = HOOK.teal, size}: P) => (
  <Box size={size}>
    <rect x={14} y={40} width={72} height={52} rx={6} fill={color} />
    <rect x={8} y={28} width={84} height={16} rx={5} fill={color} />
    <rect x={45} y={28} width={10} height={64} fill={HOOK.gold} />
    <path d="M50 28 C38 8 22 14 30 26 Z M50 28 C62 8 78 14 70 26 Z" fill="none" stroke={HOOK.gold} strokeWidth={6} strokeLinejoin="round" />
  </Box>
);

export const CoinIcon = ({size, label = "$"}: P & {label?: string}) => (
  <Box size={size}>
    <circle cx={50} cy={50} r={40} fill={HOOK.gold} stroke="#a87a22" strokeWidth={5} />
    <circle cx={50} cy={50} r={30} fill="none" stroke="#a87a22" strokeWidth={3} />
    <text x={50} y={63} textAnchor="middle" fontSize={36} fontWeight={800} fill="#6e4b0f">
      {label}
    </text>
  </Box>
);

export const CashIcon = ({size}: P) => (
  <Box size={size}>
    <rect x={6} y={26} width={88} height={48} rx={6} fill="#cfe0c8" stroke="#3d5a36" strokeWidth={4} />
    <circle cx={50} cy={50} r={13} fill="none" stroke="#3d5a36" strokeWidth={4} />
    <text x={50} y={56} textAnchor="middle" fontSize={16} fontWeight={800} fill="#3d5a36">
      $
    </text>
  </Box>
);

export const DebitIcon = ({size}: P) => (
  <Box size={size}>
    <rect x={6} y={24} width={88} height={54} rx={8} fill="#e8eeed" stroke={HOOK.inkSoft} strokeWidth={4} />
    <rect x={6} y={36} width={88} height={10} fill={HOOK.inkSoft} />
    <rect x={16} y={56} width={30} height={8} rx={3} fill={HOOK.inkSoft} />
  </Box>
);
