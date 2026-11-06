import {useMemo} from "react";
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from "remotion";
import {PalindromeOverlay} from "../../timeline/types";
import {ARABIC_FONT, GOLD, IVORY, LATIN_FONT} from "../../theme";
import {lastWords, modernYa, palindromeLetters, withoutMarks} from "./arabic";
import {rise} from "./common";
import type {Cue} from "./common";
import {rtlCentres, useTextWidths} from "./measure";
import {Stage} from "./Stage";

const CX = 540;
// Baselines: the recited phrase, the three words alone, the seven letters.
const PHRASE_Y = 900;
const HERO_Y = 960;
const GLYPH_Y = 990;
const MEASURE_SIZE = 100;
const MAX_PHRASE_SIZE = 150;
const PHRASE_WIDTH = 960; // all four words fit in this
const HERO_WIDTH = 960; // the three that stay grow to fill it
const MAX_HERO_SCALE = 1.7;
const GLYPH_SIZE = 150;
const SPACING = 128;
const LETTER_MIDDLE = 52; // above the baseline, where a letter's body sits
const MARK_FRAMES = 30;
const SPARKS = 70;
const SEPARATE_FRAMES = 20;
const SHINE_FRAMES = 14;
const PAN = 0.1; // how far the eye leans toward the letter being named
const ORBIT_Y = GLYPH_Y - LETTER_MIDDLE;
const ORBIT_SQUASH = 0.42;
const SWAP_STAGGER = 3;
const LIGHT = "#FFF4DA";

const ease = Easing.inOut(Easing.cubic);
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const letterX = (i: number) => CX + (3 - i) * SPACING;

// Where letter i's copy is, part way (p) along its orbit to the mirror place.
// Letters right of the middle go over the top, those left of it pass beneath, so
// the copies never collide; the middle letter is its own mirror and stays.
const orbitPoint = (i: number, p: number) => {
  const rx = Math.abs(letterX(i) - CX);
  const ry = rx * ORBIT_SQUASH;
  const theta = (letterX(i) > CX ? 0 : Math.PI) + Math.PI * p;
  return {x: CX + rx * Math.cos(theta), y: GLYPH_Y - ry * Math.sin(theta)};
};

const makeSparks = () =>
  Array.from({length: SPARKS}, (_, i) => ({
    u: random(`sx-${i}`),
    above: random(`sa-${i}`) > 0.3,
    drift: (random(`sd-${i}`) - 0.5) * 60,
    rise: 90 + random(`sr-${i}`) * 160,
    delay: random(`sl-${i}`) * 0.35,
    size: 1.5 + random(`ss-${i}`) * 3,
  }));

// G3 + G4: the phrase as recited, then the reveal. The fourth word leaves, the
// three grow to fill the frame, the vowel marks crumble into gold dust, the seven
// letters stand apart and each lights as it is named, right to left. Read back,
// every letter's copy travels an orbit to its mirror place and lands on the very
// same letter: the order reversed changes nothing. On "Same" it locks.
export const Palindrome = ({o, cue}: {o: PalindromeOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const words = lastWords(o.ayah, 4);
  const letters = palindromeLetters(o.ayah);
  const measured = useTextWidths([...words, " "], ARABIC_FONT, MEASURE_SIZE);
  const sparks = useMemo(makeSparks, []);
  if (!measured) {
    return null;
  }

  const at = {
    words: o.wordsAt.map(cue),
    translation: cue(o.translationAt),
    fourth: cue(o.fourthWordGoesAt),
    marks: cue(o.marksGoAt),
    separate: cue(o.separateAt),
    letters: o.letters.map((l) => cue(l.at)),
    sweep: cue(o.sweepAt),
    same: cue(o.sameAt),
  };

  // --- The phrase on one line, each word placed by its measured width.
  const space = measured[4];
  const fullWidth = measured.slice(0, 4).reduce((a, b) => a + b, 0) + 3 * space;
  const size = Math.min(MAX_PHRASE_SIZE, (MEASURE_SIZE * PHRASE_WIDTH) / fullWidth);
  const widths = measured.slice(0, 4).map((w) => (w * size) / MEASURE_SIZE);
  const gap = (space * size) / MEASURE_SIZE;
  const threeWidth = widths[0] + widths[1] + widths[2] + 2 * gap;
  const fourthGone = interpolate(frame, [at.fourth, at.fourth + 16], [0, 1], {...clamp, easing: ease});
  const heroScale = 1 + (Math.min(MAX_HERO_SCALE, HERO_WIDTH / threeWidth) - 1) * fourthGone;
  const baseline = interpolate(fourthGone, [0, 1], [PHRASE_Y, HERO_Y]);
  const centres = rtlCentres(widths, gap, CX, [1, 1, 1, 1 - fourthGone]);
  const phraseTransform = `translate(${CX} ${baseline}) scale(${heroScale}) translate(${-CX} ${-baseline})`;

  const marksT = interpolate(frame, [at.marks, at.marks + MARK_FRAMES], [0, 1], clamp);
  const marksStarted = frame >= at.marks;
  const separated = interpolate(frame, [at.separate, at.separate + SEPARATE_FRAMES], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });

  const wordText = (text: string, i: number, props: Record<string, unknown>) => (
    <text
      key={`${i}-${text}`}
      x={centres[i]}
      y={baseline}
      textAnchor="middle"
      direction="rtl"
      fontFamily={ARABIC_FONT}
      fontSize={size}
      {...props}
    >
      {text}
    </text>
  );

  // --- The eye leans toward each letter as it is named, and back for the read-back.
  const named = at.letters.reduce((last, f, i) => (frame >= f ? i : last), -1);
  const panFrames = [at.letters[0] - 8, ...at.letters, at.sweep + 6];
  const panTargets = [0, ...letters.map((_, i) => -(letterX(i) - CX) * PAN), 0];
  const pan = interpolate(frame, panFrames, panTargets, {...clamp, easing: ease});
  const lean = interpolate(frame, [at.letters[0] - 8, at.letters[0], at.sweep, at.sweep + 10], [1, 1.04, 1.04, 1], clamp);

  // While the phrase holds, the frame creeps in so nothing sits still; it eases
  // back out before the letters need the full width.
  const creep = interpolate(frame, [at.words[0], at.fourth, at.separate], [1, 1.06, 1], {...clamp, easing: ease});

  const axis = interpolate(frame, [at.letters[3], at.letters[3] + 12], [0, 1], {...clamp, easing: ease});
  const locked = rise(frame, at.same, 5);
  const flash = frame === at.same ? 0.22 : frame === at.same + 1 ? 0.07 : 0;
  const swapFrames = Math.max(12, at.same - at.sweep - SWAP_STAGGER * 5);

  // The read-back goes left to right, so the leftmost letter (6) sets off first.
  const swapProgress = (i: number) => {
    const begin = at.sweep + (6 - i) * SWAP_STAGGER;
    return interpolate(frame, [begin, begin + swapFrames], [0, 1], {...clamp, easing: ease});
  };

  return (
    <Stage tag={frame < at.fourth ? "QURANIC TEXT · 21:33" : "OBSERVATION"} light={{x: CX, y: HERO_Y - 60}}>
      <AbsoluteFill
        style={{
          transform: `translateX(${pan}px) scale(${creep * lean * (1 + 0.03 * locked)})`,
          transformOrigin: `${CX}px ${GLYPH_Y}px`,
        }}
      >
        <svg width={1080} height={1920} style={{position: "absolute", overflow: "visible"}}>
          <defs>
            {/* Hides the letters of the full text, leaving only its vowel marks. */}
            <mask id="marks-only" maskUnits="userSpaceOnUse" x={-300} y={0} width={1680} height={1920}>
              <rect x={-300} width={1680} height={1920} fill="white" />
              {words.slice(0, 3).map((word, i) =>
                wordText(withoutMarks(word), i, {fill: "black", stroke: "black", strokeWidth: 6}),
              )}
            </mask>
            <filter id="crumble" x="-20%" y="-80%" width="140%" height="260%">
              <feTurbulence type="fractalNoise" baseFrequency={0.035} numOctaves={2} seed={7} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={70 * marksT} />
              <feGaussianBlur stdDeviation={3 * marksT} />
            </filter>
            <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation={14} />
            </filter>
            {words.map((_, i) => (
              <filter key={i} id={`arrive-${i}`} x="-30%" y="-60%" width="160%" height="220%">
                <feGaussianBlur stdDeviation={14 * (1 - rise(frame, at.words[i], 14))} />
              </filter>
            ))}
            <filter id="leave" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation={`${20 * fourthGone} ${4 * fourthGone}`} />
            </filter>
            {letters.map((_, i) => {
              const shine = interpolate(frame, [at.letters[i], at.letters[i] + SHINE_FRAMES], [-0.4, 1.4], clamp);
              return (
                <linearGradient key={i} id={`shine-${i}`} x1="0" y1="0" x2="1" y2="0.35">
                  <stop offset={shine - 0.25} stopColor={GOLD} />
                  <stop offset={shine} stopColor={LIGHT} />
                  <stop offset={shine + 0.25} stopColor={GOLD} />
                </linearGradient>
              );
            })}
          </defs>

          {/* --- The phrase, then the three words, then the bare letters. */}
          {separated < 1 ? (
            <g opacity={1 - interpolate(separated, [0, 0.45], [0, 1], clamp)} transform={phraseTransform}>
              <g
                mask={marksStarted ? "url(#marks-only)" : undefined}
                filter={marksStarted ? "url(#crumble)" : undefined}
                transform={`translate(0 ${-110 * Easing.in(Easing.quad)(marksT)})`}
                opacity={marksStarted ? 1 - Math.pow(marksT, 1.4) : 1}
              >
                {words.slice(0, 3).map((word, i) =>
                  wordText(word, i, {
                    fill: marksStarted ? GOLD : IVORY,
                    fillOpacity: 0.08 + 0.92 * rise(frame, at.words[i], 12),
                    filter: marksStarted ? undefined : `url(#arrive-${i})`,
                  }),
                )}
              </g>
              {marksStarted
                ? words.slice(0, 3).map((word, i) => wordText(modernYa(withoutMarks(word)), i, {fill: IVORY}))
                : null}
              {fourthGone < 1
                ? wordText(words[3], 3, {
                    fill: IVORY,
                    fillOpacity: (0.08 + 0.92 * rise(frame, at.words[3], 12)) * (1 - fourthGone),
                    filter: fourthGone > 0 ? "url(#leave)" : "url(#arrive-3)",
                    transform: `translate(${-160 * fourthGone} 0)`,
                  })
                : null}
            </g>
          ) : null}

          {/* --- Gold dust rising off the marks. */}
          {marksStarted && marksT < 1
            ? sparks.map((s, i) => {
                const t = interpolate(marksT, [s.delay, Math.min(1, s.delay + 0.65)], [0, 1], clamp);
                const half = (threeWidth * heroScale) / 2;
                const x = CX - half + s.u * 2 * half + s.drift * t;
                const y = HERO_Y + (s.above ? -size * heroScale * 1.05 : size * heroScale * 0.2) - s.rise * t;
                return (
                  <circle key={i} cx={x} cy={y} r={s.size * (1 - 0.5 * t)} fill={GOLD} opacity={t > 0 ? (1 - t) * 0.9 : 0} />
                );
              })
            : null}

          {/* --- The mirror axis: a beam of light through Ya. */}
          {axis > 0 ? (
            <g opacity={Math.min(1, 0.7 * axis + 0.3 * locked)}>
              <line x1={CX} x2={CX} y1={ORBIT_Y - 250 * axis} y2={ORBIT_Y + 190 * axis} stroke={GOLD} strokeWidth={10} filter="url(#glow)" opacity={0.5} />
              <line x1={CX} x2={CX} y1={ORBIT_Y - 250 * axis} y2={ORBIT_Y + 190 * axis} stroke={LIGHT} strokeWidth={2} />
            </g>
          ) : null}

          {/* --- Orbits traced by the copies on the read-back, closed on "Same". */}
          {frame >= at.sweep
            ? [1, 2, 3].map((k) => {
                const rx = k * SPACING;
                const ry = rx * ORBIT_SQUASH;
                const half = Math.PI * Math.sqrt((rx * rx + ry * ry) / 2);
                // Right letter (3 - k) goes over the top; left letter (3 + k) beneath.
                const arcs = [
                  {d: `M ${CX + rx} ${ORBIT_Y} A ${rx} ${ry} 0 0 0 ${CX - rx} ${ORBIT_Y}`, p: swapProgress(3 - k)},
                  {d: `M ${CX - rx} ${ORBIT_Y} A ${rx} ${ry} 0 0 0 ${CX + rx} ${ORBIT_Y}`, p: swapProgress(3 + k)},
                ];
                return arcs.map((arc, j) => (
                  <path
                    key={`${k}-${j}`}
                    d={arc.d}
                    fill="none"
                    stroke={GOLD}
                    strokeWidth={2.5}
                    strokeDasharray={half}
                    strokeDashoffset={half * (1 - arc.p)}
                    opacity={0.35 + 0.45 * locked}
                  />
                ));
              })
            : null}

          {/* --- The seven letters. */}
          {separated > 0
            ? letters.map((letter, i) => {
                const from = CX + ((3 - i) * threeWidth * heroScale) / 7;
                const x = from + (letterX(i) - from) * separated;
                const lit = frame >= at.letters[i];
                const pulse = interpolate(frame, [at.letters[i], at.letters[i] + 5, at.letters[i] + 22], [0, 1, 0.3], clamp);
                const glow = Math.max(lit ? pulse : 0, locked);
                const pop = 1 + 0.12 * interpolate(frame, [at.letters[i], at.letters[i] + 5, at.letters[i] + 16], [0, 1, 0], clamp);
                return (
                  <g key={i} opacity={separated} transform={`translate(${x} ${GLYPH_Y}) scale(${pop})`}>
                    <text textAnchor="middle" fontFamily={ARABIC_FONT} fontSize={GLYPH_SIZE} fill={GOLD} filter="url(#glow)" opacity={glow * 0.9}>
                      {letter}
                    </text>
                    <text
                      textAnchor="middle"
                      fontFamily={ARABIC_FONT}
                      fontSize={GLYPH_SIZE}
                      fill={lit || locked > 0 ? `url(#shine-${i})` : IVORY}
                      opacity={lit || locked > 0 ? 1 : 0.42}
                    >
                      {letter}
                    </text>
                  </g>
                );
              })
            : null}

          {/* --- Their copies, each travelling its orbit to the mirror place. */}
          {frame >= at.sweep
            ? letters.map((letter, i) => {
                if (i === 3) {
                  return null;
                }
                const p = swapProgress(i);
                const point = orbitPoint(i, p);
                return (
                  <g key={i} transform={`translate(${point.x} ${point.y})`} opacity={p >= 1 ? 1 - locked : 0.95}>
                    <text textAnchor="middle" fontFamily={ARABIC_FONT} fontSize={GLYPH_SIZE} fill={LIGHT} filter="url(#glow)" opacity={0.7}>
                      {letter}
                    </text>
                    <text textAnchor="middle" fontFamily={ARABIC_FONT} fontSize={GLYPH_SIZE} fill={LIGHT} opacity={0.85}>
                      {letter}
                    </text>
                  </g>
                );
              })
            : null}
        </svg>

        {/* The name of the letter being spoken, large, one at a time. */}
        {named >= 0 && frame < at.sweep ? (
          <div
            style={{
              position: "absolute",
              left: letterX(named) - 150,
              top: GLYPH_Y + 46,
              width: 300,
              textAlign: "center",
              fontFamily: LATIN_FONT,
              fontWeight: 900,
              fontSize: 54,
              letterSpacing: 2,
              color: IVORY,
              opacity:
                rise(frame, at.letters[named], 6) *
                (1 - rise(frame, (named < 6 ? at.letters[named + 1] : at.sweep) - 4, 4)),
              transform: `translateY(${(1 - rise(frame, at.letters[named], 8)) * 16}px)`,
            }}
          >
            {o.letters[named].name.toUpperCase()}
          </div>
        ) : null}

        {/* Romanisation and meaning while the whole phrase is on screen. */}
        <div
          style={{
            position: "absolute",
            top: PHRASE_Y + 92,
            left: 70,
            right: 70,
            textAlign: "center",
            fontFamily: LATIN_FONT,
            opacity: rise(frame, at.words[0], 14) * (1 - fourthGone),
          }}
        >
          <div style={{fontWeight: 700, fontSize: 42, color: GOLD, fontStyle: "italic", letterSpacing: 1}}>
            {o.romanisation}
          </div>
          <div style={{marginTop: 6, fontWeight: 600, fontSize: 32, color: IVORY, opacity: 0.85 * rise(frame, at.translation, 12)}}>
            {o.translation}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{backgroundColor: LIGHT, opacity: flash}} />
    </Stage>
  );
};
