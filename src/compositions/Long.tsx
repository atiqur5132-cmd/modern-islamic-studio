import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Grain} from "../overlays/Grain";
import {LongCaptions} from "../long/scroll/LongCaptions";
import {LOOK} from "../long/scroll/look";
import {MidCta} from "../long/scroll/scenesE";
import {MID_CTAS, SCENES, soundsFor} from "../long/scroll/timeline";
import {Cues, LongProps} from "../long/scroll/types";
import {FPS} from "../timeline/types";

const FADE = 8; // frames of crossfade between scenes

// A faceless 16:9 YouTube video: one finished voiceover, scenes keyed to its script lines,
// captions under them. The scenes live in src/long/scroll; their order and line ranges in
// timeline.ts.
export const Long = (props: LongProps) => {
  const frame = useCurrentFrame();
  const byLine = new Map(props.lines.map((l) => [l.n, l]));
  const lineStart = (n: number) => Math.round((byLine.get(n)?.start ?? 0) * FPS);
  const total = Math.round(props.durationSeconds * FPS);

  const ranges = SCENES.map((scene, i) => {
    const from = i === 0 ? 0 : lineStart(scene.from) - (scene.lead ?? 6);
    const next = SCENES[i + 1];
    const to = next ? lineStart(next.from) - (next.lead ?? 6) : total;
    return {scene, from, to};
  });
  const current = ranges.find((r) => frame >= r.from && frame < r.to);

  return (
    <AbsoluteFill style={{backgroundColor: LOOK.ground}}>
      {ranges.map(({scene, from, to}, i) => {
        const cut = scene.cut || i === 0;
        const start = cut ? from : from - FADE;
        const cues: Cues = {
          line: (n, offset = 0) => lineStart(n) + Math.round(offset * FPS) - start,
          lineEnd: (n) => Math.round((byLine.get(n)?.end ?? 0) * FPS) - start,
          word: (n, index) => {
            const w = props.words.find((x) => x.line === n && x.index === index);
            return (w ? Math.round(w.start * FPS) : lineStart(n)) - start;
          },
        };
        const Scene = scene.Scene;
        return (
          <Sequence key={scene.id} from={start} durationInFrames={Math.max(1, to - start)}>
            <Fade fadeIn={cut ? 0 : FADE}>
              <Scene cues={cues} />
            </Fade>
          </Sequence>
        );
      })}
      {MID_CTAS.map((n) => (
        <MidCta key={n} at={Math.round((byLine.get(n)?.end ?? 0) * FPS) + 6} />
      ))}
      <Grain vignette={0.35} color={LOOK.ground} />
      <LongCaptions captions={props.captions} paper={current?.scene.paper ?? false} hidden={current?.scene.noCaptions ?? false} />
      <Audio src={staticFile(`footage/${props.audio}`)} />
      {soundsFor(props, lineStart).map((cue, i) => (
        <Sequence key={`sfx-${i}`} from={cue.frame} durationInFrames={FPS * 3}>
          <Audio src={staticFile(`sfx/${cue.sound}.wav`)} volume={cue.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const Fade = ({fadeIn, children}: {fadeIn: number; children: React.ReactNode}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn === 0 ? 1 : Math.min(1, frame / fadeIn);
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};
