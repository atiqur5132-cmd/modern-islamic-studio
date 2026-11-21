import {Easing, interpolate, useCurrentFrame} from "remotion";
import {PersonIcon} from "./icons";
import {CLAMP, grow, Palette, SANS, sec} from "./look";

// Animated graphs. Every one draws or grows on the spoken word that names it.

const ease = (frame: number, a: number, b: number, e = Easing.inOut(Easing.cubic)) => interpolate(frame, [sec(a), sec(b)], [0, 1], {...CLAMP, easing: e});

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
};

// A pie that fills to 100% (`fillAt`), then a slice (`slice`, 0..1) lifts out at `cutAt`.
export const Pie = ({pal, r = 170, fillAt, cutAt, slice = 0.03, sliceLabel}: {pal: Palette; r?: number; fillAt: number; cutAt: number; slice?: number; sliceLabel?: string}) => {
  const frame = useCurrentFrame();
  const fill = ease(frame, fillAt, fillAt + 1.0);
  const cut = ease(frame, cutAt, cutAt + 0.6, Easing.out(Easing.back(1.4)));
  const sliceA = Math.PI * 2 * Math.max(slice, 0.06); // drawn a little wider so it reads
  const body = Math.PI * 2 * fill;
  const mid = sliceA / 2;
  const off = cut * 70;
  const size = r * 2 + 200;
  const c = size / 2;
  return (
    <svg width={size} height={size} style={{overflow: "visible"}}>
      <circle cx={c} cy={c} r={r} fill={pal.soft} opacity={0.5} />
      {fill > 0 ? <path d={arc(c, c, r, sliceA * Math.min(1, cut * 5), Math.max(sliceA * Math.min(1, cut * 5) + 0.001, body))} fill={pal.accent} /> : null}
      {cut > 0 ? (
        <g transform={`translate(${off * Math.sin(mid)} ${-off * Math.cos(mid)})`}>
          <path d={arc(c, c, r, 0, sliceA)} fill={pal.ink} />
          {sliceLabel ? (
            <text x={c + (r + 60) * Math.sin(mid) + 30} y={c - (r + 30) * Math.cos(mid)} fontFamily={SANS} fontWeight={800} fontSize={58} fill={pal.ink} opacity={cut}>
              {sliceLabel}
            </text>
          ) : null}
        </g>
      ) : null}
    </svg>
  );
};

// A half-dial gauge from `min` to `max`, with a highlighted band and a needle value over time.
export const Gauge = ({pal, value, min = 0, max = 50, band, ticks = [0, 10, 20, 30, 40, 50], unit = "%"}: {pal: Palette; value: number; min?: number; max?: number; band?: [number, number]; ticks?: number[]; unit?: string}) => {
  const W = 620;
  const cx = W / 2;
  const cy = 330;
  const R = 260;
  const ang = (v: number) => -Math.PI / 2 + ((v - min) / (max - min)) * Math.PI;
  const pt = (v: number, r: number) => [cx + r * Math.sin(ang(v)), cy - r * Math.cos(ang(v))];
  const bandPath = (a: number, b: number, r0: number, r1: number) => {
    const [x0, y0] = pt(a, r1);
    const [x1, y1] = pt(b, r1);
    const [x2, y2] = pt(b, r0);
    const [x3, y3] = pt(a, r0);
    return `M ${x0} ${y0} A ${r1} ${r1} 0 0 1 ${x1} ${y1} L ${x2} ${y2} A ${r0} ${r0} 0 0 0 ${x3} ${y3} Z`;
  };
  const [nx, ny] = pt(value, R - 50);
  return (
    <svg width={W} height={400} style={{overflow: "visible"}}>
      <path d={bandPath(min, max, R - 40, R)} fill={pal.soft} />
      {band ? <path d={bandPath(band[0], band[1], R - 40, R)} fill={pal.accent} /> : null}
      {ticks.map((t) => {
        const [x, y] = pt(t, R + 34);
        return (
          <text key={t} x={x} y={y + 12} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={30} fill={pal.inkSoft}>
            {t}
            {unit}
          </text>
        );
      })}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={pal.ink} strokeWidth={12} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={22} fill={pal.ink} />
    </svg>
  );
};

// The $2,000-at-24% example, paying only the minimum (1% of balance + the month's interest,
// $25 floor). Computed here, so the picture is the real arithmetic.
const debt = (() => {
  let b = 2000;
  let paidInterest = 0;
  const pts: {m: number; b: number; i: number}[] = [{m: 0, b, i: 0}];
  let m = 0;
  while (b > 0.01 && m < 400) {
    const it = (b * 0.24) / 12;
    const pay = Math.min(Math.max(25, it + 0.01 * b), b + it);
    paidInterest += it;
    b = b + it - pay;
    m++;
    pts.push({m, b: Math.max(0, b), i: paidInterest});
  }
  return {pts, months: m, interest: paidInterest};
})();
export const DEBT = {months: debt.months, interest: debt.interest};

export const DebtChart = ({pal, lineFrom, lineTo, interestFrom, interestTo}: {pal: Palette; lineFrom: number; lineTo: number; interestFrom: number; interestTo: number}) => {
  const frame = useCurrentFrame();
  const W = 1300;
  const Hh = 560;
  const yMax = 3000;
  const xOf = (m: number) => 90 + (m / 156) * (W - 140);
  const yOf = (v: number) => Hh - 60 - (v / yMax) * (Hh - 110);
  const kLine = ease(frame, lineFrom, lineTo, Easing.inOut(Easing.quad));
  const kInt = ease(frame, interestFrom, interestTo, Easing.inOut(Easing.quad));
  const nLine = Math.max(1, Math.round(kLine * (debt.pts.length - 1)));
  const nInt = Math.max(1, Math.round(kInt * (debt.pts.length - 1)));
  const balPts = debt.pts.slice(0, nLine + 1);
  const intPts = debt.pts.slice(0, nInt + 1);
  const balD = balPts.map((p, i) => `${i ? "L" : "M"} ${xOf(p.m)} ${yOf(p.b)}`).join(" ");
  const intD = intPts.map((p, i) => `${i ? "L" : "M"} ${xOf(p.m)} ${yOf(p.i)}`).join(" ") + ` L ${xOf(intPts[intPts.length - 1].m)} ${yOf(0)} L ${xOf(0)} ${yOf(0)} Z`;
  const years = [0, 2, 4, 6, 8, 10, 12];
  const lastI = intPts[intPts.length - 1];
  return (
    <svg width={W} height={Hh} style={{overflow: "visible", fontFamily: SANS}}>
      {[0, 1000, 2000, 3000].map((v) => (
        <g key={v}>
          <line x1={90} x2={W - 40} y1={yOf(v)} y2={yOf(v)} stroke={pal.ink} strokeOpacity={0.1} strokeWidth={2} />
          <text x={74} y={yOf(v) + 10} textAnchor="end" fontSize={26} fontWeight={700} fill={pal.inkSoft}>
            ${v / 1000}k
          </text>
        </g>
      ))}
      {years.map((y) => (
        <text key={y} x={xOf(y * 12)} y={Hh - 18} textAnchor="middle" fontSize={26} fontWeight={700} fill={pal.inkSoft} opacity={grow(frame, lineFrom - 1.5, 14)}>
          {y === 0 ? "start" : `${y} yr`}
        </text>
      ))}
      {kInt > 0 ? <path d={intD} fill={pal.accent} opacity={0.85} /> : null}
      <path d={balD} fill="none" stroke={pal.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      {kInt > 0.02 ? (
        <text x={xOf(lastI.m) - 12} y={yOf(lastI.i) - 22} textAnchor="end" fontSize={52} fontWeight={800} fill={pal.accent}>
          ${Math.round(lastI.i).toLocaleString("en-US")} interest
        </text>
      ) : null}
    </svg>
  );
};

// A waterfall: steps of +/- values landing on their words, ending in a total bar.
export const Waterfall = ({pal, steps}: {pal: Palette; steps: {label: string; value: number; at: number; total?: boolean}[]}) => {
  const frame = useCurrentFrame();
  const scale = 0.62;
  const zero = 120;
  let run = 0;
  return (
    <svg width={1100} height={520} style={{overflow: "visible", fontFamily: SANS}}>
      <line x1={0} x2={1100} y1={zero} y2={zero} stroke={pal.ink} strokeOpacity={0.25} strokeWidth={3} />
      {steps.map((s, i) => {
        const k = grow(frame, s.at, 16, Easing.out(Easing.cubic));
        const start = s.total ? 0 : run;
        const end = s.total ? run : run + s.value;
        if (!s.total) run += s.value;
        const top = zero - Math.max(start, start + (end - start) * k) * scale;
        const bot = zero - Math.min(start, start + (end - start) * k) * scale;
        const x = 80 + i * 330;
        const neg = (s.total ? end : s.value) < 0;
        return (
          <g key={i} opacity={k > 0 ? 1 : 0}>
            <rect x={x} y={top} width={190} height={Math.max(2, bot - top)} rx={8} fill={s.total ? pal.ink : neg ? pal.accent : pal.soft} stroke={pal.ink} strokeWidth={s.total ? 0 : 3} />
            <text x={x + 95} y={neg ? bot + 62 : top - 22} textAnchor="middle" fontSize={56} fontWeight={800} fill={s.total ? pal.ink : neg ? pal.accent : pal.ink} opacity={k}>
              {s.value < 0 ? "−" : "+"}${Math.abs(s.total ? end : s.value)}
            </text>
            <text x={x + 95} y={zero - 30} textAnchor="middle" fontSize={30} fontWeight={700} fill={pal.inkSoft} opacity={k}>
              {s.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Two bars side by side (e.g. cash vs card).
export const BarPair = ({pal, a, b, at, labels, heights}: {pal: Palette; a: number; b: number; at: [number, number]; labels: [string, string]; heights: [number, number]}) => {
  const frame = useCurrentFrame();
  const k1 = grow(frame, at[0], 24, Easing.out(Easing.cubic));
  const k2 = grow(frame, at[1], 30, Easing.out(Easing.cubic));
  const base = 460;
  return (
    <svg width={620} height={520} style={{overflow: "visible", fontFamily: SANS}}>
      <line x1={0} x2={620} y1={base} y2={base} stroke={pal.ink} strokeOpacity={0.3} strokeWidth={3} />
      <rect x={70} y={base - heights[0] * k1} width={190} height={heights[0] * k1} rx={10} fill={pal.soft} stroke={pal.ink} strokeWidth={3} />
      <rect x={360} y={base - heights[1] * k2} width={190} height={heights[1] * k2} rx={10} fill={pal.accent} />
      <text x={165} y={base + 50} textAnchor="middle" fontSize={34} fontWeight={800} fill={pal.ink} opacity={k1}>
        {labels[0]}
      </text>
      <text x={455} y={base + 50} textAnchor="middle" fontSize={34} fontWeight={800} fill={pal.ink} opacity={k2}>
        {labels[1]}
      </text>
      <text x={0} y={0} opacity={0}>
        {a + b}
      </text>
    </svg>
  );
};

// A 10×10 grid of people; the listed indices turn the accent colour at `turnAt`.
export const PeopleGrid = ({pal, at, turnAt, turn, base}: {pal: Palette; at: number; turnAt: number; turn: number[]; base: string}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: "grid", gridTemplateColumns: "repeat(10, 52px)", gap: 8}}>
      {Array.from({length: 100}).map((_, i) => {
        const k = grow(frame, at + (i % 10) * 0.03 + Math.floor(i / 10) * 0.03, 8);
        const hot = turn.includes(i) ? grow(frame, turnAt + turn.indexOf(i) * 0.1, 8) : 0;
        return (
          <div key={i} style={{opacity: k, transform: `scale(${0.6 + 0.4 * k + hot * 0.25})`}}>
            <PersonIcon size={52} color={hot > 0.5 ? pal.accent : base} />
          </div>
        );
      })}
    </div>
  );
};

// A balance scale that tips by `tilt` (-1 left down … 1 right down).
export const Scale = ({pal, tilt, left, right}: {pal: Palette; tilt: number; left: React.ReactNode; right: React.ReactNode}) => {
  const a = tilt * 14;
  const dy = Math.sin((a * Math.PI) / 180) * 260;
  return (
    <div style={{position: "relative", width: 640, height: 460}}>
      <svg width={640} height={460} style={{position: "absolute", inset: 0, overflow: "visible"}}>
        <path d="M300 440 L340 440 L328 120 L312 120 Z" fill={pal.ink} />
        <rect x={250} y={436} width={140} height={16} rx={6} fill={pal.ink} />
        <g transform={`rotate(${a} 320 120)`}>
          <rect x={50} y={112} width={540} height={14} rx={7} fill={pal.ink} />
        </g>
        <circle cx={320} cy={120} r={16} fill={pal.accent} />
        <path d={`M60 ${120 - dy} L20 ${250 - dy} M60 ${120 - dy} L100 ${250 - dy}`} stroke={pal.ink} strokeWidth={3} />
        <path d={`M580 ${120 + dy} L540 ${250 + dy} M580 ${120 + dy} L620 ${250 + dy}`} stroke={pal.ink} strokeWidth={3} />
        <path d={`M0 ${250 - dy} H120 Q110 ${290 - dy} 60 ${290 - dy} Q10 ${290 - dy} 0 ${250 - dy} Z`} fill={pal.soft} stroke={pal.ink} strokeWidth={3} />
        <path d={`M520 ${250 + dy} H640 Q630 ${290 + dy} 580 ${290 + dy} Q530 ${290 + dy} 520 ${250 + dy} Z`} fill={pal.soft} stroke={pal.ink} strokeWidth={3} />
      </svg>
      <div style={{position: "absolute", left: 60, top: 250 - dy, transform: "translate(-50%, -100%)"}}>{left}</div>
      <div style={{position: "absolute", left: 580, top: 250 + dy, transform: "translate(-50%, -100%)"}}>{right}</div>
    </div>
  );
};

// A rounded progress bar filling 0..1.
export const Progress = ({pal, k, width = 760, label}: {pal: Palette; k: number; width?: number; label?: string}) => (
  <div style={{width, fontFamily: SANS}}>
    <div style={{height: 46, borderRadius: 23, background: pal.soft, overflow: "hidden", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.12)"}}>
      <div style={{width: `${k * 100}%`, height: "100%", borderRadius: 23, background: pal.accent}} />
    </div>
    {label ? <div style={{marginTop: 14, fontSize: 34, fontWeight: 700, color: pal.inkSoft}}>{label}</div> : null}
  </div>
);

// A vertical "pain" meter, 0..1, with a label under it.
export const Meter = ({pal, k, label, hot}: {pal: Palette; k: number; label: string; hot: string}) => (
  <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 16, fontFamily: SANS}}>
    <div style={{width: 90, height: 380, borderRadius: 45, background: pal.soft, position: "relative", overflow: "hidden", boxShadow: "inset 0 3px 8px rgba(0,0,0,0.12)"}}>
      <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: `${k * 100}%`, background: `linear-gradient(0deg, ${pal.accent}, ${hot})`, borderRadius: 45}} />
    </div>
    <div style={{fontSize: 36, fontWeight: 800, color: pal.ink}}>{label}</div>
  </div>
);
