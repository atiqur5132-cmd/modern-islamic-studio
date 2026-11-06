import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {FlatBoardOverlay, ReadIntoOverlay} from "../../timeline/flatTypes";
import {Cue} from "../falak/common";
import {STACK_HEIGHT, STACK_MOVE_FRAMES} from "../yawm/look";
import {arrive, CARD, INK, MARK, MUTED, RAIL, SAND, SANS, SIDE, TERM} from "./look";
import {AyahLine, Disc, Egg, Post, Stamp, Tag} from "./parts";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// The board under the speaker (the "stack" layout): it rises as the speaker slides into
// the top window. Its text stays above y 1326.
const useRise = () => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, STACK_MOVE_FRAMES], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
};

const BoardFrame = ({children}: {children: React.ReactNode}) => {
  const rise = useRise();
  return (
    <AbsoluteFill style={{transform: `translateY(${(1 - rise) * (1920 - STACK_HEIGHT)}px)`}}>
      <div style={{position: "absolute", top: STACK_HEIGHT, left: 0, right: 0, bottom: 0, backgroundColor: SAND, borderTop: `6px solid ${INK}`}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

export const Board = ({b, cue}: {b: FlatBoardOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  if (b.shots) {
    // One photo per spoken word, cut hard on the word, each with its English label.
    const current = [...b.shots].reverse().find((shot) => frame >= cue(shot.at)) ?? b.shots[0];
    const since = frame - Math.max(0, cue(current.at));
    const pop = interpolate(since, [0, 5], [1.08, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
    return (
      <BoardFrame>
        <div style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden"}}>
          <Img
            src={staticFile(`footage/${current.src}`)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: `${(current.focus?.[0] ?? 0.5) * 100}% ${(current.focus?.[1] ?? 0.5) * 100}%`,
              transform: `scale(${pop * (1 + since * 0.0015)})`,
            }}
          />
          <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(239,228,207,0.95) 0%, rgba(239,228,207,0.75) 22%, transparent 42%)"}} />
        </div>
        <div style={{position: "absolute", top: 34, left: SIDE, right: SIDE}}>
          <Tag text={b.tag} />
          {b.heading ? <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 56, lineHeight: 1.05, color: INK, marginTop: 10}}>{b.heading}</div> : null}
          <div style={{display: "flex", gap: 16, marginTop: 18}}>
            {b.shots.map((shot) => {
              const on = frame >= cue(shot.at);
              const live = shot === current;
              return (
                <div
                  key={shot.label}
                  style={{
                    padding: "8px 20px 10px",
                    borderRadius: 10,
                    fontFamily: SANS,
                    fontWeight: 900,
                    fontSize: 44,
                    letterSpacing: 2,
                    backgroundColor: live ? INK : "transparent",
                    color: live ? SAND : INK,
                    border: `3px solid ${INK}`,
                    opacity: on ? 1 : 0,
                    transform: `scale(${live ? interpolate(since, [0, 4], [1.15, 1], CLAMP) : 1})`,
                  }}
                >
                  {shot.label}
                </div>
              );
            })}
          </div>
        </div>
      </BoardFrame>
    );
  }

  const a = b.ayah!;
  const label = arrive(frame, cue(a.ringAt) + 6, 10);
  const card = arrive(frame, Math.max(STACK_MOVE_FRAMES, cue(a.at)), 10);
  return (
    <BoardFrame>
      <div style={{position: "absolute", top: 34, left: SIDE, right: SIDE}}>
        <Tag text={b.tag} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 50,
          right: RAIL,
          padding: "10px 30px 18px",
          backgroundColor: CARD,
          borderRadius: 14,
          boxShadow: "0 16px 30px rgba(27,27,27,0.16)",
          opacity: card,
          transform: `translateY(${(1 - card) * 30}px)`,
        }}
      >
        <AyahLine ayah={a.key} size={72} ring={{word: a.word, at: cue(a.ringAt)}} />
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
          <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 34, color: MARK}}>{a.label}</span>
          <span style={{fontFamily: TERM, fontStyle: "italic", fontWeight: 600, fontSize: 60, color: INK, opacity: label}}>{a.term}</span>
        </div>
      </div>
    </BoardFrame>
  );
};

// "Toh ek ne verse se flat zameen nikaali, aur doosre ne anda": both claims back under
// the speaker, each taking the same stamp.
export const ReadInto = ({r, cue}: {r: ReadIntoOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const sides = [
    {at: cue(r.leftAt), art: <Disc width={360} />, text: "Flat", rotate: -3},
    {at: cue(r.rightAt), art: <Egg width={210} gray={false} />, text: "Egg", rotate: 3},
  ];
  return (
    <BoardFrame>
      <div style={{position: "absolute", top: 34, left: SIDE, right: SIDE}}>
        <Tag text={r.tag} />
      </div>
      <div style={{position: "absolute", top: 100, left: 40, right: RAIL, display: "flex", justifyContent: "space-between"}}>
        {sides.map((side) => {
          const land = arrive(frame, Math.max(STACK_MOVE_FRAMES - 4, side.at - 8), 10);
          return (
            <div key={side.text} style={{position: "relative", opacity: land, transform: `translateY(${(1 - land) * 40}px) rotate(${side.rotate}deg)`}}>
              <Post
                width={430}
                headline={<span style={{fontSize: 44}}>{side.text}</span>}
                image={<div style={{height: 250, display: "flex", alignItems: "center", justifyContent: "center"}}>{side.art}</div>}
              />
              <Stamp text={r.stamp} at={side.at + 2} size={50} rotate={side.rotate * 3} style={{left: 40, top: 170}} />
            </div>
          );
        })}
      </div>
      <div style={{position: "absolute", top: 34, right: RAIL, fontFamily: SANS, fontWeight: 600, fontSize: 28, color: MUTED}}>
        Illustrative posts, not real accounts
      </div>
    </BoardFrame>
  );
};
