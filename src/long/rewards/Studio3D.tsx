import {ThreeCanvas} from "@remotion/three";
import {useThree} from "@react-three/fiber";
import {useEffect, useLayoutEffect, useMemo, useState} from "react";
import {continueRender, delayRender} from "remotion";
import * as THREE from "three";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment.js";
import {Cam, V3} from "./camera";
import {H, HOOK, W} from "./look";
import {billFace, boardingFace, cardBack, cardFace, coinFace, fontsReady, passFace, tagFace} from "./textures";

// The bright studio for the "Deadbeats" video: a seamless light ground (only shadows are
// drawn on the floor, so it melts into the page), a glossy metal card as the hero, and the
// props the voice names. Every value comes from `StudioState`, set per frame by the scene.

export type TagName = "unknown" | "deadbeat" | "revolver";
export type Prop = {k: number; pos: V3; rot?: V3; scale?: number};
export type StudioState = {
  cam: Cam;
  card: {pos: V3; rot: V3};
  tag: {k: number; flip: number; front?: TagName; back?: TagName};
  key: {color: string; power: number};
  sweep: number; // a moving rim light across the card, -1 → 1
  sweepPower: number;
  bank: number; // 0 below the floor → 1 standing
  gifts: number[]; // each gift's drop progress 0..1
  giftSink: number; // 0 → 1 the whole pile sinks away
  coin: Prop;
  lounge: Prop;
  hotel: Prop;
  boarding: Prop;
  podium: number;
  hook: {k: number; pos: V3};
  bar: {interest: number; fees: number; pos: V3};
  freeTag: {k: number; flip: number; pos: V3};
  bill: Prop;
};

type Textures = ReturnType<typeof makeTextures>;
const makeTextures = () => ({
  card: cardFace(),
  tags: {
    unknown: tagFace("???", {size: 210}),
    deadbeat: tagFace("DEADBEAT", {ink: HOOK.ink, size: 118}),
    revolver: tagFace("REVOLVER", {ink: HOOK.coral, size: 118}),
  } as Record<TagName, THREE.Texture>,
  cardBack: cardBack(),
  freeFront: tagFace("FREE", {ink: HOOK.ink, size: 190}),
  freeBack: tagFace("FREE", {ink: HOOK.ink, size: 190, strike: true}),
  coin: coinFace(),
  lounge: passFace("lounge", "LOUNGE"),
  hotel: passFace("bed", "SUITE"),
  boarding: boardingFace(),
  bill: billFace(),
});

let cached: Textures | null = null;
const useTextures = () => {
  const [t, setT] = useState<Textures | null>(cached);
  const [handle] = useState(() => (cached ? null : delayRender("Drawing the studio props")));
  useEffect(() => {
    if (cached) return;
    fontsReady().then(() => {
      cached = makeTextures();
      setT(cached);
    });
  }, []);
  return {t, handle};
};

// A rounded rectangle, as a shape centred on 0.
export const rounded = (w: number, h: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

// A flat face with 0..1 UVs over its bounds, so a texture fills it.
export const faceGeometry = (w: number, h: number, r: number) => {
  const g = new THREE.ShapeGeometry(rounded(w, h, r), 12);
  const pos = g.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / w + 0.5;
    uv[i * 2 + 1] = pos.getY(i) / h + 0.5;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
};

export const slab = (w: number, h: number, d: number, r: number) => {
  const g = new THREE.ExtrudeGeometry(rounded(w, h, r), {depth: d, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 3, curveSegments: 12});
  g.translate(0, 0, -d / 2);
  return g;
};

export const CARD = {w: 3.4, h: 2.14, d: 0.06};

const Camera = ({cam}: {cam: Cam}) => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.fov = cam.fov;
    c.aspect = W / H;
    c.near = 0.1;
    c.far = 200;
    c.position.set(...cam.pos);
    c.lookAt(...cam.target);
    c.updateProjectionMatrix();
  }, [camera, cam]);
  return null;
};

// Soft studio reflections for the metal, generated in code (no HDR file).
const Environment = () => {
  const {gl, scene} = useThree();
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.9;
    pmrem.dispose();
  }, [gl, scene]);
  return null;
};

const ReleaseWhenDrawn = ({handle}: {handle: number | null}) => {
  const {advance} = useThree();
  useEffect(() => {
    advance(performance.now());
    if (handle !== null) continueRender(handle);
  }, [advance, handle]);
  return null;
};

const GIFTS: {pos: V3; size: number; color: string; turn: number}[] = [
  {pos: [-2.5, 0, 0.6], size: 0.9, color: HOOK.teal, turn: 0.4},
  {pos: [2.5, 0, 0.9], size: 0.75, color: "#f2f4f3", turn: -0.3},
  {pos: [-1.3, 0, 1.9], size: 0.6, color: "#d9c7a5", turn: 0.9},
  {pos: [1.4, 0, 2.1], size: 0.55, color: HOOK.ink, turn: -0.6},
  {pos: [3.6, 0, -0.9], size: 0.95, color: HOOK.tealLight, turn: 0.2},
  {pos: [-3.7, 0, -0.7], size: 0.7, color: "#f2f4f3", turn: -0.9},
];

const Gift = ({size, color, mats}: {size: number; color: string; mats: {ribbon: THREE.Material}}) => {
  const s = size;
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, s / 2, 0]}>
        <boxGeometry args={[s, s, s]} />
        <meshPhysicalMaterial color={color} roughness={0.42} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
      <mesh castShadow position={[0, s / 2, 0]} material={mats.ribbon}>
        <boxGeometry args={[s * 1.02, s * 1.02, s * 0.16]} />
      </mesh>
      <mesh castShadow position={[0, s / 2, 0]} material={mats.ribbon}>
        <boxGeometry args={[s * 0.16, s * 1.02, s * 1.02]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} castShadow position={[side * s * 0.14, s * 1.08, 0]} rotation={[Math.PI / 2, side * 0.6, 0]} material={mats.ribbon}>
          <torusGeometry args={[s * 0.13, s * 0.04, 10, 24]} />
        </mesh>
      ))}
    </group>
  );
};

// A paper tag hung on a string from `anchor` (local 0,0,0), front and back printed.
export const Tag = ({front, back, flip, swing}: {front: THREE.Texture; back: THREE.Texture; flip: number; swing: number}) => {
  const geo = useMemo(() => faceGeometry(0.62, 1.0, 0.07), []);
  return (
    <group rotation={[0, 0, swing]}>
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.36, 6]} />
        <meshStandardMaterial color="#8a7a5c" roughness={0.9} />
      </mesh>
      <group position={[0, -0.88, 0]} rotation={[0, Math.PI * flip, 0]}>
        <mesh castShadow geometry={geo}>
          <meshStandardMaterial map={front} roughness={0.85} side={THREE.FrontSide} />
        </mesh>
        <mesh geometry={geo} rotation={[0, Math.PI, 0]} position={[0, 0, -0.002]}>
          <meshStandardMaterial map={back} roughness={0.85} side={THREE.FrontSide} />
        </mesh>
      </group>
    </group>
  );
};

const Bank = ({rise}: {rise: number}) => {
  const stone = useMemo(() => new THREE.MeshStandardMaterial({color: "#b9cac7", roughness: 0.5}), []);
  const pediment = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-3.3, 0);
    s.lineTo(3.3, 0);
    s.lineTo(0, 1.1);
    s.lineTo(-3.3, 0);
    const g = new THREE.ExtrudeGeometry(s, {depth: 1.6, bevelEnabled: false});
    g.translate(0, 0, -0.8);
    return g;
  }, []);
  if (rise <= 0) return null;
  return (
    <group position={[0, -6.5 * (1 - rise), -8]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} castShadow receiveShadow position={[0, 0.15 + i * 0.3, 0.3 - i * 0.2]} material={stone}>
          <boxGeometry args={[7.4 - i * 0.4, 0.3, 3 - i * 0.4]} />
        </mesh>
      ))}
      {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((x) => (
        <mesh key={x} castShadow receiveShadow position={[x, 2.7, 0]} material={stone}>
          <cylinderGeometry args={[0.26, 0.3, 3.4, 24]} />
        </mesh>
      ))}
      <mesh castShadow receiveShadow position={[0, 4.6, 0]} material={stone}>
        <boxGeometry args={[6.8, 0.45, 1.8]} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 4.83, 0]} material={stone} geometry={pediment} />
    </group>
  );
};

const Podium = ({rise}: {rise: number}) => {
  if (rise <= 0) return null;
  const y = -1 + rise;
  return (
    <group position={[0, y * 1, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <boxGeometry args={[1.9, 0.8, 1.4]} />
        <meshPhysicalMaterial color="#f4f6f5" roughness={0.35} clearcoat={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[-1.85, 0.26, 0]}>
        <boxGeometry args={[1.8, 0.52, 1.3]} />
        <meshPhysicalMaterial color={HOOK.tealLight} roughness={0.4} clearcoat={0.5} />
      </mesh>
      <mesh castShadow receiveShadow position={[1.85, 0.17, 0]}>
        <boxGeometry args={[1.8, 0.34, 1.3]} />
        <meshPhysicalMaterial color={HOOK.teal} roughness={0.4} clearcoat={0.5} />
      </mesh>
    </group>
  );
};

const at = (p: Prop) => ({position: p.pos, rotation: p.rot ?? ([0, 0, 0] as V3), scale: p.scale ?? 1});

export const Studio3D = ({s}: {s: StudioState}) => {
  const {t, handle} = useTextures();
  const mats = useMemo(
    () => ({
      edge: new THREE.MeshPhysicalMaterial({color: "#22302f", metalness: 1, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.15}),
      ribbon: new THREE.MeshPhysicalMaterial({color: HOOK.gold, metalness: 0.7, roughness: 0.3, clearcoat: 1}),
      gold: new THREE.MeshPhysicalMaterial({color: "#d4a440", metalness: 1, roughness: 0.25}),
      silver: new THREE.MeshPhysicalMaterial({color: "#cfd8d6", metalness: 1, roughness: 0.2}),
    }),
    [],
  );
  const geos = useMemo(
    () => ({
      card: slab(CARD.w, CARD.h, CARD.d, 0.16),
      cardFace: faceGeometry(CARD.w - 0.002, CARD.h - 0.002, 0.16),
      pass: faceGeometry(1.5, 0.93, 0.08),
      passBody: slab(1.5, 0.93, 0.02, 0.08),
      boarding: faceGeometry(2.4, 0.96, 0.06),
      boardingBody: slab(2.4, 0.96, 0.012, 0.06),
      bill: faceGeometry(1.5, 2.66, 0.03),
    }),
    [],
  );
  const cardFaceMat = useMemo(() => (t ? new THREE.MeshPhysicalMaterial({map: t.card, metalness: 0.75, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12}) : null), [t]);
  const cardBackMat = useMemo(() => (t ? new THREE.MeshPhysicalMaterial({map: t.cardBack, metalness: 0.75, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12}) : null), [t]);
  const swing = Math.sin(s.tag.k * 9) * 0.06 * (1 - s.tag.flip * 0.5);
  const sink = s.giftSink;
  const total = s.bar.interest * (105 / 130) + s.bar.fees * (25 / 130);

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{alpha: true, antialias: true}} style={{position: "absolute", inset: 0}} camera={{fov: 32, position: [0, 1.5, 6]}}>
      <Camera cam={s.cam} />
      <Environment />
      <hemisphereLight args={["#ffffff", HOOK.ground2, 0.55]} />
      <directionalLight
        castShadow
        position={[-5, 9, 6]}
        intensity={2.2 * s.key.power}
        color={s.key.color}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-radius={6}
        shadow-bias={-0.0004}
      />
      {s.sweepPower > 0.01 ? <pointLight position={[s.sweep * 3, 2.2, 2.2]} intensity={6 * s.sweepPower} distance={8} color="#ffffff" /> : null}
      {/* The seamless floor: invisible except for its shadows. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <shadowMaterial opacity={0.18} />
      </mesh>
      {t && cardFaceMat ? (
        <>
          <group position={s.card.pos} rotation={s.card.rot}>
            <mesh castShadow geometry={geos.card} material={mats.edge} />
            <mesh geometry={geos.cardFace} material={cardFaceMat} position={[0, 0, CARD.d / 2 + 0.014]} />
            <mesh geometry={geos.cardFace} material={cardBackMat ?? undefined} position={[0, 0, -CARD.d / 2 - 0.014]} rotation={[0, Math.PI, 0]} />
            {s.tag.k > 0 ? (
              <group position={[CARD.w / 2 - 0.12, CARD.h / 2 - 0.12, 0.05]}>
                <mesh>
                  <torusGeometry args={[0.05, 0.012, 8, 20]} />
                  <meshStandardMaterial color="#8a7a5c" roughness={0.9} />
                </mesh>
                <group position={[0.62 * s.tag.k, 0, 0.12]} scale={1.35 * s.tag.k}>
                  <Tag front={t.tags[s.tag.front ?? "unknown"]} back={t.tags[s.tag.back ?? "deadbeat"]} flip={s.tag.flip} swing={swing} />
                </group>
              </group>
            ) : null}
          </group>
          <Bank rise={s.bank} />
          <Podium rise={s.podium} />
          {GIFTS.map((g, i) => {
            const k = s.gifts[i] ?? 0;
            if (k <= 0) return null;
            return (
              <group key={i} position={[g.pos[0], 6 * (1 - k) - sink * g.size * 1.4, g.pos[2]]} rotation={[0, g.turn + (1 - k) * 1.2, 0]}>
                <Gift size={g.size} color={g.color} mats={mats} />
              </group>
            );
          })}
          {s.coin.k > 0 ? (
            <group {...at(s.coin)}>
              <mesh castShadow rotation={[Math.PI / 2, 0, 0]} material={mats.gold}>
                <cylinderGeometry args={[0.5, 0.5, 0.09, 64]} />
              </mesh>
              <mesh position={[0, 0, 0.047]}>
                <circleGeometry args={[0.47, 64]} />
                <meshPhysicalMaterial map={t.coin} metalness={0.85} roughness={0.28} />
              </mesh>
            </group>
          ) : null}
          {s.lounge.k > 0 ? (
            <group {...at(s.lounge)}>
              <mesh castShadow geometry={geos.passBody}>
                <meshStandardMaterial color="#efeadf" roughness={0.8} />
              </mesh>
              <mesh geometry={geos.pass} position={[0, 0, 0.036]}>
                <meshStandardMaterial map={t.lounge} roughness={0.75} />
              </mesh>
            </group>
          ) : null}
          {s.hotel.k > 0 ? (
            <group {...at(s.hotel)}>
              <mesh castShadow geometry={geos.passBody}>
                <meshStandardMaterial color="#efeadf" roughness={0.8} />
              </mesh>
              <mesh geometry={geos.pass} position={[0, 0, 0.036]}>
                <meshStandardMaterial map={t.hotel} roughness={0.75} />
              </mesh>
            </group>
          ) : null}
          {s.boarding.k > 0 ? (
            <group {...at(s.boarding)}>
              <mesh castShadow geometry={geos.boardingBody}>
                <meshStandardMaterial color="#efeadf" roughness={0.8} />
              </mesh>
              <mesh geometry={geos.boarding} position={[0, 0, 0.03]}>
                <meshStandardMaterial map={t.boarding} roughness={0.75} />
              </mesh>
            </group>
          ) : null}
          {s.hook.k > 0 ? (
            <group position={[s.hook.pos[0], s.hook.pos[1] + 7 * (1 - s.hook.k), s.hook.pos[2]]}>
              <mesh position={[0, 4.6, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 8, 6]} />
                <meshStandardMaterial color="#3c4c4a" roughness={0.6} />
              </mesh>
              <mesh castShadow position={[0, 0.35, 0]} rotation={[0, 0, Math.PI * 0.85]} material={mats.silver}>
                <torusGeometry args={[0.22, 0.03, 12, 40, Math.PI * 1.35]} />
              </mesh>
              <mesh position={[0, 0.48, 0]} material={mats.silver}>
                <cylinderGeometry args={[0.03, 0.03, 0.3, 12]} />
              </mesh>
              {/* The bait: a 5% coin hung on the hook. */}
              <group position={[0.05, -0.3, 0]} rotation={[0, -0.25, 0.08]}>
                <mesh castShadow rotation={[Math.PI / 2, 0, 0]} material={mats.gold}>
                  <cylinderGeometry args={[0.42, 0.42, 0.08, 64]} />
                </mesh>
                <mesh position={[0, 0, 0.042]}>
                  <circleGeometry args={[0.39, 64]} />
                  <meshPhysicalMaterial map={t.coin} metalness={0.85} roughness={0.28} />
                </mesh>
              </group>
            </group>
          ) : null}
          {total > 0.001 ? (
            <group position={s.bar.pos}>
              <mesh castShadow receiveShadow position={[0, (4.2 * s.bar.interest * (105 / 130)) / 2, 0]}>
                <boxGeometry args={[1.2, Math.max(0.001, 4.2 * s.bar.interest * (105 / 130)), 1.2]} />
                <meshPhysicalMaterial color={HOOK.teal} roughness={0.3} clearcoat={0.8} />
              </mesh>
              {s.bar.fees > 0 ? (
                <mesh castShadow position={[0, 4.2 * (105 / 130) * s.bar.interest + (4.2 * (25 / 130) * s.bar.fees) / 2, 0]}>
                  <boxGeometry args={[1.2, Math.max(0.001, 4.2 * (25 / 130) * s.bar.fees), 1.2]} />
                  <meshPhysicalMaterial color={HOOK.tealLight} roughness={0.3} clearcoat={0.8} />
                </mesh>
              ) : null}
            </group>
          ) : null}
          {s.freeTag.k > 0 ? (
            <group position={s.freeTag.pos} scale={s.freeTag.k}>
              <Tag front={t.freeFront} back={t.freeBack} flip={s.freeTag.flip} swing={Math.sin(s.freeTag.k * 8) * 0.05} />
            </group>
          ) : null}
          {s.bill.k > 0 ? (
            <mesh castShadow receiveShadow geometry={geos.bill} position={s.bill.pos} rotation={s.bill.rot ?? [-Math.PI / 2, 0, 0]}>
              <meshStandardMaterial map={t.bill} roughness={0.85} />
            </mesh>
          ) : null}
          <ReleaseWhenDrawn handle={handle} />
        </>
      ) : null}
    </ThreeCanvas>
  );
};

// Everything off: the card alone, for chapter moments after the hook.
export const baseStudio = (cam: Cam, card: {pos: V3; rot: V3}): StudioState => ({
  cam,
  card,
  tag: {k: 0, flip: 0},
  key: {color: "#fff4e6", power: 1},
  sweep: 0,
  sweepPower: 0,
  bank: 0,
  gifts: [],
  giftSink: 0,
  coin: {k: 0, pos: [0, 0, 0]},
  lounge: {k: 0, pos: [0, 0, 0]},
  hotel: {k: 0, pos: [0, 0, 0]},
  boarding: {k: 0, pos: [0, 0, 0]},
  podium: 0,
  hook: {k: 0, pos: [0, 0, 0]},
  bar: {interest: 0, fees: 0, pos: [0, 0, 0]},
  freeTag: {k: 0, flip: 0, pos: [0, 0, 0]},
  bill: {k: 0, pos: [0, 0, 0]},
});
