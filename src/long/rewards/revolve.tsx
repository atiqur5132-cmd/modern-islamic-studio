import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {Bank, Car, CalendarX, Card2D, Medical, Mousetrap, Trophy} from "./art";
import {Flyer, Stream} from "./cash";
import {camAt, Move} from "./camera";
import {DEBT, DebtChart, Gauge, PeopleGrid, Scale} from "./charts";
import {CoinIcon, PersonIcon, PlaneIcon} from "./icons";
import {Credit, Pop, Show, Words} from "./kit";
import {CH, CLAMP, fade, grow, HOOK, mix, pop, SANS, sec} from "./look";
import {baseStudio, StudioState} from "./Studio3D";

// Chapter 2, "Revolvers" (149–217.9 s), coral: the interest you pay.
const P = CH.revolve;
const art = {a: P.accent, ink: P.ink, s: "#ffffff"};

export const REVOLVE_3D: [number, number] = [149.0, 158.7];

const MOVES: Move[] = [
  {at: 149.0, pos: [-1.0, 1.6, 7.6], target: [-1.0, 1.25, 0], fov: 32},
  {at: 149.1, frames: sec(4), pos: [-0.8, 1.5, 7.0], target: [-1.0, 1.2, 0]},
  {at: 155.2, frames: 30, pos: [2.4, 1.2, 3.8], target: [2.1, 1.05, 0], fov: 30},
];

export const revolveState = (frame: number): StudioState => {
  const spin = interpolate(frame, [sec(149.0), sec(150.4)], [Math.PI * 2, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const s = baseStudio(camAt(frame, MOVES), {pos: [0, 1.27, 0], rot: [0, -0.2 + spin + Math.sin(frame / 30) * 0.05, 0]});
  s.key = {color: "#ffe6dc", power: 1.05};
  s.tag = {k: pop(frame, 153.3, 16), flip: interpolate(frame, [sec(157.0), sec(157.0) + 14], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)}), front: "deadbeat", back: "revolver"};
  return s;
};

export const RevolveOverlay3D = () => (
  <>
    <Words at={151.4} x={140} y={150} size={72} color={P.ink} out={155.0}>
      Group 2
    </Words>
    <Words at={152.6} x={140} y={240} size={44} color={P.inkSoft} out={155.0}>
      the opposite of a deadbeat
    </Words>
  </>
);

const Statement = () => {
  const frame = useCurrentFrame();
  const paid = interpolate(frame, [sec(160.3), sec(161.6)], [0, 0.6], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const left = grow(frame, 161.7, 10);
  const move = interpolate(frame, [sec(163.0), sec(164.6)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const spin = Math.max(0, frame - sec(163.0)) * 4;
  return (
    <Show from={158.8} to={165.7}>
      <Pop at={158.9} x={560} y={540}>
        <div style={{width: 560, padding: "34px 40px", background: "#fff", borderRadius: 18, fontFamily: SANS, boxShadow: "0 24px 50px rgba(0,0,0,0.12)"}}>
          <div style={{fontWeight: 800, fontSize: 30, color: P.inkSoft, letterSpacing: 3}}>THIS MONTH</div>
          <div style={{fontWeight: 800, fontSize: 64, color: P.ink, marginTop: 8}}>Balance $1,000</div>
          <div style={{marginTop: 26, height: 56, borderRadius: 12, background: P.soft, position: "relative", overflow: "hidden"}}>
            <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${paid * 100}%`, background: P.ink}} />
            <div style={{position: "absolute", left: "60%", top: 0, bottom: 0, width: "40%", background: P.accent, opacity: left * (1 - move)}} />
          </div>
          <div style={{display: "flex", justifyContent: "space-between", marginTop: 14, fontWeight: 700, fontSize: 32}}>
            <span style={{color: P.ink, opacity: grow(frame, 160.6, 10)}}>paid $600</span>
            <span style={{color: P.accent, opacity: left}}>unpaid $400</span>
          </div>
        </div>
      </Pop>
      {left > 0 ? (
        <div style={{position: "absolute", left: mix(712, 1330, move), top: mix(553, 470, move) - Math.sin(move * Math.PI) * 140, width: 180, height: 56, borderRadius: 12, background: P.accent, transform: "translate(-50%,-50%)", boxShadow: "0 14px 24px rgba(0,0,0,0.2)"}} />
      ) : null}
      <Pop at={162.6} x={1360} y={540}>
        <CalendarX {...art} size={300} label="NEXT" />
      </Pop>
      <Pop at={163.0} x={1000} y={330}>
        <svg width={150} height={150} viewBox="0 0 100 100" style={{transform: `rotate(${spin}deg)`}}>
          <path d="M80 50 A30 30 0 1 1 64 23" fill="none" stroke={P.accent} strokeWidth={9} strokeLinecap="round" />
          <path d="M60 8 L72 26 L52 30 Z" fill={P.accent} />
        </svg>
      </Pop>
      <Words at={164.1} x={1000} y={430} align="center" size={44} color={P.accent}>
        revolves
      </Words>
    </Show>
  );
};

const Trap = () => {
  const frame = useCurrentFrame();
  const snap = interpolate(frame, [sec(169.35), sec(169.55)], [0, 1], {...CLAMP, easing: Easing.in(Easing.quad)});
  const shake = snap > 0 && snap < 1 ? 0 : frame > sec(169.55) && frame < sec(169.9) ? Math.sin(frame * 3) * 8 : 0;
  return (
    <Show from={165.8} to={170.9}>
      <div style={{position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) translateX(${shake}px) scale(${pop(frame, 165.9)})`, filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.18))"}}>
        <Mousetrap {...art} size={560} snap={snap} />
      </div>
      <Flyer a={167.2} b={168.0} from={[1500, 300]} to={[1000, 580]} lift={120}>
        <div style={{width: 120, height: 40, borderRadius: 10, background: P.accent, opacity: 1 - snap * 0.3}} />
      </Flyer>
      <Words at={167.6} x={1250} y={300} size={46} color={P.accent} out={170.8}>
        a fraction unpaid
      </Words>
    </Show>
  );
};

const Apr = () => {
  const frame = useCurrentFrame();
  const v1 = interpolate(frame, [sec(171.6), sec(173.1)], [0, 22], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const v2 = interpolate(frame, [sec(173.6), sec(174.3)], [0, 14], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const v3 = interpolate(frame, [sec(176.3), sec(176.9)], [0, 6], {...CLAMP, easing: Easing.out(Easing.back(2))});
  const jitter = frame > sec(176.9) ? Math.sin(frame * 1.7) * 0.6 : 0;
  const band = grow(frame, 173.1, 14);
  return (
    <Show from={171.0} to={177.7}>
      <Pop at={171.1} x={760} y={560}>
        <Gauge pal={P} value={v1 + v2 + v3 + jitter} band={band > 0 ? [22, 22 + 14 * band] : undefined} />
      </Pop>
      <Pop at={171.4} x={1400} y={470}>
        <Card2D {...art} size={300} />
      </Pop>
      <Words at={173.2} x={1400} y={620} align="center" size={96} color={P.accent}>
        22–36%
      </Words>
      <Words at={175.0} x={1400} y={730} align="center" size={44} color={P.inkSoft}>
        interest per year
      </Words>
      <Words at={176.5} x={1400} y={790} align="center" size={40} color={P.ink}>
        sometimes higher
      </Words>
      <Credit from={173.2} to={177.6} text="Typical US credit card APRs; penalty rates can be higher" pal={P} />
    </Show>
  );
};

const Debt = () => {
  const frame = useCurrentFrame();
  return (
    <Show from={177.8} to={197.7}>
      <div style={{position: "absolute", left: 120, top: 330, opacity: grow(frame, 178.9, 14)}}>
        <DebtChart pal={P} lineFrom={189.3} lineTo={192.0} interestFrom={191.4} interestTo={194.0} />
      </div>
      <Pop at={181.2} x={260} y={180}>
        <Card2D {...art} size={190} />
      </Pop>
      <Words at={181.4} x={390} y={135} size={78} color={P.ink}>
        $2,000
      </Words>
      <Words at={182.7} x={720} y={135} size={78} color={P.accent}>
        at 24%
      </Words>
      <Words at={184.7} x={1080} y={150} size={50} color={P.inkSoft}>
        minimum payment only
      </Words>
      <Words at={187.4} x={230} y={400} size={40} color={P.inkSoft}>
        $2,000 borrowed
      </Words>
      <Words at={190.3} x={1080} y={215} size={44} color={P.ink}>
        ≈ {Math.round(DEBT.months / 12)} years to clear
      </Words>
      <Pop at={195.9} x={1600} y={520}>
        <div style={{transform: "rotate(40deg)"}}>
          <PlaneIcon size={150} color={P.accent} />
        </div>
      </Pop>
      <Stream start={196.0} from={[1100, 640]} to={[1600, 560]} lift={100} n={3} speed={0.8} size={46} />
      <Credit from={185.0} to={197.6} text="Illustration: $2,000 at 24% APR, minimum = 1% of balance + interest, $25 floor" pal={P} />
    </Show>
  );
};

const Handful = () => {
  const frame = useCurrentFrame();
  const tilt = interpolate(frame, [sec(204.0), sec(205.0)], [-0.35, 1], {...CLAMP, easing: Easing.out(Easing.back(1.5))});
  const turn = [13, 37, 58, 74, 91];
  return (
    <Show from={197.8} to={206.9}>
      <Pop at={197.9} x={300} y={150} scale={0.8}>
        <Bank {...art} size={150} />
      </Pop>
      <Words at={198.9} x={390} y={120} size={56} color={P.ink}>
        −$50 each
      </Words>
      <div style={{position: "absolute", left: 160, top: 230, opacity: grow(frame, 199.7, 8)}}>
        <PeopleGrid pal={P} at={199.7} turnAt={202.6} turn={turn} base={HOOK.teal} />
      </div>
      <Words at={200.2} x={460} y={900} align="center" size={44} color={HOOK.teal}>
        100 deadbeats
      </Words>
      <Words at={202.9} x={460} y={958} align="center" size={44} color={P.accent}>
        a handful of revolvers
      </Words>
      <div style={{position: "absolute", left: 1100, top: 330, opacity: grow(frame, 203.4, 12)}}>
        <Scale
          pal={P}
          tilt={tilt}
          left={
            <div style={{display: "flex", gap: 4}}>
              {[0, 1, 2].map((i) => (
                <CoinIcon key={i} size={50} label="$" />
              ))}
            </div>
          }
          right={
            <div style={{display: "flex", flexWrap: "wrap", width: 150, justifyContent: "center", gap: 2}}>
              {Array.from({length: 9}).map((_, i) => (
                <div key={i} style={{opacity: grow(frame, 203.9 + i * 0.05, 6)}}>
                  <CoinIcon size={46} label="$" />
                </div>
              ))}
            </div>
          }
        />
      </div>
      <Words at={204.6} x={1730} y={780} align="right" size={44} color={P.accent}>
        thousands in interest
      </Words>
    </Show>
  );
};

const Flip = () => {
  const frame = useCurrentFrame();
  const flip = interpolate(frame, [sec(214.4), sec(215.4)], [0, 180], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const face = (back: boolean): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    backfaceVisibility: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transform: back ? "rotateY(180deg)" : undefined,
    background: back ? P.accent : HOOK.teal,
    boxShadow: "inset 0 -14px 0 rgba(0,0,0,0.18), 0 26px 40px rgba(0,0,0,0.2)",
  });
  return (
    <Show from={207.0} to={217.8}>
      <Words at={207.2} x={960} y={110} align="center" size={60} color={P.ink}>
        one bad month
      </Words>
      <Pop at={208.5} x={560} y={330}>
        <Medical {...art} size={170} />
      </Pop>
      <Pop at={210.1} x={960} y={330}>
        <Car {...art} size={190} />
      </Pop>
      <Pop at={211.5} x={1360} y={330}>
        <CalendarX {...art} size={170} label="MISSED" />
      </Pop>
      <div style={{position: "absolute", left: 960, top: 720, width: 300, height: 300, transform: `translate(-50%,-50%) scale(${pop(frame, 213.4)}) perspective(1200px) rotateY(${flip}deg)`, transformStyle: "preserve-3d"}}>
        <div style={face(false)}>
          <Trophy a="#f2d16b" ink={P.ink} size={170} />
        </div>
        <div style={face(true)}>
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 150, color: "#fff"}}>$</span>
        </div>
      </div>
      <Words at={215.0} x={700} y={700} align="right" size={52} color={HOOK.teal} out={216.1}>
        winner
      </Words>
      <Words at={216.2} x={1220} y={700} size={52} color={P.accent}>
        profit center
      </Words>
      <div style={{opacity: fade(frame, 0, 1) * 0}} />
    </Show>
  );
};

export const RevolveChapter = () => (
  <AbsoluteFill>
    <Statement />
    <Trap />
    <Apr />
    <Debt />
    <Handful />
    <Flip />
  </AbsoluteFill>
);

export const REVOLVE_CUES = [
  {at: 149.0, sound: "whoosh-2", volume: 0.2},
  {at: 151.4, sound: "tick-soft-1", volume: 0.24},
  {at: 153.3, sound: "paper-slide-1", volume: 0.28},
  {at: 157.0, sound: "paper-slide-2", volume: 0.3},
  {at: 158.9, sound: "whoosh-3", volume: 0.16},
  {at: 161.7, sound: "tick-soft-2", volume: 0.24},
  {at: 163.0, sound: "whoosh", volume: 0.16},
  {at: 165.9, sound: "tick-soft-3", volume: 0.22},
  {at: 167.6, sound: "paper-slide-1", volume: 0.24},
  {at: 169.4, sound: "impact", volume: 0.3},
  {at: 171.1, sound: "whoosh-2", volume: 0.16},
  {at: 173.1, sound: "tick", volume: 0.28},
  {at: 176.5, sound: "tick-soft-1", volume: 0.24},
  {at: 178.9, sound: "whoosh-3", volume: 0.16},
  {at: 181.3, sound: "tick-soft-2", volume: 0.24},
  {at: 182.7, sound: "tick-soft-3", volume: 0.24},
  {at: 189.3, sound: "pen-circle-1", volume: 0.26},
  {at: 192.4, sound: "tick", volume: 0.28},
  {at: 195.9, sound: "whoosh", volume: 0.16},
  {at: 199.7, sound: "tick-soft-1", volume: 0.22},
  {at: 202.6, sound: "tick-soft-2", volume: 0.24},
  {at: 204.4, sound: "tick", volume: 0.26},
  {at: 207.2, sound: "whoosh-2", volume: 0.16},
  {at: 208.5, sound: "tick-soft-3", volume: 0.22},
  {at: 210.1, sound: "tick-soft-1", volume: 0.22},
  {at: 211.5, sound: "tick-soft-2", volume: 0.22},
  {at: 214.4, sound: "paper-slide-2", volume: 0.28},
];
