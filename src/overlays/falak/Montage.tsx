import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {GOLD, IVORY, LATIN_FONT, NAVY, SAFE_AREA} from "../../theme";
import {Cue, rise} from "./common";

const PUSH_FROM = 1.16;
const PUSH_TO = 1.02;

// G2. Quick cuts, one photograph per word as it is spoken (night, day, the Sun,
// the Moon), each pushing in fast so the cut lands on movement. `zoom` and `focusY`
// let a shot crop away what must not show, such as a date stamp in a corner;
// `contain` shows a whole subject on black (a full solar disc) instead of filling.
export const Montage = ({
  tag,
  shots,
  cue,
}: {
  tag: string;
  shots: {src: string; at: number; zoom?: number; focusY?: number; contain?: boolean}[];
  cue: Cue;
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const starts = shots.map((s) => Math.max(0, cue(s.at)));
  const current = starts.reduce((last, f, i) => (frame >= f ? i : last), 0);
  const shot = shots[current];
  const from = starts[current];
  const to = current + 1 < shots.length ? starts[current + 1] : durationInFrames;
  const push = interpolate(frame, [from, to], [PUSH_FROM, PUSH_TO], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const label = rise(frame, 4, 12);

  return (
    <AbsoluteFill style={{backgroundColor: shot.contain ? "#000" : NAVY, overflow: "hidden"}}>
      <Img
        src={staticFile(`footage/${shot.src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: shot.contain ? "contain" : "cover",
          transformOrigin: `50% ${shot.focusY ?? 50}%`,
          transform: `scale(${push * (shot.zoom ?? 1)})`,
        }}
      />
      {/* Shade top and foot, so the label and the captions read on any picture. */}
      <AbsoluteFill
        style={{background: `linear-gradient(180deg, ${NAVY}99 0%, transparent 22%, transparent 52%, ${NAVY}D9 100%)`}}
      />
      <div
        style={{
          position: "absolute",
          top: SAFE_AREA.top,
          left: SAFE_AREA.side,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: LATIN_FONT,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 4,
          color: IVORY,
          opacity: 0.9 * label,
        }}
      >
        <div style={{width: 10, height: 10, borderRadius: 5, backgroundColor: GOLD}} />
        {tag}
      </div>
    </AbsoluteFill>
  );
};
