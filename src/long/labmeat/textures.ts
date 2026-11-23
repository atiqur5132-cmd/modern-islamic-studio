import {staticFile} from "remotion";
import * as THREE from "three";
import {HDRLoader} from "three/examples/jsm/loaders/HDRLoader.js";
import {LAB, rng, SANS, SERIF} from "./look";

// Everything the lab needs that is not geometry: the CC0 studio HDRI (Poly Haven), the real
// photo that lies on the bench, and canvas textures drawn here (wall tiles, the three tags,
// the supermarket pack's label). Loaded once per page.

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

// Glazed lab tiles: deep teal squares with thin grout, a little uneven in tone.
const wallTiles = () => {
  const S = 1024, N = 8;
  const {c, g} = canvas(S, S);
  g.fillStyle = "#0B1417";
  g.fillRect(0, 0, S, S);
  const r = rng(5);
  const cell = S / N;
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      const v = 0.85 + r() * 0.3;
      g.fillStyle = `rgb(${Math.round(24 * v)},${Math.round(42 * v)},${Math.round(48 * v)})`;
      g.fillRect(i * cell + 3, j * cell + 3, cell - 6, cell - 6);
      const grad = g.createLinearGradient(i * cell, j * cell, i * cell + cell, j * cell + cell);
      grad.addColorStop(0, "rgba(255,255,255,0.05)");
      grad.addColorStop(1, "rgba(0,0,0,0.08)");
      g.fillStyle = grad;
      g.fillRect(i * cell + 3, j * cell + 3, cell - 6, cell - 6);
    }
  }
  return tex(c, true, [3, 1.5]);
};

// One amber tag of the three questions: a rounded card with a punched hole and its word.
export const tagFace = (word: string) => {
  const Wd = 640, Hd = 340;
  const {c, g} = canvas(Wd, Hd);
  g.fillStyle = LAB.amber;
  g.fillRect(0, 0, Wd, Hd);
  const r = rng(word.length * 13);
  for (let k = 0; k < 1800; k++) {
    g.fillStyle = `rgba(90,50,0,${r() * 0.06})`;
    g.fillRect(r() * Wd, r() * Hd, 2, 2);
  }
  g.strokeStyle = "rgba(60,32,0,0.35)";
  g.lineWidth = 4;
  g.strokeRect(18, 18, Wd - 36, Hd - 36);
  // A punched hole with a brass eyelet, as on a real luggage tag (not a bullet).
  g.strokeStyle = "rgba(70,42,8,0.85)";
  g.lineWidth = 7;
  g.beginPath();
  g.arc(64, Hd / 2, 20, 0, Math.PI * 2);
  g.stroke();
  g.fillStyle = "#1A1208";
  g.beginPath();
  g.arc(64, Hd / 2, 13, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#24170A";
  g.font = `400 150px "${SERIF}"`;
  g.textBaseline = "middle";
  g.fillText(word, 120, Hd / 2 + 8);
  return tex(c);
};

// The supermarket pack's label: plain and honest, like a real retail label.
const packLabel = () => {
  const Wd = 900, Hd = 520;
  const {c, g} = canvas(Wd, Hd);
  g.fillStyle = "#F3F0E8";
  g.fillRect(0, 0, Wd, Hd);
  g.fillStyle = "#1F2A2E";
  g.font = `400 104px "${SERIF}"`;
  g.fillText("Cultivated", 52, 150);
  g.fillText("chicken", 52, 260);
  g.font = `600 40px "${SANS}"`;
  g.fillStyle = "#5B6A6E";
  g.fillText("grown from chicken cells", 56, 340);
  g.fillStyle = "#1F2A2E";
  g.fillRect(52, 390, Wd - 104, 3);
  g.font = `600 44px "${SANS}"`;
  g.fillText("120 g", 56, 460);
  g.textAlign = "right";
  g.fillText("Halal?", Wd - 56, 460);
  return tex(c);
};

export type LabTextures = {
  env: THREE.Texture;
  dish: THREE.Texture;
  earth: THREE.Texture;
  wall: THREE.Texture;
  tags: THREE.Texture[];
  label: THREE.Texture;
};

let promise: Promise<LabTextures> | null = null;
export const loadLab = () => {
  if (!promise) {
    promise = (async () => {
      await document.fonts.ready;
      await Promise.all([document.fonts.load(`400 150px "${SERIF}"`), document.fonts.load(`600 40px "${SANS}"`)]);
      const tl = new THREE.TextureLoader();
      const [env, dish, earth] = await Promise.all([
        new HDRLoader().loadAsync(staticFile("labmeat/monochrome_studio_02_1k.hdr")),
        tl.loadAsync(staticFile("footage/broll-lab-goodmeat-dish.jpg")),
        // Blue Marble Next Generation (NASA Earth Observatory, public domain), as in the Qibla reel.
        tl.loadAsync(staticFile("footage/qb-earth.jpg")),
      ]);
      earth.colorSpace = THREE.SRGBColorSpace;
      earth.anisotropy = 8;
      env.mapping = THREE.EquirectangularReflectionMapping;
      dish.colorSpace = THREE.SRGBColorSpace;
      dish.anisotropy = 8;
      // The photo is 4:3 (2400 x 1800), the same shape as the print, so it maps whole.
      return {env, dish, earth, wall: wallTiles(), tags: ["Animal?", "Method?", "Feed?"].map(tagFace), label: packLabel()};
    })();
  }
  return promise;
};
