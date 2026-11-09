// "America mein qibla north-east kyun?" (projects/qibla-north-east/beats.md, Look).
// A navigator's chart: warm chart paper (the creator's pale wall reads as the same
// page), navy ink, a muted grey, and one accent. The accent means one thing only: the
// true qibla direction (the string on the globe, the NE needle, the 56° mark, the tick).
// The flat map's straight line is always white or ink, never the accent.
export const PAPER = "#F3EEE4";
export const PAPER_DEEP = "#E6DECF";
export const CARD = "#FBF8F2";
export const INK = "#10203A";
export const MUTED = "#6B6F78";
export const QIBLA = "#FF6B1A";
export const OCEAN = "#0B1E33";

// Three type roles: words in Inter Tight, every number and bearing in IBM Plex Mono,
// Arabic in Amiri Quran (theme.ts). The caption look (ledger) uses the same two Latin faces.
export {SANS, MONO, arrive, leave} from "../yawm/look";

// Text that has to be read stays inside y 168-1330 and clear of the right rail below
// mid-frame.
export const TEXT_TOP = 236;
export const TEXT_BOTTOM = 1326;
export const SIDE = 70;
export const RAIL = 140;

export type LatLon = [number, number];

export const KAABA: LatLon = [21.422487, 39.826206];
export const WASHINGTON: LatLon = [38.917, -77.056]; // Islamic Center, 2551 Massachusetts Ave NW
export const ANCHORAGE: LatLon = [61.2181, -149.9003];

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

// Unit vector of a point on the sphere: x towards 0°E on the equator, y to the North
// Pole, z towards 90°W, so three.js sees longitude increasing anticlockwise from above.
export const toVector = ([lat, lon]: LatLon): [number, number, number] => [
  Math.cos(rad(lat)) * Math.cos(rad(lon)),
  Math.sin(rad(lat)),
  -Math.cos(rad(lat)) * Math.sin(rad(lon)),
];

const toLatLon = ([x, y, z]: [number, number, number]): LatLon => [deg(Math.asin(Math.max(-1, Math.min(1, y)))), deg(Math.atan2(-z, x))];

// Points along the great circle (the tight string) from a to b, by slerp.
export const greatCircle = (a: LatLon, b: LatLon, steps = 160): LatLon[] => {
  const va = toVector(a);
  const vb = toVector(b);
  const dot = va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2];
  const omega = Math.acos(Math.max(-1, Math.min(1, dot)));
  return Array.from({length: steps + 1}, (_, i) => {
    const t = i / steps;
    const s1 = Math.sin((1 - t) * omega) / Math.sin(omega);
    const s2 = Math.sin(t * omega) / Math.sin(omega);
    return toLatLon([s1 * va[0] + s2 * vb[0], s1 * va[1] + s2 * vb[1], s1 * va[2] + s2 * vb[2]]);
  });
};

// Initial great-circle bearing, degrees clockwise from true north (projects/qibla-north-east/make_maps.py
// prints the same numbers: Washington 56.5°, Anchorage 350.9°).
export const bearing = (a: LatLon, b: LatLon) => {
  const p1 = rad(a[0]);
  const p2 = rad(b[0]);
  const dl = rad(b[1] - a[1]);
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return (deg(Math.atan2(y, x)) + 360) % 360;
};

// The classroom map (public/footage/qb-mercator.jpg, made by make_maps.py): Mercator,
// 180°W-180°E, 62°S-80°N, 3600 x 2192 px.
export const MERC = {south: -62, north: 80, width: 3600, height: 2192};
export const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2));
// A point on the map picture as fractions 0..1 of its width and height.
export const mercPoint = ([lat, lon]: LatLon): [number, number] => {
  const top = mercY(MERC.north);
  const bottom = mercY(MERC.south);
  return [(lon + 180) / 360, (top - mercY(lat)) / (top - bottom)];
};
