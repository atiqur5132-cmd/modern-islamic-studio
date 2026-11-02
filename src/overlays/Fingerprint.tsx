import {useMemo} from "react";
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {GOLD, IVORY, LATIN_FONT} from "../theme";
import {GraphicFrame} from "./GraphicFrame";

const WIDTH = 600;
const HEIGHT = 760;
const CENTER = {x: 300, y: 400};
const RIDGES = 28;
const RIDGE_STAGGER_FRAMES = 1.2;
const RIDGE_DRAW_FRAMES = 22;

// Ridge lines of a loop-pattern fingertip, built from distorted ellipses.
const ridgePaths = () =>
  Array.from({length: RIDGES}, (_, i) => {
    const rx = 22 + i * 10.5;
    const ry = 30 + i * 13;
    const closed = i < 6;
    const [from, to] = closed ? [0, Math.PI * 2] : [Math.PI * 0.62, Math.PI * 2.38];
    const points: string[] = [];
    for (let angle = from; angle <= to + 0.001; angle += Math.PI / 60) {
      const wobble = 1 + 0.035 * Math.sin(3 * angle + i * 0.7) + 0.02 * Math.sin(7 * angle + i * 1.3);
      const x = CENTER.x + rx * wobble * Math.cos(angle);
      const y = CENTER.y + ry * wobble * Math.sin(angle) + (closed ? 0 : i * 1.5);
      points.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return `M ${points.join(" L ")}`;
  });

// Points where ridges end or split, the marks examiners compare.
const MINUTIAE = [
  {x: 228, y: 262, label: "RIDGE ENDING"},
  {x: 392, y: 318, label: "BIFURCATION"},
  {x: 196, y: 470, label: "DOT"},
  {x: 418, y: 520, label: "RIDGE ENDING"},
  {x: 300, y: 610, label: "BIFURCATION"},
];

export const Fingerprint = ({
  mode,
  tag,
  heading,
  fact,
}: {
  mode: "unique" | "scan";
  tag: string;
  heading: string;
  fact: string;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const paths = useMemo(ridgePaths, []);
  const scanning = mode === "scan";
  const factIn = spring({frame: frame - 24, fps, config: {damping: 200}});
  const scanY = interpolate(frame % 50, [0, 50], [80, 720]);

  return (
    <GraphicFrame tag={tag} heading={heading}>
      <div
        style={{
          position: "absolute",
          top: 600,
          left: 70,
          right: 70,
          fontFamily: LATIN_FONT,
          fontWeight: 600,
          fontSize: 36,
          lineHeight: 1.35,
          color: IVORY,
          opacity: factIn * 0.9,
        }}
      >
        {fact}
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{position: "absolute", top: 760, left: 295, width: 490, height: 620}}
      >
        <defs>
          <clipPath id="fingertip">
            <ellipse cx={CENTER.x} cy={CENTER.y + 20} rx={235} ry={330} />
          </clipPath>
          <linearGradient id="scan" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={GOLD} stopOpacity="0" />
            <stop offset="1" stopColor={GOLD} stopOpacity="0.55" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g clipPath="url(#fingertip)" filter="url(#glow)">
          {paths.map((d, i) => {
            const drawn = scanning
              ? 1
              : interpolate(
                  frame,
                  [i * RIDGE_STAGGER_FRAMES, i * RIDGE_STAGGER_FRAMES + RIDGE_DRAW_FRAMES],
                  [0, 1],
                  {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
                );
            return (
              <path
                key={d}
                d={d}
                pathLength={1}
                fill="none"
                stroke={IVORY}
                strokeOpacity={0.85}
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={1}
                strokeDashoffset={1 - drawn}
              />
            );
          })}
          {scanning ? <rect x={0} y={scanY - 90} width={WIDTH} height={90} fill="url(#scan)" /> : null}
        </g>
        {scanning
          ? MINUTIAE.map((point, i) => {
              const show = spring({frame: frame - 10 - i * 9, fps, config: {damping: 12, stiffness: 200}});
              const right = point.x > CENTER.x;
              return (
                <g key={`${point.x}-${point.y}`} opacity={show}>
                  <circle cx={point.x} cy={point.y} r={16 * show} fill="none" stroke={GOLD} strokeWidth={4} />
                  <line
                    x1={point.x + (right ? 16 : -16)}
                    y1={point.y}
                    x2={right ? 560 : 40}
                    y2={point.y}
                    stroke={GOLD}
                    strokeWidth={2}
                  />
                </g>
              );
            })
          : null}
      </svg>
      {scanning ? (
        <div
          style={{
            position: "absolute",
            top: 1350,
            width: "100%",
            textAlign: "center",
            fontFamily: LATIN_FONT,
            fontWeight: 900,
            fontSize: 46,
            letterSpacing: 8,
            color: GOLD,
            opacity: spring({frame: frame - 60, fps, config: {damping: 200}}),
          }}
        >
          PEHCHAAN: MATCH
        </div>
      ) : null}
    </GraphicFrame>
  );
};
