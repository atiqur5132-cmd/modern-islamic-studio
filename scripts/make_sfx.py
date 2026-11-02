"""Generate the studio's sound effects with FFmpeg. No downloads, no licences.

Usage: .venv\\Scripts\\python scripts/make_sfx.py

Writes public/sfx/whoosh.wav, impact.wav and tick.wav. They are kept quiet and
short on purpose: they mark a change on screen, they are not the soundtrack.
"""
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent

SOUNDS = {
    # Filtered pink noise that swells and fades: air moving past.
    "whoosh": [
        "-f", "lavfi", "-i", "anoisesrc=d=0.7:c=pink:a=0.6:r=48000",
        "-af", "highpass=f=350,lowpass=f=5500,afade=t=in:st=0:d=0.38:curve=exp,"
               "afade=t=out:st=0.38:d=0.32:curve=exp,volume=0.9",
    ],
    # A low sine thump with a short burst of dark noise on top: a soft hit.
    "impact": [
        "-f", "lavfi", "-i", "sine=f=52:d=0.9:r=48000",
        "-f", "lavfi", "-i", "anoisesrc=d=0.14:c=brown:a=0.9:r=48000",
        "-filter_complex",
        "[0]afade=t=out:st=0.03:d=0.85:curve=exp,volume=1.6[low];"
        "[1]lowpass=f=900,afade=t=out:st=0:d=0.14[hit];"
        "[low][hit]amix=inputs=2:normalize=0,alimiter=limit=0.9",
    ],
    # A tiny bright tick, for bones clicking into place.
    "tick": [
        "-f", "lavfi", "-i", "sine=f=1900:d=0.05:r=48000",
        "-af", "afade=t=out:st=0:d=0.05:curve=exp,volume=0.7",
    ],
}


PEAK_DB = -3.0  # every effect peaks here; the edit sets how loud each one plays


def peak_db(path):
    report = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "volumedetect", "-f", "null", "-"],
                            capture_output=True, text=True, check=True).stderr
    return float(re.search(r"max_volume: (-?[\d.]+) dB", report).group(1))


def main():
    out_dir = ROOT / "public" / "sfx"
    out_dir.mkdir(parents=True, exist_ok=True)
    for name, args in SOUNDS.items():
        raw = out_dir / f"{name}.raw.wav"
        output = out_dir / f"{name}.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args, "-ac", "2", str(raw)], check=True)
        gain = PEAK_DB - peak_db(raw)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af", f"volume={gain:.2f}dB",
                        str(output)], check=True)
        raw.unlink()
        print(f"Saved {output.relative_to(ROOT)}, peak {peak_db(output):.1f} dB")


if __name__ == "__main__":
    main()
