import {Easing, interpolate, useCurrentFrame} from "remotion";
import {ARABIC_FONT, GOLD, IVORY, LATIN_FONT} from "../../theme";
import {modernYa, palindromeWords, withoutMarks} from "./arabic";
import {Cue, rise} from "./common";
import {Stage} from "./Stage";

const LIGHT = "#FFF4DA";
const LABEL_Y = 700;
const LEFT_X = 280;
const RIGHT_X = 800;
const PANEL_W = 420;
const WORD_Y = 880; // baseline of the bare phrase
const WAVE_ROWS = [820, 940];
const BAR_W = 4;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ease = Easing.inOut(Easing.sin);

const Label = ({x, text}: {x: number; text: string}) => (
  <div
    style={{
      position: "absolute",
      top: LABEL_Y,
      left: x - 200,
      width: 400,
      textAlign: "center",
      fontFamily: LATIN_FONT,
      fontWeight: 800,
      fontSize: 40,
      letterSpacing: 8,
      color: IVORY,
    }}
  >
    {text}
  </div>
);

const Verdict = ({x, ok, text, shown}: {x: number; ok: boolean; text: string; shown: number}) => (
  <div
    style={{
      position: "absolute",
      top: 1000,
      left: x - 220,
      width: 440,
      textAlign: "center",
      fontFamily: LATIN_FONT,
      fontWeight: 900,
      fontSize: 52,
      color: ok ? GOLD : IVORY,
      opacity: shown,
      transform: `scale(${0.85 + 0.15 * shown})`,
      textShadow: ok ? `0 0 30px ${GOLD}66` : "none",
    }}
  >
    {ok ? "✓ " : "✗ "}
    {text.toUpperCase()}
  </div>
);

// G5. Writing against sound. Left: the bare phrase read right to left, then left
// to right; the same letters either way. Right: the creator's own recitation of
// the phrase in this video, played and then played backwards; a different sound.
export const Split = ({
  ayah,
  tag,
  left,
  right,
  waveform,
  leftAt,
  rightAt,
  cue,
}: {
  ayah: string;
  tag: string;
  left: string;
  right: string;
  waveform: number[];
  leftAt: number;
  rightAt: number;
  cue: Cue;
}) => {
  const frame = useCurrentFrame();
  const bare = modernYa(withoutMarks(palindromeWords(ayah).join(" ")));
  const leftVerdict = cue(leftAt);
  const rightVerdict = cue(rightAt);
  // Read right to left (gold fills from the right), then back left to right.
  const readRtl = interpolate(frame, [6, leftVerdict * 0.5], [0, 1], {...clamp, easing: ease});
  const readLtr = interpolate(frame, [leftVerdict * 0.5, leftVerdict - 4], [0, 1], {...clamp, easing: ease});
  const play = interpolate(frame, [10, rightVerdict * 0.55], [0, 1], clamp);
  const playBack = interpolate(frame, [rightVerdict * 0.55, rightVerdict - 4], [0, 1], clamp);
  const reversed = [...waveform].reverse();
  const step = PANEL_W / waveform.length;
  const wordLeft = LEFT_X - PANEL_W / 2;

  return (
    <Stage tag={tag} light={{x: 540, y: 880}}>
      <svg width={1080} height={1920} style={{position: "absolute"}}>
        <defs>
          <clipPath id="read-rtl">
            <rect x={wordLeft + PANEL_W * (1 - readRtl)} y={600} width={PANEL_W * readRtl + 40} height={500} />
          </clipPath>
          <filter id="split-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={10} />
          </filter>
        </defs>
        {/* The divide between the two, a line of light. */}
        <line x1={540} x2={540} y1={690} y2={1070} stroke={LIGHT} strokeWidth={2} opacity={0.35 * rise(frame, 0, 16)} />

        {/* LIKHAWAT: the letters, read one way then the other. */}
        <g opacity={rise(frame, 2, 14)}>
          <text x={LEFT_X} y={WORD_Y} textAnchor="middle" direction="rtl" fontFamily={ARABIC_FONT} fontSize={96} fill={IVORY} opacity={0.45}>
            {bare}
          </text>
          <text x={LEFT_X} y={WORD_Y} textAnchor="middle" direction="rtl" fontFamily={ARABIC_FONT} fontSize={96} fill={GOLD} clipPath="url(#read-rtl)">
            {bare}
          </text>
          {readLtr > 0 && readLtr < 1 ? (
            <rect x={wordLeft + PANEL_W * readLtr - 6} y={WORD_Y - 120} width={12} height={170} fill={LIGHT} filter="url(#split-glow)" opacity={0.9} />
          ) : null}
          {/* Arrows: the two directions of reading. */}
          <text x={LEFT_X} y={WORD_Y + 70} textAnchor="middle" fontFamily={LATIN_FONT} fontSize={34} fontWeight={700} fill={GOLD} opacity={readRtl > 0.1 ? 0.9 : 0}>
            {readLtr > 0 ? "← →" : "←"}
          </text>
        </g>

        {/* AWAAZ: the recitation, played forward, then backwards. */}
        <g opacity={rise(frame, 8, 14)}>
          {[waveform, reversed].map((values, row) => {
            const head = row === 0 ? play : playBack;
            return values.map((v, i) => {
              const h = 8 + v * 86;
              const passed = i / values.length < head;
              return (
                <rect
                  key={`${row}-${i}`}
                  x={RIGHT_X - PANEL_W / 2 + i * step}
                  y={WAVE_ROWS[row] - h / 2}
                  width={BAR_W}
                  height={h}
                  rx={2}
                  fill={passed && row === 0 ? GOLD : IVORY}
                  opacity={passed ? 1 : 0.22}
                />
              );
            });
          })}
          {[play, playBack].map((head, row) =>
            head > 0 && head < 1 ? (
              <rect
                key={row}
                x={RIGHT_X - PANEL_W / 2 + PANEL_W * head - 2}
                y={WAVE_ROWS[row] - 60}
                width={4}
                height={120}
                fill={LIGHT}
                filter="url(#split-glow)"
              />
            ) : null,
          )}
          <text x={RIGHT_X - PANEL_W / 2 - 14} y={WAVE_ROWS[0] + 12} textAnchor="end" fontFamily={LATIN_FONT} fontSize={30} fontWeight={800} fill={GOLD}>
            ▶
          </text>
          <text
            x={RIGHT_X - PANEL_W / 2 - 14}
            y={WAVE_ROWS[1] + 12}
            textAnchor="end"
            fontFamily={LATIN_FONT}
            fontSize={30}
            fontWeight={800}
            fill={IVORY}
            opacity={playBack > 0 ? 1 : 0.3}
          >
            ◀
          </text>
        </g>
      </svg>
      <Label x={LEFT_X} text="LIKHAWAT" />
      <Label x={RIGHT_X} text="AWAAZ" />
      <Verdict x={LEFT_X} ok text={left} shown={rise(frame, leftVerdict, 8)} />
      <Verdict x={RIGHT_X} ok={false} text={right} shown={rise(frame, rightVerdict, 8)} />
    </Stage>
  );
};
