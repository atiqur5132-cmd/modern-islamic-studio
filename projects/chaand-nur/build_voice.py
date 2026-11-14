"""Build the finished voiceover for the faceless chaand-nur reel from the creator's take.

Usage: .venv\\Scripts\\python projects/chaand-nur/build_voice.py

The take (Raw footages/VN20261114_183354.mp4, extracted to public/footage/chaand-nur.m4a)
is one clean read of every script line, already trimmed tight by the creator in VN: no
retakes, no doubled phrases, no digital-silence joins (checked 2026-11-14). So nothing is
cut out of the words. The voice chain of scripts/voice_chain.py runs on the whole take,
then a two-pass linear loudness match to -16 LUFS (finalize.py sets the mix to -14 after
the sound effects). Pauses longer than MAX_PAUSE shrink to KEEP_PAUSE (QUALITY.md 2), with
12 ms fades on each splice. A short room-tone lead-in is not added: the voice must hit at
frame 0 (QUALITY.md 1).

Writes public/footage/chaand-nur.voice.wav and projects/chaand-nur/voice_map.json.
"""
import json
import pathlib
import subprocess
import sys
import wave

import numpy as np

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
from voice_chain import CHAIN, VOICE_LUFS, VOICE_PEAK, WORKING_LUFS, loudness  # noqa: E402

PROJECT = ROOT / "projects" / "chaand-nur"
RAW = ROOT / "public" / "footage" / "chaand-nur.m4a"
PROCESSED = ROOT / "work" / "chaand-nur.voice_full.wav"
OUT = ROOT / "public" / "footage" / "chaand-nur.voice.wav"
RATE = 48000
HOP = 0.01
MAX_PAUSE, KEEP_PAUSE = 0.45, 0.32
TAIL = 0.8


def main():
    source = loudness(RAW, "pan=mono|c0=0.5*c0+0.5*c1,highpass=f=80:poles=2")
    chain = CHAIN.format(pre_gain=WORKING_LUFS - float(source["input_i"]))
    measured = loudness(RAW, chain)
    match = (f"loudnorm=I={VOICE_LUFS}:TP={VOICE_PEAK}:LRA=11:measured_I={measured['input_i']}"
             f":measured_TP={measured['input_tp']}:measured_LRA={measured['input_lra']}"
             f":measured_thresh={measured['input_thresh']}:offset={measured['target_offset']}:linear=true")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(RAW), "-vn", "-af", f"{chain},{match}",
                    "-ar", str(RATE), "-ac", "1", "-c:a", "pcm_s16le", str(PROCESSED)], check=True)
    with wave.open(str(PROCESSED)) as audio:
        voice = np.frombuffer(audio.readframes(audio.getnframes()), dtype=np.int16).astype(np.float32) / 32768

    hop = int(HOP * RATE)
    frames = voice[: len(voice) // hop * hop].reshape(-1, hop)
    db = 20 * np.log10(np.sqrt((frames ** 2).mean(1)) + 1e-9)
    quiet = db < np.percentile(db, 10) + 10
    # Pauses: runs of quiet 10 ms frames, between voiced stretches.
    pauses, k = [], 0
    while k < len(quiet):
        if quiet[k]:
            j = k
            while j < len(quiet) and quiet[j]:
                j += 1
            if k > 0 and j < len(quiet) and (j - k) * HOP > MAX_PAUSE:
                pauses.append((k * HOP, j * HOP))
            k = j
        else:
            k += 1

    fade = int(0.012 * RATE)
    out, mapping, cursor = [], [], 0.0
    # Keep [pos, a + KEEP/2] then resume at [b - KEEP/2, ...]: the pause shrinks to KEEP_PAUSE.
    spans, pos = [], 0.0
    for a, b in pauses:
        spans.append((pos, a + KEEP_PAUSE / 2))
        pos = b - KEEP_PAUSE / 2
    spans.append((pos, len(voice) / RATE))
    for s, e in spans:
        chunk = voice[int(s * RATE): int(e * RATE)].copy()
        if len(spans) > 1:
            chunk[:fade] *= np.linspace(0, 1, fade)
            chunk[-fade:] *= np.linspace(1, 0, fade)
        mapping.append({"sourceFrom": round(s, 3), "sourceTo": round(e, 3),
                        "outFrom": round(cursor, 3), "outTo": round(cursor + len(chunk) / RATE, 3)})
        out.append(chunk)
        cursor += len(chunk) / RATE
    audio = np.concatenate(out + [np.zeros(int(TAIL * RATE), dtype=np.float32)])
    with wave.open(str(OUT), "wb") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(RATE)
        f.writeframes((np.clip(audio, -1, 1) * 32767).astype(np.int16).tobytes())
    (PROJECT / "voice_map.json").write_text(json.dumps(
        {"seconds": round(len(audio) / RATE, 3), "pausesShrunk": [[round(a, 2), round(b, 2)] for a, b in pauses],
         "pieces": mapping}, indent=2) + "\n", encoding="utf-8")
    print(f"{len(pauses)} pauses over {MAX_PAUSE} s shrunk to {KEEP_PAUSE} s: "
          f"{[(round(a, 2), round(b - a, 2)) for a, b in pauses]}; {len(audio) / RATE:.2f} s -> {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
