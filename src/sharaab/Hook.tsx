import {AbsoluteFill, useCurrentFrame} from "remotion";
import {Cues} from "../long/scroll/types";
import {arrive, fall, INK, leave, MUTED, SANS, SERIF, SIDE, swing, t01, TEXT_TOP} from "./look";
import {BOOK, lerp3, Studio3D, StudioState, V3} from "./Studio3D";

// Lines 1-2 in the studio, the hook (QUALITY.md 1). Each beat moves most of the frame:
// 0.0 low on the scale, the bottle on the benefit pan, the beam already swinging;
// "fayda" a brass weight drops in and the beam dips; "Quran" cut wide, the Quran falls onto
// the table beside the scale; line 2 close on the gold cover as a light crosses it;
// "Quran ki" the cover swings open; "Baqarah" the pages fan; "219" top down, the tag lands.

const BOOK_AT: V3 = [0.95, 0, 1.15];
const BOOK_YAW = -0.18;

export const Hook = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const fayda = cues.word(1, 2);
  const cutBook = cues.word(1, 5) - 3;
  const line2 = cues.line(2) - 2;
  const openAt = cues.word(2, 4);
  const flipAt = cues.word(2, 7);
  const tagAt = cues.word(2, 9);

  const drop = fall(frame, fayda, 1.3, 7);
  const beam = 0.05 * Math.sin(frame * 0.16 + 0.6) * Math.exp(-frame / 40) + swing(frame, fayda + 7, 0.13);
  const bookDrop = fall(frame, cutBook - 4, 1.4, 7);

  let s: StudioState;
  const base = {beam, bottle: {on: "left" as const}, weights: [{pan: "left" as const, drop, kind: "brass" as const, slot: 1}]};
  const closeAt = fayda - 2;
  const sideAt = flipAt - 2;
  const topAt = tagAt - 2;
  const bx = BOOK_AT[0], bz = BOOK_AT[2];
  const open = t01(frame, openAt, openAt + 18) * 0.985;
  const flip = t01(frame, flipAt, flipAt + 22);
  if (frame < closeAt) {
    const k = t01(frame, 0, closeAt, (t) => t);
    s = {...base, cam: lerp3([-1.9, 1.5, 3.8], [-1.8, 1.53, 3.6], k), target: [-1.1, 1.2, 0], fov: 38};
  } else if (frame < cutBook) {
    // Close and low on the pan as the weight lands.
    const k = t01(frame, closeAt, cutBook, (t) => t);
    s = {...base, cam: lerp3([-0.95, 2.53, 0.75], [-1.0, 2.38, 0.68], k), target: [-1.28, 1.03, -0.05], fov: 40, spot: {pos: [-1.0, 3.4, 0.9], target: [-1.25, 1.05, 0], power: 110, angle: 0.3}};
  } else if (frame < line2) {
    // Straight down on the table: the Quran falls into the pool of light.
    const k = t01(frame, cutBook, line2, (t) => t);
    s = {...base, cam: lerp3([1.05, 2.3, 4.4], [1.0, 2.15, 4.1], k), target: [0.95, 0.05, 1.7], fov: 38, book: {pos: BOOK_AT, yaw: BOOK_YAW, drop: bookDrop}, key: 0.6, spot: {pos: [0.95, 4.4, 1.6], target: [0.95, 0, 1.25], power: 210, angle: 0.36}};
  } else if (frame < sideAt) {
    // Close on the cover as a light crosses it, then it swings open.
    const k = t01(frame, line2, sideAt);
    s = {
      ...base,
      cam: lerp3([bx + 0.3, 0.78, bz + 0.72], [bx + 0.16, 0.86, bz + 0.7], k),
      target: [bx - 0.05, BOOK.h, bz],
      fov: 36,
      book: {pos: BOOK_AT, yaw: BOOK_YAW, open, flip},
      sweep: frame < openAt ? t01(frame, line2, openAt, (t) => t) * 1.2 - 0.1 : undefined,
      key: 0.85,
    };
  } else if (frame < topAt) {
    // Low across the book: the pages fan against the dark wall.
    const k = t01(frame, sideAt, topAt, (t) => t);
    s = {...base, cam: lerp3([bx + 1.4, 1.4, bz + 1.8], [bx + 1.28, 1.42, bz + 1.62], k), target: [bx - 0.2, 0.38, bz - 0.05], fov: 36, book: {pos: BOOK_AT, yaw: BOOK_YAW, open, flip}, key: 0.9};
  } else {
    // Straight down onto the right-hand page for "219", ready for the dive.
    const k = t01(frame, topAt, topAt + 20, (t) => 1 - Math.pow(1 - t, 3));
    s = {...base, cam: lerp3([bx + 0.12, 1.5, bz + 0.25], [bx + 0.16, 1.15, bz + 0.12], k), target: [bx + 0.18, BOOK.h, bz - 0.02], fov: 36, book: {pos: BOOK_AT, yaw: BOOK_YAW, open, flip: 1}, key: 0.8};
  }

  // Frame 0 is the thumbnail: the claim already set (QUALITY.md 1). "says the Quran" lands
  // with the word; both leave on the cut to the cover.
  const out = leave(frame, line2 - 6, 6);
  const says = arrive(frame, cues.word(1, 5), 14);
  const tag = arrive(frame, tagAt, 16);
  return (
    <AbsoluteFill>
      <Studio3D s={s} />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(21,17,13,0.55) 0%, rgba(21,17,13,0.0) 26%, rgba(21,17,13,0) 46%, rgba(21,17,13,0.7) 62%, rgba(21,17,13,0.7) 100%)"}} />
      <div style={{position: "absolute", left: SIDE, right: SIDE, top: 1120, opacity: out}}>
        <div style={{fontFamily: SERIF, fontSize: 124, lineHeight: 1.0, letterSpacing: -1, color: INK, textWrap: "balance"}}>
          Alcohol has <span style={{fontStyle: "italic"}}>benefits.</span>
        </div>
        <div style={{marginTop: 22, fontFamily: SANS, fontWeight: 700, fontSize: 46, color: INK, opacity: says, transform: `translateY(${(1 - says) * 14}px)`}}>
          — says the Quran.
        </div>
      </div>
      {tag > 0 ? (
        <div style={{position: "absolute", left: SIDE, top: TEXT_TOP, opacity: tag, transform: `translateY(${(1 - tag) * 16}px)`, textShadow: "0 2px 18px rgba(21,17,13,0.9), 0 0 4px rgba(21,17,13,0.8)"}}>
          <div style={{fontFamily: SERIF, fontSize: 104, lineHeight: 1, color: INK}}>Al-Baqarah</div>
          <div style={{marginTop: 14, fontFamily: SANS, fontWeight: 700, fontSize: 52, color: INK, letterSpacing: 1}}>2:219</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
