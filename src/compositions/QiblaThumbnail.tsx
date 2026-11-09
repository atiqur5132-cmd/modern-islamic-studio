import {CSSProperties, ReactNode} from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";
import {project, viewAt} from "../overlays/qibla/earth";
import {Earth3D} from "../overlays/qibla/Earth3D";
import {CARD, INK, KAABA, mercPoint, PAPER, PAPER_DEEP, QIBLA, SANS, WASHINGTON} from "../overlays/qibla/look";
import {Tag} from "../overlays/qibla/parts";
import {PathLine} from "../overlays/qibla/QiblaEarth";
import {greatCircle} from "../overlays/qibla/look";

// The cover for "America mein qibla north-east kyun?", designed in layers with the
// creator's photo whole (never cut out: the cap stays untouched), as thumbnail-design asks:
//   1. Ground: the reel's chart paper, the tag and the one-word question.
//   2. The photo panel: 35.2 s of the take ("Dhaaga pehle upar ki taraf…", his finger
//      pointing up and over), uncut, with a torn-paper top edge and wall above the cap.
//   3. The versus as stickers riding over the torn edge: the classroom map with its
//      straight line running south-east (crossed in ink), and the globe with the orange
//      string leaving north-east.
//   4. On the chest: MAP vs GLOBE.
// Four big words. Everything to be read sits inside the 4:5 feed crop (y 285-1635) and the
// 3:4 grid (y 240-1680).
export type QiblaThumbnailProps = {
  photo: string;
  // The face's aim point in the photo (track_face.py), where it lands, and the scale.
  face: [number, number];
  at: [number, number];
  scale: number;
  panelTop: number;
};

const STICKER = "drop-shadow(6px 0 0 #fff) drop-shadow(-6px 0 0 #fff) drop-shadow(0 6px 0 #fff) drop-shadow(0 -6px 0 #fff)";
const LIFT = "drop-shadow(0 22px 30px rgba(16,32,58,0.35))";
const TORN_TOP =
  "polygon(0% 1.6%, 5% 0.4%, 11% 1.8%, 17% 0.2%, 24% 1.4%, 31% 0.3%, 38% 1.9%, 45% 0.5%, 52% 1.5%, 59% 0.1%, 66% 1.7%, 73% 0.4%, 80% 1.6%, 87% 0.2%, 94% 1.5%, 100% 0.5%, 100% 100%, 0% 100%)";

// The globe sticker: centred on the North Atlantic with the string from Washington to Makkah.
const GLOBE_STATE = {wrap: 1, gores: 0, merc: 0, centerLon: -18, tilt: 20};
const GLOBE_CENTRE: [number, number] = [868, 650];
const GLOBE_RADIUS = 178;
const GLOBE_VIEW = viewAt([0, 0], GLOBE_CENTRE, 1080 / GLOBE_RADIUS);
const STRING = greatCircle(WASHINGTON, KAABA);

// The map sticker: a crop of the classroom map (qb-mercator.jpg, 3600 x 2192) around the
// North Atlantic, with Washington and Makkah.
// The crop keeps the map's own proportions (0.41 x 3600 : 0.48 x 2192 = 1.40 = 360 : 257).
const MAP_CROP = {x: 0.25, y: 0.2, w: 0.41, h: 0.48};
const MAP_BOX = {w: 360, h: 257};

export const QiblaThumbnail = ({photo, face, at, scale, panelTop}: QiblaThumbnailProps) => {
  const dc = mercPoint(WASHINGTON);
  const mk = mercPoint(KAABA);
  const inBox = ([x, y]: [number, number]): [number, number] => [((x - MAP_CROP.x) / MAP_CROP.w) * MAP_BOX.w, ((y - MAP_CROP.y) / MAP_CROP.h) * MAP_BOX.h];
  const a = inBox(dc);
  const b = inBox(mk);
  const dcOnGlobe = project(WASHINGTON, GLOBE_STATE, GLOBE_VIEW);
  const mkOnGlobe = project(KAABA, GLOBE_STATE, GLOBE_VIEW);
  return (
    <AbsoluteFill style={{backgroundColor: PAPER, overflow: "hidden"}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${PAPER} 40%, ${PAPER_DEEP} 100%)`}} />
      <AbsoluteFill style={{backgroundImage: "repeating-linear-gradient(0deg, rgba(16,32,58,0.035) 0px, rgba(16,32,58,0.035) 2px, transparent 2px, transparent 9px)"}} />

      {/* The photo panel, whole, lifted off the paper. */}
      <div style={{position: "absolute", left: 0, right: 0, top: panelTop, bottom: 0, filter: "drop-shadow(0 -10px 22px rgba(16,32,58,0.28))"}}>
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
              filter: "sepia(0.1) saturate(1.05) contrast(1.08) brightness(1.02)",
            }}
          />
          <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 35%, transparent 55%, rgba(16,32,58,0.24) 100%)"}} />
        </div>
      </div>

      {/* The question. */}
      <div style={{position: "absolute", left: 60, top: 300}}>
        <Tag text="QIBLA IN AMERICA" color={QIBLA} size={36} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 52,
          top: 352,
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 134,
          lineHeight: 1,
          letterSpacing: -5,
          whiteSpace: "nowrap",
          color: INK,
          WebkitTextStroke: `10px ${PAPER}`,
          paintOrder: "stroke fill",
        }}
      >
        NORTH-EAST?
      </div>

      {/* The map: its straight line runs south-east. Crossed in ink: not the qibla. */}
      <Sticker style={{left: 34, top: 548, transform: "rotate(-7deg)"}}>
        <div style={{position: "relative", width: MAP_BOX.w, height: MAP_BOX.h, overflow: "hidden", borderRadius: 6}}>
          <Img
            src={staticFile("footage/qb-mercator.jpg")}
            style={{
              position: "absolute",
              width: MAP_BOX.w / MAP_CROP.w,
              height: MAP_BOX.h / MAP_CROP.h,
              left: (-MAP_CROP.x / MAP_CROP.w) * MAP_BOX.w,
              top: (-MAP_CROP.y / MAP_CROP.h) * MAP_BOX.h,
            }}
          />
          <svg width={MAP_BOX.w} height={MAP_BOX.h} style={{position: "absolute", left: 0, top: 0}}>
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#fff" strokeWidth={9} strokeLinecap="round" />
            <circle cx={a[0]} cy={a[1]} r={10} fill={INK} stroke="#fff" strokeWidth={4} />
            <circle cx={b[0]} cy={b[1]} r={10} fill={INK} stroke="#fff" strokeWidth={4} />
          </svg>
        </div>
        <Label style={{left: 18, top: MAP_BOX.h - 28}}>MAP</Label>
        <svg width={130} height={130} viewBox="0 0 100 100" style={{position: "absolute", left: (a[0] + b[0]) / 2 - 65, top: (a[1] + b[1]) / 2 - 65, overflow: "visible"}}>
          {/* A white edge under the ink, so the cross reads on the dark sea. */}
          <path d="M 16 14 C 40 40, 62 62, 86 88" stroke="#fff" strokeWidth={22} strokeLinecap="round" fill="none" />
          <path d="M 84 12 C 60 38, 40 62, 14 86" stroke="#fff" strokeWidth={22} strokeLinecap="round" fill="none" />
          <path d="M 16 14 C 40 40, 62 62, 86 88" stroke={INK} strokeWidth={13} strokeLinecap="round" fill="none" />
          <path d="M 84 12 C 60 38, 40 62, 14 86" stroke={INK} strokeWidth={13} strokeLinecap="round" fill="none" />
        </svg>
      </Sticker>

      {/* The globe: the string pulled tight leaves north-east. */}
      <AbsoluteFill style={{filter: `${STICKER} ${LIFT}`}}>
        <Earth3D state={GLOBE_STATE} view={GLOBE_VIEW} />
      </AbsoluteFill>
      <PathLine points={STRING} state={GLOBE_STATE} view={GLOBE_VIEW} width={12} />
      <div
        style={{
          position: "absolute",
          left: dcOnGlobe.x - 11,
          top: dcOnGlobe.y - 11,
          width: 22,
          height: 22,
          borderRadius: "50%",
          backgroundColor: INK,
          border: "5px solid #fff",
          boxSizing: "border-box",
        }}
      />
      {mkOnGlobe.visible ? (
        <div style={{position: "absolute", left: mkOnGlobe.x - 11, top: mkOnGlobe.y - 11, width: 22, height: 22, borderRadius: "50%", backgroundColor: INK, border: "5px solid #fff", boxSizing: "border-box"}} />
      ) : null}
      <Label accent style={{left: GLOBE_CENTRE[0] - 80, top: GLOBE_CENTRE[1] + GLOBE_RADIUS - 26}}>
        GLOBE
      </Label>

      {/* On the chest. */}
      <div style={{position: "absolute", left: 0, right: 0, top: 1478, display: "flex", justifyContent: "center"}}>
        <div
          style={{
            padding: "8px 32px 14px",
            backgroundColor: QIBLA,
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
          MAP vs GLOBE
        </div>
      </div>
    </AbsoluteFill>
  );
};

// A picture cut like a sticker, lifted off the paper.
const Sticker = ({children, style}: {children: ReactNode; style: CSSProperties}) => (
  <div style={{position: "absolute", ...style}}>
    <div style={{filter: `${STICKER} ${LIFT}`}}>{children}</div>
  </div>
);

const Label = ({children, style, accent = false}: {children: ReactNode; style: CSSProperties; accent?: boolean}) => (
  <div
    style={{
      position: "absolute",
      padding: "6px 16px 8px",
      borderRadius: 10,
      fontFamily: SANS,
      fontWeight: 900,
      fontSize: 40,
      letterSpacing: 2,
      color: "#fff",
      backgroundColor: accent ? QIBLA : INK,
      ...style,
    }}
  >
    {children}
  </div>
);
