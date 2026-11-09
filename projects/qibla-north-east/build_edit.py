"""Write the picture edit of "America mein qibla north-east kyun?" into edit.json.

Usage: .venv\\Scripts\\python projects/qibla-north-east/build_edit.py

Keeps the captions (make_captions.py) and the face path (track_face.py) already in
edit.json, and replaces segments, overlays and the look. Every time is a source time
from work/qibla-north-east.merged.transcript.json (merge_transcript.py); see beats.md.
auto_edit.py kept the whole 65.7 s take (no pause over 0.5 s), so source time is output
time.
"""
import json
import pathlib

HERE = pathlib.Path(__file__).resolve().parent

# The creator's own jump cuts in the take (FFmpeg scene score > 0.05). Every layout
# change sits on one of them. Zooms alternate where the speaker is on screen, so every
# cut changes framing.
CUTS = [0.033, 2.733, 5.267, 8.333, 9.967, 12.633, 15.1, 16.667, 18.367, 19.767, 21.8, 24.733, 26.8,
        30.6, 34.233, 36.767, 38.867, 40.1, 42.6, 44.067, 46.9, 47.833, 50.267, 51.867, 52.833, 55.233,
        56.067, 58.267, 59.633, 61.0, 63.733, 65.767]
ZOOMS = [1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.0, 1.0, 1.0, 1.08, 1.0, 1.0, 1.0,
         1.08, 1.0, 1.0, 1.0, 1.0, 1.1, 1.0, 1.0, 1.0, 1.08, 1.0, 1.1, 1.0,
         1.0, 1.0, 1.12, 1.0, 1.0]

SCIENCE = "ESTABLISHED SCIENCE"
HISTORY = "HISTORICAL RECORD"
OURS = "NUMERICAL OBSERVATION · OUR CALCULATION"
NEWSPAPER = "The Washington Daily News, 15 April 1953 (quoted by S. K. Abdali)"

OVERLAYS = [
    # 1-2. The hook, speaker off: worshippers under the compass, the minaret, the map.
    {"type": "qhook", "start": 0, "end": 5.267, "tag": "QIBLA IN AMERICA", "line": "NORTH-EAST?",
     "lockAt": 1.20, "minaretAt": 1.90, "mapAt": 2.733, "lineAt": 3.56, "seAt": 4.22},
    # 3. "1953 mein Washington ki ek nayi masjid ke saath yahi hua." First time on screen.
    {"type": "qboard", "start": 5.267, "end": 8.333, "tag": HISTORY, "src": "qb-1954.jpg", "gray": True,
     "focus": [0.5, 0.42], "heading": {"text": "WASHINGTON DC · 1953", "at": 5.40},
     "note": "A new mosque going up (photo: 1954)"},
    # 4a. "Uska rukh north-east rakha gaya": the recorded bearing.
    {"type": "qcompass", "start": 8.333, "end": 9.967, "mode": "1953", "tag": HISTORY, "turnAt": 8.94,
     "line": "EAST OF TRUE NORTH", "source": NEWSPAPER},
    # 4b. "...aur dekhne wale ghabra gaye ki masjid galat taraf ban rahi hai."
    {"type": "qquote", "start": 9.967, "end": 12.633, "tag": HISTORY, "who": "PASSERS-BY, 1953",
     "quote": "“Take any map… the line would go slightly south.”", "source": NEWSPAPER,
     "stamp": {"text": "WRONG WAY?", "at": 11.58}},
    # 5. "...jo hum school se dekhte aa rahe hain."
    {"type": "qfootage", "start": 15.1, "end": 16.667, "tag": "THE MAP WE ALL LEARNED", "src": "qb-wallmap.mp4",
     "trim": 0.5, "line": {"text": "SINCE SCHOOL", "at": 15.54}},
    # 6. "Map flat hai, aur zameen gol."
    {"type": "qglobe", "scene": "flatround", "start": 16.667, "end": 18.367, "tag": SCIENCE,
     "beats": {"flat": 17.12, "zameen": 17.74, "round": 18.10}},
    # 7. "Ek santre ka chhilka utaro, aur use table par bilkul flat karke dikhao."
    {"type": "qboard", "start": 18.367, "end": 21.8, "tag": "TRY THIS", "src": "qb-peel.mp4", "video": True,
     "trim": 1.0, "focus": [0.5, 0.62], "heading": {"text": "Now lay the peel flat.", "at": 20.72}},
    # 8-9. "Nahi hoga. Kahin phatega, kahin stretch ho jaayega. Duniya ka map bhi aise hi khincha hua hai."
    {"type": "qglobe", "scene": "peel", "start": 21.8, "end": 26.8, "tag": SCIENCE,
     "beats": {"open": 21.84, "tears": 23.02, "stretch": 23.82, "earth": 24.94, "merc": 25.40, "zoom": 25.80,
               "mark": 26.18}},
    # 10. "Isliye map par jo line seedhi dikhti hai, wo zameen par sabse chhota raasta nahi hoti."
    {"type": "qglobepip", "scene": "mapline", "start": 26.8, "end": 30.6, "tag": SCIENCE,
     "lines": [{"text": "Straight on the map…", "at": 27.72}], "beats": {"line": 27.18, "stamp": 29.42}},
    # 11. "Ab ek globe par Washington se Makkah tak ek dhaaga tight karke lagao."
    {"type": "qglobepip", "scene": "string", "start": 30.6, "end": 34.233, "tag": SCIENCE,
     "lines": [{"text": "Pull a string tight", "at": 32.72}],
     "beats": {"wrap": 30.68, "dc": 31.40, "mk": 31.94, "tight": 33.08}},
    # 12. "Dhaaga pehle upar ki taraf jaata hai, north-east."
    {"type": "qglobe", "scene": "depart", "start": 34.233, "end": 36.767, "tag": SCIENCE,
     "beats": {"go": 34.74, "ne": 36.12}},
    # 13. "Phir Atlantic aur Europe ke upar se mudta hai, aur Makkah par utarta hai."
    {"type": "qglobe", "scene": "ride", "start": 36.767, "end": 40.1, "tag": SCIENCE,
     "beats": {"atlantic": 37.02, "europe": 37.62, "makkah": 39.10, "land": 39.10}},
    # 14. "Wo pehli direction hi Washington ka pehla qibla hai."
    {"type": "qcompass", "start": 40.1, "end": 42.6, "mode": "match", "tag": OURS, "turnAt": 40.50,
     "line": "QIBLA = THE STRING'S FIRST DIRECTION", "sub": "Our calculation: 56.5°. Recorded in 1953: 56°33′."},
    # 15. "Toh masjid bilkul sahi bani thi."
    {"type": "qchest", "start": 42.6, "end": 44.067, "chip": {"text": "RIGHT ALL ALONG", "at": 43.46}},
    # 16. "Alaska mein toh qibla seedha, lagbhag north ki taraf hai, pole ke upar se."
    {"type": "qglobe", "scene": "alaska", "start": 44.067, "end": 47.833, "tag": OURS,
     "beats": {"alaska": 44.16, "draw": 44.78, "north": 46.16, "pole": 46.82}},
    # 17. "Muslim astronomers ye hisaab hazaar saal pehle hi spherical trigonometry se laga rahe the."
    {"type": "qboard", "start": 47.833, "end": 51.867, "tag": HISTORY, "src": "qb-biruni.jpg",
     "focus": [0.5, 0.35], "heading": {"text": "1,000 YEARS AGO", "at": 49.40},
     "note": "Al-Biruni's astronomy, Kitab al-Tafhim, c. 1029 CE",
     "sphere": {"text": "spherical trigonometry", "at": 50.26}},
    # 18. The honest beat to camera; the mid-video follow card on the chest.
    {"type": "cta", "mode": "follow", "start": 51.95, "end": 54.45, "placement": "top", "tone": "light", "y": 1000},
    # 19. "Aur itni door se Kaaba ki direction ki taraf muh karna hi kaafi hai, ye bahut se scholars ki raay hai."
    {"type": "qayah", "start": 55.233, "end": 59.633, "tag": "QURANIC CONTEXT", "ayah": "2:144",
     "label": "AL-BAQARAH 2:144", "from": 12, "to": 16,
     "translation": "“…So turn your face toward al-Masjid al-Haram…” (Sahih International)",
     "note": {"tag": "SCHOLARLY VIEW", "text": "Many scholars: from far away, facing the direction is enough.",
              "sub": "For your own case, ask a scholar.", "at": 58.24}},
    # 20. "Bas gol duniya ko flat dikhane mein thoda khinch jaata hai." The globe unwraps.
    {"type": "qglobe", "scene": "payoff", "start": 61.0, "end": 63.733, "tag": SCIENCE,
     "beats": {"unwrap": 61.10, "title": 61.40},
     "lines": [{"text": "The map isn't lying.", "at": 61.40}, {"text": "It's stretched.", "at": 61.40}]},
    # 21. The end call: follow in the caption band, the comment question in the headroom.
    {"type": "cta", "mode": "follow", "start": 63.75, "end": 65.767, "placement": "caption", "tone": "light"},
    {"type": "cta", "mode": "engage", "start": 63.75, "end": 65.767, "placement": "top", "tone": "light",
     "text": "What's the qibla direction from your city?"},
]

# Pictures the reel's components draw by name, so render_on_github.py uploads them.
ASSETS = ["qb-earth.jpg", "qb-mercator.jpg", "qb-worshipers.jpg", "qb-minaret.jpg"]

CAPTION_HIDE = [
    {"start": 0, "end": 5.267, "why": "the hook's own words (NORTH-EAST? / SOUTH-EAST) carry it"},
]

# Whisper heard "ho jaayega" as one word; the second half is spoken about 0.2 s later.
TIMING_FIXES = {("jaayega.", 24.16): 24.36}


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
    captions = regroup(edit["captions"])
    for group in captions:
        for word in group:
            fixed = TIMING_FIXES.get((word["text"], round(word["start"], 2)))
            if fixed:
                word["start"] = fixed
    edit["captions"] = captions
    assert len(ZOOMS) == len(CUTS) - 1
    edit["segments"] = [{"from": a, "to": b, "zoom": z} for a, b, z in zip(CUTS, CUTS[1:], ZOOMS)]
    edit["overlays"] = OVERLAYS
    edit["captionHide"] = CAPTION_HIDE
    edit["assets"] = ASSETS
    edit["punchToZoom"] = 1.16
    edit["grade"] = {"contrast": 1.05, "saturation": 1.02, "vignette": 0.1}
    edit["captionStyle"] = "ledger"
    edit["captionTerms"] = []
    edit["palette"] = {"ground": "#F3EEE4", "ink": "#10203A", "accent": "#FF6B1A"}
    path.write_text(json.dumps(edit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(edit['segments'])} shots, {len(OVERLAYS)} graphics, {len(edit['captions'])} captions, "
          f"face {'yes' if edit.get('face') else 'NO'}")


if __name__ == "__main__":
    main()
