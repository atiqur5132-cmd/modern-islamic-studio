import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {Bank, Bill, Card2D, Cart, Coffee, Cross, Gear, Laptop, Lounge, Network, PriceTag, Product, Question, Store, Terminal} from "./art";
import {BarPair, Pie} from "./charts";
import {CoinIcon, PersonIcon, PlaneIcon} from "./icons";
import {Credit, DrawPath, Pop, Show, Words} from "./kit";
import {CH, CLAMP, fade, grow, mix, pop, SANS, sec} from "./look";

// Chapter 1, "Cash payers" (70.2–149 s), sage: money quietly taken from cash buyers.
const P = CH.cash;
const art = {a: P.accent, ink: P.ink, s: "#ffffff"};

// Something that travels along an arc from one point to another between two times.
export const Flyer = ({a, b, from, to, lift = 160, children}: {a: number; b: number; from: [number, number]; to: [number, number]; lift?: number; children: React.ReactNode}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [sec(a), sec(b)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  if (p <= 0) return null;
  const x = mix(from[0], to[0], p);
  const y = mix(from[1], to[1], p) - Math.sin(p * Math.PI) * lift;
  return <div style={{position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", filter: "drop-shadow(0 12px 14px rgba(0,0,0,0.18))"}}>{children}</div>;
};

// Coins streaming along an arc without end, from `start` seconds.
export const Stream = ({start, from, to, lift = 120, n = 4, speed = 0.5, size = 54, label}: {start: number; from: [number, number]; to: [number, number]; lift?: number; n?: number; speed?: number; size?: number; label?: string}) => {
  const frame = useCurrentFrame();
  const t = frame / 30 - start;
  if (t < 0) return null;
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const p = (t * speed + i / n) % 1;
        const x = mix(from[0], to[0], p);
        const y = mix(from[1], to[1], p) - Math.sin(p * Math.PI) * lift;
        return (
          <div key={i} style={{position: "absolute", left: x - size / 2, top: y - size / 2, opacity: Math.sin(p * Math.PI) * Math.min(1, t * 2)}}>
            <CoinIcon size={size} label={label} />
          </div>
        );
      })}
    </>
  );
};

const GroupOne = () => {
  const frame = useCurrentFrame();
  const xs = [560, 760, 960, 1160, 1360];
  return (
    <Show from={70.4} to={77.0}>
      {xs.map((x, i) => (
        <React.Fragment key={x}>
          <Pop at={70.5 + i * 0.08} x={x} y={560}>
            <PersonIcon size={i % 2 ? 170 : 190} color={P.ink} />
          </Pop>
          <Pop at={72.3 + i * 0.12} x={x} y={380} out={74.0}>
            <Question size={90} color={P.accent} />
          </Pop>
          {i < 3 ? (
            <Pop at={75.3 + i * 0.1} x={x + 40} y={700} rotate={-8}>
              <Bill {...art} size={150} />
            </Pop>
          ) : (
            <Pop at={76.0 + (i - 3) * 0.1} x={x + 40} y={700} rotate={-8}>
              <div style={{width: 150, height: 94, borderRadius: 12, background: "#e8eeed", border: `4px solid ${P.inkSoft}`, boxSizing: "border-box", position: "relative"}}>
                <div style={{position: "absolute", left: 0, right: 0, top: 16, height: 14, background: P.inkSoft}} />
                <div style={{position: "absolute", left: 14, bottom: 14, fontFamily: "inherit", fontWeight: 800, fontSize: 18, color: P.ink}}>DEBIT</div>
              </div>
            </Pop>
          )}
        </React.Fragment>
      ))}
      <Words at={70.9} x={960} y={790} align="center" size={60} color={P.ink}>
        Group 1
      </Words>
      <div style={{opacity: grow(frame, 75.3, 12) * 0}} />
    </Show>
  );
};

const Tap = () => {
  const frame = useCurrentFrame();
  const cardIn = interpolate(frame, [sec(77.4), sec(78.7)], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const ripple = grow(frame, 78.7, 18);
  const dim = 1 - 0.7 * grow(frame, 83.0, 20);
  const scan = interpolate(frame, [sec(83.2), sec(85.2)], [0, 1], CLAMP);
  return (
    <Show from={77.3} to={85.3}>
      <AbsoluteFill style={{opacity: dim}}>
        <Pop at={77.3} x={860} y={400}>
          <Terminal {...art} size={300} ripple={ripple} />
        </Pop>
        <div style={{position: "absolute", left: mix(1420, 1080, cardIn), top: mix(250, 330, cardIn), transform: `translate(-50%,-50%) rotate(${mix(-24, -8, cardIn)}deg)`, opacity: Math.min(1, cardIn * 3), filter: "drop-shadow(0 22px 26px rgba(0,0,0,0.25))"}}>
          <Card2D {...art} size={300} metal />
        </div>
        <Pop at={79.8} x={560} y={800}>
          <Coffee {...art} size={170} />
        </Pop>
        <Pop at={80.7} x={960} y={800}>
          <Cart {...art} size={180} />
        </Pop>
        <Pop at={81.8} x={1360} y={800}>
          <Laptop {...art} size={180} />
        </Pop>
      </AbsoluteFill>
      {scan > 0 ? (
        <AbsoluteFill>
          <div style={{position: "absolute", left: 0, right: 0, top: scan * 1080 - 4, height: 8, background: P.accent, boxShadow: `0 0 40px 10px ${P.accent}`, opacity: 0.8}} />
          <div style={{position: "absolute", inset: 60, border: `4px dashed ${P.accent}`, borderRadius: 30, opacity: grow(frame, 83.3, 14) * 0.7}} />
        </AbsoluteFill>
      ) : null}
    </Show>
  );
};

const Cut = () => {
  const frame = useCurrentFrame();
  return (
    <Show from={85.5} to={98.1}>
      <Pop at={85.6} x={330} y={520}>
        <Store {...art} size={230} />
      </Pop>
      <Words at={85.8} x={330} y={660} align="center" size={44} color={P.inkSoft}>
        store
      </Words>
      <div style={{position: "absolute", left: 960, top: 690, transform: "translate(-50%, -50%)", opacity: grow(frame, 86.6, 10)}}>
        <Pie pal={P} r={150} fillAt={86.7} cutAt={91.8} slice={0.03} />
      </div>
      <Words at={87.0} x={960} y={880} align="center" size={44} color={P.inkSoft} out={91.6}>
        100% of your money
      </Words>
      <Pop at={88.4} x={1600} y={520}>
        <Bank {...art} size={230} />
      </Pop>
      <Words at={88.6} x={1600} y={660} align="center" size={44} color={P.inkSoft}>
        bank
      </Words>
      <Pop at={89.0} x={960} y={250}>
        <Network {...art} size={190} />
      </Pop>
      <Words at={89.8} x={960} y={360} align="center" size={38} color={P.inkSoft}>
        card network · Visa, Mastercard
      </Words>
      <DrawPath d="M 1000 560 Q 1000 450 970 400" a={92.3} b={92.9} color={P.ink} width={6} dash="4 14" />
      <DrawPath d="M 1040 600 Q 1300 560 1500 560" a={92.5} b={93.2} color={P.ink} width={6} dash="4 14" />
      <Words at={93.5} x={1110} y={760} size={50} color={P.ink}>
        interchange fee
      </Words>
      <Words at={95.9} x={1110} y={816} size={96} color={P.accent}>
        2–3%
      </Words>
      <Credit from={95.9} to={98.0} text="Typical US interchange rates, card networks' published schedules" pal={P} />
    </Show>
  );
};

const Heart = ({size = 120}: {size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M50 88 C10 60 6 34 22 22 C36 12 48 22 50 30 C52 22 64 12 78 22 C94 34 90 60 50 88 Z" fill={P.soft} stroke={P.ink} strokeWidth={4} />
  </svg>
);

const NotCharity = () => {
  const frame = useCurrentFrame();
  const bar = grow(frame, 101.0, 16);
  const chunks = [102.3, 102.9, 103.6];
  return (
    <Show from={98.3} to={105.6}>
      <Pop at={98.4} x={520} y={500}>
        <Store {...art} size={280} />
      </Pop>
      <Pop at={99.7} x={760} y={330}>
        <div style={{position: "relative"}}>
          <Heart />
          <div style={{position: "absolute", inset: 0, opacity: grow(frame, 100.0, 8)}}>
            <Cross size={120} color={P.accent} />
          </div>
        </div>
      </Pop>
      <Pop at={104.8} x={520} y={250}>
        <Question size={130} color={P.accent} />
      </Pop>
      <div style={{position: "absolute", left: 900, top: 470, width: 820, opacity: bar, fontFamily: SANS}}>
        <div style={{height: 70, borderRadius: 14, background: P.accent, width: `${100 - chunks.filter((c) => frame >= sec(c)).length * 3}%`, transition: "none"}} />
        <div style={{marginTop: 14, fontWeight: 700, fontSize: 36, color: P.inkSoft}}>revenue</div>
      </div>
      {chunks.map((c, i) => {
        const k = grow(frame, c, 14);
        if (k <= 0) return null;
        return (
          <div key={c} style={{position: "absolute", left: 1720 - 25, top: 470 + k * (180 + i * 60), transform: `rotate(${k * (12 + i * 8)}deg)`, opacity: 1 - grow(frame, c + 0.6, 10) * 0.6}}>
            <div style={{width: 50, height: 70, borderRadius: 8, background: P.ink}} />
            <div style={{position: "absolute", left: 60, top: 10, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: P.accent, whiteSpace: "nowrap"}}>−3%</div>
          </div>
        );
      })}
    </Show>
  );
};

const PRICES = [
  {kind: "box" as const, base: 4.0},
  {kind: "bottle" as const, base: 2.5},
  {kind: "can" as const, base: 1.2},
  {kind: "bread" as const, base: 3.0},
  {kind: "jar" as const, base: 6.0},
];

const Shelf = () => {
  const frame = useCurrentFrame();
  return (
    <Show from={105.7} to={110.7}>
      <div style={{position: "absolute", left: 260, right: 260, top: 640, height: 26, borderRadius: 8, background: P.ink, boxShadow: "0 20px 30px rgba(0,0,0,0.15)"}} />
      <Flyer a={105.8} b={106.6} from={[960, -80]} to={[960, 420]} lift={0}>
        <div style={{opacity: fade(frame, 106.5, 8)}}>
          <CoinIcon size={90} label="fee" />
        </div>
      </Flyer>
      {PRICES.map((p, i) => {
        const x = 400 + i * 280;
        const tick = grow(frame, 107.6 + i * 0.28, 8);
        const price = tick > 0.5 ? p.base * 1.03 : p.base;
        return (
          <React.Fragment key={i}>
            <Pop at={105.9 + i * 0.1} x={x} y={545}>
              <Product {...art} kind={p.kind} size={170} />
            </Pop>
            <Pop at={106.2 + i * 0.1} x={x} y={730}>
              <div style={{transform: `scale(${1 + Math.sin(tick * Math.PI) * 0.2})`}}>
                <PriceTag {...art} size={165} text={`$${price.toFixed(2)}`} hot={tick > 0.5} />
              </div>
            </Pop>
            <Words at={107.7 + i * 0.28} x={x} y={800} align="center" size={34} color={P.accent}>
              +3%
            </Words>
          </React.Fragment>
        );
      })}
    </Show>
  );
};

const CardVsCash = () => {
  const frame = useCurrentFrame();
  const L: [number, number] = [620, 600];
  const R: [number, number] = [1300, 600];
  const cashFocus = grow(frame, 127.3, 14) * fade(frame, 134.0, 14);
  return (
    <Show from={110.9} to={141.3}>
      <Pop at={111.0} x={L[0]} y={L[1]}>
        <PersonIcon size={240} color={P.ink} />
      </Pop>
      <div style={{position: "absolute", left: R[0], top: R[1], transform: `translate(-50%,-50%) scale(${pop(frame, 111.15) * (1 + 0.1 * cashFocus)})`, filter: "drop-shadow(0 18px 22px rgba(0,0,0,0.16))"}}>
        <PersonIcon size={240} color={cashFocus > 0.5 ? P.accent : P.ink} />
      </div>
      <Pop at={113.3} x={L[0] + 120} y={L[1] + 120} rotate={-10}>
        <Card2D {...art} size={200} metal />
      </Pop>
      <Pop at={114.4} x={R[0] + 120} y={R[1] + 120} rotate={-8}>
        <Bill {...art} size={200} />
      </Pop>
      <Words at={113.4} x={L[0]} y={L[1] + 250} align="center" size={44} color={P.inkSoft}>
        rewards card
      </Words>
      <Words at={114.5} x={R[0]} y={R[1] + 250} align="center" size={44} color={P.inkSoft}>
        cash
      </Words>
      {/* One price for both: $100, then $103 on "markup". */}
      <Pop at={115.8} x={960} y={300} out={119.0}>
        <PriceTag {...art} size={260} text={frame >= sec(116.9) ? "$103" : "$100"} hot={frame >= sec(116.9)} />
      </Pop>
      <Words at={117.0} x={960} y={380} align="center" size={50} color={P.accent} out={119.0}>
        +2–3% markup
      </Words>
      <Pop at={119.2} x={L[0]} y={L[1] - 200} out={121.4}>
        <svg width={70} height={60} viewBox="0 0 70 60"><path d="M35 58 L4 8 H66 Z" fill={P.accent} /></svg>
      </Pop>
      <Pop at={123.3} x={L[0] + 30} y={L[1] - 190} out={124.6}>
        <div style={{width: 130, height: 130, borderRadius: 65, border: `6px solid ${P.accent}`, boxSizing: "border-box"}} />
      </Pop>
      <Words at={127.6} x={R[0]} y={R[1] - 210} align="center" size={42} color={P.accent} out={130.3}>
        in line behind you
      </Words>
      {/* The bank hands a little of the markup back: cash back. */}
      <Pop at={120.6} x={960} y={260} out={126.4}>
        <Bank {...art} size={200} />
      </Pop>
      <Flyer a={121.5} b={122.7} from={[960, 300]} to={[L[0] + 30, L[1] - 190]} lift={140}>
        <CoinIcon size={84} />
      </Flyer>
      <Words at={124.9} x={L[0] + 90} y={L[1] - 240} size={46} color={P.accent} out={134.0}>
        cash back
      </Words>
      <Pop at={130.5} x={R[0]} y={R[1] - 260} out={134.0}>
        <PriceTag {...art} size={220} text="$103" hot />
      </Pop>
      <Pop at={132.8} x={R[0] + 10} y={R[1] - 140} out={134.0}>
        <div style={{position: "relative", width: 90, height: 90, borderRadius: 45, border: `5px dashed ${P.inkSoft}`, boxSizing: "border-box"}}>
          <div style={{position: "absolute", inset: -10}}>
            <Cross size={110} color={P.accent} />
          </div>
        </div>
      </Pop>
      {/* Cash buyers fund the card users' lounges and flights. */}
      <Pop at={137.6} x={L[0] - 90} y={250}>
        <Lounge {...art} size={150} />
      </Pop>
      <Pop at={139.1} x={L[0] + 110} y={250}>
        <div style={{transform: "rotate(40deg)"}}>
          <PlaneIcon size={140} color={P.accent} />
        </div>
      </Pop>
      <Stream start={135.4} from={[R[0], R[1] - 140]} to={[L[0] + 20, 300]} lift={180} n={5} speed={0.45} />
    </Show>
  );
};

const EngineOne = () => {
  const frame = useCurrentFrame();
  const spin = frame * 1.6;
  return (
    <Show from={141.5} to={148.9}>
      <Pop at={141.6} x={500} y={470}>
        <div style={{transform: `rotate(${spin}deg)`}}>
          <Gear {...art} size={260} />
        </div>
      </Pop>
      <Words at={142.6} x={500} y={650} align="center" size={56} color={P.ink}>
        Engine 1
      </Words>
      <Words at={142.9} x={500} y={720} align="center" size={38} color={P.inkSoft}>
        hidden fees
      </Words>
      <div style={{position: "absolute", left: 1000, top: 220, opacity: grow(frame, 143.8, 10)}}>
        <BarPair pal={P} a={0} b={0} at={[144.2, 147.0]} labels={["interchange", "bonuses + perks"]} heights={[110, 400]} />
      </div>
    </Show>
  );
};

export const CashChapter = () => (
  <AbsoluteFill>
    <GroupOne />
    <Tap />
    <Cut />
    <NotCharity />
    <Shelf />
    <CardVsCash />
    <EngineOne />
  </AbsoluteFill>
);

export const CASH_CUES = [
  {at: 70.5, sound: "whoosh-2", volume: 0.18},
  {at: 72.3, sound: "tick-soft-1", volume: 0.24},
  {at: 75.3, sound: "paper-slide-1", volume: 0.26},
  {at: 78.7, sound: "tick", volume: 0.3},
  {at: 79.8, sound: "tick-soft-2", volume: 0.24},
  {at: 80.7, sound: "tick-soft-3", volume: 0.24},
  {at: 81.8, sound: "tick-soft-1", volume: 0.24},
  {at: 83.1, sound: "whoosh-3", volume: 0.16},
  {at: 85.6, sound: "tick-soft-2", volume: 0.24},
  {at: 88.4, sound: "tick-soft-3", volume: 0.24},
  {at: 91.8, sound: "paper-tear-1", volume: 0.3},
  {at: 95.9, sound: "tick", volume: 0.28},
  {at: 98.4, sound: "whoosh", volume: 0.16},
  {at: 100.0, sound: "pen-circle-1", volume: 0.28},
  {at: 102.3, sound: "tick-soft-1", volume: 0.22},
  {at: 103.6, sound: "tick-soft-2", volume: 0.22},
  {at: 105.9, sound: "paper-slide-2", volume: 0.26},
  {at: 107.6, sound: "tick-soft-3", volume: 0.22},
  {at: 108.7, sound: "tick-soft-1", volume: 0.22},
  {at: 111.0, sound: "whoosh-2", volume: 0.16},
  {at: 116.9, sound: "tick", volume: 0.28},
  {at: 121.5, sound: "whoosh-3", volume: 0.16},
  {at: 124.9, sound: "tick-soft-2", volume: 0.24},
  {at: 130.5, sound: "tick-soft-3", volume: 0.24},
  {at: 132.8, sound: "pen-circle-2", volume: 0.28},
  {at: 137.6, sound: "tick-soft-1", volume: 0.24},
  {at: 139.1, sound: "whoosh", volume: 0.16},
  {at: 141.6, sound: "whoosh-2", volume: 0.16},
  {at: 147.0, sound: "tick", volume: 0.26},
];
