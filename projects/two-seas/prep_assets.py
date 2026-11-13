"""Turn the downloaded originals into the reel's assets in public/footage (not committed).

Usage: .venv\\Scripts\\python projects/two-seas/prep_assets.py [download folder]

The download folder (default work/dl-two-seas) holds the originals named as below
(sources and licences in credits.txt). Every change made to a picture is listed here.
Clips are cropped to 9:16 and cut short, so the GitHub render only carries what it shows.
"""
import json
import pathlib
import subprocess
import sys

import cv2
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "footage"
ENCODE = ["-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p", "-an",
          "-movflags", "+faststart"]


def ffmpeg(*args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *map(str, args)], check=True)


def vertical(src, dst, x, seconds, start=0.0, height=2160):
    """A 9:16 window `x` px from the left of a landscape clip, at 30 fps, 1080x1920."""
    width = round(height * 9 / 16)
    ffmpeg("-ss", start, "-t", seconds, "-i", src,
           "-vf", f"fps=30,crop={width}:{height}:{x}:0,scale=1080:1920:flags=lanczos", *ENCODE, dst)


def boundary(clip, at):
    """The line between the green sea and the ochre river in the hook clip, as points
    (x, y) in frame pixels every 60 px across, so the drawn stroke sits on the real line."""
    cap = cv2.VideoCapture(str(clip))
    cap.set(cv2.CAP_PROP_POS_MSEC, at * 1000)
    ok, frame = cap.read()
    assert ok, f"no frame at {at}s in {clip}"
    hsv = cv2.cvtColor(cv2.GaussianBlur(frame, (31, 31), 0), cv2.COLOR_BGR2HSV).astype(float)
    # Ochre water has a hue near 25-35 (OpenCV 0-180), the green sea 60-90.
    ochre = (hsv[:, :, 0] < 45).astype(float)
    points = []
    for x in range(0, frame.shape[1] + 1, 60):
        column = ochre[:, min(x, frame.shape[1] - 1)]
        smooth = np.convolve(column, np.ones(41) / 41, mode="same")
        rows = np.where(smooth > 0.5)[0]
        points.append([x, int(rows[0]) if len(rows) else None])
    return points


def main():
    downloads = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "work" / "dl-two-seas"
    OUT.mkdir(parents=True, exist_ok=True)
    # Pexels 39711478 (Evgenij Mikhailov): river meeting the Black Sea near Batumi, 4K 60 fps.
    vertical(downloads / "p39711478.mp4", OUT / "ts-colors.mp4", x=1312, seconds=9)
    # Pexels 40799502 (Efrem Efre): brown river water beside dark water, a boat, 4K 60 fps.
    vertical(downloads / "p40799502.mp4", OUT / "ts-boat.mp4", x=900, seconds=9)
    # Pexels 34476956 (Caio Cezar): a glacier and its meltwater river, 4K.
    vertical(downloads / "p34476956.mp4", OUT / "ts-glacier.mp4", x=1500, seconds=7)
    # Pexels 31229155 (Kiwi Blue): a river mouth meeting the ocean, 1440p.
    vertical(downloads / "p31229155.mp4", OUT / "ts-mouth.mp4", x=1003, seconds=10, start=2, height=1440)
    # NASA Earth Observatory 3744 (Terra MODIS, 22 Aug 2003): glacial silt along the Gulf
    # of Alaska coast. Public domain. A vertical window on the silt plumes, unaltered.
    ffmpeg("-i", downloads / "nasa_alaska_2003234.jpg", "-vf", "crop=1400:2000:1150:0", "-q:v", "2", OUT / "ts-alaska.jpg")
    # NASA Earth Observatory 151478 (astronaut photo ISS069-E-3412, 14 Apr 2023): the
    # Strait of Gibraltar. Public domain. Scaled down only.
    ffmpeg("-i", downloads / "nasa_gibraltar_iss069.jpg", "-vf", "scale=3000:-2", "-q:v", "2", OUT / "ts-gibraltar.jpg")
    line = boundary(OUT / "ts-colors.mp4", 1.6)
    (ROOT / "projects" / "two-seas" / "hook_line.json").write_text(json.dumps(line))
    print("Saved ts-colors, ts-boat, ts-glacier, ts-mouth (mp4), ts-alaska, ts-gibraltar (jpg); hook_line.json")
    print(line)


if __name__ == "__main__":
    main()
