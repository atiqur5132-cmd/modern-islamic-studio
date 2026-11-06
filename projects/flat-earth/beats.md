# Beats: "Quran mein zameen flat?"

Series A, Viral Claim Check. Written 2026-11-06. The creator asked Claude to choose, so
these are Claude's picks from `plan_options.json` (options are lettered as in `plan.html`).
Times are estimates from the script at 3.3 words/s. After the shoot they are re-timed to the
take, and every layout change moves onto a real cut or sentence break.

## Why these picks

- **The speaker has to keep coming back.** If every line took option A, the creator would be
  off screen from about 18 s to 45 s. So line 7 is a split, line 11 (the honest beat) is the
  speaker close up, and line 15 is a circle. The longest stretch without the speaker is
  now about 15 s (lines 8–10).
- **Layouts across the reel:** full-screen graphic (hook), speaker full screen, Ayah card,
  top/bottom split, full-screen B-roll, circle PiP, headroom card. Seven kinds, each with a
  reason.
- **Callbacks:**
  - The hook's two viral posts return in the payoff (line 18).
  - The globe from the hook returns at "Phir bhi gol hai" (line 13).
  - The 88:20 card returns for the last line (line 19).
- **The 88:20 card is a real asset, not a decoration.** The reel stands on one word, so the
  Ayah card with the ringed word is the visual spine. It looks like Towards Eternity, the
  closest reference in `references/LIBRARY.md`.

## Look

The reel looks like a field check on paper with a red marker. QUALITY §5 asks for the look to be
written down as numbers before building:

| Role | Value |
| --- | --- |
| Ground | sand paper #EFE4CF |
| Ink | #1B1B1B |
| Muted | #6E665C |
| Accent | marker orange #E4572E. It carries one meaning only: it marks a word being checked or a verdict (the ring on a word, the FALSE / READ INTO IT stamps, the Surah:Ayah tag). |
| Words | Inter Tight 800/900 |
| Transliterated Arabic (sutihat, dahaha, udhiyy) | Fraunces italic |
| Arabic | Amiri Quran |
| Hook | real photos as B&W cut-outs on the paper ground. No dark void, no glow. |

## Captions

- Same system as Yawm 365. Sentence case, 76 px, white with a 9 px ink edge, 2–4 words per
  group, and the spoken word wiped onto an ink tab.
- The reel's Arabic terms show in Fraunces italic.
- Bracketed Arabic in `script.txt` never becomes a caption (`make_captions.py` drops it).
- Captions move with the layout: band foot at y 1310 by default. In the split (line 7) they
  ride up with the speaker window, and in the circle (line 15) they sit clear of the circle.
- No caption covers an Ayah card's Arabic. On the card beats, the caption band drops below
  the card.

## Beats (re-timed to the take, 2026-11-07)

Times are on the take (`public/footage/flat-earth.mp4`, 74.4 s). `auto_edit.py` found no
pause over 0.5 s, so source time is output time. Every layout change sits on one of the
creator's own cuts (FFmpeg scene score > 0.07) or on a sentence break; the build is
`build_edit.py`. The spoken line is the take's wording (see "The take against the script").

| # | Time | Line (as spoken, short) | Layout | Built | Tag |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.00–2.30 | Zameen *flat* hai… | Full-screen graphic, speaker off | 0.0 Ferguson disc pushing in under "FLAT EARTH?"; 0.5 ("flat") the map jumps closer; 1.3 ("Quran") the post "The Quran says the earth is flat!" slides up | VIRAL CLAIM |
| 2 | 2.30–5.77 | Jawab milta hai… *ande* jaisa… | Full-screen graphic, speaker off | 2.3 hard cut: post "No bro, the Quran calls the earth an EGG!" + the egg; 3.6 egg and globe snap side by side (EGG / EARTH); 4.82 ("ande") a "?" stamp on each | (post) |
| 3 | 5.77–9.00 | Maine dono ko check kiya… galat nikle | Speaker full screen (first appearance, creator's cut) | FLAT? and EGG? cards land beside the head; 8.46 ("galat") FALSE stamps | — |
| 4 | 9.00–13.33 | Pehle flat wala… "sutihat" | Full-screen Ayah card | 88:20 card (fetched), Al-Ghashiyah 88:20 tag; 12.62 سُطِحَتْ ringed, *sutihat* label, push-in | QURANIC TEXT |
| 5 | 13.33–15.50 | Matlab *bichha dena*… chadar | Full-screen B-roll | Sheet flicked onto a bed (Pexels 7641639); 13.72 *sutihat* = spread out, laid flat | LINGUISTICS |
| 6 | 15.50–18.50 | Par baat kis cheez ki ho rahi thi? Thoda peeche padho | Speaker full screen, punch-in | 17.5 camera punch to 1.14 on "Thoda peeche padho" | — |
| 7 | 18.50–22.80 | Quran poochta hai… oont… aasmaan… pahadon | Top/bottom split (stack) | Speaker top; board "Do they not look at…", photos cut on 20.08 camels, 21.12 sky, 22.14 mountains | TRANSLATION (PARAPHRASE) |
| 8 | 22.80–24.87 | Aur zameen ko… *bichhayi* gayi | Full-screen card over sand | 88:17–19 strips, 23.3 the 88:20 strip, 23.64 translation, 24.2 سُطِحَتْ ringed | QURANIC TEXT |
| 9 | 24.87–29.13 | Socho, registan mein… chaar cheezein | Full-screen B-roll | POV from a camel (Pexels 38114878): "What a rider in the desert sees"; CAMEL 26.42, SKY 27.62, HORIZON 27.95, GROUND 28.3 | QURANIC CONTEXT |
| 10 | 29.13–33.00 | Baat uske pairon ke neeche… shape ki nahi | Full-screen B-roll, coded tilt | Same clip, tilt from horizon to sand (29.3–30.8); "The ground under his feet"; 31.86 PLANET SHAPE chip, struck at 32.68 | QURANIC CONTEXT |
| 11 | 33.00–37.47 | Lekin main honest rahunga… flat hi samajh rahe the | Speaker alone: close (1.14), then wider (1.0) at 34.46 | No card, no name on screen: the creator chose not to name a book or scholar here (2026-11-07). The spoken line carries the honesty beat | — |
| 12 | 37.47–42.87 | Par Imam Razi ne… har chhota hissa *flat*… | Full-screen diagram | 38.0 Razi's words; 40.28 ("ball") the view drops to the tiny man's eye level; 41.1 the curve is a flat line, LOOKS FLAT | SCHOLARLY VIEW |
| 13 | 42.87–47.33 | Tum abhi jahan pe khade ho… phir bhi gol hai | Speaker, then B-roll | 44.88 road to the horizon, "Looks flat."; 46.5 ("phir bhi gol") hard cut to the Blue Marble, "Still round." | ESTABLISHED SCIENCE |
| CTA | 47.36–49.90 | Ab ande wala claim… | Speaker full screen + follow card | Mid-video Follow card on the chest (y 1030), clear of the face and the rail; the camera keeps its punch-ins | — |
| 14 | 49.90–52.12 | …ayat number 30 pe ek word hai, "dahaha" | Top/bottom split (stack) | 79:30 card (fetched), An-Nazi'at 79:30; 51.42 دَحَىٰهَآ ringed, *dahaha* | QURANIC TEXT |
| 15 | 52.12–55.90 | Kehte hain… anda. Par iska matlab bhi hai *phailana* | Full-screen graphic | The egg under EGG; 54.22 lexicon card *dahaha* = spread out (Qurtubi, Lane); 55.32 EGG struck, SPREAD OUT | LINGUISTICS |
| 16 | 55.90–59.40 | Shutur-murg se rishta hai… *nest* ka | Circle PiP over the nest photo | Nest scrape (Pexels 25650573); EGG fades, 58.7 NEST lands, "Not the egg. The nest." | LINGUISTICS |
| 17 | 59.40–63.17 | Wo ret phaila ke nest banata hai… doosra word hai | Full-screen photo, slow push | Ostrich at its nest (Pexels 39194976); 60.4 NEST; 61.88 *udhiyy* أُدْحِيّ = the nest it spreads out | LINGUISTICS |
| 18 | 63.17–66.70 | Toh ek ne… flat zameen… doosre ne anda | Top/bottom split (stack) | The two posts return under the speaker; READ INTO IT stamps at 64.36 ("flat") and 66.26 ("anda") | VERDICT |
| 19 | 66.70–71.17 | Aur verse sirf itna keh raha hai… *bichhayi* gayi | Full-screen Ayah card, held 4.5 s | The clean 88:20 card; 69.3 translation; 70.44 سُطِحَتْ ringed | QURANIC TEXT |
| 20 | 71.17–74.37 | Aise aur videos ke liye follow kar lo… share bhi kar dena | Speaker + end cards | Follow card in the caption band (captions stop) and the comment card in the headroom: "Which viral claim should we check next?" | — |

Changed from the plan while building:
- Line 11 has no card: the take does not name Jalalayn, and the creator chose not to name
  a book or scholar on screen for it (2026-11-07). The source stays in research.md.
- The take never says "udhiyy" (line 17), so the card shows it as the "other word" the
  creator mentions.
- The hook's frame 0 carries the line ("FLAT EARTH?"); the "?" stamps land on "ande" (4.82),
  and the egg/globe snap was pulled to 3.6 so no hook gap passes 1.5 s.
- Line 14 is a stack (speaker on top) instead of a split of two graphics, and line 18 too,
  so the speaker is never off screen for more than about 10 s.
- The mid-video CTA sits on the chest during "Ab ande wala claim" (the only 2.5 s speaker
  stretch after line 13 before the egg half), not in the headroom.
- The SKY photo on line 7 is a frame of the POV clip (Pexels 38114878).

Changes from the plan options, made while writing this:
- Line 2 gets a third beat at 5.5 s (the "?" stamps), so the hook changes at least every 1.5 s.
- (Superseded 2026-11-07) Line 11 was to carry a Jalalayn card; the creator removed it.

## Hook check on paper (QUALITY §1; a final check is still needed on the render)

| Gate | Plan | Status |
| --- | --- | --- |
| Opens on full-screen visuals; creator after, at a sentence break | Map and posts until 6.7 s; creator at the "Maine dono…" break | Planned |
| Frame 0 = thumbnail, readable at 270 px | Big map with "FLAT?" over it. The map must be cropped to fill at least 40% with strong contrast; check `frame0_270.jpg` | To check on render |
| Change at least every 1.5 s to 6 s, 4+ beats | 0.0 map · 0.8 FLAT? · 1.4 post · 2.7 egg cut · 4.2 snap · 5.5 stamps = 6 beats; longest gap 1.5 s (2.7→4.2) | Planned, tight at 2.7→4.2 |
| Key word inside 1.5 s | "flat" is the second spoken word (about 0.4 s) and on screen at 0.8 s | Planned |
| Opens a gap | "Quran mein likha hai" → "Dono hi galat nikle" | Planned |
| Sound at frame 0 | Impact on frame 0 under the voice | Planned |
| Muted test, first 3 s | Flat map + FLAT? + "It's in the Quran" post | Planned |

## Assets (sourced 2026-11-06; every file opened and looked at; all in `work/flat-earth/stock/`, never committed)

| Asset | Lines | Chosen file | Licence (checked) |
| --- | --- | --- | --- |
| Flat-earth map | 1, 18 | Orlando Ferguson, "Map of the Square and Stationary Earth" (1893), Library of Congress 2011594831, via Wikimedia Commons (2400 px copy). **Crop to the central square-earth plate only**: the title strip and bottom text quote the Bible against the globe, and showing that text in a Quran reel would read as a jab at another faith | Public domain (Commons file page and LOC) |
| Earth from space | 2, 13 | "The Blue Marble", Apollo 17, AS17-148-22727, via Wikimedia Commons (2400 px) | Public domain (NASA) |
| Ostrich egg | 2, 15 | Pexels photo 33128657 "Cluster of ostrich eggs in natural nest" (one egg cropped out for the EGG post) | Pexels License |
| Ostrich nest scrape in sand | 16 | Pexels photo 25650573 "Ostrich eggs in South African sand": four eggs in a shallow scrape with footprints | Pexels License |
| Ostrich at its sand nest | 17 | Pexels photo 39194976 "Ostrich nesting with eggs in natural habitat", with a slow push-in. No clip of an ostrich scraping sand was found; two ostrich clips were checked (13798612 zoo, 13848092 farm) and neither showed it | Pexels License |
| Chadar flicked onto a bed | 5 | Pexels video 7641639 "A man making bed", source 5.8–8.0 s | Pexels License |
| Camel, sky, mountains (three photos) | 7 | Camel: a frame from Pexels video 32018898 "Camel ride in expansive desert landscape" (side view, one camel). Sky: a frame from 38114878. Mountains: Pexels photo 28322811 "Sunlit rocky mountains in Sinai at dusk" | Pexels License |
| A camel rider's view of the desert | 9, 10 | Pexels video 38114878 "Desert camel ride in vast dunes" (2160×3840, 16 s, first-person) | Pexels License |
| Flat road to the horizon | 13 | Pexels video 37180549 "Desert road at sunset with dramatic skies" | Pexels License |
| Lane's Lexicon page | 15 | Not used as a scan. A typeset lexicon card instead, citing "Lane, Arabic-English Lexicon" and Qurtubi on 79:30. A scan page hunt costs time for a 1 s beat | n/a |
| Tafsir al-Jalalayn page | 11 | Not used. Line 11 is the speaker alone (no card, by the creator's choice) | n/a |
| 3D ball with figure, Ayah cards, stamps, labels | 4, 6–8, 12, 14, 18, 19 | Built in code | Own |
| Instagram, Facebook, comment icons | CTA | Official brand resources, unaltered, at build time (logos-sourcing rules) | To check at build |

Rejected after looking: Pexels 6863732 and 9786192 (no settling sheet), 30783918 (guide's face covered by a sticker), 34987131 (riders too small), 3415827 (camels framed by a blurred wall). Two road clips (40065895, 40792620) were kept as backups for line 13.
The Commons ostrich photos are all CC BY-SA. ShareAlike could bind the whole video, so they were passed over for Pexels.

## Quranic words on screen

Never typed. Each word below is the last word of an Ayah file fetched and cross-checked by
`scripts/fetch_ayah.py`:
- سُطِحَتْ = 88:20, last word.
- دَحَىٰهَآ = 79:30, last word.
- The 88:17–20 strips use the full fetched text.

أُدْحِيّ is not Quranic; its source is Lane's Lexicon.

## Still to do before building

- The creator records the take (QUALITY §0: eyes at y ≈ 640). No extra B-roll is shot
  (creator's decision, 2026-11-06): all B-roll is free-licence stock or built in code.
- Built in code, not stock: the 3D ball (line 12), the globe flattening (hook option B, if
  used), the Ayah strips and cards, the stamps and labels. A coded "realistic" cloth or
  landscape would look fake next to real footage, so real-world moments stay stock.
- Source the assets above and write `credits.txt`.
- Re-time this table to the take after `auto_edit.py` and `make_captions.py`.
