"""Generate the studio's sound effects with FFmpeg. No downloads, no licences.

Usage: .venv\\Scripts\\python scripts/make_sfx.py

Writes public/sfx/<name>.wav for every sound below: whooshes, a hit, ticks, a riser,
a sub-bass hit and a shimmer. They are kept quiet and short on purpose: they mark a
change on screen, they are not the soundtrack.
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
    # Two more whooshes, so a repeated move never sounds copied (QUALITY.md).
    "whoosh-2": [
        "-f", "lavfi", "-i", "anoisesrc=d=0.6:c=pink:a=0.6:r=48000:s=11",
        "-af", "highpass=f=500,lowpass=f=7000,afade=t=in:st=0:d=0.3:curve=exp,"
               "afade=t=out:st=0.3:d=0.3:curve=exp,volume=0.9",
    ],
    "whoosh-3": [
        "-f", "lavfi", "-i", "anoisesrc=d=0.8:c=pink:a=0.6:r=48000:s=23",
        "-af", "highpass=f=250,lowpass=f=4200,afade=t=in:st=0:d=0.46:curve=exp,"
               "afade=t=out:st=0.46:d=0.34:curve=exp,volume=0.9",
    ],
    # Soft ticks for letters lighting up: a short pitched tap on a click of air,
    # three pitches so seven in a row do not sound like a metronome.
    "tick-soft-1": [
        "-f", "lavfi", "-i", "sine=f=1320:d=0.12:r=48000",
        "-f", "lavfi", "-i", "anoisesrc=d=0.012:c=white:a=0.5:r=48000",
        "-filter_complex", "[0]afade=t=out:st=0:d=0.12:curve=exp[t];[1]highpass=f=3000[c];"
                           "[t][c]amix=inputs=2:normalize=0",
    ],
    "tick-soft-2": [
        "-f", "lavfi", "-i", "sine=f=1480:d=0.12:r=48000",
        "-f", "lavfi", "-i", "anoisesrc=d=0.012:c=white:a=0.5:r=48000:s=5",
        "-filter_complex", "[0]afade=t=out:st=0:d=0.12:curve=exp[t];[1]highpass=f=3000[c];"
                           "[t][c]amix=inputs=2:normalize=0",
    ],
    "tick-soft-3": [
        "-f", "lavfi", "-i", "sine=f=1760:d=0.12:r=48000",
        "-f", "lavfi", "-i", "anoisesrc=d=0.012:c=white:a=0.5:r=48000:s=9",
        "-filter_complex", "[0]afade=t=out:st=0:d=0.12:curve=exp[t];[1]highpass=f=3000[c];"
                           "[t][c]amix=inputs=2:normalize=0",
    ],
    # A low riser that builds for 1.2 s into a hit: dark air swelling under a slow
    # upward sweep. It stops dead where the hit lands.
    "riser": [
        "-f", "lavfi", "-i", "anoisesrc=d=1.2:c=pink:a=0.7:r=48000:s=3",
        "-f", "lavfi", "-i", "aevalsrc=0.35*sin(2*PI*(110*t+260*t*t)):d=1.2:s=48000",
        "-filter_complex", "[0]lowpass=f=2400,afade=t=in:st=0:d=1.2:curve=exp[n];"
                           "[1]afade=t=in:st=0:d=1.2:curve=exp[s];"
                           "[n][s]amix=inputs=2:normalize=0,afade=t=out:st=1.17:d=0.03",
    ],
    # A sub-bass hit: a low sine that falls in pitch, with a soft dark thud on top.
    "sub-hit": [
        "-f", "lavfi", "-i", "aevalsrc=sin(2*PI*(58*t-9*t*t)):d=1.4:s=48000",
        "-f", "lavfi", "-i", "anoisesrc=d=0.09:c=brown:a=0.9:r=48000:s=7",
        "-filter_complex", "[0]afade=t=in:st=0:d=0.004,afade=t=out:st=0.05:d=1.35:curve=exp,volume=1.4[low];"
                           "[1]lowpass=f=600,afade=t=out:st=0:d=0.09[thud];"
                           "[low][thud]amix=inputs=2:normalize=0,alimiter=limit=0.9",
    ],
    # A soft shimmer for the ring forming: a few high partials that swell, tremble and fade.
    "shimmer": [
        "-f", "lavfi", "-i", "aevalsrc=0.2*sin(2*PI*1760*t)+0.15*sin(2*PI*2637*t)+0.1*sin(2*PI*3520*t)+0.08*sin(2*PI*4186*t):d=1.8:s=48000",
        "-af", "tremolo=f=7:d=0.35,afade=t=in:st=0:d=0.5:curve=qsin,afade=t=out:st=0.6:d=1.2:curve=exp,"
               "aecho=0.8:0.7:60|110:0.3|0.2",
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
