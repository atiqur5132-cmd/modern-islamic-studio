import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from "remotion";
import {AyahCard} from "../overlays/AyahCard";
import {Title} from "../overlays/Title";
import {NAVY} from "../theme";
import {Edit, FPS, toFrames} from "../timeline/types";

const SEGMENT_PREMOUNT_FRAMES = FPS;

export const Short = ({footage, segments, overlays}: Edit) => {
  let cursor = 0;

  return (
    <AbsoluteFill style={{backgroundColor: NAVY}}>
      {segments.map((segment) => {
        const trimBefore = toFrames(segment.from);
        const trimAfter = toFrames(segment.to);
        const from = cursor;
        cursor += trimAfter - trimBefore;
        return (
          <Sequence
            key={segment.from}
            from={from}
            durationInFrames={trimAfter - trimBefore}
            premountFor={SEGMENT_PREMOUNT_FRAMES}
          >
            <OffthreadVideo
              src={staticFile(`footage/${footage}`)}
              trimBefore={trimBefore}
              trimAfter={trimAfter}
            />
          </Sequence>
        );
      })}
      {overlays.map((overlay) => (
        <Sequence
          key={`${overlay.type}-${overlay.start}`}
          from={toFrames(overlay.start)}
          durationInFrames={toFrames(overlay.end) - toFrames(overlay.start)}
        >
          {overlay.type === "title" ? (
            <Title text={overlay.text} />
          ) : (
            <AyahCard ayahKey={overlay.ayah} />
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
