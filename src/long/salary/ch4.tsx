import React from "react";
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {Certificate, GrowChart} from "./ch1";
import {DollarBill, LogoCard, Note, PhotoPrint, At, Struck} from "./kit";
import {TaxBook} from "./hook";
import {CLAMP, fade, grow, Move2, PAPER, pop, SANS, sec, SERIF, TONE} from "./look";

// Chapter 4, "PR and control" (240.9–282.1 s), violet: price and power; then the outro
// (282.1–317.5 s), green again. Row six (y≈8400), under the end of chapter 3. On "subscribe" the
// camera pulls back over the outro row, then the end card leaves room for YouTube's end screen.

export const CH4: [number, number] = [240.9, 317.5];
const V = TONE.power.accent;
const VS = TONE.power.soft;
const G = TONE.hook.accent;
const R = TONE.tax.accent;
const GOLD = TONE.zero.accent;
const Y = 8400;
const SHIFT = 31500;

export const CH4_MOVES: Move2[] = [
  {at: 240.6, frames: 30, x: 1000 + SHIFT, y: Y, s: 1.0},
  {at: 247.8, frames: 32, x: 2900 + SHIFT, y: Y, s: 1.0},
  {at: 253.9, frames: sec(5.5), x: 2940 + SHIFT, y: Y + 10, s: 1.02},
  {at: 259.7, frames: 32, x: 4800 + SHIFT, y: Y, s: 1.0},
  {at: 272.6, frames: 32, x: 6700 + SHIFT, y: Y, s: 1.0},
  {at: 282.8, frames: 32, x: 8600 + SHIFT, y: Y, s: 1.0},
  {at: 289.9, frames: 32, x: 10500 + SHIFT, y: Y, s: 1.0},
  {at: 297.2, frames: 30, x: 12400 + SHIFT, y: Y, s: 1.0},
  {at: 301.9, frames: 30, x: 14300 + SHIFT, y: Y, s: 1.0},
  {at: 303.5, frames: 60, x: 14300 + SHIFT, y: Y + 10, s: 1.08},
  // pull back over the outro row as a recap behind the end card
  {at: 306.7, frames: 60, x: 11500 + SHIFT, y: Y + 60, s: 0.27},
];

// ——— objects ———

const Megaphone = ({size = 160}: {size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M14 40 H30 L74 16 V84 L30 60 H14 Z" fill={VS} stroke={PAPER.ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M30 60 L36 86 H48 L44 64" fill={PAPER.white} stroke={PAPER.ink} strokeWidth={5} strokeLinejoin="round" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${82 + i * 6} ${38 - i * 6} Q${90 + i * 8} 50 ${82 + i * 6} ${62 + i * 6}`} fill="none" stroke={V} strokeWidth={5} strokeLinecap="round" />
    ))}
  </svg>
);

const StreetSign = ({w = 380}: {w?: number}) => (
  <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
    <div style={{width: w, background: "#1f5a3d", border: "5px solid #fff", outline: "3px solid #1f5a3d", borderRadius: 10, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: w * 0.17, letterSpacing: 4, textAlign: "center", padding: "10px 0", boxShadow: "0 16px 24px -12px rgba(0,0,0,0.4)"}}>WALL ST</div>
    <div style={{width: 14, height: 200, background: "#5b6067"}} />
  </div>
);

const Person = ({size = 110, color}: {size?: number; color: string}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx={50} cy={32} r={18} fill={PAPER.white} stroke={PAPER.ink} strokeWidth={5} />
    <path d="M16 92 C16 66 30 56 50 56 C70 56 84 66 84 92 Z" fill={color} stroke={PAPER.ink} strokeWidth={5} strokeLinejoin="round" />
  </svg>
);

const Crown = ({size = 200, k = 1}: {size?: number; k?: number}) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 100 70" style={{filter: "drop-shadow(0 14px 16px rgba(0,0,0,0.25))", transform: `scale(${k})`}}>
    <path d="M8 60 L4 16 L28 36 L50 6 L72 36 L96 16 L92 60 Z" fill="#e2b85c" stroke="#7a5a18" strokeWidth={4} strokeLinejoin="round" />
    <rect x={8} y={56} width={84} height={10} rx={3} fill="#c9962e" stroke="#7a5a18" strokeWidth={3} />
    {[28, 50, 72].map((x) => (
      <circle key={x} cx={x} cy={46} r={5} fill={V} />
    ))}
  </svg>
);

const Throne = ({size = 320}: {size?: number}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{filter: "drop-shadow(0 20px 24px rgba(0,0,0,0.3))"}}>
    <path d="M24 8 Q50 0 76 8 V58 H24 Z" fill={V} stroke={PAPER.ink} strokeWidth={4} strokeLinejoin="round" />
    <rect x={18} y={54} width={64} height={14} rx={4} fill="#e2b85c" stroke={PAPER.ink} strokeWidth={4} />
    <rect x={14} y={36} width={10} height={32} rx={3} fill="#e2b85c" stroke={PAPER.ink} strokeWidth={3.5} />
    <rect x={76} y={36} width={10} height={32} rx={3} fill="#e2b85c" stroke={PAPER.ink} strokeWidth={3.5} />
    <path d="M22 68 L20 94 M78 68 L80 94" stroke={PAPER.ink} strokeWidth={6} strokeLinecap="round" />
  </svg>
);

// A row of ballots that drain away as shares are sold.
const Votes = ({left}: {left: number}) => (
  <div style={{display: "flex", gap: 12}}>
    {Array.from({length: 10}).map((_, i) => {
      const on = i < Math.round(left * 10);
      return (
        <div key={i} style={{width: 54, height: 70, borderRadius: 8, background: on ? V : PAPER.white, border: `3px solid ${on ? V : PAPER.ground2}`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 30, transition: "none"}}>
          {on ? "✓" : ""}
        </div>
      );
    })}
  </div>
);

const Line = ({pts, w, h, k, color, width = 9}: {pts: number[]; w: number; h: number; k: number; color: string; width?: number}) => {
  const d = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * w} ${h - v * h}`).join(" ");
  return (
    <svg width={w} height={h} style={{position: "absolute", left: 0, top: 0, overflow: "visible"}}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
    </svg>
  );
};

const Paycheck = ({w = 360, accent = G}: {w?: number; accent?: string}) => (
  <div style={{width: w, height: w * 0.45, background: "#eef3ea", border: "3px solid #9db59a", boxSizing: "border-box", padding: "16px 22px", fontFamily: SANS, boxShadow: "0 16px 24px -12px rgba(0,0,0,0.3)"}}>
    <div style={{fontWeight: 800, fontSize: w * 0.07, letterSpacing: 3, color: "#3d5a36"}}>PAYCHECK</div>
    <div style={{marginTop: w * 0.06, height: 4, background: "#9db59a"}} />
    <div style={{marginTop: w * 0.06, fontWeight: 800, fontSize: w * 0.11, color: accent}}>$ $ $</div>
  </div>
);

// ——— chapter 4 + outro on the board ———

export const Ch4Board = () => {
  const frame = useCurrentFrame();
  if (frame < sec(CH4[0]) - 40) return null;
  const t = frame / 30;
  const price = interpolate(frame, [sec(263.3), sec(264.6)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const worth = grow(frame, 268.61, 26, Easing.out(Easing.cubic));
  const votesLeft = 1 - 0.7 * grow(frame, 276.45, 26);
  const votesBack = grow(frame, 278.6, 20);
  const chase = interpolate(frame, [sec(291.5), sec(293.2)], [0, 1], CLAMP);
  const slices = Math.floor(interpolate(frame, [sec(295.2), sec(296.8)], [0, 12.99], CLAMP));

  return (
    <div style={{position: "absolute", left: SHIFT, top: 0}}>
      {/* ——— 4a: beyond taxes, two more things ——— */}
      <At x={700} y={Y - 280} k={grow(frame, 241.0, 12) * fade(frame, 247.6, 10)}>
        <Struck text="taxes" k={1} strike={grow(frame, 241.37, 10)} size={90} />
      </At>
      {[0, 1].map((i) => (
        <At key={i} x={760 + i * 520} y={Y + 60} k={pop(frame, 243.65 + i * 0.3)} rot={i ? 4 : -4}>
          <div style={{width: 360, height: 300, background: PAPER.white, boxShadow: "0 22px 40px -14px rgba(40,30,20,0.4)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: SANS}}>
            <div style={{fontWeight: 800, fontSize: 150, color: V, lineHeight: 1}}>{i + 1}</div>
            <div style={{fontWeight: 800, fontSize: 40, color: PAPER.ink, opacity: grow(frame, 248.09 + i * 24.78, 10)}}>{i ? "control" : "PR"}</div>
          </div>
        </At>
      ))}
      <At x={1600} y={Y - 280} k={grow(frame, 244.93, 12)}>
        <div style={{display: "flex", alignItems: "center", gap: 18}}>
          <GrowChart size={90} color={V} />
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 60, color: PAPER.ink, whiteSpace: "nowrap"}}>quietly richer</div>
        </div>
      </At>

      {/* ——— 4b: public relations, Wall Street, the confident CEO ——— */}
      <At x={2400} y={Y - 140} k={pop(frame, 248.83)}>
        <div style={{display: "flex", alignItems: "center", gap: 20}}>
          <Megaphone size={170} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 62, color: V, whiteSpace: "nowrap"}}>public relations</div>
        </div>
      </At>
      <At x={2240} y={Y + 230} k={grow(frame, 252.35, 18)} from="up">
        <StreetSign w={360} />
      </At>
      {[0, 1, 2].map((i) => (
        <At key={i} x={2620 + i * 120} y={Y + 300} k={pop(frame, 253.11 + i * 0.12)}>
          <Person size={120} color={VS} />
        </At>
      ))}
      <At x={2650} y={Y + 420} k={grow(frame, 253.37, 12)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 36, color: PAPER.ink, whiteSpace: "nowrap"}}>everyday investors</div>
      </At>
      {/* the four founders under one quote */}
      {[
        ["footage/broll-rr03-zuckerberg.jpg", "50% 18%"],
        ["footage/broll-rr03-jobs.jpg", "50% 22%"],
        ["footage/broll-rr03-page.jpg", "54% 30%"],
        ["footage/broll-rr03-brin.jpg", "50% 18%"],
      ].map(([src, pos], i) => (
        <At key={i} x={3150 + i * 175} y={Y + 210} k={pop(frame, 250.99 + i * 0.14)} rot={[-5, 3, -2, 5][i]}>
          <PhotoPrint src={src} w={150} h={185} pos={pos} accent={V} zoom={i === 2 ? 1.35 : 1} />
        </At>
      ))}
      <At x={3420} y={Y - 160} k={grow(frame, 254.27, 12)}>
        <div style={{position: "relative", width: 640, background: PAPER.white, borderRadius: 30, padding: "26px 34px", boxSizing: "border-box", boxShadow: "0 22px 40px -14px rgba(40,30,20,0.35)", fontFamily: SANS, fontWeight: 800, fontSize: 44, color: PAPER.ink, lineHeight: 1.15}}>
          “I only make money if the <span style={{color: V}}>stock goes up</span>.”
          <div style={{position: "absolute", bottom: -26, left: 120, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderTop: `30px solid ${PAPER.white}`}} />
        </div>
      </At>

      {/* the quote's condition: a small line that only pays when it rises */}
      <At x={3420} y={Y + 30} k={grow(frame, 256.95, 12)}>
        <div style={{position: "relative", width: 420, height: 90}}>
          <Line pts={[0.1, 0.2, 0.15, 0.4, 0.55, 0.9]} w={420} h={90} k={interpolate(frame, [sec(257.3), sec(259.2)], [0, 1], CLAMP)} color={V} width={7} />
          <div style={{position: "absolute", right: -150, top: -20, fontFamily: SANS, fontWeight: 800, fontSize: 40, color: V, opacity: grow(frame, 258.89, 10), whiteSpace: "nowrap"}}>= paid</div>
        </div>
      </At>

      {/* ——— 4c: investors buy, the price rises, net worth explodes ——— */}
      {[0, 1, 2].map((i) => (
        <At key={`fan-${i}`} x={4000} y={Y - 120 + i * 150} k={pop(frame, 260.0 + i * 0.15)}>
          <div style={{position: "relative"}}>
            <Person size={110} color={VS} />
            <svg style={{position: "absolute", right: -34, top: -16}} width={50} height={50} viewBox="0 0 100 100" opacity={grow(frame, 260.67 + i * 0.12, 10)}>
              <path d="M50 88 C20 66 6 50 6 32 C6 18 17 8 30 8 C40 8 46 14 50 22 C54 14 60 8 70 8 C83 8 94 18 94 32 C94 50 80 66 50 88 Z" fill={V} />
            </svg>
          </div>
        </At>
      ))}
      <At x={4400} y={Y - 300} k={grow(frame, 260.67, 12)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 58, color: PAPER.ink, whiteSpace: "nowrap"}}>
          investors <span style={{color: V}}>love</span> the alignment
        </div>
      </At>
      {Array.from({length: 6}).map((_, i) => {
        const k = grow(frame, 262.13 + i * 0.1, 18, Easing.out(Easing.cubic));
        return (
          <At key={i} x={4080 + k * 300} y={Y - 60 + i * 50} k={k > 0 ? 1 - grow(frame, 263.6 + i * 0.05, 8) : 0} rot={-6 + i * 3} z={3}>
            <div style={{background: V, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 3, padding: "8px 18px", borderRadius: 8}}>BUY</div>
          </At>
        );
      })}
      <At x={4560} y={Y + 140} k={grow(frame, 262.6, 12)}>
        <div style={{position: "relative", width: 640, height: 300}}>
          <div style={{position: "absolute", left: 0, bottom: 0, width: 640, height: 4, background: PAPER.ink}} />
          <Line pts={[0.1, 0.14, 0.12, 0.2, 0.3, 0.42, 0.5, 0.66, 0.82, 1]} w={640} h={300} k={price} color={V} />
          <div style={{position: "absolute", left: 0, bottom: 12, fontFamily: SANS, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: PAPER.inkSoft}}>STOCK PRICE</div>
        </div>
      </At>
      {/* salary bar vs net-worth bar */}
      <At x={5280} y={Y + 80} k={grow(frame, 265.63, 14)}>
        <div style={{position: "relative", width: 420, height: 640, fontFamily: SANS}}>
          <div style={{position: "absolute", left: 0, right: 0, bottom: 70, height: 4, background: PAPER.ink}} />
          <div style={{position: "absolute", left: 30, bottom: 74, width: 140, height: 14 * grow(frame, 271.09, 10), background: G}} />
          <div style={{position: "absolute", left: 30, bottom: 20, width: 140, textAlign: "center", fontWeight: 800, fontSize: 30, color: PAPER.ink, opacity: grow(frame, 271.09, 10)}}>salary</div>
          <div style={{position: "absolute", left: 230, bottom: 74, width: 160, height: 520 * worth, background: V, borderRadius: "12px 12px 0 0", boxShadow: worth > 0.9 ? `0 0 40px ${VS}` : undefined}} />
          <div style={{position: "absolute", left: 210, bottom: 20, width: 200, textAlign: "center", fontWeight: 800, fontSize: 30, color: PAPER.ink, opacity: grow(frame, 268.05, 10)}}>net worth</div>
        </div>
      </At>
      <At x={5220} y={Y - 300} k={grow(frame, 265.99, 12)}>
        <div style={{display: "flex", alignItems: "center", gap: 18}}>
          <Certificate w={120} color={V} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 48, color: PAPER.ink, whiteSpace: "nowrap"}}>millions of shares</div>
        </div>
      </At>

      {/* ——— 4d: control — votes, the throne, spending like a king ——— */}
      <At x={6250} y={Y - 300} k={grow(frame, 273.75, 12)}>
        <div style={{display: "flex", alignItems: "center", gap: 22}}>
          <LogoCard src="logos/rr03-meta.svg" w={240} h={110} pad={22} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 62, color: V, whiteSpace: "nowrap"}}>control</div>
        </div>
      </At>
      <At x={6380} y={Y - 90} k={grow(frame, 275.53, 12)}>
        <div style={{display: "flex", flexDirection: "column", gap: 14}}>
          <Votes left={votesLeft + (1 - votesLeft) * votesBack} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: votesBack > 0.5 ? V : R, whiteSpace: "nowrap"}}>
            {votesBack > 0.5 ? "borrow → keep every vote" : "sell → lose voting power"}
          </div>
        </div>
      </At>
      <At x={6380} y={Y + 300} k={grow(frame, 278.19, 18)} from="up">
        <Throne size={300} />
      </At>
      <At x={6380} y={Y + 150 - 30 * Math.sin(Math.min(1, grow(frame, 280.11, 14)) * Math.PI)} k={pop(frame, 280.11)} z={4}>
        <Crown size={170} />
      </At>
      <At x={7000} y={Y + 300} k={grow(frame, 281.29, 12)}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 56, color: PAPER.ink, whiteSpace: "nowrap"}}>spending like a king</div>
        </div>
      </At>

      {/* ——— outro A: never about humility; the rules of the game ——— */}
      <At x={8350} y={Y + 40} k={grow(frame, 283.1, 18)} from="up" rot={-3}>
        <DollarBill w={560} />
      </At>
      <At x={8350} y={Y - 300} k={grow(frame, 284.4, 12)}>
        <Struck text="humility" k={1} strike={grow(frame, 285.23, 10)} serif size={100} />
      </At>
      <At x={9020} y={Y + 40} k={grow(frame, 286.6, 16)} from="right" rot={3}>
        <TaxBook open={grow(frame, 287.4, 20)} w={460} />
      </At>
      <At x={9020} y={Y + 300} k={grow(frame, 288.51, 12)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 54, color: G, whiteSpace: "nowrap"}}>the rules of the game</div>
      </At>

      {/* ——— outro B: chasing a paycheck, a slice to taxes every month ——— */}
      <At x={10050 + chase * 120} y={Y - 30} k={grow(frame, 290.27, 14)}>
        <Person size={190} color={TONE.tax.soft} />
      </At>
      <At x={10420 + chase * 360} y={Y - 60} k={grow(frame, 292.01, 12)} rot={6}>
        <Paycheck w={320} />
      </At>
      <At x={10260} y={Y - 330} k={grow(frame, 291.55, 12)}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 58, color: PAPER.ink, whiteSpace: "nowrap"}}>chasing a bigger paycheck</div>
      </At>
      <At x={10500} y={Y + 300} k={grow(frame, 293.57, 12)}>
        <div style={{display: "flex", gap: 10, alignItems: "flex-end"}}>
          {Array.from({length: 12}).map((_, i) => (
            <div key={i} style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 6}}>
              <div style={{width: 58, height: 110, background: "#eef3ea", border: "3px solid #9db59a", position: "relative", overflow: "hidden"}}>
                <div style={{position: "absolute", left: 0, right: 0, top: 0, height: i < slices ? "45%" : 0, background: R}} />
              </div>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 20, color: PAPER.inkSoft}}>{"JFMAMJJASOND"[i]}</div>
            </div>
          ))}
        </div>
      </At>
      <At x={10500} y={Y + 470} k={grow(frame, 294.27, 12)}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 42, color: R, whiteSpace: "nowrap"}}>a massive slice to taxes, every month</div>
      </At>

      {/* ——— outro C: the most expensive way to get rich ——— */}
      <At x={12400} y={Y + 20} k={grow(frame, 297.6, 16)} from="up" rot={-2}>
        <div style={{position: "relative"}}>
          <Paycheck w={560} />
          <div style={{position: "absolute", right: -150, top: -70, transform: `rotate(${14 + Math.sin(t * 3) * 3 * (1 - grow(frame, 300, 30))}deg)`, opacity: grow(frame, 299.57, 10)}}>
            <div style={{background: R, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 2, padding: "12px 26px 12px 46px", clipPath: "polygon(14% 0, 100% 0, 100% 100%, 14% 100%, 0 50%)", whiteSpace: "nowrap", boxShadow: "0 14px 20px -10px rgba(0,0,0,0.4)"}}>MOST EXPENSIVE</div>
          </div>
        </div>
      </At>
      <At x={12400} y={Y - 320} k={grow(frame, 298.69, 12)}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 60, color: PAPER.ink, whiteSpace: "nowrap"}}>the most expensive way to get rich</div>
      </At>

      {/* ——— outro D: earn vs own ——— */}
      <At x={13950} y={Y - 40} k={grow(frame, 302.17, 12)}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>
          <Paycheck w={260} />
          <Struck text="what you earn" k={grow(frame, 303.6, 10)} strike={grow(frame, 304.4, 10)} size={66} />
        </div>
      </At>
      <At x={14650} y={Y - 40} k={grow(frame, 305.43, 8)}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>
          <Certificate w={260} color={G} />
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 84, color: G, letterSpacing: -2, whiteSpace: "nowrap", textShadow: `0 0 ${40 * grow(frame, 305.75, 16)}px ${TONE.hook.soft}`}}>what you own</div>
        </div>
      </At>
      <At x={14300} y={Y - 360} k={grow(frame, 302.45, 12)}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 60, color: PAPER.ink, whiteSpace: "nowrap"}}>real wealth is built on…</div>
      </At>
    </div>
  );
};

// ——— end card (screen space) ———

export const EndCard = () => {
  const frame = useCurrentFrame();
  const k = grow(frame, 309.6, 16);
  if (k <= 0) return null;
  const sub = pop(frame, 310.37, 14);
  const click = grow(frame, 311.0, 6) * (1 - grow(frame, 311.3, 8));
  const subbed = frame >= sec(311.15);
  const next = grow(frame, 312.29, 16);
  return (
    <AbsoluteFill style={{background: `rgba(244,240,231,${0.88 * k})`}}>
      <div style={{position: "absolute", left: 130, top: 300, opacity: k, transform: `translateY(${(1 - k) * 30}px)`}}>
        <div style={{display: "flex", alignItems: "center", gap: 34}}>
          <Img src={staticFile("logos/rr-channel.jpg")} style={{width: 150, height: 150, borderRadius: "50%", boxShadow: "0 16px 30px -12px rgba(0,0,0,0.45)", transform: `scale(${0.7 + 0.3 * pop(frame, 309.8, 16)}) rotate(${(1 - grow(frame, 309.8, 20)) * -20}deg)`}} />
          <div style={{fontFamily: SERIF, fontSize: 104, color: PAPER.ink, letterSpacing: -1, lineHeight: 1}}>The Rich Rules</div>
        </div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 38, color: PAPER.inkSoft, marginTop: 18}}>hidden rules of how money actually works</div>
        <div style={{marginTop: 54, transform: `scale(${(0.7 + 0.3 * sub) * (1 - 0.06 * click)})`, transformOrigin: "0% 50%", opacity: sub, display: "inline-flex", alignItems: "center", gap: 18, background: subbed ? PAPER.ink : R, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 48, letterSpacing: 2, padding: "22px 46px", borderRadius: 999, boxShadow: "0 18px 30px -12px rgba(0,0,0,0.35)"}}>
          {subbed ? "SUBSCRIBED ✓" : "SUBSCRIBE"}
        </div>
      </div>
      {/* room for YouTube's end-screen video element (the creator places the real one) */}
      <div style={{position: "absolute", right: 150, top: 300, width: 720, height: 405, borderRadius: 18, border: `4px dashed ${PAPER.inkSoft}`, opacity: next * 0.9, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, background: "rgba(255,253,248,0.6)"}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: PAPER.inkSoft}}>WATCH NEXT</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 62, color: GOLD, letterSpacing: -1}}>Buy, Borrow, Die</div>
      </div>
    </AbsoluteFill>
  );
};

export const Ch4Notes = () => (
  <>
    <Note from={273.7} to={282.0} text="Zuckerberg controls Meta through Class B shares (10 votes each)" />
  </>
);
