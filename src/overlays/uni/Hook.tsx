import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {GlobeKey, UGlobeOverlay, UStackOverlay, UWallOverlay} from "../../timeline/uniTypes";
import {Cue} from "../falak/common";
import {STACK_HEIGHT} from "../yawm/look";
import {camAt, cameraFor, cardFrame, Globe3D, projectPlace, riseAt, routePoints} from "./Globe3D";
import {Credit, shotAt, Still, Title} from "./Scenes";
import {ACCENT, arrive, draw, GROUND, INK, leave, MUTED, PAPER, RAIL, SANS, SERIF, SHADOW, SIDE, WALL_INK} from "./look";
import {ARABIC} from "../kasawna/look";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const BOARD_H = 1920 - STACK_HEIGHT;

// Serif with *starred* words in italic.
const Line = ({text, size, color = INK, italicColor}: {text: string; size: number; color?: string; italicColor?: string}) => (
  <>
    {text.split("*").map((part, i) => (
      <span key={i} style={{fontFamily: SERIF, fontStyle: i % 2 ? "italic" : "normal", color: i % 2 && italicColor ? italicColor : color}}>
        {part.split("\n").map((piece, j) => (
          <span key={j}>
            {j > 0 ? <br /> : null}
            {piece}
          </span>
        ))}
      </span>
    ))}
  </>
);

const Photo = ({src, focus = [0.5, 0.5], scale = 1, x = 0, style}: {src: string; focus?: [number, number]; scale?: number; x?: number; style?: React.CSSProperties}) => (
  <div style={{position: "absolute", overflow: "hidden", ...style}}>
    <Img
      src={staticFile(`footage/${src}`)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`,
        transform: `translateX(${x}px) scale(${scale})`,
        transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`,
        filter: "saturate(0.92) contrast(1.04)",
      }}
    />
  </div>
);

// The place a card or pin names, small, on the picture.
const PlaceTag = ({name, sub, style, opacity = 1}: {name: string; sub?: string; style?: React.CSSProperties; opacity?: number}) => (
  <div style={{position: "absolute", opacity, textShadow: SHADOW, ...style}}>
    <div style={{fontFamily: SERIF, fontSize: 64, lineHeight: 1, color: INK}}>{name}</div>
    {sub ? <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 28, marginTop: 8, color: INK, opacity: 0.82}}>{sub}</div> : null}
  </div>
);

// The globe on the board turns from the Atlantic towards Asia while the pins rise.
const SPIN_KEYS: GlobeKey[] = [
  {at: 0, lat: 16, lon: 0, alt: 2.9, y: 110},
  {at: 0.05, lat: 24, lon: 48, alt: 2.6, y: 110, move: 1.4},
];

// The board under the speaker.
export const UStack = ({o, cue}: {o: UStackOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const top = STACK_HEIGHT;

  if (o.mode === "faceoff") {
    // The two prints fly in from the sides and press against each other; a crack runs down
    // between them while they push.
    const hit = cue(o.start) + 9;
    const inL = interpolate(frame, [cue(o.start), hit], [-640, 0], {...CLAMP, easing: Easing.in(Easing.cubic)});
    const push = frame >= hit ? Math.sin((frame - hit) * 0.9) * Math.max(0, 6 - (frame - hit) * 0.12) : 0;
    const shake = frame >= hit ? interpolate(frame, [hit, hit + 3, hit + 8], [0, 14, 0], CLAMP) : 0;
    const crack = draw(frame, hit + 2, 14);
    const lineIn = arrive(frame, cue(o.start) + 2, 14);
    const w = 452;
    const h = 600;
    // Inside the board: the cards' top edge, under the line.
    const cardTop = 150;
    const crackPath = "M540,0 L528,70 L552,128 L532,196 L556,262 L530,330 L548,402 L534,470 L550,540 L540,600";
    return (
      <AbsoluteFill style={{top, height: BOARD_H, backgroundColor: GROUND, overflow: "hidden"}}>
        <div style={{position: "absolute", left: SIDE, top: 26, fontSize: 70, lineHeight: 1.05, opacity: lineIn, transform: `translateY(${(1 - lineIn) * 18}px)`}}>
          <Line text={`${o.left!.label ?? ""} *or* ${o.right!.label ?? ""}?`} size={70} italicColor={MUTED} />
        </div>
        <div style={{position: "absolute", left: 0, top: cardTop, width: 1080, height: h, transform: `translateX(${shake * (frame % 2 ? 1 : -1)}px)`}}>
          <div style={{position: "absolute", left: 540 - w + 6 + inL - push, top: 0, width: w, height: h, transform: "rotate(-2.5deg)", boxShadow: "0 24px 50px rgba(0,0,0,0.45)", border: `14px solid ${INK}`, boxSizing: "border-box", overflow: "hidden"}}>
            <Photo src={o.left!.src} focus={o.left!.focus} style={{inset: 0}} />
          </div>
          <div style={{position: "absolute", left: 540 - 6 - inL + push, top: 12, width: w, height: h, transform: "rotate(2.5deg)", boxShadow: "0 24px 50px rgba(0,0,0,0.45)", border: `14px solid ${INK}`, boxSizing: "border-box", overflow: "hidden"}}>
            <Photo src={o.right!.src} focus={o.right!.focus} style={{inset: 0}} />
          </div>
          <svg width={1080} height={h} style={{position: "absolute", left: 0, top: 0}}>
            <path d={crackPath} fill="none" stroke={GROUND} strokeWidth={10} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} />
            <path d={crackPath} fill="none" stroke={INK} strokeWidth={3} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - crack} opacity={0.85} />
          </svg>
        </div>
      </AbsoluteFill>
    );
  }

  if (o.mode === "photo") {
    // Real photos in the board, cutting on their words, with names set on them and rings
    // drawn round what is being named.
    const {shot, since, length} = shotAt(o.shots ?? [], frame, cue);
    return (
      <AbsoluteFill style={{top, height: BOARD_H, backgroundColor: GROUND, overflow: "hidden"}}>
        <Still key={`${shot.src}-${shot.at}`} shot={shot} since={since} length={length} />
        <AbsoluteFill style={{background: `linear-gradient(${GROUND}99 0%, ${GROUND}00 30%, ${GROUND}00 70%, ${GROUND}88 100%)`}} />
        <svg width={1080} height={BOARD_H} style={{position: "absolute", left: 0, top: 0}}>
          {(o.rings ?? []).map((r, i) => {
            const lastShot = (o.shots ?? []).filter((x) => cue(x.at) <= cue(r.at)).pop();
            if (cue(r.at) > frame || lastShot?.src !== shot.src) return null;
            const d = `M ${r.x + r.rx} ${r.y} A ${r.rx} ${r.ry} 0 1 1 ${r.x + r.rx - 0.1} ${r.y - 6}`;
            const t = draw(frame, cue(r.at), 12);
            return (
              <g key={i}>
                <path d={d} fill="none" stroke={GROUND} strokeOpacity={0.5} strokeWidth={14} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
                <path d={d} fill="none" stroke={ACCENT} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - t} />
              </g>
            );
          })}
        </svg>
        {(o.labels ?? []).map((l, i) => {
          // A label belongs to the photo on screen when it was set.
          const onShot = (o.shots ?? []).filter((x) => cue(x.at) <= cue(l.at)).pop()?.src === shot.src;
          const show = onShot ? arrive(frame, cue(l.at), 14) : 0;
          return show > 0 ? (
            <div key={i} style={{position: "absolute", left: l.x, top: l.y, opacity: show, transform: `translateY(${(1 - show) * 16}px)`, fontFamily: SERIF, fontSize: 84, lineHeight: 1, color: INK, textShadow: SHADOW}}>
              <Line text={l.text} size={84} italicColor={INK} />
            </div>
          ) : null;
        })}
        {o.credit ? <Credit text={o.credit} top={16} width={820} /> : null}
      </AbsoluteFill>
    );
  }

  if (o.mode === "page") {
    // A name on paper, with where it comes from; a coin spins in beside it (UCoin).
    const pg = o.page!;
    const nameIn = arrive(frame, cue(o.start) + 2, 16);
    const arIn = arrive(frame, cue(o.start) + 8, 16);
    const creditIn = arrive(frame, cue(o.start) + 14, 14);
    return (
      <AbsoluteFill style={{top, height: BOARD_H, backgroundColor: GROUND, overflow: "hidden"}}>
        <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 396, backgroundColor: PAPER, boxShadow: "0 18px 40px rgba(0,0,0,0.35)"}}>
          <AbsoluteFill style={{background: "radial-gradient(ellipse at 40% 30%, rgba(255,255,255,0.35), rgba(80,50,20,0.16))"}} />
        </div>
        <div style={{position: "absolute", left: SIDE, top: 40, opacity: nameIn, transform: `translateY(${(1 - nameIn) * 18}px)`, fontFamily: SERIF, fontSize: 112, lineHeight: 1, color: WALL_INK}}>
          {pg.name}
        </div>
        {pg.arabic ? (
          <div style={{position: "absolute", left: SIDE, top: 150, opacity: arIn, fontFamily: ARABIC, fontSize: 64, lineHeight: 1.7, color: WALL_INK, direction: "rtl"}}>
            {pg.arabic}
          </div>
        ) : null}
        <div style={{position: "absolute", left: 0, top: 284, opacity: creditIn}}>
          <Credit text={pg.credit} top={0} color="#6E5A47" strong={ACCENT} width={600} />
        </div>
      </AbsoluteFill>
    );
  }

  // "open": two photos side by side with the hook line, then the turning globe.
  const globeAt = o.globeAt !== undefined ? cue(o.globeAt) : Infinity;
  const onGlobe = frame >= globeAt;
  const drift = Math.max(0, frame - cue(o.start) + 20);
  const cam = camAt(SPIN_KEYS, frame - globeAt, (s) => s * 30);
  const pins = (o.pins ?? []).map((p) => ({place: p.place, rise: riseAt(frame, cue(p.at))}));
  return (
    <AbsoluteFill style={{top, height: BOARD_H, backgroundColor: GROUND, overflow: "hidden"}}>
      {onGlobe ? (
        <Globe3D scene={{cam, pins, patches: []}} width={1080} height={BOARD_H} />
      ) : (
        <>
          <Photo src={o.left!.src} focus={o.left!.focus} scale={1.1 + drift * 0.0012} x={-drift * 0.5} style={{left: 0, top: 0, width: 535, height: BOARD_H}} />
          <Photo src={o.right!.src} focus={o.right!.focus} scale={1.1 + drift * 0.0012} x={drift * 0.5} style={{left: 545, top: 0, width: 535, height: BOARD_H}} />
          {o.left!.label ? <PlaceTag name={o.left!.label} sub="Bihar, India" style={{left: SIDE - 40, top: 360}} /> : null}
          {o.right!.label ? <PlaceTag name={o.right!.label} sub="Fez, Morocco" style={{left: 585, top: 360}} /> : null}
        </>
      )}
      {/* The line sits on a soft fall of the ground colour so it reads over any picture. */}
      <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 300, background: `linear-gradient(${GROUND}E6, ${GROUND}00)`}} />
      {o.line ? (
        <div style={{position: "absolute", left: SIDE - 40, top: 22, width: 1080 - SIDE - RAIL + 40, fontSize: 96, lineHeight: 0.98, letterSpacing: -1, textShadow: SHADOW}}>
          <Line text={o.line} size={96} italicColor={INK} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// The globe filling the frame, the camera flying between the places as they are named.
export const UGlobe = ({o, cue}: {o: UGlobeOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const cam = camAt(o.keys, frame, cue);
  const before = camAt(o.keys, frame - 1, cue);
  const camera = cameraFor(cam, 1080, 1920);
  // Motion blur from how far the looked-at point moved since the last frame (degrees).
  const moved = Math.hypot(cam.lat - before.lat, (cam.lon - before.lon) * Math.cos((cam.lat * Math.PI) / 180));
  const blur = Math.min(16, Math.max(0, (moved / Math.max(cam.alt, 0.3) - 1.2) * 2.2));
  const cards = (o.cards ?? []).map((card) => ({card, flip: riseAt(frame, cue(card.at), card.flip ?? 11)}));
  // A pin steps down as its print stands up on the same spot, so it never shows in front.
  const pins = (o.pins ?? []).map((p) => {
    const card = cards.find((c) => c.card.place[0] === p.place[0] && c.card.place[1] === p.place[1]);
    return {place: p.place, rise: riseAt(frame, cue(p.at), 10) * (1 - (card?.flip ?? 0))};
  });
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <AbsoluteFill style={{filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined}}>
        <Globe3D scene={{cam, cards, pins}} width={1080} height={1920} />
      </AbsoluteFill>
      {(o.labels ?? []).map((label, i) => {
        const card = cards.find((c) => c.card.place[0] === label.place[0] && c.card.place[1] === label.place[1]);
        const show = arrive(frame, cue(label.at), 14) * (label.until !== undefined ? leave(frame, cue(label.until), 6) : 1);
        if (show <= 0) return null;
        // Over a standing card the name sits above its top-left corner; over a bare pin,
        // above the pin's head.
        let left: number;
        let bottom: number;
        if (card) {
          if (!projectPlace(camera, 1080, 1920, label.place, 0.0012).visible) return null;
          const f = cardFrame(card.card, camera.position);
          const corner = f.anchor
            .clone()
            .add(f.y.clone().multiplyScalar(card.card.height))
            .sub(f.x.clone().multiplyScalar(f.width / 2))
            .project(camera);
          left = ((corner.x + 1) / 2) * 1080;
          bottom = ((1 - corner.y) / 2) * 1920 - 22;
        } else {
          const p = projectPlace(camera, 1080, 1920, label.place, label.lift ?? 0.03);
          if (!p.visible) return null;
          left = p.x - 30;
          bottom = label.side === "below" ? p.y + 150 : p.y - 30;
        }
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: Math.min(Math.max(left, SIDE), 1080 - RAIL - 420),
              bottom: 1920 - bottom,
              opacity: show,
              transform: `translateY(${(1 - show) * 16}px)`,
              textShadow: SHADOW,
            }}
          >
            <div style={{fontFamily: SERIF, fontSize: 72, lineHeight: 1, color: INK}}>{label.text}</div>
            {label.sub ? <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 30, marginTop: 10, color: INK, opacity: 0.85}}>{label.sub}</div> : null}
            <div style={{width: 64, height: 4, backgroundColor: ACCENT, marginTop: 14}} />
          </div>
        );
      })}
      {(o.routes ?? []).map((route, i) => {
        const pts = routePoints(route.points);
        const p = interpolate(frame, [cue(route.at), cue(route.at) + route.draw * 30], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.quad)});
        if (p <= 0) return null;
        const upTo = Math.max(1, Math.round((pts.length - 1) * p));
        let d = "";
        let pen = false;
        let head: {x: number; y: number} | null = null;
        for (let k = 0; k <= upTo; k++) {
          const q = projectPlace(camera, 1080, 1920, pts[k], 0.002);
          if (!q.visible) {
            pen = false;
            continue;
          }
          d += `${pen ? "L" : "M"}${q.x.toFixed(1)},${q.y.toFixed(1)} `;
          pen = true;
          head = q;
        }
        return (
          <svg key={`r${i}`} width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
            <path d={d} fill="none" stroke={GROUND} strokeOpacity={0.55} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
            <path d={d} fill="none" stroke={ACCENT} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={route.dash ? "16 14" : undefined} />
            {head && p < 1 ? <circle cx={head.x} cy={head.y} r={11} fill={INK} /> : null}
          </svg>
        );
      })}
      {(o.titles ?? []).map((t, i) => (
        <Title key={`t${i}`} t={t} cue={cue} />
      ))}
      {o.credit ? <Credit text={o.credit} width={o.type === "uglobepip" ? 430 : 820} /> : null}
    </AbsoluteFill>
  );
};

// Words in the clear wall above the cap: two small prints and a line; then a question
// takes the line's place over each print.
export const UWall = ({o, cue}: {o: UWallOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const lineAt = o.line ? cue(o.line.at) : cue(o.start) + 2;
  const qAt = o.questions?.length ? cue(o.questions[0].at) : Infinity;
  const cardsIn = arrive(frame, lineAt - 4, 16);
  const split = interpolate(frame, [qAt, qAt + 16], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const lineShow = arrive(frame, lineAt, 14) * leave(frame, qAt - 2, 8);
  const cw = 230;
  const ch = 172;
  const y = 372;
  const xs = [SIDE + split * 0, SIDE + cw + 24 + split * (1080 - RAIL - cw - (SIDE + cw + 24))];
  return (
    <AbsoluteFill>
      {o.line ? (
        <div style={{position: "absolute", left: SIDE, top: 226, fontSize: 92, lineHeight: 1, opacity: lineShow, transform: `translateY(${(1 - arrive(frame, lineAt, 14)) * 16}px)`}}>
          <Line text={o.line.text} size={92} color={WALL_INK} italicColor={ACCENT} />
        </div>
      ) : null}
      {o.cards.map((card, i) => {
        const q = o.questions?.[i];
        const qShow = q ? arrive(frame, cue(q.at) + i * 4, 14) : 0;
        return (
          <div key={card.src}>
            <div
              style={{
                position: "absolute",
                left: xs[i],
                top: y,
                width: cw,
                height: ch,
                border: `8px solid ${INK}`,
                boxSizing: "border-box",
                boxShadow: "0 14px 30px rgba(0,0,0,0.3)",
                overflow: "hidden",
                opacity: cardsIn,
                transform: `translateY(${(1 - cardsIn) * -40}px) rotate(${i ? 2 : -2}deg)`,
              }}
            >
              <Photo src={card.src} style={{inset: 0}} />
            </div>
            {q ? (
              <div
                style={{
                  position: "absolute",
                  left: xs[i],
                  top: 232,
                  width: 420,
                  opacity: qShow,
                  transform: `translateY(${(1 - qShow) * 14}px)`,
                }}
              >
                <div style={{fontFamily: SERIF, fontStyle: "italic", fontSize: 72, lineHeight: 1, color: WALL_INK}}>{q.text}</div>
                <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, marginTop: 10, color: ACCENT}}>{card.name}</div>
              </div>
            ) : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
