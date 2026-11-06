import {useThree} from "@react-three/fiber";
import {ThreeCanvas} from "@remotion/three";
import {useMemo} from "react";
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig} from "remotion";
import {AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Color} from "three";
import {GOLD, IVORY, LATIN_FONT, NAVY} from "../../theme";
import {Cue, rise} from "./common";
import {SourceLine} from "./common";
import {Stage} from "./Stage";

// A procedural two-armed spiral galaxy in real 3D: no photographs, nothing borrowed.
const STARS = 24000;
const RADIUS = 2.4;
const ARMS = 2;
const TWIST = 2.6; // how far an arm winds from centre to rim
const SUN_RADIUS = 0.62; // of RADIUS, well away from the centre
const COUNT_FRAMES = 22;
const GALAXY_TURN = 0.0012; // radians per frame
const SUN_TURN = 0.006;
const CAMERA = {elevation: 0.62, from: 13, to: 10.4, sway: 0.25};
const CORE = new Color(GOLD);
const RIM = new Color(IVORY);
const DUST_BLUE = new Color("#8FA6C8"); // cool dust in the arms, a tint of ivory toward navy

const softDot = () => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("No canvas for the star sprite");
  }
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.35, "rgba(255,255,255,0.45)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
};

const textSprite = (text: string) => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("No canvas for the label");
  }
  context.font = `800 56px "${LATIN_FONT}"`;
  context.fillStyle = IVORY;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 128, 48);
  return new CanvasTexture(canvas);
};

const makeGalaxy = () => {
  const positions = new Float32Array(STARS * 3);
  const colors = new Float32Array(STARS * 3);
  for (let i = 0; i < STARS; i++) {
    const t = random(`g-r-${i}`);
    const r = RADIUS * Math.pow(t, 0.8);
    const arm = (i % ARMS) * Math.PI;
    const scatter = (random(`g-s-${i}`) - 0.5) * (0.9 - 0.55 * (r / RADIUS)) * 1.4;
    const angle = arm + (r / RADIUS) * TWIST * Math.PI + scatter;
    const thickness = (random(`g-h-${i}`) - 0.5) * 0.14 * (1 - r / RADIUS + 0.3);
    positions[i * 3] = Math.cos(angle) * r;
    positions[i * 3 + 1] = thickness;
    positions[i * 3 + 2] = Math.sin(angle) * r;
    const color = CORE.clone().lerp(random(`g-c-${i}`) > 0.75 ? DUST_BLUE : RIM, Math.min(1, (r / RADIUS) * 1.6));
    const brightness = 0.35 + 0.65 * random(`g-b-${i}`);
    colors[i * 3] = color.r * brightness;
    colors[i * 3 + 1] = color.g * brightness;
    colors[i * 3 + 2] = color.b * brightness;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("color", new BufferAttribute(colors, 3));
  return geometry;
};

const Camera = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const {camera} = useThree();
  const t = frame / durationInFrames;
  const distance = interpolate(t, [0, 1], [CAMERA.from, CAMERA.to], {easing: Easing.out(Easing.cubic)});
  const sway = CAMERA.sway * Math.sin(t * Math.PI);
  camera.position.set(Math.sin(sway) * distance * Math.cos(CAMERA.elevation), Math.sin(CAMERA.elevation) * distance, Math.cos(sway) * distance * Math.cos(CAMERA.elevation));
  camera.lookAt(0, -0.35, 0);
  return null;
};

const Scene = ({sunGlow}: {sunGlow: number}) => {
  const frame = useCurrentFrame();
  const galaxy = useMemo(makeGalaxy, []);
  const dot = useMemo(softDot, []);
  const label = useMemo(() => textSprite("SUN"), []);
  const sunAngle = 2.4 + frame * SUN_TURN;
  const sun: [number, number, number] = [Math.cos(sunAngle) * RADIUS * SUN_RADIUS, 0.02, Math.sin(sunAngle) * RADIUS * SUN_RADIUS];
  const orbit = useMemo(() => {
    const points = new Float32Array(129 * 3);
    for (let k = 0; k <= 128; k++) {
      const a = (k / 128) * Math.PI * 2;
      points[k * 3] = Math.cos(a) * RADIUS * SUN_RADIUS;
      points[k * 3 + 1] = 0.02;
      points[k * 3 + 2] = Math.sin(a) * RADIUS * SUN_RADIUS;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(points, 3));
    return geometry;
  }, []);

  return (
    <>
      <Camera />
      <group rotation={[0, -frame * GALAXY_TURN, 0]}>
        <points geometry={galaxy}>
          <pointsMaterial
            size={0.05}
            map={dot}
            vertexColors
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            sizeAttenuation
          />
        </points>
        {/* The bright core. */}
        <sprite scale={[1.9, 1.9, 1]}>
          <spriteMaterial map={dot} color={GOLD} transparent opacity={0.85} blending={AdditiveBlending} depthWrite={false} />
        </sprite>
      </group>
      <lineLoop geometry={orbit}>
        <lineBasicMaterial color={GOLD} transparent opacity={0.45} />
      </lineLoop>
      <sprite position={sun} scale={[0.55 + 0.25 * sunGlow, 0.55 + 0.25 * sunGlow, 1]}>
        <spriteMaterial map={dot} color={GOLD} transparent blending={AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite position={sun} scale={[0.16, 0.16, 1]}>
        <spriteMaterial map={dot} color="#FFF4DA" transparent blending={AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite position={[sun[0], sun[1] + 0.32, sun[2]]} scale={[0.6, 0.225, 1]}>
        <spriteMaterial map={label} transparent opacity={0.9} depthWrite={false} />
      </sprite>
    </>
  );
};

// Count up the first number of at least 10 in a text, landing on it at `land`.
const countText = (text: string, frame: number, land: number) =>
  text.replace(/\d{2,}/, (digits) => {
    const value = interpolate(frame, [land - COUNT_FRAMES, land], [0, Number(digits)], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    return String(Math.round(value));
  });

// G7. The camera drifts in over the galaxy; the Sun, a glowing point far from the
// centre, runs its orbit. Each number counts in, large and alone, on the word that
// says it, and gives way to the next.
export const Galaxy = ({
  tag,
  sunAt,
  speed,
  period,
  source,
  cue,
}: {
  tag: string;
  sunAt: number;
  speed: {text: string; at: number};
  period: {text: string; sub: string; at: number};
  source: string;
  cue: Cue;
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const speedLand = cue(speed.at);
  const periodLand = cue(period.at);
  const sunGlow = interpolate(frame, [cue(sunAt), cue(sunAt) + 8, cue(sunAt) + 30], [0, 1, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const speedShown = rise(frame, speedLand - COUNT_FRAMES, 8) * (1 - rise(frame, periodLand - COUNT_FRAMES - 8, 6));
  const periodShown = rise(frame, periodLand - COUNT_FRAMES, 8);

  return (
    <Stage tag={tag} light={{x: 540, y: 880}}>
      <AbsoluteFill>
        <ThreeCanvas width={width} height={height} gl={{alpha: true, antialias: true}} camera={{fov: 38, position: [0, 6, 8]}}>
          <Scene sunGlow={sunGlow} />
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{fontFamily: LATIN_FONT, pointerEvents: "none"}}>
        <SourceLine text={source} top={300} left={70} />
        {/* A soft dark bed under the numbers, so they read over the stars. */}
        <div
          style={{
            position: "absolute",
            top: 900,
            left: 0,
            width: 1080,
            height: 300,
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${NAVY}E6 0%, ${NAVY}00 100%)`,
            opacity: Math.max(speedShown, periodShown),
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 960,
            left: 0,
            right: 0,
            textAlign: "center",
            fontWeight: 900,
            fontSize: 124,
            letterSpacing: -2,
            color: GOLD,
            textShadow: `0 0 40px ${GOLD}55, 0 8px 24px ${NAVY}`,
            opacity: speedShown,
            transform: `scale(${0.9 + 0.1 * speedShown})`,
          }}
        >
          {countText(speed.text, frame, speedLand)}
        </div>
        <div
          style={{
            position: "absolute",
            top: 975,
            left: 50,
            right: 50,
            textAlign: "center",
            opacity: periodShown,
            transform: `translateY(${(1 - periodShown) * 20}px)`,
          }}
        >
          <div style={{fontWeight: 900, fontSize: 68, color: IVORY, textShadow: `0 8px 24px ${NAVY}`}}>
            {countText(period.text, frame, periodLand)}
          </div>
          <div style={{fontWeight: 700, fontSize: 36, color: GOLD, marginTop: 2}}>{period.sub}</div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};
