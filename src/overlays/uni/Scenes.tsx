import {useThree} from "@react-three/fiber";
import {ThreeCanvas} from "@remotion/three";
import {useLayoutEffect, useMemo} from "react";
import {AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame} from "remotion";
import * as THREE from "three";
import {UBlocksOverlay, UCoinOverlay, UPhotoOverlay, UShot, UTimelineOverlay, UTitle} from "../../timeline/uniTypes";
import {Cue} from "../falak/common";
import {DrawWhenReady, textureOf, useTextures} from "./Globe3D";
import {ACCENT, arrive, draw, GROUND, INK, leave, MUTED, RAIL, SANS, SERIF, SHADOW, SIDE, TEXT_TOP} from "./look";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// Serif with *starred* words in italic.
export const Words = ({text, color = INK, italicColor}: {text: string; color?: string; italicColor?: string}) => (
  <>
    {text.split("*").map((part, i) => (
      <span key={i} style={{fontStyle: i % 2 ? "italic" : "normal", color: i % 2 && italicColor ? italicColor : color}}>
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

// A line set big on the left margin, with an optional small line under it.
export const Title = ({t, cue, color = INK, italicColor = ACCENT, shadow = true}: {t: UTitle; cue: Cue; color?: string; italicColor?: string; shadow?: boolean}) => {
  const frame = useCurrentFrame();
  const show = arrive(frame, cue(t.at), 16) * (t.until !== undefined ? leave(frame, cue(t.until), 8) : 1);
  if (show <= 0) return null;
  const size = t.size ?? 120;
  return (
    <div style={{position: "absolute", left: t.x ?? SIDE, top: t.y, width: 1080 - (t.x ?? SIDE) - RAIL, opacity: show, transform: `translateY(${(1 - arrive(frame, cue(t.at), 16)) * 20}px)`, textShadow: shadow ? SHADOW : undefined}}>
      {shadow ? <div style={{position: "absolute", left: -(t.x ?? SIDE), top: -size * 0.5, width: 1080, height: size * 2.6, background: `radial-gradient(ellipse 78% 58% at 30% 50%, ${GROUND}E0, ${GROUND}00)`, zIndex: -1}} /> : null}
      <div style={{fontFamily: SERIF, fontSize: size, lineHeight: 0.95, letterSpacing: -1, color}}>
        <Words text={t.text} color={color} italicColor={italicColor} />
      </div>
      {t.sub ? <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 32, marginTop: 16, color, opacity: 0.86}}>{t.sub}</div> : null}
    </div>
  );
};

// The documentary credit: the claim kind first, then the source, small, in sentence case.
export const Credit = ({text, top = TEXT_TOP, color = MUTED, strong = INK, width = 520}: {text: string; top?: number; color?: string; strong?: string; width?: number}) => {
  const [kind, ...rest] = text.split(" · ");
  return (
    <div style={{position: "absolute", left: SIDE, top, width, fontFamily: SANS, fontWeight: 600, fontSize: 24, lineHeight: 1.4, color, textShadow: strong === INK ? SHADOW : undefined}}>
      <span style={{color: strong, fontWeight: 700}}>{kind}</span>
      {rest.length ? ` · ${rest.join(" · ")}` : ""}
    </div>
  );
};

export const shotAt = (shots: UShot[], frame: number, cue: Cue) => {
  let index = 0;
  shots.forEach((s, i) => {
    if (cue(s.at) <= frame) index = i;
  });
  const from = cue(shots[index].at);
  const next = shots[index + 1] ? cue(shots[index + 1].at) : from + 150;
  return {shot: shots[index], since: Math.max(0, frame - from), length: Math.max(1, next - from)};
};

// One still, pushing in slowly about its focus point for the length of the shot.
export const Still = ({shot, since, length, filter, style}: {shot: UShot; since: number; length: number; filter?: string; style?: React.CSSProperties}) => {
  const focus = shot.focus ?? [0.5, 0.5];
  const t = Easing.inOut(Easing.quad)(Math.min(1, since / Math.max(length, 60)));
  const scale = (shot.zoom ?? 1.04) + ((shot.to ?? (shot.zoom ?? 1.04) + 0.06) - (shot.zoom ?? 1.04)) * t;
  return (
    <AbsoluteFill style={{overflow: "hidden", ...style}}>
      <Img
        src={staticFile(`footage/${shot.src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`,
          transform: `scale(${scale})`,
          transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`,
          filter: filter ?? "saturate(0.92) contrast(1.04)",
        }}
      />
    </AbsoluteFill>
  );
};

// Real photos filling the frame (or behind the corner circle).
export const UPhoto = ({o, cue}: {o: UPhotoOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const {shot, since, length} = shotAt(o.shots, frame, cue);
  const drain = o.drain ? interpolate(frame, [cue(o.drain.at), cue(o.drain.at) + o.drain.over * 30], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.quad)}) : 0;
  const saturation = 0.92 - drain * (0.92 - (o.drain?.to ?? 0.12));
  const brightness = 1 - drain * 0.18 - (o.dim ?? 0);
  const filter = `saturate(${saturation}) contrast(1.05) brightness(${brightness})${o.quote ? " blur(10px)" : ""}`;
  let counter = null;
  if (o.counter) {
    const c = o.counter;
    const p = interpolate(frame, [cue(c.at), cue(c.at) + c.over * 30], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
    const value = Math.round(c.from + (c.to - c.from) * p);
    const done = p >= 1;
    const show = arrive(frame, cue(c.at) - 6, 10);
    counter = (
      <div style={{position: "absolute", left: SIDE, top: c.y, opacity: show, textShadow: SHADOW, fontFamily: SERIF, color: INK, lineHeight: 1}}>
        <span style={{fontSize: 96, fontStyle: "italic", opacity: done && c.prefix ? 1 : 0, marginRight: 10}}>{c.prefix}</span>
        <span style={{fontSize: 260, letterSpacing: -4, fontVariantNumeric: "tabular-nums"}}>{value}</span>
        <span style={{fontSize: 96, marginLeft: 14, opacity: done ? 1 : 0.7}}>{c.suffix}</span>
      </div>
    );
  }
  let quote = null;
  if (o.quote) {
    const q = o.quote;
    const show = arrive(frame, cue(q.at), 18);
    const markAt = q.mark ? cue(q.mark.at) : Infinity;
    const sweep = draw(frame, markAt, 14);
    const parts = q.mark ? q.text.split(q.mark.text) : [q.text];
    quote = (
      <div style={{position: "absolute", left: SIDE, top: q.y, width: 1080 - SIDE - RAIL + 30, opacity: show, transform: `translateY(${(1 - show) * 22}px)`}}>
        <div style={{fontFamily: SERIF, fontSize: 92, lineHeight: 1.04, color: INK, textShadow: SHADOW, textIndent: -36}}>
          “{parts[0]}
          {q.mark ? (
            <span style={{backgroundImage: `linear-gradient(${ACCENT}, ${ACCENT})`, backgroundRepeat: "no-repeat", backgroundSize: `${sweep * 100}% 0.34em`, backgroundPosition: "0 82%", fontStyle: "italic"}}>
              {q.mark.text}
            </span>
          ) : null}
          {parts[1] ?? ""}”
        </div>
      </div>
    );
  }
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <Still key={`${shot.src}-${shot.at}`} shot={shot} since={since} length={length} filter={filter} />
      <AbsoluteFill style={{background: `linear-gradient(${GROUND}B3 0%, ${GROUND}00 32%, ${GROUND}00 62%, ${GROUND}99 100%)`}} />
      {o.quote ? <AbsoluteFill style={{backgroundColor: `${GROUND}8C`}} /> : null}
      {counter}
      {quote}
      {(o.titles ?? []).map((t, i) => (
        <Title key={i} t={t} cue={cue} />
      ))}
      {o.credit ? <Credit text={o.credit} top={o.creditY ?? TEXT_TOP} width={o.type === "uphotopip" && o.creditY === undefined ? 430 : 820} /> : null}
    </AbsoluteFill>
  );
};

// A real coin in 3D: its photo on both faces, a metal rim, spinning in and settling face on.
const Coin = ({src, spin, tilt, metal}: {src: string; spin: number; tilt: number; metal: "gold" | "silver"}) => {
  const face = textureOf(`footage/${src}`);
  const rim = metal === "gold" ? "#C9A24B" : "#B8B8B4";
  const materials = useMemo(() => {
    const side = new THREE.MeshStandardMaterial({color: rim, metalness: 0.85, roughness: 0.32});
    const top = new THREE.MeshStandardMaterial({map: face, metalness: 0.35, roughness: 0.45, transparent: true});
    return [side, top, top];
  }, [face, rim]);
  const geometry = useMemo(() => new THREE.CylinderGeometry(1, 1, 0.09, 96, 1, false), []);
  return (
    <group rotation={[tilt, spin, 0]}>
      <mesh geometry={geometry} material={materials} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
};

export const UCoin = ({o, cue}: {o: UCoinOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const {ready, release} = useTextures([`footage/${o.src}`]);
  const at = cue(o.at);
  const t = interpolate(frame, [at, at + 18], [0, 1], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const out = leave(frame, cue(o.end) - 7, 7);
  const spin = (1 - t) * Math.PI * 4 + Math.sin(frame * 0.05) * 0.14;
  const tilt = -0.18 + Math.cos(frame * 0.04) * 0.06;
  const box = o.size * 1.5;
  const labelShow = arrive(frame, at + 16, 14) * out;
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div style={{position: "absolute", left: o.x - box / 2, top: o.y - box / 2 + (1 - t) * 160, width: box, height: box, opacity: Math.min(1, t * 3) * out, transform: `scale(${0.7 + 0.3 * t})`}}>
        <ThreeCanvas width={box} height={box} gl={{alpha: true, antialias: true}} camera={{fov: 30, position: [0, 0, 5.6]}} style={{position: "absolute", inset: 0}}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[-3, 4, 5]} intensity={2.4} />
          <pointLight position={[3, -2, 4]} intensity={8} distance={20} color="#FFE8C8" />
          {ready ? <Coin src={o.src} spin={spin} tilt={tilt} metal={o.metal} /> : null}
          <DrawWhenReady ready={ready} onDrawn={release} />
        </ThreeCanvas>
      </div>
      {o.label ? (
        <div style={{position: "absolute", left: o.x - 260, width: 520, top: o.y + o.size / 2 + 28, textAlign: "center", fontFamily: SANS, fontWeight: 600, fontSize: 26, lineHeight: 1.35, color: INK, opacity: labelShow, textShadow: SHADOW, whiteSpace: "pre-line"}}>
          {o.label}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// The viharas as a model (illustrative, not the site plan): rows of brick blocks, each lit
// from inside; on `darkAt` they go out one after another until only `keep` remain.
const Blocks = ({count, keep, dark, orbit}: {count: number; keep: number; dark: number; orbit: number}) => {
  const cols = 8;
  const rows = Math.ceil(count / cols);
  // The two left lit, near the middle of the rows (which two is not known: illustrative).
  const kept = useMemo(() => new Set([35, 53].slice(0, keep)), [keep]);
  const order = useMemo(() => Array.from({length: count}, (_, i) => random(`order-${i}`)), [count]);
  const box = useMemo(() => new THREE.BoxGeometry(1, 0.62, 0.8), []);
  const camPos: [number, number, number] = [Math.sin(orbit) * 9, 23, Math.cos(orbit) * 21];
  return (
    <>
      <PerspectiveRig position={camPos} />
      <hemisphereLight args={["#FFE9D2", "#2A1D15", 0.55]} />
      <directionalLight position={[-6, 10, 6]} intensity={1.6} color="#FFE3C4" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.31, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#2A1F18" roughness={1} />
      </mesh>
      {Array.from({length: count}, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const x = (c - (cols - 1) / 2) * 1.32;
        const z = (r - (rows - 1) / 2) * 1.18;
        const off = kept.has(i) ? 0 : Math.min(1, Math.max(0, (dark - order[i] * 0.75) / 0.25));
        const glow = 1 - off;
        return (
          <mesh key={i} geometry={box} position={[x, 0, z]}>
            <meshStandardMaterial
              color={new THREE.Color("#8E4D31").lerp(new THREE.Color("#54433A"), off)}
              emissive={new THREE.Color(kept.has(i) ? ACCENT : "#E39457")}
              emissiveIntensity={(kept.has(i) ? 1.1 : 0.75) * glow}
              roughness={0.85}
            />
          </mesh>
        );
      })}
    </>
  );
};

const PerspectiveRig = ({position}: {position: [number, number, number]}) => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.fov = 34;
    c.position.set(...position);
    c.lookAt(0, -1.2, 1.2);
    c.updateProjectionMatrix();
  }, [camera, position]);
  return null;
};

export const UBlocks = ({o, cue}: {o: UBlocksOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const darkAt = cue(o.darkAt);
  const dark = interpolate(frame, [darkAt, darkAt + 16], [0, 1], CLAMP);
  const orbit = -0.35 + frame * 0.006;
  const countShow = arrive(frame, 2, 14) * leave(frame, darkAt + 6, 8);
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <ThreeCanvas width={1080} height={1920} gl={{antialias: true}} camera={{fov: 34, position: [0, 9, 9]}} style={{position: "absolute", inset: 0}}>
        <color attach="background" args={[GROUND]} />
        <fog attach="fog" args={[GROUND, 26, 60]} />
        <Blocks count={o.count} keep={o.keep} dark={dark} orbit={orbit} />
      </ThreeCanvas>
      <div style={{position: "absolute", left: SIDE, top: 330, opacity: countShow, textShadow: SHADOW}}>
        <div style={{fontFamily: SERIF, fontSize: 150, lineHeight: 1, color: INK}}>{o.count} <span style={{fontSize: 90, fontStyle: "italic"}}>viharas</span></div>
      </div>
      <Title t={o.line} cue={cue} />
      <Credit text={o.credit} width={820} />
    </AbsoluteFill>
  );
};

// Two paths across a floor seen in perspective. The broken one runs from its first year
// and crumbles at its last; the running one draws on to today while the camera tracks it.
export const UTimeline = ({o, cue}: {o: UTimelineOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const Y0 = 400;
  const PX = 1.15; // floor pixels a year
  const X = (year: number) => 160 + (year - Y0) * PX;
  const W = X(2100);
  const b = o.broken;
  const r = o.running;
  const bp = interpolate(frame, [cue(b.at), cue(b.at) + 30], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.quad)});
  const rp = interpolate(frame, [cue(r.at), cue(r.until)], [0, 1], {...CLAMP, easing: Easing.inOut(Easing.cubic)});
  const crumble = interpolate(frame, [cue(b.at) + 30, cue(b.at) + 48], [0, 1], CLAMP);
  const bEnd = b.from + (b.to - b.from) * bp;
  const rEnd = r.from + (r.to - r.from) * rp;
  // The camera follows the running head, keeping it about a third in from the right.
  const camX = Math.max(0, X(rEnd) - 760);
  const ticks = [1000, 2000];
  const yB = 430;
  const yR = 760;
  return (
    <AbsoluteFill style={{backgroundColor: GROUND}}>
      <div style={{position: "absolute", left: 0, top: 380, width: 1080, height: 1300, perspective: 1300, perspectiveOrigin: "540px 0px", overflow: "hidden"}}>
        <div style={{position: "absolute", left: -camX, top: 0, width: W, height: 1300, transformOrigin: `${camX + 540}px 650px`, transform: "rotateX(46deg)"}}>
          <svg width={W} height={1300} style={{position: "absolute", left: 0, top: 0}}>
            {/* Fine floor grid, every century. */}
            {Array.from({length: 18}, (_, i) => 400 + i * 100).map((year) => (
              <line key={year} x1={X(year)} x2={X(year)} y1={300} y2={1100} stroke={INK} strokeOpacity={ticks.includes(year) ? 0.22 : 0.07} strokeWidth={ticks.includes(year) ? 3 : 2} />
            ))}
            {ticks.map((year) => (
              <text key={`t${year}`} x={X(year) + 12} y={1020} fill={INK} fillOpacity={0.6} fontFamily={SERIF} fontSize={72}>
                {year}
              </text>
            ))}
            {/* The broken path: drawn, then its last stretch crumbles into pieces. */}
            <line x1={X(b.from)} x2={X(Math.min(bEnd, b.to - 120 * crumble))} y1={yB} y2={yB} stroke={INK} strokeWidth={20} strokeLinecap="round" opacity={bp > 0 ? 0.9 : 0} />
            {crumble > 0
              ? Array.from({length: 9}, (_, i) => {
                  const x = X(b.to - 120 + i * 14) + i * 3;
                  const fall = crumble * (20 + random(`f${i}`) * 70);
                  return <rect key={i} x={x} y={yB - 8 + fall} width={22} height={16} fill={INK} opacity={0.9 * (1 - crumble * (0.4 + random(`o${i}`) * 0.6))} transform={`rotate(${crumble * (random(`r${i}`) * 60 - 30)} ${x} ${yB})`} />;
                })
              : null}
            <text x={X(b.from)} y={yB - 50} fill={INK} fontFamily={SERIF} fontSize={92} opacity={arrive(frame, cue(b.at), 12)}>
              {b.name} <tspan fontFamily={SANS} fontWeight={600} fontSize={40} fillOpacity={0.7}>{b.from}</tspan>
            </text>
            {crumble > 0.4 ? (
              <text x={X(b.to) - 40} y={yB + 90} fill={INK} fillOpacity={0.7} fontFamily={SANS} fontWeight={600} fontSize={40} opacity={arrive(frame, cue(b.at) + 40, 12)}>
                c. {b.to}
              </text>
            ) : null}
            {/* The running path, in the accent, with its light at the head. */}
            <line x1={X(r.from)} x2={X(rEnd)} y1={yR} y2={yR} stroke={ACCENT} strokeWidth={22} strokeLinecap="round" opacity={rp > 0 ? 1 : 0} />
            {rp > 0 ? <circle cx={X(rEnd)} cy={yR} r={22} fill={INK} /> : null}
            <text x={X(r.from)} y={yR - 54} fill={INK} fontFamily={SERIF} fontSize={92} opacity={arrive(frame, cue(r.at) - 6, 12)}>
              {r.name} <tspan fontFamily={SANS} fontWeight={600} fontSize={40} fillOpacity={0.7}>{r.from}</tspan>
            </text>
            {rp >= 0.98 ? (
              <text x={X(r.to) - 30} y={yR + 100} fill={ACCENT} fontFamily={SANS} fontWeight={700} fontSize={44}>
                {r.to}
              </text>
            ) : null}
          </svg>
        </div>
      </div>
      <AbsoluteFill style={{background: `linear-gradient(${GROUND} 0%, ${GROUND}00 40%, ${GROUND}00 85%, ${GROUND} 100%)`}} />
      <Title t={o.title} cue={cue} />
      {o.credit ? <Credit text={o.credit} width={430} /> : null}
    </AbsoluteFill>
  );
};
