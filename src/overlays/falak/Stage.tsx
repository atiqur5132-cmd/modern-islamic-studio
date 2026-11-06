import {ReactNode, useMemo} from "react";
import {AbsoluteFill, random, useCurrentFrame} from "remotion";
import {GOLD, IVORY, LATIN_FONT, NAVY, NAVY_LIGHT, SAFE_AREA} from "../../theme";
import {rise, useLife} from "./common";

const DUST = 70;

const makeDust = () =>
  Array.from({length: DUST}, (_, i) => ({
    x: random(`dx-${i}`) * 1080,
    y: random(`dy-${i}`) * 1920,
    depth: 0.3 + 0.7 * random(`dd-${i}`), // near dust is bigger, brighter, faster
    phase: random(`dp-${i}`) * Math.PI * 2,
  }));

// The space the cinematic graphics live in: not a flat slab but a dark room with
// depth. A pool of warm light where the eye should go, slow dust in the air, a
// deep vignette, and one small label saying what kind of claim is on screen.
export const Stage = ({
  tag,
  light = {x: 540, y: 960},
  children,
}: {
  tag: string;
  light?: {x: number; y: number};
  children: ReactNode;
}) => {
  const frame = useCurrentFrame();
  const life = useLife();
  const dust = useMemo(makeDust, []);
  const label = rise(frame, 8, 14);

  return (
    <AbsoluteFill style={{backgroundColor: NAVY, opacity: life}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 45% at ${light.x}px ${light.y}px, ${NAVY_LIGHT} 0%, ${NAVY} 70%, #050A14 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 38% 16% at ${light.x}px ${light.y}px, ${GOLD}22 0%, transparent 100%)`,
        }}
      />
      <svg width={1080} height={1920} style={{position: "absolute"}}>
        {dust.map((d, i) => {
          const y = (((d.y - frame * 0.9 * d.depth) % 1920) + 1920) % 1920;
          const x = d.x + Math.sin(frame * 0.02 + d.phase) * 14 * d.depth;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={0.8 + 2.2 * d.depth}
              fill={IVORY}
              opacity={0.06 + 0.22 * d.depth * (0.6 + 0.4 * Math.sin(frame * 0.05 + d.phase))}
            />
          );
        })}
      </svg>
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 50%, transparent 55%, #02050Bcc 100%)"}} />
      <div
        style={{
          position: "absolute",
          top: SAFE_AREA.top,
          left: SAFE_AREA.side,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: LATIN_FONT,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 4,
          color: IVORY,
          opacity: 0.85 * label,
          transform: `translateY(${(1 - label) * 10}px)`,
        }}
      >
        <div style={{width: 10, height: 10, borderRadius: 5, backgroundColor: GOLD}} />
        {tag}
      </div>
      {children}
    </AbsoluteFill>
  );
};
