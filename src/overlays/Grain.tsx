import {AbsoluteFill, useCurrentFrame} from "remotion";
import {NAVY} from "../theme";

const GRAIN_SEEDS = 8;

// Light film grain that changes every frame, and a soft vignette: the finish
// that keeps flat graphics and phone footage feeling like one piece.
export const Grain = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <svg width="100%" height="100%" style={{position: "absolute", opacity: 0.07, mixBlendMode: "overlay"}}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % GRAIN_SEEDS} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, transparent 55%, ${NAVY}66 100%)`}} />
    </AbsoluteFill>
  );
};
