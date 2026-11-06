"""Clean and shape the creator's voice, and put it back under the prepared picture.

Usage: .venv\\Scripts\\python scripts/voice_chain.py <source video> public/footage/clip.mp4

Takes the sound from the source (the creator's own export, before any automatic
levelling), brings it to a working level, and runs: high-pass 80 Hz, gentle noise
reduction that follows the room, a downward expander that lowers the room between
words by up to 12 dB, de-essing, 3:1 compression, a small presence lift at 4 kHz,
then a two-pass linear loudness match to -16 LUFS (the final mix is set to -14 by
finalize.py, after the sound effects). The expander runs before the compressor:
the other way round the compressor's lift undoes it. The picture is copied
untouched; the old file is kept as <clip>.before-voice.mp4. Prints the loudness
and how far the room sits below the speech, in the source and in the result.
"""
import argparse
import json
import pathlib
import re
import shutil
import subprocess

VOICE_LUFS = -16.0
VOICE_PEAK = -2.0
WORKING_LUFS = -20.0  # the expander threshold below is set for speech at this level
CHAIN = ",".join([
    "pan=mono|c0=0.5*c0+0.5*c1",
    "highpass=f=80:poles=2",
    "volume={pre_gain:.1f}dB",
    "afftdn=nr=12:nf=-50:tn=1",  # gentle: 12 dB at most, tracking the noise as it changes
    # Measured on this voice: room drops 10 dB, quiet speech is untouched.
    "agate=threshold=0.05:ratio=4:range=0.25:attack=3:release=200:knee=2",
    "deesser=i=0.35:m=0.5:f=0.5",
    "acompressor=threshold=-20dB:ratio=3:attack=8:release=150:makeup=2",
    "equalizer=f=4000:t=q:w=1.0:g=2.5",
    # Keeps the peaks 12 dB under the loudness, so the final -14 LUFS mix has room
    # under -1 dBTP for the effects without the finishing pass having to squash it.
    "alimiter=limit=0.4:attack=4:release=60:level=false",
])


def run(args):
    return subprocess.run(args, capture_output=True, text=True, check=True).stderr


def loudness(path, chain=None):
    filters = f"{chain}," if chain else ""
    log = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-vn", "-af",
               f"{filters}loudnorm=I={VOICE_LUFS}:TP={VOICE_PEAK}:LRA=11:print_format=json", "-f", "null", "-"])
    return json.loads(log[log.rindex("{"):log.rindex("}") + 1])


def room_gap(path):
    """dB between typical speech (70th percentile of 50 ms windows) and the room
    between words (5th percentile). Bigger is cleaner."""
    log = run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(path), "-vn", "-af",
               "pan=mono|c0=0.5*c0+0.5*c1,asetnsamples=2400,astats=metadata=1:reset=1,"
               "ametadata=print:key=lavfi.astats.Overall.RMS_level",
               "-f", "null", "-"])
    levels = sorted(float(v) for v in re.findall(r"RMS_level=(-?[\d.]+)", log))
    return levels[len(levels) * 7 // 10] - levels[len(levels) // 20]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=pathlib.Path)
    parser.add_argument("footage", type=pathlib.Path)
    args = parser.parse_args()

    before = args.footage.with_name(f"{args.footage.stem}.before-voice.mp4")
    if not before.exists():
        shutil.copy2(args.footage, before)

    source = loudness(args.source, "pan=mono|c0=0.5*c0+0.5*c1,highpass=f=80:poles=2")
    chain = CHAIN.format(pre_gain=WORKING_LUFS - float(source["input_i"]))
    measured = loudness(args.source, chain)
    match = (f"loudnorm=I={VOICE_LUFS}:TP={VOICE_PEAK}:LRA=11:measured_I={measured['input_i']}"
             f":measured_TP={measured['input_tp']}:measured_LRA={measured['input_lra']}"
             f":measured_thresh={measured['input_thresh']}:offset={measured['target_offset']}:linear=true")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(before), "-i", str(args.source),
         "-map", "0:v", "-map", "1:a", "-c:v", "copy",
         "-af", f"{chain},{match}", "-ar", "48000", "-ac", "1", "-c:a", "aac", "-b:a", "320k",
         "-shortest", "-movflags", "+faststart", str(args.footage)],
        check=True,
    )
    after = loudness(args.footage)
    print(f"Voice: {float(after['input_i']):.1f} LUFS, true peak {float(after['input_tp']):.1f} dBTP")
    print(f"Room below the speech: {room_gap(args.source):.1f} dB in the source, "
          f"{room_gap(args.footage):.1f} dB now")
    print(f"Saved {args.footage} (picture untouched; previous file kept as {before.name})")


if __name__ == "__main__":
    main()
