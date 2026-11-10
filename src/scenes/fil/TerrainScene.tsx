import {useThree} from "@react-three/fiber";
import {ThreeCanvas} from "@remotion/three";
import {useEffect, useMemo, useState} from "react";
import {AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import * as THREE from "three";

// Real terrain of the Hijaz around Makkah (AWS Terrain Tiles + Sentinel-2 cloudless 2016,
// fetched by scripts/fetch_terrain.py), lit at golden hour, with a dust column where an
// army moves. Everything at 1 unit = 1 km. Any army shown here is a RECONSTRUCTION.

type Meta = {
  south: number;
  north: number;
  west: number;
  east: number;
  grid: number;
  metresPerDegreeLat: number;
  metresPerDegreeLon: number;
};

type Terrain = {meta: Meta; heights: Float32Array; texture: THREE.Texture};

const EXAGGERATION = 1.35;
const HAZE = "#e6c79a";

// Modern Makkah is in the 2016 picture; paint it over with soft sand for a 6th-century scene.
const MODERN_AREAS = [{lat: 21.415, lon: 39.835, radiusKm: 9}];

const kmX = (meta: Meta, lon: number) => ((lon - meta.west) * meta.metresPerDegreeLon) / 1000 - widthKm(meta) / 2;
const kmZ = (meta: Meta, lat: number) => ((meta.north - lat) * meta.metresPerDegreeLat) / 1000 - depthKm(meta) / 2;
const widthKm = (meta: Meta) => ((meta.east - meta.west) * meta.metresPerDegreeLon) / 1000;
const depthKm = (meta: Meta) => ((meta.north - meta.south) * meta.metresPerDegreeLat) / 1000;

export const heightAt = (terrain: Terrain, x: number, z: number) => {
  const {meta, heights} = terrain;
  const n = meta.grid;
  const u = Math.min(n - 1.001, Math.max(0, ((x + widthKm(meta) / 2) / widthKm(meta)) * (n - 1)));
  const v = Math.min(n - 1.001, Math.max(0, ((z + depthKm(meta) / 2) / depthKm(meta)) * (n - 1)));
  const i = Math.floor(u);
  const j = Math.floor(v);
  const fu = u - i;
  const fv = v - j;
  const h = (a: number, b: number) => heights[b * n + a];
  const top = h(i, j) * (1 - fu) + h(i + 1, j) * fu;
  const bottom = h(i, j + 1) * (1 - fu) + h(i + 1, j + 1) * fu;
  return ((top * (1 - fv) + bottom * fv) / 1000) * EXAGGERATION;
};

const paintOverModern = (image: HTMLImageElement, meta: Meta) => {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(image, 0, 0);
  for (const area of MODERN_AREAS) {
    const cx = ((area.lon - meta.west) / (meta.east - meta.west)) * image.width;
    const cy = ((meta.north - area.lat) / (meta.north - meta.south)) * image.height;
    const r = (area.radiusKm / widthKm(meta)) * image.width;
    const sand = ctx.getImageData(Math.round(cx - r * 1.4), Math.round(cy + r * 1.2), 1, 1).data;
    const gradient = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
    gradient.addColorStop(0, `rgba(${sand[0]},${sand[1]},${sand[2]},0.92)`);
    gradient.addColorStop(1, `rgba(${sand[0]},${sand[1]},${sand[2]},0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

export const useTerrain = (name: string) => {
  const [terrain, setTerrain] = useState<Terrain | null>(null);
  const [handle] = useState(() => delayRender(`Loading terrain ${name}`));
  useEffect(() => {
    const base = `terrain/${name}`;
    Promise.all([
      fetch(staticFile(`${base}/meta.json`)).then((r) => r.json() as Promise<Meta>),
      fetch(staticFile(`${base}/height.bin`)).then((r) => r.arrayBuffer()),
      new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = staticFile(`${base}/color.jpg`);
      }),
    ]).then(([meta, buffer, image]) => {
      setTerrain({meta, heights: new Float32Array(buffer), texture: paintOverModern(image, meta)});
      continueRender(handle);
    });
  }, [handle, name]);
  return terrain;
};

const Ground = ({terrain}: {terrain: Terrain}) => {
  const geometry = useMemo(() => {
    const {meta, heights} = terrain;
    const n = meta.grid;
    const plane = new THREE.PlaneGeometry(widthKm(meta), depthKm(meta), n - 1, n - 1);
    plane.rotateX(-Math.PI / 2);
    const position = plane.attributes.position;
    for (let k = 0; k < position.count; k++) {
      position.setY(k, (heights[k] / 1000) * EXAGGERATION);
    }
    plane.computeVertexNormals();
    return plane;
  }, [terrain]);
  return (
    <mesh geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial map={terrain.texture} roughness={1} metalness={0} />
    </mesh>
  );
};

const dustSprite = () => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
};

// A column of marching dust along a path of [lat, lon] points, rising and drifting with time.
const DustColumn = ({terrain, path, seconds}: {terrain: Terrain; path: [number, number][]; seconds: number}) => {
  const {geometry, material} = useMemo(() => {
    const count = 16000;
    const positions = new Float32Array(count * 3);
    const points = path.map(([lat, lon]) => new THREE.Vector3(kmX(terrain.meta, lon), 0, kmZ(terrain.meta, lat)));
    const curve = new THREE.CatmullRomCurve3(points);
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let k = 0; k < count; k++) {
      const t = rand();
      const p = curve.getPoint(t);
      const rise = Math.pow(rand(), 2.6) * (0.25 + t * 0.45);
      const spread = 0.35 + rise * 2.2;
      const x = p.x + (rand() - 0.5) * spread + rise * 0.8;
      const z = p.z + (rand() - 0.5) * spread;
      positions.set([x, heightAt(terrain, x, z) + 0.02 + rise, z], k * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const m = new THREE.PointsMaterial({
      map: dustSprite(),
      color: "#b98d5c",
      size: 0.3,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      sizeAttenuation: true,
    });
    return {geometry: g, material: m};
  }, [terrain, path]);
  return <points geometry={geometry} material={material} position={[seconds * 0.05, 0, -seconds * 0.02]} />;
};

const Rig = ({terrain, from, to, seconds}: {terrain: Terrain; from: [number, number, number]; to: [number, number]; seconds: number}) => {
  const {camera, scene} = useThree();
  const [lat, lon, altKm] = from;
  const x = kmX(terrain.meta, lon) - seconds * 0.12;
  const z = kmZ(terrain.meta, lat) - seconds * 0.05;
  camera.position.set(x, heightAt(terrain, x, z) + altKm, z);
  const tx = kmX(terrain.meta, to[1]);
  const tz = kmZ(terrain.meta, to[0]);
  camera.lookAt(tx, heightAt(terrain, tx, tz), tz);
  scene.fog = new THREE.Fog(HAZE, 10, 62);
  return null;
};

export const FilTerrainTest = () => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const terrain = useTerrain("hijaz-makkah");
  const seconds = frame / fps;
  // Reconstruction only: an army column in a valley east of Makkah, on the Taif side.
  const armyPath = useMemo<[number, number][]>(
    () => [
      [21.31, 40.24],
      [21.34, 40.16],
      [21.37, 40.08],
      [21.385, 40.01],
    ],
    [],
  );

  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #6d8fb4 0%, #b9a98c 18%, ${HAZE} 29%)`}}>
      {terrain ? (
        <ThreeCanvas
          width={width}
          height={height}
          shadows
          gl={{alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05}}
          camera={{fov: 42, near: 0.05, far: 200}}
        >
          <Rig terrain={terrain} from={[21.22, 40.37, 5.2]} to={[21.37, 40.05]} seconds={seconds} />
          <hemisphereLight args={["#9fb8d8", "#5a4128", 0.35]} />
          <directionalLight
            position={[-60, 9, -20]}
            intensity={4}
            color="#ffc98a"
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-left={-60}
            shadow-camera-right={60}
            shadow-camera-top={60}
            shadow-camera-bottom={-60}
            shadow-camera-far={200}
            shadow-bias={-0.0004}
          />
          <Ground terrain={terrain} />
          {/* A wide plain beyond the data's edge, lost in the haze, so no edge shows. */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <planeGeometry args={[1200, 1200]} />
            <meshStandardMaterial color="#c9a26c" roughness={1} />
          </mesh>
          <DustColumn terrain={terrain} path={armyPath} seconds={seconds} />
        </ThreeCanvas>
      ) : null}
      <div
        style={{
          position: "absolute",
          top: 210,
          left: 64,
          padding: "10px 18px",
          background: "rgba(20,14,8,0.55)",
          color: "#f3e3c6",
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: 30,
          letterSpacing: 3,
          fontWeight: 700,
        }}
      >
        RECONSTRUCTION
      </div>
    </AbsoluteFill>
  );
};
