"""Make the sharaab-fayda reel's own foley with FFmpeg: no downloads, no licences.

Usage: .venv\Scripts\python projects/sharaab-fayda/make_sfx.py

knock-1/2/3: a weight set down in a brass pan, a dull knock with no ring (a ringing
metal tone could read as a bell, SOUND.md 1). book-thud: a heavy book laid on wood.
Writes public/sfx/<name>.wav at -3 dBFS peak, 48 kHz.
"""
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
PEAK_DB = -3.0

def knock(f, seed, low):
    return ["-f", "lavfi", "-i", f"sine=f={low}:d=0.22:r=48000",
            "-f", "lavfi", "-i", f"anoisesrc=d=0.09:c=pink:a=0.9:r=48000:s={seed}",
            "-filter_complex",
            f"[0]afade=t=out:st=0:d=0.2:curve=exp,volume=1.2[a];"
            f"[1]bandpass=f={f}:w=900,afade=t=out:st=0:d=0.08:curve=exp,volume=2.2[b];"
            "[a][b]amix=inputs=2:normalize=0,alimiter=limit=0.9"]

SOUNDS = {
    "knock-1": knock(1500, 3, 140),
    "knock-2": knock(1250, 7, 120),
    "knock-3": knock(1750, 13, 160),
    "book-thud": ["-f", "lavfi", "-i", "sine=f=68:d=0.45:r=48000",
                  "-f", "lavfi", "-i", "anoisesrc=d=0.2:c=brown:a=0.9:r=48000:s=5",
                  "-filter_complex",
                  "[0]afade=t=out:st=0.01:d=0.42:curve=exp,volume=1.5[a];"
                  "[1]lowpass=f=600,afade=t=out:st=0:d=0.18:curve=exp,volume=1.8[b];"
                  "[a][b]amix=inputs=2:normalize=0,alimiter=limit=0.9"],
}

def peak_db(path):
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "volumedetect", "-f", "null", "-"],
                         capture_output=True, text=True, check=True).stderr
    return float(re.search(r"max_volume: (-?[\d.]+) dB", out).group(1))

for name, args in SOUNDS.items():
    raw = ROOT / "public" / "sfx" / f"{name}.raw.wav"
    out = ROOT / "public" / "sfx" / f"{name}.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args, "-ac", "2", str(raw)], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af",
                    f"volume={PEAK_DB - peak_db(raw):.2f}dB,afade=t=in:d=0.003", str(out)], check=True)
    raw.unlink()
    print(name, round(peak_db(out), 1))
