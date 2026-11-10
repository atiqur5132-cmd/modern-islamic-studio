import {loadFont as loadAnton} from "@remotion/google-fonts/Anton";
import {loadFont as loadBricolage} from "@remotion/google-fonts/BricolageGrotesque";
import {loadFont as loadFraunces} from "@remotion/google-fonts/Fraunces";
import {loadFont as loadInstrumentSerif} from "@remotion/google-fonts/InstrumentSerif";
import {loadFont as loadInterTight} from "@remotion/google-fonts/InterTight";
import {loadFont as loadNewsreader} from "@remotion/google-fonts/Newsreader";
import {loadFont as loadJakarta} from "@remotion/google-fonts/PlusJakartaSans";

// The studio's type kit (STYLE.md, Type). Every face is a free Google font (SIL OFL).
// A reel picks one sans for spoken words and at most one serif for emphasis and quotes;
// Anton is only for the "punch" captions of high-energy reels.
const LATIN: ("latin" | "latin-ext")[] = ["latin", "latin-ext"];

// The serifs carry emphasis in italic, so both styles load under one family name.
loadInstrumentSerif("italic", {weights: ["400"], subsets: LATIN});
loadNewsreader("italic", {weights: ["500"], subsets: LATIN});

export const FONTS = {
  "Inter Tight": loadInterTight("normal", {weights: ["600", "700", "800"], subsets: LATIN}).fontFamily,
  "Plus Jakarta Sans": loadJakarta("normal", {weights: ["600", "700", "800"], subsets: LATIN}).fontFamily,
  "Bricolage Grotesque": loadBricolage("normal", {weights: ["600", "700", "800"], subsets: LATIN}).fontFamily,
  "Instrument Serif": loadInstrumentSerif("normal", {weights: ["400"], subsets: LATIN}).fontFamily,
  Newsreader: loadNewsreader("normal", {weights: ["500"], subsets: LATIN}).fontFamily,
  Fraunces: loadFraunces("italic", {weights: ["600"], subsets: LATIN}).fontFamily,
  Anton: loadAnton("normal", {weights: ["400"], subsets: LATIN}).fontFamily,
} as const;

export type FontName = keyof typeof FONTS;
