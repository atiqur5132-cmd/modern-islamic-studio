"""Write the picture edit of "Duniya ki sabse purani university?" into edit.json.

Usage: .venv\\Scripts\\python projects/oldest-university/build_edit.py

Keeps the captions (make_captions.py), the face path (track_face.py) and the segments
(the "-teen" cut, beats.md) already in edit.json, and replaces overlays and the look.
Every time is a source time on the take (beats.md).
"""
import json
import pathlib

HERE = pathlib.Path(__file__).resolve().parent

NALANDA = [25.1357, 85.4436]
FEZ = [34.0646, -4.9733]
BOLOGNA = [44.4949, 11.3426]

SOFT = 0.22


def tick(at, take=1, volume=SOFT):
    return {"at": at, "sound": f"tick-soft-{take}", "volume": volume}


def whoosh(at, take="whoosh", volume=0.16):
    return {"at": at, "sound": take, "volume": volume}


OVERLAYS = [
    # 1. "Duniya ki sabse purani university kaunsi hai?" Speaker on top; below, the Nalanda
    # cells and the al-Qarawiyyin courtyard side by side under the line. On "university"
    # the board cuts to the Earth turning towards Asia, pins rising at both places.
    {"type": "ustack", "mode": "open", "start": 0, "end": 2.5,
     "left": {"src": "ou-nalanda-corridor.jpg", "label": "Nalanda", "focus": [0.42, 0.5]},
     "right": {"src": "ou-qarawiyyin-court.jpg", "label": "al-Qarawiyyin", "focus": [0.5, 0.6]},
     "line": "The world's oldest\n*university?*",
     "globeAt": 1.44,
     "pins": [{"place": NALANDA, "at": 1.62}, {"place": FEZ, "at": 1.8}],
     "sounds": [{"at": 0, "sound": "impact", "volume": 0.18}, whoosh(1.44, "whoosh-2"), tick(1.62, 1), tick(1.8, 2)]},
    # 2. "Ye sawaal poocho, to do naam aate hain. Nalanda aur al-Qarawiyyin." The globe
    # fills the frame, speaker in the circle. "do naam": the camera rushes in. "Nalanda":
    # it swoops onto Bihar and the cell-corridor print stands up from its pin. "al-Qarawiyyin":
    # a whip west over Arabia and the Sahara onto Fez, and the courtyard print stands up.
    {"type": "uglobepip", "start": 2.5, "end": 6.9,
     "keys": [
         {"at": 2.5, "lat": 22, "lon": 40, "alt": 5.8, "y": 230},
         {"at": 3.46, "lat": 27, "lon": 42, "alt": 1.75, "y": 150, "move": 0.45},
         {"at": 4.28, "lat": NALANDA[0], "lon": NALANDA[1], "alt": 0.4, "tilt": 36, "x": -120, "y": 330, "move": 0.55},
         {"at": 5.3, "lat": FEZ[0], "lon": FEZ[1], "alt": 0.4, "tilt": 36, "x": -120, "y": 330, "move": 0.55, "arc": 0.9},
     ],
     "pins": [{"place": NALANDA, "at": 2.3}, {"place": FEZ, "at": 2.3}],
     "cards": [
         {"id": "nalanda", "src": "ou-card-nalanda.jpg", "place": NALANDA, "at": 4.45, "height": 0.082},
         {"id": "qarawiyyin", "src": "ou-card-qarawiyyin.jpg", "place": FEZ, "at": 5.62, "height": 0.082},
     ],
     "labels": [
         {"text": "Nalanda", "sub": "Bihar, India", "place": NALANDA, "at": 4.56, "until": 5.3},
         {"text": "al-Qarawiyyin", "sub": "Fez, Morocco", "place": FEZ, "at": 5.7},
     ],
     "sounds": [whoosh(3.46, "whoosh-3", 0.14), whoosh(4.28, "whoosh", 0.16), tick(4.56, 3),
                whoosh(5.3, "whoosh-2", 0.18), tick(5.7, 1)]},
    # 3. "...ladte rehte hain ki sahi kaun hai." The globe holds the courtyard print through
    # "Aur log aapas mein" (the creator's cut at 6.17 is hidden in the circle); then the
    # speaker on top and the two prints fly in and push against each other, a crack
    # running down between them.
    {"type": "ustack", "mode": "faceoff", "start": 6.9, "end": 8.733,
     "left": {"src": "ou-nalanda-corridor.jpg", "label": "Nalanda", "focus": [0.42, 0.5]},
     "right": {"src": "ou-qarawiyyin-court.jpg", "label": "al-Qarawiyyin", "focus": [0.5, 0.6]},
     "sounds": [{"at": 7.2, "sound": "impact", "volume": 0.22}]},
    # 4. "Mazedaar baat ye hai ki dono sahi hain. Bas dono alag sawaal ka jawab hain."
    # Speaker full screen; in the wall above the cap the two prints drop in under "Both are
    # right."; on "Bas dono alag sawaal" a question takes the line's place over each print.
    {"type": "uwall", "start": 8.733, "end": 12.367,
     "cards": [{"src": "ou-card-nalanda.jpg", "name": "Nalanda"}, {"src": "ou-card-qarawiyyin.jpg", "name": "al-Qarawiyyin"}],
     "line": {"text": "Both are *right.*", "at": 10.0},
     "questions": [{"text": "Opened first?", "at": 10.72}, {"text": "Still open?", "at": 10.9}],
     "sounds": [{"at": 10.2, "sound": "shimmer", "volume": 0.14}, tick(10.72, 2), tick(10.9, 3)]},
]

CHANGAN = [34.27, 108.95]
GYEONGJU = [35.86, 129.21]
LHASA = [29.65, 91.1]
# Xuanzang's road out (629-633), simplified: the Gansu corridor, the northern Tarim
# route, Samarkand, Balkh, Gandhara, down the Ganges plain.
XUANZANG = [CHANGAN, [40.14, 94.66], [42.95, 89.19], [41.72, 82.96], [39.65, 66.96], [36.76, 66.9],
            [34.0, 71.57], [27.49, 77.67], NALANDA]
# By sea from Korea, as Yijing records monks going: round China's coast, through the
# Strait of Malacca, across the Bay of Bengal to Tamralipti, up to Nalanda.
KOREA_SEA = [GYEONGJU, [33.2, 126.0], [23.0, 114.5], [10.0, 109.5], [2.5, 104.5], [3.5, 99.5],
             [9.0, 94.0], [21.6, 88.0], [22.3, 87.92], NALANDA]

REST = [
    # 5. "Pehle Nalanda chalte hain. Bihar, 5th century, aur Gupta rajaon ka zamaana."
    # Speaker off: the camera comes down out of space over Asia onto Bihar, low over the
    # plain with the Himalaya on the horizon; "c. 427 CE" on "5th century"; a real gold
    # coin of Kumaragupta I spins in on "Gupta".
    {"type": "uglobe", "start": 12.367, "end": 16.8,
     "keys": [
         {"at": 12.367, "lat": 24, "lon": 80, "alt": 2.2},
         {"at": 12.72, "lat": NALANDA[0], "lon": NALANDA[1], "alt": 0.17, "tilt": 58, "y": 160, "move": 1.05},
     ],
     "pins": [{"place": NALANDA, "at": 13.5}],
     "labels": [{"text": "Nalanda", "sub": "Bihar, India", "place": NALANDA, "at": 13.82, "lift": 0.014}],
     "titles": [{"text": "c. 427 CE", "sub": "The Gupta age", "at": 14.46, "y": 380, "size": 150}],
     "credit": "Historical record · a seal names the founder Shakraditya, identified with Kumaragupta I · Coin: gold coin of Kumaragupta I, CC BY-SA 3.0",
     "sounds": [whoosh(12.72, "whoosh-3", 0.18), tick(13.82, 1), tick(14.46, 2)]},
    {"type": "ucoin", "start": 15.5, "end": 16.8, "src": "ou-coin-gupta.png", "at": 15.68, "x": 770, "y": 560, "size": 340,
     "metal": "gold",
     "sounds": [tick(15.75, 3, 0.28)]},
    # 6. "Socho, ek aisi jagah, jahan log padhte bhi the, aur wahin rehte bhi the." Speaker
    # on top; Monastery 1's courtyard with its raised platform ringed on "padhte"; cut to the
    # corridor of cells on "aur wahin", the doorways ringed on "rehte".
    {"type": "ustack", "mode": "photo", "start": 16.8, "end": 21.367,
     "shots": [{"at": 16.8, "src": "ou-nalanda-court.jpg", "zoom": 1.04, "to": 1.12},
               {"at": 20.16, "src": "ou-nalanda-corridor.jpg", "focus": [0.45, 0.5], "zoom": 1.04, "to": 1.1}],
     "labels": [{"text": "Study *here.*", "at": 19.14, "x": 92, "y": 116}, {"text": "Live *here.*", "at": 20.56, "x": 92, "y": 116}],
     "rings": [{"x": 450, "y": 740, "rx": 310, "ry": 150, "at": 19.14},
               {"x": 700, "y": 640, "rx": 70, "ry": 140, "at": 20.56},
               {"x": 880, "y": 690, "rx": 100, "ry": 210, "at": 20.75}],
     "credit": "Historical record · Monastery 1 and its cells, Nalanda · Photos: Sumitsurai, CC BY-SA 4.0",
     "sounds": [tick(19.14, 1), tick(20.56, 2), tick(20.75, 3)]},
    # 7. "China aur Korea se mahino ka safar karke log yahan padhne aate the." The globe
    # over Asia, speaker in the circle: Xuanzang's road draws from China, a sea route from
    # Korea; "Months on the road" on "mahino".
    {"type": "uglobepip", "start": 21.367, "end": 24.867,
     "keys": [{"at": 21.367, "lat": 20, "lon": 104, "alt": 1.75, "x": -150, "y": 360},
              {"at": 21.6, "lat": 19, "lon": 99, "alt": 1.6, "x": -150, "y": 360, "move": 3.0}],
     "pins": [{"place": NALANDA, "at": 21.37}, {"place": CHANGAN, "at": 21.38}, {"place": GYEONGJU, "at": 21.96}],
     "labels": [{"text": "China", "place": CHANGAN, "at": 21.38}, {"text": "Korea", "place": GYEONGJU, "at": 21.96, "side": "below"}],
     "routes": [{"points": XUANZANG, "at": 21.38, "draw": 2.7}, {"points": KOREA_SEA, "at": 21.96, "draw": 2.6, "dash": True}],
     "titles": [{"text": "Months on\n*the road*", "at": 22.46, "y": 760, "size": 104}],
     "credit": "Historical record · Xuanzang's road from China, 629-645; Korean monks by sea, recorded by Yijing · Routes simplified",
     "sounds": [tick(21.38, 1), tick(21.96, 2), tick(22.46, 3)]},
    # 8. "Phir 1200 ke aas-paas Turk hamle hue, aur Nalanda ko bahut nuksaan pahuncha."
    # Speaker off: Monastery 5's walls, the year running 427 -> 1200 as it is said, the
    # colour draining. Cut (27.07): Temple 12's broken wall, dark, speaker in the circle.
    {"type": "uphoto", "start": 24.867, "end": 27.067,
     "shots": [{"at": 24.867, "src": "ou-nalanda-walls.jpg", "focus": [0.55, 0.5], "zoom": 1.06, "to": 1.16}],
     "counter": {"from": 427, "to": 1200, "at": 24.92, "over": 0.6, "prefix": "c.", "suffix": "CE", "y": 560},
     "drain": {"at": 25.6, "over": 1.4, "to": 0.15},
     "credit": "Historical record · raids by Turkic armies on Bihar's monasteries, c. 1193-1203",
     "sounds": [tick(24.92, 1), tick(25.1, 2), tick(25.28, 3), {"at": 25.5, "sound": "sub-hit", "volume": 0.2}]},
    {"type": "uphotopip", "start": 27.067, "end": 29.1,
     "shots": [{"at": 27.067, "src": "ou-nalanda-temple12.jpg", "focus": [0.4, 0.5], "zoom": 1.1, "to": 1.2}],
     "drain": {"at": 27.0, "over": 0.1, "to": 0.3}, "dim": 0.1,
     "credit": "Temple 12, Nalanda · Photo: Sumitsurai, CC BY-SA 4.0"},
    # 9. "1235 mein ek Tibetan monk wahan pahuncha, to sirf do building mein padhai bachi
    # thi." The globe over the Himalaya, speaker in the circle: his road from Tibet through
    # Nepal to Nalanda, "1235". Cut (31.57), speaker off: 80 small viharas as a model, all
    # lit; on "sirf" they go out until two remain.
    {"type": "uglobepip", "start": 29.1, "end": 31.567,
     "keys": [{"at": 29.1, "lat": 27.2, "lon": 88.4, "alt": 0.8, "tilt": 30, "y": 300},
              {"at": 29.3, "lat": 26.6, "lon": 87.2, "alt": 0.68, "tilt": 34, "y": 300, "move": 2.2}],
     "pins": [{"place": LHASA, "at": 29.2}, {"place": NALANDA, "at": 29.2}],
     "labels": [{"text": "Dharmasvamin", "sub": "a monk from Tibet", "place": LHASA, "at": 30.1}],
     "routes": [{"points": [LHASA, [27.7, 85.32], NALANDA], "at": 29.38, "draw": 1.6}],
     "titles": [{"text": "1235", "at": 29.38, "y": 760, "size": 170}],
     "credit": "Historical record · Dharmasvamin's biography (Roerich trans., 1959)",
     "sounds": [tick(29.38, 1), tick(30.1, 2)]},
    {"type": "ublocks", "start": 31.567, "end": 33.533, "count": 80, "keep": 2, "darkAt": 31.76,
     "line": {"text": "Only *2*\nstill teaching", "at": 32.16, "y": 330, "size": 130},
     "credit": "Reconstruction · illustrative, not the site plan · Dharmasvamin found 80 small viharas, 2 in use",
     "sounds": [tick(31.8, 1), tick(31.9, 2), tick(32.0, 3), tick(32.16, 1, 0.3)]},
    # 10. "Aur phir dheere-dheere wahan sannata chha gaya." The empty courtyard at its widest,
    # almost no colour, pulling back; no sound but the voice.
    {"type": "uphoto", "start": 33.533, "end": 35.767,
     "shots": [{"at": 33.533, "src": "ou-nalanda-empty.jpg", "zoom": 1.14, "to": 1.03}],
     "drain": {"at": 33.4, "over": 0.1, "to": 0.18}, "dim": 0.06,
     "credit": "Nalanda today · Photo: Sumitsurai, CC BY-SA 4.0"},
    # 11. "Ab Morocco chalte hain. Fez shehar, saal 859." Speaker off: the camera lifts off
    # Bihar and flies west in one long arc to Fez; "859 CE · 245 AH". (Our "-teen" cut at
    # 38.47 is under this flight.)
    {"type": "uglobe", "start": 35.767, "end": 39.267,
     "keys": [{"at": 35.767, "lat": NALANDA[0], "lon": NALANDA[1], "alt": 0.5, "tilt": 30, "y": 200},
              {"at": 35.96, "lat": FEZ[0], "lon": FEZ[1], "alt": 0.42, "tilt": 44, "y": 180, "move": 1.15, "arc": 1.6}],
     "pins": [{"place": FEZ, "at": 36.9}],
     "labels": [{"text": "Fez", "sub": "Morocco", "place": FEZ, "at": 37.02, "lift": 0.032}],
     "titles": [{"text": "859 CE", "sub": "245 AH", "at": 38.28, "y": 380, "size": 160}],
     "sounds": [whoosh(35.96, "whoosh", 0.2), tick(37.02, 1), {"at": 38.28, "sound": "impact", "volume": 0.18}]},
    # 12. "Wahan ek masjid banti hai, al-Qarawiyyin." Speaker on top, the courtyard pavilion
    # below; the name on "al-Qarawiyyin". The mid-reel follow card, small, in the board.
    {"type": "ustack", "mode": "photo", "start": 39.267, "end": 41.933,
     "shots": [{"at": 39.267, "src": "ou-qarawiyyin-pavilion.jpg", "focus": [0.5, 0.4], "zoom": 1.04, "to": 1.12}],
     "labels": [{"text": "al-*Qarawiyyin*", "at": 40.94, "x": 92, "y": 116}],
     "credit": "al-Qarawiyyin Mosque, Fez · Photo: Ahmed.magdy, CC BY-SA 4.0",
     "sounds": [tick(40.94, 2)]},
    {"type": "cta", "mode": "follow", "start": 39.4, "end": 41.85, "placement": "top", "tone": "dark", "y": 1000},
    # 13. "Kehte hain Fatima al-Fihri naam ki ek aurat ne apni virasat ka paisa isme laga
    # diya." Speaker on top; her name on paper with where it comes from (a book written
    # five centuries later). No portrait: none exists. On "virasat ka paisa" a real silver
    # dirham minted in Fez around 840 spins in.
    {"type": "ustack", "mode": "page", "start": 41.933, "end": 46.1,
     "page": {"name": "Fatima al-Fihri", "arabic": "فاطمة الفهرية",
              "credit": "Later report · Ibn Abi Zar, Rawd al-Qirtas, 14th century · Coin: silver dirham minted in Fez, c. 840"},
     "sounds": [tick(42.46, 1)]},
    {"type": "ucoin", "start": 44.4, "end": 46.1, "src": "ou-coin-idrisid.png", "at": 44.58, "x": 860, "y": 960, "size": 220,
     "metal": "silver", "sounds": [tick(44.65, 3, 0.28)]},
    # 14. "Masjid mein padhai shuru hui, aur woh aaj tak ruki nahi." Speaker in the circle:
    # two paths across a floor; Nalanda's breaks off at c. 1200, al-Qarawiyyin's runs on to
    # 2026 as the camera tracks it; "1,167 years" on "ruki nahi".
    {"type": "utimeline", "start": 46.1, "end": 49.233,
     "broken": {"name": "Nalanda", "from": 427, "to": 1200, "at": 46.18},
     "running": {"name": "al-Qarawiyyin", "from": 859, "to": 2026, "at": 46.68, "until": 48.68},
     "title": {"text": "*1,167* years", "sub": "and still teaching", "at": 48.68, "y": 880, "size": 130},
     "credit": "Historical record · founded c. 427 (Nalanda) and 859 (al-Qarawiyyin); 2026 - 859 = 1,167",
     "sounds": [tick(46.18, 1), tick(46.68, 2), {"at": 48.68, "sound": "impact", "volume": 0.2}]},
    # 15. "Isliye Guinness ise duniya ka sabse purana chalta hua educational institution
    # maanta hai." Speaker in the circle: the record's own words over the darkened
    # courtyard, "continually operating" marked on "chalta hua". No logo.
    {"type": "uphotopip", "start": 49.233, "end": 54.167,
     "shots": [{"at": 49.233, "src": "ou-qarawiyyin-court.jpg", "focus": [0.5, 0.6], "zoom": 1.08, "to": 1.16}],
     "quote": {"text": "The oldest existing and continually operating educational institution in the world.",
               "mark": {"text": "continually operating", "at": 51.72}, "at": 49.62, "y": 720},
     "credit": "Record · Guinness World Records, “Oldest higher-learning institution”: University of Karueein, founded 859",
     "sounds": [tick(49.62, 1), tick(51.72, 2)]},
    # 16. "Aur ek twist bhi hai." To camera. "Agar university ka matlab degree dene wala
    # system hai," (55.3) speaker off: the 14th-century painting of a lecture at Bologna.
    # "to record Italy ke Bologna ke paas hai, 1088 se." (58.13) the globe, speaker in the
    # circle: a third place, the Archiginnasio print standing at Bologna, "1088".
    {"type": "uphoto", "start": 55.3, "end": 58.133,
     "shots": [{"at": 55.3, "src": "ou-bologna-lecture.jpg", "focus": [0.4, 0.45], "zoom": 1.12, "to": 1.26}], "dim": 0.12,
     "titles": [{"text": "If a university means\n*a degree-giving body*", "at": 56.64, "y": 400, "size": 96}],
     "credit": "Historical record · Laurentius de Voltolina, a lecture at the University of Bologna, c. 1350 · Kupferstichkabinett Berlin, public domain",
     "sounds": [tick(56.64, 1)]},
    {"type": "uglobepip", "start": 58.133, "end": 61.833,
     "keys": [{"at": 58.133, "lat": 40, "lon": 3, "alt": 1.15, "y": 260},
              {"at": 59.45, "lat": BOLOGNA[0], "lon": BOLOGNA[1], "alt": 0.4, "tilt": 36, "x": -160, "y": 330, "move": 0.6}],
     "pins": [{"place": FEZ, "at": 58.15}, {"place": BOLOGNA, "at": 58.4}],
     "cards": [{"id": "bologna", "src": "ou-card-bologna.jpg", "place": BOLOGNA, "at": 59.62, "height": 0.082}],
     "labels": [{"text": "Bologna", "sub": "Italy", "place": BOLOGNA, "at": 59.7}],
     "titles": [{"text": "1088", "sub": "oldest in Europe", "at": 60.66, "x": 650, "y": 900, "size": 136}],
     "credit": "Record · Guinness World Records: Bologna, founded 1088, the oldest in Europe · Photo: Ugeorge, CC BY-SA 4.0",
     "sounds": [whoosh(59.45, "whoosh-2", 0.16), tick(59.7, 1), {"at": 60.66, "sound": "impact", "volume": 0.2}]},
    # 17. "To jawab is par depend karta hai ki tum pooch kya rahe ho." To camera; the two
    # questions from the hook come back over the two prints in the wall.
    {"type": "uwall", "start": 61.833, "end": 64.9,
     "cards": [{"src": "ou-card-nalanda.jpg", "name": "Nalanda"}, {"src": "ou-card-qarawiyyin.jpg", "name": "al-Qarawiyyin"}],
     "questions": [{"text": "Opened first?", "at": 62.0}, {"text": "Still open?", "at": 62.3}],
     "sounds": [{"at": 62.0, "sound": "shimmer", "volume": 0.12}]},
    # 18. "Ilm ka darwaza sabse pehle kisne khola? Nalanda." Speaker off: through a real brick
    # doorway at Nalanda; the answer on "Nalanda".
    {"type": "uphoto", "start": 64.9, "end": 68.0,
     "shots": [{"at": 64.9, "src": "ou-nalanda-door.jpg", "focus": [0.5, 0.45], "zoom": 1.0, "to": 1.32}],
     "titles": [{"text": "Opened first?", "at": 65.34, "until": 67.1, "y": 760, "size": 110},
                {"text": "*Nalanda*", "sub": "c. 427 CE", "at": 67.23, "y": 760, "size": 170}],
     "credit": "Monastery 4, Nalanda · Photo: G41rn8, CC BY-SA 4.0", "creditY": 1250,
     "sounds": [tick(65.34, 1), {"at": 67.23, "sound": "impact", "volume": 0.2}]},
    # 19. "Aur kaunsa darwaza aaj tak khula hai? al-Qarawiyyin." Through al-Qarawiyyin's open
    # door; the answer holds over 2 s, the speaker coming back in the circle as the CTA
    # begins.
    {"type": "uphoto", "start": 68.0, "end": 71.267,
     "shots": [{"at": 68.0, "src": "ou-qarawiyyin-door.jpg", "focus": [0.55, 0.5], "zoom": 1.0, "to": 1.26}],
     "titles": [{"text": "Still open?", "at": 68.77, "until": 70.25, "y": 760, "size": 110},
                {"text": "*al-Qarawiyyin*", "sub": "since 859", "at": 70.39, "y": 760, "size": 150}],
     "credit": "Bab al-Maqsura, al-Qarawiyyin · Photo: Robert Prazeres, CC BY-SA 4.0", "creditY": 1250,
     "sounds": [tick(68.77, 2), {"at": 70.39, "sound": "shimmer", "volume": 0.16}]},
    {"type": "uphotopip", "start": 71.267, "end": 72.6,
     "shots": [{"at": 68.0, "src": "ou-qarawiyyin-door.jpg", "focus": [0.55, 0.5], "zoom": 1.0, "to": 1.26}],
     "titles": [{"text": "*al-Qarawiyyin*", "sub": "since 859", "at": 70.39, "y": 760, "size": 150}],
     "credit": "Bab al-Maqsura, al-Qarawiyyin · Photo: Robert Prazeres, CC BY-SA 4.0", "creditY": 1250},
    # 20. "Tumhe kaunsi kahani zyada inspiring lagi? Comment mein likho, aur aisi videos ke
    # liye follow bhi kar lo." To camera: the comment question, then the follow card.
    {"type": "cta", "mode": "engage", "start": 72.7, "end": 74.4, "placement": "top", "tone": "light",
     "look": "editorial", "text": "Nalanda or *al-Qarawiyyin?*"},
    {"type": "cta", "mode": "follow", "start": 74.4, "end": 76.1, "placement": "top", "tone": "dark"},
]
OVERLAYS += REST

LOOK = {
    "palette": {"ground": "#16110D", "ink": "#F3EBDF", "accent": "#C8643C"},
    "captionStyle": "editorial",
    "captionDesign": {"sans": "Plus Jakarta Sans", "serif": "Instrument Serif", "size": 68},
    "captionSpeakerBottom": 1505,
    "captionHide": [
        {"start": 0, "end": 12.367, "why": "the hook's words are set on screen (line, place names, questions)"},
        {"start": 46.1, "end": 49.233, "why": "the timeline shows it, and its years sit in the caption band"},
        {"start": 49.233, "end": 54.167, "why": "the record's own words fill the frame"},
        {"start": 61.833, "end": 72.6, "why": "the questions and answers are set on screen"},
        {"start": 72.6, "end": 76.2, "why": "the end cards carry the call to action"},
    ],
    "grade": {"contrast": 1.05, "saturation": 0.95, "vignette": 0.1},
    "punchToZoom": 1.1,
    "stretchSounds": False,
    "pipCuts": True,
    # The cover held full screen for the last 0.5 s (silent freeze), so YouTube Shorts can pick it.
    "endCover": {"src": "ou-cover.png", "seconds": 0.5},
    "assets": ["ou-nalanda-corridor.jpg", "ou-qarawiyyin-court.jpg", "ou-card-nalanda.jpg", "ou-card-qarawiyyin.jpg",
               "ou-card-bologna.jpg", "ou-earth.jpg", "ou-patch-india.jpg", "ou-patch-maghreb.jpg", "ou-patch-italy.jpg",
               "cn-tex-stars.jpg", "ou-coin-gupta.png", "ou-coin-idrisid.png", "ou-nalanda-court.jpg", "ou-nalanda-walls.jpg",
               "ou-nalanda-temple12.jpg", "ou-nalanda-empty.jpg", "ou-nalanda-door.jpg", "ou-qarawiyyin-pavilion.jpg",
               "ou-qarawiyyin-door.jpg", "ou-bologna-lecture.jpg", "ou-cover.png"],
}


def main():
    path = HERE / "edit.json"
    edit = json.loads(path.read_text(encoding="utf-8"))
    edit = {k: edit[k] for k in ("footage", "segments", "captions", "face")}
    edit.update(LOOK)
    edit["segments"][-1]["hold"] = 0.5
    edit["overlays"] = OVERLAYS
    path.write_text(json.dumps(edit, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"{len(OVERLAYS)} overlays, {len(edit['segments'])} segments -> {path.name}")


if __name__ == "__main__":
    main()
