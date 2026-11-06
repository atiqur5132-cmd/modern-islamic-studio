"""Break a reel down into frames and hook numbers, for the reference library or our own QA.

Usage:
  .venv\\Scripts\\python scripts/study_reel.py path/to/reel.mp4 --name some-reel [--source URL]
  .venv\\Scripts\\python scripts/study_reel.py out/local/clip.mp4 --ours

A reference reel goes to references/<name>/: hook.jpg (0-6 s, every 0.5 s), sheet.jpg
(whole reel, every 2 s), frame0.jpg, frame0_270.jpg (the thumbnail test), study.json
(the numbers) and breakdown.md (a skeleton to fill by looking at the frames; never
overwritten). The repo is public, so the pictures and the video stay on the laptop
(.gitignore); only the written notes are committed.

--ours writes the same files to work/<name>.study/ and prints the measured QUALITY.md
section 1 gates (picture change every 1.5 s, 4+ beats, sound at frame 0) as pass/fail.
"""
import argparse
import json
import pathlib
import subprocess

import numpy as np
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parent.parent
HOOK_SECONDS = 6.0
SAMPLE_FPS = 10
THUMB_W, THUMB_H = 54, 96
# Mean grey-level change (0-255, on a 54x96 thumbnail) from the last beat's picture that makes
# a new beat: a cut, a new full-screen image, a big scale jump or a large dark-on-light shape.
# Calibrated on our renders (2026-11-06): gestures and caption changes on a talking head and
# Yawm 365's pale calendar fill stay under it; cuts to and from graphics go well over it. It is
# a guard, not the judge: a hand swung at the lens can pass it, so hook.jpg is still looked at.
BEAT_CHANGE = 24.0
MAX_STILL = 1.5  # QUALITY.md: a visible change at least this often in the hook
MIN_BEATS = 4
AUDIO_RATE = 16000
SOUND_DB = -35.0  # RMS level that counts as sound
SOUND_AT_START = 0.1  # seconds: "sound hits at frame 0"
TILE_W = 216


def probe(video):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height:format=duration", "-of", "json", str(video)],
        check=True, capture_output=True, text=True).stdout
    info = json.loads(out)
    stream = info["streams"][0]
    return float(info["format"]["duration"]), stream["width"], stream["height"]


def frames(video, fps, width, height, pix="gray", until=None):
    """Frames sampled at fps, scaled to width x height, as a uint8 array."""
    args = ["ffmpeg", "-loglevel", "error", "-i", str(video)]
    if until:
        args += ["-t", str(until)]
    args += ["-vf", f"fps={fps},scale={width}:{height}", "-pix_fmt", pix, "-f", "rawvideo", "-"]
    raw = subprocess.run(args, check=True, capture_output=True).stdout
    channels = 1 if pix == "gray" else 3
    shape = (-1, height, width) if channels == 1 else (-1, height, width, 3)
    return np.frombuffer(raw, np.uint8).reshape(shape)


def beats(grey, fps, threshold=BEAT_CHANGE):
    """Times where the picture has changed visibly since the last beat (the first frame is one).

    Comparing with the last beat's picture, not the previous frame, means a slow fill or a
    slow zoom only counts once it has really changed the picture.
    """
    if len(grey) == 0:
        return []
    found, key = [0.0], grey[0].astype(np.int16)
    for i in range(1, len(grey)):
        current = grey[i].astype(np.int16)
        if np.abs(current - key).mean() >= threshold:
            found.append(round(i / fps, 2))
            key = current
    return found


def longest_still(beat_times, until):
    """Longest stretch with no beat, from 0 to until."""
    edges = [t for t in beat_times if t < until] + [until]
    return round(max(b - a for a, b in zip(edges, edges[1:])), 2) if len(edges) > 1 else until


def sound_onset(video, until=HOOK_SECONDS):
    """First time the audio is louder than SOUND_DB (20 ms windows), or None."""
    raw = subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-i", str(video), "-t", str(until), "-vn", "-ac", "1",
         "-ar", str(AUDIO_RATE), "-f", "s16le", "-"], capture_output=True).stdout
    samples = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    window = AUDIO_RATE // 50
    for i in range(len(samples) // window):
        chunk = samples[i * window:(i + 1) * window]
        if 20 * np.log10(np.sqrt((chunk ** 2).mean()) + 1e-9) > SOUND_DB:
            return round(i * window / AUDIO_RATE, 2)
    return None


def contact_sheet(tiles, labels, columns):
    tile_h = tiles[0].shape[0]
    rows = -(-len(tiles) // columns)
    sheet = Image.new("RGB", (columns * TILE_W, rows * (tile_h + 22)), "white")
    draw = ImageDraw.Draw(sheet)
    for i, (tile, label) in enumerate(zip(tiles, labels)):
        x, y = (i % columns) * TILE_W, (i // columns) * (tile_h + 22)
        sheet.paste(Image.fromarray(tile), (x, y + 22))
        draw.text((x + 6, y + 5), label, fill="black")
    return sheet


def hook_gates(study):
    hook = study["hook"]
    onset = hook["sound_onset"]
    return {
        "picture changes at least every 1.5 s (0-6 s)": hook["longest_still"] <= MAX_STILL,
        "4+ visual beats in 0-6 s": len(hook["beats"]) >= MIN_BEATS,
        "sound at frame 0": onset is not None and onset <= SOUND_AT_START,
    }


BREAKDOWN = """# {name}

Source: {source}
Studied: {measured}. Pictures are on the laptop only (references/{name}/, not committed).

## Numbers (study.json)

- Length {duration} s. Hook beats at {beats} s; longest still stretch in 0-6 s: {still} s.
- Sound starts at {onset} s. Frame 0 contrast (grey std): {contrast}.

## Hook, 0-6 s (hook.jpg, frame0_270.jpg)

- Frame 0: what fills it, the line on it, does it read at 270 px?
- Each beat: what changes, and why the eye goes there.
- Spoken line and when the key word lands.
- Speaker on screen at frame 0, or graphics first?
- Sound at the start.

## Captions

- Fonts, size, case, colour, highlight, position, animation.

## Graphic vocabulary

| Line type (comparison, number, list, name, quote...) | What they show | Entrance / exit | Hold |
| --- | --- | --- | --- |

## Transitions and camera

## Pacing (sheet.jpg)

- Cuts or visual changes per 10 s; longest hold.

## Take / leave for our channel

- Take:
- Leave:
"""


def study(video, name, out_dir, source=""):
    duration, width, height = probe(video)
    out_dir.mkdir(parents=True, exist_ok=True)

    grey = frames(video, SAMPLE_FPS, THUMB_W, THUMB_H, until=HOOK_SECONDS)
    hook_beats = beats(grey, SAMPLE_FPS)
    tile_h = round(TILE_W * height / width / 2) * 2

    hook_frames = frames(video, 2, TILE_W, tile_h, pix="rgb24", until=HOOK_SECONDS + 0.25)
    contact_sheet(hook_frames, [f"{i / 2:.1f} s" for i in range(len(hook_frames))], 7).save(
        out_dir / "hook.jpg", quality=88)
    all_frames = frames(video, 0.5, TILE_W, tile_h, pix="rgb24")
    contact_sheet(all_frames, [f"{i * 2} s" for i in range(len(all_frames))], 8).save(
        out_dir / "sheet.jpg", quality=85)

    first = frames(video, 30, width, height, pix="rgb24", until=1 / 30)[0]
    Image.fromarray(first).save(out_dir / "frame0.jpg", quality=92)
    small = Image.fromarray(first).resize((270, round(270 * height / width)), Image.LANCZOS)
    small.save(out_dir / "frame0_270.jpg", quality=92)

    result = {
        "name": name, "source": source, "video": str(video),
        "duration": round(duration, 2), "size": [width, height],
        "hook": {
            "beats": hook_beats,
            "longest_still": longest_still(hook_beats, HOOK_SECONDS),
            "sound_onset": sound_onset(video),
            "frame0_contrast": round(float(grey[0].std()), 1),
        },
    }
    (out_dir / "study.json").write_text(json.dumps(result, indent=2), encoding="utf-8")

    notes = out_dir / "breakdown.md"
    if not notes.exists():
        notes.write_text(BREAKDOWN.format(
            name=name, source=source or "(add the link)", measured="study_reel.py",
            duration=result["duration"], beats=", ".join(map(str, hook_beats)),
            still=result["hook"]["longest_still"], onset=result["hook"]["sound_onset"],
            contrast=result["hook"]["frame0_contrast"]), encoding="utf-8")
    return result


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("video", type=pathlib.Path)
    parser.add_argument("--name", help="folder name (default: the video's file name)")
    parser.add_argument("--source", default="", help="where the reel came from (link)")
    parser.add_argument("--ours", action="store_true", help="our own render: write to work/ and print the hook gates")
    args = parser.parse_args()

    name = args.name or args.video.stem
    out_dir = ROOT / "work" / f"{name}.study" if args.ours else ROOT / "references" / name
    result = study(args.video, name, out_dir, args.source)
    hook = result["hook"]
    print(f"{out_dir}")
    print(f"hook beats {hook['beats']}, longest still {hook['longest_still']} s, "
          f"sound from {hook['sound_onset']} s, frame-0 contrast {hook['frame0_contrast']}")
    if args.ours:
        for gate, passed in hook_gates(result).items():
            print(f"  {'PASS' if passed else 'FAIL'}  {gate}")


if __name__ == "__main__":
    main()
