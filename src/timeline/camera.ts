import {Easing, interpolate} from "remotion";
import {CaptionWord, FaceTrack, FPS, Segment, segmentFrames, sourceToOutputFrame, toFrames} from "./types";

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

export const cameraAt = (
  frame: number,
  segments: Segment[],
  punches: {start: number; end: number}[],
  face: FaceTrack | undefined,
): Camera => {
  let cursor = 0;
  for (const segment of segments) {
    const length = segmentFrames(segment);
    if (frame < cursor + length) {
      const inShot = frame - cursor;
      const punch = Math.max(
        0,
        ...punches.map(({start, end}) =>
          interpolate(
            frame,
            [start - PUNCH_IN_FRAMES, start, end + PUNCH_HOLD_FRAMES, end + PUNCH_HOLD_FRAMES + PUNCH_OUT_FRAMES],
            [0, 1, 1, 0],
            {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad)},
          ),
        ),
      );
      const scale = Math.min(
        segment.zoom * (1 + (DRIFT * inShot) / Math.max(length, 1)) * (1 + EMPHASIS_PUNCH * punch),
        MAX_ZOOM,
      );
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
