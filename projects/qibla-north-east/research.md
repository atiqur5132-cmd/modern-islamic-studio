# Research: "America mein qibla north-east kyun?"

Series B, Forgotten History (with a numbers spine). Faceless reel: voiceover over maps,
globes and motion graphics only. Researched 2026-11-08. The creator reads this before the
script.

## The story in one line

In 1953 the new Islamic Center of Washington was built facing 56° east of north
(north-east). Muslims visiting it worried, because on a flat map Mecca lies to the
south-east. The mosque was right; the flat map misleads. Muslim astronomers had solved
this with spherical trigonometry more than a thousand years earlier.

## Sources opened

| Source | What it gives | Accessed |
| --- | --- | --- |
| S. Kamal Abdali, "The Correct Qibla", rev. 1997-09-17, geomete.com/abdali/papers/qibla.pdf (full text extracted) | The 1953 Washington mosque, quoting *The Washington Daily News*, 15 April 1953 (reprinted in Don May, "You Can't Build That Mosque With a Compass", *Surveying and Mapping*): "faces 56 degrees, 33 minutes, and 15 seconds east of true north"; "calculated for this mosque by the Egyptian Ministry of Works in Cairo"; passers-by said "Take any map… the line would go slightly south" (p. 3). Nachef & Kadi's book and claims (p. 1–2). Worked qibla for Washington 56°35′ E of N and Anchorage 9°06′ W of N (p. 20–21). Sun overhead Mecca at noon "approximately May 28 and July 16", with al-Tusi's description of the shadow method (p. 21) | 2026-11-08 |
| Nachef & Kadi, *The Substantiation of the People of Truth that the Direction of al-Qibla in the United States and Canada is to the Southeast*, Assoc. of Islamic Charitable Projects, Philadelphia, 1414 AH / 1993 | Known only through Abdali's summary and reference list (not opened). Argues south-east; cites classical jurists and US/Canadian geographers who favour the rhumb line | via Abdali |
| Wikipedia, "Qibla" (read to about a third, rest by summary) | Most North American Muslims came to accept north-east, a minority east/south-east (Bilici 2012 p. 57); jihat al-ka'ba accepted by Abu Hanifa and al-Qurtubi, ayn al-ka'ba held by a minority, e.g. Ibn Arabi (King 1996 p. 134; Bashori 2015); "In the late 9th and 10th centuries, Muslim astronomers developed methods to find the exact direction of the qibla"; historical mosques with differing qiblas still stand | 2026-11-08 |
| quran.com API (via `scripts/fetch_ayah.py`) | 2:144 | 2026-11-08 |

## The Ayah (fetched and cross-checked by `scripts/fetch_ayah.py`, 2026-11-08)

Arabic in `src/data/quran/2-144.json`. Never retype it. Sahih International (quran.com
translation 20): "…So turn your face toward al-Masjid al-Haram. And wherever you
[believers] are, turn your faces toward it [in prayer]…". The Ayah card shows only the
part "fa walli wajhaka shatra…" onward, cut by code from the JSON, not by hand. The verb
is "turn towards" (shatr = towards, in the direction of), which is part of why most
jurists accept the general direction for those far away (Wikipedia, citing [19]).

## Our own numbers (recomputed, 2026-11-08)

Kaaba 21.422487° N, 39.826206° E. Great-circle initial bearing and rhumb-line bearing,
degrees clockwise from true north; distances on a 6371 km sphere. Script:
`work`-free one-off Python in this session; formula is the standard atan2 form, the same
as Abdali's equation (2).

| From | Great circle (qibla) | Rhumb line (flat-map straight line) | Great-circle km | Rhumb km |
| --- | --- | --- | --- | --- |
| New York | 58.5° (north-east) | 101.3° (just south of east) | 10,306 | 10,965 |
| Washington DC (Abdali's coordinates) | 56.6° (Abdali: 56°35′) | — | — | — |
| Chicago | 48.7° | 100.8° | 11,146 | 12,165 |
| Los Angeles | 23.9° | 95.2° | 13,424 | 15,571 |
| Toronto | 54.6° | 102.6° | 10,496 | 11,320 |
| Anchorage | 350.9° (almost due north; Abdali: 9°06′ W of N) | 251.8° | 10,785 | 14,164 |
| Delhi | 266.6° (just south of west) | 258.0° | 3,835 | 3,847 |

Cross-check: Anchorage and Washington match Abdali's worked examples to 0.1°. New York:
the flat-map line is 659 km longer (10,965 − 10,306), so "lagbhag 650 km" is safe.

**Sun over the Kaaba** (NOAA solar formulas, 2026 and 2027): solar declination passes
the Kaaba's latitude (21.42°) between 27 and 28 May and between 15 and 16 July. Solar
noon at the Kaaba is then about 12:17 and 12:26 Makkah time, which is **about 2:47 pm and
2:56 pm India time**. At that moment the sun is straight above the Kaaba, so anywhere it
is visible (all of India) a vertical stick's shadow points directly away from the qibla.
Matches Abdali ("approximately May 28 and July 16") and al-Tusi's method.

## Claim ledger

| # | Claim in the script | Label | Source | Caveat |
| --- | --- | --- | --- | --- |
| 0 | In 1953 the mosque was being built (cornerstone 11 Jan 1949, completed 1954, dedicated by Eisenhower 28 June 1957) | Historical record | Wikipedia "Islamic Center of Washington" (opened 2026-11-08); 1954 UPI photo caption "nearing completion" | Script says "ban rahi hai", never "khuli" |
| 1 | 1953, a mosque in Washington built facing north-east; visitors worried because the map shows Mecca to the south-east | Historical record | *Washington Daily News*, 15 Apr 1953, quoted by Abdali p. 3 | The paper says "slightly south" of east; script says south-east, which matches the map line (101°) |
| 2 | Its direction was calculated by Egypt's Ministry of Works in Cairo; 56° | Historical record | Same | — |
| 3 | A flat map stretches the globe; a straight line on it is not the shortest path | Established science | Abdali p. 1–2; standard cartography (Snyder, *Flattening the Earth*) | — |
| 4 | A tight string on a globe from Washington to Mecca first heads north-east | Established science | Our calculation; Abdali | — |
| 5 | This shortest path is the great circle; long flights follow it | Established science | Standard | Name no airline |
| 5a | The Washington–Makkah string crosses the Atlantic and Europe (path points: 49°N 39°W, 48°N 10°W, 44°N 3°E France, 40°N 14°E southern Italy, 34°N 24°E near Crete) | Numerical observation (our calculation, 2026-11-09) | Great-circle interpolation | — |
| 5b | Orange-peel analogy: a sphere's skin cannot be laid flat without tearing or stretching | Established science | Gauss's theorema egregium; any cartography text | — |
| 6 | New York: qibla about 58° (north-east); map line about 101° (south-east of east); about 650 km longer | Numerical observation (our calculation) | Table above | — |
| 7 | From Alaska the qibla is almost due north | Numerical observation | Our calculation; Abdali (Anchorage 9° W of N) | — |
| 8 | Muslim astronomers worked out the exact qibla with spherical trigonometry from the 9th–10th centuries; al-Biruni wrote a treatise on it | Historical record | Wikipedia "Qibla" (King 1996 p. 147); Abdali ("twelve centuries") | "Over a thousand years ago" is safe; early mosques still varied in direction |
| 9 | In 1993 two authors argued the qibla in America is south-east | Historical record | Abdali's reference [21] | Their book itself not opened |
| 10 | Most North American Muslims follow north-east today; some mosques still face south-east | Historical record | Wikipedia "Qibla" (Bilici 2012 p. 57) | — |
| 11 | Most scholars hold that for someone far away, facing the general direction is enough | Scholarly view (fiqh) | Wikipedia "Qibla" (King 1996 p. 134; Bashori 2015) | Shafi'i reports favour the exact Kaaba (ayn) with best judgement. **Scholar check before posting.** Script gives no ruling and tells viewers to ask their scholar |
| 12 | Twice a year (27–28 May, 15–16 July) the sun is over the Kaaba at about 2:47 and 2:56 pm India time; face the sun / the stick's shadow points away from the qibla | Established science + numerical observation | Our calculation; Abdali p. 21 (al-Tusi) | Times drift by a minute or so; say "lagbhag" |

Hadith lead not used in the script: "Between the east and the west is a qibla" (Tirmidhi
342, 344). Tirmidhi grades 344 hasan sahih; sunnah.com refused our fetch, so the grading
was seen only on secondary sites. Not on screen unless confirmed on sunnah.com.

## Risks

- Fiqh: the reel shows geometry and history, not a ruling. Line 11 needs a scholar's
  check. Never say anyone's prayers are invalid; the 1993 book did say that about others,
  and we do not repeat it.
- Do not mock the south-east side (series rule: no sneer).
- Visuals: real photos of the Islamic Center of Washington (Wikimedia, licence per file);
  maps and globes we build ourselves; no AI "historical" scenes.

## Freshness

Web search 2026-11-08: English fatwa pages and papers; no Hindi video found. YouTube view
counts not checked yet.
