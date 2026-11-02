import {AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {NAVY} from "../theme";

// A full-screen cutaway with a slow push-in, darkened at the foot for captions.
export const Broll = ({src}: {src: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const push = interpolate(frame, [0, durationInFrames], [1.08, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: NAVY}}>
      <OffthreadVideo
        muted
        src={staticFile(`footage/${src}`)}
        style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})`}}
      />
      <AbsoluteFill style={{background: `linear-gradient(180deg, transparent 55%, ${NAVY}CC 100%)`}} />
    </AbsoluteFill>
  );
};
