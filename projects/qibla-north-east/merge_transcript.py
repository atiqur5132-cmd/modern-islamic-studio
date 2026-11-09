"""Join the full transcript with the stretches Whisper skipped on the first pass.

Usage: .venv\\Scripts\\python projects/qibla-north-east/merge_transcript.py

The first pass (work/qibla-north-east.medium.transcript.json) lost 26.7-46.8 s. That
stretch was cut out of public/footage/qibla-north-east.mp4 and transcribed in pieces:
qb-a from 24.0 s, qb-b from 34.0 s, qb-c from 40.5 s. Their times are moved back onto
the full take here. Writes work/qibla-north-east.merged.transcript.json. Timing only:
captions take their spelling from script.txt.
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
    full = words("qibla-north-east")
    a = words("qb-a", 24.0)
    b = words("qb-b", 34.0)
    c = words("qb-c", 40.5)
    merged = ([w for w in full if w["start"] < 24.8]
              # qb-a: "duniya ka map ... jaise hi khincha hua hai. Isliye ... tight karke lagao."
              + [w for w in a if 24.8 <= w["start"] < 34.0]
              # qb-b: "Dhaaga pehle upar ... Makkah par utarta hai. Wo"
              + [w for w in b if w["start"] < 40.3]
              # qb-c: "pehli direction hi Washington ka pehla qibla hai ... Alaska ... north ki taraf hai."
              + [w for w in c if w["start"] < 46.8]
              + [w for w in full if w["start"] >= 46.8])
    # The patch ends its last word at the clip edge; Whisper's dangling repeats are dropped.
    merged = [w for i, w in enumerate(merged) if i == 0 or w["start"] > merged[i - 1]["start"] or w["text"] != merged[i - 1]["text"]]
    duration = json.loads((WORK / "qibla-north-east.medium.transcript.json").read_text(encoding="utf-8"))["durationSeconds"]
    out = {"language": "hi", "model": "medium", "durationSeconds": duration,
           "segments": [{"start": merged[0]["start"], "end": merged[-1]["end"], "text": "", "words": merged}]}
    path = WORK / "qibla-north-east.merged.transcript.json"
    path.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"{len(merged)} words, {merged[0]['start']}-{merged[-1]['end']} s -> {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
