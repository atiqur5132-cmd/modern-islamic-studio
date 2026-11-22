import {ThreeCanvas} from "@remotion/three";
import {useThree} from "@react-three/fiber";
import {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {continueRender, delayRender} from "remotion";
import * as THREE from "three";
import {ARABIC} from "../overlays/kasawna/look";
import {Assets, heightOf, loadAssets} from "./assets";
import {ARM, Balance, HANG, PAN_R, panAt, PIVOT, V3, WEIGHT_GEO} from "./Balance";
import {Post} from "./Post";
import {ayahPage, brushedOnce, calendarLeaf, coverOnce, pageEdge} from "./textures";

// One continuous 3D studio for the sharaab-fayda reel (projects/sharaab-fayda/beats.md):
// a black-walnut table against a painted plaster wall, lit by a warm key and an oil lamp
// burning behind; a detailed brass balance in the middle; a scanned green glass bottle;
// brass and iron weights; a Quran in green leather with a debossed gold border and title.
// Real CC0 materials (Poly Haven), an HDRI for reflections, and a lens with depth of field.
// Every object is placed per frame by the scene through `StudioState`.

export {ARM, HANG, PAN_R, panAt, PIVOT};
export type {V3};
export type Weight = {pan: "left" | "right"; drop: number; kind: "brass" | "iron" | "small" | "coin"; slot?: number};
export type Doc = {which: "who" | "lancet"; pos: V3; yaw?: number; slide?: number; hl?: {u0: number; u1: number; v: number; h: number; p: number}[]};
export type StudioState = {
  cam: V3;
  target: V3;
  fov?: number;
  roll?: number;
  beam: number;
  bottle?: {on: "left" | "table"; lift?: number; pos?: V3};
  weights?: Weight[];
  book?: {pos: V3; yaw?: number; drop?: number; open?: number; flip?: number; page?: "2:219" | "5:91"};
  docs?: Doc[];
  calendar?: {pos: V3; yaw?: number; flip: number};
  lamp?: number;
  sweep?: number;
  key?: number;
  spot?: {pos: V3; target: V3; power: number; angle?: number};
  // Where the lens focuses (defaults to `target`) and how shallow the focus is.
  focus?: V3;
  bokeh?: number;
  range?: number;
};

export const BOOK = {w: 1.0, h: 0.16, d: 1.37};
export const LAMP_AT: V3 = [2.25, 0, -1.35];
const BOTTLE_H = 1.15;
const LAMP_H = 1.7;

const Camera = ({s}: {s: StudioState}) => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.fov = s.fov ?? 34;
    c.near = 0.05;
    c.far = 60;
    c.position.set(...s.cam);
    c.up.set(Math.sin(s.roll ?? 0), Math.cos(s.roll ?? 0), 0);
    c.lookAt(...s.target);
    c.updateProjectionMatrix();
  }, [camera, s]);
  return null;
};

const Environment = ({env}: {env: THREE.Texture}) => {
  const {scene} = useThree();
  useEffect(() => {
    scene.environment = env;
    scene.environmentIntensity = 0.42;
    scene.environmentRotation = new THREE.Euler(0, 2.2, 0);
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

// Assets and the Arabic font (for the cover's title) must be in before the first frame.
let fontPromise: Promise<unknown> | null = null;
const useReady = () => {
  const [assets, setAssets] = useState<Assets | null>(null);
  const [handle] = useState(() => delayRender("Loading the studio's materials and models"));
  useEffect(() => {
    if (!fontPromise) fontPromise = document.fonts.ready.then(() => document.fonts.load(`120px "${ARABIC}"`, "القرآن"));
    Promise.all([loadAssets(), fontPromise]).then(([a]) => {
      setAssets(a);
      continueRender(handle);
    });
  }, [handle]);
  return assets;
};

export const Studio3D = ({s}: {s: StudioState}) => {
  const assets = useReady();
  const [drawHandle] = useState(() => delayRender("Drawing the studio"));
  const drawn = useRef(false);
  const onDrawn = () => {
    if (!drawn.current) {
      drawn.current = true;
      continueRender(drawHandle);
    }
  };
  const m = useMemo(() => {
    if (!assets) return null;
    const c = coverOnce();
    const brushedRough = brushedOnce();
    const brass = new THREE.MeshPhysicalMaterial({color: "#C9A266", metalness: 1, roughness: 0.42, roughnessMap: brushedRough, envMapIntensity: 1.15});
    const bottle = assets.bottle.clone(true);
    bottle.scale.setScalar(BOTTLE_H / heightOf(assets.bottle));
    const lamp = assets.lamp.clone(true);
    lamp.scale.setScalar(LAMP_H / heightOf(assets.lamp));
    return {
      table: new THREE.MeshPhysicalMaterial({map: assets.walnut.map, normalMap: assets.walnut.normal, roughnessMap: assets.walnut.rough, roughness: 0.9, color: "#7E5F49", clearcoat: 0.22, clearcoatRoughness: 0.4}),
      wall: new THREE.MeshStandardMaterial({map: assets.plaster.map, normalMap: assets.plaster.normal, normalScale: new THREE.Vector2(1.4, 1.4), roughnessMap: assets.plaster.rough, color: "#5E4C3E"}),
      brass,
      brassDark: new THREE.MeshPhysicalMaterial({color: "#8F6E3C", metalness: 1, roughness: 0.5, roughnessMap: brushedRough}),
      engraved: new THREE.MeshPhysicalMaterial({color: "#B8925A", metalness: 1, roughness: 0.55, side: THREE.DoubleSide}),
      iron: new THREE.MeshStandardMaterial({color: "#2A2826", metalness: 0.65, roughness: 0.62}),
      coverTop: new THREE.MeshPhysicalMaterial({map: c.map, metalnessMap: c.metalness, metalness: 1, roughnessMap: c.roughness, roughness: 1, normalMap: c.normal, normalScale: new THREE.Vector2(1.2, 1.2), sheen: 0.4, sheenColor: new THREE.Color("#3C5E48")}),
      leather: new THREE.MeshStandardMaterial({map: assets.leather.map, normalMap: assets.leather.normal, roughnessMap: assets.leather.rough, color: "#2B4A36"}),
      endpaper: new THREE.MeshStandardMaterial({color: "#7E6F55", roughness: 0.95}),
      pageEdge: new THREE.MeshStandardMaterial({map: pageEdge(), roughness: 0.6, metalness: 0.25}),
      page219: new THREE.MeshStandardMaterial({map: ayahPage("2:219", 14), color: "#CFC3AA", roughness: 1}),
      page591: new THREE.MeshStandardMaterial({map: ayahPage("5:91", 17), color: "#CFC3AA", roughness: 1}),
      who: new THREE.MeshStandardMaterial({map: assets.who, roughness: 0.85, color: "#E8E2D6"}),
      lancet: new THREE.MeshStandardMaterial({map: assets.lancet, roughness: 0.85, color: "#E8E2D6"}),
      highlight: new THREE.MeshBasicMaterial({color: "#F2C95C", transparent: true, opacity: 0.45, depthWrite: false}),
      leafPlain: new THREE.MeshStandardMaterial({map: calendarLeaf("1", "day", "EVERY DAY"), roughness: 0.9, side: THREE.DoubleSide}),
      leafCount: new THREE.MeshStandardMaterial({map: calendarLeaf("≈ 7,000", "deaths, every day", "EVERY DAY"), roughness: 0.9}),
      wood: new THREE.MeshStandardMaterial({map: assets.walnut.map, normalMap: assets.walnut.normal, color: "#5A4030", roughness: 0.7}),
      sheet: new THREE.MeshStandardMaterial({color: "#E0D4BC", roughness: 1, side: THREE.DoubleSide}),
      weightGeo: WEIGHT_GEO(),
      bottle,
      lamp,
    };
  }, [assets]);

  const beam = s.beam;
  const left = panAt("left", beam);
  const right = panAt("right", beam);
  const pans = {left, right};
  const slots: V3[] = [[0, 0, 0], [-0.22, 0, 0.12], [0.22, 0, 0.1], [0.02, 0, -0.22], [-0.16, 0, -0.16]];
  const book = s.book;
  const open = book?.open ?? 0;
  const flip = book?.flip ?? 0;
  const key = s.key ?? 1;
  const flameY = LAMP_AT[1] + LAMP_H * 0.62;

  return (
    <ThreeCanvas width={1080} height={1920} shadows gl={{alpha: false, antialias: false, toneMapping: THREE.NoToneMapping, outputColorSpace: THREE.SRGBColorSpace}} style={{position: "absolute", inset: 0}} camera={{fov: 34, position: [0, 2, 6]}}>
      <color attach="background" args={["#120E0B"]} />
      <fog attach="fog" args={["#120E0B", 8, 18]} />
      <Camera s={s} />
      {m && assets ? (
        <>
          <Environment env={assets.env} />
          <ambientLight intensity={0.06} color="#FFE2BE" />
          {/* Key: a warm soft spot from above left, the light of a desk lamp out of frame */}
          <spotLight position={[-2.4, 6.4, 3.6]} target-position={[0.2, 0.9, 0]} angle={0.6} penumbra={0.9} intensity={110 * key} color="#FFDDB0" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0002} shadow-normalBias={0.02} shadow-radius={6} decay={2} />
          {/* Rim: cool, from behind right, to separate the brass from the wall */}
          <spotLight position={[3.2, 3.6, -2.2]} target-position={[0, 1.7, 0]} angle={0.75} penumbra={1} intensity={34} color="#AFC3D6" decay={2} />
          {/* The oil lamp's own light, warm and close to the table */}
          <pointLight position={[LAMP_AT[0], flameY, LAMP_AT[2] + 0.1]} intensity={4.2 * (s.lamp ?? 1)} distance={7} color="#FFA552" decay={2} />
          {s.spot ? <spotLight position={s.spot.pos} target-position={s.spot.target} angle={s.spot.angle ?? 0.45} penumbra={0.65} intensity={s.spot.power} color="#FFE4BC" decay={2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-bias={-0.0003} /> : null}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.table}>
            <planeGeometry args={[14, 9]} />
          </mesh>
          <mesh position={[0, 4, -2.6]} receiveShadow material={m.wall}>
            <planeGeometry args={[16, 9]} />
          </mesh>
          <primitive object={m.lamp} position={LAMP_AT} rotation={[0, 0.6, 0]} />
          <Balance beam={beam} m={{brass: m.brass, brassDark: m.brassDark, engraved: m.engraved}} />
          {(s.weights ?? []).map((w, i) => {
            const p = pans[w.pan];
            const slot = slots[(w.slot ?? i) % slots.length];
            const scale = w.kind === "iron" ? 1.9 : w.kind === "small" ? 0.55 : 1;
            const iron = w.kind === "iron";
            if (w.kind === "coin") {
              return (
                <mesh key={i} position={[p[0] + slot[0], p[1] - 0.04 + w.drop + 0.012 * ((w.slot ?? 0) % 1), p[2] + slot[2]]} material={m.brass} castShadow receiveShadow>
                  <cylinderGeometry args={[0.075, 0.075, 0.022, 48]} />
                </mesh>
              );
            }
            return (
              <mesh key={i} position={[p[0] + (iron ? 0 : slot[0]), p[1] - 0.045 + w.drop, p[2] + (iron ? 0 : slot[2])]} scale={scale} geometry={m.weightGeo} material={iron ? m.iron : m.brass} castShadow receiveShadow />
            );
          })}
          {s.bottle ? (() => {
            const base: V3 = s.bottle.on === "left" ? [left[0] + 0.06, left[1] - 0.05, left[2] - 0.04] : s.bottle.pos ?? [0, 0, 0];
            return <primitive object={m.bottle} position={[base[0], base[1] + (s.bottle.lift ?? 0), base[2]]} rotation={[0, -0.5, 0]} />;
          })() : null}
          {(s.docs ?? []).map((d, i) => {
            const W = 1.1;
            const H = d.which === "who" ? W * (900 / 1180) : W * (1340 / 1580);
            const slide = d.slide ?? 1;
            return (
              <group key={`doc-${i}`} position={[d.pos[0] + (1 - slide) * 2.6, 0.004 + i * 0.002, d.pos[2] + (1 - slide) * 0.4]} rotation={[0, (d.yaw ?? 0) + (1 - slide) * 0.5, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} material={d.which === "who" ? m.who : m.lancet} receiveShadow castShadow>
                  <planeGeometry args={[W, H]} />
                </mesh>
                {(d.hl ?? []).map((h, k) =>
                  h.p > 0 ? (
                    <mesh key={k} rotation={[-Math.PI / 2, 0, 0]} position={[-W / 2 + W * h.u0 + (W * (h.u1 - h.u0) * h.p) / 2, 0.002, -(H / 2 - H * h.v)]} material={m.highlight}>
                      <planeGeometry args={[W * (h.u1 - h.u0) * h.p, H * h.h]} />
                    </mesh>
                  ) : null,
                )}
              </group>
            );
          })}
          {s.calendar ? (
            <group position={s.calendar.pos} rotation={[0, s.calendar.yaw ?? 0, 0]}>
              {/* A wooden easel holding a tear-off pad, leaning back */}
              <group rotation={[-0.32, 0, 0]}>
                <mesh position={[0, 0.3, -0.02]} material={m.wood} castShadow receiveShadow>
                  <boxGeometry args={[0.5, 0.62, 0.035]} />
                </mesh>
                <mesh position={[0, 0.29, 0.0]} material={m.leafCount}>
                  <planeGeometry args={[0.42, 0.52]} />
                </mesh>
                <group position={[0, 0.55, 0.004]} rotation={[-Math.PI * 0.95 * s.calendar.flip, 0, 0]}>
                  <mesh position={[0, -0.26, 0]} material={m.leafPlain} castShadow>
                    <planeGeometry args={[0.42, 0.52]} />
                  </mesh>
                </group>
              </group>
              <mesh position={[0, 0.06, -0.16]} rotation={[0.5, 0, 0]} material={m.wood} castShadow>
                <boxGeometry args={[0.46, 0.04, 0.3]} />
              </mesh>
            </group>
          ) : null}
          {book ? (
            <group position={[book.pos[0], book.pos[1] + (book.drop ?? 0), book.pos[2]]} rotation={[0, book.yaw ?? 0, 0]}>
              <mesh position={[0, 0.012, 0]} material={m.leather} castShadow receiveShadow>
                <boxGeometry args={[BOOK.w, 0.024, BOOK.d]} />
              </mesh>
              <mesh position={[0.01, BOOK.h / 2, 0]} castShadow receiveShadow material={[m.pageEdge, m.pageEdge, book.page === "5:91" ? m.page591 : m.page219, m.page219, m.pageEdge, m.pageEdge]}>
                <boxGeometry args={[BOOK.w - 0.05, BOOK.h - 0.03, BOOK.d - 0.05]} />
              </mesh>
              <mesh position={[-BOOK.w / 2 + 0.012, BOOK.h / 2, 0]} material={m.leather} castShadow>
                <boxGeometry args={[0.024, BOOK.h + 0.02, BOOK.d]} />
              </mesh>
              {[0.1, 0.085, 0.07, 0.055, 0.04, 0.025, 0.01].map((lag, i) => {
                const t = Math.min(1, Math.max(0, (flip - lag * 5) / 0.5));
                if (t <= 0 || t >= 1) return null;
                return (
                  <group key={i} position={[-BOOK.w / 2 + 0.03, BOOK.h - 0.012, 0]} rotation={[0, 0, Math.PI * t]}>
                    <mesh position={[(BOOK.w - 0.07) / 2, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.sheet} castShadow>
                      <planeGeometry args={[BOOK.w - 0.07, BOOK.d - 0.07]} />
                    </mesh>
                  </group>
                );
              })}
              <group position={[-BOOK.w / 2, BOOK.h, 0]} rotation={[0, 0, Math.PI * open]}>
                <mesh position={[BOOK.w / 2, 0.012, 0]} castShadow material={[m.leather, m.leather, m.coverTop, m.endpaper, m.leather, m.leather]}>
                  <boxGeometry args={[BOOK.w, 0.024, BOOK.d]} />
                </mesh>
              </group>
              {s.sweep !== undefined ? <pointLight position={[-BOOK.w / 2 + BOOK.w * s.sweep, BOOK.h + 0.3, 0.35]} intensity={5} distance={1.2} color="#FFE6B0" decay={2} /> : null}
            </group>
          ) : null}
          <Post focus={s.focus ?? s.target} bokeh={s.bokeh} range={s.range} />
          <Draw onDrawn={onDrawn} />
        </>
      ) : null}
    </ThreeCanvas>
  );
};

export const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// Where a world point lands on the 1080 x 1920 frame for a studio state, for placing labels.
export const project = (s: StudioState, p: V3): [number, number] => {
  const c = new THREE.PerspectiveCamera(s.fov ?? 34, 1080 / 1920, 0.05, 60);
  c.position.set(...s.cam);
  c.up.set(Math.sin(s.roll ?? 0), Math.cos(s.roll ?? 0), 0);
  c.lookAt(...s.target);
  c.updateMatrixWorld();
  const v = new THREE.Vector3(...p).project(c);
  return [(v.x * 0.5 + 0.5) * 1080, (1 - (v.y * 0.5 + 0.5)) * 1920];
};
