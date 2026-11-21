import React from "react";
import {Easing, interpolate, useCurrentFrame} from "remotion";
import {Certificate, GrowChart} from "./ch1";
import {TaxBook} from "./hook";
import {At, Note, TickMark} from "./kit";
import {CLAMP, fade, grow, Move2, PAPER, pop, SANS, sec, SERIF, TONE, OVERVIEW_AT} from "./look";
import {Img, staticFile} from "remotion";

// Chapter 3, "Down to zero" (157.1–240.9 s), gold: money that is never taxed. Row five (y≈6800),
// under the end of chapter 2: 20% → 0%, the SELL button, the unrealized gain, the yacht question,
// the private bank and the SBLOC, "Debt is not income", and stock vs interest.

export const CH3: [number, number] = [157.1, 240.9];
const G = TONE.zero.accent;
const GS = TONE.zero.soft;
const B = TONE.owner.accent;
const R = TONE.tax.accent;
const Y = 6800;
const SHIFT = 22000;

export const CH3_MOVES: Move2[] = [
  {at: 156.8, frames: 30, x: 1000 + SHIFT, y: Y, s: 1.0},
  {at: 157.9, frames: sec(9), x: 1000 + SHIFT, y: Y + 10, s: 1.05},
  {at: 171.6, frames: 32, x: 2900 + SHIFT, y: Y, s: 1.0},
  {at: 180.0, frames: sec(4.4), x: 2900 + SHIFT, y: Y + 10, s: 1.04},
  {at: 184.5, frames: sec(3), x: 2960 + SHIFT, y: Y + 20, s: 1.09},
  {at: 188.8, frames: 32, x: 4800 + SHIFT, y: Y, s: 1.0},
  {at: 199.3, frames: 32, x: 6700 + SHIFT, y: Y, s: 1.0},
  {at: 205.2, frames: sec(10), x: 6700 + SHIFT, y: Y + 10, s: 1.05},
  {at: 216.7, frames: 32, x: 8600 + SHIFT, y: Y, s: 1.0},
  {at: 224.2, frames: 20, x: 8600 + SHIFT, y: Y - 20, s: 1.12},
  {at: 226.4, frames: 26, x: 8600 + SHIFT, y: Y, s: 1.0},
  {at: 229.5, frames: 32, x: 10500 + SHIFT, y: Y, s: 1.0},
  {at: 230.6, frames: sec(10), x: 10500 + SHIFT, y: Y + 10, s: 1.05},
];

// ——— objects ———

const SellButton = ({w = 300, locked = 0, pressed = 0}: {w?: number; locked?: number; pressed?: number}) => (
  <div style={{position: "relative", width: w, height: w * 0.42}}>
    <div style={{position: "absolute", inset: 0, top: 14, borderRadius: w * 0.08, background: "#7d2a20"}} />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 14 * pressed,
        height: w * 0.42 - 14,
        borderRadius: w * 0.08,
        background: locked > 0.5 ? "#b9b2a4" : R,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS,
        fontWeight: 800,
        fontSize: w * 0.17,
        letterSpacing: 6,
        color: "#fff",
      }}
    >
      SELL
    </div>
    {locked > 0 ? (
      <svg style={{position: "absolute", right: -80, top: -60}} width={110} height={130} viewBox="0 0 60 70">
        <g transform={`scale(${locked}) `} style={{transformOrigin: "30px 40px"}}>
          <path d="M16 30 V20 Q16 6 30 6 Q44 6 44 20 V30" fill="none" stroke={PAPER.ink} strokeWidth={6} />
          <rect x={8} y={28} width={44} height={36} rx={7} fill={G} stroke={PAPER.ink} strokeWidth={4} />
          <circle cx={30} cy={46} r={5} fill={PAPER.ink} />
        </g>
      </svg>
    ) : null}
  </div>
);

// A line chart that draws itself from `a` to `b` seconds; values 0..1 over the box.
const Line = ({pts, w, h, a, b, color, width = 8, dash}: {pts: number[]; w: number; h: number; a: number; b: number; color: string; width?: number; dash?: boolean}) => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [sec(a), sec(b)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const d = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * w} ${h - v * h}`).join(" ");
  const id = `ln-${a}-${color.replace("#", "")}`;
  return (
    <svg width={w} height={h} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <mask id={id}>
        <path d={d} fill="none" stroke="#fff" strokeWidth={width + 8} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
      </mask>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash ? "18 14" : undefined} mask={`url(#${id})`} />
    </svg>
  );
};

const STOCK = [0.12, 0.16, 0.14, 0.22, 0.27, 0.25, 0.34, 0.4, 0.38, 0.5, 0.56, 0.62, 0.7, 0.68, 0.8, 0.88];

const Yacht = ({size = 260}: {size?: number}) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 100 60">
    <path d="M6 40 H94 L84 54 H18 Z" fill={PAPER.white} stroke={PAPER.ink} strokeWidth={3} strokeLinejoin="round" />
    <path d="M26 40 V28 H70 L80 40" fill={GS} stroke={PAPER.ink} strokeWidth={3} strokeLinejoin="round" />
    <path d="M36 28 V18 H60 L66 28" fill={PAPER.white} stroke={PAPER.ink} strokeWidth={3} strokeLinejoin="round" />
    {[32, 42, 52, 62].map((x) => (
      <rect key={x} x={x} y={31} width={6} height={4} rx={1} fill={PAPER.ink} />
    ))}
    <path d="M2 58 Q14 54 26 58 T50 58 T74 58 T98 58" fill="none" stroke={B} strokeWidth={3} />
  </svg>
);

const Mansion = ({size = 260}: {size?: number}) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 100 70">
    <path d="M10 30 L50 8 L90 30" fill={GS} stroke={PAPER.ink} strokeWidth={3} strokeLinejoin="round" />
    <rect x={14} y={30} width={72} height={36} fill={PAPER.white} stroke={PAPER.ink} strokeWidth={3} />
    {[22, 36, 58, 72].map((x) => (
      <rect key={x} x={x} y={36} width={8} height={10} fill={GS} stroke={PAPER.ink} strokeWidth={2} />
    ))}
    <rect x={44} y={46} width={12} height={20} fill={G} stroke={PAPER.ink} strokeWidth={2.5} />
  </svg>
);

const Bubble = ({children, w = 620, tail = "left"}: {children: React.ReactNode; w?: number; tail?: "left" | "right"}) => (
  <div style={{position: "relative", width: w, background: PAPER.white, borderRadius: 34, padding: "28px 38px", boxSizing: "border-box", boxShadow: "0 2px 3px rgba(40,30,20,0.16), 0 22px 40px -14px rgba(40,30,20,0.35)", fontFamily: SANS, fontWeight: 800, fontSize: 48, color: PAPER.ink, lineHeight: 1.15}}>
    {children}
    <div style={{position: "absolute", bottom: -26, [tail]: 70, width: 0, height: 0, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderTop: `30px solid ${PAPER.white}`}} />
  </div>
);

const PrivateBank = ({w = 520}: {w?: number}) => (
  <svg width={w} height={w * 0.78} viewBox="0 0 100 78" style={{filter: "drop-shadow(0 24px 30px rgba(40,30,20,0.3))"}}>
    <path d="M6 24 L50 4 L94 24 Z" fill="#20283a" stroke="#20283a" strokeWidth={2} strokeLinejoin="round" />
    <rect x={10} y={24} width={80} height={6} fill="#2c3650" />
    {[16, 30, 44, 58, 72].map((x) => (
      <rect key={x} x={x} y={32} width={8} height={34} fill="#f4efe2" stroke="#20283a" strokeWidth={1.6} />
    ))}
    <rect x={6} y={66} width={88} height={8} fill="#2c3650" />
    <text x={50} y={20} textAnchor="middle" fontFamily={SERIF} fontSize={6.5} letterSpacing={1} fill="#d8b766">PRIVATE BANK</text>
  </svg>
);

const CashBundle = ({w = 200}: {w?: number}) => (
  <div style={{position: "relative", width: w, height: w * 0.55}}>
    {[0, 1, 2].map((i) => (
      <div key={i} style={{position: "absolute", left: i * 6, top: (2 - i) * 8, width: w - 12, height: w * 0.4, borderRadius: 8, background: "#a9c79f", border: "3px solid #3d5a36", boxShadow: "0 6px 10px -6px rgba(0,0,0,0.3)"}}>
        <div style={{position: "absolute", left: "44%", top: 0, bottom: 0, width: "12%", background: G}} />
      </div>
    ))}
  </div>
);

const RateDial = ({k, w = 380}: {k: number; w?: number}) => {
  const a = -80 + 22 * k;
  return (
    <svg width={w} height={w * 0.62} viewBox="0 0 100 62" style={{overflow: "visible"}}>
      <path d="M8 54 A42 42 0 0 1 92 54" fill="none" stroke={PAPER.ground2} strokeWidth={10} strokeLinecap="round" />
      <path d="M8 54 A42 42 0 0 1 22 22" fill="none" stroke={G} strokeWidth={10} strokeLinecap="round" />
      <g transform={`rotate(${a} 50 54)`}>
        <line x1={50} y1={54} x2={50} y2={18} stroke={PAPER.ink} strokeWidth={4} strokeLinecap="round" />
      </g>
      <circle cx={50} cy={54} r={6} fill={PAPER.ink} />
      <text x={8} y={62} fontFamily={SANS} fontWeight={800} fontSize={6} fill={PAPER.inkSoft} textAnchor="middle">LOW</text>
      <text x={92} y={62} fontFamily={SANS} fontWeight={800} fontSize={6} fill={PAPER.inkSoft} textAnchor="middle">HIGH</text>
    </svg>
  );
};

// ——— the chapter ———

export const Ch3Board = () => {
  const frame = useCurrentFrame();
  if ((frame < sec(CH3[0]) - 40 || frame > sec(CH3[1]) + 90) && frame < sec(OVERVIEW_AT)) return null;
  const t = frame / 30;
  const rate = interpolate(frame, [sec(163.4), sec(165.3)], [20, 0], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const gain = Math.round(interpolate(frame, [sec(172.9), sec(174.4)], [0, 500], CLAMP));

  return (
    <div style={{position: "absolute", left: SHIFT, top: 0}}>
      {/* ——— 3a: 20% → 0%, only when you sell ——— */}
      <At x={700} y={Y - 300} k={grow(frame, 157.4, 12) * fade(frame, 166.3, 12)}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: PAPER.ink, whiteSpace: "nowrap"}}>even 20% is too high</div>
      </At>
      <At x={700} y={Y + 40} k={grow(frame, 157.6, 14) * fade(frame, 171.5, 12)}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 230, letterSpacing: -10, lineHeight: 1, color: rate < 0.5 ? G : B}}>{Math.round(rate)}%</div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, letterSpacing: 3, color: PAPER.inkSoft, marginTop: 10}}>{rate < 0.5 ? "TAX RATE" : "LONG-TERM GAINS TAX"}</div>
        </div>
      </At>
      <At x={1230} y={Y - 300} k={grow(frame, 159.55, 12) * fade(frame, 166.3, 12)}>
        <div style={{transform: "translateX(50%)", fontFamily: SANS, fontWeight: 800, fontSize: 56, color: G, whiteSpace: "nowrap"}}>for the ultra-wealthy</div>
      </At>
      {/* a second sheet slides out from under the first */}
      <At x={1330} y={Y + 40} k={grow(frame, 161.49, 18)} from="left" rot={3}>
        <div style={{width: 380, height: 460, background: PAPER.white, boxShadow: "0 22px 40px -14px rgba(40,30,20,0.4)", padding: 34, boxSizing: "border-box", fontFamily: SANS}}>
          <div style={{fontWeight: 800, fontSize: 30, letterSpacing: 3, color: G}}>LAYER 2</div>
          {[1, 0.8, 0.95, 0.6, 0.85, 0.7, 0.9].map((f, i) => (
            <div key={i} style={{height: 12, width: `${f * 100}%`, background: PAPER.ground2, borderRadius: 6, marginTop: 24}} />
          ))}
        </div>
      </At>
      <At x={1000} y={Y - 300} k={grow(frame, 166.53, 12) * fade(frame, 171.5, 10)}>
        <div style={{display: "flex", alignItems: "center", gap: 20}}>
          <svg width={80} height={100} viewBox="0 0 40 50"><circle cx={20} cy={16} r={12} fill={PAPER.ink} /><path d="M14 22 L10 46 H30 L26 22 Z" fill={PAPER.ink} /></svg>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 66, color: PAPER.ink, whiteSpace: "nowrap"}}>the secret most people miss</div>
        </div>
      </At>
      <At x={760} y={Y + 330} k={grow(frame, 169.45, 12)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: PAPER.ink, whiteSpace: "nowrap"}}>tax only when you</div>
      </At>
      <At x={1330} y={Y + 330} k={pop(frame, 171.13)}>
        <SellButton w={260} pressed={Math.max(0, Math.sin(Math.max(0, t - 171.4) * 6)) * (1 - grow(frame, 172, 10))} />
      </At>

      {/* ——— 3b: +$500M, never sold, taxable income $0 ——— */}
      <At x={2620} y={Y + 20} k={grow(frame, 172.0, 14)}>
        <div style={{position: "relative", width: 900, height: 440}}>
          <div style={{position: "absolute", left: 0, bottom: 0, width: 900, height: 4, background: PAPER.ink}} />
          <Line pts={STOCK} w={900} h={440} a={172.6} b={174.4} color={G} width={9} />
          <div style={{position: "absolute", left: 0, bottom: 14, fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: PAPER.inkSoft}}>THE BILLIONAIRE’S STOCK, THIS YEAR</div>
          {/* the unrealized gain bracket */}
          <div style={{position: "absolute", right: -40, top: 440 - 0.88 * 440, height: (0.88 - 0.12) * 440, width: 30, borderTop: `5px solid ${G}`, borderRight: `5px solid ${G}`, borderBottom: `5px solid ${G}`, opacity: grow(frame, 181.85, 12)}} />
        </div>
      </At>
      <At x={3080} y={Y - 360} k={grow(frame, 173.46, 10)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 100, color: G, letterSpacing: -3, whiteSpace: "nowrap"}}>+${gain}M</div>
      </At>
      <At x={3150} y={Y - 30} k={grow(frame, 181.85, 12)}>
        <div style={{transform: "translateX(50%)", display: "flex", flexDirection: "column"}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: G, whiteSpace: "nowrap"}}>unrealized gain</div>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: PAPER.inkSoft, whiteSpace: "nowrap", opacity: grow(frame, 183.69, 12)}}>richer on paper</div>
        </div>
      </At>
      <At x={2200} y={Y + 360} k={pop(frame, 175.76)}>
        <SellButton w={220} locked={grow(frame, 176.28, 12)} />
      </At>
      <At x={2900} y={Y + 360} k={grow(frame, 177.4, 12)}>
        <div style={{background: PAPER.white, boxShadow: "0 16px 26px -14px rgba(0,0,0,0.35)", padding: "18px 30px", display: "flex", gap: 40, alignItems: "baseline", fontFamily: SANS}}>
          <span style={{fontWeight: 700, fontSize: 34, color: PAPER.inkSoft, letterSpacing: 2}}>TAXABLE INCOME</span>
          <span style={{fontWeight: 800, fontSize: 80, color: G, transform: `scale(${1 + 0.3 * (1 - grow(frame, 179.34, 10))})`, opacity: grow(frame, 179.2, 8)}}>$0</span>
        </div>
      </At>
      <At x={3520} y={Y + 360} k={pop(frame, 186.72)} rot={-3}>
        <div style={{display: "flex", alignItems: "center", gap: 18, background: "#fff", borderRadius: 18, padding: "14px 22px", boxShadow: "0 16px 26px -14px rgba(0,0,0,0.35)"}}>
          <Img src={staticFile("logos/rr03-irs.svg")} style={{height: 64}} />
          <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: PAPER.ink}}>IRS</span>
          <span style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: PAPER.inkSoft, opacity: grow(frame, 187.74, 12), whiteSpace: "nowrap"}}>“nothing happened”</span>
        </div>
      </At>

      {/* ——— 3c: you can't buy a yacht with shares… actually, no ——— */}
      <At x={4560} y={Y - 160} k={grow(frame, 189.6, 14)}>
        <Bubble w={760}>
          you can’t buy a <span style={{color: B}}>yacht</span> or a <span style={{color: G}}>mansion</span> with shares…
        </Bubble>
      </At>
      <At x={4250} y={Y + 210} k={pop(frame, 192.26)} rot={-3} scale={1.4}>
        <Yacht size={300} />
      </At>
      <At x={4780} y={Y + 190} k={pop(frame, 192.9)} rot={2} scale={1.35}>
        <Mansion size={280} />
      </At>
      <At x={5260} y={Y + 210} k={pop(frame, 193.5)} rot={6} scale={1.2}>
        <div style={{position: "relative"}}>
          <Certificate w={220} color={B} />
          <svg style={{position: "absolute", left: 30, top: -10}} width={160} height={160} viewBox="0 0 100 100" opacity={grow(frame, 194.1, 8)}>
            <line x1={10} y1={10} x2={90} y2={90} stroke={R} strokeWidth={11} strokeLinecap="round" />
            <line x1={90} y1={10} x2={10} y2={90} stroke={R} strokeWidth={11} strokeLinecap="round" />
          </svg>
        </div>
      </At>
      <At x={4800} y={Y + 420} k={grow(frame, 195.56, 12) * fade(frame, 197.3, 8)}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 56, color: PAPER.ink, whiteSpace: "nowrap"}}>so they must sell… right?</div>
      </At>
      <At x={4800} y={Y + 420} k={grow(frame, 197.44, 8)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 96, color: G, letterSpacing: -2, whiteSpace: "nowrap", transform: `scale(${1 + 0.25 * (1 - grow(frame, 198.08, 10))})`}}>
          No. <span style={{color: PAPER.ink, opacity: grow(frame, 198.72, 10)}}>They don’t.</span>
        </div>
      </At>

      {/* ——— 3d: the private bank and the SBLOC ——— */}
      <At x={6700} y={Y} k={grow(frame, 199.9, 12) * fade(frame, 203.5, 10)}>
        <div style={{display: "flex", alignItems: "center", gap: 40}}>
          <SellButton w={240} pressed={grow(frame, 200.06, 6) * (1 - grow(frame, 200.4, 6))} />
          <svg width={120} height={40} viewBox="0 0 120 40"><path d="M4 20 H100 M84 6 L104 20 L84 34" fill="none" stroke={PAPER.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div style={{position: "relative", width: 380, boxSizing: "border-box", background: PAPER.white, boxShadow: "0 16px 26px -14px rgba(0,0,0,0.35)", padding: "24px 34px", fontFamily: SANS, opacity: grow(frame, 201.08, 10)}}>
            <div style={{fontWeight: 800, fontSize: 30, letterSpacing: 3, color: R}}>TAX BILL</div>
            <div style={{fontWeight: 800, fontSize: 64, color: PAPER.ink, marginTop: 8}}>$$$$</div>
            <svg style={{position: "absolute", left: 30, top: 14}} width={320} height={150} viewBox="0 0 100 60" opacity={grow(frame, 202.22, 8)}>
              <line x1={8} y1={8} x2={92} y2={52} stroke={R} strokeWidth={6} strokeLinecap="round" />
              <line x1={92} y1={8} x2={8} y2={52} stroke={R} strokeWidth={6} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </At>
      <At x={6700} y={Y - 300} k={grow(frame, 199.56, 12) * fade(frame, 203.5, 10)}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 60, color: PAPER.ink, whiteSpace: "nowrap"}}>instead of selling…</div>
      </At>
      <At x={6700} y={Y + 70} k={grow(frame, 203.9, 20)} from="up">
        <PrivateBank w={520} />
      </At>
      <At x={5980} y={Y + 140} k={grow(frame, 203.0, 14)} from="left">
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 8}}>
          <svg width={150} height={150} viewBox="0 0 100 100"><circle cx={50} cy={32} r={18} fill={PAPER.white} stroke={PAPER.ink} strokeWidth={4.5} /><path d="M16 92 C16 66 30 56 50 56 C70 56 84 66 84 92 Z" fill={GS} stroke={PAPER.ink} strokeWidth={4.5} strokeLinejoin="round" /></svg>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, color: PAPER.ink}}>billionaire</div>
        </div>
      </At>
      <At x={6250} y={Y - 140} k={grow(frame, 205.42, 12) * fade(frame, 207.7, 8)}>
        <Bubble w={560}>I own <span style={{color: B}}>$1B</span> of stock</Bubble>
      </At>
      <At x={6250} y={Y - 140} k={grow(frame, 207.84, 10) * fade(frame, 211.9, 10)}>
        <Bubble w={560}>lend me <span style={{color: G}}>$50M</span> in cash</Bubble>
      </At>
      {/* shares travel into the bank as collateral; cash comes back */}
      {[0, 1, 2].map((i) => {
        const k = grow(frame, 210.3 + i * 0.15, 22, Easing.inOut(Easing.cubic));
        return (
          <At key={i} x={6100 + k * 600} y={Y + 330 - i * 26 - k * 120} k={grow(frame, 210.1, 6) * (1 - grow(frame, 211.6 + i * 0.1, 8))} rot={-8 + i * 6} z={3}>
            <Certificate w={150} color={B} />
          </At>
        );
      })}
      <At x={7290} y={Y + 330} k={pop(frame, 211.08)}>
        <div style={{background: PAPER.ink, color: "#d8b766", fontFamily: SANS, fontWeight: 800, fontSize: 34, letterSpacing: 3, padding: "10px 22px", borderRadius: 8, whiteSpace: "nowrap"}}>COLLATERAL</div>
      </At>
      <At x={6700 - 560 * grow(frame, 209.4, 24)} y={Y + 380} k={grow(frame, 209.3, 8)} z={4}>
        <CashBundle w={190} />
      </At>
      <At x={6700} y={Y - 380} k={grow(frame, 212.85, 12)}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, color: PAPER.ink, whiteSpace: "nowrap", opacity: fade(frame, 214.9, 12) * 0.6 + 0.4}}>Securities-Backed Line of Credit</div>
        </div>
      </At>
      <At x={7260} y={Y - 170} k={pop(frame, 215.07, 16)} rot={-4}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 110, color: G, letterSpacing: -2}}>SBLOC</div>
      </At>

      {/* ——— 3e: low rates; debt is not income ——— */}
      <At x={8250} y={Y + 60} k={grow(frame, 217.2, 14) * fade(frame, 222.5, 12)}>
        <div style={{position: "relative", width: 420, height: 420}}>
          {Array.from({length: 12}).map((_, i) => (
            <div key={i} style={{position: "absolute", left: 30 + (i % 4) * 90, top: 300 - Math.floor(i / 4) * 80, transform: `rotate(${(i % 3) * 5 - 5}deg) scale(${pop(frame, 217.6 + i * 0.06, 10)})`}}>
              <Certificate w={150} color={B} />
            </div>
          ))}
          <div style={{position: "absolute", left: 0, top: -40, fontFamily: SANS, fontWeight: 800, fontSize: 48, color: PAPER.ink, whiteSpace: "nowrap", opacity: grow(frame, 218.17, 12)}}>billions in assets</div>
        </div>
      </At>
      <At x={8950} y={Y + 60} k={grow(frame, 219.6, 14) * fade(frame, 222.5, 12)}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>
          <RateDial k={1 - grow(frame, 220.4, 30)} w={380} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 48, color: G, whiteSpace: "nowrap"}}>ultra-low interest</div>
        </div>
      </At>
      <At x={8600} y={Y + 60} k={grow(frame, 222.6, 14) * fade(frame, 224.55, 6)} from="up">
        <TaxBook open={grow(frame, 223.2, 18)} w={520} />
      </At>
      <At x={8600} y={Y - 360} k={grow(frame, 222.81, 12) * fade(frame, 224.6, 6)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: G, letterSpacing: 4, whiteSpace: "nowrap"}}>THE GOLDEN RULE</div>
      </At>
      <At x={8600} y={Y - 30} k={grow(frame, 224.75, 8)}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 170, color: PAPER.ink, whiteSpace: "nowrap", letterSpacing: -2, textShadow: grow(frame, 225.73, 14) > 0 ? `0 0 ${50 * grow(frame, 225.73, 14)}px rgba(216,183,102,0.6)` : undefined}}>
          Debt is not <span style={{color: G}}>income.</span>
        </div>
      </At>
      <At x={8600} y={Y + 260} k={grow(frame, 226.79, 12)}>
        <div style={{display: "flex", alignItems: "center", gap: 28}}>
          <CashBundle w={170} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: PAPER.ink, whiteSpace: "nowrap"}}>
            borrowed money → income tax <span style={{color: G}}>$0</span>
          </div>
        </div>
      </At>

      {/* ——— 3f: the result, and the race ——— */}
      {[
        {at: 230.75, big: "$50M", small: "cash to live on", icon: <CashBundle w={170} />},
        {at: 233.85, big: "0%", small: "income tax", icon: <TickMark k={grow(frame, 234.1, 14)} color={G} size={110} />},
        {at: 235.99, big: "100%", small: "of the stock kept", icon: <Certificate w={170} color={B} />},
      ].map((c, i) => (
        <At key={i} x={9900 + i * 420} y={Y - 200} k={pop(frame, c.at)}>
          <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 380}}>
            <div style={{height: 120, display: "flex", alignItems: "center"}}>{c.icon}</div>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 92, color: i === 2 ? B : G, letterSpacing: -3, lineHeight: 1}}>{c.big}</div>
            <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: PAPER.inkSoft, whiteSpace: "nowrap"}}>{c.small}</div>
          </div>
        </At>
      ))}
      <At x={10500} y={Y + 300} k={grow(frame, 237.69, 12)}>
        <div style={{position: "relative", width: 1000, height: 220}}>
          <div style={{position: "absolute", left: 0, bottom: 0, width: 1000, height: 4, background: PAPER.ink}} />
          <Line pts={[0.05, 0.12, 0.2, 0.3, 0.42, 0.55, 0.7, 0.86, 1]} w={1000} h={220} a={237.85} b={239.6} color={G} width={9} />
          <Line pts={[0.04, 0.07, 0.1, 0.13, 0.16, 0.19, 0.22, 0.25, 0.28]} w={1000} h={220} a={239.0} b={240.4} color={PAPER.inkSoft} width={6} dash />
          <div style={{position: "absolute", right: -230, top: -20, fontFamily: SANS, fontWeight: 800, fontSize: 38, color: G, opacity: grow(frame, 238.77, 12), whiteSpace: "nowrap"}}>stock grows</div>
          <div style={{position: "absolute", right: -260, top: 150, fontFamily: SANS, fontWeight: 800, fontSize: 38, color: PAPER.inkSoft, opacity: grow(frame, 239.61, 12), whiteSpace: "nowrap"}}>loan interest</div>
        </div>
      </At>
      <At x={10500} y={Y - 450} k={grow(frame, 230.0, 12)}>
        <div style={{display: "flex", alignItems: "center", gap: 18}}>
          <GrowChart size={70} color={G} />
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 52, color: PAPER.ink, whiteSpace: "nowrap"}}>borrow instead of sell</div>
        </div>
      </At>
    </div>
  );
};

export const Ch3Notes = () => (
  <>
    <Note from={172.0} to={188.6} text="Illustration · gains are taxed only when shares are sold (realized)" />
    <Note from={212.8} to={222.4} text="Rates vary · loans are repaid with interest, and a falling stock can force a sale" />
    <Note from={237.6} to={240.9} text="Illustration · works while the stock grows faster than the loan costs" />
  </>
);
