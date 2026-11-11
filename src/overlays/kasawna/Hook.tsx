import {AbsoluteFill, Easing, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from "remotion";
import {KHookOverlay} from "../../timeline/kasawnaTypes";
import {Cue} from "../falak/common";
import {STACK_HEIGHT, STACK_MOVE_FRAMES} from "../yawm/look";
import {ACCENT, arrive, draw, GROUND, INK, SERIF, SIDE, starParts} from "./look";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// Two framings of the same drop. "khook": the board under the speaker (the split), the
// crown at (520, 610) inside it, the line along its top. "khookpip": the drop fills the
// frame behind the speaker's circle, lifted 190 px so the crown sits at (518, 828), with
// the line low on the left, clear of the circle.
const STACK = {top: STACK_HEIGHT, height: 1920 - STACK_HEIGHT, crown: {x: 520, y: 610}, lift: 0, lineTop: 46, size: 104};
const FULL = {top: 0, height: 1920, crown: {x: 518, y: 828}, lift: -190, lineTop: 1120, size: 96};

// The hook: the creator from frame 0 with a drop's crown, the opening line. On "boond"
// the words are underlined (and the drop takes the whole frame); on the creator's cut the
// shot jumps tight; then the picture shrinks to a point of light on the dark page, and a
// fine ring marks where it almost vanishes.
export const KHook = ({o, cue}: {o: KHookOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const pip = o.type === "khookpip";
  const f = pip ? FULL : STACK;
  const rise = pip ? 1 : interpolate(frame, [0, STACK_MOVE_FRAMES], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const markAt = cue(o.markAt);
  const tightAt = cue(o.tightAt);
  const pointAt = cue(o.pointAt);
  const ringAt = cue(o.ringAt);
  // Already on the drop's crown, a little enlarged so it reads at thumbnail size; on the
  // creator's cut the shot jumps tight (a cut, not a zoom).
  const tight = frame >= tightAt ? 1.75 + (frame - tightAt) * 0.004 : 1.25 + frame * 0.0015;
  const shrink = interpolate(frame, [pointAt, pointAt + 14], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const radius = 2200 * (1 - shrink) + 9 * shrink;
  const ring = arrive(frame, ringAt, 14);
  const parts = starParts(o.line);
  // The split's line is on screen at frame 0; the full-frame line carries on from it.
  const line = pip ? 1 : arrive(frame, 0, 8);
  const underline = draw(frame, markAt, 12);
  const {crown} = f;
  return (
    <AbsoluteFill style={{transform: `translateY(${(1 - rise) * f.height}px)`}}>
      <div style={{position: "absolute", top: f.top, left: 0, right: 0, height: f.height, overflow: "hidden", backgroundColor: GROUND}}>
        <div style={{position: "absolute", inset: 0, clipPath: `circle(${radius}px at ${crown.x}px ${crown.y}px)`}}>
          <OffthreadVideo
            muted
            src={staticFile(`footage/${o.src}`)}
            trimBefore={Math.round(o.trim * 30)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "48% 50%",
              transform: `translateY(${f.lift}px) scale(${tight})`,
              transformOrigin: `${crown.x}px ${crown.y - f.lift}px`,
              // Full frame, the water is lifted toward steel blue so the shrink to the dark
              // page reads as a change of the whole picture.
              filter: pip ? "saturate(0.85) sepia(0.08) brightness(1.5) contrast(1.06)" : "saturate(0.8) sepia(0.12)",
            }}
          />
        </div>
        {shrink >= 1 ? (
          <svg width={1080} height={f.height} style={{position: "absolute", left: 0, top: 0}}>
            <circle cx={crown.x} cy={crown.y} r={9} fill={INK} />
            <circle cx={crown.x} cy={crown.y} r={34 + 26 * ring} fill="none" stroke={ACCENT} strokeWidth={3} opacity={ring} />
          </svg>
        ) : null}
        {/* The line sits on a soft shade from the ground, so it reads over the water. */}
        <AbsoluteFill
          style={{
            background: pip
              ? `linear-gradient(0deg, ${GROUND}F0 0%, ${GROUND}F0 28%, ${GROUND}99 38%, ${GROUND}00 50%)`
              : `linear-gradient(180deg, ${GROUND}E6 0%, ${GROUND}99 22%, ${GROUND}00 40%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: SIDE,
            right: SIDE,
            top: f.lineTop,
            fontFamily: SERIF,
            fontWeight: 500,
            fontSize: f.size,
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
