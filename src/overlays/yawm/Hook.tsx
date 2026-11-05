import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {ARABIC_FONT, SAFE_AREA} from "../../theme";
import {Cue} from "../falak/common";
import {YawmHookOverlay} from "../../timeline/types";
import {Tag} from "./HeadCard";
import {arrive, ayahWord, bareLetters, COUNT, INK, leave, MONO, MUTED, PAPER, PAPER_DEEP, SANS} from "./look";

// A year as twelve month blocks, the days filling in order: about a second for 365.
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // 365, a common year
const YEAR = 2026; // weekdays of the first of each month, so the blocks look like a calendar
const CELL = 14;
const CELL_PITCH = 18;
const BLOCK = {width: 7 * CELL_PITCH, gapX: 70, gapY: 16, label: 34};
const GRID_FILL_FRAMES = 32;
const STAGE = {top: 330, height: 470};
const ARABIC_LIFT = -0.32; // of the font size

// The opening over the voice. Frame 0 is already the thumbnail: the bare word, the
// number and the question. On "jitne saal mein din" the word gives way to a year of
// 365 days filling in, and the line under the number changes.
export const YawmHook = ({hook, cue}: {hook: YawmHookOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const year = cue(hook.yearAt);
  const word = bareLetters(ayahWord(hook.word.ayah, hook.word.word));
  const wordOut = leave(frame, year, 6);
  const gridIn = arrive(frame, year + 2, 10);
  const filled = interpolate(frame, [year + 2, year + 2 + GRID_FILL_FRAMES], [0, 365], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Never dead still: the whole page breathes in by 2% over the hook.
  const breathe = 1 + 0.02 * interpolate(frame, [0, 160], [0, 1], {extrapolateRight: "clamp"});
  const blockHeight = BLOCK.label + 6 * CELL_PITCH;
  const gridWidth = 4 * BLOCK.width + 3 * BLOCK.gapX;
  const gridHeight = 3 * blockHeight + 2 * BLOCK.gapY;
  let dayOfYear = 0;

  return (
    <AbsoluteFill style={{backgroundColor: PAPER}}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${PAPER_DEEP} 2px, transparent 2px)`,
          backgroundSize: "100% 64px",
          opacity: 0.55,
        }}
      />
      <div style={{position: "absolute", top: SAFE_AREA.top, left: SAFE_AREA.side}}>
        <Tag text={hook.tag} />
      </div>
      <AbsoluteFill style={{transform: `scale(${breathe})`, transformOrigin: "50% 45%"}}>
        <div
          style={{
            position: "absolute",
            top: STAGE.top,
            height: STAGE.height,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: ARABIC_FONT,
            fontSize: 300,
            lineHeight: 1,
            color: INK,
            direction: "rtl",
            opacity: wordOut,
            // Amiri Quran draws well below its line box; lift it back to the stage's centre.
            transform: `translateY(${ARABIC_LIFT * 300}px) scale(${0.94 + 0.06 * wordOut})`,
          }}
        >
          {word}
        </div>
        <div
          style={{
            position: "absolute",
            top: STAGE.top + (STAGE.height - gridHeight) / 2,
            left: (1080 - gridWidth) / 2,
            width: gridWidth,
            display: "grid",
            gridTemplateColumns: `repeat(4, ${BLOCK.width}px)`,
            columnGap: BLOCK.gapX,
            rowGap: BLOCK.gapY,
            opacity: gridIn,
            transform: `translateY(${(1 - gridIn) * 20}px)`,
          }}
        >
          {MONTHS.map((month, m) => {
            const offset = new Date(Date.UTC(YEAR, m, 1)).getUTCDay();
            const first = dayOfYear;
            dayOfYear += MONTH_DAYS[m];
            const monthLit = filled > first;
            return (
              <div key={month} style={{height: blockHeight}}>
                <div
                  style={{
                    fontFamily: SANS,
                    fontWeight: 800,
                    fontSize: 28,
                    letterSpacing: 2,
                    color: monthLit ? INK : MUTED,
                    height: BLOCK.label,
                  }}
                >
                  {month}
                </div>
                <svg width={BLOCK.width} height={6 * CELL_PITCH}>
                  {Array.from({length: MONTH_DAYS[m]}, (_, d) => {
                    const slot = offset + d;
                    const on = filled > first + d;
                    return (
                      <rect
                        key={d}
                        x={(slot % 7) * CELL_PITCH}
                        y={Math.floor(slot / 7) * CELL_PITCH}
                        width={CELL}
                        height={CELL}
                        rx={3}
                        fill={on ? INK : "none"}
                        stroke={on ? INK : PAPER_DEEP}
                        strokeWidth={2}
                      />
                    );
                  })}
                </svg>
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            top: 820,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 210,
            lineHeight: 1,
            color: COUNT,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: -6,
          }}
        >
          {hook.value}
        </div>
        {[hook.claim, hook.yearLine].map((line, index) => {
          const shown = index === 0 ? wordOut : arrive(frame, year, 10);
          return (
            <div
              key={line}
              style={{
                position: "absolute",
                top: 1040,
                left: SAFE_AREA.side,
                right: SAFE_AREA.side,
                textAlign: "center",
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 58,
                lineHeight: 1,
                letterSpacing: 1,
                color: INK,
                opacity: shown,
                transform: `translateY(${(index === 0 ? 0 : 1 - shown) * 14}px)`,
              }}
            >
              {line}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
