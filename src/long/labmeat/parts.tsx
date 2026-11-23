import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {AYAHS} from "../../data/quran";
import {ARABIC_FONT} from "../../theme";
import hadith from "../../data/hadith/tirmidhi-1480.json";
import {arrive, CLAMP, LAB, leave, SANS, sec, SERIF, SIDE, t01} from "./look";

// The 2D pieces of chapters 1-9 that the hook does not have: a counted number, a split bar,
// labels on globe pins and under the tags, the two sides of a debate, the Ayah and hadith
// cards, the subscribe line and the end screen. All follow the Night lab look (beats.md).

const show = (frame: number, at: number, end: number) => frame >= sec(at) && frame < sec(end);

// A number that counts up as it is said, big, with one small line under it.
export const Count = ({at, end, to, prefix = "", suffix = "", sub, from = 0, dur = 1.2, x = SIDE, y = 330, size = 210, decimals = 0}: {at: number; end: number; to: number; prefix?: string; suffix?: string; sub?: string; from?: number; dur?: number; x?: number; y?: number; size?: number; decimals?: number}) => {
  const frame = useCurrentFrame();
  if (!show(frame, at, end)) return null;
  const k = arrive(frame, sec(at), 14) * leave(frame, sec(end) - 6, 6);
  const v = interpolate(frame, [sec(at), sec(at + dur)], [from, to], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const text = v.toLocaleString("en-US", {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
  return (
    <div style={{position: "absolute", left: x, top: y, opacity: k}}>
      <div style={{fontFamily: SERIF, fontSize: size, lineHeight: 0.95, color: LAB.ink, fontVariantNumeric: "tabular-nums", textShadow: "0 4px 40px rgba(0,0,0,0.5)"}}>
        {prefix}
        {text}
        {suffix}
      </div>
      {sub ? <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 38, color: LAB.inkSoft, marginTop: 18, opacity: t01(frame, sec(at) + 10, sec(at) + 24)}}>{sub}</div> : null}
    </div>
  );
};

// The GOOD Meat 3 pack (May 2024): one bar, 3% cultivated chicken in culture pink, 97% plants.
export const SplitBar = ({at, end}: {at: number; end: number}) => {
  const frame = useCurrentFrame();
  if (!show(frame, at, end)) return null;
  const k = arrive(frame, sec(at), 16) * leave(frame, sec(end) - 6, 6);
  const fill = t01(frame, sec(at) + 6, sec(at) + 30);
  const plant = t01(frame, sec(at + 3.2), sec(at + 3.2) + 24);
  const W = 1500;
  return (
    <div style={{position: "absolute", left: 210, top: 470, width: W, opacity: k}}>
      <div style={{display: "flex", height: 120, borderRadius: 6, overflow: "hidden", background: "rgba(233,236,232,0.14)", boxShadow: "inset 0 0 0 2px rgba(233,236,232,0.25)"}}>
        <div style={{width: `${3 * fill}%`, background: LAB.medium}} />
        <div style={{width: `${97 * plant}%`, background: "#7E8C78"}} />
      </div>
      <div style={{display: "flex", justifyContent: "space-between", marginTop: 26}}>
        <div style={{fontFamily: SERIF, fontSize: 92, color: LAB.medium, lineHeight: 1}}>
          3%<span style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, color: LAB.inkSoft, marginLeft: 18}}>cultivated chicken</span>
        </div>
        <div style={{fontFamily: SERIF, fontSize: 92, color: "#B7C2B0", lineHeight: 1, opacity: plant}}>
          97%<span style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, color: LAB.inkSoft, marginLeft: 18}}>plant protein</span>
        </div>
      </div>
    </div>
  );
};

// A label beside a point on screen (a globe pin, a tag): a short name and one small line.
export const Tagline = ({at, end, x, y, name, sub, align = "left", size = 44}: {at: number; end: number; x: number; y: number; name: string; sub?: string; align?: "left" | "right" | "center"; size?: number}) => {
  const frame = useCurrentFrame();
  if (!show(frame, at, end)) return null;
  const k = arrive(frame, sec(at), 14) * leave(frame, sec(end) - 6, 6);
  const shift = align === "right" ? "-100%" : align === "center" ? "-50%" : "0";
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(${shift}, -50%)`, opacity: k, textAlign: align, textShadow: "0 2px 18px rgba(0,0,0,0.75)", whiteSpace: "nowrap"}}>
      <div style={{fontFamily: SERIF, fontSize: size, color: LAB.ink, lineHeight: 1.05}}>{name}</div>
      {sub ? <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: LAB.inkSoft, marginTop: 6}}>{sub}</div> : null}
    </div>
  );
};

// Two sides of one question. Each side's voices arrive as they are named; `lit` picks the
// side being spoken about, the other waits at half strength.
export type Voice = {at: number; name: string; note: string};
export const TwoSides = ({at, end, left, right, lit}: {at: number; end: number; left: {title: string; voices: Voice[]}; right: {title: string; at: number; voices: Voice[]}; lit: {at: number; side: "left" | "right" | "both"}[]}) => {
  const frame = useCurrentFrame();
  if (!show(frame, at, end)) return null;
  const k = arrive(frame, sec(at), 18) * leave(frame, sec(end) - 8, 8);
  const cur = [...lit].reverse().find((l) => frame >= sec(l.at))?.side ?? "left";
  const col = (side: "left" | "right", title: string, from: number, voices: Voice[]) => {
    const on = cur === "both" || cur === side ? 1 : 0.38;
    const a = arrive(frame, sec(from), 16);
    return (
      <div style={{width: 760, opacity: a * on, transition: "none"}}>
        <div style={{fontFamily: SERIF, fontSize: 70, lineHeight: 1.04, color: LAB.ink, minHeight: 150}}>{title}</div>
        <div style={{height: 2, background: "rgba(233,236,232,0.25)", margin: "22px 0 26px"}} />
        {voices.map((v, i) => {
          const vk = arrive(frame, sec(v.at), 14);
          if (vk <= 0) return null;
          return (
            <div key={i} style={{marginBottom: 26, opacity: vk, transform: `translateY(${(1 - vk) * 14}px)`}}>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: LAB.ink}}>{v.name}</div>
              <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: LAB.inkSoft, marginTop: 4}}>{v.note}</div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: `rgba(12,21,25,${0.72 * k})`}}>
      <div style={{position: "absolute", left: 160, right: 160, top: 170, display: "flex", justifyContent: "space-between", opacity: k}}>
        {col("left", left.title, at, left.voices)}
        <div style={{width: 2, background: "rgba(233,236,232,0.18)", margin: "0 20px"}} />
        {col("right", right.title, right.at, right.voices)}
      </div>
    </AbsoluteFill>
  );
};

// The Ayah card: the fetched Uthmani text (src/data/quran, never typed by hand), the
// translation under it with the spoken word marked, and the reference. Nothing plays under it.
export const AyahCard = ({ayahKey, at, end, translation, mark, markAt, credit}: {ayahKey: string; at: number; end: number; translation: [string, string, string]; mark?: string; markAt: number; credit: string}) => {
  const frame = useCurrentFrame();
  if (!show(frame, at, end)) return null;
  const ayah = AYAHS[ayahKey];
  if (!ayah) throw new Error(`Ayah ${ayahKey} is missing. Run scripts/fetch_ayah.py ${ayahKey}`);
  const k = arrive(frame, sec(at), 20) * leave(frame, sec(end) - 8, 8);
  const m = t01(frame, sec(markAt), sec(markAt) + 16);
  return (
    <AbsoluteFill style={{background: `rgba(12,21,25,${0.86 * k})`, opacity: k}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 250, textAlign: "center"}}>
        <div style={{fontFamily: ARABIC_FONT, fontSize: 110, lineHeight: 2.1, color: LAB.ink, direction: "rtl"}}>{ayah.textUthmani}</div>
        <div style={{fontFamily: SERIF, fontSize: 70, color: LAB.ink, marginTop: 18}}>
          {translation[0]}
          <span style={{backgroundImage: `linear-gradient(${LAB.medium}, ${LAB.medium})`, backgroundRepeat: "no-repeat", backgroundPosition: "0 92%", backgroundSize: `${m * 100}% 5px`}}>{translation[1]}</span>
          {translation[2]}
        </div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: LAB.inkSoft, marginTop: 34}}>{credit}</div>
      </div>
      {mark ? null : null}
    </AbsoluteFill>
  );
};

// The hadith card: the Prophet's ﷺ saying in Arabic and English, from sunnah.com
// (src/data/hadith), with the reference and its grade. Words, never a person, on screen.
export const HadithCard = ({at, end, markAt}: {at: number; end: number; markAt: number}) => {
  const frame = useCurrentFrame();
  if (!show(frame, at, end)) return null;
  const k = arrive(frame, sec(at), 20) * leave(frame, sec(end) - 8, 8);
  const m = t01(frame, sec(markAt), sec(markAt) + 18);
  const en = hadith.sayingEnglish;
  const cut = en.indexOf("dead flesh");
  return (
    <AbsoluteFill style={{background: `rgba(12,21,25,${0.86 * k})`, opacity: k}}>
      <div style={{position: "absolute", left: 140, right: 140, top: 230, textAlign: "center"}}>
        <div style={{fontFamily: ARABIC_FONT, fontSize: 92, lineHeight: 2.0, color: LAB.ink, direction: "rtl"}}>{hadith.sayingArabic}</div>
        <div style={{fontFamily: SERIF, fontSize: 64, lineHeight: 1.15, color: LAB.ink, marginTop: 20, textWrap: "balance"} as React.CSSProperties}>
          “{en.slice(0, cut)}
          <span style={{backgroundImage: `linear-gradient(rgba(247,214,92,0.7), rgba(247,214,92,0.7))`, backgroundRepeat: "no-repeat", backgroundPosition: "0 85%", backgroundSize: `${m * 100}% 40%`}}>dead flesh</span>
          {en.slice(cut + "dead flesh".length)}”
        </div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, color: LAB.inkSoft, marginTop: 40}}>
          Hadith · {hadith.ref} · {hadith.grade} · narrated by {hadith.narrator}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// The spoken subscribe line and the comment question, then the 20 s end screen with room
// for YouTube's end-screen elements (two videos on the right, subscribe on the left).
export const EndScreen = ({ctaAt, askAt, endAt, total}: {ctaAt: number; askAt: number; endAt: number; total: number}) => {
  const frame = useCurrentFrame();
  if (frame < sec(ctaAt)) return null;
  const cta = arrive(frame, sec(ctaAt), 18) * leave(frame, sec(askAt) - 6, 6);
  const ask = arrive(frame, sec(askAt), 18) * leave(frame, sec(endAt) - 6, 6);
  const end = arrive(frame, sec(endAt), 24);
  return (
    <AbsoluteFill>
      {cta > 0 ? (
        <div style={{position: "absolute", left: SIDE, top: 760, opacity: cta}}>
          <div style={{fontFamily: SERIF, fontSize: 84, color: LAB.ink, lineHeight: 1.05}}>Every claim, with its source.</div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: LAB.amberLight, marginTop: 18}}>Subscribe to Modern Islamic Studio</div>
        </div>
      ) : null}
      {ask > 0 ? (
        <div style={{position: "absolute", left: SIDE, top: 720, opacity: ask}}>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, color: LAB.inkSoft}}>Tell us in the comments</div>
          <div style={{fontFamily: SERIF, fontSize: 84, color: LAB.ink, lineHeight: 1.05, marginTop: 12}}>
            With a halal certificate,
            <br />
            <span style={{fontStyle: "italic"}}>would you eat it?</span>
          </div>
        </div>
      ) : null}
      {end > 0 && frame < sec(total) ? (
        <AbsoluteFill style={{background: `rgba(12,21,25,${0.78 * end})`}}>
          <div style={{position: "absolute", left: SIDE, top: 220, opacity: end}}>
            <div style={{fontFamily: SERIF, fontSize: 96, color: LAB.ink, lineHeight: 1.02}}>
              New technology.
              <br />
              <span style={{fontStyle: "italic", color: LAB.amberLight}}>Same three questions.</span>
            </div>
            <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 32, color: LAB.inkSoft, marginTop: 34}}>Sources for every claim are in the description.</div>
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};

export const _keep = React;
