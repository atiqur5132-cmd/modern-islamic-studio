"""Transcribe a video on the laptop with word timings.

Usage: .venv\\Scripts\\python scripts/transcribe.py <video> [--model medium] [--language hi] [--terms file]

Writes work/<video name>.<model>.transcript.json. Close Chrome first; this needs free RAM.
Never use this output as a source for Quranic text.
"""
import argparse
import json
import pathlib
import subprocess
import time
import wave

import numpy as np
from faster_whisper import WhisperModel

from auto_edit import HOP_SECONDS, LOW_MARGIN_DB, MIN_PAUSE_SECONDS, SAMPLE_RATE, loudness_db, merge, regions_of

ROOT = pathlib.Path(__file__).resolve().parent.parent
CHUNK_PAD_SECONDS = 0.2


def speech_chunks(samples):
    """Split audio at real pauses, as (start, end) seconds."""
    db = loudness_db(samples)
    spans = [(start * HOP_SECONDS, end * HOP_SECONDS)
             for start, end in regions_of(db > np.percentile(db, 10) + LOW_MARGIN_DB)]
    return merge(spans, MIN_PAUSE_SECONDS)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("video", type=pathlib.Path)
    parser.add_argument("--model", default="medium")
    parser.add_argument("--language", default="hi")
    parser.add_argument("--terms", type=pathlib.Path, default=ROOT / "config" / "whisper_terms.txt",
                        help="words to prime Whisper with, for this reel's vocabulary")
    args = parser.parse_args()

    work = ROOT / "work"
    work.mkdir(exist_ok=True)
    wav = work / f"{args.video.stem}.16k.wav"
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(args.video),
         "-vn", "-ac", "1", "-ar", "16000", str(wav)],
        check=True,
    )

    started = time.perf_counter()
    model = WhisperModel(
        args.model, device="cpu", compute_type="int8", cpu_threads=4,
        download_root=str(ROOT / "models"),
    )
    loaded = time.perf_counter()

    with wave.open(str(wav)) as audio:
        samples = np.frombuffer(audio.readframes(audio.getnframes()), dtype=np.int16)
    samples = samples.astype(np.float32) / 32768
    duration = len(samples) / SAMPLE_RATE
    prompt = args.terms.read_text(encoding="utf-8").strip()

    # Each take goes to Whisper alone. Given both together, it merges a repeated
    # line into one and hides the retake.
    result = []
    for chunk_start, chunk_end in speech_chunks(samples):
        offset = max(0, chunk_start - CHUNK_PAD_SECONDS)
        chunk = samples[int(offset * SAMPLE_RATE) : int((chunk_end + CHUNK_PAD_SECONDS) * SAMPLE_RATE)]
        segments, _ = model.transcribe(
            chunk, language=args.language, word_timestamps=True, vad_filter=True,
            condition_on_previous_text=False, initial_prompt=prompt,
        )
        for segment in segments:
            words = [
                {"text": w.word.strip(), "start": round(w.start + offset, 3),
                 "end": round(w.end + offset, 3), "probability": round(w.probability, 3)}
                for w in segment.words
            ]
            result.append({"start": round(segment.start + offset, 3),
                           "end": round(segment.end + offset, 3),
                           "text": segment.text.strip(), "words": words})
            print(f"[{segment.start + offset:7.2f}] {segment.text.strip()}", flush=True)
    finished = time.perf_counter()

    output = work / f"{args.video.stem}.{args.model}.transcript.json"
    output.write_text(
        json.dumps({"language": args.language, "model": args.model,
                    "durationSeconds": duration, "segments": result},
                   ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    transcribe_seconds = finished - loaded
    print(f"Model load {loaded - started:.0f}s, transcribe {transcribe_seconds:.0f}s, "
          f"{duration / transcribe_seconds:.2f}x real time")
    print(f"Saved {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
