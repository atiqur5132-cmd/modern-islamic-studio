import React from "react";
import {Easing, interpolate, useCurrentFrame} from "remotion";
import {Img, staticFile} from "remotion";
import {At, DollarBill, Note, PhotoPrint} from "./kit";
import {CLAMP, drop, fade, grow, Move2, PAPER, pop, SANS, sec, SERIF, TONE, OVERVIEW_AT} from "./look";

// Chapter 1, "Two buckets" (40.3–97.2 s), tax red: what a paycheck loses. The third row of the
// board (y≈3600), left to right: the label on a dollar, the two buckets, the bracket stairs,
// Zuckerberg's imaginary $100M, and the front door / back door.

export const CH1: [number, number] = [40.3, 97.2];
const R = TONE.tax.accent;
const RS = TONE.tax.soft;
const Y = 3600;
// Row three starts right under the end of the hook (x≈7000), so the camera only drops down.
const SHIFT = 6000;

export const CH1_MOVES: Move2[] = [
  {at: 40.1, frames: 22, x: 1000 + SHIFT, y: 2800, s: 0.62},
  {at: 40.75, frames: 26, x: 1000 + SHIFT, y: Y, s: 1.0},
  {at: 41.9, frames: sec(4), x: 1000 + SHIFT, y: Y + 10, s: 1.05},
  {at: 49.3, frames: 32, x: 2900 + SHIFT, y: Y, s: 1.0},
  {at: 54.6, frames: sec(5), x: 2900 + SHIFT, y: Y + 20, s: 1.06},
  {at: 59.75, frames: 32, x: 4850 + SHIFT, y: Y, s: 1.0},
  {at: 66.5, frames: 30, x: 5150 + SHIFT, y: Y, s: 1.0},
  {at: 72.9, frames: sec(2.4), x: 5150 + SHIFT, y: Y + 10, s: 1.05},
  {at: 75.4, frames: 32, x: 7000 + SHIFT, y: Y, s: 1.0},
  {at: 79.0, frames: sec(5.5), x: 7000 + SHIFT, y: Y + 10, s: 1.05},
  {at: 84.9, frames: 32, x: 8900 + SHIFT, y: Y, s: 1.0},
  {at: 91.2, frames: 26, x: 8900 + SHIFT, y: Y + 40, s: 1.12},
  {at: 94.4, frames: 30, x: 9050 + SHIFT, y: Y, s: 1.0},
];

// ——— objects ———

// The IRS eagle mark (unaltered) with a plain "IRS" label beside it, so it reads at small size.
const IrsCard = ({h = 120}: {h?: number}) => (
  <div style={{height: h, background: "#fff", borderRadius: 18, boxShadow: "0 2px 3px rgba(40,30,20,0.18), 0 22px 40px -12px rgba(40,30,20,0.35)", display: "flex", alignItems: "center", gap: h * 0.14, padding: `0 ${h * 0.26}px`}}>
    <Img src={staticFile("logos/rr03-irs.svg")} style={{height: h * 0.62}} />
    <span style={{fontFamily: SANS, fontWeight: 800, fontSize: h * 0.42, color: PAPER.ink, letterSpacing: 1}}>IRS</span>
  </div>
);

export const Bucket = ({w = 300, fill = 0, color, label}: {w?: number; fill?: number; color: string; label?: string}) => (
  <svg width={w} height={w * 0.95} viewBox="0 0 100 95" style={{overflow: "visible", filter: "drop-shadow(0 22px 24px rgba(40,30,20,0.25))"}}>
    <path d="M14 20 Q50 2 86 20" fill="none" stroke={PAPER.ink} strokeWidth={3} />
    <clipPath id={`bk-${color}`}>
      <path d="M8 24 H92 L82 90 Q81 93 78 93 H22 Q19 93 18 90 Z" />
    </clipPath>
    <path d="M8 24 H92 L82 90 Q81 93 78 93 H22 Q19 93 18 90 Z" fill={PAPER.white} stroke={PAPER.ink} strokeWidth={3.5} strokeLinejoin="round" />
    <rect x={0} y={93 - 69 * fill} width={100} height={70} fill={color} opacity={0.85} clipPath={`url(#bk-${color})`} />
    <ellipse cx={50} cy={24} rx={42} ry={6} fill="none" stroke={PAPER.ink} strokeWidth={3.5} />
    {label ? (
      <text x={50} y={66} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={11} letterSpacing={1} fill={PAPER.ink}>
        {label}
      </text>
    ) : null}
  </svg>
);

export const Briefcase = ({size = 120, color}: {size?: number; color: string}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x={36} y={18} width={28} height={16} rx={5} fill="none" stroke={PAPER.ink} strokeWidth={6} />
    <rect x={8} y={32} width={84} height={56} rx={10} fill={color} stroke={PAPER.ink} strokeWidth={5} />
    <rect x={8} y={52} width={84} height={6} fill={PAPER.ink} opacity={0.3} />
    <rect x={44} y={48} width={12} height={14} rx={3} fill={PAPER.white} stroke={PAPER.ink} strokeWidth={3} />
  </svg>
);

export const GrowChart = ({size = 120, color}: {size?: number; color: string}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <rect x={6} y={10} width={88} height={80} rx={10} fill={PAPER.white} stroke={PAPER.ink} strokeWidth={5} />
    {[0.3, 0.45, 0.62, 0.8].map((h, i) => (
      <rect key={i} x={18 + i * 18} y={80 - 60 * h} width={12} height={60 * h} rx={2} fill={color} />
    ))}
    <path d="M16 62 L38 50 L56 54 L84 24" fill="none" stroke={PAPER.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M72 22 H86 V36" fill="none" stroke={PAPER.ink} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// A hanging label tag on a string (the government's label on a dollar).
export const Tag = ({text, swing = 0, color}: {text: string; swing?: number; color: string}) => (
  <div style={{transformOrigin: "50% 0%", transform: `rotate(${swing}deg)`, display: "flex", flexDirection: "column", alignItems: "center"}}>
    <div style={{width: 3, height: 70, background: PAPER.ink}} />
    <div style={{background: PAPER.white, border: `4px solid ${color}`, borderRadius: 12, padding: "12px 26px", fontFamily: SANS, fontWeight: 800, fontSize: 46, color, letterSpacing: 2, boxShadow: "0 16px 24px -10px rgba(0,0,0,0.3)", whiteSpace: "nowrap"}}>{text}</div>
  </div>
);

// US federal brackets (2025): the stairs climb as the narrator says "climbs up to 37%".
const BRACKETS = [10, 12, 22, 24, 32, 35, 37];
const Stairs = ({k, top}: {k: number; top: number}) => {
  const bw = 96;
  const gap = 18;
  const hMax = 520;
  return (
    <div style={{position: "relative", width: BRACKETS.length * (bw + gap), height: hMax + 80}}>
      {BRACKETS.map((b, i) => {
        const kk = Math.max(0, Math.min(1, k * BRACKETS.length - i));
        const h = (b / 40) * hMax * Easing.out(Easing.cubic)(kk);
        const isTop = i === BRACKETS.length - 1;
        return (
          <div key={b} style={{position: "absolute", left: i * (bw + gap), bottom: 60, width: bw, height: h, background: isTop ? R : RS, borderRadius: "10px 10px 0 0", boxShadow: isTop && top > 0 ? `0 0 ${40 * top}px rgba(207,74,58,${0.5 * top})` : undefined}}>
            <div style={{position: "absolute", top: isTop ? -96 : -48, left: "50%", transform: `translateX(-50%) scale(${isTop ? 1 + top * 0.6 : 1})`, transformOrigin: "50% 100%", fontFamily: SANS, fontWeight: 800, fontSize: isTop ? 54 : 34, color: isTop ? R : PAPER.inkSoft, opacity: kk, whiteSpace: "nowrap"}}>{b}%</div>
          </div>
        );
      })}
      <div style={{position: "absolute", left: 0, right: 0, bottom: 56, height: 4, background: PAPER.ink}} />
      <div style={{position: "absolute", left: 0, bottom: 0, fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: PAPER.inkSoft}}>FEDERAL INCOME TAX BRACKETS</div>
    </div>
  );
};

// A $100 paycheck as a bar: federal 37, state 13.3, payroll 2.35, what is left.
const SLICES = [
  {label: "Federal", v: 37, at: 63.32, c: R},
  {label: "State", v: 13.3, at: 67.36, c: "#e07b62"},
  {label: "Payroll", v: 2.35, at: 68.46, c: "#ec9c86"},
];
const PayBar = ({frame}: {frame: number}) => {
  const W = 1300;
  let x = 0;
  const kept = grow(frame, 72.26, 14);
  return (
    <div style={{position: "relative", width: W, height: 230, fontFamily: SANS}}>
      <div style={{position: "absolute", left: 0, top: 40, width: W, height: 130, background: PAPER.white, borderRadius: 14, boxShadow: "0 18px 30px -14px rgba(40,30,20,0.35)", overflow: "hidden"}}>
        {SLICES.map((s) => {
          const k = grow(frame, s.at, 16);
          const w = (s.v / 100) * W * k;
          const el = <div key={s.label} style={{position: "absolute", left: x, top: 0, width: w, height: 130, background: s.c}} />;
          x += (s.v / 100) * W;
          return el;
        })}
        <div style={{position: "absolute", left: W * 0.5235, top: 0, width: 5, height: 130, background: PAPER.ink, opacity: kept}} />
      </div>
      {(() => {
        let lx = 0;
        return SLICES.map((s) => {
          const k = grow(frame, s.at + 0.1, 12);
          const left = lx + ((s.v / 100) * W) / 2;
          lx += (s.v / 100) * W;
          return (
            <div key={s.label} style={{position: "absolute", left, top: s.label === "Payroll" ? 186 : 0, transform: "translateX(-50%)", opacity: k, fontWeight: 800, fontSize: 30, color: PAPER.ink, whiteSpace: "nowrap", textAlign: "center"}}>
              {s.label} {s.v}%
            </div>
          );
        });
      })()}
      <div style={{position: "absolute", left: W * 0.76, top: 82, transform: "translateX(-50%)", fontWeight: 800, fontSize: 40, color: PAPER.inkSoft, opacity: kept, whiteSpace: "nowrap"}}>you keep ≈ 47%</div>
    </div>
  );
};

const StateTag = ({name, k}: {name: string; k: number}) => (
  <div style={{transform: `scale(${0.6 + 0.4 * k})`, opacity: Math.min(1, k * 1.5), background: PAPER.ink, color: PAPER.white, fontFamily: SANS, fontWeight: 800, fontSize: 36, letterSpacing: 2, padding: "12px 24px", borderRadius: 10, whiteSpace: "nowrap", boxShadow: "0 14px 20px -10px rgba(0,0,0,0.4)"}}>
    {name}
  </div>
);

// $100M as a tall stack of cash; the top half turns red and lifts away to the IRS.
const CashStack = ({frame}: {frame: number}) => {
  const n = 20;
  const red = grow(frame, 81.39, 14);
  const away = grow(frame, 82.81, 34, Easing.in(Easing.cubic));
  return (
    <div style={{position: "relative", width: 360, height: n * 26 + 40}}>
      {Array.from({length: n}).map((_, i) => {
        const k = grow(frame, 78.79 + i * 0.04, 10);
        const top = i >= n / 2;
        const lift = top ? away : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              bottom: i * 26,
              width: 360,
              height: 30,
              borderRadius: 6,
              background: top && red > 0 ? (red > 0.5 ? R : "#9dbb94") : "#9dbb94",
              border: `3px solid ${top && red > 0.5 ? "#8e2c20" : "#3d5a36"}`,
              boxSizing: "border-box",
              opacity: k * (1 - lift),
              transform: `translate(${lift * (560 + (i - n / 2) * 8)}px, ${(1 - k) * -60 + lift * (60 + (i - n / 2) * 26)}px) rotate(${lift * (i % 2 ? 14 : -10)}deg) scale(${1 - 0.65 * lift})`,
            }}
          >
            <div style={{position: "absolute", left: "50%", top: 3, width: 60, height: 18, marginLeft: -30, borderRadius: 4, background: top && red > 0.5 ? "#f5d5ce" : "#e4ecd9"}} />
          </div>
        );
      })}
    </div>
  );
};

// The two doors: the front (taxed) and the back. `shut` closes the front; `open` opens the back.
const Door = ({w = 300, color, label, open = 0, shut = 0, sign}: {w?: number; color: string; label: string; open?: number; shut?: number; sign?: string}) => {
  const h = w * 1.75;
  return (
    <div style={{position: "relative", width: w + 40, height: h + 60, fontFamily: SANS}}>
      <div style={{position: "absolute", left: 0, top: 0, width: w + 40, height: h + 20, background: PAPER.ink, borderRadius: "16px 16px 0 0"}} />
      <div style={{position: "absolute", left: 20, top: 20, width: w, height: h, background: open > 0 ? "#fff6dc" : "#3a352d", boxShadow: open > 0 ? `inset 0 0 ${120 * open}px rgba(255,214,120,${0.9 * open})` : undefined}} />
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          width: w,
          height: h,
          background: color,
          transformOrigin: "0% 50%",
          transform: `perspective(1400px) rotateY(${-72 * open}deg)`,
          boxShadow: "inset 0 0 0 6px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{position: "absolute", right: 30, top: h * 0.5, width: 22, height: 22, borderRadius: 11, background: "#e2c26f"}} />
        {[0.12, 0.55].map((y) => (
          <div key={y} style={{position: "absolute", left: 30, right: 30, top: h * y, height: h * 0.33, border: "4px solid rgba(0,0,0,0.16)", borderRadius: 6}} />
        ))}
      </div>
      {shut > 0 ? (
        <svg style={{position: "absolute", left: 20, top: 20 + h * 0.2}} width={w} height={w} viewBox="0 0 100 100">
          <g stroke={PAPER.white} strokeWidth={10} strokeLinecap="round">
            <line x1={18} y1={18} x2={18 + 64 * Math.min(1, shut * 2)} y2={18 + 64 * Math.min(1, shut * 2)} />
            {shut > 0.5 ? <line x1={82} y1={18} x2={82 - 64 * (shut * 2 - 1)} y2={18 + 64 * (shut * 2 - 1)} /> : null}
          </g>
        </svg>
      ) : null}
      <div style={{position: "absolute", left: "50%", top: -78, transform: "translateX(-50%)", fontWeight: 800, fontSize: 40, letterSpacing: 3, color: PAPER.ink, whiteSpace: "nowrap"}}>{label}</div>
      {sign ? <div style={{position: "absolute", left: "50%", top: h * 0.08 + 20, transform: "translateX(-50%) rotate(-4deg)", background: PAPER.white, color: R, fontWeight: 800, fontSize: 46, padding: "6px 18px", borderRadius: 8, border: `4px solid ${R}`, whiteSpace: "nowrap"}}>{sign}</div> : null}
    </div>
  );
};

export const Certificate = ({w = 150, color}: {w?: number; color: string}) => (
  <div style={{width: w, height: w * 0.66, background: "#f7f2e4", border: `4px solid ${color}`, borderRadius: 6, boxShadow: "0 10px 16px -8px rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: w * 0.15, color}}>SHARES</div>
);

// ——— the chapter ———

export const Ch1Board = () => {
  const frame = useCurrentFrame();
  if ((frame < sec(CH1[0]) - 30 || frame > sec(CH1[1]) + 90) && frame < sec(OVERVIEW_AT)) return null;
  const t = frame / 30;
  const swing = Math.sin((t - 45.15) * 3.2) * 14 * Math.exp(-Math.max(0, t - 45.15) * 0.9);

  return (
    <div style={{position: "absolute", left: SHIFT, top: 0}}>
      {/* ——— 1a: a label on every dollar ——— */}
      <At x={760} y={Y - 30} k={grow(frame, 40.6, 18)} from="up" rot={-3}>
        <DollarBill w={560} />
      </At>
      <At x={1010} y={Y - 160} k={grow(frame, 45.15, 1) > 0 ? 1 : 0} z={3}>
        <div style={{transform: "translate(40px, 60px)"}}>
          <Tag text="LABEL: ?" swing={grow(frame, 45.15, 12) > 0 ? swing : 0} color={R} />
        </div>
      </At>
      <At x={1000} y={Y - 380} k={grow(frame, 42.15, 12)}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 72, color: PAPER.ink, whiteSpace: "nowrap"}}>the $1 salary trick</div>
      </At>
      <At x={1440} y={Y + 70} k={grow(frame, 44.45, 12) * fade(frame, 46.6, 10)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 60, color: R, whiteSpace: "nowrap", letterSpacing: -1}}>tax system</div>
      </At>
      {/* two identical bills, not equal */}
      <At x={700} y={Y + 330} k={pop(frame, 47.67)} rot={-4} scale={0.5}>
        <DollarBill w={560} />
      </At>
      <At x={1300} y={Y + 330} k={pop(frame, 47.85)} rot={3} scale={0.5}>
        <DollarBill w={560} />
      </At>
      <At x={1000} y={Y + 330} k={pop(frame, 48.55, 12)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 150, color: R, lineHeight: 1}}>≠</div>
      </At>

      {/* ——— 1b: two buckets ——— */}
      <At x={2560} y={Y + 160} k={drop(frame, 50.53, 18)} from="drop">
        <Bucket w={340} fill={interpolate(frame, [sec(56.3), sec(57.2)], [0, 0.55], CLAMP)} color={R} />
      </At>
      <At x={3260} y={Y + 160} k={drop(frame, 50.71, 18)} from="drop">
        <Bucket w={340} fill={0} color={TONE.owner.accent} />
      </At>
      <At x={2560} y={Y - 230} k={pop(frame, 51.43)}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 8}}>
          <Briefcase size={120} color={RS} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: PAPER.ink, whiteSpace: "nowrap"}}>money you work for</div>
        </div>
      </At>
      <At x={3260} y={Y - 230} k={pop(frame, 52.91)}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 8}}>
          <GrowChart size={120} color={TONE.owner.accent} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: PAPER.ink, whiteSpace: "nowrap"}}>money your assets make</div>
        </div>
      </At>
      {/* a paycheck drops into the left bucket */}
      <At x={2560} y={Y + interpolate(frame, [sec(55.6), sec(56.4)], [-120, 70], {...CLAMP, easing: Easing.in(Easing.quad)})} k={grow(frame, 55.45, 8) * fade(frame, 56.4, 6)} rot={-8} z={2}>
        <div style={{width: 260, height: 110, background: "#eef3ea", border: "3px solid #9db59a", fontFamily: SANS, fontWeight: 800, fontSize: 26, color: "#3d5a36", letterSpacing: 2, display: "flex", alignItems: "center", justifyContent: "center"}}>SALARY</div>
      </At>
      <At x={2140} y={Y + 360} k={pop(frame, 57.25)} rot={-4}>
        <IrsCard h={110} />
      </At>
      <At x={2600} y={Y + 420} k={grow(frame, 57.83, 12)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: R, whiteSpace: "nowrap"}}>“ordinary earned income”</div>
      </At>

      {/* ——— 1c: the bracket stairs, then the whole paycheck ——— */}
      <At x={4560} y={Y + 10} k={grow(frame, 59.95, 14) * fade(frame, 66.6, 14)}>
        <Stairs k={interpolate(frame, [sec(60.3), sec(65.3)], [0, 1], CLAMP)} top={grow(frame, 65.4, 14)} />
      </At>
      <At x={5200} y={Y - 330} k={grow(frame, 62.42, 12) * fade(frame, 66.6, 12)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: PAPER.ink, whiteSpace: "nowrap"}}>United States</div>
      </At>
      <At x={5150} y={Y + 20} k={grow(frame, 66.68, 14)}>
        <PayBar frame={frame} />
      </At>
      <At x={4800} y={Y - 330} k={pop(frame, 70.52)} rot={-3}>
        <StateTag name="CALIFORNIA" k={1} />
      </At>
      <At x={5260} y={Y - 330} k={pop(frame, 71.28)} rot={3}>
        <StateTag name="NEW YORK" k={1} />
      </At>
      <At x={5150} y={Y + 300} k={grow(frame, 72.26, 12)}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 70, color: PAPER.ink, whiteSpace: "nowrap"}}>
          nearly <span style={{color: R}}>half</span>, before they see it
        </div>
      </At>

      {/* ——— 1d: Zuckerberg's imaginary $100M paycheck ——— */}
      <At x={6380} y={Y - 20} k={grow(frame, 76.6, 16)} from="left" rot={-4}>
        <PhotoPrint src="footage/broll-rr03-zuckerberg.jpg" w={300} h={370} pos="50% 18%" name="IMAGINE" nameK={grow(frame, 75.99, 10)} accent={R} />
      </At>
      <At x={7000} y={Y + 60} k={grow(frame, 78.7, 6)}>
        <CashStack frame={frame} />
      </At>
      <At x={7000} y={Y - 380} k={grow(frame, 78.79, 12)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 92, color: PAPER.ink, letterSpacing: -3, whiteSpace: "nowrap"}}>$100,000,000</div>
      </At>
      <At x={7470} y={Y - 170} k={grow(frame, 81.39, 12)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 80, color: R, letterSpacing: -2, whiteSpace: "nowrap"}}>− $50M</div>
      </At>
      <At x={7640} y={Y + 200} k={pop(frame, 83.2)} rot={4}>
        <IrsCard h={130} />
      </At>

      {/* ——— 1e: the front door and the back door ——— */}
      <At x={8650} y={Y + 40} k={grow(frame, 85.6, 18)} from="up">
        <Door w={290} color="#8d2f24" label="FRONT DOOR" sign={grow(frame, 89.05, 1) > 0 ? "−50%" : undefined} shut={grow(frame, 91.61, 14)} />
      </At>
      <At x={9250} y={Y + 40} k={grow(frame, 86.0, 18)} from="up">
        <Door w={290} color="#1f3f78" label="BACK DOOR" open={grow(frame, 94.4, 24)} />
      </At>
      <At x={8650} y={Y - 380} k={grow(frame, 86.79, 12) * fade(frame, 91.2, 10)}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 60, color: PAPER.ink, whiteSpace: "nowrap"}}>the most heavily taxed door</div>
      </At>
      {/* $1 slips through the front, billions pour through the back */}
      <At x={8650 + interpolate(frame, [sec(92.75), sec(93.9)], [-420, 0], {...CLAMP, easing: Easing.out(Easing.cubic)})} y={Y + 300} k={grow(frame, 92.6, 8) * fade(frame, 94.3, 10)} rot={-6} z={4} scale={0.38}>
        <DollarBill w={560} />
      </At>
      {Array.from({length: 9}).map((_, i) => {
        const at = 94.75 + i * 0.12;
        const k = grow(frame, at, 26, Easing.out(Easing.cubic));
        return (
          <At key={i} x={9250 + 40 + k * (360 + (i % 3) * 120)} y={Y + 120 + (i % 4) * 70 - k * 60} k={k > 0 ? 1 : 0} rot={-20 + i * 9} z={5} scale={0.9}>
            <Certificate w={150} color={TONE.owner.accent} />
          </At>
        );
      })}
      <At x={9830} y={Y - 170} k={grow(frame, 94.59, 12)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 70, color: TONE.owner.accent, letterSpacing: -1, whiteSpace: "nowrap"}}>billions</div>
      </At>
      <At x={8330} y={Y + 140} k={grow(frame, 92.75, 12) * fade(frame, 96.8, 10)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 70, color: R, letterSpacing: -1, whiteSpace: "nowrap"}}>$1</div>
      </At>
    </div>
  );
};

export const Ch1Notes = () => (
  <>
    <Note from={63.3} to={66.5} text="US federal brackets, 2025 · top rate 37% (IRS)" />
    <Note from={66.7} to={75.3} text="Illustration: California top earner · 37% federal + 13.3% state + 2.35% Medicare" />
    <Note from={78.8} to={84.8} text="Illustration · Zuckerberg takes a $1 salary" />
  </>
);
