"""Earth pictures for the 3D globe: a sharper skin, and sharp patches where the camera dives.

Usage: .venv\\Scripts\\python projects/oldest-university/make_globe_patches.py

Source: NASA Blue Marble Next Generation with shaded relief and bathymetry (public
domain), served in plain latitude/longitude (EPSG:4326) by NASA GIBS WMS, so no
reprojection is needed and the patches match the skin exactly. (Sentinel-2 cloudless 2016
was tried first; its scene seams cross the Gangetic plain right at Nalanda.)

Writes public/footage/:
  ou-earth.jpg          the whole world, 8192 x 4096 (about 23 px a degree)
  ou-patch-<name>.jpg   boxes at 120 px a degree; Globe3D lays them over the skin and
                        feathers their edges
"""
import io
import pathlib
import time
import urllib.parse
import urllib.request

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "footage"
WMS = "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"
LAYER = "BlueMarble_ShadedRelief_Bathymetry"
CHUNK = 2048  # pixels per request side
PIXELS_PER_DEGREE = 120
# south, north, west, east
PATCHES = {
    "india": (14.0, 36.0, 68.0, 100.0),
    "maghreb": (24.0, 44.0, -16.0, 14.0),
    "italy": (36.0, 50.0, 0.0, 22.0),
}


def get_map(south, north, west, east, width, height):
    query = urllib.parse.urlencode({
        "SERVICE": "WMS", "REQUEST": "GetMap", "VERSION": "1.3.0", "LAYERS": LAYER, "STYLES": "",
        "CRS": "EPSG:4326", "BBOX": f"{south},{west},{north},{east}",  # WMS 1.3.0: lat,lon order
        "WIDTH": width, "HEIGHT": height, "FORMAT": "image/jpeg",
    })
    for attempt in range(3):
        try:
            request = urllib.request.Request(f"{WMS}?{query}", headers={"User-Agent": "modern-islamic-studio-globe"})
            with urllib.request.urlopen(request, timeout=120) as response:
                return Image.open(io.BytesIO(response.read())).convert("RGB")
        except Exception:
            if attempt == 2:
                raise
            time.sleep(2 + attempt)


def box_image(south, north, west, east, width, height):
    """The box at width x height, fetched in chunks no larger than CHUNK."""
    sheet = Image.new("RGB", (width, height))
    for top in range(0, height, CHUNK):
        for left in range(0, width, CHUNK):
            w, h = min(CHUNK, width - left), min(CHUNK, height - top)
            n = north - (north - south) * top / height
            s = north - (north - south) * (top + h) / height
            wl = west + (east - west) * left / width
            el = west + (east - west) * (left + w) / width
            sheet.paste(get_map(s, n, wl, el, w, h), (left, top))
    return sheet


def main():
    world = box_image(-90, 90, -180, 180, 8192, 4096)
    world.save(OUT / "ou-earth.jpg", quality=90)
    print("world: 8192x4096 -> ou-earth.jpg")
    for name, (south, north, west, east) in PATCHES.items():
        size = (round((east - west) * PIXELS_PER_DEGREE), round((north - south) * PIXELS_PER_DEGREE))
        box_image(south, north, west, east, *size).save(OUT / f"ou-patch-{name}.jpg", quality=90)
        print(f"{name}: {size[0]}x{size[1]} south={south} north={north} west={west} east={east}")


if __name__ == "__main__":
    main()
