import {AbsoluteFill, Img, random, staticFile} from "remotion";
import {FONTS} from "../fonts";
import {ACCENT, GROUND_DEEP, INK, SANS, SERIF} from "../chaand/look";

// The cover for "Suraj chiragh hai, chaand nahi" (faceless reel), designed in layers
// around the creator's photo, which stays whole (never cut out: the cap stays untouched):
//   1. The night sky with the real NASA Moon at the top right, the claim set big over it.
//   2. The photo panel: 17.47 s of the two-seas take (one finger up: "ruko, ek baat"),
//      uncut, its top edge a wide arc like the Moon's limb, with wall above the cap.
//   3. The reel's own reveal as a sticker: the torn paper "[reflected]" ringed in rust,
//      riding over the panel's edge.
//   4. The verdict on the chest: HALF TRUE, in the reel's amber.
// Everything to be read sits inside the 4:5 feed crop (y 285-1635) and reads at 270 px.
export type ChaandThumbnailProps = {
  photo: string;
  face: [number, number];
  at: [number, number];
  scale: number;
  panelTop: number;
};

const ANTON = FONTS.Anton;
const RUST = "#A4572A";
// The panel's top edge: a wide arc, rising to the right.
const ARC = (top: number) => `M0,${top + 60} Q540,${top - 120} 1080,${top + 10} L1080,1920 L0,1920 Z`;

export const ChaandThumbnail = ({photo, face, at, scale, panelTop}: ChaandThumbnailProps) => (
  <AbsoluteFill style={{backgroundColor: GROUND_DEEP, overflow: "hidden"}}>
    {/* 1. Sky and Moon. */}
    {Array.from({length: 90}, (_, i) => (
      <div key={i} style={{position: "absolute", left: random(`tx${i}`) * 1080, top: random(`ty${i}`) * 900, width: 2 + random(`tr${i}`) * 2, height: 2 + random(`tr${i}`) * 2, borderRadius: "50%", background: INK, opacity: 0.25 + 0.5 * random(`to${i}`)}} />
    ))}
    <div style={{position: "absolute", left: 560, top: 150, width: 640, height: 640, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 80px rgba(236,229,213,0.18)"}}>
      <Img src={staticFile("footage/cn-moon.jpg")} style={{width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.5) contrast(1.08) brightness(1.05)"}} />
    </div>
    <div style={{position: "absolute", left: 70, top: 300, width: 760}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: INK, opacity: 0.88, letterSpacing: 0.3, textShadow: "0 2px 12px rgba(0,0,0,0.8)"}}>Viral claim · Surah Nuh 71:16</div>
      <div style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 104, lineHeight: 1, letterSpacing: -1.5, color: INK, marginTop: 20, textShadow: "0 4px 28px rgba(0,0,0,0.85)"}}>
        The Quran said
      </div>
      <div style={{fontFamily: ANTON, fontSize: 168, lineHeight: 0.98, letterSpacing: 2, whiteSpace: "nowrap", color: INK, marginTop: 6, textShadow: "0 6px 34px rgba(0,0,0,0.85)"}}>
        REFLECTED?
      </div>
    </div>

    {/* 2. The photo panel, whole, under an arc. */}
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
      <defs>
        <clipPath id="cn-panel">
          <path d={ARC(panelTop)} />
        </clipPath>
        <radialGradient id="cn-vignette" cx="0.5" cy="0.62" r="0.72">
          <stop offset="0.6" stopColor={GROUND_DEEP} stopOpacity={0} />
          <stop offset="1" stopColor={GROUND_DEEP} stopOpacity={0.4} />
        </radialGradient>
      </defs>
      <g clipPath="url(#cn-panel)">
        <image href={staticFile(`footage/${photo}`)} x={at[0] - face[0] * scale} y={at[1] - face[1] * scale} width={1080 * scale} height={1920 * scale} style={{filter: "contrast(1.06) saturate(1.05)"}} />
        <rect x={0} y={0} width={1080} height={1920} fill="url(#cn-vignette)" />
      </g>
      <path d={ARC(panelTop).split(" L1080,1920")[0]} fill="none" stroke={ACCENT} strokeWidth={10} strokeLinecap="round" />
    </svg>

    {/* 3. The reveal, as a torn paper sticker over the panel edge. */}
    <div style={{position: "absolute", left: 34, top: panelTop - 116, transform: "rotate(-6deg)", filter: "drop-shadow(0 18px 26px rgba(0,0,0,0.5))"}}>
      <div style={{padding: "26px 44px 30px", background: "linear-gradient(160deg, #F1EADB, #DDD2BA)", clipPath: "polygon(2% 6%, 18% 2%, 36% 7%, 55% 1%, 74% 6%, 97% 2%, 99% 40%, 97% 95%, 76% 98%, 52% 93%, 30% 99%, 8% 95%, 1% 60%)"}}>
        <span style={{position: "relative", display: "inline-block", fontFamily: SERIF, fontWeight: 500, fontSize: 68, color: "#1D2230"}}>
          [reflected]
          <svg viewBox="0 0 340 100" preserveAspectRatio="none" style={{position: "absolute", left: -26, top: -14, width: "calc(100% + 52px)", height: "calc(100% + 28px)", overflow: "visible"}}>
            <path d="M 211 6 C 299 6 337 26 333 50 C 330 78 265 95 170 95 C 68 95 7 78 7 50 C 7 22 75 4 190 5 C 238 5 272 9 292 14" fill="none" stroke={RUST} strokeWidth={7} strokeLinecap="round" />
          </svg>
        </span>
      </div>
    </div>

    {/* 4. The verdict on the chest. */}
    <div style={{position: "absolute", left: 500, top: 1488, transform: "rotate(-3deg)"}}>
      <div style={{padding: "4px 40px 0", backgroundColor: ACCENT, borderRadius: 16, border: `6px solid ${GROUND_DEEP}`, boxShadow: "0 22px 44px rgba(0,0,0,0.45)"}}>
        <div style={{fontFamily: ANTON, fontSize: 118, lineHeight: 1.08, letterSpacing: 1.5, color: GROUND_DEEP}}>HALF TRUE</div>
      </div>
    </div>
  </AbsoluteFill>
);
