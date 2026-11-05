# Beats: "Yawm 365 baar?"

Built 2026-11-06 by `build_edit.py` (writes `edit.json`). Times are source seconds from the
recorded take; the creator's own jump cuts (FFmpeg scene score > 0.07) are the shot
boundaries, and every layout change sits on one of them.

## Look

A ledger being counted. Ground paper #F4EFE6 (the creator's white wall reads as the same
page), ink #1B1B1B, muted #6E665C, ruled lines #EAE2D4, one accent #D9480F that only ever
marks the running count (counter, the 365/354 numbers, numbers in captions). Words: Inter
Tight 800/900. Numbers: IBM Plex Mono 700 (tabular). Transliterated Arabic terms: Fraunces
italic. Arabic: Amiri Quran. Grade: contrast 1.04, saturation 1.03, ink vignette 0.12.
Code: `src/overlays/yawm/`.

## Captions ("ledger" style)

Sentence case, 76 px, white with a 9 px ink edge, 2–4 words a group. The spoken word is
wiped onto an ink tab in 3 frames (a number onto a count-coloured tab). Three roles by fixed
rules: words in Inter Tight; any number in Plex Mono in the count colour; the reel's Arabic
terms (yawm, ayyam, yawmayn, yawma'idhin, yawmukum, yawmuhum) in Fraunces italic. Default
band foot at y 1310; in the stack layout the captions ride up with the speaker's window
(foot at y 798). Spelling from `script.txt`, timing from Whisper.

## Quranic words on screen

Never typed: each is word N (Quranic Arabic Corpus numbering) of an Ayah fetched and
cross-checked by `scripts/fetch_ayah.py`: يوم = 1:4 word 2 (bare letters, marks removed by
code), أَيَّامٍ = 2:203 w4, يَوْمَيْنِ = 2:203 w9, يَوْمَئِذٍ = 99:4 w1, يَوْمِكُمْ = 32:14 w5,
يَوْمَهُمُ = 43:83 w6.

## Shots and graphics

| Source time | Line (as spoken) | Layout | Graphic and on-screen English | Claim tag | Sound |
| --- | --- | --- | --- | --- | --- |
| 0.03–5.43 | Quran mein "din" ka lafz poore 365 baar… utne hi. | Full-screen graphic, speaker off | Frame 0: يوم, "365", "‘DAY’ = 365 TIMES?". At 3.6 the word gives way to a 12-month calendar (2026 weekdays) filling day by day; "365 DAYS IN A YEAR" | VIRAL CLAIM | 3 soft ticks on the fill |
| 5.43–9.57 | Aise posts aur reels… wah! | Speaker (camera holds the full frame), headroom | Three made-up posts (no platform, no account) land at 5.8 / 6.5 / 7.6 with line icons (heart, comment, share); on "wah!" (9.2) they jump, hearts fill, a burst goes off | — | Soft whoosh per post, light impact on the burst |
| 9.57–13.53 | Phir maine khud gina… ek-ek lafz maine gina. | Full-screen paper, speaker in circle | "Every word, counted": the Quran as 114 bars (one per surah, square-root of its words), a scan line crossing it, an orange dot at each of the 475 places the root occurs; words checked 0 → 77,429; source line | NUMERICAL OBSERVATION | Whoosh in/out, low riser |
| 13.53–15.33 | Dekho kya hua, main samjhata hoon. | Speaker, zoom 1.12 | — | — | — |
| 15.33–17.33 | Arabic mein din ko bolte hain yawm. | Speaker, headroom card | Card: يوم, "= day" (16.0), "yawm" (16.9) | — | Soft tick |
| 17.33–43.57 | Yawm ki saari shakalein jodo… Ab ginti aati hai… 365. | Stack: speaker top 820 px, board below; zooms alternate per cut | 475 dots (one per occurrence, in the Quran's order) appear as the count climbs to 475 (19.7). Each form's dots turn to rings when it is named — ayyam −27 (23.8), yawmayn −3 (26.2), yawma'idhin −70 (31.4), yawmukum/yawmuhum −10 (36.4/37.3; "your day" 39.2, "their day" 40.7) — and fall out of the grid, leaving ghost rings, when the count drops: 445 (30.2), 375 (35.0), 365 (42.6). At 365 the remaining 365 dots light up orange and the count is underlined. Chips under the grid name each form, struck through as it goes | NUMERICAL OBSERVATION; source "Quranic Arabic Corpus + Tanzil" | Whoosh as the board rises, impact on each total, sub-hit on 365, shimmer as the dots light, soft tick per form |
| 43.57–47.57 | Toh haan, 365 aata hai. Par sirf aise ginne par. | Speaker, zoom 1.0 | Mid CTA 44.3–47.3, like + comment: "Which rule is fair: 445 or 365?" | — | CTA tick |
| 47.57–49.00 | Mera ek sawaal hai. | Speaker, zoom 1.1 | — | — | — |
| 49.00–50.90 | "Us din" bhi toh din hi hua na? | Speaker, headroom card | يَوْمَئِذٍ, "Isn’t ‘that day’" (49.1) "still a day?" (50.0), a question mark drops in | — | Soft tick |
| 50.90–53.17 | Thoda alag ginoge, toh number badal jaata hai. | Full-screen paper, speaker in circle | "Change the rule, change the number": a bar per rule (475 / 445 / 375 / 365) against a dashed line "a year: 365 days"; only the last bar, in orange, reaches it | NUMERICAL OBSERVATION | Whoosh in/out |
| 53.17–58.00 | Aur Islamic calendar toh chaand ka hai. Isme saal lagbhag 354 din ka hai. | Full-screen B-roll, speaker off | One lunar month in 4.9 s; "354 days in a Hijri year", "12 lunar months × 29.53 days (NASA)" at 56.6, then a row of 12 small moons; credit "Moon: NASA's Scientific Visualization Studio" | ESTABLISHED SCIENCE | Whoosh in, impact on 354 |
| 58.00–61.97 | Isiliye kai ulama kehte hain ke aisi gintiyon ko mujiza mat banao. | Speaker, headroom card | Book icon, "Selective counts" (58.0) "are not a miracle." (60.9); "Dr. Fahd al-Roomi, Dr. Ashraf Qatanah (IslamQA 69741)" | SCHOLARLY VIEW | Soft tick |
| 61.97–64.60 | Quran ko kisi number game ki zaroorat nahi hai. | Speaker, zoom 1.08 | Last line card "The Quran doesn't need a number game.", held still to the end (about 5 s) | — | — |
| 64.60–67.00 | Aise aur viral claims ke liye follow kar lo. | Speaker, zoom 1.0 | Follow card (Instagram + Facebook) in the caption band, under the still last line | — | CTA tick |

Layouts used: full-screen graphic (hook), speaker, circle, stack (top/bottom), full-screen
B-roll, speaker with headroom card or posts. Transitions: hard cut on the creator's cuts, board
rise (stack), circle shrink, count roll, dots falling, card land.

Data for the scan bars and the ledger dots: `quran_stats.json`, made by `make_stats.py` from
the Quranic Arabic Corpus morphology; it refuses to write unless the counts match research.md.
Icons are drawn for this reel (`src/overlays/yawm/icons.tsx`), no icon set or brand mark.

## Checked so far

Still frames at 15 moments (`out/yawm-365/graphics-preview-v2.jpg`): text inside y 168–1330,
captions off the face and moving with the stack, Arabic clear of other text. Motion and
sound have not been seen in a render yet.
