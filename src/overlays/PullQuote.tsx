import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {FONTS, FontName} from "../fonts";
import {PullQuoteOverlay} from "../timeline/types";
import {Cue} from "./falak/common";

// A quote set the way a magazine sets a pull quote, not as a UI card: big serif words
// straight on the reel's ground beside the speaker's circle, the opening mark hung in
// the margin, the phrase that matters marked as it is spoken, and one quiet credit line
// that carries the claim tag and the source together (STYLE.md, On-screen text).
const LEFT = 92;
const RIGHT = 140; // clear of the action rail
const TOP = 760;
const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

export const PullQuote = ({
  o,
  cue,
  palette,
}: {
  o: PullQuoteOverlay;
  cue: Cue;
  palette: {ground: string; ink: string; accent: string};
}) => {
  const frame = useCurrentFrame();
  const serif = FONTS[(o.serif ?? "Instrument Serif") as FontName];
  const sans = FONTS[(o.sans ?? "Inter Tight") as FontName];
  const ink = o.ink ?? palette.ink;
  const enter = interpolate(frame, [0, 18], [0, 1], {...CLAMP, easing: Easing.out(Easing.exp)});
  const credit = interpolate(frame, [10, 26], [0, 1], {...CLAMP, easing: Easing.out(Easing.exp)});
  const markAt = o.mark ? cue(o.mark.at) : Infinity;
  const sweep = interpolate(frame, [markAt, markAt + 12], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});

  const text = o.quote.replace(/^[“"]/, "").replace(/[”"]$/, "");
  const at = o.mark ? text.indexOf(o.mark.text) : -1;
  const parts = at < 0 ? [text, "", ""] : [text.slice(0, at), o.mark!.text, text.slice(at + o.mark!.text.length)];

  return (
    <AbsoluteFill style={{backgroundColor: o.ground ?? palette.ground}}>
      <div
        style={{
          position: "absolute",
          left: LEFT,
          right: RIGHT,
          top: TOP,
          opacity: enter,
          // A slow drift keeps the still page alive without drawing the eye.
          transform: `translateY(${(1 - enter) * 24 - frame * 0.12}px)`,
        }}
      >
        <div
          style={{
            position: "relative",
            fontFamily: serif,
            fontWeight: 400,
            fontSize: o.size ?? 104,
            lineHeight: 1.08,
            letterSpacing: -0.5,
            color: ink,
            // Even line lengths: no single word left stranded on the last line.
            textWrap: "balance",
          }}
        >
          <span style={{position: "absolute", left: "-0.42em", top: 0}}>“</span>
          {parts[0]}
          <span
            style={{
              backgroundImage: `linear-gradient(transparent 58%, ${palette.accent}66 58%, ${palette.accent}66 92%, transparent 92%)`,
              backgroundRepeat: "no-repeat",
              backgroundSize: `${sweep * 100}% 100%`,
              WebkitBoxDecorationBreak: "clone",
              boxDecorationBreak: "clone",
              fontStyle: "italic",
            }}
          >
            {parts[1]}
          </span>
          {parts[2]}”
        </div>
        <div style={{marginTop: 34, opacity: credit, fontFamily: sans, color: ink}}>
          <div style={{fontWeight: 700, fontSize: 34}}>— {o.who}</div>
          <div style={{fontWeight: 600, fontSize: 28, opacity: 0.62, marginTop: 6}}>
            {o.tag} · {o.source}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
