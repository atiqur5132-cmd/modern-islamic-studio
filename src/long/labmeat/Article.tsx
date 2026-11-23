import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {arrive, CLAMP, LAB, SANS, sec, SERIF, t01} from "./look";

// A source, set as type (creator, 2026-11-24: "article ka real page aise na dikha ke, text
// extract karke design banao, jo highlight karna hai karo jaise bade YouTubers karte hain").
// The words are the source's own, verbatim, with "[…]" where text is left out; the source,
// its kind and date sit on top. No logo and no copy of the site's look: it is our quote card.
// A marker runs under the spoken words one word at a time; the rest of the card dims, and the
// camera eases to the line being read.

export type Seg = {t: string; mark?: number; group?: number};
export type Block = {kind: "p" | "item" | "gap"; segs?: Seg[]};
export type MarkCue = {at: number; dur: number; color?: "yellow" | "amber"};
export type Focus = {at: number; y: number; scale: number; frames?: number};
// Groups of text that dim (0..1) from a time: everything not in `keep` fades back.
export type Dim = {at: number; keep: number[]; to?: number};

const CARD_W = 1180;
const PAD = 72;
const BODY = 37;
const LINE = 1.52;

const ease = Easing.inOut(Easing.cubic);

export const Article = ({from, to, source, kind, date, title, blocks, marks, focus, dims = []}: {
  from: number;
  to: number;
  source: string;
  kind: string;
  date: string;
  title: string;
  blocks: Block[];
  marks: MarkCue[];
  focus: Focus[];
  dims?: Dim[];
}) => {
  const frame = useCurrentFrame();
  if (frame < sec(from) || frame >= sec(to)) return null;
  const up = arrive(frame, sec(from), 22);

  // Camera on the card: ease between focus points (y = px from the card's top).
  let cur = focus[0];
  for (let i = 1; i < focus.length; i++) {
    const f = focus[i];
    if (frame >= sec(f.at)) {
      const k = t01(frame, sec(f.at), sec(f.at) + (f.frames ?? 26));
      const p = focus[i - 1];
      cur = {at: f.at, y: p.y + (f.y - p.y) * k, scale: p.scale + (f.scale - p.scale) * k};
    }
  }
  const drift = 1 + (frame - sec(from)) * 0.0003;
  const scale = cur.scale * drift;
  const sway = Math.sin((frame - sec(from)) / 70) * 1.2;

  // Dimming: the latest dim cue decides which groups stay bright.
  const dimOf = (group: number | undefined) => {
    let o = 1;
    for (const d of dims) {
      const k = t01(frame, sec(d.at), sec(d.at) + 14);
      if (k <= 0) continue;
      const keep = group !== undefined && d.keep.includes(group);
      o = keep ? o + (1 - o) * k : o + ((d.to ?? 0.28) - o) * k;
    }
    return o;
  };

  // Marker: each marked segment's words fill one after another over the cue's duration.
  const renderSeg = (s: Seg, key: string) => {
    const op = dimOf(s.group);
    if (s.mark === undefined) return <span key={key} style={{opacity: op}}>{s.t}</span>;
    const cue = marks[s.mark];
    const words = s.t.split(/(\s+)/);
    const n = words.filter((w) => w.trim()).length;
    let idx = 0;
    const col = cue.color === "amber" ? "rgba(224,162,58,0.62)" : "rgba(247,214,92,0.78)";
    return (
      <span key={key} style={{opacity: op}}>
        {words.map((w, j) => {
          if (!w.trim()) return <span key={j}>{w}</span>;
          const i = idx++;
          const a = sec(cue.at) + (i / n) * cue.dur * 30;
          const p = interpolate(frame, [a, a + Math.max(4, (cue.dur * 30) / n + 2)], [0, 1], {...CLAMP, easing: Easing.out(Easing.quad)});
          return (
            <span
              key={j}
              style={{
                backgroundImage: `linear-gradient(${col}, ${col})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${p * 100}% 78%`,
                backgroundPosition: "0 70%",
                padding: "0 3px",
                margin: "0 -3px",
                borderRadius: 3,
                color: p > 0.2 ? LAB.paperInk : undefined,
              }}
            >
              {w}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <AbsoluteFill style={{perspective: 2600}}>
      <AbsoluteFill style={{background: `rgba(10,18,21,${0.6 * up})`}} />
      <div
        style={{
          position: "absolute",
          left: 960 - CARD_W / 2,
          top: 540 - cur.y,
          width: CARD_W,
          padding: PAD,
          background: "linear-gradient(180deg, #F8F6F0 0%, #F2EFE7 100%)",
          boxShadow: "0 60px 160px rgba(0,0,0,0.6), 0 10px 30px rgba(0,0,0,0.35)",
          borderRadius: 6,
          transformOrigin: `50% ${cur.y}px`,
          transform: `translateY(${(1 - up) * 640}px) rotateX(${(1 - up) * 50 + 2}deg) rotateY(${sway}deg) scale(${scale})`,
          opacity: Math.min(1, up * 1.6),
          color: "#2B3438",
        }}
      >
        <div style={{display: "flex", justifyContent: "space-between", fontFamily: SANS, fontWeight: 600, fontSize: 26, color: "#6B777B", opacity: dimOf(-1)}}>
          <span>{source}</span>
          <span>
            {kind} · {date}
          </span>
        </div>
        <div style={{height: 2, background: "#D7D2C6", margin: "22px 0 30px"}} />
        <div style={{fontFamily: SERIF, fontSize: 88, lineHeight: 1.02, color: LAB.paperInk, marginBottom: 34, opacity: dimOf(-1)}}>{title}</div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: BODY, lineHeight: LINE, letterSpacing: -0.2}}>
          {blocks.map((b, i) => {
            if (b.kind === "gap") return <div key={i} style={{textAlign: "center", color: "#9AA3A6", margin: "8px 0 18px", opacity: dimOf(-1)}}>[…]</div>;
            return (
              <div key={i} style={{margin: b.kind === "item" ? "0 0 14px 34px" : "0 0 22px 0"}}>
                {(b.segs ?? []).map((s, j) => renderSeg(s, `${i}-${j}`))}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const _ease = ease;
