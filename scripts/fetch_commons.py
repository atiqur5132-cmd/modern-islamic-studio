"""Find and fetch freely licensed B-roll from Wikimedia Commons. No key needed.

Search, then look at the thumbnails it saves:
  .venv\\Scripts\\python scripts/fetch_commons.py search "fingerprint" --kind bitmap
Fetch one by its exact file title:
  .venv\\Scripts\\python scripts/fetch_commons.py get "File:Example.jpg" --name fingerprint --project quran-facts

Only licences that allow commercial use and editing are accepted. Every fetched file
gets its credit written next to it and added to projects/<project>/credits.txt,
which belongs in the video description.
"""
import argparse
import json
import pathlib
import re
import subprocess
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
API = "https://commons.wikimedia.org/w/api.php"
USER_AGENT = "modern-islamic-studio/0.1 (https://github.com/atiqur5132-cmd/modern-islamic-studio)"
ALLOWED_LICENCES = ("cc0", "public domain", "pd", "cc by", "cc-by")
REFUSED_LICENCES = ("nc", "nd", "fair use", "non-free")
THUMB_WIDTH = 400
RESULTS = 12


def get(params):
    url = f"{API}?{urllib.parse.urlencode({**params, 'format': 'json'})}"
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def plain(html):
    return re.sub(r"<[^>]+>", "", html or "").strip()


def describe(page):
    info = page["imageinfo"][0]
    meta = info.get("extmetadata", {})
    licence = plain(meta.get("LicenseShortName", {}).get("value", ""))
    return {
        "title": page["title"],
        "licence": licence,
        "licenceUrl": meta.get("LicenseUrl", {}).get("value", ""),
        "author": plain(meta.get("Artist", {}).get("value", "")) or "unknown",
        "width": info.get("width"),
        "height": info.get("height"),
        "mime": info.get("mime"),
        "url": info["url"],
        "thumb": info.get("thumburl"),
        "page": info.get("descriptionurl"),
    }


def licence_ok(licence):
    lowered = licence.lower()
    return any(a in lowered for a in ALLOWED_LICENCES) and not any(r in lowered for r in REFUSED_LICENCES)


def file_info(titles, **extra):
    return get({"action": "query", "prop": "imageinfo", "iiprop": "url|size|mime|extmetadata",
                "iiurlwidth": THUMB_WIDTH, **extra, **titles})


def search(query, kind):
    data = file_info({"generator": "search", "gsrsearch": f"{query} filetype:{kind}",
                      "gsrnamespace": 6, "gsrlimit": RESULTS})
    out_dir = ROOT / "work" / "broll-candidates"
    out_dir.mkdir(parents=True, exist_ok=True)
    pages = sorted(data.get("query", {}).get("pages", {}).values(), key=lambda p: p.get("index", 0))
    for number, page in enumerate(pages):
        item = describe(page)
        status = "OK " if licence_ok(item["licence"]) else "NO "
        print(f"{status}[{number}] {item['title']} | {item['licence']} | {item['width']}x{item['height']} | {item['author'][:40]}")
        if status == "OK " and item["thumb"]:
            request = urllib.request.Request(item["thumb"], headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(request, timeout=30) as response:
                (out_dir / f"{number:02d}.jpg").write_bytes(response.read())


def fetch(title, name, project):
    page = next(iter(file_info({"titles": title})["query"]["pages"].values()))
    item = describe(page)
    if not licence_ok(item["licence"]):
        raise SystemExit(f"Refused: licence '{item['licence']}' does not allow this use.")

    raw = ROOT / "work" / f"commons-{name}{pathlib.Path(item['url']).suffix}"
    request = urllib.request.Request(item["url"], headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=120) as response:
        raw.write_bytes(response.read())

    footage = ROOT / "public" / "footage"
    footage.mkdir(parents=True, exist_ok=True)
    cover = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920"
    if item["mime"].startswith("video/"):
        output = footage / f"broll-{name}.mp4"
        command = ["-vf", f"fps=30,{cover}", "-an", "-c:v", "libx264", "-preset", "veryfast",
                   "-crf", "20", "-pix_fmt", "yuv420p"]
    else:
        # Photos keep extra room around the frame for the slow push and pan.
        output = footage / f"broll-{name}.jpg"
        command = ["-vf", "scale=1300:2310:force_original_aspect_ratio=increase,crop=1300:2310",
                   "-q:v", "3"]
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), *command, str(output)],
                   check=True)
    raw.unlink()

    credit = {key: item[key] for key in ("title", "author", "licence", "licenceUrl", "page")}
    output.with_suffix(".json").write_text(json.dumps(credit, ensure_ascii=False, indent=2),
                                           encoding="utf-8")
    line = f"{output.name}: \"{item['title'][5:]}\" by {item['author']}, {item['licence']}, {item['page']}"
    credits = ROOT / "projects" / project / "credits.txt"
    existing = credits.read_text(encoding="utf-8").splitlines() if credits.exists() else []
    kept = [entry for entry in existing if not entry.startswith(f"{output.name}:")]
    credits.write_text("\n".join(kept + [line]) + "\n", encoding="utf-8")
    print(f"Saved {output.relative_to(ROOT)}\n{line}")


def main():
    parser = argparse.ArgumentParser()
    commands = parser.add_subparsers(dest="command", required=True)
    find = commands.add_parser("search")
    find.add_argument("query")
    find.add_argument("--kind", choices=["bitmap", "video"], default="bitmap")
    take = commands.add_parser("get")
    take.add_argument("title")
    take.add_argument("--name", required=True)
    take.add_argument("--project", required=True)
    args = parser.parse_args()
    if args.command == "search":
        search(args.query, args.kind)
    else:
        fetch(args.title, args.name, args.project)


if __name__ == "__main__":
    main()
