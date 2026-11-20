import React from "react";
import {useCurrentFrame} from "remotion";
import {sec} from "./look";

// A part of the board at a world origin, drawn only around its own time window (the
// camera never sees it otherwise), which keeps each frame light.
export const Part = ({o, from, to, children}: {o: {x: number; y: number}; from: number; to: number; children: React.ReactNode}) => {
  const frame = useCurrentFrame();
  if (frame < sec(from - 2) || frame > sec(to + 3)) return null;
  return <g transform={`translate(${o.x} ${o.y})`}>{children}</g>;
};
