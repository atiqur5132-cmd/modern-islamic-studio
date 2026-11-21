import React from "react";
import {Easing, interpolate, useCurrentFrame} from "remotion";
import {Briefcase, Certificate, GrowChart, Tag} from "./ch1";
import {At, Note, PayStub, Stamp, Struck, TickMark} from "./kit";
import {CLAMP, fade, grow, Move2, PAPER, pop, SANS, sec, SERIF, TONE, OVERVIEW_AT} from "./look";

// Chapter 2, "The back door" (97.2–157.1 s), blue: the owner's lower rate. Row four (y≈5200),
// starting right under chapter 1's open back door: the $1 stub and what comes instead, rule #1
// and the one-year clock, 20% + 3.8%, 37% vs 20%, the label flip, and employee vs owner.

export const CH2: [number, number] = [97.2, 157.1];
const B = TONE.owner.accent;
const BS = TONE.owner.soft;
const R = TONE.tax.accent;
const Y = 5200;
const SHIFT = 14000;

export const CH2_MOVES: Move2[] = [
  {at: 96.9, frames: 30, x: 1050 + SHIFT, y: Y, s: 1.0},
  {at: 98.0, frames: sec(8.5), x: 1050 + SHIFT, y: Y + 10, s: 1.05},
  {at: 106.6, frames: 26, x: 1300 + SHIFT, y: Y - 40, s: 1.12},
  {at: 110.6, frames: 32, x: 2950 + SHIFT, y: Y, s: 1.0},
  {at: 120.2, frames: 32, x: 4850 + SHIFT, y: Y, s: 1.0},
  {at: 130.8, frames: 32, x: 6750 + SHIFT, y: Y, s: 1.0},
  {at: 133.9, frames: sec(2.6), x: 6750 + SHIFT, y: Y + 10, s: 1.04},
  {at: 139.2, frames: 26, x: 6750 + SHIFT, y: Y + 30, s: 1.06},
  {at: 145.9, frames: 32, x: 8650 + SHIFT, y: Y, s: 1.0},
  {at: 151.5, frames: sec(5), x: 8650 + SHIFT, y: Y + 20, s: 1.05},
];

// ——— objects ———

const OptionTicket = ({w = 300}: {w?: number}) => (
  <div style={{width: w, height: w * 0.5, background: PAPER.white, border: `4px dashed ${B}`, borderRadius: 14, boxShadow: "0 16px 24px -12px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: SANS}}>
    <div style={{fontWeight: 800, fontSize: w * 0.1, letterSpacing: 3, color: B}}>OPTION</div>
    <div style={{fontWeight: 600, fontSize: w * 0.07, color: PAPER.inkSoft, marginTop: 6}}>right to buy shares</div>
  </div>
);

const EquityPie = ({size = 200, k = 1}: {size?: number; k?: number}) => {
  const a = Math.PI * 2 * 0.28 * k;
  const r = 44;
  const x = 50 + r * Math.sin(a);
  const y = 50 - r * Math.cos(a);
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.22))"}}>
      <circle cx={50} cy={50} r={r} fill={BS} stroke={PAPER.ink} strokeWidth={3} />
      {k > 0 ? <path d={`M50 50 L50 ${50 - r} A ${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${x} ${y} Z`} fill={B} stroke={PAPER.ink} strokeWidth={3} strokeLinejoin="round" /> : null}
    </svg>
  );
};

// Twelve months that fill one by one, then "1 YEAR +" ticks.
const YearStrip = ({k, done}: {k: number; done: number}) => {
  const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  return (
    <div style={{display: "flex", gap: 10, alignItems: "center"}}>
      {months.map((m, i) => {
        const on = k * 12 > i;
        return (
          <div key={i} style={{width: 72, height: 92, borderRadius: 10, background: on ? B : PAPER.white, border: `3px solid ${on ? B : PAPER.ground2}`, color: on ? "#fff" : PAPER.inkSoft, fontFamily: SANS, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 16px -10px rgba(0,0,0,0.3)", transform: `translateY(${on ? -6 : 0}px)`}}>
            {m}
          </div>
        );
      })}
      <div style={{marginLeft: 18, opacity: done, transform: `scale(${0.6 + 0.4 * done})`}}>
        <TickMark k={done} color={B} size={96} />
      </div>
    </div>
  );
};

// A vertical bar with a value label; `parts` stack from the bottom.
const Bar = ({parts, max = 40, h = 560, w = 190, label, sub}: {parts: {v: number; k: number; c: string; text?: string}[]; max?: number; h?: number; w?: number; label: string; sub?: string}) => {
  let acc = 0;
  return (
    <div style={{position: "relative", width: w, height: h + 120, fontFamily: SANS}}>
      <div style={{position: "absolute", left: -30, right: -30, bottom: 110, height: 4, background: PAPER.ink}} />
      {parts.map((p, i) => {
        const hh = (p.v / max) * h * p.k;
        const bottom = 114 + (acc / max) * h;
        acc += p.v * p.k;
        return (
          <React.Fragment key={i}>
            <div style={{position: "absolute", left: 0, bottom, width: w, height: hh, background: p.c, borderRadius: i === parts.length - 1 ? "12px 12px 0 0" : 0}} />
            {p.text && p.k > 0.05 ? (
              <div style={{position: "absolute", left: w + 22, bottom: bottom + hh / 2 - 26, fontWeight: 800, fontSize: 46, color: p.c, opacity: p.k, whiteSpace: "nowrap"}}>{p.text}</div>
            ) : null}
          </React.Fragment>
        );
      })}
      <div style={{position: "absolute", left: "50%", bottom: 50, transform: "translateX(-50%)", fontWeight: 800, fontSize: 36, letterSpacing: 2, color: PAPER.ink, whiteSpace: "nowrap"}}>{label}</div>
      {sub ? <div style={{position: "absolute", left: "50%", bottom: 6, transform: "translateX(-50%)", fontWeight: 600, fontSize: 28, color: PAPER.inkSoft, whiteSpace: "nowrap"}}>{sub}</div> : null}
    </div>
  );
};

const PersonBust = ({size = 160, color}: {size?: number; color: string}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={32} r={18} fill={PAPER.white} stroke={PAPER.ink} strokeWidth={4.5} />
    <path d="M16 92 C16 66 30 56 50 56 C70 56 84 66 84 92 Z" fill={color} stroke={PAPER.ink} strokeWidth={4.5} strokeLinejoin="round" />
  </svg>
);

const Arrow = ({up, color, k}: {up: boolean; color: string; k: number}) => (
  <svg width={110} height={170} viewBox="0 0 60 100" style={{opacity: Math.min(1, k * 1.5), transform: `translateY(${(up ? 1 : -1) * (1 - k) * 30}px)`}}>
    <path d={up ? "M30 6 L54 38 H40 V94 H20 V38 H6 Z" : "M30 94 L54 62 H40 V6 H20 V62 H6 Z"} fill={color} />
  </svg>
);

// ——— the chapter ———

export const Ch2Board = () => {
  const frame = useCurrentFrame();
  if ((frame < sec(CH2[0]) - 40 || frame > sec(CH2[1]) + 90) && frame < sec(OVERVIEW_AT)) return null;
  const flip = interpolate(frame, [sec(140.54), sec(140.54) + 12], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const cut = grow(frame, 143.14, 30, Easing.inOut(Easing.cubic));

  return (
    <div style={{position: "absolute", left: SHIFT, top: 0}}>
      {/* ——— 2a: $1 on the stub, stock instead ——— */}
      <At x={620} y={Y + 40} k={grow(frame, 97.4, 16)} from="left" rot={-3}>
        <PayStub accent={TONE.hook.accent} k={1} />
      </At>
      <At x={620} y={Y - 300} k={grow(frame, 99.7, 12) * fade(frame, 106.4, 10)}>
        <Struck text="working for free" k={1} strike={grow(frame, 100.9, 10)} size={66} />
      </At>
      <At x={1300} y={Y - 300} k={grow(frame, 103.08, 12) * fade(frame, 106.4, 10)}>
        <div style={{transform: "translateX(10%)", fontFamily: SANS, fontWeight: 800, fontSize: 72, color: B, letterSpacing: -1, whiteSpace: "nowrap"}}>company stock</div>
      </At>
      <At x={1180} y={Y - 30} k={pop(frame, 104.24)} rot={-6}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 14}}>
          <Certificate w={260} color={B} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 36, color: PAPER.ink}}>shares</div>
        </div>
      </At>
      <At x={1520} y={Y + 210} k={pop(frame, 105.08)} rot={4}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 14}}>
          <OptionTicket w={280} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 36, color: PAPER.ink}}>stock options</div>
        </div>
      </At>
      <At x={1820} y={Y - 80} k={pop(frame, 105.98)}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 6}}>
          <EquityPie size={200} k={grow(frame, 106.1, 16)} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 36, color: PAPER.ink}}>equity</div>
        </div>
      </At>
      {/* rule #1 stamps across the cards */}
      <At x={1450} y={Y - 360} k={frame >= sec(108.6) ? 1 : 0} z={5}>
        <Stamp text="RULE #1 OF THE WEALTHY" at={108.6} color={B} size={52} rot={-4} />
      </At>

      {/* ——— 2b: hold more than a year → long-term capital gain ——— */}
      <At x={2950} y={Y - 210} k={grow(frame, 111.4, 14)}>
        <YearStrip k={interpolate(frame, [sec(112.9), sec(114.4)], [0, 1], CLAMP)} done={grow(frame, 114.51, 12)} />
      </At>
      <At x={2950} y={Y - 400} k={grow(frame, 111.91, 12)}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 62, color: PAPER.ink, whiteSpace: "nowrap"}}>sell after holding them more than a year</div>
      </At>
      <At x={2660} y={Y + 170} k={grow(frame, 115.31, 12)}>
        <div style={{display: "flex", alignItems: "center", gap: 26}}>
          <GrowChart size={150} color={B} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 64, color: PAPER.ink, whiteSpace: "nowrap"}}>profit</div>
        </div>
      </At>
      <At x={3300} y={Y + 100} k={grow(frame, 116.2, 10)}>
        <div style={{transform: "translateX(20%)"}}>
          <Struck text="salary" k={1} strike={grow(frame, 116.81, 10)} size={70} color={R} />
        </div>
      </At>
      <At x={3300} y={Y + 260} k={grow(frame, 118.59, 12)}>
        <div style={{transform: "translateX(20%)", fontFamily: SANS, fontWeight: 800, fontSize: 64, color: B, whiteSpace: "nowrap"}}>long-term capital gain</div>
      </At>

      {/* ——— 2c: 20% + 3.8% = 23.8% ——— */}
      <At x={4560} y={Y + 10} k={grow(frame, 120.6, 14)}>
        <Bar
          max={40}
          label="LONG-TERM GAINS"
          sub="top federal rate"
          parts={[
            {v: 20, k: grow(frame, 122.2, 75), c: B, text: "20%"},
            {v: 3.8, k: grow(frame, 126.36, 16), c: "#7fa0e0", text: "+ 3.8% surtax"},
          ]}
        />
      </At>
      <At x={4560} y={Y - 420} k={grow(frame, 121.74, 12)}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 56, color: PAPER.ink, whiteSpace: "nowrap"}}>the federal maximum</div>
      </At>
      <At x={5250} y={Y - 300} k={grow(frame, 129.34, 12)}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 36, color: PAPER.inkSoft}}>all in</div>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 150, color: B, letterSpacing: -5, lineHeight: 1}}>23.8%</div>
        </div>
      </At>

      {/* ——— 2d: 37% vs 20%, the label flip, nearly half ——— */}
      <At x={6380} y={Y + 10} k={grow(frame, 131.6, 14)}>
        <Bar max={40} label="PAYCHECK" parts={[{v: 37, k: grow(frame, 133.34, 20), c: R, text: "37%"}]} />
      </At>
      <At x={6900} y={Y + 10} k={grow(frame, 131.9, 14)}>
        <Bar max={40} label="STOCK GAINS" parts={[{v: 20, k: grow(frame, 136.44, 20), c: B, text: "20%"}]} />
      </At>
      <At x={6650} y={Y - 410} k={grow(frame, 131.04, 12) * fade(frame, 139.2, 10)}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: PAPER.ink, whiteSpace: "nowrap"}}>compare the two</div>
      </At>
      {/* the label on the money flips from SALARY to CAPITAL GAIN */}
      <At x={7330} y={Y - 360} k={grow(frame, 139.6, 12)} z={4}>
        <div style={{transform: `rotateY(${flip * 180}deg)`, transformStyle: "preserve-3d"}}>
          <div style={{transform: flip > 0.5 ? "rotateY(180deg)" : undefined}}>
            <Tag text={flip > 0.5 ? "CAPITAL GAIN" : "SALARY"} color={flip > 0.5 ? B : R} swing={Math.sin(frame / 6) * 4 * (1 - grow(frame, 142, 30))} />
          </div>
        </div>
      </At>
      <At x={7400} y={Y + 60} k={grow(frame, 143.14, 12)}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 64, letterSpacing: -2, whiteSpace: "nowrap", opacity: cut}}>
            <span style={{color: R}}>37%</span> <span style={{color: PAPER.inkSoft}}>→</span> <span style={{color: B}}>20%</span>
          </div>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 74, color: PAPER.ink, letterSpacing: -2, whiteSpace: "nowrap"}}>
            ≈ <span style={{color: B}}>half</span> the tax
          </div>
        </div>
      </At>

      {/* ——— 2e: no payroll tax; employee vs owner ——— */}
      <At x={8650} y={Y - 380} k={grow(frame, 147.34, 12)}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 54, color: PAPER.ink, whiteSpace: "nowrap"}}>payroll taxes on capital gains</div>
      </At>
      <At x={8380} y={Y - 230} k={pop(frame, 147.64)}>
        <Struck text="Social Security" k={1} strike={grow(frame, 150.38, 10)} size={78} />
      </At>
      <At x={9020} y={Y - 230} k={pop(frame, 148.92)}>
        <Struck text="Medicare" k={1} strike={grow(frame, 150.6, 10)} size={78} />
      </At>
      <At x={8250} y={Y + 170} k={grow(frame, 151.98, 14)} from="up" scale={1.35}>
        <div style={{display: "flex", alignItems: "center", gap: 20}}>
          <div style={{position: "relative"}}>
            <PersonBust size={170} color={TONE.tax.soft} />
            <div style={{position: "absolute", left: 120, top: -10}}>
              <Briefcase size={80} color={TONE.tax.soft} />
            </div>
          </div>
          <Arrow up={false} color={R} k={grow(frame, 153.42, 14)} />
          <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 46, color: PAPER.ink}}>employee</div>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 54, color: R, opacity: grow(frame, 153.42, 12)}}>punished</div>
          </div>
        </div>
      </At>
      <At x={9080} y={Y + 170} k={grow(frame, 154.92, 14)} from="up" scale={1.35}>
        <div style={{display: "flex", alignItems: "center", gap: 20}}>
          <PersonBust size={170} color={BS} />
          <Arrow up color={B} k={grow(frame, 155.74, 14)} />
          <div style={{display: "flex", flexDirection: "column"}}>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 46, color: PAPER.ink}}>owner</div>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 54, color: B, opacity: grow(frame, 155.74, 12)}}>rewarded</div>
          </div>
        </div>
      </At>
    </div>
  );
};

export const Ch2Notes = () => (
  <>
    <Note from={101.6} to={110.4} text="Stock awards are taxed as income when they vest; only later growth is a capital gain" />
    <Note from={120.5} to={130.6} text="Top long-term capital gains rate 20% + 3.8% Net Investment Income Tax (IRS)" />
    <Note from={133.2} to={145.8} text="Top federal rates: 37% ordinary income vs 20% long-term gains" />
  </>
);
