import {loadFont as loadMono} from "@remotion/google-fonts/IBMPlexMono";
import {Easing, interpolate, useCurrentFrame} from "remotion";
import {CLAMP, LOOK, sec} from "./look";

const MONO = loadMono("normal", {weights: ["400", "600"], subsets: ["latin"]}).fontFamily;

// The video's signature (beats.md, option 3): a till receipt in the top-right corner that
// keeps printing. Every hidden cost the voice names prints as a coral line, and the
// bottom line "paid over the cash price" climbs. On "zoom in on your receipt" it comes to
// the centre of the screen. The last line prints "your future freedom".

type Row = {at: number; label: string; value: string; cost?: boolean; rule?: boolean};

// Times are the spoken word that names each line (work/finance-vo.words.txt).
const ROWS: Row[] = [
  {at: 8.0, label: "Phone", value: "$1,200"},
  {at: 21.2, label: "No-Cost EMI ×12", value: "$100/mo"},
  {at: 24.9, label: "Interest", value: "$0.00"},
  {at: 126.2, label: "hidden", value: "", rule: true},
  {at: 148.4, label: "Discount you gave up", value: "$100", cost: true},
  {at: 165.8, label: "Tax on interest*", value: "$18", cost: true},
  {at: 170.1, label: "Processing fee*", value: "$5", cost: true},
  {at: 187.6, label: "Credit limit locked", value: "$1,200", cost: true},
  {at: 255.9, label: "The upgrade", value: "+$480", cost: true},
  {at: 281.1, label: "Paycheck spoken for", value: "40%", cost: true},
];

// The bottom line: what you paid over the cash price (illustration from the script's numbers).
const OVER: [number, string][] = [
  [8.0, "$0"],
  [148.4, "$100"],
  [165.8, "$118"],
  [170.1, "$123"],
];

const ROW_H = 40;
const WIDTH = 380;

export const Receipt = () => {
  const frame = useCurrentFrame();
  if (frame < sec(7.6)) return null;
  const shown = ROWS.filter((r) => frame >= sec(r.at));
  // Paper feeds out smoothly as each row prints.
  const feed = ROWS.reduce((h, r) => h + interpolate(frame, [sec(r.at), sec(r.at) + 10], [0, r.rule ? 30 : ROW_H], {...CLAMP, easing: Easing.out(Easing.cubic)}), 0);
  const over = [...OVER].reverse().find(([t]) => frame >= sec(t))?.[1] ?? "$0";
  const overBump = OVER.reduce((m, [t]) => Math.max(m, interpolate(frame, [sec(t), sec(t) + 4, sec(t) + 14], [0, 1, 0], CLAMP)), 0);
  const final = frame >= sec(368.1);

  // Enter by sliding down out of the "printer slot"; zoom to centre for 122.9–127.6 s.
  const enter = interpolate(frame, [sec(7.6), sec(7.6) + 16], [-1, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const zoom = interpolate(frame, [sec(122.8), sec(122.8) + 22, sec(127.6), sec(127.6) + 18], [0, 1, 1, 0], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const z = zoom;
  const height = 150 + feed + 74;
  const cornerX = 1920 - 70 - WIDTH;
  const cornerY = 40;
  const centreX = 960 - WIDTH * 0.9;
  const centreY = 540 - height * 0.9;
  const x = cornerX + (centreX - cornerX) * z;
  const y = cornerY + (centreY - cornerY) * z + enter * (height + 60);
  const drift = interpolate(frame, [sec(122.8), sec(127.6)], [0, 0.06], CLAMP);
  const s = 0.78 + (1.02 + drift) * z;

  let cursor = 132;
  return (
    <svg width={1920} height={1080} style={{position: "absolute", left: 0, top: 0}}>
      {/* Board dims while the receipt is the hero. */}
      <rect width={1920} height={1080} fill={LOOK.ground} opacity={0.55 * z} />
      <g transform={`translate(${x} ${y}) scale(${s}) rotate(${-1.4 * (1 - z)} 0 0)`}>
        {/* Soft shadow, then paper with a torn bottom edge. */}
        <rect x={6} y={10} width={WIDTH} height={height} fill="#000" opacity={0.25} rx={2} />
        <path d={paper(height)} fill="#ebe5d6" />
        <text x={WIDTH / 2} y={52} textAnchor="middle" fontFamily={MONO} fontWeight={600} fontSize={24} fill="#2b2925" letterSpacing={3}>RECEIPT</text>
        <text x={WIDTH / 2} y={84} textAnchor="middle" fontFamily={MONO} fontSize={17} fill="#6f695f">No-Cost EMI · 12 months</text>
        <line x1={24} y1={104} x2={WIDTH - 24} y2={104} stroke="#6f695f" strokeWidth={1.5} strokeDasharray="5 5" />
        {shown.map((r) => {
          const ink = r.cost ? "#c4533f" : "#2b2925";
          const yy = cursor;
          cursor += r.rule ? 30 : ROW_H;
          const o = interpolate(frame, [sec(r.at), sec(r.at) + 6], [0, 1], CLAMP);
          if (r.rule) {
            return (
              <g key={r.label} opacity={o}>
                <line x1={24} y1={yy - 4} x2={WIDTH - 24} y2={yy - 4} stroke="#c4533f" strokeWidth={1.5} strokeDasharray="5 5" />
                <text x={WIDTH / 2} y={yy + 2} textAnchor="middle" fontFamily={MONO} fontSize={15} fill="#c4533f" style={{paintOrder: "stroke"}} stroke="#ebe5d6" strokeWidth={8}>HIDDEN</text>
              </g>
            );
          }
          return (
            <g key={r.label} opacity={o}>
              <text x={24} y={yy} fontFamily={MONO} fontSize={19} fill={ink}>{r.label}</text>
              <text x={WIDTH - 24} y={yy} textAnchor="end" fontFamily={MONO} fontWeight={600} fontSize={19} fill={ink}>{r.value}</text>
            </g>
          );
        })}
        <line x1={24} y1={cursor - 18} x2={WIDTH - 24} y2={cursor - 18} stroke="#2b2925" strokeWidth={1.5} />
        {final ? (
          <g opacity={interpolate(frame, [sec(368.1), sec(368.1) + 10], [0, 1], CLAMP)}>
            <text x={24} y={cursor + 14} fontFamily={MONO} fontWeight={600} fontSize={19} fill="#c4533f">TOTAL</text>
            <text x={WIDTH - 24} y={cursor + 14} textAnchor="end" fontFamily={MONO} fontWeight={600} fontSize={19} fill="#c4533f">your future freedom</text>
          </g>
        ) : (
          <g>
            <text x={24} y={cursor + 14} fontFamily={MONO} fontSize={17} fill="#2b2925">Paid over cash price</text>
            <text x={WIDTH - 24} y={cursor + 14} textAnchor="end" fontFamily={MONO} fontWeight={600} fontSize={22 + overBump * 4} fill={over === "$0" ? "#2b2925" : "#c4533f"}>{over}</text>
          </g>
        )}
        <text x={24} y={cursor + 44} fontFamily={MONO} fontSize={13} fill="#8a8377">*illustration · varies by bank and country</text>
      </g>
    </svg>
  );
};

// The paper outline: straight top under the printer, a zig-zag torn bottom.
const paper = (h: number) => {
  let d = `M0,0 L${WIDTH},0 L${WIDTH},${h}`;
  const teeth = 19;
  for (let i = teeth; i >= 0; i--) d += ` L${(WIDTH / teeth) * i},${h + (i % 2 === 0 ? 0 : 9)}`;
  return d + " Z";
};
