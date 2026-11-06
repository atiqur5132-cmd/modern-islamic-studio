import {CSSProperties, ReactNode} from "react";
import {Easing, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {AYAHS} from "../../data/quran";
import {ARABIC_FONT} from "../../theme";
import {CommentIcon, HeartIcon, ShareIcon} from "../yawm/icons";
import {arrive, CARD, INK, MARK, MUTED, SAND_DEEP, SANS, TERM} from "./look";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// The claim-kind label: small spaced capitals after a square.
export const Tag = ({text, color = INK, size = 28}: {text: string; color?: string; size?: number}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 4,
      color,
      whiteSpace: "nowrap",
    }}
  >
    <div style={{width: size * 0.43, height: size * 0.43, backgroundColor: color}} />
    {text}
  </div>
);

// A marker stamp: slams down from 1.5x in four frames, then holds dead still.
export const Stamp = ({
  text,
  at,
  rotate = -8,
  size = 56,
  style,
}: {
  text: string;
  at: number;
  rotate?: number;
  size?: number;
  style?: CSSProperties;
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 4], [0, 1], {...CLAMP, easing: Easing.in(Easing.quad)});
  if (frame < at) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        padding: `${size * 0.12}px ${size * 0.32}px`,
        border: `${Math.max(5, size * 0.09)}px solid ${MARK}`,
        borderRadius: size * 0.14,
        color: MARK,
        fontFamily: SANS,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: 1,
        whiteSpace: "nowrap",
        backgroundColor: "rgba(251,246,236,0.86)",
        opacity: Math.min(1, t * 2),
        transform: `rotate(${rotate}deg) scale(${1.5 - 0.5 * t})`,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// A hand-drawn marker ring around whatever it sits in (absolutely placed over it).
export const Ring = ({at, frames = 10, pad = 0.22}: {at: number; frames?: number; pad?: number}) => {
  const frame = useCurrentFrame();
  const drawn = interpolate(frame, [at, at + frames], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        left: `${-pad * 100}%`,
        top: `${-pad * 120}%`,
        width: `${100 + 2 * pad * 100}%`,
        height: `${100 + 2 * pad * 120}%`,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <path
        d="M 60 4 C 88 4 99 26 98 50 C 97 78 74 97 46 96 C 18 95 2 76 3 50 C 4 24 22 6 52 5 C 66 4 78 9 84 16"
        fill="none"
        stroke={MARK}
        // In viewBox units, stretched with the word's box: thicker on the sides, like a
        // marker held at an angle. (A non-scaling stroke would break the dash length.)
        strokeWidth={3.4}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - drawn}
      />
    </svg>
  );
};

// A strike-through drawn left to right in marker.
export const Strike = ({at, frames = 6}: {at: number; frames?: number}) => {
  const frame = useCurrentFrame();
  const drawn = interpolate(frame, [at, at + frames], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  return (
    <div
      style={{
        position: "absolute",
        left: -12,
        top: "52%",
        height: 10,
        width: `calc(${drawn * 100}% + ${drawn * 24}px)`,
        backgroundColor: MARK,
        borderRadius: 5,
        transform: "rotate(-4deg)",
        transformOrigin: "left center",
      }}
    />
  );
};

// A made-up social post (no platform, no account): it shows the claim travelling,
// not any real post.
export const Post = ({headline, width = 760, image}: {headline: ReactNode; width?: number; image?: ReactNode}) => (
  <div
    style={{
      width,
      boxSizing: "border-box",
      padding: "22px 30px 20px",
      backgroundColor: "#FFFFFF",
      borderRadius: 24,
      boxShadow: "0 22px 50px rgba(27,27,27,0.28)",
    }}
  >
    <div style={{display: "flex", alignItems: "center", gap: 14}}>
      <div style={{width: 48, height: 48, borderRadius: 24, backgroundColor: SAND_DEEP}} />
      <div style={{display: "flex", flexDirection: "column", gap: 8}}>
        <div style={{width: 170, height: 13, borderRadius: 7, backgroundColor: SAND_DEEP}} />
        <div style={{width: 104, height: 10, borderRadius: 5, backgroundColor: SAND_DEEP}} />
      </div>
    </div>
    <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 48, lineHeight: 1.08, color: INK, margin: "16px 0 14px"}}>
      {headline}
    </div>
    {image}
    <div style={{display: "flex", alignItems: "center", gap: 22, marginTop: image ? 14 : 0}}>
      <HeartIcon size={34} color={INK} fill={INK} />
      <CommentIcon size={34} color={MUTED} />
      <ShareIcon size={34} color={MUTED} />
    </div>
  </div>
);

// The Ferguson disc, cut out of its sheet along the plate's ellipse (the sheet's
// text is never shown).
export const Disc = ({width, style}: {width: number; style?: CSSProperties}) => (
  <div style={{width, height: width * 0.505, position: "relative", ...style}}>
    <Img
      src={staticFile("footage/fe-ferguson_disc.jpg")}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        clipPath: "ellipse(49.6% 49.4% at 50% 50%)",
        filter: "sepia(0.35) contrast(1.15) saturate(0.9)",
      }}
    />
  </div>
);

// One ostrich egg cut out of Pexels 33128657.
export const Egg = ({width, style, gray = true}: {width: number; style?: CSSProperties; gray?: boolean}) => (
  <div style={{width, height: width * (620 / 520), ...style}}>
    <Img
      src={staticFile("footage/fe-egg.jpg")}
      style={{
        width: "100%",
        height: "100%",
        clipPath: "ellipse(44.5% 38.8% at 50% 42.6%)",
        filter: gray ? "grayscale(1) contrast(1.15)" : undefined,
      }}
    />
  </div>
);

// The Blue Marble (NASA, Apollo 17), round.
export const Globe = ({size, style}: {size: number; style?: CSSProperties}) => (
  <div style={{width: size, height: size, borderRadius: "50%", overflow: "hidden", ...style}}>
    <Img src={staticFile("footage/fe-blue_marble.jpg")} style={{width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.035)"}} />
  </div>
);

export const Credit = ({text, color = MUTED, style}: {text: string; color?: string; style?: CSSProperties}) => (
  <div style={{position: "absolute", fontFamily: SANS, fontWeight: 600, fontSize: 28, color, ...style}}>{text}</div>
);

// A transliterated Arabic word in the term face, with its meaning in words.
export const Term = ({term, meaning, size = 64, color = INK}: {term: string; meaning?: string; size?: number; color?: string}) => (
  <div style={{display: "flex", alignItems: "baseline", gap: 20, flexWrap: "wrap"}}>
    <span style={{fontFamily: TERM, fontStyle: "italic", fontWeight: 600, fontSize: size, color}}>{term}</span>
    {meaning ? (
      <span style={{fontFamily: SANS, fontWeight: 800, fontSize: size * 0.62, color}}>= {meaning}</span>
    ) : null}
  </div>
);

// An Ayah from the verified JSON, word by word, right to left; `ring` circles one word.
const HAS_LETTER = /\p{L}/u;
export const AyahLine = ({
  ayah,
  size,
  ring,
  color = INK,
}: {
  ayah: string;
  size: number;
  ring?: {word: number; at: number};
  color?: string;
}) => {
  const entry = (AYAHS as Record<string, {textUthmani: string}>)[ayah];
  if (!entry) {
    throw new Error(`Ayah ${ayah} is missing. Run scripts/fetch_ayah.py ${ayah}`);
  }
  let count = 0;
  const tokens = entry.textUthmani.split(/\s+/).map((token) => ({token, index: HAS_LETTER.test(token) ? ++count : 0}));
  return (
    <div
      style={{
        direction: "rtl",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: size * 0.32,
        fontFamily: ARABIC_FONT,
        fontSize: size,
        lineHeight: 1.9,
        color,
      }}
    >
      {tokens.map(({token, index}, position) => (
        <span key={position} style={{position: "relative", display: "inline-block"}}>
          {token}
          {ring && index === ring.word ? <Ring at={ring.at} pad={0.16} /> : null}
        </span>
      ))}
    </div>
  );
};

// The card everything on paper sits on: a torn top and bottom edge.
const TORN =
  "polygon(0% 2.2%, 6% 0.6%, 13% 2%, 21% 0.4%, 30% 1.8%, 38% 0.5%, 47% 2.1%, 55% 0.7%, 63% 1.9%, 72% 0.3%, 80% 1.7%, 88% 0.5%, 95% 2%, 100% 0.8%, 100% 98.6%, 93% 99.6%, 85% 98.1%, 77% 99.7%, 68% 98.3%, 59% 99.5%, 50% 98%, 41% 99.6%, 33% 98.2%, 24% 99.4%, 16% 98%, 8% 99.6%, 0% 98.4%)";

export const TornCard = ({children, style}: {children: ReactNode; style?: CSSProperties}) => (
  <div style={{filter: "drop-shadow(0 18px 30px rgba(27,27,27,0.22))", ...style}}>
    <div style={{backgroundColor: CARD, clipPath: TORN, padding: "56px 54px 60px"}}>{children}</div>
  </div>
);

// Eases for a card arriving from below or the side.
export const slideIn = (frame: number, at: number, distance: number, frames = 12) => {
  const t = arrive(frame, at, frames);
  return {t, offset: (1 - t) * distance};
};
