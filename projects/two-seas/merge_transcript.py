"""Join the full transcript with the stretch Whisper skipped on the first pass.

Usage: .venv\Scripts\python projects/two-seas/merge_transcript.py

The first pass (work/two-seas.medium.transcript.json) lost 50.8-61.5 s. That stretch was
cut out of public/footage/two-seas.mp4 and transcribed in pieces: ts-a from 50.0 s,
ts-b from 56.0 s. Their times are moved back onto the full take here. Writes
work/two-seas.merged.transcript.json. Timing only: captions take their spelling from
script.txt.
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
WORK = ROOT / "work"


def words(name, offset=0.0):
    data = json.loads((WORK / f"{name}.medium.transcript.json").read_text(encoding="utf-8"))
    return [{**w, "start": round(w["start"] + offset, 2), "end": round(w["end"] + offset, 2)}
            for s in data["segments"] for w in s["words"]]


def main():
    full = words("two-seas")
    a = words("ts-a", 50.0)
    b = words("ts-b", 56.0)
    merged = ([w for w in full if w["start"] < 50.0]
              # ts-a: "density ki ek invisible layer. Ye layer mixing ko rokti nahi, balki dheema karti hai. Isliye"
              + [w for w in a if w["start"] < 55.7]
              # ts-b: "kabhi mix nahi hote wala viral daawa galat hai. Aur Quran ki aayat ye kehti bhi nahi. Aayat kehti hai koi paani"
              + [w for w in b if 55.7 <= w["start"] < 61.8]
              + [w for w in full if w["start"] >= 61.8])
    duration = json.loads((WORK / "two-seas.medium.transcript.json").read_text(encoding="utf-8"))["durationSeconds"]
    out = {"language": "hi", "model": "medium", "durationSeconds": duration,
           "segments": [{"start": merged[0]["start"], "end": merged[-1]["end"], "text": "", "words": merged}]}
    path = WORK / "two-seas.merged.transcript.json"
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(merged)} words, {merged[0]['start']}-{merged[-1]['end']} s -> {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
