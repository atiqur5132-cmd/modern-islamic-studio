"""Download real terrain for a 3D scene: elevation plus a satellite picture of the same box.

Usage: .venv\\Scripts\\python scripts/fetch_terrain.py <name> --south 20.8 --north 21.7 --west 39.5 --east 40.5

Writes public/terrain/<name>/:
  height.bin   float32 metres, GRID x GRID, row 0 = north edge, column 0 = west edge
  color.jpg    satellite picture of the same box (north up)
  meta.json    box, grid size, height range, metres per degree, sources and licences

Sources (both free to use with attribution, credit them in the reel's credits.txt):
  Elevation: AWS Terrain Tiles (Terrarium), registry.opendata.aws/terrain-tiles
  Picture:   Sentinel-2 cloudless 2016 by EOX IT Services GmbH, s2maps.eu, CC BY 4.0
             (only the 2016 layer is CC BY; later years are non-commercial, so never switch
             the layer without checking its licence)
"""
import argparse
import io
import json
import math
import pathlib
import time
import urllib.request

import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
DEM_URL = "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"
IMG_URL = "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg"
CREDITS = {
    "elevation": "AWS Terrain Tiles (Terrarium), Mapzen/Amazon open data; includes SRTM and other public-domain DEMs",
    "imagery": "Sentinel-2 cloudless - https://s2maps.eu by EOX IT Services GmbH "
    "(Contains modified Copernicus Sentinel data 2016), CC BY 4.0",
}


def tile_xy(lat, lon, z):
    n = 2 ** z
    x = (lon + 180) / 360 * n
    y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return x, y


def get(url):
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "modern-islamic-studio-terrain"})
            with urllib.request.urlopen(request, timeout=30) as response:
                return response.read()
        except Exception:
            if attempt == 2:
                raise
            time.sleep(1 + attempt)


def mosaic(url, z, south, north, west, east, mode):
    """Tiles covering the box, stitched, then cut to the box (still in Mercator rows)."""
    x0, y0 = tile_xy(north, west, z)
    x1, y1 = tile_xy(south, east, z)
    tx = range(int(x0), int(x1) + 1)
    ty = range(int(y0), int(y1) + 1)
    sheet = Image.new(mode, (256 * len(tx), 256 * len(ty)))
    for j, y in enumerate(ty):
        for i, x in enumerate(tx):
            tile = Image.open(io.BytesIO(get(url.format(z=z, x=x, y=y)))).convert(mode)
            sheet.paste(tile.resize((256, 256)), (i * 256, j * 256))
    left, top = (x0 - tx[0]) * 256, (y0 - ty[0]) * 256
    right, bottom = (x1 - tx[0]) * 256, (y1 - ty[0]) * 256
    return sheet.crop((round(left), round(top), round(right), round(bottom)))


def to_latitude_rows(image, south, north, size):
    """Resample Mercator rows to rows evenly spaced in latitude (what the 3D plane expects)."""
    w, h = image.size
    ys = []
    for row in range(size[1]):
        lat = north - (north - south) * (row + 0.5) / size[1]
        merc = math.asinh(math.tan(math.radians(lat)))
        top, bottom = math.asinh(math.tan(math.radians(north))), math.asinh(math.tan(math.radians(south)))
        ys.append((top - merc) / (top - bottom) * h)
    src = np.asarray(image)
    rows = np.clip(np.array(ys).astype(int), 0, h - 1)
    cols = np.clip((np.arange(size[0]) + 0.5) / size[0] * w, 0, w - 1).astype(int)
    return src[rows][:, cols]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("name")
    parser.add_argument("--south", type=float, required=True)
    parser.add_argument("--north", type=float, required=True)
    parser.add_argument("--west", type=float, required=True)
    parser.add_argument("--east", type=float, required=True)
    parser.add_argument("--dem-zoom", type=int, default=10)
    parser.add_argument("--img-zoom", type=int, default=11)
    parser.add_argument("--grid", type=int, default=512)
    parser.add_argument("--img-size", type=int, default=2048)
    args = parser.parse_args()

    out = ROOT / "public" / "terrain" / args.name
    out.mkdir(parents=True, exist_ok=True)
    box = (args.south, args.north, args.west, args.east)

    dem = mosaic(DEM_URL, args.dem_zoom, *box, "RGB")
    rgb = to_latitude_rows(dem, args.south, args.north, (args.grid, args.grid)).astype(np.float32)
    height = rgb[..., 0] * 256 + rgb[..., 1] + rgb[..., 2] / 256 - 32768
    height.astype("<f4").tofile(out / "height.bin")

    lat_mid = (args.south + args.north) / 2
    aspect = (args.east - args.west) * math.cos(math.radians(lat_mid)) / (args.north - args.south)
    img = mosaic(IMG_URL, args.img_zoom, *box, "RGB")
    width = args.img_size
    pixels = to_latitude_rows(img, args.south, args.north, (width, round(width / aspect)))
    Image.fromarray(pixels).save(out / "color.jpg", quality=90)

    meta = {
        "south": args.south, "north": args.north, "west": args.west, "east": args.east,
        "grid": args.grid,
        "minHeight": float(height.min()), "maxHeight": float(height.max()),
        "metresPerDegreeLat": 111_320.0,
        "metresPerDegreeLon": 111_320.0 * math.cos(math.radians(lat_mid)),
        "credits": CREDITS,
    }
    (out / "meta.json").write_text(json.dumps(meta, indent=1), encoding="utf-8")
    print(f"OK {out}: heights {meta['minHeight']:.0f}..{meta['maxHeight']:.0f} m, picture {pixels.shape[1]}x{pixels.shape[0]}")


if __name__ == "__main__":
    main()
