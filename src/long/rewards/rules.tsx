import React from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {Card2D, Clock, Cross, Envelope, Rulebook, Scissors, Target, Toggle} from "./art";
import {Gauge} from "./charts";
import {CoinIcon, GiftIcon, ShieldIcon} from "./icons";
import {Pop, Show, Words} from "./kit";
import {CH, CLAMP, fade, grow, mix, pop, SANS, sec} from "./look";

// Chapter 4, "Three rules" (305.3–353.7 s), warm gold: what you keep.
const P = CH.rules;
const art = {a: P.accent, ink: P.ink, s: "#ffffff"};

const CutUp = () => {
  const frame = useCurrentFrame();
  const cut = interpolate(frame, [sec(306.9), sec(307.4)], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const join = interpolate(frame, [sec(309.9), sec(310.5)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const apart = cut * (1 - join);
  const sx = interpolate(frame, [sec(306.0), sec(306.9)], [1500, 960], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const half = (side: -1 | 1) => (
    <div style={{position: "absolute", left: 960 + side * apart * 90, top: 500 + apart * 60, transform: `translate(-50%,-50%) rotate(${side * apart * 14}deg)`, clipPath: side < 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)", filter: "drop-shadow(0 22px 26px rgba(0,0,0,0.2))"}}>
      <Card2D {...art} size={520} metal />
    </div>
  );
  return (
    <Show from={305.3} to={310.8}>
      <div style={{opacity: pop(frame, 305.4)}}>
        {half(-1)}
        {half(1)}
      </div>
      {frame < sec(308.0) ? (
        <div style={{position: "absolute", left: sx, top: 500, transform: "translate(-50%,-50%) rotate(90deg)", opacity: grow(frame, 305.9, 8) * fade(frame, 307.6, 8)}}>
          <Scissors {...art} size={260} open={Math.abs(Math.sin(frame * 0.4)) * (1 - cut) + cut * 0.1} />
        </div>
      ) : null}
      {[0, 1, 2].map((i) => (
        <Pop key={i} at={308.3 + i * 0.12} x={560 + i * 400} y={860} out={309.9}>
          <Envelope {...art} size={180} />
        </Pop>
      ))}
      <Words at={309.9} x={960} y={150} align="center" size={72} color={P.ink} serif>
        Not at all.
      </Words>
    </Show>
  );
};

const Wealthy = () => {
  const frame = useCurrentFrame();
  const score = interpolate(frame, [sec(316.0), sec(317.2)], [520, 800], {...CLAMP, easing: Easing.out(Easing.cubic)});
  return (
    <Show from={310.9} to={318.7}>
      <Pop at={311.0} x={960} y={240}>
        <Card2D {...art} size={280} metal />
      </Pop>
      <Words at={311.5} x={960} y={400} align="center" size={46} color={P.inkSoft}>
        the wealthy use cards for almost everything
      </Words>
      {[0, 1, 2, 3].map((i) => (
        <Pop key={i} at={313.2 + i * 0.12} x={720 + i * 160} y={470} out={314.4} scale={0.8}>
          <CoinIcon size={70} label="$" />
        </Pop>
      ))}
      <Pop at={314.6} x={420} y={680}>
        <ShieldIcon size={210} color={P.ink} />
      </Pop>
      <Words at={314.8} x={420} y={830} align="center" size={42} color={P.ink}>
        fraud protection
      </Words>
      <div style={{position: "absolute", left: 960, top: 690, transform: `translate(-50%,-50%) scale(${pop(frame, 315.8) * 0.62})`}}>
        <Gauge pal={P} value={score} min={300} max={850} band={[700, 850]} ticks={[300, 850]} unit="" />
      </div>
      <Words at={316.0} x={960} y={830} align="center" size={42} color={P.ink}>
        credit history
      </Words>
      <Pop at={317.8} x={1500} y={680}>
        <GiftIcon color={P.accent} size={200} />
      </Pop>
      <Words at={317.9} x={1500} y={830} align="center" size={42} color={P.ink}>
        rewards
      </Words>
    </Show>
  );
};

// One gold rule card that flips face-up at `flipAt`.
const RuleCard = ({x, y, at, flipAt, n, title, icon, active}: {x: number; y: number; at: number; flipAt: number; n: number; title: string; icon: React.ReactNode; active: number}) => {
  const frame = useCurrentFrame();
  const k = pop(frame, at, 16);
  const flip = interpolate(frame, [sec(flipAt), sec(flipAt) + 18], [180, 0], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const dim = Math.min(1, k * 1.4) * (0.45 + 0.55 * active);
  const face = (back: boolean): React.CSSProperties => ({
    position: "absolute",
    inset: 0,
    borderRadius: 26,
    opacity: dim,
    backfaceVisibility: "hidden",
    transform: back ? "rotateY(180deg)" : undefined,
    background: back ? `linear-gradient(135deg, #e9c46a, ${P.accent} 55%, #9c7220)` : "#fffaf0",
    border: back ? "none" : `5px solid ${P.accent}`,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    fontFamily: SANS,
    boxShadow: "0 24px 40px rgba(0,0,0,0.16)",
  });
  return (
    <div style={{position: "absolute", left: x, top: y, width: 420, height: 300, transform: `translate(-50%,-50%) translateY(${(1 - k) * 120}px) scale(${0.9 + 0.1 * active}) perspective(1400px) rotateY(${flip}deg)`, transformStyle: "preserve-3d"}}>
      <div style={face(false)}>
        <div style={{display: "flex", alignItems: "center", gap: 16}}>
          <span style={{fontWeight: 800, fontSize: 64, color: P.accent}}>{n}</span>
          {icon}
        </div>
        <div style={{fontWeight: 800, fontSize: 38, color: P.ink, textAlign: "center", lineHeight: 1.1, padding: "0 20px"}}>{title}</div>
      </div>
      <div style={face(true)}>
        <span style={{fontWeight: 800, fontSize: 140, color: "rgba(255,255,255,0.85)"}}>{n}</span>
      </div>
    </div>
  );
};

const Rules = () => {
  const frame = useCurrentFrame();
  const act = (a: number, b: number) => grow(frame, a, 12) * fade(frame, b, 12);
  const a1 = frame < sec(324.3) ? 1 : act(324.3, 332.9);
  const a2 = frame < sec(324.3) ? 1 : act(333.0, 343.5);
  const a3 = frame < sec(324.3) ? 1 : act(343.6, 353.6);
  // Rule 1: spending never passes what is already in the account.
  const spend = interpolate(frame, [sec(328.3), sec(329.8)], [0, 0.82], {...CLAMP, easing: Easing.out(Easing.cubic)});
  // Rule 2: one month of interest wipes a year of cash back.
  const wipe = interpolate(frame, [sec(340.6), sec(341.8)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  return (
    <Show from={318.8} to={353.6}>
      <Pop at={319.2} x={960} y={600} out={322.4}>
        <div style={{position: "relative"}}>
          <Rulebook {...art} size={300} />
          <div style={{position: "absolute", inset: 0, opacity: grow(frame, 320.6, 8)}}>
            <Cross size={300} color={CH.revolve.accent} />
          </div>
        </div>
      </Pop>
      <Words at={319.4} x={960} y={790} align="center" size={46} color={P.inkSoft} out={322.4}>
        they never play by the bank's rules
      </Words>
      <RuleCard x={460} y={270} at={322.6} flipAt={324.3} n={1} title="Debit card with a delay" icon={<Clock {...art} size={70} t={frame / 90} />} active={a1} />
      <RuleCard x={960} y={270} at={322.75} flipAt={333.0} n={2} title="Autopay the full balance" icon={<Toggle {...art} size={80} on={grow(frame, 334.0, 10)} />} active={a2} />
      <RuleCard x={1460} y={270} at={322.9} flipAt={343.6} n={3} title="Never chase a reward" icon={<Target {...art} size={70} />} active={a3} />
      {/* Rule 1 demo */}
      <Show from={325.2} to={332.9}>
        <div style={{position: "absolute", left: 380, top: 580, width: 1160, fontFamily: SANS}}>
          <div style={{fontWeight: 700, fontSize: 36, color: P.inkSoft, opacity: grow(frame, 331.2, 10)}}>in your checking account today</div>
          <div style={{marginTop: 12, height: 64, borderRadius: 14, background: P.soft, border: `4px solid ${P.accent}`, opacity: grow(frame, 331.2, 10)}} />
          <div style={{marginTop: 40, fontWeight: 700, fontSize: 36, color: P.inkSoft, opacity: grow(frame, 326.6, 10)}}>what you swipe</div>
          <div style={{marginTop: 12, height: 64, width: `${spend * 100}%`, borderRadius: 14, background: P.accent}} />
          <div style={{position: "absolute", left: "100%", top: 30, height: 270, borderLeft: `5px dashed ${P.ink}`, opacity: grow(frame, 329.7, 10)}} />
          <div style={{position: "absolute", left: "100%", top: 300, transform: "translateX(-100%)", fontWeight: 800, fontSize: 40, color: P.ink, opacity: grow(frame, 329.9, 10), whiteSpace: "nowrap"}}>never past this line</div>
        </div>
      </Show>
      {/* Rule 2 demo */}
      <Show from={333.8} to={343.5}>
        <div style={{position: "absolute", left: 560, top: 560, fontFamily: SANS}}>
          <div style={{display: "flex", alignItems: "center", gap: 24, opacity: grow(frame, 335.2, 10)}}>
            <Toggle {...art} size={120} on={1} />
            <span style={{fontWeight: 800, fontSize: 48, color: P.ink}}>full statement balance</span>
          </div>
          <div style={{display: "flex", alignItems: "center", gap: 24, marginTop: 24, opacity: grow(frame, 336.6, 10)}}>
            <Toggle {...art} size={120} on={0} />
            <span style={{fontWeight: 800, fontSize: 48, color: P.inkSoft, textDecoration: frame >= sec(337.3) ? `line-through ${CH.revolve.accent} 6px` : "none"}}>minimum due</span>
          </div>
        </div>
        <div style={{position: "absolute", left: 360, top: 860, display: "flex", gap: 12}}>
          {Array.from({length: 12}).map((_, i) => {
            const k = pop(frame, 338.5 + i * 0.08, 10);
            const gone = wipe * 13 > i ? 1 : 0;
            return (
              <div key={i} style={{transform: `scale(${k * (1 - gone)})`, opacity: 1 - gone}}>
                <CoinIcon size={86} label="$" />
              </div>
            );
          })}
        </div>
        <div style={{position: "absolute", left: mix(250, 1500, wipe), top: 850, width: 260, height: 110, borderRadius: 18, background: CH.revolve.accent, opacity: wipe > 0 && wipe < 1 ? 1 : wipe >= 1 ? 1 - grow(frame, 342.2, 10) : 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 32, color: "#fff", textAlign: "center", lineHeight: 1.05}}>
          1 month of interest
        </div>
        <Words at={338.6} x={360} y={800} size={38} color={P.inkSoft}>
          a year of cash back
        </Words>
      </Show>
      {/* Rule 3 demo */}
      <Show from={344.4} to={353.5}>
        <Pop at={344.8} x={960} y={620} out={346.3}>
          <div style={{position: "relative"}}>
            <Target {...art} size={220} />
            <div style={{position: "absolute", inset: 0, opacity: grow(frame, 345.3, 8)}}>
              <Cross size={220} color={CH.revolve.accent} />
            </div>
          </div>
        </Pop>
        <div style={{position: "absolute", left: 380, top: 640, width: 980, opacity: grow(frame, 346.5, 12), fontFamily: SANS}}>
          <div style={{height: 70, borderRadius: 16, background: P.ink, width: `${grow(frame, 349.8, 30) * 100}%`}} />
          <div style={{marginTop: 14, fontWeight: 700, fontSize: 38, color: P.inkSoft}}>money you were going to spend anyway</div>
        </div>
        <div style={{position: "absolute", left: 1400, top: 600 - grow(frame, 348.8, 14) * 90, transform: `scale(${pop(frame, 348.8)})`}}>
          <CoinIcon size={110} label="$" />
        </div>
        <Words at={349.0} x={1460} y={460} align="center" size={42} color={P.accent}>
          a side effect
        </Words>
        <Words at={352.3} x={960} y={880} align="center" size={50} color={P.ink} serif>
          never the reason
        </Words>
      </Show>
    </Show>
  );
};

export const RulesChapter = () => (
  <AbsoluteFill>
    <CutUp />
    <Wealthy />
    <Rules />
  </AbsoluteFill>
);

export const RULES_CUES = [
  {at: 305.4, sound: "whoosh-2", volume: 0.18},
  {at: 306.9, sound: "paper-tear-2", volume: 0.3},
  {at: 308.3, sound: "paper-slide-1", volume: 0.24},
  {at: 309.9, sound: "tick", volume: 0.26},
  {at: 311.0, sound: "whoosh-3", volume: 0.14},
  {at: 314.6, sound: "tick-soft-1", volume: 0.22},
  {at: 315.8, sound: "tick-soft-2", volume: 0.22},
  {at: 317.8, sound: "tick-soft-3", volume: 0.22},
  {at: 319.2, sound: "whoosh", volume: 0.14},
  {at: 320.6, sound: "pen-circle-3", volume: 0.26},
  {at: 322.6, sound: "paper-slide-2", volume: 0.26},
  {at: 324.3, sound: "page-turn-1", volume: 0.3},
  {at: 328.3, sound: "tick-soft-1", volume: 0.22},
  {at: 329.8, sound: "tick", volume: 0.24},
  {at: 333.0, sound: "page-turn-2", volume: 0.3},
  {at: 334.0, sound: "tick-soft-2", volume: 0.24},
  {at: 337.3, sound: "pen-circle-1", volume: 0.26},
  {at: 340.6, sound: "whoosh-2", volume: 0.16},
  {at: 343.6, sound: "page-turn-1", volume: 0.3},
  {at: 345.3, sound: "pen-circle-2", volume: 0.26},
  {at: 348.8, sound: "tick-soft-3", volume: 0.22},
];
