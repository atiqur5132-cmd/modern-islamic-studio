import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {Cues} from "../long/scroll/types";
import {arrive, INK, MUTED, SANS, SERIF, SIDE, snap, TEXT_TOP} from "./look";
import {Credit, Label, Line} from "./parts";
import {lerp3, Space3D, SpaceState, V3} from "./Space3D";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ease = Easing.inOut(Easing.cubic);
const t01 = (frame: number, a: number, b: number, e: (t: number) => number = ease) => interpolate(frame, [a, b], [0, 1], {...CLAMP, easing: e});

// The sky's fixed places: the Moon at the origin, the Sun up and away to the left.
const MOON: V3 = [0, 0, 0];
const SUN: V3 = [-16, 9, -30];
const SUN_TO_MOON = Math.hypot(16, 9, 30); // 35.2
const MID: V3 = [-8, 4.5, -15];
// A camera far to the side of the Sun-Moon line, rolled so the Sun is at the top.
const SIDE_CAM: V3 = [-8 - 0.88 * 60, 4.5, -15 + 0.47 * 60];
const UP_SUN: V3 = [-16 / SUN_TO_MOON, 9 / SUN_TO_MOON, -30 / SUN_TO_MOON];

// Line 1, in the 3D sky. Every beat moves most of the frame (study_reel.py counts only
// those). 0.0: the full Moon big on the right, the Sun burning at the top left.
// "bujh": the Sun flares and dies; its last light leaves as a ring. "aath": cut wide, side
// on, the Sun dead at the top, the Moon below, the ring travelling down to it under 08:20.
// "bujh jaayega": cut close, the Moon goes dark as the ring passes.
export const Hook3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const off = cues.word(1, 2);
  const wideAt = cues.word(1, 8) - 2;
  const closeAt = cues.word(1, 11) - 2;
  const darkAt = closeAt + 4;
  const flare = frame < off ? 1 : frame < off + 2 ? 1.9 : Math.max(0, 1.9 - 0.6 * (frame - off - 2));
  // The ring leaves the Sun at "bujh" and reaches the Moon at darkAt.
  const ringR = interpolate(frame, [off + 2, darkAt], [9.2, SUN_TO_MOON], CLAMP);
  const left = Math.round(interpolate(frame, [wideAt + 3, darkAt], [500, 0], CLAMP));
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  let s: SpaceState;
  if (frame < wideAt) {
    const k = t01(frame, 0, wideAt, (t) => t);
    s = {
      cam: lerp3([2.6, -0.4, 11.6], [2.2, -0.3, 10.4], k),
      target: [-1.9, 1.6, 0],
      moon: {pos: MOON, r: 3, light: 1, spin: 0.3},
      sun: {pos: SUN, r: 4.6, power: flare, dead: true},
      lightFrom: [-30, 12, 40],
      shell: {r: ringR, opacity: frame > off ? 0.9 : 0},
    };
  } else if (frame < closeAt) {
    const k = t01(frame, wideAt, closeAt, (t) => t);
    s = {
      cam: lerp3(SIDE_CAM, [SIDE_CAM[0] * 0.92 - 0.6, SIDE_CAM[1], SIDE_CAM[2] * 0.92], k),
      target: MID,
      up: UP_SUN,
      fov: 40,
      moon: {pos: MOON, r: 3, light: 1, spin: 0.3},
      sun: {pos: SUN, r: 4.6, power: 0, dead: true},
      lightFrom: SUN,
      shell: {r: ringR, opacity: 1},
    };
  } else {
    const k = t01(frame, closeAt, closeAt + 20, (t) => t);
    s = {
      cam: lerp3([1.4, 0.5, 8.2], [1.2, 0.45, 7.6], k),
      target: [0.2, 0.1, 0],
      moon: {pos: MOON, r: 3, light: 1 - t01(frame, darkAt, darkAt + 9, (t) => t), spin: 0.3},
      sun: {pos: SUN, r: 4.6, power: 0, dead: true},
      lightFrom: [-30, 12, 40],
      shell: {r: ringR, opacity: frame < darkAt + 6 ? 0.7 : 0},
    };
  }
  const titleIn = 1;
  return (
    <AbsoluteFill>
      <Space3D s={s} time={frame / 30} />
      {frame < wideAt ? (
        <div style={{position: "absolute", left: SIDE, right: SIDE + 40, top: TEXT_TOP - 4, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 88, lineHeight: 1.04, color: INK, opacity: titleIn, textShadow: "0 2px 18px rgba(8,10,16,0.8)"}}>
          If the Sun went out now…
        </div>
      ) : null}
      {frame >= wideAt ? (
        <>
          <div style={{position: "absolute", left: 0, right: 0, top: TEXT_TOP - 30, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 176, letterSpacing: 2, fontVariantNumeric: "tabular-nums", color: left === 0 ? MUTED : INK, opacity: snap(frame, wideAt, 4), transform: `scale(${1.18 - 0.18 * snap(frame, wideAt, 6)})`, textShadow: "0 4px 24px rgba(8,10,16,0.85)"}}>
            {mm}:{ss}
          </div>
          <div style={{position: "absolute", left: 0, right: 0, top: TEXT_TOP + 190, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 38, color: INK, opacity: 0.8 * snap(frame, wideAt, 6), textShadow: "0 2px 12px rgba(8,10,16,0.9)"}}>
            the last sunlight, on its way to the Moon
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// Line 2. Cut to the Moon's lit face close up; on "nahi hai" the light goes out of it (it
// has none of its own); on "suraj" sunlight sweeps back across it from the side, the
// terminator moving over the craters; on "lautata" the camera pulls back to the whole
// half-lit Moon with the Sun beside it.
export const NoLight3D = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const titleAt = cues.word(2, 4);
  const darkAt = cues.word(2, 6);
  const sunAt = cues.word(2, 10) - 4;
  const backAt = cues.word(2, 13);
  const dark = snap(frame, darkAt, 6);
  const sweep = t01(frame, sunAt, sunAt + 16, (t) => 1 - Math.pow(1 - t, 3));
  const pull = t01(frame, backAt, backAt + 18, (t) => 1 - Math.pow(1 - t, 4));
  // The light comes from in front before "nahi", then from behind the Moon, and swings
  // round to the side as the Sun returns.
  const lightFrom: V3 = frame < sunAt ? [-20, 14, 40] : lerp3([-44, 8, -46], [-24, 12, 44], sweep);
  const light = frame < sunAt ? 1 - dark * 0.98 : 0.02 + 0.98 * t01(frame, sunAt, sunAt + 4, (t) => t);
  const s: SpaceState = {
    cam: lerp3(lerp3([2.4, 1.9, 4.9], [2.2, 1.7, 4.5], t01(frame, 0, backAt, (t) => t)), [3.2, -2.6, 24], pull),
    target: lerp3([0.2, 1.2, 0], [-4.2, 4.2, -4], pull),
    moon: {pos: MOON, r: 3, light, spin: 0.3 + frame * 0.0008},
    sun: {pos: [-12, 7.5, -16], r: 3.4, power: frame >= sunAt ? t01(frame, sunAt, sunAt + 8, (t) => t) : 0},
    lightFrom,
  };
  return (
    <AbsoluteFill>
      <Space3D s={s} time={(frame + 120) / 30} />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(8,10,16,0.6) 0%, rgba(8,10,16,0) 24%)"}} />
      <Line at={titleAt} y={TEXT_TOP} size={94} style={{textShadow: "0 2px 18px rgba(8,10,16,0.9)"}}>No light of its own.</Line>
      <Label at={backAt + 6} x={SIDE} y={TEXT_TOP + 114} color={INK} size={38} weight={600}>only sunlight, sent back</Label>
      <Credit text="Established science · NASA, “Moonlight”" at={titleAt + 6} />
    </AbsoluteFill>
  );
};
