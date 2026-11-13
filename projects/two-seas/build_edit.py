"""Write the picture edit of "Do samandar jo mix nahi hote?" into edit.json.

Usage: .venv\\Scripts\\python projects/two-seas/build_edit.py

Keeps the captions (make_captions.py) and the face path (track_face.py) already in
edit.json, and replaces segments, overlays and the look. Every time is a source time on
the take (beats.md); auto_edit.py kept the whole take, so source time is output time
(minus the 0.1 s lead-in before the first word).

Rule from the creator for this reel: 0-5.57 s ("Do samandar ... dekha hoga") they are not
on screen. That stretch is one `shook`, which covers the frame.
"""
import json
import pathlib

HERE = pathlib.Path(__file__).resolve().parent

# The creator's own jump cuts (FFmpeg scene score > 0.05), first frame to last.
CUTS = [0.1, 3.433, 5.567, 8.533, 11.667, 13.667, 15.4, 17.433, 20.3, 21.633, 23.667, 25.767, 29.367,
        31.033, 33.067, 35.767, 38.733, 40.233, 44.767, 47.333, 49.767, 51.967, 54.967, 58.067, 58.6,
        60.433, 63.767, 66.2, 68.067, 69.967, 72.933, 76.267]
# Framing per on-camera shot, so every cut on camera changes the picture.
ZOOM_AT = {5.567: 1.04, 15.4: 1.08, 35.767: 1.06, 72.933: 1.0}

HOOK_LINE = json.loads((HERE / "hook_line_boat.json").read_text())
NASA_GIB = "Image: NASA, astronaut photo ISS069-E-3412, 14 April 2023"
NASA_AK = "Image: NASA Terra (MODIS), 22 August 2003"
SOFT = 0.22  # tick volume for labels
COVER_SECONDS = 0.5


def tick(at, take=1, volume=SOFT):
    return {"at": at, "sound": f"tick-soft-{take}", "volume": volume}


def whoosh(at, take="whoosh-2", volume=0.18):
    return {"at": at, "sound": take, "volume": volume}


OVERLAYS = [
    # 1-4. "Do samandar, beech mein ek sharp line, aur paani mix nahi hota. Ye viral video
    # tumne zaroor dekha hoga." Creator off screen. Beats at 0 (the line between green sea
    # and ochre river, "Two seas."), 1.47 (cut to brown water beside dark water; a stroke
    # runs along its edge on "sharp line"), 2.63 (cut back tight on the green/ochre line,
    # "that never mix?"), 3.43 (cut to a plate with the claim as shared), 4.41 (the plate
    # cuts to the other water).
    {"type": "shook", "start": 0, "end": 5.567,
     # Every beat is a hard change of the whole picture: green/ochre wide, brown/dark (the
     # stroke traces its edge), green/ochre tight, then the plate on a cut.
     "shots": [{"at": 0, "src": "ts-colors.mp4", "trim": 0, "zoom": 1.04, "focus": [0.5, 0.56]},
               {"at": 1.467, "src": "ts-boat.mp4", "trim": 0.5, "zoom": 1.0, "focus": [0.5, 0.5]},
               {"at": 2.63, "src": "ts-colors.mp4", "trim": 1.4, "zoom": 2.0, "focus": [0.5, 0.56]}],
     "title": {"text": "Two seas.", "at": 0},
     "question": {"text": "that *never mix?*", "at": 2.63},
     "line": {"points": [[x, y] for x, y in HOOK_LINE if x is not None], "at": 1.67, "src": "ts-boat.mp4"},
     "plate": {"at": 3.433, "quote": "“Two oceans that never mix.”", "credit": "Viral claim · caption on widely shared videos",
               "swapAt": 4.41, "swapSrc": "ts-boat.mp4"},
     "sounds": [whoosh(1.467, "whoosh"), tick(1.67, 1), whoosh(2.63, "whoosh-3"), whoosh(3.433, "whoosh-2", 0.14), tick(4.41, 2)]},
    # 5. "Lekin ye Gibraltar nahi, Gulf of Alaska hai." Creator on top, the board below:
    # the Strait of Gibraltar from the ISS, struck on "nahi"; the Gulf of Alaska from orbit
    # on "Gulf of Alaska", its silt plumes ringed.
    {"type": "sboard", "mode": "place", "start": 5.567, "end": 8.533,
     "credit": f"{NASA_GIB} · {NASA_AK}",
     "first": {"src": "ts-gibraltar.jpg", "label": "Strait of Gibraltar", "strikeAt": 6.87, "focus": [0.42, 0.5]},
     "second": {"src": "ts-alaska.jpg", "label": "Gulf of Alaska", "at": 7.43, "focus": [0.5, 0.5], "ring": {"x": 560, "y": 520}},
     "sounds": [tick(6.87, 3), tick(7.43, 1)]},
    # 6. "Jahan glacier ka mitti wala paani samandar se milta hai, aur kuch der baad mix bhi
    # ho jaata hai." Circle over a glacier's meltwater river, then the silt plumes from orbit;
    # the plume edge ringed on "mix".
    {"type": "sfootagepip", "start": 8.533, "end": 10.33,
     "shots": [{"at": 8.533, "src": "ts-glacier.mp4", "trim": 0.5, "zoom": 1.06, "focus": [0.5, 0.35]}],
     "labels": [{"text": "Glacier meltwater", "at": 9.01, "x": 120, "y": 760}],
     "sounds": [tick(9.01, 2)]},
    {"type": "sfootagepip", "start": 10.33, "end": 13.667,
     "shots": [{"at": 10.33, "src": "ts-alaska.jpg", "zoom": 1.08, "focus": [0.5, 0.55]}],
     "credit": f"Established science · Ken Bruland, UC Santa Cruz: “They do eventually mix.” · {NASA_AK}",
     "labels": [{"text": "Glacial silt", "at": 10.55, "x": 120, "y": 880}],
     "ring": {"x": 640, "y": 1150, "r": 130, "at": 12.63},
     "sounds": [tick(10.55, 3), tick(12.63, 1)]},
    # 7. "Toh kya Quran ki baat galat hui? Pehle dekho, Quran asal mein kehta kya hai." To
    # camera, full frame; the punch lands on "galat".
    # 8. "Surah Rahman: Usne do samandar chhod diye, jo aapas mein milte hain." 55:19, the
    # creator off screen while it is named; each word lights as he translates it.
    {"type": "sayah", "start": 17.433, "end": 21.633, "ayah": "55:19", "from": 1, "to": 3, "size": 128,
     "credit": "Quranic text · Surah Ar-Rahman 55:19",
     "lights": [{"from": 2, "at": 18.99}, {"from": 1, "at": 19.73}, {"from": 3, "at": 21.11}],
     "glosses": [{"text": "*al-baḥrayn*: the two seas", "at": 18.99}, {"text": "*maraja*: let loose", "at": 19.73},
                 {"text": "*yaltaqiyān*: meeting", "at": 21.11}],
     "sounds": [tick(18.99, 1), tick(19.73, 2), tick(21.11, 3)]},
    # "Unke beech ek barzakh, yaani aad hai. Wo ek doosre par hadd se nahi badhte." 55:20
    # with the creator back in the circle.
    {"type": "sayahpip", "start": 21.633, "end": 25.767, "ayah": "55:20", "from": 1, "to": 4, "size": 112,
     "credit": "Quranic text · Surah Ar-Rahman 55:20",
     "lights": [{"from": 2, "at": 22.51}, {"from": 3, "to": 4, "at": 24.73}],
     "glosses": [{"text": "*barzakh*: a barrier", "at": 22.51}, {"text": "*lā yabghiyān*: they do not overstep", "at": 24.73}],
     "sounds": [tick(22.51, 1), tick(24.73, 2)]},
    # 9. "Surah Al-Furqan khud ye clear kar deti hai ki ye kaun se do paani hain. Ek meetha
    # aur ek khaara." 25:53 under the creator; the sweet water's words take the accent.
    {"type": "sboard", "mode": "ayah", "start": 25.767, "end": 31.033, "credit": "Quranic text · Surah Al-Furqan 25:53",
     "ayah": "25:53", "from": 5, "to": 10, "size": 66,
     "lights": [{"from": 6, "to": 7, "at": 29.61, "accent": True}, {"from": 9, "to": 10, "at": 30.59}],
     "glosses": [{"text": "*‘adhbun furāt*: fresh, sweet", "at": 29.61, "accent": True},
                 {"text": "*milḥun ujāj*: salty, bitter", "at": 30.59}],
     "sounds": [tick(29.61, 3), tick(30.59, 1)]},
    # 10. "Imam Ibn Kathir bhi yahi kehte hain, ki dariya ka meetha paani aur samandar ka
    # khaara." His words as a pull quote beside the circle.
    {"type": "pullquote", "start": 31.033, "end": 35.767,
     "quote": "The two seas are the fresh and salty waters, the former coming from running rivers.",
     "who": "Ibn Kathir, on 55:19", "tag": "Classical tafsir", "source": "Tafsir Ibn Kathir (abridged English)",
     "mark": {"text": "fresh and salty", "at": 33.83}, "serif": "Fraunces", "sans": "Bricolage Grotesque", "size": 80},
    # 11. "Aur yahi balance do samandaron ke beech bhi kaam karta hai." To camera; the
    # mid-reel follow card in the headroom.
    {"type": "cta", "mode": "follow", "start": 35.85, "end": 38.6, "placement": "top", "tone": "dark"},
    # 12. "Aap Gibraltar ki science dekho." The real strait from the ISS first.
    {"type": "sfootage", "start": 38.733, "end": 40.233,
     "shots": [{"at": 38.733, "src": "ts-gibraltar.jpg", "zoom": 1.1, "focus": [0.45, 0.45]}],
     "credit": NASA_GIB,
     "labels": [{"text": "Strait of Gibraltar", "at": 38.93, "x": 120, "y": 1000}],
     "sounds": [tick(38.93, 2)]},
    # "Mediterranean ka paani zyada namkeen aur bhaari hai, isliye wo neeche se bahar
    # nikalta hai. Atlantic ka halka paani upar se andar aata hai. Inke beech ki boundary
    # ko pycnocline kehte hain, yaani density ki ek invisible layer. Ye layer mixing ko
    # rokti nahi, balki dheema karti hai. Isliye 'kabhi mix nahi hote' wala viral daawa
    # galat hai." The strait drawn from the side; the creator in the circle from 47.33.
    {"type": "scross", "start": 40.233, "end": 47.333,
     "credit": "Established science · two-layer exchange at Gibraltar (Ocean Science, 2018) · Illustration, not to scale",
     "beats": {"med": 40.33, "heavy": 42.43, "out": 43.39, "atlantic": 44.85, "in": 46.11,
               "band": 48.65, "density": 50.16, "blur": 54.30, "verdict": 57.52},
     "sounds": [tick(40.33, 1), tick(43.39, 2), tick(44.85, 3), tick(46.11, 1)]},
    {"type": "scrosspip", "start": 47.333, "end": 58.067,
     "credit": "Established science · two-layer exchange at Gibraltar (Ocean Science, 2018) · Illustration, not to scale",
     "beats": {"med": 40.33, "heavy": 42.43, "out": 43.39, "atlantic": 44.85, "in": 46.11,
               "band": 48.65, "density": 50.16, "blur": 54.30, "verdict": 57.52},
     "sounds": [tick(48.65, 2), whoosh(54.30, "whoosh-3", 0.12), {"at": 57.52, "sound": "impact", "volume": 0.3}]},
    # 14. "Aur Quran ki aayat ye kehti bhi nahi. Aayat kehti hai, koi paani doosre ko hadd se
    # zyada nahi dabata." 55:20 again under the creator, lā yabghiyān lit on "hadd".
    {"type": "sboard", "mode": "ayah", "start": 58.067, "end": 63.767, "credit": "Interpretation · Surah Ar-Rahman 55:20",
     "ayah": "55:20", "from": 1, "to": 4, "size": 84,
     "lights": [{"from": 2, "at": 58.6}, {"from": 3, "to": 4, "at": 62.43}],
     "glosses": [{"text": "*barzakh*: a barrier", "at": 58.6}, {"text": "*lā yabghiyān*: neither oversteps", "at": 62.43}],
     "sounds": [tick(58.6, 3), tick(62.43, 1)]},
    # 15. "Samandar ka namak dariya ko khatam nahi karta, aur hum usi meethe paani se jeete
    # hain." A real river mouth meeting the ocean; the fresh water named in the accent.
    {"type": "sfootage", "start": 63.767, "end": 68.067,
     "shots": [{"at": 63.767, "src": "ts-mouth.mp4", "trim": 0, "zoom": 1.04, "focus": [0.5, 0.55]}],
     "note": {"text": "*Fresh water*\nbeside the salt sea", "at": 66.93, "y": 860},
     "sounds": [tick(66.93, 2)]},
    # 16. "Isiliye bilkul agli aayat poochti hai: Toh tum apne Rab ki kaun kaun si nematon
    # ko jhutlaoge?" 55:21 with the creator in the circle.
    {"type": "sayahpip", "start": 68.067, "end": 72.933, "ayah": "55:21", "from": 1, "to": 4, "size": 112,
     "credit": "Quranic text · Surah Ar-Rahman 55:21",
     "lights": [{"from": 1, "at": 70.07}, {"from": 3, "at": 70.81}, {"from": 2, "at": 71.87}, {"from": 4, "at": 72.35}],
     "glosses": [{"text": "*ālā’*: favours, blessings", "at": 71.87}],
     "sounds": [tick(71.87, 3)]},
    # 17. "Aise hi viral daawon ka asli sach jaanne ke liye follow kar lo." End cards.
    # The comment card is type on the wall above the cap (the editorial look), clear of
    # the face and beard.
    # It starts once the last caption ("jhutlaoge? Aise", to 73.31) has left the headroom.
    {"type": "cta", "mode": "engage", "start": 73.35, "end": 74.95, "placement": "top", "tone": "light",
     "look": "editorial", "text": "Which viral claim should we *check next?*"},
    {"type": "cta", "mode": "follow", "start": 74.95, "end": 76.25, "placement": "top", "tone": "dark"},
]


def main():
    path = HERE / "edit.json"
    edit = json.loads(path.read_text(encoding="utf-8"))
    edit["segments"] = [{"from": a, "to": b, "zoom": ZOOM_AT.get(a, 1.0)} for a, b in zip(CUTS, CUTS[1:])]
    # The cover (SeasThumbnail, rendered to public/footage/ts-cover.png) closes the reel for
    # 0.5 s in silence, so YouTube Shorts can take it as the thumbnail.
    edit["segments"][-1]["hold"] = COVER_SECONDS
    edit["endCover"] = {"src": "ts-cover.png", "seconds": COVER_SECONDS}
    edit["overlays"] = OVERLAYS
    edit["palette"] = {"ground": "#10242A", "ink": "#ECEFE8", "accent": "#C9A267"}
    edit["captionStyle"] = "punch"
    edit["captionDesign"] = {"sans": "Anton", "serif": "Fraunces", "size": 92}
    # The face sits low in this take (eyes y 885, beard to y 1230): with the speaker full
    # frame, captions stand in the wall above the cap, foot at y 415.
    edit["captionSpeakerBottom"] = 1505
    edit["captionHide"] = [
        {"start": 0, "end": 5.567, "why": "the hook words carry it"},
        {"start": 31.033, "end": 35.767, "why": "Ibn Kathir's words fill the frame as the pull quote"},
        {"start": 35.767, "end": 38.733, "why": "the follow card takes the headroom where captions stand"},
        {"start": 72.933, "end": 76.4, "why": "the end cards carry the call to action"},
    ]
    edit["grade"] = {"contrast": 1.05, "saturation": 0.95, "vignette": 0.1}
    edit["punchToZoom"] = 1.12
    edit["stretchSounds"] = False
    edit["pipCuts"] = True
    edit["assets"] = ["ts-colors.mp4", "ts-boat.mp4", "ts-glacier.mp4", "ts-mouth.mp4", "ts-alaska.jpg", "ts-gibraltar.jpg", "ts-cover.png"]
    path.write_text(json.dumps(edit, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {path.name}: {len(edit['segments'])} segments, {len(OVERLAYS)} overlays")


if __name__ == "__main__":
    main()
