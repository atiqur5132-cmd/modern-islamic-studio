import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {ARABIC_FONT} from "../../theme";
import {FPS} from "../../timeline/types";
import {arrive, CLAMP, LOOK, MARGIN, SANS, SERIF} from "./look";
import {Big, Credit, Ground, Label, Mark, Paper} from "./parts";
import {Phone} from "./Phone";
import {SkinnerBox} from "./Pigeon";
import {SlotMachine} from "./SlotMachine";
import {Cues} from "./types";

type P = {cues: Cues};

// The hadith as sunnah.com gives it (Sahih al-Bukhari 6412, narrated by Ibn 'Abbas).
const MATN = ["نِعْمَتَانِ", "مَغْبُونٌ", "فِيهِمَا كَثِيرٌ مِنَ النَّاسِ، الصِّحَّةُ وَالْفَرَاغُ"];

// Lines 106–113, on paper: the hadith, the word maghbun ringed, the sale, the capital.
export const HadithScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l107 = cues.line(107);
  const l108 = cues.line(108);
  const l109 = cues.line(109);
  const l110 = cues.line(110);
  const l111 = cues.line(111);
  const l112 = cues.line(112);
  const l113 = cues.line(113);
  const text = arrive(frame, l107, 22);
  const ring = interpolate(frame, [cues.word(109, 6), cues.word(109, 6) + 18], [0, 1], CLAMP);
  const top = interpolate(frame, [l110 - 6, l110 + 18], [0, -150], {...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const tilt = interpolate(frame, [l110 + 10, l110 + 50], [0, 1], {...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const scaleIn = arrive(frame, l110, 18) * interpolate(frame, [l111 - 6, l111 + 4], [1, 0], CLAMP);
  return (
    <Paper>
      <div style={{opacity: interpolate(frame, [l110 - 6, l110 + 6], [1, 0], CLAMP)}}>
        <Label at={0} left={MARGIN} top={110} size={40} color={LOOK.paperMuted}>
          1,400 years earlier
        </Label>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 180 + top, textAlign: "center", opacity: text}}>
        <div style={{direction: "rtl", fontFamily: ARABIC_FONT, fontSize: 92, lineHeight: 2.0, color: LOOK.paperInk}}>
          {MATN[0]}{" "}
          <span style={{position: "relative", display: "inline-block"}}>
            {MATN[1]}
            <span
              style={{
                position: "absolute",
                left: -26,
                right: -26,
                top: 18,
                bottom: 2,
                border: `5px solid #b0731c`,
                borderRadius: "50%",
                opacity: ring,
                transform: `scale(${0.9 + 0.1 * ring}) rotate(-3deg)`,
              }}
            />
          </span>{" "}
          {MATN[2]}
        </div>
        <div style={{fontFamily: SERIF, fontSize: 56, color: LOOK.paperInk, marginTop: 10, padding: "0 220px", textWrap: "balance"}}>
          “There are two blessings that many people are deceived into losing: <Mark at={l108} color="#d9a04a">health</Mark> and{" "}
          <Mark at={cues.word(108, 2)} color="#d9a04a">free time</Mark>.”
        </div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, color: LOOK.paperMuted, marginTop: 22}}>
          <span style={{color: LOOK.paperInk}}>Hadith, Sahih</span> · Sahih al-Bukhari 6412, narrated by Ibn ‘Abbas · sunnah.com
        </div>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 640 + top * 0.3, textAlign: "center", opacity: arrive(frame, cues.word(109, 6), 16) * interpolate(frame, [l110 - 6, l110 + 2], [1, 0], CLAMP)}}>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: "#9a5f12"}}>maghbun</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: LOOK.paperInk, marginTop: 6}}>a word from the market: cheated in a sale</div>
      </div>
      {/* the sale: something valuable for a few coins */}
      <div style={{position: "absolute", left: 660, top: 560, opacity: scaleIn}}>
        <svg width={600} height={300}>
          <g transform={`rotate(${tilt * -9} 300 80)`}>
            <line x1={70} x2={530} y1={80} y2={80} stroke={LOOK.paperInk} strokeWidth={5} />
            <rect x={60} y={60} width={120} height={90} rx={10} fill="#d9a04a" transform={`translate(0 ${tilt * 0})`} />
            <circle cx={470} cy={108} r={16} fill={LOOK.paperMuted} />
            <circle cx={500} cy={108} r={16} fill={LOOK.paperMuted} />
          </g>
          <line x1={300} x2={300} y1={80} y2={270} stroke={LOOK.paperInk} strokeWidth={5} />
          <path d="M240 270 L360 270" stroke={LOOK.paperInk} strokeWidth={6} />
        </svg>
        <div style={{textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 36, color: LOOK.paperInk, marginTop: 10}}>selling for far less than it is worth</div>
      </div>
      <Big at={l111} top={600} left={MARGIN} size={110} width={1680} color={LOOK.paperInk} outAt={l112 - 6}>
        Free time is <span style={{fontStyle: "italic", color: "#9a5f12"}}>capital.</span>
      </Big>
      <div style={{position: "absolute", left: MARGIN, top: 600, display: "flex", gap: 80, opacity: arrive(frame, l112, 16) * interpolate(frame, [l113 - 6, l113 + 4], [1, 0], CLAMP)}}>
        {["rest", "sleep", "laughing with family"].map((t, i) => (
          <div key={t} style={{fontFamily: SERIF, fontSize: 76, color: LOOK.paperInk, opacity: arrive(frame, l112 + i * 10, 14)}}>
            {t}
          </div>
        ))}
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 54, color: "#9a5f12", alignSelf: "center", opacity: arrive(frame, cues.word(112, 7), 14)}}>not a loss</div>
      </div>
      <Big at={l113} top={600} left={MARGIN} size={78} width={1680} color={LOOK.paperInk}>
        Loss is time gone, without knowing <span style={{fontStyle: "italic", color: "#9a5f12"}}>what it bought.</span>
      </Big>
    </Paper>
  );
};

// Lines 114–119. A till receipt prints the evening.
export const ReceiptScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l115 = cues.line(115);
  const l116 = cues.line(116);
  const l117 = cues.line(117);
  const l118 = cues.line(118);
  const l119 = cues.line(119);
  const rows: {at: number; left: string; right?: string; strong?: boolean}[] = [
    {at: l115, left: "One evening", right: "2 h 00 min", strong: true},
    {at: l116, left: "You got:"},
    {at: cues.word(117, 0), left: "a few laughs", right: "✓"},
    {at: cues.word(117, 3), left: "two or three useful things", right: "✓"},
    {at: cues.word(117, 9), left: "many reels you can’t remember", right: "?"},
  ];
  const printed = interpolate(frame, [cues.line(114), l117 + 60], [180, 760], CLAMP);
  return (
    <Ground>
      <div
        style={{
          position: "absolute",
          left: 1060,
          top: 110,
          width: 600,
          height: printed,
          overflow: "hidden",
          background: LOOK.paper,
          boxShadow: "0 40px 80px rgba(0,0,0,0.45)",
          transform: "rotate(-2deg)",
          padding: "54px 50px",
          fontFamily: SANS,
          color: LOOK.paperInk,
        }}
      >
        <div style={{textAlign: "center", fontWeight: 800, fontSize: 40, letterSpacing: 2}}>RECEIPT</div>
        <div style={{textAlign: "center", fontWeight: 600, fontSize: 26, color: LOOK.paperMuted, marginTop: 6}}>your time, tonight</div>
        <div style={{borderTop: `3px dashed ${LOOK.paperMuted}`, margin: "26px 0"}} />
        {rows.map((r, i) => (
          <div key={i} style={{display: "flex", justifyContent: "space-between", fontSize: r.strong ? 36 : 32, fontWeight: r.strong ? 800 : 600, marginBottom: 22, opacity: arrive(frame, r.at, 10)}}>
            <span>{r.left}</span>
            <span>{r.right}</span>
          </div>
        ))}
        <div style={{borderTop: `3px dashed ${LOOK.paperMuted}`, margin: "26px 0", opacity: arrive(frame, l119, 10)}} />
        <div style={{fontSize: 32, fontWeight: 800, opacity: arrive(frame, l119, 12)}}>Paid by: you — or your thumb?</div>
      </div>
      <Big at={cues.line(114)} top={260} size={110} width={860}>
        Your receipt
      </Big>
      <Label at={l118} left={MARGIN + 6} top={430} size={50} color={LOOK.ivory} weight={600}>
        Nothing wrong with a trade.
      </Label>
      <div style={{position: "absolute", left: MARGIN, top: 540, width: 860, opacity: arrive(frame, l119, 18), fontFamily: SERIF, fontSize: 84, lineHeight: 1.08, color: LOOK.ivory}}>
        Who made it: <span style={{fontStyle: "italic", color: LOOK.amber}}>you</span>, or your thumb?
      </div>
    </Ground>
  );
};

const Icon = ({kind}: {kind: "bell" | "bed" | "hand"}) => (
  <svg width={200} height={170} viewBox="0 0 200 170" fill="none" stroke={LOOK.ivory} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
    {kind === "bell" && (
      <>
        <path d="M60 120 L140 120 C128 104 128 92 128 74 C128 52 116 38 100 38 C84 38 72 52 72 74 C72 92 72 104 60 120 Z" />
        <path d="M90 134 C94 142 106 142 110 134" />
        <circle cx={140} cy={44} r={14} fill={LOOK.amber} stroke="none" />
      </>
    )}
    {kind === "bed" && (
      <>
        <path d="M20 130 L180 130 M20 90 L20 150 M180 110 L180 150 M20 110 L180 110" />
        <rect x={34} y={80} width={50} height={26} rx={10} />
        <rect x={110} y={64} width={34} height={46} rx={6} stroke={LOOK.amber} />
      </>
    )}
    {kind === "hand" && (
      <>
        <path d="M40 40 L160 40 L150 140 Q100 162 50 140 Z" strokeDasharray="12 9" />
        <path d="M86 20 L86 90 M100 14 L100 88 M114 20 L114 90 M72 40 L72 96 C72 110 82 120 100 120 C118 120 128 110 128 96 L128 40" stroke={LOOK.amber} />
      </>
    )}
  </svg>
);

// Lines 120–125. Catch the trigger, not dopamine. The phone goes grey.
export const TriggerScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l121 = cues.line(121);
  const l122 = cues.line(122);
  const l123 = cues.line(123);
  const l124 = cues.line(124);
  const l125 = cues.line(125);
  const out = interpolate(frame, [l124 - 4, l124 + 8], [1, 0], CLAMP);
  const gray = frame >= cues.word(124, 6);
  const items: {at: number; kind: "bell" | "bed" | "hand"; label: string}[] = [
    {at: cues.word(123, 0), kind: "bell", label: "a notification"},
    {at: cues.word(123, 2), kind: "bed", label: "the phone on the bed"},
    {at: cues.word(123, 6), kind: "hand", label: "bored, hand to the pocket"},
  ];
  return (
    <Ground>
      <div style={{opacity: out}}>
        <Label at={0} left={MARGIN} top={170} size={40}>
          Sepah’s real idea
        </Label>
        <Big at={l121} top={250} size={110} width={1700}>
          Don’t chase dopamine. Catch the <span style={{fontStyle: "italic", color: LOOK.amber}}>trigger.</span>
        </Big>
        <Label at={l122} left={MARGIN + 6} top={510} size={44} color={LOOK.muted}>
          the thing that starts the scroll
        </Label>
        <div style={{position: "absolute", left: MARGIN, top: 600, display: "flex", gap: 120}}>
          {items.map((it) => {
            const a = arrive(frame, it.at, 16);
            return (
              <div key={it.kind} style={{opacity: a, transform: `translateY(${(1 - a) * 20}px)`, width: 420}}>
                <Icon kind={it.kind} />
                <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: LOOK.ivory, marginTop: 12}}>{it.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{opacity: arrive(frame, l124, 18)}}>
        <AbsoluteFill style={{left: 1200, top: 90}}>
          <Phone scroll={interpolate(frame, [l124, l124 + 90], [0, 2.4], CLAMP)} width={380} tiltY={-12} gray={gray} good={[2]} />
        </AbsoluteFill>
        <Label at={l124} left={MARGIN} top={300} size={40}>
          Aza Raskin
        </Label>
        <Big at={l124 + 6} top={370} size={96} width={960}>
          keeps his phone in <span style={{fontStyle: "italic"}}>black and white</span>
        </Big>
        <Label at={l125} left={MARGIN + 6} top={620} size={44} color={LOOK.muted} weight={600}>
          One person’s habit, not research.
        </Label>
        <Label at={cues.word(125, 7)} left={MARGIN + 6} top={690} size={52} color={LOOK.amber} weight={800}>
          Worth a try?
        </Label>
        <Credit at={l124 + 20} tag="His own habit" source="BBC Panorama, 3 July 2018" />
      </div>
    </Ground>
  );
};

// Lines 126–129. The pigeon never knew. You do. The coins are yours to count.
export const EndScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const l127 = cues.line(127);
  const l128 = cues.line(128);
  const l129 = cues.line(129);
  const boxOut = interpolate(frame, [l128 - 4, l128 + 8], [1, 0], CLAMP);
  const coins = Math.floor(interpolate(frame, [cues.word(128, 18), cues.word(128, 18) + 30], [0, 3], CLAMP));
  const machineOut = interpolate(frame, [l129 - 6, l129 + 6], [1, 0], CLAMP);
  return (
    <Ground>
      <div style={{opacity: boxOut}}>
        <AbsoluteFill style={{left: 1000, top: 220, opacity: arrive(frame, 0, 20)}}>
          <SkinnerBox width={640} peck={Math.max(0, Math.sin(frame / 7))} lit />
        </AbsoluteFill>
        <Big at={6} top={300} size={84} width={820}>
          The pigeon never knew who built the box.
        </Big>
        <Big at={l127} top={560} size={150} width={820} color={LOOK.amber} italic>
          You do.
        </Big>
      </div>
      <div style={{opacity: arrive(frame, l128, 18) * machineOut}}>
        <AbsoluteFill style={{left: 1080, top: 180}}>
          <SlotMachine width={560} />
        </AbsoluteFill>
        <Big at={l128 + 6} top={330} size={84} width={860}>
          You can decide how many coins go in.
        </Big>
        <div style={{position: "absolute", left: MARGIN, top: 600, display: "flex", gap: 24}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 90, height: 90, borderRadius: "50%", border: `5px solid ${LOOK.amber}`, opacity: i < coins ? 1 : 0.2}} />
          ))}
        </div>
      </div>
      <div style={{position: "absolute", left: MARGIN, right: MARGIN, top: 330, textAlign: "center", opacity: arrive(frame, l129, 20)}}>
        <div style={{fontFamily: SERIF, fontSize: 132, lineHeight: 1.06, color: LOOK.ivory}}>Your time is your capital.</div>
        <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 132, lineHeight: 1.06, color: LOOK.amber, opacity: arrive(frame, cues.word(129, 4), 18)}}>
          Don’t sell it cheap.
        </div>
      </div>
    </Ground>
  );
};

// Line 130. Subscribe, drawn as our own button (no platform logo), and the comment question.
export const CtaScene = ({cues}: P) => {
  const frame = useCurrentFrame();
  const press = cues.word(130, 10);
  const pressed = frame >= press + 6;
  const a = arrive(frame, 0, 16);
  const cursor = interpolate(frame, [press - 20, press], [260, 0], {...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 3)});
  return (
    <Ground>
      <div style={{position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", opacity: a}}>
        <div style={{fontFamily: SERIF, fontSize: 84, color: LOOK.ivory}}>Was this a good trade?</div>
        <div style={{display: "inline-block", position: "relative", marginTop: 60}}>
          <div
            style={{
              padding: "28px 70px",
              borderRadius: 60,
              border: `4px solid ${LOOK.amber}`,
              background: pressed ? LOOK.amber : "transparent",
              color: pressed ? LOOK.ground : LOOK.amber,
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: 60,
              transform: `scale(${frame >= press && frame < press + 6 ? 0.96 : 1})`,
            }}
          >
            {pressed ? "Subscribed" : "Subscribe"}
          </div>
          <svg style={{position: "absolute", right: -40 - cursor * 0.6, bottom: -50 - cursor * 0.4}} width={60} height={70} viewBox="0 0 60 70">
            <path d="M6 4 L6 56 L20 44 L30 66 L40 62 L30 40 L48 40 Z" fill={LOOK.ivory} stroke={LOOK.ground} strokeWidth={3} />
          </svg>
        </div>
        <div style={{marginTop: 90, opacity: arrive(frame, press + 20, 16), fontFamily: SANS, fontWeight: 700, fontSize: 44, color: LOOK.ivory}}>
          <svg width={52} height={46} viewBox="0 0 52 46" style={{verticalAlign: "middle", marginRight: 18}}>
            <path d="M6 4 H46 V32 H22 L10 42 V32 H6 Z" fill="none" stroke={LOOK.amber} strokeWidth={4} strokeLinejoin="round" />
          </svg>
          What’s your biggest trigger? Tell us in the comments.
        </div>
      </div>
    </Ground>
  );
};

// A small mid-video subscribe note, top right, for 2.5 s after a mini-payoff.
export const MidCta = ({at}: {at: number}) => {
  const frame = useCurrentFrame();
  const a = arrive(frame, at, 14) * interpolate(frame, [at + FPS * 2.5, at + FPS * 2.5 + 8], [1, 0], CLAMP);
  if (a <= 0) return null;
  return (
    <div style={{position: "absolute", right: 90, top: 70, opacity: a, transform: `translateY(${(1 - a) * -12}px)`, display: "flex", alignItems: "center", gap: 18}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: LOOK.ivory}}>more explainers like this</div>
      <div style={{padding: "12px 30px", borderRadius: 40, background: LOOK.amber, color: LOOK.ground, fontFamily: SANS, fontWeight: 800, fontSize: 30}}>Subscribe</div>
    </div>
  );
};
