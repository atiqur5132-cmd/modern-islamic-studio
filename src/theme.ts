import {loadFont as loadAmiriQuran} from "@remotion/google-fonts/AmiriQuran";
import {loadFont as loadMontserrat} from "@remotion/google-fonts/Montserrat";
import {loadFont as loadDevanagari} from "@remotion/google-fonts/NotoSansDevanagari";

export const {fontFamily: ARABIC_FONT} = loadAmiriQuran();
export const {fontFamily: HINDI_FONT} = loadDevanagari("normal", {
  weights: ["600", "800"],
  subsets: ["devanagari", "latin"],
});
// Captions and on-screen text are Hinglish, so they use a Latin display face.
export const {fontFamily: LATIN_FONT} = loadMontserrat("normal", {
  weights: ["600", "800", "900"],
  subsets: ["latin"],
});

export const NAVY = "#0A1426";
export const NAVY_LIGHT = "#13233F";
export const GOLD = "#C9A45C";
export const IVORY = "#F2EDE3";

// Space kept clear of the platform interface on Shorts and Reels: below y 1330 sit
// the caption, handle and buttons, and the action rail runs down the right side.
// `rail` is the side margin for anything in the lower half, where the rail is.
export const SAFE_AREA = {top: 250, bottom: 590, side: 70, rail: 140};

// Where the speaker shrinks to while a full-screen graphic plays.
export const PIP = {x: 840, y: 400, radius: 200};
