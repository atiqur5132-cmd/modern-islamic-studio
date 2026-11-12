import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {Brain} from "./Brain";
import {arrive, CLAMP, LOOK, MARGIN, SANS, SERIF} from "./look";
import {Big, Credit, Drift, Ground, Label, Mark} from "./parts";
import {Phone, swipes} from "./Phone";
import {Cues} from "./types";

type P = {cues: Cues};

// Lines 43–47. Into the brain; the popular name for dopamine is struck through.
export const BrainScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l44 = cues.line(44);
  const l45 = cues.line(45);
  const l46 = cues.line(46);
  const l47 = cues.line(47);
  const zoom = interpolate(frame, [l44, l44 + 50], [0.8, 1], {...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const brain = arrive(frame, l44, 20);
  const strike = interpolate(frame, [l47, l47 + 14], [0, 1], CLAMP);
  const qOut = interpolate(frame, [l44 - 4, l44 + 6], [1, 0], CLAMP);
  return (
    <Ground>
      <div style={{opacity: qOut}}>
        <Big at={0} top={330} size={120}>
          Why is <span style={{fontStyle: "italic", color: LOOK.amber}}>“maybe”</span> so strong?
        </Big>
      </div>
      <AbsoluteFill style={{left: 860, top: 160, opacity: brain, transform: `scale(${zoom})`, transformOrigin: "50% 50%"}}>
        <Brain size={880} midbrain={arrive(frame, l45 + 10, 20)} />
      </AbsoluteFill>
      <Label at={l45} left={MARGIN} top={280} size={40}>
        you’ve heard of
      </Label>
      <Big at={l45 + 4} top={360} size={150} width={760}>
        dopamine
      </Big>
      <div style={{position: "absolute", left: MARGIN, top: 560, opacity: arrive(frame, l46, 16)}}>
        <div style={{position: "relative", display: "inline-block", fontFamily: SERIF, fontStyle: "italic", fontSize: 72, color: LOOK.muted}}>
          “the happiness chemical”
          <div style={{position: "absolute", left: 0, top: "54%", height: 4, width: `${strike * 100}%`, background: LOOK.ivory}} />
        </div>
      </div>
      <Label at={l47 + 10} left={MARGIN} top={690} size={46} color={LOOK.ivory} weight={600}>
        Science tells a different story.
      </Label>
    </Ground>
  );
};

// A strip of neuron spikes: ticks along a time line, denser where `burst` says.
const Spikes = ({x, y, width, bursts, frame, seed}: {x: number; y: number; width: number; bursts: {at: number; strength: number}[]; frame: number; seed: number}) => {
  const ticks: number[] = [];
  let r = seed;
  const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 40; i++) ticks.push(rnd() * width); // background firing
  for (const b of bursts) for (let i = 0; i < Math.round(26 * b.strength); i++) ticks.push(b.at + (rnd() - 0.5) * 60);
  return (
    <svg style={{position: "absolute", left: x, top: y, overflow: "visible"}} width={width} height={60}>
      {ticks.map((t, i) => (
        <line key={i} x1={t} x2={t} y1={0} y2={52} stroke={bursts.some((b) => Math.abs(t - b.at) < 34 && b.strength > 0.3) ? LOOK.amber : LOOK.ivory} strokeWidth={2.5} opacity={frame > 0 ? 0.85 : 0} />
      ))}
    </svg>
  );
};

// Lines 48–54. Schultz's monkeys: light, then juice. First time, the burst is at the juice;
// once learned, it moves to the light. Dopamine as a prediction error.
export const MonkeyScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l49 = cues.line(49);
  const l50 = cues.line(50);
  const l51 = cues.line(51);
  const l52 = cues.line(52);
  const l53 = cues.line(53);
  const l54 = cues.line(54);
  const axis = arrive(frame, l49, 20);
  const lightX = 560;
  const juiceX = 1160;
  const learned = frame >= l51;
  const rowOut = interpolate(frame, [l52 - 4, l52 + 8], [1, 0.0], CLAMP);
  return (
    <Ground>
      <Drift to={1.02} frames={900}>
        <div style={{opacity: interpolate(frame, [l49 - 4, l49 + 6], [1, 0], CLAMP)}}>
          <Big at={0} top={320} size={130}>
            Wolfram Schultz
          </Big>
          <Label at={cues.word(48, 4)} left={MARGIN + 6} top={490} size={46} color={LOOK.ivory} weight={600}>
            recorded dopamine neurons in monkeys
          </Label>
        </div>
        <div style={{opacity: axis * rowOut}}>
          {/* time line with the light and the juice */}
          <svg style={{position: "absolute", left: 0, top: 0}} width={1920} height={1080}>
            <line x1={360} x2={1560} y1={560} y2={560} stroke={LOOK.line} strokeWidth={3} />
            <circle cx={lightX} cy={560} r={22} fill={LOOK.ivory} opacity={arrive(frame, l49 + 6, 12)} />
            <path d={`M ${juiceX} 532 C ${juiceX + 18} 556 ${juiceX + 18} 580 ${juiceX} 584 C ${juiceX - 18} 580 ${juiceX - 18} 556 ${juiceX} 532 Z`} fill={LOOK.amber} opacity={arrive(frame, cues.word(49, 7), 12)} />
          </svg>
          <Label at={l49 + 6} left={lightX} top={610} size={34} center width={300} color={LOOK.ivory}>
            light
          </Label>
          <Label at={cues.word(49, 7)} left={juiceX} top={610} size={34} center width={300} color={LOOK.amber}>
            juice
          </Label>
          <Label at={l50} left={140} top={330} size={32} width={200}>
            first time
          </Label>
          {frame >= l50 && <Spikes x={360} y={320} width={1200} frame={frame - l50} seed={7} bursts={[{at: juiceX - 360, strength: 1}]} />}
          <Label at={l51} left={140} top={420} size={32} width={200}>
            learned
          </Label>
          {learned && (
            <Spikes x={360} y={410} width={1200} frame={frame - l51} seed={3} bursts={[{at: lightX - 360, strength: 1}, {at: juiceX - 360, strength: 0.15}]} />
          )}
          <Label at={cues.word(51, 13)} left={juiceX} top={700} size={34} center width={420} color={LOOK.muted}>
            the burst at the juice fades
          </Label>
        </div>
        {/* the meaning */}
        <Big at={l52} top={250} size={104} width={1500}>
          Not a happiness signal. A <Mark at={cues.word(52, 4)}>calculation</Mark> signal.
        </Big>
        <div style={{position: "absolute", left: MARGIN, top: 520, opacity: arrive(frame, l53, 18), fontFamily: SANS, fontWeight: 700, fontSize: 60, color: LOOK.ivory}}>
          what happened <span style={{color: LOOK.amber}}>−</span> what you expected
        </div>
        <div style={{position: "absolute", left: MARGIN, top: 640, opacity: arrive(frame, cues.word(54, 3), 18), fontFamily: SERIF, fontStyle: "italic", fontSize: 96, color: LOOK.amber}}>
          prediction error
        </div>
      </Drift>
      <Credit at={l49 + 20} tag="Established science" source="Schultz, Dayan & Montague, Science, 1997 · recordings in monkeys" />
    </Ground>
  );
};

// Lines 55–58. Five chances of juice; the slow rising signal is biggest at 50/50.
export const UncertaintyScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l56 = cues.line(56);
  const l57 = cues.line(57);
  const l58 = cues.line(58);
  const probs = [0, 25, 50, 75, 100];
  const chart = arrive(frame, l56, 20);
  return (
    <Ground>
      <Label at={0} left={MARGIN} top={120} size={40}>
        2003 · the same lab
      </Label>
      <Big at={4} top={200} size={84} width={1600}>
        What if the juice comes only sometimes?
      </Big>
      <div style={{opacity: chart}}>
        {probs.map((p, i) => {
          const x = 260 + i * 330;
          const height = (p / 100) * (1 - p / 100) * 4 * 320; // P(1-P), largest at 0.5
          const grow = interpolate(frame, [l57 + i * 4, l57 + i * 4 + 40], [0, 1], {...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 2)});
          const peak = p === 50 && frame >= l58;
          return (
            <div key={p}>
              <svg style={{position: "absolute", left: x - 120, top: 400}} width={240} height={360}>
                <line x1={0} x2={240} y1={340} y2={340} stroke={LOOK.line} strokeWidth={3} />
                {/* the ramp before the moment of the juice */}
                <path d={`M 10 340 Q 150 ${340 - height * 0.2 * grow} 220 ${340 - height * grow} L 220 340 Z`} fill={peak ? LOOK.amber : LOOK.ivory} opacity={peak ? 0.95 : 0.55} />
              </svg>
              <div style={{position: "absolute", left: x - 120, width: 240, top: 770, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 52, color: peak ? LOOK.amber : LOOK.ivory, fontVariantNumeric: "tabular-nums"}}>
                {p}%
              </div>
            </div>
          );
        })}
        <Label at={l56} left={MARGIN} top={340} size={32}>
          chance of juice →
        </Label>
        <Label at={l58 + 6} left={1020} top={350} size={40} color={LOOK.amber}>
          strongest when you can’t tell
        </Label>
      </div>
      <Credit at={l57} tag="One study" source="Fiorillo, Tobler & Schultz, Science, 2003 · monkeys, juice rewards" />
    </Ground>
  );
};

// Lines 59–63. The honesty beat: what the study is, what it is not. Then every swipe.
export const CaveatScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l60 = cues.line(60);
  const l61 = cues.line(61);
  const l62 = cues.line(62);
  const l63 = cues.line(63);
  const out = interpolate(frame, [l62 - 4, l62 + 8], [1, 0], CLAMP);
  const s = swipes(frame, [l63 + 4, l63 + 22, l63 + 40, l63 + 58], 9);
  return (
    <Ground>
      <div style={{opacity: out}}>
        <div style={{position: "absolute", left: MARGIN, top: 250, display: "flex", gap: 60}}>
          {["Monkeys.", "Juice.", "A lab."].map((t, i) => {
            const a = arrive(frame, cues.word(60, [1, 6, 3][i]) + i * 4, 16);
            return (
              <div key={t} style={{opacity: a, transform: `translateY(${(1 - a) * 16}px)`, fontFamily: SERIF, fontSize: 110, color: LOOK.ivory}}>
                {t}
              </div>
            );
          })}
        </div>
        <Label at={cues.word(60, 9)} left={MARGIN + 6} top={420} size={56} color={LOOK.muted}>
          Not reels.
        </Label>
        <Big at={l61} top={540} size={110} color={LOOK.amber} italic width={1400}>
          an analogy, not proof
        </Big>
      </div>
      <AbsoluteFill style={{left: 1140, top: 90, opacity: arrive(frame, l62, 18)}}>
        <Phone scroll={s} width={380} tiltY={-14} />
      </AbsoluteFill>
      <Big at={l62 + 4} top={330} size={92} width={900}>
        But it explains a lot.
      </Big>
      <Label at={l63 + 10} left={MARGIN} top={520} size={60} color={LOOK.amber} weight={800}>
        every swipe: maybe?
      </Label>
    </Ground>
  );
};
