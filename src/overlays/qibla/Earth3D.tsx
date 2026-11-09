import {ThreeCanvas} from "@remotion/three";
import {useThree} from "@react-three/fiber";
import {useCallback, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {continueRender, delayRender, random, staticFile} from "remotion";
import * as THREE from "three";
import {EarthState, GORES, place, View} from "./earth";

// The Earth's skin: "Blue Marble Next Generation + topography + bathymetry" (Reto
// Stockli, NASA Earth Observatory, public domain), graded by make_maps.py.
const EARTH_TEXTURE = "footage/qb-earth.jpg";

const LON_STEPS = 18; // per petal
const LAT_STEPS = 90;
const LAT_LIMIT = 89.5;

// An orange's skin, drawn once: a warm gradient with the pitted pores of real peel.
const orangeTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  const base = ctx.createLinearGradient(0, 0, 0, 1024);
  base.addColorStop(0, "#F07A12");
  base.addColorStop(0.5, "#F7931E");
  base.addColorStop(1, "#E86E0C");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 2048, 1024);
  for (let k = 0; k < 26000; k++) {
    const x = random(`px${k}`) * 2048;
    const y = random(`py${k}`) * 1024;
    const r = 1.2 + random(`pr${k}`) * 2.6;
    ctx.fillStyle = random(`pc${k}`) > 0.5 ? "rgba(255,190,90,0.35)" : "rgba(170,60,0,0.22)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
void main() {
  vUv = uv;
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// Unlit, so the flat map reads like print; on the globe a soft light from the upper
// left gives it its round body.
const fragmentShader = `
uniform sampler2D earth;
uniform sampler2D peel;
uniform float skin;
uniform float shade;
varying vec2 vUv;
varying vec3 vNormal;
void main() {
  vec4 a = texture2D(peel, vUv);
  vec4 b = texture2D(earth, vUv);
  vec3 color = mix(a.rgb, b.rgb, skin);
  vec3 light = normalize(vec3(-0.45, 0.55, 0.75));
  float lambert = max(dot(normalize(vNormal), light), 0.0);
  float lit = mix(1.0, 0.42 + 0.78 * lambert, shade);
  gl_FragColor = vec4(color * lit, 1.0);
  #include <colorspace_fragment>
}`;

// Loaded once and kept, so every scene that mounts later has the texture on its first frame.
let cachedEarth: THREE.Texture | null = null;
let loadingEarth: Promise<THREE.Texture> | null = null;
const loadEarth = () => {
  if (!loadingEarth) {
    loadingEarth = new Promise((resolve, reject) => {
      new THREE.TextureLoader().load(
        staticFile(EARTH_TEXTURE),
        (loaded) => {
          loaded.colorSpace = THREE.SRGBColorSpace;
          loaded.anisotropy = 8;
          loaded.wrapS = THREE.RepeatWrapping;
          loaded.needsUpdate = true;
          cachedEarth = loaded;
          resolve(loaded);
        },
        undefined,
        reject,
      );
    });
  }
  return loadingEarth;
};

// The render waits until the canvas has actually drawn the Earth: during a render the
// canvas only draws when the frame changes, so a texture that arrives later would
// otherwise leave this frame blank.
const useEarthTexture = () => {
  const [texture, setTexture] = useState<THREE.Texture | null>(cachedEarth);
  const [handle] = useState(() => (cachedEarth ? null : delayRender("Loading the Earth texture")));
  useEffect(() => {
    if (texture) {
      return;
    }
    loadEarth().then(setTexture);
  }, [texture]);
  const release = useCallback(() => {
    if (handle !== null) {
      continueRender(handle);
    }
  }, [handle]);
  return {texture, release};
};

const DrawWhenReady = ({ready, onDrawn}: {ready: boolean; onDrawn: () => void}) => {
  const {advance} = useThree();
  useEffect(() => {
    if (ready) {
      advance(performance.now());
      onDrawn();
    }
  }, [ready, advance, onDrawn]);
  return null;
};

const Camera = ({view}: {view: View}) => {
  const {camera, size} = useThree();
  useLayoutEffect(() => {
    const ortho = camera as THREE.OrthographicCamera & {manual?: boolean};
    // Without this, the canvas resets the frustum to its pixel size on every resize.
    ortho.manual = true;
    ortho.zoom = 1;
    const height = (view.width * size.height) / size.width;
    ortho.left = view.cx - view.width / 2;
    ortho.right = view.cx + view.width / 2;
    ortho.top = view.cy + height / 2;
    ortho.bottom = view.cy - height / 2;
    ortho.near = -100;
    ortho.far = 100;
    ortho.position.set(0, 0, 10);
    ortho.lookAt(0, 0, 0);
    ortho.updateProjectionMatrix();
  }, [camera, size, view]);
  return null;
};

const Petal = ({index, state, material}: {index: number; state: EarthState; material: THREE.Material}) => {
  const width = 360 / GORES;
  const centre = -180 + (index + 0.5) * width;
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const count = (LON_STEPS + 1) * (LAT_STEPS + 1);
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("normal", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(count * 2), 2));
    const indices: number[] = [];
    for (let j = 0; j < LAT_STEPS; j++) {
      for (let i = 0; i < LON_STEPS; i++) {
        const a = j * (LON_STEPS + 1) + i;
        const b = a + 1;
        const c = a + LON_STEPS + 1;
        const d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
    g.setIndex(indices);
    return g;
  }, []);

  useLayoutEffect(() => {
    const position = geometry.attributes.position as THREE.BufferAttribute;
    const normal = geometry.attributes.normal as THREE.BufferAttribute;
    const uv = geometry.attributes.uv as THREE.BufferAttribute;
    for (let j = 0; j <= LAT_STEPS; j++) {
      const lat = -LAT_LIMIT + (2 * LAT_LIMIT * j) / LAT_STEPS;
      for (let i = 0; i <= LON_STEPS; i++) {
        const rel = centre - width / 2 + (width * i) / LON_STEPS;
        const lon = rel + state.centerLon;
        const k = j * (LON_STEPS + 1) + i;
        const {p, n} = place(lat, lon, state, centre);
        position.setXYZ(k, p[0], p[1], p[2]);
        normal.setXYZ(k, n[0], n[1], n[2]);
        // Unwrapped, so a petal crossing the date line keeps its texture continuous
        // (the texture repeats).
        uv.setXY(k, (lon + 180) / 360, (lat + 90) / 180);
      }
    }
    position.needsUpdate = true;
    normal.needsUpdate = true;
    uv.needsUpdate = true;
    geometry.computeBoundingSphere();
  }, [geometry, state, centre, width]);

  return <mesh geometry={geometry} material={material} />;
};

export const Earth3D = ({state, view, skin = 1}: {state: EarthState; view: View; skin?: number}) => {
  const {texture: earth, release} = useEarthTexture();
  const peel = useMemo(orangeTexture, []);
  const material = useMemo(() => {
    if (!earth) {
      return null;
    }
    peel.wrapS = THREE.RepeatWrapping;
    return new THREE.ShaderMaterial({
      uniforms: {earth: {value: earth}, peel: {value: peel}, skin: {value: 1}, shade: {value: 0}},
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
    });
  }, [earth, peel]);
  if (material) {
    material.uniforms.skin.value = skin;
    material.uniforms.shade.value = Math.min(1, Math.max(0, state.wrap)) * 0.9;
  }
  return (
    <ThreeCanvas orthographic width={1080} height={1920} gl={{alpha: true, antialias: true}} style={{position: "absolute", inset: 0}}>
      <Camera view={view} />
      {material
        ? Array.from({length: GORES}, (_, index) => <Petal key={index} index={index} state={state} material={material} />)
        : null}
      <DrawWhenReady ready={material !== null} onDrawn={release} />
    </ThreeCanvas>
  );
};
