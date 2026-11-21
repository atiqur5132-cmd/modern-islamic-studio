import {loadFont as loadMono} from "@remotion/google-fonts/IBMPlexMono";
import {AbsoluteFill} from "remotion";
import {FONTS} from "../fonts";

const MONO = loadMono("normal", {weights: ["400", "600"], subsets: ["latin"]}).fontFamily;
const BOLD = FONTS.Anton;
const SERIF = FONTS.Newsreader;

// The Rich Rules thumbnails for the No-Cost EMI video (1280×720), round 2 (2026-11-20).
// Research (vidIQ, 1of10, Paddy Galloway): one big focal object, strong contrast, 2–4 bold
// words, a curiosity gap the title does not answer. Faceless by the creator's choice, so the
// hero is a real-looking object with tension in it. Brand: deep green; no channel name on the thumbnail (YouTube shows it under every thumbnail);
// yellow for the hook word, red for the cost.
const C = {
  green: "#0c2419",
  greenLit: "#1f5a40",
  gold: "#d8b052",
  yellow: "#ffd23f",
  red: "#ff4d3d",
  white: "#ffffff",
  ink: "#111",
};

export type ThumbProps = {variant: "trap" | "tag" | "receipt" | "split"};

const Mark = () => (
  <g>
    <path d="M44,36 L28,36 L28,92 L44,92" stroke={C.gold} strokeWidth={6} fill="none" />
    <text x={56} y={76} fontFamily={SERIF} fontSize={32} fill={C.gold}>The Rich Rules</text>
  </g>
);

// Spotlit ground: a lit centre fading to deep green, plus a soft vignette.
const Ground = ({cx = 840, cy = 360}: {cx?: number; cy?: number}) => (
  <g>
    <defs>
      <radialGradient id="spot" cx={cx / 1280} cy={cy / 720} r="0.75">
        <stop offset="0" stopColor={C.greenLit} />
        <stop offset="0.55" stopColor={C.green} />
        <stop offset="1" stopColor="#06130d" />
      </radialGradient>
    </defs>
    <rect width={1280} height={720} fill="url(#spot)" />
  </g>
);

// A glossy smartphone, front view, with a lit screen.
const PhoneArt = ({x, y, w, rot = 0, screen}: {x: number; y: number; w: number; rot?: number; screen?: React.ReactNode}) => {
  const h = w * 2.05;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a4f57" />
          <stop offset="0.5" stopColor="#1b1e22" />
          <stop offset="1" stopColor="#3a3e45" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b5cff" />
          <stop offset="1" stopColor="#7b2bff" />
        </linearGradient>
        <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx={0} cy={h / 2 + 18} rx={w * 0.62} ry={22} fill="#000" opacity={0.45} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.16} fill="url(#body)" />
      <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} rx={w * 0.13} fill="url(#glass)" />
      <rect x={-w * 0.13} y={-h / 2 + 22} width={w * 0.26} height={16} rx={8} fill="#0b0b0d" />
      {screen}
      <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} rx={w * 0.13} fill="url(#shine)" />
    </g>
  );
};

// A hanging price tag.
const Tag = ({x, y, rot, text, fill = C.white, ink = C.ink, size = 86, w = 300}: {x: number; y: number; rot: number; text: string; fill?: string; ink?: string; size?: number; w?: number}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d={`M0,0 L60,-60 L${w},-60 L${w},60 L60,60 Z`} fill={fill} stroke="#0003" strokeWidth={3} />
    <circle cx={44} cy={0} r={12} fill={C.green} />
    <text x={(w + 60) / 2} y={size * 0.34} textAnchor="middle" fontFamily={BOLD} fontSize={size} fill={ink}>{text}</text>
  </g>
);

const Headline = ({lines}: {lines: {t: string; c: string; s: number}[]}) => {
  let y = 150;
  return (
    <g>
      {lines.map((l) => {
        y += l.s * 0.95;
        return (
          <text key={l.t} x={60} y={y} fontFamily={BOLD} fontSize={l.s} fill={l.c} stroke="#000" strokeWidth={10} paintOrder="stroke" style={{letterSpacing: 1}}>
            {l.t}
          </text>
        );
      })}
    </g>
  );
};

// 1. The phone as bait on a mousetrap.
const Trap = () => (
  <svg width={1280} height={720}>
    <Ground cx={900} cy={420} />
    {/* Mousetrap: wooden base, spring bar, bait plate. */}
    <g transform="translate(900 560) skewX(-18)">
      <rect x={-330} y={-40} width={660} height={90} rx={10} fill="#b07a3c" />
      <rect x={-330} y={-40} width={660} height={22} rx={8} fill="#cf9a57" />
      <rect x={-330} y={40} width={660} height={14} fill="#6e4720" />
      <path d="M-300,-40 C-300,-200 -120,-230 -40,-60" stroke="#d9dde2" strokeWidth={14} fill="none" strokeLinecap="round" />
      <rect x={-60} y={-52} width={120} height={16} rx={4} fill="#c7ccd2" />
      <circle cx={-300} cy={-40} r={16} fill="#9aa0a6" />
    </g>
    <PhoneArt x={910} y={320} w={190} rot={-6} screen={
      <g>
        <text x={0} y={-40} textAnchor="middle" fontFamily={BOLD} fontSize={62} fill={C.white}>$0</text>
        <text x={0} y={20} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={22} fill={C.white}>No-Cost EMI</text>
      </g>
    } />
    <Headline lines={[{t: "THE $0", c: C.white, s: 150}, {t: "TRAP", c: C.yellow, s: 210}]} />
  </svg>
);

// 2. A "$0" price tag torn open, the real price underneath.
const TornTag = () => (
  <svg width={1280} height={720}>
    <Ground cx={860} cy={360} />
    <g transform="translate(880 360) rotate(-8)">
      <path d="M-320,-150 L-200,-260 L330,-260 L330,260 L-200,260 L-320,150 Z" fill="#000" opacity={0.35} transform="translate(14 18)" />
      {/* Bottom layer: the real price. */}
      <path d="M-320,-150 L-200,-260 L330,-260 L330,260 L-200,260 L-320,150 Z" fill={C.red} />
      <text x={175} y={150} textAnchor="middle" fontFamily={BOLD} fontSize={150} fill={C.white}>$1,223</text>
      {/* Top layer: the "$0" half, torn away along a jagged edge. */}
      <path d="M-320,-150 L-200,-260 L330,-260 L330,-150 L250,-110 L280,-50 L150,-30 L180,20 L40,40 L60,80 L-60,90 L-40,150 L-170,160 L-120,230 L-200,260 L-320,150 Z" fill="#f4efe4" />
      <path d="M330,-150 L250,-110 L280,-50 L150,-30 L180,20 L40,40 L60,80 L-60,90 L-40,150 L-170,160 L-120,230 L-200,260" stroke="#d8cfbf" strokeWidth={10} fill="none" />
      <circle cx={-230} cy={-30} r={22} fill={C.green} />
      <text x={0} y={-80} textAnchor="middle" fontFamily={BOLD} fontSize={150} fill={C.ink}>$0</text>
      <text x={0} y={-25} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={30} fill={C.ink}>NO-COST EMI</text>
    </g>
    <Mark />
    <Headline lines={[{t: "NOT", c: C.white, s: 190}, {t: "FREE", c: C.yellow, s: 230}]} />
  </svg>
);

// 3. A phone printing a receipt that will not stop.
const ReceiptPhone = () => {
  const rows: [string, string][] = [["Discount lost", "$100"], ["Tax on interest", "$18"], ["Processing fee", "$5"], ["Credit locked", "80%"], ["Paycheck", "-40%"]];
  return (
    <svg width={1280} height={720}>
      <Ground cx={900} cy={300} />
      <g transform="translate(900 0) rotate(5)">
        <rect x={-150} y={330} width={300} height={480} fill="#000" opacity={0.3} transform="translate(12 10)" />
        <rect x={-150} y={330} width={300} height={480} fill="#f4efe4" />
        {rows.map(([l, v], i) => (
          <g key={l}>
            <text x={-130} y={455 + i * 56} fontFamily={MONO} fontWeight={600} fontSize={20} fill="#c4302b">{l}</text>
            <text x={130} y={455 + i * 56} textAnchor="end" fontFamily={MONO} fontWeight={600} fontSize={28} fill="#c4302b">{v}</text>
          </g>
        ))}
      </g>
      <PhoneArt x={870} y={220} w={170} rot={5} screen={
        <g>
          <circle cx={0} cy={-60} r={50} fill="#22c55e" />
          <path d="M-22,-60 L-6,-42 L24,-78" stroke={C.white} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x={0} y={30} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={22} fill={C.white}>Approved</text>
          <text x={0} y={70} textAnchor="middle" fontFamily={BOLD} fontSize={46} fill={C.white}>$0 EMI</text>
        </g>
      } />
      <Mark />
      <Headline lines={[{t: "THE HIDDEN", c: C.white, s: 120}, {t: "RECEIPT", c: C.yellow, s: 190}]} />
    </svg>
  );
};

// 4. Split: what they show you vs what you pay.
const Split = () => (
  <svg width={1280} height={720}>
    <rect width={640} height={720} fill="#1d6b45" />
    <rect x={640} width={640} height={720} fill="#7a1712" />
    <defs>
      <radialGradient id="litL" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stopColor="#fff" stopOpacity="0.18" /><stop offset="1" stopColor="#000" stopOpacity="0.35" /></radialGradient>
    </defs>
    <rect width={1280} height={720} fill="url(#litL)" />
    <PhoneArt x={330} y={440} w={150} rot={-8} screen={<text x={0} y={10} textAnchor="middle" fontFamily={BOLD} fontSize={56} fill={C.white}>$0</text>} />
    <PhoneArt x={960} y={440} w={150} rot={8} screen={<text x={0} y={10} textAnchor="middle" fontFamily={BOLD} fontSize={44} fill={C.white}>$1,223</text>} />
    <text x={330} y={215} textAnchor="middle" fontFamily={BOLD} fontSize={110} fill={C.white} stroke="#000" strokeWidth={8} paintOrder="stroke">THEY SAY</text>
    <text x={960} y={215} textAnchor="middle" fontFamily={BOLD} fontSize={110} fill={C.yellow} stroke="#000" strokeWidth={8} paintOrder="stroke">YOU PAY</text>
    <path d="M560,640 C620,600 680,600 740,640" stroke={C.white} strokeWidth={10} fill="none" />
    <path d="M720,620 L745,642 L715,658" stroke={C.white} strokeWidth={10} fill="none" strokeLinejoin="round" />
    <g transform="translate(0 0)"><Mark /></g>
  </svg>
);

export const EmiThumbnail = ({variant}: ThumbProps) => (
  <AbsoluteFill>
    {variant === "trap" ? <Trap /> : variant === "tag" ? <TornTag /> : variant === "receipt" ? <ReceiptPhone /> : <Split />}
  </AbsoluteFill>
);
