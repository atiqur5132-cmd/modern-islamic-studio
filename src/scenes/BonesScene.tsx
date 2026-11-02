import {useThree} from "@react-three/fiber";
import {ThreeCanvas} from "@remotion/three";
import {useMemo} from "react";
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {NAVY, NAVY_LIGHT} from "../theme";
import {Bone, BoneShape, buildSkeleton, Dust, HAND_LIFT, SceneLights} from "./skeleton";

// Quran 75:3, "Does man think We will not assemble his bones?": the bones of a
// hand fly in from scattered places and join, wrist first, fingertips last.

const BONE_STAGGER_FRAMES = 1.6;
const FIRST_BONE_FRAME = 6;
const SCATTER = 7;

export const boneLandingFrame = (index: number) => FIRST_BONE_FRAME + index * BONE_STAGGER_FRAMES + 18;

const CameraRig = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {camera} = useThree();
  const t = frame / fps;
  camera.position.set(Math.sin(t * 0.45) * 3.2, 1.2 + Math.sin(t * 0.3) * 0.4, 17 - t * 0.9);
  camera.lookAt(0, 0.9, 0);
  return null;
};

const AssembledBone = ({bone, index}: {bone: Bone; index: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lands = FIRST_BONE_FRAME + index * BONE_STAGGER_FRAMES;
  const progress = spring({frame: frame - lands, fps, config: {damping: 15, mass: 0.9, stiffness: 90}});
  const glow = Math.exp(-Math.max(0, frame - boneLandingFrame(index)) / 6) * (progress > 0.95 ? 1 : 0);

  const from = {
    x: bone.x + (random(`bone-x-${index}`) - 0.5) * SCATTER * 2,
    y: bone.y + (random(`bone-y-${index}`) - 0.3) * SCATTER * 1.6,
    z: (random(`bone-z-${index}`) - 0.6) * SCATTER * 1.4,
    rx: (random(`bone-rx-${index}`) - 0.5) * 6,
    ry: (random(`bone-ry-${index}`) - 0.5) * 6,
    rz: (random(`bone-rz-${index}`) - 0.5) * 6,
  };
  const mix = (start: number, end: number) => start + (end - start) * progress;

  return (
    <group
      position={[mix(from.x, bone.x), mix(from.y, bone.y), mix(from.z, 0)]}
      rotation={[mix(from.rx, 0), mix(from.ry, 0), mix(from.rz, bone.angle)]}
    >
      <BoneShape bone={bone} glow={glow} />
    </group>
  );
};

export const BonesScene = () => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();
  const bones = useMemo(buildSkeleton, []);

  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, ${NAVY_LIGHT} 0%, ${NAVY} 72%)`}}>
      <ThreeCanvas width={width} height={height} gl={{alpha: true, antialias: true}}>
        <CameraRig />
        <fog attach="fog" args={[NAVY, 14, 30]} />
        <SceneLights sweep={interpolate(frame, [0, durationInFrames], [-6, 6])} />
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
