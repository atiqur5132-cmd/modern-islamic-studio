import {loadFont as loadAnton} from "@remotion/google-fonts/Anton";
import {loadFont as loadArchivoBlack} from "@remotion/google-fonts/ArchivoBlack";
import {loadFont as loadBricolage} from "@remotion/google-fonts/BricolageGrotesque";
import {loadFont as loadInterTight} from "@remotion/google-fonts/InterTight";
import {loadFont as loadLeagueGothic} from "@remotion/google-fonts/LeagueGothic";
import {loadFont as loadMontserrat} from "@remotion/google-fonts/Montserrat";
import {ThreeCanvas} from "@remotion/three";
import {useThree} from "@react-three/fiber";
import {useEffect, useLayoutEffect, useMemo, useState} from "react";
import {AbsoluteFill, continueRender, delayRender} from "remotion";
import * as THREE from "three";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment.js";
import {SANS} from "../long/rewards/look";
import {CARD, faceGeometry, slab} from "../long/rewards/Studio3D";
import {cardFace, coinFace, fontsReady} from "../long/rewards/textures";
import {longReceipt, stampTag} from "../long/rewards/thumbTextures";

// The Rich Rules thumbnail system v2 (2026-11-21), first used for "Deadbeats".
// One photoreal 3D hero object in a dark cinematic studio, lit by a warm key from the upper
// left and a rim light in the video's accent colour from behind; 2–3 huge words on the left
// with no outline (a soft shadow only); one word in the accent. No channel name, no face.
// 1280×720; render with --scale=2 for upload.

const anton = loadAnton("normal", {weights: ["400"], subsets: ["latin"]});
const ANTON = anton.fontFamily;

// Headline faces under trial (free Google fonts, SIL OFL). `scale` evens out their widths.
const FACES = {
  anton: {family: ANTON, weight: 400, scale: 1, spacing: 1},
  interTight: {family: loadInterTight("normal", {weights: ["900"], subsets: ["latin"]}).fontFamily, weight: 900, scale: 0.74, spacing: -4},
  archivoBlack: {family: loadArchivoBlack("normal", {weights: ["400"], subsets: ["latin"]}).fontFamily, weight: 400, scale: 0.68, spacing: -3},
  bricolage: {family: loadBricolage("normal", {weights: ["800"], subsets: ["latin"]}).fontFamily, weight: 800, scale: 0.76, spacing: -4},
  leagueGothic: {family: loadLeagueGothic("normal", {weights: ["400"], subsets: ["latin"]}).fontFamily, weight: 400, scale: 1.18, spacing: 1},
  montserrat: {family: loadMontserrat("normal", {weights: ["900"], subsets: ["latin"]}).fontFamily, weight: 900, scale: 0.66, spacing: -3},
};
export type FaceName = keyof typeof FACES;

export type RewardsThumbProps = {variant: "deadbeat" | "hook" | "receipt"; face?: FaceName};

const LOOK = {
  bg0: "#2a625a",
  bg1: "#0c2321",
  rim: "#2fd3c2",
  key: "#ffe9cf",
  white: "#ffffff",
  yellow: "#ffd23f",
  red: "#ff3b2f",
};

type Tex = {card: THREE.Texture; coin: THREE.Texture; tag: THREE.Texture; receipt: THREE.Texture};
let cached: Tex | null = null;
const useTex = () => {
  const [t, setT] = useState<Tex | null>(cached);
  const [handle] = useState(() => (cached ? null : delayRender("Thumbnail textures")));
  useEffect(() => {
    if (cached) return;
    Promise.all([fontsReady(), anton.waitUntilDone()])
      .then(() => document.fonts.load(`400 100px "${ANTON}"`))
      .then(() => {
        cached = {card: cardFace("gold"), coin: coinFace(), tag: stampTag("DEADBEAT", ANTON), receipt: longReceipt(ANTON, SANS)};
        setT(cached);
      });
  }, []);
  return {t, handle};
};

const Camera = ({pos, target, fov}: {pos: [number, number, number]; target: [number, number, number]; fov: number}) => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.fov = fov;
    c.aspect = 1280 / 720;
    c.position.set(...pos);
    c.lookAt(...target);
    c.updateProjectionMatrix();
  }, [camera, pos, target, fov]);
  return null;
};

const Env = () => {
  const {gl, scene} = useThree();
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.9;
    pmrem.dispose();
  }, [gl, scene]);
  return null;
};

const Release = ({handle}: {handle: number | null}) => {
  const {advance} = useThree();
  useEffect(() => {
    advance(performance.now());
    if (handle !== null) continueRender(handle);
  }, [advance, handle]);
  return null;
};

// The metal card, with its printed face.
const Card = ({t, position, rotation}: {t: Tex; position: [number, number, number]; rotation: [number, number, number]}) => {
  const body = useMemo(() => slab(CARD.w, CARD.h, CARD.d, 0.16), []);
  const face = useMemo(() => faceGeometry(CARD.w - 0.002, CARD.h - 0.002, 0.16), []);
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow geometry={body}>
        <meshPhysicalMaterial color="#b88a34" metalness={1} roughness={0.28} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
      <mesh geometry={face} position={[0, 0, CARD.d / 2 + 0.014]}>
        <meshPhysicalMaterial map={t.card} metalness={0.35} roughness={0.32} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
    </group>
  );
};

const Lights = ({rim = LOOK.rim}: {rim?: string}) => (
  <>
    <ambientLight intensity={0.12} />
    <spotLight castShadow position={[-6, 8, 7]} angle={0.5} penumbra={0.8} intensity={340} color={LOOK.key} shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0004} />
    <spotLight position={[4, 4, -6]} angle={0.6} penumbra={1} intensity={220} color={rim} />
    <spotLight position={[-5, 3, -5]} angle={0.6} penumbra={1} intensity={120} color={rim} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <shadowMaterial opacity={0.55} />
    </mesh>
  </>
);

const DeadbeatScene = ({t}: {t: Tex}) => {
  const tagGeo = useMemo(() => faceGeometry(2.8, 1.52, 0.12), []);
  return (
    <>
      <Camera pos={[0.6, 0.5, 8.4]} target={[1.6, 0.15, 0]} fov={30} />
      <Card t={t} position={[2.75, 0.8, -0.6]} rotation={[0.05, -0.42, 0.06]} />
      <group position={[3.05, -0.55, 0.9]} rotation={[0.02, -0.18, -0.14]}>
        <mesh castShadow geometry={tagGeo}>
          <meshStandardMaterial map={t.tag} roughness={0.85} />
        </mesh>
      </group>
    </>
  );
};

const HookScene = ({t}: {t: Tex}) => (
  <>
    <Camera pos={[0.7, 0.4, 8.8]} target={[1.5, 0.0, 0]} fov={30} />
    <mesh position={[3.05, 4.3, 0]}>
      <cylinderGeometry args={[0.012, 0.012, 6, 8]} />
      <meshStandardMaterial color="#cfd8d6" roughness={0.4} />
    </mesh>
    <group position={[3.05, 1.15, 0]}>
      <mesh castShadow rotation={[0, 0.5, Math.PI * 0.86]}>
        <torusGeometry args={[0.36, 0.055, 16, 48, Math.PI * 1.4]} />
        <meshPhysicalMaterial color="#d7dfdd" metalness={1} roughness={0.15} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.6, 16]} />
        <meshPhysicalMaterial color="#d7dfdd" metalness={1} roughness={0.15} />
      </mesh>
    </group>
    {/* The card hangs from the hook by its corner. */}
    <Card t={t} position={[2.85, -0.25, 0.05]} rotation={[0.08, -0.32, -0.62]} />
    <group position={[4.6, -1.2, 0.7]} rotation={[0.1, -0.5, 0.25]}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.08, 64]} />
        <meshPhysicalMaterial color="#d4a440" metalness={1} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0, 0.042]}>
        <circleGeometry args={[0.395, 64]} />
        <meshPhysicalMaterial map={t.coin} metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  </>
);

const ReceiptScene = ({t}: {t: Tex}) => {
  // The receipt curls: a plane bent along its length.
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(1.25, 3.9, 1, 60);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i);
      const u = (1.95 - y) / 3.9; // 0 top → 1 bottom
      p.setZ(i, Math.pow(u, 2.2) * 1.1);
      p.setY(i, y - Math.pow(u, 3) * 0.3);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <>
      <Camera pos={[0.9, 0.6, 8.6]} target={[1.8, 0.1, 0]} fov={30} />
      <Card t={t} position={[2.3, 0.9, -0.8]} rotation={[0.04, -0.3, 0.1]} />
      <mesh castShadow geometry={geo} position={[3.55, 0.3, 0.3]} rotation={[0.05, -0.28, -0.08]}>
        <meshStandardMaterial map={t.receipt} roughness={0.8} side={THREE.DoubleSide} transparent alphaTest={0.5} />
      </mesh>
    </>
  );
};

const COPY: Record<RewardsThumbProps["variant"], {lines: {text: string; color: string}[]; rim: string}> = {
  deadbeat: {lines: [{text: "BANKS", color: LOOK.white}, {text: "CALL YOU", color: LOOK.white}, {text: "THIS", color: LOOK.yellow}], rim: LOOK.rim},
  hook: {lines: [{text: "FREE", color: LOOK.white}, {text: "MONEY?", color: LOOK.yellow}], rim: LOOK.rim},
  receipt: {lines: [{text: "WHO", color: LOOK.white}, {text: "REALLY", color: LOOK.white}, {text: "PAYS?", color: LOOK.yellow}], rim: LOOK.rim},
};

export const RewardsThumbnail = ({variant, face = "anton"}: RewardsThumbProps) => {
  const F = FACES[face];
  const {t, handle} = useTex();
  const copy = COPY[variant];
  const big = copy.lines.length === 2 ? 190 : 150;
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 85% at 68% 45%, ${LOOK.bg0} 0%, #153a36 50%, ${LOOK.bg1} 100%)`}}>
      <ThreeCanvas width={1280} height={720} shadows gl={{alpha: true, antialias: true}} style={{position: "absolute", inset: 0}} camera={{fov: 30, position: [0, 0, 8]}}>
        <Env />
        <Lights rim={copy.rim} />
        {t ? (
          <>
            {variant === "deadbeat" ? <DeadbeatScene t={t} /> : variant === "hook" ? <HookScene t={t} /> : <ReceiptScene t={t} />}
            <Release handle={handle} />
          </>
        ) : null}
      </ThreeCanvas>
      {/* Words: left 45%, huge, soft shadow, no outline. */}
      <div style={{position: "absolute", left: 56, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0}}>
        {copy.lines.map((l, i) => (
          <div key={i} style={{fontFamily: F.family, fontWeight: F.weight, fontSize: big * F.scale, lineHeight: face === "anton" || face === "leagueGothic" ? 0.98 : 1.0, color: l.color, letterSpacing: F.spacing, textShadow: "0 10px 30px rgba(0,0,0,0.65), 0 2px 4px rgba(0,0,0,0.5)"}}>
            {l.text}
          </div>
        ))}
      </div>
      {/* Grade: a touch of vignette and contrast so it pops in the feed. */}
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 60% 50%, transparent 60%, rgba(0,0,0,0.28) 100%)", pointerEvents: "none"}} />
    </AbsoluteFill>
  );
};
