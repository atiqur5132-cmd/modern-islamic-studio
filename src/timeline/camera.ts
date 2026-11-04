import {Easing, interpolate} from "remotion";
import {
  CaptionWord,
  FaceTrack,
  footageFrames,
  FPS,
  Segment,
  segmentFrames,
  sourceToOutputFrame,
  toFrames,
} from "./types";

// The virtual camera on the speaker: each cut keeps its punch-in, every shot creeps
// in slowly, key words get a short push, and the crop follows the face.

const WIDTH = 1080;
const HEIGHT = 1920;
// Where the face sits once the camera has room to move it.
export const FACE_TARGET = {x: 540, y: 730};

const DRIFT = 0.025; // slow push-in over a whole shot
const EMPHASIS_PUNCH = 0.05;
const PUNCH_IN_FRAMES = 4;
const PUNCH_HOLD_FRAMES = 10; // past the end of the word
const PUNCH_OUT_FRAMES = 10;
const MAX_ZOOM = 1.16; // more and 1080p footage turns soft
// While a card sits in the headroom the camera eases back to the full frame, so the
// cap drops clear of it; the move starts this many frames before the card lands.
const ROOM_FRAMES = 10;

export type Camera = {scale: number; x: number; y: number; face: {x: number; y: number}};

const NO_CAMERA: Camera = {scale: 1, x: 0, y: 0, face: FACE_TARGET};

const faceAt = (track: FaceTrack | undefined, seconds: number) => {
  if (!track || track.points.length === 0) {
    return FACE_TARGET;
  }
  const position = Math.min(Math.max(seconds / track.step, 0), track.points.length - 1);
  const before = track.points[Math.floor(position)];
  const after = track.points[Math.ceil(position)];
  const t = position - Math.floor(position);
  return {x: before[0] + (after[0] - before[0]) * t, y: before[1] + (after[1] - before[1]) * t};
};

// Output frames where an emphasised word is spoken, outside full-screen graphics.
export const emphasisPunches = (
  segments: Segment[],
  captions: CaptionWord[][],
  stretches: {start: number; end: number}[],
) =>
  captions
    .flat()
    .filter((word) => word.emphasis)
    .map((word) => ({
      start: sourceToOutputFrame(segments, word.start),
      end: sourceToOutputFrame(segments, word.end),
    }))
    .filter(({start, end}) => end > start && !stretches.some((s) => start < s.end && end > s.start));

// A quick punch lands on an ease-out and leaves on a slower ease-in-out.
const punchAmount = (frame: number, start: number, end: number) =>
  frame < start
    ? interpolate(frame, [start - PUNCH_IN_FRAMES, start], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      })
    : interpolate(frame, [end + PUNCH_HOLD_FRAMES, end + PUNCH_HOLD_FRAMES + PUNCH_OUT_FRAMES], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      });

const roomAmount = (frame: number, {start, end}: {start: number; end: number}) =>
  interpolate(frame, [start - ROOM_FRAMES, start, end, end + ROOM_FRAMES], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

export const cameraAt = (
  frame: number,
  segments: Segment[],
  punches: {start: number; end: number}[],
  face: FaceTrack | undefined,
  punchToZoom?: number,
  headroom: {start: number; end: number}[] = [],
): Camera => {
  let cursor = 0;
  for (const segment of segments) {
    const length = segmentFrames(segment);
    if (frame < cursor + length) {
      // During a hold the picture is frozen, and so is the camera.
      const footage = footageFrames(segment);
      const inShot = Math.min(frame - cursor, footage - 1);
      const punch = Math.max(0, ...punches.map(({start, end}) => punchAmount(Math.min(frame, cursor + footage - 1), start, end)));
      const progress = inShot / Math.max(footage, 1);
      const creep = segment.push
        ? 1 + segment.push * Easing.inOut(Easing.sin)(progress)
        : 1 + DRIFT * progress;
      const base = segment.zoom * creep;
      const punched = punchToZoom
        ? base + (Math.max(base, punchToZoom) - base) * punch
        : base * (1 + EMPHASIS_PUNCH * punch);
      const room = Math.max(0, ...headroom.map((range) => roomAmount(frame, range)));
      const scale = Math.min(punched, MAX_ZOOM) * (1 - room) + room;
      const source = faceAt(face, (toFrames(segment.from) + inShot) / FPS);
      // Move the face toward the target, but never so far that the frame edge shows.
      const x = Math.min(0, Math.max(WIDTH * (1 - scale), FACE_TARGET.x - scale * source.x));
      const y = Math.min(0, Math.max(HEIGHT * (1 - scale), FACE_TARGET.y - scale * source.y));
      return {scale, x, y, face: {x: scale * source.x + x, y: scale * source.y + y}};
    }
    cursor += length;
  }
  return NO_CAMERA;
};
