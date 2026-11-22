import * as THREE from "three";
import {ARABIC, ayahTokens} from "../overlays/kasawna/look";

// Canvas textures for the sharaab-fayda studio, all drawn here (no downloads, no licences):
// a walnut table, a plaster wall, the Quran's green leather cover with a gold border and
// title (gold areas also drawn into a metalness mask), the page block's edges and paper.

const rand = (seed: number) => {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return {c, g: c.getContext("2d")!};
};

const tex = (c: HTMLCanvasElement, srgb = true, repeat?: [number, number]) => {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
  }
  return t;
};

// Fine noise over a filled canvas, for grain.
const grain = (g: CanvasRenderingContext2D, w: number, h: number, amount: number, seed: number) => {
  const r = rand(seed);
  const img = g.getImageData(0, 0, w, h);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (r() - 0.5) * amount;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
};

export const walnut = () => {
  const W = 1024, H = 1024;
  const {c, g} = canvas(W, H);
  g.fillStyle = "#3B2719";
  g.fillRect(0, 0, W, H);
  const r = rand(7);
  // Long grain lines along x, slightly wavy, in darker and lighter browns.
  for (let k = 0; k < 260; k++) {
    const y0 = r() * H;
    const amp = 3 + r() * 10;
    const freq = 0.002 + r() * 0.006;
    const ph = r() * 6;
    g.strokeStyle = r() < 0.6 ? `rgba(22,12,6,${0.12 + r() * 0.25})` : `rgba(120,80,48,${0.06 + r() * 0.12})`;
    g.lineWidth = 0.6 + r() * 3.2;
    g.beginPath();
    for (let x = 0; x <= W; x += 8) g.lineTo(x, y0 + Math.sin(x * freq + ph) * amp + Math.sin(x * freq * 3.1) * amp * 0.25);
    g.stroke();
  }
  grain(g, W, H, 10, 3);
  return tex(c, true, [3, 3]);
};

export const plaster = () => {
  const W = 512, H = 512;
  const {c, g} = canvas(W, H);
  g.fillStyle = "#2A231D";
  g.fillRect(0, 0, W, H);
  const r = rand(11);
  for (let k = 0; k < 900; k++) {
    g.fillStyle = `rgba(${r() < 0.5 ? "0,0,0" : "90,74,60"},${0.03 + r() * 0.05})`;
    const s = 6 + r() * 40;
    g.beginPath();
    g.ellipse(r() * W, r() * H, s, s * (0.4 + r()), r() * 3, 0, Math.PI * 2);
    g.fill();
  }
  grain(g, W, H, 14, 5);
  return tex(c, true, [4, 2]);
};

// The cover: 1024 x 1400 (the book's width x depth). Drawn twice with the same geometry:
// once in colour, once as a mask (white where the gold is) for metalness and roughness.
const COVER_W = 1024, COVER_H = 1400;
const GOLD_DARK = "#8A6630", GOLD = "#C9A45C", GOLD_LIGHT = "#E8CF8E";

const star8 = (g: CanvasRenderingContext2D, x: number, y: number, R: number) => {
  // Two overlapping squares: the eight-point star of Islamic geometric art.
  for (const a of [0, Math.PI / 4]) {
    g.beginPath();
    for (let i = 0; i < 4; i++) {
      const t = a + (i * Math.PI) / 2;
      g.lineTo(x + R * Math.cos(t), y + R * Math.sin(t));
    }
    g.closePath();
    g.stroke();
  }
  g.beginPath();
  g.arc(x, y, R * 0.36, 0, Math.PI * 2);
  g.stroke();
};

const drawCover = (g: CanvasRenderingContext2D, mask: boolean) => {
  const W = COVER_W, H = COVER_H;
  if (mask) {
    g.fillStyle = "#000";
    g.fillRect(0, 0, W, H);
  } else {
    const base = g.createLinearGradient(0, 0, W, H);
    base.addColorStop(0, "#21402F");
    base.addColorStop(1, "#16301F");
    g.fillStyle = base;
    g.fillRect(0, 0, W, H);
    // Leather: soft blotches and fine creases.
    const r = rand(21);
    for (let k = 0; k < 1400; k++) {
      g.fillStyle = `rgba(${r() < 0.5 ? "0,0,0" : "70,110,84"},${0.02 + r() * 0.05})`;
      const s = 2 + r() * 18;
      g.beginPath();
      g.ellipse(r() * W, r() * H, s, s * (0.3 + r() * 0.7), r() * 3, 0, Math.PI * 2);
      g.fill();
    }
    grain(g, W, H, 18, 9);
  }
  const gold = (light = false) => {
    if (mask) return "#fff";
    const grad = g.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, light ? GOLD_LIGHT : GOLD);
    grad.addColorStop(0.5, GOLD_DARK);
    grad.addColorStop(1, light ? GOLD_LIGHT : GOLD);
    return grad;
  };
  g.strokeStyle = gold();
  g.fillStyle = gold();
  // Double border.
  g.lineWidth = 10;
  g.strokeRect(56, 56, W - 112, H - 112);
  g.lineWidth = 3;
  g.strokeRect(84, 84, W - 168, H - 168);
  // A band of small eight-point stars between the two border lines' inner frame.
  g.lineWidth = 3;
  const band = 120;
  for (let x = band; x <= W - band; x += 66) {
    star8(g, x, band, 20);
    star8(g, x, H - band, 20);
  }
  for (let y = band + 66; y <= H - band - 66; y += 66) {
    star8(g, band, y, 20);
    star8(g, W - band, y, 20);
  }
  g.lineWidth = 3;
  g.strokeRect(156, 156, W - 312, H - 312);
  // The central medallion: a large star with a ring, the title inside.
  const cx = W / 2, cy = H / 2;
  g.lineWidth = 6;
  star8(g, cx, cy, 330);
  g.lineWidth = 3;
  g.beginPath();
  g.arc(cx, cy, 250, 0, Math.PI * 2);
  g.stroke();
  // The title, the book's name (not Quranic text): al-Qur'an al-Karim.
  g.fillStyle = gold(true);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.direction = "rtl";
  g.font = `128px "${ARABIC}"`;
  g.fillText("القرآن", cx, cy - 62);
  g.font = `104px "${ARABIC}"`;
  g.fillText("الكريم", cx, cy + 92);
};

export const cover = () => {
  const a = canvas(COVER_W, COVER_H);
  drawCover(a.g, false);
  const b = canvas(COVER_W, COVER_H);
  drawCover(b.g, true);
  const metal = tex(b.c, false);
  // Roughness: leather rough (white), gold smooth (dark): the inverse of the mask.
  const rc = canvas(COVER_W, COVER_H);
  rc.g.filter = "invert(1)";
  rc.g.drawImage(b.c, 0, 0);
  rc.g.filter = "none";
  rc.g.globalCompositeOperation = "multiply";
  rc.g.fillStyle = "#d8d8d8";
  rc.g.fillRect(0, 0, COVER_W, COVER_H);
  return {map: tex(a.c), metalness: metal, roughness: tex(rc.c, false), normal: emboss(b.c)};
};

// A normal map from the gold mask: the gold is pressed into the leather (debossed), with
// a fine leather grain over everything, so the foil catches the light at its edges.
const emboss = (mask: HTMLCanvasElement) => {
  const W = mask.width, H = mask.height;
  const h = canvas(W, H);
  h.g.fillStyle = "#808080";
  h.g.fillRect(0, 0, W, H);
  h.g.filter = "blur(2.2px) invert(1)";
  h.g.globalAlpha = 0.85;
  h.g.drawImage(mask, 0, 0);
  h.g.filter = "none";
  h.g.globalAlpha = 1;
  const src = h.g.getImageData(0, 0, W, H).data;
  const r = rand(31);
  const height = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) height[i] = src[i * 4] / 255 + (r() - 0.5) * 0.05;
  const out = h.g.createImageData(W, H);
  const k = 2.6;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const dx = height[y * W + Math.min(W - 1, x + 1)] - height[y * W + Math.max(0, x - 1)];
      const dy = height[Math.min(H - 1, y + 1) * W + x] - height[Math.max(0, y - 1) * W + x];
      let nx = -dx * k, ny = dy * k, nz = 1;
      const len = Math.hypot(nx, ny, nz);
      nx /= len; ny /= len; nz /= len;
      out.data[i * 4] = (nx * 0.5 + 0.5) * 255;
      out.data[i * 4 + 1] = (ny * 0.5 + 0.5) * 255;
      out.data[i * 4 + 2] = (nz * 0.5 + 0.5) * 255;
      out.data[i * 4 + 3] = 255;
    }
  }
  h.g.putImageData(out, 0, 0);
  return tex(h.c, false);
};

// Brushed brass: fine streaks in the roughness, so highlights stretch like real metal.
export const brushed = () => {
  const W = 512, H = 512;
  const {c, g} = canvas(W, H);
  g.fillStyle = "#5A5A5A";
  g.fillRect(0, 0, W, H);
  const r = rand(41);
  for (let k = 0; k < 2200; k++) {
    const v = 60 + r() * 70;
    g.strokeStyle = `rgba(${v},${v},${v},${0.25 + r() * 0.35})`;
    g.lineWidth = 0.5 + r() * 1.5;
    const y = r() * H, x = r() * W;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + 40 + r() * 200, y + (r() - 0.5) * 2);
    g.stroke();
  }
  // Patina: soft darker and rougher blotches.
  for (let k = 0; k < 60; k++) {
    g.fillStyle = `rgba(150,150,150,${0.04 + r() * 0.06})`;
    g.beginPath();
    g.arc(r() * W, r() * H, 10 + r() * 50, 0, Math.PI * 2);
    g.fill();
  }
  return tex(c, false, [2, 2]);
};

export const leather = () => {
  const W = 256, H = 256;
  const {c, g} = canvas(W, H);
  g.fillStyle = "#1B3726";
  g.fillRect(0, 0, W, H);
  grain(g, W, H, 22, 13);
  return tex(c);
};

// The page block's edges: many thin cream lines.
export const pageEdge = () => {
  const W = 64, H = 512;
  const {c, g} = canvas(W, H);
  g.fillStyle = "#E6DAC1";
  g.fillRect(0, 0, W, H);
  const r = rand(17);
  for (let y = 0; y < H; y += 2) {
    g.fillStyle = `rgba(120,96,60,${0.08 + r() * 0.18})`;
    g.fillRect(0, y, W, 1);
  }
  // Gilded edges, as on many printed Qurans.
  g.fillStyle = "rgba(201,164,92,0.35)";
  g.fillRect(0, 0, W, H);
  return tex(c);
};

export const paper = () => {
  const W = 1024, H = 1400;
  const {c, g} = canvas(W, H);
  const grad = g.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 900);
  grad.addColorStop(0, "#F2EADB");
  grad.addColorStop(1, "#E2D5BC");
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);
  grain(g, W, H, 9, 19);
  // A thin printed frame, as on a mushaf page.
  g.strokeStyle = "rgba(150,112,52,0.55)";
  g.lineWidth = 4;
  g.strokeRect(70, 70, W - 140, H - 140);
  g.lineWidth = 1.5;
  g.strokeRect(86, 86, W - 172, H - 172);
  return tex(c);
};

// Built once per page: the cover and the brushed roughness are slow to draw.
const once = <T,>(make: () => T) => {
  let v: T | null = null;
  return () => (v ??= make());
};
export const coverOnce = once(() => cover());
export const brushedOnce = once(() => brushed());

// A mushaf page with the fetched Ayah printed on it (words 1..maxWord, pause marks kept on
// their word), so the open book shows the same words the Ayah page then brings close.
const pages = new Map<string, THREE.Texture>();
export const ayahPage = (key: string, maxWord: number) => {
  const id = `${key}:${maxWord}`;
  const hit = pages.get(id);
  if (hit) return hit;
  const W = 1024, H = 1400;
  const {c, g} = canvas(W, H);
  const grad = g.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 900);
  grad.addColorStop(0, "#F2EADB");
  grad.addColorStop(1, "#E2D5BC");
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);
  grain(g, W, H, 9, 19);
  g.strokeStyle = "rgba(150,112,52,0.6)";
  g.lineWidth = 4;
  g.strokeRect(70, 70, W - 140, H - 140);
  g.lineWidth = 1.5;
  g.strokeRect(86, 86, W - 172, H - 172);
  const words: string[] = [];
  for (const t of ayahTokens(key)) {
    if (t.word === null) {
      if (words.length) words[words.length - 1] += t.text;
    } else if (t.word <= maxWord) words.push(t.text);
  }
  g.fillStyle = "#2A1F17";
  g.direction = "rtl";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `66px "${ARABIC}"`;
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (g.measureText(next).width > W - 260 && cur) {
      lines.push(cur);
      cur = w;
    } else cur = next;
  }
  if (cur) lines.push(cur);
  lines.forEach((line, i) => g.fillText(line, W / 2, 260 + i * 150));
  const t = tex(c);
  pages.set(id, t);
  return t;
};

// The desk calendar's two leaves: a plain day, then the day's count.
export const calendarLeaf = (big: string, small: string, top: string) => {
  const W = 512, H = 640;
  const {c, g} = canvas(W, H);
  g.fillStyle = "#EFE7D8";
  g.fillRect(0, 0, W, H);
  grain(g, W, H, 8, 23);
  g.fillStyle = "#C4593B";
  g.fillRect(0, 0, W, 120);
  g.fillStyle = "#F6EFE3";
  g.font = `700 52px "Bricolage Grotesque", sans-serif`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(top, W / 2, 62);
  g.fillStyle = "#2A1F17";
  g.font = `600 ${big.length > 4 ? 150 : 210}px "Bricolage Grotesque", sans-serif`;
  g.fillText(big, W / 2, 350);
  g.fillStyle = "#6B5C4C";
  g.font = `italic 400 54px "Instrument Serif", serif`;
  g.fillText(small, W / 2, 530);
  return tex(c);
};

// The age ruler's face: boxwood with a tick per year from 15 to 80, a number every five.
// Portrait: age 15 at the top of the canvas (the far end of the ruler on the table).
export const rulerFace = once(() => {
  const W = 300, H = 2400;
  const {c, g} = canvas(W, H);
  g.fillStyle = "#D8C49B";
  g.fillRect(0, 0, W, H);
  grain(g, W, H, 14, 29);
  const r = rand(37);
  for (let k = 0; k < 120; k++) {
    g.strokeStyle = `rgba(120,90,50,${0.05 + r() * 0.08})`;
    g.lineWidth = 1 + r() * 2;
    const x = r() * W;
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x + (r() - 0.5) * 20, H);
    g.stroke();
  }
  const y = (age: number) => 100 + ((age - 15) / 65) * (H - 200);
  g.fillStyle = "#2A1F17";
  for (let a = 15; a <= 80; a++) {
    const len = a % 5 === 0 ? 90 : 40;
    g.fillRect(0, y(a) - 2, len, 4);
  }
  g.font = `700 58px "Bricolage Grotesque", sans-serif`;
  g.textBaseline = "middle";
  for (let a = 15; a <= 80; a += 5) g.fillText(String(a), 120, y(a));
  return tex(c);
});
