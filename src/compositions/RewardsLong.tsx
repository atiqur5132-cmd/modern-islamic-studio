import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from "remotion";
import {Grain} from "../overlays/Grain";
import {CashChapter, CASH_CUES} from "../long/rewards/cash";
import {GameChapter, GAME_CUES} from "../long/rewards/game";
import {Hook} from "../long/rewards/hook";
import {Ground} from "../long/rewards/kit";
import {HOOK, sec} from "../long/rewards/look";
import {OUTRO_3D, OUTRO_CUES, OutroOverlay, outroState} from "../long/rewards/outro";
import {REVOLVE_3D, REVOLVE_CUES, RevolveChapter, RevolveOverlay3D, revolveState} from "../long/rewards/revolve";
import {RulesChapter, RULES_CUES} from "../long/rewards/rules";
import {CUES as HOOK_CUES, bedVolume} from "../long/rewards/sounds";
import {Studio3D} from "../long/rewards/Studio3D";

export type RewardsProps = {audio: string; durationSeconds: number};

const CUES = [...HOOK_CUES, ...CASH_CUES, ...REVOLVE_CUES, ...GAME_CUES, ...RULES_CUES, ...OUTRO_CUES].sort((a, b) => a.at - b.at);

const within = (frame: number, [a, b]: [number, number]) => frame >= sec(a) && frame < sec(b) + 1;

// "Deadbeats": who really pays for credit card rewards (The Rich Rules long form).
// A bright 3D studio and 2D graphs, one colour of meaning per chapter, the creator's AI
// voiceover, no subtitles. projects/en/card-rewards/beats.md has the plan.
export const RewardsLong = ({audio}: RewardsProps) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse 75% 70% at 50% 42%, #f8fbfa 0%, ${HOOK.ground} 55%, ${HOOK.ground2} 100%)`}}>
      {frame < sec(71.2) ? <Hook /> : null}
      <Ground skipFirst />
      {within(frame, REVOLVE_3D) ? (
        <>
          <Studio3D s={revolveState(frame)} />
          <RevolveOverlay3D />
        </>
      ) : null}
      <CashChapter />
      <RevolveChapter />
      <GameChapter />
      <RulesChapter />
      {within(frame, OUTRO_3D) ? (
        <>
          <Studio3D s={outroState(frame)} />
          <OutroOverlay />
        </>
      ) : null}
      <Grain vignette={0.18} color={HOOK.ink} />
      <Audio src={staticFile(`footage/${audio}`)} />
      <Audio src={staticFile("sfx/bed-room.wav")} loop volume={bedVolume} />
      {CUES.map((c, i) => (
        <Sequence key={`sfx-${i}`} from={sec(c.at)} durationInFrames={90}>
          <Audio src={staticFile(`sfx/${c.sound}.wav`)} volume={c.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
