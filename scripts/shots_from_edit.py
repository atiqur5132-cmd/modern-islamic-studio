"""Turn a video the creator already cut into shots for the Remotion camera.

Usage: .venv\\Scripts\\python scripts/shots_from_edit.py public/footage/clip.mp4
           [--push 55.6-65.2 --push 65.2-80] [--whip 6.83 --whip 65.27]

Finds the creator's hard cuts (a one-frame spike in picture change; head movement
spreads over several frames), and writes one segment per shot into
projects/<clip>/edit.json, keeping its overlays and captions. Shots alternate wide
and medium so no cut joins two shots at the same scale; shots inside a --push range
creep in slowly instead; a --whip time puts a whip transition on the cut nearest it.
Each shot's exposure is matched to the median shot.
"""
import argparse
import json
import pathlib
import subprocess

import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
FPS = 30
THUMB_W, THUMB_H = 54, 96
MIN_CUT_DIFFERENCE = 5  # mean grey-level change of a cut frame
MIN_SHARPNESS = 4  # a cut is this many times the change of the frames around it
WIDE, MEDIUM = 1.0, 1.12
PUSH = 0.05  # how far a --push shot creeps in, on top of its zoom
MAX_GAIN_CHANGE = 0.08


def thumbnails(video):
    raw = subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-i", str(video),
         "-vf", f"fps={FPS},scale={THUMB_W}:{THUMB_H},format=gray", "-f", "rawvideo", "-"],
        check=True, capture_output=True,
    ).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, THUMB_H, THUMB_W).astype(np.int16)


def find_cuts(frames):
    """Frame numbers where a new shot starts."""
    change = np.abs(np.diff(frames, axis=0)).mean(axis=(1, 2))
    cuts = []
    for i, value in enumerate(change):
        around = np.concatenate([change[max(0, i - 4) : i], change[i + 1 : i + 5]])
        if value > MIN_CUT_DIFFERENCE and value / max(float(np.median(around)), 0.5) > MIN_SHARPNESS:
            cuts.append(i + 1)
    return cuts


def time_range(text):
    start, end = text.split("-")
    return float(start), float(end)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("video", type=pathlib.Path)
    parser.add_argument("--push", type=time_range, action="append", default=[])
    parser.add_argument("--whip", type=float, action="append", default=[])
    args = parser.parse_args()

    frames = thumbnails(args.video)
    cuts = find_cuts(frames)
    bounds = [0, *cuts, len(frames)]
    brightness = [float(frames[a:b].mean()) for a, b in zip(bounds, bounds[1:])]
    reference = float(np.median(brightness))

    segments, zoom = [], WIDE
    for (a, b), level in zip(zip(bounds, bounds[1:]), brightness):
        middle = (a + b) / 2 / FPS
        segment = {"from": round(a / FPS, 3), "to": round(b / FPS, 3), "zoom": zoom,
                   "gain": round(float(np.clip(reference / level, 1 - MAX_GAIN_CHANGE, 1 + MAX_GAIN_CHANGE)), 3)}
        if any(start <= middle < end for start, end in args.push):
            segment["push"] = PUSH
        segments.append(segment)
        zoom = MEDIUM if zoom == WIDE else WIDE
    for time in args.whip:
        nearest = min(segments[1:], key=lambda s: abs(s["from"] - time))
        nearest["transition"] = "whip"

    clip = args.video.stem
    edit_path = ROOT / "projects" / clip / "edit.json"
    edit = json.loads(edit_path.read_text(encoding="utf-8")) if edit_path.exists() else {}
    edit = {"footage": args.video.name, "overlays": [], "captions": [], **edit}
    edit["segments"] = segments
    edit_path.write_text(json.dumps(edit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"{len(segments)} shots from {len(cuts)} cuts; gains {min(s['gain'] for s in segments)}–"
          f"{max(s['gain'] for s in segments)}; saved {edit_path.relative_to(ROOT)}")
    for s in segments:
        extras = " ".join(f"{k}={s[k]}" for k in ("push", "transition") if k in s)
        print(f"  {s['from']:6.2f}–{s['to']:6.2f}  zoom {s['zoom']}  gain {s['gain']}  {extras}")


if __name__ == "__main__":
    main()
