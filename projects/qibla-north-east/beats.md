# Beats: "America mein qibla north-east kyun?" (talking head)

Series B, Forgotten History. Rewritten 2026-11-09 for the talking-head take
(`public/footage/qibla-north-east.mp4`, 65.8 s, shot by the creator on 2026-11-09). The old
faceless beats are replaced. The creator trusts Claude's first picks (memory: plan-picks-default),
so every line takes option A of `plan_options.json` / `plan.html`.

Times are source times on the take. `auto_edit.py` found no pause over 0.5 s and kept the
whole take (`lostWords` empty), so source time is output time (minus one frame). Every layout
change sits on one of the creator's own jump cuts (FFmpeg scene score > 0.05): 2.73, 5.27,
8.33, 9.97, 12.63, 15.10, 16.67, 18.37, 19.77, 21.80, 24.73, 26.80, 30.60, 34.23, 36.77,
38.87, 40.10, 42.60, 44.07, 46.90, 47.83, 50.27, 51.87, 52.83, 55.23, 56.07, 58.27, 59.63,
61.00, 63.73. The build is `build_edit.py`.

## The three biggest visual decisions

1. **One Earth surface for the whole explanation.** A single 3D surface (`src/overlays/qibla/Earth3D.tsx`,
   NASA Blue Marble skin) is an orange that opens into petals, tears, stretches into a sheet,
   turns into the classroom Mercator map, and wraps back into the globe. The string, the map
   line and every pin are drawn with the same maths, so the idea "a flat map is a stretched
   globe" is shown as one continuous object. This answers the flat-earth viewers' complaint
   that the concept was unclear.
2. **The map line pulled tight becomes the qibla.** On the globe the white straight-map line
   (a rhumb line, curving south) snaps north into the orange great circle on "tight". The one
   accent colour (orange) only ever means the true qibla.
3. **Real 1953 evidence instead of invented reactions.** The mosque's recorded bearing
   (56°33′) and the passers-by's words ("Take any map… the line would go slightly south")
   from *The Washington Daily News*, 15 April 1953, are on screen with their source.

## Look

| Role | Value |
| --- | --- |
| Ground | chart paper #F3EEE4 (the creator's pale wall reads as the same page) |
| Ink | navy #10203A |
| Muted | #6B6F78 |
| Accent | qibla orange #FF6B1A. One meaning: the true qibla direction (the string, the NE needle, 56°, the tick). The flat map's straight line is always white. |
| Words | Inter Tight 800/900 |
| Numbers, bearings | IBM Plex Mono 700 |
| Arabic | Amiri Quran |
| Pictures | real photos (USIA 1950s prayer hall, UPI 1954, dbking minaret, al-Biruni manuscript), real Pexels footage, and the NASA Earth. No dark void, no glow rings, no particles. |

## Captions

Ledger look (as flat-earth): sentence case, white with an ink edge, the spoken word on an ink
tab, numbers in mono. 2-4 words per group. Hidden in the hook (0-5.27 s), where the hook's own
words carry it. In the stack layouts the captions ride up with the speaker window; elsewhere
they sit in the band with their foot at y 1310.

## Beats

| # | Time | Line (as spoken, short) | Layout | Built | Tag |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.00-2.73 | America mein Muslim namaz *north-east*… | Full-screen photo, speaker off | 0.0 worshippers in the Islamic Center's prayer hall, compass needle already swinging, QIBLA IN AMERICA / NORTH-EAST?; 1.20 ("north-east") needle locks on 56°, text turns orange; 1.90 hard cut to the minaret, orange NE arrow | (hook) |
| 2 | 2.73-5.27 | Par map kholo… *south-east* | Full-screen map, speaker off | 2.73 hard cut to the classroom Mercator map, WASHINGTON and MAKKAH pins; 3.56 ("Makkah") white straight line draws down-right; 4.22 ("south-east") THE MAP SAYS: SOUTH-EAST lands, a small orange NE arrow on the same pin | (hook) |
| 3 | 5.27-8.33 | 1953 mein Washington ki ek nayi masjid… | Stack: speaker top (first appearance), photo below | 1954 UPI photo (B&W), 5.40 WASHINGTON DC · 1953, "A new mosque going up (photo: 1954)" | HISTORICAL RECORD |
| 4a | 8.33-9.97 | Uska rukh north-east rakha gaya | Full-screen compass | The mosque seen from above turns from N to its bearing on 8.94; 56°33′ rolls up; source line | HISTORICAL RECORD |
| 4b | 9.97-12.63 | …dekhne wale ghabra gaye… galat taraf | Circle PiP over a quote card | PASSERS-BY, 1953: "Take any map… the line would go slightly south."; 11.58 ("galat") WRONG WAY? stamp | HISTORICAL RECORD |
| 5a | 12.63-15.10 | Masjid *galat* nahi thi. Gadbad us map mein thi | Speaker full screen | Punch to 1.16 on "galat" | — |
| 5b | 15.10-16.67 | …jo hum school se dekhte aa rahe hain | Full-screen B-roll | Wall map with a hand (Pexels 8829564), SINCE SCHOOL on 15.54 | THE MAP WE ALL LEARNED |
| 6 | 16.67-18.37 | Map flat hai, aur zameen gol | Full-screen split graphic | The map (top) with FLAT on 17.12; the globe turning (bottom) with ROUND on 18.10 | ESTABLISHED SCIENCE |
| 7 | 18.37-21.80 | Ek santre ka chhilka utaro… flat karke dikhao | Stack: speaker top, clip below | Hands peeling an orange in one piece (Pexels 6535276); 20.72 "Now lay the peel flat." | TRY THIS |
| 8-9 | 21.80-26.80 | Nahi hoga. Kahin phatega, kahin *stretch*… Duniya ka map bhi aise hi khincha hua hai | Full-screen 3D, speaker off | 21.84 the orange opens into 8 petals; 23.02 TEARS (the gaps flash dark); 23.82 STRETCHES (petals widen into a sheet); 24.94 the skin becomes the Earth; 25.40 it stretches into Mercator; 26.18 GREENLAND and AFRICA ringed, "Looks the same size. Africa is 14× bigger." | ESTABLISHED SCIENCE |
| 10 | 26.80-30.60 | Isliye map par jo line seedhi dikhti hai… sabse chhota raasta nahi | Circle PiP over the map | The hook's white line draws again (27.18), "Straight on the map…" (27.72), NOT THE SHORTEST stamp (29.42) | ESTABLISHED SCIENCE |
| 11 | 30.60-34.23 | Ab ek globe par… dhaaga *tight* karke lagao | Circle PiP over the globe | 30.68 the map wraps into the globe, the white line now curving south on it; pins pulse on 31.40 and 31.94; "Pull a string tight" (32.72); 33.08 ("tight") the line snaps north into the orange great circle | ESTABLISHED SCIENCE |
| 12 | 34.23-36.77 | Dhaaga pehle upar ki taraf jaata hai, north-east | Full-screen 3D, speaker off | Close on Washington; the string grows up and to the right (34.74); 36.12 compass on the pin, STARTS NORTH-EAST | ESTABLISHED SCIENCE |
| 13 | 36.77-40.10 | Phir Atlantic aur Europe ke upar se mudta hai… Makkah par utarta hai | Full-screen 3D, speaker off | The camera rides the string as the globe turns; ATLANTIC 37.02, EUROPE 37.62, MAKKAH 39.10 | ESTABLISHED SCIENCE |
| 14 | 40.10-42.60 | Wo pehli direction hi Washington ka pehla qibla hai | Full-screen compass | 56° NE, QIBLA = THE STRING'S FIRST DIRECTION; "Our calculation: 56.5°. Recorded in 1953: 56°33′." | NUMERICAL OBSERVATION · OUR CALCULATION |
| 15 | 42.60-44.07 | Toh masjid bilkul *sahi* bani thi | Speaker full screen + chest chip | Punch on "sahi"; ✓ RIGHT ALL ALONG on the chest (43.46) | — |
| 16 | 44.07-47.83 | Alaska mein toh qibla seedha, lagbhag *north*… pole ke upar se | Full-screen 3D, speaker off | The North Pole faces us; ALASKA pin (44.16); the string goes up past the pole to Makkah (44.78); ALMOST DUE NORTH · 351° (46.16); NORTH POLE (46.82) | NUMERICAL OBSERVATION · OUR CALCULATION |
| 17 | 47.83-51.87 | Muslim astronomers… hazaar saal pehle… spherical trigonometry | Stack: speaker top, manuscript below | al-Biruni, Kitab al-Tafhim (c. 1029 CE); 1,000 YEARS AGO (49.40); a spherical triangle drawing on a small globe, "spherical trigonometry" (50.26) | HISTORICAL RECORD |
| 18 | 51.87-55.23 | Waise America ki kuch masjidein aaj bhi south-east ki taraf hain | Speaker full screen + mid-video Follow card | The honest beat to camera; Follow card on the chest 51.95-54.45 | — |
| 19 | 55.23-59.63 | …direction ki taraf muh karna hi kaafi hai, ye bahut se scholars ki raay hai | Full-screen Ayah card | 2:144 (fetched; tokens 12-16 "fa walli wajhaka shatra al-masjid al-haram"), Sahih International; 58.24 SCHOLARLY VIEW: "Many scholars: from far away, facing the direction is enough. For your own case, ask a scholar." | QURANIC CONTEXT |
| 20 | 59.63-63.73 | Map *jhooth* nahi bolta. Bas gol duniya ko flat dikhane mein thoda *khinch* jaata hai | Speaker (punch), then full-screen 3D | 61.10 the globe unwraps into the classroom map with the orange string on it and the white line beside it; "The map isn't lying. It's stretched." lands 61.40 and holds to 63.73 | ESTABLISHED SCIENCE |
| 21 | 63.73-65.77 | Follow kar lo, aise hi fascinating videos ke liye | Speaker + end cards | Follow card in the caption band; comment card: "What's the qibla direction from your city?" | — |

Longest stretch without the speaker: 34.23-42.60 (8.4 s: depart, ride, compass), all moving 3D.

## Hook check on paper (QUALITY §1; measured again on the render)

| Gate | Plan |
| --- | --- |
| Opens on full-screen visuals; creator after, at a sentence break | Photos and map to 5.27 s; creator at the creator's own cut before "1953" |
| Frame 0 = thumbnail, readable at 270 px | Compass ring (67% of the width) over the prayer hall, NORTH-EAST? at 150 px |
| Change at least every 1.5 s to 6 s, 4+ beats | 0.0 photo + swinging needle · 1.20 lock + orange · 1.90 cut to minaret + arrow · 2.73 cut to map · 3.56 line · 4.22 SOUTH-EAST · 5.27 cut to speaker + 1954 photo = 7 beats, longest gap 1.48 s |
| Key word inside 1.5 s | "north-east" spoken at 1.20, on screen from frame 0 |
| Opens a gap | Qibla north-east, map south-east: which is wrong? |
| Sound at frame 0 | Impact on frame 0 under the voice |
| Muted test, first 3 s | QIBLA IN AMERICA / NORTH-EAST? over a mosque, then the map |

## Changes from the plan while building

- The quote on line 4b is a full-screen card with the speaker in the circle (not a chest card):
  the creator's chin sits low enough that a three-line card would collide with the captions.

## Still to check

- The creator confirms `script.txt` (differences listed in the hand-over), especially
  "Washington ka **pehla** qibla hai" (41.9 s), which Whisper heard three times.
- The 2:144 card is not spoken; the creator approves showing it.
- Scholar check of line 19 before posting (research.md, claim 11).
