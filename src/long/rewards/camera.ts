import {Easing, interpolate} from "remotion";
import * as THREE from "three";
import {CLAMP, H, W, sec} from "./look";

export type V3 = [number, number, number];

// One camera move: it leaves at `at` (seconds) and arrives after `frames`.
export type Move = {at: number; frames?: number; pos: V3; target: V3; fov?: number};
export type Cam = {pos: V3; target: V3; fov: number};

const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

export const camAt = (frame: number, moves: Move[]): Cam => {
  let cam: Cam = {pos: moves[0].pos, target: moves[0].target, fov: moves[0].fov ?? 32};
  for (const m of moves) {
    const start = sec(m.at);
    if (frame < start) break;
    const t = interpolate(frame, [start, start + (m.frames ?? 36)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
    cam = {pos: lerp3(cam.pos, m.pos, t), target: lerp3(cam.target, m.target, t), fov: cam.fov + ((m.fov ?? cam.fov) - cam.fov) * t};
  }
  return cam;
};

// Where a world point lands on the 1920×1080 frame, so 2D labels can sit on 3D objects.
const scratch = new THREE.PerspectiveCamera(32, W / H, 0.1, 200);
const v = new THREE.Vector3();
export const project = (p: V3, cam: Cam): {x: number; y: number} => {
  scratch.fov = cam.fov;
  scratch.position.set(...cam.pos);
  scratch.lookAt(...cam.target);
  scratch.updateProjectionMatrix();
  scratch.updateMatrixWorld();
  v.set(...p).project(scratch);
  return {x: ((v.x + 1) / 2) * W, y: ((1 - v.y) / 2) * H};
};
