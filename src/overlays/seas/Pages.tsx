import {CSSProperties} from "react";
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from "remotion";
import {SAyahOverlay, SBoardOverlay, SCrossOverlay, SeasShot, SFootageOverlay, SHookOverlay} from "../../timeline/seasTypes";
import {Cue} from "../falak/common";
import {STACK_HEIGHT, STACK_MOVE_FRAMES} from "../yawm/look";
import {
  ACCENT,
  ARABIC,
  arrive,
  ATLANTIC,
  ayahTokens,
  draw,
  GROUND,
  INK,
  leave,
  MEDITERRANEAN,
  MUTED,
  RAIL,
  SANS,
  SERIF,
  SIDE,
  starParts,
  TEXT_TOP,
} from "./look";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// The documentary credit: the claim kind first, then the source, small and quiet, in
// sentence case. Parts are split on " · ".
const Credit = ({text, top = TEXT_TOP, width, at = 4}: {text: string; top?: number; width?: number; at?: number}) => {
  const frame = useCurrentFrame();
  const [kind, ...rest] = text.split(" · ");
  return (
    <div
      style={{
        position: "absolute",
        left: SIDE,
        top,
        width: width ?? 1080 - SIDE - RAIL,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 28,
        lineHeight: 1.35,
        color: MUTED,
        opacity: arrive(frame, at, 16),
        textShadow: `0 1px 12px ${GROUND}`,
      }}
    >
      <span style={{color: INK, fontWeight: 700}}>{kind}</span>
      {rest.length ? ` · ${rest.join(" · ")}` : ""}
    </div>
  );
};

// Serif with *starred* parts in italic (Fraunces is italic throughout; the plain parts
// are set in the sans so the transliteration stands out).
const Gloss = ({text, size, color = INK, accent}: {text: string; size: number; color?: string; accent?: boolean}) => (
  <span style={{lineHeight: 1.12}}>
    {starParts(text).map((part, i) =>
      part.text === "\n" ? (
        <br key={i} />
      ) : part.italic ? (
        <span key={i} style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: size, color: accent ? ACCENT : color, letterSpacing: -0.5}}>
          {part.text}
        </span>
      ) : (
        <span key={i} style={{fontFamily: SANS, fontWeight: 600, fontSize: size * 0.62, color}}>
          {part.text}
        </span>
      ),
    )}
  </span>
);

// The shot on screen at this frame: the last one whose time has come.
const shotAt = (shots: SeasShot[], frame: number, cue: Cue) => {
  let index = 0;
  shots.forEach((shot, i) => {
    if (cue(shot.at) <= frame) {
      index = i;
    }
  });
  return {shot: shots[index], from: Math.max(cue(shots[index].at), 0)};
};

const isStill = (src: string) => /\.(jpe?g|png)$/i.test(src);

// One shot, drifting in slowly from its starting zoom about its focus point. Footage is
// graded toward the sea-ink ground: a little less saturation, nothing else.
// `since` is frames since the shot began; a clip restarts from its `trim` at that moment
// (inside a Sequence), so a cut inside one graphic shows the clip from where it is meant to.
const Shot = ({shot, since, style}: {shot: SeasShot; since: number; style?: CSSProperties}) => {
  const frame = useCurrentFrame();
  const focus = shot.focus ?? [0.5, 0.5];
  const scale = (shot.zoom ?? 1.04) + since * 0.0009;
  const media: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`,
    transform: `scale(${scale})`,
    transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`,
    filter: "saturate(0.9) contrast(1.03)",
  };
  return (
    <AbsoluteFill style={{overflow: "hidden", ...style}}>
      {isStill(shot.src) ? (
        <Img src={staticFile(`footage/${shot.src}`)} style={media} />
      ) : (
        <Sequence key={`${shot.src}-${shot.at}`} from={frame - since} layout="none">
          <OffthreadVideo muted src={staticFile(`footage/${shot.src}`)} trimBefore={Math.round((shot.trim ?? 0) * 30)} style={media} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};

// Where a point on the frame (px) lands after a shot's zoom about its focus.
const zoomed = (shot: SeasShot, since: number, [x, y]: [number, number]): [number, number] => {
  const focus = shot.focus ?? [0.5, 0.5];
  const scale = (shot.zoom ?? 1.04) + since * 0.0009;
  const fx = focus[0] * 1080;
  const fy = focus[1] * 1920;
  return [fx + (x - fx) * scale, fy + (y - fy) * scale];
};

// The hook, creator off screen (their wish for this reel): the colour line between two
// waters fills the frame from frame 0 with "Two seas." already set; the shot jumps tight
// on the line and a stroke runs along it; a second water line cuts in with "that never
// mix?"; then the picture shrinks to a plate with the claim as it is shared, and the plate
// cuts to the other water.
export const SHook = ({o, cue}: {o: SHookOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const {shot, from} = shotAt(o.shots, frame, cue);
  const since = frame - from;
  const plateAt = cue(o.plate.at);
  // The plate arrives on a cut (a hard change of the whole picture is a hook beat; a slow
  // shrink did not register in study_reel.py on the first render).
  const swapAt = cue(o.plate.swapAt);
  // On the swap the other water bursts out of the plate to fill the frame (a beat inside
  // the small plate alone did not register on the second render).
  const plate = frame >= plateAt && frame < swapAt ? 1 : 0;
  const textOut = frame >= plateAt ? 0 : 1;
  const lineAt = cue(o.line.at);
  const stroke = draw(frame, lineAt, 14);
  const questionAt = cue(o.question.at);
  const question = arrive(frame, questionAt, 14);
  const onLineClip = shot.src === (o.line.src ?? o.shots[0].src) && frame < questionAt;
  const points = o.line.points.map((p) => zoomed(shot, since, p));
  const path = points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  // The plate: the full frame shrinks to a window 760 x 960 at y 300.
  const plateBox = {left: 170, top: 250, width: 740, height: 900};
  const box = {
    left: interpolate(plate, [0, 1], [0, plateBox.left]),
    top: interpolate(plate, [0, 1], [0, plateBox.top]),
    width: interpolate(plate, [0, 1], [1080, plateBox.width]),
    height: interpolate(plate, [0, 1], [1920, plateBox.height]),
  };
  const plateShot: SeasShot = frame >= swapAt ? {at: o.plate.swapAt, src: o.plate.swapSrc, trim: 3.5, zoom: 1.04, focus: [0.4, 0.5]} : shot;
  const plateSince = frame >= swapAt ? frame - swapAt : since;
  const quote = arrive(frame, plateAt + 2, 12);
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <div
        style={{
          position: "absolute",
          left: box.left,
          top: box.top,
          width: box.width,
          height: box.height,
          overflow: "hidden",
          borderRadius: 4 * plate,
          boxShadow: plate > 0 ? `0 24px 60px rgba(0,0,0,${0.35 * plate})` : undefined,
        }}
      >
        {/* The shot keeps its full-frame size inside the shrinking window, scaled down. */}
        <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: "0 0", transform: `scale(${box.width / 1080}, ${box.height / 1920})`}}>
          <Shot shot={plateShot} since={plateSince} />
          {onLineClip && stroke > 0 ? (
            <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
              <path d={path} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - stroke} opacity={0.95} />
            </svg>
          ) : null}
        </div>
      </div>
      {/* The words sit on a soft shade at the top of the frame. */}
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${GROUND}D9 0%, ${GROUND}80 24%, ${GROUND}00 40%)`, opacity: textOut}} />
      <div style={{position: "absolute", left: SIDE, right: RAIL, top: 250, opacity: textOut}}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 150, lineHeight: 0.98, letterSpacing: -2, color: INK}}>{o.title.text}</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 76, lineHeight: 1.05, color: INK, marginTop: 18, opacity: question, transform: `translateY(${(1 - question) * 18}px)`}}>
          {starParts(o.question.text).map((part, i) => (
            <span key={i} style={part.italic ? {fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 96, color: ACCENT} : undefined}>
              {part.text}
            </span>
          ))}
        </div>
      </div>
      {frame >= swapAt ? <AbsoluteFill style={{background: `linear-gradient(0deg, ${GROUND}00 22%, ${GROUND}D9 34%, ${GROUND}D9 44%, ${GROUND}00 56%)`}} /> : null}
      {frame >= plateAt ? (
        <div style={{position: "absolute", left: SIDE, right: SIDE, top: plateBox.top + plateBox.height + 30, opacity: quote, transform: `translateY(${(1 - quote) * 14}px)`}}>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 64, lineHeight: 1.05, color: INK, textAlign: "center"}}>{o.plate.quote}</div>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: MUTED, textAlign: "center", marginTop: 10}}>{o.plate.credit}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// A label on the picture: a small dot and a word, struck through when it is wrong.
const Label = ({text, x, y, appear, strike}: {text: string; x: number; y: number; appear: number; strike: number}) => (
  <div style={{position: "absolute", left: x, top: y, opacity: appear, transform: `translateY(${(1 - appear) * 10}px)`, display: "flex", alignItems: "center", gap: 16}}>
    <div style={{width: 14, height: 14, borderRadius: 7, background: INK, boxShadow: `0 0 0 5px ${GROUND}66`}} />
    <div style={{position: "relative", whiteSpace: "nowrap", fontFamily: SANS, fontWeight: 700, fontSize: 44, color: INK, textShadow: `0 2px 16px ${GROUND}, 0 0 4px ${GROUND}`}}>
      {text}
      <div style={{position: "absolute", left: -6, top: "54%", height: 5, width: `calc(${strike * 100}% + 12px)`, background: INK, borderRadius: 3}} />
    </div>
  </div>
);

// Footage or a NASA picture filling the frame, with its place labels, a ring on the
// point that matters, a short note and one credit line.
export const SFootage = ({o, cue}: {o: SFootageOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const {shot, from} = shotAt(o.shots, frame, cue);
  const pip = o.type === "sfootagepip";
  const ringAt = o.ring ? cue(o.ring.at) : Infinity;
  const ring = draw(frame, ringAt, 16);
  const noteAt = o.note ? cue(o.note.at) : Infinity;
  const note = arrive(frame, noteAt, 16);
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Shot shot={shot} since={frame - from} />
      {o.credit ? <AbsoluteFill style={{background: `linear-gradient(180deg, ${GROUND}F2 0%, ${GROUND}D9 14%, ${GROUND}00 30%)`}} /> : null}
      {o.credit ? <Credit text={o.credit} width={pip ? 430 : undefined} /> : null}
      {(o.labels ?? []).map((label, i) => (
        <Label key={i} text={label.text} x={label.x} y={label.y} appear={arrive(frame, cue(label.at), 14)} strike={draw(frame, label.strikeAt !== undefined ? cue(label.strikeAt) : Infinity, 10)} />
      ))}
      {o.ring ? (
        <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
          <circle cx={o.ring.x} cy={o.ring.y} r={o.ring.r} fill="none" stroke={INK} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform={`rotate(-90 ${o.ring.x} ${o.ring.y})`} />
        </svg>
      ) : null}
      {o.note ? (
        <>
          <AbsoluteFill style={{background: `linear-gradient(0deg, ${GROUND}00 30%, ${GROUND}B3 50%, ${GROUND}00 66%)`, opacity: note}} />
          <div style={{position: "absolute", left: SIDE, right: RAIL, top: o.note.y ?? 900, opacity: note, transform: `translateY(${(1 - note) * 14}px)`}}>
            <Gloss text={o.note.text} size={92} accent />
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// The Ayah's words as written (pause marks joined to the word before them), each with
// its Corpus number, and how lit it is at this frame.
const ayahGroups = (key: string, from: number, to: number) =>
  ayahTokens(key)
    .filter((t) => t.word === null || (t.word >= from && t.word <= to))
    .filter((t, i, all) => t.word !== null || (i > 0 && i < all.length - 1))
    .reduce<{text: string; word: number | null}[]>((groups, t) => {
      if (t.word === null && groups.length > 0) {
        groups[groups.length - 1].text += t.text;
      } else {
        groups.push({text: t.text, word: t.word});
      }
      return groups;
    }, []);

const AyahLine = ({
  ayah,
  from,
  to,
  size,
  lights,
  cue,
  lineHeight,
}: {
  ayah: string;
  from: number;
  to: number;
  size: number;
  lights: {from: number; to?: number; at: number; accent?: boolean}[];
  cue: Cue;
  lineHeight: number;
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{direction: "rtl", textAlign: "center", fontFamily: ARABIC, fontSize: size, lineHeight, color: INK, textWrap: "balance"}}>
      {ayahGroups(ayah, from, to).map((g, i) => {
        const light = g.word === null ? undefined : lights.find((l) => g.word! >= l.from && g.word! <= (l.to ?? l.from));
        const lit = light ? arrive(frame, cue(light.at), 8) : 0;
        const color = light?.accent ? ACCENT : INK;
        return (
          <span key={i} style={{color: lit > 0.5 ? color : INK, opacity: 0.55 + 0.45 * lit}}>
            {g.text}{" "}
          </span>
        );
      })}
    </div>
  );
};

// The gloss on screen: the last one whose word has been said (and not past `until`).
const glossAt = <T extends {at: number; until?: number}>(glosses: T[], frame: number, cue: Cue) => {
  let current: T | undefined;
  for (const g of glosses) {
    if (cue(g.at) <= frame && (g.until === undefined || cue(g.until) > frame)) {
      current = g;
    }
  }
  return current;
};

// An Ayah on the sea-ink page: the Arabic large in the middle, words lit as they are
// recited or named, and the meaning of the word being explained beneath.
export const SAyah = ({o, cue}: {o: SAyahOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const pip = o.type === "sayahpip";
  const enter = arrive(frame, 0, 18);
  const gloss = glossAt(o.glosses, frame, cue);
  const glossIn = gloss ? arrive(frame, cue(gloss.at), 14) : 0;
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Credit text={o.credit} width={pip ? 430 : undefined} />
      <div style={{position: "absolute", left: SIDE, right: SIDE, top: pip ? 700 : 560, opacity: enter, transform: `translateY(${(1 - enter) * 24 - frame * 0.1}px)`}}>
        <AyahLine ayah={o.ayah} from={o.from} to={o.to} size={o.size} lights={o.lights} cue={cue} lineHeight={2.1} />
        <div key={gloss?.at} style={{marginTop: 34, minHeight: 120, textAlign: "center", opacity: glossIn, transform: `translateY(${(1 - glossIn) * 14}px)`}}>
          {gloss ? <Gloss text={gloss.text} size={86} /> : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// The board under the speaker (stack layout, rises with the speaker's window).
export const SBoard = ({o, cue}: {o: SBoardOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, STACK_MOVE_FRAMES], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const height = 1920 - STACK_HEIGHT;
  return (
    <AbsoluteFill style={{transform: `translateY(${(1 - rise) * height}px)`}}>
      <div style={{position: "absolute", top: STACK_HEIGHT, left: 0, width: 1080, height, overflow: "hidden", backgroundColor: GROUND}}>
        {o.mode === "place" ? <PlaceBoard o={o} cue={cue} /> : <AyahBoard o={o} cue={cue} />}
      </div>
      {/* A hairline where the speaker's window meets the board. */}
      <div style={{position: "absolute", top: STACK_HEIGHT - 2, left: 0, width: 1080, height: 4, background: GROUND}} />
    </AbsoluteFill>
  );
};

const PlaceBoard = ({o, cue}: {o: SBoardOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const first = o.first!;
  const second = o.second!;
  const secondAt = cue(second.at);
  const onSecond = frame >= secondAt;
  const shot: SeasShot = onSecond
    ? {at: second.at, src: second.src, focus: second.focus, zoom: 1.0}
    : {at: 0, src: first.src, focus: first.focus, zoom: 1.0};
  const since = onSecond ? frame - secondAt : frame;
  const ring = draw(frame, onSecond ? secondAt + 8 : Infinity, 16);
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1100, overflow: "hidden"}}>
        <div style={{position: "absolute", left: 0, top: -410, width: 1080, height: 1920}}>
          <Shot shot={shot} since={since} />
        </div>
      </div>
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${GROUND}CC 0%, ${GROUND}00 22%)`}} />
      <div style={{position: "absolute", left: SIDE, top: 40}}>
        {onSecond ? (
          <Label text={second.label} x={0} y={0} appear={arrive(frame, secondAt, 12)} strike={0} />
        ) : (
          <Label text={first.label} x={0} y={0} appear={arrive(frame, 2, 12)} strike={draw(frame, cue(first.strikeAt), 10)} />
        )}
      </div>
      {onSecond && second.ring ? (
        <svg width={1080} height={1100} style={{position: "absolute", left: 0, top: 0}}>
          <circle cx={second.ring.x} cy={second.ring.y} r={120} fill="none" stroke={INK} strokeWidth={5} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform={`rotate(-90 ${second.ring.x} ${second.ring.y})`} />
        </svg>
      ) : null}
      <Credit text={o.credit} top={112} at={6} width={1080 - 2 * SIDE} />
    </AbsoluteFill>
  );
};

const AyahBoard = ({o, cue}: {o: SBoardOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const glosses = o.glosses ?? [];
  return (
    <AbsoluteFill>
      <Credit text={o.credit} top={28} at={4} />
      <div style={{position: "absolute", left: SIDE - 30, right: SIDE - 30, top: 70, opacity: arrive(frame, 2, 16)}}>
        <AyahLine ayah={o.ayah!} from={o.from!} to={o.to!} size={o.size ?? 76} lights={o.lights ?? []} cue={cue} lineHeight={1.6} />
      </div>
      <div style={{position: "absolute", left: SIDE, right: SIDE, top: 222, display: "flex", flexDirection: "column", alignItems: "center", gap: 2}}>
        {glosses.map((g, i) => {
          const t = arrive(frame, cue(g.at), 14);
          return (
            <div key={i} style={{opacity: t, transform: `translateY(${(1 - t) * 12}px)`}}>
              <Gloss text={g.text} size={54} accent={g.accent} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// The Strait of Gibraltar from the side, not to scale: Atlantic on the left, the
// Mediterranean on the right, a sill between them. Dense salty Mediterranean water slides
// out along the floor, lighter Atlantic water slides in on top, and the band between them
// (the pycnocline) blurs as the two layers mix.
const SURFACE = 660;
const FLOOR = "M0,1130 C220,1130 360,1095 470,1000 C520,960 560,955 610,990 C720,1080 860,1130 1080,1130";
// The same floor walked back from right to left, closing the water body.
const WATER = `M0,${SURFACE} L1080,${SURFACE} L1080,1130 C860,1130 720,1080 610,990 C560,955 520,960 470,1000 C360,1095 220,1130 0,1130 Z`;
const INTERFACE = (lift: number) => `M0,${840 - lift} C260,${835 - lift} 420,${855 - lift} 540,${865 - lift} C700,${875 - lift} 860,${880 - lift} 1080,${885 - lift}`;

export const SCross = ({o, cue}: {o: SCrossOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const b = o.beats;
  const pip = o.type === "scrosspip";
  // Drawn once: in the second (circle) part of the scene it is already complete.
  const outline = draw(frame, cue(b.med) - 20, 18);
  const med = draw(frame, cue(b.med), 18);
  const atl = draw(frame, cue(b.atlantic), 18);
  const out = arrive(frame, cue(b.out), 12);
  const inn = arrive(frame, cue(b.in), 12);
  const band = arrive(frame, cue(b.band), 14);
  const density = arrive(frame, cue(b.density), 14);
  const blur = interpolate(frame, [cue(b.blur), cue(b.blur) + 30], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const verdict = arrive(frame, cue(b.verdict), 16);
  const flowOut = (frame - cue(b.out)) * 0.012;
  const flowIn = (frame - cue(b.in)) * 0.012;
  // Eddies along the band where the layers mix, drawn on one after another.
  const eddies = [150, 330, 520, 720, 900].map((x, i) => ({x, y: 852 + i * 7, t: draw(frame, cue(b.blur) + 6 + i * 5, 18)}));
  const labelBlock = (side: "left" | "right", name: string, sub: string, a: number, s: number) => (
    <div style={{position: "absolute", [side]: side === "left" ? SIDE : 92, top: side === "left" ? 684 : 898, textAlign: side, opacity: a}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: INK, lineHeight: 1}}>{name}</div>
      <div style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 38, color: INK, marginTop: 6, opacity: 0.85 * s}}>{sub}</div>
    </div>
  );
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Credit text={o.credit} width={pip ? 430 : undefined} at={Math.min(4, cue(b.med))} />
      <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
        <defs>
          <clipPath id="sx-water">
            <path d={WATER} />
          </clipPath>
          <clipPath id="sx-atl">
            <rect x={0} y={0} width={1080 * atl} height={1920} />
          </clipPath>
          <linearGradient id="sx-mix" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={ATLANTIC} />
            <stop offset="1" stopColor={MEDITERRANEAN} />
          </linearGradient>
          <filter id="sx-soft">
            <feGaussianBlur stdDeviation={2 + 26 * blur} />
          </filter>
        </defs>
        <g clipPath="url(#sx-water)">
          {/* The Mediterranean (lower, dense) fills from the right, the Atlantic (upper,
              light) from the left. */}
          <rect x={1080 - 1080 * med} y={SURFACE} width={1080 * med} height={500} fill={MEDITERRANEAN} />
          <g clipPath="url(#sx-atl)">
            <path d={`${INTERFACE(0)} L1080,${SURFACE} L0,${SURFACE} Z`} fill={ATLANTIC} />
          </g>
          {/* The band between the layers: sharp at first, then feathered as they mix. */}
          <path d={INTERFACE(0)} fill="none" stroke="url(#sx-mix)" strokeWidth={10 + 70 * blur} filter="url(#sx-soft)" opacity={Math.max(med, atl) > 0.99 ? 1 : 0} />
          <path d={INTERFACE(0)} fill="none" stroke={INK} strokeWidth={3} strokeDasharray="14 12" opacity={band * (1 - blur * 0.85)} />
          {eddies.map((e, i) => (
            <path
              key={i}
              d={`M${e.x - 40},${e.y} c10,-30 50,-30 52,-4 c2,20 -26,26 -34,8`}
              fill="none"
              stroke={INK}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.8}
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - e.t}
            />
          ))}
          {/* The two flows: dashes moving the way the water goes. */}
          <path d="M1010,1095 C800,1060 700,975 560,955 C420,985 300,1065 90,1090" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeDasharray="0.04 0.03" pathLength={1} strokeDashoffset={-flowOut} opacity={out * 0.9} />
          <path d="M420,745 C600,750 800,758 1010,765" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeDasharray="0.04 0.03" pathLength={1} strokeDashoffset={-flowIn} opacity={inn * 0.9} />
        </g>
        {/* Arrowheads at the end of each flow. */}
        <path d="M118,1067 L84,1090 L120,1110" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={out} />
        <path d="M982,744 L1016,765 L980,786" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" opacity={inn} />
        {/* The surface and the sea floor. */}
        <line x1={0} y1={SURFACE} x2={1080 * outline} y2={SURFACE} stroke={INK} strokeWidth={3} opacity={0.7} />
        <path d={FLOOR} fill="none" stroke={INK} strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - outline} />
      </svg>
      {labelBlock("left", "Atlantic", "lighter, in on top", atl, inn)}
      {labelBlock("right", "Mediterranean", "saltier, heavier", med, arrive(frame, cue(b.heavy), 14))}
      {/* The band's name, then the verdict in its place, left of the speaker's circle. */}
      <div style={{position: "absolute", left: SIDE, width: pip ? 440 : 820, top: 400, opacity: band * (1 - verdict)}}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 92, lineHeight: 1, color: INK}}>pycnocline</div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 36, color: MUTED, marginTop: 14, opacity: density}}>a layer of density between them</div>
      </div>
      <div style={{position: "absolute", left: SIDE, width: pip ? 450 : 820, top: 390, opacity: verdict, transform: `translateY(${(1 - verdict) * 14}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: MUTED}}>“Never mix” is false.</div>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 92, lineHeight: 1, color: INK, marginTop: 10}}>They mix, slowly.</div>
      </div>
    </AbsoluteFill>
  );
};
