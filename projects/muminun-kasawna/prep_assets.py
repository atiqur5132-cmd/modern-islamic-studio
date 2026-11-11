"""Turn the downloaded originals into the reel's assets in public/footage (not committed).

Usage: .venv\\Scripts\\python projects/muminun-kasawna/prep_assets.py <download folder>

The download folder holds the originals named as below (sources and licences in
credits.txt). Every change made to a picture is listed here, so the credit can say
"adapted".
"""
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


def implantation(src, dst):
    """OpenStax "2905 Implantation" (CC BY 3.0): panel 1 only, cropped inside its frame
    line, with the two pointer lines to the (cropped-away) labels painted out."""
    full = cv2.imread(str(src))
    panel = full[102:774, 12:648].copy()  # inside the black frame of panel 1
    # Pointer lines, in panel pixels (measured on the 1950 x 2440 original). Only the
    # line's own near-black pixels inside a band round each line are painted out, so the
    # cells it crosses keep their shape.
    band = np.zeros(panel.shape[:2], np.uint8)
    cv2.line(band, (318, 105), (636, 105), 255, 15)
    cv2.line(band, (278, 360), (636, 484), 255, 21)
    dark = (panel.max(axis=2) < 90).astype(np.uint8) * 255
    mask = cv2.dilate(cv2.bitwise_and(band, dark), np.ones((3, 3), np.uint8), iterations=2)
    cleaned = cv2.inpaint(panel, mask, 3, cv2.INPAINT_TELEA)
    cv2.imwrite(str(dst), cleaned, [cv2.IMWRITE_JPEG_QUALITY, 94])


def main():
    downloads = pathlib.Path(sys.argv[1])
    # Pexels 16478020 (Film Composite): 4K drop footage at 1440p.
    ffmpeg("-i", downloads / "p16478020.mp4", "-vf", "fps=30,scale=-2:1440", *ENCODE, OUT / "mk-drop.mp4")
    # Pexels 8909618 (Karolina Grabowska): a mother dressing her baby.
    ffmpeg("-i", downloads / "p8909618.mp4", "-vf", "fps=30,scale=1080:-2,crop=1080:1920", *ENCODE, OUT / "mk-dress.mp4")
    # Pexels 7088947 (MART PRODUCTION): cropped to the scan itself, so the screen's
    # clinic name, date and buttons are out of frame.
    ffmpeg("-i", downloads / "p7088947.mp4", "-vf", "fps=30,crop=968:1720:596:760,scale=1080:1920", *ENCODE,
           OUT / "mk-ultrasound.mp4")
    # Pexels 6392156 (William Fortunato): a baby's hand round a parent's finger.
    ffmpeg("-i", downloads / "p6392156.mp4", "-vf", "fps=30,scale=1080:1920", *ENCODE, OUT / "mk-hand.mp4")
    # Galenou Apanta, Basel 1538 (public domain): the title page, scaled down.
    ffmpeg("-i", downloads / "galen.tif", "-vf", "scale=1800:-2", "-q:v", "2", OUT / "mk-galen.jpg")
    implantation(downloads / "implant.jpg", OUT / "mk-implant.jpg")
    print("Saved mk-drop, mk-dress, mk-ultrasound, mk-hand (mp4) and mk-galen, mk-implant (jpg) in public/footage")


if __name__ == "__main__":
    main()
