"""Download a portrait B-roll clip from Pexels and prepare it for the edit.

Usage: .venv\\Scripts\\python scripts/fetch_broll.py "fingerprint macro" --name fingerprint

Needs PEXELS_API_KEY in .env (free from pexels.com/api). Writes
public/footage/broll-<name>.mp4 (1080x1920, 30 fps, silent) and a .json with the
clip's credit. Pexels clips are free to use; the credit is kept anyway. Watch the
clip before using it: every B-roll shot must serve the story.
"""
import argparse
import json
import pathlib
import subprocess
import urllib.parse
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
SEARCH_URL = "https://api.pexels.com/videos/search"
CANDIDATES = 15


def api_key():
    for line in (ROOT / ".env").read_text(encoding="utf-8").splitlines():
        name, _, value = line.partition("=")
        if name.strip() == "PEXELS_API_KEY" and value.strip():
            return value.strip()
    raise SystemExit("Add PEXELS_API_KEY=... to .env first.")


def search(query, key):
    params = urllib.parse.urlencode({"query": query, "orientation": "portrait", "per_page": CANDIDATES})
    request = urllib.request.Request(f"{SEARCH_URL}?{params}",
                                     headers={"Authorization": key, "User-Agent": "modern-islamic-studio"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)["videos"]


def best_file(video):
    """The smallest portrait file that is still at least 1080 wide."""
    portrait = [f for f in video["video_files"]
                if f.get("width") and f.get("height") and f["height"] > f["width"] and f["width"] >= 1080]
    return min(portrait, key=lambda f: f["width"]) if portrait else None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("query")
    parser.add_argument("--name", required=True)
    parser.add_argument("--pick", type=int, default=0, help="which usable result to take")
    args = parser.parse_args()

    usable = [(video, best_file(video)) for video in search(args.query, api_key())]
    usable = [(video, file) for video, file in usable if file]
    if len(usable) <= args.pick:
        raise SystemExit(f"Only {len(usable)} usable portrait clips for '{args.query}'.")
    video, file = usable[args.pick]

    out_dir = ROOT / "public" / "footage"
    raw = ROOT / "work" / f"broll-{args.name}.raw.mp4"
    raw.parent.mkdir(exist_ok=True)
    urllib.request.urlretrieve(file["link"], raw)
    output = out_dir / f"broll-{args.name}.mp4"
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw),
         "-vf", "fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920",
         "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p",
         str(output)],
        check=True,
    )
    raw.unlink()
    credit = {"query": args.query, "pexelsUrl": video["url"], "by": video["user"]["name"],
              "duration": video["duration"]}
    output.with_suffix(".json").write_text(json.dumps(credit, indent=2), encoding="utf-8")
    print(f"Saved {output.relative_to(ROOT)} ({video['duration']}s) by {credit['by']}: {video['url']}")
    print(f"Use it in edit.json as {{\"type\": \"broll\", \"src\": \"{output.name}\", ...}}")


if __name__ == "__main__":
    main()
