"""Write an edit's captions as an .srt file, for uploading with the video.

Usage: .venv\\Scripts\\python scripts/export_srt.py clip [--out out/local/clip.srt]

Times follow the cut video (not the source), the same way Short.tsx places captions.
Every spoken group is included, also those hidden on screen under a graphic, so
the platform's own captions carry the whole script.
"""
import argparse
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
FPS = 30
HOLD_FRAMES = 8  # as CAPTION_HOLD_FRAMES in Short.tsx


def to_frames(seconds):
    return round(seconds * FPS)


def output_frame(segments, seconds):
    """Source time to frame of the cut video; a removed time maps to the next kept frame."""
    frame, output = to_frames(seconds), 0
    for segment in segments:
        start, end = to_frames(segment["from"]), to_frames(segment["to"])
        if frame < start:
            return output
        if frame < end:
            return output + frame - start
        output += end - start + to_frames(segment.get("hold", 0))
    return output


def timestamp(frame):
    millis = round(frame * 1000 / FPS)
    hours, millis = divmod(millis, 3_600_000)
    minutes, millis = divmod(millis, 60_000)
    seconds, millis = divmod(millis, 1000)
    return f"{hours:02d}:{minutes:02d}:{seconds:02d},{millis:03d}"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("clip")
    parser.add_argument("--out", type=pathlib.Path)
    args = parser.parse_args()

    edit = json.loads((ROOT / "projects" / args.clip / "edit.json").read_text(encoding="utf-8"))
    segments, captions = edit["segments"], edit["captions"]
    out = args.out or ROOT / "out" / "local" / f"{args.clip}.srt"

    entries = []
    for index, phrase in enumerate(captions):
        start = output_frame(segments, phrase[0]["start"])
        end = output_frame(segments, phrase[-1]["end"]) + HOLD_FRAMES
        if index + 1 < len(captions):
            end = min(end, output_frame(segments, captions[index + 1][0]["start"]))
        if end > start:
            entries.append((start, end, " ".join(w["text"] for w in phrase)))

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("".join(f"{n}\n{timestamp(s)} --> {timestamp(e)}\n{text}\n\n"
                           for n, (s, e, text) in enumerate(entries, 1)), encoding="utf-8")
    print(f"{len(entries)} captions -> {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
