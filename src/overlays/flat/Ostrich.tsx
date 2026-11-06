import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {EggCheckOverlay, NestOverlay} from "../../timeline/flatTypes";
import {Cue} from "../falak/common";
import {arrive, CARD, INK, MARK, MUTED, SAND, SANS, SIDE, TEXT_TOP} from "./look";
import {Credit, Egg, Strike, Tag, Term} from "./parts";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// "Kehte hain, matlab shutur-murg ka anda. Par iska matlab bhi hai phailana": the egg
// as the claim labels it, a lexicon card over it, and EGG struck for SPREAD OUT.
export const EggCheck = ({e, cue}: {e: EggCheckOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const lexicon = arrive(frame, cue(e.lexiconAt), 12);
  const strike = cue(e.strikeAt);
  const spread = arrive(frame, strike + 4, 10);
  const drift = interpolate(frame, [0, 120], [1, 1.05], CLAMP);
  return (
    <AbsoluteFill style={{backgroundColor: SAND}}>
      <div style={{position: "absolute", top: TEXT_TOP, left: SIDE, right: SIDE}}>
        <Tag text={e.tag} />
        <div style={{display: "flex", alignItems: "baseline", gap: 30, marginTop: 14}}>
          <span style={{position: "relative", fontFamily: SANS, fontWeight: 900, fontSize: 120, letterSpacing: 2, color: INK}}>
            EGG
            <Strike at={strike} />
          </span>
          <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 84, color: MARK, opacity: spread, transform: `translateY(${(1 - spread) * 12}px)`, display: "inline-block"}}>
            SPREAD OUT
          </span>
        </div>
      </div>
      <div style={{position: "absolute", top: 440, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${drift})`}}>
        <Egg width={600} gray={false} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 140,
          top: 930,
          padding: "26px 34px",
          backgroundColor: CARD,
          border: `3px solid ${INK}`,
          borderRadius: 16,
          boxShadow: "0 18px 36px rgba(27,27,27,0.22)",
          opacity: lexicon,
          transform: `translateX(${(1 - lexicon) * 700}px) rotate(${1.5 * lexicon}deg)`,
        }}
      >
        <Term term={e.term} meaning={e.meaning} size={72} />
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, lineHeight: 1.3, color: MUTED, marginTop: 10}}>{e.source}</div>
      </div>
      <Credit text="Photo: Pexels 33128657" style={{right: 140, top: 1160}} />
    </AbsoluteFill>
  );
};

// The real nest scrape, the speaker in the circle. EGG fades on "ande ka nahi"; NEST
// lands on "nest".
export const Nest = ({n, cue}: {n: NestOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const nest = cue(n.nestAt);
  const nestIn = arrive(frame, nest, 8);
  const eggOut = interpolate(frame, [nest - 20, nest - 12], [1, 0.25], CLAMP);
  const push = interpolate(frame, [0, 110], [1.0, 1.08], CLAMP);
  return (
    <AbsoluteFill style={{backgroundColor: "#000", overflow: "hidden"}}>
      <Img src={staticFile("footage/fe-nest.jpg")} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "38% 50%", transform: `scale(${push})`}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 30%)"}} />
      <div style={{position: "absolute", top: TEXT_TOP, left: SIDE}}>
        <Tag text={n.tag} color={CARD} />
      </div>
      {/* Labels on the picture: the eggs, then the scrape around them. */}
      <div style={{position: "absolute", left: 120, top: 1000, opacity: eggOut, fontFamily: SANS, fontWeight: 900, fontSize: 56, letterSpacing: 3, color: CARD}}>
        EGG
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 140,
          top: 760,
          opacity: nestIn,
          transform: `scale(${1.2 - 0.2 * nestIn})`,
          transformOrigin: "left center",
        }}
      >
        <div style={{display: "inline-block", padding: "10px 26px 14px", backgroundColor: MARK, color: CARD, borderRadius: 12, fontFamily: SANS, fontWeight: 900, fontSize: 84, letterSpacing: 4}}>
          NEST
        </div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 52, color: CARD, marginTop: 12, textShadow: "0 3px 12px rgba(0,0,0,0.6)"}}>{n.line}</div>
      </div>
      <Credit text="Photo: Pexels 25650573" color={`${CARD}CC`} style={{right: 140, top: 1160}} />
    </AbsoluteFill>
  );
};
