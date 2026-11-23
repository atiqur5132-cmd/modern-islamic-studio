# Beats: "Lab mein bana gosht: halal ya nahi?" (Modern Islamic Studio, long form, 16:9)

Standard: `LONG_FORM_HI.md` (wins over QUALITY/STYLE/SOUND for this video). Started 2026-11-24.
Voice: `vo.wav` (7:25, the creator's own cut, approved 2026-11-24). Script: `script.txt`. Facts: `factcheck.md`
(all pass after the cut). Timing: `work/lab-meat.merged.transcript.json` (`merge_transcript.py`).
Composition: `LabMeatLong` (`src/long/labmeat/`).

## Creator's direction (2026-11-24)

- **No subtitles on screen.** Only designed key lines; the `.srt` question is open for upload time.
- The hook must be very strong and the editing must give a reason to watch to the end: world class.
- The video should feel 3D: one continuous 3D lab world, with the real documents and photos placed inside it
  (Claude's advice, accepted), not 2D slides.

## The idea on screen: three questions, one lab

The video's one idea is that Islamic law asks three old questions of a new meat. So one object carries the whole
video: **three amber tags, Animal? · Method? · Feed?**, that appear in the hook, open fully in chapter 3, light one
by one in chapters 4–6, and close over a supermarket pack at the end ("Machine nayi hai. Sawaal purane hain.").
MUIS's own fatwa says it studied "three inter-related aspects": the source, the methods and the ingredients
(release §7), so the device is the fatwa's own structure, not an invention.

The world: a quiet cultivation lab at night. A brushed-steel bench, a 3D **bioreactor** with a glass window on
pink culture medium where cells drift, a petri dish, and paper documents that rise from the bench to face the
lens. Each chapter has its own corner of this one room (bench, reactor, document wall, shelf).

## Look: "Night lab" (numbers before building)

| Role | Value |
| --- | --- |
| Ground | deep slate-teal `#0F1A1E` → `#16252B` (never black), fog for depth |
| Steel | `#8C989E`, metalness 1, roughness 0.32, CC0 HDRI `monochrome_studio_02` for reflections |
| Medium | culture pink `#D9897A` (real medium is pink from its phenol red indicator), cells `#F1C9BD` |
| Ink | cool ivory `#E9ECE8`; soft `#9DAAAD` |
| Accent | amber `#E0A23A`, **one meaning: the three questions** (a tag, the condition the voice is on) |
| Paper | `#F4F1EA` with a dark ink `#1F2A2E` (documents keep their own type) |
| Type | Instrument Serif (big lines, 96–140 px, italic for emphasis); Inter Tight 600 (credits, labels, 30–36 px) |
| Motion | camera eases over 30–60 frames; arrivals 14–20 frames, no bounce; exits half as long; hard cuts on new ideas |
| Texture | fine grain, soft vignette; no glow rings, neon or decorative particles (the cells are the subject) |

Never shown: the Prophet ﷺ, the Companions, any face drawn or generated. Real people only in real photos
(Mark Post, the 2013 tasting), credited.

## Chapters (vo.wav times)

| Chapter (YouTube) | Time | Corner of the lab | Music (creator confirms by ear) |
| --- | --- | --- | --- |
| Hook | 0–30.5 | photo → bench → reactor → fatwa → conditions → tags → shelf | Laniakea (curious), enters at 6.8 |
| 1 · A €250,000 burger | 30.5–~64 | photo wall: 2013 burger, Mark Post, map pins 2020–2025 | Laniakea |
| 2 · How it is made | ~64–130 | inside the reactor: biopsy → medium → reactor → weeks → scaffold → 3% pack | Laniakea |
| 3 · Three questions | 130–157.8 | the three tags open on the bench | EBB (dark) |
| 4 · Which animal | 157.8–188.6 | tag 1: animal icons in brass, istihala card | EBB |
| 5 · Taken from a living animal | 188.6–275.9 | tag 2: needle, Madinah relief map, Tirmidhi 1480 card, a balance with both sides | EBB, out under the hadith |
| 6 · What the cells are fed | 275.9–318.7 | tag 3: serum flask, Ayah 5:3 card (music out), serum-free medium | Singularity |
| 7 · What the fatwas said | 318.7–370.9 | globe: Singapore, Korea, Malaysia, Doha; IIFA Resolution 265 card | Singularity |
| 8 · Fatwa vs certificate | 370.9–404.0 | a door; UPSIDE card (Nov 2026); map stamps Italy, Florida, Alabama | Singularity |
| 9 · The real lesson | 404.0–435.1 | the pack on a shelf, the three tags close over its label | Last Sunrise (reflective), out before the payoff |
| End | 435.1–445.3 + 20 s end screen | subscribe line, comment question | Last Sunrise |

Chapter cards: one design for the channel ("Chapter n", a thin amber rule, the English title in Instrument
Serif), about 2.4 s over the chapter's first words. No pauses were added: the voice runs on, as cut and approved.

## Hook storyboard (0–30.5 s, then chapter 1 to 40 s for the preview)

Rule for the hook (QUALITY §1 adapted to faceless long form): frame 0 is a real, strong picture with one bold line;
a visible change at least every 1.5 s to 6 s; the key word inside 1.5 s; sound at frame 0.

| Time | Voice | Picture | On screen (English) | Sound |
| --- | --- | --- | --- | --- |
| 0.0 | "Is chicken ko kisi ne *zabah* nahi kiya." | **Frame 0:** the real GOOD Meat cultivated chicken dish (Commons, Jpatokal), full frame, already pushing in | "This chicken was never slaughtered." (serif, left third) | voice + `tick-soft-1` on the line |
| 1.1 | "*zabah*" | line's "never slaughtered" turns italic | — | — |
| 2.24 | "farm mein nahi pala" | **cut:** the photo is a print lying on the steel bench; camera rises off it, the lab appears | "Never farmed." (on "farm", 3.26) | `paper-slide-1`, bed-room in |
| 4.72 | "*machine* ke andar" | **cut:** the bioreactor's window, pink medium, cells drifting up; camera slides along the steel | "Grown in a machine." (on "machine", 5.12) | (hum: none in the library yet) |
| 6.8 | "Singapore… committee" | the MUIS release **as a typeset article card** (its own words, verbatim) rises from the bench | credit (top): "Fatwa · quoted from MUIS, “Fatwa on cultivated meat”, 3 Feb 2024, muis.gov.sg" | `paper-slide-2`; music in |
| 9.6 | "*halal*" | camera eases to the line; the marker runs word by word under "generally halal or permissible" | — | `pen-circle-1` |
| 11.08 | "kuch shartein" | camera moves down the card, past "[…]", to MUIS's three conditions (§8); §1 dims | — | `page-turn-1` |
| 13.48–17.5 | "ek shart… *sabse mushkil*" | conditions i and iii dim; **ii "Every ingredient… must be halal" lights amber** | "The hardest one." | `impact` (1 of 3) on "mushkil" |
| 18.36 | "banta kaise hai" | **cut:** back to the reactor, wide; the bench and steel in view | — | whoosh-2 |
| 19.86 | "Islam kis nazar se" | three amber tags drop onto the bench one by one | "Animal?" "Method?" "Feed?" | three `tick-soft` takes |
| 22.88 / 23.84 | "ek baat par" / "kahan alag" | tag 1 lights (agreement); tag 2 rocks (where they differ) | — | — |
| 25.9 | "end tak… *supermarket*" | **cut:** a cold shelf; one tray pack, label "Cultivated chicken"; camera pushes in | "What should you ask?" | `cloth` (film) |
| 30.5 | chapter 1 | chapter card | "1 · A €250,000 burger" | music lifts in the pause |
| 33.0 | "London… press conference" | real photo: the 2013 tasting (WEF, CC BY) on the photo wall | "London, 5 Aug 2013" | `paper-slide-1` |
| 35.18 | "burger pakaya" | real photo: the fried burger | — | — |
| 37.82 | "kaat kar nahi aaya" | real photo: the raw burger in its dish | — | — |

## Sources on screen (hook)

- `public/footage/broll-lab-goodmeat-dish.jpg`: "Good Meat Cultivated Chicken pasta dish", Jpatokal, CC BY-SA 4.0.
- MUIS media release "Fatwa on cultivated meat", 3 Feb 2024 (muis.gov.sg), read 2026-11-24: §1 and §8 quoted
  verbatim on our own article card (`src/long/labmeat/Article.tsx`), no emblem, no copy of the site's look. The
  page captures (`public/footage/lab-muis-*.png`, not committed) were only used to read the text.
- 2013: `broll-lab-tasting.jpg`, `broll-lab-burger-fried.jpg`, `broll-lab-burger-raw.jpg` (World Economic Forum,
  CC BY 3.0); `broll-lab-markpost.jpg` (Mosa Meat, CC BY 4.0). All in `credits.txt`.
- HDRI `public/labmeat/monochrome_studio_02_1k.hdr`, Poly Haven, CC0 (Grzegorz Wronkowski).

## Open

- Music: the creator listens to Laniakea, EBB, Singularity and Last Sunrise and confirms, then downloads them
  (Audio Library files are never committed).
- `.srt` upload: yes or no (no burned-in subtitles either way).

## As built (2026-11-24, `src/long/labmeat/`)

- `hook.tsx` 0–40 s, `chapters.tsx` 40 s to the end (465.3 s: voice ends 445.3 s, then a 20 s end screen with
  room on the right for YouTube's end-screen elements).
- One lab (`Lab3D.tsx`): bench, bioreactor (cells multiply on "billions"), petri dish with a tissue sample, the
  photo print, the three tags (lit on their questions; at the end they settle on the pack), the cold shelf, and a
  desk globe (NASA Blue Marble, public domain) with pins for Singapore, USA, Israel, Australia, Madinah,
  Malaysia, South Korea, Doha, Italy, Florida, Alabama.
- Sources as typeset article cards (`Article.tsx`): MUIS §1, §6, §8; IIFA Resolution 265 "Third" ("[animal]"
  marks the source's typo). Hadith card from `src/data/hadith/tirmidhi-1480.json` (sunnah.com, fetched, not typed).
  Ayah 5:3 from `src/data/quran/5-3.json` (fetch_ayah.py); bed and effects out from 290.98 to 296.9 s.
- Chapter 5's debate is told in beats (scholars, JAKIM on the globe, American Fiqh Academy, the sheep print,
  the cells, Dr Qamar, "like yogurt and pickles", MUIS §8) and only then summed up on a two-sided board.
- Sound: room bed, paper, pen, ticks, page turns, whooshes; 3 impacts (17.15, 45.6, 419.5 s); bed out under the
  Ayah and for the payoff line (432.7–435.1 s). Music not added yet (creator confirms the tracks first).
- Removed while building: two invented numbers ("37 °C", "21% O₂"); the voice never says them.
