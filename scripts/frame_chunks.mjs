// Splits a composition's frames into parts that GitHub renders side by side.
//
// Usage: node scripts/frame_chunks.mjs <composition> [props.json] [first-last] [parts]
// Prints one JSON line: {"total": n, "chunks": [{"index": 0, "frames": "0-328"}, ...]}
// The workflow passes "chunks" to a job matrix and "total" to the final frame check.
import {bundle} from "@remotion/bundler";
import {selectComposition} from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const [composition, propsPath = "", range = "", partsArg = "6"] = process.argv.slice(2);
if (!composition) {
  console.error("Usage: node scripts/frame_chunks.mjs <composition> [props.json] [first-last] [parts]");
  process.exit(1);
}

const inputProps = propsPath ? JSON.parse(fs.readFileSync(propsPath, "utf8")) : {};
const serveUrl = await bundle({entryPoint: path.resolve("src/index.ts")});
const meta = await selectComposition({serveUrl, id: composition, inputProps});

let first = 0;
let last = meta.durationInFrames - 1;
if (range) {
  const match = /^(\d+)-(\d+)$/.exec(range.trim());
  if (!match) throw new Error(`Frame range must look like 510-1320, got "${range}"`);
  first = Number(match[1]);
  last = Math.min(Number(match[2]), last);
  if (first > last) throw new Error(`Frame range ${range} is outside 0-${meta.durationInFrames - 1}`);
}

const total = last - first + 1;
// Under 60 frames per part the fixed setup of each runner outweighs the gain.
const parts = Math.max(1, Math.min(Number(partsArg) || 1, Math.floor(total / 60) || 1));
const chunks = [];
for (let i = 0; i < parts; i++) {
  const start = first + Math.floor((total * i) / parts);
  const end = first + Math.floor((total * (i + 1)) / parts) - 1;
  chunks.push({index: i, frames: `${start}-${end}`});
}

console.log(JSON.stringify({total, chunks}));
