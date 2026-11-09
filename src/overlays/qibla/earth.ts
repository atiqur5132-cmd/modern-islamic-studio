import {LatLon} from "./look";

// One surface that is a globe, a peel of petals, a flat map or a classroom Mercator map,
// and every shape between. The 3D mesh (Earth3D.tsx) and the 2D lines and pins drawn
// over it (strings, labels) use these same functions, so a pin never slides off its city.

export type EarthState = {
  // 0 = flat sheet, 1 = globe. Between, the sheet bends round evenly, like paper
  // wrapped onto a ball.
  wrap: number;
  // Flat sheet only: 0 = full rectangle, 1 = petals (sinusoidal gores) with gaps.
  gores: number;
  // Flat sheet only: 0 = plain grid (latitude evenly spaced), 1 = Mercator.
  merc: number;
  // Longitude at the middle of the map, and at the front of the globe.
  centerLon: number;
  // Latitude brought to the front of the globe (applied as the sheet wraps).
  tilt: number;
  // Turn the globe about the line of sight, degrees (a wrapped view only).
  roll?: number;
};

export type View = {cx: number; cy: number; width: number};

// World units: the globe's radius.
export const R = 1;
export const GORES = 8;
const MERC_LIMIT = 84;

const rad = (d: number) => (d * Math.PI) / 180;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const wrapLon = (lon: number) => ((((lon + 180) % 360) + 360) % 360) - 180;

const mercLat = (lat: number) => {
  const clamped = Math.max(-MERC_LIMIT, Math.min(MERC_LIMIT, lat));
  return Math.log(Math.tan(Math.PI / 4 + rad(clamped) / 2));
};

// The petal a longitude belongs to, as the longitude (relative to the map centre) of
// that petal's middle.
export const goreCentre = (dl: number) => {
  const width = 360 / GORES;
  const index = Math.min(GORES - 1, Math.max(0, Math.floor((dl + 180) / width)));
  return -180 + (index + 0.5) * width;
};

export type Placed = {p: [number, number, number]; n: [number, number, number]};

// Where (lat, lon) sits on the surface, and the surface's outward normal there.
// `gore` is the petal's middle (relative longitude); pass it for mesh vertices on a
// petal's edge, leave it out for points (cities, strings).
export const place = (lat: number, lon: number, s: EarthState, gore?: number): Placed => {
  let dl = wrapLon(lon - s.centerLon);
  // A petal's edge on the date line (+180) belongs to that petal, not to the far side (-180).
  if (gore !== undefined && Math.abs(dl - gore) > 180) {
    dl += dl < gore ? 360 : -360;
  }
  const g = gore ?? goreCentre(dl);
  // Flat-sheet coordinates, in radians of the globe.
  const width = lerp(1, Math.cos(rad(lat)), s.gores);
  const u = rad(g + (dl - g) * width);
  const v = lerp(rad(lat), mercLat(lat), s.merc);
  const t = Math.max(0, Math.min(1, s.wrap));
  let p: [number, number, number];
  let n: [number, number, number];
  let c: [number, number, number];
  if (t < 1e-4) {
    p = [R * u, R * v, R];
    n = [0, 0, 1];
    c = [0, 0, -1e4];
  } else {
    // Bend the sheet onto a sphere of radius R/t touching the plane at the front; at
    // t = 1 it is the globe, and the coordinates have become true latitude and longitude.
    const a = lerp(u, rad(dl), t) * t;
    const b = lerp(v, rad(lat), t) * t;
    const big = R / t;
    n = [Math.cos(b) * Math.sin(a), Math.sin(b), Math.cos(b) * Math.cos(a)];
    c = [0, 0, R - big];
    p = [c[0] + big * n[0], c[1] + big * n[1], c[2] + big * n[2]];
  }
  // Bring the chosen latitude to the front, turning about the bend's centre.
  const theta = rad(s.tilt) * t;
  if (theta !== 0) {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const y = p[1] - c[1];
    const z = p[2] - c[2];
    p = [p[0], c[1] + y * cos - z * sin, c[2] + y * sin + z * cos];
    n = [n[0], n[1] * cos - n[2] * sin, n[1] * sin + n[2] * cos];
  }
  const roll = rad(s.roll ?? 0) * t;
  if (roll !== 0) {
    const cos = Math.cos(roll);
    const sin = Math.sin(roll);
    p = [p[0] * cos - p[1] * sin, p[0] * sin + p[1] * cos, p[2]];
    n = [n[0] * cos - n[1] * sin, n[0] * sin + n[1] * cos, n[2]];
  }
  return {p, n};
};

// Frame pixels of a world point under the orthographic camera.
export const toScreen = (p: [number, number, number], view: View): [number, number] => {
  const height = (view.width * 1920) / 1080;
  return [((p[0] - view.cx) / view.width) * 1080 + 540, ((view.cy - p[1]) / height) * 1920 + 960];
};

// A city or path point on screen, and whether it faces the camera (false on the far
// side of the globe).
export const project = (point: LatLon, s: EarthState, view: View, lift = 0.004) => {
  const {p, n} = place(point[0], point[1], s);
  const lifted: [number, number, number] = [p[0] + n[0] * lift, p[1] + n[1] * lift, p[2] + n[2] * lift];
  const [x, y] = toScreen(lifted, view);
  return {x, y, visible: n[2] > -0.02};
};

// A view that puts a world point at a frame pixel with a given zoom.
export const viewAt = (world: [number, number], screen: [number, number], width: number): View => {
  const height = (width * 1920) / 1080;
  return {
    width,
    cx: world[0] - ((screen[0] - 540) / 1080) * width,
    cy: world[1] + ((screen[1] - 960) / 1920) * height,
  };
};

export const mixState = (a: EarthState, b: EarthState, t: number): EarthState => ({
  wrap: lerp(a.wrap, b.wrap, t),
  gores: lerp(a.gores, b.gores, t),
  merc: lerp(a.merc, b.merc, t),
  centerLon: lerp(a.centerLon, b.centerLon, t),
  tilt: lerp(a.tilt, b.tilt, t),
  roll: lerp(a.roll ?? 0, b.roll ?? 0, t),
});

export const mixView = (a: View, b: View, t: number): View => ({
  cx: lerp(a.cx, b.cx, t),
  cy: lerp(a.cy, b.cy, t),
  width: lerp(a.width, b.width, t),
});
