import {Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {Cue} from "../falak/common";
import {PostsOverlay} from "../../timeline/types";
import {CommentIcon, HeartIcon, ShareIcon} from "./icons";
import {arrive, INK, leave, MONO, MUTED, PAPER_DEEP, SANS} from "./look";

const CARD_WIDTH = 480;
// Two side by side, the third in front between them, all above the cap (about
// y 580 at the full frame) and each headline left clear.
const PLACES = [
  {left: 34, top: 238, rotate: -4, from: {x: -640, y: 30}},
  {left: 566, top: 250, rotate: 4, from: {x: 640, y: 30}},
  {left: 300, top: 396, rotate: -1.5, from: {x: 0, y: -520}},
];
const BURST_RAYS = 10;

// "Aise posts aur reels mere paas bhi aaye": made-up posts, no platform and no
// account, landing one by one around the speaker; on "wah!" they jump, their hearts
// fill and a burst goes off. They show the claim travelling, not any real post.
export const Posts = ({posts, cue}: {posts: PostsOverlay; cue: Cue}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const burst = cue(posts.burstAt);
  const out = leave(frame, durationInFrames - 6, 6);
  const jump = interpolate(frame, [burst, burst + 4, burst + 12], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rays = interpolate(frame, [burst, burst + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const centre = PLACES[2];

  return (
    <div style={{position: "absolute", inset: 0, opacity: out}}>
      {posts.posts.map((post, index) => {
        const place = PLACES[index % PLACES.length];
        const land = arrive(frame, cue(post.at), 12);
        const liked = frame >= burst;
        return (
          <div
            key={post.headline}
            style={{
              position: "absolute",
              left: place.left,
              top: place.top,
              width: CARD_WIDTH,
              boxSizing: "border-box",
              padding: "16px 22px 14px",
              backgroundColor: "#FFFFFF",
              borderRadius: 18,
              boxShadow: "0 16px 36px rgba(27,27,27,0.20)",
              opacity: Math.min(1, land * 1.5),
              transform: `translate(${(1 - land) * place.from.x}px, ${(1 - land) * place.from.y - 16 * jump}px) rotate(${place.rotate * (0.4 + 0.6 * land)}deg) scale(${1 + 0.05 * jump})`,
            }}
          >
            <div style={{display: "flex", alignItems: "center", gap: 12}}>
              <div style={{width: 36, height: 36, borderRadius: 18, backgroundColor: PAPER_DEEP}} />
              <div style={{display: "flex", flexDirection: "column", gap: 6}}>
                <div style={{width: 120, height: 10, borderRadius: 5, backgroundColor: PAPER_DEEP}} />
                <div style={{width: 78, height: 8, borderRadius: 4, backgroundColor: PAPER_DEEP}} />
              </div>
            </div>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 30, lineHeight: 1.1, color: INK, margin: "10px 0 10px", whiteSpace: "nowrap"}}>
              {post.headline}
            </div>
            <div style={{display: "flex", alignItems: "center", gap: 18}}>
              <div style={{display: "flex", alignItems: "center", gap: 8}}>
                <HeartIcon size={28} color={INK} fill={liked ? INK : "none"} />
                <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 28, color: INK}}>{post.likes}</span>
              </div>
              <CommentIcon size={28} color={MUTED} />
              <ShareIcon size={28} color={MUTED} />
            </div>
          </div>
        );
      })}
      <svg
        width={1080}
        height={700}
        style={{position: "absolute", top: 0, left: 0, overflow: "visible", opacity: rays > 0 && rays < 1 ? 1 : 0}}
      >
        {Array.from({length: BURST_RAYS}, (_, ray) => {
          const angle = (ray / BURST_RAYS) * Math.PI * 2;
          const cx = centre.left + CARD_WIDTH / 2;
          const cy = centre.top + 70;
          const inner = 270 + 40 * rays;
          const outer = inner + 46 * (1 - rays);
          return (
            <line
              key={ray}
              x1={cx + Math.cos(angle) * inner}
              y1={cy + Math.sin(angle) * inner * 0.45}
              x2={cx + Math.cos(angle) * outer}
              y2={cy + Math.sin(angle) * outer * 0.45}
              stroke={INK}
              strokeWidth={5}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </div>
  );
};
