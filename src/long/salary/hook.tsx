import React from "react";
import {Easing, interpolate, useCurrentFrame} from "remotion";
import {At, Clap, Clipping, DollarBill, LogoCard, Note, PayStub, PhotoPrint, Stamp, Struck, TickMark} from "./kit";
import {CLAMP, drop, fade, grow, Move2, PAPER, pop, SANS, sec, SERIF, TONE, OVERVIEW_AT} from "./look";

// The hook, 0–40.3 s (projects/en/rr-03/beats.md "Hook storyboard"). One paper board: the four
// founders left to right on the top row, then the $1 bill, the night vault and the tax code
// on the second row. Times are the voice's words (work/rr-03.voice.small.transcript.json).

export const HOOK_END = 40.3;
const G = TONE.hook.accent;

export const HOOK_MOVES: Move2[] = [
  {at: 0, x: 960, y: 540, s: 1.06},
  {at: 0.05, frames: sec(5), x: 980, y: 545, s: 1.0},
  {at: 5.2, frames: 30, x: 2400, y: 540, s: 1.0},
  {at: 8.2, frames: 30, x: 3900, y: 560, s: 1.0},
  {at: 11.55, frames: 40, x: 2470, y: 560, s: 0.42},
  {at: 12.1, frames: sec(2.9), x: 2470, y: 560, s: 0.44},
  {at: 15.0, frames: 34, x: 960, y: 1990, s: 1.0},
  {at: 16.2, frames: sec(4.8), x: 960, y: 2010, s: 1.06},
  {at: 21.1, frames: 34, x: 3000, y: 2000, s: 1.0},
  {at: 26.6, frames: 32, x: 5000, y: 2000, s: 1.0},
  {at: 34.2, frames: 32, x: 7000, y: 2000, s: 1.0},
  {at: 34.3, frames: sec(5.8), x: 7000, y: 2010, s: 1.07},
];

// ——— objects drawn only for the hook ———

const Vault = ({size = 520, spin = 0}: {size?: number; spin?: number}) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))"}}>
    <defs>
      <radialGradient id="vaultMetal" cx="0.38" cy="0.32" r="0.8">
        <stop offset="0" stopColor="#9aa3ad" />
        <stop offset="0.55" stopColor="#5d6670" />
        <stop offset="1" stopColor="#2c3238" />
      </radialGradient>
    </defs>
    <circle cx={100} cy={100} r={96} fill="url(#vaultMetal)" stroke="#20252b" strokeWidth={3} />
    <circle cx={100} cy={100} r={80} fill="none" stroke="#c9d0d6" strokeWidth={1.5} opacity={0.5} />
    {Array.from({length: 16}).map((_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return <circle key={i} cx={100 + 88 * Math.cos(a)} cy={100 + 88 * Math.sin(a)} r={2.6} fill="#c9d0d6" opacity={0.7} />;
    })}
    <g transform={`rotate(${spin} 100 100)`}>
      {[0, 60, 120].map((r) => (
        <rect key={r} x={96} y={34} width={8} height={132} rx={4} fill="#d8b766" transform={`rotate(${r} 100 100)`} />
      ))}
      <circle cx={100} cy={100} r={20} fill="#d8b766" stroke="#8a6d2a" strokeWidth={3} />
    </g>
  </svg>
);

const Jar = ({size = 260, x = 0}: {size?: number; x?: number}) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{overflow: "visible"}}>
    <rect x={22} y={8} width={56} height={14} rx={4} fill="#c9a24a" />
    <rect x={40} y={12} width={20} height={4} rx={2} fill="#3b3120" />
    <path d="M18 26 H82 Q90 26 90 36 V104 Q90 114 80 114 H20 Q10 114 10 104 V36 Q10 26 18 26 Z" fill="rgba(220,235,255,0.14)" stroke="#e8eef5" strokeWidth={3} />
    <rect x={22} y={56} width={56} height={28} rx={4} fill="#f4f0e7" />
    <text x={50} y={75} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={12} letterSpacing={1} fill="#1c1a16">CHARITY</text>
    <circle cx={34} cy={104} r={7} fill="#d8b766" />
    <circle cx={50} cy={106} r={7} fill="#c9a24a" />
    {x > 0 ? (
      <g stroke={PAPER.red} strokeWidth={9} strokeLinecap="round">
        <line x1={0} y1={20} x2={0 + 100 * Math.min(1, x * 2)} y2={20 + 100 * Math.min(1, x * 2)} />
        {x > 0.5 ? <line x1={100} y1={20} x2={100 - 100 * (x * 2 - 1)} y2={20 + 100 * (x * 2 - 1)} /> : null}
      </g>
    ) : null}
  </svg>
);

export const TaxBook = ({open, w = 560}: {open: number; w?: number}) => {
  const h = w * 0.72;
  const page = interpolate(open, [0, 1], [0, 1]);
  return (
    <div style={{position: "relative", width: w, height: h, filter: "drop-shadow(0 28px 34px rgba(40,30,20,0.3))"}}>
      <svg width={w} height={h} viewBox="0 0 280 200" style={{overflow: "visible"}}>
        {/* right page block */}
        <rect x={140} y={10} width={130} height={180} rx={4} fill="#fffdf8" stroke="#d8cfbd" strokeWidth={1.5} />
        {Array.from({length: 11}).map((_, i) => (
          <rect key={i} x={154} y={34 + i * 13} width={i % 4 === 3 ? 60 : 100} height={4} rx={2} fill="#cfc6b3" opacity={page} />
        ))}
        <text x={205} y={26} textAnchor="middle" fontFamily={SERIF} fontSize={10} fill={PAPER.inkSoft} opacity={page}>
          § 1(h) Capital gains
        </text>
        {/* left: the cover swings open around the spine */}
        <g transform={`translate(140 0) scale(${Math.cos(page * Math.PI) || 0.0001} 1) translate(-140 0)`}>
          {page < 0.5 ? (
            <>
              <rect x={140} y={10} width={130} height={180} rx={4} fill="#1f3b2b" />
              <rect x={150} y={20} width={110} height={160} rx={2} fill="none" stroke="#d8b766" strokeWidth={1.5} />
              <text x={205} y={88} textAnchor="middle" fontFamily={SERIF} fontSize={16} letterSpacing={2} fill="#d8b766">U.S.</text>
              <text x={205} y={110} textAnchor="middle" fontFamily={SERIF} fontSize={20} letterSpacing={2} fill="#d8b766">TAX CODE</text>
              <text x={205} y={130} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={8} letterSpacing={2} fill="#d8b766" opacity={0.8}>TITLE 26</text>
            </>
          ) : (
            <>
              <rect x={140} y={10} width={130} height={180} rx={4} fill="#f8f4ea" stroke="#d8cfbd" strokeWidth={1.5} />
              {Array.from({length: 11}).map((_, i) => (
                <rect key={i} x={156} y={34 + i * 13} width={i % 5 === 2 ? 50 : 98} height={4} rx={2} fill="#d6cdb9" />
              ))}
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

const Calculator = ({w = 300, digits}: {w?: number; digits: string}) => (
  <div style={{width: w, height: w * 1.4, background: "#24272b", borderRadius: 28, padding: 22, boxSizing: "border-box", boxShadow: "0 30px 40px -14px rgba(20,20,20,0.5), inset 0 2px 0 rgba(255,255,255,0.1)"}}>
    <div style={{height: w * 0.3, background: "#c9d4c0", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 18px", fontFamily: SANS, fontWeight: 700, fontSize: w * 0.17, color: "#1f2a1c", letterSpacing: 1}}>{digits}</div>
    <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 20}}>
      {["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "%", "="].map((k) => (
        <div key={k} style={{height: w * 0.13, borderRadius: 10, background: k === "=" ? G : "#3a3e44", color: "#f1efe9", fontFamily: SANS, fontWeight: 700, fontSize: w * 0.08, display: "flex", alignItems: "center", justifyContent: "center"}}>{k}</div>
      ))}
    </div>
  </div>
);

// A paycheck that tears in half from the top at `tear` (0..1).
const Paycheck = ({tear, w = 640}: {tear: number; w?: number}) => {
  const h = w * 0.42;
  const half = (side: -1 | 1) => (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: w,
        height: h,
        clipPath: side < 0 ? "polygon(0 0, 52% 0, 48% 20%, 53% 40%, 47% 60%, 52% 80%, 49% 100%, 0 100%)" : "polygon(52% 0, 100% 0, 100% 100%, 49% 100%, 52% 80%, 47% 60%, 53% 40%, 48% 20%)",
        transform: `translate(${side * tear * 90}px, ${tear * 40}px) rotate(${side * tear * 9}deg)`,
        transformOrigin: side < 0 ? "0% 100%" : "100% 100%",
      }}
    >
      <div style={{width: w, height: h, background: "#eef3ea", border: "3px solid #9db59a", boxSizing: "border-box", padding: "26px 34px", fontFamily: SANS}}>
        <div style={{display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 26, letterSpacing: 3, color: "#3d5a36"}}>
          <span>PAYCHECK</span>
          <span style={{fontWeight: 700, color: "#6b8a66"}}>No. 0001</span>
        </div>
        <div style={{marginTop: 34, display: "flex", alignItems: "flex-end", gap: 20}}>
          <span style={{fontWeight: 600, fontSize: 22, color: "#6b8a66"}}>PAY TO THE ORDER OF</span>
          <div style={{flex: 1, borderBottom: "3px solid #9db59a"}} />
        </div>
        <div style={{marginTop: 30, display: "flex", alignItems: "center", gap: 18}}>
          <div style={{flex: 1, borderBottom: "3px solid #9db59a"}} />
          <div style={{border: "3px solid #3d5a36", padding: "6px 16px", fontWeight: 800, fontSize: 34, color: "#3d5a36"}}>$ ———</div>
        </div>
      </div>
    </div>
  );
  return (
    <div style={{position: "relative", width: w, height: h, filter: "drop-shadow(0 24px 30px rgba(40,30,20,0.3))"}}>
      {half(-1)}
      {half(1)}
    </div>
  );
};

const Heart = ({size = 60, k}: {size?: number; k: number}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `scale(${k})`, opacity: Math.min(1, k * 1.5)}}>
    <path d="M50 88 C20 66 6 50 6 32 C6 18 17 8 30 8 C40 8 46 14 50 22 C54 14 60 8 70 8 C83 8 94 18 94 32 C94 50 80 66 50 88 Z" fill={PAPER.red} />
  </svg>
);

// ——— the hook ———

// The night look under the vault (21.1–26.6 s).
export const hookNight = (frame: number) => grow(frame, 21.1, 24) * fade(frame, 26.6, 24);

export const HookNotes = () => <Note from={0.5} to={11.5} text="Zuckerberg: $1 from 2013 · Jobs: from 1997 · Page & Brin: from 2004" />;

// Everything the hook puts on the board (board coordinates; the composition owns the camera).
export const HookBoard = () => {
  const frame = useCurrentFrame();
  if ((frame > sec(HOOK_END) + 60) && frame < sec(OVERVIEW_AT)) return null;
  const t = frame / 30;

  // Rows: the founders (y≈540), then the story (y≈2000).
  const zuckIn = 1;
  const jobsIn = grow(frame, 5.35, 18);
  const pageIn = grow(frame, 9.5, 16);
  const brinIn = grow(frame, 10.3, 16);
  const billFlip = interpolate(frame, [sec(29.95), sec(29.95) + 14], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const digitsAt = Math.floor(interpolate(frame, [sec(35.3), sec(37.2)], [0, 4.99], CLAMP));
  const digits = ["0", "37%", "23.8%", "20%", "0%"][digitsAt];

  return (
    <>
        {/* ——— A: Zuckerberg ——— */}
        <At x={640} y={520} rot={-4} k={zuckIn}>
          <PhotoPrint src="footage/broll-rr03-zuckerberg.jpg" w={400} h={500} pos="50% 18%" name="MARK ZUCKERBERG" nameK={grow(frame, 1.72, 12)} accent={G} />
        </At>
        <At x={505} y={250} k={frame >= sec(0.44) ? 1 : 0} z={5}>
          <Stamp text="2013" at={0.44} color={PAPER.red} size={70} rot={-10} />
        </At>
        <At x={1010} y={300} k={pop(frame, 1.95)} rot={5}>
          <LogoCard src="logos/rr03-facebook.svg" w={150} h={150} pad={30} />
        </At>
        <At x={1300} y={600} k={1} rot={2}>
          <PayStub accent={G} k={grow(frame, 3.54, 8, Easing.out(Easing.back(2)))} />
        </At>

        {/* ——— B: Steve Jobs ——— */}
        <At x={2080} y={520} rot={3} k={jobsIn} from="up">
          <PhotoPrint src="footage/broll-rr03-jobs.jpg" w={400} h={500} pos="50% 22%" name="STEVE JOBS" nameK={grow(frame, 5.7, 12)} accent={G} />
        </At>
        <At x={2450} y={290} k={pop(frame, 6.0)} rot={-4}>
          <LogoCard src="logos/rr03-apple.svg" w={150} h={150} pad={34} />
        </At>
        <At x={2740} y={600} k={grow(frame, 6.42, 16)} from="right" rot={-2}>
          <PayStub accent={G} k={1} tick={grow(frame, 7.4, 14)} />
        </At>

        {/* ——— C: Google's founders ——— */}
        <At x={3900} y={235} k={drop(frame, 8.56, 18)} from="drop">
          <LogoCard src="logos/rr03-google.svg" w={330} h={130} pad={30} />
        </At>
        <At x={3570} y={620} rot={-3} k={pageIn} from="left">
          <PhotoPrint src="footage/broll-rr03-page.jpg" w={330} h={410} pos="54% 30%" zoom={1.35} name="LARRY PAGE" nameK={grow(frame, 9.76, 12)} accent={G} />
        </At>
        <At x={4240} y={620} rot={4} k={brinIn} from="right">
          <PhotoPrint src="footage/broll-rr03-brin.jpg" w={330} h={410} pos="50% 18%" name="SERGEY BRIN" nameK={grow(frame, 10.76, 12)} accent={G} />
        </At>
        <At x={3250} y={960} k={pop(frame, 10.95)} rot={-6} scale={0.62}>
          <PayStub accent={G} k={1} small />
        </At>
        <At x={4500} y={910} k={pop(frame, 11.15)} rot={5} scale={0.62}>
          <PayStub accent={G} k={1} small />
        </At>

        {/* ——— the wide: headlines and applause over all four ——— */}
        <At x={1650} y={150} k={drop(frame, 12.02, 14)} from="drop" rot={-5} scale={1.8} z={6}>
          <Clipping headline="Billionaire CEOs take $1 a year" sub="Founders “work for free”" w={620} />
        </At>
        <At x={3150} y={1010} k={drop(frame, 12.34, 14)} from="drop" rot={4} scale={1.7} z={6}>
          <Clipping headline="The $1 salary club" sub="Applause for humble bosses" w={560} />
        </At>
        {[
          [420, 1000, 13.84, -10],
          [1700, 980, 13.98, 8],
          [3000, 120, 14.1, -6],
          [4500, 260, 14.22, 10],
          [4450, 1040, 14.34, -4],
        ].map(([x, y, at, r], i) => (
          <At key={i} x={x} y={y} k={pop(frame, at, 12)} rot={r} scale={2.0} z={7}>
            <Clap size={130} color={G} k={0.6 + 0.4 * Math.abs(Math.sin((t - at) * 9))} />
          </At>
        ))}

        {/* ——— D: humility, the $1 bill ——— */}
        <At x={960} y={1735} k={grow(frame, 16.4, 14)} from="up">
          <Struck text="humility." k={1} serif size={128} />
        </At>
        <At x={960} y={1990} k={grow(frame, 15.2, 20)} from="up" rot={-2}>
          <DollarBill w={700} glow={grow(frame, 16.5, 20) * (0.6 + 0.4 * Math.sin(t * 2.4))} />
        </At>
        <At x={1300} y={1900} k={drop(frame, 18.5, 18)} from="drop" rot={14 + Math.sin(t * 3) * 4 * grow(frame, 18.5, 30)}>
          <div style={{background: G, color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 54, letterSpacing: 3, padding: "12px 34px 12px 54px", borderRadius: "10px 10px 10px 10px", clipPath: "polygon(16% 0, 100% 0, 100% 100%, 16% 100%, 0 50%)", boxShadow: "0 16px 24px -10px rgba(0,0,0,0.4)"}}>FREE</div>
        </At>
        {[
          ["logos/rr03-facebook.svg", 760, 120, 120, 26],
          ["logos/rr03-apple.svg", 960, 120, 120, 28],
          ["logos/rr03-google.svg", 1180, 230, 100, 22],
        ].map(([src, x, w, h, pad], i) => (
          <React.Fragment key={i}>
            <At x={x as number} y={2310} k={pop(frame, 19.3 + i * 0.12)}>
              <LogoCard src={src as string} w={w as number} h={h as number} pad={pad as number} />
            </At>
            <At x={(x as number) + 10} y={2225} k={1} z={4}>
              <Heart k={pop(frame, 19.6 + i * 0.14, 12)} size={64} />
            </At>
          </React.Fragment>
        ))}

        {/* ——— E: night — ultra-high-net-worth, no charity ——— */}
        <At x={2700} y={2000} k={grow(frame, 21.35, 26)} from="right">
          <Vault size={560} spin={interpolate(frame, [sec(21.35), sec(23.2)], [-160, 0], {...CLAMP, easing: Easing.out(Easing.cubic)})} />
        </At>
        <At x={3330} y={1830} k={grow(frame, 22.21, 12)}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 66, color: "#f4f0e7", letterSpacing: -1, whiteSpace: "nowrap"}}>ultra-high-net-worth</div>
        </At>
        <At x={3330} y={1915} k={grow(frame, 23.0, 12)}>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: "#b9b2a4", whiteSpace: "nowrap"}}>finance</div>
        </At>
        <At x={3200} y={2150} k={pop(frame, 24.4)}>
          <Jar size={190} x={grow(frame, 25.89, 14)} />
        </At>
        <At x={3480} y={2160} k={grow(frame, 25.0, 12)}>
          <div style={{transform: "translateX(50%)"}}>
            <Struck text="charity" k={1} strike={grow(frame, 25.89, 12)} size={84} color="#f4f0e7" />
          </div>
        </At>

        {/* ——— F: not a sacrifice — the tax code ——— */}
        <At x={4620} y={2000} k={grow(frame, 26.8, 20)} from="up" rot={-3}>
          <div style={{transform: `scaleX(${Math.max(0.001, Math.abs(Math.cos(billFlip * Math.PI)))})`}}>
            {billFlip < 0.5 ? (
              <DollarBill w={620} />
            ) : (
              <TaxBook open={grow(frame, 30.6, 22)} w={560} />
            )}
          </div>
        </At>
        <At x={5150} y={1780} k={grow(frame, 27.31, 10)}>
          <div style={{transform: "translateX(50%)", fontFamily: SANS, fontWeight: 800, fontSize: 120, color: G, letterSpacing: -4}}>$1</div>
        </At>
        <At x={5160} y={1930} k={grow(frame, 28.9, 10) * fade(frame, 30.2, 12)}>
          <div style={{transform: "translateX(50%)"}}>
            <Struck text="sacrifice" k={1} strike={grow(frame, 29.35, 10)} size={96} />
          </div>
        </At>
        {[
          ["smartest", 30.55],
          ["most aggressive", 31.43],
          ["in the tax code", 33.17],
        ].map(([w, at], i) => (
          <At key={w as string} x={5060} y={1930 + i * 100} k={grow(frame, at as number, 12)}>
            <div style={{transform: "translateX(50%)", display: "flex", alignItems: "center", gap: 22, whiteSpace: "nowrap"}}>
              <TickMark k={grow(frame, (at as number) + 0.1, 14)} color={G} size={64} />
              <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 64, color: PAPER.ink, letterSpacing: -1}}>{w}</span>
            </div>
          </At>
        ))}

        {/* ——— G: the math, and the paycheck the rich don't want ——— */}
        <At x={6560} y={2010} k={grow(frame, 34.4, 18)} from="up" rot={-4}>
          <Calculator w={300} digits={digits} />
        </At>
        <At x={6560} y={1640} k={grow(frame, 35.35, 12)}>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 70, color: PAPER.ink, whiteSpace: "nowrap"}}>the math</div>
        </At>
        <At x={7330} y={2040} k={grow(frame, 37.55, 16)} from="right" rot={3}>
          <Paycheck w={620} tear={grow(frame, 38.97, 16, Easing.out(Easing.quad))} />
        </At>
        <At x={7330} y={1760} k={grow(frame, 37.59, 12)}>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 70, color: PAPER.ink, letterSpacing: -1, whiteSpace: "nowrap"}}>
            the rich don’t want a <span style={{color: PAPER.red}}>paycheck</span>
          </div>
        </At>
    </>
  );
};
