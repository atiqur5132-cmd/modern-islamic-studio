# Suraj chiragh hai, chaand nahi (71:16, 10:5, 25:61)

Series A, Viral Claim Check. Researched 2026-11-14. TOPICS.md #58. **Faceless reel**: the
creator records the voiceover only and never appears on screen.
Freshness (web search 2026-11-13): apologetics pages push "nur = reflected light"; critics
reply with 24:35. We found no Hindi short that does both, and none that shows the
translator's bracket, the siraj count or Parmenides.

## The claim

Forwarded as: "1400 years ago the Quran said the moon's light is reflected: the moon is
*nur*, the sun is *siraj*." The usual proof is 71:16 in Saheeh International, which reads
"made the moon therein a [reflected] light".

## The one idea

"Reflected" is not in the Arabic; *nur* alone cannot mean borrowed light (Allah is *nur*,
24:35). But the Quran calls the sun *siraj*, a burning lamp, and never once calls the moon
that, and calling the moon a lamp would have been wrong. That borrowed-light idea itself
was written in Greek over a thousand years before the Quran.

Picture: a clay oil lamp (chiragh) burning its own oil, next to a mirror-like moon lit
from the side; then the word *siraj* lighting up in 4 places across the mushaf.

## Hook, first 6 s (faceless, script v2 of 2026-11-14)

The creator asked for an opening picture that stops the scroll. The line is "Suraj abhi
bujh jaaye, toh chaand bhi lagbhag aath minute mein bujh jaayega": a surprising, true,
visual fact, with the key words (suraj bujh) in the first 3 words.

| Time | Picture | On-screen English | Sound |
| --- | --- | --- | --- |
| 0.0 s (frame 0 = cover) | Full moon huge and bright, filling the upper two-thirds; at the left edge a glowing Sun, a simple light switch beside it marked SUN, set to ON | `SUN: ON` | Low night hum |
| 1.2 s | A finger flicks the switch; the Sun goes black instantly. The moon is still fully lit | `SUN: OFF` | Hard click, hum cuts out |
| 2.4 s | A timer slams in under the moon, `08:20`, counting down fast (time-lapse); stars around stay | `08:20` | Ticking |
| 3.8 s | Timer hits `00:00`: the moon goes dark from full to black in about 0.3 s, a faint grey outline left | (no text) | Silence for one beat |
| 4.8 s | Hard cut to black space; only the word `nur` (نور) and the claim tag fade in | `SCIENCE` tag | Soft whoosh |
| 6.0 s | A phone forward card slides up: "Quran said this 1400 years ago" (generic forward, no real account) | `VIRAL CLAIM` | Phone buzz |

Every step is a visible change under 1.5 s. The Sun and Moon should be 3D (the Earth
tooling in `public/terrain`) or NASA public-domain imagery; the switch is a flat graphic.
Final beats only after the voice is recorded and the creator has approved the cut.

Verdict stamp: `HALF TRUE` (the word "reflected" is the translator's; the sun/moon word
contrast is real).

## The verses (fetched with `scripts/fetch_ayah.py`, 2026-11-14)

| Ref | Used for | File | Saheeh International (quran.com API resource 20) |
| --- | --- | --- | --- |
| 71:16 Nuh | The spoken Ayah: moon nur, sun siraj | `71-16.json` (full) | "And made the moon therein a [reflected] light and made the sun a burning lamp?" |
| 10:5 Yunus, words 1–9 | sun *diya'*, moon *nur*, phases (backup card) | `10-5.json` (excerpt) | "It is He who made the sun a shining light and the moon a derived light and determined for it phases…" |
| 25:61 Al-Furqan | siraj #1 (sun) and *qamaran munira* | `25-61.json` (full) | "…placed therein a [burning] lamp and luminous moon." |
| 78:13 An-Naba | siraj #2 (sun), *sirajan wahhaja* | `78-13.json` (full) | "And made [therein] a burning lamp" |
| 33:46 Al-Ahzab | siraj #4 (the Prophet ﷺ), *sirajan munira* | `33-46.json` (full) | "And one who invites to Allāh, by His permission, and an illuminating lamp." |
| 24:35 An-Nur, words 1–4 | Allahu nuru s-samawati wa l-ard | `24-35.json` (excerpt) | "Allāh is the Light of the heavens and the earth." |

**10:5 is saved only as words 1–9** (quran.com and alquran.cloud spell the hamza of
*al-āyāt* differently). **24:35 is saved as words 1–4**, the part spoken.

Note for the edit: Saheeh International itself puts "reflected" in brackets in 71:16, and
in 10:5 uses "derived light" with no bracket. Show 71:16 on screen as their text appears
(screenshot of quran.com, credited), bracket ringed. Say "English translation", not that
all translators do this.

## The siraj count

Quranic Arabic Corpus, root s-r-j (corpus.quran.com/qurandictionary.jsp?q=srj, opened
2026-11-14): the root occurs **4 times**, always as the noun *sirāj*: 25:61:9, 33:46:5,
71:16:7, 78:13:2. Three are the sun (25:61 and 78:13 by Ibn Kathir and Qurtubi via Ibn
Abbas; 71:16 names the sun), one is the Prophet ﷺ (33:46). None is the moon.

Caveat for research only: in 25:61 Hamza and al-Kisa'i read *suruja* (plural, "lamps"),
which al-Nahhas explains as the great stars (Qurtubi on 25:61). The reading still does not
call the moon a lamp. Not in the script.

## Tafsir (opened 2026-11-14 via api.quran.com/api/v4/tafsirs)

- **Ibn Kathir, Arabic (resource 14) on 10:5:** "He made the ray coming from the body of
  the sun *diya'* and the ray of the moon *nur*; this is one kind and that is another
  kind, and He made them differ so that they are not confused" (*hādhā fann wa hādhā fann
  ākhar, fa-fāwata baynahumā li-allā yashtabihā*).
- **Ibn Kathir, Arabic, on 25:61:** *qamaran munīran* = "shining and bright with another
  light, of another kind and type, other than the light of the sun" (*bi-nūrin ākhar wa
  naw'in wa fannin ākhar ghayri nūri sh-shams*).
  **Mistranslation found:** the quran.com abridged English (resource 169) renders this as
  "illuminated by the light of something else", which is not what the Arabic says. Never
  quote the English abridgement for this point.
- **Ibn Kathir on 71:16 (English abridged):** "He made a distinction between them … in
  reference to their lighting."
- **al-Tabari on 10:5:** "He made the sun shine (*aḍā'a*) and the moon give light
  (*anāra*)", by day and by night. No reflection idea.
- **al-Qurtubi on 10:5:** *diyā'* is what lights things up; *nūr* is what makes things
  visible; he links *nūr* with *nār* (fire) as one origin. No reflection idea.

So classical tafsir reads the pair as two different kinds of light. None of the four says
"borrowed" or "reflected". A script line quoting Ibn Kathir ("alag qism") was cut for
length; it can return as an on-screen note if the creator wants it.

## Science

- The Moon makes no light of its own; moonlight is sunlight scattered off its surface.
  NASA Science, "Moonlight" (science.nasa.gov/moon/moonlight). Label: established science.
- The Moon reflects only about 12% of the light that falls on it (geometric albedo about
  0.12), about as dark as worn asphalt. Universe Today "Moon albedo"; West Texas A&M,
  "Why is the moon so bright?" (wtamu.edu/~cbaird/sq/2015/08/06/). Not in the script;
  backup if a viewer asks.
- The Sun "burns its own fuel": nuclear fusion in its core (NASA). "Tel jalata hai" is
  the lamp, "apna fuel" the Sun; it is not chemical burning, so the line says "fuel", not
  "aag".

## Known before the Quran

- **Parmenides** (born c. 515 BCE, poem early 5th century BCE), fragment DK 28 B14:
  *nyktiphaes peri gaian alōmenon allotrion phōs*, Burnet: "Shining by night with borrowed
  light, wandering round the earth." Text: Lexundria (lexundria.com/parm_frag/14/b);
  translation: Fordham Ancient History Sourcebook. Analysis: Mourelatos (a light "not one's
  own"). Gap to the Quran's first revelation (610 CE): about 1,085–1,100 years, so the
  script's "hazaar saal pehle" is safe.
- **Anaxagoras** (5th c. BCE) held the moon's light comes from the sun (Stanford
  Encyclopedia of Philosophy, "Anaxagoras"); Couprie (Hyperboreus 24, 2018) argues it may
  mean the sun ignites it. Not in the script.
- **Ibn al-Haytham** (d. c. 1040 CE), *On the Light of the Moon*: argued that moonlight is
  not mirror reflection but light the sunlit Moon gives off like an opaque earthly body;
  he says this against "all the scientists of that time", who already held it was the
  Sun's light. (Hamedani, ICRANet 2021 abstract; Astronomical and Astrophysical
  Transactions.) A good later reel; not in this one.

## Claim ledger

| # | Line | Claim | Label | Source | Caveat |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | If the Sun went out now, the Moon would go dark in about 8 minutes | Established science | Sunlight takes about 8 min 20 s to cross 1 AU (NASA); the Moon is about 1 AU from the Sun; we then see it 1.3 s later | Earthshine would go too (Earth is also sunlit); "lagbhag" covers the minutes |
| 1b | 2 | The Moon has no light of its own; it sends sunlight back | Established science | NASA Moonlight | "Lautata" = scattered, not mirror |
| 2 | 2 | Viral claim: Quran said 1400 years ago the moon's light is borrowed | Claim reported | Apologetics pages (web search 2026-11-13) | We report, not endorse |
| 3 | 3–4 | 71:16: moon made nur, sun made siraj (a lamp) | Quranic context (translation) | 71:16 SI | — |
| 4 | 5–6 | "Reflected" is in brackets in Saheeh International; not in the Arabic | Linguistic observation | quran.com SI 71:16; Arabic 71:16 | Other translators differ; say "English translation" |
| 5 | 7 | nur alone cannot mean borrowed light; 24:35 calls Allah nur | Linguistic observation | 24:35 words 1–4 | The critics' own argument; we agree with this half |
| 6 | 9–10 | siraj occurs 4 times: 3 sun, 1 Prophet ﷺ, 0 moon | Numerical observation | Quranic Arabic Corpus, recounted | 25:61 variant reading suruja (stars), still not the moon |
| 7 | 11 | A lamp burns its own oil, the Sun its own fuel; the Moon burns nothing and sends back sunlight | Established science | NASA Moonlight; NASA Sun | "Lautata" = scattered, not mirror |
| 8 | 12 | "Borrowed light" was written by a Greek poet over 1,000 years before the Quran | Historical report | Parmenides B14 (Burnet) | Exact date of the poem unknown; early 5th c. BCE |
| 9 | 13–15 | The Quran neither called the moon borrowed nor a lamp; calling it a lamp would be wrong | Interpretation (our verdict) | Lines 3–11 | Not a miracle claim; the reel says "nayi khoj nahi" |

## What this reel does not say

- Not that the Quran "predicted" or "revealed" reflected moonlight.
- Not that every translation adds "reflected" (Saheeh International adds it in brackets
  in 71:16; check others before any wider claim).
- Not that classical scholars knew reflection from these verses: Ibn Kathir, Tabari and
  Qurtubi read "two kinds of light".

## Comment ask and CTA

- On-screen comment ask (English, with the comment icon): "Which Quran 'fact' forward
  have you seen most?"
- CTA (last spoken line): "Aisi aur aayatein, asli lafz ke saath dekhni hain, toh follow
  kar lo." Not used in the last four reels.
- Mid-video CTA spot: after line 8 ("Asli baat ek doosre lafz mein hai"), about 45% in,
  before the siraj count. Not in the hook or the last three lines.

## Length

Script v2 (2026-11-14, rewritten to sound spoken and open on the Sun-switch hook): 235
words, about 71 s at 3.3 words a second. If it must go shorter, cut line 12's first
sentence and line 14's second sentence first; keep the bridges.
Line 15 says "aasmaan mein chiragh ek hi hai" because siraj is also used for the
Prophet ﷺ (33:46); the line is about the sky only.

## Voice-recording note (faceless)

The creator records only the voice. After cutting the take, send the cut audio for the
creator's OK before any visuals (scroll-kyun lesson, 2026-11-13).
