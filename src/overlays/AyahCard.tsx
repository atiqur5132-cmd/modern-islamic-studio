import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {AYAHS} from "../data/quran";
import {ARABIC_FONT, GOLD, HINDI_FONT, IVORY, NAVY, SAFE_AREA} from "../theme";

export const AyahCard = ({ayahKey}: {ayahKey: string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame, fps, config: {damping: 200}});

  // An unverified reference must stop the render, never show blank or guessed text.
  const ayah = AYAHS[ayahKey];
  if (!ayah) {
    throw new Error(`Ayah ${ayahKey} is missing. Run scripts/fetch_ayah.py ${ayahKey}`);
  }

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        paddingBottom: SAFE_AREA.bottom,
        paddingLeft: SAFE_AREA.side,
        paddingRight: SAFE_AREA.side,
      }}
    >
      <div
        style={{
          backgroundColor: `${NAVY}F2`,
          borderTop: `3px solid ${GOLD}`,
          padding: "30px 40px 36px",
          textAlign: "center",
          opacity: entrance,
          transform: `translateY(${(1 - entrance) * 30}px)`,
        }}
      >
        <div
          dir="rtl"
          lang="ar"
          style={{fontFamily: ARABIC_FONT, color: IVORY, fontSize: 64, lineHeight: 2.3}}
        >
          {ayah.textUthmani}
        </div>
        <div style={{fontFamily: HINDI_FONT, color: GOLD, fontSize: 34, fontWeight: 600}}>
          {`सूरह ${ayah.surahNameEnglish} · ${ayah.key}`}
        </div>
      </div>
    </AbsoluteFill>
  );
};
