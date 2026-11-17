import {FONTS} from "../../fonts";

// "Duniya ki sabse purani university?" (projects/oldest-university/beats.md, Look). A warm
// night behind one real Earth, ivory ink, and one Nalanda-brick accent that only ever marks
// the place or the answer being named.
export const GROUND = "#16110D";
export const GROUND_LIFT = "#221A14";
export const INK = "#F3EBDF";
export const MUTED = "#A89A88";
export const ACCENT = "#C8643C";
// On the creator's light wall, words take a dark ink of the same family.
export const WALL_INK = "#2B2018";
// Paper for a name and its source (a light page in the board).
export const PAPER = "#E9DECB";

// One sans and one serif by fixed rules: labels, credits and captions in Plus Jakarta Sans;
// the big lines and place names in Instrument Serif.
export const SANS = FONTS["Plus Jakarta Sans"];
export const SERIF = FONTS["Instrument Serif"];

export {arrive, draw, leave} from "../kasawna/look";

// Readable text stays inside y 168-1330, side margins of at least 90 px, clear of the rail.
export const SIDE = 92;
export const RAIL = 140;
export const TEXT_TOP = 236;
export const TEXT_FLOOR = 1300;

export const SHADOW = "0 2px 18px rgba(10,7,5,0.55), 0 1px 3px rgba(10,7,5,0.6)";
