import {AbsoluteFill, useCurrentFrame} from "remotion";
import {VerseIcon} from "../../timeline/types";
import {GOLD, IVORY, LATIN_FONT, NAVY} from "../../theme";
import {Cue, rise, useLife} from "./common";

const ICON = 92;
const STROKE = {fill: "none", stroke: GOLD, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round"} as const;

// One line-art family in gold: night sky, daylight, the sun, the moon. Each icon
// draws itself in as it is named.
const Icon = ({icon, draw}: {icon: VerseIcon; draw: number}) => {
  const c = ICON / 2;
  const dash = {strokeDasharray: 400, strokeDashoffset: 400 * (1 - draw)};
  switch (icon) {
    case "night":
      return (
        <svg width={ICON} height={ICON}>
          <path d={`M ${c + 6} ${c - 26} a 26 26 0 1 0 18 36 a 20 20 0 1 1 -18 -36 z`} {...STROKE} {...dash} />
          <path d={`M ${c - 26} ${c - 20} l 0 8 M ${c - 30} ${c - 16} l 8 0`} {...STROKE} strokeWidth={2.5} opacity={draw} />
          <circle cx={c - 16} cy={c + 22} r={2.5} fill={GOLD} opacity={draw} />
        </svg>
      );
    case "day":
      return (
        <svg width={ICON} height={ICON}>
          <line x1={c - 34} x2={c + 34} y1={c + 14} y2={c + 14} {...STROKE} {...dash} />
          <path d={`M ${c - 18} ${c + 14} a 18 18 0 0 1 36 0`} {...STROKE} {...dash} />
          {[-60, -30, 0, 30, 60].map((a) => {
            const r = ((a - 90) * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={c + Math.cos(r) * 25}
                y1={c + 14 + Math.sin(r) * 25}
                x2={c + Math.cos(r) * 33}
                y2={c + 14 + Math.sin(r) * 33}
                {...STROKE}
                opacity={draw}
              />
            );
          })}
        </svg>
      );
    case "sun":
      return (
        <svg width={ICON} height={ICON}>
          <circle cx={c} cy={c} r={14} {...STROKE} {...dash} />
          {Array.from({length: 8}, (_, k) => {
            const a = (k * Math.PI) / 4;
            return (
              <line
                key={k}
                x1={c + Math.cos(a) * 22}
                y1={c + Math.sin(a) * 22}
                x2={c + Math.cos(a) * 32}
                y2={c + Math.sin(a) * 32}
                {...STROKE}
                opacity={draw}
              />
            );
          })}
        </svg>
      );
    case "moon":
      return (
        <svg width={ICON} height={ICON}>
          <circle cx={c} cy={c} r={26} {...STROKE} {...dash} />
          <circle cx={c - 8} cy={c - 6} r={5} {...STROKE} strokeWidth={2} opacity={draw * 0.8} />
          <circle cx={c + 9} cy={c + 9} r={3.5} {...STROKE} strokeWidth={2} opacity={draw * 0.8} />
        </svg>
      );
  }
};

// G2. A glass reference card on the wall left of the speaker; the four signs of
// the Ayah draw themselves in as they are named.
export const VerseTag = ({label, icons, cue}: {label: string; icons: {icon: VerseIcon; at: number}[]; cue: Cue}) => {
  const frame = useCurrentFrame();
  const life = useLife();
  const [name, reference] = [label.split(" ").slice(0, -1).join(" "), label.split(" ").slice(-1)[0]];
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 50,
          width: 262,
          padding: "20px 22px 24px",
          borderLeft: `4px solid ${GOLD}`,
          backgroundColor: `${NAVY}E0`,
          backdropFilter: "blur(16px)",
          boxShadow: `0 20px 50px ${NAVY}66`,
          opacity: life,
          transform: `translateX(${(1 - life) * -36}px)`,
          fontFamily: LATIN_FONT,
        }}
      >
        <div style={{fontWeight: 700, fontSize: 28, letterSpacing: 4, color: IVORY, opacity: 0.85}}>SURAH</div>
        <div style={{fontWeight: 800, fontSize: 40, lineHeight: 1.1, color: IVORY}}>{name}</div>
        <div style={{fontWeight: 900, fontSize: 76, lineHeight: 1.05, color: GOLD, marginTop: 4}}>{reference}</div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18}}>
          {icons.map(({icon, at}) => (
            <div key={icon} style={{opacity: rise(frame, cue(at), 4)}}>
              <Icon icon={icon} draw={rise(frame, cue(at), 14)} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
