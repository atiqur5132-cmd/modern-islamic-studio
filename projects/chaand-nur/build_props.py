"""Write the props of the Chaand composition: line times, word times and captions on the voiceover.

Usage: .venv\\Scripts\\python projects/chaand-nur/build_props.py

Timing only comes from Whisper: the first pass on the take (work/chaand-nur.medium.transcript.json),
with the stretch it dropped (51.8-66.9 s) replaced by the re-heard words of
work/chaand-nur.patch.json, then moved onto the cut voice through voice_map.json. Spelling always
comes from script.txt (scripts/make_captions.py matches the two by sound). Writes
projects/chaand-nur/reel.json.
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
from make_captions import absorb_single_words, align, group_phrases, parse_script, timed_words  # noqa: E402

PROJECT = ROOT / "projects" / "chaand-nur"
WORK = ROOT / "work"
PATCH_FROM, PATCH_TO = 51.8, 66.9


def main():
    vmap = json.loads((PROJECT / "voice_map.json").read_text(encoding="utf-8"))
    first = json.loads((WORK / "chaand-nur.medium.transcript.json").read_text(encoding="utf-8"))
    words = [w for s in first["segments"] for w in s["words"] if w["text"].strip() and w["start"] < PATCH_FROM]
    patch = json.loads((WORK / "chaand-nur.patch.json").read_text(encoding="utf-8"))
    # Overlapping patch pieces can hear a word twice; keep the first.
    for w in sorted(patch, key=lambda w: w["start"]):
        if w["text"].strip() and PATCH_FROM <= w["start"] <= PATCH_TO and (not words or w["start"] >= words[-1]["end"] - 0.05):
            words.append(w)
    words.sort(key=lambda w: w["start"])

    heard = []
    for w in words:
        mid = (w["start"] + w["end"]) / 2
        for p in vmap["pieces"]:
            if p["sourceFrom"] <= mid < p["sourceTo"]:
                shift = p["outFrom"] - p["sourceFrom"]
                heard.append({**w, "start": round(max(p["outFrom"], w["start"] + shift), 3),
                              "end": round(min(p["outTo"], w["end"] + shift), 3)})
                break

    script_text = (PROJECT / "script.txt").read_text(encoding="utf-8")
    script_words = parse_script(script_text)
    pairs = align(script_words, heard)
    timed = timed_words(script_words, heard, pairs)

    numbering = []
    for n, line in enumerate([l for l in script_text.splitlines() if l.strip()], 1):
        for i, _ in enumerate(parse_script(line)):
            numbering.append((n, i))
    assert len(numbering) == len(timed), (len(numbering), len(timed))
    out_words = [{"text": w["text"], "start": round(w["start"], 3), "end": round(w["end"], 3),
                  "emphasis": bool(w["emphasis"]), "line": n, "index": i}
                 for w, (n, i) in zip(timed, numbering)]
    lines = []
    for n in sorted({w["line"] for w in out_words}):
        ws = [w for w in out_words if w["line"] == n]
        lines.append({"n": n, "start": ws[0]["start"], "end": ws[-1]["end"]})
    phrases = absorb_single_words(group_phrases(timed))
    by_id = {id(w): o for w, o in zip(timed, out_words)}
    captions = [[by_id[id(w)] for w in phrase] for phrase in phrases]

    props = {"audio": "chaand-nur.voice.wav", "durationSeconds": vmap["seconds"], "lines": lines,
             "words": out_words, "captions": captions}
    (PROJECT / "reel.json").write_text(json.dumps(props, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    low = [(w["text"], round(w["start"], 2)) for w in timed if w.get("score", 1) < 0.5]
    print(f"{len(out_words)} words, {len(lines)} lines, {len(captions)} captions; weak matches: {low}")
    for line in lines:
        print(f"  line {line['n']:2d}: {line['start']:6.2f}-{line['end']:6.2f}")


if __name__ == "__main__":
    main()
