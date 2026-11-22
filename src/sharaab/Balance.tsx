import {useLayoutEffect, useMemo, useRef} from "react";
import * as THREE from "three";

// The brass balance, modelled in detail: a turned base with mouldings, a baluster column,
// a yoke and finial, a shaped beam with bosses, a pointer over an engraved dial, real chain
// links (instanced) and dished pans with rolled rims. Proportions follow 19th-century
// apothecary balances. The beam angle is set per frame; + puts the left (benefit) pan down.

export type V3 = [number, number, number];
export const PIVOT: V3 = [0, 2.55, 0];
export const ARM = 1.25;
export const HANG = 1.25;
export const PAN_R = 0.5;

export const panAt = (side: "left" | "right", beam: number): V3 => {
  // The beam turns counter-clockwise by `beam`: its left end goes down, its right end up.
  const s = side === "left" ? -1 : 1;
  return [PIVOT[0] + s * ARM * Math.cos(beam), PIVOT[1] + s * ARM * Math.sin(beam) - HANG, PIVOT[2]];
};

const lathe = (pts: [number, number][], seg = 96) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(Math.max(0, x), y)), seg);

// A smooth profile from a radius function sampled up the height.
const turned = (y0: number, y1: number, r: (y: number) => number, steps = 160) => {
  const pts: [number, number][] = [[0, y0]];
  for (let i = 0; i <= steps; i++) {
    const y = y0 + ((y1 - y0) * i) / steps;
    pts.push([r(y), y]);
  }
  pts.push([0, y1]);
  return lathe(pts);
};

const bump = (y: number, at: number, w: number, h: number) => h * Math.exp(-((y - at) ** 2) / (2 * w * w));

const geometries = () => {
  // Base: plinth, ogee, bead, then a dome rising into the column.
  const base = turned(0, 0.34, (y) => {
    if (y < 0.05) return 0.58;
    if (y < 0.065) return 0.58 - (y - 0.05) * 2.2;
    if (y < 0.12) return 0.545 - 1.6 * (y - 0.065) + 0.02 * Math.sin(((y - 0.065) / 0.055) * Math.PI);
    if (y < 0.14) return 0.47 + bump(y, 0.13, 0.006, 0.018);
    const t = (y - 0.14) / 0.2;
    return 0.46 * Math.pow(1 - t, 1.6) + 0.06 + bump(y, 0.3, 0.01, 0.02);
  });
  const column = turned(0.34, 2.45, (y) =>
    0.042 + bump(y, 0.42, 0.018, 0.035) + bump(y, 0.7, 0.09, 0.04) + bump(y, 0.95, 0.012, 0.02) + bump(y, 1.75, 0.012, 0.016) + bump(y, 2.3, 0.04, 0.026) - bump(y, 2.38, 0.01, 0.01),
  );
  const finial = turned(2.66, 3.0, (y) => 0.05 * Math.sin(Math.min(1, (y - 2.66) / 0.12) * Math.PI) * (y < 2.78 ? 1 : 0) + (y >= 2.78 ? Math.max(0, 0.022 * (1 - (y - 2.78) / 0.22)) : 0) + bump(y, 2.8, 0.008, 0.012));

  // The beam: thick at the centre, tapering to the ends, bevelled.
  const shape = new THREE.Shape();
  const half = (x: number) => 0.022 + 0.03 * Math.pow(1 - Math.abs(x) / ARM, 1.8);
  const N = 60;
  for (let i = 0; i <= N; i++) {
    const x = -ARM + (2 * ARM * i) / N;
    if (i === 0) shape.moveTo(x, half(x));
    else shape.lineTo(x, half(x));
  }
  for (let i = N; i >= 0; i--) {
    const x = -ARM + (2 * ARM * i) / N;
    shape.lineTo(x, -half(x) * 0.8);
  }
  const beam = new THREE.ExtrudeGeometry(shape, {depth: 0.03, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.006, bevelSegments: 3, curveSegments: 4});
  beam.translate(0, 0, -0.015);

  const pan = lathe([
    [0, -0.07], [0.12, -0.069], [0.24, -0.063], [0.34, -0.05], [0.42, -0.032], [0.47, -0.012], [0.495, 0.01], [0.507, 0.028],
    [0.512, 0.042], [0.506, 0.054], [0.494, 0.056], [0.486, 0.046], [0.484, 0.03], [0.46, 0.0], [0.41, -0.022], [0.33, -0.04], [0.2, -0.052], [0, -0.056],
  ], 128);
  const weight = lathe([[0, 0], [0.135, 0], [0.145, 0.01], [0.145, 0.15], [0.13, 0.165], [0.095, 0.18], [0.06, 0.185], [0.05, 0.2], [0.05, 0.235], [0.07, 0.25], [0.078, 0.27], [0.07, 0.29], [0.04, 0.3], [0, 0.3]]);
  const link = new THREE.TorusGeometry(0.016, 0.0042, 8, 18);
  link.scale(1, 1.5, 1);
  const dial = new THREE.RingGeometry(0.4, 0.47, 64, 1, Math.PI / 2 - 0.42, 0.84);
  return {base, column, finial, beam, pan, weight, link, dial};
};

// One chain: links along a straight line from a to b, each turned 90 degrees from the last.
const Chain = ({a, b, geo, material}: {a: V3; b: V3; geo: THREE.BufferGeometry; material: THREE.Material}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
  const len = va.distanceTo(vb);
  const pitch = 0.04;
  const count = Math.max(2, Math.floor(len / pitch));
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dirv = vb.clone().sub(va).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dirv);
    const turn = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    const m = new THREE.Matrix4();
    for (let i = 0; i < count; i++) {
      const p = va.clone().lerp(vb, (i + 0.5) / count);
      const qi = i % 2 ? q.clone().multiply(turn) : q.clone();
      m.compose(p, qi, new THREE.Vector3(1, 1, 1));
      mesh.setMatrixAt(i, m);
    }
    mesh.count = count;
    mesh.instanceMatrix.needsUpdate = true;
  });
  return <instancedMesh ref={ref} args={[geo, material, 80]} castShadow />;
};

export type BalanceMats = {brass: THREE.Material; brassDark: THREE.Material; engraved: THREE.Material};

export const Balance = ({beam, m}: {beam: number; m: BalanceMats}) => {
  const g = useMemo(geometries, []);
  const left = panAt("left", beam);
  const right = panAt("right", beam);
  const ends: Record<"left" | "right", V3> = {
    left: [PIVOT[0] - ARM * Math.cos(beam), PIVOT[1] - ARM * Math.sin(beam) - 0.02, PIVOT[2]],
    right: [PIVOT[0] + ARM * Math.cos(beam), PIVOT[1] + ARM * Math.sin(beam) - 0.02, PIVOT[2]],
  };
  const pans = {left, right};
  return (
    <group>
      <mesh geometry={g.base} material={m.brass} castShadow receiveShadow />
      <mesh geometry={g.column} material={m.brass} castShadow />
      {/* The yoke holding the pivot, and the finial above it */}
      {[-1, 1].map((z) => (
        <mesh key={z} position={[0, PIVOT[1] + 0.03, z * 0.04]} material={m.brass} castShadow>
          <boxGeometry args={[0.06, 0.26, 0.012]} />
        </mesh>
      ))}
      <mesh position={[0, PIVOT[1] + 0.17, 0]} material={m.brass} castShadow>
        <boxGeometry args={[0.07, 0.025, 0.1]} />
      </mesh>
      <mesh geometry={g.finial} material={m.brass} castShadow position={[0, -0.08, 0]} />
      {/* The dial behind the pointer, fixed to the yoke */}
      <mesh geometry={g.dial} position={[0, PIVOT[1], -0.055]} material={m.engraved} />
      {Array.from({length: 11}, (_, i) => {
        const a = Math.PI / 2 - 0.38 + (i * 0.76) / 10;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.435, PIVOT[1] + Math.sin(a) * 0.435, -0.05]} rotation={[0, 0, a - Math.PI / 2]} material={m.brassDark}>
            <boxGeometry args={[0.005, i === 5 ? 0.06 : 0.035, 0.006]} />
          </mesh>
        );
      })}
      <group position={PIVOT} rotation={[0, 0, beam]}>
        <mesh geometry={g.beam} material={m.brass} castShadow />
        <mesh rotation={[Math.PI / 2, 0, 0]} material={m.brassDark} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.07, 48]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={m.brass}>
          <cylinderGeometry args={[0.022, 0.022, 0.13, 24]} />
        </mesh>
        {/* The pointer, which shows the tilt against the dial */}
        <mesh position={[0, 0.25, -0.02]} material={m.brassDark} castShadow>
          <coneGeometry args={[0.012, 0.46, 12]} />
        </mesh>
        {[-1, 1].map((sx) => (
          <group key={sx} position={[sx * ARM, -0.005, 0]}>
            <mesh material={m.brass} castShadow>
              <sphereGeometry args={[0.038, 24, 12]} />
            </mesh>
            <mesh position={[0, -0.03, 0]} rotation={[0, Math.PI / 2, 0]} material={m.brassDark}>
              <torusGeometry args={[0.018, 0.005, 8, 18]} />
            </mesh>
          </group>
        ))}
      </group>
      {(["left", "right"] as const).map((side) => {
        const e = ends[side], p = pans[side];
        return (
          <group key={side}>
            {[0, 1, 2].map((i) => {
              const a = (i / 3) * Math.PI * 2 + Math.PI / 6;
              const rim: V3 = [p[0] + Math.cos(a) * (PAN_R - 0.035), p[1] + 0.05, p[2] + Math.sin(a) * (PAN_R - 0.035)];
              return <Chain key={i} a={[e[0], e[1] - 0.04, e[2]]} b={rim} geo={g.link} material={m.brassDark} />;
            })}
            <mesh position={p} geometry={g.pan} material={m.brass} castShadow receiveShadow />
          </group>
        );
      })}
    </group>
  );
};

export const WEIGHT_GEO = () => geometries().weight;
