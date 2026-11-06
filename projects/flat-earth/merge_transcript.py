"""Join the full transcript with the two stretches Whisper skipped on the first pass.

Usage: .venv\Scripts\python projects/flat-earth/merge_transcript.py

The first pass (work/flat-earth.medium.transcript.json) lost 34.7-37.2 s and
49.3-62.8 s. Those stretches were cut out of public/footage/flat-earth.mp4
(fe-a from 34.0 s, fe-b from 49.0 s) and transcribed alone; their times are moved back
onto the full take here. Writes work/flat-earth.merged.transcript.json. Timing only:
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
    full = words("flat-earth")
    patch_a = words("fe-a", 34.0)
    patch_b = [w for w in words("fe-b", 49.0) if w["start"] >= 49.3]  # 49.0 is the tail of "Nazi'at"
    # The first pass did hear where "kuch" starts (34.46); the clip's first word starts at its edge.
    patch_a[0]["start"] = 34.46
    merged = ([w for w in full if w["start"] < 34.4]
              + patch_a
              + [w for w in full if 37.1 <= w["start"] < 49.3]
              + patch_b
              + [w for w in full if w["start"] >= 62.84])
    out = {"language": "hi", "model": "medium (merged)", "segments": [{"start": merged[0]["start"],
           "end": merged[-1]["end"], "text": "", "words": merged}]}
    path = WORK / "flat-earth.merged.transcript.json"
    path.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(merged)} words -> {path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
