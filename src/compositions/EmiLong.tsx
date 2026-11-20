import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {CUES, bedVolume, cueFrame} from "../long/emi/sounds";
import {Grain} from "../overlays/Grain";
import {cameraAt} from "../long/emi/camera";
import {ChalkDefs} from "../long/emi/chalk";
import {HOOK_SHOTS, Hook} from "../long/emi/hook";
import {H, HAND, LOOK, W} from "../long/emi/look";
import {A_SHOTS, PartsA} from "../long/emi/partA";
import {B_SHOTS, PartsB} from "../long/emi/partB";
import {C_SHOTS, PartsC} from "../long/emi/partC";
import {Receipt} from "../long/emi/Receipt";

export type EmiProps = {audio: string; durationSeconds: number};

const SHOTS = [...HOOK_SHOTS, ...A_SHOTS, ...B_SHOTS, ...C_SHOTS].sort((a, b) => a.at - b.at);

// "No-Cost EMI" (Ateeq Decoded long form): one chalk board, a camera moving across it,
// the creator's AI voiceover. No subtitles (creator's brief). beats.md has the plan.
export const EmiLong = ({audio}: EmiProps) => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame, SHOTS);
  return (
    <AbsoluteFill style={{backgroundColor: LOOK.ground}}>
      {/* Faint chalk-dust smudges on the board, fixed to the screen. */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse 60% 45% at 30% 35%, ${LOOK.ground2} 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 75% 70%, ${LOOK.ground2} 0%, transparent 70%)`}} />
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: "absolute", fontFamily: HAND}}>
        <ChalkDefs />
        <g filter="url(#chalk)">
          <g transform={`translate(${W / 2} ${H / 2}) scale(${cam.z}) translate(${-cam.x} ${-cam.y})`}>
            <Hook />
            <PartsA />
            <PartsB />
            <PartsC />
          </g>
        </g>
      </svg>
      <Receipt />
      <Grain vignette={0.4} color={LOOK.ground} />
      <Audio src={staticFile(`footage/${audio}`)} />
      <Audio src={staticFile("sfx/bed-room.wav")} loop volume={bedVolume} />
      {CUES.map((c, i) => (
        <Sequence key={`sfx-${i}`} from={cueFrame(c)} durationInFrames={90}>
          <Audio src={staticFile(`sfx/${c.sound}.wav`)} volume={c.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
