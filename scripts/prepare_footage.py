"""Prepare raw footage on the laptop: constant 30 fps, H.264/AAC, even loudness.

Usage: .venv\\Scripts\\python scripts/prepare_footage.py <video> [--vertical]

--vertical centre-crops landscape footage to 9:16 at 1080x1920.
Writes public/footage/<video-name>.mp4, where Remotion can read it. It stays out of Git.
"""
import argparse
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOUDNESS = "loudnorm=I=-14:TP=-1.5:LRA=11"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("video", type=pathlib.Path)
    parser.add_argument("--vertical", action="store_true")
    args = parser.parse_args()

    filters = ["fps=30"]
    if args.vertical:
        filters.append("crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale=1080:1920")

    out_dir = ROOT / "public" / "footage"
    out_dir.mkdir(parents=True, exist_ok=True)
    slug = re.sub(r"[^a-z0-9]+", "-", args.video.stem.lower()).strip("-")
    output = out_dir / f"{slug}.mp4"
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-stats", "-i", str(args.video),
         "-vf", ",".join(filters),
         # Every later step works from this file, so spend time here, not quality.
         "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
         "-af", LOUDNESS, "-ar", "48000", "-c:a", "aac", "-b:a", "192k",
         "-movflags", "+faststart", str(output)],
        check=True,
    )
    print(f"Saved {output.relative_to(ROOT)} ({output.stat().st_size / 1e6:.0f} MB)")


if __name__ == "__main__":
    main()
