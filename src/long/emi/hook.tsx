import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {Show, Stroke, Write} from "./chalk";
import {CLAMP, LOOK, box, grow, hand, line, ring, sec} from "./look";
import {Shot} from "./camera";

// 0–38 s: the hook (beats.md, "Hook storyboard"). World coordinates: the big phone sits at
// x −420, the shop far left, the 12-month strip and the timeline to the right.

export const HOOK_SHOTS: Shot[] = [
  {at: 0, x: 0, y: 0, z: 1},
  {at: 3.6, x: -2000, y: 20, z: 1, frames: 26}, // "walk into a store"
  {at: 6.3, x: -420, y: -10, z: 1.12, frames: 26}, // "$1,200 smartphone"
  {at: 9.8, x: -180, y: 0, z: 1, frames: 26}, // the jar beside it
  {at: 15.3, x: -200, y: 330, z: 1, frames: 30}, // "right below the price"
  {at: 21.9, x: 1560, y: 420, z: 1, frames: 30}, // the 12-month strip
  {at: 27.5, x: 1900, y: 400, z: 0.82, frames: 30}, // beating the system
  {at: 30.0, x: 1560, y: 1180, z: 1, frames: 30}, // today → tomorrow
  {at: 35.0, x: 400, y: 520, z: 0.4, frames: 54}, // pull back on "one massive problem"
];

// The big phone and its price tag (always on the board).
const BigPhone = () => {
  const frame = useCurrentFrame();
  // The tag sways on its string from frame 0 (motion on the first frame), settling slowly.
  const sway = Math.sin(frame / 11) * interpolate(frame, [0, sec(12)], [7, 2.5], CLAMP);
  return (
    <g>
      <Stroke d={box(-590, -330, 340, 660, 46, 3)} at={-2} />
      <Stroke d={box(-562, -280, 284, 540, 14, 5)} at={-2} width={3} color={LOOK.dim} />
      <Stroke d={line(-455, -305, -385, -305, 7)} at={-2} width={4} />
      <Stroke d={ring(-420, 292, 22, 22, 9, 1.02)} at={-2} width={3} />
      {/* Price tag hanging from the top-right corner. */}
      <g transform={`rotate(${sway} -262 -300)`}>
        <Stroke d={hand([[-262, -300], [-225, -250], [-205, -205]], 2, 11)} at={-2} width={3} />
        <Stroke d={hand([[-230, -200], [-180, -212], [-40, -180], [-58, -60], [-200, -88], [-250, -150], [-230, -200]], 2, 13)} at={-2} />
        <Stroke d={ring(-205, -178, 9, 9, 15)} at={-2} width={3} />
        <Write text="$1,200" x={-150} y={-112} size={62} weight={700} anchor="middle" at={-2} />
        {/* "$1,200 smartphone": the price ringed as it is said. */}
        <Stroke d={ring(-148, -130, 92, 46, 17)} at={7.8} frames={16} color={LOOK.chalk} width={4} />
      </g>
    </g>
  );
};

// Frame 0's line beside the phone, wiped before the camera returns.
const Title = () => (
  <g>
    <Write text="the greatest" x={60} y={-70} size={92} at={-2} until={6.2} />
    <Write text="loophole" x={56} y={86} size={168} weight={700} at={-2} until={6.2} />
    <Stroke d={hand([[60, 122], [250, 132], [480, 118], [640, 128]], 3, 21)} at={1.6} frames={14} until={6.2} width={6} />
    <Write text="in modern finance" x={62} y={200} size={66} color={LOOK.dim} at={2.15} until={6.2} />
  </g>
);

// "You walk into a store, or scroll through an app".
const Shop = () => {
  const frame = useCurrentFrame();
  const walk = interpolate(frame, [sec(4.0), sec(5.6)], [-2560, -2005], CLAMP);
  const step = Math.sin(frame / 3) * 10;
  // Product cards scrolling on the app phone.
  const scroll = interpolate(frame, [sec(5.4), sec(6.4)], [0, -210], CLAMP);
  return (
    <g>
      {/* Shopfront: awning, scallops, window and door. */}
      <Stroke d={line(-2420, -230, -1880, -230, 31)} at={3.8} frames={12} />
      <Stroke d={hand([[-2440, -230], [-2400, -120], [-1900, -120], [-1860, -230]], 2, 33)} at={3.85} frames={14} />
      <Stroke d={hand([[-2400, -120], [-2350, -88], [-2300, -120], [-2250, -88], [-2200, -120], [-2150, -88], [-2100, -120], [-2050, -88], [-2000, -120], [-1950, -88], [-1900, -120]], 1.5, 35)} at={4.0} frames={14} width={4} />
      <Stroke d={line(-2400, -120, -2400, 300, 37)} at={4.1} frames={10} />
      <Stroke d={line(-1900, -120, -1900, 300, 38)} at={4.2} frames={10} />
      <Stroke d={box(-2350, -40, 220, 180, 8, 39)} at={4.3} frames={14} width={4} />
      <Stroke d={hand([[-2060, 300], [-2060, 0], [-1950, 0], [-1950, 300]], 1.5, 41)} at={4.35} frames={14} width={4} />
      <Write text="STORE" x={-2150} y={-168} size={58} weight={700} anchor="middle" at={4.0} cps={30} />
      <Stroke d={line(-2700, 300, -1600, 300, 43)} at={3.8} frames={16} color={LOOK.dim} width={3} />
      {/* A figure walking in. */}
      <Show at={4.0} until={5.65} frames={6}>
        <g transform={`translate(${walk} 0)`}>
          <circle cx={0} cy={110} r={26} fill="none" stroke={LOOK.chalk} strokeWidth={5} />
          <path d={`M0,136 L0,220 M0,160 L${-22 + step},196 M0,160 L${22 - step},196 M0,220 L${-18 - step},298 M0,220 L${18 + step},298`}
            stroke={LOOK.chalk} strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      </Show>
      {/* The app phone beside the shop. */}
      <Write text="or" x={-1760} y={60} size={64} color={LOOK.dim} at={5.2} />
      <Stroke d={box(-1660, -170, 200, 380, 30, 45)} at={5.3} frames={12} />
      <defs>
        <clipPath id="appScreen">
          <rect x={-1646} y={-140} width={172} height={322} />
        </clipPath>
      </defs>
      <Show at={5.4} frames={8}>
        <g clipPath="url(#appScreen)">
          <g transform={`translate(0 ${scroll})`}>
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i}>
                <rect x={-1630} y={-125 + i * 105} width={140} height={88} rx={10} fill="none" stroke={LOOK.dim} strokeWidth={3} />
                <rect x={-1618} y={-113 + i * 105} width={40} height={64} rx={6} fill="none" stroke={i === 2 ? LOOK.chalk : LOOK.dim} strokeWidth={3} />
                <line x1={-1568} y1={-95 + i * 105} x2={-1505} y2={-95 + i * 105} stroke={LOOK.dim} strokeWidth={3} />
                <line x1={-1568} y1={-72 + i * 105} x2={-1525} y2={-72 + i * 105} stroke={LOOK.dim} strokeWidth={3} />
              </g>
            ))}
          </g>
        </g>
      </Show>
    </g>
  );
};

// "You don't have $1,200 sitting in your bank account" — a jar a third full, a dashed
// arrow from the price that stops short; "not that you want to spend today" — a lid.
const Jar = () => {
  const frame = useCurrentFrame();
  const coins = [[60, 250], [110, 262], [160, 250], [85, 220], [138, 226]] as const;
  return (
    <g>
      <Stroke d={hand([[20, -10], [10, 40], [10, 270], [40, 300], [180, 300], [210, 270], [210, 40], [200, -10]], 2, 51)} at={10.1} frames={18} />
      <Stroke d={hand([[14, 160], [110, 168], [206, 158]], 2, 53)} at={10.5} frames={10} width={3} color={LOOK.dim} />
      {coins.map(([x, y], i) => (
        <Stroke key={i} d={ring(x, y, 22, 11, 60 + i)} at={10.6 + i * 0.1} frames={8} width={4} />
      ))}
      <Write text="savings" x={110} y={360} size={52} color={LOOK.dim} anchor="middle" at={11.9} />
      <Stroke d={hand([[-60, -160], [0, -110], [60, -60], [100, -30]], 2, 55)} at={10.9} frames={16} width={4} dash="14 14" />
      <Write text="?" x={130} y={-50} size={84} weight={700} at={12.1} until={15.2} />
      {/* The lid goes on. */}
      <g transform={`translate(0 ${interpolate(frame, [sec(13.4), sec(13.4) + 12], [-40, 0], CLAMP)})`}>
        <Stroke d={box(0, -42, 220, 36, 10, 57)} at={13.4} frames={10} />
      </g>
      <Write text="not today" x={250} y={60} size={56} color={LOOK.dim} at={14.0} rotate={-4} until={15.2} />
    </g>
  );
};

// "Those three magic words: No-Cost EMI." Three blanks under the phone, a word on each.
const MagicWords = () => {
  const blanks = [-700, -380, -60];
  const words = [{t: "No", at: 20.33}, {t: "Cost", at: 20.51}, {t: "EMI", at: 21.17}];
  return (
    <g>
      <Stroke d={hand([[-150, -60], [-150, 140], [-150, 330]], 2, 61)} at={15.6} frames={14} width={3} dash="10 14" color={LOOK.dim} />
      {blanks.map((x, i) => (
        <Stroke key={i} d={line(x, 560, x + 240, 560, 63 + i)} at={18.2 + i * 0.3} frames={10} />
      ))}
      {words.map((w, i) => (
        <Write key={w.t} text={w.t} x={blanks[i] + 120} y={535} size={130} weight={700} anchor="middle" at={w.at} cps={18} />
      ))}
      <Stroke d={box(-760, 380, 1000, 230, 34, 67)} at={21.7} frames={18} width={6} />
      <Write text="the magic words" x={-760} y={680} size={52} color={LOOK.dim} at={22.0} />
    </g>
  );
};

// "Just $100 a month for twelve months. Zero interest. Zero extra cost."
const Strip = () => {
  const frame = useCurrentFrame();
  const months = Array.from({length: 12}, (_, i) => i);
  return (
    <g>
      <Write text="12 months" x={920} y={300} size={64} at={22.2} />
      {months.map((i) => (
        <Stroke key={i} d={box(920 + i * 108, 340, 96, 96, 10, 70 + i)} at={22.2 + i * 0.05} frames={8} width={4} />
      ))}
      {months.map((i) => {
        const at = 22.67 + i * 0.12;
        const pop = grow(frame, at, 6);
        return (
          <g key={i} opacity={pop}>
            <Write text="$100" x={968 + i * 108} y={403} size={40} weight={700} anchor="middle" at={at} cps={60} />
          </g>
        );
      })}
      <Write text="0% interest" x={940} y={560} size={84} weight={700} at={24.89} cps={30} />
      <Write text="$0 extra" x={1640} y={560} size={84} weight={700} at={25.95} cps={30} />
    </g>
  );
};

// "It feels like you're beating the system." A figure with the phone, arms up.
const Winner = () => (
  <g>
    <Stroke d={ring(2540, 220, 34, 34, 81)} at={27.75} frames={10} />
    <Stroke d={hand([[2540, 256], [2540, 330], [2540, 400]], 1.5, 83)} at={27.85} frames={8} />
    <Stroke d={hand([[2540, 290], [2500, 240], [2480, 180]], 1.5, 85)} at={27.95} frames={8} />
    <Stroke d={hand([[2540, 290], [2580, 240], [2600, 180]], 1.5, 87)} at={27.95} frames={8} />
    <Stroke d={box(2584, 130, 34, 56, 6, 89)} at={28.1} frames={8} width={4} />
    <Stroke d={hand([[2540, 400], [2515, 470], [2505, 520]], 1.5, 91)} at={28.0} frames={8} />
    <Stroke d={hand([[2540, 400], [2565, 470], [2575, 520]], 1.5, 93)} at={28.0} frames={8} />
    {[[-80, -40], [-60, -95], [80, -40], [60, -95]].map(([dx, dy], i) => (
      <Stroke key={i} d={line(2540 + dx * 0.7, 210 + dy * 0.7, 2540 + dx * 1.1, 210 + dy * 1.1, 95 + i)} at={28.6 + i * 0.05} frames={6} width={4} color={LOOK.dim} />
    ))}
  </g>
);

// "You get the phone today, and you pay for it slowly with tomorrow's money — for free."
const Timeline = () => {
  const frame = useCurrentFrame();
  const coin = (k: number) => {
    const t0 = sec(31.6 + k * 0.35);
    const x = interpolate(frame, [t0, t0 + 30], [2240, 980], {...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 3)});
    const o = interpolate(frame, [t0, t0 + 4, t0 + 26, t0 + 32], [0, 1, 1, 0], CLAMP);
    return {x, o};
  };
  return (
    <g>
      <Stroke d={hand([[860, 1180], [1500, 1186], [2300, 1176]], 2, 101)} at={30.2} frames={22} />
      <Stroke d={hand([[2270, 1150], [2310, 1176], [2270, 1204]], 1.5, 103)} at={30.9} frames={6} />
      {Array.from({length: 12}, (_, i) => (
        <Stroke key={i} d={line(960 + i * 110, 1164, 960 + i * 110, 1196, 110 + i)} at={30.5 + i * 0.04} frames={5} width={3} color={LOOK.dim} />
      ))}
      <Stroke d={box(840, 960, 80, 150, 14, 121)} at={30.5} frames={10} width={4} />
      <Write text="today" x={880} y={1270} size={60} anchor="middle" at={30.75} />
      <Write text="tomorrow's money" x={2290} y={1270} size={60} anchor="end" at={32.6} cps={36} />
      {[0, 1, 2, 3, 4].map((k) => {
        const c = coin(k);
        return frame >= sec(31.6 + k * 0.35) ? (
          <g key={k} opacity={c.o}>
            <circle cx={c.x} cy={1110} r={28} fill="none" stroke={LOOK.chalk} strokeWidth={4} />
            <text x={c.x} y={1124} textAnchor="middle" fontSize={38} fontWeight={700} fill={LOOK.chalk} style={{fontFamily: "inherit"}}>$</text>
          </g>
        ) : null;
      })}
      <Write text="for free." x={1560} y={1440} size={150} weight={700} anchor="middle" at={34.05} cps={20} />
    </g>
  );
};

export const Hook = () => (
  <g>
    <Title />
    <BigPhone />
    <Shop />
    <Jar />
    <MagicWords />
    <Strip />
    <Winner />
    <Timeline />
  </g>
);
