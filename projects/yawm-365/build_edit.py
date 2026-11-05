"""Write the picture edit of "Yawm 365" into edit.json: shots, look and graphics.

Usage: .venv\\Scripts\\python projects/yawm-365/build_edit.py

Keeps the captions (make_captions.py) and the face path (track_face.py) already in
edit.json, and replaces segments, overlays and the look. Every time is a source time
from work/yawm-365.medium.transcript.json; see beats.md for the plan.
"""
import json
import pathlib

HERE = pathlib.Path(__file__).resolve().parent

# The creator's own jump cuts in the take (FFmpeg scene score > 0.07). Each one
# changes the framing: zooms alternate so no cut is a jump between equal shots.
CUTS = [0.033, 5.433, 9.567, 13.533, 15.333, 17.333, 20.9, 23.067, 27.567, 31.133, 33.433,
        36.1, 41.4, 43.567, 47.567, 49.0, 50.9, 53.167, 55.4, 58.0, 61.967, 64.6, 67.0]
ZOOMS = [1.0, 1.08, 1.0, 1.12, 1.0, 1.0, 1.1, 1.0, 1.08, 1.0, 1.08,
         1.0, 1.1, 1.0, 1.1, 1.0, 1.08, 1.0, 1.08, 1.0, 1.08, 1.0]

# Real data for the scan and the ledger grid, from the Quranic Arabic Corpus (make_stats.py).
STATS = json.loads((HERE / "quran_stats.json").read_text(encoding="utf-8"))

# Quranic words: Ayah and word number (Corpus numbering), read from the Ayah that
# scripts/fetch_ayah.py verified. Never typed.
YAWM = {"ayah": "1:4", "word": 2, "bare": True}  # يَوْمِ in "maliki yawmi d-din"
AYYAM = {"ayah": "2:203", "word": 4}
YAWMAYN = {"ayah": "2:203", "word": 9}
YAWMAIDHIN = {"ayah": "99:4", "word": 1}
YAWMIKUM = {"ayah": "32:14", "word": 5}
YAWMAHUM = {"ayah": "43:83", "word": 6}

COUNT_SOURCE = "Quranic Arabic Corpus + Tanzil"

OVERLAYS = [
    {"type": "yawmhook", "start": 0, "end": 5.433, "tag": "VIRAL CLAIM", "word": YAWM, "value": 365,
     "claim": "‘DAY’ = 365 TIMES?", "yearAt": 3.6, "yearLine": "365 DAYS IN A YEAR"},
    {"type": "posts", "start": 5.433, "end": 9.567, "burstAt": 9.2,
     "posts": [{"headline": "Quran: 'day' = 365 times!", "likes": "12.4K", "at": 5.8},
               {"headline": "365 days, 365 times", "likes": "48.1K", "at": 6.5},
               {"headline": "A miracle of numbers?", "likes": "9,802", "at": 7.6}]},
    {"type": "scan", "start": 9.567, "end": 13.533, "tag": "NUMERICAL OBSERVATION",
     "heading": "Every word, counted", "totalLabel": "words checked",
     "surahWords": STATS["surahWords"], "hits": [[surah, position] for surah, position, _ in STATS["yawm"]],
     "source": "Quranic Arabic Corpus, cross-checked with the Tanzil text"},
    {"type": "headcard", "start": 15.333, "end": 17.333, "word": YAWM, "headroom": True,
     "lines": [{"text": "yawm", "at": 16.9, "term": True}, {"text": "= day", "at": 16.0}]},
    {"type": "ledger", "start": 17.333, "end": 43.567, "tag": "NUMERICAL OBSERVATION",
     "source": COUNT_SOURCE, "finalAt": 42.6, "dots": [form for _, _, form in STATS["yawm"]],
     "steps": [
         {"at": 19.7, "value": 475, "label": "ALL FORMS OF YAWM"},
         {"at": 30.2, "value": 445, "label": "SINGULAR FORMS ONLY"},
         {"at": 35.0, "value": 375, "label": "WITHOUT ‘THAT DAY’"},
         {"at": 42.6, "value": 365, "label": "WITHOUT ‘YOUR DAY’, ‘THEIR DAY’"},
     ],
     "entries": [
         {"form": "p", "minus": 27, "struckAt": 30.2,
          "words": [{"word": AYYAM, "roman": "ayyam", "meaning": "days", "at": 23.8}]},
         {"form": "d", "minus": 3, "struckAt": 30.2,
          "words": [{"word": YAWMAYN, "roman": "yawmayn", "meaning": "two days", "at": 26.2}]},
         {"form": "i", "minus": 70, "struckAt": 35.0,
          "words": [{"word": YAWMAIDHIN, "roman": "yawma'idhin", "meaning": "that day", "at": 31.4}]},
         {"form": "x", "minus": 10, "struckAt": 42.6,
          "words": [{"word": YAWMIKUM, "roman": "yawmukum", "meaning": "your day", "at": 36.4, "meaningAt": 39.2},
                    {"word": YAWMAHUM, "roman": "yawmuhum", "meaning": "their day", "at": 37.3, "meaningAt": 40.7}]},
     ]},
    {"type": "cta", "mode": "engage", "start": 44.3, "end": 47.3, "placement": "top", "tone": "light",
     "text": "Which rule is fair: 445 or 365?"},
    {"type": "headcard", "start": 49.0, "end": 50.9, "word": YAWMAIDHIN, "icon": "question", "headroom": True,
     "lines": [{"text": "Isn’t ‘that day’", "at": 49.1}, {"text": "still a day?", "at": 50.0}]},
    {"type": "rules", "start": 50.9, "end": 53.167, "tag": "NUMERICAL OBSERVATION",
     "heading": "Change the rule, change the number", "reference": {"value": 365, "label": "a year: 365 days"},
     "rows": [
         {"rule": "All forms", "value": 475},
         {"rule": "Singular only", "value": 445},
         {"rule": "Without ‘that day’", "value": 375},
         {"rule": "Without ‘your / their day’", "value": 365, "final": True},
     ]},
    {"type": "factfootage", "start": 53.167, "end": 58.0, "tag": "ESTABLISHED SCIENCE",
     "src": "broll-moon-phases.mp4", "value": "354", "label": "days in a Hijri year", "valueAt": 56.6,
     "source": "12 lunar months × 29.53 days (NASA)", "credit": "Moon: NASA's Scientific Visualization Studio",
     "moons": 12},
    {"type": "headcard", "start": 58.0, "end": 61.967, "tag": "SCHOLARLY VIEW", "headroom": True, "icon": "book",
     "lines": [{"text": "Selective counts", "at": 58.0}, {"text": "are not a miracle.", "at": 60.9}],
     "source": "Dr. Fahd al-Roomi, Dr. Ashraf Qatanah (IslamQA 69741)"},
    {"type": "headcard", "start": 61.967, "end": 67.0,
     "lines": [{"text": "The Quran doesn’t need a number game.", "at": 62.0}]},
    {"type": "cta", "mode": "follow", "start": 64.6, "end": 67.0, "placement": "caption", "tone": "light"},
]


def main():
    path = HERE / "edit.json"
    edit = json.loads(path.read_text(encoding="utf-8"))
    edit["segments"] = [{"from": a, "to": b, "zoom": z} for a, b, z in zip(CUTS, CUTS[1:], ZOOMS)]
    edit["overlays"] = OVERLAYS
    edit["punchToZoom"] = 1.16
    edit["grade"] = {"contrast": 1.04, "saturation": 1.03, "vignette": 0.12}
    edit["captionStyle"] = "ledger"
    edit["captionTerms"] = ["yawm", "ayyam", "yawmayn", "yawma'idhin", "yawmukum", "yawmuhum"]
    edit["palette"] = {"ground": "#F4EFE6", "ink": "#1B1B1B", "accent": "#D9480F"}
    path.write_text(json.dumps(edit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(edit['segments'])} shots, {len(OVERLAYS)} graphics, {len(edit['captions'])} captions")


if __name__ == "__main__":
    main()
