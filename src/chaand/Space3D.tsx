import {ThreeCanvas} from "@remotion/three";
import {useThree} from "@react-three/fiber";
import {useCallback, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {continueRender, delayRender, staticFile} from "remotion";
import * as THREE from "three";

// One continuous 3D sky for the chaand-nur reel: a real Moon (Solar System Scope map from
// NASA LRO data, CC BY 4.0) lit only by the Sun's direction, so its terminator is the real
// one; a burning Sun (same source) with a corona; the last sunlight as a travelling shell;
// the Milky Way behind. Everything is set per frame by the scene through `SpaceState`.

export type V3 = [number, number, number];
export type SpaceState = {
  cam: V3;
  target: V3;
  fov?: number;
  roll?: number;
  up?: V3;
  moon: {pos: V3; r: number; spin?: number; light: number; tilt?: number};
  sun: {pos: V3; r: number; power: number};
  // The sunlight's direction at the Moon can be set apart from where the Sun is drawn.
  lightFrom?: V3;
  shell?: {r: number; opacity: number};
  stars?: number;
};

const TEXTURES = {moon: "footage/cn-tex-moon.jpg", sun: "footage/cn-tex-sun.jpg", stars: "footage/cn-tex-stars.jpg"} as const;
type Key = keyof typeof TEXTURES;
const cache: Partial<Record<Key, THREE.Texture>> = {};
let loading: Promise<void> | null = null;
const loadAll = () => {
  if (!loading) {
    const loader = new THREE.TextureLoader();
    loading = Promise.all(
      (Object.keys(TEXTURES) as Key[]).map(
        (key) =>
          new Promise<void>((resolve, reject) =>
            loader.load(
              staticFile(TEXTURES[key]),
              (t) => {
                t.colorSpace = THREE.SRGBColorSpace;
                t.anisotropy = 8;
                t.wrapS = THREE.RepeatWrapping;
                cache[key] = t;
                resolve();
              },
              undefined,
              reject,
            ),
          ),
      ),
    ).then(() => undefined);
  }
  return loading;
};

const useTextures = () => {
  const ready0 = Boolean(cache.moon && cache.sun && cache.stars);
  const [ready, setReady] = useState(ready0);
  const [handle] = useState(() => (ready0 ? null : delayRender("Loading the sky textures")));
  useEffect(() => {
    if (!ready) loadAll().then(() => setReady(true));
  }, [ready]);
  const release = useCallback(() => {
    if (handle !== null) continueRender(handle);
  }, [handle]);
  return {ready, release};
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

const Camera = ({s}: {s: SpaceState}) => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.fov = s.fov ?? 38;
    c.near = 0.05;
    c.far = 2000;
    c.position.set(...s.cam);
    if (s.up) c.up.set(...s.up);
    else c.up.set(Math.sin(s.roll ?? 0), Math.cos(s.roll ?? 0), 0);
    c.lookAt(...s.target);
    c.updateProjectionMatrix();
  }, [camera, s]);
  return null;
};

const moonVertex = `
varying vec2 vUv;
varying vec3 vNormalW;
void main() {
  vUv = uv;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
// Lambert from the Sun only, with a soft terminator and a whisper of earthshine.
const moonFragment = `
uniform sampler2D map;
uniform vec3 lightDir;
uniform float light;
varying vec2 vUv;
varying vec3 vNormalW;
void main() {
  vec3 albedo = texture2D(map, vUv).rgb;
  float lambert = max(dot(normalize(vNormalW), normalize(lightDir)), 0.0);
  float lit = smoothstep(0.0, 0.18, lambert) * (0.35 + 0.95 * lambert);
  vec3 color = albedo * (lit * light * 1.25 + 0.035);
  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}`;

const sunVertex = `
varying vec2 vUv;
varying vec3 vNormalV;
void main() {
  vUv = uv;
  vNormalV = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
// The Sun's own light: its map, drifting, with limb darkening.
const sunFragment = `
uniform sampler2D map;
uniform float power;
uniform float time;
varying vec2 vUv;
varying vec3 vNormalV;
void main() {
  vec2 uv = vUv + vec2(time * 0.004, 0.0) + 0.004 * vec2(sin(vUv.y * 40.0 + time), cos(vUv.x * 40.0 + time * 0.8));
  vec3 base = texture2D(map, uv).rgb;
  float mu = max(dot(normalize(vNormalV), vec3(0.0, 0.0, 1.0)), 0.0);
  vec3 color = mix(vec3(dot(base, vec3(0.33))), base, 0.55) * vec3(1.18, 1.0, 0.7) * (0.5 + 0.7 * pow(mu, 0.45)) * power * 1.35;
  gl_FragColor = vec4(color, 1.0);
  #include <colorspace_fragment>
}`;

const shellVertex = sunVertex;
// The travelling sunlight: bright at its rim, clear in the middle.
const shellFragment = `
uniform float opacity;
varying vec2 vUv;
varying vec3 vNormalV;
void main() {
  float rim = 1.0 - abs(dot(normalize(vNormalV), vec3(0.0, 0.0, 1.0)));
  float a = pow(rim, 3.0) * opacity;
  gl_FragColor = vec4(vec3(1.0, 0.72, 0.36) * a, a);
}`;

const coronaTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(256, 256, 60, 256, 256, 256);
  grad.addColorStop(0, "rgba(255,200,120,0.95)");
  grad.addColorStop(0.25, "rgba(240,160,70,0.45)");
  grad.addColorStop(0.55, "rgba(200,110,40,0.12)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

export const Space3D = ({s, time}: {s: SpaceState; time: number}) => {
  const {ready, release} = useTextures();
  const corona = useMemo(coronaTexture, []);
  const mats = useMemo(() => {
    if (!ready) return null;
    return {
      moon: new THREE.ShaderMaterial({uniforms: {map: {value: cache.moon}, lightDir: {value: new THREE.Vector3(1, 0, 0)}, light: {value: 1}}, vertexShader: moonVertex, fragmentShader: moonFragment}),
      sun: new THREE.ShaderMaterial({uniforms: {map: {value: cache.sun}, power: {value: 1}, time: {value: 0}}, vertexShader: sunVertex, fragmentShader: sunFragment}),
      shell: new THREE.ShaderMaterial({uniforms: {opacity: {value: 0}}, vertexShader: shellVertex, fragmentShader: shellFragment, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide}),
      stars: new THREE.MeshBasicMaterial({map: cache.stars!, side: THREE.BackSide, transparent: true, opacity: 0.5, depthWrite: false}),
      corona: new THREE.SpriteMaterial({map: corona, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false}),
    };
  }, [ready, corona]);

  if (mats) {
    const from = s.lightFrom ?? s.sun.pos;
    mats.moon.uniforms.lightDir.value.set(from[0] - s.moon.pos[0], from[1] - s.moon.pos[1], from[2] - s.moon.pos[2]).normalize();
    mats.moon.uniforms.light.value = s.moon.light;
    mats.sun.uniforms.power.value = s.sun.power;
    mats.sun.uniforms.time.value = time;
    mats.shell.uniforms.opacity.value = s.shell?.opacity ?? 0;
    mats.stars.opacity = 0.55 * (s.stars ?? 1);
    mats.corona.opacity = Math.min(1, s.sun.power);
  }
  return (
    <ThreeCanvas width={1080} height={1920} gl={{alpha: false, antialias: true}} style={{position: "absolute", inset: 0}} camera={{fov: 38, position: [0, 0, 10]}}>
      <color attach="background" args={["#0B0E16"]} />
      <Camera s={s} />
      {mats ? (
        <>
          <mesh material={mats.stars} renderOrder={-1}>
            <sphereGeometry args={[900, 64, 32]} />
          </mesh>
          <mesh position={s.moon.pos} rotation={[s.moon.tilt ?? 0.1, (s.moon.spin ?? 0) - Math.PI / 2, 0]} material={mats.moon}>
            <sphereGeometry args={[s.moon.r, 128, 64]} />
          </mesh>
          <mesh position={s.sun.pos} rotation={[0.2, time * 0.01, 0]} material={mats.sun}>
            <sphereGeometry args={[s.sun.r, 96, 48]} />
          </mesh>
          {s.sun.power > 0.001 ? (
            <>
              <sprite position={s.sun.pos} scale={[s.sun.r * 5.2, s.sun.r * 5.2, 1]} material={mats.corona} />
            </>
          ) : null}
          {s.shell && s.shell.opacity > 0.001 ? (
            <mesh position={s.sun.pos} material={mats.shell}>
              <sphereGeometry args={[s.shell.r, 96, 48]} />
            </mesh>
          ) : null}
        </>
      ) : null}
      <DrawWhenReady ready={mats !== null} onDrawn={release} />
    </ThreeCanvas>
  );
};

// Keyframed values: linear between keys after easing each segment.
export const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
