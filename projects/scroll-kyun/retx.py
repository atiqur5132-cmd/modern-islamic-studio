"""Re-hear stretches of the take in short pieces, to check a word or a stumble.

Usage: .venv\\Scripts\\python projects/scroll-kyun/retx.py 268-282 416-423 ...

Prints every word with its time on the source. Whisper words are for checking only;
they never reach the screen.
"""
import pathlib
import sys
import wave

import numpy as np
from faster_whisper import WhisperModel

ROOT = pathlib.Path(__file__).resolve().parents[2]
RATE = 16000


def main():
    with wave.open(str(ROOT / "work" / "scroll-kyun.16k.wav")) as audio:
        samples = np.frombuffer(audio.readframes(audio.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    model = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=4, download_root=str(ROOT / "models"))
    for span in sys.argv[1:]:
        a, b = (float(x) for x in span.split("-"))
        t = a
        print(f"== {a}-{b}", flush=True)
        while t < b:
            e = min(b, t + 7)
            segments, _ = model.transcribe(samples[int(t * RATE) : int(e * RATE)], language="hi", word_timestamps=True,
                                           vad_filter=True, max_new_tokens=160, condition_on_previous_text=False)
            words = [f"{w.word.strip()}@{w.start + t:.2f}-{w.end + t:.2f}" for s in segments for w in s.words]
            print(f"  [{t:.1f}-{e:.1f}] " + " ".join(words), flush=True)
            if e >= b:
                break
            t = e - 0.4


if __name__ == "__main__":
    main()
