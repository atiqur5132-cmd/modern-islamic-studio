"""Prepare the four YouTube Audio Library tracks for the lab-meat video (beats.md, Music).

Each track is cut to the stretch it plays, high-passed at 120 Hz (no low pulse or thump under the voice),
low-passed at 7 kHz (nothing sharp: the creator said loud music "kaan me chubhta hai"), then set to exactly
-30 LUFS so the composition's gains are in plain dB. Writes public/footage/lab-music-*.wav (never committed;
Audio Library files reach the GitHub render through the draft release). The voice has no pause over 0.6 s,
so the music sits at its under-voice level throughout and only lifts on the end screen (music.ts).

Usage: .venv\\Scripts\\python projects/lab-meat/build_music.py
"""
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = ROOT / "Raw footages" / "music"
OUT = ROOT / "public" / "footage"  # the GitHub render fetches footage/ from the draft release
TARGET = -30.0
# name: (file, seconds into the track to start, seconds needed). EBB uses only its calm first minutes
# (a low pulse starts near 3:00, measured 2026-11-24).
TRACKS = {
    "lab-music-laniakea": ("Laniakea - The Grey Room _ Density & Time.mp3", 0.0, 126.0),
    "lab-music-ebb": ("EBB - Density & Time.mp3", 0.0, 163.0),
    "lab-music-singularity": ("Singularity - The Grey Room _ Density & Time.mp3", 0.0, 110.0),
    "lab-music-sunrise": ("Last Sunrise - Adam MacDougall.mp3", 0.0, 64.0),
}
FILTERS = "highpass=f=120:poles=2,lowpass=f=7000:poles=2"


def loudness(path):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "ebur128", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", err)[-1])


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (file, start, length) in TRACKS.items():
        tmp = OUT / f"{name}.tmp.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", str(start), "-t", str(length), "-i", str(SRC / file),
                        "-af", FILTERS, "-ac", "1", "-ar", "48000", str(tmp)], check=True)
        gain = TARGET - loudness(tmp)
        out = OUT / f"{name}.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-af", f"volume={gain:.2f}dB",
                        "-ar", "48000", str(out)], check=True)
        tmp.unlink()
        print(f"{out.name}: {length:.0f} s, gain {gain:+.1f} dB, now {loudness(out):.1f} LUFS")



if __name__ == "__main__":
    main()
