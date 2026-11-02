import {loadFont as loadAmiriQuran} from "@remotion/google-fonts/AmiriQuran";
import {loadFont as loadDevanagari} from "@remotion/google-fonts/NotoSansDevanagari";

export const {fontFamily: ARABIC_FONT} = loadAmiriQuran();
export const {fontFamily: HINDI_FONT} = loadDevanagari("normal", {
  weights: ["600", "800"],
  subsets: ["devanagari", "latin"],
});

export const NAVY = "#0A1426";
export const GOLD = "#C9A45C";
export const IVORY = "#F2EDE3";

// Space kept clear of the platform interface on Shorts and Reels.
export const SAFE_AREA = {top: 250, bottom: 380, side: 70};
