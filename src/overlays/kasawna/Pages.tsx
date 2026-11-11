import {CSSProperties} from "react";
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame} from "remotion";
import {KAyahOverlay, KFootageOverlay, KForm, KPlateOverlay, KScienceOverlay, KTitleOverlay, KWordOverlay} from "../../timeline/kasawnaTypes";
import {Cue} from "../falak/common";
import {CONTACT, Form, FormState} from "./Form";
import {ACCENT, ARABIC, arrive, ayahTokens, ayahWords, draw, GROUND, INK, MUTED, RAIL, SANS, SERIF, SIDE, starParts, TEXT_TOP} from "./look";

// The documentary credit: the claim kind first, then the source, small and quiet, in
// sentence case. Multi-part credits are split on " · ".
export const Credit = ({text, style, width, stacked}: {text: string; style?: CSSProperties; width?: number; stacked?: boolean}) => {
  const frame = useCurrentFrame();
  const [kind, ...rest] = text.split(" · ");
  return (
    <div
      style={{
        position: "absolute",
        left: SIDE,
        top: TEXT_TOP,
        width: width ?? 1080 - SIDE - SIDE,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 28,
        lineHeight: 1.35,
        color: MUTED,
        opacity: arrive(frame, 4, 16),
        ...style,
      }}
    >
      <span style={{color: INK, fontWeight: 700}}>{kind}</span>
      {rest.length ? (stacked ? <div>{rest.join(" · ")}</div> : ` · ${rest.join(" · ")}`) : ""}
    </div>
  );
};

// A line of serif with *starred* parts in italic, and one phrase that can be underlined
// as it is spoken.
const Serif = ({text, size, color = INK, mark, markProgress = 0}: {text: string; size: number; color?: string; mark?: string; markProgress?: number}) => {
  const parts = starParts(text);
  return (
    <span style={{fontFamily: SERIF, fontWeight: 500, fontSize: size, lineHeight: 1.12, color, letterSpacing: -0.4}}>
      {parts.map((part, i) => {
        const at = mark ? part.text.indexOf(mark) : -1;
        const style = {fontStyle: part.italic ? "italic" : "normal"} as const;
        if (at < 0) {
          return (
            <span key={i} style={style}>
              {part.text}
            </span>
          );
        }
        return (
          <span key={i} style={style}>
            {part.text.slice(0, at)}
            <span
              style={{
                backgroundImage: `linear-gradient(transparent 88%, ${ACCENT} 88%, ${ACCENT} 96%, transparent 96%)`,
                backgroundRepeat: "no-repeat",
                backgroundSize: `${markProgress * 100}% 100%`,
              }}
            >
              {part.text.slice(at, at + mark!.length)}
            </span>
            {part.text.slice(at + mark!.length)}
          </span>
        );
      })}
    </span>
  );
};

// An Arabic word or phrase from the verified Ayah, never typed.
export const Arabic = ({ayah, from, to, size, color = ACCENT, style}: {ayah: string; from: number; to?: number; size: number; color?: string; style?: CSSProperties}) => (
  <div style={{direction: "rtl", display: "inline-block", fontFamily: ARABIC, fontSize: size, lineHeight: 1.6, color, ...style}}>
    {ayahWords(ayah, from, to)}
  </div>
);

// The drawn form's state on a page, from the page's beats (frames since the page began).
export const formState = (form: KForm, frame: number, cue: Cue, start: number): FormState => {
  const at = form.at !== undefined ? cue(form.at) : 0;
  const pulse = form.pulseAt !== undefined ? cue(form.pulseAt) : Infinity;
  const enter = arrive(frame, start, 18);
  const change = form.from ? draw(frame, at - 6, 22) : 1;
  const base: FormState = {breathe: frame};
  switch (form.stage) {
    case "drop":
      return {...base, drop: enter, swell: draw(frame, pulse, 14) - draw(frame, pulse + 14, 20)};
    case "cling": {
      // The drop drifts to the wall and settles; the wall comes in as it moves.
      const drift = form.from === "drop" ? draw(frame, at - 26, 26) : 1;
      return {
        ...base,
        wall: form.from === "drop" ? arrive(frame, at - 26, 18) : enter,
        drop: form.from === "drop" ? 1 - draw(frame, at - 4, 6) : 0,
        dropAt: [300 - (300 - (CONTACT.x + 52)) * drift, 320 - 20 * drift],
        cling: form.from === "drop" ? draw(frame, at - 4, 8) : enter,
        ring: {x: CONTACT.x, y: CONTACT.y, r: 70, strength: arrive(frame, pulse, 12)},
      };
    }
    case "lump":
      return {
        ...base,
        wall: form.from === "cling" ? 1 - change : 0,
        cling: form.from === "cling" ? 1 - draw(frame, at, 10) : 0,
        lump: form.from === "cling" ? draw(frame, at - 2, 10) : enter,
        lumpScale: form.from === "cling" ? 0.42 + 0.58 * change : 1,
      };
    case "bones":
      return {...base, lump: form.from === "lump" ? 1 - draw(frame, at - 6, 14) : 0, bones: draw(frame, at, 34)};
    case "clothed":
      return {...base, bones: 1, cloth: form.pulseAt !== undefined ? draw(frame, pulse, 30) : 1};
  }
};

const PlacedForm = ({form, cue}: {form: KForm; cue: Cue}) => {
  const frame = useCurrentFrame();
  const size = form.size ?? 680;
  const x = form.x ?? 540;
  const y = form.y ?? 900;
  return (
    <div style={{position: "absolute", left: x - size / 2, top: y - size / 2, opacity: form.opacity ?? 1}}>
      <Form state={formState(form, frame, cue, 0)} size={size} />
    </div>
  );
};

// A Quranic word with its meaning and the drawn form (beats 3, 4, 5, 8, 9, 16a).
export const KWord = ({o, cue}: {o: KWordOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const wordAt = o.word ? cue(o.word.at) : Infinity;
  const meaningAt = o.meaning ? cue(o.meaning.at) : Infinity;
  const subAt = o.sub ? cue(o.sub.at) : Infinity;
  const markAt = o.mark ? cue(o.mark.at) : Infinity;
  const word = arrive(frame, wordAt, 18);
  const meaning = arrive(frame, meaningAt, 16);
  const sub = arrive(frame, subAt, 16);
  const pan = o.pan ? draw(frame, cue(o.pan.at), 30) : 0;
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Credit text={o.credit} />
      <div style={{position: "absolute", left: SIDE, right: RAIL, top: 300}}>
        {o.word ? (
          <div style={{height: 250, opacity: word, transform: `translateY(${(1 - word) * 22}px)`}}>
            <Arabic ayah={o.word.ayah} from={o.word.from} to={o.word.to} size={o.word.to ? 140 : 170} />
          </div>
        ) : null}
        {o.meaning ? (
          <div style={{marginTop: o.word ? 0 : 250, opacity: meaning, transform: `translateY(${(1 - meaning) * 18}px)`}}>
            <Serif text={o.meaning.text} size={84} mark={o.mark?.text} markProgress={draw(frame, markAt, 14)} />
          </div>
        ) : null}
        {o.sub ? (
          <div style={{marginTop: 14, opacity: sub, fontFamily: SANS, fontWeight: 600, fontSize: 32, color: MUTED}}>{o.sub.text}</div>
        ) : null}
      </div>
      {o.form ? (
        <div style={{position: "absolute", inset: 0, transform: `translateY(${pan * 26}px)`}}>
          <PlacedForm form={o.form} cue={cue} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// A real drawing set as a plate (beat 6): the count lands, a ring marks the point.
export const KPlate = ({o, cue}: {o: KPlateOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const enter = arrive(frame, 0, 18);
  const countAt = cue(o.count.at);
  const ringAt = cue(o.ring.at);
  const ring = arrive(frame, ringAt, 12);
  const width = 520;
  const height = Math.round((width * 672) / 636);
  const left = 1080 - RAIL - width;
  const top = 430;
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Credit text={o.credit} />
      <div style={{position: "absolute", left: SIDE, top: 470, opacity: arrive(frame, countAt, 14), transform: `translateY(${(1 - arrive(frame, countAt, 14)) * 18}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, color: MUTED}}>Day</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 112, lineHeight: 1, color: INK, letterSpacing: -2, fontVariantNumeric: "tabular-nums"}}>6–7</div>
      </div>
      <div
        style={{
          position: "absolute",
          left,
          top,
          width,
          height,
          overflow: "hidden",
          opacity: enter,
          transform: `translateY(${(1 - enter) * 30}px)`,
          boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
        }}
      >
        <Img src={staticFile(`footage/${o.src}`)} style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + frame * 0.0006})`, transformOrigin: `${o.ring.x * 100}% ${o.ring.y * 100}%`}} />
        <svg width={width} height={height} style={{position: "absolute", left: 0, top: 0}}>
          <circle cx={o.ring.x * width} cy={o.ring.y * height} r={78 * (1.2 - 0.2 * ring)} fill="none" stroke={INK} strokeWidth={5} opacity={ring} />
        </svg>
      </div>
      {o.note ? (
        <div style={{position: "absolute", left: SIDE, right: RAIL, top: top + height + 34, opacity: arrive(frame, cue(o.note.at), 14), textWrap: "balance"}}>
          <Serif text={o.note.text} size={44} color={MUTED} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// An Ayah on the page (beats 2, 19). Words light in the accent as they are named.
export const KAyah = ({o, cue}: {o: KAyahOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const tokens = ayahTokens(o.ayah).filter((t) => t.word === null || (t.word >= o.from && t.word <= o.to));
  const pip = o.type === "kayahpip";
  const enter = arrive(frame, 0, 18);
  const lit = (word: number | null) => {
    if (word === null) {
      return 0;
    }
    const light = o.lights.find((l) => word >= l.from && word <= (l.to ?? l.from));
    return light ? arrive(frame, cue(light.at), 8) : 0;
  };
  const bracketAt = o.bracket ? cue(o.bracket.at) : Infinity;
  const bracket = draw(frame, bracketAt, 16);
  const translationAt = o.translation ? cue(o.translation.at) : Infinity;
  const translation = arrive(frame, translationAt, 18);
  const stepsAt = o.stepsAt !== undefined ? cue(o.stepsAt) : Infinity;
  // A pause mark only shows inside a run of words, never at an edge. It is a combining
  // sign, set on the end of the word before it: Amiri Quran places it there correctly,
  // while after a space it floats a line too high (whole font) or comes out as a box (the
  // Google subsets on the Linux render). Only the space between a word and its sign is
  // left out; every letter and mark stays as fetched, in order.
  const shown = tokens
    .filter((t, i) => t.word !== null || (i > 0 && i < tokens.length - 1))
    .reduce<{text: string; word: number | null}[]>((groups, t) => {
      if (t.word === null && groups.length > 0) {
        groups[groups.length - 1].text += t.text;
      } else {
        groups.push({text: t.text, word: t.word});
      }
      return groups;
    }, []);
  const top = pip ? 700 : 360;
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Credit text={o.credit} width={pip ? 430 : undefined} stacked={pip} />
      {o.bracket ? (
        <div style={{position: "absolute", left: SIDE, top: 545, opacity: arrive(frame, bracketAt, 14)}}>
          <Serif text={o.bracket.text} size={70} />
        </div>
      ) : null}
      <div style={{position: "absolute", left: SIDE, right: SIDE, top, opacity: enter, transform: `translateY(${(1 - enter) * 24}px)`}}>
        <svg width={1080 - 2 * SIDE} height={4} style={{display: "block", marginBottom: 18, opacity: bracket}}>
          <line x1={(1 - bracket) * 448} y1={2} x2={448 + bracket * 448} y2={2} stroke={ACCENT} strokeWidth={3} />
        </svg>
        <div style={{direction: "rtl", textAlign: "center", fontFamily: ARABIC, fontSize: o.size, lineHeight: pip ? 2.1 : 1.85, color: INK, textWrap: "balance"}}>
          {shown.map((t, i) => (
            <span key={i} style={{color: lit(t.word) > 0 ? ACCENT : INK, opacity: 0.78 + 0.22 * lit(t.word)}}>
              {t.text}{" "}
            </span>
          ))}
        </div>
        <svg width={1080 - 2 * SIDE} height={4} style={{display: "block", marginTop: 10, opacity: bracket}}>
          <line x1={(1 - bracket) * 448} y1={2} x2={448 + bracket * 448} y2={2} stroke={ACCENT} strokeWidth={3} />
        </svg>
        {o.translation ? (
          <div style={{marginTop: 40, textAlign: "center", textWrap: "balance", opacity: translation, transform: `translateY(${(1 - translation) * 16}px)`}}>
            <Serif text={o.translation.text} size={62} />
            <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: MUTED, marginTop: 14}}>{o.translation.source}</div>
          </div>
        ) : null}
      </div>
      {o.stepsAt !== undefined ? (
        pip ? (
          // Beside the circle: each step arrives as its word lights ("tumhari poori kahani").
          <Steps times={o.lights.slice(0, 5).map((l) => cue(l.at))} left={SIDE - 30} width={480} top={350} size={130} />
        ) : (
          <Steps times={[0, 4, 8, 12, 16].map((d) => stepsAt + d)} left={SIDE - 10} width={1080 - 2 * SIDE + 20} top={960} size={168} />
        )
      ) : null}
    </AbsoluteFill>
  );
};

// The reel's drawn steps in one row, small: drop, clinging, lump, bones, clothed.
const STEP_STATES: FormState[] = [{drop: 1}, {wall: 1, bareWall: true, cling: 1}, {lump: 1}, {bones: 1}, {bones: 1, cloth: 1}];
const Steps = ({times, left, width, top, size}: {times: number[]; left: number; width: number; top: number; size: number}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: "absolute", left, width, top, display: "flex"}}>
      {STEP_STATES.map((state, i) => {
        const t = arrive(frame, times[i], 12);
        // Each drawing fills only the middle of its box, so the boxes may overlap: every
        // step gets an equal slot of the row and its box is centred on it.
        return (
          <div key={i} style={{width: width / STEP_STATES.length, height: size, display: "flex", justifyContent: "center", opacity: t, transform: `translateY(${(1 - t) * 14}px)`}}>
            <Form state={state} size={size} style={{flexShrink: 0}} />
          </div>
        );
      })}
    </div>
  );
};

// Science pages (beat 15): the limb section, or a pull phrase over the faint form.
export const KScience = ({o, cue}: {o: KScienceOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const lines = o.lines ?? [];
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Credit text={o.credit} />
      {o.mode === "limb" ? <Limb frame={frame} pulse={o.pulseAt !== undefined ? cue(o.pulseAt) : Infinity} /> : null}
      {o.mode === "phrase" ? (
        <div style={{position: "absolute", left: 540 - 300, top: 660, opacity: 0.4 * arrive(frame, 0, 20)}}>
          <Form state={{bones: 1, cloth: 1, breathe: frame}} size={600} />
        </div>
      ) : null}
      <div style={{position: "absolute", left: SIDE, right: RAIL, top: o.mode === "limb" ? 330 : 420}}>
        {lines.map((line, i) => {
          const t = arrive(frame, cue(line.at), 16);
          return (
            <div key={i} style={{opacity: t, transform: `translateY(${(1 - t) * 18}px)`, marginTop: i ? 18 : 0, textWrap: "balance"}}>
              <Serif text={line.text} size={line.big ? 112 : 70} color={line.big ? INK : MUTED} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// An arm seen from the side, drawn: the cartilage that becomes bone (ivory) and the
// muscle beside it (rose) grow out along the limb together; on "saath-saath" both
// pulse at once. An illustration.
const Limb = ({frame, pulse}: {frame: number; pulse: number}) => {
  const grow = draw(frame, 4, 40);
  const beat = 1 + 0.05 * (draw(frame, pulse, 6) - draw(frame, pulse + 6, 14));
  const reach = 190 + 760 * grow;
  const label = (text: string, x: number, y: number, lx: number, ly: number, at: number) => (
    <g opacity={arrive(frame, at, 14)}>
      <line x1={x} y1={y} x2={lx} y2={ly} stroke={MUTED} strokeWidth={2} />
      <circle cx={x} cy={y} r={5} fill={MUTED} />
      <text x={lx} y={ly + (ly < y ? -14 : 40)} fill={INK} fontFamily={SANS} fontWeight={700} fontSize={32} textAnchor="middle">
        {text}
      </text>
    </g>
  );
  return (
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
      <defs>
        <clipPath id="klimbgrow">
          <rect x={0} y={600} width={reach} height={600} />
        </clipPath>
      </defs>
      <g transform={`translate(540 915) scale(${beat}) translate(-540 -915)`}>
        <path
          d="M 150 830 C 400 806, 640 828, 780 846 C 860 826, 940 858, 940 915 C 940 976, 860 1004, 780 986 C 640 1002, 400 1024, 150 1000"
          fill="none"
          stroke={INK}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.55 * arrive(frame, 0, 18)}
        />
        <g clipPath="url(#klimbgrow)">
          {/* Muscle above and below. */}
          <path d="M 200 852 C 360 832, 560 846, 760 864 C 600 884, 380 886, 200 880 Z" fill={ACCENT} fillOpacity={0.6} />
          <path d="M 200 952 C 380 948, 600 950, 760 968 C 560 988, 360 994, 200 982 Z" fill={ACCENT} fillOpacity={0.6} />
          {/* Cartilage: upper arm, forearm, the rays of the hand. */}
          <rect x={205} y={898} width={320} height={34} rx={17} fill={INK} />
          <rect x={548} y={888} width={236} height={20} rx={10} fill={INK} />
          <rect x={548} y={922} width={236} height={20} rx={10} fill={INK} />
          {[884, 902, 920, 938].map((y, i) => (
            <rect key={i} x={808} y={y} width={100} height={12} rx={6} fill={INK} opacity={0.85} />
          ))}
        </g>
      </g>
      {label("Cartilage (becomes bone)", 380, 915, 470, 1110, 30)}
      {label("Muscle", 470, 862, 560, 730, 34)}
    </svg>
  );
};

// Real footage. `kfootage` covers the frame; `kfootagepip` sits behind the circle.
export const KFootage = ({o}: {o: KFootageOverlay}) => {
  const frame = useCurrentFrame();
  const focus = o.focus ?? [0.5, 0.5];
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <OffthreadVideo
        muted
        src={staticFile(`footage/${o.src}`)}
        trimBefore={Math.round((o.trim ?? 0) * 30)}
        playbackRate={o.rate ?? 1}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`,
          transform: `scale(${(o.zoom ?? 1.04) + frame * 0.0008})`,
          transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`,
          // Graded to sit with the warm dark page.
          filter: "saturate(0.86) sepia(0.08) contrast(1.02)",
        }}
      />
      {o.credit ? (
        <>
          <AbsoluteFill style={{background: `linear-gradient(180deg, ${GROUND}CC 0%, ${GROUND}00 22%)`}} />
          <Credit text={o.credit} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// A title on the wall above the creator's head (the pale wall takes the page's dark
// ink), arriving on its spoken word.
export const KTitle = ({o}: {o: KTitleOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const t = arrive(frame, 0, 10);
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: SIDE, right: RAIL, top: 172, opacity: t, transform: `translateY(${(1 - t) * 14}px)`}}>
        <Serif text={o.text} size={72} color={GROUND} />
      </div>
    </AbsoluteFill>
  );
};
