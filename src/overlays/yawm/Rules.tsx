import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {SAFE_AREA} from "../../theme";
import {RulesOverlay} from "../../timeline/types";
import {Tag} from "./HeadCard";
import {arrive, COUNT, INK, leave, MONO, MUTED, PAPER, SANS} from "./look";

const CHART = {top: 744, row: 84, bar: 26, width: 700};
const ROW_STAGGER = 4; // frames, about 130 ms
const GROW_FRAMES = 14;

// "Thoda alag gino, toh number badal jaata hai": a bar for each rule, against a
// dashed line at the number the claim needs. Only one rule reaches it.
export const Rules = ({rules}: {rules: RulesOverlay}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const life = Math.min(arrive(frame, 0, 8), leave(frame, durationInFrames - 5, 5));
  const heading = arrive(frame, 3, 12);
  const longest = Math.max(...rules.rows.map((row) => row.value));
  const scale = (value: number) => (value / longest) * CHART.width;
  const referenceX = scale(rules.reference.value);
  const line = arrive(frame, 4, 10);
  const bottom = rules.rows.length * CHART.row;

  return (
    <AbsoluteFill style={{backgroundColor: PAPER, opacity: life}}>
      <div style={{position: "absolute", top: SAFE_AREA.top, left: SAFE_AREA.side, width: 470}}>
        <Tag text={rules.tag} />
        <div
          style={{
            marginTop: 22,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 70,
            lineHeight: 1.04,
            color: INK,
            opacity: heading,
            transform: `translateX(${(1 - heading) * -30}px)`,
          }}
        >
          {rules.heading}
        </div>
      </div>
      <div style={{position: "absolute", top: CHART.top, left: SAFE_AREA.side, width: 940, height: bottom}}>
        <svg width={940} height={bottom + 40} style={{position: "absolute", top: -40, left: 0, overflow: "visible"}}>
          <line
            x1={referenceX}
            x2={referenceX}
            y1={40 + bottom * (1 - line)}
            y2={40 + bottom}
            stroke={INK}
            strokeWidth={3}
            strokeDasharray="10 8"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            top: -84,
            left: referenceX - 200,
            width: 400,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 30,
            color: INK,
            opacity: line,
          }}
        >
          {rules.reference.label}
        </div>
        {rules.rows.map((row, index) => {
          const start = 6 + index * ROW_STAGGER;
          const grow = interpolate(frame, [start, start + GROW_FRAMES], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.exp),
          });
          const shown = arrive(frame, start, 8);
          return (
            <div key={row.rule} style={{position: "absolute", top: index * CHART.row, left: 0, right: 0, opacity: shown}}>
              <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: row.final ? INK : MUTED, height: 38}}>
                {row.rule}
              </div>
              <div style={{display: "flex", alignItems: "center", gap: 14}}>
                <div
                  style={{
                    width: scale(row.value) * grow,
                    height: CHART.bar,
                    borderRadius: 4,
                    backgroundColor: row.final ? COUNT : INK,
                  }}
                />
                <div
                  style={{
                    fontFamily: MONO,
                    fontWeight: 700,
                    fontSize: 40,
                    lineHeight: 1,
                    color: row.final ? COUNT : INK,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {Math.round(row.value * grow)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
