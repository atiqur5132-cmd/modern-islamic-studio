import {AbsoluteFill, Img, staticFile} from "remotion";
import {FONTS} from "../fonts";
import {ACCENT, GROUND, INK, SANS, SERIF, WALL_INK} from "../overlays/uni/look";

// The cover for "Duniya ki sabse purani university?", designed in layers around the
// creator's photo, which stays whole (never cut out: the cap stays untouched):
//   1. The two real places across the top, split on a slant: Nalanda's brick cells and
//      al-Qarawiyyin's tiled courtyard, with the question set big on them.
//   2. The photo panel: 1.5 s of the take (the question, head tilted), uncut, with wall
//      above the cap, its top edge torn.
//   3. The two prints flanking the head, riding over the panel's edge, each named.
//   4. On the chest: the answer in the reel's accent.
// Everything to be read sits inside the 4:5 feed crop (y 285-1635) and reads at 128 px wide.
export type OldestThumbnailProps = {
  photo: string;
  left: string;
  right: string;
  leftCard: string;
  rightCard: string;
  // The face's aim point in the photo (track_face.py), where it lands, and the scale.
  face: [number, number];
  at: [number, number];
  scale: number;
  panelTop: number;
};

const ANTON = FONTS.Anton;

// A torn-paper edge across the frame at `top`.
const TORN = (top: number) => {
  const pts: string[] = [];
  for (let x = 0; x <= 1080; x += 30) {
    const y = top + Math.sin(x * 0.037) * 9 + Math.sin(x * 0.11 + 1.3) * 6 + ((x / 30) % 2 ? 7 : -5);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")} L1080,1920 L0,1920 Z`;
};

const Print = ({src, name, year, style}: {src: string; name: string; year: string; style: React.CSSProperties}) => (
  <div style={{position: "absolute", width: 268, padding: "16px 16px 0", backgroundColor: INK, boxShadow: "0 26px 50px rgba(0,0,0,0.5)", ...style}}>
    <Img src={staticFile(`footage/${src}`)} style={{width: 236, height: 296, objectFit: "cover", display: "block"}} />
    <div style={{fontFamily: SERIF, fontSize: 48, lineHeight: 1.05, color: WALL_INK, padding: "8px 2px 0", whiteSpace: "nowrap"}}>{name}</div>
    <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: ACCENT, padding: "2px 2px 16px"}}>{year}</div>
  </div>
);

export const OldestThumbnail = ({photo, left, right, leftCard, rightCard, face, at, scale, panelTop}: OldestThumbnailProps) => (
  <AbsoluteFill style={{backgroundColor: GROUND, overflow: "hidden"}}>
    {/* 1. The two places, split on a slant. */}
    <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: panelTop + 60, overflow: "hidden"}}>
      <div style={{position: "absolute", inset: 0, clipPath: "polygon(0 0, 600px 0, 480px 100%, 0 100%)"}}>
        <Img src={staticFile(`footage/${left}`)} style={{position: "absolute", left: -140, top: 0, width: 900, height: panelTop + 60, objectFit: "cover", filter: "saturate(1.05) contrast(1.06)"}} />
      </div>
      <div style={{position: "absolute", inset: 0, clipPath: "polygon(612px 0, 1080px 0, 1080px 100%, 492px 100%)"}}>
        <Img src={staticFile(`footage/${right}`)} style={{position: "absolute", left: 380, top: 0, width: 760, height: panelTop + 60, objectFit: "cover", objectPosition: "50% 40%", filter: "saturate(1.05) contrast(1.06)"}} />
      </div>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${GROUND}F0 0%, ${GROUND}B3 30%, ${GROUND}33 62%, ${GROUND}00 80%)`}} />
    </div>

    <div style={{position: "absolute", left: 70, right: 70, top: 292}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: INK, opacity: 0.9}}>
        Nalanda <span style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 400, fontSize: 46}}>or</span> al-Qarawiyyin
      </div>
      <div style={{fontFamily: ANTON, fontSize: 204, lineHeight: 0.92, letterSpacing: 2, color: INK, marginTop: 14, textShadow: "0 6px 34px rgba(0,0,0,0.55)"}}>OLDEST</div>
      <div style={{fontFamily: ANTON, fontSize: 152, lineHeight: 0.98, letterSpacing: 2, color: INK, whiteSpace: "nowrap", textShadow: "0 6px 34px rgba(0,0,0,0.55)"}}>UNIVERSITY?</div>
    </div>

    {/* 2. The photo panel, whole, under a torn edge. */}
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
      <defs>
        <clipPath id="oldest-panel">
          <path d={TORN(panelTop)} />
        </clipPath>
        <radialGradient id="oldest-vignette" cx="0.5" cy="0.62" r="0.7">
          <stop offset="0.6" stopColor={GROUND} stopOpacity={0} />
          <stop offset="1" stopColor={GROUND} stopOpacity={0.35} />
        </radialGradient>
      </defs>
      <g clipPath="url(#oldest-panel)">
        <image
          href={staticFile(`footage/${photo}`)}
          x={at[0] - face[0] * scale}
          y={at[1] - face[1] * scale}
          width={1080 * scale}
          height={1920 * scale}
          style={{filter: "contrast(1.06) saturate(1.02)"}}
        />
        <rect x={0} y={0} width={1080} height={1920} fill="url(#oldest-vignette)" />
      </g>
      <path d={TORN(panelTop).split(" L1080,1920")[0]} fill="none" stroke={ACCENT} strokeWidth={9} strokeLinejoin="round" />
    </svg>

    {/* 3. The two prints, flanking the head over the panel's edge. */}
    <Print src={leftCard} name="Nalanda" year="c. 427" style={{left: 4, top: panelTop + 44, transform: "rotate(-7deg)"}} />
    <Print src={rightCard} name="al-Qarawiyyin" year="859" style={{left: 800, top: panelTop + 76, transform: "rotate(6deg)"}} />

    {/* 4. The answer on the chest. */}
    <div style={{position: "absolute", left: 0, right: 0, top: 1468, display: "flex", justifyContent: "center"}}>
      <div style={{padding: "6px 46px 2px", backgroundColor: ACCENT, borderRadius: 16, border: `6px solid ${GROUND}`, boxShadow: "0 22px 44px rgba(0,0,0,0.45)", transform: "rotate(-2.5deg)"}}>
        <div style={{fontFamily: ANTON, fontSize: 124, lineHeight: 1.06, letterSpacing: 1.5, color: GROUND}}>BOTH RIGHT</div>
      </div>
    </div>
  </AbsoluteFill>
);
