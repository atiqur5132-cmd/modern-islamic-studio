import {useThree} from "@react-three/fiber";
import {ThreeCanvas} from "@remotion/three";
import {useMemo} from "react";
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {AdditiveBlending} from "three";
import {GOLD, NAVY, NAVY_LIGHT} from "../theme";

// Quran 75:3, "Does man think We will not assemble his bones?": the bones of a
// hand fly in from scattered places and join, wrist first, fingertips last.

type Bone = {x: number; y: number; angle: number; length: number; radius: number};

const BONE_GAP = 0.12;
const BONE_STAGGER_FRAMES = 1.6;
const FIRST_BONE_FRAME = 6;
const SCATTER = 7;
const DUST = 420;
const SHAFT_SHARE = 0.72;
const KNOB_SHARE = 1.2;
const HAND_LIFT = 1.9;

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

const buildSkeleton = (): Bone[] => {
  const bones: Bone[] = [
    // Forearm: radius and ulna, running out of frame.
    {x: -0.55, y: -6.4, angle: 0.04, length: 5, radius: 0.3},
    {x: 0.6, y: -6.4, angle: -0.04, length: 5, radius: 0.26},
    ...CARPALS.map(([x, y]) => ({x, y, angle: 0, length: 0.18, radius: 0.27})),
  ];
  for (const finger of FINGERS) {
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
  }
  return bones;
};

const CameraRig = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {camera} = useThree();
  const t = frame / fps;
  camera.position.set(Math.sin(t * 0.45) * 3.2, 1.2 + Math.sin(t * 0.3) * 0.4, 17 - t * 0.9);
  camera.lookAt(0, 0.9, 0);
  return null;
};

const Dust = () => {
  const frame = useCurrentFrame();
  const positions = useMemo(() => {
    const values = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      const speed = 0.006 + random(`dust-speed-${i}`) * 0.012;
      values[i * 3] = (random(`dust-x-${i}`) - 0.5) * 18;
      values[i * 3 + 1] = ((random(`dust-y-${i}`) * 16 + frame * speed) % 16) - 7;
      values[i * 3 + 2] = (random(`dust-z-${i}`) - 0.5) * 12;
    }
    return values;
  }, [frame]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute key={frame} attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        color={GOLD}
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
};

const AssembledBone = ({bone, index}: {bone: Bone; index: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lands = FIRST_BONE_FRAME + index * BONE_STAGGER_FRAMES;
  const progress = spring({frame: frame - lands, fps, config: {damping: 15, mass: 0.9, stiffness: 90}});
  const flash = Math.exp(-Math.max(0, frame - lands - 18) / 6) * (progress > 0.95 ? 1 : 0);

  const from = {
    x: bone.x + (random(`bone-x-${index}`) - 0.5) * SCATTER * 2,
    y: bone.y + (random(`bone-y-${index}`) - 0.3) * SCATTER * 1.6,
    z: (random(`bone-z-${index}`) - 0.6) * SCATTER * 1.4,
    rx: (random(`bone-rx-${index}`) - 0.5) * 6,
    ry: (random(`bone-ry-${index}`) - 0.5) * 6,
    rz: (random(`bone-rz-${index}`) - 0.5) * 6,
  };
  const mix = (start: number, end: number) => start + (end - start) * progress;
  const boneMaterial = (
    <meshStandardMaterial
      color="#EBDDBB"
      roughness={0.38}
      metalness={0.25}
      emissive={GOLD}
      emissiveIntensity={0.08 + flash * 1.4}
    />
  );

  return (
    <group
      position={[mix(from.x, bone.x), mix(from.y, bone.y), mix(from.z, 0)]}
      rotation={[mix(from.rx, 0), mix(from.ry, 0), mix(from.rz, bone.angle)]}
    >
      {/* A narrow shaft with a rounded knob at each end, the shape of a real bone. */}
      <mesh>
        <capsuleGeometry args={[bone.radius * SHAFT_SHARE, bone.length, 8, 20]} />
        {boneMaterial}
      </mesh>
      {[-1, 1].map((end) => (
        <mesh key={end} position={[0, (end * bone.length) / 2, 0]} scale={[1.15, 0.85, 1]}>
          <sphereGeometry args={[bone.radius * KNOB_SHARE, 20, 14]} />
          {boneMaterial}
        </mesh>
      ))}
      <mesh scale={1.08}>
        <capsuleGeometry args={[bone.radius * SHAFT_SHARE, bone.length, 4, 10]} />
        <meshBasicMaterial color={GOLD} wireframe transparent opacity={0.2 + flash * 0.5} />
      </mesh>
    </group>
  );
};

export const BonesScene = () => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const bones = useMemo(buildSkeleton, []);
  const sweep = interpolate(frame, [0, durationInFrames], [-6, 6]);

  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, ${NAVY_LIGHT} 0%, ${NAVY} 72%)`}}>
      <ThreeCanvas width={width} height={height} gl={{alpha: true, antialias: true}}>
        <CameraRig />
        <fog attach="fog" args={[NAVY, 14, 30]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[-6, 8, 10]} intensity={1.6} color="#FFF1D6" />
        <pointLight position={[sweep, 3, 4]} intensity={40} distance={14} color={GOLD} />
        <pointLight position={[0, 2, -6]} intensity={30} distance={16} color="#5C7CFF" />
        <group position={[0, HAND_LIFT, 0]}>
          {bones.map((bone, index) => (
            <AssembledBone key={`${bone.x}-${bone.y}`} bone={bone} index={index} />
          ))}
        </group>
        <Dust />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
