import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Grain} from "../overlays/Grain";
import {bedVolume, CHAPTER_CUES, chapterState, ChaptersOverlay} from "../long/labmeat/chapters";
import {HOOK_END, HookOverlay, hookState} from "../long/labmeat/hook";
import {Lab3D} from "../long/labmeat/Lab3D";
import {LAB, sec} from "../long/labmeat/look";
import {MUSIC, musicGain} from "../long/labmeat/music";

export type LabMeatProps = {audio: string; durationSeconds: number};

// The sound map of the hook (beats.md, Sound column). Each cue has its cause on screen.
const CUES: {at: number; sound: string; volume: number}[] = [
  {at: 0.0, sound: "tick-soft-1", volume: 0.35},
  {at: 2.2, sound: "paper-slide-1", volume: 0.4},
  {at: 6.8, sound: "paper-slide-2", volume: 0.45},
  {at: 9.7, sound: "pen-circle-1", volume: 0.3},
  {at: 11.05, sound: "page-turn-1", volume: 0.4},
  {at: 14.48, sound: "pen-circle-2", volume: 0.3},
  {at: 17.15, sound: "impact", volume: 0.32},
  {at: 18.15, sound: "whoosh-2", volume: 0.22},
  {at: 20.1, sound: "tick-soft-1", volume: 0.35},
  {at: 20.7, sound: "tick-soft-2", volume: 0.35},
  {at: 21.32, sound: "tick-soft-3", volume: 0.35},
  {at: 25.9, sound: "cloth", volume: 0.3},
  {at: 30.5, sound: "page-turn-2", volume: 0.3},
  {at: 32.9, sound: "paper-slide-1", volume: 0.35},
  {at: 35.18, sound: "paper-slide-2", volume: 0.35},
  {at: 37.82, sound: "paper-slide-1", volume: 0.35},
];

// "Lab mein bana gosht: halal ya nahi?" (Modern Islamic Studio long form, 16:9): one night
// lab in 3D, real photos and documents brought up to the lens, no subtitles (creator's brief).
// projects/lab-meat/beats.md. Hook 0-40 s (hook.tsx), chapters 1-9 and the end (chapters.tsx).
// Music: four YouTube Audio Library tracks, very low under the voice (music.ts).
export const LabMeatLong = ({audio}: LabMeatProps) => {
  const frame = useCurrentFrame();
  const s = frame < sec(HOOK_END) ? hookState(frame) : chapterState(frame);
  return (
    <AbsoluteFill style={{background: LAB.ground}}>
      <Lab3D s={s} />
      {frame < sec(HOOK_END) ? <HookOverlay /> : <ChaptersOverlay s={s} />}
      <Grain vignette={0.42} color={LAB.ground} />
      <Audio src={staticFile(`footage/${audio}`)} />
      <Audio src={staticFile("sfx/bed-room.wav")} loop volume={bedVolume} />
      {MUSIC.map((m) => (
        <Sequence key={m.file} from={sec(m.from)} durationInFrames={sec(m.to - m.from)}>
          <Audio src={staticFile(m.file)} volume={musicGain(m)} />
        </Sequence>
      ))}
      {[...CUES, ...CHAPTER_CUES].map((c, i) => (
        <Sequence key={`sfx-${i}`} from={sec(c.at)} durationInFrames={90}>
          <Audio src={staticFile(`sfx/${c.sound}.wav`)} volume={c.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
