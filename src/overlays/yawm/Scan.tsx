import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {SAFE_AREA} from "../../theme";
import {ScanOverlay} from "../../timeline/types";
import {Tag} from "./HeadCard";
import {arrive, COUNT, INK, leave, MONO, MUTED, PAPER, PAPER_DEEP, SANS} from "./look";

const CHART = {top: 690, height: 330, width: 940};
const BAR_SHARE = 0.62; // of each surah's slot; the rest is the gap
const MIN_BAR = 3;
const HIT_POP_FRAMES = 6;

// "Computer pe, poore Quran ka ek-ek lafz": the speaker in the circle, the Quran as
// 114 bars (one per surah, taller for more words), a scan line crossing it,
// and a dot lighting up wherever the root of "yawm" occurs. Real data: make_stats.py.
export const Scan = ({scan}: {scan: ScanOverlay}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const life = Math.min(arrive(frame, 0, 8), leave(frame, durationInFrames - 5, 5));
  const heading = arrive(frame, 4, 12);
  const sweep = interpolate(frame, [6, durationInFrames - 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const slot = CHART.width / scan.surahWords.length;
  const tallest = Math.max(...scan.surahWords);
  const scanX = sweep * CHART.width;
  // Words read so far: whole surahs left of the line, and the share of the one under it.
  let read = 0;
  scan.surahWords.forEach((words, index) => {
    read += words * interpolate(scanX, [index * slot, (index + 1) * slot], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });
  // Square-root heights, so the short surahs at the end still show as bars.
  const barHeight = (words: number) => Math.max(MIN_BAR, Math.sqrt(words / tallest) * CHART.height);
  // The frame at which the line reaches a given x, to pop each dot as it is passed.
  const passedAt = (x: number) => frame - (6 + (x / CHART.width) * (durationInFrames - 16));

  return (
    <AbsoluteFill style={{backgroundColor: PAPER, opacity: life}}>
      <div style={{position: "absolute", top: SAFE_AREA.top, left: SAFE_AREA.side, width: 470}}>
        <Tag text={scan.tag} />
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
          {scan.heading}
        </div>
        <div style={{marginTop: 18, fontFamily: SANS, fontWeight: 600, fontSize: 28, lineHeight: 1.3, color: MUTED}}>
          {scan.source}
        </div>
      </div>
      <svg
        width={CHART.width}
        height={CHART.height + 6}
        style={{position: "absolute", top: CHART.top, left: SAFE_AREA.side, overflow: "visible"}}
      >
        {scan.surahWords.map((words, index) => {
          const x = index * slot + (slot * (1 - BAR_SHARE)) / 2;
          const height = barHeight(words);
          const scanned = scanX >= index * slot + slot / 2;
          return (
            <rect
              key={index}
              x={x}
              y={CHART.height - height}
              width={slot * BAR_SHARE}
              height={height}
              rx={1.5}
              fill={scanned ? INK : PAPER_DEEP}
            />
          );
        })}
        {scan.hits.map(([surah, position], index) => {
          const x = (surah - 1) * slot + slot / 2;
          const height = barHeight(scan.surahWords[surah - 1]);
          const y = CHART.height - height + position * height;
          const pop = interpolate(passedAt(x), [0, HIT_POP_FRAMES], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.back(3)),
          });
          return <circle key={index} cx={x} cy={y} r={4.5 * pop} fill={COUNT} stroke={PAPER} strokeWidth={1.5} />;
        })}
        <line x1={scanX} x2={scanX} y1={-24} y2={CHART.height + 6} stroke={COUNT} strokeWidth={3} opacity={sweep > 0 && sweep < 1 ? 1 : 0} />
        <line x1={0} x2={CHART.width} y1={CHART.height + 3} y2={CHART.height + 3} stroke={INK} strokeWidth={3} />
      </svg>
      <div
        style={{
          position: "absolute",
          top: CHART.top + CHART.height + 14,
          left: SAFE_AREA.side,
          right: SAFE_AREA.side,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 28,
          color: MUTED,
        }}
      >
        <span>Surah 1</span>
        <span>114</span>
      </div>
      <div
        style={{
          position: "absolute",
          top: CHART.top - 96,
          left: SAFE_AREA.side,
          display: "flex",
          alignItems: "baseline",
          gap: 16,
        }}
      >
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: 60, lineHeight: 1, color: INK, fontVariantNumeric: "tabular-nums"}}>
          {Math.round(read).toLocaleString("en-US")}
        </div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: MUTED}}>{scan.totalLabel}</div>
      </div>
    </AbsoluteFill>
  );
};
