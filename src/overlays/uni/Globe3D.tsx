import {ThreeCanvas} from "@remotion/three";
import {useThree} from "@react-three/fiber";
import {useCallback, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {continueRender, delayRender, Easing, interpolate, staticFile} from "remotion";
import * as THREE from "three";
import {GlobeCard, GlobeKey, GlobePin, LatLon} from "../../timeline/uniTypes";
import {ACCENT, GROUND} from "./look";

// One real Earth for the whole reel. The skin is NASA Blue Marble Next Generation with
// shaded relief (public domain, via NASA GIBS: projects/oldest-university/
// make_globe_patches.py), 8192 px round the world; where the camera dives, a sharper patch
// of the same picture (120 px a degree) lies over it with feathered edges. A perspective
// camera hangs over a point on the surface (GlobeKey); photos stand on the globe as prints
// hinged at their pins.

const SKIN = "footage/ou-earth.jpg";
// Stars: Solar System Scope, CC BY 4.0 (already in the chaand-nur credits).
const STARS = "footage/cn-tex-stars.jpg";
export const PATCHES = {
  india: {src: "footage/ou-patch-india.jpg", south: 14, north: 36, west: 68, east: 100},
  maghreb: {src: "footage/ou-patch-maghreb.jpg", south: 24, north: 44, west: -16, east: 14},
  italy: {src: "footage/ou-patch-italy.jpg", south: 36, north: 50, west: 0, east: 22},
} as const;

export const FOV = 34;
const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const rad = (d: number) => (d * Math.PI) / 180;

// A point on the globe, matching three's SphereGeometry texture layout (u = 0 at -180°).
export const toVec = (lat: number, lon: number, r = 1) => {
  const phi = ((lon + 180) / 360) * Math.PI * 2;
  const theta = ((90 - lat) / 180) * Math.PI;
  return new THREE.Vector3(-Math.cos(phi) * Math.sin(theta) * r, Math.cos(theta) * r, Math.sin(phi) * Math.sin(theta) * r);
};

export type CamState = {lat: number; lon: number; alt: number; tilt: number; heading: number; x: number; y: number};

const basis = (lat: number, lon: number) => {
  const n = toVec(lat, lon).normalize();
  const east = new THREE.Vector3(0, 1, 0).cross(n);
  if (east.lengthSq() < 1e-8) east.set(0, 0, -1);
  east.normalize();
  const north = n.clone().cross(east).normalize();
  return {n, east, north};
};

// A camera set from a CamState, for the canvas and for placing HTML labels on the globe.
export const cameraFor = (s: CamState, width: number, height: number) => {
  const camera = new THREE.PerspectiveCamera(FOV, width / height, 0.002, 400);
  const {n, east, north} = basis(s.lat, s.lon);
  const t = rad(s.tilt);
  const h = rad(s.heading);
  const fwd = north.clone().multiplyScalar(Math.cos(h)).add(east.clone().multiplyScalar(Math.sin(h)));
  const target = n.clone();
  const away = n.clone().multiplyScalar(Math.cos(t)).sub(fwd.clone().multiplyScalar(Math.sin(t)));
  camera.position.copy(target.clone().add(away.multiplyScalar(s.alt)));
  camera.up.copy(fwd.clone().multiplyScalar(Math.cos(t)).add(n.clone().multiplyScalar(Math.sin(t))));
  camera.lookAt(target);
  if (s.x || s.y) camera.setViewOffset(width, height, -s.x, -s.y, width, height);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  return camera;
};

// Where a place lands on the canvas (pixels), and whether it faces the camera.
export const projectPlace = (camera: THREE.PerspectiveCamera, width: number, height: number, place: LatLon, lift = 0) => {
  const p = toVec(place[0], place[1], 1 + lift);
  const facing = p.clone().normalize().dot(camera.position.clone().sub(p)) > 0;
  const v = p.clone().project(camera);
  return {x: ((v.x + 1) / 2) * width, y: ((1 - v.y) / 2) * height, visible: facing && v.z < 1};
};

const shortest = (from: number, to: number) => {
  let d = to - from;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
};

// The camera at a frame: each key's move starts on its word (`at`) and lands `move` seconds
// later; between moves the camera keeps drifting in a touch, so no frame holds still.
export const camAt = (keys: GlobeKey[], frame: number, cue: (s: number) => number): CamState => {
  const ease = Easing.inOut(Easing.cubic);
  const state = (k: GlobeKey): CamState => ({lat: k.lat, lon: k.lon, alt: k.alt, tilt: k.tilt ?? 0, heading: k.heading ?? 0, x: k.x ?? 0, y: k.y ?? 0});
  let current = state(keys[0]);
  let settledAt = cue(keys[0].at);
  for (let i = 1; i < keys.length; i++) {
    const k = keys[i];
    const from = cue(k.at);
    const len = Math.max(1, Math.round((k.move ?? 0.6) * 30));
    if (frame < from) break;
    const t = ease(Math.min(1, (frame - from) / len));
    const to = state(k);
    const arc = (k.arc ?? 0) * Math.sin(Math.PI * t);
    current = {
      lat: current.lat + (to.lat - current.lat) * t,
      lon: current.lon + shortest(current.lon, to.lon) * t,
      alt: current.alt + (to.alt - current.alt) * t + arc,
      tilt: current.tilt + (to.tilt - current.tilt) * t,
      heading: current.heading + (to.heading - current.heading) * t,
      x: current.x + (to.x - current.x) * t,
      y: current.y + (to.y - current.y) * t,
    };
    settledAt = from + len;
  }
  const since = Math.max(0, frame - settledAt);
  return {...current, alt: current.alt * (1 - 0.05 * Math.min(1, since / 120))};
};

// Textures, loaded once and kept for every later scene.
const cache = new Map<string, THREE.Texture>();
export const textureOf = (path: string) => cache.get(path)!;
const loading = new Map<string, Promise<THREE.Texture>>();
const load = (path: string) => {
  if (!loading.has(path)) {
    loading.set(
      path,
      new Promise((resolve, reject) =>
        new THREE.TextureLoader().load(
          staticFile(path),
          (t) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = 8;
            t.generateMipmaps = true;
            t.minFilter = THREE.LinearMipmapLinearFilter;
            cache.set(path, t);
            resolve(t);
          },
          undefined,
          reject,
        ),
      ),
    );
  }
  return loading.get(path)!;
};

export const useTextures = (paths: string[]) => {
  const key = paths.join("|");
  const all = () => paths.every((p) => cache.has(p));
  const [ready, setReady] = useState(all);
  const [handle] = useState(() => (all() ? null : delayRender(`Loading globe textures ${key}`)));
  useEffect(() => {
    if (!ready) Promise.all(paths.map(load)).then(() => setReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, key]);
  const release = useCallback(() => {
    if (handle !== null) continueRender(handle);
  }, [handle]);
  return {ready, release};
};

export const DrawWhenReady = ({ready, onDrawn}: {ready: boolean; onDrawn: () => void}) => {
  const {advance} = useThree();
  useEffect(() => {
    if (ready) {
      advance(performance.now());
      onDrawn();
    }
  }, [ready, advance, onDrawn]);
  return null;
};

const CameraRig = ({s}: {s: CamState}) => {
  const {camera, size} = useThree();
  useLayoutEffect(() => {
    const built = cameraFor(s, size.width, size.height);
    const c = camera as THREE.PerspectiveCamera;
    c.fov = built.fov;
    c.near = built.near;
    c.far = built.far;
    c.aspect = built.aspect;
    c.position.copy(built.position);
    c.quaternion.copy(built.quaternion);
    c.up.copy(built.up);
    if (s.x || s.y) c.setViewOffset(size.width, size.height, -s.x, -s.y, size.width, size.height);
    else c.clearViewOffset();
    c.updateProjectionMatrix();
    c.updateMatrixWorld(true);
  }, [camera, size, s]);
  return null;
};

const surfaceVertex = `
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
  vUv = uv;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vPosW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
// The Sun from the upper left: a soft terminator, a little light on the night side so the
// land still reads, and a thin haze of atmosphere at the limb. `feather` fades a patch's
// edges into the skin under it.
const surfaceFragment = `
uniform sampler2D map;
uniform vec3 lightDir;
uniform float feather;
varying vec2 vUv;
varying vec3 vNormalW;
varying vec3 vPosW;
void main() {
  vec3 albedo = texture2D(map, vUv).rgb;
  vec3 n = normalize(vNormalW);
  float lambert = dot(n, normalize(lightDir));
  float lit = 0.22 + 1.05 * smoothstep(-0.25, 0.6, lambert);
  vec3 view = normalize(cameraPosition - vPosW);
  float rim = pow(1.0 - max(dot(n, view), 0.0), 3.0);
  vec3 color = albedo * lit;
  color = mix(color, vec3(0.62, 0.74, 0.88) * (0.35 + 0.65 * smoothstep(-0.3, 0.5, lambert)), rim * 0.55);
  float alpha = 1.0;
  if (feather > 0.0) {
    float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    alpha = smoothstep(0.0, feather, edge);
  }
  gl_FragColor = vec4(color, alpha);
  #include <colorspace_fragment>
}`;

const haloVertex = `
varying vec3 vNormalV;
void main() {
  vNormalV = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
// The atmosphere seen edge-on beyond the limb: a thin band, fading out into space.
const haloFragment = `
varying vec3 vNormalV;
void main() {
  float i = pow(max(0.0, 0.62 - dot(vNormalV, vec3(0.0, 0.0, 1.0))), 2.2);
  gl_FragColor = vec4(vec3(0.6, 0.73, 0.9) * i * 1.6, i);
}`;

const starsFragment = `
uniform sampler2D map;
uniform vec3 ground;
uniform float strength;
varying vec2 vUv;
void main() {
  vec3 s = texture2D(map, vUv).rgb;
  gl_FragColor = vec4(ground + s * strength, 1.0);
  #include <colorspace_fragment>
}`;
const starsVertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const LIGHT = new THREE.Vector3(-0.6, 0.55, 0.6).normalize();

const surfaceMaterial = (map: THREE.Texture, feather: number, light: THREE.Vector3) =>
  new THREE.ShaderMaterial({
    uniforms: {map: {value: map}, lightDir: {value: light}, feather: {value: feather}},
    vertexShader: surfaceVertex,
    fragmentShader: surfaceFragment,
    transparent: feather > 0,
    depthWrite: feather === 0,
  });

// A lat/lon grid over one patch's box, a hair above the skin.
const patchGeometry = (p: {south: number; north: number; west: number; east: number}) => {
  const cols = 96;
  const rows = 72;
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const index: number[] = [];
  for (let j = 0; j <= rows; j++) {
    const v = j / rows;
    const lat = p.south + (p.north - p.south) * v;
    for (let i = 0; i <= cols; i++) {
      const u = i / cols;
      const lon = p.west + (p.east - p.west) * u;
      const q = toVec(lat, lon, 1.0006);
      positions.push(q.x, q.y, q.z);
      const nn = q.clone().normalize();
      normals.push(nn.x, nn.y, nn.z);
      uvs.push(u, v);
    }
  }
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = j * (cols + 1) + i;
      const b = a + cols + 1;
      index.push(a, a + 1, b, a + 1, b + 1, b);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  g.setIndex(index);
  return g;
};

// A standing card's frame: its foot on the globe, `x` along its bottom edge, `y` up its
// face, `z` towards the camera. Shared with the HTML labels set beside it.
export const cardFrame = (card: GlobeCard, camPos: THREE.Vector3) => {
  const anchor = toVec(card.place[0], card.place[1], 1.0012);
  const n = anchor.clone().normalize();
  const z = camPos.clone().sub(anchor).normalize();
  const y = n.clone().sub(z.clone().multiplyScalar(n.dot(z)));
  if (y.lengthSq() < 1e-8) y.copy(basis(card.place[0], card.place[1]).north);
  y.normalize();
  const x = y.clone().cross(z).normalize();
  return {anchor, n, x, y, z, width: card.height * (card.aspect ?? 0.75)};
};

// A photo print standing on the globe: hinged at its pin, it lifts from lying flat on the
// ground to standing square to the camera.
const Card = ({card, flip, camPos}: {card: GlobeCard; flip: number; camPos: THREE.Vector3}) => {
  const texture = cache.get(`footage/${card.src}`)!;
  const width = card.height * (card.aspect ?? 0.75);
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(width, card.height);
    g.translate(0, card.height / 2, 0);
    return g;
  }, [width, card.height]);
  const shadow = useMemo(() => {
    const g = new THREE.PlaneGeometry(width * 1.04, card.height * 1.03);
    g.translate(width * 0.03, card.height / 2 - card.height * 0.03, -0.0004);
    return g;
  }, [width, card.height]);
  const {anchor, n, x, y: yStand, z} = cardFrame(card, camPos);
  // Lying: face to the sky, its top pointing away from the camera, so it swings up towards
  // the viewer about its bottom edge.
  const away = n.clone().multiplyScalar(z.dot(n)).sub(z);
  if (away.lengthSq() < 1e-8) away.copy(yStand).negate();
  away.normalize();
  const lie = new THREE.Matrix4().makeBasis(x, away, x.clone().cross(away).normalize());
  const stand = new THREE.Matrix4().makeBasis(x, yStand, z);
  const q = new THREE.Quaternion().setFromRotationMatrix(lie).slerp(new THREE.Quaternion().setFromRotationMatrix(stand), flip);
  const scale = 0.82 + 0.18 * flip;
  return (
    <group position={anchor} quaternion={q} scale={[scale, scale, scale]}>
      <mesh geometry={shadow} renderOrder={3}>
        <meshBasicMaterial color="#000000" transparent opacity={0.35 * flip} depthWrite={false} />
      </mesh>
      <mesh geometry={geometry} renderOrder={4}>
        <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} transparent opacity={Math.min(1, flip * 4)} />
      </mesh>
    </group>
  );
};

const Pin = ({place, rise, camPos}: {place: LatLon; rise: number; camPos: THREE.Vector3}) => {
  const base = toVec(place[0], place[1], 1.0006);
  // Drawn for a camera about 0.45 radii away; nearer or farther, it scales with the distance.
  const k = Math.min(4, Math.max(0.25, camPos.distanceTo(base) / 0.45));
  const n = base.clone().normalize();
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
  const h = 0.026 * rise;
  return (
    <group position={base} quaternion={q} scale={[k, k, k]}>
      <mesh position={[0, h / 2, 0]} renderOrder={2}>
        <cylinderGeometry args={[0.0016, 0.0016, Math.max(h, 1e-4), 10]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
      <mesh position={[0, h, 0]} scale={rise} renderOrder={2}>
        <sphereGeometry args={[0.0055, 16, 12]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
    </group>
  );
};

export type GlobeScene = {
  cam: CamState;
  cards?: {card: GlobeCard; flip: number}[];
  pins?: {place: LatLon; rise: number}[];
  patches?: (keyof typeof PATCHES)[];
  stars?: number;
};

export const Globe3D = ({scene, width = 1080, height = 1920}: {scene: GlobeScene; width?: number; height?: number}) => {
  const patchKeys = scene.patches ?? ["india", "maghreb", "italy"];
  const cardSrcs = (scene.cards ?? []).map((c) => `footage/${c.card.src}`);
  const paths = [SKIN, STARS, ...patchKeys.map((k) => PATCHES[k].src), ...cardSrcs];
  const {ready, release} = useTextures(paths);
  const sphere = useMemo(() => new THREE.SphereGeometry(1, 256, 128), []);
  const halo = useMemo(() => new THREE.SphereGeometry(1.028, 128, 64), []);
  const sky = useMemo(() => new THREE.SphereGeometry(80, 64, 32), []);
  const patchGeos = useMemo(() => patchKeys.map((k) => patchGeometry(PATCHES[k])), [patchKeys.join("|")]);
  const materials = useMemo(() => {
    if (!ready) return null;
    return {
      skin: surfaceMaterial(cache.get(SKIN)!, 0, LIGHT),
      patches: patchKeys.map((k) => surfaceMaterial(cache.get(PATCHES[k].src)!, 0.09, LIGHT)),
      halo: new THREE.ShaderMaterial({
        vertexShader: haloVertex,
        fragmentShader: haloFragment,
        side: THREE.BackSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      sky: new THREE.ShaderMaterial({
        uniforms: {map: {value: cache.get(STARS)!}, ground: {value: new THREE.Color(GROUND)}, strength: {value: scene.stars ?? 0.28}},
        vertexShader: starsVertex,
        fragmentShader: starsFragment,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    };
  }, [ready, patchKeys.join("|"), scene.stars]);
  const camPos = cameraFor(scene.cam, width, height).position;
  return (
    <ThreeCanvas width={width} height={height} gl={{antialias: true, alpha: false}} style={{position: "absolute", left: 0, top: 0}} camera={{fov: FOV, near: 0.002, far: 400}}>
      <CameraRig s={scene.cam} />
      {materials ? (
        <>
          <mesh geometry={sky} material={materials.sky} position={camPos} renderOrder={-1} />
          <mesh geometry={sphere} material={materials.skin} renderOrder={0} />
          {patchGeos.map((g, i) => (
            <mesh key={patchKeys[i]} geometry={g} material={materials.patches[i]} renderOrder={1} />
          ))}
          <mesh geometry={halo} material={materials.halo} renderOrder={1} />
          {(scene.pins ?? []).map((p, i) => (p.rise > 0 ? <Pin key={`pin-${i}`} place={p.place} rise={p.rise} camPos={camPos} /> : null))}
          {(scene.cards ?? []).map((c) => (c.flip > 0 ? <Card key={c.card.id} card={c.card} flip={c.flip} camPos={camPos} /> : null))}
        </>
      ) : null}
      <DrawWhenReady ready={materials !== null} onDrawn={release} />
    </ThreeCanvas>
  );
};

// Points along great circles through the waypoints, about one a degree.
export const routePoints = (points: LatLon[]) => {
  const out: LatLon[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = toVec(points[i][0], points[i][1]).normalize();
    const b = toVec(points[i + 1][0], points[i + 1][1]).normalize();
    const angle = a.angleTo(b);
    const steps = Math.max(2, Math.ceil((angle * 180) / Math.PI));
    for (let k = i === 0 ? 0 : 1; k <= steps; k++) {
      const t = k / steps;
      const v = a.clone().multiplyScalar(Math.sin((1 - t) * angle)).add(b.clone().multiplyScalar(Math.sin(t * angle))).divideScalar(Math.sin(angle) || 1).normalize();
      const lat = (Math.asin(v.y) * 180) / Math.PI;
      // Inverse of toVec: x = -cos(phi) sin(theta), z = sin(phi) sin(theta).
      const phi = Math.atan2(v.z, -v.x);
      let lon = (phi * 180) / Math.PI - 180;
      if (lon < -180) lon += 360;
      out.push([lat, lon]);
    }
  }
  return out;
};

// How far a pin has risen, or a card has lifted, at a frame (0..1).
export const riseAt = (frame: number, from: number, frames = 12) =>
  interpolate(frame, [from, from + frames], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
