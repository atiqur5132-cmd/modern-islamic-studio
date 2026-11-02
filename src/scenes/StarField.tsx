import {ThreeCanvas} from "@remotion/three";
import {useMemo} from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {ExtrudeGeometry, Shape} from "three";
import {GOLD} from "../theme";

// A tilted field of raised eight-pointed stars, the classic Islamic motif, with a
// warm light passing over it. Used behind the closing lines.

const COLUMNS = 7;
const ROWS = 12;
const SPACING = 1.25;
const POINTS = 8;

const starShape = () => {
  const shape = new Shape();
  for (let i = 0; i <= POINTS * 2; i++) {
    const radius = i % 2 === 0 ? 0.55 : 0.38;
    const angle = (i / (POINTS * 2)) * Math.PI * 2 + Math.PI / POINTS;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  return new ExtrudeGeometry(shape, {depth: 0.12, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03});
};

export const StarField = () => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const geometry = useMemo(starShape, []);
  const light = interpolate(frame, [0, durationInFrames], [-7, 7]);
  const drift = interpolate(frame, [0, durationInFrames], [0, SPACING]);

  return (
    <AbsoluteFill>
      <ThreeCanvas width={width} height={height} gl={{alpha: true, antialias: true}} camera={{position: [0, 0, 11], fov: 45}}>
        <ambientLight intensity={0.5} />
        <pointLight position={[light, light * 0.6, 3]} intensity={60} distance={16} color={GOLD} />
        <directionalLight position={[2, 4, 8]} intensity={0.4} />
        <group rotation={[-0.55, 0, 0.18]} position={[0, drift, 0]}>
          {Array.from({length: COLUMNS * ROWS}, (_, index) => {
            const column = index % COLUMNS;
            const row = Math.floor(index / COLUMNS);
            return (
              <mesh
                key={index}
                geometry={geometry}
                position={[(column - (COLUMNS - 1) / 2) * SPACING, (row - (ROWS - 1) / 2) * SPACING, 0]}
                rotation={[0, 0, (frame / durationInFrames) * 0.3]}
              >
                {/* Matte enough to catch the light; a mirror finish has nothing to reflect here. */}
                <meshStandardMaterial color="#5A4828" metalness={0.35} roughness={0.45} emissive={GOLD} emissiveIntensity={0.02} />
              </mesh>
            );
          })}
        </group>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
