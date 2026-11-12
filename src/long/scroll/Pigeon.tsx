import {LOOK, SANS} from "./look";

// A pigeon in profile, drawn as one quiet line figure. `peck` from 0 to 1 tips the head
// down to the key. Facing right.
export const Pigeon = ({size = 220, peck = 0, color = LOOK.ivory, dim = false}: {size?: number; peck?: number; color?: string; dim?: boolean}) => {
  const tilt = peck * 34;
  return (
    <svg width={size} height={size * 0.86} viewBox="0 0 200 172" style={{opacity: dim ? 0.35 : 1, overflow: "visible"}}>
      <g fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round">
        {/* tail */}
        <path d="M22 96 L2 112 L30 112" />
        {/* body */}
        <path d="M28 104 C40 70 80 58 118 66 C140 70 150 86 146 104 C140 128 108 138 74 134 C50 130 34 120 28 104 Z" fill={LOOK.ground2} />
        {/* wing */}
        <path d="M58 92 C78 80 104 80 122 92 C104 104 80 108 58 92 Z" />
        {/* legs */}
        <path d="M86 134 L82 156 M82 156 L72 160 M82 156 L92 160" />
        <path d="M106 132 L108 156 M108 156 L98 160 M108 156 L118 160" />
        {/* neck and head, pivoting at the neck */}
        <g transform={`rotate(${tilt} 132 70)`}>
          <path d="M120 70 C122 52 130 40 144 38 C160 36 170 48 168 60 C166 72 154 76 144 76" fill={LOOK.ground2} />
          <path d="M166 52 L184 58 L166 62" fill={color} />
          <circle cx={152} cy={52} r={3.5} fill={color} stroke="none" />
        </g>
      </g>
    </svg>
  );
};

// The box: a line drawing of a Skinner box, with a lit key on the right wall and a
// grain cup below it. The pigeon stands inside.
export const SkinnerBox = ({
  width = 520,
  peck = 0,
  grains = 0,
  lit = true,
  accent = false,
  dim = false,
  label,
}: {
  width?: number;
  peck?: number;
  grains?: number; // 0..1 progress of a grain falling, or 0 for none
  lit?: boolean;
  accent?: boolean;
  dim?: boolean;
  label?: string;
}) => {
  const h = width * 0.72;
  const stroke = accent ? LOOK.amber : LOOK.ivory;
  return (
    <div style={{position: "relative", width, height: h, opacity: dim ? 0.4 : 1}}>
      <svg width={width} height={h} viewBox="0 0 520 374" style={{position: "absolute", inset: 0}}>
        <rect x={6} y={6} width={508} height={362} rx={6} fill={LOOK.ground2} stroke={stroke} strokeWidth={4} />
        {/* key */}
        <circle cx={470} cy={150} r={20} fill={lit ? LOOK.amber : LOOK.line} opacity={lit ? 0.9 : 1} />
        {/* grain chute and cup */}
        <path d="M470 30 L470 240" stroke={LOOK.line} strokeWidth={4} strokeDasharray="10 8" />
        <path d="M440 270 L500 270 L490 296 L450 296 Z" fill="none" stroke={stroke} strokeWidth={4} />
        {grains > 0 && grains < 1 && <circle cx={470} cy={40 + grains * 236} r={8} fill={LOOK.amber} />}
        {grains >= 1 && <circle cx={470} cy={278} r={8} fill={LOOK.amber} />}
        <path d="M6 340 L514 340" stroke={LOOK.line} strokeWidth={3} />
      </svg>
      <div style={{position: "absolute", left: width * 0.38, top: h * 0.4}}>
        <Pigeon size={width * 0.36} peck={peck} dim={false} />
      </div>
      {label && (
        <div style={{position: "absolute", left: 0, right: 0, top: h + 22, textAlign: "center", color: accent ? LOOK.amber : LOOK.ivory, fontSize: 36, fontWeight: 700, fontFamily: SANS}}>
          {label}
        </div>
      )}
    </div>
  );
};
