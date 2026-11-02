import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {GOLD, IVORY, LATIN_FONT, NAVY, NAVY_LIGHT} from "../theme";
import {EmphasisText} from "./Emphasis";

const TILE = 180;
const LINE_STAGGER_FRAMES = 14;

// One eight-pointed star: two overlapping squares, a classic Islamic motif.
const Star = ({x, y}: {x: number; y: number}) => {
  const half = TILE * 0.32;
  const square = `${-half},${-half} ${half},${-half} ${half},${half} ${-half},${half}`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon points={square} />
      <polygon points={square} transform="rotate(45)" />
    </g>
  );
};

export const EndCard = ({lines}: {lines: string[]}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}});
  const drift = interpolate(frame, [0, 300], [0, TILE]);

  const stars = [];
  for (let row = -1; row < 1920 / TILE + 2; row++) {
    for (let column = -1; column < 1080 / TILE + 2; column++) {
      stars.push(<Star key={`${row}-${column}`} x={column * TILE} y={row * TILE} />);
    }
  }

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 55%, ${NAVY_LIGHT} 0%, ${NAVY} 75%)`,
        opacity: enter,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: LATIN_FONT,
      }}
    >
      <svg width={1080} height={1920} style={{position: "absolute", top: 0, left: 0, opacity: 0.12}}>
        <g transform={`translate(0 ${drift})`} fill="none" stroke={GOLD} strokeWidth={2}>
          {stars}
        </g>
      </svg>
      {lines.map((line, index) => {
        const land = spring({
          frame: frame - 8 - index * LINE_STAGGER_FRAMES,
          fps,
          config: {damping: 16, stiffness: 160},
        });
        return (
          <div
            key={line}
            style={{
              fontWeight: 900,
              fontSize: 96,
              lineHeight: 1.2,
              color: IVORY,
              opacity: land,
              transform: `translateY(${(1 - land) * 40}px)`,
            }}
          >
            <EmphasisText text={line} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
