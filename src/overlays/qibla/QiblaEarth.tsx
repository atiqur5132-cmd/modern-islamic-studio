import {ReactNode} from "react";
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {QGlobeOverlay} from "../../timeline/qiblaTypes";
import {Cue} from "../falak/common";
import {EarthState, mixState, mixView, place, project, View, viewAt} from "./earth";
import {Earth3D} from "./Earth3D";
import {ANCHORAGE, arrive, greatCircle, INK, KAABA, LatLon, mercY, PAPER, QIBLA, SANS, SIDE, TEXT_TOP, WASHINGTON} from "./look";
import {Chip, Dial, land, Pin, Stamp, Tag} from "./parts";

const CLAMP = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const ease = Easing.inOut(Easing.cubic);
const between = (frame: number, a: number, b: number, e = ease) => interpolate(frame, [a, b], [0, 1], {...CLAMP, easing: e});

// The shapes the surface takes, all centred on the Atlantic.
export const ATLANTIC = -20;
export const FLAT_MERC: EarthState = {wrap: 0, gores: 0, merc: 1, centerLon: ATLANTIC, tilt: 0};
const GLOBE_ATL: EarthState = {wrap: 1, gores: 0, merc: 0, centerLon: ATLANTIC, tilt: 40};

// The classroom map framed on Washington and Makkah, lower in the frame than the corner circle.
export const MAP_VIEW: View = {cx: 0.03, cy: 0.75, width: 2.75};
const GLOBE_VIEW = viewAt([0, 0], [540, 1100], 1080 / 460);

const invMerc = (y: number) => (Math.atan(Math.sinh(y)) * 180) / Math.PI;

// The straight line on the classroom map (a rhumb line), as points.
export const rhumb = (a: LatLon, b: LatLon, steps = 160): LatLon[] =>
  Array.from({length: steps + 1}, (_, i) => {
    const s = i / steps;
    return [invMerc(mercY(a[0]) + (mercY(b[0]) - mercY(a[0])) * s), a[1] + (b[1] - a[1]) * s];
  });

const DC_PATH = greatCircle(WASHINGTON, KAABA);
const DC_RHUMB = rhumb(WASHINGTON, KAABA);
const AK_PATH = greatCircle(ANCHORAGE, KAABA);

const mixPath = (a: LatLon[], b: LatLon[], t: number): LatLon[] => a.map((p, i) => [p[0] + (b[i][0] - p[0]) * t, p[1] + (b[i][1] - p[1]) * t]);

// An SVG path through the visible part of a line of points (broken where it goes round
// the back of the globe), up to `upTo` (0..1) of its length.
export const PathLine = ({
  points,
  state,
  view,
  upTo = 1,
  color = QIBLA,
  width = 12,
  dash,
  halo = true,
}: {
  points: LatLon[];
  state: EarthState;
  view: View;
  upTo?: number;
  color?: string;
  width?: number;
  dash?: string;
  halo?: boolean;
}) => {
  const last = Math.max(1, Math.round((points.length - 1) * Math.min(1, Math.max(0, upTo))));
  let d = "";
  let pen = false;
  for (let i = 0; i <= last; i++) {
    const {x, y, visible} = project(points[i], state, view);
    if (!visible) {
      pen = false;
      continue;
    }
    d += `${pen ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)} `;
    pen = true;
  }
  if (upTo <= 0 || !d) {
    return null;
  }
  return (
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
      {halo ? <path d={d} fill="none" stroke="rgba(10,20,38,0.55)" strokeWidth={width + 8} strokeLinecap="round" strokeLinejoin="round" /> : null}
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash} />
    </svg>
  );
};

const at = (point: LatLon, state: EarthState, view: View) => project(point, state, view);

const lineAt = (o: QGlobeOverlay, index: number, cue: Cue) => (o.lines?.[index] ? cue(o.lines[index].at) : undefined);

export const QiblaEarth = ({o, cue}: {o: QGlobeOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const b = (name: string) => cue(o.beats[name]);
  const line0 = o.lines?.[0]?.text;
  const at0 = lineAt(o, 0, cue);

  if (o.scene === "flatround") {
    // Top: the classroom map, FLAT. Bottom: the globe turning, ROUND.
    const mapIn = arrive(frame, 0, 10);
    const globeIn = arrive(frame, b("zameen"), 10);
    const state: EarthState = {...GLOBE_ATL, centerLon: ATLANTIC - frame * 0.6, tilt: 22};
    const view = viewAt([0, 0], [540, 1110], 1080 / 250);
    return (
      <AbsoluteFill style={{backgroundColor: PAPER}}>
        <div style={{position: "absolute", left: SIDE, top: TEXT_TOP}}>
          <Tag text={o.tag} />
        </div>
        <div style={{position: "absolute", left: 60, right: 60, top: 320, height: 420, overflow: "hidden", borderRadius: 18, boxShadow: "0 18px 40px rgba(16,32,58,0.3)", opacity: mapIn, transform: `translateY(${(1 - mapIn) * -60}px)`}}>
          <Img src={staticFile("footage/qb-mercator.jpg")} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%"}} />
        </div>
        {frame >= b("flat") ? <Chip size={58} style={{left: 90, top: 690, transform: `scale(${land(frame, b("flat"), 1.3)})`}}>FLAT</Chip> : null}
        <div style={{position: "absolute", inset: 0, opacity: globeIn, transform: `scale(${0.85 + 0.15 * globeIn})`, transformOrigin: "540px 1110px"}}>
          <Earth3D state={state} view={view} />
        </div>
        {frame >= b("round") ? <Chip size={58} dark style={{left: 640, top: 1240, transform: `scale(${land(frame, b("round"), 1.3)})`}}>ROUND</Chip> : null}
      </AbsoluteFill>
    );
  }

  if (o.scene === "peel") {
    // The orange opens into petals, tears, stretches into a sheet, becomes the Earth and
    // stretches again into the classroom map.
    const open = between(frame, b("open"), b("open") + 16, Easing.inOut(Easing.quad));
    const fill = between(frame, b("stretch"), b("stretch") + 14);
    const skin = between(frame, b("earth"), b("earth") + 10);
    const merc = between(frame, b("merc"), b("merc") + 22);
    const zoom = between(frame, b("zoom"), b("zoom") + 18);
    const state: EarthState = {wrap: 1 - open, gores: 1 - fill, merc, centerLon: ATLANTIC, tilt: 0, roll: 0};
    const orange = viewAt([0, 0], [540, 960], 1080 / 360);
    const sheet = viewAt([0, 0], [540, 930], 1080 / 156);
    const close = viewAt([0.17, 0.95], [540, 900], 1080 / 230);
    const view = mixView(mixView(orange, sheet, open), close, zoom);
    const tears = b("tears");
    const flash = frame >= tears && frame < b("stretch") ? interpolate(frame, [tears, tears + 3, tears + 12], [0, 1, 0.75], CLAMP) : 0;
    const greenland = at([72, -41], state, view);
    const africa = at([6, 20], state, view);
    const mark = b("mark");
    return (
      <AbsoluteFill style={{backgroundColor: PAPER}}>
        {/* Behind the sheet: dark only where the petals leave gaps, so the tears show. */}
        <div style={{position: "absolute", left: 540 - 495, top: 930 - 250, width: 990, height: 500, backgroundColor: INK, opacity: flash}} />
        <Earth3D state={state} view={view} skin={skin} />
        <div style={{position: "absolute", left: SIDE, top: TEXT_TOP}}>
          <Tag text={o.tag} />
        </div>
        {frame >= tears && frame < b("stretch") ? <Chip size={64} dark style={{left: 330, top: 470, transform: `scale(${land(frame, tears, 1.3)})`}}>TEARS</Chip> : null}
        {frame >= b("stretch") && frame < b("earth") ? (
          <Chip size={64} dark style={{left: 250, top: 470, transform: `scale(${land(frame, b("stretch"), 1.3)})`}}>
            ⟷ STRETCHES
          </Chip>
        ) : null}
        {frame >= mark ? (
          <>
            <Ring x={greenland.x} y={greenland.y} r={78} at={mark} />
            <Chip size={40} style={{left: greenland.x + 70, top: greenland.y - 110}}>GREENLAND</Chip>
            <Ring x={africa.x} y={africa.y} r={118} at={mark + 4} />
            <Chip size={40} style={{left: africa.x + 96, top: africa.y - 150}}>AFRICA</Chip>
            <div style={{position: "absolute", left: SIDE - 24, top: TEXT_TOP + 50, padding: "16px 24px 20px", backgroundColor: "rgba(243,238,228,0.95)", borderRadius: 16, transform: `scale(${land(frame, mark + 8)})`, transformOrigin: "left top", opacity: frame >= mark + 8 ? 1 : 0}}>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 60, lineHeight: 1.04, color: INK}}>Looks the same size.</div>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 60, lineHeight: 1.04, color: INK}}>Africa is 14× bigger.</div>
            </div>
          </>
        ) : null}
      </AbsoluteFill>
    );
  }

  if (o.scene === "mapline") {
    // The classroom map with the hook's straight line: "straight on the map", then
    // "not the shortest". The speaker sits in the corner circle.
    const state = FLAT_MERC;
    const view = MAP_VIEW;
    const draw = between(frame, b("line"), b("line") + 12, Easing.out(Easing.cubic));
    const dc = at(WASHINGTON, state, view);
    const mk = at(KAABA, state, view);
    return (
      <AbsoluteFill style={{backgroundColor: PAPER}}>
        <Earth3D state={state} view={view} />
        <PathLine points={DC_RHUMB} state={state} view={view} upTo={draw} color="#FFFFFF" width={11} />
        <Pin x={dc.x} y={dc.y} at={0} />
        <Pin x={mk.x} y={mk.y} at={0} />
        <Chip size={34} dark style={{left: dc.x - 40, top: dc.y + 26}}>WASHINGTON</Chip>
        <Chip size={34} dark style={{left: mk.x - 190, top: mk.y + 26}}>MAKKAH</Chip>
        <PaperHead tag={o.tag} line={line0} lineAt={at0} />
        <Stamp text="NOT THE SHORTEST" at={b("stamp")} size={58} rotate={-6} style={{left: 200, top: 790}} />
      </AbsoluteFill>
    );
  }

  if (o.scene === "string" || o.scene === "payoff") {
    // "string": the map wraps into the globe, the white map line on it, then pulled
    // tight it slides north into the orange great circle. "payoff": the reverse, the
    // globe unwraps into the classroom map with the string still on it.
    const wrapT =
      o.scene === "string" ? between(frame, b("wrap"), b("wrap") + 18) : 1 - between(frame, b("unwrap"), b("unwrap") + 22);
    const state = mixState(FLAT_MERC, GLOBE_ATL, wrapT);
    const payoffView = viewAt([0.03, 0.62], [540, 1040], 2.75);
    const flatView = o.scene === "string" ? MAP_VIEW : payoffView;
    const view = mixView(flatView, GLOBE_VIEW, wrapT);
    const tight = o.scene === "string" ? between(frame, b("tight"), b("tight") + 7, Easing.out(Easing.back(1.4))) : 1;
    const path = mixPath(DC_RHUMB, DC_PATH, tight);
    const dc = at(WASHINGTON, state, view);
    const mk = at(KAABA, state, view);
    const pulse = (beat: number) => (frame >= beat ? interpolate(frame, [beat, beat + 4, beat + 10], [1, 1.6, 1], CLAMP) : 1);
    const white = o.scene === "payoff" ? between(frame, b("unwrap") + 18, b("unwrap") + 28) : 0;
    const title = o.scene === "payoff" ? b("title") : 0;
    return (
      <AbsoluteFill style={{backgroundColor: PAPER}}>
        <Earth3D state={state} view={view} />
        {o.scene === "payoff" && white > 0 ? <PathLine points={DC_RHUMB} state={state} view={view} upTo={white} color="#FFFFFF" width={9} /> : null}
        <PathLine points={path} state={state} view={view} color={tight > 0.5 ? QIBLA : "#FFFFFF"} width={tight > 0.5 ? 13 : 11} />
        <div style={{position: "absolute", left: 0, top: 0, transform: `scale(1)`}}>
          <div style={{position: "absolute", left: dc.x, top: dc.y, transform: `scale(${o.scene === "string" ? pulse(b("dc")) : 1})`}}>
            <Pin x={0} y={0} at={0} />
          </div>
          <div style={{position: "absolute", left: mk.x, top: mk.y, transform: `scale(${o.scene === "string" ? pulse(b("mk")) : 1})`}}>
            <Pin x={0} y={0} at={0} />
          </div>
        </div>
        {o.scene === "string" ? (
          <>
            {frame >= b("dc") ? <Chip size={34} dark style={{left: dc.x - 60, top: dc.y + 26}}>WASHINGTON</Chip> : null}
            {frame >= b("mk") ? <Chip size={34} dark style={{left: mk.x - 80, top: mk.y + 26}}>MAKKAH</Chip> : null}
            <PaperHead tag={o.tag} line={line0} lineAt={at0} />
          </>
        ) : (
          <>
            <div style={{position: "absolute", left: SIDE, top: TEXT_TOP}}>
              <Tag text={o.tag} />
            </div>
            {frame >= title ? (
              <div style={{position: "absolute", left: SIDE - 24, right: SIDE, top: TEXT_TOP + 56, padding: "16px 24px 20px", backgroundColor: "rgba(243,238,228,0.95)", borderRadius: 16, transform: `scale(${land(frame, title)})`, transformOrigin: "left top"}}>
                {(o.lines ?? []).map((l) => (
                  <div key={l.text} style={{fontFamily: SANS, fontWeight: 900, fontSize: 84, lineHeight: 1.0, letterSpacing: -2, color: INK}}>
                    {l.text}
                  </div>
                ))}
              </div>
            ) : null}
          </>
        )}
      </AbsoluteFill>
    );
  }

  if (o.scene === "depart") {
    // Close on Washington: the string leaves up and to the right. A compass on the pin
    // shows it: north-east.
    const state: EarthState = {wrap: 1, gores: 0, merc: 0, centerLon: -62, tilt: 36};
    const dcWorld = place(WASHINGTON[0], WASHINGTON[1], state).p;
    const push = between(frame, 0, 70, Easing.out(Easing.cubic));
    const view = mixView(viewAt([dcWorld[0], dcWorld[1]], [440, 860], 1080 / 900), viewAt([dcWorld[0], dcWorld[1]], [420, 860], 1080 / 1300), push);
    const run = between(frame, b("go"), b("go") + 30, Easing.inOut(Easing.quad));
    const dc = at(WASHINGTON, state, view);
    const north = at([WASHINGTON[0] + 2, WASHINGTON[1]], state, view);
    const northAngle = (Math.atan2(north.x - dc.x, -(north.y - dc.y)) * 180) / Math.PI;
    const ne = b("ne");
    const dialIn = arrive(frame, ne - 4, 10);
    return (
      <AbsoluteFill style={{backgroundColor: PAPER}}>
        <Earth3D state={state} view={view} />
        <PathLine points={DC_PATH} state={state} view={view} upTo={0.08 + 0.3 * run} />
        <Pin x={dc.x} y={dc.y} at={0} size={32} />
        {frame >= ne - 4 ? (
          <div style={{position: "absolute", inset: 0, opacity: dialIn, transform: `rotate(${northAngle}deg) scale(${0.8 + 0.2 * dialIn})`, transformOrigin: `${dc.x}px ${dc.y}px`}}>
            <Dial cx={dc.x} cy={dc.y} r={200} needle={56.5} ink="#FFFFFF" face="rgba(16,32,58,0.62)" />
          </div>
        ) : null}
        <PaperHead tag={o.tag} line={line0} lineAt={at0} />
        {frame >= ne ? (
          <Chip size={60} accent style={{left: SIDE, top: 330, transform: `scale(${land(frame, ne, 1.3)})`}}>
            STARTS NORTH-EAST
          </Chip>
        ) : null}
      </AbsoluteFill>
    );
  }

  if (o.scene === "ride") {
    // The camera rides the string: over the Atlantic, over Europe, down onto Makkah.
    const t = between(frame, 0, b("land"), Easing.inOut(Easing.sin));
    const state: EarthState = {wrap: 1, gores: 0, merc: 0, centerLon: -55 + 85 * t, tilt: 44 - 16 * t};
    const progress = 0.2 + 0.8 * t;
    const head = DC_PATH[Math.round(progress * (DC_PATH.length - 1))];
    const world = place(head[0], head[1], state).p;
    const view = viewAt([world[0], world[1]], [540, 1000], 1080 / 820);
    const headAt = at(head, state, view);
    const mk = at(KAABA, state, view);
    const atl = at([46, -38], state, view);
    const eur = at([49, 10], state, view);
    return (
      <AbsoluteFill style={{backgroundColor: PAPER}}>
        <Earth3D state={state} view={view} />
        <PathLine points={DC_PATH} state={state} view={view} width={10} />
        <PathLine points={DC_PATH} state={state} view={view} upTo={progress} width={16} />
        <Pin x={headAt.x} y={headAt.y} at={0} color={QIBLA} size={30} />
        {frame >= b("atlantic") && atl.visible ? <Chip size={44} dark style={{left: Math.max(40, atl.x - 120), top: atl.y + 30, transform: `scale(${land(frame, b("atlantic"), 1.3)})`}}>ATLANTIC</Chip> : null}
        {frame >= b("europe") && eur.visible ? <Chip size={44} dark style={{left: eur.x - 90, top: eur.y - 110, transform: `scale(${land(frame, b("europe"), 1.3)})`}}>EUROPE</Chip> : null}
        {frame >= b("makkah") ? (
          <>
            <Pin x={mk.x} y={mk.y} at={b("makkah")} size={34} />
            <Chip size={52} accent style={{left: mk.x - 140, top: mk.y + 40, transform: `scale(${land(frame, b("makkah"), 1.3)})`}}>MAKKAH</Chip>
          </>
        ) : null}
        <PaperHead tag={o.tag} />
      </AbsoluteFill>
    );
  }

  // "alaska": the North Pole faces us; from Alaska the string goes straight up over the
  // top of the world and down to Makkah.
  const roll = interpolate(frame, [0, 110], [-8, 0], {...CLAMP, easing: Easing.out(Easing.cubic)});
  const state: EarthState = {wrap: 1, gores: 0, merc: 0, centerLon: -150, tilt: 78, roll};
  const view = viewAt([0, 0], [540, 960], 1080 / 440);
  const ak = at(ANCHORAGE, state, view);
  const mk = at(KAABA, state, view);
  const pole = at([90, 0], state, view);
  const draw = between(frame, b("draw"), b("draw") + 36, Easing.inOut(Easing.quad));
  const northAt = b("north");
  return (
    <AbsoluteFill style={{backgroundColor: PAPER}}>
      <Earth3D state={state} view={view} />
      <PathLine points={AK_PATH} state={state} view={view} upTo={draw} />
      <Pin x={ak.x} y={ak.y} at={b("alaska")} size={32} />
      {frame >= b("alaska") ? <Chip size={44} dark style={{left: ak.x - 100, top: ak.y + 34, transform: `scale(${land(frame, b("alaska"), 1.3)})`}}>ALASKA</Chip> : null}
      {mk.visible && draw > 0.95 ? (
        <>
          <Pin x={mk.x} y={mk.y} at={0} size={30} />
          <Chip size={34} dark style={{left: mk.x + 24, top: mk.y - 18}}>MAKKAH</Chip>
        </>
      ) : null}
      {frame >= b("pole") ? (
        <>
          <Pin x={pole.x} y={pole.y} at={b("pole")} color="#FFFFFF" size={22} />
          <Chip size={34} style={{left: pole.x + 24, top: pole.y - 20}}>NORTH POLE</Chip>
        </>
      ) : null}
      <PaperHead tag={o.tag} />
      {frame >= northAt ? (
        <Chip size={56} accent style={{left: SIDE, top: 330, transform: `scale(${land(frame, northAt, 1.3)})`}}>
          ALMOST DUE NORTH · 351°
        </Chip>
      ) : null}
    </AbsoluteFill>
  );
};

// A paper band behind the tag and line, so text over a map always reads.
const PaperHead = ({tag, line, lineAt}: {tag: string; line?: string; lineAt?: number}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: SIDE - 24, top: TEXT_TOP - 20, maxWidth: 560, padding: "18px 24px 22px", backgroundColor: "rgba(243,238,228,0.94)", borderRadius: 16}}>
      <Tag text={tag} />
      {line && lineAt !== undefined && frame >= lineAt ? (
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 56, lineHeight: 1.04, color: INK, marginTop: 10, transform: `scale(${land(frame, lineAt)})`, transformOrigin: "left top"}}>
          {line}
        </div>
      ) : null}
    </div>
  );
};

// A marker ring drawn round a place.
const Ring = ({x, y, r, at: start}: {x: number; y: number; r: number; at: number}): ReactNode => {
  const frame = useCurrentFrame();
  const drawn = between(frame, start, start + 9, Easing.out(Easing.cubic));
  return (
    <svg width={1080} height={1920} style={{position: "absolute", left: 0, top: 0}}>
      <circle cx={x} cy={y} r={r} fill="none" stroke={INK} strokeWidth={15} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawn} transform={`rotate(-90 ${x} ${y})`} />
      <circle cx={x} cy={y} r={r} fill="none" stroke="#FFFFFF" strokeWidth={9} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - drawn} transform={`rotate(-90 ${x} ${y})`} />
    </svg>
  );
};
