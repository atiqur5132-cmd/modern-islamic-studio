"""Derive the data the Yawm 365 graphics draw, from the Quranic Arabic Corpus.

Usage: .venv\\Scripts\\python projects/yawm-365/make_stats.py <quran-morphology.txt>

The morphology file is the corrected Corpus copy (github.com/mustafa0x/quran-morphology);
it is not committed. Writes projects/yawm-365/quran_stats.json:
- surahWords: words in each of the 114 surahs;
- yawm: every word from the root y-w-m in order, as [surah, word position inside the
  surah (0..1), form], where form is "s" (singular, counted in the 365), "p" (plural,
  ayyam), "d" (dual, yawmayn), "i" (yawma'idhin) or "x" (with a pronoun suffix).
The counts are checked against research.md (475, 27, 3, 70, 10, 365).
"""
import collections
import json
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent


def main():
    words = collections.defaultdict(list)
    for line in open(sys.argv[1], encoding="utf-8"):
        parts = line.rstrip("\n").split("\t")
        if len(parts) < 4:
            continue
        surah, ayah, word, _ = (int(x) for x in parts[0].split(":"))
        words[(surah, ayah, word)].append((parts[1], parts[3]))

    order = sorted(words)
    surah_words = collections.Counter(surah for surah, _, _ in order)
    index_in_surah = {}
    seen = collections.Counter()
    for location in order:
        index_in_surah[location] = seen[location[0]]
        seen[location[0]] += 1

    yawm = []
    for location in order:
        segments = words[location]
        stem = [f for _, f in segments if "ROOT:يوم" in f.split("|")]
        if not stem:
            continue
        features = stem[0].split("|")
        full = "".join(text for text, _ in segments)
        if any(f in ("MP", "FP", "P") for f in features):
            form = "p"
        elif any(f in ("MD", "FD", "D") for f in features):
            form = "d"
        elif "ئِذ" in full:
            form = "i"
        elif any("SUFF" in f for _, f in segments if f != stem[0]):
            form = "x"
        else:
            form = "s"
        surah = location[0]
        yawm.append([surah, round(index_in_surah[location] / surah_words[surah], 4), form])

    counts = collections.Counter(form for _, _, form in yawm)
    expected = {"s": 365, "p": 27, "d": 3, "i": 70, "x": 10}
    if len(yawm) != 475 or dict(counts) != expected:
        sys.exit(f"Counts differ from research.md: {len(yawm)} {dict(counts)}")

    out = {
        "source": "Quranic Arabic Corpus morphology (mustafa0x/quran-morphology), via make_stats.py",
        "totalWords": len(order),
        "surahWords": [surah_words[s] for s in range(1, 115)],
        "yawm": yawm,
    }
    (HERE / "quran_stats.json").write_text(json.dumps(out, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{len(order)} words, {len(yawm)} yawm: {dict(counts)}")


if __name__ == "__main__":
    main()
