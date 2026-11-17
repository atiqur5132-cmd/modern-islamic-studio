"""Join the full transcript with the stretch Whisper skipped on the first pass.

Usage: .venv\\Scripts\\python projects/oldest-university/merge_transcript.py

The first pass (work/oldest-university.medium.transcript.json) lost 10.2-29.9 s: it
stretched "sahi hain" over twenty seconds. That stretch was cut out of
public/footage/oldest-university.mp4 and transcribed in pieces (work/ou-*.wav); their
times are moved back onto the full take here. Writes
work/oldest-university.merged.transcript.json. Timing only: captions take their spelling
from script.txt.
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
WORK = ROOT / "work"


def words(name, offset=0.0):
    data = json.loads((WORK / f"{name}.medium.transcript.json").read_text(encoding="utf-8"))
    return [{**w, "start": round(w["start"] + offset, 2), "end": round(w["end"] + offset, 2)}
            for s in data["segments"] for w in s["words"]]


def window(ws, lo, hi):
    return [w for w in ws if lo <= w["start"] < hi]


def main():
    full = words("oldest-university")
    merged = (
        window(full, 0, 9.8)
        # ou-a from 10.0: "dono sahi hain, bas dono alag sawaal ka jawab hain. Pehle Nalanda
        # chalte hain, Bihar, 5th century, aur Gupta rajaon ka zamaana. Socho"
        + window(words("ou-a", 10.0), 9.7, 16.5)
        # ou-b from 16.5: "ek aisi jagah, jahan log padhte bhi the, aur wahin rehte bhi the.
        # China aur Korea se mahino ka" (it squeezes the words after 23.0 into its last frame)
        + window(words("ou-b", 16.5), 16.5, 23.0)
        # ou-e from 23.0: "safar karke log yahan padhne aate the. Phir baarah sau ke aas-paas"
        + window(words("ou-e", 23.0), 23.0, 26.2)
        # ou-d from 25.5: "Turk hamle hue aur Nalanda ko bahut nuksaan pahuncha"
        + window(words("ou-d", 25.5), 26.2, 29.2)
        # ou-f from 28.6: "1235 mein ek Tibetan monk wahan pahuncha, to sirf do building mein
        # padhai bachi thi"
        + window(words("ou-f", 28.6), 29.2, 33.54)
        + window(full, 33.54, 65.0)
        # ou-i from 64.6: the first pass dropped "Ilm ka" before "darwaza sabse pehle kisne khola"
        # (its first word is stamped at the piece start; the creator's cut puts it at 64.9)
        + [{**w, "start": max(w["start"], 64.9)} for w in window(words("ou-i", 64.6), 64.6, 67.24)]
        + window(full, 67.23, 999)
    )
    duration = json.loads((WORK / "oldest-university.medium.transcript.json").read_text(encoding="utf-8"))["durationSeconds"]
    out = {"language": "hi", "model": "medium", "durationSeconds": duration,
           "segments": [{"start": merged[0]["start"], "end": merged[-1]["end"], "text": "", "words": merged}]}
    path = WORK / "oldest-university.merged.transcript.json"
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    gaps = [(a["end"], b["start"]) for a, b in zip(merged, merged[1:]) if b["start"] - a["end"] > 0.6]
    print(f"{len(merged)} words, {merged[0]['start']}-{merged[-1]['end']} s -> {path.relative_to(ROOT)}")
    print("gaps over 0.6 s:", gaps)


if __name__ == "__main__":
    main()
