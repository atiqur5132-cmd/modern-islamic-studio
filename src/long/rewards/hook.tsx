import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {camAt, Move, project, V3} from "./camera";
import {CalendarIcon, CoinIcon, GiftIcon, MedalIcon, PersonIcon, PlaneIcon, ShieldIcon, Tick} from "./icons";
import {CLAMP, drop, fade, grow, H, HOOK, mix, pop, SANS, sec, SERIF, W} from "./look";
import {StudioState, Studio3D} from "./Studio3D";

// The hook, 0–70.2 s (beats.md "Hook storyboard"). The 3D studio runs to the curtain at
// 59.7 s; behind the curtain the two groups are a 2D scene. Times are the voice's words
// (work/rr-02.voice.small.transcript.json).

export const CURTAIN_SHUT = 59.7;

const MOVES: Move[] = [
  {at: 0, pos: [1.0, 1.55, 6.3], target: [1.0, 1.2, 0], fov: 32},
  {at: 0.1, frames: sec(7.9), pos: [1.15, 1.75, 7.0], target: [1.05, 1.15, 0]},
  {at: 8.1, frames: 30, pos: [-1.75, 1.55, 7.9], target: [-1.75, 1.25, 0]},
  {at: 12.85, frames: 24, pos: [2.5, 1.2, 3.6], target: [2.15, 1.05, 0], fov: 30},
  {at: 15.45, frames: 40, pos: [0, 2.6, 12.5], target: [0, 2.1, -3], fov: 32},
  {at: 17.45, frames: 36, pos: [-0.6, 1.45, 4.1], target: [0, 1.27, 0]},
  {at: 21.0, frames: 36, pos: [0, 2.8, 11], target: [0, 1.1, 0]},
  {at: 31.0, frames: sec(5), pos: [-1.6, 2.9, 10.8], target: [0, 1.2, 0]},
  {at: 36.0, frames: 30, pos: [0, 2.4, 10.4], target: [0, 1.7, 0]},
  {at: 40.3, frames: 40, pos: [1.0, 2.1, 8.6], target: [0.6, 1.4, 0]},
  {at: 47.3, frames: 36, pos: [1.3, 2.9, 11.2], target: [1.3, 2.0, 0]},
  {at: 52.6, frames: 36, pos: [-1.6, 1.8, 6.8], target: [-1.1, 1.35, 0]},
  {at: 56.1, frames: 36, pos: [0.5, 4.6, 4.4], target: [0.5, 0, 2.1]},
];

const GIFT_TIMES = [22.3, 22.45, 22.6, 22.75, 22.9, 23.05];
const BAR_POS: V3 = [3.3, 0, -0.6];
const BAR_H = 4.2;

// Each prop lands from above on its word and leaves when the scoreboard flips.
const land = (frame: number, at: number, rest: V3, rot: V3) => {
  const k = drop(frame, at, 18);
  const out = fade(frame, 39.0, 14);
  return {k: k > 0 ? Math.max(0.001, out) : 0, pos: [rest[0], rest[1] + 3.5 * (1 - k), rest[2]] as V3, rot: [rot[0], rot[1] + (1 - k) * 1.4, rot[2]] as V3, scale: out};
};

export const hookState = (frame: number): StudioState => {
  const t = frame / 30;
  const lift = grow(frame, 36.22, 20) * fade(frame, 39.0, 18);
  const flip = interpolate(frame, [sec(13.65), sec(13.65) + 14], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const cold = grow(frame, 13.65, 10) * fade(frame, 15.5, 30);
  const sweep = interpolate(frame, [sec(17.6), sec(21.4)], [-1.2, 1.2], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const turn = interpolate(frame, [sec(17.5), sec(21.4)], [-0.45, 0.45], {...CLAMP, easing: Easing.inOut(Easing.sin)});
  const closeUp = grow(frame, 17.45, 30) * fade(frame, 21.0, 30);
  const idle = Math.sin(t * 0.5) * 0.16 - 0.12;
  const sink = Math.min(1, grow(frame, 39.0, 18) * (1 - grow(frame, 42.9, 20)));
  const barUp = grow(frame, 47.88, 34, Easing.out(Easing.quad));
  const feesUp = grow(frame, 49.0, 12);
  const barDown = fade(frame, 52.72, 16);
  return {
    cam: camAt(frame, MOVES),
    card: {pos: [0, 1.27 + 0.8 * lift, 0], rot: [0, mix(idle, turn, closeUp) + grow(frame, 40.3, 40) * 0.25, 0]},
    tag: {k: 1, flip, front: "unknown", back: "deadbeat"},
    key: {color: cold > 0.01 ? "#dcebf7" : "#fff4e6", power: 1 - 0.25 * cold},
    sweep,
    sweepPower: closeUp,
    bank: grow(frame, 15.8, 36) * fade(frame, 31.0, 40),
    gifts: GIFT_TIMES.map((g) => drop(frame, g, 18)),
    giftSink: sink,
    coin: land(frame, 24.14, [-1.2, 0.5, 2.4], [0, 0.35, 0]),
    lounge: land(frame, 25.66, [1.0, 0.47, 2.5], [-0.08, -0.3, 0]),
    hotel: land(frame, 27.5, [-3.0, 0.47, 2.2], [-0.05, 0.45, 0]),
    boarding: land(frame, 29.12, [3.1, 0.49, 2.0], [-0.06, -0.42, 0]),
    podium: lift,
    hook: {k: grow(frame, 46.0, 26) * fade(frame, 52.72, 20), pos: [-1.9, 1.35, 1.3]},
    bar: {interest: barUp * barDown, fees: feesUp * barDown, pos: BAR_POS},
    freeTag: {k: pop(frame, 54.3, 16), flip: interpolate(frame, [sec(55.46), sec(55.46) + 14], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)}), pos: [-2.2, 2.35, 0.8]},
    bill: {k: frame >= sec(56.2) ? 1 : 0, pos: [mix(6, 0.5, grow(frame, 56.3, 22)), 0.004, 2.2], rot: [-Math.PI / 2, 0, 0.1]},
  };
};

// ——— 2D layer ———

const Word = ({text, x, y, k, strike, size = 88}: {text: string; x: number; y: number; k: number; strike: number; size?: number}) => (
  <div style={{position: "absolute", left: x, top: y, opacity: k, transform: `translateY(${(1 - k) * 18}px)`, fontFamily: SANS, fontWeight: 800, fontSize: size, color: strike > 0 ? HOOK.inkSoft : HOOK.ink, letterSpacing: -1.5, whiteSpace: "nowrap"}}>
    {text}
    <svg style={{position: "absolute", left: -12, top: size * 0.42, overflow: "visible"}} width={10} height={10}>
      <line x1={0} y1={6} x2={text.length * size * 0.56 + 24} y2={-4} stroke={HOOK.coral} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike} />
    </svg>
  </div>
);

const Calendar = ({frame}: {frame: number}) => {
  const out = fade(frame, 8.1, 12);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return (
    <div style={{position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center", gap: 14, opacity: out}}>
      {months.map((m, i) => {
        const k = pop(frame, 3.0 + i * 0.12, 12);
        const tick = grow(frame, 5.8 + i * 0.15, 8);
        return (
          <div key={m} style={{position: "relative", transform: `translateY(${(1 - k) * 60}px) scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 1.5)}}>
            <CalendarIcon size={104} label={m} />
            <div style={{position: "absolute", left: 18, top: 30}}>
              <Tick k={tick} size={70} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const NotWords = ({frame}: {frame: number}) => {
  const out = fade(frame, 12.8, 10);
  const medal = pop(frame, 9.36);
  const shield = pop(frame, 11.42);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: "absolute", left: 100, top: 310, transform: `scale(${medal})`, opacity: fade(frame, 10.9, 14)}}>
        <MedalIcon size={190} crack={grow(frame, 10.35, 16, Easing.in(Easing.quad))} />
      </div>
      <Word text="Loyal" x={320} y={355} size={100} k={grow(frame, 9.36, 12)} strike={grow(frame, 10.15, 10)} />
      <div style={{position: "absolute", left: 100, top: 540, transform: `scale(${shield})`, opacity: fade(frame, 12.6, 10)}}>
        <ShieldIcon size={190} crack={grow(frame, 12.25, 14, Easing.in(Easing.quad))} />
      </div>
      <Word text="Responsible" x={320} y={585} size={90} k={grow(frame, 11.42, 12)} strike={grow(frame, 12.05, 10)} />
    </AbsoluteFill>
  );
};

const PlaneArc = ({frame}: {frame: number}) => {
  const p = interpolate(frame, [sec(29.0), sec(30.9)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  if (p <= 0 || p >= 1) return null;
  const x = mix(-120, W + 120, p);
  const y = 230 - Math.sin(p * Math.PI) * 120;
  const angle = Math.atan2(-Math.cos(p * Math.PI) * 120 * Math.PI, W + 240) * (180 / Math.PI) + 90;
  return (
    <svg width={W} height={H} style={{position: "absolute", inset: 0}}>
      <path d={`M -120 230 Q ${W / 2} ${230 - 240} ${W + 120} 230`} fill="none" stroke={HOOK.tealLight} strokeWidth={4} strokeDasharray="4 16" strokeLinecap="round" pathLength={1} strokeDashoffset={0} opacity={0.6} style={{clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}} />
      <g transform={`translate(${x - 40} ${y - 40}) rotate(${angle} 40 40)`}>
        <PlaneIconSvg />
      </g>
    </svg>
  );
};
const PlaneIconSvg = () => (
  <svg width={80} height={80} viewBox="0 0 100 100">
    <path d="M50 6 Q56 12 55 40 L92 58 L92 66 L55 56 L54 80 L66 88 L66 94 L50 89 L34 94 L34 88 L46 80 L45 56 L8 66 L8 58 L45 40 Q44 12 50 6 Z" fill={HOOK.teal} />
  </svg>
);

// "You 1 – Bank 0", flipping to "You 0 – Bank 1" on "not".
const Scoreboard = ({frame}: {frame: number}) => {
  const k = pop(frame, 36.5, 16) * fade(frame, 40.2, 12);
  if (k <= 0) return null;
  const flipT = grow(frame, 38.98, 10);
  const Digit = ({a, b}: {a: string; b: string}) => {
    const shown = flipT < 0.5 ? a : b;
    const sy = Math.abs(Math.cos(flipT * Math.PI));
    return (
      <div style={{width: 120, height: 150, borderRadius: 14, background: HOOK.ink, color: "#f2f6f5", fontFamily: SANS, fontWeight: 800, fontSize: 120, display: "flex", alignItems: "center", justifyContent: "center", transform: `scaleY(${sy})`, boxShadow: "0 18px 40px rgba(19,48,46,0.25)"}}>
        {shown}
      </div>
    );
  };
  const label = {fontFamily: SANS, fontWeight: 800, fontSize: 40, color: HOOK.ink, letterSpacing: 4};
  return (
    <div style={{position: "absolute", left: 0, right: 0, top: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: Math.min(1, k), transform: `translateY(${(1 - k) * -40}px)`}}>
      <div style={{display: "flex", alignItems: "center", gap: 34, padding: "22px 40px", background: "rgba(255,255,255,0.72)", borderRadius: 24, boxShadow: "0 20px 60px rgba(19,48,46,0.14)"}}>
        <span style={label}>YOU</span>
        <Digit a="1" b="0" />
        <span style={{...label, fontSize: 70, color: HOOK.inkSoft}}>:</span>
        <Digit a="0" b="1" />
        <span style={label}>BANK</span>
      </div>
      <div style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 54, color: HOOK.teal, opacity: grow(frame, 38.44, 14)}}>Except you're not.</div>
    </div>
  );
};

// Labels on the 3D bar: the count, the two parts, the credit.
const BarLabels = ({frame, s}: {frame: number; s: StudioState}) => {
  const vis = grow(frame, 47.88, 10) * fade(frame, 52.72, 12);
  if (vis <= 0) return null;
  const count = Math.round(130 * grow(frame, 47.88, 40, Easing.out(Easing.quad)));
  const top = project([BAR_POS[0], BAR_H * s.bar.interest * (105 / 130) + BAR_H * (25 / 130) * s.bar.fees + 0.15, BAR_POS[2]], s.cam);
  const mid = project([BAR_POS[0] + 0.62, BAR_H * (105 / 130) * 0.5, BAR_POS[2] + 0.6], s.cam);
  const fee = project([BAR_POS[0] + 0.62, BAR_H * (105 / 130) + BAR_H * (25 / 130) * 0.5, BAR_POS[2] + 0.6], s.cam);
  const tag = (k: number) => ({opacity: k, transform: `translateX(${(1 - k) * -16}px)`});
  return (
    <AbsoluteFill style={{opacity: vis}}>
      <div style={{position: "absolute", left: top.x, top: top.y, transform: "translate(-50%, -100%)", fontFamily: SANS, fontWeight: 800, fontSize: 104, color: HOOK.ink, letterSpacing: -2, whiteSpace: "nowrap"}}>
        ${count}B<span style={{fontSize: 44, color: HOOK.inkSoft, fontWeight: 700}}> a year</span>
      </div>
      <div style={{position: "absolute", left: mid.x + 26, top: mid.y - 26, fontFamily: SANS, fontWeight: 700, fontSize: 40, color: HOOK.teal, ...tag(grow(frame, 50.76, 12))}}>interest</div>
      <div style={{position: "absolute", left: fee.x + 26, top: fee.y - 26, fontFamily: SANS, fontWeight: 700, fontSize: 40, color: HOOK.tealLight, ...tag(grow(frame, 51.38, 12))}}>fees</div>
      <div style={{position: "absolute", left: 120, bottom: 64, fontFamily: SANS, fontWeight: 600, fontSize: 26, color: HOOK.inkSoft, opacity: grow(frame, 48.6, 14) * 0.85}}>US card issuers, interest and fees · CFPB, 2022</div>
    </AbsoluteFill>
  );
};

// One brief RGB split on "glitch" (33.46 s), six frames.
export const glitchAt = (frame: number) => {
  const f = frame - sec(33.46);
  return f >= 0 && f < 6 ? 1 - f / 6 : 0;
};

// ——— Behind the curtain: two groups of people pay for the rewards ———

const Curtain = ({frame}: {frame: number}) => {
  const shut = interpolate(frame, [sec(58.9), sec(CURTAIN_SHUT)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const open = interpolate(frame, [sec(60.2), sec(61.1)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const cover = shut * (1 - open);
  if (cover <= 0) return null;
  const folds = (side: 1 | -1) =>
    `repeating-linear-gradient(90deg, #0c5552 0px, #0f6b66 38px, #127873 60px, #0f6b66 84px, #0a4846 120px)`;
  const panel = (side: -1 | 1) => (
    <div
      style={{
        position: "absolute",
        top: -20,
        bottom: -20,
        width: W / 2 + 40,
        [side < 0 ? "left" : "right"]: 0,
        transform: `translateX(${side * (1 - cover) * (W / 2 + 60)}px) skewX(${side * (1 - cover) * -4}deg)`,
        background: folds(side),
        boxShadow: `inset ${side * -40}px 0 80px rgba(0,0,0,0.35)`,
      }}
    />
  );
  return (
    <AbsoluteFill>
      {panel(-1)}
      {panel(1)}
    </AbsoluteFill>
  );
};

const Groups = ({frame}: {frame: number}) => {
  if (frame < sec(CURTAIN_SHUT)) return null;
  const rewards = pop(frame, 60.5, 16) ;
  const rewardsBeat = pop(frame, 61.85, 10);
  const lines = grow(frame, 63.4, 20);
  const g1 = [0, 1, 2, 3, 4].map((i) => pop(frame, 64.39 + i * 0.07, 12));
  const g2 = [0, 1, 2, 3].map((i) => pop(frame, 65.25 + i * 0.07, 12));
  const slot = pop(frame, 66.7, 14);
  const you = pop(frame, 68.97, 14);
  const t = frame / 30;
  const L = {x: 470, y: 800};
  const R = {x: 1430, y: 800};
  const top = {x: 960, y: 300};
  // Coins travel up the dotted lines from both groups to the rewards, without end.
  const coins = [0, 1, 2].flatMap((i) =>
    [L, R].map((from, j) => {
      const p = ((t - 63.8) * 0.45 + i / 3 + j * 0.17) % 1;
      if (t < 63.8) return null;
      return (
        <div key={`${i}-${j}`} style={{position: "absolute", left: mix(from.x, top.x, p) - 22, top: mix(from.y - 150, top.y + 120, p) - 22, opacity: Math.sin(p * Math.PI)}}>
          <CoinIcon size={56} />
        </div>
      );
    }),
  );
  const people = (n: number[], cx: number) => (
    <div style={{position: "absolute", left: cx, top: L.y - 170, transform: "translateX(-50%)", display: "flex", gap: 6, alignItems: "flex-end"}}>
      {n.map((k, i) => (
        <div key={i} style={{transform: `translateY(${(1 - k) * 50}px) scale(${k})`, opacity: Math.min(1, k * 1.4)}}>
          <PersonIcon size={i % 2 ? 126 : 146} color={HOOK.ink} />
        </div>
      ))}
    </div>
  );
  const label = (text: string, x: number, k: number) => (
    <div style={{position: "absolute", left: x, top: L.y + 30, transform: `translateX(-50%) translateY(${(1 - k) * 16}px)`, opacity: k, fontFamily: SANS, fontWeight: 800, fontSize: 64, color: HOOK.ink, letterSpacing: -1}}>{text}</div>
  );
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 70% 60% at 50% 45%, #f7faf9 0%, ${HOOK.ground} 60%, ${HOOK.ground2} 100%)`}}>
      <svg width={W} height={H} style={{position: "absolute", inset: 0}}>
        {[L, R].map((p, i) => (
          <path key={i} d={`M ${p.x} ${p.y - 150} Q ${(p.x + top.x) / 2} ${top.y + 260} ${top.x} ${top.y + 120}`} fill="none" stroke={HOOK.tealLight} strokeWidth={5} strokeDasharray="2 18" strokeLinecap="round" opacity={lines} />
        ))}
      </svg>
      <div style={{position: "absolute", left: top.x, top: top.y, transform: `translate(-50%, -50%) scale(${rewards * (1 + 0.08 * Math.sin(rewardsBeat * Math.PI))})`, display: "flex", alignItems: "center", gap: 34}}>
        <CoinIcon size={150} label="5%" />
        <GiftIcon size={230} />
        <div style={{transform: "rotate(45deg)"}}>
          <PlaneIcon size={150} />
        </div>
      </div>
      {coins}
      {people(g1, L.x)}
      <div style={{position: "absolute", left: R.x, top: L.y - 170, transform: "translateX(-50%)", display: "flex", gap: 6, alignItems: "flex-end"}}>
        {g2.map((k, i) => (
          <div key={i} style={{transform: `translateY(${(1 - k) * 50}px) scale(${k})`, opacity: Math.min(1, k * 1.4)}}>
            <PersonIcon size={i % 2 ? 126 : 146} color={HOOK.ink} />
          </div>
        ))}
        <div style={{position: "relative", transform: `scale(${slot})`, opacity: slot}}>
          <PersonIcon size={146} color={HOOK.teal} dashed />
          <div style={{position: "absolute", inset: 0, transform: `scale(${you})`, opacity: you}}>
            <PersonIcon size={146} color={HOOK.teal} />
          </div>
          <div style={{position: "absolute", left: "50%", top: -64, transform: `translateX(-50%) scale(${you})`, fontFamily: SANS, fontWeight: 800, fontSize: 44, color: HOOK.teal, whiteSpace: "nowrap"}}>You?</div>
        </div>
      </div>
      {label("Group 1", L.x, grow(frame, 64.39, 12))}
      {label("Group 2", R.x, grow(frame, 65.25, 12))}
    </AbsoluteFill>
  );
};

export const Hook = () => {
  const frame = useCurrentFrame();
  const s = hookState(frame);
  const g = glitchAt(frame);
  const showStudio = frame < sec(CURTAIN_SHUT) + 2;
  return (
    <AbsoluteFill>
      {showStudio ? (
        <AbsoluteFill style={{filter: g > 0 ? "url(#rgbsplit)" : undefined, transform: g > 0 ? `translateX(${(frame % 2 ? 1 : -1) * 18 * g}px)` : undefined}}>
          <Studio3D s={s} />
        </AbsoluteFill>
      ) : null}
      <svg width={0} height={0} style={{position: "absolute"}}>
        <filter id="rgbsplit" x="-5%" y="0" width="110%" height="100%">
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
          <feOffset in="r" dx={22 * g} result="r2" />
          <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb" />
          <feOffset in="gb" dx={-22 * g} result="gb2" />
          <feBlend in="r2" in2="gb2" mode="screen" />
        </filter>
      </svg>
      {frame < sec(8.6) ? <Calendar frame={frame} /> : null}
      {frame >= sec(9) && frame < sec(13.3) ? <NotWords frame={frame} /> : null}
      <PlaneArc frame={frame} />
      <Scoreboard frame={frame} />
      <BarLabels frame={frame} s={s} />
      <Groups frame={frame} />
      <Curtain frame={frame} />
    </AbsoluteFill>
  );
};
