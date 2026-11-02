import {AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile} from "remotion";
import {AyahCard} from "../overlays/AyahCard";
import {Title} from "../overlays/Title";
import {NAVY} from "../theme";
import {Edit, FPS, segmentFrames, sourceToOutputFrame, toFrames} from "../timeline/types";

const SEGMENT_PREMOUNT_FRAMES = FPS;
const FACE_FOCUS = "50% 38%";

// Each side of a cut lends this much room tone, so the sound never drops out.
const CROSSFADE_HALF_FRAMES = 3;

const equalPower = (progress: number) => Math.sin((progress * Math.PI) / 2);

export const Short = ({footage, segments, overlays}: Edit) => {
  const src = staticFile(`footage/${footage}`);
  let videoCursor = 0;
  let audioCursor = 0;

  return (
    <AbsoluteFill style={{backgroundColor: NAVY}}>
      {segments.map((segment) => {
        const length = segmentFrames(segment);
        const from = videoCursor;
        videoCursor += length;
        return (
          <Sequence
            key={segment.from}
            from={from}
            durationInFrames={length}
            premountFor={SEGMENT_PREMOUNT_FRAMES}
          >
            <OffthreadVideo
              muted
              src={src}
              trimBefore={toFrames(segment.from)}
              trimAfter={toFrames(segment.to)}
              style={{transform: `scale(${segment.zoom})`, transformOrigin: FACE_FOCUS}}
            />
          </Sequence>
        );
      })}
      {segments.map((segment, index) => {
        const lead = index === 0 ? 0 : CROSSFADE_HALF_FRAMES;
        const tail = index === segments.length - 1 ? 0 : CROSSFADE_HALF_FRAMES;
        const length = segmentFrames(segment) + lead + tail;
        const from = audioCursor - lead;
        audioCursor += segmentFrames(segment);
        return (
          <Sequence key={`audio-${segment.from}`} from={from} durationInFrames={length}>
            <Audio
              src={src}
              trimBefore={toFrames(segment.from) - lead}
              trimAfter={toFrames(segment.to) + tail}
              volume={(frame) => {
                const fadeIn = lead === 0 ? 1 : Math.min(frame / (2 * lead), 1);
                const fadeOut = tail === 0 ? 1 : Math.min((length - frame) / (2 * tail), 1);
                return equalPower(fadeIn) * equalPower(fadeOut);
              }}
            />
          </Sequence>
        );
      })}
      {overlays.map((overlay) => {
        const start = sourceToOutputFrame(segments, overlay.start);
        const end = sourceToOutputFrame(segments, overlay.end);
        if (end <= start) {
          return null;
        }
        return (
          <Sequence
            key={`${overlay.type}-${overlay.start}`}
            from={start}
            durationInFrames={end - start}
          >
            {overlay.type === "title" ? (
              <Title text={overlay.text} />
            ) : (
              <AyahCard ayahKey={overlay.ayah} />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
