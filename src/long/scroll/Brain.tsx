import {LOOK} from "./look";

// A brain in profile, line drawn, with two marked places: the midbrain where dopamine
// neurons sit, and the nucleus accumbens (the reward area) they reach. `light` 0..1 fills
// the marked place in the accent.
export const Brain = ({
  size = 760,
  midbrain = 0,
  accumbens = 0,
  gray = false,
}: {
  size?: number;
  midbrain?: number;
  accumbens?: number;
  gray?: boolean;
}) => (
  <svg width={size} height={size * 0.78} viewBox="0 0 400 312" style={{overflow: "visible", filter: gray ? "grayscale(1)" : undefined}}>
    <g fill="none" stroke={LOOK.ivory} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path
        d="M70 190 C40 170 36 120 64 96 C70 60 108 36 146 42 C166 18 214 14 238 34 C270 22 318 34 330 70 C366 82 380 126 362 156 C372 188 350 218 318 220 C304 244 270 252 246 238 C226 256 188 256 172 236 C140 246 104 234 96 210 C84 208 74 200 70 190 Z"
        fill={LOOK.ground2}
      />
      {/* folds */}
      <path d="M120 80 C140 96 150 120 140 142" opacity={0.5} />
      <path d="M190 52 C196 80 222 92 214 124" opacity={0.5} />
      <path d="M262 52 C258 82 282 100 300 98" opacity={0.5} />
      <path d="M312 130 C292 142 292 170 314 184" opacity={0.5} />
      <path d="M110 180 C140 168 170 176 186 198" opacity={0.5} />
      {/* cerebellum and brainstem */}
      <path d="M262 226 C282 262 322 262 334 232" opacity={0.7} />
      <path d="M232 232 C236 262 236 286 228 306" />
      <path d="M252 236 C256 262 256 286 250 306" />
    </g>
    {/* dopamine pathway: midbrain to accumbens */}
    <path d="M238 200 C214 186 190 184 168 176" stroke={LOOK.amber} strokeWidth={4} fill="none" strokeDasharray="6 6" opacity={Math.max(midbrain, accumbens) * 0.9} />
    <circle cx={240} cy={202} r={13} fill={LOOK.amber} opacity={0.15 + midbrain * 0.85} />
    <circle cx={164} cy={174} r={15} fill={LOOK.amber} opacity={0.15 + accumbens * 0.85} />
  </svg>
);
