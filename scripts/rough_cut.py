"""Render a quick 720p rough cut of an edit's segments, with no graphics.

Usage: .venv\\Scripts\\python scripts/rough_cut.py clip

Reads projects/<clip>/edit.json and public/footage/<footage>. Each segment gets a
12 ms audio fade at both ends so no cut clicks. Writes out/local/<clip>.rough.mp4.
"""
import json
import pathlib
import subprocess
import sys
import tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
FADE_SECONDS = 0.012


def main():
    clip = sys.argv[1]
    edit = json.loads((ROOT / "projects" / clip / "edit.json").read_text(encoding="utf-8"))
    footage = ROOT / "public" / "footage" / edit["footage"]
    out = ROOT / "out" / "local" / f"{clip}.rough.mp4"
    out.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        parts = []
        for n, seg in enumerate(edit["segments"]):
            length = seg["to"] - seg["from"]
            part = pathlib.Path(tmp) / f"{n:04d}.mp4"
            subprocess.run(
                ["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{seg['from']:.3f}", "-i", str(footage),
                 "-t", f"{length:.3f}", "-vf", "scale=720:1280",
                 "-af", f"afade=t=in:d={FADE_SECONDS},afade=t=out:st={length - FADE_SECONDS:.3f}:d={FADE_SECONDS}",
                 "-c:v", "libx264", "-preset", "veryfast", "-crf", "23", "-pix_fmt", "yuv420p",
                 "-c:a", "aac", "-b:a", "160k", "-ar", "48000", str(part)],
                check=True,
            )
            parts.append(part)
        listing = pathlib.Path(tmp) / "parts.txt"
        listing.write_text("".join(f"file '{p.as_posix()}'\n" for p in parts), encoding="utf-8")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
                        "-i", str(listing), "-c", "copy", "-movflags", "+faststart", str(out)], check=True)
    print(f"Saved {out.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
