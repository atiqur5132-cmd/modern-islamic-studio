import {AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from "remotion";
import {KHookOverlay} from "../../timeline/kasawnaTypes";
import {Cue} from "../falak/common";
import {STACK_HEIGHT, STACK_MOVE_FRAMES} from "../yawm/look";
import {ACCENT, arrive, draw, GROUND, INK, SERIF, SIDE, starParts} from "./look";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const BOARD = 1920 - STACK_HEIGHT;
// Where the drop lands, in the board (the crown in the footage).
const CROWN = {x: 520, y: 610};

// The hook (beat 1): the creator in the top window from frame 0; below, a single drop
// already falling, with the opening line. On "boond" it lands in a crown and the words
// are underlined; on the cut the shot jumps tight; then the picture shrinks to a point
// of light on the dark page, and a fine ring marks where it almost vanishes.
export const KHook = ({o, cue}: {o: KHookOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, STACK_MOVE_FRAMES], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const markAt = cue(o.markAt);
  const tightAt = cue(o.tightAt);
  const pointAt = cue(o.pointAt);
  const ringAt = cue(o.ringAt);
  // Frame 0 is already on the drop's crown, a little enlarged so it reads at thumbnail
  // size; on the creator's cut the shot jumps tight (a cut, not a zoom).
  const tight = frame >= tightAt ? 1.75 + (frame - tightAt) * 0.004 : 1.25 + frame * 0.0015;
  const shrink = interpolate(frame, [pointAt, pointAt + 14], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const radius = 1300 * (1 - shrink) + 9 * shrink;
  const ring = arrive(frame, ringAt, 14);
  const parts = starParts(o.line);
  const line = arrive(frame, 0, 8);
  const underline = draw(frame, markAt, 12);
  return (
    <AbsoluteFill style={{transform: `translateY(${(1 - rise) * BOARD}px)`}}>
      <div style={{position: "absolute", top: STACK_HEIGHT, left: 0, right: 0, bottom: 0, overflow: "hidden", backgroundColor: GROUND}}>
        <div style={{position: "absolute", inset: 0, clipPath: `circle(${radius}px at ${CROWN.x}px ${CROWN.y}px)`}}>
          <OffthreadVideo
            muted
            src={staticFile(`footage/${o.src}`)}
            trimBefore={Math.round(o.trim * 30)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "48% 50%",
              transform: `scale(${tight})`,
              transformOrigin: `${CROWN.x}px ${CROWN.y}px`,
              filter: "saturate(0.8) sepia(0.12)",
            }}
          />
        </div>
        {shrink >= 1 ? (
          <svg width={1080} height={BOARD} style={{position: "absolute", left: 0, top: 0}}>
            <circle cx={CROWN.x} cy={CROWN.y} r={9} fill={INK} />
            <circle cx={CROWN.x} cy={CROWN.y} r={34 + 26 * ring} fill="none" stroke={ACCENT} strokeWidth={3} opacity={ring} />
          </svg>
        ) : null}
        {/* The line sits on a soft shade from the ground, so it reads over the water. */}
        <AbsoluteFill style={{background: `linear-gradient(180deg, ${GROUND}E6 0%, ${GROUND}99 22%, ${GROUND}00 40%)`}} />
        <div
          style={{
            position: "absolute",
            left: SIDE,
            right: SIDE,
            top: 46,
            fontFamily: SERIF,
            fontWeight: 500,
            fontSize: 104,
            lineHeight: 1.04,
            letterSpacing: -1,
            color: INK,
            opacity: line,
          }}
        >
          {parts.map((part, i) =>
            part.text === "\n" ? (
              <br key={i} />
            ) : part.italic ? (
              <span
                key={i}
                style={{
                  fontStyle: "italic",
                  backgroundImage: `linear-gradient(transparent 90%, ${ACCENT} 90%, ${ACCENT} 97%, transparent 97%)`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: `${underline * 100}% 100%`,
                }}
              >
                {part.text}
              </span>
            ) : (
              <span key={i}>{part.text}</span>
            ),
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
