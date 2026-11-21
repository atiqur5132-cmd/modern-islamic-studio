import React from "react";
import {interpolate, useCurrentFrame} from "remotion";
import {Stroke, Write} from "./chalk";
import {Shot, at, travel} from "./camera";
import {Arrow, Bank, Coin, Credit, Figure, Phone, Shop, Strike} from "./icons";
import {CLAMP, LOOK, box, hand, line, ring, sec} from "./look";
import {Part} from "./part";

// 35–122 s: the problem, the 0% lie, and the brand-and-bank trick (beats.md).
// Local coordinates: (0, 0) is the screen centre at zoom 1; the receipt owns the top-right.

const A = {x: 4400, y: 0};
const B = {x: 8800, y: 0};
const C = {x: 13200, y: 0};

export const A_SHOTS: Shot[] = [
  ...at(A, travel(38.0, -80, 0, 1, {x: 400 - A.x, y: 520})),
  ...at(A, [{at: 45.9, x: -80, y: 1100, z: 1, frames: 26}]),
  ...at(A, [{at: 56.7, x: -80, y: 2150, z: 1, frames: 24}]),
  ...at(B, travel(59.8, 0, 0, 1, {x: A.x - B.x, y: 2150})),
  ...at(B, [{at: 79.9, x: 0, y: 1100, z: 1, frames: 26}]),
  ...at(C, travel(84.0, 0, 0, 1, {x: B.x - C.x, y: 1100})),
  ...at(C, [{at: 109.6, x: 0, y: 120, z: 0.9, frames: 24}]),
];

// "Banks are not charities ... one of the most profitable traps ever engineered. You aren't
// paying zero. Three hidden financial costs, and a fourth psychological cost..."
const PartA = () => {
  return (
    <Part o={A} from={35} to={60}>
      <Bank x={-480} y={0} at={38.55} s={1.25} />
      <Write text="not a charity" x={-480} y={320} size={78} anchor="middle" at={39.3} cps={26} />
      {/* The trap: a box propped on a stick, the phone as bait. */}
      <Phone x={180} y={170} at={41.3} s={0.7} />
      <Stroke d={hand([[20, -170], [380, -190], [400, 10], [40, 30], [20, -170]], 3, 801)} at={42.4} frames={14} />
      <Stroke d={line(40, 30, 380, 10, 802)} at={42.8} frames={6} width={3} color={LOOK.dim} />
      <Stroke d={line(60, 30, 40, 250, 803)} at={43.2} frames={8} />
      <Stroke d={hand([[40, 250], [-60, 280], [-200, 300]], 2, 804)} at={43.5} frames={10} width={3} color={LOOK.dim} />
      <Stroke d={line(-120, 250, 520, 250, 805)} at={41.2} frames={14} color={LOOK.dim} width={3} />
      <Write text="the most profitable trap" x={210} y={350} size={58} anchor="middle" at={43.4} cps={34} />

      {/* "You aren't paying zero." */}
      <Write text="$0" x={-560} y={1170} size={220} weight={700} anchor="middle" at={46.4} cps={8} />
      <Strike x1={-700} y1={1110} x2={-420} y2={1060} at={47.0} />
      {/* Three hidden costs, and a fourth one in the head. */}
      {[0, 1, 2].map((i) => (
        <Coin key={i} x={-180 + i * 170} y={1080} at={48.2 + i * 0.3} s={1.4} label="?" seed={810 + i * 3} />
      ))}
      <Write text="3 hidden costs" x={-10} y={1210} size={56} anchor="middle" at={49.1} />
      <Stroke d={ring(470, 1060, 70, 58, 820)} at={50.6} frames={10} />
      <Stroke d={hand([[420, 1050], [450, 1030], [480, 1060], [510, 1035]], 2, 821)} at={50.9} frames={6} width={3} />
      <Write text="+1 in your head" x={470} y={1180} size={50} anchor="middle" at={51.4} />
      <Arrow from={[470, 1220]} to={[470, 1380]} at={52.7} color={LOOK.coral} dash="12 12" />
      <Write text="your future income" x={470} y={1440} size={58} anchor="middle" color={LOOK.coral} at={53.9} cps={30} />

      {/* "Let's look at the math they hope you never do." */}
      <Write text="the math" x={-80} y={2150} size={190} weight={700} anchor="middle" at={57.4} cps={14} />
      <Stroke d={hand([[-420, 2200], [-100, 2212], [260, 2196]], 3, 830)} at={58.3} frames={12} width={6} />
      <Write text="they hope you never do" x={-80} y={2290} size={60} color={LOOK.dim} anchor="middle" at={58.6} cps={34} />
    </Part>
  );
};

// "There is no such thing as a 0% bank loan ... 14% and 18% per year ... a No-Cost sticker."
const PartB = () => {
  const frame = useCurrentFrame();
  const slap = interpolate(frame, [sec(82.3), sec(82.3) + 6], [1.6, 1], CLAMP);
  const slapO = interpolate(frame, [sec(82.3), sec(82.3) + 3], [0, 1], CLAMP);
  return (
    <Part o={B} from={60} to={84}>
      <Write text="the biggest lie" x={-780} y={-400} size={64} color={LOOK.dim} at={61.7} />
      <Write text="there is no such thing as a" x={-780} y={-320} size={52} at={63.5} cps={40} />
      <Write text="0% bank loan" x={-780} y={-130} size={170} weight={700} at={64.9} cps={16} />
      <Strike x1={-800} y1={-170} x2={60} y2={-190} at={66.0} />
      {/* The rule book. */}
      <Stroke d={hand([[-780, 120], [-600, 100], [-420, 120], [-420, 360], [-600, 340], [-780, 360], [-780, 120]], 2, 840)} at={67.1} frames={16} />
      <Stroke d={line(-600, 100, -600, 340, 841)} at={67.5} frames={8} />
      {[0, 1, 2].map((i) => (
        <Stroke key={i} d={line(-750, 170 + i * 50, -630, 165 + i * 50, 842 + i)} at={68.0 + i * 0.12} frames={5} width={3} color={LOOK.dim} />
      ))}
      <Write text="rules" x={-510} y={240} size={56} anchor="middle" at={68.4} />
      <Write text="no true 0% on card EMIs" x={-370} y={180} size={56} at={71.6} cps={34} />
      <Credit x={-780} y={430} at={70.0} until={74.0} text="Regulation · India: RBI circular, Sept 2013; other countries differ" />
      {/* The interest scale: 0–30%, the band 14–18%. */}
      <Stroke d={line(-370, 330, 400, 330, 850)} at={74.4} frames={14} />
      {[0, 10, 20, 30].map((v, i) => (
        <g key={v}>
          <Stroke d={line(-370 + i * 256, 312, -370 + i * 256, 348, 851 + i)} at={74.8 + i * 0.1} frames={4} width={3} />
          <Write text={`${v}%`} x={-370 + i * 256} y={400} size={40} color={LOOK.dim} anchor="middle" at={74.9 + i * 0.1} />
        </g>
      ))}
      <Stroke d={box(-370 + 14 * 25.6, 296, 4 * 25.6, 68, 6, 856)} at={77.2} frames={10} width={6} />
      <Write text="14%" x={-370 + 14 * 25.6} y={270} size={50} weight={700} anchor="middle" at={77.3} />
      <Write text="18%" x={-370 + 18 * 25.6} y={270} size={50} weight={700} anchor="middle" at={78.6} />
      <Write text="per year" x={430} y={345} size={46} at={79.5} />
      <Credit x={-370} y={480} at={78.0} text="Typical card EMI rates · varies by bank and card" />

      {/* "So how do they slap a No-Cost sticker on it?" */}
      <Phone x={0} y={1110} at={80.3} s={1.6} />
      <g opacity={slapO} transform={`translate(0 1080) rotate(-8) scale(${slap})`}>
        {frame >= sec(82.3) ? (
          <>
            <rect x={-150} y={-46} width={300} height={92} rx={14} fill={LOOK.ground} stroke={LOOK.chalk} strokeWidth={5} />
            <text x={0} y={18} textAnchor="middle" fontSize={58} fontWeight={700} fill={LOOK.chalk}>No-Cost!</text>
          </>
        ) : null}
      </g>
      <Write text="how?" x={300} y={1000} size={110} weight={700} at={83.0} />
    </Part>
  );
};

// "It's a magic trick between the brand and the bank" ... "Everyone wins... except you."
const PartC = () => {
  const frame = useCurrentFrame();
  // The phone travelling from the brand to you on "sells a phone".
  const px = interpolate(frame, [sec(113.4), sec(114.6)], [-560, 520], {...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <Part o={C} from={84} to={122}>
      <Write text="the trick" x={-800} y={-330} size={62} color={LOOK.dim} at={84.8} />
      <Shop x={-560} y={300} at={86.0} s={0.9} />
      <Write text="brand" x={-560} y={470} size={56} anchor="middle" at={86.2} />
      <Bank x={-20} y={330} at={86.8} s={0.8} />
      <Write text="bank" x={-20} y={470} size={56} anchor="middle" at={87.1} />

      {/* "$1,200 phone comes with $100 in bank interest" */}
      <Write text="$1,200" x={-800} y={-160} size={96} weight={700} at={88.6} cps={20} />
      <Write text="+ $100 interest" x={-470} y={-160} size={70} at={90.5} cps={30} />
      <Write text="over a year" x={-470} y={-90} size={46} color={LOOK.dim} at={92.0} />
      <Write text="= $1,300" x={0} y={-160} size={96} weight={700} at={94.2} cps={20} />
      <Strike x1={-10} y1={-180} x2={330} y2={-196} at={95.6} />
      {/* "the brand quietly gives you an upfront discount of $100" */}
      <Arrow from={[-560, 170]} to={[-640, 0]} at={96.1} bend={-30} />
      <Write text="– $100 discount" x={-500} y={70} size={52} at={97.9} />
      <Strike x1={-810} y1={-185} x2={-560} y2={-200} at={100.9} />
      <Write text="$1,100" x={-800} y={-60} size={96} weight={700} at={101.4} cps={20} />
      {/* "Then the bank adds its $100 of interest right back on top." */}
      <Arrow from={[-20, 200]} to={[-250, -50]} at={103.6} bend={50} />
      <Write text="+ $100" x={-290} y={-60} size={86} weight={700} at={104.3} cps={20} />
      <Stroke d={line(-300, -30, -70, -36, 870)} at={106.0} frames={8} />
      <Write text="your total?" x={20} y={-260} size={56} color={LOOK.dim} at={107.4} />
      {/* "Your total? $1,200." */}
      <Write text="= $1,200" x={0} y={-60} size={110} weight={700} at={108.2} cps={20} />
      <Stroke d={ring(210, -95, 250, 80, 860)} at={108.6} frames={14} />
      <Write text="nothing extra?" x={100} y={70} size={56} color={LOOK.dim} at={111.5} />
      {/* "The brand sells a phone ... The bank collects its 15% interest. Everyone wins..." */}
      <Figure x={520} y={240} at={112.9} s={0.9} />
      <Write text="you" x={520} y={510} size={56} anchor="middle" at={113.2} />
      {frame >= sec(113.4) ? (
        <g transform={`translate(${px} 260) scale(0.45)`} opacity={interpolate(frame, [sec(113.4), sec(113.6)], [0, 1], CLAMP)}>
          <rect x={-60} y={-115} width={120} height={230} rx={18} fill="none" stroke={LOOK.chalk} strokeWidth={8} />
        </g>
      ) : null}
      <Write text="15%" x={170} y={260} size={80} weight={700} at={116.9} cps={20} />
      <Write text="wins" x={-560} y={540} size={62} weight={700} anchor="middle" at={118.7} />
      <Write text="wins" x={-20} y={540} size={62} weight={700} anchor="middle" at={119.1} />
      <Stroke d={ring(170, 240, 90, 50, 871)} at={117.4} frames={10} />
      {/* "...except you." */}
      <Stroke d={ring(520, 330, 120, 220, 861)} at={120.4} frames={12} color={LOOK.coral} width={6} />
      <Write text="except you" x={520} y={600} size={64} weight={700} anchor="middle" color={LOOK.coral} at={120.6} cps={24} />
    </Part>
  );
};

export const PartsA = () => (
  <g>
    <PartA />
    <PartB />
    <PartC />
  </g>
);
