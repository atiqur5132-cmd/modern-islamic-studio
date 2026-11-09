import {CSSProperties, ReactNode} from "react";
import {Easing, interpolate, useCurrentFrame} from "remotion";
import {CARD, INK, MONO, PAPER, QIBLA, SANS} from "./look";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// The claim-kind label: small spaced capitals after a square.
export const Tag = ({text, color = INK, size = 28, style}: {text: string; color?: string; size?: number; style?: CSSProperties}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 4,
      color,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <div style={{width: size * 0.43, height: size * 0.43, backgroundColor: color}} />
    {text}
  </div>
);

// Lands from 1.12x in 5 frames and holds dead still.
export const land = (frame: number, at: number, from = 1.12, frames = 5) =>
  interpolate(frame, [at, at + frames], [from, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});

// A rubber stamp in ink: slams down from 1.5x in four frames, then holds dead still.
export const Stamp = ({
  text,
  at,
  rotate = -7,
  size = 56,
  color = INK,
  style,
}: {
  text: string;
  at: number;
  rotate?: number;
  size?: number;
  color?: string;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 4], [0, 1], {...CLAMP, easing: Easing.in(Easing.quad)});
  if (frame < at) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        padding: `${size * 0.12}px ${size * 0.3}px`,
        border: `${Math.max(5, size * 0.09)}px solid ${color}`,
        borderRadius: size * 0.14,
        color,
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: 1,
        whiteSpace: "nowrap",
        backgroundColor: "rgba(251,248,242,0.9)",
        opacity: Math.min(1, t * 2),
        transform: `rotate(${rotate}deg) scale(${1.5 - 0.5 * t})`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// A label on a map or picture: ink capitals on a paper chip, or white on ink.
export const Chip = ({
  children,
  dark = false,
  accent = false,
  size = 40,
  style,
}: {
  children: ReactNode;
  dark?: boolean;
  accent?: boolean;
  size?: number;
  style?: CSSProperties;
}) => (
  <div
    style={{
      position: "absolute",
      padding: `${size * 0.18}px ${size * 0.42}px ${size * 0.22}px`,
      borderRadius: size * 0.22,
      fontFamily: SANS,
      fontWeight: 900,
      fontSize: size,
      letterSpacing: size * 0.05,
      lineHeight: 1,
      whiteSpace: "nowrap",
      color: accent || dark ? "#FFFFFF" : INK,
      backgroundColor: accent ? QIBLA : dark ? INK : CARD,
      boxShadow: "0 10px 24px rgba(16,32,58,0.28)",
      ...style,
    }}
  >
    {children}
  </div>
);

// A city pin: a dot with a ring that drops in on `at` (frames), then holds.
export const Pin = ({x, y, at, color = INK, size = 26}: {x: number; y: number; at: number; color?: string; size?: number}) => {
  const frame = useCurrentFrame();
  if (frame < at) {
    return null;
  }
  const t = interpolate(frame, [at, at + 6], [0, 1], {...CLAMP, easing: Easing.out(Easing.back(2))});
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        border: `${size * 0.22}px solid #FFFFFF`,
        boxShadow: "0 4px 14px rgba(0,0,0,0.45)",
        boxSizing: "border-box",
        transform: `scale(${t})`,
      }}
    />
  );
};

// A thick arrow from (x1, y1) to (x2, y2), drawn from its tail over `frames`.
export const Arrow = ({
  x1,
  y1,
  x2,
  y2,
  at,
  frames = 8,
  color = QIBLA,
  width = 16,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  at: number;
  frames?: number;
  color?: string;
  width?: number;
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + frames], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  if (t <= 0) {
    return null;
  }
  const x = x1 + (x2 - x1) * t;
  const y = y1 + (y2 - y1) * t;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = width * 2.6;
  const left = [x - head * Math.cos(angle - 0.5), y - head * Math.sin(angle - 0.5)];
  const right = [x - head * Math.cos(angle + 0.5), y - head * Math.sin(angle + 0.5)];
  const shaftEnd = [x - head * 0.6 * Math.cos(angle), y - head * 0.6 * Math.sin(angle)];
  return (
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <line x1={x1} y1={y1} x2={shaftEnd[0]} y2={shaftEnd[1]} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <polygon points={`${x},${y} ${left[0]},${left[1]} ${right[0]},${right[1]}`} fill={color} strokeLinejoin="round" stroke={color} strokeWidth={4} />
    </svg>
  );
};

// A compass dial: ring, ticks every 10 degrees, N E S W, and a needle at `needle`
// degrees clockwise from north. `ink` sets the ring and letters.
export const Dial = ({
  cx,
  cy,
  r,
  needle,
  ink = INK,
  needleColor = QIBLA,
  face = "transparent",
  showNeedle = true,
}: {
  cx: number;
  cy: number;
  r: number;
  needle: number;
  ink?: string;
  needleColor?: string;
  face?: string;
  showNeedle?: boolean;
}) => {
  const ticks = Array.from({length: 36}, (_, i) => i * 10);
  const point = (deg: number, radius: number) => [cx + radius * Math.sin((deg * Math.PI) / 180), cy - radius * Math.cos((deg * Math.PI) / 180)];
  const tip = point(needle, r * 0.84);
  const tail = point(needle + 180, r * 0.22);
  const side1 = point(needle + 90, r * 0.07);
  const side2 = point(needle - 90, r * 0.07);
  return (
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <circle cx={cx} cy={cy} r={r} fill={face} stroke={ink} strokeWidth={r * 0.035} />
      {ticks.map((deg) => {
        const major = deg % 90 === 0;
        const [x1, y1] = point(deg, r * (major ? 0.8 : 0.88));
        const [x2, y2] = point(deg, r * 0.96);
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth={major ? r * 0.025 : r * 0.012} strokeLinecap="round" />;
      })}
      {(["N", "E", "S", "W"] as const).map((letter, i) => {
        const [x, y] = point(i * 90, r * 0.66);
        return (
          <text key={letter} x={x} y={y} fill={ink} fontFamily={SANS} fontWeight={900} fontSize={r * 0.16} textAnchor="middle" dominantBaseline="central">
            {letter}
          </text>
        );
      })}
      {showNeedle ? (
        <>
          <polygon points={`${tip[0]},${tip[1]} ${side1[0]},${side1[1]} ${tail[0]},${tail[1]} ${side2[0]},${side2[1]}`} fill={needleColor} />
          <circle cx={cx} cy={cy} r={r * 0.06} fill={ink} />
        </>
      ) : null}
    </svg>
  );
};

// A number in the mono face.
export const Num = ({children, size = 64, color = INK, style}: {children: ReactNode; size?: number; color?: string; style?: CSSProperties}) => (
  <span style={{fontFamily: MONO, fontWeight: 700, fontSize: size, color, letterSpacing: -1, ...style}}>{children}</span>
);

export const paperGround: CSSProperties = {backgroundColor: PAPER};
