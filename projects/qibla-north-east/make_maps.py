"""Make the Earth pictures the Qibla reel draws its globe and flat map from.

Usage: .venv\\Scripts\\python projects/qibla-north-east/make_maps.py

Input: work/qibla/stock/bmng.jpg, "Blue Marble Next Generation + topography + bathymetry"
(Reto Stockli, NASA Earth Observatory, public domain, via Wikimedia Commons), an
equirectangular picture of the whole Earth, 3600x1800.

Writes to public/footage (never committed; uploaded with the footage for the render):
  qb-earth.jpg     the same picture, graded a touch, as the globe's skin
  qb-mercator.jpg  the classroom map: Mercator, 180W-180E, 62S-80N
Also checks our bearings against research.md and prints them.
"""
import math
import pathlib

import numpy as np
from PIL import Image, ImageEnhance

ROOT = pathlib.Path(__file__).resolve().parents[1].parent
SOURCE = ROOT / "work" / "qibla" / "stock" / "bmng.jpg"
OUT = ROOT / "public" / "footage"

KAABA = (21.422487, 39.826206)
WASHINGTON = (38.9170, -77.0560)  # Islamic Center, 2551 Massachusetts Ave NW
ANCHORAGE = (61.2181, -149.9003)

MERC_SOUTH, MERC_NORTH = -62.0, 80.0
MERC_WIDTH = 3600


def mercator_y(lat):
    return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


def bearing(a, b):
    """Great-circle initial bearing from a to b, degrees clockwise from true north."""
    p1, p2 = math.radians(a[0]), math.radians(b[0])
    dl = math.radians(b[1] - a[1])
    y = math.sin(dl) * math.cos(p2)
    x = math.cos(p1) * math.sin(p2) - math.sin(p1) * math.cos(p2) * math.cos(dl)
    return (math.degrees(math.atan2(y, x)) + 360) % 360


def rhumb(a, b):
    """Rhumb-line bearing: the straight line on a Mercator map."""
    dpsi = mercator_y(b[0]) - mercator_y(a[0])
    dl = math.radians((b[1] - a[1] + 540) % 360 - 180)  # the shorter way round
    return (math.degrees(math.atan2(dl, dpsi)) + 360) % 360


def main():
    earth = Image.open(SOURCE).convert("RGB")
    graded = ImageEnhance.Contrast(ImageEnhance.Color(earth).enhance(1.12)).enhance(1.06)
    graded.save(OUT / "qb-earth.jpg", quality=92)

    src = np.asarray(graded)
    h_src, w_src = src.shape[:2]
    top, bottom = mercator_y(MERC_NORTH), mercator_y(MERC_SOUTH)
    height = round(MERC_WIDTH * (top - bottom) / (2 * math.pi))
    ys = top - (np.arange(height) + 0.5) / height * (top - bottom)
    lats = np.degrees(2 * np.arctan(np.exp(ys)) - np.pi / 2)
    rows = np.clip(((90 - lats) / 180 * h_src).astype(int), 0, h_src - 1)
    cols = np.clip(((np.arange(MERC_WIDTH) + 0.5) / MERC_WIDTH * w_src).astype(int), 0, w_src - 1)
    Image.fromarray(src[rows][:, cols]).save(OUT / "qb-mercator.jpg", quality=92)
    print(f"qb-mercator.jpg {MERC_WIDTH}x{height}")

    for name, place in (("Washington", WASHINGTON), ("Anchorage", ANCHORAGE)):
        print(f"{name}: qibla {bearing(place, KAABA):.1f} deg, map line {rhumb(place, KAABA):.1f} deg")


if __name__ == "__main__":
    main()
