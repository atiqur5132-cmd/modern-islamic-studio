// Simple line icons drawn for this reel (24-unit grid, stroke only), so no icon set
// or brand mark is borrowed. Generic on purpose: they stand for "a post", not a platform.

type IconProps = {size: number; color: string; fill?: string; strokeWidth?: number};

const Svg = ({size, children}: {size: number; children: React.ReactNode}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{display: "block", flexShrink: 0, overflow: "visible"}}>
    {children}
  </svg>
);

export const HeartIcon = ({size, color, fill = "none", strokeWidth = 2}: IconProps) => (
  <Svg size={size}>
    <path
      d="M12 20.5C5 15.5 2 12 2 8.5 2 5.5 4.3 3.5 7 3.5c2 0 3.8 1.1 5 2.8 1.2-1.7 3-2.8 5-2.8 2.7 0 5 2 5 5 0 3.5-3 7-10 12z"
      fill={fill}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </Svg>
);

export const CommentIcon = ({size, color, strokeWidth = 2}: IconProps) => (
  <Svg size={size}>
    <path
      d="M4 4.5h16a1.5 1.5 0 0 1 1.5 1.5v10a1.5 1.5 0 0 1-1.5 1.5H10l-5 3.5v-3.5H4A1.5 1.5 0 0 1 2.5 16V6A1.5 1.5 0 0 1 4 4.5z"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </Svg>
);

export const ShareIcon = ({size, color, strokeWidth = 2}: IconProps) => (
  <Svg size={size}>
    <path
      d="M14 4.5l7 7-7 7v-4.2c-5.5 0-8.6 1.8-11 5.7 0.6-6.8 4.2-11.3 11-12z"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
  </Svg>
);

export const BookIcon = ({size, color, strokeWidth = 2}: IconProps) => (
  <Svg size={size}>
    <path
      d="M2.5 5.5c3.3-1.2 6.5-1 9.5 1 3-2 6.2-2.2 9.5-1v13c-3.3-1.2-6.5-1-9.5 1-3-2-6.2-2.2-9.5-1z"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
    />
    <path d="M12 6.5v13" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);
