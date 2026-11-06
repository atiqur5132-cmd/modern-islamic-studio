import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {FlatFootageOverlay} from "../../timeline/flatTypes";
import {Cue} from "../falak/common";
import {arrive, CARD, INK, MUTED, RAIL, SAND, SANS, SIDE, TEXT_TOP} from "./look";
import {ARABIC_FONT} from "../../theme";
import {Credit, Globe, Strike, Tag, Term} from "./parts";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// Real footage over the whole frame, the speaker off screen. Labels land on the words
// that name what is in the picture; a coded camera move can tilt or push inside it.
export const FlatFootage = ({f, cue}: {f: FlatFootageOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const globeAt = f.globe ? cue(f.globe.at) : Infinity;
  if (frame >= globeAt && f.globe) {
    return <GlobeCut f={f} at={globeAt} />;
  }

  const moveStart = f.move?.at !== undefined ? cue(f.move.at) : 0;
  const moveEnd = f.move?.frames ? moveStart + f.move.frames : durationInFrames;
  const m = (index: number) =>
    f.move
      ? interpolate(frame, [moveStart, moveEnd], [f.move.from[index], f.move.to[index]], {...CLAMP, easing: Easing.inOut(Easing.sin)})
      : [1, 0.5, 0.5][index];
  const scale = f.move ? m(0) : interpolate(frame, [0, durationInFrames], [1.0, 1.06], CLAMP);
  const style = {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    transformOrigin: `${m(1) * 100}% ${m(2) * 100}%`,
    transform: `scale(${scale})`,
  };
  const line = f.line ? arrive(frame, cue(f.line.at), 12) : 0;

  return (
    // It starts and ends on cuts, so it cuts in and out: no fade that would show the
    // speaker for a frame.
    <AbsoluteFill style={{backgroundColor: "#000", overflow: "hidden"}}>
      {f.image ? (
        <Img src={staticFile(`footage/${f.src}`)} style={style} />
      ) : (
        <OffthreadVideo muted src={staticFile(`footage/${f.src}`)} trimBefore={Math.round((f.trim ?? 0) * 30)} style={style} />
      )}
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0.38) 30%, transparent 50%)"}} />
      <div style={{position: "absolute", top: TEXT_TOP, left: SIDE, right: SIDE}}>
        <Tag text={f.tag} color={CARD} />
        {f.line ? (
          <div style={{marginTop: 18, opacity: line, transform: `translateY(${(1 - line) * 16}px)`}}>
            {f.line.term ? (
              <>
                <Term term={f.line.term} meaning={f.line.text} size={78} color={CARD} />
                {f.line.arabic ? (
                  <div style={{fontFamily: ARABIC_FONT, fontSize: 110, lineHeight: 1.7, color: CARD, direction: "rtl", textAlign: "left", textShadow: "0 3px 14px rgba(0,0,0,0.55)"}}>
                    {f.line.arabic}
                  </div>
                ) : null}
              </>
            ) : (
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 70, lineHeight: 1.05, color: CARD, textWrap: "balance"}}>{f.line.text}</div>
            )}
          </div>
        ) : null}
      </div>
      {(f.labels ?? []).map((label) => {
        const shown = arrive(frame, cue(label.at), 8);
        return (
          <div
            key={label.text}
            style={{
              position: "absolute",
              left: label.x,
              top: label.y,
              padding: "10px 22px 12px",
              backgroundColor: INK,
              color: SAND,
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 46,
              letterSpacing: 3,
              borderRadius: 10,
              opacity: shown,
              transform: `translateY(${(1 - shown) * 18}px) scale(${0.9 + 0.1 * shown})`,
            }}
          >
            <span style={{position: "relative"}}>
              {label.text}
              {label.strike !== undefined ? <Strike at={cue(label.strike)} /> : null}
            </span>
          </div>
        );
      })}
      {f.notPlanet ? <NotPlanet at={cue(f.notPlanet.at)} strikeAt={cue(f.notPlanet.strikeAt)} /> : null}
      <Credit text={f.credit} color={`${CARD}CC`} style={{right: RAIL, top: 1160, textAlign: "right", textShadow: "0 2px 8px rgba(0,0,0,0.6)"}} />
    </AbsoluteFill>
  );
};

// A small globe with "planet shape" beside it, struck on "nahi".
const NotPlanet = ({at, strikeAt}: {at: number; strikeAt: number}) => {
  const frame = useCurrentFrame();
  const shown = arrive(frame, at, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: SIDE,
        top: 560,
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "16px 28px 16px 16px",
        backgroundColor: CARD,
        borderRadius: 999,
        boxShadow: "0 14px 30px rgba(0,0,0,0.3)",
        opacity: shown,
        transform: `scale(${0.8 + 0.2 * shown})`,
        transformOrigin: "left center",
      }}
    >
      <Globe size={110} />
      <span style={{position: "relative", fontFamily: SANS, fontWeight: 900, fontSize: 50, letterSpacing: 2, color: INK}}>
        PLANET SHAPE
        <Strike at={strikeAt} />
      </span>
    </div>
  );
};

// "Phir bhi gol hai": a hard cut to the Earth from space, round, on the paper.
const GlobeCut = ({f, at}: {f: FlatFootageOverlay; at: number}) => {
  const frame = useCurrentFrame();
  const land = interpolate(frame, [at, at + 5], [1.12, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const spin = interpolate(frame, [at, at + 90], [0, 6], CLAMP);
  return (
    <AbsoluteFill style={{backgroundColor: SAND}}>
      <div style={{position: "absolute", top: TEXT_TOP, left: SIDE, right: SIDE}}>
        <Tag text="ESTABLISHED SCIENCE" />
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 96, lineHeight: 1, letterSpacing: -2, color: INK, marginTop: 18}}>
          {f.globe?.text}
        </div>
      </div>
      <div style={{position: "absolute", top: 520, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
        <Globe size={760} style={{transform: `scale(${land}) rotate(${spin}deg)`, boxShadow: "0 30px 60px rgba(27,27,27,0.25)"}} />
      </div>
      <Credit text="The Blue Marble, Apollo 17 (NASA)" style={{left: SIDE, top: 420, color: MUTED}} />
    </AbsoluteFill>
  );
};
