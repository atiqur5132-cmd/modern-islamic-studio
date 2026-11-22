import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {Cues} from "../long/scroll/types";
import {ayahTokens} from "../overlays/kasawna/look";
import {ACCENT, arrive, ARABIC, draw, PAPER, PAPER_INK, PAPER_MUTED, SANS, SERIF, SIDE, TEXT_TOP} from "./look";

// Lines 3-4: the camera has dived into the open Quran, so the page fills the frame. The
// fetched words 1-14 of 2:219 (an excerpt, cross-checked) are set in the whole Amiri Quran
// font; each is ringed as it is said: ithmun kabir (great sin) in rust, the harm side;
// manafi'u lin-nas (benefits for people) in the page's ink; then akbar (greater) in rust.
// Nothing is typed by hand: the words come from src/data/quran/2-219.json.

type Ring = {from: number; to: number; at: number; color: string};

const Ringed = ({text, ring, frame}: {text: string; ring?: Ring; frame: number}) => {
  const p = ring ? draw(frame, ring.at, 14) : 0;
  return (
    <span style={{position: "relative", display: "inline-block", padding: "0 0.12em"}}>
      {text}
      {ring && p > 0 ? (
        <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{position: "absolute", left: "-8%", top: "6%", width: "116%", height: "92%", overflow: "visible"}}>
          <path
            d="M 52 4 C 86 3, 99 18, 97 32 C 95 49, 70 57, 46 56 C 18 55, 2 45, 3 30 C 4 14, 26 4, 58 6"
            fill="none"
            stroke={ring.color}
            strokeWidth={2.6}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - p}
            style={{strokeWidth: 5}}
          />
        </svg>
      ) : null}
    </span>
  );
};

type Sheet = {
  key: string;
  maxWord: number;
  label: string;
  rings: Ring[];
  // Words up to `dimTo` step back from frame `dimAt` (so the second half leads).
  dimTo?: number;
  dimAt?: number;
  // Translation lines, each shown from its frame until the next one.
  lines: {at: number; node: React.ReactNode}[];
  credit: string;
  fontSize?: number;
  lineSize?: number;
};

const AyahSheet = ({sheet}: {sheet: Sheet}) => {
  const frame = useCurrentFrame();
  const {rings} = sheet;
  const tokens = ayahTokens(sheet.key).filter((t) => t.word === null || t.word <= sheet.maxWord);
  // A trailing pause mark after the last word kept is dropped with the rest of the Ayah.
  while (tokens.length && tokens[tokens.length - 1].word === null) tokens.pop();
  // Group the ringed spans: a ring covers its words as one inline block.
  const parts: {text: string; ring?: Ring; word: number | null}[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const ring = t.word !== null ? rings.find((r) => r.from === t.word) : undefined;
    if (ring) {
      const group = tokens.filter((x) => x.word !== null && x.word >= ring.from && x.word <= ring.to).map((x) => x.text);
      parts.push({text: group.join(" "), ring, word: t.word});
      i += ring.to - ring.from;
    } else if (t.word === null && parts.length) {
      // A pause mark stays on its word, with no space (memory: Linux render glyphs).
      parts[parts.length - 1].text += t.text;
    } else parts.push({text: t.text, word: t.word});
  }
  // The dive: the page arrives a little large and settles; a slow drift after.
  const settle = interpolate(frame, [0, 16], [1.1, 1], {extrapolateRight: "clamp"});
  const drift = 1 + frame * 0.00025;
  // The page is the open book's right-hand page, seen a little from above: a slow 3D drift
  // keeps it a page in the studio, not a flat slide.
  const tiltX = 9 - frame * 0.012;
  const tiltY = -5 + frame * 0.01;
  const back = sheet.dimAt !== undefined ? arrive(frame, sheet.dimAt, 16) : 0;
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <AbsoluteFill style={{background: "#15110D"}} />
      <AbsoluteFill style={{perspective: 1800}}>
        <AbsoluteFill style={{transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${settle * drift * 1.06})`, transformOrigin: "50% 45%", boxShadow: "0 40px 120px rgba(0,0,0,0.6)"}}>
          <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 42%, #F4ECDE 0%, #EDE4D3 55%, #DCCDB2 100%)"}} />
          {/* The gutter: the page curves down into the spine on the left. */}
          <AbsoluteFill style={{background: "linear-gradient(90deg, rgba(60,40,20,0.55) 0%, rgba(60,40,20,0.18) 5%, rgba(60,40,20,0) 14%, rgba(0,0,0,0) 92%, rgba(60,40,20,0.12) 100%)"}} />
          <div style={{position: "absolute", inset: 46, border: "3px solid rgba(150,112,52,0.55)"}} />
          <div style={{position: "absolute", inset: 60, border: "1.2px solid rgba(150,112,52,0.5)"}} />
          <div style={{position: "absolute", left: SIDE, top: TEXT_TOP - 40, fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: 1.2, color: PAPER_MUTED}}>{sheet.label}</div>
          <div dir="rtl" style={{position: "absolute", left: SIDE - 30, right: SIDE - 30, top: TEXT_TOP + 50, fontFamily: ARABIC, fontSize: sheet.fontSize ?? 72, lineHeight: 2.1, color: PAPER_INK, textAlign: "center"}}>
            {parts.map((part, i) => {
              const dim = sheet.dimTo !== undefined && part.word !== null && part.word <= sheet.dimTo ? 1 - back * 0.62 : 1;
              return (
                <span key={i} style={{opacity: dim}}>
                  <Ringed text={part.text} ring={part.ring} frame={frame} />{" "}
                </span>
              );
            })}
          </div>
          <div style={{position: "absolute", left: SIDE, right: SIDE, top: 880, fontFamily: SERIF, fontSize: sheet.lineSize ?? 62, lineHeight: 1.12, color: PAPER_INK, textWrap: "balance"}}>
            {sheet.lines.map((l, i) => {
              const next = sheet.lines[i + 1]?.at ?? Infinity;
              const t = arrive(frame, l.at, 16) * (1 - arrive(frame, next - 4, 8));
              return (
                <div key={i} style={{opacity: t, position: "absolute", top: 0, left: 0, right: 0, transform: `translateY(${(1 - arrive(frame, l.at, 16)) * 14}px)`}}>
                  {l.node}
                </div>
              );
            })}
          </div>
          <div style={{position: "absolute", left: SIDE, top: 1056, fontFamily: SANS, fontWeight: 600, fontSize: 29, color: PAPER_MUTED, whiteSpace: "nowrap"}}>{sheet.credit}</div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const em = (t: string, rust = false) => <span style={{fontStyle: "italic", color: rust ? ACCENT : undefined}}>{t}</span>;

// Lines 3-4: 2:219 words 1-14. ithmun kabir (great sin) in rust; manafi'u lin-nas
// (benefits for people) in ink; then akbar (greater) in rust as the first half steps back.
export const AyahPage = ({cues}: {cues: Cues}) => (
  <AyahSheet
    sheet={{
      key: "2:219",
      maxWord: 14,
      label: "Al-Baqarah · 2:219",
      rings: [
        {from: 7, to: 8, at: cues.word(3, 1) + 2, color: ACCENT},
        {from: 9, to: 10, at: cues.word(3, 9), color: PAPER_INK},
        {from: 12, to: 12, at: cues.word(4, 11), color: ACCENT},
      ],
      dimTo: 10,
      dimAt: cues.line(4),
      lines: [
        {at: 0, node: <>“In them is {em("great sin", true)}, and {em("some benefit")} for people.”</>},
        {at: cues.line(4) + 4, node: <>“But their sin is {em("greater", true)} than their benefit.”</>},
      ],
      credit: "Quranic text · Al-Baqarah 2:219 · Sahih International",
    }}
  />
);

// Lines 13-14: 5:91 words 1-17 (fetched; the Ayah's last words are not shown). al-'adawata
// wal-baghda' (enmity and hatred) in rust; then dhikr Allah ... as-salah (the remembrance
// of Allah and prayer) in ink.
export const AyahPage591 = ({cues}: {cues: Cues}) => (
  <AyahSheet
    sheet={{
      key: "5:91",
      maxWord: 17,
      label: "Al-Ma’idah · 5:91",
      fontSize: 64,
      lineSize: 52,
      rings: [
        {from: 7, to: 8, at: cues.word(13, 6), color: ACCENT},
        {from: 14, to: 17, at: cues.word(14, 2), color: PAPER_INK},
      ],
      dimTo: 11,
      dimAt: cues.line(14),
      lines: [
        {at: 0, node: <>“Satan only wants to cause between you {em("animosity and hatred", true)} through intoxicants and gambling…”</>},
        {at: cues.line(14) + 2, node: <>“…and to avert you from {em("the remembrance of Allah")} and from {em("prayer")}.”</>},
      ],
      credit: "Quranic text · Al-Ma’idah 5:91 · Sahih International",
    }}
  />
);
