"""Build word timings for the final lab-meat vo.wav.

The creator's cut was transcribed once (work/Voiceover - Kharcha - 1.1x.medium.transcript.json). Two cuts were then
made: 370.65-384.40 s (three wrong IIFA lines) and 389.29-392.25 s of the first cut (the outdated "abhi tak" line),
so times are shifted here instead of transcribing again. Whisper dropped 98.8-114 s and garbled 139-155 s; those
stretches are transcribed again in overlapping 6.5 s pieces and only each piece's core is kept.

Usage: .venv\\Scripts\\python projects/lab-meat/merge_transcript.py
Writes work/lab-meat.merged.transcript.json. Timing only: caption spelling comes from script.txt.
"""
import json
import pathlib
import subprocess
import wave

import numpy as np
from faster_whisper import WhisperModel

ROOT = pathlib.Path(__file__).resolve().parents[2]
SOURCE = ROOT / "work" / "Voiceover - Kharcha - 1.1x.medium.transcript.json"
VO = ROOT / "projects" / "lab-meat" / "vo.wav"
OUT = ROOT / "work" / "lab-meat.merged.transcript.json"
CUTS = [(370.65, 384.40), (403.04, 406.00)]  # in the creator's original file
PATCHES = [(98.8, 114.6), (139.0, 155.0)]  # in vo.wav (before the first cut, so the same times)
PIECE, STEP = 6.5, 5.0


def shift(t):
    """Original time -> vo.wav time, or None when the word was cut."""
    gone = 0.0
    for a, b in CUTS:
        if t >= b:
            gone += b - a
        elif t >= a:
            return None
    return round(t - gone, 3)


def patch_words(samples, model, prompt, start, end):
    words, t = [], start
    while t < end:
        seg = samples[int(t * 16000):int(min(t + PIECE, end) * 16000)]
        core = (t if t == start else t + (PIECE - STEP) / 2, min(end, t + STEP + (PIECE - STEP) / 2))
        out, _ = model.transcribe(seg, language="hi", word_timestamps=True, vad_filter=False,
                                  condition_on_previous_text=False, initial_prompt=prompt)
        for s in out:
            for w in s.words:
                mid = t + (w.start + w.end) / 2
                if core[0] <= mid < core[1]:
                    words.append({"text": w.word.strip(), "start": round(t + w.start, 3),
                                  "end": round(t + w.end, 3), "probability": round(w.probability, 3)})
        t += STEP
    return words


def main():
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    segments = []
    for s in data["segments"]:
        words = [dict(w, start=shift(w["start"]), end=shift(w["end"])) for w in s["words"]]
        words = [w for w in words if w["start"] is not None and w["end"] is not None]
        words = [w for w in words if not any(a <= w["start"] < b for a, b in PATCHES)]
        if words:
            segments.append({"start": words[0]["start"], "end": words[-1]["end"],
                             "text": " ".join(w["text"] for w in words), "words": words})

    wav16 = ROOT / "work" / "lab-meat.vo.16k.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(VO), "-ac", "1", "-ar", "16000", str(wav16)],
                   check=True)
    with wave.open(str(wav16)) as a:
        samples = np.frombuffer(a.readframes(a.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    model = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=4,
                         download_root=str(ROOT / "models"))
    prompt = (ROOT / "config" / "whisper_terms.txt").read_text(encoding="utf-8").strip()
    for a, b in PATCHES:
        words = patch_words(samples, model, prompt, a, b)
        if words:
            segments.append({"start": words[0]["start"], "end": words[-1]["end"],
                             "text": " ".join(w["text"] for w in words), "words": words, "patched": True})
    segments.sort(key=lambda s: s["start"])
    OUT.write_text(json.dumps({"language": "hi", "model": "medium", "durationSeconds": len(samples) / 16000,
                               "segments": segments}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {OUT.relative_to(ROOT)}: {sum(len(s['words']) for s in segments)} words")


if __name__ == "__main__":
    main()
