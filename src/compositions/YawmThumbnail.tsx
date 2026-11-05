import {AbsoluteFill, Img, staticFile} from "remotion";
import {ARABIC_FONT} from "../theme";
import {Tag} from "../overlays/yawm/HeadCard";
import {ayahWord, bareLetters, COUNT, INK, MONO, PAPER, PAPER_DEEP, SANS} from "../overlays/yawm/look";

// The cover for "Yawm 365": the creator (a 4K frame of the take, pointing up at the
// number), the claim as a question, and the answer's hook. Everything that must be
// read sits inside the 4:5 grid crop (y 285-1635) as well as the full 9:16 frame.
export type YawmThumbnailProps = {
  photo: string;
  // The photo's scale and offset in the 1080x1920 frame (the source is 2160x3840).
  photoScale: number;
  photoX: number;
  photoY: number;
  // Fraction of the 475 occurrences that stay in the count (365), drawn as dots.
  dots: string[];
};

const DOT = {columns: 21, pitch: 11.6, size: 8};

export const YawmThumbnail = ({photo, photoScale, photoX, photoY, dots}: YawmThumbnailProps) => {
  // The bare letters of yawm, from Al-Fatiha 1:4 as verified by fetch_ayah.py.
  const yawm = bareLetters(ayahWord("1:4", 2));
  const rows = Math.ceil(dots.length / DOT.columns);

  return (
    <AbsoluteFill style={{backgroundColor: PAPER, overflow: "hidden"}}>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${PAPER_DEEP} 2px, transparent 2px)`,
          backgroundSize: "100% 64px",
          opacity: 0.5,
        }}
      />
      {/* Multiplied onto the paper, the white wall turns into the page itself. */}
      <Img
        src={staticFile(`footage/${photo}`)}
        style={{
          position: "absolute",
          left: photoX,
          top: photoY,
          width: 2160 * photoScale,
          height: 3840 * photoScale,
          mixBlendMode: "multiply",
          filter: "brightness(1.07) contrast(1.06) saturate(1.06)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 0%, transparent 26%, black 34%)",
        }}
      />
      <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 55%, transparent 60%, rgba(27,27,27,0.16) 100%)"}} />

      <div style={{position: "absolute", top: 330, left: 70, right: 70}}>
        <Tag text="VIRAL CLAIM, COUNTED" />
        <div
          style={{
            marginTop: 18,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 92,
            lineHeight: 1,
            letterSpacing: -1,
            color: INK,
          }}
        >
          ‘DAY’ IN THE QURAN
        </div>
        <div style={{display: "flex", alignItems: "center", gap: 34, marginTop: 6}}>
          <div
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 270,
              lineHeight: 1,
              letterSpacing: -12,
              color: COUNT,
            }}
          >
            365?
          </div>
          <div
            style={{
              fontFamily: ARABIC_FONT,
              fontSize: 190,
              lineHeight: 1,
              color: INK,
              direction: "rtl",
              transform: "translateY(-46px)",
            }}
          >
            {yawm}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 900,
          right: 60,
          padding: "18px 18px 16px",
          backgroundColor: PAPER,
          border: `3px solid ${INK}`,
          borderRadius: 16,
          boxShadow: "0 14px 30px rgba(27,27,27,0.22)",
          transform: "rotate(3deg)",
        }}
      >
        <svg width={DOT.columns * DOT.pitch} height={rows * DOT.pitch} style={{display: "block"}}>
          {dots.map((form, index) => (
            <circle
              key={index}
              cx={(index % DOT.columns) * DOT.pitch + DOT.pitch / 2}
              cy={Math.floor(index / DOT.columns) * DOT.pitch + DOT.pitch / 2}
              r={DOT.size / 2}
              fill={form === "s" ? COUNT : "none"}
              stroke={form === "s" ? "none" : INK}
              strokeWidth={1.6}
            />
          ))}
        </svg>
        <div
          style={{
            marginTop: 10,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 34,
            color: INK,
            textAlign: "center",
          }}
        >
          475 → <span style={{color: COUNT}}>365</span>
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 34,
            lineHeight: 1.05,
            color: INK,
            textAlign: "center",
          }}
        >
          I counted
          <br />
          every one.
        </div>
      </div>
    </AbsoluteFill>
  );
};
