import {AbsoluteFill, Img, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {NAVY} from "../theme";

const PHOTO = /\.(jpe?g|png|webp)$/i;

// A full-screen cutaway with a slow push-in, darkened at the foot for captions.
// Photos also drift a little, so a still never looks frozen. `blur` softens a shot
// whose detail must not be read, such as a Mushaf page other than the Ayah discussed.
export const Broll = ({src, blur = 0}: {src: string; blur?: number}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const progress = frame / durationInFrames;
  const style = {
    width: "100%",
    height: "100%",
    objectFit: "cover" as const,
    filter: blur ? `blur(${blur}px)` : undefined,
  };

  return (
    <AbsoluteFill style={{backgroundColor: NAVY, overflow: "hidden"}}>
      {PHOTO.test(src) ? (
        <Img
          src={staticFile(`footage/${src}`)}
          style={{
            ...style,
            transform: `scale(${interpolate(progress, [0, 1], [1.18, 1.05])}) translateY(${interpolate(progress, [0, 1], [-30, 30])}px)`,
          }}
        />
      ) : (
        <OffthreadVideo
          muted
          src={staticFile(`footage/${src}`)}
          style={{...style, transform: `scale(${interpolate(progress, [0, 1], [1.08, 1])})`}}
        />
      )}
      <AbsoluteFill style={{background: `linear-gradient(180deg, transparent 55%, ${NAVY}CC 100%)`}} />
    </AbsoluteFill>
  );
};
