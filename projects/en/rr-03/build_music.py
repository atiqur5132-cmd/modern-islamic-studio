"""Arrange the chosen music track (A, creator's pick 2026-11-21) into a bed for the whole video.

Each chapter gets its own stretch of the 2-minute track, crossfaded over 1.5 s at the chapter
changes: the energetic opening under the hook and chapter 1, the opening again for chapter 2, the
quiet breakdown (track 56-84 s) under the "zero tax" secret, and the track's own ending under the
outro. The bed sits at about -34 LUFS (~18 LU under the voice) and the voice ducks it (sidechain).
Drops before reveals and chapter swells are applied in Remotion (src/long/salary/sounds.ts).

Usage: .venv\\Scripts\\python projects/en/rr-03/build_music.py
"""
import pathlib
import subprocess

HERE = pathlib.Path(__file__).resolve().parent
TRACK = HERE / "music" / "A-dark-moody-beat.mp3"
VOICE = HERE / "voice.wav"
OUT = HERE.parent.parent.parent / "public" / "music" / "rr03-bed.wav"
LENGTH = 317.5
FADE = 1.5
GAIN_DB = -14.0  # track is ~-14.5 LUFS before ducking; after ducking the bed measures -34.9 LUFS

# (start in track, end in track, placed at video second)
SEGMENTS = [
    (0.0, 98.0, 0.0),      # hook + chapter 1 (two buckets); the rebuild at 86 s lands on "So why would a billionaire"
    (0.0, 61.4, 96.5),     # chapter 2 (the back door)
    (56.0, 109.0, 156.4),  # chapter 3 opens in the breakdown: the secret
    (0.0, 33.5, 207.9),    # chapter 3, the loan
    (32.0, 75.0, 239.9),   # chapter 4 (PR and control)
    (84.6, 120.0, 281.4),  # outro: the track's own ending closes the video
]


def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    inputs, parts, labels = [], [], []
    for i, (a, b, at) in enumerate(SEGMENTS):
        inputs += ["-i", str(TRACK)]
        d = b - a
        fin = 0.05 if i == 0 else FADE
        fout = f"afade=t=out:st={d - FADE:.3f}:d={FADE}," if i < len(SEGMENTS) - 1 else ""
        ms = int(round(at * 1000))
        parts.append(f"[{i}:a]atrim={a}:{b},asetpts=PTS-STARTPTS,aresample=48000,afade=t=in:d={fin},{fout}adelay={ms}|{ms}[s{i}]")
        labels.append(f"[s{i}]")
    n = len(SEGMENTS)
    parts.append(f"{''.join(labels)}amix=inputs={n}:normalize=0,atrim=0:{LENGTH},volume={GAIN_DB}dB[m]")
    parts.append(f"[{n}:a]aresample=48000,pan=stereo|c0=c0|c1=c0[sc]")
    parts.append("[m][sc]sidechaincompress=threshold=0.05:ratio=2:attack=40:release=600[o]")
    cmd = ["ffmpeg", "-v", "error", "-y", *inputs, "-i", str(VOICE), "-filter_complex", ";".join(parts), "-map", "[o]", "-c:a", "pcm_s16le", str(OUT)]
    subprocess.run(cmd, check=True)
    print(OUT)


if __name__ == "__main__":
    main()
