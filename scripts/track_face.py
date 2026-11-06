"""Track where the speaker's face is, so zooms and the picture-in-picture follow it.

Usage: .venv\\Scripts\\python scripts/track_face.py public/footage/clip.mp4

Finds the face every 0.2 s with OpenCV's YuNet model (models/yunet/), fills the
gaps where no face was found, smooths out detector jitter and writes the path into
projects/<clip>/edit.json as "face", keeping everything else. Points are in pixels
of the 1080x1920 footage, at source times, like the overlays.
"""
import argparse
import json
import pathlib
import subprocess

import cv2
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
MODEL = ROOT / "models" / "yunet" / "face_detection_yunet_2023mar.onnx"

WIDTH, HEIGHT = 1080, 1920
DOWNSCALE = 4  # detect on 270x480: plenty for a face that fills the frame
STEP_SECONDS = 0.2
MIN_SCORE = 0.7
SMOOTH_SECONDS = 0.8  # longer than detector jitter, shorter than a real lean
DEAD_ZONE_PX = 12  # smaller drifts are noise; holding still reads as a locked-off camera
# Aim between the eyes and the mouth: the box centre sits too low on most faces.
EYE_WEIGHT = 0.6


def read_frames(video):
    """Yield one small BGR frame every STEP_SECONDS, decoded by FFmpeg."""
    w, h = WIDTH // DOWNSCALE, HEIGHT // DOWNSCALE
    process = subprocess.Popen(
        ["ffmpeg", "-loglevel", "error", "-i", str(video),
         "-vf", f"fps={1 / STEP_SECONDS},scale={w}:{h}", "-f", "rawvideo", "-pix_fmt", "bgr24", "-"],
        stdout=subprocess.PIPE,
    )
    size = w * h * 3
    while chunk := process.stdout.read(size):
        if len(chunk) < size:
            break
        yield np.frombuffer(chunk, dtype=np.uint8).reshape(h, w, 3)
    process.wait()


def face_point(faces):
    """The aim point of the largest confident face, in full-size pixels, or None."""
    if faces is None:
        return None
    faces = [f for f in faces if f[14] >= MIN_SCORE]
    if not faces:
        return None
    # Row: box x, y, w, h, then right eye, left eye, nose, right and left mouth corner, score.
    x, y, w, h, *landmarks = max(faces, key=lambda f: f[2] * f[3])
    eyes_y = (landmarks[1] + landmarks[3]) / 2
    mouth_y = (landmarks[7] + landmarks[9]) / 2
    aim_x = x + w / 2
    aim_y = EYE_WEIGHT * eyes_y + (1 - EYE_WEIGHT) * mouth_y
    return aim_x * DOWNSCALE, aim_y * DOWNSCALE


def fill_gaps(points):
    """Interpolate missing samples; hold the nearest face at the ends."""
    found = [i for i, p in enumerate(points) if p is not None]
    if not found:
        return None
    filled = np.empty((len(points), 2))
    for axis in range(2):
        filled[:, axis] = np.interp(range(len(points)), found, [points[i][axis] for i in found])
    return filled


def smooth(path):
    """Median then moving average, then hold still through movements under the dead zone."""
    radius = max(1, round(SMOOTH_SECONDS / STEP_SECONDS / 2))
    padded = np.pad(path, ((radius, radius), (0, 0)), mode="edge")
    windows = np.lib.stride_tricks.sliding_window_view(padded, 2 * radius + 1, axis=0)
    median = np.median(windows, axis=-1)
    padded = np.pad(median, ((radius, radius), (0, 0)), mode="edge")
    kernel = np.ones(2 * radius + 1) / (2 * radius + 1)
    averaged = np.stack([np.convolve(padded[:, a], kernel, mode="valid") for a in range(2)], axis=1)

    held = averaged.copy()
    for i in range(1, len(held)):
        if np.hypot(*(averaged[i] - held[i - 1])) < DEAD_ZONE_PX:
            held[i] = held[i - 1]
    return held


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("video", type=pathlib.Path)
    args = parser.parse_args()

    detector = cv2.FaceDetectorYN.create(str(MODEL), "", (WIDTH // DOWNSCALE, HEIGHT // DOWNSCALE),
                                         score_threshold=MIN_SCORE)
    points = [face_point(detector.detect(frame)[1]) for frame in read_frames(args.video)]
    missed = sum(p is None for p in points)
    path = fill_gaps(points)
    if path is None:
        raise SystemExit("No face found; edit.json left unchanged.")
    path = smooth(path)

    edit_path = ROOT / "projects" / args.video.stem / "edit.json"
    edit = json.loads(edit_path.read_text(encoding="utf-8")) if edit_path.exists() else {"overlays": []}
    edit["face"] = {"step": STEP_SECONDS, "points": [[round(x), round(y)] for x, y in path]}
    edit_path.parent.mkdir(parents=True, exist_ok=True)
    edit_path.write_text(json.dumps(edit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"{len(points)} samples, face missed in {missed} ({100 * missed / len(points):.0f}%)")
    print(f"Face x {path[:, 0].min():.0f}-{path[:, 0].max():.0f}, y {path[:, 1].min():.0f}-{path[:, 1].max():.0f}")
    print(f"Saved {edit_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
