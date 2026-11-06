import {AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {SAFE_AREA} from "../../theme";
import {Cue} from "../falak/common";
import {FactFootageOverlay} from "../../timeline/types";
import {Tag} from "./HeadCard";
import {arrive, COUNT, MONO, PAPER, SANS} from "./look";

// Real footage over the whole frame, the speaker off screen, and one number landing
// on the word that says it, with its source and the footage credit.
export const FactFootage = ({fact, cue}: {fact: FactFootageOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const value = arrive(frame, cue(fact.valueAt), 12);
  const label = arrive(frame, cue(fact.valueAt) + 4, 12);

  return (
    // It starts and ends on the creator's cuts, so it cuts in and out: no fade that
    // would show the speaker for a frame.
    <AbsoluteFill style={{backgroundColor: "#000"}}>
      <OffthreadVideo
        muted
        src={staticFile(`footage/${fact.src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${interpolate(frame, [0, durationInFrames], [1.0, 1.05])})`,
        }}
      />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, transparent 32%)"}} />
      <div style={{position: "absolute", top: SAFE_AREA.top, left: SAFE_AREA.side, right: SAFE_AREA.side}}>
        <Tag text={fact.tag} color={PAPER} />
        <div style={{display: "flex", alignItems: "center", gap: 24, marginTop: 14}}>
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 140,
              lineHeight: 1,
              letterSpacing: -4,
              color: COUNT,
              opacity: value,
              transform: `translateY(${(1 - value) * 24}px)`,
            }}
          >
            {fact.value}
          </div>
          <div style={{opacity: label, transform: `translateY(${(1 - label) * 14}px)`}}>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, lineHeight: 1.1, color: PAPER}}>{fact.label}</div>
            <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, lineHeight: 1.3, color: `${PAPER}CC`}}>
              {fact.source}
            </div>
          </div>
        </div>
        {fact.moons ? (
          <div style={{display: "flex", gap: 12, marginTop: 16}}>
            {Array.from({length: fact.moons}, (_, index) => {
              const shown = arrive(frame, cue(fact.valueAt) + 8 + index * 2, 8);
              return (
                <div
                  key={index}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    background: `radial-gradient(circle at 38% 35%, ${PAPER} 0%, #C9C3B8 70%, #8E887E 100%)`,
                    opacity: shown,
                    transform: `scale(${0.4 + 0.6 * shown})`,
                  }}
                />
              );
            })}
          </div>
        ) : null}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1060,
          right: SAFE_AREA.rail,
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: 28,
          color: `${PAPER}B3`,
        }}
      >
        {fact.credit}
      </div>
    </AbsoluteFill>
  );
};
