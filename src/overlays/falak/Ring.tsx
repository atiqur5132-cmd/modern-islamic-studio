import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {ARABIC_FONT, GOLD, IVORY, LATIN_FONT, NAVY, NAVY_LIGHT} from "../../theme";
import {modernYa, palindromeLetters, palindromeWords, withoutMarks} from "./arabic";
import {Cue, fall, rise} from "./common";
import {Stage} from "./Stage";

const CX = 540;
const CY = 820;
const RX = 390;
const RY = 165; // the orbit seen at a tilt
const GLYPH_SIZE = 150;
const TURN = -0.004; // radians per frame
const LIGHT = "#FFF4DA";
const STEP = (Math.PI * 2) / 7;
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// Angular distance, folded into 0..PI.
const apart = (a: number, b: number) => {
  const d = Math.abs((((a - b) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
  return Math.min(d, 2 * Math.PI - d);
};

// G9. The seven letters ride a tilted orbit, Ya in front. Two lights set off from
// Ya in opposite directions and light the letters in matching pairs, Fa and Fa,
// Laam and Laam, Kaaf and Kaaf, meet behind, and come home to Ya: read either way
// round, the ring says the same.
export const Ring = ({ayah, runAt, homeAt, phraseAt, cue}: {ayah: string; runAt: number; homeAt: number; phraseAt: number; cue: Cue}) => {
  const frame = useCurrentFrame();
  const letters = palindromeLetters(ayah);
  const turn = frame * TURN;
  const yaAngle = Math.PI / 2 + turn;
  const run = interpolate(frame, [cue(runAt), cue(homeAt)], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const running = frame >= cue(runAt) && run < 1;
  const runners = [yaAngle + run * Math.PI * 2, yaAngle - run * Math.PI * 2];
  const leaving = 1 - interpolate(frame, [cue(phraseAt) - 6, cue(phraseAt) + 8], [0, 1], clamp);
  const orbit = interpolate(frame, [0, 26], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const home = rise(frame, cue(homeAt), 6);

  const placed = letters.map((letter, i) => {
    const angle = yaAngle + (i - 3) * STEP;
    const depth = Math.sin(angle); // 1 in front, -1 behind
    const arrive = rise(frame, 6 + Math.abs(i - 3) * 4, 16);
    // How far round (0..1) each light must travel to reach this letter.
    const distance = apart(angle, yaAngle) / (Math.PI * 2);
    const reached = i === 3 ? home : run >= distance && frame >= cue(runAt) ? 1 : 0;
    const flare = i === 3 ? home : interpolate(run - distance, [0, 0.04, 0.2], [0, 1, 0.45], clamp) * (frame >= cue(runAt) ? 1 : 0);
    const pull = 1 - leaving; // converge to the centre as the ring gives way
    return {
      letter,
      i,
      depth,
      x: CX + Math.cos(angle) * RX * orbit * (1 - pull),
      y: CY + depth * RY * orbit * (1 - pull) - 40,
      scale: (0.72 + 0.4 * (depth + 1) / 2) * (0.8 + 0.2 * arrive),
      opacity: arrive * leaving * (0.45 + 0.55 * (depth + 1) / 2),
      gold: i === 3 || reached > 0,
      flare,
    };
  });

  return (
    <Stage tag="REFLECTION" light={{x: CX, y: CY}}>
      <svg width={1080} height={1920} style={{position: "absolute", overflow: "visible"}}>
        <defs>
          <filter id="ring-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation={12} />
          </filter>
        </defs>
        {/* The orbit: the far half faint, the near half bright. */}
        <g opacity={orbit * leaving}>
          <ellipse cx={CX} cy={CY - 40} rx={RX} ry={RY} fill="none" stroke={GOLD} strokeWidth={2} opacity={0.3} />
          <path d={`M ${CX - RX} ${CY - 40} A ${RX} ${RY} 0 0 0 ${CX + RX} ${CY - 40}`} fill="none" stroke={GOLD} strokeWidth={10} filter="url(#ring-soft)" opacity={0.35} />
          <path d={`M ${CX - RX} ${CY - 40} A ${RX} ${RY} 0 0 0 ${CX + RX} ${CY - 40}`} fill="none" stroke={LIGHT} strokeWidth={2.5} opacity={0.8} />
        </g>
        {/* The two lights, running opposite ways round. */}
        {running
          ? runners.map((a, k) => (
              <g key={k}>
                <circle cx={CX + Math.cos(a) * RX} cy={CY - 40 + Math.sin(a) * RY} r={22} fill={GOLD} filter="url(#ring-soft)" />
                <circle cx={CX + Math.cos(a) * RX} cy={CY - 40 + Math.sin(a) * RY} r={6} fill={LIGHT} />
              </g>
            ))
          : null}
        {/* Letters, far ones first so near ones pass in front. */}
        {[...placed]
          .sort((a, b) => a.depth - b.depth)
          .map((p) => (
            <g key={p.i} transform={`translate(${p.x} ${p.y + GLYPH_SIZE * 0.35}) scale(${p.scale})`} opacity={p.opacity}>
              <text textAnchor="middle" fontFamily={ARABIC_FONT} fontSize={GLYPH_SIZE} fill={GOLD} filter="url(#ring-soft)" opacity={0.8 * p.flare}>
                {p.letter}
              </text>
              <text textAnchor="middle" fontFamily={ARABIC_FONT} fontSize={GLYPH_SIZE} fill={p.gold ? GOLD : IVORY}>
                {p.letter}
              </text>
            </g>
          ))}
      </svg>
    </Stage>
  );
};

// The last beat, over everything to the final frame: the bare phrase in the same
// dark room, so the end matches the dark Arabic look the reel loops back into.
// It never fades out; the last frame is the phrase.
export const EndPhrase = ({ayah}: {ayah: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const veil = rise(frame, 0, 12);
  const phrase = rise(frame, 6, 22);
  const settle = interpolate(frame, [0, durationInFrames], [1.05, 1]);
  return (
    <AbsoluteFill style={{opacity: veil}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 40% at 540px 860px, ${NAVY_LIGHT} 0%, ${NAVY} 70%, #050A14 100%)`,
        }}
      />
      <AbsoluteFill style={{background: `radial-gradient(ellipse 40% 14% at 540px 860px, ${GOLD}26 0%, transparent 100%)`}} />
      <div
        dir="rtl"
        lang="ar"
        style={{
          position: "absolute",
          top: 860 - 190,
          left: 0,
          width: 1080,
          textAlign: "center",
          fontFamily: ARABIC_FONT,
          fontSize: 170,
          lineHeight: 1.8,
          color: IVORY,
          opacity: phrase,
          filter: `blur(${(1 - phrase) * 10}px)`,
          transform: `scale(${settle})`,
          textShadow: `0 0 50px ${GOLD}66`,
        }}
      >
        {modernYa(withoutMarks(palindromeWords(ayah).join(" ")))}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1000,
          left: 0,
          width: 1080,
          textAlign: "center",
          fontFamily: LATIN_FONT,
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: 8,
          color: GOLD,
          opacity: rise(frame, 20, 18),
        }}
      >
        AL-ANBIYA 21:33
      </div>
    </AbsoluteFill>
  );
};

// G8's quiet line: a small glass card on the wall, no tag colour, just words.
export const Note = ({text}: {text: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const shown = Math.min(rise(frame, 0, 14), fall(frame, durationInFrames - 7, 7));
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div
        style={{
          position: "absolute",
          top: 340,
          left: 56,
          padding: "16px 24px",
          borderLeft: `4px solid ${GOLD}`,
          backgroundColor: `${NAVY}99`,
          backdropFilter: "blur(14px)",
          fontFamily: LATIN_FONT,
          fontWeight: 600,
          fontSize: 34,
          color: IVORY,
          opacity: shown,
          transform: `translateX(${(1 - shown) * -20}px)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
