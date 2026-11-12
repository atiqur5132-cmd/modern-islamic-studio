"""Write the props of the Long composition: line times and captions on the voiceover.

Usage: .venv\\Scripts\\python projects/scroll-kyun/build_long.py [--transcript work/x.json]

Default: Whisper's words on the raw take, moved onto the voiceover through
projects/scroll-kyun/voice_map.json. With --transcript, a transcript of the finished
voiceover itself (times already on the output). Captions take their spelling from
script.txt and only their timing from Whisper (scripts/make_captions.py does the matching).
Writes projects/scroll-kyun/long.json.
"""
import argparse
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
from make_captions import absorb_single_words, align, group_phrases, parse_script, timed_words  # noqa: E402

PROJECT = ROOT / "projects" / "scroll-kyun"
MEASURED = {12: (34.88, 35.40)}  # "Kyun?" (re-heard 2026-11-13)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--transcript", type=pathlib.Path)
    args = parser.parse_args()
    vmap = json.loads((PROJECT / "voice_map.json").read_text(encoding="utf-8"))

    if args.transcript:
        data = json.loads(args.transcript.read_text(encoding="utf-8"))
        heard = [w for s in data["segments"] for w in s["words"] if w["text"].strip()]
    else:
        data = json.loads((ROOT / "work" / "scroll-kyun.merged.transcript.json").read_text(encoding="utf-8"))
        heard = []
        for w in sorted((w for s in data["segments"] for w in s["words"] if w["text"].strip()), key=lambda w: w["start"]):
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
    words = timed_words(script_words, heard, pairs)

    # Line and word number of every script word, in order.
    numbering = []
    for n, line in enumerate([l for l in script_text.splitlines() if l.strip()], 1):
        for i, _ in enumerate(parse_script(line)):
            numbering.append((n, i))
    assert len(numbering) == len(words), (len(numbering), len(words))
    out_words = [{"text": w["text"], "start": round(w["start"], 3), "end": round(w["end"], 3),
                  "emphasis": bool(w["emphasis"]), "line": n, "index": i}
                 for w, (n, i) in zip(words, numbering)]

    # Words Whisper did not write, timed by hand on the finished voiceover (line: start, end).
    for w in out_words:
        if w["line"] in MEASURED:
            w["start"], w["end"] = MEASURED[w["line"]]
    lines = []
    for n in sorted({w["line"] for w in out_words}):
        ws = [w for w in out_words if w["line"] == n]
        lines.append({"n": n, "start": ws[0]["start"], "end": ws[-1]["end"]})
    # Captions never run backwards across a line edge.
    phrases = absorb_single_words(group_phrases(words))
    by_id = {id(w): o for w, o in zip(words, out_words)}
    captions = [[by_id[id(w)] for w in phrase] for phrase in phrases]

    props = {"audio": "scroll-kyun.voice.wav", "durationSeconds": vmap["seconds"], "lines": lines,
             "words": out_words, "captions": captions}
    (PROJECT / "long.json").write_text(json.dumps(props, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    low = [w for w in words if w.get("score", 1) < 0.5]
    print(f"{len(out_words)} words, {len(lines)} lines, {len(captions)} captions, {len(low)} weak matches; "
          f"{vmap['seconds']} s -> projects/scroll-kyun/long.json")


if __name__ == "__main__":
    main()
