import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {QHookOverlay} from "../../timeline/qiblaTypes";
import {Cue} from "../falak/common";
import {project, viewAt} from "./earth";
import {Earth3D} from "./Earth3D";
import {INK, KAABA, PAPER, QIBLA, SANS, SIDE, TEXT_TOP, WASHINGTON} from "./look";
import {Arrow, Chip, Dial, land, Pin, Tag} from "./parts";
import {FLAT_MERC, PathLine, rhumb} from "./QiblaEarth";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// The classroom map in the hook, framed lower than the paper header.
const HOOK_VIEW = viewAt([0.03, 0.6], [540, 1080], 2.75);
const LINE = rhumb(WASHINGTON, KAABA);

// Lines 1-2 over the voice, the speaker off screen. Frame 0 is the thumbnail: worshippers
// in the Islamic Center of Washington under a compass whose needle is already swinging.
export const QHook = ({o, cue}: {o: QHookOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const lock = cue(o.lockAt);
  const minaret = cue(o.minaretAt);
  const map = cue(o.mapAt);
  const locked = frame >= lock;

  const title = (
    <div style={{position: "absolute", top: TEXT_TOP, left: SIDE, right: SIDE}}>
      <Tag text={o.tag} color="#FFFFFF" size={32} style={{textShadow: "0 2px 12px rgba(0,0,0,0.6)"}} />
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 150,
          lineHeight: 0.95,
          letterSpacing: -5,
          color: locked ? QIBLA : "#FFFFFF",
          marginTop: 16,
          textShadow: "0 6px 30px rgba(0,0,0,0.55)",
          transform: `scale(${locked ? land(frame, lock, 1.14, 4) : 1})`,
          transformOrigin: "left center",
        }}
      >
        {o.line}
      </div>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, color: "#FFFFFF", marginTop: 14, textShadow: "0 3px 14px rgba(0,0,0,0.6)"}}>{o.sub}</div>
    </div>
  );

  if (frame < minaret) {
    // The needle swings from frame 0 and locks on the mosque's bearing on "north-east".
    const swing = interpolate(frame, [0, lock], [-75, 56.5], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
    const settle = locked ? 7 * Math.sin((frame - lock) * 1.1) * Math.exp(-(frame - lock) / 4) : 0;
    // On the lock the picture jumps in on the mihrab, the wall that faces the qibla: a new
    // picture for the eye, not only the needle and the word changing colour.
    const push = interpolate(frame, [0, minaret], [1.08, 1.16], CLAMP);
    const jump = interpolate(frame, [lock, lock + 3], [1, 1.7], {...CLAMP, easing: Easing.out(Easing.cubic)});
    return (
      <AbsoluteFill style={{backgroundColor: INK}}>
        <Img
          src={staticFile("footage/qb-worshipers.jpg")}
          style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 50%", transform: `scale(${push * jump})`, transformOrigin: "43% 40%"}}
        />
        <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(10,20,38,0.78) 0%, rgba(10,20,38,0.35) 32%, rgba(10,20,38,0.45) 100%)"}} />
        <Dial cx={540} cy={1060} r={380} needle={swing + settle} ink="#FFFFFF" needleColor={locked ? QIBLA : "#FFFFFF"} face="rgba(10,20,38,0.25)" />
        {title}
      </AbsoluteFill>
    );
  }

  if (frame < map) {
    // Hard cut to the mosque itself: its minaret in daylight, the arrow drawn up and to the right.
    const push = interpolate(frame, [minaret, map], [1.04, 1.12], CLAMP);
    return (
      <AbsoluteFill style={{backgroundColor: INK}}>
        <Img src={staticFile("footage/qb-minaret.jpg")} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%", transform: `scale(${push})`}} />
        <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(10,20,38,0.7) 0%, rgba(10,20,38,0) 30%)"}} />
        <Arrow x1={250} y1={1300} x2={820} y2={760} at={minaret + 2} frames={8} width={22} />
        <Chip size={40} dark style={{left: 120, top: 1330 - 70}}>ISLAMIC CENTER · WASHINGTON DC</Chip>
        {title}
      </AbsoluteFill>
    );
  }

  // Hard cut to the classroom map: the straight line to Makkah runs down and to the
  // right, and the qibla arrow points the other way.
  const lineAt = cue(o.lineAt);
  const seAt = cue(o.seAt);
  const draw = interpolate(frame, [lineAt, lineAt + 10], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  // The map settles after the cut, punches in as the line starts to draw, and snaps back
  // out when SOUTH-EAST lands, so both directions sit in one wide picture.
  const zoom =
    interpolate(frame, [map, map + 40], [1.06, 1], {...CLAMP, easing: Easing.out(Easing.cubic)}) *
    interpolate(frame, [lineAt, lineAt + 4], [1, 1.18], {...CLAMP, easing: Easing.out(Easing.cubic)}) *
    interpolate(frame, [seAt, seAt + 4], [1, 0.8], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const view = {...HOOK_VIEW, width: HOOK_VIEW.width / zoom};
  const dc = project(WASHINGTON, FLAT_MERC, view);
  const mk = project(KAABA, FLAT_MERC, view);
  return (
    <AbsoluteFill style={{backgroundColor: PAPER}}>
      <Earth3D state={FLAT_MERC} view={view} />
      <PathLine points={LINE} state={FLAT_MERC} view={view} upTo={draw} color="#FFFFFF" width={12} />
      <Pin x={dc.x} y={dc.y} at={map} size={30} />
      <Pin x={mk.x} y={mk.y} at={map + 4} size={30} />
      <Chip size={36} dark style={{left: Math.max(24, dc.x - 60), top: dc.y + 30}}>WASHINGTON</Chip>
      <Chip size={36} dark style={{left: mk.x - 200, top: mk.y + 30}}>MAKKAH</Chip>
      {frame >= seAt ? <Arrow x1={dc.x} y1={dc.y} x2={dc.x + 150} y2={dc.y - 150} at={seAt} frames={5} width={16} /> : null}
      <div style={{position: "absolute", left: SIDE - 24, top: TEXT_TOP - 20, padding: "18px 26px 22px", backgroundColor: "rgba(243,238,228,0.95)", borderRadius: 16}}>
        <Tag text="THE MAP SAYS" />
        {frame >= seAt ? (
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 132,
            lineHeight: 0.95,
            letterSpacing: -4,
            color: INK,
            marginTop: 10,
            transform: `scale(${land(frame, seAt, 1.16, 4)})`,
            transformOrigin: "left center",
          }}
        >
          SOUTH-EAST
        </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
