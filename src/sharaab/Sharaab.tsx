import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Caption} from "../overlays/Caption";
import {Cta} from "../overlays/Cta";
import {Grain} from "../overlays/Grain";
import {Cues, LongProps} from "../long/scroll/types";
import {Sound, SOUND_SECONDS} from "../timeline/sfx";
import {FPS} from "../timeline/types";
import {AyahPage, AyahPage591} from "./AyahPage";
import {DocPage} from "./DocPage";
import {Hook} from "./Hook";
import {ACCENT, GROUND, INK, PAPER_INK, SANS, SERIF} from "./look";
import {WorldA, WorldB} from "./World";

// The faceless sharaab-fayda Short (projects/sharaab-fayda/beats.md): the creator's own cut
// voice, one 3D studio, one scene per beat, hard cuts just before each line's first word,
// captions from script.txt timed by Whisper (reel.json, built by build_props.py).
type Scene = {id: string; from: number; Scene: (p: {cues: Cues}) => React.ReactElement; paper?: boolean};

const SCENES: Scene[] = [
  {id: "hook", from: 1, Scene: Hook},
  {id: "ayah", from: 3, Scene: AyahPage, paper: true},
  {id: "worldA", from: 5, Scene: WorldA},
  {id: "ayah591", from: 13, Scene: AyahPage591, paper: true},
  {id: "worldB", from: 15, Scene: WorldB},
];

const LEAD = 2;
const CAPTION_HOLD = 8;

export const Sharaab = (props: LongProps) => {
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

  // The hook carries its own words (claim, "says the Quran", the tag): no caption track
  // over line 1 (STYLE.md). The payoff line is set big on screen, so no caption there; the
  // end Follow card stands alone.
  const followAt = wordAt(24, 12) - 4;
  const hide: [number, number][] = [
    [0, lineStart(2) - LEAD],
    [lineStart(23) - LEAD, lineStart(24) - LEAD],
    [followAt, total],
  ];
  // CTAs (QUALITY 2a): one Follow mid-reel after the "Allah's command" bridge (not the hook,
  // not the payoff); the comment ask with the last line; Follow on "follow karo".
  const ctas = [
    {from: lineStart(16) + 6, to: lineStart(16) + 84, cta: {type: "cta", mode: "follow", placement: "top", tone: "dark", start: 0, end: 0} as const},
    {from: lineStart(24) - 2, to: followAt - 2, cta: {type: "cta", mode: "engage", text: "What should we answer next about Muslims?", placement: "top", tone: "dark", look: "editorial", start: 0, end: 0} as const},
    {from: followAt, to: total, cta: {type: "cta", mode: "follow", placement: "caption", tone: "dark", start: 0, end: 0} as const},
  ];

  // The two real documents, full screen over the studio (DocPage): WHO's release from "World
  // Health Organisation" to the iron weight; the Lancet record from "Ab science" to line 19.
  const whoFrom = wordAt(9, 8) - 2;
  const whoTo = wordAt(10, 7) - 4;
  const lancetFrom = lineStart(17) + 4;
  const lancetTo = lineStart(19) - LEAD;
  const docs = [
    {
      from: whoFrom,
      to: whoTo,
      el: (
        <DocPage
          src="footage/sf-who-2024-06-25.png"
          aspect={1350 / 1770}
          shots={[
            {at: 0, u: 0.5, v: 0.5, scale: 1},
            {at: lineStart(10) - 2 - whoFrom, u: 0.31, v: 0.777, scale: 2.2},
          ]}
          marks={[{at: wordAt(10, 2) - whoFrom, end: wordAt(10, 6) + 4 - whoFrom, u0: 0.097, u1: 0.79, v: 0.777, h: 0.055}]}
          credit="Established data · WHO news release, 25 June 2024"
        />
      ),
    },
    {
      from: lancetFrom,
      to: lancetTo,
      el: (
        <DocPage
          src="footage/sf-lancet-gbd2020-pmc.png"
          aspect={2010 / 2370}
          shots={[
            {at: 0, u: 0.5, v: 0.42, scale: 1},
            {at: wordAt(18, 0) - 6 - lancetFrom, u: 0.17, v: 0.06, scale: 3},
            {at: wordAt(18, 10) - 4 - lancetFrom, u: 0.7, v: 0.835, scale: 2.35},
          ]}
          marks={[
            {at: wordAt(18, 7) - lancetFrom, end: wordAt(18, 7) + 12 - lancetFrom, u0: 0.02, u1: 0.6, v: 0.043, h: 0.03},
            {at: wordAt(18, 10) + 8 - lancetFrom, end: wordAt(18, 13) + 6 - lancetFrom, u0: 0.485, u1: 0.862, v: 0.835, h: 0.036},
          ]}
          credit="Established science · GBD 2020 Alcohol Collaborators, The Lancet, 2022 · CC BY 4.0"
        />
      ),
    },
  ];

  // Sound (SOUND.md): a cause on screen for each, one frame after its picture. Nothing under
  // the Ayah pages (lines 3-4 and 13-14): the bed is out and no effect plays. 2 impacts and
  // 1 sub-hit in all. The payoff (line 23) lands in near silence.
  const w = wordAt;
  const cues: {frame: number; sound: Sound; volume: number}[] = [
    {frame: 0, sound: "sub-hit", volume: 0.4},
    {frame: w(1, 2) + 8, sound: "knock-1", volume: 0.7},
    {frame: w(1, 5) - 3, sound: "whoosh-2", volume: 0.18},
    {frame: w(1, 5) + 1, sound: "book-thud", volume: 0.75},
    {frame: lineStart(2) - 3, sound: "whoosh-3", volume: 0.14},
    {frame: w(2, 4) + 1, sound: "page-turn-1", volume: 0.45},
    {frame: w(2, 7) + 1, sound: "page-turn-2", volume: 0.4},
    {frame: w(2, 9) + 1, sound: "tick-soft-1", volume: 0.45},
    // Lines 5-12
    {frame: lineStart(5) - 3, sound: "whoosh-3", volume: 0.12},
    {frame: w(5, 12) - 1, sound: "tick-soft-2", volume: 0.4},
    {frame: lineStart(6) + 6, sound: "cloth", volume: 0.25},
    {frame: w(6, 3) + 1, sound: "tick-soft-3", volume: 0.4},
    {frame: w(7, 6) + 1, sound: "paper-slide-1", volume: 0.3},
    {frame: w(8, 1) + 1, sound: "knock-2", volume: 0.65},
    {frame: w(8, 3) + 1, sound: "knock-3", volume: 0.65},
    {frame: w(8, 8) + 2, sound: "knock-1", volume: 0.5},
    {frame: lineStart(9) - 6, sound: "whoosh", volume: 0.2},
    {frame: whoFrom + 2, sound: "paper-slide-2", volume: 0.45},
    {frame: w(10, 2), sound: "pen-circle-2", volume: 0.35},
    {frame: w(10, 7) + 5, sound: "impact", volume: 0.5},
    {frame: w(11, 4) - 2, sound: "page-turn-1", volume: 0.42},
    {frame: w(12, 3) + 1, sound: "page-turn-2", volume: 0.4},
    // Lines 15-24
    {frame: lineStart(15) + 30, sound: "book-thud", volume: 0.35},
    {frame: lineStart(16) + 6, sound: "tick-soft-1", volume: 0.4},
    {frame: lancetFrom + 2, sound: "paper-slide-1", volume: 0.45},
    {frame: w(18, 7), sound: "pen-circle-1", volume: 0.32},
    {frame: w(18, 10) + 8, sound: "pen-circle-3", volume: 0.32},
    {frame: w(19, 4) + 1, sound: "tick-soft-2", volume: 0.4},
    {frame: w(19, 4) - 2, sound: "paper-slide-2", volume: 0.22},
    {frame: w(20, 1) + 1, sound: "tick-soft-3", volume: 0.4},
    {frame: w(20, 10) + 1, sound: "impact", volume: 0.4},
    {frame: lineStart(21) - 3, sound: "whoosh-3", volume: 0.12},
    {frame: w(22, 1), sound: "tick-soft-1", volume: 0.4},
    {frame: w(22, 4), sound: "tick-soft-2", volume: 0.4},
    {frame: w(22, 7) - 3, sound: "whoosh-2", volume: 0.12},
    {frame: lineStart(24) - 1, sound: "tick-soft-3", volume: 0.4},
    {frame: followAt + 12, sound: "tick-soft-1", volume: 0.45},
  ];
  // Room tone, out under the Ayah pages and from just before the payoff line to the CTA.
  const bedOff: [number, number][] = [
    [lineStart(3) - LEAD - 10, lineStart(5) - LEAD + 10],
    [lineStart(13) - LEAD - 10, lineStart(15) - LEAD + 10],
    [lineStart(23) - LEAD - 8, lineStart(24) - LEAD],
  ];
  const bedOn: [number, number][] = [];
  let cursor = 0;
  for (const [a, b] of bedOff) {
    bedOn.push([cursor, a]);
    cursor = b;
  }
  bedOn.push([cursor, total]);

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
      <Grain vignette={sceneAt(frame)?.scene.paper ? 0 : 0.32} color={GROUND} />
      {docs.map((d, i) => (
        <Sequence key={`doc-${i}`} from={d.from} durationInFrames={Math.max(1, d.to - d.from)}>
          {d.el}
        </Sequence>
      ))}
      {ctas.map((c, i) => (
        <Sequence key={`cta-${i}`} from={c.from} durationInFrames={Math.max(1, c.to - c.from)}>
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
              design={{sans: "Bricolage Grotesque", serif: "Instrument Serif", size: 66}}
              accent={paper ? PAPER_INK : "#FBF6EC"}
              ink={paper ? PAPER_INK : undefined}
              words={phrase.map((w) => ({text: w.text.replace(/["“”]/g, ""), emphasis: w.emphasis, frame: Math.max(0, sec(w.start) - start)}))}
            />
          </Sequence>
        );
      })}
      <Audio src={staticFile(`footage/${props.audio}`)} />
      {bedOn.map(([a, b], i) => (
        <Sequence key={`bed-${i}`} from={a} durationInFrames={Math.max(1, b - a)}>
          <Audio src={staticFile("sfx/bed-room.wav")} volume={(f) => 0.12 * Math.min(1, f / 10, (b - a - f) / 10)} loop />
        </Sequence>
      ))}
      {cues.map((c, i) => (
        <Sequence key={`sfx-${i}`} from={Math.max(0, c.frame)} durationInFrames={Math.ceil(SOUND_SECONDS[c.sound] * FPS) + 1}>
          <Audio src={staticFile(`sfx/${c.sound}.wav`)} volume={c.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const SHARAAB_FONTS = {SANS, SERIF};
