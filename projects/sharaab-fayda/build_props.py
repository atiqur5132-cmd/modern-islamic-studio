"""Write the props of the Sharaab composition: line times, word times and captions on the voiceover.

Usage: .venv\\Scripts\\python projects/sharaab-fayda/build_props.py

Timing only comes from Whisper medium on the take (work/sharaab-fayda.medium.transcript.json),
moved onto the voice through voice_map.json. Spelling always comes from script.txt
(scripts/make_captions.py matches the two by sound). Writes projects/sharaab-fayda/reel.json.
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
from make_captions import absorb_single_words, align, group_phrases, parse_script, timed_words  # noqa: E402

PROJECT = ROOT / "projects" / "sharaab-fayda"
WORK = ROOT / "work"
END_HOLD = 1.6
MEASURED = {}


def main():
    vmap = json.loads((PROJECT / "voice_map.json").read_text(encoding="utf-8"))
    first = json.loads((WORK / "sharaab-fayda.medium.transcript.json").read_text(encoding="utf-8"))
    words = [w for s in first["segments"] for w in s["words"] if w["text"].strip()]

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
    for w, key in zip(timed, numbering):
        if key in MEASURED:
            w["start"], w["end"] = MEASURED[key]
    out_words = [{"text": w["text"], "start": round(w["start"], 3), "end": round(w["end"], 3),
                  "emphasis": bool(w["emphasis"]), "line": n, "index": i}
                 for w, (n, i) in zip(timed, numbering)]
    lines = []
    for n in sorted({w["line"] for w in out_words}):
        ws = [w for w in out_words if w["line"] == n]
        lines.append({"n": n, "start": ws[0]["start"], "end": ws[-1]["end"]})
    phrases = absorb_single_words(group_phrases(timed))
    # A lone word left over ("wasallam.") joins the group before it when that stays at 4
    # words or fewer, so the durood is never split across two captions.
    merged = []
    for ph in phrases:
        if len(ph) == 1 and merged and len(merged[-1]) <= 3:
            merged[-1] = merged[-1] + ph
        else:
            merged.append(ph)
    phrases = merged
    by_id = {id(w): o for w, o in zip(timed, out_words)}
    captions = [[by_id[id(w)] for w in phrase] for phrase in phrases]
    # A caption never runs across two script lines: split it where the line changes.
    split = []
    for ph in captions:
        cur = [ph[0]]
        for w in ph[1:]:
            if w["line"] != cur[-1]["line"]:
                split.append(cur)
                cur = [w]
            else:
                cur.append(w)
        split.append(cur)
    captions = split

    # The end Follow card needs 2-3 s (QUALITY.md 2a): the picture holds END_HOLD past the voice file.
    props = {"audio": "sharaab-fayda.voice.wav", "durationSeconds": round(vmap["seconds"] + END_HOLD, 3), "lines": lines,
             "words": out_words, "captions": captions}
    (PROJECT / "reel.json").write_text(json.dumps(props, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    low = [(w["text"], round(w["start"], 2)) for w in timed if w.get("score", 1) < 0.5]
    print(f"{len(out_words)} words, {len(lines)} lines, {len(captions)} captions; weak matches: {low}")
    for line in lines:
        print(f"  line {line['n']:2d}: {line['start']:6.2f}-{line['end']:6.2f}")


if __name__ == "__main__":
    main()
