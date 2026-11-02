"""Render a composition on GitHub Actions and download the result.

Usage: .venv\\Scripts\\python scripts/render_on_github.py <composition> [--footage file ...]

Commit and push code first: GitHub renders what is on main, not local edits.
Footage goes up in a draft release, which is deleted once the run ends.
"""
import argparse
import datetime
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent


def gh(*args, capture=False):
    result = subprocess.run(["gh", *args], cwd=ROOT, check=True, text=True,
                            capture_output=capture)
    return result.stdout if capture else None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("composition")
    parser.add_argument("--footage", nargs="*", default=[], type=pathlib.Path)
    args = parser.parse_args()

    tag = ""
    dispatch = ["workflow", "run", "render.yml", "-f", f"composition={args.composition}"]
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
