import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {AyahCard} from "../overlays/AyahCard";
import {Broll} from "../overlays/Broll";
import {Caption} from "../overlays/Caption";
import {Counter} from "../overlays/Counter";
import {EndCard} from "../overlays/EndCard";
import {Fingerprint} from "../overlays/Fingerprint";
import {Statement} from "../overlays/Statement";
import {Title} from "../overlays/Title";
import {GOLD, NAVY, PIP} from "../theme";
import {
  Edit,
  FPS,
  FULL_SCREEN_TYPES,
  Overlay,
  Segment,
  segmentFrames,
  sourceToOutputFrame,
  toFrames,
} from "../timeline/types";

const SEGMENT_PREMOUNT_FRAMES = FPS;
const FACE_FOCUS = {x: 540, y: 730};

// Each side of a cut lends this much room tone, so the sound never drops out.
const CROSSFADE_HALF_FRAMES = 3;

const CAPTION_HOLD_FRAMES = 8;
const PIP_MOVE_FRAMES = 9;
// circle() percentages are of the frame diagonal divided by the square root of two.
const CLIP_UNIT = Math.hypot(1080, 1920) / Math.SQRT2;

const equalPower = (progress: number) => Math.sin((progress * Math.PI) / 2);

const outputRange = (segments: Segment[], overlay: Overlay) => ({
  start: sourceToOutputFrame(segments, overlay.start),
  end: sourceToOutputFrame(segments, overlay.end),
});

const renderOverlay = (overlay: Overlay, overlays: Overlay[]) => {
  switch (overlay.type) {
    case "title":
      return <Title text={overlay.text} />;
    case "counter":
      return <Counter value={overlay.value} label={overlay.label} text={overlay.text} />;
    case "ayah":
      return (
        <AyahCard
          ayahKey={overlay.ayah}
          continues={overlays.some((o) => o.type === "ayah" && o.end === overlay.start)}
        />
      );
    case "fingerprint":
      return (
        <Fingerprint mode={overlay.mode} tag={overlay.tag} heading={overlay.heading} fact={overlay.fact} />
      );
    case "statement":
      return <Statement tag={overlay.tag} lines={overlay.lines} />;
    case "endcard":
      return <EndCard lines={overlay.lines} />;
    case "broll":
      return <Broll src={overlay.src} />;
  }
};

export const Short = ({footage, segments, overlays, captions}: Edit) => {
  const frame = useCurrentFrame();
  const src = staticFile(`footage/${footage}`);
  const fullScreen = overlays.filter((o) => FULL_SCREEN_TYPES.includes(o.type));
  const layered = overlays.filter((o) => !FULL_SCREEN_TYPES.includes(o.type));

  // 0 = speaker fills the frame, 1 = speaker in the corner circle.
  const pip = Math.max(
    0,
    ...fullScreen.map((overlay) => {
      const {start, end} = outputRange(segments, overlay);
      if (end - start < 2 * PIP_MOVE_FRAMES) {
        return 0;
      }
      return interpolate(
        frame,
        [start, start + PIP_MOVE_FRAMES, end - PIP_MOVE_FRAMES, end],
        [0, 1, 1, 0],
        {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)},
      );
    }),
  );
  const pipScale = interpolate(pip, [0, 1], [1, PIP.radius / 360]);
  const clipRadius = interpolate(pip, [0, 1], [1600, 360]);

  const renderTimed = (overlay: Overlay) => {
    const {start, end} = outputRange(segments, overlay);
    if (end <= start) {
      return null;
    }
    return (
      <Sequence key={`${overlay.type}-${overlay.start}`} from={start} durationInFrames={end - start}>
        {renderOverlay(overlay, overlays)}
      </Sequence>
    );
  };

  let videoCursor = 0;
  let audioCursor = 0;

  return (
    <AbsoluteFill style={{backgroundColor: NAVY}}>
      {fullScreen.map(renderTimed)}
      <AbsoluteFill
        style={{
          clipPath: `circle(${(clipRadius / CLIP_UNIT) * 100}% at ${FACE_FOCUS.x}px ${FACE_FOCUS.y}px)`,
          transformOrigin: `${FACE_FOCUS.x}px ${FACE_FOCUS.y}px`,
          transform: `translate(${(PIP.x - FACE_FOCUS.x) * pip}px, ${(PIP.y - FACE_FOCUS.y) * pip}px) scale(${pipScale})`,
        }}
      >
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
                style={{
                  transform: `scale(${segment.zoom})`,
                  transformOrigin: `${FACE_FOCUS.x}px ${FACE_FOCUS.y}px`,
                }}
              />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {pip > 0 ? (
        <div
          style={{
            position: "absolute",
            left: PIP.x - PIP.radius,
            top: PIP.y - PIP.radius,
            width: PIP.radius * 2,
            height: PIP.radius * 2,
            borderRadius: "50%",
            border: `6px solid ${GOLD}`,
            boxSizing: "border-box",
            opacity: interpolate(pip, [0.7, 1], [0, 1], {extrapolateLeft: "clamp"}),
          }}
        />
      ) : null}
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
              volume={(audioFrame) => {
                const fadeIn = lead === 0 ? 1 : Math.min(audioFrame / (2 * lead), 1);
                const fadeOut = tail === 0 ? 1 : Math.min((length - audioFrame) / (2 * tail), 1);
                return equalPower(fadeIn) * equalPower(fadeOut);
              }}
            />
          </Sequence>
        );
      })}
      {layered.map(renderTimed)}
      {captions.map((phrase, index) => {
        const start = sourceToOutputFrame(segments, phrase[0].start);
        const lastWord = phrase[phrase.length - 1];
        const hold = sourceToOutputFrame(segments, lastWord.end) + CAPTION_HOLD_FRAMES;
        const next = captions[index + 1];
        const end = next ? Math.min(hold, sourceToOutputFrame(segments, next[0].start)) : hold;
        if (end <= start) {
          return null;
        }
        const aboveCard = overlays.some((overlay) => {
          const range = outputRange(segments, overlay);
          return overlay.type === "ayah" && range.start < end && range.end > start;
        });
        return (
          <Sequence key={`caption-${phrase[0].start}`} from={start} durationInFrames={end - start}>
            <Caption
              aboveCard={aboveCard}
              words={phrase.map((word) => ({
                text: word.text,
                emphasis: word.emphasis,
                frame: Math.max(sourceToOutputFrame(segments, word.start) - start, 0),
              }))}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
