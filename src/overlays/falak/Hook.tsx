import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from "remotion";
import {ARABIC_FONT, GOLD, IVORY, LATIN_FONT, NAVY, SAFE_AREA} from "../../theme";
import {palindromeLetters} from "./arabic";
import {Cue, fall, rise} from "./common";

// Where the bare wall is, beside and above the speaker, in frame pixels.
const WALL_SPOTS = [
  {x: 110, y: 470},
  {x: 200, y: 760},
  {x: 95, y: 1010},
  {x: 960, y: 520},
  {x: 890, y: 820},
  {x: 985, y: 1000},
  {x: 250, y: 330},
];
const MIRROR_IN = 4;
const MIRROR_HOLD = 4;
const MIRROR_OUT = 8;

// G1. Frame 0 already carries the hook line (QUALITY.md: frame 0 is the thumbnail).
// Faint, soft letters drift on the wall; on "ulta" a mirror line flashes across.
export const Hook = ({title, ayah, mirrorAt, cue}: {title: string; ayah: string; mirrorAt: number; cue: Cue}) => {
  const frame = useCurrentFrame();
  const letters = palindromeLetters(ayah);
  const {durationInFrames} = useVideoConfig();
  const out = fall(frame, durationInFrames - 8, 8);
  const mirror = cue(mirrorAt);
  const flash = Math.min(
    rise(frame, mirror - MIRROR_IN, MIRROR_IN),
    fall(frame, mirror + MIRROR_HOLD, MIRROR_OUT),
  );

  return (
    <AbsoluteFill style={{pointerEvents: "none", opacity: out}}>
      {WALL_SPOTS.map((spot, index) => {
        const drift = frame * (0.25 + random(`drift-${index}`) * 0.25);
        return (
          <div
            key={index}
            dir="rtl"
            lang="ar"
            style={{
              position: "absolute",
              left: spot.x - 60,
              top: spot.y - 90 - drift,
              width: 120,
              textAlign: "center",
              fontFamily: ARABIC_FONT,
              fontSize: 130,
              color: NAVY,
              opacity: 0.13,
              filter: "blur(5px)",
              transform: `rotate(${(random(`tilt-${index}`) - 0.5) * 24 + frame * 0.08}deg)`,
            }}
          >
            {letters[index % letters.length]}
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          top: SAFE_AREA.top - 60,
          left: SAFE_AREA.side,
          right: SAFE_AREA.side,
          textAlign: "center",
          fontFamily: LATIN_FONT,
          fontWeight: 900,
          fontSize: 76,
          letterSpacing: -1,
          textTransform: "uppercase",
          color: IVORY,
          WebkitTextStroke: `10px ${NAVY}`,
          paintOrder: "stroke fill",
          textShadow: `0 6px 18px ${NAVY}AA`,
        }}
      >
        {title.split(" ").map((word, index, words) => (
          <span key={index} style={{color: index === words.length - 1 ? GOLD : IVORY}}>
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          top: 300, // under the title, on the wall, never across the face
          left: 0,
          width: 1080,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${GOLD} 20%, ${IVORY} 50%, ${GOLD} 80%, transparent)`,
          boxShadow: `0 0 24px ${GOLD}`,
          opacity: flash,
          transform: `scaleX(${interpolate(flash, [0, 1], [0.1, 1])})`,
        }}
      />
    </AbsoluteFill>
  );
};
