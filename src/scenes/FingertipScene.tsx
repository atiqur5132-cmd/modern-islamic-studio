import {useThree} from "@react-three/fiber";
import {ThreeCanvas} from "@remotion/three";
import {useMemo} from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {DoubleSide} from "three";
import {GOLD, NAVY, NAVY_LIGHT} from "../theme";
import {useRidgeTexture} from "./ridges";
import {BoneShape, buildSkeleton, Dust, HAND_LIFT, indexFingertip, SceneLights} from "./skeleton";

// Quran 75:4, "Yes, We are able to restore even his fingertips": the camera
// flies from the whole hand to the tip of the index finger, where a fingertip
// forms over the bone and its ridges draw themselves from the core outwards.

const FLIGHT = [0, 0.55];
const PAD_FORMS = [0.35, 0.6];
const RIDGES_DRAW = [0.45, 0.92];

const progressOf = (frame: number, duration: number, [from, to]: number[]) =>
  interpolate(frame / duration, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

const CameraFlight = ({tip}: {tip: {x: number; y: number}}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {camera} = useThree();
  const flight = progressOf(frame, durationInFrames, FLIGHT);
  const drift = (frame / durationInFrames) * 0.4;
  const mix = (a: number, b: number) => a + (b - a) * flight;
  camera.position.set(mix(0, tip.x + 0.5 + drift), mix(1.2, tip.y + 0.2), mix(16, 3.1 - drift));
  camera.lookAt(mix(0, tip.x), mix(0.9, tip.y), 0);
  return null;
};

const Fingertip = ({x, y, angle}: {x: number; y: number; angle: number}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const pad = progressOf(frame, durationInFrames, PAD_FORMS);
  const ridges = useRidgeTexture("loop", 1.7, progressOf(frame, durationInFrames, RIDGES_DRAW), "#FFE7B0");

  return (
    <group position={[x, y + 0.08, 0]} rotation={[0, 0, angle]}>
      {/* The soft pad of the fingertip, a translucent gold shell over the bone. */}
      <mesh scale={[1, 1.35, 0.8]}>
        <sphereGeometry args={[0.36, 40, 30]} />
        <meshStandardMaterial
          color="#E3B97A"
          roughness={0.45}
          metalness={0.1}
          transparent
          opacity={0.55 * pad}
          emissive={GOLD}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* The print itself, on the face of the pad turned to the camera. */}
      <mesh position={[0, 0, 0.3]} scale={[0.62, 0.84, 1]}>
        <circleGeometry args={[0.5, 64]} />
        <meshBasicMaterial map={ridges} transparent opacity={pad} side={DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
};

export const FingertipScene = () => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const bones = useMemo(buildSkeleton, []);
  const tip = useMemo(indexFingertip, []);
  const tipInScene = {x: tip.x, y: tip.y + HAND_LIFT};
  const flight = progressOf(frame, durationInFrames, FLIGHT);

  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, ${NAVY_LIGHT} 0%, ${NAVY} 72%)`}}>
      <ThreeCanvas width={width} height={height} gl={{alpha: true, antialias: true}}>
        <CameraFlight tip={tipInScene} />
        {/* Fog follows the camera in, so the hand is clear from far and close. */}
        <fog attach="fog" args={[NAVY, 14 - 11 * flight, 30 - 22 * flight]} />
        <SceneLights sweep={interpolate(frame, [0, durationInFrames], [-4, 4])} />
        <group position={[0, HAND_LIFT, 0]}>
          {bones.map((bone) => (
            <group key={`${bone.x}-${bone.y}`} position={[bone.x, bone.y, 0]} rotation={[0, 0, bone.angle]}>
              <BoneShape bone={bone} glow={0} />
            </group>
          ))}
          <Fingertip x={tip.x} y={tip.y} angle={tip.angle} />
        </group>
        <Dust spread={0.6} size={0.025} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
