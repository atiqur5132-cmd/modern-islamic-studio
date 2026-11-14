import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Caption} from "../overlays/Caption";
import {Cta} from "../overlays/Cta";
import {Grain} from "../overlays/Grain";
import {Cues, LongProps} from "../long/scroll/types";
import {Sound, SOUND_SECONDS} from "../timeline/sfx";
import {FPS} from "../timeline/types";
import {ACCENT, GROUND, INK, PAPER_INK} from "./look";
import {Hook3D, NoLight3D} from "./Hook3D";
import {Ayah3D, Bracket3D, Burns3D, Claim3D, Count3D, End3D, Greek3D, NoWord3D, NurAllah3D, NurSiraj3D, Payoff3D, Turn3D, Verdict3D} from "./scenes3D";

// The faceless chaand-nur Short (projects/chaand-nur/beats.md): one approved voiceover,
// one scene per script line (lines 10-11 share the count), hard cuts on the line starts,
// captions from script.txt timed by Whisper (reel.json, built by build_props.py).
type Scene = {id: string; from: number; Scene: (p: {cues: Cues}) => React.ReactElement; paper?: boolean};

const SCENES: Scene[] = [
  {id: "hook", from: 1, Scene: Hook3D},
  {id: "nolight", from: 2, Scene: NoLight3D},
  {id: "claim", from: 3, Scene: Claim3D},
  {id: "ayah", from: 4, Scene: Ayah3D},
  {id: "nursiraj", from: 5, Scene: NurSiraj3D},
  {id: "bracket", from: 6, Scene: Bracket3D},
  {id: "noword", from: 7, Scene: NoWord3D},
  {id: "nurallah", from: 8, Scene: NurAllah3D},
  {id: "turn", from: 9, Scene: Turn3D},
  {id: "count", from: 10, Scene: Count3D},
  {id: "burns", from: 12, Scene: Burns3D},
  {id: "greek", from: 13, Scene: Greek3D},
  {id: "verdict", from: 14, Scene: Verdict3D},
  {id: "payoff", from: 15, Scene: Payoff3D},
  {id: "end", from: 16, Scene: End3D},
];

// Scenes cut this many frames before their line's first word, so the picture is there
// when the word lands.
const LEAD = 2;
const CAPTION_HOLD = 8;

export const Chaand = (props: LongProps) => {
  const frame = useCurrentFrame();
  const byLine = new Map(props.lines.map((l) => [l.n, l]));
  const sec = (s: number) => Math.round(s * FPS);
  const lineStart = (n: number) => sec(byLine.get(n)?.start ?? 0);
  const wordAt = (n: number, i: number) => {
    const w = props.words.find((x) => x.line === n && x.index === i);
    if (!w) throw new Error(`No word ${i} in line ${n}`);
    return sec(w.start);
  };
  const total = sec(props.durationSeconds);
  const ranges = SCENES.map((scene, i) => {
    const from = i === 0 ? 0 : lineStart(scene.from) - LEAD;
    const to = i + 1 < SCENES.length ? lineStart(SCENES[i + 1].from) - LEAD : total;
    return {scene, from, to};
  });
  const sceneAt = (f: number) => ranges.find((r) => f >= r.from && f < r.to);

  // Captions step aside where the graphic is the hero: the recited Ayah (its Roman
  // transliteration is never captioned) and the end Follow card.
  const hide: [number, number][] = [
    // The hook carries its words itself (title, switch, timer): no caption track (STYLE.md).
    [0, lineStart(2) - LEAD],
    [wordAt(4, 6), lineStart(5)],
    [wordAt(16, 8) - 4, total],
  ];
  // CTAs: the comment ask at the start of the last line, Follow on "Follow kar lo"; one mid
  // reel over the proof footage (not the hook, not the payoff).
  const ctas = [
    {from: lineStart(12), to: lineStart(12) + 78, cta: {type: "cta", mode: "follow", placement: "top", tone: "dark", start: 0, end: 0} as const},
    {from: lineStart(16), to: wordAt(16, 8) - 6, cta: {type: "cta", mode: "engage", text: "Which Quran ‘fact’ forward have you seen most?", placement: "top", tone: "dark", look: "editorial", start: 0, end: 0} as const},
    {from: wordAt(16, 8) - 4, to: total, cta: {type: "cta", mode: "follow", placement: "caption", tone: "dark", start: 0, end: 0} as const},
  ];

  // Sound: each cue has a cause on screen and lands one frame after its picture.
  const cues: {frame: number; sound: Sound; volume: number}[] = [
    {frame: 0, sound: "sub-hit", volume: 0.45},
    {frame: wordAt(1, 2) + 1, sound: "tick", volume: 0.9},
    {frame: wordAt(1, 8) - 1, sound: "impact", volume: 0.3},
    {frame: wordAt(1, 8) + 6, sound: "tick-soft-1", volume: 0.45},
    {frame: wordAt(1, 8) + 12, sound: "tick-soft-2", volume: 0.45},
    {frame: wordAt(1, 8) + 18, sound: "tick-soft-3", volume: 0.45},
    {frame: wordAt(1, 11) + 5, sound: "sub-hit", volume: 0.4},
    {frame: lineStart(2) - 1, sound: "whoosh", volume: 0.22},
    {frame: wordAt(2, 10) - 3, sound: "shimmer", volume: 0.22},
    {frame: lineStart(3), sound: "tick-soft-1", volume: 0.5},
    {frame: lineStart(3) + 5, sound: "tick-soft-2", volume: 0.5},
    {frame: wordAt(3, 9) + 1, sound: "tick-soft-3", volume: 0.45},
    {frame: lineStart(4) - 1, sound: "whoosh-2", volume: 0.2},
    {frame: wordAt(5, 7) + 1, sound: "tick-soft-1", volume: 0.45},
    {frame: lineStart(6) - 1, sound: "whoosh-3", volume: 0.2},
    {frame: wordAt(6, 11) + 1, sound: "tick-soft-2", volume: 0.5},
    {frame: wordAt(7, 5) + 1, sound: "whoosh", volume: 0.18},
    {frame: wordAt(8, 11) - 1, sound: "whoosh-2", volume: 0.2},
    {frame: wordAt(9, 11) + 1, sound: "sub-hit", volume: 0.4},
    {frame: wordAt(10, 6) + 1, sound: "impact", volume: 0.28},
    {frame: wordAt(11, 2) + 1, sound: "tick-soft-3", volume: 0.45},
    {frame: wordAt(11, 7) + 1, sound: "tick-soft-1", volume: 0.45},
    {frame: lineStart(12) - 1, sound: "whoosh-3", volume: 0.2},
    {frame: wordAt(12, 11) - 1, sound: "sub-hit", volume: 0.32},
    {frame: wordAt(12, 14) - 1, sound: "whoosh", volume: 0.18},
    {frame: wordAt(13, 10) + 3, sound: "tick-soft-2", volume: 0.45},
    {frame: lineStart(14) + 2, sound: "impact", volume: 0.36},
    {frame: lineStart(15) - 1, sound: "shimmer", volume: 0.22},
  ];

  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      {ranges.map(({scene, from, to}) => {
        const cueSet: Cues = {
          line: (n, offset = 0) => lineStart(n) + Math.round(offset * FPS) - from,
          lineEnd: (n) => sec(byLine.get(n)?.end ?? 0) - from,
          word: (n, i) => wordAt(n, i) - from,
        };
        const S = scene.Scene;
        return (
          <Sequence key={scene.id} from={from} durationInFrames={Math.max(1, to - from)} name={scene.id}>
            <S cues={cueSet} />
          </Sequence>
        );
      })}
      {/* No vignette on the paper page: dark corners read as dirt there. */}
      <Grain vignette={sceneAt(frame)?.scene.paper ? 0 : 0.3} color={GROUND} />
      {ctas.map((c, i) => (
        <Sequence key={`cta-${i}`} from={c.from} durationInFrames={c.to - c.from}>
          <Cta cta={c.cta} palette={{ground: GROUND, ink: INK, accent: ACCENT}} />
        </Sequence>
      ))}
      {props.captions.map((phrase, index) => {
        const start = sec(phrase[0].start);
        const next = props.captions[index + 1];
        const hold = sec(phrase[phrase.length - 1].end) + CAPTION_HOLD;
        const end = next ? Math.min(hold, sec(next[0].start)) : hold;
        if (end <= start || hide.some(([a, b]) => start >= a && start < b)) return null;
        const paper = sceneAt(start)?.scene.paper ?? false;
        return (
          <Sequence key={`cap-${index}`} from={start} durationInFrames={end - start}>
            <Caption
              aboveCard={false}
              look="editorial"
              design={{sans: "Plus Jakarta Sans", serif: "Newsreader", size: 66}}
              accent={paper ? PAPER_INK : "#FBF8F2"}
              ink={paper ? PAPER_INK : undefined}
              words={phrase.map((w) => ({text: w.text, emphasis: w.emphasis, frame: Math.max(0, sec(w.start) - start)}))}
            />
          </Sequence>
        );
      })}
      <Audio src={staticFile(`footage/${props.audio}`)} />
      {cues.map((c, i) => (
        <Sequence key={`sfx-${i}`} from={Math.max(0, c.frame)} durationInFrames={Math.ceil(SOUND_SECONDS[c.sound] * FPS) + 1}>
          <Audio src={staticFile(`sfx/${c.sound}.wav`)} volume={c.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
