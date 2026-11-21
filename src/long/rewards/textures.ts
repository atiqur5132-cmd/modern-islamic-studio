import {loadFont as loadInterTight} from "@remotion/google-fonts/InterTight";
import {loadFont as loadNewsreader} from "@remotion/google-fonts/Newsreader";
import * as THREE from "three";
import {HOOK, SANS, SERIF} from "./look";

// Printed faces for the 3D props, drawn in code so nothing is loaded and every frame is the
// same. Each returns a texture; callers make them once, after the fonts are ready.

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  return {c, g};
};

const tex = (c: HTMLCanvasElement) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

const font = (weight: number, px: number, family = SANS) => `${weight} ${px}px "${family}"`;

const roundRect = (g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
};

// Stable pseudo-random numbers for the brushed lines.
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// The hero: a dark teal-graphite metal card. No bank or network brand on it.
export const cardFace = (tone: "graphite" | "gold" = "graphite") => {
  const {c, g} = canvas(1712, 1080);
  const gold = tone === "gold";
  const grad = g.createLinearGradient(0, 0, 1712, 1080);
  grad.addColorStop(0, gold ? "#f6e3a8" : "#2c4644");
  grad.addColorStop(0.55, gold ? "#d2a64e" : "#17292a");
  grad.addColorStop(1, gold ? "#a87a26" : "#0e1c1d");
  g.fillStyle = grad;
  g.fillRect(0, 0, 1712, 1080);
  // Brushed metal: thousands of faint horizontal strokes.
  for (let i = 0; i < 2600; i++) {
    const y = rand(i) * 1080;
    const x = rand(i + 9000) * 1712;
    const len = 80 + rand(i + 5000) * 500;
    g.strokeStyle = rand(i + 77) > 0.5 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.05)";
    g.lineWidth = 1 + rand(i + 3) * 1.5;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + len, y);
    g.stroke();
  }
  // Gold chip.
  const chip = g.createLinearGradient(190, 380, 390, 540);
  chip.addColorStop(0, "#f1d48a");
  chip.addColorStop(0.5, "#c9962e");
  chip.addColorStop(1, "#e6c06a");
  roundRect(g, 190, 380, 230, 175, 26);
  g.fillStyle = chip;
  g.fill();
  g.strokeStyle = "rgba(90,60,10,0.55)";
  g.lineWidth = 4;
  for (const [x1, y1, x2, y2] of [
    [190, 440, 290, 440],
    [190, 495, 290, 495],
    [330, 440, 420, 440],
    [330, 495, 420, 495],
    [290, 380, 290, 555],
    [330, 380, 330, 555],
  ]) {
    g.beginPath();
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.stroke();
  }
  // Contactless waves.
  g.strokeStyle = gold ? "rgba(70,45,10,0.6)" : "rgba(230,240,238,0.7)";
  g.lineWidth = 9;
  g.lineCap = "round";
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    g.arc(500, 468, 30 + i * 26, -0.7, 0.7);
    g.stroke();
  }
  // Number and holder line, embossed silver.
  g.font = font(600, 92);
  g.fillStyle = gold ? "rgba(70,45,10,0.85)" : "rgba(225,235,233,0.86)";
  g.fillText("••••   ••••   ••••   4821", 190, 760);
  g.font = font(600, 46);
  g.fillStyle = gold ? "rgba(70,45,10,0.6)" : "rgba(225,235,233,0.6)";
  g.fillText("VALID THRU 09/31", 190, 860);
  g.fillText("MEMBER SINCE 2026", 1120, 860);
  // A quiet engraved mark top-right (a ring, not a brand).
  g.strokeStyle = gold ? "rgba(70,45,10,0.45)" : "rgba(225,235,233,0.5)";
  g.lineWidth = 8;
  g.beginPath();
  g.arc(1500, 200, 62, 0, Math.PI * 2);
  g.stroke();
  g.beginPath();
  g.arc(1500, 200, 34, 0, Math.PI * 2);
  g.stroke();
  return tex(c);
};

// The card's back: brushed metal, a signature strip, the channel name engraved.
export const cardBack = () => {
  const {c, g} = canvas(1712, 1080);
  const grad = g.createLinearGradient(0, 0, 1712, 1080);
  grad.addColorStop(0, "#2c4644");
  grad.addColorStop(1, "#0e1c1d");
  g.fillStyle = grad;
  g.fillRect(0, 0, 1712, 1080);
  for (let i = 0; i < 2600; i++) {
    g.strokeStyle = rand(i + 41) > 0.5 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.05)";
    g.lineWidth = 1 + rand(i + 7) * 1.5;
    const y = rand(i + 13) * 1080;
    const x = rand(i + 9100) * 1712;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + 80 + rand(i + 5100) * 500, y);
    g.stroke();
  }
  g.fillStyle = "rgba(10,18,18,0.9)";
  g.fillRect(0, 120, 1712, 170);
  g.textAlign = "center";
  g.fillStyle = "rgba(230,240,238,0.9)";
  g.font = font(800, 150);
  g.fillText("THE RICH RULES", 856, 640);
  g.fillStyle = "#d4a440";
  g.fillRect(656, 700, 400, 8);
  g.fillStyle = "rgba(230,240,238,0.6)";
  g.font = font(600, 50);
  g.fillText("HOW MONEY REALLY WORKS", 856, 800);
  return tex(c);
};

// Card stock for the tags and passes, with a faint fibre.
const paper = (g: CanvasRenderingContext2D, w: number, h: number, color = "#fbf8f1") => {
  g.fillStyle = color;
  g.fillRect(0, 0, w, h);
  for (let i = 0; i < 900; i++) {
    g.fillStyle = `rgba(80,70,50,${0.015 + rand(i) * 0.03})`;
    g.fillRect(rand(i + 1) * w, rand(i + 2) * h, 1 + rand(i + 3) * 3, 1);
  }
};

// The name tag: a paper tag with a hole at the top. `strike` draws a coral line through it.
export const tagFace = (text: string, opts: {ink?: string; size?: number; strike?: boolean; serif?: boolean} = {}) => {
  const {c, g} = canvas(620, 1000);
  paper(g, 620, 1000, "#e3c79a");
  // Hole reinforcement ring.
  g.strokeStyle = "rgba(15,107,102,0.5)";
  g.lineWidth = 14;
  g.beginPath();
  g.arc(310, 120, 46, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = HOOK.ink;
  g.font = font(800, 34);
  g.textAlign = "center";
  g.fillStyle = HOOK.inkSoft;
  g.fillText("NAME", 310, 300);
  g.fillStyle = "rgba(19,48,46,0.35)";
  g.fillRect(90, 330, 440, 4);
  g.save();
  g.translate(310, 640);
  g.rotate(-Math.PI / 2);
  g.fillStyle = opts.ink ?? HOOK.ink;
  g.font = opts.serif ? `italic 500 ${opts.size ?? 150}px "${SERIF}"` : font(800, opts.size ?? 150);
  g.textBaseline = "middle";
  g.fillText(text, 0, 0);
  if (opts.strike) {
    const w = g.measureText(text).width;
    g.strokeStyle = HOOK.coral;
    g.lineWidth = 18;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(-w / 2 - 20, 6);
    g.lineTo(w / 2 + 20, -10);
    g.stroke();
  }
  g.restore();
  return tex(c);
};

// The 5% cashback coin face.
export const coinFace = () => {
  const {c, g} = canvas(512, 512);
  const grad = g.createRadialGradient(200, 180, 30, 256, 256, 260);
  grad.addColorStop(0, "#f6dc97");
  grad.addColorStop(0.6, "#d4a440");
  grad.addColorStop(1, "#a87a22");
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 512);
  g.strokeStyle = "rgba(110,75,15,0.6)";
  g.lineWidth = 10;
  g.beginPath();
  g.arc(256, 256, 214, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = "#6e4b0f";
  g.font = font(800, 190);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("5%", 256, 262);
  return tex(c);
};

// Simple line icons for the passes, drawn in the ink colour.
const drawIcon = (g: CanvasRenderingContext2D, kind: "lounge" | "bed" | "plane", x: number, y: number, s: number, color: string) => {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.strokeStyle = color;
  g.fillStyle = color;
  g.lineWidth = 9;
  g.lineCap = "round";
  g.lineJoin = "round";
  if (kind === "lounge") {
    // An armchair.
    g.beginPath();
    g.roundRect(-70, -60, 140, 70, 18);
    g.stroke();
    g.beginPath();
    g.roundRect(-95, -20, 40, 70, 14);
    g.roundRect(55, -20, 40, 70, 14);
    g.stroke();
    g.beginPath();
    g.moveTo(-55, 50);
    g.lineTo(55, 50);
    g.moveTo(-80, 50);
    g.lineTo(-80, 80);
    g.moveTo(80, 50);
    g.lineTo(80, 80);
    g.stroke();
  } else if (kind === "bed") {
    g.beginPath();
    g.moveTo(-100, -50);
    g.lineTo(-100, 70);
    g.moveTo(-100, 30);
    g.lineTo(100, 30);
    g.lineTo(100, 70);
    g.stroke();
    g.beginPath();
    g.roundRect(-85, -20, 60, 40, 14);
    g.stroke();
    g.beginPath();
    g.roundRect(-15, -30, 115, 55, 16);
    g.stroke();
  } else {
    // A plane seen from above.
    g.beginPath();
    g.moveTo(0, -95);
    g.quadraticCurveTo(14, -80, 12, -20);
    g.lineTo(95, 25);
    g.lineTo(95, 45);
    g.lineTo(12, 22);
    g.lineTo(10, 70);
    g.lineTo(35, 90);
    g.lineTo(35, 102);
    g.lineTo(0, 92);
    g.lineTo(-35, 102);
    g.lineTo(-35, 90);
    g.lineTo(-10, 70);
    g.lineTo(-12, 22);
    g.lineTo(-95, 45);
    g.lineTo(-95, 25);
    g.lineTo(-12, -20);
    g.quadraticCurveTo(-14, -80, 0, -95);
    g.fill();
  }
  g.restore();
};

// A reward pass: icon on the left, a word on the right, a teal band.
export const passFace = (kind: "lounge" | "bed", word: string) => {
  const {c, g} = canvas(900, 560);
  paper(g, 900, 560, "#f7f4ec");
  g.fillStyle = HOOK.teal;
  g.fillRect(0, 0, 900, 70);
  g.fillStyle = "#e8f1ef";
  g.font = font(800, 34);
  g.fillText(kind === "lounge" ? "ACCESS PASS" : "ROOM KEY", 40, 48);
  drawIcon(g, kind, 230, 320, 1.4, HOOK.ink);
  g.fillStyle = HOOK.ink;
  g.font = font(800, 76);
  g.fillText(word, 420, 300);
  g.fillStyle = HOOK.inkSoft;
  g.font = font(600, 40);
  g.fillText("COMPLIMENTARY", 420, 370);
  return tex(c);
};

export const boardingFace = () => {
  const {c, g} = canvas(1400, 560);
  paper(g, 1400, 560, "#f7f4ec");
  g.fillStyle = HOOK.teal;
  g.fillRect(0, 0, 1400, 80);
  g.fillStyle = "#e8f1ef";
  g.font = font(800, 40);
  g.fillText("BOARDING PASS", 44, 54);
  g.fillStyle = HOOK.ink;
  g.font = font(800, 150);
  g.fillText("JFK", 60, 290);
  g.fillText("LHR", 640, 290);
  drawIcon(g, "plane", 520, 240, 0.8, HOOK.teal);
  g.font = font(600, 40);
  g.fillStyle = HOOK.inkSoft;
  g.fillText("ROUND TRIP · SEAT 2A", 64, 370);
  // The stamp.
  g.save();
  g.translate(780, 450);
  g.rotate(-0.06);
  g.strokeStyle = HOOK.gold;
  g.lineWidth = 8;
  g.beginPath();
  g.roundRect(-20, -62, 560, 100, 14);
  g.stroke();
  g.fillStyle = HOOK.gold;
  g.font = font(800, 62);
  g.fillText("PAID IN POINTS", 6, 10);
  g.restore();
  // Tear line before the stub.
  g.setLineDash([14, 14]);
  g.strokeStyle = "rgba(19,48,46,0.35)";
  g.lineWidth = 4;
  g.beginPath();
  g.moveTo(1150, 80);
  g.lineTo(1150, 560);
  g.stroke();
  return tex(c);
};

// The restaurant check: the rewards, itemised, and nobody's name on the total.
export const billFace = () => {
  const {c, g} = canvas(620, 1100);
  paper(g, 620, 1100, "#fdfbf6");
  g.fillStyle = HOOK.ink;
  g.textAlign = "center";
  g.font = font(800, 64);
  g.fillText("CHECK", 310, 120);
  g.font = font(600, 30);
  g.fillStyle = HOOK.inkSoft;
  g.fillText("TABLE 1 · REWARDS", 310, 172);
  g.textAlign = "left";
  const rows = ["Lounge access", "Hotel nights", "Round-trip flights", "Cash back", "Sign-up bonus"];
  rows.forEach((r, i) => {
    const y = 300 + i * 110;
    g.fillStyle = HOOK.ink;
    g.font = font(600, 40);
    g.fillText(r, 50, y);
    g.fillStyle = "rgba(19,48,46,0.3)";
    for (let x = 50; x < 570; x += 18) g.fillRect(x, y + 26, 8, 4);
  });
  g.fillStyle = HOOK.ink;
  g.fillRect(50, 880, 520, 6);
  g.font = font(800, 58);
  g.fillText("TOTAL", 50, 980);
  g.textAlign = "right";
  g.fillStyle = HOOK.coral;
  g.fillText("?", 570, 980);
  return tex(c);
};

// Fonts must be in the document before any canvas uses them.
// document.fonts.load alone can resolve before Remotion has added the faces, so wait on the
// loaders themselves.
const sans = loadInterTight("normal", {weights: ["600", "800"], subsets: ["latin"]});
const serif = loadNewsreader("italic", {weights: ["500"], subsets: ["latin"]});
export const fontsReady = () =>
  Promise.all([sans.waitUntilDone(), serif.waitUntilDone()])
    .then(() => Promise.all([document.fonts.load(font(800, 100)), document.fonts.load(font(600, 100)), document.fonts.load(`italic 500 100px "${SERIF}"`)]))
    .then(() => undefined);
