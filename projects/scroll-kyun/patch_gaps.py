"""Fill the stretches the first Whisper pass skipped, in pieces of at most 7 s.

Usage: .venv\\Scripts\\python projects/scroll-kyun/patch_gaps.py

Reads work/scroll-kyun.medium.transcript.json and work/scroll-kyun.16k.wav, finds gaps over
2 s with no words where the voice is up, transcribes each gap alone (padded 0.3 s, split
into <=7 s pieces), keeps only the new words that fall inside the gap, and writes
work/scroll-kyun.merged.transcript.json. Timing only: captions take their spelling from
script.txt.
"""
import json
import pathlib
import sys
import wave

import numpy as np
from faster_whisper import WhisperModel

ROOT = pathlib.Path(__file__).resolve().parents[2]
WORK = ROOT / "work"
RATE = 16000
PIECE = 7.0
PAD = 0.3


def main():
    # Optional stem: scroll-kyun.voicefinal patches the finished voiceover's transcript.
    stem = sys.argv[1] if len(sys.argv) > 1 else "scroll-kyun"
    data = json.loads((WORK / f"{stem}.medium.transcript.json").read_text(encoding="utf-8"))
    words = [w for s in data["segments"] for w in s["words"] if w["text"].strip()]
    with wave.open(str(WORK / f"{stem}.16k.wav")) as audio:
        samples = np.frombuffer(audio.readframes(audio.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    frames = samples[: len(samples) // 160 * 160].reshape(-1, 160)
    db = 20 * np.log10(np.sqrt((frames ** 2).mean(1)) + 1e-9)
    floor = np.percentile(db, 10)

    gaps, last = [], 0.0
    for w in words + [{"start": len(samples) / RATE, "end": 0}]:
        if w["start"] - last > 2:
            part = db[int(last * 100) : int(w["start"] * 100)]
            if (part > floor + 15).mean() > 0.25:
                gaps.append((last, w["start"]))
        last = max(last, w["end"])

    prompt = (ROOT / "config" / "whisper_terms_scroll.txt").read_text(encoding="utf-8").strip()
    model = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=4,
                         download_root=str(ROOT / "models"))
    added = []
    for g0, g1 in gaps:
        t = g0 - PAD
        while t < g1:
            a, b = max(0, t), min(g1 + PAD, t + PIECE)
            segments, _ = model.transcribe(samples[int(a * RATE) : int(b * RATE)], language="hi",
                                           word_timestamps=True, vad_filter=True, max_new_tokens=160,
                                           condition_on_previous_text=False, initial_prompt=prompt)
            for s in segments:
                for w in s.words:
                    start, end = round(w.start + a, 3), round(w.end + a, 3)
                    text = w.word.strip()
                    # Keep words inside the gap only, and skip the prompt being echoed back.
                    if text and g0 - 0.05 <= start and end <= g1 + 0.05 and text not in prompt:
                        added.append({"text": text, "start": start, "end": end,
                                      "probability": round(w.probability, 3)})
            print(f"  piece {a:.1f}-{b:.1f}", flush=True)
            if b >= g1 + PAD - 1e-6:
                break  # the last piece reached the end of the gap
            t = b - 0.5  # small overlap so a word on the piece edge is not lost
        print(f"gap {g0:.1f}-{g1:.1f}: {' '.join(w['text'] for w in added if g0 - 0.05 <= w['start'] <= g1)}", flush=True)

    # Drop doubles from the overlapping pieces.
    added.sort(key=lambda w: w["start"])
    clean = [w for i, w in enumerate(added) if i == 0 or w["start"] >= added[i - 1]["end"] - 0.05]
    # Keep Whisper's own segments, so pick_takes can still drop invented ones; each gap's
    # new words go in as a segment of their own.
    patches = []
    for g0, g1 in gaps:
        inside = [w for w in clean if g0 - 0.05 <= w["start"] <= g1]
        if inside:
            patches.append({"start": inside[0]["start"], "end": inside[-1]["end"],
                            "text": " ".join(w["text"] for w in inside), "words": inside, "patched": True})
    segments = sorted(data["segments"] + patches, key=lambda s: s["start"])
    merged = [w for s in segments for w in s["words"]]
    out = {"language": "hi", "model": "medium", "durationSeconds": data["durationSeconds"],
           "segments": segments}
    path = WORK / f"{stem}.merged.transcript.json"
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(gaps)} gaps, {len(clean)} words added, {len(merged)} words -> {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
