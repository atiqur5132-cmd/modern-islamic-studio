import {
  AbsoluteFill,
  Audio,
  Easing,
  Freeze,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {AyahCard} from "../overlays/AyahCard";
import {Broll} from "../overlays/Broll";
import {Caption} from "../overlays/Caption";
import {PullQuote} from "../overlays/PullQuote";
import {Counter} from "../overlays/Counter";
import {Cta} from "../overlays/Cta";
import {EndCard} from "../overlays/EndCard";
import {Fingerprint} from "../overlays/Fingerprint";
import {Statement} from "../overlays/Statement";
import {Title} from "../overlays/Title";
import {BonesScene} from "../scenes/BonesScene";
import {FingertipScene} from "../scenes/FingertipScene";
import {Grain} from "../overlays/Grain";
import {Cue} from "../overlays/falak/common";
import {Falak} from "../overlays/falak/Falak";
import {Galaxy} from "../overlays/falak/Galaxy";
import {Hook} from "../overlays/falak/Hook";
import {Montage} from "../overlays/falak/Montage";
import {Palindrome} from "../overlays/falak/Palindrome";
import {EndPhrase, Note, Ring} from "../overlays/falak/Ring";
import {Split} from "../overlays/falak/Split";
import {VerseTag} from "../overlays/falak/VerseTag";
import {FactFootage} from "../overlays/yawm/FactFootage";
import {HeadCard} from "../overlays/yawm/HeadCard";
import {YawmHook} from "../overlays/yawm/Hook";
import {Ledger} from "../overlays/yawm/Ledger";
import {Posts} from "../overlays/yawm/Posts";
import {STACK_FACE_Y, STACK_HEIGHT, STACK_MOVE_FRAMES} from "../overlays/yawm/look";
import {Rules} from "../overlays/yawm/Rules";
import {Scan} from "../overlays/yawm/Scan";
import {AyahStrips} from "../overlays/flat/AyahStrips";
import {Board, ReadInto} from "../overlays/flat/Board";
import {FlatFootage} from "../overlays/flat/Footage";
import {FlatHook} from "../overlays/flat/Hook";
import {EggCheck, Nest} from "../overlays/flat/Ostrich";
import {Ball, QuoteCard} from "../overlays/flat/Scholars";
import {Verdicts} from "../overlays/flat/Verdicts";
import {QAyah, QBoard, QChest, QCompass, QFootage, QQuote} from "../overlays/qibla/Cards";
import {QHook} from "../overlays/qibla/Hook";
import {QiblaEarth} from "../overlays/qibla/QiblaEarth";
import {CTA_TOP_Y} from "../overlays/Cta";
import {cameraAt, emphasisPunches, ROOM_FRAMES} from "../timeline/camera";
import {SOUND_SECONDS, soundCues} from "../timeline/sfx";
import {GOLD, NAVY, PIP, PIP_HEAD_LIFT, SAFE_AREA} from "../theme";
import {
  COVER_TYPES,
  CtaOverlay,
  Edit,
  FPS,
  footageFrames,
  FULL_SCREEN_TYPES,
  Overlay,
  Segment,
  segmentFrames,
  sourceToOutputFrame,
  STACK_TYPES,
  toFrames,
} from "../timeline/types";

const SEGMENT_PREMOUNT_FRAMES = FPS;

// Each side of a cut lends this much room tone, so the sound never drops out.
const CROSSFADE_HALF_FRAMES = 3;

const CAPTION_HOLD_FRAMES = 8;
// The caption's foot above the frame's bottom edge in the default band.
const CAPTION_BAND_BOTTOM = SAFE_AREA.bottom + 20;
// Graphics that already put the spoken words on screen; captions would repeat them.
const SPOKEN_TEXT_TYPES: Overlay["type"][] = ["statement", "endcard"];
const PIP_MOVE_FRAMES = 9;

// A layout that opens the reel (the speaker-led hook, QUALITY.md §1) is already in
// place at frame 0, so frame 0 shows the split or circle, not the move into it: its
// entry move is placed before the reel starts.
const settledStart = (start: number, move: number) => (start <= 0 ? start - move : start);
// How far a full-screen graphic that opens the reel is pre-rolled, so its entrance has
// landed by frame 0 (entrances run 10-20 frames).
const OPENING_ARRIVAL_FRAMES = 20;
// circle() percentages are of the frame diagonal divided by the square root of two.
const CLIP_UNIT = Math.hypot(1080, 1920) / Math.SQRT2;

const equalPower = (progress: number) => Math.sin((progress * Math.PI) / 2);

// A whip between sections: the old shot flies out left, the new one lands from
// the right, both smeared sideways. Scaled up a touch so no edge shows under the blur.
const WHIP_FRAMES = 5;
const WHIP_TRAVEL = 0.12;
const WHIP_BLUR = 60;

const whipAt = (frame: number, segments: Segment[]) => {
  let cursor = 0;
  for (const segment of segments) {
    if (segment.transition === "whip" && Math.abs(frame - cursor) <= WHIP_FRAMES) {
      const t = (frame - cursor) / WHIP_FRAMES; // -1 .. 1, 0 at the cut
      const away = t < 0 ? Easing.in(Easing.cubic)(1 + t) : Easing.out(Easing.cubic)(1 - t);
      // The blur pulls in the empty space past the frame edge, so overscale by its reach too.
      const reach = (3 * WHIP_BLUR) / 1080;
      return {
        x: (t < 0 ? -1 : 1) * away * WHIP_TRAVEL * 1080,
        blur: away * WHIP_BLUR,
        scale: 1 + away * (2 * WHIP_TRAVEL + 2 * reach),
      };
    }
    cursor += segmentFrames(segment);
  }
  return {x: 0, blur: 0, scale: 1};
};

// Cool shadows, warm highlights; contrast and saturation come from the edit.
const GRADE_TABLES = {
  r: "0 0.245 0.5 0.762 1",
  g: "0 0.25 0.5 0.75 1",
  b: "0.012 0.262 0.5 0.738 0.985",
};

// Shots taken straight from one continuous file share their audio at the cut;
// a crossfade there would double the sound.
const continues = (previous: Segment | undefined, segment: Segment) =>
  previous !== undefined && toFrames(previous.to) === toFrames(segment.from);

const outputRange = (segments: Segment[], overlay: Overlay) => ({
  start: sourceToOutputFrame(segments, overlay.start),
  end: sourceToOutputFrame(segments, overlay.end),
});

type Palette = NonNullable<Edit["palette"]>;

// Graphics drawn on the reel's own ground (no footage behind the captions).
const PAGE_TYPES: Overlay["type"][] = ["pullquote"];

// Relative luminance above 0.5 counts as a light ground.
const isLight = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.5;
};

const renderOverlay = (overlay: Overlay, overlays: Overlay[], cue: Cue, palette: Palette) => {
  switch (overlay.type) {
    case "pullquote":
      return <PullQuote o={overlay} cue={cue} palette={palette} />;
    case "cta":
      return <Cta cta={overlay} />;
    case "hook":
      return <Hook title={overlay.title} ayah={overlay.ayah} mirrorAt={overlay.mirrorAt} cue={cue} />;
    case "versetag":
      return <VerseTag label={overlay.label} icons={overlay.icons} cue={cue} />;
    case "montage":
      return <Montage tag={overlay.tag} shots={overlay.shots} cue={cue} />;
    case "palindrome":
      return <Palindrome o={overlay} cue={cue} />;
    case "split":
      return (
        <Split
          ayah={overlay.ayah}
          tag={overlay.tag}
          left={overlay.left}
          right={overlay.right}
          waveform={overlay.waveform}
          leftAt={overlay.leftAt}
          rightAt={overlay.rightAt}
          cue={cue}
        />
      );
    case "falak":
      return (
        <Falak
          ayah={overlay.ayah}
          wordAt={overlay.wordAt}
          roundAt={overlay.roundAt}
          morphAt={overlay.morphAt}
          source={overlay.source}
          cue={cue}
        />
      );
    case "galaxy":
      return <Galaxy tag={overlay.tag} sunAt={overlay.sunAt} speed={overlay.speed} period={overlay.period} source={overlay.source} cue={cue} />;
    case "note":
      return <Note text={overlay.text} />;
    case "ring":
      return <Ring ayah={overlay.ayah} runAt={overlay.runAt} homeAt={overlay.homeAt} phraseAt={overlay.phraseAt} cue={cue} />;
    case "endphrase":
      return <EndPhrase ayah={overlay.ayah} />;
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
      return <Broll src={overlay.src} blur={overlay.blur} />;
    case "scene":
      return overlay.scene === "bones" ? <BonesScene /> : <FingertipScene />;
    case "yawmhook":
      return <YawmHook hook={overlay} cue={cue} />;
    case "scan":
      return <Scan scan={overlay} />;
    case "ledger":
      return <Ledger ledger={overlay} cue={cue} />;
    case "rules":
      return <Rules rules={overlay} />;
    case "factfootage":
      return <FactFootage fact={overlay} cue={cue} />;
    case "headcard":
      return <HeadCard card={overlay} cue={cue} />;
    case "posts":
      return <Posts posts={overlay} cue={cue} />;
    case "flathook":
      return <FlatHook hook={overlay} cue={cue} />;
    case "verdicts":
      return <Verdicts v={overlay} cue={cue} />;
    case "ayahstrips":
      return <AyahStrips card={overlay} cue={cue} />;
    case "flatfootage":
      return <FlatFootage f={overlay} cue={cue} />;
    case "flatboard":
      return <Board b={overlay} cue={cue} />;
    case "readinto":
      return <ReadInto r={overlay} cue={cue} />;
    case "quotecard":
      return <QuoteCard q={overlay} />;
    case "ball":
      return <Ball b={overlay} cue={cue} />;
    case "eggcheck":
      return <EggCheck e={overlay} cue={cue} />;
    case "nest":
      return <Nest n={overlay} cue={cue} />;
    case "qhook":
      return <QHook o={overlay} cue={cue} />;
    case "qboard":
      return <QBoard o={overlay} cue={cue} />;
    case "qcompass":
      return <QCompass o={overlay} cue={cue} />;
    case "qchest":
      return <QChest o={overlay} cue={cue} />;
    case "qquote":
      return <QQuote o={overlay} cue={cue} />;
    case "qfootage":
      return <QFootage o={overlay} cue={cue} />;
    case "qglobe":
    case "qglobepip":
      return <QiblaEarth o={overlay} cue={cue} />;
    case "qayah":
      return <QAyah o={overlay} cue={cue} />;
  }
};

export const Short = ({
  footage,
  segments,
  overlays,
  captions,
  face,
  grade,
  punchToZoom,
  hideCaptions,
  captionStyle,
  captionDesign,
  captionHide = [],
  captionTerms = [],
  palette = {ground: NAVY, ink: NAVY, accent: GOLD},
}: Edit) => {
  const frame = useCurrentFrame();
  const src = staticFile(`footage/${footage}`);
  const fullScreen = overlays.filter((o) => FULL_SCREEN_TYPES.includes(o.type));
  const layered = overlays.filter((o) => !FULL_SCREEN_TYPES.includes(o.type));
  // The stack layout: the speaker slides into the top window as its board rises, and
  // returns to the full frame on the cut where the board ends.
  const stackRanges = overlays.filter((o) => STACK_TYPES.includes(o.type)).map((o) => outputRange(segments, o));
  const stack = Math.max(
    0,
    ...stackRanges.map(({start, end}) => {
      const from = settledStart(start, STACK_MOVE_FRAMES);
      return frame >= end
        ? 0
        : interpolate(frame, [from, from + STACK_MOVE_FRAMES], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          });
    }),
  );

  // Back-to-back full-screen graphics count as one stretch, so the speaker stays
  // in the corner between them instead of jumping back for a frame.
  const stretches: {start: number; end: number}[] = [];
  // Footage that covers the frame (the speaker off screen) joins a stretch it touches,
  // so the circle does not grow back for a moment between a graphic and the footage.
  const covers = overlays.filter((o) => COVER_TYPES.includes(o.type));
  for (const range of [...fullScreen, ...covers].map((o) => outputRange(segments, o)).sort((a, b) => a.start - b.start)) {
    const last = stretches[stretches.length - 1];
    if (last && range.start <= last.end + 1) {
      last.end = Math.max(last.end, range.end);
    } else {
      stretches.push({...range});
    }
  }

  // 0 = speaker fills the frame, 1 = speaker in the corner circle.
  const pip = Math.max(
    0,
    ...stretches.map(({start, end}) => {
      if (end - start < 2 * PIP_MOVE_FRAMES) {
        return 0;
      }
      const from = settledStart(start, PIP_MOVE_FRAMES);
      return interpolate(
        frame,
        [from, from + PIP_MOVE_FRAMES, end - PIP_MOVE_FRAMES, end],
        [0, 1, 1, 0],
        {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic)},
      );
    }),
  );
  const pipScale = interpolate(pip, [0, 1], [1, PIP.radius / PIP.view]);
  const clipRadius = interpolate(pip, [0, 1], [1600, PIP.view]);
  const ctaRanges = (placement: "top" | "caption") =>
    overlays
      .filter((o): o is CtaOverlay => o.type === "cta" && (o.placement ?? "top") === placement)
      .filter((o) => placement === "caption" || (o.y ?? CTA_TOP_Y) <= CTA_TOP_Y)
      .map((o) => outputRange(segments, o));
  // A card in the headroom: no punch-ins under it, and the camera eases back to the
  // full frame so the cap drops clear of it.
  const headroomCards = [
    ...ctaRanges("top"),
    // These start on the creator's cuts: the camera settles after the cut, not before
    // it, so the cut itself still changes the framing.
    ...overlays
      .filter((o) => (o.type === "headcard" && o.headroom) || o.type === "posts")
      .map((o) => outputRange(segments, o))
      .map(({start, end}) => ({start: start + ROOM_FRAMES, end})),
  ];
  const endCards = ctaRanges("caption");
  const camera = cameraAt(
    frame,
    segments,
    emphasisPunches(segments, captions, [...stretches, ...headroomCards, ...stackRanges]),
    face,
    punchToZoom,
    headroomCards,
  );
  const head = {x: camera.face.x, y: camera.face.y - PIP_HEAD_LIFT * pip};
  const whip = whipAt(frame, segments);
  const speakerFilter = [
    whip.blur > 0 ? "url(#whip)" : "",
    grade ? `url(#grade) contrast(${grade.contrast}) saturate(${grade.saturation})` : "",
  ]
    .join(" ")
    .trim();

  const cues = soundCues(segments, overlays, stretches);

  const renderTimed = (overlay: Overlay) => {
    const {start, end} = outputRange(segments, overlay);
    if (end <= start) {
      return null;
    }
    // A board, or a graphic behind the circle, that opens the reel has already arrived at
    // frame 0; its cues keep their times.
    const from = STACK_TYPES.includes(overlay.type)
      ? settledStart(start, STACK_MOVE_FRAMES)
      : FULL_SCREEN_TYPES.includes(overlay.type)
        ? settledStart(start, OPENING_ARRIVAL_FRAMES)
        : start;
    return (
      <Sequence key={`${overlay.type}-${overlay.start}`} from={from} durationInFrames={end - from}>
        {renderOverlay(overlay, overlays, (seconds) => sourceToOutputFrame(segments, seconds) - from, palette)}
      </Sequence>
    );
  };

  let videoCursor = 0;
  let audioCursor = 0;

  return (
    <AbsoluteFill style={{backgroundColor: palette.ground}}>
      {fullScreen.map(renderTimed)}
      <AbsoluteFill style={stack > 0 ? {clipPath: `inset(0 0 ${(1920 - STACK_HEIGHT) * stack}px 0)`} : undefined}>
      <AbsoluteFill
        style={{
          clipPath: `circle(${(clipRadius / CLIP_UNIT) * 100}% at ${head.x}px ${head.y}px)`,
          transformOrigin: `${head.x}px ${head.y}px`,
          transform: `translate(${(PIP.x - head.x) * pip}px, ${(PIP.y - head.y) * pip + (STACK_FACE_Y - head.y) * stack}px) scale(${pipScale})`,
        }}
      >
        <AbsoluteFill
          style={{
            transform: `translateX(${whip.x}px) scale(${whip.scale})`,
            filter: speakerFilter || undefined,
          }}
        >
          <AbsoluteFill
            style={{
              transformOrigin: "0 0",
              transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.scale})`,
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
                  <Sequence durationInFrames={footageFrames(segment)}>
                    <OffthreadVideo
                      muted
                      src={src}
                      trimBefore={toFrames(segment.from)}
                      trimAfter={toFrames(segment.to)}
                      style={segment.gain && segment.gain !== 1 ? {filter: `brightness(${segment.gain})`} : undefined}
                    />
                  </Sequence>
                  {segment.hold ? (
                    <Sequence from={footageFrames(segment)}>
                      <Freeze frame={footageFrames(segment) - 1}>
                        <OffthreadVideo
                          muted
                          src={src}
                          trimBefore={toFrames(segment.from)}
                          trimAfter={toFrames(segment.to)}
                          style={segment.gain && segment.gain !== 1 ? {filter: `brightness(${segment.gain})`} : undefined}
                        />
                      </Freeze>
                    </Sequence>
                  ) : null}
                </Sequence>
              );
            })}
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>
      </AbsoluteFill>
      <svg width={0} height={0} style={{position: "absolute"}}>
        <filter id="grade" colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="table" tableValues={GRADE_TABLES.r} />
            <feFuncG type="table" tableValues={GRADE_TABLES.g} />
            <feFuncB type="table" tableValues={GRADE_TABLES.b} />
          </feComponentTransfer>
        </filter>
        <filter id="whip" x="-10%" width="120%">
          <feGaussianBlur stdDeviation={`${whip.blur} 0`} edgeMode="duplicate" />
        </filter>
      </svg>
      {pip > 0 ? (
        <div
          style={{
            position: "absolute",
            left: PIP.x - PIP.radius,
            top: PIP.y - PIP.radius,
            width: PIP.radius * 2,
            height: PIP.radius * 2,
            borderRadius: "50%",
            border: `4px solid ${palette.accent === GOLD ? GOLD : palette.ink}`,
            boxShadow:
              palette.accent === GOLD
                ? `0 0 0 10px ${NAVY}88, 0 0 40px ${GOLD}33`
                : `0 0 0 10px ${palette.ground}, 0 18px 40px rgba(0,0,0,0.18)`,
            boxSizing: "border-box",
            opacity: interpolate(pip, [0.7, 1], [0, 1], {extrapolateLeft: "clamp"}),
          }}
        />
      ) : null}
      {segments.map((segment, index) => {
        const lead = index === 0 || continues(segments[index - 1], segment) ? 0 : CROSSFADE_HALF_FRAMES;
        const tail =
          index === segments.length - 1 || continues(segment, segments[index + 1]) ? 0 : CROSSFADE_HALF_FRAMES;
        const length = footageFrames(segment) + lead + tail;
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
      {cues.map((cue, index) => (
        <Sequence key={`sfx-${index}`} from={cue.frame} durationInFrames={Math.ceil(SOUND_SECONDS[cue.sound] * FPS) + 1}>
          <Audio src={staticFile(`sfx/${cue.sound}.wav`)} volume={cue.volume} />
        </Sequence>
      ))}
      {layered.map(renderTimed)}
      <Grain vignette={grade?.vignette} color={palette.ground === NAVY ? NAVY : palette.ink} />
      {(hideCaptions ? [] : captions).map((phrase, index) => {
        const start = sourceToOutputFrame(segments, phrase[0].start);
        const lastWord = phrase[phrase.length - 1];
        const hold = sourceToOutputFrame(segments, lastWord.end) + CAPTION_HOLD_FRAMES;
        const next = captions[index + 1];
        const until = next ? Math.min(hold, sourceToOutputFrame(segments, next[0].start)) : hold;
        // The end follow card takes the caption band: captions stop where it starts.
        const end = Math.min(until, ...endCards.filter((card) => card.start > start).map((card) => card.start));
        const underCard = endCards.some((card) => start >= card.start && start < card.end);
        const repeatsGraphic = overlays.some((overlay) => {
          const range = outputRange(segments, overlay);
          return SPOKEN_TEXT_TYPES.includes(overlay.type) && range.start <= start && range.end >= end;
        });
        const graphicIsHero = captionHide.some((hide) => phrase[0].start >= hide.start && phrase[0].start < hide.end);
        if (end <= start || repeatsGraphic || graphicIsHero || underCard) {
          return null;
        }
        // On a page graphic drawn on a light ground, the newer caption looks take the ink.
        const onPage =
          isLight(palette.ground) &&
          overlays.some((overlay) => {
            const range = outputRange(segments, overlay);
            return PAGE_TYPES.includes(overlay.type) && range.start <= start && range.end > start;
          });
        const aboveCard = overlays.some((overlay) => {
          const range = outputRange(segments, overlay);
          return overlay.type === "ayah" && range.start < end && range.end > start;
        });
        return (
          <Sequence key={`caption-${phrase[0].start}`} from={start} durationInFrames={end - start}>
            <Caption
              aboveCard={aboveCard}
              look={captionStyle}
              terms={captionTerms}
              design={captionDesign}
              accent={palette.accent}
              ink={onPage ? palette.ink : undefined}
              // Captions ride with the speaker's window as it moves, never ahead of it.
              bottom={stack > 0 ? CAPTION_BAND_BOTTOM + (1920 - STACK_HEIGHT + 22 - CAPTION_BAND_BOTTOM) * stack : undefined}
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
