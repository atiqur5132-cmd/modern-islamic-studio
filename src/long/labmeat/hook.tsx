import React from "react";
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {Article} from "./Article";
import {LabState, PACK, PRINT, REACTOR, Tag} from "./Lab3D";
import {arrive, CLAMP, H, LAB, leave, lerp3, SANS, sec, SERIF, SIDE, t01, V3} from "./look";

// The hook and the start of chapter 1, 0-40 s (projects/lab-meat/beats.md, "Hook storyboard").
// Times are the voice's words in vo.wav (work/lab-meat.merged.transcript.json).

export const HOOK_END = 40;

type Shot = {at: number; a: {pos: V3; target: V3}; b: {pos: V3; target: V3}; fov?: number; focus?: V3; bokeh?: number; range?: number};

// Each shot opens on a hard cut and drifts from `a` to `b` until the next one.
const SHOTS: Shot[] = [
  {at: 0, a: {pos: [-1.6, 0.62, 0.22], target: [-1.6, 0, 0.04]}, b: {pos: [-1.6, 0.62, 0.22], target: [-1.6, 0, 0.04]}},
  {at: 2.24, a: {pos: [-1.6, 0.6, 0.2], target: [-1.6, 0, 0.04]}, b: {pos: [-1.0, 1.15, 1.6], target: [-0.9, 0.22, -0.3]}, fov: 34, focus: [-1.5, 0, 0.05], bokeh: 2.2, range: 1.4},
  {at: 4.72, a: {pos: [1.36, 0.8, 0.74], target: [1.72, 0.78, -0.35]}, b: {pos: [2.04, 0.88, 0.72], target: [1.68, 0.8, -0.35]}, fov: 30, focus: [1.7, 0.8, 0.07], bokeh: 2.8, range: 0.5},
  {at: 6.8, a: {pos: [0.0, 1.35, 3.1], target: [0.4, 0.5, -0.4]}, b: {pos: [0.4, 1.3, 2.85], target: [0.5, 0.5, -0.4]}, fov: 32, focus: [0, 0, 5], bokeh: 5, range: 0.3},
  {at: 18.36, a: {pos: [0.15, 1.02, 2.45], target: [1.45, 0.7, -0.4]}, b: {pos: [0.45, 1.05, 2.25], target: [1.5, 0.72, -0.4]}, fov: 32, focus: REACTOR, bokeh: 2, range: 1.2},
  {at: 19.86, a: {pos: [0.0, 0.8, 1.22], target: [0, 0.02, 0.27]}, b: {pos: [0.08, 0.7, 1.04], target: [0, 0.02, 0.27]}, fov: 30, focus: [0, 0, 0.28], bokeh: 2.4, range: 0.7},
  {at: 25.9, a: {pos: [PACK[0] - 0.55, 0.36, 1.05], target: [PACK[0] - 0.2, 0.08, 0.06]}, b: {pos: [PACK[0] - 0.07, 0.31, 0.52], target: [PACK[0] - 0.03, 0.085, 0.07]}, fov: 30, focus: [PACK[0] + 0.05, 0.093, 0.09], bokeh: 1.5, range: 0.4},
  {at: 30.5, a: {pos: [-1.0, 1.3, 2.6], target: [-1.5, 0.3, -0.5]}, b: {pos: [-0.7, 1.25, 2.4], target: [-1.3, 0.3, -0.5]}, fov: 32, focus: [0, 0, 6], bokeh: 6, range: 0.3},
];

const ease = Easing.inOut(Easing.sin);

const shotAt = (frame: number) => {
  let i = 0;
  while (i + 1 < SHOTS.length && frame >= sec(SHOTS[i + 1].at)) i++;
  const s = SHOTS[i];
  const end = i + 1 < SHOTS.length ? sec(SHOTS[i + 1].at) : sec(HOOK_END);
  const k = interpolate(frame, [sec(s.at), end], [0, 1], {...CLAMP, easing: ease});
  return {s, cam: lerp3(s.a.pos, s.b.pos, k), target: lerp3(s.a.target, s.b.target, k)};
};

// The three tags drop onto the bench on "Islam ise kis nazar se dekhta hai"; the first lights
// on "ek baat par" (where scholars agree); the second rocks on "kahan alag".
const TAG_DROP = [19.86, 20.46, 21.08];
const tagAt = (frame: number, i: number): Tag => {
  const at = sec(TAG_DROP[i]);
  if (frame < at) return {drop: 99, glow: 0};
  const t = Math.min(1, (frame - at) / 8);
  const drop = 0.16 * (1 - t * t);
  const glow = i === 0 ? t01(frame, sec(22.88), sec(22.88) + 12) : 0.0;
  const rock = i === 1 ? Math.sin((frame - sec(23.84)) * 0.35) * 0.12 * Math.exp(-(frame - sec(23.84)) / 30) * (frame >= sec(23.84) ? 1 : 0) : 0;
  return {drop, glow, yaw: rock};
};

export const hookState = (frame: number): LabState => {
  const {s, cam, target} = shotAt(frame);
  return {
    cam,
    target,
    fov: s.fov ?? 34,
    focus: s.focus ?? target,
    bokeh: s.bokeh,
    range: s.range,
    time: frame / 30,
    tags: [0, 1, 2].map((i) => tagAt(frame, i)),
    shelf: t01(frame, sec(25.6), sec(26.3)),
  };
};

// --- 2D layer ------------------------------------------------------------------------------

export const Shade = ({side = "left", strength = 0.75}: {side?: "left" | "bottom"; strength?: number}) => (
  <AbsoluteFill
    style={{
      background:
        side === "left"
          ? `linear-gradient(90deg, rgba(15,26,30,${strength}) 0%, rgba(15,26,30,${strength * 0.6}) 30%, rgba(15,26,30,0) 58%)`
          : `linear-gradient(0deg, rgba(15,26,30,${strength}) 0%, rgba(15,26,30,0) 42%)`,
    }}
  />
);

// One line to remember, big, on the left margin. `still` lines are on screen from their first
// frame (frame 0 is the thumbnail and must not fade in).
export const Line = ({at, end, children, y = 760, size = 104, still = false}: {at: number; end: number; children: React.ReactNode; y?: number; size?: number; still?: boolean}) => {
  const frame = useCurrentFrame();
  if (frame < sec(at) || frame >= sec(end)) return null;
  const k = still ? 1 : arrive(frame, sec(at), 16);
  return (
    <div style={{position: "absolute", left: SIDE, top: y, width: 1100, fontFamily: SERIF, fontSize: size, lineHeight: 1.04, color: LAB.ink, opacity: k, transform: `translateY(${(1 - k) * 22}px)`, textShadow: "0 2px 30px rgba(0,0,0,0.45)"}}>
      {children}
    </div>
  );
};

export const Credit = ({children, at, end, right = false, top = false}: {children: React.ReactNode; at: number; end: number; right?: boolean; top?: boolean}) => {
  const frame = useCurrentFrame();
  if (frame < sec(at) || frame >= sec(end)) return null;
  return (
    <>
    {top ? <div style={{position: "absolute", left: 0, right: 0, top: 0, height: 130, background: "linear-gradient(180deg, rgba(15,26,30,0.92) 0%, rgba(15,26,30,0.7) 55%, rgba(15,26,30,0) 100%)"}} /> : null}
    <div style={{position: "absolute", [right ? "right" : "left"]: SIDE, [top ? "top" : "bottom"]: top ? 48 : 56, fontFamily: SANS, fontWeight: 600, fontSize: 28, color: LAB.inkSoft, letterSpacing: 0.2}}>
      {children}
    </div>
    </>
  );
};

// Frame 0: the real photo of a cultivated chicken dish, full frame, already pushing in.
const OpeningPhoto = () => {
  const frame = useCurrentFrame();
  if (frame >= sec(2.24)) return null;
  const z = interpolate(frame, [0, sec(2.24)], [1.0, 1.06]);
  return (
    <AbsoluteFill style={{overflow: "hidden", background: LAB.ground}}>
      <Img src={staticFile("footage/broll-lab-goodmeat-dish.jpg")} style={{position: "absolute", width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%", transform: `scale(${z})`, transformOrigin: "62% 45%", filter: "saturate(0.92) contrast(1.04)"}} />
      <Shade strength={0.82} />
    </AbsoluteFill>
  );
};

export const ChapterCard = ({at, end, n, title}: {at: number; end: number; n: number; title: string}) => {
  const frame = useCurrentFrame();
  if (frame < sec(at) || frame >= sec(end)) return null;
  const k = arrive(frame, sec(at), 18) * leave(frame, sec(end) - 8, 8);
  const rule = t01(frame, sec(at) + 6, sec(at) + 26);
  return (
    <AbsoluteFill style={{background: `rgba(15,26,30,${0.72 * k})`}}>
      <div style={{position: "absolute", left: SIDE + 80, top: 430, opacity: k}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, color: LAB.amber, letterSpacing: 1}}>Chapter {n}</div>
        <div style={{width: 520 * rule, height: 3, background: LAB.amber, margin: "22px 0 26px"}} />
        <div style={{fontFamily: SERIF, fontSize: 132, lineHeight: 1, color: LAB.ink, transform: `translateY(${(1 - k) * 18}px)`}}>{title}</div>
      </div>
    </AbsoluteFill>
  );
};

// A real photo held up in the lab: a print with a white border, a slow push, a small tilt.
export const Print = ({src, at, end, tilt = -1.5, x = 1040, w = 1180, aspect = 9 / 16, pos = "50% 50%"}: {src: string; at: number; end: number; tilt?: number; x?: number; w?: number; aspect?: number; pos?: string}) => {
  const frame = useCurrentFrame();
  if (frame < sec(at) || frame >= sec(end)) return null;
  const k = arrive(frame, sec(at), 18);
  const z = 1 + (frame - sec(at)) * 0.0006;
  const h = w * aspect;
  return (
    <div style={{position: "absolute", left: x - w / 2, top: H / 2 - h / 2 - 20, width: w, height: h, padding: 16, background: "#F4F1EA", boxShadow: "0 40px 120px rgba(0,0,0,0.6)", transform: `translateY(${(1 - k) * 60}px) rotate(${tilt}deg) scale(${0.96 + 0.04 * k})`, opacity: k}}>
      <div style={{width: "100%", height: "100%", overflow: "hidden"}}>
        <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${z})`}} />
      </div>
    </div>
  );
};

export const HookOverlay = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <OpeningPhoto />
      {frame < sec(2.24) ? (
        <>
          <Line at={0} end={2.24} still y={360} size={118}>
            This chicken was
            <br />
            <span style={{fontStyle: "italic", color: frame >= sec(1.08) ? LAB.amberLight : LAB.ink}}>never slaughtered.</span>
          </Line>
          <Credit at={0} end={2.24} right>GOOD Meat cultivated chicken · Photo: Jpatokal, CC BY-SA 4.0</Credit>
        </>
      ) : null}
      {frame >= sec(2.24) && frame < sec(6.8) ? <Shade side="bottom" strength={0.7} /> : null}
      <Line at={3.26} end={4.72} y={820} size={96}>
        Never farmed.
      </Line>
      <Line at={5.12} end={6.8} y={820} size={96}>
        Grown in a <span style={{fontStyle: "italic"}}>machine.</span>
      </Line>

      {/* The fatwa as type: the release's own words (§1, then §8 and its three conditions). */}
      <Article
        from={6.8}
        to={18.36}
        source="Majlis Ugama Islam Singapura (MUIS)"
        kind="Media release"
        date="3 February 2024"
        title="Fatwa on cultivated meat"
        blocks={[
          {kind: "p", segs: [{t: "The Fatwa Committee of Singapore has issued a religious guidance that address the issues of consumption and production of cultivated meat. The Fatwa Committee has found that, assuming the right conditions are fulfilled, cultivated meat is ", group: 0}, {t: "generally halal or permissible", mark: 0, group: 0}, {t: " to be consumed by Muslims.", group: 0}]},
          {kind: "gap"},
          {kind: "p", segs: [{t: "[…] the Fatwa Committee has concluded that the following conditions must be fulfilled to ensure that cultivated meat is halal for consumption:", group: 1}]},
          {kind: "item", segs: [{t: "i. Cell source must be taken from animals that are halal to consume", group: 2}]},
          {kind: "item", segs: [{t: "ii. ", group: 3}, {t: "Every ingredient that makes up texture and composition of cultivated meat must be halal", mark: 1, group: 3}]},
          {kind: "item", segs: [{t: "iii. Product is non-toxic and clean", group: 4}]},
        ]}
        marks={[{at: 9.6, dur: 1.0}, {at: 14.48, dur: 2.4, color: "amber"}]}
        focus={[{at: 6.8, y: 380, scale: 0.92}, {at: 9.2, y: 540, scale: 1.12}, {at: 11.08, y: 960, scale: 1.0, frames: 34}, {at: 13.9, y: 985, scale: 1.18}]}
        dims={[{at: 11.0, keep: [1, 2, 3, 4], to: 0.22}, {at: 14.0, keep: [3], to: 0.25}]}
      />
      <Credit at={6.8} end={18.36} top>Fatwa · quoted from MUIS, “Fatwa on cultivated meat”, 3 Feb 2024, muis.gov.sg</Credit>
      {frame >= sec(17.12) && frame < sec(18.36) ? (
        <div style={{position: "absolute", left: SIDE, top: 900, fontFamily: SERIF, fontStyle: "italic", fontSize: 84, color: LAB.amberLight, opacity: arrive(frame, sec(17.12), 14), textShadow: "0 2px 24px rgba(0,0,0,0.6)"}}>The hardest one.</div>
      ) : null}

      {/* The shelf */}
      {frame >= sec(25.9) && frame < sec(30.5) ? <Shade side="left" strength={0.6} /> : null}
      <Line at={27.78} end={30.5} y={420} size={104}>
        What should
        <br />
        <span style={{fontStyle: "italic"}}>you ask?</span>
      </Line>

      <ChapterCard at={30.5} end={32.9} n={1} title="A €250,000 burger" />

      {/* 2013: the tasting in London, the fried burger, the raw one in its dish. */}
      <Print src="footage/broll-lab-tasting.jpg" at={32.9} end={35.18} pos="50% 40%" />
      <Print src="footage/broll-lab-burger-fried.jpg" at={35.18} end={37.82} tilt={1.2} />
      <Print src="footage/broll-lab-burger-raw.jpg" at={37.82} end={HOOK_END} tilt={-0.8} w={1000} aspect={622 / 830} x={1100} />
      <Line at={33.0} end={35.18} y={880} size={64}>
        London, 5 August 2013
      </Line>
      <Line at={39.2} end={HOOK_END} y={800} size={76}>
        Not cut from
        <br />
        <span style={{fontStyle: "italic"}}>any animal.</span>
      </Line>
      <Credit at={32.9} end={37.82}>Photos: World Economic Forum, CC BY 3.0</Credit>
      <Credit at={37.82} end={HOOK_END}>Photo: World Economic Forum, CC BY 3.0</Credit>
    </AbsoluteFill>
  );
};

export {PRINT};
