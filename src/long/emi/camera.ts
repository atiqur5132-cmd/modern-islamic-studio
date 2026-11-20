import {Easing, interpolate} from "remotion";
import {CLAMP, sec} from "./look";

// One continuous board: the camera moves between places on it. Each shot starts moving at
// `at` (seconds) and arrives after `frames`; `x, y` is the world point at screen centre.
export type Shot = {at: number; x: number; y: number; z: number; frames?: number};

export const cameraAt = (frame: number, shots: Shot[]) => {
  let cam = {x: shots[0].x, y: shots[0].y, z: shots[0].z};
  for (const s of shots) {
    const start = sec(s.at);
    if (frame < start) break;
    const p = interpolate(frame, [start, start + (s.frames ?? 30)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
    // Zoom interpolates in log space so a pull-back feels even.
    cam = {
      x: cam.x + (s.x - cam.x) * p,
      y: cam.y + (s.y - cam.y) * p,
      z: Math.exp(Math.log(cam.z) + (Math.log(s.z) - Math.log(cam.z)) * p),
    };
  }
  return cam;
};

// Moving to a far part of the board: pull back on the way, land on the new place.
export const travel = (at: number, x: number, y: number, z = 1, from?: {x: number; y: number}): Shot[] => [
  {at, x: from ? (from.x + x) / 2 : x, y: from ? (from.y + y) / 2 : y, z: 0.45, frames: 16},
  {at: at + 0.5, x, y, z, frames: 24},
];

// A part of the board at a fixed world origin: its shots and drawings use local coordinates.
export const at = (o: {x: number; y: number}, shots: Shot[]): Shot[] => shots.map((s) => ({...s, x: s.x + o.x, y: s.y + o.y}));
