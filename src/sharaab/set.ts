import {V3} from "./Balance";

// Fixed places on the studio table, shared by every scene so the world stays continuous.
export const BOOK_AT: V3 = [0.95, 0, 1.15];
export const BOOK_YAW = -0.18;
export const WHO_AT: V3 = [2.05, 0, 0.95];
export const LANCET_AT: V3 = [-0.8, 0, 1.62];
export const CALENDAR_AT: V3 = [-2.05, 0, 0.95];

// Where the highlighter runs on each document (fractions of the captured image).
// WHO: "2.6 million deaths per year were attributable to alcohol".
export const WHO_HL = {u0: 0.085, u1: 0.79, v: 0.776, h: 0.06};
// Lancet: the citation line, then the first Background sentence ("…continue to be debated").
export const LANCET_CITE = {u0: 0.04, u1: 0.7, v: 0.046, h: 0.045};
export const LANCET_DEBATE = {u0: 0.025, u1: 0.915, v: 0.836, h: 0.045};
