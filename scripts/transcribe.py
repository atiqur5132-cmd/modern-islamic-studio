"""Transcribe a video on the laptop with word timings.

Usage: .venv\\Scripts\\python scripts/transcribe.py <video> [--model small] [--language hi]

Writes work/<video name>.<model>.transcript.json. Close Chrome first; this needs free RAM.
Never use this output as a source for Quranic text.
"""
import argparse
import json
import pathlib
import subprocess
import time

from faster_whisper import WhisperModel

ROOT = pathlib.Path(__file__).resolve().parent.parent


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("video", type=pathlib.Path)
    parser.add_argument("--model", default="small")
    parser.add_argument("--language", default="hi")
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
    segments, info = model.transcribe(
        str(wav), language=args.language, word_timestamps=True, vad_filter=True,
        initial_prompt=(ROOT / "config" / "whisper_terms.txt").read_text(encoding="utf-8").strip(),
    )

    result = []
    for segment in segments:
        words = [
            {"text": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3),
             "probability": round(w.probability, 3)}
            for w in segment.words
        ]
        result.append({"start": round(segment.start, 3), "end": round(segment.end, 3),
                       "text": segment.text.strip(), "words": words})
        print(f"[{segment.start:7.2f}] {segment.text.strip()}", flush=True)
    finished = time.perf_counter()

    output = work / f"{args.video.stem}.{args.model}.transcript.json"
    output.write_text(
        json.dumps({"language": info.language, "model": args.model,
                    "durationSeconds": info.duration, "segments": result},
                   ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    transcribe_seconds = finished - loaded
    print(f"Model load {loaded - started:.0f}s, transcribe {transcribe_seconds:.0f}s, "
          f"{info.duration / transcribe_seconds:.2f}x real time")
    print(f"Saved {output.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
