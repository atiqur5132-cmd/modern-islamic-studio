import {ThreeCanvas} from "@remotion/three";
import {useThree} from "@react-three/fiber";
import {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {continueRender, delayRender} from "remotion";
import * as THREE from "three";
import {RoundedBoxGeometry} from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import {Post} from "../../sharaab/Post";
import {brushedOnce} from "../../sharaab/textures";
import {H, LAB, rng, V3, W} from "./look";
import {LabTextures, loadLab} from "./textures";

// The one lab of "Lab mein bana gosht" (projects/lab-meat/beats.md): a brushed-steel bench
// against glazed teal tiles; a bioreactor with a glass window on pink culture medium where
// cells drift up; the real photo of a cultivated chicken dish lying on the bench; the three
// amber tags (Animal? Method? Feed?); and, at the far left, a cold shelf with one retail pack.
// Every value that moves comes from `LabState`, set per frame by the scene.

export type Tag = {drop: number; glow: number; yaw?: number};
export type LabState = {
  cam: V3;
  target: V3;
  fov?: number;
  focus?: V3;
  bokeh?: number;
  range?: number;
  time: number; // seconds, drives the drifting cells
  tags?: Tag[]; // drop = height above the bench (>= 5 means not shown)
  reactor?: number; // the medium's inner light, 1 = normal
  shelf?: number; // the cold shelf light, 0..1
  cells?: number; // share of the cells shown in the reactor, 0..1 (default 1)
  tagPos?: V3[]; // where the tags lie, when not on the bench (the end: on the pack)
  tagScale?: number;
  globe?: Globe;
};

// The desk globe at the far end of the bench: `lat`/`lon` is the point turned to face the
// camera; pins rise out of the surface as their `k` goes 0 -> 1.
export type Pin = {lat: number; lon: number; k: number; hot?: number};
export type Globe = {lat: number; lon: number; pins: Pin[]};
export const GLOBE: V3 = [-3.7, 0.62, -0.2];
export const GLOBE_R = 0.36;
const rad = (d: number) => (d * Math.PI) / 180;
// Where (lat, lon) is on a unit sphere with three.js's equirectangular UVs (lon 0 at +x).
export const onSphere = (lat: number, lon: number): V3 => {
  const phi = rad(lon + 180);
  return [-Math.cos(phi) * Math.cos(rad(lat)), Math.sin(rad(lat)), Math.sin(phi) * Math.cos(rad(lat))];
};
// The globe's two turns that bring (lat, lon) to face +z: first about y, then about x.
export const globeTurn = (lat: number, lon: number) => {
  const [x, y, z] = onSphere(lat, lon);
  const a = Math.atan2(-x, z);
  const z1 = Math.hypot(x, z);
  return {a, b: Math.atan2(y, z1)};
};
// A pin's head in world space, for placing 2D labels beside it.
export const pinWorld = (g: Globe, lat: number, lon: number, lift = 0.06): V3 => {
  const {a, b} = globeTurn(g.lat, g.lon);
  const p = new THREE.Vector3(...onSphere(lat, lon)).multiplyScalar(GLOBE_R + lift);
  p.applyAxisAngle(new THREE.Vector3(0, 1, 0), a).applyAxisAngle(new THREE.Vector3(1, 0, 0), b);
  return [p.x + GLOBE[0], p.y + GLOBE[1], p.z + GLOBE[2]];
};
// Where a world point lands on the 1920 x 1080 frame for a lab state.
export const projectLab = (s: LabState, p: V3): {x: number; y: number} => {
  const c = new THREE.PerspectiveCamera(s.fov ?? 32, W / H, 0.03, 60);
  c.position.set(...s.cam);
  c.lookAt(...s.target);
  c.updateMatrixWorld();
  const v = new THREE.Vector3(...p).project(c);
  return {x: (v.x * 0.5 + 0.5) * W, y: (1 - (v.y * 0.5 + 0.5)) * H};
};

export const REACTOR: V3 = [1.7, 0, -0.35];
export const PRINT: V3 = [-1.6, 0, 0.05];
export const PRINT_SIZE: [number, number] = [0.64, 0.48];
export const PACK: V3 = [-6, 0, 0.05];
export const TAG_AT: V3[] = [[-0.38, 0, 0.28], [0, 0, 0.3], [0.38, 0, 0.26]];
const TAG_SIZE: [number, number] = [0.3, 0.16];
const BODY_R = 0.42;
const BODY_H = 1.3;
const BODY_Y = 0.16;
const WINDOW = 0.5; // half-width of the window, radians

const CELLS = 220;
const cellSeeds = (() => {
  const r = rng(23);
  return Array.from({length: CELLS}, () => ({a: (r() - 0.5) * 1.6, rad: 0.08 + r() * 0.28, y0: r(), speed: 0.018 + r() * 0.03, size: 0.006 + r() * 0.012, wob: r() * 6}));
})();

const Camera = ({s}: {s: LabState}) => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.fov = s.fov ?? 32;
    c.aspect = W / H;
    c.near = 0.03;
    c.far = 60;
    c.position.set(...s.cam);
    c.lookAt(...s.target);
    c.updateProjectionMatrix();
  }, [camera, s]);
  return null;
};

const Environment = ({env}: {env: THREE.Texture}) => {
  const {scene} = useThree();
  useEffect(() => {
    scene.environment = env;
    scene.environmentIntensity = 0.5;
    scene.environmentRotation = new THREE.Euler(0, 1.2, 0);
  }, [scene, env]);
  return null;
};

const Draw = ({onDrawn}: {onDrawn: () => void}) => {
  const {advance} = useThree();
  useEffect(() => {
    advance(performance.now());
    onDrawn();
  }, [advance, onDrawn]);
  return null;
};

const useReady = () => {
  const [tx, setTx] = useState<LabTextures | null>(null);
  const [handle] = useState(() => delayRender("Loading the lab"));
  useEffect(() => {
    loadLab().then((t) => {
      setTx(t);
      continueRender(handle);
    });
  }, [handle]);
  return tx;
};

const Cells = ({time, mat, share}: {time: number; mat: THREE.Material; share: number}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const geo = useMemo(() => new THREE.SphereGeometry(1, 14, 10), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    cellSeeds.forEach((c, i) => {
      const y = BODY_Y + 0.08 + (((c.y0 + time * c.speed) % 1) * (BODY_H - 0.2));
      const a = c.a + Math.sin(time * 0.4 + c.wob) * 0.05;
      dummy.position.set(REACTOR[0] + Math.sin(a) * c.rad, y, REACTOR[2] + Math.cos(a) * c.rad);
      dummy.scale.setScalar(c.size);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.count = Math.max(1, Math.round(CELLS * share));
    m.instanceMatrix.needsUpdate = true;
  }, [time, dummy, share]);
  return <instancedMesh ref={ref} args={[geo, mat, CELLS]} />;
};

const MEAT_GEO = new RoundedBoxGeometry(0.3, 0.05, 0.19, 4, 0.02);

type PackMats = {tray: THREE.Material; meat: THREE.Material; film: THREE.Material; label: THREE.Material};
const Pack = ({at, m, label}: {at: V3; m: PackMats; label: boolean}) => (
  <group position={at}>
    <mesh position={[0, 0.025, 0]} material={m.tray} castShadow receiveShadow>
      <boxGeometry args={[0.36, 0.05, 0.25]} />
    </mesh>
    <mesh position={[0, 0.06, 0]} geometry={MEAT_GEO} material={m.meat} castShadow />
    <mesh position={[0, 0.091, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.film}>
      <planeGeometry args={[0.36, 0.25]} />
    </mesh>
    {label ? (
      <mesh position={[0.05, 0.093, 0.04]} rotation={[-Math.PI / 2, 0, 0]} material={m.label}>
        <planeGeometry args={[0.22, 0.127]} />
      </mesh>
    ) : null}
  </group>
);

export const Lab3D = ({s}: {s: LabState}) => {
  const tx = useReady();
  const [drawHandle] = useState(() => delayRender("Drawing the lab"));
  const drawn = useRef(false);
  const onDrawn = () => {
    if (!drawn.current) {
      drawn.current = true;
      continueRender(drawHandle);
    }
  };
  const m = useMemo(() => {
    if (!tx) return null;
    const brushed = brushedOnce();
    return {
      bench: new THREE.MeshPhysicalMaterial({color: "#A7B2B6", metalness: 1, roughness: 0.46, roughnessMap: brushed, envMapIntensity: 1.5}),
      steel: new THREE.MeshPhysicalMaterial({color: LAB.steel, metalness: 1, roughness: 0.26, roughnessMap: brushed, side: THREE.DoubleSide}),
      steelDark: new THREE.MeshPhysicalMaterial({color: "#5E696E", metalness: 1, roughness: 0.4}),
      glass: new THREE.MeshPhysicalMaterial({color: "#DDEBEA", metalness: 0, roughness: 0.05, transparent: true, opacity: 0.16, envMapIntensity: 1.4, side: THREE.DoubleSide, depthWrite: false}),
      medium: new THREE.MeshStandardMaterial({color: LAB.medium, roughness: 0.35, emissive: new THREE.Color("#B85A4A"), emissiveIntensity: 0.55, transparent: true, opacity: 0.88}),
      cell: new THREE.MeshStandardMaterial({color: LAB.cell, roughness: 0.5, emissive: new THREE.Color("#F0B5A4"), emissiveIntensity: 0.35}),
      wall: new THREE.MeshStandardMaterial({map: tx.wall, roughness: 0.25, metalness: 0.1}),
      print: new THREE.MeshStandardMaterial({map: tx.dish, roughness: 0.6}),
      printBack: new THREE.MeshStandardMaterial({color: "#F4F1EA", roughness: 0.9}),
      tags: tx.tags.map((t) => new THREE.MeshStandardMaterial({map: t, roughness: 0.55, emissive: new THREE.Color(LAB.amber), emissiveIntensity: 0})),
      tagEdge: new THREE.MeshStandardMaterial({color: "#9C6A1E", roughness: 0.6}),
      dishGlass: new THREE.MeshPhysicalMaterial({color: "#E8F0EF", roughness: 0.05, transparent: true, opacity: 0.25, side: THREE.DoubleSide, depthWrite: false}),
      tray: new THREE.MeshStandardMaterial({color: "#15191B", roughness: 0.45}),
      tissue: new THREE.MeshPhysicalMaterial({color: "#B5525A", roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.2}),
      meat: new THREE.MeshPhysicalMaterial({color: "#E9C2AE", roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.25, sheen: 0.4, sheenColor: new THREE.Color("#F6D9CC")}),
      film: new THREE.MeshPhysicalMaterial({color: "#FFFFFF", roughness: 0.08, transparent: true, opacity: 0.12, depthWrite: false}),
      label: new THREE.MeshStandardMaterial({map: tx.label, roughness: 0.7}),
      shelfBack: new THREE.MeshStandardMaterial({color: "#22313A", roughness: 0.4, metalness: 0.5}),
      earth: new THREE.MeshPhysicalMaterial({map: tx.earth, roughness: 0.55, clearcoat: 0.6, clearcoatRoughness: 0.2}),
      pinHead: new THREE.MeshStandardMaterial({color: "#EDEFEA", roughness: 0.35}),
      pinHot: new THREE.MeshStandardMaterial({color: LAB.medium, roughness: 0.35, emissive: new THREE.Color("#B85A4A"), emissiveIntensity: 0.4}),
    };
  }, [tx]);

  const tags = s.tags ?? [];
  if (m) {
    tags.forEach((t, i) => {
      (m.tags[i] as THREE.MeshStandardMaterial).emissiveIntensity = 0.55 * t.glow;
    });
  }
  const reactor = s.reactor ?? 1;
  const shelf = s.shelf ?? 0;

  return (
    <ThreeCanvas width={W} height={H} shadows gl={{alpha: false, antialias: false, toneMapping: THREE.NoToneMapping, outputColorSpace: THREE.SRGBColorSpace}} style={{position: "absolute", inset: 0}} camera={{fov: 32, position: [0, 1, 3]}}>
      <color attach="background" args={[LAB.ground]} />
      <fog attach="fog" args={[LAB.ground, 6, 16]} />
      <Camera s={s} />
      {m && tx ? (
        <>
          <Environment env={tx.env} />
          <ambientLight intensity={0.08} color="#CFE3E6" />
          {/* Key: a soft, slightly cool overhead panel, as in a clean room at night. */}
          <spotLight position={[-0.6, 4.2, 2.4]} target-position={[0, 0, 0]} angle={0.9} penumbra={1} intensity={60} color="#EAF2F2" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0002} shadow-normalBias={0.02} shadow-radius={5} decay={2} />
          {/* Rim from behind right, to lift the steel off the tiles. */}
          <spotLight position={[3.4, 2.6, -0.6]} target-position={[1.2, 0.6, 0]} angle={0.8} penumbra={1} intensity={30} color="#9FC6CF" decay={2} />
          {/* The medium's own light, warm pink through the window. */}
          <pointLight position={[REACTOR[0], BODY_Y + BODY_H * 0.5, REACTOR[2] + 0.1]} intensity={2.2 * reactor} distance={2.6} color="#FF9C86" decay={2} />
          {/* The cold shelf: a white strip light above the pack. */}
          <spotLight position={[PACK[0], 1.6, 0.6]} target-position={PACK} angle={0.6} penumbra={0.8} intensity={28 * shelf} color="#E4F4FF" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} decay={2} />

          {/* A soft lamp on the globe */}
          <spotLight position={[GLOBE[0] + 0.9, 1.9, 1.5]} target-position={GLOBE} angle={0.5} penumbra={1} intensity={24} color="#F4F1EA" decay={2} />
          {/* The bench and the wall */}
          <mesh position={[-2.6, -0.03, -0.1]} material={m.bench} receiveShadow castShadow>
            <boxGeometry args={[11.5, 0.06, 1.7]} />
          </mesh>
          <mesh position={[-2.6, 2.4, -0.95]} material={m.wall} receiveShadow>
            <planeGeometry args={[16, 5]} />
          </mesh>
          {/* The cold shelf's back panel */}
          <mesh position={[PACK[0], 0.7, -0.9]} material={m.shelfBack} receiveShadow>
            <planeGeometry args={[2.4, 1.5]} />
          </mesh>

          {/* The bioreactor */}
          <group>
            {[0, 2.1, 4.2].map((a) => (
              <mesh key={a} position={[REACTOR[0] + Math.sin(a) * 0.3, BODY_Y / 2, REACTOR[2] + Math.cos(a) * 0.3]} material={m.steelDark} castShadow>
                <cylinderGeometry args={[0.025, 0.03, BODY_Y, 12]} />
              </mesh>
            ))}
            <mesh position={[REACTOR[0], BODY_Y + BODY_H / 2, REACTOR[2]]} material={m.steel} castShadow receiveShadow>
              <cylinderGeometry args={[BODY_R, BODY_R, BODY_H, 96, 1, true, WINDOW, Math.PI * 2 - 2 * WINDOW]} />
            </mesh>
            <mesh position={[REACTOR[0], BODY_Y + BODY_H / 2, REACTOR[2]]} material={m.glass}>
              <cylinderGeometry args={[BODY_R - 0.004, BODY_R - 0.004, BODY_H - 0.1, 48, 1, true, -WINDOW, 2 * WINDOW]} />
            </mesh>
            <mesh position={[REACTOR[0], BODY_Y + 0.06 + (BODY_H - 0.22) / 2, REACTOR[2]]} material={m.medium}>
              <cylinderGeometry args={[BODY_R - 0.03, BODY_R - 0.03, BODY_H - 0.22, 64]} />
            </mesh>
            <Cells time={s.time} mat={m.cell} share={s.cells ?? 1} />
            {/* Window frame: two vertical bars and the top and bottom flanges */}
            {[-WINDOW, WINDOW].map((a) => (
              <mesh key={a} position={[REACTOR[0] + Math.sin(a) * (BODY_R + 0.01), BODY_Y + BODY_H / 2, REACTOR[2] + Math.cos(a) * (BODY_R + 0.01)]} rotation={[0, a, 0]} material={m.steelDark} castShadow>
                <boxGeometry args={[0.04, BODY_H, 0.03]} />
              </mesh>
            ))}
            {[BODY_Y + 0.02, BODY_Y + BODY_H - 0.02, BODY_Y + BODY_H * 0.5].map((y) => (
              <mesh key={y} position={[REACTOR[0], y, REACTOR[2]]} rotation={[Math.PI / 2, 0, 0]} material={m.steelDark} castShadow>
                <torusGeometry args={[BODY_R + 0.012, 0.018, 12, 96]} />
              </mesh>
            ))}
            <mesh position={[REACTOR[0], BODY_Y + BODY_H, REACTOR[2]]} scale={[1, 0.38, 1]} material={m.steel} castShadow>
              <sphereGeometry args={[BODY_R, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>
            {/* Pipes from the lid back into the wall */}
            <mesh position={[REACTOR[0] - 0.1, BODY_Y + BODY_H + 0.3, REACTOR[2] - 0.32]} rotation={[0.9, 0, 0]} material={m.steelDark} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 0.7, 16]} />
            </mesh>
            <mesh position={[REACTOR[0] + 0.14, BODY_Y + BODY_H + 0.22, REACTOR[2] - 0.3]} rotation={[0.75, 0, 0]} material={m.steelDark} castShadow>
              <cylinderGeometry args={[0.016, 0.016, 0.6, 16]} />
            </mesh>
          </group>

          {/* A petri dish with medium, by the reactor */}
          <group position={[0.85, 0, 0.2]}>
            <mesh position={[0, 0.012, 0]} material={m.dishGlass}>
              <cylinderGeometry args={[0.12, 0.12, 0.024, 48, 1, true]} />
            </mesh>
            <mesh position={[0, 0.006, 0]} material={m.medium}>
              <cylinderGeometry args={[0.115, 0.115, 0.01, 48]} />
            </mesh>
            {/* The small sample of tissue the cells come from */}
            <mesh position={[0.01, 0.013, -0.005]} scale={[1, 0.35, 0.8]} material={m.tissue} castShadow>
              <sphereGeometry args={[0.022, 24, 16]} />
            </mesh>
          </group>

          {/* The real photo, printed and lying on the bench */}
          <group position={[PRINT[0], 0.003, PRINT[2]]} rotation={[0, 0.06, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} material={m.print} receiveShadow castShadow>
              <planeGeometry args={PRINT_SIZE} />
            </mesh>
          </group>

          {/* The three amber tags */}
          {tags.map((t, i) =>
            t.drop < 5 ? (
              <group key={i} position={[(s.tagPos ?? TAG_AT)[i][0], (s.tagPos ?? TAG_AT)[i][1] + 0.006 + t.drop, (s.tagPos ?? TAG_AT)[i][2]]} rotation={[0, (t.yaw ?? 0) + (i - 1) * -0.08, 0]} scale={s.tagScale ?? 1}>
                <mesh material={[m.tagEdge, m.tagEdge, m.tags[i], m.tagEdge, m.tagEdge, m.tagEdge]} castShadow receiveShadow>
                  <boxGeometry args={[TAG_SIZE[0], 0.008, TAG_SIZE[1]]} />
                </mesh>
              </group>
            ) : null,
          )}


          {/* The desk globe on its steel stand */}
          {(() => {
            const g = s.globe ?? {lat: 20, lon: 60, pins: []};
            const {a, b} = globeTurn(g.lat, g.lon);
            return (
              <group>
                <mesh position={[GLOBE[0], 0.012, GLOBE[2]]} material={m.steelDark} castShadow receiveShadow>
                  <cylinderGeometry args={[0.16, 0.19, 0.024, 48]} />
                </mesh>
                <mesh position={[GLOBE[0], (GLOBE[1] - GLOBE_R) / 2 + 0.01, GLOBE[2]]} material={m.steel} castShadow>
                  <cylinderGeometry args={[0.018, 0.022, GLOBE[1] - GLOBE_R, 16]} />
                </mesh>
                <mesh position={GLOBE} rotation={[0, 0, 0.0]} material={m.steelDark} castShadow>
                  <torusGeometry args={[GLOBE_R + 0.03, 0.008, 8, 96, Math.PI]} />
                </mesh>
                <group position={GLOBE} rotation={[b, 0, 0]}>
                  <group rotation={[0, a, 0]}>
                    <mesh material={m.earth} castShadow receiveShadow>
                      <sphereGeometry args={[GLOBE_R, 96, 64]} />
                    </mesh>
                    {g.pins.map((p, i) => {
                      if (p.k <= 0) return null;
                      const n = new THREE.Vector3(...onSphere(p.lat, p.lon));
                      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
                      const len = 0.07 * p.k;
                      return (
                        <group key={i} position={n.clone().multiplyScalar(GLOBE_R).toArray() as V3} quaternion={q}>
                          <mesh position={[0, len / 2, 0]} material={m.steel}>
                            <cylinderGeometry args={[0.0025, 0.0025, len, 8]} />
                          </mesh>
                          <mesh position={[0, len, 0]} material={p.hot ? m.pinHot : m.pinHead} castShadow>
                            <sphereGeometry args={[0.012 * (0.5 + 0.5 * p.k), 16, 12]} />
                          </mesh>
                        </group>
                      );
                    })}
                  </group>
                </group>
              </group>
            );
          })()}

          {/* The cold shelf: one pack in front, two behind */}
          <Pack at={PACK} m={m} label />
          <Pack at={[PACK[0] - 0.42, 0, PACK[2] - 0.3]} m={m} label />
          <Pack at={[PACK[0] + 0.42, 0, PACK[2] - 0.32]} m={m} label />

          <Post focus={s.focus ?? s.target} bokeh={s.bokeh ?? 2.6} range={s.range ?? 0.9} />
          <Draw onDrawn={onDrawn} />
        </>
      ) : null}
    </ThreeCanvas>
  );
};
