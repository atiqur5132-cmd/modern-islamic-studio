import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {Basket, Bill, Card2D, Cart, Checklist, Clock, Controller, Flask, Headphones, Hourglass, Moon, Paddle, Phone, Plate, PointsCoin, Question, Target, Trophy} from "./art";
import {Flyer} from "./cash";
import {BarPair, Meter, Progress, Waterfall} from "./charts";
import {PersonIcon, ShieldIcon} from "./icons";
import {Credit, Pop, Show, Words} from "./kit";
import {CH, CLAMP, grow, pop, SANS, sec} from "./look";

// Chapter 3, "The spending game" (217.9–305.3 s), violet: the mind trick.
const P = CH.game;
const art = {a: P.accent, ink: P.ink, s: "#ffffff"};

const Disciplined = () => {
  const frame = useCurrentFrame();
  const wobble = frame > sec(225.0) ? Math.sin((frame - sec(225.0)) * 0.5) * 10 * Math.max(0, 1 - (frame - sec(225.0)) / 40) : 0;
  return (
    <Show from={217.9} to={226.2}>
      <Pop at={218.0} x={520} y={560}>
        <PersonIcon size={260} color={P.ink} />
      </Pop>
      <Pop at={220.5} x={700} y={450}>
        <ShieldIcon size={150} color={P.ink} />
      </Pop>
      <Pop at={221.5} x={1050} y={520}>
        <Checklist {...art} size={260} k={interpolate(frame, [sec(221.7), sec(223.4)], [0, 1], CLAMP)} />
      </Pop>
      <Words at={222.3} x={1050} y={700} align="center" size={44} color={P.inkSoft}>
        paid in full, every month
      </Words>
      <div style={{position: "absolute", left: 1480, top: 520, transform: `translate(-50%,-50%) scale(${pop(frame, 224.2)}) rotate(${wobble}deg)`, filter: "drop-shadow(0 20px 24px rgba(0,0,0,0.18))"}}>
        <Trophy a="#f2d16b" ink={P.ink} size={240} />
      </div>
      <Words at={225.1} x={1480} y={700} align="center" size={56} color={P.accent} serif>
        Maybe.
      </Words>
    </Show>
  );
};

const Layers = () => {
  const frame = useCurrentFrame();
  const layer = (i: number, color: string, label: string, at: number, glow = 0) => {
    const k = grow(frame, at, 14, Easing.out(Easing.back(1.6)));
    return (
      <div key={i} style={{position: "absolute", left: 960, top: 700 - i * 130, transform: `translate(-50%,-50%) translateY(${(1 - k) * -80}px) rotateX(58deg) rotateZ(-38deg)`, opacity: k, transformStyle: "preserve-3d"}}>
        <div style={{width: 520, height: 520, borderRadius: 34, background: color, boxShadow: `0 ${30 + glow * 20}px 0 rgba(0,0,0,0.18)${glow ? `, 0 0 ${80 * glow}px ${P.accent}` : ""}`}} />
        <div style={{position: "absolute", left: 40, top: 40, fontFamily: SANS, fontWeight: 800, fontSize: 64, color: "#fff"}}>{label}</div>
      </div>
    );
  };
  return (
    <Show from={226.3} to={231.7}>
      <div style={{position: "absolute", inset: 0, perspective: 1600}}>
        {layer(0, CH.cash.accent, "1 · fees", 226.4)}
        {layer(1, CH.revolve.accent, "2 · interest", 226.6)}
        {layer(2, P.accent, "3 · ?", 226.9, grow(frame, 227.2, 16))}
      </div>
      <Words at={228.4} x={1360} y={340} size={50} color={P.ink}>
        catches the smartest
      </Words>
      <Words at={229.8} x={1360} y={410} size={40} color={P.accent}>
        and the most disciplined
      </Words>
    </Show>
  );
};

const Mit = () => {
  const frame = useCurrentFrame();
  return (
    <Show from={231.8} to={244.1}>
      <Pop at={232.4} x={300} y={300}>
        <Flask {...art} size={200} />
      </Pop>
      <Words at={233.5} x={420} y={250} size={70} color={P.ink}>
        MIT
      </Words>
      <Words at={234.7} x={420} y={330} size={40} color={P.inkSoft}>
        a famous experiment
      </Words>
      <Pop at={236.9} x={420} y={680} rotate={-10}>
        <Paddle a={P.soft} ink={P.ink} s={P.ink} size={210} text="CASH" />
      </Pop>
      <Pop at={238.2} x={700} y={660} rotate={8}>
        <Paddle {...art} size={230} text="CARD" />
      </Pop>
      <div style={{position: "absolute", left: 1060, top: 260, opacity: grow(frame, 239.3, 10)}}>
        <BarPair pal={P} a={0} b={0} at={[239.6, 241.2]} labels={["cash", "card"]} heights={[160, 390]} />
      </div>
      <Words at={242.6} x={1520} y={170} align="center" size={52} color={P.accent}>
        willing to spend more
      </Words>
      <Credit from={233.6} to={244.0} text="Prelec & Simester, MIT (2001): sealed-bid auctions for sports tickets, card vs cash" pal={P} />
    </Show>
  );
};

const Baskets = () => {
  const frame = useCurrentFrame();
  return (
    <Show from={244.2} to={252.0}>
      <Pop at={244.9} x={620} y={560}>
        <Basket a={P.soft} ink={P.ink} size={300} fill={0.6} />
      </Pop>
      <Pop at={245.0} x={620} y={330} scale={0.9}>
        <Bill {...art} size={170} />
      </Pop>
      <Pop at={246.0} x={1300} y={560}>
        <Basket {...art} size={330} fill={1} />
      </Pop>
      <Pop at={246.1} x={1300} y={320} scale={0.9}>
        <Card2D {...art} size={190} />
      </Pop>
      <Words at={244.9} x={960} y={860} align="center" size={46} color={P.inkSoft}>
        everyday purchases
      </Words>
      <Pop at={249.0} x={1520} y={480}>
        <svg width={110} height={150} viewBox="0 0 100 140">
          <path d="M50 8 L90 60 H64 V132 H36 V60 H10 Z" fill={P.accent} />
        </svg>
      </Pop>
      <Words at={250.2} x={1300} y={760} align="center" size={50} color={P.accent}>
        more with plastic
      </Words>
      <div style={{opacity: grow(frame, 0, 1) * 0}} />
    </Show>
  );
};

const Pain = () => {
  const frame = useCurrentFrame();
  const cash = interpolate(frame, [sec(256.4), sec(258.4)], [0, 0.88], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const card = interpolate(frame, [sec(259.8), sec(260.6)], [0, 0.1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const away = interpolate(frame, [sec(262.2), sec(263.2)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  return (
    <Show from={252.1} to={263.7}>
      <Pop at={252.1} x={960} y={220} out={253.6}>
        <Question size={180} color={P.accent} />
      </Pop>
      <Words at={253.9} x={960} y={150} align="center" size={60} color={P.ink}>
        the pain of paying
      </Words>
      <Pop at={254.6} x={640} y={560}>
        <Meter pal={P} k={cash} label="cash" hot="#c43f6a" />
      </Pop>
      <Pop at={256.2} x={400} y={560} rotate={-10}>
        <Bill {...art} size={200} />
      </Pop>
      <Words at={258.1} x={400} y={700} align="center" size={44} color={P.ink}>
        feels like a loss
      </Words>
      <Pop at={254.8} x={1280} y={560}>
        <Meter pal={P} k={card} label="card" hot="#c43f6a" />
      </Pop>
      <Pop at={259.4} x={1530} y={560} rotate={8}>
        <Card2D {...art} size={220} />
      </Pop>
      <Words at={261.4} x={1530} y={700} align="center" size={44} color={P.ink}>
        feels like a promise
      </Words>
      <div style={{position: "absolute", left: 1530 + away * 260, top: 360 - away * 40, transform: `translate(-50%,-50%) scale(${pop(frame, 262.2) * (1 - away * 0.4)})`, opacity: 1 - away * 0.5, fontFamily: SANS}}>
        <div style={{padding: "14px 24px", borderRadius: 14, background: "#fff", boxShadow: "0 14px 26px rgba(0,0,0,0.14)", fontWeight: 800, fontSize: 40, color: P.accent}}>+30 days</div>
      </div>
    </Show>
  );
};

const Gamified = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [sec(267.2), sec(270.6)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.quad)});
  const points = Math.round(60000 * grow(frame, 269.7, 30, Easing.out(Easing.quad)));
  return (
    <Show from={263.8} to={271.7}>
      <Pop at={265.7} x={420} y={520}>
        <Controller {...art} size={280} />
      </Pop>
      <Words at={265.9} x={420} y={690} align="center" size={46} color={P.inkSoft}>
        gamification
      </Words>
      <Pop at={266.8} x={1180} y={540}>
        <Phone {...art} size={700}>
          <div style={{padding: "60px 34px", fontFamily: SANS, display: "flex", flexDirection: "column", gap: 26}}>
            <div style={{fontWeight: 800, fontSize: 30, color: P.inkSoft, letterSpacing: 3}}>SIGN-UP BONUS</div>
            <div style={{fontWeight: 800, fontSize: 48, color: P.ink, lineHeight: 1.1}}>Spend $4,000 in 90 days</div>
            <Progress pal={P} k={fill} width={320} />
            <div style={{fontWeight: 700, fontSize: 30, color: P.inkSoft}}>${Math.round(4000 * fill).toLocaleString("en-US")} of $4,000</div>
            <div style={{marginTop: 20, fontWeight: 800, fontSize: 62, color: P.accent}}>{points.toLocaleString("en-US")}</div>
            <div style={{fontWeight: 700, fontSize: 30, color: P.inkSoft, marginTop: -16}}>bonus points</div>
          </div>
        </Phone>
      </Pop>
      <Pop at={271.0} x={1560} y={300}>
        <PointsCoin {...art} size={150} />
      </Pop>
    </Show>
  );
};

const Chase = () => {
  const frame = useCurrentFrame();
  const stretch = interpolate(frame, [sec(275.8), sec(276.8)], [0.8, 1.25], {...CLAMP, easing: Easing.out(Easing.back(1.4))});
  const run = interpolate(frame, [sec(277.3), sec(279.0)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  return (
    <Show from={271.8} to={279.1}>
      <Pop at={271.9} x={760} y={560}>
        <Cart {...art} size={340} />
      </Pop>
      <Flyer a={272.9} b={273.6} from={[300, 200]} to={[760, 480]} lift={120}>
        <Plate {...art} size={140} />
      </Flyer>
      <Flyer a={274.1} b={274.8} from={[1300, 160]} to={[800, 470]} lift={120}>
        <Headphones {...art} size={130} />
      </Flyer>
      <div style={{position: "absolute", left: 360, top: 860, width: 800, opacity: grow(frame, 275.6, 10)}}>
        <div style={{height: 44, width: 800 * stretch, borderRadius: 22, background: stretch > 1 ? `linear-gradient(90deg, ${P.accent} 80%, #c43f6a 80%)` : P.accent}} />
        <div style={{position: "absolute", left: 800, top: -20, height: 84, borderLeft: `4px dashed ${P.ink}`}} />
        <div style={{marginTop: 12, fontFamily: SANS, fontWeight: 700, fontSize: 36, color: P.inkSoft}}>your budget</div>
      </div>
      <div style={{position: "absolute", left: 1380 + run * 300, top: 480, transform: `translate(-50%,-50%) scale(${pop(frame, 277.4)})`, filter: "drop-shadow(0 16px 20px rgba(0,0,0,0.18))"}}>
        <Target {...art} size={170} />
      </div>
      <Words at={277.6} x={1380} y={620} align="center" size={46} color={P.accent}>
        chasing a reward
      </Words>
    </Show>
  );
};

const Math450 = () => (
  <Show from={279.2} to={291.6}>
    <Pop at={280.9} x={260} y={200} out={291.4}>
      <Card2D {...art} size={200} />
    </Pop>
    <div style={{position: "absolute", left: 420, top: 260}}>
      <Waterfall
        pal={P}
        steps={[
          {label: "extra spending", value: -500, at: 282.7},
          {label: "cash back", value: 50, at: 285.6},
          {label: "you", value: -450, at: 289.4, total: true},
        ]}
      />
    </div>
    <Words at={287.6} x={960} y={150} align="center" size={56} color={P.ink} serif>
      You didn't make $50.
    </Words>
  </Show>
);

const Breakage = () => {
  const frame = useCurrentFrame();
  const grey = grow(frame, 298.3, 16);
  const shrink = 1 - 0.25 * grow(frame, 300.6, 16) - 0.25 * grow(frame, 303.6, 14);
  const coins = [
    [860, 640],
    [1000, 640],
    [1140, 640],
    [930, 520],
    [1070, 520],
    [1000, 400],
  ];
  return (
    <Show from={291.7} to={305.2}>
      {coins.map(([x, y], i) => (
        <div key={i} style={{position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${pop(frame, 293.0 + i * 0.08) * shrink})`, filter: `grayscale(${i % 2 ? grey : grey * 0.4}) drop-shadow(0 12px 14px rgba(0,0,0,0.18))`, opacity: i % 3 === 0 ? 1 - 0.5 * grey : 1}}>
          <PointsCoin {...art} size={150} />
        </div>
      ))}
      <Words at={295.2} x={1000} y={170} align="center" size={72} color={P.ink}>
        breakage
      </Words>
      <Words at={296.3} x={1000} y={260} align="center" size={40} color={P.inkSoft}>
        billions in rewards never used
      </Words>
      <Pop at={298.3} x={420} y={420}>
        <Clock {...art} size={150} t={(frame / 30) * 0.4} />
      </Pop>
      <Words at={298.5} x={420} y={530} align="center" size={40} color={P.ink}>
        unredeemed
      </Words>
      <Pop at={299.2} x={420} y={720}>
        <Hourglass {...art} size={150} k={grow(frame, 299.2, 40)} />
      </Pop>
      <Words at={299.4} x={420} y={830} align="center" size={40} color={P.ink}>
        expired
      </Words>
      <Pop at={300.6} x={1560} y={420}>
        <svg width={130} height={150} viewBox="0 0 100 140">
          <path d="M50 132 L90 80 H64 V8 H36 V80 H10 Z" fill={P.accent} />
        </svg>
      </Pop>
      <Words at={300.8} x={1560} y={540} align="center" size={40} color={P.ink}>
        lose value
      </Words>
      <Pop at={303.6} x={1560} y={720}>
        <Moon {...art} size={150} />
      </Pop>
      <Words at={303.8} x={1560} y={830} align="center" size={40} color={P.ink}>
        overnight
      </Words>
    </Show>
  );
};

export const GameChapter = () => (
  <AbsoluteFill>
    <Disciplined />
    <Layers />
    <Mit />
    <Baskets />
    <Pain />
    <Gamified />
    <Chase />
    <Math450 />
    <Breakage />
  </AbsoluteFill>
);

export const GAME_CUES = [
  {at: 218.0, sound: "whoosh-2", volume: 0.18},
  {at: 221.7, sound: "tick-soft-1", volume: 0.22},
  {at: 224.2, sound: "tick", volume: 0.26},
  {at: 226.4, sound: "paper-slide-1", volume: 0.24},
  {at: 226.9, sound: "tick-soft-2", volume: 0.24},
  {at: 231.9, sound: "whoosh-3", volume: 0.16},
  {at: 233.5, sound: "tick-soft-3", volume: 0.22},
  {at: 236.9, sound: "tick-soft-1", volume: 0.22},
  {at: 238.2, sound: "tick-soft-2", volume: 0.22},
  {at: 241.2, sound: "tick", volume: 0.26},
  {at: 244.3, sound: "whoosh", volume: 0.16},
  {at: 246.0, sound: "tick-soft-3", volume: 0.22},
  {at: 249.0, sound: "tick-soft-1", volume: 0.22},
  {at: 252.1, sound: "tick-soft-2", volume: 0.24},
  {at: 256.4, sound: "paper-slide-2", volume: 0.24},
  {at: 259.4, sound: "tick-soft-3", volume: 0.22},
  {at: 262.2, sound: "whoosh-2", volume: 0.14},
  {at: 265.7, sound: "tick", volume: 0.24},
  {at: 266.8, sound: "whoosh-3", volume: 0.16},
  {at: 270.6, sound: "tick-soft-1", volume: 0.24},
  {at: 271.9, sound: "whoosh", volume: 0.14},
  {at: 273.5, sound: "tick-soft-2", volume: 0.22},
  {at: 274.7, sound: "tick-soft-3", volume: 0.22},
  {at: 276.2, sound: "paper-tear-2", volume: 0.24},
  {at: 279.3, sound: "whoosh-2", volume: 0.14},
  {at: 282.7, sound: "tick", volume: 0.26},
  {at: 285.6, sound: "tick-soft-1", volume: 0.22},
  {at: 289.4, sound: "pen-circle-2", volume: 0.28},
  {at: 291.8, sound: "whoosh-3", volume: 0.14},
  {at: 295.2, sound: "paper-tear-1", volume: 0.26},
  {at: 299.2, sound: "tick-soft-2", volume: 0.22},
  {at: 300.6, sound: "tick-soft-3", volume: 0.22},
  {at: 303.6, sound: "tick-soft-1", volume: 0.22},
];
