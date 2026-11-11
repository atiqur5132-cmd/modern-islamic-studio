import {AbsoluteFill, Img, staticFile} from "remotion";
import {Form} from "../overlays/kasawna/Form";
import {ACCENT, ARABIC, ayahWords, GROUND, GROUND_DEEP, INK, MUTED, SANS, SERIF} from "../overlays/kasawna/look";

// The cover for "Fa-kasawnā: We clothed the bones", designed in layers around the
// creator's photo, which stays whole (never cut out: the cap stays untouched):
//   1. Ground: the reel's dark aubergine page, the reference and the four words.
//   2. The photo panel: 51.15 s of the take ("Wahi boond, aaj video dekh raha hai", his finger
//      pointing out of the frame), uncut, with wall above the cap.
//   3. The story as two drawings on the panel's top corners, read left to right: the bare
//      skeleton, then the clothed form on the side his finger points to.
//   4. On the chest: the Quran's word, fa-kasawnā, from the fetched Ayah.
// Everything to be read sits inside the 4:5 feed crop (y 285-1635) and the 3:4 grid (y 240-1680).
export type MuminunThumbnailProps = {
  photo: string;
  // The face's aim point in the photo (track_face.py), where it lands, and the scale.
  face: [number, number];
  at: [number, number];
  scale: number;
  panelTop: number;
};

const Disc = ({x, y, size, children}: {x: number; y: number; size: number; children: React.ReactNode}) => (
  <div
    style={{
      position: "absolute",
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: GROUND,
      border: `5px solid ${INK}`,
      boxShadow: "0 24px 44px rgba(0,0,0,0.45)",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}
  >
    {children}
  </div>
);

export const MuminunThumbnail = ({photo, face, at, scale, panelTop}: MuminunThumbnailProps) => (
  <AbsoluteFill style={{backgroundColor: GROUND, overflow: "hidden"}}>
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 20%, ${GROUND} 45%, ${GROUND_DEEP} 100%)`}} />

    {/* The photo panel, whole. */}
    <div style={{position: "absolute", left: 0, right: 0, top: panelTop, bottom: 0, overflow: "hidden", borderTop: `4px solid ${ACCENT}`}}>
      <Img
        src={staticFile(`footage/${photo}`)}
        style={{
          position: "absolute",
          left: at[0] - face[0] * scale,
          top: at[1] - panelTop - face[1] * scale,
          width: 1080 * scale,
          height: 1920 * scale,
          // A light warm grade, so the pale wall sits with the dark page.
          filter: "sepia(0.08) saturate(1.04) contrast(1.06)",
        }}
      />
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 30%, transparent 58%, rgba(26,19,24,0.32) 100%)"}} />
    </div>

    {/* The reference and the four words. */}
    <div style={{position: "absolute", left: 76, top: 318, fontFamily: SANS, fontWeight: 700, fontSize: 38, color: MUTED, letterSpacing: 0.5}}>
      Surah Al-Mu'minun 23:14
    </div>
    <div style={{position: "absolute", left: 70, right: 60, top: 364, fontFamily: SERIF, fontWeight: 500, fontSize: 116, lineHeight: 1.0, letterSpacing: -2, color: INK}}>
      We <span style={{fontStyle: "italic", color: ACCENT}}>clothed</span>
      <br />
      the bones.
    </div>

    {/* The story on the panel's edge: bare bones, then clothed (where the finger points). */}
    <Disc x={170} y={panelTop + 118} size={220}>
      <Form state={{bones: 1}} size={228} style={{transform: "translateY(-6px)"}} />
    </Disc>
    <Disc x={910} y={panelTop + 118} size={220}>
      <Form state={{bones: 1, cloth: 1}} size={228} style={{transform: "translateY(-6px)"}} />
    </Disc>

    {/* On the chest: the Quran's word. */}
    <div style={{position: "absolute", left: 0, right: 0, top: panelTop + 735, display: "flex", justifyContent: "center"}}>
      <div
        style={{
          padding: "0 40px 10px",
          backgroundColor: ACCENT,
          borderRadius: 20,
          border: `5px solid ${INK}`,
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          transform: "rotate(-2deg)",
        }}
      >
        <div style={{direction: "rtl", fontFamily: ARABIC, fontSize: 132, lineHeight: 1.55, color: GROUND}}>{ayahWords("23:14", 11)}</div>
      </div>
    </div>
  </AbsoluteFill>
);
