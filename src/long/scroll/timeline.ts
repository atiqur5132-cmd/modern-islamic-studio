import React from "react";
import {FPS} from "../../timeline/types";
import {HookScene, QuestionScene, SumScene} from "./scenesA";
import {LeverScene, SkinnerScene, SlotScene, ThreeBoxesScene} from "./scenesB";
import {BrainScene, CaveatScene, MonkeyScene, UncertaintyScene} from "./scenesC";
import {DataScene, DetoxScene, InsidersScene, LikesScene} from "./scenesD";
import {CtaScene, EndScene, HadithScene, ReceiptScene, TriggerScene} from "./scenesE";
import {Cues, LongProps} from "./types";

// The order of the video: each scene starts on the first line it carries (a few frames
// early, `lead`), and runs until the next one starts. `cut` starts it without a crossfade.
export type SceneEntry = {
  id: string;
  from: number;
  Scene: React.FC<{cues: Cues}>;
  lead?: number;
  cut?: boolean;
  paper?: boolean;
  noCaptions?: boolean;
};

export const SCENES: SceneEntry[] = [
  {id: "hook", from: 1, Scene: HookScene, cut: true},
  {id: "sum", from: 4, Scene: SumScene, cut: true},
  {id: "question", from: 10, Scene: QuestionScene},
  {id: "skinner", from: 17, Scene: SkinnerScene},
  {id: "boxes", from: 22, Scene: ThreeBoxesScene, cut: true},
  {id: "slot", from: 30, Scene: SlotScene},
  {id: "lever", from: 37, Scene: LeverScene, cut: true},
  {id: "brain", from: 43, Scene: BrainScene},
  {id: "monkey", from: 48, Scene: MonkeyScene},
  {id: "uncertainty", from: 55, Scene: UncertaintyScene, cut: true},
  {id: "caveat", from: 59, Scene: CaveatScene},
  {id: "insiders", from: 64, Scene: InsidersScene},
  {id: "likes", from: 78, Scene: LikesScene},
  {id: "data", from: 87, Scene: DataScene},
  {id: "detox", from: 98, Scene: DetoxScene, cut: true},
  {id: "hadith", from: 106, Scene: HadithScene, paper: true, lead: 10},
  {id: "receipt", from: 114, Scene: ReceiptScene},
  {id: "trigger", from: 120, Scene: TriggerScene, cut: true},
  {id: "end", from: 126, Scene: EndScene},
  {id: "cta", from: 130, Scene: CtaScene, cut: true},
];

// Mid-video subscribe notes: after the caveat's payoff and after the data chapter.
export const MID_CTAS = [63, 97];

export type SoundCue = {frame: number; sound: string; volume: number};

// Soft cues with a cause on screen (QUALITY.md §6): a swipe, a number landing, the bells,
// a chapter turning. Never a whoosh on every cut.
export const soundsFor = (props: LongProps, lineStart: (n: number) => number): SoundCue[] => {
  const word = (n: number, i: number) => {
    const w = props.words.find((x) => x.line === n && x.index === i);
    return w ? Math.round(w.start * FPS) : lineStart(n);
  };
  const ticks = ["tick-soft-1", "tick-soft-2", "tick-soft-3"];
  const cues: SoundCue[] = [
    {frame: 0, sound: "tick-soft-1", volume: 0.5},
    {frame: word(1, 2), sound: "tick-soft-2", volume: 0.45},
    {frame: word(1, 5), sound: "tick-soft-3", volume: 0.45},
    {frame: lineStart(2) + 1, sound: "sub-hit", volume: 0.5},
    {frame: lineStart(6) + 30, sound: "tick", volume: 0.4},
    {frame: lineStart(7) + 40, sound: "tick", volume: 0.4},
    {frame: lineStart(8) + 1, sound: "impact", volume: 0.45},
    {frame: lineStart(12) + 1, sound: "sub-hit", volume: 0.4},
    {frame: lineStart(33) + 1, sound: "whoosh-2", volume: 0.25},
    {frame: lineStart(34) + 1, sound: "whoosh-3", volume: 0.25},
    {frame: lineStart(35) + 30, sound: "shimmer", volume: 0.45},
    {frame: lineStart(38) + 1, sound: ticks[0], volume: 0.4},
    {frame: lineStart(39) + 1, sound: ticks[1], volume: 0.4},
    {frame: lineStart(40) + 1, sound: ticks[2], volume: 0.4},
    {frame: lineStart(93) + 1, sound: "sub-hit", volume: 0.45},
    {frame: lineStart(106) - 6, sound: "riser", volume: 0.2},
    {frame: lineStart(127) + 1, sound: "sub-hit", volume: 0.4},
    {frame: word(130, 10) + 6, sound: "tick", volume: 0.5},
  ];
  for (const n of [17, 43, 64, 87, 114]) cues.push({frame: lineStart(n) - 6, sound: n % 2 ? "whoosh" : "whoosh-2", volume: 0.18});
  return cues.filter((c) => c.frame >= 0).sort((a, b) => a.frame - b.frame);
};
