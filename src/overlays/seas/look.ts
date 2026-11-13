import {FONTS} from "../../fonts";

// "Do samandar" (projects/two-seas/beats.md, Look). Deep sea ink, foam-white ink, a grey
// teal for what steps back, and one silt-ochre accent that only ever marks fresh, sweet
// water. Salt water is the ground colour itself.
export const GROUND = "#10242A";
export const GROUND_DEEP = "#0B1A1F";
export const INK = "#ECEFE8";
export const MUTED = "#8FA3A3";
export const ACCENT = "#C9A267";
// The two water layers in the Gibraltar drawing: light Atlantic over dense Mediterranean.
export const ATLANTIC = "#3F7480";
export const MEDITERRANEAN = "#173E4A";

// One sans and one serif by fixed rules: labels and credits in Bricolage Grotesque,
// meanings and the big lines in Fraunces italic. Arabic is the whole Amiri Quran file
// (loaded by the kasawna look, re-exported here).
export const SANS = FONTS["Bricolage Grotesque"];
export const SERIF = FONTS.Fraunces;
export {ARABIC, arrive, ayahTokens, draw, leave, starParts} from "../kasawna/look";

// Text that must be read stays inside y 168-1330, side margins of at least 90 px, clear
// of the right rail.
export const SIDE = 92;
export const RAIL = 140;
export const TEXT_TOP = 236;
// Below this the caption band starts; graphics keep their text above it.
export const TEXT_FLOOR = 1120;
