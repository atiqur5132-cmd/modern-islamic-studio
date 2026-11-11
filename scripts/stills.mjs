// Render chosen frames of a composition as PNGs, bundling once (faster than one
// `npx remotion still` per frame). For judging a reel from stills on the laptop.
//
// Usage: node scripts/stills.mjs <props.json> <out dir> <frame> [<frame> ...]
//   e.g. node scripts/stills.mjs projects/clip/edit.json out/stills/clip 0 45 90
import {bundle} from "@remotion/bundler";
import {renderStill, selectComposition} from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const [propsPath, outDir, ...frames] = process.argv.slice(2);
if (!propsPath || !outDir || frames.length === 0) {
  console.error("Usage: node scripts/stills.mjs <props.json> <out dir> <frame> [<frame> ...]");
  process.exit(1);
}
const inputProps = JSON.parse(fs.readFileSync(propsPath, "utf-8"));
fs.mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public")});
const chromiumOptions = {gl: "angle"};
// Google fonts load over the network at the first frame; a slow line needs more than 30 s.
const timeoutInMilliseconds = 120000;
const composition = await selectComposition({serveUrl, id: "Short", inputProps, chromiumOptions, timeoutInMilliseconds});
for (const frame of frames.map(Number)) {
  const output = path.join(outDir, `f${String(frame).padStart(4, "0")}.png`);
  await renderStill({composition, serveUrl, output, frame, inputProps, chromiumOptions, timeoutInMilliseconds});
  console.log(output);
}
