import {useMemo} from "react";
import {random, useCurrentFrame} from "remotion";
import {AdditiveBlending, CanvasTexture} from "three";
import {GOLD} from "../theme";

// The stylised hand skeleton shared by the 75:3 and 75:4 scenes, so the hand
// that assembles is the same hand the camera later flies into.

export type Bone = {x: number; y: number; angle: number; length: number; radius: number};

const BONE_GAP = 0.12;
const SHAFT_SHARE = 0.72;
const KNOB_SHARE = 1.2;
const DUST = 420;
export const HAND_LIFT = 1.9;
export const INDEX_FINGER = 1;

// Each finger: where it starts on the palm, how much it leans, and its bone lengths
// from palm outwards (metacarpal, then phalanges).
const FINGERS = [
  {x: -1.5, y: -2.35, angle: 0.8, lengths: [1.5, 1.15, 0.85]},
  {x: -0.95, y: -2.1, angle: 0.13, lengths: [2.6, 1.5, 0.95, 0.7]},
  {x: -0.2, y: -2.0, angle: 0, lengths: [2.75, 1.65, 1.05, 0.75]},
  {x: 0.5, y: -2.05, angle: -0.1, lengths: [2.5, 1.55, 1.0, 0.72]},
  {x: 1.15, y: -2.2, angle: -0.23, lengths: [2.2, 1.25, 0.8, 0.65]},
];

const CARPALS: [number, number][] = [
  [-1.15, -2.75], [-0.45, -2.7], [0.25, -2.72], [0.9, -2.8],
  [-0.95, -3.3], [-0.3, -3.3], [0.35, -3.32], [0.95, -3.35],
];

const fingerBones = (finger: (typeof FINGERS)[number]): Bone[] => {
  const bones: Bone[] = [];
  let x = finger.x;
  let y = finger.y;
  finger.lengths.forEach((length, index) => {
    const angle = finger.angle * (1 + 0.12 * index);
    const dx = -Math.sin(angle);
    const dy = Math.cos(angle);
    bones.push({
      x: x + (dx * length) / 2,
      y: y + (dy * length) / 2,
      angle,
      length: length - BONE_GAP,
      radius: 0.2 - index * 0.025,
    });
    x += dx * length;
    y += dy * length;
  });
  return bones;
};

export const buildSkeleton = (): Bone[] => [
  // Forearm: radius and ulna, running out of frame.
  {x: -0.55, y: -6.4, angle: 0.04, length: 5, radius: 0.3},
  {x: 0.6, y: -6.4, angle: -0.04, length: 5, radius: 0.26},
  ...CARPALS.map(([x, y]) => ({x, y, angle: 0, length: 0.18, radius: 0.27})),
  ...FINGERS.flatMap(fingerBones),
];

// The last bone of the index finger, in the hand's own coordinates.
export const indexFingertip = (): Bone => {
  const bones = fingerBones(FINGERS[INDEX_FINGER]);
  return bones[bones.length - 1];
};

export const BoneShape = ({bone, glow}: {bone: Bone; glow: number}) => {
  const material = (
    <meshStandardMaterial
      color="#EBDDBB"
      roughness={0.38}
      metalness={0.25}
      emissive={GOLD}
      emissiveIntensity={0.08 + glow * 1.4}
    />
  );
  return (
    <>
      {/* A narrow shaft with a rounded knob at each end, the shape of a real bone. */}
      <mesh>
        <capsuleGeometry args={[bone.radius * SHAFT_SHARE, bone.length, 8, 20]} />
        {material}
      </mesh>
      {[-1, 1].map((end) => (
        <mesh key={end} position={[0, (end * bone.length) / 2, 0]} scale={[1.15, 0.85, 1]}>
          <sphereGeometry args={[bone.radius * KNOB_SHARE, 20, 14]} />
          {material}
        </mesh>
      ))}
      <mesh scale={1.08}>
        <capsuleGeometry args={[bone.radius * SHAFT_SHARE, bone.length, 4, 10]} />
        <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.2 + glow * 0.5} />
      </mesh>
    </>
  );
};

// A soft round dot, so dust reads as dust and not as squares up close.
const useDotTexture = () =>
  useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d");
    if (context) {
      const glow = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      glow.addColorStop(0, "rgba(255,255,255,1)");
      glow.addColorStop(0.4, "rgba(255,255,255,0.6)");
      glow.addColorStop(1, "rgba(255,255,255,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, 64, 64);
    }
    return new CanvasTexture(canvas);
  }, []);

export const Dust = ({spread = 1, size = 0.07}: {spread?: number; size?: number}) => {
  const frame = useCurrentFrame();
  const dot = useDotTexture();
  const positions = useMemo(() => {
    const values = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      const speed = 0.006 + random(`dust-speed-${i}`) * 0.012;
      values[i * 3] = (random(`dust-x-${i}`) - 0.5) * 18 * spread;
      values[i * 3 + 1] = ((random(`dust-y-${i}`) * 16 + frame * speed) % 16) - 7;
      values[i * 3 + 2] = (random(`dust-z-${i}`) - 0.5) * 12 * spread;
    }
    return values;
  }, [frame, spread]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute key={frame} attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        map={dot}
        color={GOLD}
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
};

export const SceneLights = ({sweep}: {sweep: number}) => (
  <>
    <ambientLight intensity={0.35} />
    <directionalLight position={[-6, 8, 10]} intensity={1.6} color="#FFF1D6" />
    <pointLight position={[sweep, 3, 4]} intensity={40} distance={14} color={GOLD} />
    <pointLight position={[0, 2, -6]} intensity={30} distance={16} color="#5C7CFF" />
  </>
);
