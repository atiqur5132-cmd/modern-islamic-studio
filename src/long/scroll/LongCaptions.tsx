import {AbsoluteFill, useCurrentFrame} from "remotion";
import {FPS} from "../../timeline/types";
import {LOOK, SANS, SERIF} from "./look";
import {LongWord} from "./types";

// The STYLE.md "editorial" look set for 16:9: sentence case in the reel's sans, soft
// shadow and no outline, words not yet said at half strength, *emphasis* in the serif
// italic and the accent. One group at a time, low in the frame, clear of the graphics.
export const LongCaptions = ({captions, paper, hidden}: {captions: LongWord[][]; paper: boolean; hidden: boolean}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (hidden) return null;
  const group = captions.find((g, i) => {
    const next = captions[i + 1];
    const end = Math.min(g[g.length - 1].end + 0.35, next ? next[0].start : Infinity);
    return t >= g[0].start - 0.05 && t < end;
  });
  if (!group) return null;
  const ink = paper ? LOOK.paperInk : LOOK.ivory;
  return (
    <AbsoluteFill style={{justifyContent: "flex-end", alignItems: "center", paddingBottom: 52, pointerEvents: "none"}}>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 54,
          letterSpacing: -0.3,
          color: ink,
          textShadow: paper ? "none" : "0 2px 18px rgba(10,12,16,0.75)",
          maxWidth: 1500,
          textAlign: "center",
        }}
      >
        {group.map((w, i) => {
          const said = t >= w.start - 0.03;
          return (
            <span
              key={i}
              style={{
                opacity: said ? 1 : 0.45,
                fontFamily: w.emphasis ? SERIF : SANS,
                fontStyle: w.emphasis ? "italic" : "normal",
                fontWeight: w.emphasis ? 500 : 700,
                fontSize: w.emphasis ? 54 * 1.22 : 54,
                color: w.emphasis ? (paper ? "#9a5f12" : LOOK.amber) : ink,
              }}
            >
              {w.text}
              {i < group.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
