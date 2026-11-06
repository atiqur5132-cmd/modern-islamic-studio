import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {ARABIC_FONT, SAFE_AREA} from "../../theme";
import {Cue} from "../falak/common";
import {LedgerOverlay} from "../../timeline/types";
import {Tag} from "./HeadCard";
import {
  arrive,
  ayahWord,
  COUNT,
  INK,
  MONO,
  MUTED,
  PAPER,
  PAPER_DEEP,
  ROLL_FRAMES,
  SANS,
  STACK_HEIGHT,
  STACK_MOVE_FRAMES,
} from "./look";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const STRIKE_FRAMES = 8;

// One dot for every place the root y-w-m occurs, in the Quran's order, row by row.
const GRID = {top: 236, columns: 50, pitch: 18.8, dot: 12};
const FALL_FRAMES = 14;
const FALL_STAGGER = 10; // frames across which a form's dots leave, first to last
const GLOW_WAVE = 18; // frames for the remaining dots to light up, first to last
const CHIPS_TOP = 432;

// The board under the speaker. Every occurrence of the word is a dot: they appear as
// the count climbs to 475. When a form is named its dots light up; when the count
// drops by it, those dots fall out of the grid. What is left at the end, 365 dots,
// turns the count's colour. Only the running count is in the accent.
export const Ledger = ({ledger, cue}: {ledger: LedgerOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  // The same move as the speaker's window in Short.tsx, so the seam stays together.
  const stack = interpolate(frame, [0, STACK_MOVE_FRAMES], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const steps = ledger.steps.map((step) => ({...step, frame: cue(step.at)}));
  const rollFrames = (index: number, step: {frame: number}) =>
    index === 0 ? Math.max(ROLL_FRAMES, step.frame - STACK_MOVE_FRAMES) : ROLL_FRAMES;

  // The first total climbs while it is being described; later ones roll quickly.
  let value = 0;
  steps.forEach((step, index) => {
    const t = interpolate(frame, [step.frame - rollFrames(index, step), step.frame], [0, 1], {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    });
    value += (step.value - value) * t;
  });
  let current = steps[0];
  steps.forEach((step, index) => {
    if (frame >= step.frame - rollFrames(index, step)) {
      current = step;
    }
  });
  const settle = frame >= current.frame ? interpolate(frame, [current.frame, current.frame + 6], [1.05, 1], CLAMP) : 1;
  const final = cue(ledger.finalAt);
  const underline = arrive(frame, final, 10);
  // Dots appear with the first climb: dot i shows once the count passes i.
  const climb = steps[0];
  const shown = interpolate(frame, [climb.frame - rollFrames(0, climb), climb.frame], [0, ledger.dots.length], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  // Which entry each form belongs to, so a dot knows when it lights and when it falls.
  const byForm = new Map(ledger.entries.map((entry) => [entry.form, entry]));
  const formCount = new Map<string, number>();
  const rank = ledger.dots.map((form) => {
    const index = formCount.get(form) ?? 0;
    formCount.set(form, index + 1);
    return index;
  });

  return (
    <AbsoluteFill style={{transform: `translateY(${(1 - stack) * (1920 - STACK_HEIGHT)}px)`}}>
      <div
        style={{
          position: "absolute",
          top: STACK_HEIGHT,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: PAPER,
          borderTop: `4px solid ${INK}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 24,
            left: SAFE_AREA.side,
            right: SAFE_AREA.side,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Tag text={ledger.tag} />
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: MUTED}}>{ledger.source}</div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 72,
            left: SAFE_AREA.side,
            right: SAFE_AREA.side,
            display: "flex",
            alignItems: "center",
            gap: 30,
          }}
        >
          <div style={{display: "flex", flexDirection: "column"}}>
            <div
              style={{
                fontFamily: MONO,
                fontWeight: 700,
                fontSize: 136,
                lineHeight: 1,
                letterSpacing: -4,
                color: COUNT,
                fontVariantNumeric: "tabular-nums",
                transform: `scale(${settle})`,
                transformOrigin: "0 50%",
              }}
            >
              {Math.round(value)}
            </div>
            <div style={{height: 8, marginTop: 4, display: "flex"}}>
              <div style={{width: `${underline * 100}%`, backgroundColor: COUNT}} />
            </div>
          </div>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 36,
              lineHeight: 1.15,
              letterSpacing: 1,
              color: INK,
              textWrap: "balance",
            }}
          >
            {current.label}
          </div>
        </div>
        <svg
          width={GRID.columns * GRID.pitch}
          height={Math.ceil(ledger.dots.length / GRID.columns) * GRID.pitch}
          style={{position: "absolute", top: GRID.top, left: (1080 - GRID.columns * GRID.pitch) / 2, overflow: "visible"}}
        >
          {ledger.dots.map((form, index) => {
            const x = (index % GRID.columns) * GRID.pitch + GRID.pitch / 2;
            const y = Math.floor(index / GRID.columns) * GRID.pitch + GRID.pitch / 2;
            const appear = interpolate(shown - index, [0, 1], [0, 1], CLAMP);
            const entry = byForm.get(form);
            const lit = entry
              ? arrive(frame, Math.min(...entry.words.map((word) => cue(word.at))) + (rank[index] % 6), 8)
              : 0;
            const count = formCount.get(form) ?? 1;
            const fallStart = entry ? cue(entry.struckAt) + Math.round((rank[index] / count) * FALL_STAGGER) : null;
            const fall =
              fallStart === null
                ? 0
                : interpolate(frame, [fallStart, fallStart + FALL_FRAMES], [0, 1], {
                    ...CLAMP,
                    easing: Easing.in(Easing.quad),
                  });
            const glow = entry ? 0 : arrive(frame, final + Math.round((index / ledger.dots.length) * GLOW_WAVE), 8);
            const radius = (GRID.dot / 2) * appear * (1 + 0.3 * lit * (1 - fall));
            return (
              <g key={index}>
                {fall > 0 ? (
                  <circle cx={x} cy={y} r={GRID.dot / 2 - 1} fill="none" stroke={PAPER_DEEP} strokeWidth={2} />
                ) : null}
                {fall < 1 ? (
                  <circle
                    cx={x}
                    cy={y + fall * 60}
                    r={Math.max(0, radius * (1 - 0.5 * fall))}
                    fill={lit > 0.5 ? PAPER : glow > 0.5 ? COUNT : INK}
                    stroke={lit > 0.5 ? INK : "none"}
                    strokeWidth={3}
                    opacity={1 - fall}
                  />
                ) : null}
              </g>
            );
          })}
        </svg>
        <div
          style={{
            position: "absolute",
            top: CHIPS_TOP,
            left: SAFE_AREA.side,
            right: SAFE_AREA.side,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {ledger.entries.map((entry) => {
            const listed = arrive(frame, cue(entry.words[0].at), 10);
            const strike = interpolate(frame, [cue(entry.struckAt), cue(entry.struckAt) + STRIKE_FRAMES], [0, 1], {
              ...CLAMP,
              easing: Easing.out(Easing.cubic),
            });
            return (
              <div
                key={entry.form}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  opacity: listed * (1 - 0.45 * strike),
                  transform: `translateY(${(1 - listed) * 18}px)`,
                }}
              >
                <div style={{position: "relative", display: "flex", alignItems: "center", gap: 10, height: 46}}>
                  <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 30, color: INK}}>−{entry.minus}</div>
                  <div style={{display: "flex", gap: 12, direction: "rtl"}}>
                    {entry.words.map((word) => (
                      <div
                        key={word.roman}
                        style={{
                          fontFamily: ARABIC_FONT,
                          fontSize: 38,
                          lineHeight: 1,
                          color: INK,
                          opacity: arrive(frame, cue(word.at), 8),
                          // Amiri Quran draws low in its line box; centre it on the row.
                          transform: "translateY(-10px)",
                        }}
                      >
                        {ayahWord(word.word.ayah, word.word.word)}
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: -4,
                      top: 21,
                      height: 4,
                      width: `calc(${strike * 100}% + 8px)`,
                      backgroundColor: INK,
                      opacity: strike > 0 ? 1 : 0,
                    }}
                  />
                </div>
                <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: MUTED, whiteSpace: "nowrap"}}>
                  {entry.words.map((word, index) => (
                    <span key={word.roman} style={{opacity: arrive(frame, cue(word.meaningAt ?? word.at), 8)}}>
                      {index > 0 ? " · " : ""}
                      {word.meaning}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
