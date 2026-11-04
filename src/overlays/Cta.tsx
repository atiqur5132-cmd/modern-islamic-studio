import {CSSProperties} from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {BRAND, FACEBOOK_BLUE, FACEBOOK_GLYPH, INSTAGRAM_GLYPH, INSTAGRAM_GRADIENT} from "../brand";
import {LATIN_FONT, SAFE_AREA} from "../theme";
import {CtaOverlay} from "../timeline/types";

// The follow card and the like-and-comment card. Mid-reel they sit small in the
// headroom above the speaker (`top`); at the end the follow card takes the caption
// band (`caption`) at a larger size and replaces the captions while it shows.

// Frames into the card where Follow is tapped and where the heart fills; the sound
// cues land on them too.
export const TAP_FRAME = 27;
export const HEART_FRAME = 22;

// Between the platform's top bar and the speaker's cap (about y 350 on the creator's
// framing, so a card under 110 px tall clears it).
export const CTA_TOP_Y = 236;

const ENTER_FRAMES = 14;
const EXIT_FRAMES = 7; // about half the entrance (QUALITY.md)
const WORD_STAGGER = 3; // frames, 100 ms
// The end card at this scale keeps the name on one line inside the caption band.
const CAPTION_SCALE = 1.3;

// Instagram's own button blue, so the card reads as a follow at a glance.
const FOLLOW_BLUE = "#0095F6";
const HEART_RED = "#FF3040";

const TONES = {
  light: {card: "#FFFFFF", ink: "#121212", muted: "#6B6B6B", following: "#EFEFEF", edge: "rgba(0,0,0,0.06)"},
  dark: {card: "#161616", ink: "#F5F5F5", muted: "#A8A8A8", following: "#363636", edge: "rgba(255,255,255,0.10)"},
};
type Tone = (typeof TONES)["light"];

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// A part of the card arriving: opacity up and blur away, eased out.
const blurIn = (frame: number, at: number, frames = 6): CSSProperties => {
  const t = interpolate(frame, [at, at + frames], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  return {opacity: t, filter: `blur(${(1 - t) * 6}px)`};
};

// A single bump: up and back over `frames`, peaking halfway.
const bump = (frame: number, at: number, frames: number) =>
  Math.sin(Math.PI * interpolate(frame, [at, at + frames], [0, 1], CLAMP));

// The whole card: lands on a spring with a damping ratio near 0.8 (settles without
// a wobble), comes from the side it sits on, and leaves the same way in half the time.
const useCardMotion = (from: 1 | -1): CSSProperties => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const land = spring({frame, fps, config: {damping: 19, stiffness: 180, mass: 0.8}, durationInFrames: ENTER_FRAMES});
  const fade = interpolate(frame, [0, 8], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const leave = interpolate(frame, [durationInFrames - EXIT_FRAMES, durationInFrames], [0, 1], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  return {
    opacity: fade * (1 - leave),
    transform: `translateY(${((1 - land) * 28 + leave * 18) * from}px) scale(${0.94 + 0.06 * land})`,
    filter: `blur(${(1 - fade) * 8 + leave * 6}px)`,
  };
};

const Glyph = ({path, size, fill}: {path: string; size: number; fill: string}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: "block", flexShrink: 0}}>
    <defs>
      <linearGradient id="cta-instagram" x1="0" y1="1" x2="1" y2="0">
        {INSTAGRAM_GRADIENT.map((color, index) => (
          <stop key={color} offset={index / (INSTAGRAM_GRADIENT.length - 1)} stopColor={color} />
        ))}
      </linearGradient>
    </defs>
    <path d={path} fill={fill} />
  </svg>
);

// The profile photo inside an Instagram-style gradient ring.
const Photo = ({size, u, tone}: {size: number; u: number; tone: Tone}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: frame - 2, fps, config: {damping: 14, stiffness: 220}});
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        padding: 3 * u,
        boxSizing: "border-box",
        background: `linear-gradient(45deg, ${INSTAGRAM_GRADIENT.join(", ")})`,
        transform: `scale(${0.6 + 0.4 * pop})`,
        opacity: interpolate(frame, [2, 6], [0, 1], CLAMP),
      }}
    >
      <div style={{width: "100%", height: "100%", borderRadius: "50%", padding: 3 * u, boxSizing: "border-box", background: tone.card}}>
        <Img
          src={staticFile(BRAND.photo)}
          style={{width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover", display: "block"}}
        />
      </div>
    </div>
  );
};

// Follow, pressed on TAP_FRAME, turns into Following with a tick.
const FollowButton = ({u, tone}: {u: number; tone: Tone}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const press = interpolate(frame, [TAP_FRAME - 3, TAP_FRAME], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const release = spring({frame: frame - TAP_FRAME, fps, config: {damping: 14, stiffness: 260}});
  const flip = interpolate(frame, [TAP_FRAME, TAP_FRAME + 6], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const label: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8 * u,
  };
  return (
    <div
      style={{
        position: "relative",
        width: 214 * u,
        height: 60 * u,
        flexShrink: 0,
        borderRadius: 16 * u,
        fontSize: 30 * u,
        fontWeight: 700,
        background: interpolateColors(flip, [0, 1], [FOLLOW_BLUE, tone.following]),
        transform: `scale(${1 - 0.07 * press * (1 - release)})`,
        ...blurIn(frame, 10),
      }}
    >
      <div style={{...label, color: "#FFFFFF", opacity: 1 - flip, filter: `blur(${flip * 4}px)`}}>Follow</div>
      <div style={{...label, color: tone.ink, opacity: flip, filter: `blur(${(1 - flip) * 4}px)`}}>
        Following
        <svg width={26 * u} height={26 * u} viewBox="0 0 24 24" style={{display: "block"}}>
          <path d="M4.5 12.5l4.8 4.8L19.5 7" fill="none" stroke={tone.ink} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};

const FollowRow = ({u, tone}: {u: number; tone: Tone}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <Photo size={72 * u} u={u} tone={tone} />
      <div style={{display: "flex", flexDirection: "column", gap: 4 * u, minWidth: 0}}>
        <div style={{fontSize: 32 * u, fontWeight: 800, lineHeight: 1.15, letterSpacing: -0.3 * u, whiteSpace: "nowrap", color: tone.ink, ...blurIn(frame, 5)}}>
          {BRAND.name}
        </div>
        <div style={{display: "flex", alignItems: "center", gap: 10 * u, ...blurIn(frame, 8)}}>
          <span style={{fontSize: 28 * u, fontWeight: 600, lineHeight: 1.2, whiteSpace: "nowrap", color: tone.muted}}>@{BRAND.handle}</span>
          <Glyph path={INSTAGRAM_GLYPH} size={28 * u} fill="url(#cta-instagram)" />
          <Glyph path={FACEBOOK_GLYPH} size={28 * u} fill={FACEBOOK_BLUE} />
        </div>
      </div>
      <FollowButton u={u} tone={tone} />
    </>
  );
};

const HEART = "M12 20.6l-1.3-1.2C6 15.2 3 12.5 3 9.1 3 6.4 5.1 4.3 7.8 4.3c1.6 0 3.1.7 4.2 1.9 1.1-1.2 2.6-1.9 4.2-1.9 2.7 0 4.8 2.1 4.8 4.8 0 3.4-3 6.1-7.7 10.3L12 20.6z";
const BUBBLE = "M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.3-1.1A8.5 8.5 0 1 0 12 3.5z";

// The heart fills red with a pop, then the comment bubble nudges, and the question
// arrives a word at a time.
const EngageRow = ({u, tone, text}: {u: number; tone: Tone; text: string}) => {
  const frame = useCurrentFrame();
  const filled = interpolate(frame, [HEART_FRAME, HEART_FRAME + 4], [0, 1], CLAMP);
  const icon = 52 * u;
  return (
    <>
      <svg width={icon} height={icon} viewBox="0 0 24 24" style={{display: "block", flexShrink: 0, transform: `scale(${1 + 0.3 * bump(frame, HEART_FRAME, 8)})`, ...blurIn(frame, 2)}}>
        <path
          d={HEART}
          fill={HEART_RED}
          fillOpacity={filled}
          stroke={interpolateColors(filled, [0, 1], [tone.ink, HEART_RED])}
          strokeWidth={1.9}
          strokeLinejoin="round"
        />
      </svg>
      <svg width={icon} height={icon} viewBox="0 0 24 24" style={{display: "block", flexShrink: 0, transform: `scale(${1 + 0.15 * bump(frame, HEART_FRAME + 8, 8)})`, ...blurIn(frame, 4)}}>
        <path d={BUBBLE} fill="none" stroke={tone.ink} strokeWidth={1.9} strokeLinejoin="round" />
      </svg>
      <div style={{maxWidth: 560 * u, fontSize: 30 * u, fontWeight: 700, lineHeight: 1.2, color: tone.ink, marginLeft: 4 * u}}>
        {text.split(" ").map((word, index) => (
          <span key={`${index}-${word}`} style={{display: "inline-block", marginRight: "0.28em", ...blurIn(frame, 6 + index * WORD_STAGGER, 4)}}>
            {word}
          </span>
        ))}
      </div>
    </>
  );
};

export const Cta = ({cta}: {cta: CtaOverlay}) => {
  const placement = cta.placement ?? "top";
  const tone = TONES[cta.tone ?? "light"];
  const u = placement === "caption" ? CAPTION_SCALE : 1;
  const motion = useCardMotion(placement === "caption" ? 1 : -1);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: placement === "caption" ? "flex-end" : "flex-start",
        paddingTop: placement === "top" ? (cta.y ?? CTA_TOP_Y) : 0,
        paddingBottom: placement === "caption" ? SAFE_AREA.bottom + 20 : 0,
        paddingLeft: SAFE_AREA.side,
        // The action rail runs down the lower right; the end card stays clear of it.
        paddingRight: placement === "caption" ? SAFE_AREA.rail : SAFE_AREA.side,
        fontFamily: LATIN_FONT,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18 * u,
          padding: `${12 * u}px ${14 * u}px`,
          borderRadius: 30 * u,
          background: tone.card,
          border: `1px solid ${tone.edge}`,
          boxShadow: "0 14px 40px rgba(0,0,0,0.30), 0 2px 8px rgba(0,0,0,0.14)",
          ...motion,
        }}
      >
        {cta.mode === "follow" ? <FollowRow u={u} tone={tone} /> : <EngageRow u={u} tone={tone} text={cta.text} />}
      </div>
    </AbsoluteFill>
  );
};
