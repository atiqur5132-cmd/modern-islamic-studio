import {AbsoluteFill, interpolate, useCurrentFrame} from "remotion";
import {Cues} from "../long/scroll/types";
import {ACCENT, ARABIC, arrive, ayahTokens, ayahWords, draw, GROUND, INK, leave, MUTED, PAPER, PAPER_INK, PAPER_MUTED, SANS, SERIF, SIDE, snap, TEXT_TOP} from "./look";
import {Credit, Forward, Label, Line, Moon, Photo, Stars, Strike, Sun} from "./parts";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// Lines 1: the hook. Frame 0 is the cover: the full Moon, the Sun burning beside it, a
// SUN switch set to ON and one line on top. "bujh" flicks the switch and the Sun goes
// black; "aath minute" slams in an 08:20 timer that races down; at 00:00 the Moon dies.
export const Hook = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const off = cues.word(1, 2); // "bujh"
  const timerAt = cues.word(1, 8) - 2; // "aath"
  const darkAt = cues.word(1, 11) + 4; // "bujh jaayega"
  const sun = 1 - snap(frame, off, 3);
  const flip = snap(frame, off, 5);
  const timerIn = snap(frame, timerAt, 6);
  const runFrames = Math.max(1, darkAt - timerAt - 6);
  const left = Math.round(interpolate(frame, [timerAt + 4, timerAt + 4 + runFrames], [500, 0], CLAMP));
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const moon = 1 - interpolate(frame, [darkAt, darkAt + 9], [0, 1], CLAMP);
  const drift = 1 + frame * 0.0005;
  const titleOut = leave(frame, timerAt - 3, 5);
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Stars count={60} seed="hook" />
      <Moon x={665} y={720} d={740 * drift} light={moon} />
      <Sun x={210} y={480} d={330} light={sun} />
      {/* The switch: a flat toggle under the Sun. */}
      <div style={{position: "absolute", left: 150, top: 690, width: 120, height: 200, borderRadius: 26, background: "#232A3A", boxShadow: `inset 0 0 0 3px ${sun > 0.5 ? ACCENT : "#3A4153"}`}}>
        <div style={{position: "absolute", left: 18, top: 18 + 80 * flip, width: 84, height: 84, borderRadius: 20, background: sun > 0.5 ? ACCENT : "#59606F"}} />
      </div>
      <div style={{position: "absolute", left: 96, top: 912, width: 228, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 46, letterSpacing: 1, color: INK}}>
        SUN: <span style={{color: flip > 0.5 ? MUTED : ACCENT}}>{flip > 0.5 ? "OFF" : "ON"}</span>
      </div>
      <div style={{position: "absolute", left: SIDE, right: SIDE, top: TEXT_TOP - 4, fontFamily: SERIF, fontStyle: "italic", fontWeight: 500, fontSize: 84, lineHeight: 1.04, color: INK, opacity: titleOut, textAlign: "left"}}>
        If the Sun went out now…
      </div>
      {frame >= timerAt ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: TEXT_TOP - 30,
            textAlign: "center",
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 150,
            letterSpacing: 2,
            fontVariantNumeric: "tabular-nums",
            color: left === 0 ? MUTED : INK,
            opacity: timerIn,
            transform: `scale(${1.25 - 0.25 * timerIn})`,
          }}
        >
          {mm}:{ss}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Line 2: the dark Moon alone; on "roshni" a hard push in and "No light of its own."; on
// "suraj" the Sun comes back from the left and lights its near half; on "lautata" the
// light scatters off the Moon toward the viewer.
export const NoLight = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const push = cues.word(2, 4); // "roshni"
  const sunAt = cues.word(2, 10) - 4; // "suraj"
  const backAt = cues.word(2, 13); // "lautata"
  const close = frame >= push;
  const lit = arrive(frame, sunAt + 4, 14);
  const sunIn = arrive(frame, sunAt, 14);
  const d = close ? 680 : 560;
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Stars count={40} seed="dark" opacity={0.7} />
      <Moon x={close ? 660 : 600} y={close ? 700 : 720} d={d * (1 + frame * 0.0004)} light={0.03 + 0.97 * lit} side={lit > 0 ? 1 : 0} />
      {/* The sunlight: a broad amber sheet from the left edge to the Moon. */}
      <div style={{position: "absolute", left: 0, top: 360, width: 520, height: 1000, opacity: 0.22 * lit, background: `linear-gradient(90deg, ${ACCENT} 0%, rgba(225,162,74,0) 100%)`, WebkitMaskImage: "linear-gradient(180deg, transparent, black 30%, black 70%, transparent)"}} />
      <Sun x={-60} y={860} d={420} light={sunIn} style={{opacity: sunIn}} />
      {/* Scattered light: thin rays from the lit face toward the viewer. */}
      {[0, 1, 2, 3, 4].map((i) => {
        const t = draw(frame, backAt + i * 2, 14);
        const angle = 115 + i * 13;
        return (
          <div key={i} style={{position: "absolute", left: 326, top: 640 + i * 34, width: 380 * t, height: 3, background: INK, opacity: 0.8 * t, transform: `rotate(${angle}deg)`, transformOrigin: "left center", borderRadius: 2}} />
        );
      })}
      <Line at={push} y={TEXT_TOP} size={92}>No light of its own.</Line>
      <Label at={backAt + 4} x={SIDE} y={TEXT_TOP + 112} color={INK} size={36} weight={600}>sunlight, sent back to you</Label>
      <Credit text="Established science · NASA, “Moonlight”" at={push + 6} />
    </AbsoluteFill>
  );
};

// Line 3: the forward, over the lit Moon pushed back.
export const Claim = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const mark = draw(frame, cues.word(3, 9), 10); // "1400"
  const hit = snap(frame, cues.word(3, 9), 6);
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Stars count={40} seed="claim" opacity={0.6} />
      <Moon x={760} y={420} d={560} light={0.55} side={1} style={{filter: "blur(2px)"}} />
      <div style={{position: "absolute", inset: 0, transform: `scale(${1 + 0.05 * hit})`, transformOrigin: "50% 60%"}}>
        <Forward x={SIDE} y={560} enter={arrive(frame, 0, 16)} mark={mark} />
      </div>
      <Credit text="Viral claim · a forward shared widely" at={10} />
    </AbsoluteFill>
  );
};

// Line 4: 71:16 as fetched, the moon half over the sun half; each half lights as it is
// recited, nur underlined, siraj in amber.
export const Ayah7116 = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const tokens = ayahTokens("71:16");
  const moonAt = cues.word(4, 6);
  const sunAt = cues.word(4, 11);
  const nurAt = cues.word(4, 10);
  const sirajAt = cues.word(4, 14);
  const half = (from: number, to: number) => tokens.filter((t) => t.word !== null && t.word >= from && t.word <= to);
  const row = (from: number, to: number, at: number, mark: number, markAt: number, accent: boolean) => {
    const lit = arrive(frame, at, 10);
    return (
      <div style={{direction: "rtl", textAlign: "center", fontFamily: ARABIC, fontSize: 94, lineHeight: 2.1, color: INK, opacity: 0.38 + 0.62 * lit}}>
        {half(from, to).map((t) => {
          const isMark = t.word === mark;
          const m = isMark ? draw(frame, markAt, 10) : 0;
          return (
            <span key={t.word} style={{position: "relative", color: isMark && accent && m > 0.4 ? ACCENT : INK}}>
              {t.text}
              {isMark && !accent ? <span style={{position: "absolute", right: 0, bottom: 34, height: 5, width: `${m * 100}%`, background: INK, borderRadius: 3}} /> : null}{" "}
            </span>
          );
        })}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Stars count={30} seed="ayah" opacity={0.4} />
      <Line at={2} y={TEXT_TOP} size={64} color={MUTED}>Surah Nuh, 71:16</Line>
      <div style={{position: "absolute", left: SIDE + 130, right: SIDE, top: 430, opacity: arrive(frame, 0, 16)}}>
        {row(1, 4, moonAt, 4, nurAt, false)}
        {row(5, 7, sunAt, 7, sirajAt, true)}
      </div>
      <Moon x={160} y={530} d={96} light={arrive(frame, moonAt, 10)} />
      <Sun x={160} y={727} d={96} light={arrive(frame, sunAt, 10)} style={{opacity: arrive(frame, sunAt, 10)}} />
      <Credit text="Quranic text · Nuh 71:16" at={6} />
    </AbsoluteFill>
  );
};

// Line 5: the Moon is made nur; then the frame splits and the Sun is made siraj, shown as
// the real thing the word names: a clay lamp burning its own oil.
export const NurSiraj = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const nurAt = cues.word(5, 3);
  const splitAt = cues.word(5, 4);
  const sirajAt = cues.word(5, 7);
  const lampAt = cues.word(5, 9);
  const split = snap(frame, splitAt, 8);
  const top = 1920 - 1100 * split; // the lamp half rises to y 820
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Stars count={30} seed="nur" opacity={0.6} />
      <Moon x={540} y={560 - 120 * split} d={620 - 180 * split} light={1} />
      <div style={{position: "absolute", left: SIDE, top: 890 - 230 * split, width: 1080 - 2 * SIDE, textAlign: "center", lineHeight: 1.3, opacity: arrive(frame, nurAt, 12)}}>
        <span style={{fontFamily: ARABIC, fontSize: 110, color: INK, direction: "rtl"}}>{ayahWords("71:16", 4)}</span>
        <span style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: INK, marginLeft: 30}}>nur, light</span>
      </div>
      <div style={{position: "absolute", left: 0, top, width: 1080, height: 1100, overflow: "hidden"}}>
        <div style={{position: "absolute", left: 0, top: -410, width: 1080, height: 1920}}>
          <Photo src="cn-lamp.jpg" fileAspect={4 / 3} focus={[0.66, 0.6]} from={1.0} to={1.08} frames={120} filter={`brightness(${0.8 + 0.25 * arrive(frame, lampAt, 10)})`} />
        </div>
        <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 260, background: `linear-gradient(180deg, ${GROUND} 0%, rgba(21,26,38,0) 100%)`}} />
        <div style={{position: "absolute", left: SIDE, top: 24, lineHeight: 1.3, whiteSpace: "nowrap", opacity: arrive(frame, sirajAt, 12)}}>
          <span style={{fontFamily: ARABIC, fontSize: 110, color: ACCENT}}>{ayahWords("71:16", 7)}</span>
          <span style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 58, color: INK, marginLeft: 26}}>siraj,</span>
          <span style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 58, color: INK, marginLeft: 14, opacity: arrive(frame, lampAt, 12)}}>a burning lamp</span>
        </div>
      </div>
      <Credit text="Quranic context · Nuh 71:16 · Photo: Saral Shots, CC0" at={splitAt + 8} y={1036} />
    </AbsoluteFill>
  );
};

// Line 6: the Saheeh International line on a moon-paper page; "reflected" is marked when
// said, the page pushes in on the second "reflected", and a ring closes round the brackets
// on "bracket".
export const Bracket = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const markAt = cues.word(6, 6);
  const pushAt = cues.word(6, 10);
  const ringAt = cues.word(6, 11);
  const sweep = draw(frame, markAt, 12);
  const push = interpolate(frame, [pushAt, pushAt + 14], [1, 1.42], {...CLAMP, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const ring = draw(frame, ringAt, 14);
  return (
    <AbsoluteFill style={{backgroundColor: PAPER}}>
      <div style={{position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "62% 52%"}}>
        <div style={{position: "absolute", left: SIDE, top: 330, fontFamily: SANS, fontWeight: 700, fontSize: 34, color: PAPER_MUTED, opacity: arrive(frame, 0, 14)}}>English translation, 71:16</div>
        <div style={{position: "absolute", left: SIDE, right: SIDE, top: 420, fontFamily: SERIF, fontWeight: 500, fontSize: 100, lineHeight: 1.16, color: PAPER_INK, textWrap: "balance", opacity: arrive(frame, 2, 16), transform: `translateY(${(1 - arrive(frame, 2, 16)) * 20}px)`}}>
          <span style={{marginLeft: -40}}>“</span>And made the moon therein a{" "}
          <span style={{position: "relative", display: "inline-block", whiteSpace: "nowrap"}}>
            <span style={{position: "absolute", left: -6, right: -6, top: "18%", height: "70%", background: "rgba(29,34,48,0.13)", transform: `scaleX(${sweep})`, transformOrigin: "left center"}} />
            [reflected]
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: "absolute", left: -34, top: -18, width: "calc(100% + 68px)", height: "calc(100% + 36px)", overflow: "visible"}}>
              <ellipse cx={50} cy={52} rx={49} ry={47} fill="none" stroke={PAPER_INK} strokeWidth={6} vectorEffect="non-scaling-stroke" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform="rotate(-2 50 50)" />
            </svg>
          </span>{" "}
          light”
        </div>
      </div>
      <Credit text="Translation · Saheeh International, 71:16 (quran.com)" at={8} paper />
    </AbsoluteFill>
  );
};

// Line 7: the four Arabic words of the moon half with their meanings; "reflected" looks
// for a word above it, finds none, and falls away.
export const NoWord = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const tokens = ayahTokens("71:16").filter((t) => t.word !== null && t.word <= 4);
  const glosses = ["and made", "the moon", "therein", "a light"];
  const inAt = cues.word(7, 3);
  const fallAt = cues.word(7, 5);
  const enter = arrive(frame, inAt, 10);
  const fall = interpolate(frame, [fallAt, fallAt + 14], [0, 1], {...CLAMP, easing: (t) => t * t});
  // Columns right to left, as the Arabic reads.
  const xs = [895, 715, 535, 175];
  return (
    <AbsoluteFill style={{backgroundColor: PAPER}}>
      {tokens.map((t, i) => (
        <div key={t.word} style={{position: "absolute", left: xs[i] - 90, width: 180, top: 520, textAlign: "center", opacity: arrive(frame, i * 2, 12)}}>
          <div style={{fontFamily: ARABIC, fontSize: 84, lineHeight: 1.9, color: PAPER_INK, direction: "rtl"}}>{t.text}</div>
          <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: PAPER_INK, marginTop: 6}}>{glosses[i]}</div>
        </div>
      ))}
      {/* The empty place where "reflected" would need a word. */}
      <div style={{position: "absolute", left: 355 - 60, top: 560, width: 120, height: 120, borderRadius: 16, border: `4px dashed ${PAPER_MUTED}`, opacity: enter * (1 - fall)}} />
      <div style={{position: "absolute", left: 355 - 160, width: 320, top: 800, textAlign: "center", fontFamily: SERIF, fontSize: 56, color: PAPER_MUTED, opacity: enter * (1 - fall), transform: `translateY(${fall * 420}px) rotate(${fall * 14}deg)`}}>[reflected]</div>
      <Credit text="Linguistic observation · the Arabic of 71:16, word by word" at={4} paper />
    </AbsoluteFill>
  );
};

// Line 8: "nur" cannot mean borrowed light (struck on "udhaar"); then 24:35, Allah is
// nur, with the word lit on "nur kehta hai".
export const NurAllah = ({cues}: {cues: Cues}) => {
  const frame = useCurrentFrame();
  const strikeAt = cues.word(8, 4);
  const ayahAt = cues.word(8, 11);
  const nurAt = cues.word(8, 16);
  const onAyah = frame >= ayahAt;
  const tokens = ayahTokens("24:35").filter((t) => t.word !== null && t.word <= 4);
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Stars count={30} seed="nur8" opacity={0.4} />
      {!onAyah ? (
        <>
          <Line at={0} y={520} size={180} align="center">nur</Line>
          <div style={{position: "absolute", left: SIDE, right: SIDE, top: 760, textAlign: "center", opacity: arrive(frame, 6, 14)}}>
            <span style={{position: "relative", display: "inline-block", fontFamily: SERIF, fontStyle: "italic", fontSize: 76, color: INK}}>
              ≠ borrowed light
              <Strike progress={draw(frame, strikeAt, 10)} />
            </span>
          </div>
        </>
      ) : (
        <>
          <div style={{position: "absolute", left: SIDE, right: SIDE, top: 430, direction: "rtl", textAlign: "center", fontFamily: ARABIC, fontSize: 92, lineHeight: 2.1, color: INK, whiteSpace: "nowrap", opacity: arrive(frame, ayahAt, 14)}}>
            {tokens.map((t) => {
              const isNur = t.word === 2;
              const m = isNur ? draw(frame, nurAt, 10) : 0;
              return (
                <span key={t.word} style={{position: "relative", opacity: isNur ? 0.6 + 0.4 * m : 0.85}}>
                  {t.text}
                  {isNur ? <span style={{position: "absolute", right: 0, bottom: 36, height: 5, width: `${m * 100}%`, background: INK, borderRadius: 3}} /> : null}{" "}
                </span>
              );
            })}
          </div>
          <Line at={ayahAt + 6} y={760} size={62} align="center">Allah is the Light of the heavens and the earth.</Line>
          <Credit text="Quranic text · An-Nur 24:35 · Saheeh International" at={ayahAt + 8} />
        </>
      )}
    </AbsoluteFill>
  );
};
