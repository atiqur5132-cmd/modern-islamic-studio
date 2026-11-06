"""Write the picture edit of "Quran mein zameen flat?" into edit.json: shots, look, graphics.

Usage: .venv\\Scripts\\python projects/flat-earth/build_edit.py

Keeps the captions (make_captions.py) and the face path (track_face.py) already in
edit.json, and replaces segments, overlays and the look. Every time is a source time
from work/flat-earth.merged.transcript.json (merge_transcript.py); see beats.md.
auto_edit.py kept the whole 74.4 s take (no pause over 0.5 s), so source time is output
time.
"""
import json
import pathlib

HERE = pathlib.Path(__file__).resolve().parent

# The creator's own jump cuts in the take (FFmpeg scene score > 0.07), plus two camera
# moves inside a shot: a punch at 17.5 ("Thoda peeche padho") and a step back at 34.46
# ("Kuch purane scholars"), so the honest beat never holds one framing past 4 s.
# Zooms alternate so every cut changes framing.
CUTS = [0.0, 2.2, 5.767, 9.0, 13.333, 15.5, 17.5, 18.5, 23.633, 24.867, 27.267, 29.133, 33.0,
        34.46, 37.467, 42.867, 47.333, 48.433, 54.167, 55.9, 58.3, 59.4, 63.167, 66.7, 69.033, 71.167, 74.367]
ZOOMS = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.14, 1.0, 1.0, 1.0, 1.0, 1.0, 1.14,
         1.0, 1.0, 1.0, 1.1, 1.0, 1.0, 1.0, 1.12, 1.0, 1.0, 1.0, 1.0, 1.0]

TRANSLATION_88_20 = "“…and at the earth, how it was spread out?” (88:20)"

OVERLAYS = [
    # 1-2. The hook, speaker off: the flat map, then a hard cut to the egg claim.
    {"type": "flathook", "start": 0, "end": 5.767, "tag": "VIRAL CLAIM", "line": "FLAT EARTH?",
     "punchAt": 0.5,
     "flatPost": {"headline": "“The Quran says the earth is flat!”", "at": 1.3},
     "eggPost": {"headline": "“No bro, the Quran calls the earth an EGG!”", "at": 2.3},
     "snapAt": 3.6, "marksAt": 4.82},
    # 3. "Maine dono check kiye… dono galat nikle."
    {"type": "verdicts", "start": 5.767, "end": 9.0, "left": "FLAT?", "right": "EGG?", "at": 5.85,
     "stamp": "FALSE", "stampAt": 8.46},
    # 4. The 88:20 card; "sutihat" ringed as it is said.
    {"type": "ayahstrips", "start": 9.0, "end": 13.333, "tag": "QURANIC TEXT",
     "strips": [{"ayah": "88:20", "at": 0}],
     "ring": {"ayah": "88:20", "word": 4, "at": 12.62, "term": "sutihat"}, "push": True},
    # 5. "Matlab bichha dena. Jaise chadar bichhate hain."
    {"type": "flatfootage", "start": 13.333, "end": 15.5, "tag": "LINGUISTICS", "src": "fe-bed.mp4", "trim": 0.3,
     "line": {"term": "sutihat", "text": "spread out, laid flat", "at": 13.72},
     "credit": "Video: Pexels 7641639"},
    # 7. "Quran poochta hai, ye log oont ko nahi dekhte? Aasmaan ko, pahadon ko?"
    {"type": "flatboard", "start": 18.5, "end": 22.8, "tag": "TRANSLATION (PARAPHRASE)",
     "heading": "Do they not look at…",
     "shots": [{"src": "fe-camel.jpg", "at": 20.08, "label": "CAMELS", "focus": [0.6, 0.12]},
               {"src": "fe-sky.jpg", "at": 21.12, "label": "SKY", "focus": [0.5, 0.2]},
               {"src": "fe-mountains.jpg", "at": 22.14, "label": "MOUNTAINS", "focus": [0.5, 0.5]}]},
    # 8. "Aur zameen ko, ki wo kaisi bichhayi gayi?" The four Ayahs, 88:20 last, over sand.
    {"type": "ayahstrips", "start": 22.8, "end": 24.867, "tag": "QURANIC TEXT", "photo": "fe-ground.jpg",
     "strips": [{"ayah": "88:17", "at": 22.8, "gloss": "camels"},
                {"ayah": "88:18", "at": 22.8, "gloss": "sky"},
                {"ayah": "88:19", "at": 22.8, "gloss": "mountains"},
                {"ayah": "88:20", "at": 23.3, "gloss": "earth"}],
     "ring": {"ayah": "88:20", "word": 4, "at": 24.2},
     "translation": {"text": TRANSLATION_88_20, "at": 23.64}},
    # 9. "Socho, registan mein ek aadmi oont par baitha hai…": the rider's own view.
    {"type": "flatfootage", "start": 24.867, "end": 29.133, "tag": "QURANIC CONTEXT", "src": "fe-pov.mp4",
     "line": {"text": "What a rider in the desert sees", "at": 25.36},
     "labels": [{"text": "CAMEL", "at": 26.42, "x": 330, "y": 1010},
                {"text": "SKY", "at": 27.62, "x": 640, "y": 470},
                {"text": "HORIZON", "at": 27.95, "x": 90, "y": 700},
                {"text": "GROUND", "at": 28.3, "x": 620, "y": 860}],
     "credit": "Video: Pexels 38114878"},
    # 10. "Baat uske pairon ke neeche ki zameen ki hai. Planet ki shape ki nahi."
    {"type": "flatfootage", "start": 29.133, "end": 33.0, "tag": "QURANIC CONTEXT", "src": "fe-pov.mp4", "trim": 4.27,
     "move": {"from": [1.6, 0.5, 0.12], "to": [1.9, 0.9, 0.62], "at": 29.3, "frames": 45},
     "line": {"text": "The ground under his feet", "at": 29.96},
     "notPlanet": {"at": 31.86, "strikeAt": 32.68},
     "credit": "Video: Pexels 38114878"},
    # 11. The honest beat: the speaker alone, close and then wider. No card: the creator
    # chose not to name a book or scholar here (2026-11-07).
    # 12. Al-Razi: a very large ball looks flat from any spot on it.
    {"type": "ball", "start": 37.467, "end": 42.867, "tag": "SCHOLARLY VIEW", "dropAt": 40.28,
     "quote": {"text": "“When a ball is very large, every piece of it is like a flat surface.”", "at": 38.0},
     "source": "Fakhr al-Din al-Razi on 88:20, Mafatih al-Ghayb (d. 1210 CE / 606 AH)"},
    # 13. "…toh zameen flat hi lag rahi hai na? Phir bhi gol hai."
    {"type": "flatfootage", "start": 44.88, "end": 47.333, "tag": "ESTABLISHED SCIENCE", "src": "fe-road.mp4",
     "line": {"text": "Looks flat.", "at": 45.28},
     "globe": {"src": "fe-blue_marble.jpg", "at": 46.5, "text": "Still round."},
     "credit": "Video: Pexels 37180549"},
    # Mid-video follow call, on the chest below the face, before the egg half.
    {"type": "cta", "mode": "follow", "start": 47.36, "end": 49.9, "placement": "top", "tone": "light", "y": 1030},
    # 14. "Surah Nazi'at ke ayat number 30 pe ek word hai, dahaha."
    {"type": "flatboard", "start": 49.9, "end": 52.12, "tag": "QURANIC TEXT",
     "ayah": {"key": "79:30", "word": 4, "at": 49.9, "ringAt": 51.42, "label": "An-Nazi'at 79:30", "term": "dahaha"}},
    # 15. "Kehte hain, matlab shutur-murg ka anda. Par iska matlab bhi hai, phailana."
    {"type": "eggcheck", "start": 52.12, "end": 55.9, "tag": "LINGUISTICS", "lexiconAt": 54.22, "strikeAt": 55.32,
     "term": "dahaha", "meaning": "spread out",
     "source": "Qurtubi on 79:30; Lane, Arabic-English Lexicon"},
    # 16. "Shutur-murg se rishta hai, par ande ka nahi, uske nest ka." Speaker in the circle.
    {"type": "nest", "start": 55.9, "end": 59.4, "tag": "LINGUISTICS", "nestAt": 58.7, "line": "Not the egg. The nest."},
    # 17. "Wo ret phaila ke nest banata hai. Uske liye Arabic mein doosra word hai."
    {"type": "flatfootage", "start": 59.4, "end": 63.167, "tag": "LINGUISTICS", "src": "fe-ostrich_v.jpg", "image": True,
     "move": {"from": [1.0, 0.4, 0.75], "to": [1.12, 0.4, 0.75]},
     "line": {"term": "udhiyy", "arabic": "أُدْحِيّ", "text": "the nest it spreads out", "at": 61.88},
     "labels": [{"text": "NEST", "at": 60.4, "x": 300, "y": 1080}],
     "credit": "Qurtubi on 79:30; Lane · Photo: Pexels 39194976"},
    # 18. "Toh ek ne verse se flat zameen nikaali, aur doosre ne anda."
    {"type": "readinto", "start": 63.167, "end": 66.7, "tag": "VERDICT", "leftAt": 64.36, "rightAt": 66.26,
     "stamp": "READ INTO IT"},
    # 19. Back to the clean 88:20 card, held.
    {"type": "ayahstrips", "start": 66.7, "end": 71.167, "tag": "QURANIC TEXT",
     "strips": [{"ayah": "88:20", "at": 0}],
     "ring": {"ayah": "88:20", "word": 4, "at": 70.44, "term": "sutihat"},
     "translation": {"text": TRANSLATION_88_20, "at": 69.3}, "hold": True},
    # 20. The end call: follow in the caption band, the comment question in the headroom.
    {"type": "cta", "mode": "follow", "start": 71.2, "end": 74.367, "placement": "caption", "tone": "light"},
    {"type": "cta", "mode": "engage", "start": 71.2, "end": 74.367, "placement": "top", "tone": "light",
     "text": "Which viral claim should we check next?"},
]

# Pictures the reel's components draw by name (src/overlays/flat/parts.tsx, Ostrich.tsx),
# so render_on_github.py uploads them with the footage.
ASSETS = ["fe-ferguson_disc.jpg", "fe-egg.jpg", "fe-eggs.jpg", "fe-blue_marble.jpg", "fe-nest.jpg"]

CAPTION_HIDE = [
    {"start": 0, "end": 5.767, "why": "the hook's posts carry the claim in words"},
]


def regroup(captions):
    """QUALITY §4: 2-4 words a caption. Split a group of 5+ in two; a lone word joins the
    shorter neighbour that still stays at 4 or under."""
    out = []
    for group in captions:
        if len(group) > 4:
            half = (len(group) + 1) // 2
            out += [group[:half], group[half:]]
        else:
            out.append(list(group))
    index = 0
    while index < len(out):
        if len(out) > 1 and len(out[index]) == 1:
            before = out[index - 1] if index > 0 else None
            after = out[index + 1] if index + 1 < len(out) else None
            if before is not None and len(before) <= 3 and (after is None or len(before) <= len(after)):
                before += out.pop(index)
                continue
            if after is not None and len(after) <= 3:
                out[index + 1] = out.pop(index) + after
                continue
        index += 1
    return out


def main():
    path = HERE / "edit.json"
    edit = json.loads(path.read_text(encoding="utf-8"))
    edit["captions"] = regroup(edit["captions"])
    edit["segments"] = [{"from": a, "to": b, "zoom": z} for a, b, z in zip(CUTS, CUTS[1:], ZOOMS)]
    edit["overlays"] = OVERLAYS
    edit["captionHide"] = CAPTION_HIDE
    edit["assets"] = ASSETS
    edit["punchToZoom"] = 1.16
    edit["grade"] = {"contrast": 1.04, "saturation": 1.03, "vignette": 0.12}
    edit["captionStyle"] = "ledger"
    edit["captionTerms"] = ["sutihat", "dahaha"]
    edit["palette"] = {"ground": "#EFE4CF", "ink": "#1B1B1B", "accent": "#E4572E"}
    path.write_text(json.dumps(edit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(edit['segments'])} shots, {len(OVERLAYS)} graphics, {len(edit['captions'])} captions, "
          f"face {'yes' if edit.get('face') else 'NO'}")


if __name__ == "__main__":
    main()
