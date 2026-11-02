import {useMemo} from "react";
import {CanvasTexture, SRGBColorSpace} from "three";

// Fingerprint ridge patterns drawn onto a canvas, for use as 3D textures.
// `reveal` (0 to 1) draws the ridges from the core outwards.

export type RidgePattern = "loop" | "whorl" | "arch";

const RIDGES = 30;

export const drawRidges = (
  context: CanvasRenderingContext2D,
  size: number,
  pattern: RidgePattern,
  seed: number,
  reveal: number,
  color: string,
) => {
  context.clearRect(0, 0, size, size);
  context.strokeStyle = color;
  context.lineWidth = size / 120;
  context.lineCap = "round";
  const cx = size / 2;
  const cy = size * (pattern === "arch" ? 0.7 : 0.52);
  const shown = Math.floor(RIDGES * Math.min(Math.max(reveal, 0), 1));

  for (let i = 0; i < shown; i++) {
    const rx = size * (0.025 + i * 0.016);
    const ry = rx * (pattern === "arch" ? 0.55 : 1.3);
    let from = 0;
    let to = Math.PI * 2;
    if (pattern === "loop" && i > 5) {
      [from, to] = [Math.PI * 0.62, Math.PI * 2.38];
    } else if (pattern === "arch") {
      [from, to] = [Math.PI * 1.05, Math.PI * 1.95];
    }
    context.beginPath();
    for (let angle = from; angle <= to + 0.001; angle += Math.PI / 90) {
      const wobble =
        1 + 0.04 * Math.sin(3 * angle + i * 0.7 + seed) + 0.025 * Math.sin(7 * angle + i * 1.3 + seed * 2);
      // A whorl's ridges drift around the centre instead of nesting evenly.
      const spiral = pattern === "whorl" ? (angle / (Math.PI * 2)) * size * 0.012 : 0;
      const x = cx + (rx + spiral) * wobble * Math.cos(angle);
      const y = cy + (ry + spiral) * wobble * Math.sin(angle) + (pattern === "loop" && i > 5 ? i * size * 0.002 : 0);
      if (angle === from) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.stroke();
  }
};

// A canvas texture redrawn whenever its inputs change, as they do each frame.
export const useRidgeTexture = (
  pattern: RidgePattern,
  seed: number,
  reveal: number,
  color: string,
  size = 512,
) => {
  const {canvas, texture} = useMemo(() => {
    const element = document.createElement("canvas");
    element.width = size;
    element.height = size;
    const map = new CanvasTexture(element);
    map.colorSpace = SRGBColorSpace;
    return {canvas: element, texture: map};
  }, [size]);
  const context = canvas.getContext("2d");
  if (context) {
    drawRidges(context, size, pattern, seed, reveal, color);
    texture.needsUpdate = true;
  }
  return texture;
};
