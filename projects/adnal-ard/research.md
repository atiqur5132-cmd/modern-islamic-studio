# Research: "Duniya ki sabse neechi zameen, Quran mein?" (30:3, *adna al-ard*)

Series A, Viral Claim Check. Faceless reel: the creator records the voiceover only; maps
and terrain carry the picture. Researched 2026-11-13. The creator reads this before the
script.

## The one idea

*Adna* can mean "lower", but the people who explained the verse read it as "nearest", and
the city the Romans lost sits on a mountain, not in the Dead Sea basin. The verse's own
claim is the next line: they will win again.

## The claim we check

Posts and articles say Quran 30:3 *fi adna al-ard* means "in the lowest land on earth",
that the Roman defeat happened by the Dead Sea, and that nobody could have known in the 7th
century that it is the lowest land. Example: islamreligion.com, "The Victory of the Romans
and the Lowest Point on Earth" (Sherif Alkassimi, 2008, opened 2026-11-13). It quotes the
translation "in the lowest land", cites no tafsir, and gives the Dead Sea as "around 400
meters" below sea level in the text and 394 m in a photo caption.

## The Ayahs (fetched by `scripts/fetch_ayah.py`, cross-checked, 2026-11-13)

Arabic is in `src/data/quran/30-2.json`, `30-3.json`, `30-4.json`. Never retype it. English
is Sahih International (api.quran.com translation 20, fetched 2026-11-13).

| Key | Sahih International |
| --- | --- |
| 30:2 | "The Byzantines have been defeated" |
| 30:3 | "In the nearest land. But they, after their defeat, will overcome" |
| 30:4 | "Within three to nine years. To Allāh belongs the command before and after. And that day the believers will rejoice" |

2:61 and 7:169 (used only as examples of the word, not shown as Ayah cards unless fetched):
Sahih International gives "what is less" (2:61) and "this lower life" (7:169).

## The word *adnā* (أَدْنَى), root د ن و

Quranic Arabic Corpus, root d-n-w (corpus.quran.com/qurandictionary.jsp?q=dnw, opened
2026-11-13): the root occurs 133 times; the form *adnā* 12 times. Corpus glosses:

| Verse | Gloss |
| --- | --- |
| 2:61 | "(is) inferior" |
| 2:282 | "and nearer" |
| 4:3 | "(is) more appropriate" |
| 5:108 | "(is) closer" |
| 7:169 | "the lower (life)" |
| 30:3 | "(the) nearest" |
| 32:21 | "the nearer" |
| 33:51, 33:59 | "(is) more suitable" |
| 53:9 | "nearer" |
| 58:7 | "less" |
| 73:20 | "(a little) less" |

So: mostly "near / nearer", sometimes "less / lower / inferior". Reading "lower" is within
the word's range; it is not absurd. The corpus lists no separate root d-n-hamza. *Dunya*
(this world) is from the same root; parked, one idea per reel.

## Tafsir

| Source | What it says about *adna al-ard* | Read how |
| --- | --- | --- |
| al-Tabari | "من أرض الشام إلى أرض فارس": from the land of al-Sham to the land of Fars | quran.com/ar/30:3/tafsirs/ar-tafsir-al-tabari, opened 2026-11-13 (short entry, no isnad shown) |
| al-Jalalayn | "the Byzantine land that lies nearest to Persia in Mesopotamia, al-Jazīra" (tr. Feras Hamza) | altafsir.com, opened 2026-11-13 |
| Ibn Kathir (abridged, English) | Verses revealed about Persia's victory over al-Sham and Roman lands; renders the phrase "in a nearby land"; names no single place | quran.com/30:3/tafsirs/en-tafisr-ibn-kathir, opened 2026-11-13 |

None of the three says "lowest" or the Dead Sea. Wikipedia (Battle of Antioch (613)) says
al-Tabari links it to a battle at Adhri'at in 614; that is not in the short Tabari entry we
read, so the script does not use it. answering-islam.org (a polemical page) also quotes
Ma'ariful Quran and Baidawi for Syria; not opened at source, not used.

## History

| Event | Date | Source (opened 2026-11-13) |
| --- | --- | --- |
| Byzantines defeated outside Antioch | 613 | Wikipedia, Battle of Antioch (613) |
| Damascus falls | 613 | Wikipedia, Byzantine–Sasanian War of 602–628 (from the page summary) |
| Jerusalem taken by the Sasanians, siege of 19–21 days | April–May 614 | Wikipedia, Sasanian conquest of Jerusalem |
| Heraclius begins his counter-offensive | 622 | Wikipedia, Byzantine–Sasanian War of 602–628 (from the page summary) |
| Byzantine victory near Nineveh; Persia sues for peace, lost lands returned | 12 December 627 | Wikipedia, Battle of Nineveh (627) |

Before the final script: confirm 613/614/622/627 in a scholarly book (Kaegi, *Heraclius,
Emperor of Byzantium*, 2003) and add the AH years where they fall after the Hijra
(622 CE = 1 AH; 627 CE = 6 AH).

## Geography, measured by us

Elevation data: AWS Terrain Tiles (Terrarium; SRTM and other public-domain DEMs), fetched
with `scripts/fetch_terrain.py jerusalem-deadsea` (box 31.3–32.2 N, 34.45–35.95 E, 512 grid,
about 280 m per cell). Working below; the script sits in the session log and can be re-run.

| Figure | Our measurement | Published | Use in script |
| --- | --- | --- | --- |
| Haram al-Sharif (Dome of the Rock, 31.7780 N, 35.2354 E) | 733 m | Jerusalem 754 m, Old City about 760 m (Wikipedia, from the page summary, not verbatim) | "lagbhag 750 meter upar" |
| Dead Sea surface | DEM shows about −390 to −402 m (SRTM era, about 2000) | −439.78 m in 2025 (Wikipedia, Dead Sea, infobox, verbatim); "its shores the lowest land-based elevation on Earth" | "lagbhag 440 meter neeche" |
| Haram to nearest Dead Sea cell below −400 m (31.705 N, 35.451 E) | 21.9 km, great-circle | — | "lagbhag 22 kilometre" |
| Height difference | 733 + 440 = 1,173 m | — | "gyarah sau meter se zyada" |
| Haram to Mediterranean (nearest sea cell) | 53.3 km | — | not used |

Caveat: the shoreline has moved east as the lake shrinks, so today's distance is a little
more than the DEM's; "lagbhag 22" stays honest. Any 3D height exaggeration on screen must
be labelled `HEIGHT EXAGGERATED ×N`.

## Claim ledger

| # | Claim in script | Label | Source | Caveat |
| --- | --- | --- | --- | --- |
| 1 | Posts say 30:3 means the lowest land, the Dead Sea | viral claim (reported) | islamreligion.com article | Do not name or mock people who share it |
| 2 | The Dead Sea is about 440 m below sea level; its shore is the lowest land on Earth | established science | Wikipedia, Dead Sea (2025) | Level falls about 1 m a year (Ynetnews, Jordan Times, search snippets only; not used on screen) |
| 3 | *Adna* comes 12 times; mostly "near", sometimes "less/lower" | linguistic observation | Quranic Arabic Corpus | Corpus glosses are one team's translation |
| 4 | "Lower land" is a possible reading of the word | linguistic observation | as 3 | Possible is not the same as intended |
| 5 | Tabari: from al-Sham to Fars; Jalalayn: the Roman land nearest Persia | Quranic context (tafsir) | quran.com, altafsir.com | We read three tafsir only; say "jo tafsir humne dekhi" |
| 6 | Jerusalem fell to the Persians in 614 | historical record | Wikipedia; confirm in Kaegi | Antioch 613 and Damascus 613 also fit "defeated"; scholars differ on which defeat is meant |
| 7 | Jerusalem stands about 750 m up; the Dead Sea about 22 km away and over 1,100 m lower | established science (our measurement) | DEM working above | Rounded |
| 8 | The claim holds only if adna = lower AND the defeat was at the Dead Sea; neither is in the tafsir we read | interpretation (our verdict) | rows 3–6 | Stamp `HOLDS ONLY IF…` |
| 9 | 30:3–4: they will overcome within three to nine years | Quranic context | Sahih International | — |
| 10 | Heraclius turned on Persia from 622 and won near Nineveh in 627 | historical record | Wikipedia; confirm in Kaegi | How the 3–9 years are counted (from which defeat, to which victory) is a scholarly discussion; the script does not claim a precise fit |

## Freshness (2026-11-13, web search only)

English apologetic pages push the claim (islamreligion.com, quranproject.org,
knowingallah.com); critics answer it in English (answering-islam.org, WikiIslam sandbox,
which returned 403). No honest Hindi check found; YouTube not searched yet. Scores:
Curiosity 5, Sources 4, Visuals 5, Freshness 3, Honesty 5.

## Risks

- Must not sound like "the Quran is wrong": the verdict is about the post's reading, and
  the verse's own claim (row 9–10) closes the reel.
- Al-Aqsa and Jerusalem draw political comments; keep every frame on 614 CE geography, no
  present-day borders or flags. Pin a comment that the reel is about geography and tafsir.
- No depiction of people: armies shown as map arrows only; any 614 Jerusalem image is
  tagged `RECONSTRUCTION`.
- Faceless voiceover: record each line as one clean take; Claude cuts and the creator
  approves the cut voice before visuals are built.
