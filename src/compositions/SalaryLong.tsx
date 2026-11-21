import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Grain} from "../overlays/Grain";
import {CH1_MOVES, Ch1Board, Ch1Notes} from "../long/salary/ch1";
import {CH2_MOVES, Ch2Board, Ch2Notes} from "../long/salary/ch2";
import {CH3_MOVES, Ch3Board, Ch3Notes} from "../long/salary/ch3";
import {CH4_MOVES, Ch4Board, Ch4Notes, EndCard} from "../long/salary/ch4";
import {HOOK_MOVES, HookBoard, hookNight, HookNotes} from "../long/salary/hook";
import {Board, Paper} from "../long/salary/kit";
import {PAPER, sec, viewAt} from "../long/salary/look";
import {CH1_CUES, CH2_CUES, CH3_CUES, CH4_CUES, HOOK_CUES, musicVolume, roomVolume} from "../long/salary/sounds";

export type SalaryProps = {audio: string; music: string | null; durationSeconds: number};

const CUES = [...HOOK_CUES, ...CH1_CUES, ...CH2_CUES, ...CH3_CUES, ...CH4_CUES].sort((a, b) => a.at - b.at);
const MOVES = [...HOOK_MOVES, ...CH1_MOVES, ...CH2_MOVES, ...CH3_MOVES, ...CH4_MOVES];

// "The $1 Salary" (The Rich Rules long form): one paper board the camera travels across, real
// photos and logos, the creator's AI voiceover, a music bed, no subtitles. projects/en/rr-03/beats.md.
export const SalaryLong = ({audio, music, durationSeconds}: SalaryProps) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: PAPER.ground}}>
      <Paper night={hookNight(frame)} />
      <Board view={viewAt(frame, MOVES)}>
        <HookBoard />
        <Ch1Board />
        <Ch2Board />
        <Ch3Board />
        <Ch4Board />
      </Board>
      <HookNotes />
      <Ch1Notes />
      <Ch2Notes />
      <Ch3Notes />
      <Ch4Notes />
      <EndCard />
      <Grain vignette={0.16} color={PAPER.ink} />
      <Audio src={staticFile(`footage/${audio}`)} />
      <Audio src={staticFile("sfx/bed-room.wav")} loop volume={roomVolume} />
      {music ? <Audio src={staticFile(`music/${music}`)} volume={(f) => musicVolume(f, durationSeconds)} /> : null}
      {CUES.map((c, i) => (
        <Sequence key={`sfx-${i}`} from={sec(c.at)} durationInFrames={90}>
          <Audio src={staticFile(`sfx/${c.sound}.wav`)} volume={c.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
