import React from "react";
import {LOOK} from "./look";

// Our own phone and feed, drawn in code: no real app's screen or logo (trademark).
// Reels are abstract tiles: a tone, a shape and two text bars, enough to read as "a reel".
const TONES = ["#4b5a6e", "#6e5a4b", "#4b6e62", "#5f4b6e", "#6e4b55", "#55604a", "#46607a", "#7a6446"];

export const reelTone = (n: number, good = false) => (good ? LOOK.amber : TONES[((n % TONES.length) + TONES.length) % TONES.length]);

export const Reel = ({n, good = false, gray = false}: {n: number; good?: boolean; gray?: boolean}) => {
  const tone = reelTone(n, good);
  const shape = ((n * 7) % 3 + 3) % 3;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(170deg, ${tone}, ${shade(tone)})`,
        filter: gray ? "grayscale(1)" : undefined,
        overflow: "hidden",
      }}
    >
      {shape === 0 && <div style={{position: "absolute", left: "22%", top: "26%", width: "56%", aspectRatio: "1", borderRadius: "50%", background: "rgba(255,255,255,0.16)"}} />}
      {shape === 1 && <div style={{position: "absolute", left: "14%", top: "30%", width: "72%", height: "30%", borderRadius: 18, background: "rgba(255,255,255,0.14)"}} />}
      {shape === 2 && <div style={{position: "absolute", left: "30%", top: "18%", width: "40%", height: "48%", borderRadius: "48% 48% 12px 12px", background: "rgba(255,255,255,0.15)"}} />}
      <div style={{position: "absolute", left: "9%", bottom: "13%", width: "62%", height: 14, borderRadius: 7, background: "rgba(255,255,255,0.5)"}} />
      <div style={{position: "absolute", left: "9%", bottom: "8.5%", width: "40%", height: 12, borderRadius: 6, background: "rgba(255,255,255,0.3)"}} />
      {good && <div style={{position: "absolute", right: "8%", bottom: "30%", width: 46, height: 42, color: "#fff", fontSize: 44, lineHeight: 1}}>♥</div>}
    </div>
  );
};

const shade = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * 0.55);
  const g = Math.round(((n >> 8) & 255) * 0.55);
  const b = Math.round((n & 255) * 0.55);
  return `rgb(${r},${g},${b})`;
};

// A phone seen in 3D: body, bezel, screen. `scroll` is how many reels have gone by
// (fractional during a swipe); `good` marks reels that land well.
export const Phone = ({
  scroll,
  width = 420,
  tiltX = 8,
  tiltY = -16,
  good = [],
  gray = false,
  children,
}: {
  scroll: number;
  width?: number;
  tiltX?: number;
  tiltY?: number;
  good?: number[];
  gray?: boolean;
  children?: React.ReactNode;
}) => {
  const height = width * 2.08;
  const base = Math.floor(scroll);
  const frac = scroll - base;
  return (
    <div style={{width, height, perspective: 2200}}>
      <div
        style={{
          width,
          height,
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: "preserve-3d",
          borderRadius: width * 0.14,
          background: "#0d0f13",
          boxShadow: "0 60px 120px rgba(0,0,0,0.55), inset 0 0 0 3px #2b2f38",
          padding: width * 0.035,
        }}
      >
        <div style={{position: "relative", width: "100%", height: "100%", borderRadius: width * 0.11, overflow: "hidden", background: "#000"}}>
          {[-1, 0, 1].map((k) => {
            const n = base + k;
            return (
              <div key={n} style={{position: "absolute", inset: 0, transform: `translateY(${(k - frac) * 100}%)`}}>
                <Reel n={n} good={good.includes(n)} gray={gray} />
              </div>
            );
          })}
          {children}
          <div style={{position: "absolute", top: "2.2%", left: "38%", width: "24%", height: "3.2%", borderRadius: 20, background: "#000"}} />
        </div>
      </div>
    </div>
  );
};

// Ease a swipe: reel n moves to n+1 over `length` frames starting at `at`.
export const swipes = (frame: number, times: number[], length = 9) => {
  let s = 0;
  for (const t of times) {
    const p = Math.min(1, Math.max(0, (frame - t) / length));
    s += 1 - Math.pow(1 - p, 3);
  }
  return s;
};
