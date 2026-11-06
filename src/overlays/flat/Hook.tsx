import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {FlatHookOverlay} from "../../timeline/flatTypes";
import {Cue} from "../falak/common";
import {arrive, INK, MARK, RAIL, SAND, SANS, SIDE, TEXT_TOP} from "./look";
import {Disc, Globe, Post, Stamp, Tag} from "./parts";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// Lines 1-2 over the voice, the speaker off screen. Frame 0 is the thumbnail: the
// flat-earth map filling the frame with the claim over it, already pushing in.
export const FlatHook = ({hook, cue}: {hook: FlatHookOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const cut = cue(hook.eggPost.at);
  return (
    <AbsoluteFill style={{backgroundColor: SAND}}>
      {frame < cut ? <FlatHalf hook={hook} cue={cue} end={cut} /> : <EggHalf hook={hook} cue={cue} cut={cut} end={durationInFrames} />}
    </AbsoluteFill>
  );
};

const FlatHalf = ({hook, cue, end}: {hook: FlatHookOverlay; cue: Cue; end: number}) => {
  const frame = useCurrentFrame();
  const punch = cue(hook.punchAt);
  const post = cue(hook.flatPost.at);
  // A steady push from frame 0, and a jump closer on "flat".
  const push = interpolate(frame, [0, end], [1.0, 1.1], CLAMP);
  const jump = interpolate(frame, [punch, punch + 3], [1, 1.16], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const tilt = interpolate(frame, [0, end], [-5, -1.5], CLAMP);
  const lineIn = interpolate(frame, [punch, punch + 3], [1, 1.12], CLAMP) * interpolate(frame, [punch + 3, punch + 8], [1, 1 / 1.12], CLAMP);
  const postIn = arrive(frame, post, 10);
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: -500, right: -500, top: 600, display: "flex", justifyContent: "center"}}>
        <Disc width={2050} style={{transform: `scale(${push * jump}) rotate(${tilt}deg)`, transformOrigin: "50% 50%"}} />
      </div>
      <div style={{position: "absolute", top: TEXT_TOP, left: SIDE, right: SIDE}}>
        <Tag text={hook.tag} color={MARK} />
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 168,
            lineHeight: 0.95,
            letterSpacing: -5,
            color: INK,
            marginTop: 18,
            transform: `scale(${lineIn})`,
            transformOrigin: "left center",
          }}
        >
          {hook.line}
        </div>
      </div>
      {frame >= post ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1010,
            display: "flex",
            justifyContent: "center",
            opacity: Math.min(1, postIn * 2),
            transform: `translateY(${(1 - postIn) * 420}px) rotate(${-2 * postIn}deg)`,
          }}
        >
          <Post headline={<span style={{fontSize: 62}}>{hook.flatPost.headline}</span>} width={900} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Three hard cuts, each a new picture for the eye (QUALITY §1: not one layout decorating
// itself): the real eggs full-bleed under the post; the egg and the Earth split down the
// middle; then the claim drawn, the Earth stretched into an egg.
const EggHalf = ({hook, cue, cut, end}: {hook: FlatHookOverlay; cue: Cue; cut: number; end: number}) => {
  const frame = useCurrentFrame();
  const split = cue(hook.snapAt);
  const claim = cue(hook.marksAt);
  const land = (at: number) => interpolate(frame, [at, at + 6], [1.08, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const drift = (from: number, to: number) => interpolate(frame, [from, to], [1, 1.06], CLAMP);

  if (frame >= claim) {
    const stretch = interpolate(frame, [claim, claim + 8], [1, 1.28], {...CLAMP, easing: Easing.out(Easing.back(1.6))});
    return (
      <AbsoluteFill style={{backgroundColor: SAND}}>
        <div style={{position: "absolute", top: TEXT_TOP, left: SIDE, right: SIDE}}>
          <Tag text={hook.tag} color={MARK} />
          <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 150, lineHeight: 0.95, letterSpacing: -4, color: INK, marginTop: 14, transform: `scale(${land(claim)})`, transformOrigin: "left top"}}>
            EARTH = EGG?
          </div>
        </div>
        <div style={{position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
          <div style={{transform: `scale(${drift(claim, end)}) scaleY(${stretch})`, transformOrigin: "50% 40%"}}>
            <Globe size={560} style={{boxShadow: "0 30px 60px rgba(27,27,27,0.3)"}} />
          </div>
        </div>
        <Stamp text="?" at={claim + 6} size={190} rotate={-10} style={{left: 640, top: 760}} />
      </AbsoluteFill>
    );
  }

  const post = (
    <>
      <div style={{position: "absolute", left: SIDE, top: 190}}>
        <Tag text={hook.tag} color={MARK} />
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: TEXT_TOP + 14, display: "flex", justifyContent: "center", transform: `scale(${frame < split ? land(cut) : 1})`}}>
        <Post headline={<span style={{fontSize: 62}}>{hook.eggPost.headline}</span>} width={940} />
      </div>
    </>
  );

  if (frame >= split) {
    const label = {position: "absolute" as const, top: 1150, fontFamily: SANS, fontWeight: 900, fontSize: 64, letterSpacing: 3, color: "#FFFFFF", textShadow: "0 4px 16px rgba(0,0,0,0.6)"};
    return (
      <AbsoluteFill style={{backgroundColor: "#000"}}>
        <div style={{position: "absolute", left: 0, top: 0, width: 540, height: 1920, overflow: "hidden"}}>
          <Img src={staticFile("footage/fe-egg.jpg")} style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${land(split) * drift(split, claim)})`}} />
        </div>
        <div style={{position: "absolute", left: 540, top: 0, width: 540, height: 1920, overflow: "hidden", backgroundColor: "#05070C"}}>
          <div style={{position: "absolute", left: -250, top: 520, transform: `scale(${land(split) * drift(split, claim)})`}}>
            <Globe size={1040} />
          </div>
        </div>
        <div style={{position: "absolute", left: 537, top: 0, width: 6, height: 1920, backgroundColor: SAND}} />
        <div style={{...label, left: SIDE}}>EGG</div>
        <div style={{...label, right: RAIL}}>EARTH</div>
        {post}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      <Img
        src={staticFile("footage/fe-eggs.jpg")}
        style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "45% 60%", transform: `scale(${land(cut) * drift(cut, split)})`}}
      />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(239,228,207,0.85) 0%, transparent 30%)"}} />
      {post}
    </AbsoluteFill>
  );
};
