import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {Article} from "./Article";
import {ChapterCard, Credit, Line, Print, Shade} from "./hook";
import {GLOBE, Globe, LabState, PACK, Pin, pinWorld, projectLab, REACTOR, Tag, TAG_AT} from "./Lab3D";
import {CLAMP, LAB, lerp3, sec, SIDE, t01, V3} from "./look";
import {AyahCard, Count, EndScreen, HadithCard, SplitBar, Tagline, TwoSides} from "./parts";

// Chapters 1-9 and the end, 40 s to the end screen (projects/lab-meat/beats.md). Every time is
// a word in vo.wav (work/lab-meat.merged.transcript.json, listed in work/lab-meat.words.txt).

export const VOICE_END = 445.26;
export const TOTAL = 465.3;

// --- Camera ------------------------------------------------------------------------------------

type Pose = {pos: V3; target: V3};
type Shot = {at: number; a: Pose; b: Pose; fov?: number; focus?: V3; bokeh?: number; range?: number};

const P = (pos: V3, target: V3): Pose => ({pos, target});
const G = GLOBE;
// Shots used again and again, each a slow drift from a to b.
const BACKDROP = {a: P([0.0, 1.35, 3.1], [0.4, 0.5, -0.4]), b: P([0.4, 1.3, 2.85], [0.5, 0.5, -0.4]), fov: 32, focus: [0, 0, 6] as V3, bokeh: 5, range: 0.3};
const PRINTS = {a: P([-1.0, 1.3, 2.6], [-1.5, 0.3, -0.5]), b: P([-0.7, 1.25, 2.4], [-1.3, 0.3, -0.5]), fov: 32, focus: [0, 0, 6] as V3, bokeh: 6, range: 0.3};
const GLOBE_SHOT = {a: P([G[0] + 0.2, G[1] + 0.16, G[2] + 1.85], [G[0], G[1] - 0.02, G[2]]), b: P([G[0] - 0.1, G[1] + 0.1, G[2] + 1.68], [G[0], G[1] - 0.02, G[2]]), fov: 30, focus: [G[0], G[1], G[2] + 0.36] as V3, bokeh: 2.2, range: 0.6};
const WINDOW = {a: P([1.36, 0.8, 0.74], [1.72, 0.78, -0.35]), b: P([2.04, 0.88, 0.72], [1.68, 0.8, -0.35]), fov: 30, focus: [1.7, 0.8, 0.07] as V3, bokeh: 2.8, range: 0.5};
const MACRO = {a: P([1.62, 0.62, 0.36], [1.7, 0.7, -0.35]), b: P([1.78, 0.9, 0.34], [1.7, 0.86, -0.35]), fov: 24, focus: [1.7, 0.75, -0.05] as V3, bokeh: 3.2, range: 0.25};
const WIDE = {a: P([0.15, 1.02, 2.45], [1.45, 0.7, -0.4]), b: P([0.45, 1.05, 2.25], [1.5, 0.72, -0.4]), fov: 32, focus: REACTOR, bokeh: 2, range: 1.2};
const DISH = {a: P([0.62, 0.42, 0.66], [0.85, 0.0, 0.2]), b: P([0.98, 0.34, 0.58], [0.85, 0.0, 0.2]), fov: 30, focus: [0.85, 0.0, 0.2] as V3, bokeh: 2.6, range: 0.3};
const TAGS = {a: P([0.0, 0.8, 1.22], [0, 0.12, 0.2]), b: P([0.08, 0.7, 1.04], [0, 0.11, 0.2]), fov: 30, focus: [0, 0, 0.28] as V3, bokeh: 2.4, range: 0.7};
const SHELF = {a: P([PACK[0] - 0.55, 0.36, 1.05], [PACK[0] - 0.2, 0.08, 0.06]), b: P([PACK[0] - 0.07, 0.31, 0.52], [PACK[0] - 0.03, 0.085, 0.07]), fov: 30, focus: [PACK[0] + 0.05, 0.093, 0.09] as V3, bokeh: 1.5, range: 0.4};
const PACK_TOP = {a: P([PACK[0] + 0.05, 0.78, 0.78], [PACK[0], 0.08, 0.05]), b: P([PACK[0] + 0.03, 0.66, 0.62], [PACK[0], 0.08, 0.05]), fov: 30, focus: [PACK[0], 0.1, 0.06] as V3, bokeh: 2, range: 0.3};

const SHOTS: Shot[] = [
  {at: 40.0, ...PRINTS},
  {at: 49.18, ...GLOBE_SHOT},
  {at: 60.9, ...SHELF},
  {at: 64.4, ...BACKDROP},
  {at: 67.36, ...MACRO},
  {at: 74.76, ...WIDE},
  {at: 81.12, ...DISH},
  {at: 85.02, ...DISH, a: P([1.1, 0.3, 0.55], [0.85, 0.0, 0.2]), b: P([0.7, 0.28, 0.5], [0.85, 0.0, 0.2])},
  {at: 94.76, ...WIDE},
  {at: 98.8, ...WINDOW},
  {at: 104.1, ...MACRO},
  {at: 108.6, ...PRINTS},
  {at: 113.5, a: P([-1.6, 0.6, 0.55], [-1.6, 0, 0.05]), b: P([-1.45, 0.5, 0.45], [-1.6, 0, 0.05]), fov: 32, focus: [-1.6, 0, 0.05], bokeh: 2, range: 0.5},
  {at: 117.14, ...SHELF},
  {at: 120.28, ...BACKDROP},
  {at: 130.02, ...BACKDROP},
  {at: 135.72, ...TAGS},
  {at: 157.84, ...TAGS},
  {at: 159.92, ...BACKDROP},
  {at: 163.94, ...PRINTS},
  {at: 171.26, ...BACKDROP},
  {at: 184.56, ...BACKDROP},
  {at: 188.62, ...TAGS},
  {at: 191.66, ...PRINTS},
  {at: 198.98, ...DISH},
  {at: 201.46, ...BACKDROP},
  {at: 204.6, ...GLOBE_SHOT},
  {at: 207.5, ...PRINTS},
  {at: 215.22, ...BACKDROP},
  {at: 221.42, ...DISH},
  {at: 226.66, ...WIDE},
  {at: 231.72, ...GLOBE_SHOT},
  {at: 236.58, ...BACKDROP},
  {at: 241.88, ...PRINTS},
  {at: 249.54, ...MACRO},
  {at: 253.86, ...WINDOW},
  {at: 261.78, ...DISH},
  {at: 265.02, ...BACKDROP},
  {at: 275.88, ...TAGS},
  {at: 280.2, ...WINDOW},
  {at: 290.98, ...BACKDROP},
  {at: 302.14, ...DISH},
  {at: 310.5, ...WIDE},
  {at: 318.68, ...BACKDROP},
  {at: 341.8, ...GLOBE_SHOT},
  {at: 363.32, ...BACKDROP},
  {at: 370.85, ...BACKDROP},
  {at: 389.53, ...GLOBE_SHOT},
  {at: 399.19, ...SHELF},
  {at: 404.05, ...BACKDROP},
  {at: 412.05, ...TAGS},
  {at: 419.51, ...WIDE},
  {at: 421.75, ...SHELF},
  {at: 426.9, ...PACK_TOP},
  {at: 435.07, ...BACKDROP},
];

const ease = Easing.inOut(Easing.sin);
const shotAt = (frame: number) => {
  let i = 0;
  while (i + 1 < SHOTS.length && frame >= sec(SHOTS[i + 1].at)) i++;
  const s = SHOTS[i];
  const end = i + 1 < SHOTS.length ? sec(SHOTS[i + 1].at) : sec(TOTAL);
  const k = interpolate(frame, [sec(s.at), end], [0, 1], {...CLAMP, easing: ease});
  return {s, cam: lerp3(s.a.pos, s.b.pos, k), target: lerp3(s.a.target, s.b.target, k)};
};

// --- The globe ---------------------------------------------------------------------------------

type PinDef = {lat: number; lon: number; at: number; label: string; sub: string; until: number};
const PINS: PinDef[] = [
  {lat: 1.35, lon: 103.82, at: 51.9, label: "Singapore", sub: "December 2020 · first approval", until: 56.3},
  {lat: 39.0, lon: -98.0, at: 56.6, label: "United States", sub: "2023", until: 60.9},
  {lat: 31.5, lon: 34.85, at: 57.3, label: "Israel", sub: "2024", until: 60.9},
  {lat: -25.3, lon: 133.8, at: 58.1, label: "Australia", sub: "2025", until: 60.9},
  {lat: 24.47, lon: 39.61, at: 206.3, label: "Madinah", sub: "", until: 207.5},
  {lat: 3.14, lon: 101.69, at: 233.3, label: "Malaysia · JAKIM", sub: "slaughtered animal required, per reports", until: 236.58},
  {lat: 36.5, lon: 127.9, at: 341.8, label: "South Korea", sub: "Korea Muslim Federation · 2025", until: 344.38},
  {lat: 3.14, lon: 101.69, at: 344.4, label: "Malaysia", sub: "JAKIM, per reports · 2025", until: 353.82},
  {lat: 25.29, lon: 51.53, at: 355.7, label: "Doha", sub: "International Islamic Fiqh Academy · May 2025", until: 363.32},
  {lat: 42.5, lon: 12.5, at: 392.1, label: "Italy", sub: "ban on sale · 2023", until: 399.19},
  {lat: 28.3, lon: -81.7, at: 394.2, label: "Florida", sub: "ban · 2024", until: 399.19},
  {lat: 32.8, lon: -86.8, at: 394.9, label: "Alabama", sub: "ban · 2024", until: 399.19},
];
// What the globe turns to face, and when (it turns over 0.7 s).
const VIEWS: {at: number; lat: number; lon: number}[] = [
  {at: 40, lat: 10, lon: 90},
  {at: 49.6, lat: 5, lon: 103.8},
  {at: 56.3, lat: 30, lon: -98},
  {at: 57.0, lat: 25, lon: 34.8},
  {at: 57.8, lat: -15, lon: 133.8},
  {at: 59.2, lat: 15, lon: 60},
  {at: 204.6, lat: 24, lon: 39.6},
  {at: 231.72, lat: 5, lon: 101.7},
  {at: 341.5, lat: 30, lon: 127.9},
  {at: 344.1, lat: 5, lon: 101.7},
  {at: 355.2, lat: 22, lon: 51.5},
  {at: 389.53, lat: 36, lon: -30},
  {at: 391.8, lat: 40, lon: 12.5},
  {at: 393.8, lat: 32, lon: -84},
];
const globeAt = (frame: number): Globe => {
  let v = {lat: VIEWS[0].lat, lon: VIEWS[0].lon};
  for (const w of VIEWS) {
    if (frame < sec(w.at)) break;
    const k = t01(frame, sec(w.at), sec(w.at) + 21);
    v = {lat: v.lat + (w.lat - v.lat) * k, lon: v.lon + (w.lon - v.lon) * k};
  }
  const pins: Pin[] = PINS.map((p) => ({lat: p.lat, lon: p.lon, k: frame >= sec(p.at) && frame < sec(p.until) + 60 ? t01(frame, sec(p.at), sec(p.at) + 10, Easing.out(Easing.back(2))) : 0, hot: frame < sec(p.until) ? 1 : 0}));
  return {lat: v.lat, lon: v.lon, pins};
};

// --- The tags ----------------------------------------------------------------------------------

// Each tag: when it is on the bench, and when it is lit (the question being asked).
const TAG_LIT: [number, number][][] = [
  // [from, to] windows of light per tag
  [[139.4, 141.3], [148.2, 149.0], [157.84, 160.5], [416.3, 470], [432.7, 470]],
  [[141.4, 143.1], [149.1, 150.6], [188.62, 191.5], [417.6, 470]],
  [[143.2, 145.4], [150.7, 151.4], [275.88, 279.9], [418.6, 470]],
];
const tagAt = (frame: number, i: number): Tag => {
  const t = frame / 30;
  const lit = TAG_LIT[i].some(([a, b]) => t >= a && t < b) ? 1 : 0;
  const prev = TAG_LIT[i].some(([a, b]) => t - 0.4 >= a && t - 0.4 < b) ? 1 : 0;
  return {drop: 0, glow: (lit + prev) / 2};
};
// At the end the tags lift off the bench and settle on the pack's film, one by one.
const ON_PACK: V3[] = [[PACK[0] - 0.1, 0.098, -0.06], [PACK[0] + 0.0, 0.1, 0.07], [PACK[0] + 0.1, 0.102, -0.05]];
const tagPosAt = (frame: number): V3[] | undefined => {
  if (frame < sec(427.2)) return undefined;
  return TAG_AT.map((p, i) => {
    const k = t01(frame, sec(427.2 + i * 0.35), sec(427.2 + i * 0.35) + 16);
    if (k <= 0) return [ON_PACK[i][0], ON_PACK[i][1] + 0.4, ON_PACK[i][2]] as V3;
    return [ON_PACK[i][0], ON_PACK[i][1] + (1 - k) * 0.4, ON_PACK[i][2]] as V3;
  });
};

export const chapterState = (frame: number): LabState => {
  const {s, cam, target} = shotAt(frame);
  const t = frame / 30;
  // The reactor's cells multiply on "do se aath hafte… billions of cells" (104-108.3 s).
  const cells = t < 104.1 || t > 113.5 ? 1 : interpolate(t, [104.1, 104.4, 108.3], [1, 0.08, 1], CLAMP);
  const tagPos = tagPosAt(frame);
  return {
    cam,
    target,
    fov: s.fov ?? 32,
    focus: s.focus ?? target,
    bokeh: s.bokeh,
    range: s.range,
    time: t,
    cells,
    tags: [0, 1, 2].map((i) => tagAt(frame, i)),
    tagPos,
    tagScale: tagPos ? 0.42 : 1,
    shelf: 1,
    globe: globeAt(frame),
  };
};

// --- The 2D layer ------------------------------------------------------------------------------

const GlobeLabels = ({s}: {s: LabState}) => {
  const frame = useCurrentFrame();
  const g = s.globe!;
  return (
    <>
      {PINS.map((p, i) => {
        if (frame < sec(p.at) + 6 || frame >= sec(p.until)) return null;
        const w = pinWorld(g, p.lat, p.lon, 0.07);
        // Only pins on the side facing the lens get a label.
        if (w[2] < GLOBE[2] + 0.05) return null;
        const {x, y} = projectLab(s, w);
        return <Tagline key={i} at={p.at + 0.2} end={p.until} x={x + 26} y={y} name={p.label} sub={p.sub || undefined} />;
      })}
    </>
  );
};

const TagCaptions = ({s, at, end, words}: {s: LabState; at: number; end: number; words: [string, string, string]; }) => {
  const frame = useCurrentFrame();
  if (frame < sec(at) || frame >= sec(end)) return null;
  return (
    <>
      {TAG_AT.map((p, i) => {
        const {x, y} = projectLab(s, [p[0], p[1], p[2] + 0.12]);
        return <Tagline key={i} at={at + i * 0.5} end={end} x={x} y={y + 40} name={words[i]} align="center" size={46} />;
      })}
    </>
  );
};

// Which shots have the lab in focus with words to the side, so the left shade is needed.
const shadeOn = (t: number) => [[60.9, 64.4], [67.36, 81.12], [94.76, 104.1], [113.5, 120.28], [135.72, 139.4], [188.62, 191.66], [198.98, 204.6], [221.42, 231.72], [236.58, 265.02], [275.88, 290.98], [302.14, 318.68], [399.19, 404.05], [412.05, 421.75]].some(([a, b]) => t >= a && t < b);

const MUIS_COND = [
  {kind: "p" as const, segs: [{t: "[…] the Fatwa Committee has concluded that the following conditions must be fulfilled to ensure that cultivated meat is halal for consumption:", group: 1}]},
  {kind: "item" as const, segs: [{t: "i. ", group: 2}, {t: "Cell source must be taken from animals that are halal to consume", mark: 0, group: 2}]},
  {kind: "item" as const, segs: [{t: "ii. ", group: 3}, {t: "Every ingredient that makes up texture and composition of cultivated meat must be halal", mark: 1, group: 3}]},
  {kind: "item" as const, segs: [{t: "iii. ", group: 4}, {t: "Product is non-toxic and clean", mark: 2, group: 4}]},
];
const MUIS = {source: "Majlis Ugama Islam Singapura (MUIS)", kind: "Media release", date: "3 February 2024", title: "Fatwa on cultivated meat"};
const MUIS_CREDIT = "Fatwa · quoted from MUIS, “Fatwa on cultivated meat”, 3 Feb 2024, muis.gov.sg";

export const ChaptersOverlay = ({s}: {s: LabState}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  if (t < 40) return null;
  return (
    <AbsoluteFill>
      {shadeOn(t) ? <Shade side="left" strength={0.7} /> : null}

      {/* 1 · A €250,000 burger (from 40 s) */}
      <Print src="footage/broll-lab-burger-raw.jpg" at={40} end={41.06} tilt={-0.8} w={1000} aspect={622 / 830} x={1100} />
      <Line at={40} end={41.06} y={800} size={76}>
        Not cut from
        <br />
        <span style={{fontStyle: "italic"}}>any animal.</span>
      </Line>
      <Print src="footage/broll-lab-markpost.jpg" at={41.06} end={45.48} tilt={1.2} w={1060} aspect={1618 / 2400} x={1160} pos="50% 35%" />
      <Line at={42.98} end={45.48} y={760} size={78}>
        Mark Post
      </Line>
      <Credit at={41.06} end={45.48}>Maastricht University · Photo: Mosa Meat, CC BY 4.0</Credit>
      <Count at={45.48} end={49.18} from={0} to={250000} prefix="€" dur={2.6} sub="about, for one burger" y={300} />
      <Credit at={45.48} end={49.18}>NPR, 5 August 2013 · reports put it at €250,000–300,000</Credit>
      <GlobeLabels s={s} />
      <Credit at={49.18} end={60.9}>Approvals: Good Food Institute tracker · Al Jazeera, 2 Dec 2020</Credit>
      <Line at={61.4} end={64.4} y={380} size={100}>
        Not science fiction.
        <br />
        <span style={{fontStyle: "italic"}}>A real product.</span>
      </Line>

      {/* 2 · How it is made */}
      <ChapterCard at={64.4} end={66.9} n={2} title="How it is made" />
      <Line at={67.9} end={74.76} y={400} size={100}>
        Meat is made
        <br />
        of <span style={{fontStyle: "italic"}}>cells.</span>
      </Line>
      <Tagline at={72.1} end={74.76} x={SIDE} y={700} name="They grow on food and oxygen." size={52} />
      <Line at={75.3} end={81.12} y={360} size={96}>
        Same food.
        <br />
        Same warmth.
        <br />
        <span style={{fontStyle: "italic"}}>Outside the body.</span>
      </Line>
      <Line at={83.1} end={85.02} y={760} size={84}>
        A <span style={{fontStyle: "italic"}}>tiny</span> sample.
      </Line>
      <Line at={88.2} end={94.76} y={300} size={96}>
        Growth medium
      </Line>
      <Tagline at={90.4} end={94.76} x={SIDE} y={520} name="sugar" size={60} />
      <Tagline at={91.2} end={94.76} x={SIDE + 260} y={520} name="protein" size={60} />
      <Tagline at={91.9} end={94.76} x={SIDE + 560} y={520} name="vitamins" size={60} />
      <Line at={97.4} end={98.8} y={360} size={110}>
        Bioreactor
      </Line>
      <Line at={99.6} end={104.1} y={340} size={96}>
        Body warmth.
      </Line>
      <Tagline at={102.7} end={104.1} x={SIDE} y={520} name="and oxygen" size={60} />
      <Line at={104.1} end={106.6} y={340} size={110}>
        2–8 weeks
      </Line>
      <Line at={106.6} end={108.6} y={340} size={96}>
        A few cells →
        <br />
        <span style={{fontStyle: "italic"}}>billions.</span>
      </Line>
      <Credit at={104.1} end={108.6}>Process: MUIS media release §5, 3 Feb 2024</Credit>
      <Print src="footage/broll-lab-steak.jpg" at={108.6} end={113.5} tilt={0.8} w={1080} aspect={904 / 1499} x={1200} />
      <Credit at={108.6} end={113.5}>Research example: cultured muscle, fat and vessel fibres built into a steak · Kang et al., Nature Communications 2021, CC BY 4.0</Credit>
      <Line at={109.0} end={113.5} y={700} size={72}>
        Shaped for
        <br />
        <span style={{fontStyle: "italic"}}>the texture</span>
        <br />
        <span style={{fontStyle: "italic"}}>of meat.</span>
      </Line>
      <Line at={113.8} end={117.14} y={380} size={100}>
        Lab-grown meat.
        <br />
        Or: <span style={{fontStyle: "italic"}}>cultivated meat.</span>
      </Line>
      <Line at={118.6} end={120.28} y={380} size={104}>
        Still very
        <br />
        <span style={{fontStyle: "italic"}}>expensive.</span>
      </Line>
      <Tagline at={120.6} end={130.02} x={210} y={330} name="The first pack sold in a shop · Singapore, May 2024" size={50} />
      <SplitBar at={124.7} end={130.02} />
      <Credit at={120.28} end={130.02}>GOOD Meat 3 at Huber's Butchery · Food Navigator, 21 May 2024</Credit>

      {/* 3 · Three questions */}
      <ChapterCard at={130.02} end={132.5} n={3} title="Three questions" />
      <Line at={132.6} end={135.72} y={380} size={100}>
        “Halal just means
        <br />
        <span style={{fontStyle: "italic"}}>no pork.”</span>
      </Line>
      <Line at={135.9} end={139.4} y={150} size={96}>
        Islamic law asks
        <br />
        <span style={{fontStyle: "italic", color: LAB.amberLight}}>three</span> things.
      </Line>
      <TagCaptions s={s} at={139.4} end={145.6} words={["which animal", "taken how", "fed on what"]} />
      <TagCaptions s={s} at={145.6} end={151.5} words={["a halal animal", "zabah, done right", "halal fodder"]} />
      <TagCaptions s={s} at={152.0} end={157.84} words={["a cell?", "from a living animal?", "fed what?"]} />

      {/* 4 · Which animal (tag 1) */}
      <ChapterCard at={157.84} end={160.2} n={4} title="Which animal?" />
      <Line at={160.3} end={163.94} y={380} size={92}>
        Here, almost everyone
        <br />
        <span style={{fontStyle: "italic"}}>agrees.</span>
      </Line>
      <Line at={164.2} end={168.38} y={380} size={92}>
        A cell from an animal
        <br />
        that is <span style={{fontStyle: "italic"}}>halal to eat.</span>
      </Line>
      <Print src="footage/broll-lab-hen.jpg" at={168.38} end={169.1} tilt={-1.2} w={1100} aspect={9 / 16} x={1000} pos="50% 45%" />
      <Print src="footage/broll-lab-goat.jpg" at={169.1} end={169.5} tilt={1} w={1100} aspect={9 / 16} x={1000} pos="50% 40%" />
      <Print src="footage/broll-lab-cow.jpg" at={169.5} end={170.0} tilt={-0.6} w={1100} aspect={9 / 16} x={1000} pos="50% 60%" />
      <Print src="footage/broll-lab-pig.jpg" at={170.0} end={171.26} tilt={0.8} w={1100} aspect={9 / 16} x={1000} pos="55% 60%" />
      <Tagline at={168.4} end={170.0} x={SIDE} y={880} name="Chicken · goat · cow: yes" size={52} />
      <Tagline at={170.4} end={171.26} x={SIDE} y={880} name="Pig: no" size={52} />
      <Credit at={168.38} end={171.26}>Photos: Wikimedia Commons (CC0, CC BY-SA)</Credit>
      <Line at={171.4} end={176.06} y={380} size={88}>
        “In the lab, the cell
        <br />
        becomes <span style={{fontStyle: "italic"}}>something new.”</span>
      </Line>
      <Line at={176.06} end={180.2} y={360} size={120}>
        <span style={{fontStyle: "italic"}}>Istihala</span>
      </Line>
      <Tagline at={178.5} end={180.2} x={SIDE} y={540} name="complete transformation (a fiqh term)" size={52} />
      <Line at={180.2} end={184.56} y={360} size={92}>
        A disputed argument.
        <br />
        <span style={{fontStyle: "italic"}}>Major fatwa bodies did not adopt it.</span>
      </Line>
      <Article from={184.56} to={188.62} {...MUIS} title="Fatwa on cultivated meat" blocks={MUIS_COND} marks={[{at: 185.9, dur: 1.6}, {at: 999, dur: 1}, {at: 999, dur: 1}]} focus={[{at: 184.56, y: 700, scale: 1.05}]} dims={[{at: 184.56, keep: [2], to: 0.3}]} />
      <Credit at={184.56} end={188.62} top>
        {MUIS_CREDIT}
      </Credit>

      {/* 5 · Taken from a living animal (tag 2) */}
      <ChapterCard at={188.62} end={191.2} n={5} title="From a living animal?" />
      <Print src="footage/broll-lab-cow.jpg" at={191.66} end={198.98} tilt={-0.8} w={1180} aspect={9 / 16} x={1040} pos="50% 62%" />
      <Line at={194.6} end={198.98} y={800} size={76}>
        A needle, a little tissue.
        <br />
        <span style={{fontStyle: "italic"}}>The animal walks on.</span>
      </Line>
      <Credit at={191.66} end={198.98}>Photo: Ajznponar, CC0</Credit>
      <Line at={199.4} end={201.46} y={380} size={100}>
        Sounds <span style={{fontStyle: "italic"}}>kind.</span>
      </Line>
      <Line at={201.6} end={204.6} y={380} size={92}>
        But one hadith
        <br />
        <span style={{fontStyle: "italic"}}>matters here.</span>
      </Line>
      <GlobeLabels s={s} />
      <Print src="footage/broll-lab-camel.jpg" at={207.5} end={209.6} tilt={-1} w={1120} aspect={9 / 16} x={1040} pos="50% 40%" />
      <Print src="footage/broll-lab-sheep.jpg" at={209.6} end={215.22} tilt={0.8} w={1120} aspect={9 / 16} x={1040} pos="50% 70%" />
      <Line at={211.9} end={215.22} y={820} size={72}>
        The animal lived.
        <br />
        <span style={{fontStyle: "italic"}}>The piece was eaten.</span>
      </Line>
      <Credit at={207.5} end={215.22}>Photos: shankar s., CC BY 2.0 · Ian Alexander, CC BY-SA 3.0</Credit>
      <HadithCard at={215.22} end={221.42} markAt={218.6} />
      <Line at={221.6} end={226.66} y={360} size={84}>
        “A cell from a living animal
        <br />
        <span style={{fontStyle: "italic"}}>is a cut part too.”</span>
      </Line>
      <Tagline at={222.0} end={226.66} x={SIDE} y={600} name="some scholars" size={48} />
      <Line at={227.0} end={231.72} y={360} size={92}>
        So: only from an animal
        <br />
        <span style={{fontStyle: "italic"}}>slaughtered properly.</span>
      </Line>
      <GlobeLabels s={s} />
      <Credit at={231.72} end={236.58}>FoodBev, 17 Dec 2025 · Green Queen · the Malay fatwa text itself was not opened</Credit>
      <Line at={237.0} end={241.88} y={330} size={88}>
        American Fiqh Academy:
        <br />
        <span style={{fontStyle: "italic"}}>from a living animal, not halal.</span>
      </Line>
      <Credit at={236.58} end={241.88}>“Test-tube Turkey”, 2018 · via Hamdan et al., Heliyon 2024 (review)</Credit>
      <Print src="footage/broll-lab-sheep.jpg" at={241.88} end={249.54} tilt={-0.8} w={1080} aspect={9 / 16} x={1180} pos="50% 70%" />
      <Line at={242.0} end={249.54} y={700} size={68}>
        Other scholars:
        <br />
        <span style={{fontStyle: "italic"}}>the hadith is about</span>
        <br />
        <span style={{fontStyle: "italic"}}>a piece, eaten as it is.</span>
      </Line>
      <Line at={249.8} end={253.86} y={340} size={88}>
        A microscopic cell,
        <br />
        grown for weeks:
        <br />
        <span style={{fontStyle: "italic"}}>a different thing.</span>
      </Line>
      <Line at={254.2} end={261.78} y={330} size={84}>
        Dr Abdul Qahir Qamar
      </Line>
      <Tagline at={256.4} end={261.78} x={SIDE} y={470} name="then Director of Fatwa, International Islamic Fiqh Academy" size={44} />
      <Tagline at={260.4} end={261.78} x={SIDE} y={590} name="its life is like a plant's" size={56} />
      <Line at={262.2} end={265.02} y={360} size={110}>
        “like yogurt
        <br />
        <span style={{fontStyle: "italic"}}>and pickles”</span>
      </Line>
      <Credit at={253.86} end={265.02}>Interview (Billinghurst), cited in Hamdan et al., Heliyon 2024, Table 2</Credit>
      <Article from={265.02} to={271.0} {...MUIS} blocks={MUIS_COND} marks={[{at: 267.2, dur: 1.0}, {at: 999, dur: 1}, {at: 999, dur: 1}]} focus={[{at: 265.02, y: 700, scale: 1.05}]} dims={[{at: 265.02, keep: [2], to: 0.3}]} />
      <Credit at={265.02} end={271.0} top>
        {MUIS_CREDIT} · no slaughter condition in it
      </Credit>
      <TwoSides
        at={271.0}
        end={275.88}
        left={{
          title: "A slaughtered animal only",
          voices: [
            {at: 271.0, name: "JAKIM, Malaysia", note: "per reports"},
            {at: 271.0, name: "American Fiqh Academy", note: "2018"},
          ],
        }}
        right={{
          title: "A living animal can be the source",
          at: 271.0,
          voices: [
            {at: 271.0, name: "Dr Abdul Qahir Qamar", note: "then IIFA fatwa director"},
            {at: 271.0, name: "MUIS, Singapore", note: "fatwa, 2024"},
          ],
        }}
        lit={[{at: 271.0, side: "both"}]}
      />
      <Line at={271.0} end={275.88} y={830} size={64}>
        Scholars are not of one view. <span style={{fontStyle: "italic", color: LAB.amberLight}}>Both sides have evidence.</span>
      </Line>

      {/* 6 · What the cells are fed (tag 3) */}
      <ChapterCard at={275.88} end={278.4} n={6} title="Fed on what?" />
      <Line at={280.6} end={286.36} y={360} size={92}>
        The growth medium.
      </Line>
      <Line at={286.36} end={290.98} y={340} size={100}>
        Fetal bovine serum
      </Line>
      <Tagline at={287.6} end={290.98} x={SIDE} y={520} name="from the blood of an unborn calf" size={56} />
      <AyahCard ayahKey="5:3" at={290.98} end={296.9} translation={["Prohibited to you are dead animals, ", "blood", " …"]} markAt={291.5} credit="Al-Ma'idah 5:3, opening words · translation: Sahih International" />
      <Line at={296.9} end={298.92} y={360} size={88}>
        Every scholar who allows it
        <br />
        <span style={{fontStyle: "italic"}}>adds one condition.</span>
      </Line>
      <Line at={298.92} end={302.14} y={360} size={96}>
        Serum from blood?
        <br />
        <span style={{fontStyle: "italic", color: LAB.amberLight}}>Then not halal.</span>
      </Line>
      <Line at={302.6} end={310.5} y={360} size={92}>
        Now: <span style={{fontStyle: "italic"}}>serum-free</span>
        <br />
        media.
      </Line>
      <Tagline at={305.3} end={310.5} x={SIDE} y={620} name="no animal serum in it" size={52} />
      <Line at={310.5} end={318.68} y={300} size={88}>
        Every ingredient,
        <br />
        <span style={{fontStyle: "italic"}}>its source checked.</span>
      </Line>
      <Tagline at={313.6} end={318.68} x={SIDE} y={560} name="growth factors" size={56} />
      <Tagline at={314.5} end={318.68} x={SIDE + 380} y={560} name="enzymes" size={56} />
      <Tagline at={317.1} end={318.68} x={SIDE} y={680} name="→ halal certification" size={56} />

      {/* 7 · What the fatwas said */}
      <ChapterCard at={318.68} end={321.4} n={7} title="What the fatwas said" />
      <Article
        from={321.74}
        to={341.8}
        {...MUIS}
        blocks={[
          ...MUIS_COND,
          {kind: "gap"},
          {kind: "p", segs: [{t: "6. The fatwa on cultivated meat is underpinned by the Islamic principles that it serves to (i) ", group: 5}, {t: "preserve human life", mark: 3, group: 5}, {t: "; and (ii) ", group: 5}, {t: "protect the environment", mark: 4, group: 5}, {t: ". The fatwa also considers the Islamic legal principle that ", group: 5}, {t: "unless proven otherwise, whatever is beneficial is permissible.", mark: 5, group: 5}]},
        ]}
        marks={[{at: 327.6, dur: 1.2}, {at: 328.9, dur: 1.4}, {at: 330.5, dur: 1.2}, {at: 333.0, dur: 1.0}, {at: 334.7, dur: 0.9}, {at: 337.6, dur: 3.2, color: "amber"}]}
        focus={[{at: 321.74, y: 420, scale: 1.0}, {at: 331.8, y: 1020, scale: 1.08, frames: 30}]}
        dims={[{at: 321.74, keep: [1, 2, 3, 4], to: 0.3}, {at: 331.8, keep: [5], to: 0.25}]}
      />
      <Credit at={321.74} end={341.8} top>
        {MUIS_CREDIT}
      </Credit>
      <Credit at={341.8} end={363.32}>Korea Muslim Federation: Genetic Literacy Project, 26 Mar 2025 · JAKIM: FoodBev, 17 Dec 2025</Credit>
      <Tagline at={359.0} end={363.32} x={SIDE} y={190} name="The OIC's fiqh academy, heard by many Muslim countries" size={46} />
      <Article
        from={363.32}
        to={370.85}
        source="International Islamic Fiqh Academy (OIC)"
        kind="Resolution No. 265 (10/26)"
        date="Doha, 4–8 May 2025"
        title="Cultivated meat"
        blocks={[
          {kind: "p", segs: [{t: "Third: ", group: 1}, {t: "It is permissible to consume and market cultivated meat", mark: 0, group: 1}, {t: " under the following conditions:", group: 1}]},
          {kind: "item", segs: [{t: "1. The cells must be derived from an animal that is lawful to eat ", group: 2}, {t: "if it is alive", mark: 1, group: 2}, {t: ", or from an [animal] that has been slaughtered according to Islamic law ", group: 2}, {t: "in cases where such slaughtering is required.", mark: 2, group: 2}]},
          {kind: "item", segs: [{t: "2. The cultivation must not be done in a prohibited medium (e.g., ", group: 3}, {t: "flowing blood", mark: 3, group: 3}, {t: "), nor include any prohibited substances (e.g., gelatin derived from pigs).", group: 3}]},
          {kind: "item", segs: [{t: "3. The entire cultivation process must be supervised by a credible, specialized authority.", group: 4}]},
        ]}
        marks={[{at: 366.9, dur: 1.6, color: "amber"}, {at: 368.4, dur: 0.8}, {at: 369.0, dur: 1.0}, {at: 369.9, dur: 0.6}]}
        focus={[{at: 363.32, y: 520, scale: 0.9}]}
      />
      <Credit at={363.32} end={370.85} top>
        Resolution · quoted from iifa-aifi.org, posted 20 Nov 2025 · “[animal]” corrects a typo in the source
      </Credit>

      {/* 8 · Fatwa vs certificate */}
      <ChapterCard at={370.85} end={373.4} n={8} title="Fatwa vs certificate" />
      <Line at={373.8} end={378.07} y={330} size={96}>
        A fatwa: <span style={{fontStyle: "italic"}}>a principle.</span>
      </Line>
      <Line at={375.43} end={378.07} y={470} size={96}>
        A certificate: <span style={{fontStyle: "italic", color: LAB.amberLight}}>a product.</span>
      </Line>
      <Line at={378.07} end={382.45} y={360} size={88}>
        Certification needs
        <br />
        <span style={{fontStyle: "italic"}}>stricter rules.</span>
      </Line>
      <Line at={382.45} end={387.31} y={360} size={88}>
        In 2024, no product
        <br />
        <span style={{fontStyle: "italic"}}>met them yet.</span>
      </Line>
      <Credit at={378.07} end={387.31}>MUIS, 3 Feb 2024 · Food Navigator, 12 Feb 2024</Credit>
      <Line at={387.31} end={389.53} y={300} size={96}>
        The fatwa
        <br />
        <span style={{fontStyle: "italic"}}>opened a door.</span>
      </Line>
      <Tagline at={387.9} end={389.53} x={SIDE} y={620} name="17 Nov 2026: UPSIDE Foods (USA) says its chicken got the first halal certificate" sub="Circle H · the company's announcement, not yet independently checked" size={40} />
      <Credit at={389.53} end={399.19}>Italy, 2023 · Florida and Alabama, 2024 · Fortune, 31 May 2024</Credit>
      <Line at={399.4} end={404.05} y={360} size={88}>
        The reason was not religion:
        <br />
        <span style={{fontStyle: "italic"}}>farmers and food culture.</span>
      </Line>

      {/* 9 · The real lesson */}
      <ChapterCard at={404.05} end={406.27} n={9} title="The real lesson" />
      <Line at={406.27} end={409.47} y={380} size={92}>
        Not: <span style={{fontStyle: "italic"}}>“new, so haram.”</span>
      </Line>
      <Line at={409.47} end={412.05} y={380} size={92}>
        Not: <span style={{fontStyle: "italic"}}>“no pork, so fine.”</span>
      </Line>
      <Line at={412.3} end={416.29} y={300} size={88}>
        The same three questions,
        <br />
        <span style={{fontStyle: "italic"}}>asked for centuries.</span>
      </Line>
      <TagCaptions s={s} at={416.29} end={419.51} words={["which animal", "taken how", "fed on what"]} />
      <Line at={419.51} end={421.75} y={360} size={110}>
        The machine is new.
        <br />
        <span style={{fontStyle: "italic", color: LAB.amberLight}}>The questions are old.</span>
      </Line>
      <Line at={425.1} end={432.69} y={770} size={70}>
        Don't read one word on the label.
        <br />
        <span style={{fontStyle: "italic"}}>Ask all three.</span>
      </Line>
      <Tagline at={428.6} end={432.69} x={SIDE} y={970} name="Then trust a reliable halal certificate, and your mufti." size={42} />
      <Line at={432.69} end={435.07} y={380} size={110}>
        New technology.
        <br />
        <span style={{fontStyle: "italic", color: LAB.amberLight}}>Same three questions.</span>
      </Line>

      <EndScreen ctaAt={435.3} askAt={440.53} endAt={VOICE_END + 0.3} total={TOTAL} />
    </AbsoluteFill>
  );
};

export const _keep = React;

// --- Sound map, 40 s to the end (beats.md, Sound column; SOUND.md) -----------------------------
// Each cue has its cause on screen. Impacts: 17.15 (hook), 45.6 (€250,000), 419.5 (the turn).
// Nothing plays under the Ayah card (290.98-293.6); the room bed leaves 10 frames before it
// and before the payoff line (432.69), and comes back after.
export const CHAPTER_CUES: {at: number; sound: string; volume: number}[] = [
  {at: 41.06, sound: "paper-slide-2", volume: 0.35},
  {at: 45.6, sound: "impact", volume: 0.28},
  {at: 49.18, sound: "whoosh-3", volume: 0.2},
  {at: 51.95, sound: "tick-soft-1", volume: 0.32},
  {at: 56.65, sound: "tick-soft-2", volume: 0.32},
  {at: 57.35, sound: "tick-soft-3", volume: 0.32},
  {at: 58.15, sound: "tick-soft-1", volume: 0.32},
  {at: 60.9, sound: "whoosh-2", volume: 0.2},
  {at: 64.4, sound: "page-turn-1", volume: 0.3},
  {at: 67.36, sound: "whoosh-3", volume: 0.18},
  {at: 81.12, sound: "whoosh-2", volume: 0.18},
  {at: 90.45, sound: "tick-soft-2", volume: 0.3},
  {at: 91.25, sound: "tick-soft-3", volume: 0.3},
  {at: 91.95, sound: "tick-soft-1", volume: 0.3},
  {at: 94.76, sound: "whoosh-3", volume: 0.18},
  {at: 108.6, sound: "paper-slide-1", volume: 0.32},
  {at: 124.8, sound: "tick-soft-2", volume: 0.3},
  {at: 130.02, sound: "page-turn-2", volume: 0.3},
  {at: 139.45, sound: "tick-soft-1", volume: 0.32},
  {at: 141.45, sound: "tick-soft-2", volume: 0.32},
  {at: 143.25, sound: "tick-soft-3", volume: 0.32},
  {at: 157.84, sound: "page-turn-1", volume: 0.3},
  {at: 168.4, sound: "paper-slide-1", volume: 0.3},
  {at: 170.0, sound: "paper-slide-2", volume: 0.3},
  {at: 184.56, sound: "paper-slide-1", volume: 0.32},
  {at: 185.9, sound: "pen-circle-1", volume: 0.28},
  {at: 188.62, sound: "page-turn-2", volume: 0.3},
  {at: 191.66, sound: "paper-slide-2", volume: 0.3},
  {at: 204.6, sound: "whoosh-3", volume: 0.18},
  {at: 206.35, sound: "tick-soft-1", volume: 0.3},
  {at: 207.5, sound: "paper-slide-1", volume: 0.3},
  {at: 215.22, sound: "paper-slide-2", volume: 0.3},
  {at: 218.6, sound: "pen-circle-2", volume: 0.26},
  {at: 221.42, sound: "whoosh-2", volume: 0.18},
  {at: 241.9, sound: "tick-soft-2", volume: 0.28},
  {at: 271.0, sound: "tick-soft-3", volume: 0.28},
  {at: 275.88, sound: "page-turn-1", volume: 0.3},
  {at: 286.4, sound: "tick-soft-1", volume: 0.28},
  {at: 302.14, sound: "whoosh-3", volume: 0.18},
  {at: 313.65, sound: "tick-soft-2", volume: 0.28},
  {at: 314.55, sound: "tick-soft-3", volume: 0.28},
  {at: 318.68, sound: "page-turn-2", volume: 0.3},
  {at: 321.74, sound: "paper-slide-1", volume: 0.32},
  {at: 327.6, sound: "pen-circle-1", volume: 0.24},
  {at: 328.9, sound: "pen-circle-2", volume: 0.24},
  {at: 330.5, sound: "pen-circle-3", volume: 0.24},
  {at: 337.6, sound: "pen-circle-1", volume: 0.24},
  {at: 341.85, sound: "tick-soft-1", volume: 0.3},
  {at: 344.45, sound: "tick-soft-2", volume: 0.3},
  {at: 355.75, sound: "tick-soft-3", volume: 0.3},
  {at: 363.32, sound: "paper-slide-2", volume: 0.32},
  {at: 366.9, sound: "pen-circle-2", volume: 0.24},
  {at: 370.85, sound: "page-turn-1", volume: 0.3},
  {at: 387.9, sound: "tick-soft-1", volume: 0.28},
  {at: 392.15, sound: "tick-soft-2", volume: 0.3},
  {at: 394.25, sound: "tick-soft-3", volume: 0.3},
  {at: 394.95, sound: "tick-soft-1", volume: 0.3},
  {at: 404.05, sound: "page-turn-2", volume: 0.3},
  {at: 416.35, sound: "tick-soft-1", volume: 0.3},
  {at: 417.65, sound: "tick-soft-2", volume: 0.3},
  {at: 418.65, sound: "tick-soft-3", volume: 0.3},
  {at: 419.5, sound: "impact", volume: 0.26},
  {at: 421.75, sound: "cloth", volume: 0.26},
  {at: 427.2, sound: "tick-soft-2", volume: 0.26},
  {at: 427.55, sound: "tick-soft-3", volume: 0.26},
  {at: 427.9, sound: "tick-soft-1", volume: 0.26},
  {at: 440.53, sound: "tick-soft-2", volume: 0.26},
];

// The room bed: in after the cut to the lab (2.2 s), out for the Ayah and the payoff line.
export const bedVolume = (f: number) => {
  const t = f / 30;
  const base = interpolate(t, [2.2, 2.6], [0, 0.07], CLAMP);
  const ayah = interpolate(t, [290.65, 290.98, 296.9, 297.23], [1, 0, 0, 1], CLAMP);
  const payoff = interpolate(t, [432.36, 432.69, 435.07, 435.4], [1, 0, 0, 1], CLAMP);
  return base * ayah * payoff;
};
