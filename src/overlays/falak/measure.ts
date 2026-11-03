import {useEffect, useState} from "react";
import {continueRender, delayRender} from "remotion";

// Advance widths of words in a font, measured by the browser's own shaping once the
// font has loaded. The frame waits until they are known, so no frame is laid out
// with a fallback font's widths.
export const useTextWidths = (texts: string[], fontFamily: string, size: number) => {
  const [widths, setWidths] = useState<number[] | null>(null);
  const [handle] = useState(() => delayRender(`Measuring ${texts.length} words`));
  const key = texts.join("|");

  useEffect(() => {
    const font = `${size}px "${fontFamily}"`;
    document.fonts
      .load(font, texts.join(" "))
      .then(() => {
        const context = document.createElement("canvas").getContext("2d");
        if (!context) {
          throw new Error("No canvas to measure text");
        }
        context.font = font;
        context.direction = "rtl";
        setWidths(texts.map((text) => context.measureText(text).width));
        continueRender(handle);
      })
      .catch((error) => {
        throw error;
      });
    // texts are compared by `key`; the handle is fixed for the component's life.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, fontFamily, size, handle]);

  return widths;
};

// Centres of words laid out right to left around `center`, with `gap` between them.
// `presence[i]` (0..1) lets a word give up its room smoothly.
export const rtlCentres = (widths: number[], gap: number, center: number, presence: number[]) => {
  const room = widths.map((w, i) => (w + (i > 0 ? gap : 0)) * presence[i]);
  const total = room.reduce((a, b) => a + b, 0);
  let right = center + total / 2;
  return widths.map((w, i) => {
    right -= (i > 0 ? gap : 0) * presence[i];
    const centre = right - (w * presence[i]) / 2;
    right -= w * presence[i];
    return centre;
  });
};
