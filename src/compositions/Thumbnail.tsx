import {AbsoluteFill, Freeze} from "remotion";
import {Edit} from "../timeline/types";
import {GOLD, IVORY, LATIN_FONT, NAVY, SAFE_AREA} from "../theme";
import {Short} from "./Short";

// A still for the upload: one frame of the reel, frozen, with a few bold words on it.
export const Thumbnail = ({edit, frame, title}: {edit: Edit; frame: number; title: string}) => {
  const words = title.split(" ");
  return (
    <AbsoluteFill>
      <Freeze frame={frame}>
        <Short {...edit} hideCaptions />
      </Freeze>
      <AbsoluteFill style={{background: `linear-gradient(180deg, transparent 50%, ${NAVY}E6 80%)`}} />
      <div
        style={{
          position: "absolute",
          top: 1150,
          left: SAFE_AREA.side,
          right: SAFE_AREA.side,
          textAlign: "center",
          fontFamily: LATIN_FONT,
          fontWeight: 900,
          fontSize: 120,
          lineHeight: 1.05,
          letterSpacing: -2,
          textTransform: "uppercase",
          color: IVORY,
          textShadow: `0 10px 30px ${NAVY}`,
        }}
      >
        {words.map((word, index) => (
          <span key={index} style={{color: index === words.length - 1 ? GOLD : IVORY}}>
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
