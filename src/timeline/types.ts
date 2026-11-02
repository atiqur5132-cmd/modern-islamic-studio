// All times are in seconds on the source footage, so overlays stay on the
// same spoken words when the cuts change. Text marked with *stars* is emphasised.

export type Segment = {from: number; to: number; zoom: number; cutDifference?: number};

type Timed = {start: number; end: number};

export type TitleOverlay = Timed & {type: "title"; text: string};

export type AyahOverlay = Timed & {type: "ayah"; ayah: string};

export type CounterOverlay = Timed & {type: "counter"; value: number; label: string; text: string};

export type FingerprintOverlay = Timed & {
  type: "fingerprint";
  mode: "unique" | "scan";
  tag: string;
  heading: string;
  fact: string;
};

export type StatementOverlay = Timed & {type: "statement"; tag: string; lines: string[]};

export type EndCardOverlay = Timed & {type: "endcard"; lines: string[]};

export type BrollOverlay = Timed & {type: "broll"; src: string; blur?: number};

// Code-built 3D scenes, named by what they show.
export type SceneOverlay = Timed & {type: "scene"; scene: "bones" | "fingertip"};

export type Overlay =
  | TitleOverlay
  | AyahOverlay
  | CounterOverlay
  | FingerprintOverlay
  | StatementOverlay
  | EndCardOverlay
  | BrollOverlay
  | SceneOverlay;

// These cover the frame; the speaker moves into a small circle while they play.
export const FULL_SCREEN_TYPES: Overlay["type"][] = [
  "fingerprint",
  "statement",
  "endcard",
  "broll",
  "scene",
];

export type CaptionWord = {text: string; start: number; end: number; emphasis: boolean};

export type Edit = {
  footage: string;
  segments: Segment[];
  overlays: Overlay[];
  captions: CaptionWord[][];
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
