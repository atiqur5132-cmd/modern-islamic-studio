# Beats: "Sharaab mein fayda?" (2:219, faceless, one 3D studio)

Proposed series D, Why Muslims…? (content for all communities). **Faceless**: the creator's
voice only, never on screen (creator, 2026-11-22: "mera photo nahi aana chahiye").
Voice: `Raw footages/VN20261122_185949.mp4` (one take, 81.7 s, cut by the creator in VN),
built by `build_voice.py` into `public/footage/sharaab-fayda.voice.wav` (82.5 s, −16 LUFS;
no pause over 0.45 s, so nothing was cut).
Timing: `build_props.py` → `reel.json` (Whisper medium; spelling from `script.txt`; captions
split at line ends). Picks: Claude's first picks in `plan.html` (creator trusts first picks).
Composition: `Sharaab` (`src/sharaab/`), hard cuts 2 frames before each line.

Script changed to the take (2026-11-22): line 21 "jo Quran ne rakha hai" (not "tha").
Original kept as `script.original.txt`.

## Decisions (2026-11-22)

- Line 20: the creator confirmed they said "39"; Whisper's "49" was a mishearing. Line stays.
- WHO: the real 25 June 2024 news release page, cropped to headline and date, no emblem.
- 3D upgrade approved: real CC0 Poly Haven materials and models, HDRI, detailed balance,
  debossed cover, lens (depth of field, bloom, AgX tone mapping, light grade).

## Questions that were open (answered above)

1. **Line 20, "15 se 39"**: Whisper heard "49" twice (Hindi and English passes, 64.6–68.3 s).
   The study's age band is 15–39. If "49" was said, that line must be re-recorded (one line,
   same mic and room) before the final render. Not yet confirmed.
2. **WHO logo**: WHO forbids its name and emblem without express written permission
   (who.int/about/policies/publishing/logo). Planned instead: the real WHO 25 June 2024 news
   release page, cropped to the headline and date, with the full name in the credit line.

## Rules for this reel

- QUALITY §1 "creator on screen from frame 0" and §0/§3 do not apply: faceless by the
  creator's instruction. The report says so, not "pass".
- No music. Nothing under the Ayah pages (bed out, no effects).
- No Companion or Prophet depicted.

## Look

| Role | Value |
| --- | --- |
| World | One 3D studio: walnut table, dark plaster wall (#2A231D), fog; brass balance, green glass bottle, brass/iron weights, Quran in green leather with a gold geometric border and title |
| Ground | #15110D (warm umber) |
| Ink | parchment #EFE6D6 |
| Paper | mushaf page #EDE4D3, ink #2A1F17, gilt frame |
| Accent | rust #C4593B. One meaning: the harm side (ithm, the deaths, the verdict). Benefit is never rust |
| Sans | Bricolage Grotesque 600/700 (labels, credits, numbers) |
| Serif | Instrument Serif, italic for emphasis (big lines, translation) |
| Arabic | Amiri Quran (whole file), pause marks kept on their word |
| Captions | `editorial`, Bricolage Grotesque 66 px, emphasis in Instrument Serif italic; ink on the paper pages; none over line 1 |
| Motion | camera moves in the studio; hard cuts on line starts; arrivals 14–18 frames, no bounce; rings drawn 14 frames |

## Hook measured (preview, 2026-11-22)

`study_reel.py --ours` on `preview_hook.mp4` (frames 0-209): beats at 0.0, 0.6, 1.2, 1.3, 2.7,
3.5, 3.7, 4.2, 4.7, 5.6 s; longest still 1.4 s; sound from 0.0 s; frame-0 contrast 30.7.
PASS all three. Known weak spot: the open pages at 3.5-5.0 s are blank; next step prints the
fetched 2:219 text on the 3D page so the dive into the Ayah page is continuous.

## Built so far (hook preview, 2026-11-22)

| Time | Line | Visual | On-screen English | Sound |
| --- | --- | --- | --- | --- |
| 0.00 | 1 "Sharaab mein *fayda* hai." | Low on the left pan: bottle on brass, beam swinging | Alcohol has *benefits.* | sub-hit at frame 0 |
| 0.68 | "fayda" | Brass weight drops into the pan, beam dips | | knock-1 on landing |
| 1.27 | "Yeh Quran kehta hai." | Cut wide: the Quran falls onto the table by the scale | — says the Quran. | whoosh-2, book-thud |
| 2.38 | 2 "Haan, sahi suna tumne." | Close on the gold cover, a light crossing it | captions on | whoosh-3 |
| 3.46 | "Quran ki Surah" | Cover swings open, camera rises | | page-turn-1 |
| 4.22 | "Baqarah" | Pages fan | | page-turn-2 |
| 5.18 | "verse 219" | Down onto the page | Al-Baqarah 2:219 | tick-soft-1 |
| 5.64 | 3 Ayah | Dive into the page: 2:219 words 1–14 (fetched), ithmun kabir ringed rust | “In them is great sin, and some benefit for people.” · Quranic text · Al-Baqarah 2:219 · Sahih International | bed out |
| 8.22 | "fayde" | manafi'u lin-nas ringed in ink | | none |
| 9.24 | 4 | First half dims; akbar ringed rust on "badi" | “But their sin is greater than their benefit.” | none |

Hook approved by the creator 2026-11-22 ("Haan, baaki banao").

| Time | Line | Visual | On-screen English | Sound |
| --- | --- | --- | --- | --- |
| 13.1 | 5 question | Pull back off the open book (2:219 printed on the page) to the whole table | Then why *ban* it? | whoosh-3, tick-soft-2 |
| 16.9 | 6 tarazu | Scale at three-quarters; bottle and weight lift away, beam levels | Benefit / Harm (pinned to the pans) | cloth, tick-soft-3 |
| 18.7 | 7 scholars | Close on the benefit pan | “…bringing about a joyous sensation and financially benefiting…” · Tafsir · Ibn Kathir on 2:219 · English, quran.com | paper-slide-1 |
| 22.6 | 8 khushi/maza/profit | Down into the pan: two brass weights and three coins land on the words | Joy · Pleasure · Profit | knock-2, knock-3, knock-1 |
| 26.3 | 9 WHO | Whip to the harm side; WHO's real 25 June 2024 release slides onto the table | Established data · WHO news release, 25 June 2024 | whoosh, paper-slide-2 |
| 30.8 | 10 26 lakh | On the release, highlighter under "2.6 million deaths per year…"; cut on "log": the iron weight slams the harm pan down | 26,00,000 · *deaths a year* · Established data · WHO, 2019 figures | pen-circle-2, impact |
| 34.8 | 11 7 hazaar | Desk calendar turns a leaf: "≈ 7,000 deaths, every day" | Our arithmetic · 26,00,000 ÷ 365 ≈ 7,123 | page-turn-1 |
| 36.8 | 12 not health | Back on the Quran; pages turn on to Al-Ma'idah (5:91 printed); down onto the page | Not a word about *health*. | page-turn-2 |
| 40.6 | 13–14 5:91 | Ayah page 5:91 words 1–17 (fetched): al-'adawata wal-baghda' ringed rust; dhikr Allah … as-salah ringed ink | Sahih International lines · Quranic text · Al-Ma'idah 5:91 | bed out, none |
| 46.9 | 15 Allah's command | The Quran closes; gold title in the light | For a Muslim, it is *Allah's command.* | book-thud (soft) |
| 50.2 | 16 logic | Rise from the book to the scale, down on the harm side; mid-reel Follow card | (Follow card) | tick-soft-1 |
| 53.4 | 17 science | The Lancet paper's record slides onto the table | | paper-slide-1 |
| 54.8 | 18 Lancet | Top down: highlighter on "Lancet. 2022 Jul 16…", then on "…continue to be debated" | Established science · GBD 2020 Alcohol Collaborators, The Lancet, 2022 · CC BY 4.0 | pen-circle-1, pen-circle-3 |
| 58.8 | 19 40+ | Benefit pan: a tiny weight lands; the beam barely moves | Over 40: *maybe, a little.* · Established science, debated | tick-soft-2, knock-3 |
| 64.8 | 20 15–39 | Wide; the tiny weight lifts out on "zero"; light narrows to the harm pan on "Sirf risk" | Ages 15–39 · 0 *benefit* · only risk | tick-soft-3, impact |
| 69.1 | 21 same scale | The Quran opens again beside the scale (2:219); beam settles lower on "bada" | Benefit, yes. *Harm, greater.* | whoosh-3 |
| 72.9 | 22 counted, weighed, decided | Light on the benefit pan, then the harm pan; close on the pointer against the dial | counted · weighed · decided | tick-soft-1, tick-soft-2, whoosh-2 |
| 76.0 | 23 payoff | Scale alone, slow push, near silence; no captions | Not a blind order. *A balance sheet.* | bed out, silence |
| 78.2 | 24 CTA | Slow drift round the scale; comment ask, then Follow | What should we answer next about Muslims? · Follow | tick-soft-3, tick-soft-1 |

## Assets

| Asset | Source | Licence |
| --- | --- | --- |
| Studio, scale, bottle, weights, book, cover art | drawn in code (`src/sharaab/`) | ours |
| Ayah text 2:219 (excerpt), 5:91 | `scripts/fetch_ayah.py` | — |
| knock-1/2/3, book-thud | `make_sfx.py` (FFmpeg) | ours |
| page-turn, whoosh, tick, sub-hit, bed-room | `public/sfx` (CREDITS.md) | as listed |
| Lancet GBD 2020 alcohol paper, first page (planned) | doi 10.1016/S0140-6736(22)00847-9 | CC BY 4.0 |
| WHO news release page (planned, no emblem) | who.int, 25 June 2024 | to check |
