import {loadFont as loadAmiriQuran} from "@remotion/google-fonts/AmiriQuran";
import {loadFont as loadDevanagari} from "@remotion/google-fonts/NotoSansDevanagari";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import ayah from "../data/quran/96-1.json";

const {fontFamily: arabicFont} = loadAmiriQuran();
const {fontFamily: hindiFont} = loadDevanagari("normal", {
  weights: ["600"],
  subsets: ["devanagari", "latin"],
});

const NAVY = "#0A1426";
const GOLD = "#C9A45C";
const IVORY = "#F2EDE3";

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
          fontFamily: arabicFont,
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
          fontFamily: hindiFont,
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
          fontFamily: hindiFont,
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
