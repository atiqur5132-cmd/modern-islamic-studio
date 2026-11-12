import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {Brain} from "./Brain";
import {arrive, CLAMP, LOOK, MARGIN, SANS, SERIF} from "./look";
import {Big, Credit, Drift, Ground, Label, Mark} from "./parts";
import {Reel} from "./Phone";
import {Cues} from "./types";

type P = {cues: Cues};

const BBC = "BBC Panorama, 3 July 2018";

// A pull quote set on the ground: hung mark, the phrase that matters marked as spoken,
// one credit line with the tag and the source (STYLE.md).
const Quote = ({at, markAt, who, text, mark, size = 96, top = 300, outAt}: {at: number; markAt: number; who: string; text: string; mark?: string; size?: number; top?: number; outAt?: number}) => {
  const frame = useCurrentFrame();
  const a = arrive(frame, at, 18);
  const out = outAt === undefined ? 1 : interpolate(frame, [outAt, outAt + 9], [1, 0], CLAMP);
  const i = mark ? text.indexOf(mark) : -1;
  const parts = i < 0 ? [text, "", ""] : [text.slice(0, i), mark!, text.slice(i + mark!.length)];
  return (
    <div style={{position: "absolute", left: MARGIN + 40, top, width: 1500, opacity: a * out, transform: `translateY(${(1 - a) * 22 - Math.max(0, frame - at) * 0.04}px)`}}>
      <div style={{position: "relative", fontFamily: SERIF, fontWeight: 500, fontSize: size, lineHeight: 1.1, color: LOOK.ivory, textWrap: "balance"}}>
        <span style={{position: "absolute", left: "-0.45em", top: 0, color: LOOK.amber}}>“</span>
        {parts[0]}
        <span style={{fontStyle: "italic"}}>
          <Mark at={markAt}>{parts[1]}</Mark>
        </span>
        {parts[2]}”
      </div>
      <div style={{marginTop: 30, fontFamily: SANS, fontWeight: 700, fontSize: 36, color: LOOK.ivory}}>— {who}</div>
      <div style={{marginTop: 6, fontFamily: SANS, fontWeight: 600, fontSize: 28, color: LOOK.muted}}>Their own words · {BBC}</div>
    </div>
  );
};

// Lines 64–77. The people who built it, in their own words; then the company's answer.
export const InsidersScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l66 = cues.line(66);
  const l68 = cues.line(68);
  const l69 = cues.line(69);
  const l70 = cues.line(70);
  const l71 = cues.line(71);
  const l72 = cues.line(72);
  const l73 = cues.line(73);
  const l74 = cues.line(74);
  const l75 = cues.line(75);
  const l77 = cues.line(77);
  const openOut = interpolate(frame, [l66 - 4, l66 + 6], [1, 0], CLAMP);
  const pageOut = interpolate(frame, [l69 - 4, l69 + 6], [1, 0], CLAMP);
  // the endless page
  const scroll = Math.max(0, frame - l66) * 9;
  return (
    <Ground>
      <div style={{opacity: openOut}}>
        <Big at={0} top={300} size={110}>
          Built this way on purpose?
        </Big>
        <Label at={cues.line(65)} left={MARGIN + 6} top={470} size={50} color={LOOK.ivory} weight={600}>
          Hear it from the people who built it.
        </Label>
      </div>
      <div style={{opacity: arrive(frame, l66, 18) * pageOut}}>
        <div style={{position: "absolute", left: 1080, top: 0, width: 640, height: 860, overflow: "hidden", WebkitMaskImage: "linear-gradient(black 75%, transparent)", borderLeft: `3px solid ${LOOK.line}`, borderRight: `3px solid ${LOOK.line}`}}>
          {Array.from({length: 40}, (_, i) => {
            const y = i * 300 - (scroll % 300) - Math.floor(scroll / 300) * 0 ;
            const n = i + Math.floor(scroll / 300);
            return (
              <div key={i} style={{position: "absolute", left: 40, right: 40, top: y, height: 260, borderRadius: 18, overflow: "hidden"}}>
                <Reel n={n * 3} />
              </div>
            );
          })}
        </div>
        <Label at={l66 + 4} left={MARGIN} top={260} size={40}>
          2006 · Aza Raskin, engineer
        </Label>
        <Big at={cues.word(66, 13)} top={340} size={120} width={880}>
          infinite scroll
        </Big>
        <Label at={cues.line(67)} left={MARGIN + 6} top={500} size={48} color={LOOK.ivory} weight={600}>
          The page never ends.
        </Label>
        <div style={{position: "absolute", left: MARGIN, top: 630, opacity: arrive(frame, l68, 18), width: 860}}>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: LOOK.amber}}>“guilty”</div>
          <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, color: LOOK.ivory, marginTop: 8}}>
            he told the BBC in 2018 he now feels guilty about it
          </div>
        </div>
      </div>
      <Quote at={l69} markAt={cues.word(69, 12)} who="Aza Raskin" text="…you just keep scrolling." mark="keep scrolling" outAt={l70 - 6} top={340} size={120} />
      <Quote at={l70} markAt={cues.word(70, 11)} who="Aza Raskin, on how apps are designed" text="behavioural cocaine" mark="behavioural cocaine" outAt={l71 - 6} top={340} size={150} />
      <Quote at={l71 + 8} markAt={cues.word(71, 14)} who="Sandy Parakilas, former Facebook employee" text="Social media is very similar to a slot machine." mark="a slot machine" outAt={l72 - 6} top={300} size={104} />
      <Quote at={l72 + 10} markAt={l73} who="Leah Pearlman, co-creator of the Like button" text="I’m feeling lonely, ‘Let me check my phone.’" mark="Let me check my phone." outAt={l74 - 6} top={300} size={104} />
      <div style={{opacity: interpolate(frame, [l74 - 6, l74, l77 - 6, l77], [0, 1, 1, 0], CLAMP)}}>
        <Label at={l74} left={MARGIN} top={200} size={44} color={LOOK.ivory} weight={600}>
          The other side
        </Label>
        <div style={{position: "absolute", left: MARGIN + 40, top: 300, width: 1500, opacity: arrive(frame, l75, 18)}}>
          <div style={{position: "relative", fontFamily: SERIF, fontWeight: 500, fontSize: 84, lineHeight: 1.12, color: LOOK.ivory}}>
            <span style={{position: "absolute", left: "-0.45em", top: 0, color: LOOK.amber}}>“</span>
            …at no stage does wanting something to be <span style={{fontStyle: "italic"}}><Mark at={cues.word(76, 1)}>addictive</Mark></span> factor into that process.”
          </div>
          <div style={{marginTop: 30, fontFamily: SANS, fontWeight: 700, fontSize: 36, color: LOOK.ivory}}>— Facebook, to the BBC</div>
          <div style={{marginTop: 6, fontFamily: SANS, fontWeight: 600, fontSize: 28, color: LOOK.muted}}>Company statement · {BBC}</div>
        </div>
      </div>
      {/* the two sides, side by side */}
      <div style={{opacity: arrive(frame, l77, 18)}}>
        <div style={{position: "absolute", left: MARGIN, top: 320, width: 760}}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: LOOK.muted}}>people who were inside</div>
          <div style={{fontFamily: SERIF, fontSize: 84, color: LOOK.ivory, marginTop: 10}}>built to hook us</div>
        </div>
        <div style={{position: "absolute", left: 1000, top: 320, width: 760, opacity: arrive(frame, cues.word(77, 9), 18)}}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: LOOK.muted}}>the company</div>
          <div style={{fontFamily: SERIF, fontSize: 84, color: LOOK.ivory, marginTop: 10}}>never the aim</div>
        </div>
        <div style={{position: "absolute", left: 960, top: 300, width: 3, height: 260, background: LOOK.line}} />
        <Credit at={l77 + 10} tag="Summary of both sides" source={BBC} bottom={300} />
      </div>
    </Ground>
  );
};

// Our own photo grid with like counts (no real app).
const Grid = ({frame, liked, tapAt}: {frame: number; liked: number; tapAt: number}) => {
  const counts = ["1,240", "18", "2,906", "31"];
  return (
    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, width: 620}}>
      {counts.map((c, i) => {
        const high = i === 0 || i === 2;
        const tapped = i === 2 && frame >= tapAt;
        return (
          <div key={i} style={{position: "relative", height: 330, borderRadius: 18, overflow: "hidden", opacity: arrive(frame, i * 5, 14)}}>
            <Reel n={i * 5 + 2} />
            <div style={{position: "absolute", left: 18, bottom: 16, fontFamily: SANS, fontWeight: 800, fontSize: 38, color: high ? LOOK.amber : "#fff", opacity: arrive(frame, liked + i * 3, 12)}}>
              ♥ {c}
            </div>
            {tapped && <div style={{position: "absolute", inset: 0, border: `5px solid ${LOOK.amber}`, borderRadius: 18}} />}
          </div>
        );
      })}
    </div>
  );
};

// Lines 78–86. The likes study.
export const LikesScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l79 = cues.line(79);
  const l80 = cues.line(80);
  const l81 = cues.line(81);
  const l82 = cues.line(82);
  const l83 = cues.line(83);
  const l84 = cues.line(84);
  const l85 = cues.line(85);
  const l86 = cues.line(86);
  const scanOut = interpolate(frame, [l80 - 4, l80 + 6], [1, 0], CLAMP);
  const grid = arrive(frame, l80, 18);
  const gridOut = interpolate(frame, [l84 - 4, l84 + 6], [1, 0], CLAMP);
  return (
    <Ground>
      <div style={{opacity: scanOut}}>
        <Big at={0} top={220} size={100} width={1000}>
          An experiment on teenagers
        </Big>
        {/* the scanner, as a ring */}
        <svg style={{position: "absolute", left: 1160, top: 230, opacity: arrive(frame, l79, 18)}} width={600} height={600}>
          <circle cx={300} cy={300} r={250} fill="none" stroke={LOOK.ivory} strokeWidth={36} />
          <circle cx={300} cy={300} r={150} fill={LOOK.ground2} stroke={LOOK.line} strokeWidth={4} />
          <rect x={0} y={420} width={600} height={30} rx={10} fill={LOOK.line} />
        </svg>
        <Label at={l79} left={MARGIN} top={500} size={60} color={LOOK.ivory} weight={800}>
          32 teenagers, 13–18
        </Label>
        <Label at={l79 + 10} left={MARGIN} top={580} size={40}>
          in an MRI scanner · a US university, 2016
        </Label>
      </div>
      <AbsoluteFill style={{left: 1140, top: 180, opacity: grid * gridOut}}>
        <Grid frame={frame - l80} liked={l81 - l80} tapAt={l83 - l80 + 20} />
      </AbsoluteFill>
      <div style={{opacity: grid * gridOut}}>
        <Label at={l80} left={MARGIN} top={180} size={40}>
          an app like Instagram, made for the study
        </Label>
        <AbsoluteFill style={{left: 90, top: 300, opacity: arrive(frame, l82, 18)}}>
          <Brain size={760} accumbens={arrive(frame, cues.word(82, 10), 20)} />
        </AbsoluteFill>
        <Label at={cues.word(82, 10)} left={MARGIN + 40} top={260} size={44} color={LOOK.amber}>
          nucleus accumbens · reward
        </Label>
        <Label at={l83 + 4} left={1140} top={110} size={32} color={LOOK.ivory} weight={600} width={680}>
          and they liked the photos that already had many likes
        </Label>
      </div>
      <Big at={l84} top={300} size={110} width={1500}>
        The likes were <span style={{fontStyle: "italic", color: LOOK.amber}}>fake.</span>
      </Big>
      <Label at={cues.word(85, 6)} left={MARGIN + 6} top={450} size={50} color={LOOK.ivory} weight={600}>
        The researchers assigned them.
      </Label>
      <Label at={l86} left={MARGIN + 6} top={560} size={50} color={LOOK.muted} weight={600}>
        A number changed the brain’s activity, and the choice.
      </Label>
      <Credit at={l80 + 20} tag="One study" source="Sherman et al., Psychological Science, 2016 · 32 teenagers, likes assigned by researchers" />
    </Ground>
  );
};

// Lines 87–97. What the large data says: small on average, not small for everyone.
export const DataScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l88 = cues.line(88);
  const l90 = cues.line(90);
  const l91 = cues.line(91);
  const l92 = cues.line(92);
  const l93 = cues.line(93);
  const l94 = cues.line(94);
  const l95 = cues.line(95);
  const l96 = cues.line(96);
  const l97 = cues.line(97);
  const qOut = interpolate(frame, [l90 - 4, l90 + 6], [1, 0], CLAMP);
  const dotsOut = interpolate(frame, [l95 - 4, l95 + 8], [1, 0], CLAMP);
  const cols = 38;
  const rows = 22;
  const fill = interpolate(frame, [l91, l91 + 40], [0, 1], CLAMP);
  return (
    <Ground>
      <div style={{opacity: qOut}}>
        <Label at={0} left={MARGIN} top={250} size={40}>
          an important question
        </Label>
        <Big at={l88} top={300} size={110} width={1600}>
          Is the phone ruining a whole generation?
        </Big>
        <Label at={cues.word(89, 8)} left={MARGIN + 6} top={560} size={56} color={LOOK.amber} weight={800}>
          What does the data say?
        </Label>
      </div>
      <div style={{opacity: arrive(frame, l90, 18) * dotsOut}}>
        <Label at={l90} left={MARGIN} top={120} size={40}>
          2019 · 3 large surveys
        </Label>
        <svg style={{position: "absolute", left: MARGIN, top: 200}} width={1000} height={560}>
          {Array.from({length: cols * rows}, (_, i) => {
            const c = i % cols;
            const r = Math.floor(i / cols);
            const shown = i / (cols * rows) < fill;
            const hot = frame >= l93 && c === cols - 1 && r < 3; // 3 of 836 dots ≈ 0.4%
            return <circle key={i} cx={c * 26 + 10} cy={r * 25 + 10} r={6} fill={hot ? LOOK.amber : LOOK.ivory} opacity={shown ? (frame >= l93 && !hot ? 0.28 : 0.8) : 0} />;
          })}
        </svg>
        <Label at={l91} left={MARGIN} top={770} size={56} color={LOOK.ivory} weight={800}>
          355,358 teenagers
        </Label>
        <Label at={l92} left={MARGIN} top={840} size={42} color={LOOK.ivory} weight={600}>
          the link: negative, but very <span style={{color: LOOK.amber}}>small</span>
        </Label>
      </div>
      <div style={{position: "absolute", left: 1150, top: 380, opacity: arrive(frame, l93, 18) * dotsOut, fontFamily: SERIF, fontSize: 260, color: LOOK.amber, lineHeight: 1}}>0.4%</div>
      <div style={{opacity: dotsOut}}>
        <Label at={l93 + 10} left={1160} top={660} size={36} color={LOOK.ivory} width={620}>
          at most, of the difference in well-being
        </Label>
      </div>
      <Big at={l94} top={780} size={80} width={900} outAt={l95 - 6}>
        Not poison.
      </Big>
      {/* the average hides people */}
      <div style={{opacity: arrive(frame, l95, 18)}}>
        <Big at={l95} top={170} size={90} width={1600}>
          But no one is the average.
        </Big>
        {[{at: l96, label: "someone", eaten: 0}, {at: l97, label: "someone else", eaten: 1}].map((p, i) => {
          const a = arrive(frame, p.at, 18);
          const blocks = [
            {w: 360, t: "sleep"},
            {w: 300, t: "study"},
            {w: 240, t: "family"},
          ];
          const eat = interpolate(frame, [cues.word(97, 6), cues.word(97, 6) + 50], [0, 1], CLAMP) * p.eaten;
          return (
            <div key={i} style={{position: "absolute", left: MARGIN, top: 400 + i * 220, opacity: a}}>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: LOOK.muted, marginBottom: 14}}>{p.label}</div>
              <div style={{display: "flex", gap: 12, alignItems: "center"}}>
                <div style={{width: 220, height: 84, borderRadius: 10, background: LOOK.amber, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: LOOK.ground}}>
                  2 hours
                </div>
                {blocks.map((b) => (
                  <div key={b.t} style={{width: b.w * (1 - eat * 0.85), height: 84, borderRadius: 10, background: LOOK.ground2, border: `2px solid ${LOOK.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 700, fontSize: 32, color: LOOK.ivory, overflow: "hidden", whiteSpace: "nowrap", opacity: 1 - eat * 0.5}}>
                    {b.t}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <Credit at={l91 + 10} tag="Established science" source="Orben & Przybylski, Nature Human Behaviour, 2019 · 355,358 adolescents" />
    </Ground>
  );
};

// Lines 98–105. The detox trend, and what its originator meant.
export const DetoxScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l99 = cues.line(99);
  const l100 = cues.line(100);
  const l101 = cues.line(101);
  const l102 = cues.line(102);
  const l103 = cues.line(103);
  const l104 = cues.line(104);
  const strike = interpolate(frame, [l100 + 30, l100 + 44], [0, 1], CLAMP);
  const firstOut = interpolate(frame, [l102 - 4, l102 + 6], [1, 0], CLAMP);
  return (
    <Ground>
      <div style={{opacity: firstOut}}>
        <Label at={0} left={MARGIN} top={140} size={40}>
          a trend
        </Label>
        <div style={{position: "absolute", left: MARGIN, top: 220, opacity: arrive(frame, cues.word(98, 7), 18)}}>
          <div style={{position: "relative", display: "inline-block", fontFamily: SERIF, fontSize: 150, color: LOOK.ivory}}>
            “dopamine detox”
            <div style={{position: "absolute", left: 0, top: "56%", height: 6, width: `${strike * 100}%`, background: LOOK.amber}} />
          </div>
        </div>
        <Label at={l99} left={MARGIN + 6} top={450} size={48} color={LOOK.muted} weight={600}>
          one day without the phone, and the brain resets
        </Label>
        <div style={{position: "absolute", left: MARGIN + 40, top: 560, width: 1500, opacity: arrive(frame, l100, 18)}}>
          <div style={{position: "relative", fontFamily: SERIF, fontSize: 84, color: LOOK.ivory, lineHeight: 1.1}}>
            <span style={{position: "absolute", left: "-0.45em", color: LOOK.amber}}>“</span>
            …doesn’t actually <span style={{fontStyle: "italic"}}><Mark at={l100 + 30}>lower your dopamine</Mark></span> levels.”
          </div>
          <div style={{marginTop: 24, fontFamily: SANS, fontWeight: 700, fontSize: 34, color: LOOK.ivory}}>— Peter Grinspoon, MD</div>
          <div style={{marginTop: 6, fontFamily: SANS, fontWeight: 600, fontSize: 28, color: LOOK.muted}}>Expert view · Harvard Health Publishing, 26 February 2020</div>
        </div>
        <Label at={l101} left={1180} top={180} size={40} color={LOOK.ivory} width={620}>
          It isn’t a toxin. It’s part of your brain.
        </Label>
      </div>
      <div style={{opacity: arrive(frame, l102, 18)}}>
        <Label at={l102} left={MARGIN} top={220} size={40}>
          the doctor who made the name famous
        </Label>
        <Big at={cues.word(102, 8)} top={300} size={140} width={1400}>
          Cameron Sepah
        </Big>
        <Label at={l103} left={MARGIN + 6} top={500} size={54} color={LOOK.ivory} weight={600}>
          meant a therapy method: cut the cues that <span style={{color: LOOK.amber}}>wake</span> a habit
        </Label>
        <Big at={l104} top={630} size={84} width={1500}>
          Wrong name. One useful idea.
        </Big>
        <Label at={cues.line(105)} left={MARGIN + 6} top={750} size={40}>
          we’ll come back to it
        </Label>
      </div>
    </Ground>
  );
};
