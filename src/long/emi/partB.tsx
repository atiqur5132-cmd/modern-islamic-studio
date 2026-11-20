import React from "react";
import {Easing, interpolate, useCurrentFrame} from "remotion";
import {Show, Stroke, Write} from "./chalk";
import {Shot, at, travel} from "./camera";
import {Arrow, Bank, Brain, Bubble, Capitol, Card, Coin, Credit, Figure, Hatch, Head, Padlock, Pill, Shop} from "./icons";
import {CLAMP, LOOK, box, hand, line, ring, sec} from "./look";
import {Part} from "./part";

// 122–243 s: the three hidden charges, then the brain (beats.md).

const D = {x: 17600, y: 0};
const E = {x: 22000, y: 0};
const F = {x: 26400, y: 0};
const G = {x: 30800, y: 0};

export const B_SHOTS: Shot[] = [
  ...at(D, travel(127.4, 0, 0, 1, {x: 13200 - D.x, y: 120})),
  ...at(E, travel(151.0, 0, 0, 1, {x: D.x - E.x, y: 0})),
  ...at(E, [{at: 172.5, x: 0, y: 1100, z: 1, frames: 24}]),
  ...at(F, travel(177.3, 0, 0, 1, {x: E.x - F.x, y: 1100})),
  ...at(G, travel(200.8, 0, 0, 1, {x: F.x - G.x, y: 0})),
  ...at(G, [{at: 211.4, x: 120, y: -60, z: 1.7, frames: 30}]),
  ...at(G, [{at: 216.9, x: 0, y: 0, z: 1, frames: 28}]),
];

// "First: You sacrificed a real discount."
const PartD = () => {
  const frame = useCurrentFrame();
  // The $100 coin: lands in the pocket (cash), then is handed to the bank (EMI).
  const toPocket = interpolate(frame, [sec(140.2), sec(140.2) + 18], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const toBank = interpolate(frame, [sec(147.7), sec(147.7) + 36], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const cx = frame < sec(147.7) ? -150 + (380 + 150) * toPocket : 380 + (420 - 380) * toBank;
  const cy = frame < sec(147.7) ? 60 + (-150 - 60) * toPocket : -150 + (250 + 150) * toBank;
  return (
    <Part o={D} from={122} to={151}>
      <Write text="1" x={-820} y={-310} size={110} weight={700} color={LOOK.coral} at={128.0} />
      <Write text="the discount you gave up" x={-740} y={-320} size={70} at={129.1} cps={30} />
      <Stroke d={line(-740, -290, 120, -296, 905)} at={130.3} frames={12} color={LOOK.coral} />
      <Write text="think about it" x={-740} y={-210} size={48} color={LOOK.dim} at={131.6} />
      <Shop x={-560} y={150} at={132.6} s={0.8} />
      <Stroke d={hand([[-640, -110], [-460, -116], [-430, -40], [-470, 20], [-650, 26], [-640, -110]], 2, 900)} at={134.6} frames={10} />
      <Write text="$1,100" x={-550} y={-25} size={64} weight={700} anchor="middle" at={135.2} cps={20} />
      <Figure x={-150} y={60} at={136.9} s={0.8} />
      {/* Path 1: pay in full, the $100 stays in your pocket. */}
      <Arrow from={[-90, 20]} to={[250, -170]} at={137.4} bend={-30} />
      <Write text="pay in full" x={-40} y={-170} size={52} at={138.4} rotate={-14} />
      <Stroke d={box(300, -230, 170, 120, 16, 901)} at={139.2} frames={10} />
      <Stroke d={line(300, -195, 470, -195, 902)} at={139.5} frames={5} width={3} />
      <Write text="stays in your pocket" x={300} y={-60} size={46} color={LOOK.dim} at={141.9} cps={40} />
      {/* Path 2: No-Cost EMI, the $100 goes to the bank. */}
      <Arrow from={[-90, 240]} to={[250, 330]} at={143.6} bend={20} color={LOOK.coral} />
      <Write text="No-Cost EMI" x={-80} y={390} size={52} color={LOOK.coral} at={143.9} />
      <Bank x={420} y={270} at={144.4} s={0.6} />
      <Write text="you didn't avoid the interest" x={-760} y={500} size={42} color={LOOK.dim} at={145.6} cps={44} />
      <Write text="your discount pays the bank" x={420} y={440} size={46} color={LOOK.coral} anchor="middle" at={148.8} cps={40} />
      {frame >= sec(140.2) ? (
        <g transform={`translate(${cx} ${cy})`}>
          <circle r={36} fill={LOOK.ground} stroke={frame >= sec(147.7) ? LOOK.coral : LOOK.chalk} strokeWidth={5} />
          <text y={14} textAnchor="middle" fontSize={34} fontWeight={700} fill={frame >= sec(147.7) ? LOOK.coral : LOOK.chalk}>$100</text>
        </g>
      ) : null}
    </Part>
  );
};

// "Second: Processing fees and invisible taxes."
const PartE = () => {
  const frame = useCurrentFrame();
  const tilt = interpolate(frame, [sec(175.6), sec(175.6) + 30], [0, 9], {...CLAMP, easing: Easing.out(Easing.back(1.2))});
  const rows = Array.from({length: 12}, (_, i) => i);
  return (
    <Part o={E} from={151} to={177.7}>
      <Write text="2" x={-820} y={-310} size={110} weight={700} color={LOOK.coral} at={151.4} />
      <Write text="fees & invisible taxes" x={-740} y={-320} size={70} at={152.2} cps={30} />
      {/* "Even when the interest is offset by a discount" */}
      <Write text="interest  –  discount  =  0" x={-760} y={-200} size={56} color={LOOK.dim} at={154.5} cps={34} />
      {/* The statement: interest billed every single month. */}
      <Stroke d={box(-760, -150, 560, 620, 10, 910)} at={157.9} frames={14} />
      <Write text="statement" x={-730} y={-100} size={50} weight={700} at={159.2} />
      {rows.map((i) => (
        <Write key={i} text={`month ${i + 1}`} x={-730} y={-50 + i * 42} size={30} color={LOOK.dim} at={159.8 + i * 0.11} cps={80} />
      ))}
      {rows.map((i) => (
        <Write key={i} text="interest" x={-430} y={-50 + i * 42} size={30} anchor="end" at={159.85 + i * 0.11} cps={80} />
      ))}
      {/* "and governments tax bank interest" */}
      <Capitol x={320} y={190} at={162.1} s={0.85} />
      {[0, 4, 8].map((i, k) => (
        <Arrow key={i} from={[-400, -60 + i * 42]} to={[150, 120 + k * 30]} at={163.4 + k * 0.25} bend={-20 + k * 10} color={LOOK.coral} width={4} frames={12} />
      ))}
      <Write text="tax" x={320} y={-120} size={80} weight={700} color={LOOK.coral} anchor="middle" at={163.0} />
      <Write text="tax on interest that 'didn't exist'" x={-40} y={390} size={44} color={LOOK.dim} at={166.3} cps={40} />
      {/* "plus a one-time processing fee just to activate the plan" */}
      <g transform="rotate(8 -305 20)">
        <Stroke d={box(-400, -22, 190, 84, 14, 911)} at={169.3} frames={8} color={LOOK.coral} width={6} />
        <Write text="+ fee" x={-305} y={38} size={56} weight={700} anchor="middle" color={LOOK.coral} at={169.6} />
      </g>
      <Credit x={-760} y={510} at={166.0} text="Illustration · e.g. India: 18% GST on card EMI interest; fees vary by bank" />

      {/* "Suddenly, your zero-cost deal actually costs more than the sticker price." */}
      <Stroke d={hand([[-90, 1330], [0, 1064], [90, 1330]], 1.5, 912)} at={172.9} frames={10} />
      <Stroke d={line(-160, 1332, 160, 1332, 917)} at={173.0} frames={8} />
      <g transform={`rotate(${tilt} 0 1050)`}>
        <Stroke d={line(-420, 1050, 420, 1050, 913)} at={173.1} frames={10} />
        <Stroke d={hand([[-420, 1050], [-500, 1170], [-340, 1170], [-420, 1050]], 1.5, 914)} at={173.4} frames={10} />
        <Stroke d={hand([[420, 1050], [340, 1170], [500, 1170], [420, 1050]], 1.5, 915)} at={173.5} frames={10} />
        <Write text="$1,200" x={-420} y={1150} size={46} weight={700} anchor="middle" at={174.2} />
        <Write text="$1,223" x={420} y={1150} size={46} weight={700} anchor="middle" color={LOOK.coral} at={175.1} />
      </g>
      <Stroke d={ring(0, 1050, 14, 14, 916)} at={173.0} frames={5} />
      <Write text="sticker price" x={-420} y={1330} size={48} anchor="middle" at={176.4} />
      <Write text="what you pay" x={420} y={1330} size={48} anchor="middle" color={LOOK.coral} at={176.6} />
      <Write text="costs more" x={0} y={880} size={110} weight={700} anchor="middle" at={175.5} cps={20} />
    </Part>
  );
};

// "Third: The credit limit freeze."
const PartF = () => {
  const frame = useCurrentFrame();
  const needle = interpolate(frame, [sec(195.6), sec(195.6) + 24], [0, 0.8], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const ang = Math.PI * (1 - needle);
  const gx = 330;
  const gy = 220;
  const r = 190;
  return (
    <Part o={F} from={177.7} to={201}>
      <Write text="3" x={-820} y={-310} size={110} weight={700} color={LOOK.coral} at={177.7} />
      <Write text="the credit limit freeze" x={-740} y={-320} size={70} at={178.6} cps={30} />
      <Card x={-330} y={-30} at={178.7} s={0.9} />
      {/* The limit bar under the card: $1,500. */}
      <Stroke d={box(-600, 220, 540, 64, 8, 920)} at={180.8} frames={12} />
      <Write text="$1,500 limit" x={-600} y={340} size={46} color={LOOK.dim} at={181.2} />
      <Hatch x={-600} y={220} w={36} h={64} at={183.5} frames={8} until={185.9} color={LOOK.chalk} />
      <Write text="you think: $100" x={-560} y={200} size={40} color={LOOK.dim} at={183.4} until={185.9} />
      <Write text="it doesn't" x={-100} y={340} size={56} weight={700} at={185.9} until={190.5} />
      <Padlock x={-330} y={-60} at={187.0} s={1.3} />
      <Hatch x={-600} y={220} w={432} h={64} at={188.0} frames={28} />
      <Write text="$1,200 locked from day one" x={-600} y={400} size={48} color={LOOK.coral} at={188.4} cps={40} />
      <Write text="day 1" x={20} y={130} size={56} weight={700} color={LOOK.coral} at={190.2} />
      <Stroke d={ring(-490, 325, 140, 40, 925)} at={192.8} frames={12} />
      {/* The utilisation gauge: 80%. */}
      <Stroke d={hand(Array.from({length: 13}, (_, i) => [gx - Math.cos((Math.PI * i) / 12) * r, gy - Math.sin((Math.PI * i) / 12) * r] as [number, number]), 1.5, 921)} at={194.4} frames={14} />
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <Stroke key={t} d={line(gx - Math.cos(Math.PI * t) * (r - 22), gy - Math.sin(Math.PI * t) * (r - 22), gx - Math.cos(Math.PI * t) * r, gy - Math.sin(Math.PI * t) * r, 922 + i)} at={194.8} frames={4} width={3} />
      ))}
      {frame >= sec(195.4) ? (
        <line x1={gx} y1={gy} x2={gx + Math.cos(ang) * (r - 40)} y2={gy - Math.sin(ang) * (r - 40)} stroke={needle > 0.5 ? LOOK.coral : LOOK.chalk} strokeWidth={7} strokeLinecap="round" />
      ) : null}
      <Write text="utilization" x={gx} y={gy + 70} size={46} anchor="middle" color={LOOK.dim} at={194.9} />
      <Write text="80%" x={gx + 230} y={gy - 10} size={72} weight={700} color={LOOK.coral} at={196.3} />
      {/* "...silently drag down your credit score for months." */}
      <Write text="credit score" x={gx - 120} y={gy + 190} size={50} at={198.6} />
      <Arrow from={[gx + 140, gy + 130]} to={[gx + 190, gy + 230]} at={198.9} color={LOOK.coral} frames={10} />
    </Part>
  );
};

// "Now, if the trap ended there..." then into the brain: the pain of paying.
const PartG = () => {
  const frame = useCurrentFrame();
  const pillY = interpolate(frame, [sec(231.5), sec(231.5) + 22], [-200, -250], {...CLAMP, easing: Easing.in(Easing.quad)});
  const alarm = frame >= sec(220.4) && frame < sec(234.3) ? 1 : 0;
  const pulse = (k: number) => Math.sin(frame / 2 + k) * 4;
  return (
    <Part o={G} from={201} to={243}>
      <Figure x={-560} y={60} at={201.6} s={0.9} pose="shrug" until={211.0} />
      <Coin x={-400} y={-90} at={204.4} label="–" s={1.1} until={211.0} />
      <Write text="$100 gone" x={-340} y={-80} size={52} at={204.8} until={211.0} />
      <Write text="lesson learned" x={-720} y={400} size={52} color={LOOK.dim} at={205.6} until={211.0} />
      <Arrow from={[-420, 300]} to={[-160, 300]} at={206.5} until={211.0} />
      <Write text="the real trap" x={-80} y={-380} size={70} weight={700} at={208.0} until={216.5} />
      <Head x={140} y={0} at={208.0} s={0.9} />
      <Write text="not the fees" x={-80} y={-300} size={52} color={LOOK.dim} at={210.2} until={216.5} />
      <Brain x={130} y={-60} at={212.0} s={0.8} />
      <Write text="the pain of paying" x={130} y={160} size={56} anchor="middle" at={214.3} cps={30} />
      {/* "When you hand over $1,200 in cash, the pain centers in your brain light up." */}
      {[0, 1, 2].map((i) => (
        <Stroke key={i} d={box(-700, 40 - i * 46, 260, 40, 6, 930 + i)} at={218.0 + i * 0.12} frames={6} />
      ))}
      <Write text="$1,200 in cash" x={-700} y={130} size={52} at={218.4} />
      <Arrow from={[-420, -20]} to={[-100, -60]} at={219.4} bend={-30} />
      {alarm ? (
        <g>
          {[[-30, -230, -60, -290], [90, -250, 100, -320], [210, -230, 250, -290], [60, -200, 30, -260]].map(([x1, y1, x2, y2], i) => (
            <path key={i} d={hand([[x1 + 110, y1 + 40], [(x1 + x2) / 2 + 110 + pulse(i), (y1 + y2) / 2 + 40], [x2 + 110, y2 + 40]], 1, 940 + i)}
              stroke={LOOK.chalk} strokeWidth={6} fill="none" strokeLinecap="round"
              opacity={interpolate(frame, [sec(220.4 + i * 0.25), sec(220.4 + i * 0.25) + 6], [0, 1], CLAMP)} />
          ))}
        </g>
      ) : null}
      <Write text="ouch" x={300} y={-290} size={64} weight={700} at={222.1} until={234.3} />
      <Credit x={-840} y={500} at={219.0} text="Science · Prelec & Loewenstein 1998; Knutson et al., Neuron 2007" />
      {/* "It's a built-in defense mechanism." */}
      <Stroke d={hand([[-260, -280], [-170, -310], [-80, -280], [-90, -180], [-170, -120], [-250, -180], [-260, -280]], 2, 950)} at={223.9} frames={12} until={240.5} />
      <Write text="defense" x={-170} y={-330} size={46} anchor="middle" at={224.2} until={240.5} />
      <Write text="discomfort → pause" x={-560} y={260} size={46} color={LOOK.dim} at={225.4} until={234.3} />
      {/* "Wait — do I actually need this?" */}
      <Bubble x={-880} y={-420} w={600} h={120} at={227.9} text="Wait… do I need this?" size={52} until={231.0} />
      {/* "No-Cost EMI is a painkiller designed to shut that alarm off." */}
      {frame >= sec(230.6) ? (
        <g transform={`translate(${-500 + (130 + 500) * interpolate(frame, [sec(231.5), sec(231.5) + 22], [0, 1], CLAMP)} ${pillY})`}>
          <Pill x={0} y={0} at={230.6} s={0.8} until={236.0} />
        </g>
      ) : null}
      <Write text="painkiller" x={-860} y={-330} size={64} weight={700} at={232.3} until={239.5} />
      {/* "Your brain doesn't panic at $100 a month. It barely flinches." */}
      <Stroke d={hand([[-860, 430], [-300, 432], [-260, 410], [-230, 432], [600, 430]], 1, 960)} at={235.3} frames={24} />
      <Write text="$100 a month" x={-250} y={380} size={46} color={LOOK.dim} anchor="middle" at={236.8} />
      <Write text="barely flinches" x={-860} y={380} size={46} color={LOOK.dim} at={238.3} />
      <Write text="pain: gone" x={300} y={-290} size={56} color={LOOK.dim} at={240.0} />
      {/* "...two dangerous things happen." */}
      <Show at={241.9} frames={10}>
        <circle cx={-800} cy={-320} r={44} fill="none" stroke={LOOK.coral} strokeWidth={6} />
        <text x={-800} y={-302} textAnchor="middle" fontSize={56} fontWeight={700} fill={LOOK.coral}>1</text>
        <circle cx={-680} cy={-320} r={44} fill="none" stroke={LOOK.coral} strokeWidth={6} />
        <text x={-680} y={-302} textAnchor="middle" fontSize={56} fontWeight={700} fill={LOOK.coral}>2</text>
      </Show>
      <Write text="two dangerous things" x={-600} y={-300} size={56} at={242.0} cps={34} />
    </Part>
  );
};

export const PartsB = () => (
  <g>
    <PartD />
    <PartE />
    <PartF />
    <PartG />
  </g>
);

