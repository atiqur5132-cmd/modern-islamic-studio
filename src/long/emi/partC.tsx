import React from "react";
import {Easing, interpolate, useCurrentFrame} from "remotion";
import {Stroke, Write} from "./chalk";
import {Shot, at, travel} from "./camera";
import {Arrow, Bank, Bubble, Car, Figure, Hatch, Headphones, Jar, Laptop, Mattress, Phone, Shop, Strike, Tv, Wrench} from "./icons";
import {CLAMP, LOOK, SERIF, box, hand, line, ring, sec} from "./look";
import {Part} from "./part";

// 243–373 s: the upgrade, stacking, subscribers, when it works, the reverse EMI, the last
// question and the last line (beats.md).

const I = {x: 35200, y: 0};
const J = {x: 39600, y: 0};
const K = {x: 44000, y: 0};
const L = {x: 48400, y: 0};
const M = {x: 52800, y: 0};
const N = {x: 57200, y: 0};

export const C_SHOTS: Shot[] = [
  ...at(I, travel(243.4, 0, 0, 1, {x: 30800 - I.x, y: 0})),
  ...at(I, [{at: 259.0, x: 0, y: 1100, z: 1, frames: 22}]),
  ...at(J, travel(262.5, 0, 0, 1, {x: I.x - J.x, y: 1100})),
  ...at(K, travel(291.3, 0, 0, 1, {x: J.x - K.x, y: 0})),
  ...at(L, travel(302.0, 0, 0, 1, {x: K.x - L.x, y: 0})),
  ...at(M, travel(322.4, 0, 0, 1, {x: L.x - M.x, y: 0})),
  ...at(M, [{at: 337.1, x: 0, y: 1050, z: 1, frames: 24}]),
  ...at(N, travel(349.4, 0, 0, 1, {x: M.x - N.x, y: 1050})),
  ...at(N, [{at: 361.9, x: 0, y: 0, z: 1.08, frames: 30}]),
  ...at(N, [{at: 367.6, x: 0, y: 0, z: 1, frames: 40}]),
];

// "First, you upgrade."
const PartI = () => (
  <Part o={I} from={243} to={262.9}>
    <Write text="1" x={-820} y={-310} size={110} weight={700} color={LOOK.coral} at={243.8} />
    <Write text="you upgrade" x={-740} y={-320} size={70} at={244.7} cps={30} />
    <Phone x={-560} y={110} at={246.9} s={0.9} />
    <Write text="$400" x={-560} y={-80} size={72} weight={700} anchor="middle" at={247.1} />
    <Stroke d={line(-660, 330, -460, 330, 1001)} at={248.7} frames={8} />
    <Write text="your budget" x={-560} y={390} size={48} color={LOOK.dim} anchor="middle" at={248.8} />
    <Figure x={480} y={100} at={249.7} s={0.85} />
    <Bubble x={-120} y={-300} w={560} h={110} at={250.6} text="just $40 more a month" size={50} tail="right" />
    <Phone x={0} y={90} at={253.3} s={1.25} />
    <Write text="Pro" x={0} y={110} size={72} weight={700} anchor="middle" at={253.6} />
    <Write text="= $480 extra" x={-180} y={380} size={64} weight={700} color={LOOK.coral} at={255.8} cps={26} />
    <Stroke d={ring(70, -245, 300, 75, 1002)} at={257.7} frames={12} />
    <Write text="all your brain sees" x={-110} y={-345} size={42} color={LOOK.dim} at={258.0} />
    {/* "So you stretch and spend three times what you planned." */}
    <Stroke d={line(-500, 1350, 500, 1350, 1003)} at={259.4} frames={12} color={LOOK.dim} />
    <Stroke d={box(-340, 1230, 180, 120, 6, 1004)} at={259.6} frames={8} />
    <Write text="planned" x={-250} y={1420} size={48} anchor="middle" at={259.8} />
    <Stroke d={box(80, 990, 180, 360, 6, 1005)} at={260.3} frames={12} />
    <Hatch x={80} y={990} w={180} h={360} at={260.5} frames={16} />
    <Write text="spent" x={170} y={1420} size={48} anchor="middle" at={261.0} />
    <Write text="3×" x={340} y={1120} size={130} weight={700} color={LOOK.coral} at={260.6} />
  </Part>
);

// "Second, you start stacking."
const PartJ = () => {
  const items = [
    {at: 266.2, label: "phone", Icon: Phone, s: 0.32},
    {at: 269.1, label: "laptop", Icon: Laptop, s: 0.42},
    {at: 271.5, label: "headphones", Icon: Headphones, s: 0.42},
    {at: 272.9, label: "mattress", Icon: Mattress, s: 0.36},
  ];
  return (
    <Part o={J} from={262.9} to={291.7}>
      <Write text="2" x={-820} y={-310} size={110} weight={700} color={LOOK.coral} at={262.9} />
      <Write text="you start stacking" x={-740} y={-320} size={70} at={264.2} cps={30} />
      {items.map(({at: t, label, Icon, s}, i) => {
        const y = 380 - i * 130;
        return (
          <g key={label}>
            <Stroke d={box(-760, y - 55, 400, 110, 12, 1010 + i)} at={t} frames={9} />
            <Icon x={-690} y={y} at={t + 0.15} s={s} seed={1020 + i * 10} />
            <Write text={label} x={-620} y={y + 16} size={46} at={t + 0.2} />
          </g>
        );
      })}
      <Write text="each one feels tiny" x={-760} y={-130} size={46} color={LOOK.dim} at={274.4} />
      {/* "Before your paycheck even hits your bank account, 40% of it is already spoken for." */}
      <Write text="6 months later" x={-100} y={40} size={52} color={LOOK.dim} at={277.2} />
      <Write text="your paycheck" x={-100} y={140} size={56} at={279.0} />
      <Stroke d={box(-100, 170, 720, 90, 10, 1030)} at={279.2} frames={12} />
      <Hatch x={-100} y={170} w={288} h={90} at={281.1} frames={24} />
      <Write text="40% spoken for" x={-100} y={340} size={60} weight={700} color={LOOK.coral} at={282.6} cps={30} />
      {/* "You are working to pay for things you already bought" */}
      {[0, 1, 2, 3].map((i) => (
        <Arrow key={i} from={[-40, 260]} to={[-350, 380 - i * 130]} at={287.0 + i * 0.15} bend={-20 + i * 8} color={LOOK.coral} width={4} frames={10} />
      ))}
      <Write text="your future" x={380} y={460} size={52} at={285.0} />
      <Strike x1={370} y1={440} x2={640} y2={430} at={286.6} />
      <Write text="working for the past" x={-100} y={460} size={50} color={LOOK.dim} at={287.6} />
      {/* "things that are already losing value" */}
      <Stroke d={box(-780, -100, 440, 545, 16, 1045)} at={289.4} frames={14} color={LOOK.coral} width={4} />
      {[0, 1, 2, 3].map((i) => (
        <Arrow key={i} from={[-320, 350 - i * 130]} to={[-320, 410 - i * 130]} at={290.0 + i * 0.1} frames={5} width={4} seed={1040 + i * 3} />
      ))}
      <Write text="losing value" x={-760} y={510} size={56} weight={700} at={290.3} />
    </Part>
  );
};

// "That's why companies love No-Cost EMI ... permanent monthly subscribers."
const PartK = () => {
  const frame = useCurrentFrame();
  const cx = 280;
  const cy = 90;
  const r = 250;
  return (
    <Part o={K} from={291.7} to={302.4}>
      <Shop x={-520} y={120} at={292.1} s={0.95} />
      <Write text="companies love it" x={-520} y={-180} size={60} anchor="middle" at={292.6} />
      <Write text="not one big sale…" x={-760} y={420} size={50} color={LOOK.dim} at={294.9} />
      <Stroke d={hand(Array.from({length: 24}, (_, i) => [cx + Math.cos(-Math.PI / 2 + (i / 24) * Math.PI * 1.9) * r, cy + Math.sin(-Math.PI / 2 + (i / 24) * Math.PI * 1.9) * r] as [number, number]), 3, 1050)} at={297.9} frames={22} />
      <Stroke d={hand([[cx - 110, cy - r - 24], [cx - 76, cy - r], [cx - 110, cy - r + 26]], 1, 1051)} at={298.6} frames={5} />
      <Figure x={cx} y={cy - 30} at={298.2} s={0.6} />
      {[0, 1, 2, 3, 4].map((k) => {
        if (frame < sec(299.4 + k * 0.4)) return null;
        const a = -Math.PI / 2 + ((frame - sec(299.4 + k * 0.4)) / 30) * Math.PI * 0.9;
        return (
          <g key={k} transform={`translate(${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r})`}>
            <circle r={22} fill={LOOK.ground} stroke={LOOK.coral} strokeWidth={4} />
            <text y={10} textAnchor="middle" fontSize={28} fontWeight={700} fill={LOOK.coral}>$</text>
          </g>
        );
      })}
      <Write text="…a monthly subscriber" x={-60} y={440} size={60} weight={700} color={LOOK.coral} at={300.0} cps={30} />
    </Part>
  );
};

// "So, should you never use No-Cost EMI? Not necessarily."
const PartL = () => {
  const rows = [
    {at: 311.3, tick: 313.4, text: "the full cash is already in your bank"},
    {at: 314.1, tick: 315.7, text: "no upfront cash discount on offer"},
    {at: 316.6, tick: 318.7, text: "it directly makes you money"},
  ];
  return (
    <Part o={L} from={302.4} to={322.8}>
      <Write text="never use it?" x={-780} y={-300} size={80} weight={700} at={303.4} cps={24} />
      <Write text="not necessarily" x={-780} y={-200} size={60} color={LOOK.dim} at={306.1} />
      <Write text="only when all three are true:" x={-780} y={-90} size={52} at={307.8} cps={40} />
      <Stroke d={line(-780, -70, -120, -76, 1068)} at={309.8} frames={10} color={LOOK.dim} width={4} />
      {rows.map((r, i) => (
        <g key={r.text}>
          <Stroke d={box(-780, -10 + i * 130, 70, 70, 8, 1060 + i)} at={r.at} frames={7} />
          <Write text={r.text} x={-680} y={45 + i * 130} size={52} at={r.at + 0.1} cps={40} />
          <Stroke d={hand([[-768, 25 + i * 130], [-748, 52 + i * 130], [-700, -15 + i * 130]], 1, 1065 + i)} at={r.tick} frames={7} width={6} />
        </g>
      ))}
      <Laptop x={420} y={150} at={319.6} s={1} />
      <Write text="for your business" x={420} y={290} size={44} color={LOOK.dim} anchor="middle" at={320.3} />
      <Wrench x={420} y={420} at={321.2} s={0.7} />
    </Part>
  );
};

// "Use a simple rule called The Reverse EMI."
const PartM = () => {
  const frame = useCurrentFrame();
  return (
    <Part o={M} from={322.8} to={349.8}>
      <Write text="the reverse EMI" x={-780} y={-300} size={96} weight={700} at={324.6} cps={22} />
      <Write text="pay yourself first" x={-780} y={-220} size={52} color={LOOK.dim} at={326.4} />
      {/* The usual way: item today, the bank $100 a month. */}
      <Phone x={-700} y={-110} at={328.3} s={0.6} />
      <Write text="$1,200" x={-560} y={-60} size={56} weight={700} at={328.8} />
      <Write text="today" x={-700} y={0} size={40} color={LOOK.dim} anchor="middle" at={329.6} />
      <Arrow from={[-640, -110]} to={[-160, -110]} at={330.4} />
      <Bank x={-60} y={-90} at={330.8} s={0.45} />
      <Write text="$100 a month to the bank" x={-560} y={-150} size={40} color={LOOK.dim} at={331.0} cps={40} />
      <Strike x1={-760} y1={-60} x2={80} y2={-160} at={332.5} color={LOOK.dim} />
      {/* The reverse: pay yourself first. */}
      <Figure x={-700} y={150} at={332.8} s={0.55} />
      <Arrow from={[-620, 220]} to={[-200, 220]} at={333.1} color={LOOK.chalk} />
      <Write text="$100 a month to you" x={-600} y={180} size={40} at={333.6} cps={40} />
      <Jar x={-40} y={200} at={333.4} s={0.8} />
      {Array.from({length: 12}, (_, k) => {
        const t = 334.0 + k * 0.18;
        if (frame < sec(t)) return null;
        const drop = interpolate(frame, [sec(t), sec(t) + 8], [-120, 0], {...CLAMP, easing: Easing.in(Easing.quad)});
        return <ellipse key={k} cx={-40 + ((k % 3) - 1) * 46} cy={300 - Math.floor(k / 3) * 26 + drop} rx={22} ry={10} fill="none" stroke={LOOK.chalk} strokeWidth={4} />;
      })}
      <Write text="savings, first" x={140} y={250} size={56} at={335.4} />
      {/* "Two things will happen." */}
      <Jar x={0} y={760} at={337.4} s={0.55} />
      <Write text="two outcomes" x={0} y={620} size={50} color={LOOK.dim} anchor="middle" at={337.6} />
      <Arrow from={[-80, 880]} to={[-420, 1060]} at={338.6} bend={20} />
      <Arrow from={[80, 880]} to={[420, 1060]} at={344.8} bend={-20} />
      <Write text="buy it in full," x={-420} y={1140} size={60} weight={700} anchor="middle" at={340.0} />
      <Write text="zero stress" x={-420} y={1210} size={60} weight={700} anchor="middle" at={341.2} />
      <Write text="+ a real cash discount" x={-420} y={1290} size={48} color={LOOK.dim} anchor="middle" at={342.6} cps={40} />
      <Write text="you didn't want it" x={420} y={1140} size={60} weight={700} anchor="middle" at={346.2} cps={30} />
      <Write text="that badly anyway" x={420} y={1210} size={60} weight={700} anchor="middle" at={347.5} cps={30} />
    </Part>
  );
};

// The last question and the last line.
const PartN = () => {
  const frame = useCurrentFrame();
  const spread = interpolate(frame, [sec(359.5), sec(359.5) + 24], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const freedom = sec(368.1);
  return (
    <Part o={N} from={349.8} to={373}>
      <Write text="sign up for a 0-cost plan?" x={-780} y={-420} size={46} color={LOOK.dim} at={350.8} until={361.8} />
      <Stroke d={hand([[-780, -362], [-720, -388], [-680, -352], [-620, -384], [-560, -354], [-480, -374], [-380, -366]], 3, 1080)} at={351.1} frames={18} until={361.8} />
      <Write text="one question" x={-780} y={-290} size={60} weight={700} at={353.3} until={361.8} />
      <Write text="?" x={300} y={240} size={200} weight={700} at={354.2} until={358.0} />
      <Write text="Am I buying this because I can afford it?" x={-780} y={-200} size={66} at={355.5} cps={30} until={361.8} />
      {/* "...or because someone sliced the price small enough..." */}
      {frame >= sec(358.2) && frame < sec(362.1) ? (
        <g opacity={interpolate(frame, [sec(361.8), sec(361.8) + 8], [1, 0], CLAMP)}>
          {Array.from({length: 12}, (_, k) => (
            <g key={k} transform={`translate(${-780 + k * 100 + spread * (k - 5.5) * 22} ${spread * (k % 2 === 0 ? -14 : 14)})`}>
              <rect x={0} y={20} width={100} height={110} fill="none" stroke={LOOK.chalk} strokeWidth={4}
                opacity={interpolate(frame, [sec(358.2 + k * 0.04), sec(358.2 + k * 0.04) + 4], [0, 1], CLAMP)} />
              {spread > 0.5 ? <text x={50} y={90} textAnchor="middle" fontSize={32} fontWeight={700} fill={LOOK.chalk} opacity={spread}>$100</text> : null}
            </g>
          ))}
          <text x={-180} y={95} textAnchor="middle" fontSize={72} fontWeight={700} fill={LOOK.chalk} opacity={1 - spread}>$1,200</text>
        </g>
      ) : null}
      <Write text="sliced small enough to hide that I can't" x={-780} y={300} size={58} color={LOOK.coral} at={359.6} cps={34} until={361.8} />
      <Write text="the most expensive thing on EMI" x={-780} y={-250} size={60} at={362.9} cps={36} until={367.6} />
      {/* "...isn't a phone, a car, or a TV." */}
      <Phone x={-520} y={30} at={365.5} s={0.9} until={367.6} />
      <Car x={0} y={40} at={366.1} s={1.2} until={367.6} />
      <Tv x={500} y={30} at={366.8} s={1.1} until={367.6} />
      {/* "It's your future freedom." The quiet last beat, held to the end. */}
      {frame >= freedom ? (
        <g opacity={interpolate(frame, [freedom, freedom + 20], [0, 1], CLAMP)}>
          <text x={-250} y={40} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={96} fill={LOOK.chalk}>your</text>
          <text x={0} y={190} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={170} fill={LOOK.coral}
            opacity={interpolate(frame, [freedom + 6, freedom + 26], [0, 1], CLAMP)}>future freedom</text>
        </g>
      ) : null}
    </Part>
  );
};

export const PartsC = () => (
  <g>
    <PartI />
    <PartJ />
    <PartK />
    <PartL />
    <PartM />
    <PartN />
  </g>
);
