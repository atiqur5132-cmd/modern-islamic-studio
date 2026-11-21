import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {Chip} from "./art";
import {camAt, Move} from "./camera";
import {GiftIcon, ShieldIcon} from "./icons";
import {Pop, Words} from "./kit";
import {CH, CLAMP, drop, fade, grow, HOOK, pop, SANS, sec} from "./look";
import {baseStudio, StudioState} from "./Studio3D";

// The ending (353.7–386.7 s): back in the teal studio with the card, the bank's bet, the
// three-word job, the DEADBEAT tag worn proudly, and the card turning to the channel name.
const P = CH.hook;

export const OUTRO_3D: [number, number] = [353.7, 386.7];

const MOVES: Move[] = [
  {at: 353.7, pos: [0, 2.2, 10.5], target: [0, 1.2, 0], fov: 32},
  {at: 354.0, frames: sec(5), pos: [0.3, 2.4, 9.6], target: [0, 1.15, 0]},
  {at: 359.0, frames: 50, pos: [-0.3, 2.0, 8.6], target: [0, 1.2, 0]},
  {at: 362.2, frames: 40, pos: [0.9, 1.7, 7.4], target: [0.9, 1.3, 0]},
  {at: 367.6, frames: 40, pos: [-1.0, 1.6, 7.4], target: [-1.0, 1.25, 0]},
  {at: 375.8, frames: 45, pos: [0, 1.3, 6.2], target: [0, 1.15, 0]},
  {at: 378.4, frames: 130, pos: [0, 1.25, 5.6], target: [0, 1.15, 0]},
];

const GIFT_TIMES = [357.4, 357.55, 357.7, 357.85, 358.0, 358.15];

export const outroState = (frame: number): StudioState => {
  const turn = interpolate(frame, [sec(376.1), sec(377.4)], [0, Math.PI], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const slip = interpolate(frame, [sec(366.4), sec(366.9), sec(367.9)], [0, 1, 0], {...CLAMP, easing: Easing.inOut(Easing.quad)});
  const enter = interpolate(frame, [sec(353.7), sec(355.0)], [-Math.PI * 1.5, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const s = baseStudio(camAt(frame, MOVES), {pos: [0, 1.27 - slip * 0.35, 0], rot: [0, enter - 0.15 + Math.sin(frame / 40) * 0.08 + turn, -slip * 0.45]});
  s.gifts = GIFT_TIMES.map((g) => drop(frame, g, 18));
  s.giftSink = grow(frame, 375.6, 20);
  s.tag = {k: pop(frame, 372.9, 16) * fade(frame, 375.8, 14), flip: 0, front: "deadbeat", back: "deadbeat"};
  const late = frame > sec(380);
  s.sweep = late ? interpolate(frame, [sec(381.2), sec(382.7)], [1.2, -1.2], CLAMP) : interpolate(frame, [sec(355.5), sec(357.0)], [-1.2, 1.2], CLAMP);
  s.sweepPower = late ? grow(frame, 381.1, 8) * fade(frame, 382.7, 10) : grow(frame, 355.4, 8) * fade(frame, 357.0, 10);
  return s;
};

export const OutroOverlay = () => {
  const frame = useCurrentFrame();
  const score = pop(frame, 374.2, 16) * fade(frame, 375.9, 12);
  const click = grow(frame, 383.7, 6);
  const end = fade(frame, 386.0, 14);
  return (
    <AbsoluteFill style={{opacity: end}}>
      <Words at={357.6} x={960} y={110} align="center" size={56} color={P.ink} out={360.6}>
        a mountain of free points
      </Words>
      <Words at={360.8} x={960} y={110} align="center" size={60} color={P.ink} serif out={363.3}>
        They aren't being generous.
      </Words>
      <Pop at={363.4} x={1640} y={400} out={367.5}>
        <Chip a={CH.revolve.accent} ink={P.ink} size={210} />
      </Pop>
      <Words at={363.6} x={1640} y={540} align="center" size={48} color={P.ink} out={367.5}>
        a calculated bet
      </Words>
      <Words at={365.7} x={1640} y={610} align="center" size={42} color={CH.revolve.accent} out={367.5}>
        you'll overspend or slip up
      </Words>
      <Pop at={369.9} x={300} y={190} out={375.6}>
        <GiftIcon size={170} color={P.accent} />
      </Pop>
      <Words at={370.0} x={300} y={290} align="center" size={44} color={P.ink} out={375.6}>
        take the perks
      </Words>
      <Pop at={370.8} x={300} y={430} out={375.6}>
        <ShieldIcon size={160} color={P.ink} />
      </Pop>
      <Words at={370.9} x={300} y={530} align="center" size={44} color={P.ink} out={375.6}>
        protect your cash
      </Words>
      {score > 0 ? (
        <div style={{position: "absolute", left: 960, top: 110, transform: `translate(-50%,-50%) scale(${score})`, display: "flex", alignItems: "center", gap: 26, padding: "18px 34px", background: "rgba(255,255,255,0.8)", borderRadius: 22, boxShadow: "0 18px 50px rgba(19,48,46,0.14)", fontFamily: SANS}}>
          <span style={{fontWeight: 800, fontSize: 36, color: P.ink, letterSpacing: 4}}>YOU</span>
          {["1", ":", "0"].map((c, i) => (
            <span key={i} style={{width: c === ":" ? 20 : 96, height: 120, borderRadius: 12, background: c === ":" ? "transparent" : P.ink, color: c === ":" ? P.inkSoft : "#f2f6f5", fontWeight: 800, fontSize: 96, display: "flex", alignItems: "center", justifyContent: "center"}}>
              {c}
            </span>
          ))}
          <span style={{fontWeight: 800, fontSize: 36, color: P.ink, letterSpacing: 4}}>BANK</span>
        </div>
      ) : null}
      <Words at={378.0} x={960} y={60} align="center" size={46} color={P.inkSoft} out={385.8}>
        the hidden rules of money
      </Words>
      {frame >= sec(382.8) ? (
        <div style={{position: "absolute", left: 960, top: 930, transform: `translate(-50%,-50%) scale(${pop(frame, 382.9) * (1 - 0.06 * Math.sin(click * Math.PI))})`, display: "flex", alignItems: "center", gap: 18, padding: "22px 46px", borderRadius: 60, background: click > 0.5 ? P.inkSoft : "#d6342c", color: "#fff", fontFamily: SANS, fontWeight: 800, fontSize: 46, boxShadow: "0 18px 40px rgba(0,0,0,0.2)"}}>
          {click > 0.5 ? "Subscribed ✓" : "Subscribe"}
        </div>
      ) : null}
      {frame >= sec(383.1) && frame < sec(384.6) ? (
        <svg width={70} height={90} viewBox="0 0 70 90" style={{position: "absolute", left: interpolate(frame, [sec(383.1), sec(383.6)], [1250, 1040], {...CLAMP, easing: Easing.out(Easing.cubic)}), top: interpolate(frame, [sec(383.1), sec(383.6)], [1040, 950], {...CLAMP, easing: Easing.out(Easing.cubic)}), filter: "drop-shadow(0 6px 8px rgba(0,0,0,0.3))"}}>
          <path d="M6 4 L6 66 L22 52 L34 80 L46 74 L34 48 L56 46 Z" fill="#fff" stroke={HOOK.ink} strokeWidth={4} strokeLinejoin="round" />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

export const OUTRO_CUES = [
  {at: 353.8, sound: "whoosh-3", volume: 0.2},
  {at: 355.5, sound: "tick-soft-1", volume: 0.2},
  {at: 357.5, sound: "cloth", volume: 0.26},
  {at: 360.8, sound: "tick-soft-2", volume: 0.22},
  {at: 363.4, sound: "tick", volume: 0.26},
  {at: 366.4, sound: "whoosh", volume: 0.16},
  {at: 369.9, sound: "tick-soft-3", volume: 0.22},
  {at: 370.8, sound: "tick-soft-1", volume: 0.22},
  {at: 372.9, sound: "paper-slide-1", volume: 0.28},
  {at: 374.2, sound: "tick", volume: 0.28},
  {at: 376.1, sound: "whoosh-2", volume: 0.18},
  {at: 382.9, sound: "tick-soft-2", volume: 0.24},
  {at: 383.7, sound: "tick", volume: 0.3},
];
