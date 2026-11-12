import {LOOK, SANS} from "./look";

// A slot machine in our own line style: three windows, a lever, a row of bulbs.
// `spin` 0..1 per pull moves the reels; `result` is what lands ("miss" or "win").
const SYMBOLS = ["●", "▲", "■", "◆", "✦"];

export const SlotMachine = ({
  width = 620,
  spin = 0,
  result = "miss",
  lever = 0,
  bulbs = 0,
  gray = false,
}: {
  width?: number;
  spin?: number; // 0 rest, 0..1 spinning, 1 landed
  result?: "miss" | "win" | "blank";
  lever?: number; // 0 up, 1 pulled
  bulbs?: number; // 0..1 flash
  gray?: boolean;
}) => {
  const h = width * 1.05;
  const landed = result === "win" ? ["✦", "✦", "✦"] : result === "blank" ? ["·", "·", "·"] : ["●", "▲", "■"];
  return (
    <div style={{position: "relative", width: width + 120, height: h, filter: gray ? "grayscale(1)" : undefined}}>
      <svg width={width + 120} height={h} viewBox={`0 0 ${width + 120} ${h}`} style={{position: "absolute", inset: 0}}>
        {/* body */}
        <rect x={10} y={h * 0.12} width={width} height={h * 0.84} rx={34} fill={LOOK.ground2} stroke={LOOK.ivory} strokeWidth={4} />
        <path d={`M ${10 + width * 0.12} ${h * 0.12} Q ${10 + width / 2} ${-h * 0.02} ${10 + width * 0.88} ${h * 0.12}`} fill={LOOK.ground2} stroke={LOOK.ivory} strokeWidth={4} />
        {/* bulbs */}
        {Array.from({length: 9}, (_, i) => (
          <circle
            key={i}
            cx={10 + width * (0.14 + i * 0.09)}
            cy={h * 0.2}
            r={9}
            fill={bulbs > 0 && (i + Math.floor(bulbs * 12)) % 2 === 0 ? LOOK.amber : LOOK.line}
          />
        ))}
        {/* windows */}
        {[0, 1, 2].map((k) => (
          <rect key={k} x={10 + width * (0.1 + k * 0.28)} y={h * 0.3} width={width * 0.24} height={h * 0.3} rx={14} fill="#11131a" stroke={LOOK.line} strokeWidth={3} />
        ))}
        {/* tray */}
        <rect x={10 + width * 0.2} y={h * 0.78} width={width * 0.6} height={h * 0.08} rx={10} fill="#11131a" stroke={LOOK.line} strokeWidth={3} />
        {/* lever */}
        <g transform={`rotate(${lever * 70} ${width + 16} ${h * 0.56})`}>
          <path d={`M ${width + 16} ${h * 0.56} L ${width + 16} ${h * 0.24}`} stroke={LOOK.ivory} strokeWidth={8} strokeLinecap="round" />
          <circle cx={width + 16} cy={h * 0.22} r={26} fill={LOOK.amber} />
        </g>
        <rect x={width + 4} y={h * 0.5} width={24} height={h * 0.12} rx={8} fill={LOOK.ivory} />
      </svg>
      {[0, 1, 2].map((k) => {
        const moving = spin > 0 && spin < 1 - k * 0.12;
        const offset = moving ? (spin * 40 + k * 7) % SYMBOLS.length : 0;
        const symbol = moving ? SYMBOLS[Math.floor(offset)] : spin === 0 ? SYMBOLS[k] : landed[k];
        const win = !moving && spin > 0 && result === "win";
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: 10 + width * (0.1 + k * 0.28),
              top: h * 0.3,
              width: width * 0.24,
              height: h * 0.3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: SANS,
              fontSize: width * 0.15,
              color: win ? LOOK.amber : LOOK.ivory,
              filter: moving ? "blur(3px)" : undefined,
              transform: moving ? `translateY(${((spin * 900 + k * 40) % 60) - 30}px)` : undefined,
            }}
          >
            {symbol}
          </div>
        );
      })}
    </div>
  );
};
