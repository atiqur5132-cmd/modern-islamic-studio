import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {ARABIC_FONT, GOLD, IVORY, NAVY_LIGHT} from "../../theme";
import {falakWord} from "./arabic";
import {Cue, rise, SourceLine} from "./common";
import {Stage} from "./Stage";

const CX = 540;
const CY = 920;
const RING_R = 290;
const WHORL_RX = 230;
const WHORL_RY = 62;
const WHORL_DEPTH = 26;
const MORPH_FRAMES = 30;
const LIGHT = "#FFF4DA";
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// Three rings of light, each a circle turning about its own tilted axis, drawn as
// the ellipse it makes on screen: an armillary sphere, the oldest picture of falak.
const RINGS = [
  {tilt: 0, speed: 0.022, phase: 0.3},
  {tilt: 58, speed: -0.017, phase: 1.4},
  {tilt: -58, speed: 0.013, phase: 2.5},
];

// G6. Falak: any round thing, a round path. The word sits inside turning rings;
// as the spinning wheel's whorl is named, the rings settle into one and become
// a spindle whorl, turning on its spindle with the thread rising off it.
export const Falak = ({
  ayah,
  wordAt,
  roundAt,
  morphAt,
  source,
  cue,
}: {
  ayah: string;
  wordAt: number;
  roundAt: number;
  morphAt: number;
  source: string;
  cue: Cue;
}) => {
  const frame = useCurrentFrame();
  const word = rise(frame, cue(wordAt), 16);
  const round = interpolate(frame, [cue(roundAt), cue(roundAt) + 10, cue(roundAt) + 40], [0, 1, 0.35], clamp);
  const morph = interpolate(frame, [cue(morphAt), cue(morphAt) + MORPH_FRAMES], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const spin = frame * (0.02 + 0.09 * morph); // radians; the whorl turns faster
  const cy = interpolate(morph, [0, 1], [CY, CY + 40]);

  const rings = RINGS.map((ring, k) => {
    const turn = ring.phase + frame * ring.speed;
    // A circle seen edge-on as it turns: its height on screen is |cos| of the turn.
    const open = Math.abs(Math.cos(turn));
    const rx = interpolate(morph, [0, 1], [RING_R, WHORL_RX]);
    const ry = interpolate(morph, [0, 1], [RING_R * (0.12 + 0.88 * open), WHORL_RY]);
    const tilt = interpolate(morph, [0, 1], [ring.tilt, 0]);
    // A bead of light travelling round each ring shows the turning.
    const bead = frame * 0.05 * (k + 1) + ring.phase;
    return {rx, ry, tilt, bead, k};
  });

  return (
    <Stage tag="TAFSIR · INTERPRETATION" light={{x: CX, y: CY}}>
      <SourceLine text={source} top={300} left={70} />
      <svg width={1080} height={1920} style={{position: "absolute", overflow: "visible"}}>
        <defs>
          <filter id="ring-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={9} />
          </filter>
        </defs>

        {/* Below the whorl's face: the spindle's lower end, the rim and sides of the disc. */}
        <g opacity={morph}>
          <line x1={CX} x2={CX} y1={cy} y2={cy + 230} stroke={IVORY} strokeWidth={7} strokeLinecap="round" />
          <ellipse cx={CX} cy={cy + WHORL_DEPTH} rx={WHORL_RX} ry={WHORL_RY} fill={NAVY_LIGHT} stroke={GOLD} strokeWidth={2} opacity={0.9} />
          <rect x={CX - WHORL_RX} y={cy} width={WHORL_RX * 2} height={WHORL_DEPTH} fill={NAVY_LIGHT} opacity={0.9} />
          <line x1={CX - WHORL_RX} x2={CX - WHORL_RX} y1={cy} y2={cy + WHORL_DEPTH} stroke={GOLD} strokeWidth={2} />
          <line x1={CX + WHORL_RX} x2={CX + WHORL_RX} y1={cy} y2={cy + WHORL_DEPTH} stroke={GOLD} strokeWidth={2} />
          <ellipse cx={CX} cy={cy} rx={WHORL_RX} ry={WHORL_RY} fill={NAVY_LIGHT} />
        </g>

        {/* The rings (or, once settled, the whorl's upper rim). */}
        {rings.map(({rx, ry, tilt, bead, k}) => {
          const fade = k === 0 ? 1 : 1 - morph;
          return (
            <g key={k} transform={`rotate(${tilt} ${CX} ${cy})`} opacity={fade * rise(frame, 4 + k * 6, 18)}>
              <ellipse cx={CX} cy={cy} rx={rx} ry={ry} fill="none" stroke={GOLD} strokeWidth={8} filter="url(#ring-glow)" opacity={0.25 + 0.4 * round} />
              <ellipse cx={CX} cy={cy} rx={rx} ry={ry} fill="none" stroke={k === 0 ? LIGHT : GOLD} strokeWidth={k === 0 ? 3 : 2} opacity={0.85} />
              <circle cx={CX + Math.cos(bead) * rx} cy={cy + Math.sin(bead) * ry} r={8} fill={LIGHT} filter="url(#ring-glow)" />
              <circle cx={CX + Math.cos(bead) * rx} cy={cy + Math.sin(bead) * ry} r={4} fill={LIGHT} />
            </g>
          );
        })}
        {/* On the whorl's face: turning marks, the spindle rising, thread wound and drawn off. */}
        <g opacity={morph}>
          {Array.from({length: 12}, (_, k) => {
            const a = spin + (k * Math.PI * 2) / 12;
            return (
              <line
                key={k}
                x1={CX + Math.cos(a) * WHORL_RX * 0.3}
                y1={cy + Math.sin(a) * WHORL_RY * 0.3}
                x2={CX + Math.cos(a) * WHORL_RX * 0.92}
                y2={cy + Math.sin(a) * WHORL_RY * 0.92}
                stroke={GOLD}
                strokeWidth={2}
                opacity={Math.sin(a) > 0 ? 0.9 : 0.35}
              />
            );
          })}
          <line x1={CX} x2={CX} y1={cy - 380} y2={cy} stroke={IVORY} strokeWidth={7} strokeLinecap="round" />
          {Array.from({length: 6}, (_, k) => (
            <ellipse
              key={k}
              cx={CX}
              cy={cy - 60 - k * 20}
              rx={30 - k * 2}
              ry={6}
              fill="none"
              stroke={GOLD}
              strokeWidth={2}
              opacity={0.5 + 0.3 * Math.sin(spin * 3 + k)}
            />
          ))}
          <path
            d={`M ${CX} ${cy - 380} C ${CX - 30} ${cy - 470}, ${CX - 140} ${cy - 470}, ${CX - 230} ${cy - 540}`}
            fill="none"
            stroke={GOLD}
            strokeWidth={2.5}
            strokeDasharray={420}
            strokeDashoffset={420 * (1 - morph)}
          />
        </g>
      </svg>
      <AbsoluteFill style={{pointerEvents: "none"}}>
        <div
          dir="rtl"
          lang="ar"
          style={{
            position: "absolute",
            top: CY - 250,
            left: 0,
            width: 1080,
            textAlign: "center",
            fontFamily: ARABIC_FONT,
            fontSize: 230,
            lineHeight: 1.6,
            color: IVORY,
            textShadow: `0 0 50px ${GOLD}66`,
            opacity: word * (1 - morph),
            filter: `blur(${(1 - word) * 12 + morph * 10}px)`,
            transform: `scale(${0.94 + 0.06 * word - 0.25 * morph})`,
          }}
        >
          {falakWord(ayah)}
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
