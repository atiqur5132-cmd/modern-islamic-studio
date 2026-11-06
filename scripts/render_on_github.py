"""Render a composition on GitHub Actions and download the result.

Usage: .venv\\Scripts\\python scripts/render_on_github.py <composition>
           [--props projects/x/edit.json] [--footage file ...] [--frames 510-1320]

--frames renders only that range, for a short motion preview.
Commit and push first: GitHub renders the current branch as pushed, not local edits.
Footage goes up in a draft release, which is deleted once the run ends.
"""
import argparse
import datetime
import json
import pathlib
import re
import subprocess
import time

ROOT = pathlib.Path(__file__).resolve().parent.parent


GH_ATTEMPTS = 3
GH_RETRY_SECONDS = 15


def gh(*args, capture=False):
    """Run gh, retrying when the connection to GitHub drops for a moment."""
    for attempt in range(1, GH_ATTEMPTS + 1):
        try:
            result = subprocess.run(["gh", *args], cwd=ROOT, check=True, text=True,
                                    capture_output=capture)
            return result.stdout if capture else None
        except subprocess.CalledProcessError:
            if attempt == GH_ATTEMPTS:
                raise
            print(f"gh {args[0]} failed, retrying in {GH_RETRY_SECONDS}s")
            time.sleep(GH_RETRY_SECONDS)


MEDIA = (".mp4", ".mov", ".jpg", ".jpeg", ".png", ".webp")


def media_in(value):
    """Every footage file an overlay names, at any depth (src, photo, shots, globe...)."""
    if isinstance(value, dict):
        return [name for item in value.values() for name in media_in(item)]
    if isinstance(value, list):
        return [name for item in value for name in media_in(item)]
    if isinstance(value, str) and value.lower().endswith(MEDIA) and (ROOT / "public" / "footage" / value).is_file():
        return [value]
    return []


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("composition")
    parser.add_argument("--props", default="")
    parser.add_argument("--footage", nargs="*", default=None, type=pathlib.Path,
                        help="defaults to every file the --props edit uses")
    parser.add_argument("--frames", default="", help="a frame range such as 510-1320, for a preview")
    args = parser.parse_args()

    if args.footage is None:
        args.footage = []
        if args.props:
            edit = json.loads((ROOT / args.props).read_text(encoding="utf-8"))
            names = [edit["footage"], *edit.get("assets", []), *media_in(edit["overlays"])]
            args.footage = [ROOT / "public" / "footage" / name for name in dict.fromkeys(names)]

    branch = subprocess.run(["git", "branch", "--show-current"], cwd=ROOT, check=True,
                            text=True, capture_output=True).stdout.strip()

    tag = ""
    dispatch = ["workflow", "run", "render.yml", "--ref", branch,
                "-f", f"composition={args.composition}", "-f", f"props={args.props}"]
    if args.frames:
        dispatch += ["-f", f"frames={args.frames}"]
    if args.footage:
        tag = "footage-" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        gh("release", "create", tag, "--draft", "--title", tag, "--notes", "Temporary render input",
           *[str(path) for path in args.footage])
        dispatch += ["-f", f"footage_release={tag}"]

    try:
        output = gh(*dispatch, capture=True)
        run_id = re.search(r"/actions/runs/(\d+)", output).group(1)
        print(f"Run {run_id} started")
        gh("run", "watch", run_id, "--exit-status", "--interval", "15")

        target = ROOT / "out" / run_id
        gh("run", "download", run_id, "--dir", str(target))
        print(f"Saved in {target.relative_to(ROOT)}")
    finally:
        if tag:
            gh("release", "delete", tag, "--yes")
            print(f"Deleted draft release {tag}")


if __name__ == "__main__":
    main()
