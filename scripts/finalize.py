"""Turn a Remotion render into the file that gets uploaded, and prove its sound is in spec.

Usage: .venv\\Scripts\\python scripts/finalize.py out/local/clip.mp4

Converts the Windows full-range render to TV range, brings the mix to -14 LUFS with
the true peak under -1 dBTP (two-pass loudnorm, linear, so the mix is not squashed),
then measures the written file. Writes <name>-final.mp4 next to the render and exits
with an error when the result is out of spec.
"""
import argparse
import json
import pathlib
import re
import subprocess

TARGET_LUFS = -14.0
LUFS_TOLERANCE = 1.0
MAX_TRUE_PEAK = -1.0
# Aim under the limit: AAC encoding adds a few tenths of a dB of peak.
TARGET_TRUE_PEAK = -1.8
LRA = 11
VIDEO = ["-vf", "scale=in_range=pc:out_range=tv,format=yuv420p", "-color_range", "tv",
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "18"]


def loudnorm_measure(video):
    """First loudnorm pass: the mix as it is."""
    result = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", str(video), "-vn",
         "-af", f"loudnorm=I={TARGET_LUFS}:TP={TARGET_TRUE_PEAK}:LRA={LRA}:print_format=json",
         "-f", "null", "-"],
        capture_output=True, text=True, check=True,
    )
    log = result.stderr
    return json.loads(log[log.rindex("{"):log.rindex("}") + 1])


def ebur128(video):
    """Integrated loudness and true peak of a written file."""
    result = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", str(video), "-vn",
         "-af", "ebur128=peak=true", "-f", "null", "-"],
        capture_output=True, text=True, check=True,
    )
    summary = result.stderr[result.stderr.rindex("Summary:"):]
    integrated = float(re.search(r"I:\s+(-?[\d.]+) LUFS", summary).group(1))
    peak = float(re.search(r"Peak:\s+(-?[\d.]+|-inf) dBFS", summary).group(1))
    return integrated, peak


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("render", type=pathlib.Path)
    args = parser.parse_args()

    measured = loudnorm_measure(args.render)
    loudnorm = (f"loudnorm=I={TARGET_LUFS}:TP={TARGET_TRUE_PEAK}:LRA={LRA}"
                f":measured_I={measured['input_i']}:measured_TP={measured['input_tp']}"
                f":measured_LRA={measured['input_lra']}:measured_thresh={measured['input_thresh']}"
                f":offset={measured['target_offset']}:linear=true")
    output = args.render.with_name(f"{args.render.stem}-final.mp4")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(args.render), *VIDEO,
         "-af", loudnorm, "-ar", "48000", "-c:a", "aac", "-b:a", "192k",
         "-movflags", "+faststart", str(output)],
        check=True,
    )

    integrated, peak = ebur128(output)
    loud_ok = abs(integrated - TARGET_LUFS) <= LUFS_TOLERANCE
    peak_ok = peak <= MAX_TRUE_PEAK
    print(f"Before: {float(measured['input_i']):.1f} LUFS, true peak {float(measured['input_tp']):.1f} dBTP")
    print(f"After:  {integrated:.1f} LUFS ({'pass' if loud_ok else 'FAIL'}), "
          f"true peak {peak:.1f} dBTP ({'pass' if peak_ok else 'FAIL'})")
    print(f"Saved {output}")
    if not (loud_ok and peak_ok):
        raise SystemExit("Sound is out of spec; see QUALITY.md section 6.")


if __name__ == "__main__":
    main()
