import {useCurrentFrame, useVideoConfig} from "remotion";
import {VerdictsOverlay} from "../../timeline/flatTypes";
import {Cue} from "../falak/common";
import {arrive, CARD, INK, leave, SANS} from "./look";
import {Disc, Egg, Stamp} from "./parts";

const WIDTH = 300;
const TOP = 400;

// "Maine dono check kiye… dono galat nikle": the two claims from the hook shrink to
// small cards on either side of the head, and each takes a FALSE stamp.
export const Verdicts = ({v, cue}: {v: VerdictsOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const out = leave(frame, durationInFrames - 5, 5);
  const stamp = cue(v.stampAt);
  const cards = [
    {label: v.left, x: 34, rotate: -5, from: -1, art: <Disc width={250} />},
    {label: v.right, x: 1080 - 34 - WIDTH, rotate: 5, from: 1, art: <Egg width={150} gray={false} />},
  ];
  return (
    <div style={{position: "absolute", inset: 0, opacity: out}}>
      {cards.map((card, index) => {
        const land = arrive(frame, cue(v.at) + index * 3, 12);
        return (
          <div
            key={card.label}
            style={{
              position: "absolute",
              left: card.x,
              top: TOP,
              width: WIDTH,
              boxSizing: "border-box",
              padding: "18px 20px 16px",
              backgroundColor: CARD,
              borderRadius: 16,
              boxShadow: "0 16px 34px rgba(27,27,27,0.28)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              opacity: Math.min(1, land * 1.6),
              transform: `translate(${(1 - land) * 220 * card.from}px, ${(1 - land) * -60}px) rotate(${card.rotate * land}deg) scale(${0.7 + 0.3 * land})`,
            }}
          >
            <div style={{height: 180, display: "flex", alignItems: "center"}}>{card.art}</div>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 48, color: INK, letterSpacing: 1}}>{card.label}</div>
            <Stamp text={v.stamp} at={stamp + index * 4} size={58} rotate={index ? 9 : -9} style={{top: 90}} />
          </div>
        );
      })}
    </div>
  );
};
