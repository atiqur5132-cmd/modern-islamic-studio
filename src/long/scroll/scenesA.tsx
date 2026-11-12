import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {arrive, CLAMP, LOOK, MARGIN, SANS, SERIF} from "./look";
import {Big, Credit, Drift, Ground, Label} from "./parts";
import {Phone, swipes} from "./Phone";
import {Pigeon} from "./Pigeon";
import {Cues} from "./types";

type P = {cues: Cues};

// Lines 1–3. Frame 0 is already mid-swipe: a phone in 3D, a reel counter that will not
// stop, then the clock that says how long it really was.
export const HookScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l2 = cues.line(2);
  const l3 = cues.line(3);
  // Swipes: on "Ek reel", "ek aur", "aakhri", then faster and faster until the clock.
  const times = [-4, cues.word(1, 2), cues.word(1, 5)];
  for (let f = cues.word(1, 5) + 14, gap = 12; f < l2; gap = Math.max(5, gap - 1), f += gap) times.push(f);
  const s = swipes(frame, times, 8);
  const count = Math.max(1, Math.floor(s) + 1);
  const clock = arrive(frame, l2, 18);
  const minutes = interpolate(frame, [l2, l2 + 34], [0, 90], {...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const turn = interpolate(frame, [l3, l3 + 60], [-16, 0], CLAMP);
  const back = interpolate(frame, [l3, l3 + 60], [1, 0.9], CLAMP);
  const hh = 21 + Math.floor((minutes + 0) / 60);
  const mm = Math.floor(minutes % 60);
  return (
    <Ground>
      <AbsoluteFill style={{left: 1120, top: 90}}>
        <div style={{transform: `scale(${back})`, transformOrigin: "30% 50%"}}>
          <Phone scroll={s} width={380} tiltY={turn} />
        </div>
      </AbsoluteFill>
      {/* the reel counter */}
      <div style={{position: "absolute", left: MARGIN, top: 250, fontFamily: SANS, color: LOOK.muted, fontSize: 36, fontWeight: 700, opacity: 1 - clock}}>
        reel
      </div>
      <div
        style={{
          position: "absolute",
          left: MARGIN - 8,
          top: 290,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 300,
          letterSpacing: -12,
          color: LOOK.ivory,
          fontVariantNumeric: "tabular-nums",
          opacity: 1 - clock,
          transform: `translateY(${-clock * 30}px)`,
        }}
      >
        {count}
      </div>
      {/* the clock */}
      <div style={{position: "absolute", left: MARGIN, top: 280, opacity: clock, transform: `translateY(${(1 - clock) * 24}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: LOOK.muted}}>9:00 pm →</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 210, letterSpacing: -8, color: LOOK.ivory, fontVariantNumeric: "tabular-nums"}}>
          {hh % 12 || 12}:{String(mm).padStart(2, "0")}
          <span style={{fontSize: 80, letterSpacing: 0, marginLeft: 18, color: LOOK.muted}}>pm</span>
        </div>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: LOOK.amber, marginTop: 6, opacity: arrive(frame, l2 + 30, 16)}}>
          an hour and a half, gone
        </div>
      </div>
    </Ground>
  );
};

// Lines 4–9. The arithmetic, done on screen, then the waking day as a bar.
export const SumScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l5 = cues.line(5);
  const l6 = cues.line(6);
  const l7 = cues.line(7);
  const l8 = cues.line(8);
  const l9 = cues.line(9);
  const year = Math.round(interpolate(frame, [l6 + 4, l6 + 30], [0, 730], CLAMP));
  const life = Math.round(interpolate(frame, [l7 + 4, l7 + 40], [0, 43800], CLAMP));
  const leftOut = interpolate(frame, [l9 - 6, l9 + 6], [1, 0.32], CLAMP);
  const row = (at: number, children: React.ReactNode, top: number) => {
    const a = arrive(frame, at, 16);
    return (
      <div style={{position: "absolute", left: MARGIN, top, opacity: a * leftOut, transform: `translateY(${(1 - a) * 18}px)`, fontFamily: SANS, color: LOOK.ivory}}>
        {children}
      </div>
    );
  };
  const cells = 16;
  const bar = arrive(frame, l9, 18);
  return (
    <Ground>
      <Drift to={1.03} frames={600}>
        <Label at={cues.line(4)} left={MARGIN} top={130}>
          a small sum
        </Label>
        {row(l5, <span style={{fontSize: 92, fontWeight: 800, letterSpacing: -3}}>2 hours <span style={{color: LOOK.muted, fontWeight: 700, fontSize: 58}}>a day</span></span>, 200)}
        {row(
          l6,
          <span style={{fontSize: 92, fontWeight: 800, letterSpacing: -3, fontVariantNumeric: "tabular-nums"}}>
            <span style={{color: LOOK.muted, fontWeight: 600}}>× 365 = </span>
            {year.toLocaleString("en-IN")} <span style={{color: LOOK.muted, fontWeight: 700, fontSize: 58}}>hours a year</span>
          </span>,
          320,
        )}
        {row(
          l7,
          <span style={{fontSize: 92, fontWeight: 800, letterSpacing: -3, fontVariantNumeric: "tabular-nums"}}>
            <span style={{color: LOOK.muted, fontWeight: 600}}>× 60 = </span>
            {life.toLocaleString("en-US")} <span style={{color: LOOK.muted, fontWeight: 700, fontSize: 58}}>hours</span>
          </span>,
          440,
        )}
        {(() => {
          const a = arrive(frame, l8, 18);
          const out = interpolate(frame, [l9 - 6, l9 + 6], [1, 0], CLAMP);
          return (
            <div style={{position: "absolute", left: MARGIN, top: 580, opacity: a * out, transform: `scale(${0.94 + 0.06 * a})`, transformOrigin: "left center"}}>
              <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 210, lineHeight: 1, color: LOOK.amber, letterSpacing: -4}}>= 5 years</div>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 44, color: LOOK.ivory, marginTop: 10, opacity: arrive(frame, cues.word(8, 4), 16)}}>
                day and night, without sleep
              </div>
            </div>
          );
        })()}
        {/* line 9: the waking day */}
        <div style={{position: "absolute", left: MARGIN, top: 560, opacity: bar}}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: LOOK.muted, marginBottom: 18}}>16 waking hours</div>
          <div style={{display: "flex", gap: 10}}>
            {Array.from({length: cells}, (_, i) => {
              const on = i >= cells - 2;
              const pop = arrive(frame, l9 + i * 2, 12);
              return (
                <div
                  key={i}
                  style={{
                    width: 88,
                    height: 110,
                    borderRadius: 8,
                    background: on ? LOOK.amber : LOOK.ground2,
                    border: `2px solid ${on ? LOOK.amber : LOOK.line}`,
                    opacity: pop,
                    transform: `translateY(${(1 - pop) * 16}px)`,
                  }}
                />
              );
            })}
          </div>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 66, color: LOOK.ivory, marginTop: 26, opacity: arrive(frame, cues.word(9, 3), 16)}}>
            one in every eight waking hours
          </div>
        </div>
      </Drift>
      <Credit at={l7 + 20} tag="Numerical illustration" source="if someone scrolls 2 hours a day for 60 years (2 × 365 × 60 = 43,800 h)" />
    </Ground>
  );
};

// Lines 10–16. The question, then the two ends of the answer: a pigeon and a word.
export const QuestionScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l12 = cues.line(12);
  const l13 = cues.line(13);
  const l14 = cues.line(14);
  const l15 = cues.line(15);
  const l16 = cues.line(16);
  const firstOut = interpolate(frame, [l12 - 4, l12 + 4], [1, 0], CLAMP);
  const whyOut = interpolate(frame, [l15 - 4, l15 + 4], [1, 0], CLAMP);
  const pull = interpolate(frame, [l14, l14 + 40], [0, 1], {...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 2)});
  return (
    <Ground>
      <div style={{opacity: firstOut}}>
        <Big at={cues.line(10)} top={300} size={110}>
          We want to stop.
        </Big>
        <Big at={cues.line(11)} top={440} size={110} color={LOOK.amber} italic>
          We can’t.
        </Big>
      </div>
      <div style={{opacity: whyOut}}>
        <Big at={l12} top={250} size={260}>
          Why?
        </Big>
        <Label at={l13} left={MARGIN + 6} top={560} size={52} color={LOOK.muted}>
          Are we weak?
        </Label>
        <Label at={l14} left={MARGIN + 6} top={640} size={52} color={LOOK.ivory}>
          Or is something <span style={{color: LOOK.amber}}>pulling</span> us?
        </Label>
        {/* a thread from the phone side of the frame, drawing taut */}
        <svg style={{position: "absolute", inset: 0}} width={1920} height={1080}>
          <path
            d={`M ${900 + pull * 120} 668 Q ${1350} ${668 + (1 - pull) * 120} 1920 560`}
            stroke={LOOK.amber}
            strokeWidth={3}
            fill="none"
            opacity={arrive(frame, l14, 14)}
          />
        </svg>
      </div>
      <AbsoluteFill style={{left: 260, top: 330, opacity: arrive(frame, l15, 18) * interpolate(frame, [l16 - 4, l16 + 6], [1, 0.35], CLAMP)}}>
        <Pigeon size={420} peck={Math.max(0, Math.sin((frame - l15) / 6)) * (frame > l15 + 20 ? 1 : 0)} />
      </AbsoluteFill>
      <Label at={l15 + 6} left={260} top={760} size={40} color={LOOK.muted}>
        it starts with a pigeon
      </Label>
      <div style={{position: "absolute", left: 1000, top: 360, width: 800, opacity: arrive(frame, l16, 18)}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: LOOK.muted}}>and ends on</div>
        <div style={{fontFamily: SERIF, fontWeight: 500, fontSize: 96, lineHeight: 1.05, color: LOOK.ivory, marginTop: 10}}>
          a 1,400-year-old word <span style={{fontStyle: "italic", color: LOOK.amber}}>from the market</span>
        </div>
      </div>
    </Ground>
  );
};
