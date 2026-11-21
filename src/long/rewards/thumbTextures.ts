import * as THREE from "three";

// Printed faces for the thumbnail props: bigger, bolder and simpler than the video's, so they
// read at 168 px wide. Drawn in code; fonts must be ready first (textures.fontsReady).

const canvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return {c, g: c.getContext("2d")!};
};
const tex = (c: HTMLCanvasElement) => {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};
const rand = (i: number) => {
  const x = Math.sin(i * 91.7 + 13.1) * 43758.5453;
  return x - Math.floor(x);
};

// A wide kraft luggage tag with a red rubber-stamp word.
export const stampTag = (word: string, family: string) => {
  const {c, g} = canvas(1400, 760);
  g.fillStyle = "#d9b98a";
  g.fillRect(0, 0, 1400, 760);
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(90,60,25,${0.02 + rand(i) * 0.05})`;
    g.fillRect(rand(i + 1) * 1400, rand(i + 2) * 760, 1 + rand(i + 3) * 4, 1);
  }
  // Hole and ring on the left.
  g.fillStyle = "#c9a26c";
  g.beginPath();
  g.arc(130, 380, 72, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#1a1a1a";
  g.beginPath();
  g.arc(130, 380, 34, 0, Math.PI * 2);
  g.fill();
  // The stamp: a red box and the word, a little rotated, with worn ink.
  g.save();
  g.translate(780, 390);
  g.rotate(-0.06);
  g.strokeStyle = "#a50f08";
  g.lineWidth = 30;
  g.strokeRect(-520, -200, 1040, 400);
  g.fillStyle = "#a50f08";
  g.font = `400 300px "${family}"`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(word, 0, 18);
  g.restore();
  // Wear: knock specks out of the ink.
  g.globalCompositeOperation = "destination-out";
  for (let i = 0; i < 700; i++) {
    g.fillStyle = `rgba(0,0,0,${0.2 + rand(i + 50) * 0.4})`;
    const x = 240 + rand(i + 60) * 1100;
    const y = 160 + rand(i + 70) * 460;
    g.fillRect(x, y, 2 + rand(i + 80) * 6, 2 + rand(i + 90) * 3);
  }
  g.globalCompositeOperation = "destination-over";
  g.fillStyle = "#d9b98a";
  g.fillRect(0, 0, 1400, 760);
  return tex(c);
};

// A long till receipt: the rewards itemised, then who pays.
export const longReceipt = (family: string, sans: string) => {
  const {c, g} = canvas(700, 2200);
  g.fillStyle = "#fbf9f3";
  g.fillRect(0, 0, 700, 2200);
  for (let i = 0; i < 1200; i++) {
    g.fillStyle = `rgba(60,50,30,${0.015 + rand(i) * 0.03})`;
    g.fillRect(rand(i + 1) * 700, rand(i + 2) * 2200, 1 + rand(i + 3) * 3, 1);
  }
  g.fillStyle = "#1b1b1b";
  g.textAlign = "center";
  g.font = `400 110px "${family}"`;
  g.fillText("REWARDS", 350, 170);
  g.font = `600 40px "${sans}"`;
  g.fillStyle = "#555";
  g.fillText("**** 4821", 350, 240);
  const rows: [string, string][] = [
    ["Lounge", "FREE"],
    ["Flights", "FREE"],
    ["Cash back", "FREE"],
  ];
  g.textAlign = "left";
  rows.forEach(([a, b], i) => {
    const y = 450 + i * 220;
    g.fillStyle = "#1b1b1b";
    g.font = `400 96px "${family}"`;
    g.fillText(a, 50, y);
    g.textAlign = "right";
    g.fillText(b, 650, y);
    g.textAlign = "left";
  });
  g.setLineDash([16, 14]);
  g.strokeStyle = "#999";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(40, 1220);
  g.lineTo(660, 1220);
  g.stroke();
  g.setLineDash([]);
  g.fillStyle = "#1b1b1b";
  g.font = `400 96px "${family}"`;
  g.fillText("PAID BY:", 50, 1380);
  g.fillStyle = "#c8261c";
  g.font = `400 330px "${family}"`;
  g.fillText("YOU", 40, 1700);
  // Zigzag torn bottom.
  g.globalCompositeOperation = "destination-out";
  g.beginPath();
  g.moveTo(0, 2200);
  for (let x = 0; x <= 700; x += 35) g.lineTo(x, x % 70 ? 2160 : 2200);
  g.lineTo(700, 2200);
  g.closePath();
  g.fill();
  return tex(c);
};
