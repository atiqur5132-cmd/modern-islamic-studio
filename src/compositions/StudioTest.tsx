import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import ayah from "../data/quran/96-1.json";
import {ARABIC_FONT, GOLD, HINDI_FONT, IVORY, NAVY} from "../theme";

export const StudioTest = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = spring({frame, fps, config: {damping: 200}});
  const labelOpacity = interpolate(frame, [20, 40], [0, 1], {extrapolateRight: "clamp"});

  return (
    <AbsoluteFill
      style={{backgroundColor: NAVY, justifyContent: "center", alignItems: "center", padding: 90}}
    >
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: ARABIC_FONT,
          color: IVORY,
          fontSize: 92,
          lineHeight: 2.2,
          textAlign: "center",
          opacity: entrance,
          transform: `translateY(${(1 - entrance) * 40}px)`,
        }}
      >
        {ayah.textUthmani}
      </div>
      <div
        style={{
          fontFamily: HINDI_FONT,
          color: GOLD,
          fontSize: 40,
          fontWeight: 600,
          marginTop: 60,
          opacity: labelOpacity,
        }}
      >
        {`सूरह ${ayah.surahNameEnglish} · ${ayah.key}`}
      </div>
      <div
        style={{
          fontFamily: HINDI_FONT,
          color: IVORY,
          fontSize: 30,
          fontWeight: 600,
          marginTop: 24,
          opacity: labelOpacity * 0.7,
        }}
      >
        स्टूडियो टेस्ट रेंडर
      </div>
    </AbsoluteFill>
  );
};
