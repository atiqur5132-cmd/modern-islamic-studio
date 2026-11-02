import {AbsoluteFill, interpolate, OffthreadVideo, Sequence, staticFile} from "remotion";
import {AyahCard} from "../overlays/AyahCard";
import {Title} from "../overlays/Title";
import {NAVY} from "../theme";
import {Edit, FPS, segmentFrames, sourceToOutputFrame, toFrames} from "../timeline/types";

const SEGMENT_PREMOUNT_FRAMES = FPS;
const AUDIO_FADE_FRAMES = 2;

const FACE_FOCUS = "50% 38%";

export const Short = ({footage, segments, overlays}: Edit) => {
  let cursor = 0;

  return (
    <AbsoluteFill style={{backgroundColor: NAVY}}>
      {segments.map((segment) => {
        const length = segmentFrames(segment);
        const from = cursor;
        cursor += length;
        return (
          <Sequence
            key={segment.from}
            from={from}
            durationInFrames={length}
            premountFor={SEGMENT_PREMOUNT_FRAMES}
          >
            <OffthreadVideo
              src={staticFile(`footage/${footage}`)}
              trimBefore={toFrames(segment.from)}
              trimAfter={toFrames(segment.to)}
              volume={(frame) =>
                interpolate(
                  frame,
                  [0, AUDIO_FADE_FRAMES, length - AUDIO_FADE_FRAMES, length],
                  [0, 1, 1, 0],
                  {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
                )
              }
              style={{transform: `scale(${segment.zoom})`, transformOrigin: FACE_FOCUS}}
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
