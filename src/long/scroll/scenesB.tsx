import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {arrive, CLAMP, LOOK, MARGIN, SANS, SERIF} from "./look";
import {Big, Credit, Drift, Ground, Label, Mark} from "./parts";
import {Phone, swipes} from "./Phone";
import {SkinnerBox} from "./Pigeon";
import {SlotMachine} from "./SlotMachine";
import {Cues} from "./types";

type P = {cues: Cues};

// A peck every `every` frames; the head dips for 6 frames.
const peckAt = (frame: number, start: number, every: number) => {
  if (frame < start) return 0;
  const k = (frame - start) % every;
  return k < 6 ? Math.sin((k / 6) * Math.PI) : 0;
};
const peckCount = (frame: number, start: number, every: number) => (frame < start ? 0 : Math.floor((frame - start) / every) + 1);

// Lines 17–21. Skinner, then one box: peck, grain.
export const SkinnerScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l18 = cues.line(18);
  const l20 = cues.line(20);
  const nameOut = interpolate(frame, [l18 - 4, l18 + 6], [1, 0], CLAMP);
  const box = arrive(frame, l18, 20);
  const peckStart = cues.word(20, 3);
  const pecks = peckCount(frame, peckStart, 20);
  const grain = pecks > 0 ? Math.min(1, ((frame - peckStart) % 20) / 14) : 0;
  return (
    <Ground>
      <div style={{opacity: nameOut}}>
        <Label at={0} left={MARGIN} top={300} size={40}>
          20th century, America
        </Label>
        <Big at={cues.word(17, 8)} top={380} size={170}>
          B. F. Skinner
        </Big>
        <Label at={cues.word(17, 6)} left={MARGIN + 6} top={590} size={44} color={LOOK.ivory} weight={600}>
          psychologist
        </Label>
      </div>
      <AbsoluteFill style={{left: 620, top: 150, opacity: box, transform: `translateY(${(1 - box) * 30}px)`}}>
        <Drift to={1.05} frames={400}>
          <SkinnerBox width={680} peck={peckAt(frame, peckStart, 20)} grains={grain} lit />
        </Drift>
      </AbsoluteFill>
      <Label at={cues.line(19)} left={1380} top={260} size={34} color={LOOK.muted} width={320}>
        a key on the wall
      </Label>
      <Label at={l20 + 10} left={1380} top={560} size={34} color={LOOK.amber} width={320}>
        peck → one grain
      </Label>
      <Label at={cues.line(21)} left={MARGIN} top={820} size={52} color={LOOK.ivory}>
        A simple game.
      </Label>
    </Ground>
  );
};

// Lines 22–29. Three boxes, three rules. The one with no pattern wins, and keeps going.
export const ThreeBoxesScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l23 = cues.line(23);
  const l24 = cues.line(24);
  const l25 = cues.line(25);
  const l27 = cues.line(27);
  const l28 = cues.line(28);
  const l29 = cues.line(29);
  const stop = cues.word(29, 4); // "band" : rewards stop
  const random = [0, 9, 14, 52, 61, 66, 118, 124, 170, 214, 222, 290, 300, 352];
  const boxes = [
    {at: l23, label: "every peck", every: 26, reward: (n: number) => true},
    {at: l24, label: "every 10th peck", every: 22, reward: (n: number) => n % 10 === 0},
    {at: l25, label: "no pattern", every: 14, reward: (n: number) => random.includes(n % 360)},
  ];
  const title = arrive(frame, cues.line(22), 16);
  return (
    <Ground>
      <div style={{position: "absolute", left: MARGIN, top: 110, opacity: title, fontFamily: SERIF, fontSize: 64, color: LOOK.ivory}}>
        Then he changed the rules.
      </div>
      {boxes.map((b, i) => {
        const a = arrive(frame, b.at, 18);
        const winner = i === 2 && frame >= l27;
        const dim = frame >= l27 && i !== 2;
        // After the rewards stop, the first two give up quickly; the third keeps going.
        const quitAt = i === 0 ? stop + 30 : i === 1 ? stop + 70 : Infinity;
        const pecking = frame < quitAt;
        const p = pecking ? peckAt(frame, b.at + 10, b.every) : 0;
        const n = peckCount(Math.min(frame, quitAt), b.at + 10, b.every);
        const kk = (frame - (b.at + 10)) % b.every;
        const grain = frame < stop && n > 0 && b.reward(n) ? Math.min(1, kk / 12) : 0;
        return (
          <div key={i} style={{position: "absolute", left: 120 + i * 580, top: 300, opacity: a, transform: `translateY(${(1 - a) * 30}px)`}}>
            <SkinnerBox width={500} peck={p} grains={grain} lit={frame < stop} accent={winner} dim={dim} label={b.label} />
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: winner ? LOOK.amber : LOOK.ivory, marginTop: 70, textAlign: "center", fontVariantNumeric: "tabular-nums", opacity: dim ? 0.4 : 1}}>
              {n} <span style={{fontSize: 30, fontWeight: 700, color: LOOK.muted}}>pecks</span>
            </div>
          </div>
        );
      })}
      <Label at={cues.word(26, 0)} left={1280} top={240} size={32} color={LOOK.amber}>
        3rd · 20th · 21st…
      </Label>
      <Label at={l28} left={MARGIN} top={190} size={40} color={LOOK.amber}>
        it never knew when the next grain would come
      </Label>
      <Label at={stop} left={MARGIN} top={240} size={40} color={LOOK.ivory}>
        rewards stopped — it kept going longest
      </Label>
      <Credit at={l23 + 30} tag="Illustration" source="reinforcement schedules, after Ferster & Skinner, Schedules of Reinforcement (1957)" />
    </Ground>
  );
};

// Lines 30–36. The name, then the textbook example: a slot machine.
export const SlotScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l32 = cues.line(32);
  const pull1 = cues.line(33);
  const pull2 = cues.line(34);
  const pull3 = cues.line(35);
  const l36 = cues.line(36);
  const pulls = [pull1, pull2, pull3];
  const last = [...pulls].reverse().find((p) => frame >= p) ?? -1;
  const idx = pulls.indexOf(last);
  const spin = last < 0 ? 0 : Math.min(1, (frame - last) / 28);
  const lever = last < 0 ? 0 : interpolate(frame - last, [0, 6, 16], [0, 1, 0], CLAMP);
  const win = idx === 2;
  const bulbs = win && spin >= 1 ? (frame - last - 28) / 30 : 0;
  const machine = arrive(frame, l32, 20);
  const titleOut = interpolate(frame, [l32 - 4, l32 + 8], [1, 0.0], CLAMP);
  return (
    <Ground>
      <div style={{opacity: titleOut}}>
        <Big at={cues.word(30, 5)} top={330} size={150} italic>
          <Mark at={cues.word(30, 5) + 6}>variable reward</Mark>
        </Big>
        <Label at={cues.line(31)} left={MARGIN + 6} top={540} size={48} color={LOOK.ivory} weight={600}>
          A reward will come. When? You can’t tell.
        </Label>
      </div>
      <AbsoluteFill style={{left: 980, top: 140, opacity: machine, transform: `translateY(${(1 - machine) * 40}px)`}}>
        <SlotMachine width={620} spin={spin} lever={lever} result={win ? "win" : "miss"} bulbs={bulbs} />
      </AbsoluteFill>
      <div style={{opacity: machine}}>
        <Label at={l32 + 10} left={MARGIN} top={300} size={40}>
          the textbook example
        </Label>
        <Big at={l32 + 4} top={380} size={110} width={800}>
          the slot machine
        </Big>
        <Label at={pull1 + 22} left={MARGIN} top={570} size={52} color={LOOK.muted}>
          pull · nothing
        </Label>
        <Label at={pull2 + 22} left={MARGIN} top={640} size={52} color={LOOK.muted}>
          pull · nothing
        </Label>
        <Label at={pull3 + 26} left={MARGIN} top={710} size={52} color={LOOK.amber}>
          pull · bells
        </Label>
        <Big at={l36} top={790} size={84} italic color={LOOK.ivory} width={800}>
          just one more
        </Big>
      </div>
      <Credit at={l32 + 20} tag="Established science" source="gambling is the standard example of a variable-ratio schedule" />
    </Ground>
  );
};

// Lines 37–42. The machine shrinks away; the phone takes its place. Same lever.
export const LeverScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l38 = cues.line(38);
  const l39 = cues.line(39);
  const l40 = cues.line(40);
  const l41 = cues.line(41);
  const l42 = cues.line(42);
  const s = swipes(frame, [l38, l39, l40], 10);
  const phone = arrive(frame, cues.line(37), 20);
  const machine = interpolate(frame, [0, 24], [1, 0.42], {...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const pocket = interpolate(frame, [l42 + 6, l42 + 40], [0, 1], {...CLAMP, easing: (t) => t * t});
  const tag = (at: number, text: string, good = false) => {
    const a = arrive(frame, at, 14);
    return (
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 46, color: good ? LOOK.amber : LOOK.muted, opacity: a, transform: `translateX(${(1 - a) * -20}px)`, marginBottom: 18}}>
        {text}
      </div>
    );
  };
  return (
    <Ground>
      <AbsoluteFill style={{left: 120, top: 330, transform: `scale(${machine})`, transformOrigin: "0 0", opacity: interpolate(frame, [l42, l42 + 20], [1, 0.25], CLAMP)}}>
        <SlotMachine width={620} lever={interpolate(frame, [l41, l41 + 8, l41 + 20], [0, 1, 0], CLAMP)} />
      </AbsoluteFill>
      <AbsoluteFill style={{left: 900, top: 90 + pocket * 560, opacity: phone * (1 - pocket), transform: `scale(${1 - pocket * 0.5})`, transformOrigin: "190px 0"}}>
        <Phone scroll={s} width={380} tiltY={-12} good={[3]} />
      </AbsoluteFill>
      <div style={{position: "absolute", left: 1420, top: 300}}>
        {tag(l38 + 8, "dull")}
        {tag(l39 + 8, "dull")}
        {tag(l40 + 8, "the good one", true)}
      </div>
      <Big at={l41} top={150} size={92} width={760} left={MARGIN}>
        Same lever.
      </Big>
      {/* the pocket the phone drops into */}
      <svg style={{position: "absolute", left: 830, top: 600, opacity: arrive(frame, l42, 16)}} width={520} height={320}>
        <path d="M20 20 L500 20 L470 230 Q260 320 50 230 Z" fill="none" stroke={LOOK.ivory} strokeWidth={4} strokeDasharray="14 10" />
      </svg>
      <Label at={l42 + 4} left={MARGIN} top={290} size={48} color={LOOK.amber}>
        now it lives in your pocket
      </Label>
    </Ground>
  );
};
