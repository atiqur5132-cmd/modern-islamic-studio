import React from "react";
import {AbsoluteFill, Easing, useCurrentFrame} from "remotion";
import {Cues} from "../long/scroll/types";
import {ACCENT, arrive, fall, INK, leave, MUTED, SANS, SERIF, SIDE, swing, t01} from "./look";
import {BOOK_AT, BOOK_YAW, CALENDAR_AT, LANCET_AT, LANCET_CITE, LANCET_DEBATE, WHO_AT, WHO_HL} from "./set";
import {lerp3, panAt, project, RULER, rulerZ, Studio3D, StudioState, V3, Weight} from "./Studio3D";

// Lines 5-12 (WorldA) and 15-24 (WorldB) in the one studio. Each line opens on a hard cut
// to its own framing; inside a line the picture changes on the spoken word (a weight lands,
// a sheet slides in, a highlighter runs). Weights, the beam and the documents carry over, so
// the scale keeps the score of the whole argument. Beats and sounds: beats.md.

const ease = Easing.inOut(Easing.cubic);
const out = Easing.out(Easing.cubic);
// Rising out of frame: 0 until `at`, then up and away.
// A weight that has not started to fall yet is kept far out of frame, not hovering.
const fallIn = (frame: number, at: number, height = 1.3, frames = 7) => (frame < at ? 99 : fall(frame, at, height, frames));
const lift = (frame: number, at: number, frames = 16) => (frame < at ? 0 : Math.pow(Math.min(1, (frame - at) / frames), 2) * 3);

// A point on a document lying square on the table, from (u, v) of its captured image.
const docPoint = (at: V3, aspect: number, u: number, v: number): V3 => {
  const Wd = 1.1, Hd = 1.1 * aspect;
  return [at[0] - Wd / 2 + Wd * u, 0.005, at[2] - Hd / 2 + Hd * v];
};
// A camera over that point that shows `width` metres of the page across the frame.
const overDoc = (p: V3, width: number, tilt = 0.32): {cam: V3; target: V3; fov: number; focus: V3; range: number} => {
  const d = width / (2 * 0.5625 * Math.tan((34 * Math.PI) / 360));
  return {cam: [p[0], d * Math.cos(tilt), p[2] + d * Math.sin(tilt)], target: p, fov: 34, focus: p, range: 0.5};
};
const WHO_ASPECT = 900 / 1180;
const LANCET_ASPECT = 1340 / 1580;

// --- On-screen words ---------------------------------------------------------------------

// Top and bottom shade for type and captions. Over a bright document (`doc`) the lower half
// goes darker sooner, so the credit and the captions read; the spoken line stays in the light.
const Shade = ({doc = false}: {doc?: boolean}) => (
  <AbsoluteFill
    style={{
      background: doc
        ? "linear-gradient(180deg, rgba(18,14,11,0.35) 0%, rgba(18,14,11,0) 18%, rgba(18,14,11,0) 50%, rgba(18,14,11,0.88) 58%, rgba(18,14,11,0.9) 100%)"
        : "linear-gradient(180deg, rgba(18,14,11,0.6) 0%, rgba(18,14,11,0) 30%, rgba(18,14,11,0) 55%, rgba(18,14,11,0.72) 70%, rgba(18,14,11,0.72) 100%)",
    }}
  />
);

const Big = ({children, at, y = 240, size = 112, color = INK, end = Infinity}: {children: React.ReactNode; at: number; y?: number; size?: number; color?: string; end?: number}) => {
  const frame = useCurrentFrame();
  const t = arrive(frame, at, 16) * leave(frame, end, 8);
  if (t <= 0) return null;
  return (
    <div style={{position: "absolute", left: SIDE, right: SIDE, top: y, fontFamily: SERIF, fontSize: size, lineHeight: 1.02, letterSpacing: -1, color, opacity: t, transform: `translateY(${(1 - arrive(frame, at, 16)) * 18}px)`, textWrap: "balance", textShadow: "0 4px 30px rgba(18,14,11,0.75)"}}>
      {children}
    </div>
  );
};

const Credit = ({text, at, y = 1080, end = Infinity}: {text: string; at: number; y?: number; end?: number}) => {
  const frame = useCurrentFrame();
  const t = arrive(frame, at, 14) * leave(frame, end, 8);
  if (t <= 0) return null;
  return (
    <div style={{position: "absolute", left: SIDE, right: 140, top: y, fontFamily: SANS, fontWeight: 600, fontSize: 29, color: MUTED, opacity: t, whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(18,14,11,0.95)"}}>
      {text}
    </div>
  );
};

// A word pinned to a point of the 3D world (projected each frame).
const Pin = ({s, p, at, children, color = INK, size = 58, dx = 0, dy = -40, italic = true, end = Infinity}: {s: StudioState; p: V3; at: number; children: React.ReactNode; color?: string; size?: number; dx?: number; dy?: number; italic?: boolean; end?: number}) => {
  const frame = useCurrentFrame();
  const t = arrive(frame, at, 14) * leave(frame, end, 8);
  if (t <= 0) return null;
  const [px, y] = project(s, p);
  const x = Math.min(860, Math.max(220, px + dx)) - dx;
  return (
    <div style={{position: "absolute", left: x + dx, top: y + dy, transform: `translate(-50%, -100%) translateY(${(1 - t) * 10}px)`, fontFamily: SERIF, fontStyle: italic ? "italic" : "normal", fontSize: size, color, opacity: t, whiteSpace: "nowrap", textShadow: "0 3px 18px rgba(18,14,11,0.9)"}}>
      {children}
    </div>
  );
};

// --- WorldA: lines 5-12 -------------------------------------------------------------------

export const WorldA = ({cues}: {cues: Cues}) => {
  const f = useCurrentFrame();
  const L = cues.line;
  const W = cues.word;
  const liftAt = L(6) + 6;
  const joy = W(8, 1) - 6, pleasure = W(8, 3) - 6, profit = W(8, 8) - 6;
  const ironAt = W(10, 7) - 3;
  const flip2 = W(12, 3);

  const weights: Weight[] = [
    {pan: "left", kind: "brass", slot: 1, drop: lift(f, liftAt + 2)},
    {pan: "left", kind: "brass", slot: 0, drop: fallIn(f, joy)},
    {pan: "left", kind: "brass", slot: 2, drop: fallIn(f, pleasure)},
    {pan: "left", kind: "coin", slot: 3, drop: fallIn(f, profit)},
    {pan: "left", kind: "coin", slot: 3, drop: fallIn(f, profit + 2) + 0.022},
    {pan: "left", kind: "coin", slot: 3, drop: fallIn(f, profit + 4) + 0.044},
    {pan: "right", kind: "iron", slot: 0, drop: fallIn(f, ironAt, 1.6)},
  ];
  const beam =
    0.13 +
    swing(f, liftAt, -0.13) +
    swing(f, joy + 7, 0.05) +
    swing(f, pleasure + 7, 0.05) +
    swing(f, profit + 9, 0.05) +
    swing(f, ironAt + 7, -0.55, 0.34, 0.12);
  const flipT = t01(f, flip2, flip2 + 22, (t) => t);
  const base: Omit<StudioState, "cam" | "target"> = {
    beam,
    weights,
    bottle: f < liftAt + 30 ? {on: "left", lift: lift(f, liftAt)} : undefined,
    book: {pos: BOOK_AT, yaw: BOOK_YAW, open: 0.985, flip: flipT, page: flipT > 0.55 ? "5:91" : "2:219"},
    calendar: {pos: CALENDAR_AT, yaw: 0.35, flip: t01(f, W(11, 4) - 3, W(11, 4) + 9, ease)},
  };

  let s: StudioState;
  let words: React.ReactNode = null;
  const docShot = false;
  if (f < L(6) - 2) {
    // Line 5: pull back off the open book to the whole table; the question lands on the wall.
    const k = t01(f, 0, L(6) - 2, ease);
    s = {...base, cam: lerp3([1.05, 1.45, 2.6], [-0.55, 2.35, 6.4], k), target: lerp3([0.95, 0.16, 1.1], [0.1, 1.45, 0], k), fov: 40, focus: lerp3([0.95, 0.16, 1.15], [0, 1.4, 0], k), range: 1.6};
    words = <Big at={W(5, 12) - 2}>Then why <span style={{fontStyle: "italic", color: ACCENT}}>ban</span> it?</Big>;
  } else if (f < L(7) - 2) {
    // Line 6: the scale alone at three-quarters, the bottle and the weight lifted away.
    const k = t01(f, L(6) - 2, L(7) - 2, (t) => t);
    s = {...base, cam: lerp3([-3.6, 1.95, 4.3], [-3.35, 1.9, 4.0], k), target: [0.05, 1.4, 0], fov: 42, focus: [0, 1.6, 0], range: 2.2};
    words = (
      <>
        <Pin s={s} p={[-1.25, 1.35, 0]} at={W(6, 3)} dy={-120}>Benefit</Pin>
        <Pin s={s} p={[1.25, 1.35, 0]} at={W(6, 3) + 6} dy={-120} color={ACCENT}>Harm</Pin>
      </>
    );
  } else if (f < L(8) - 2) {
    // Line 7: close on the benefit pan; the classical tafsir's own list, quoted.
    const k = t01(f, L(7) - 2, L(8) - 2, (t) => t);
    s = {...base, cam: lerp3([-2.45, 1.85, 2.75], [-2.25, 1.8, 2.5], k), target: [-1.2, 1.35, 0], fov: 36, focus: [-1.25, 1.35, 0], range: 0.9};
    words = (
      <>
        <Big at={W(7, 6)} size={78} y={230}>
          <span style={{fontStyle: "italic"}}>“…bringing about a joyous sensation and financially benefiting…”</span>
        </Big>
        <Credit at={W(7, 7)} y={500} text="Tafsir · Ibn Kathir on 2:219 · English, quran.com" />
      </>
    );
  } else if (f < L(9) - 2) {
    // Line 8: looking down into the pan as Joy, Pleasure and Profit land.
    const k = t01(f, L(8) - 2, L(9) - 2, (t) => t);
    s = {...base, cam: lerp3([-1.3, 2.6, 1.85], [-1.28, 2.5, 1.7], k), target: [-1.25, 1.15, -0.05], fov: 40, focus: [-1.25, 1.3, 0], range: 0.7, key: 1.15};
    const pan = (dx: number, dz: number): V3 => [-1.25 + dx, panAt("left", beam)[1] + 0.42, dz];
    words = (
      <>
        <Pin s={s} p={pan(0, 0)} at={W(8, 1)} size={76} dy={-70}>Joy</Pin>
        <Pin s={s} p={pan(0.22, 0.1)} at={W(8, 3)} size={76} dy={-70}>Pleasure</Pin>
        <Pin s={s} p={pan(0.02, -0.22)} at={W(8, 8)} size={76} dy={-90}>Profit</Pin>
      </>
    );
  } else if (f < ironAt - 1) {
    // Line 9: whip across to the harm side. From "World Health Organisation" to the iron
    // weight, WHO's release plays full screen over these frames (DocPage in Sharaab.tsx).
    const kw = t01(f, L(9) - 2, L(9) + 12, ease);
    s = {...base, cam: lerp3([-1.2, 1.9, 2.6], [2.6, 1.85, 3.1], kw), target: lerp3([-1.25, 1.35, 0], [1.25, 1.25, 0], kw), fov: 38, focus: [1.25, 1.3, 0], range: 0.9};
  } else if (f < L(11) - 2) {
    // Line 10, second half: the iron weight slams into the harm pan.
    const k = t01(f, ironAt - 1, L(11) - 2, (t) => t);
    s = {...base, cam: lerp3([3.3, 2.05, 4.4], [3.1, 2.0, 4.15], k), target: [0.25, 1.35, 0], fov: 42, focus: [1.25, 1.2, 0], range: 1.6};
    words = (
      <>
        <Big at={ironAt + 6} size={150} color={ACCENT}>
          26,00,000
        </Big>
        <Big at={ironAt + 10} y={400} size={64}>
          <span style={{fontStyle: "italic"}}>deaths a year</span>
        </Big>
        <Credit at={ironAt + 12} y={500} text="Established data · WHO, 2019 figures (report of 2024)" />
      </>
    );
  } else if (f < L(12) - 2) {
    // Line 11: a desk calendar turns one leaf: the yearly figure as one day.
    const k = t01(f, L(11) - 2, L(12) - 2, (t) => t);
    s = {...base, cam: lerp3([-1.75, 0.82, 2.25], [-1.8, 0.78, 2.1], k), target: [CALENDAR_AT[0] - 0.05, 0.3, CALENDAR_AT[2]], fov: 34, focus: [CALENDAR_AT[0], 0.3, CALENDAR_AT[2]], range: 0.5};
    words = <Credit at={W(11, 4) + 8} y={1080} text="Our arithmetic · 26,00,000 ÷ 365 ≈ 7,123" />;
  } else {
    // Line 12: back to the Quran; its pages turn on to Al-Ma'idah; down onto the page.
    const k = t01(f, L(12) - 2, L(12) + 110, ease);
    s = {...base, cam: lerp3([1.35, 1.05, 2.35], [0.99, 1.35, 1.42], k), target: lerp3([0.95, 0.16, 1.15], [0.99, 0.16, 1.12], k), fov: 36, focus: [0.97, 0.16, 1.12], range: 0.6};
  }
  return (
    <AbsoluteFill>
      <Studio3D s={s} />
      <Shade doc={docShot} />
      {words}
    </AbsoluteFill>
  );
};

// --- WorldB: lines 15-24 ------------------------------------------------------------------

export const WorldB = ({cues}: {cues: Cues}) => {
  const f = useCurrentFrame();
  const L = cues.line;
  const W = cues.word;
  const weights: Weight[] = [
    {pan: "left", kind: "brass", slot: 0, drop: 0},
    {pan: "left", kind: "brass", slot: 2, drop: 0},
    {pan: "left", kind: "coin", slot: 3, drop: 0},
    {pan: "left", kind: "coin", slot: 3, drop: 0.022},
    {pan: "left", kind: "coin", slot: 3, drop: 0.044},
    {pan: "right", kind: "iron", slot: 0, drop: 0},
  ];
  const beam = -0.4 + swing(f, W(21, 12) - 2, -0.04);
  const closeAt = L(15) + 4;
  const reopen = L(21) - 2;
  const open = f < reopen ? 0.985 * (1 - t01(f, closeAt, closeAt + 26, ease)) : 0.985 * t01(f, reopen + 4, reopen + 22, ease);
  // The age ruler: the slider runs to 40 and the 40+ stretch warms; then 15-39 lights rust.
  const marker = 15 + 25 * t01(f, W(19, 4) - 4, W(19, 4) + 14, ease) - 12 * t01(f, W(20, 1) - 2, W(20, 1) + 14, ease);
  const ruler = f >= L(19) - 2 ? {old: t01(f, W(19, 5), W(19, 5) + 14) * (1 - 0.6 * t01(f, W(20, 1), W(20, 1) + 10)), young: t01(f, W(20, 1), W(20, 1) + 14), marker} : undefined;
  const riskAt = W(20, 12) - 2;
  const spotLeft = f >= L(22) - 2 && f < W(22, 4) - 2;
  const spotRight = (f >= W(22, 4) - 2 && f < W(22, 7) - 2) || (f >= riskAt && f < L(21) - 2);
  const base: Omit<StudioState, "cam" | "target"> = {
    beam,
    weights,
    book: {pos: BOOK_AT, yaw: BOOK_YAW, open, page: f < reopen ? "5:91" : "2:219"},
    calendar: {pos: CALENDAR_AT, yaw: 0.35, flip: 1},
    ruler,
    key: spotLeft || spotRight ? 0.4 : 1,
    spot: spotLeft ? {pos: [-1.3, 4.4, 1.2], target: [-1.25, 1.8, 0], power: 160, angle: 0.22} : spotRight ? {pos: [1.3, 3.6, 1.2], target: [1.25, 0.82, 0], power: 160, angle: 0.24} : undefined,
  };
  // Straight down on the ruler, its length running top (15) to bottom (80) of the frame.
  const rulerTop = (z: number, h: number) => ({cam: [RULER.x + 0.22, h, z + 0.001] as V3, target: [RULER.x + 0.22, 0, z] as V3, up: [0, 0, -1] as V3, fov: 36, focus: [RULER.x, 0.03, z] as V3, range: 1.2});

  let s: StudioState;
  let words: React.ReactNode = null;
  const docShot = false;
  if (f < L(16) - 2) {
    // Line 15: the Quran closes; the gold title catches the light.
    const k = t01(f, 0, L(16) - 2, (t) => t);
    s = {...base, cam: lerp3([1.45, 1.15, 2.6], [1.38, 1.08, 2.45], k), target: [0.95, 0.12, 1.2], fov: 36, focus: [0.95, 0.15, 1.15], range: 0.6};
    words = <Big at={W(15, 6) - 2} size={92} y={240}>For a Muslim, it is <span style={{fontStyle: "italic"}}>Allah’s command.</span></Big>;
  } else if (f < L(19) - 2) {
    // Line 16: up from the book to the scale, still down on the harm side. (Lines 17-18:
    // the Lancet record plays full screen over these frames, DocPage in Sharaab.tsx.)
    const k = t01(f, L(16) - 2, L(17) + 10, ease);
    s = {...base, cam: lerp3([1.4, 1.1, 2.65], [2.6, 2.1, 4.6], k), target: lerp3([0.95, 0.15, 1.2], [0.1, 1.45, 0], k), fov: 40, focus: lerp3([0.95, 0.2, 1.15], [0, 1.4, 0], k), range: 1.8};
  } else if (f < L(20) - 2) {
    // Line 19: straight down on the age ruler; the slider runs to 40, the 40+ end warms.
    const k = t01(f, L(19) - 2, L(20) - 2, (t) => t);
    s = {...base, ...rulerTop(rulerZ(47.5), 4.1 - 0.25 * k)};
    words = (
      <>
        <Pin s={s} p={[RULER.x + 0.2, 0.03, rulerZ(50)]} at={W(19, 4)} dx={170} dy={30} size={110} italic={false}>40+</Pin>
        <Big at={W(19, 16)} size={92} y={240}><span style={{fontStyle: "italic"}}>maybe, a little.</span></Big>
        <Credit at={W(19, 5)} y={360} text="Established science, debated · The Lancet, 2022" />
      </>
    );
  } else if (f < riskAt) {
    // Line 20: closer, on the young end; 15-39 lights rust: zero benefit.
    const k = t01(f, L(20) - 2, riskAt, (t) => t);
    s = {...base, ...rulerTop(rulerZ(28), 2.6 - 0.2 * k)};
    words = (
      <>
        <Pin s={s} p={[RULER.x + 0.2, 0.03, rulerZ(27)]} at={W(20, 1)} dx={270} dy={30} size={104} italic={false} color={ACCENT}>15–39</Pin>
        <Big at={W(20, 10)} y={240} size={170}>
          0 <span style={{fontStyle: "italic", fontSize: 72}}>benefit</span>
        </Big>
        <Credit at={W(20, 2)} y={440} text="Established science · The Lancet, 2022" />
      </>
    );
  } else if (f < L(21) - 2) {
    // "Sirf risk hai": close on the iron weight in a narrow light.
    const k = t01(f, riskAt, L(21) - 2, (t) => t);
    s = {...base, cam: lerp3([2.1, 1.3, 1.4], [2.0, 1.25, 1.3], k), target: [1.25, 0.85, 0], fov: 36, focus: [1.25, 0.9, 0], range: 0.7};
    words = <Big at={riskAt + 4} size={110} color={ACCENT}><span style={{fontStyle: "italic"}}>only risk.</span></Big>;
  } else if (f < L(22) - 2) {
    // Line 21: low behind the open Quran; focus pulls from its page to the scale.
    const k = t01(f, L(21) - 2, L(22) - 2, (t) => t);
    const rack = t01(f, W(21, 8) - 6, W(21, 8) + 14, ease);
    s = {...base, cam: lerp3([2.15, 1.2, 3.3], [2.05, 1.22, 3.15], k), target: [0.75, 0.55, 0.8], fov: 40, focus: lerp3([0.95, 0.16, 1.2], [0, 1.4, 0], rack), range: 0.5, bokeh: 4.5};
    words = (
      <Big at={W(21, 8)} size={88}>
        Benefit, yes. <span style={{fontStyle: "italic", color: ACCENT}}>Harm, greater.</span>
      </Big>
    );
  } else if (f < W(22, 4) - 2) {
    // Line 22, "fayda gina": close on the benefit pan in its own light.
    s = {...base, cam: [-2.0, 2.45, 1.55], target: [-1.25, 1.8, 0], fov: 36, focus: [-1.25, 1.82, 0], range: 0.7};
    words = <Big at={W(22, 1)} size={110}><span style={{fontStyle: "italic"}}>counted,</span></Big>;
  } else if (f < W(22, 7) - 2) {
    // "nuksaan gina": the harm pan.
    s = {...base, cam: [2.05, 1.4, 1.6], target: [1.25, 0.82, 0], fov: 36, focus: [1.25, 0.85, 0], range: 0.7};
    words = <Big at={W(22, 4)} size={110} color={ACCENT}><span style={{fontStyle: "italic"}}>weighed,</span></Big>;
  } else if (f < L(23) - 2) {
    // "phir faisla kiya": close on the pointer against the dial: the verdict.
    const k = t01(f, W(22, 7) - 2, L(23) - 2, out);
    s = {...base, cam: lerp3([0.35, 2.75, 1.05], [0.3, 2.72, 0.9], k), target: [0.02, 2.62, 0], fov: 34, focus: [0, 2.7, 0], range: 0.4};
    words = <Big at={W(22, 7)} size={110} y={250}><span style={{fontStyle: "italic"}}>decided.</span></Big>;
  } else if (f < L(24) - 2) {
    // Line 23: the payoff in near silence: the scale alone, the line held.
    const k = t01(f, L(23) - 2, L(24) - 2, (t) => t);
    s = {...base, cam: lerp3([0.0, 1.7, 7.4], [0.0, 1.68, 7.0], k), target: [0, 1.55, 0], fov: 38, focus: [0, 1.5, 0], range: 2.5, key: 0.85};
    words = (
      <>
        <Big at={W(23, 0)} size={104}>Not a blind order.</Big>
        <Big at={W(23, 4)} y={370} size={104} color={ACCENT}>
          <span style={{fontStyle: "italic"}}>A balance sheet.</span>
        </Big>
      </>
    );
  } else {
    // Line 24 and the end card: straight down over the whole table, turning slowly: the
    // scale, the Quran, the calendar and the ruler, the case laid out.
    const k = t01(f, L(24) - 2, L(24) + 150, (t) => t);
    const r = -0.35 + 0.5 * k;
    s = {...base, cam: [0.1, 8.4 - 0.8 * k, 0.75], target: [0.1, 0, 0.75], up: [Math.sin(r), 0, -Math.cos(r)], fov: 40, focus: [0, 1.0, 0.5], range: 3, key: 1.1};
  }
  return (
    <AbsoluteFill>
      <Studio3D s={s} />
      <Shade doc={docShot} />
      {words}
    </AbsoluteFill>
  );
};
