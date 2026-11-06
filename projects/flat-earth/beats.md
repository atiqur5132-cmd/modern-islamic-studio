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

## Beats

| # | Time (est.) | Line (short) | Pick | Layout | What happens | On-screen English | Tag | Sound |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 0.0–2.7 | Zameen *flat* hai… | A | Full-screen graphic, speaker off | 0.0: the Gleason 1892 flat-earth map fills the frame, already pushing in. 0.8: "FLAT?" slams on. 1.4: a viral post slides over it. | FLAT? / "It's in the Quran" | VIRAL CLAIM | Impact on frame 0, paper whoosh at 1.4 |
| 2 | 2.7–6.7 | Jawab milta hai… *anda*… | A | Full-screen graphic, speaker off | 2.7: hard cut to a second post with an ostrich egg photo. 4.2: the egg and the globe snap side by side. 5.5: a "?" stamp lands on each. | "No, the Quran said EGG" | VIRAL CLAIM | Whip on the cut, pop on the egg, two ticks on the stamps |
| 3 | 6.7–9.7 | Maine dono check kiye… | A | Speaker full screen (first appearance) | The creator appears at the sentence break. Both posts shrink to small cards on either side. At "galat", each gets a FALSE stamp. | FLAT? FALSE / EGG? FALSE | VERDICT | Two stamp hits |
| 4 | 9.7–13.3 | Pehle flat wala… "sutihat" | A | Full-screen Ayah card | Torn card with 88:20 (fetched) and an orange tag. Push-in to سُطِحَتْ, ringed by hand. | Al-Ghashiyah 88:20 · sutihat | QURANIC TEXT | Paper rustle, pen scratch |
| 5 | 13.3–15.5 | Matlab, *bichha dena*… | A | Full-screen B-roll | A chadar flicked out, settling flat on a bed. | sutihat = spread out, laid flat | LINGUISTICS | Cloth whoosh |
| 6 | 15.5–18.8 | Par baat kis cheez ki… | A | Speaker full screen, punch-in | Punch-in on "kis cheez ki". On "peeche padho", the card slides up and reveals 88:17–19. | WHAT CONTEXT? | QURANIC CONTEXT | Page turn |
| 7 | 18.8–22.7 | Quran poochta hai… oont… | B | Top/bottom split | Top: the speaker asks. Bottom: real photos cut on each word: camel, sky, mountains. | Do they not look at… camels · sky · mountains | TRANSLATION (paraphrase) | A cut on each word |
| 8 | 22.7–25.2 | Aur zameen ko… *bichhayi* | A | Full-screen, fourth strip | The 88:17–20 strips sit stacked. The 88:20 strip lands last over a photo of desert ground. The word is ringed again. | …and the earth, how it was spread out | TRANSLATION (paraphrase) | Tick, soft hit on the ring |
| 9 | 25.2–30.0 | Socho, registan mein… | A | Full-screen B-roll | Wide desert footage with a small camel rider. Labels land on what he sees: CAMEL, SKY, MOUNTAINS, GROUND. | What he sees | QURANIC CONTEXT | Wind bed, label ticks |
| 10 | 30.0–34.2 | Baat uske pairon ke neeche… | A | Full-screen, tilt down | Tilt from the rider down to the sand at his feet. A tiny globe appears with PLANET SHAPE crossed out. | The ground under his feet, not the planet's shape | QURANIC CONTEXT | Tilt whoosh, cross-out scratch |
| 11 | 34.2–39.4 | Lekin main honest rahunga… Jalalayn | B | Speaker full screen, close | Tight framing, no graphics on "honest rahunga". At "Jalalayn", a small parchment card appears with the quote and dates. | Tafsir al-Jalalayn on 88:20 (al-Mahalli, d. 1459 CE / 864 AH): "the earth is flat" | SCHOLARLY VIEW | Silence, then soft paper |
| 12 | 39.4–45.2 | Par Imam Razi ne… *flat*… | A | Full-screen 3D diagram | A huge ball with a tiny figure on it. The camera drops to his eye level and the curve turns into a flat line. Parchment caption. | "A very large ball looks flat in every part": al-Razi on 88:20 (d. 1210 CE / 606 AH) | SCHOLARLY VIEW | Swoop down |
| 13 | 45.2–49.7 | Tum abhi jahan khade ho… | A | Speaker, then B-roll | "Tum jahan khade ho": phone-height footage of a flat road to the horizon. "Phir bhi gol hai": the Blue Marble globe from the hook, round. | Looks flat. Still round. | ESTABLISHED SCIENCE | Breath, clean hit on "gol" |
| — | 49.7–52.2 | Mid-video CTA | | Speaker full screen | Instagram and Facebook Follow animation with the real icons, clear of the right rail and the face. | Follow for more viral claim checks | | Pop |
| 14 | 49.7–53.6 | Ab ande wala claim… "dahaha" | B | Top/bottom split | Hard wipe from the flat half. Top: the 79:30 card (fetched) with دَحَىٰهَآ ringed. Bottom: the egg post from the hook returns. | An-Nazi'at 79:30 · dahaha | QURANIC TEXT | Wipe, pen scratch |
| 15 | 53.6–58.2 | Kehte hain… *phailana* | A | Full-screen | The ostrich egg photo labelled EGG. On "dictionary mein", a page of Lane's Lexicon slides over. EGG is struck through and SPREAD OUT is written beside it. | dahaha = spread out (not egg) | LINGUISTICS | Strike-through scratch |
| 16 | 58.2–61.5 | Shutur-murg se rishta hai… *nest* | B | Circle PiP over the nest photo | A real ostrich nest scrape with eggs in it. NEST lands on the scrape and EGG fades. The speaker's reaction stays in the circle. | Not the egg. The nest. | LINGUISTICS | Sand scrape |
| 17 | 61.5–65.5 | Wo ret phaila ke nest banata hai… | A | Full-screen B-roll | An ostrich scraping sand with its feet. | udhiyy (أُدْحِيّ): the nest it spreads out (Lane's Lexicon; Qurtubi on 79:30) | LINGUISTICS | Scrape loop |
| 18 | 65.5–69.1 | Toh ek ne… flat… Doosre ne anda | A | Full-screen, both posts | Both hook posts return side by side. The flat map and the egg peel out of the verse card like stickers, and both get the same stamp. | Flat: READ INTO IT · Egg: READ INTO IT | VERDICT | Two stamp hits, the same sounds as line 3 |
| 19 | 69.1–73.6 (held 2 s+) | Aur verse bas itna keh raha tha… | A | Full-screen Ayah card, held | Back to the clean 88:20 card with the word ringed, held still. | "…and the earth, how it was spread out" (88:20) | QURANIC TEXT | Music out, room tone |
| 20 | 73.6–76.4 | Aise aur viral claims… follow | A | Speaker + CTA animation | Follow animation (Instagram, Facebook) plus the comment icon and the question. | Follow for more viral claim checks · Which viral claim should we check next? | | Pop |

Changes from the plan options, made while writing this:
- Line 2 gets a third beat at 5.5 s (the "?" stamps), so the hook changes at least every 1.5 s.
- Line 11's card quotes Jalalayn in English, with the Arabic source in `research.md`.

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

## Assets to source (licence checked per file before use; each goes into `credits.txt`)

| Asset | Lines | Planned source | Licence status |
| --- | --- | --- | --- |
| Flat-earth map, Orlando Ferguson 1893 or Gleason 1892 | 1, 18 | Wikimedia Commons or Library of Congress scan | Probably public domain (pre-1929); check the file page |
| Earth from space (Blue Marble) | 2, 13 | NASA image library | NASA media are generally not copyrighted; check the guidelines and avoid any NASA logo |
| Ostrich egg photo | 2, 15 | Wikimedia Commons | To find and check |
| Ostrich nest scrape with eggs | 16 | Wikimedia Commons | To find and check |
| Ostrich scraping sand (video) | 17 | Pexels or Pixabay, or Wikimedia | To find and check; if nothing usable, use the line 17 option B card |
| Chadar flicked onto a bed (video) | 5 | Pexels, or the creator shoots it at home (2 s) | Creator's own footage is the safest |
| Camel, sky, mountains photos; desert with a camel rider (video) | 7, 9, 10 | Pexels or Pixabay | To find and check |
| Flat road or field to the horizon, phone height | 13 | Creator shoots it (5 s) | Own footage |
| Lane's Lexicon page for أُدْحِيّ | 15 | 1863–93 scan (archive.org) | Public domain by age; check the scan's terms |
| Tafsir al-Jalalayn manuscript or print page | 11 (optional) | Wikimedia, or skip for a plain parchment card | If not found, the parchment card alone |
| 3D ball with figure | 12 | Built in Remotion / three.js | Own |
| Instagram, Facebook, comment icons | CTA | Official brand resources, unaltered | Check the brand rules (see logos-sourcing) |

## Quranic words on screen

Never typed. Each word below is the last word of an Ayah file fetched and cross-checked by
`scripts/fetch_ayah.py`:
- سُطِحَتْ = 88:20, last word.
- دَحَىٰهَآ = 79:30, last word.
- The 88:17–20 strips use the full fetched text.

أُدْحِيّ is not Quranic; its source is Lane's Lexicon.

## Still to do before building

- The creator records the take (QUALITY §0: eyes at y ≈ 640). Two extra shots would help:
  - the chadar flick (line 5);
  - a flat road to the horizon at phone height (line 13).
- Source the assets above and write `credits.txt`.
- Re-time this table to the take after `auto_edit.py` and `make_captions.py`.
