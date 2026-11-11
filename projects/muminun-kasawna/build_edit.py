"""Write the picture edit of "Fa-kasawnā: We clothed the bones" into edit.json.

Usage: .venv\\Scripts\\python projects/muminun-kasawna/build_edit.py

Keeps the captions (make_captions.py) and the face path (track_face.py) already in
edit.json, and replaces segments, overlays and the look. Every time is a source time on
the take (beats.md); auto_edit.py kept the whole take, so source time is output time.

Rule from the creator: wherever they read the script from the side (lines 4-6, 8-9,
15-17, 19), they are not seen at all. Those stretches are all `kword`, `kplate`,
`kscience`, `kfootage` or `kayah`, which cover the frame.
"""
import json
import pathlib

HERE = pathlib.Path(__file__).resolve().parent

# The creator's own jump cuts (FFmpeg scene score > 0.05), first frame to last.
CUTS = [0.033, 1.467, 3.433, 6.767, 8.633, 10.367, 11.767, 12.667, 16.133, 19.9, 21.167, 23.467, 25.3,
        28.6, 30.567, 32.267, 34.667, 36.867, 39.5, 42.4, 44.833, 46.6, 48.667, 50.1, 51.967, 55.6,
        58.367, 62.433, 64.967, 65.133]
# Zoom per shot where the creator is on screen, so each cut on camera changes framing;
# 1.12 on "Wahi boond, aaj video dekh raha hai", said to the viewer.
ZOOM_AT = {1.467: 1.06, 32.267: 1.06, 25.3: 1.06, 50.1: 1.12, 62.433: 1.08}

TRANSLATION = json.loads((HERE / "translation_23-14.json").read_text(encoding="utf-8"))
assert TRANSLATION["agree"], "the two translation sources disagree"
# The verse's own ending, cut from the fetched translation.
ENDING = TRANSLATION["text"][TRANSLATION["text"].index("So blessed"):]

ILLUSTRATION = "Illustration"
SURAH = "Surah Al-Mu'minun 23:14"

OVERLAYS = [
    # 1. "Tum kabhi ek boond the. Itni chhoti, ki aankh se dikhti bhi nahi." The creator on
    # top with the drop's crown below; on "boond" the drop takes the whole frame behind the
    # creator's circle; on the creator's cut it jumps tight; then it shrinks to a point.
    # Every hook beat is a large change of the whole picture (study_reel.py measures them).
    {"type": "khook", "start": 0, "end": 0.92, "line": "You were once\n*a drop.*", "src": "mk-drop.mp4", "trim": 0.95,
     "markAt": 0.92, "tightAt": 9, "pointAt": 9, "ringAt": 9},
    {"type": "khookpip", "start": 0.92, "end": 3.433, "line": "You were once\n*a drop.*", "src": "mk-drop.mp4",
     "trim": 1.87, "markAt": 0.92, "tightAt": 1.467, "pointAt": 1.80, "ringAt": 2.78},
    # 2. "Aur Surah Mu'minun tumhari ye poori kahani ko, ek hi verse mein sunati hai."
    # Full screen on the Surah's name, the circle over 23:14 for "your whole story" (each
    # stage word lights as its drawing arrives), full screen again on "One verse".
    {"type": "ktitle", "start": 3.433, "end": 4.36, "text": "Surah Al-Mu'minun"},
    {"type": "kayahpip", "start": 4.36, "end": 5.64, "credit": f"Quranic text · {SURAH}", "ayah": "23:14",
     "from": 1, "to": 21, "size": 64,
     "lights": [{"from": 3, "at": 4.46}, {"from": 4, "at": 4.62}, {"from": 7, "at": 4.78}, {"from": 10, "at": 4.94},
                {"from": 13, "at": 5.10}, {"from": 16, "to": 17, "at": 5.26}],
     "stepsAt": 4.46},
    {"type": "ktitle", "start": 5.64, "end": 6.767, "text": "*One verse.*"},
    # 3-4. "Pehle tum the nutfah. Bas ek boond. Phir wo boond ek jagah chipak gayi." (read)
    {"type": "kword", "start": 6.767, "end": 10.367, "credit": f"Quranic context · Ibn Kathir on 23:13 · {ILLUSTRATION}",
     "word": {"ayah": "23:13", "from": 3, "at": 7.44}, "meaning": {"text": "*nutfah:* a drop", "at": 7.62},
     "form": {"stage": "cling", "from": "drop", "at": 9.84, "pulseAt": 9.84}},
    # 5. "Quran kehta hai alaqah. Jo chipak jaaye." (read)
    {"type": "kword", "start": 10.367, "end": 12.667,
     "credit": f"Linguistic observation · Quranic Arabic Corpus, root ʿ-l-q · {ILLUSTRATION}",
     "word": {"ayah": "23:14", "from": 4, "at": 11.20}, "meaning": {"text": "*ʿalaqah:* that which clings", "at": 11.36},
     "mark": {"text": "clings", "at": 11.92}, "form": {"stage": "cling"}},
    # 6. "Aur sach mein, chhathe-saatwe din embryo womb ki wall se chipak jaata hai." (read)
    {"type": "kplate", "start": 12.667, "end": 16.133,
     "credit": "Established science · UNSW Embryology · Drawing: OpenStax, CC BY 3.0 (adapted)",
     "src": "mk-implant.jpg", "count": {"text": "Day 6–7", "at": 13.38}, "ring": {"x": 0.45, "y": 0.52, "at": 15.48},
     "note": {"text": "Reading *ʿalaqah* this way is an interpretation.", "at": 14.4}},
    # 7. "Is word ka meaning blood clot bhi hai, aur Ibn Kathir ne yahi samjha." To camera.
    {"type": "pullquote", "start": 16.133, "end": 19.9, "quote": "A red clot, like an elongated clot.",
     "who": "Ibn Kathir, on 23:14", "tag": "Classical tafsir", "source": "the word's other meaning",
     "mark": {"text": "red clot", "at": 17.02}, "serif": "Newsreader", "sans": "Plus Jakarta Sans", "size": 100},
    # 8. "Phir wo ban gayi mudghah. Gosht ka chhota sa piece, bina kisi shape ke." (read)
    {"type": "kword", "start": 19.9, "end": 23.467, "credit": f"Quranic context · Ibn Kathir on 23:14 · {ILLUSTRATION}",
     "word": {"ayah": "23:14", "from": 7, "at": 20.68}, "meaning": {"text": "*mudghah:* a small piece of flesh", "at": 20.86},
     "sub": {"text": "No shape yet.", "at": 22.50}, "form": {"stage": "lump", "from": "cling", "at": 20.1}},
    # 9. "Phir usme bones bani, izam." (read)
    {"type": "kword", "start": 23.467, "end": 25.3, "credit": f"Quranic text · {ILLUSTRATION}",
     "word": {"ayah": "23:14", "from": 10, "at": 24.76}, "meaning": {"text": "*ʿizām:* bones", "at": 24.92},
     "form": {"stage": "bones", "from": "lump", "at": 23.94, "y": 900, "size": 600}},
    # 10. "Itne stages toh Greek doctor Galen ne bhi Quran se pehle likh chuke the." To camera.
    {"type": "kstack", "mode": "galen", "start": 25.3, "end": 28.6, "src": "mk-galen.jpg", "underlineAt": 26.88,
     "credit": "Historical record · Galen wrote of the embryo forming in stages in the 170s CE, about 440 years "
               "before the Quran (610 CE) · Title page printed in Basel, 1538"},
    # 11. "Lekin ab aata hai mera favourite word." To camera, mid-reel follow card.
    {"type": "cta", "mode": "follow", "start": 28.5, "end": 30.55, "placement": "top", "tone": "dark"},
    # 12-13. "Fa-kasawnal izama lahma. Yaani humne bones ko gosht ke kapde pehnaye. Allah ne joda
    # nahi kaha. Pehnaya kaha." To camera: the payoff shares the frame with the creator.
    {"type": "kstack", "mode": "kasawna", "start": 30.567, "end": 36.867, "credit": "Quranic text · 23:14",
     "word": {"ayah": "23:14", "from": 11, "at": 30.64, "bigTo": 13}, "meaning": {"text": "*fa-kasawnā:* We clothed", "at": 32.27},
     "formAt": 32.267, "clothAt": 34.02, "joined": {"text": "joined", "at": 35.16, "strikeAt": 35.48},
     "clothed": {"text": "clothed", "at": 36.14},
     "creditLater": {"text": "Linguistic observation · Quranic Arabic Corpus, root k-s-w", "at": 35.2}},
    # 14. "Jaise maa apne bachche ko pyaar se kapde pehnati hai." To camera, in the circle.
    {"type": "kfootagepip", "start": 36.867, "end": 39.5, "src": "mk-dress.mp4", "trim": 11.0, "focus": [0.5, 0.62]},
    # 15a. "Science ke hisaab se bones aur muscles saath-saath bante hain." (read)
    {"type": "kscience", "mode": "limb", "start": 39.5, "end": 42.4, "pulseAt": 41.32,
     "credit": f"Established science · UNSW Embryology: limb cartilage and muscle, days 44–48 · {ILLUSTRATION}",
     "lines": [{"text": "*At about the same time.*", "at": 40.4}]},
    # 15b. "Toh ye timetable nahi, pyaar ki ek picture hai." (read)
    {"type": "kscience", "mode": "phrase", "start": 42.4, "end": 44.833, "credit": "Interpretation (ours)",
     "lines": [{"text": "Not a timetable.", "at": 42.72}, {"text": "*A picture of love.*", "at": 43.66, "big": True}]},
    # 16a. "Aur phir, khalqan akhar." (read)
    {"type": "kword", "start": 44.833, "end": 46.6, "credit": f"Quranic text · {ILLUSTRATION}",
     "word": {"ayah": "23:14", "from": 16, "to": 17, "at": 45.76},
     "meaning": {"text": "*khalqan ākhar:* another creation", "at": 45.96}, "form": {"stage": "clothed", "y": 925, "size": 560}},
    # 16b. "Humne use bilkul nayi creation bana diya." (read)
    {"type": "kfootage", "start": 46.6, "end": 48.667, "src": "mk-ultrasound.mp4", "trim": 4.0, "credit": "Ultrasound footage"},
    # 17. "Ek boond se, ek insaan." (read) The hook's drop, then a baby's hand.
    {"type": "kfootage", "start": 48.667, "end": 49.4, "src": "mk-drop.mp4", "trim": 13.2, "focus": [0.48, 0.5]},
    {"type": "kfootage", "start": 49.4, "end": 50.1, "src": "mk-hand.mp4", "trim": 2.0, "focus": [0.5, 0.6]},
    # 19. "Isliye verse kehta hai, Fatabarakallahu ahsanul khaliqin. Allah bahut barkat wala hai,
    # sabse best creator." (read)
    {"type": "kayah", "start": 51.967, "end": 58.367, "credit": f"Quranic text · {SURAH}", "ayah": "23:14",
     "from": 18, "to": 21, "size": 104,
     "lights": [{"from": 18, "at": 53.54}, {"from": 19, "at": 54.10}, {"from": 20, "at": 54.48}, {"from": 21, "at": 54.92}],
     "translation": {"text": ENDING, "at": 55.70, "source": "Translation: Saheeh International"}, "stepsAt": 56.4},
    # 20. "...aur like comment bhi, aur follow bhi kar dena." End cards.
    {"type": "cta", "mode": "engage", "start": 60.3, "end": 62.25, "placement": "caption", "tone": "dark",
     "text": "Which word stayed with you: drop, clinging, or clothed?"},
    # 21. "I'm very bad at call to action." The follow card up top, the line in the captions,
    # then the creator's hand over the lens ends the reel.
    {"type": "cta", "mode": "follow", "start": 62.28, "end": 64.75, "placement": "top", "tone": "dark"},
]


def main():
    path = HERE / "edit.json"
    edit = json.loads(path.read_text(encoding="utf-8"))
    edit["segments"] = [{"from": a, "to": b, "zoom": ZOOM_AT.get(a, 1.0)} for a, b in zip(CUTS, CUTS[1:])]
    edit["overlays"] = OVERLAYS
    edit["palette"] = {"ground": "#231A21", "ink": "#F1E8DC", "accent": "#C98170"}
    edit["captionStyle"] = "editorial"
    edit["captionDesign"] = {"sans": "Plus Jakarta Sans", "serif": "Newsreader", "size": 64}
    edit["captionHide"] = [
        {"start": 0, "end": 3.43, "why": "the hook line carries it"},
        {"start": 30.6, "end": 32.25, "why": "fa-kasawna recited under the Arabic"},
        {"start": 53.4, "end": 55.6, "why": "the verse's ending recited under the Arabic"},
    ]
    edit["grade"] = {"contrast": 1.04, "saturation": 0.92, "vignette": 0.12}
    edit["punchToZoom"] = 1.12
    edit["stretchSounds"] = False
    edit["pipCuts"] = True
    edit["assets"] = ["mk-drop.mp4", "mk-dress.mp4", "mk-ultrasound.mp4", "mk-hand.mp4", "mk-galen.jpg", "mk-implant.jpg"]
    path.write_text(json.dumps(edit, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {path.name}: {len(edit['segments'])} segments, {len(OVERLAYS)} overlays")


if __name__ == "__main__":
    main()
