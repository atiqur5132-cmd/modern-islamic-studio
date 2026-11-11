import {CSSProperties, useId} from "react";
import {ACCENT, GROUND, INK, MUTED} from "./look";

// The one drawn form of the reel, in a 600 x 600 box: plainly an illustration (ivory
// line on the dark page, the accent for the Quran's word), never an embryo picture.
// Every part takes a strength 0..1 so a page can cross from one stage to the next.
export type FormState = {
  wall?: number;
  // Only the wall's line, without its shading (for the small steps row).
  bareWall?: boolean;
  drop?: number;
  // The drop pressed flat against the wall.
  cling?: number;
  lump?: number;
  // 0..1: how much of the skeleton has drawn itself.
  bones?: number;
  // 0..1: how far the flesh has been pulled down over the bones.
  cloth?: number;
  // A fine accent ring round a point of the form.
  ring?: {x: number; y: number; r: number; strength: number};
  // Slow breathing on held frames (frames since the page started).
  breathe?: number;
  // The drop's swell, 0..1, and where it is (it drifts to the wall).
  swell?: number;
  dropAt?: [number, number];
  // The lump grows out of the clinging drop.
  lumpScale?: number;
};

const WALL_X = 150;
const STROKE = 5;

const teardrop = (cx: number, cy: number, r: number) =>
  `M ${cx} ${cy - r * 1.75} C ${cx + r * 0.62} ${cy - r * 0.9}, ${cx + r} ${cy - r * 0.25}, ${cx + r} ${cy + r * 0.25}` +
  ` A ${r} ${r} 0 1 1 ${cx - r} ${cy + r * 0.25} C ${cx - r} ${cy - r * 0.25}, ${cx - r * 0.62} ${cy - r * 0.9}, ${cx} ${cy - r * 1.75} Z`;

// A soft irregular lump: a closed curve through points at fixed, uneven radii.
const LUMP_RADII = [1.0, 0.86, 1.08, 0.92, 1.12, 0.84, 1.02, 0.9, 1.1, 0.95];
const lumpPath = (cx: number, cy: number, r: number, breathe: number) => {
  const points = LUMP_RADII.map((k, i) => {
    const a = (i / LUMP_RADII.length) * Math.PI * 2 - Math.PI / 2;
    const wobble = 1 + 0.025 * Math.sin(breathe / 18 + i * 1.7);
    return [cx + Math.cos(a) * r * k * wobble, cy + Math.sin(a) * r * k * 0.92 * wobble];
  });
  // Catmull-Rom through the points, closed.
  const n = points.length;
  let d = `M ${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`;
  }
  return d + " Z";
};

// The curled skeleton (head up and to the right, back to the left).
const cubic = (p: number[][], t: number) => {
  const u = 1 - t;
  return [0, 1].map((k) => u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k]);
};
const SPINE = [
  [292, 268],
  [196, 330],
  [178, 470],
  [262, 520],
];
const SPINE_TAIL = [
  [262, 520],
  [300, 545],
  [330, 548],
  [348, 540],
];
const VERTEBRAE = [
  ...Array.from({length: 13}, (_, i) => cubic(SPINE, i / 12)),
  ...Array.from({length: 4}, (_, i) => cubic(SPINE_TAIL, (i + 1) / 4)),
];
// Ribs leave the spine and curve forward (to the right).
const RIBS = [0.1, 0.19, 0.28, 0.37, 0.46].map((t, i) => {
  const [x, y] = cubic(SPINE, t);
  const reach = 120 - i * 6;
  return `M ${x} ${y} Q ${x + reach * 0.55} ${y - 34} ${x + reach} ${y + 18}`;
});
// Limb bones as polylines: arm (shoulder, elbow, wrist, hand) and leg (hip, knee, ankle, toe).
const LIMBS = [
  [
    [300, 300],
    [398, 352],
    [432, 278],
    [446, 254],
  ],
  [
    [316, 512],
    [452, 462],
    [430, 560],
    [486, 570],
  ],
];
const SKULL = {cx: 372, cy: 170, r: 104};
// Parts in drawing order: skull, jaw, spine, ribs, pelvis, arm, leg.
const BONE_PARTS = 7;

const part = (bones: number, index: number) => Math.max(0, Math.min(1, bones * BONE_PARTS - index));

// The body that the flesh fills: the head and the curled trunk with its limbs.
const BODY =
  "M 270 250 C 176 312, 150 452, 222 522 C 268 570, 392 594, 478 584 C 526 578, 520 528, 482 506" +
  " C 506 474, 500 428, 468 392 C 474 344, 452 296, 400 286 C 360 280, 306 246, 270 250 Z";

export const Form = ({state, size = 480, style}: {state: FormState; size?: number; style?: CSSProperties}) => {
  const s = state;
  const breathe = s.breathe ?? 0;
  const bones = s.bones ?? 0;
  const cloth = s.cloth ?? 0;
  const uid = useId().replace(/:/g, "");
  const lineLength = (t: number) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - t});
  return (
    <svg width={size} height={size} viewBox="0 0 600 600" style={{overflow: "visible", ...style}}>
      <defs>
        {/* The flesh is pulled down from the top with a soft edge. */}
        <linearGradient id={`${uid}fade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset={Math.max(0, cloth * 1.15 - 0.15)} stopColor="#FFFFFF" />
          <stop offset={Math.min(1, cloth * 1.15)} stopColor="#000000" />
        </linearGradient>
        <mask id={`${uid}cloth`} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="600">
          <rect x="0" y="0" width="600" height="600" fill={`url(#${uid}fade)`} />
        </mask>
        {/* The wall has no ends: it fades out above and below the form. */}
        <linearGradient id={`${uid}wallfade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000000" />
          <stop offset="0.3" stopColor="#FFFFFF" />
          <stop offset="0.7" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <mask id={`${uid}wallmask`} maskUnits="userSpaceOnUse" x="-300" y="0" width="1200" height="600">
          <rect x="-300" y="0" width="1200" height="600" fill={`url(#${uid}wallfade)`} />
        </mask>
        <clipPath id={`${uid}wall`}>
          <rect x={WALL_X} y="-200" width="800" height="1000" />
        </clipPath>
      </defs>

      {(s.wall ?? 0) > 0 ? (
        <g opacity={s.wall} mask={`url(#${uid}wallmask)`}>
          <path d={`M ${WALL_X - 260} 0 L ${WALL_X} 0 C ${WALL_X - 18} 150, ${WALL_X + 14} 420, ${WALL_X} 600 L ${WALL_X - 260} 600 Z`} fill={MUTED} opacity={s.bareWall ? 0 : 0.14} />
          <path d={`M ${WALL_X} 0 C ${WALL_X - 18} 150, ${WALL_X + 14} 420, ${WALL_X} 600`} fill="none" stroke={INK} strokeWidth={STROKE} strokeLinecap="round" opacity={0.8} />
        </g>
      ) : null}

      {(s.drop ?? 0) > 0 ? (
        <path
          d={teardrop((s.dropAt ?? [300, 320])[0], (s.dropAt ?? [300, 320])[1], 52 *(1 + 0.12 * (s.swell ?? 0)) * (1 + 0.012 * Math.sin(breathe / 16)))}
          fill={ACCENT}
          fillOpacity={0.9}
          stroke={INK}
          strokeWidth={STROKE}
          opacity={s.drop}
        />
      ) : null}

      {(s.cling ?? 0) > 0 ? (
        // Pressed against the wall: the left side flattens where it touches.
        <g opacity={s.cling} clipPath={`url(#${uid}wall)`}>
          <ellipse cx={WALL_X + 46} cy={300} rx={62} ry={66 * (1 + 0.012 * Math.sin(breathe / 16))} fill={ACCENT} fillOpacity={0.9} stroke={INK} strokeWidth={STROKE} />
        </g>
      ) : null}

      {(s.lump ?? 0) > 0 ? (
        <path d={lumpPath(300, 330, 150 * (s.lumpScale ?? 1), breathe)} fill={ACCENT} fillOpacity={0.88} stroke={INK} strokeWidth={STROKE} opacity={s.lump} />
      ) : null}

      {cloth > 0 ? (
        <g mask={`url(#${uid}cloth)`}>
          <circle cx={SKULL.cx} cy={SKULL.cy} r={SKULL.r + 22} fill={ACCENT} />
          <path d={BODY} fill={ACCENT} />
        </g>
      ) : null}

      {bones > 0 ? (
        // Under the flesh the bones still show faintly, as lines.
        <g fill="none" stroke={INK} strokeWidth={STROKE + 1} strokeLinecap="round" strokeLinejoin="round" opacity={1 - 0.62 * cloth}>
          <path d={`M ${SKULL.cx} ${SKULL.cy - SKULL.r} a ${SKULL.r} ${SKULL.r} 0 1 1 -0.1 0`} {...lineLength(part(bones, 0))} />
          <circle cx={SKULL.cx + 40} cy={SKULL.cy + 8} r={18} opacity={part(bones, 0)} />
          <path d={`M ${SKULL.cx - 66} ${SKULL.cy + 78} Q ${SKULL.cx - 6} ${SKULL.cy + 128} ${SKULL.cx + 60} ${SKULL.cy + 92}`} {...lineLength(part(bones, 1))} />
          {VERTEBRAE.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={9} fill={INK} stroke="none" opacity={part(bones, 2) * VERTEBRAE.length > i ? 1 : 0} />
          ))}
          {RIBS.map((d, i) => (
            <path key={i} d={d} strokeWidth={STROKE - 1} {...lineLength(part(bones, 3))} />
          ))}
          <path d="M 262 498 Q 300 470 338 506" {...lineLength(part(bones, 4))} />
          {LIMBS.map((points, i) => (
            <g key={i} opacity={part(bones, 5 + i) > 0 ? 1 : 0}>
              <path d={`M ${points.map((p) => p.join(" ")).join(" L ")}`} strokeWidth={STROKE + 3} {...lineLength(part(bones, 5 + i))} />
              {points.slice(1, 3).map(([x, y], j) => (
                <circle key={j} cx={x} cy={y} r={9} fill={GROUND} opacity={part(bones, 5 + i) > 0.5 ? 1 : 0} />
              ))}
            </g>
          ))}
        </g>
      ) : null}

      {s.ring && s.ring.strength > 0 ? (
        <circle cx={s.ring.x} cy={s.ring.y} r={s.ring.r * (1.25 - 0.25 * s.ring.strength)} fill="none" stroke={ACCENT} strokeWidth={4} opacity={s.ring.strength} />
      ) : null}
    </svg>
  );
};

// Where the drop touches the wall, in the form's box.
export const CONTACT = {x: WALL_X + 2, y: 300};
