import {CSSProperties, ReactNode} from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";
import {CARD, INK, MARK, SAND, SAND_DEEP, SANS} from "../overlays/flat/look";
import {Tag} from "../overlays/flat/parts";

// The cover for "Quran mein zameen flat?", designed in layers the way a thumbnail
// designer builds one, with the creator's photo whole (never cut out: the creator wants
// the cap untouched):
//   1. Ground: the reel's sand paper, with the question words and the tag.
//   2. The photo panel: 6.1 s of the take ("Maine dono check kiye", two fingers up),
//      uncut, with a torn-paper top edge like the reel's cards and wall above the cap.
//   3. The versus: the flat map and the ostrich egg as stickers, each crossed in
//      marker, riding over the panel's torn edge for depth.
//   4. The verdict on the chest: BOTH WRONG.
// Four big words. Everything to be read sits inside the 4:5 feed crop (y 285-1635) and
// the 3:4 grid (y 240-1680).
export type FlatThumbnailProps = {
  photo: string;
  // The face's aim point in the photo (track_face.py), where it lands, and the scale.
  face: [number, number];
  at: [number, number];
  scale: number;
  // Where the panel's torn top edge sits.
  panelTop: number;
};

const STICKER = "drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff)";
const LIFT = "drop-shadow(0 22px 30px rgba(27,27,27,0.35))";
// The torn top edge of the photo panel, as a clip path in the panel's own box.
const TORN_TOP =
  "polygon(0% 1.6%, 5% 0.4%, 11% 1.8%, 17% 0.2%, 24% 1.4%, 31% 0.3%, 38% 1.9%, 45% 0.5%, 52% 1.5%, 59% 0.1%, 66% 1.7%, 73% 0.4%, 80% 1.6%, 87% 0.2%, 94% 1.5%, 100% 0.5%, 100% 100%, 0% 100%)";

export const FlatThumbnail = ({photo, face, at, scale, panelTop}: FlatThumbnailProps) => {
  return (
    <AbsoluteFill style={{backgroundColor: SAND, overflow: "hidden"}}>
      {/* Paper: a faint warm vignette and fibre lines, so the ground is not flat colour. */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${SAND} 40%, ${SAND_DEEP} 100%)`}} />
      <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(110,102,92,0.05) 0px, rgba(110,102,92,0.05) 2px, transparent 2px, transparent 9px)",
        }}
      />

      {/* The photo panel, whole, lifted off the paper. */}
      <div style={{position: "absolute", left: 0, right: 0, top: panelTop, bottom: 0, filter: "drop-shadow(0 -10px 22px rgba(27,27,27,0.28))"}}>
        <div style={{position: "absolute", inset: 0, clipPath: TORN_TOP, overflow: "hidden"}}>
          <Img
            src={staticFile(`footage/${photo}`)}
            style={{
              position: "absolute",
              left: at[0] - face[0] * scale,
              top: at[1] - panelTop - face[1] * scale,
              width: 1080 * scale,
              height: 1920 * scale,
              // A light warm grade, so the pale wall sits with the paper.
              filter: "sepia(0.14) saturate(1.08) contrast(1.07) brightness(1.02)",
            }}
          />
          <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 35%, transparent 55%, rgba(27,27,27,0.22) 100%)"}} />
        </div>
      </div>

      {/* The question. */}
      <div style={{position: "absolute", left: 60, top: 300}}>
        <Tag text="VIRAL CLAIMS ABOUT THE QURAN" color={MARK} size={34} />
      </div>
      <Word text="FLAT?" style={{left: 56, top: 366}} />
      <Word text="EGG?" style={{right: 60, top: 366}} />

      {/* The two claims, over the torn edge. */}
      <Claim style={{left: -36, top: 548, transform: "rotate(-8deg)"}} cross={{left: 140, top: 0}}>
        <Img
          src={staticFile("footage/fe-ferguson_disc.jpg")}
          style={{width: 500, height: 253, objectFit: "cover", clipPath: "ellipse(49.6% 49.4% at 50% 50%)", filter: "sepia(0.3) contrast(1.15)"}}
        />
      </Claim>
      <Claim style={{right: 40, top: 528, transform: "rotate(8deg)"}} cross={{left: 0, top: 30}}>
        <Img
          src={staticFile("footage/fe-egg.jpg")}
          style={{width: 230, height: 274, clipPath: "ellipse(44.5% 38.8% at 50% 42.6%)", filter: "contrast(1.08) saturate(1.05)"}}
        />
      </Claim>

      {/* The verdict, on the chest. */}
      <div style={{position: "absolute", left: 0, right: 0, top: 1500, display: "flex", justifyContent: "center"}}>
        <div
          style={{
            padding: "8px 30px 14px",
            backgroundColor: MARK,
            color: CARD,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 112,
            lineHeight: 1,
            letterSpacing: -2,
            border: `7px solid ${CARD}`,
            borderRadius: 18,
            boxShadow: "0 18px 36px rgba(0,0,0,0.4)",
            transform: "rotate(-3deg)",
          }}
        >
          BOTH WRONG
        </div>
      </div>
    </AbsoluteFill>
  );
};

// A question word: heavy ink with a sand edge.
const Word = ({text, style}: {text: string; style: CSSProperties}) => (
  <div
    style={{
      position: "absolute",
      fontFamily: SANS,
      fontWeight: 900,
      fontSize: 150,
      lineHeight: 1,
      letterSpacing: -5,
      color: INK,
      WebkitTextStroke: `10px ${SAND}`,
      paintOrder: "stroke fill",
      ...style,
    }}
  >
    {text}
  </div>
);

// A claim cut out like a sticker, lifted off the paper, with a marker cross over it.
const Claim = ({children, style, cross}: {children: ReactNode; style: CSSProperties; cross: {left: number; top: number}}) => (
  <div style={{position: "absolute", ...style}}>
    <div style={{filter: `${STICKER} ${LIFT}`}}>{children}</div>
    <svg width={220} height={220} viewBox="0 0 100 100" style={{position: "absolute", left: cross.left, top: cross.top, overflow: "visible"}}>
      <path d="M 14 12 C 40 40, 62 62, 88 90" stroke={MARK} strokeWidth={13} strokeLinecap="round" fill="none" />
      <path d="M 86 10 C 60 38, 40 62, 12 88" stroke={MARK} strokeWidth={13} strokeLinecap="round" fill="none" />
    </svg>
  </div>
);
