import {ThreeCanvas} from "@remotion/three";
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {DoubleSide} from "three";
import {useRidgeTexture, RidgePattern} from "../scenes/ridges";
import {GOLD, IVORY, LATIN_FONT} from "../theme";
import {GraphicFrame} from "./GraphicFrame";

const CANVAS_TOP = 700;
const CANVAS_HEIGHT = 820;
const MINUTIAE = 5;
const RECORDS = {columns: 4, rows: 3};
// A record at the edge of the grid, so the scanner pane never hides the match.
const MATCH_RECORD = 3;
const MATCH_LABEL_TOP = 1290;
export const MATCH_FRAME = 70;

const settle = (frame: number, fps: number, delay = 0) =>
  spring({frame: frame - delay, fps, config: {damping: 200}});

// One fingerprint on a pane of glass, with its distinguishing points marked.
const Print = ({
  pattern,
  seed,
  x,
  turn,
  delay,
}: {
  pattern: RidgePattern;
  seed: number;
  x: number;
  turn: number;
  delay: number;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drawn = interpolate(frame - delay, [0, 30], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const ridges = useRidgeTexture(pattern, seed, drawn, IVORY);
  const enter = settle(frame, fps, delay);

  return (
    <group position={[x, 0, 0]} rotation={[0.1, turn + Math.sin(frame / 40 + seed) * 0.15, 0]} scale={enter}>
      <mesh>
        <circleGeometry args={[1.25, 64]} />
        <meshStandardMaterial color="#1B2D52" transparent opacity={0.55} roughness={0.15} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.01]} scale={[0.82, 1.05, 1]}>
        <circleGeometry args={[1.25, 64]} />
        <meshBasicMaterial map={ridges} transparent side={DoubleSide} depthWrite={false} />
      </mesh>
      {Array.from({length: MINUTIAE}, (_, index) => {
        const show = spring({frame: frame - delay - 30 - index * 6, fps, config: {damping: 10, stiffness: 220}});
        const angle = random(`minutia-a-${seed}-${index}`) * Math.PI * 2;
        const distance = 0.25 + random(`minutia-d-${seed}-${index}`) * 0.7;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * distance * 0.82, Math.sin(angle) * distance * 1.05, 0.03]}
            scale={show}
          >
            <ringGeometry args={[0.07, 0.1, 32]} />
            <meshBasicMaterial color={GOLD} transparent opacity={0.95} />
          </mesh>
        );
      })}
    </group>
  );
};

// Two different prints side by side: no two have ever been found the same.
const Comparison = () => (
  <>
    <Print pattern="loop" seed={1.7} x={-1.45} turn={0.35} delay={4} />
    <Print pattern="whorl" seed={4.2} x={1.45} turn={-0.35} delay={12} />
  </>
);

// A print on a scanner pane, swept by a beam and checked against stored records.
const Scan = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sweep = Math.sin(frame / 14) * 1.2;
  const matched = settle(frame, fps, MATCH_FRAME);
  const ridges = useRidgeTexture("loop", 1.7, 1, IVORY);

  return (
    <>
      {Array.from({length: RECORDS.columns * RECORDS.rows}, (_, index) => {
        const column = index % RECORDS.columns;
        const row = Math.floor(index / RECORDS.columns);
        const isMatch = index === MATCH_RECORD;
        return (
          <mesh key={index} position={[(column - 1.5) * 1.15, (row - 1) * 1.4 + 0.2, -3]}>
            <planeGeometry args={[0.95, 1.2]} />
            <meshBasicMaterial
              color={isMatch ? GOLD : "#22375F"}
              transparent
              opacity={isMatch ? 0.25 + 0.75 * matched : 0.6}
            />
          </mesh>
        );
      })}
      <group rotation={[-0.35, 0.25, 0]}>
        <mesh>
          <boxGeometry args={[2.3, 2.9, 0.06]} />
          <meshStandardMaterial color="#9FB6E6" transparent opacity={0.18} roughness={0.05} metalness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.04]} scale={[0.82, 1.05, 1]}>
          <circleGeometry args={[1.15, 64]} />
          <meshBasicMaterial map={ridges} transparent depthWrite={false} />
        </mesh>
        <mesh position={[0, sweep, 0.08]}>
          <boxGeometry args={[2.5, 0.05, 0.02]} />
          <meshBasicMaterial color={GOLD} />
        </mesh>
        <mesh position={[0, sweep - 0.25, 0.07]}>
          <planeGeometry args={[2.5, 0.5]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0.18} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
};

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
  const {fps, width} = useVideoConfig();
  const factIn = settle(frame, fps, 24);
  const scanning = mode === "scan";

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
      <AbsoluteFill style={{top: CANVAS_TOP, height: CANVAS_HEIGHT}}>
        <ThreeCanvas
          width={width}
          height={CANVAS_HEIGHT}
          gl={{alpha: true, antialias: true}}
          camera={{position: [0, 0, 7], fov: 40}}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[-3, 4, 6]} intensity={1.5} />
          <pointLight position={[Math.sin(frame / 20) * 3, 1, 3]} intensity={20} color={GOLD} />
          {scanning ? <Scan /> : <Comparison />}
        </ThreeCanvas>
      </AbsoluteFill>
      {scanning ? (
        <div
          style={{
            position: "absolute",
            top: MATCH_LABEL_TOP,
            width: "100%",
            textAlign: "center",
            fontFamily: LATIN_FONT,
            fontWeight: 900,
            fontSize: 46,
            letterSpacing: 8,
            color: GOLD,
            opacity: settle(frame, fps, MATCH_FRAME),
          }}
        >
          PEHCHAAN: MATCH
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            top: CANVAS_TOP + CANVAS_HEIGHT / 2 - 70,
            width: "100%",
            textAlign: "center",
            fontFamily: LATIN_FONT,
            fontWeight: 900,
            fontSize: 110,
            color: GOLD,
            opacity: settle(frame, fps, 40),
          }}
        >
          ≠
        </div>
      )}
    </GraphicFrame>
  );
};
