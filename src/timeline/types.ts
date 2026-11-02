// All times are in seconds. Segment times refer to the source footage;
// overlay times refer to the finished video.

export type Segment = {from: number; to: number};

export type TitleOverlay = {type: "title"; start: number; end: number; text: string};

export type AyahOverlay = {type: "ayah"; start: number; end: number; ayah: string};

export type Overlay = TitleOverlay | AyahOverlay;

export type Edit = {
  footage: string;
  segments: Segment[];
  overlays: Overlay[];
};

export const FPS = 30;

export const toFrames = (seconds: number) => Math.round(seconds * FPS);

export const editDurationInFrames = (edit: Edit) =>
  edit.segments.reduce((total, s) => total + toFrames(s.to) - toFrames(s.from), 0);
