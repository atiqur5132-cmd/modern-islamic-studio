import {AbsoluteFill, Img, staticFile} from "remotion";
import {FONTS} from "../fonts";
import {ACCENT, GROUND, GROUND_DEEP, INK, SANS, SERIF} from "../overlays/seas/look";

// The cover for "Do samandar jo mix nahi hote?", designed in layers around the creator's
// photo, which stays whole (never cut out: the cap stays untouched):
//   1. The claim's own picture: the real line between green sea and ochre river water,
//      across the top, with the claim set big on it.
//   2. The photo panel: 46.2 s of the take (mid-explanation, hand out), uncut, with wall
//      above the cap, its top edge cut as a wave.
//   3. On the chest: the verdict in the reel's accent.
// Everything to be read sits inside the 4:5 feed crop (y 285-1635) and reads at 270 px wide.
export type SeasThumbnailProps = {
  photo: string;
  water: string;
  // The face's aim point in the photo (track_face.py), where it lands, and the scale.
  face: [number, number];
  at: [number, number];
  scale: number;
  panelTop: number;
};

const ANTON = FONTS.Anton;
// The panel's top edge: one long wave across the frame.
const WAVE = (top: number) =>
  `M0,${top + 26} C180,${top - 18} 360,${top - 18} 540,${top + 10} C720,${top + 38} 900,${top + 34} 1080,${top - 6} L1080,1920 L0,1920 Z`;

export const SeasThumbnail = ({photo, water, face, at, scale, panelTop}: SeasThumbnailProps) => (
  <AbsoluteFill style={{backgroundColor: GROUND, overflow: "hidden"}}>
    {/* 1. The two waters, the line running across the upper frame. */}
    <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: panelTop + 60, overflow: "hidden"}}>
      <Img
        src={staticFile(`footage/${water}`)}
        style={{position: "absolute", left: -90, top: -560, width: 1260, height: 2240, filter: "saturate(1.08) contrast(1.06)"}}
      />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${GROUND_DEEP}E6 0%, ${GROUND_DEEP}99 26%, ${GROUND_DEEP}00 46%)`}} />
    </div>

    <div style={{position: "absolute", left: 76, right: 70, top: 312}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: INK, opacity: 0.85, letterSpacing: 0.3}}>Viral claim · Surah Ar-Rahman 55:19</div>
      <div style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 112, lineHeight: 1, letterSpacing: -2, color: INK, marginTop: 18, textShadow: "0 4px 28px rgba(0,0,0,0.45)"}}>
        Two seas that
      </div>
      <div style={{fontFamily: ANTON, fontSize: 196, lineHeight: 0.96, letterSpacing: 2, whiteSpace: "nowrap", color: INK, marginTop: 4, textShadow: "0 6px 34px rgba(0,0,0,0.5)"}}>
        NEVER MIX?
      </div>
    </div>

    {/* 2. The photo panel, whole, under a wave edge. */}
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
      <defs>
        <clipPath id="seas-panel">
          <path d={WAVE(panelTop)} />
        </clipPath>
      </defs>
      <g clipPath="url(#seas-panel)">
        <image
          href={staticFile(`footage/${photo}`)}
          x={at[0] - face[0] * scale}
          y={at[1] - face[1] * scale}
          width={1080 * scale}
          height={1920 * scale}
          style={{filter: "contrast(1.06) saturate(1.04)"}}
        />
        <rect x={0} y={0} width={1080} height={1920} fill="url(#seas-vignette)" />
      </g>
      <defs>
        <radialGradient id="seas-vignette" cx="0.5" cy="0.62" r="0.7">
          <stop offset="0.6" stopColor={GROUND} stopOpacity={0} />
          <stop offset="1" stopColor={GROUND} stopOpacity={0.35} />
        </radialGradient>
      </defs>
      <path d={WAVE(panelTop).split(" L1080,1920")[0]} fill="none" stroke={ACCENT} strokeWidth={10} strokeLinecap="round" />
    </svg>

    {/* 3. The verdict on the chest. */}
    <div style={{position: "absolute", left: 0, right: 0, top: 1478, display: "flex", justifyContent: "center"}}>
      <div
        style={{
          padding: "6px 44px 2px",
          backgroundColor: ACCENT,
          borderRadius: 18,
          border: `6px solid ${GROUND}`,
          boxShadow: "0 22px 44px rgba(0,0,0,0.45)",
          transform: "rotate(-2.5deg)",
        }}
      >
        <div style={{fontFamily: ANTON, fontSize: 118, lineHeight: 1.08, letterSpacing: 1.5, color: GROUND}}>THEY DO MIX</div>
      </div>
    </div>
  </AbsoluteFill>
);
