// "Duniya ki sabse purani university?" graphics (projects/oldest-university/beats.md).
// Every `at` is a source time on the take: the spoken word the beat lands on.

import type {Sound} from "./sfx";

type Timed = {start: number; end: number};
export type UniSound = {at: number; sound: Sound; volume?: number};
export type LatLon = [number, number];

// Where the camera hangs over the globe. `lat`/`lon` is the point looked at; `alt` the
// distance above it in Earth radii; `tilt` degrees from straight down (leaning back to the
// south of the point); `heading` turns the view (0 = north up). `x`/`y` move the looked-at
// point on screen (pixels from the canvas centre, + right/down). `arc` lifts the camera this many
// radii halfway through the move into this key (a flight, not a slide).
export type GlobeKey = {at: number; lat: number; lon: number; alt: number; tilt?: number; heading?: number; x?: number; y?: number; arc?: number; move?: number};

// A photo standing on the globe like a print hinged at its pin: lying flat until `at`,
// standing and facing the camera `flip` frames later. `height` in Earth radii.
export type GlobeCard = {id: string; src: string; place: LatLon; at: number; height: number; aspect?: number; flip?: number};
export type GlobePin = {place: LatLon; at: number};
// A place name set beside a card or pin, projected from the globe each frame.
// `until`: the name leaves as the camera flies off.
export type GlobeLabel = {text: string; sub?: string; place: LatLon; at: number; until?: number; side?: "left" | "right" | "below"; lift?: number};
// A journey drawn on the globe through its waypoints, along great circles, from `at` over
// `draw` seconds; a light rides its head while it draws.
export type GlobeRoute = {points: LatLon[]; at: number; draw: number; dash?: boolean};
// A line set big on the frame (a year, a phrase), at `y` from the top.
export type UTitle = {text: string; sub?: string; at: number; until?: number; x?: number; y: number; size?: number};

// The opening board under the speaker (stack layout). "open": two photos side by side with
// the hook line, cutting to the turning globe at `globeAt`. "faceoff": the two photos fly
// in and push against each other. "photo": real photos in the board, cut on `at`, with
// labels and hand-drawn rings. "page": a name set on paper with its source, a coin
// spinning in beside it.
export type UStackOverlay = Timed & {
  type: "ustack";
  mode: "open" | "faceoff" | "photo" | "page";
  left?: {src: string; label?: string; focus?: [number, number]};
  right?: {src: string; label?: string; focus?: [number, number]};
  line?: string;
  globeAt?: number;
  pins?: GlobePin[];
  shots?: UShot[];
  labels?: {text: string; at: number; x: number; y: number}[];
  rings?: {x: number; y: number; rx: number; ry: number; at: number}[];
  credit?: string;
  page?: {name: string; arabic?: string; credit: string; coin?: {src: string; at: number; label: string}};
  sounds?: UniSound[];
};

// The globe filling the frame; `uglobepip` keeps the speaker in the corner circle, `uglobe`
// covers the frame.
export type UGlobeOverlay = Timed & {
  type: "uglobe" | "uglobepip";
  keys: GlobeKey[];
  cards?: GlobeCard[];
  pins?: GlobePin[];
  labels?: GlobeLabel[];
  routes?: GlobeRoute[];
  titles?: UTitle[];
  credit?: string;
  sounds?: UniSound[];
};

// Words in the clear wall above the cap while the speaker fills the frame: two small photo
// cards and a line, then a question over each card.
export type UWallOverlay = Timed & {
  type: "uwall";
  cards: {src: string; name: string}[];
  line?: {text: string; at: number};
  questions?: {text: string; at: number}[];
  sounds?: UniSound[];
};

// A still on screen from `at`: it pushes from `zoom` to `to` about `focus` over the shot.
export type UShot = {at: number; src: string; focus?: [number, number]; zoom?: number; to?: number};

// Real photos filling the frame. `uphoto` covers it (speaker off screen); `uphotopip`
// keeps the speaker in the corner circle. `drain`: the colour drains from `at` over
// `over` seconds. `counter`: a year running from `from` to `to`. `quote`: a real quote
// set over the darkened picture with a phrase marked when it is spoken.
export type UPhotoOverlay = Timed & {
  type: "uphoto" | "uphotopip";
  shots: UShot[];
  dim?: number;
  drain?: {at: number; over: number; to?: number};
  counter?: {from: number; to: number; at: number; over: number; prefix?: string; suffix?: string; y: number};
  titles?: UTitle[];
  quote?: {text: string; mark?: {text: string; at: number}; at: number; y: number};
  credit?: string;
  creditY?: number;
  sounds?: UniSound[];
};

// A coin spinning in, in 3D, over whatever is under it. `x`/`y` its centre, `size` its
// diameter (px). `metal` tints its rim.
export type UCoinOverlay = Timed & {
  type: "ucoin";
  src: string;
  at: number;
  x: number;
  y: number;
  size: number;
  metal: "gold" | "silver";
  label?: string;
  sounds?: UniSound[];
};

// The 80 small viharas Dharmasvamin found in 1235, as an illustrative model: every block
// lit, then all but two go dark on `darkAt`.
export type UBlocksOverlay = Timed & {
  type: "ublocks";
  count: number;
  keep: number;
  darkAt: number;
  line: UTitle;
  credit: string;
  sounds?: UniSound[];
};

// Two paths running across a floor in perspective: one breaks off, one keeps going.
// Years on the floor; the camera tracks the running head.
export type UTimelineOverlay = Timed & {
  type: "utimeline";
  broken: {name: string; from: number; to: number; at: number};
  running: {name: string; from: number; to: number; at: number; until: number};
  title: UTitle;
  credit?: string;
  sounds?: UniSound[];
};

export type UniOverlay =
  | UStackOverlay
  | UGlobeOverlay
  | UWallOverlay
  | UPhotoOverlay
  | UCoinOverlay
  | UBlocksOverlay
  | UTimelineOverlay;
