// All times are in seconds on the source footage, so overlays stay on the
// same spoken words when the cuts change.

export type Segment = {from: number; to: number; zoom: number; cutDifference?: number};

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

export const segmentFrames = (segment: Segment) => toFrames(segment.to) - toFrames(segment.from);

export const editDurationInFrames = (edit: Edit) =>
  edit.segments.reduce((total, segment) => total + segmentFrames(segment), 0);

// A time inside a removed part maps to the start of the next kept segment.
export const sourceToOutputFrame = (segments: Segment[], seconds: number) => {
  const frame = toFrames(seconds);
  let output = 0;
  for (const segment of segments) {
    if (frame < toFrames(segment.from)) {
      return output;
    }
    if (frame < toFrames(segment.to)) {
      return output + frame - toFrames(segment.from);
    }
    output += segmentFrames(segment);
  }
  return output;
};
