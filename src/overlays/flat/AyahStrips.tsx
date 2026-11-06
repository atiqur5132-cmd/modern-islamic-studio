import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {AYAHS} from "../../data/quran";
import {AyahStripsOverlay} from "../../timeline/flatTypes";
import {Cue} from "../falak/common";
import {arrive, INK, leave, MARK, MUTED, SAND, SANS, SIDE, TERM, TEXT_TOP} from "./look";
import {AyahLine, Tag, TornCard} from "./parts";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// The Ayah card: fetched text only, one strip per Ayah, each landing on the words that
// name it; the checked word ringed in marker. One strip is the 88:20 card itself.
export const AyahStrips = ({card, cue}: {card: AyahStripsOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const single = card.strips.length === 1;
  const size = single ? 118 : 62;
  const ringAt = card.ring ? cue(card.ring.at) : Infinity;
  const push = card.push ? interpolate(frame, [Math.min(ringAt, durationInFrames) - 12, durationInFrames], [1, 1.12], CLAMP) : 1;
  const drift = interpolate(frame, [0, durationInFrames], [1, 1.03], CLAMP);
  // It covers the frame and ends on a cut: no fade, which would show the speaker's
  // circle through it for a frame. It lands with a short rise instead of fading in.
  const rise = arrive(frame, 0, 8);
  const label = card.ring ? arrive(frame, ringAt + 6, 10) : 0;
  const translation = card.translation ? arrive(frame, cue(card.translation.at), 12) : 0;

  return (
    <AbsoluteFill style={{backgroundColor: SAND}}>
      {card.photo ? (
        <AbsoluteFill>
          <Img
            src={staticFile(`footage/${card.photo}`)}
            style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${drift * 1.04})`, filter: "saturate(0.85)"}}
          />
          <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(239,228,207,0.92) 0%, rgba(239,228,207,0.35) 45%, rgba(0,0,0,0.05) 100%)"}} />
        </AbsoluteFill>
      ) : null}
      <div style={{position: "absolute", top: TEXT_TOP, left: SIDE, right: SIDE}}>
        <Tag text={card.tag} />
      </div>
      <div
        style={{
          position: "absolute",
          top: single ? 360 : 320,
          left: 40,
          right: 40,
          transform: `scale(${push * drift})`,
          transformOrigin: single ? "28% 40%" : "50% 80%",
        }}
      >
        <TornCard style={{transform: `translateY(${(1 - rise) * 60}px) scale(${0.96 + 0.04 * rise})`}}>
          <div style={{display: "flex", flexDirection: "column", gap: single ? 0 : 6}}>
            {card.strips.map((strip, index) => {
              // Strips due at the card's own start are there from its first frame.
              const shown = cue(strip.at) <= 0 ? 1 : arrive(frame, cue(strip.at), 10);
              const ring = card.ring && card.ring.ayah === strip.ayah ? {word: card.ring.word, at: ringAt} : undefined;
              const surah = (AYAHS as Record<string, {key: string}>)[strip.ayah]?.key ?? strip.ayah;
              return (
                <div
                  key={strip.ayah}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    opacity: shown,
                    transform: `translateY(${(1 - shown) * 40}px)`,
                    borderTop: index > 0 ? `2px dashed ${MUTED}55` : undefined,
                    paddingTop: index > 0 ? 4 : 0,
                  }}
                >
                  <div style={{width: single ? 0 : 128, display: single ? "none" : "flex", flexDirection: "column", gap: 2}}>
                    <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 30, color: MARK}}>{surah}</span>
                    {strip.gloss ? <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: INK}}>{strip.gloss}</span> : null}
                  </div>
                  <div style={{flex: 1}}>
                    <AyahLine ayah={strip.ayah} size={size} ring={ring} />
                  </div>
                </div>
              );
            })}
            {single ? (
              <div style={{display: "flex", gap: 36, alignItems: "baseline", marginTop: 6}}>
                <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 36, color: MARK}}>{surahLabel(card.strips[0].ayah)}</span>
                {card.ring?.term ? (
                  <span style={{opacity: label, fontFamily: TERM, fontStyle: "italic", fontWeight: 600, fontSize: 64, color: INK}}>
                    {card.ring.term}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        </TornCard>
      </div>
      {card.ring?.label || card.translation ? (
        <div
          style={{
            position: "absolute",
            top: single ? 1010 : 960,
            left: SIDE,
            right: 140,
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 42,
            lineHeight: 1.15,
            color: INK,
            opacity: card.translation ? translation : label,
            transform: `translateY(${(1 - (card.translation ? translation : label)) * 14}px)`,
          }}
        >
          {card.translation ? card.translation.text : card.ring?.label}
        </div>
      ) : null}
      {card.translation ? (
        <div style={{position: "absolute", top: single ? 1125 : 1075, left: SIDE, fontFamily: SANS, fontWeight: 600, fontSize: 28, color: MUTED, opacity: translation}}>
          After Sahih International
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const NAMES: Record<string, string> = {"88": "Al-Ghashiyah", "79": "An-Nazi'at"};
const surahLabel = (key: string) => `${NAMES[key.split(":")[0]] ?? "Surah"} ${key}`;
