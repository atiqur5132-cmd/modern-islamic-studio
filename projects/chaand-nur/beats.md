# Beats: "Suraj chiragh hai, chaand nahi" (71:16, faceless)

Series A, Viral Claim Check. **Faceless**: the creator's voice only, never on screen.
Voice: `Raw footages/VN20261114_183354.mp4` (one take, 66.9 s, trimmed by the creator in VN),
cleaned by `build_voice.py` into `public/footage/chaand-nur.voice.wav` (67.5 s, −16 LUFS; one
0.54 s pause before "Follow kar lo" shrunk to 0.32 s). **Approved by the creator 2026-11-14.**
Timing: `build_props.py` → `reel.json` (Whisper medium on the take, the dropped 51.8–66.9 s
stretch re-heard in ≤6.5 s pieces; spelling from `script.txt`). Picks: Claude's first picks in
`plan.html`, accepted by the creator ("Yes, first picks", 2026-11-14).
Composition: `Chaand` (`src/chaand/`), one scene per script line, hard cuts 2 frames before each
line's first word.

Script changed to the take (2026-11-14): line 2 "apni roshni hi nahi hai" (no "koi"), line 3
"1400 saal pehle hi bata diya tha" (no "ye"), line 11 "Ek baar Nabi sallallahu alaihi wasallam."
(no "ke liye" heard in three passes), line 16 "yaad rakhna". Original kept as `script.original.txt`.

## Rules for this reel

- QUALITY §1 "creator on screen from frame 0" and §0/§3 (recording, face tracking) do not apply:
  the reel is faceless by design (series brief and research). The report says so, not "pass".
- No music (none approved for this reel).

## The three biggest visual decisions

1. **The hook is the surprise itself.** The real NASA Moon and Sun on a night ground with a
   SUN switch; the switch flicks, the Sun dies, an `08:20` timer races down, and the Moon dies
   too. Four hard beats in 3 s, readable with the sound off.
2. **The bracket is shown, not told.** The translation moves to a light moon-paper page (the
   only light ground in the reel); "[reflected]" is marked, the page pushes in, and a ring is
   drawn round the brackets. Next, the Arabic words with their meanings leave "reflected" no
   word to stand under, and it falls away.
3. **One accent means "a light of its own".** Amber marks only the Sun, the lamp and the word
   *siraj* (and its count). The Moon is always ivory/grey, so by the payoff the viewer reads the
   colours as the argument: one amber lamp in the sky.

## Look

| Role | Value |
| --- | --- |
| Ground | night ink #151A26 (fine grain, faint fixed stars: the subject is the sky), deep #0E121B |
| Ink | moon ivory #ECE5D5 |
| Muted | stone #8E8C86 (credits, what steps back) |
| Accent | lamp amber #E1A24A. One meaning: a light of its own (Sun, lamp, siraj) |
| Paper page (lines 6–7) | moon paper #E7E1D3, ink #1D2230, muted #6F6D68 |
| Sans | Plus Jakarta Sans 600/700/800 (labels, credits, numbers) |
| Serif | Newsreader 500 and italic (big lines, meanings, quote) |
| Arabic | Amiri Quran (whole file) |
| Captions | `editorial`: Plus Jakarta Sans 66 px sentence case, words at half strength until spoken, `*emphasis*` in Newsreader italic 1.28×; warm white on night, paper ink on the paper page; foot at y 1310 |
| Motion | arrivals 14–16 frames eased out (exp), exits 5–8; hard cuts between lines; snaps (5–6 frames) only for hook beats and number hits |
| Sound | voice; sub-hit at frame 0, a click on the switch, ticks under the timer, sub-hit as the Moon dies, soft whooshes on chapter cuts, soft ticks (three takes rotated) on marks, impacts on "4" and "Half true" |

## Beats (times on the voiceover; built in `src/chaand/scenesA.tsx`, `scenesB.tsx`)

| # | Time | Line (short) | Picture | On screen (English) | Claim tag (credit line) |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.00–3.42 | Suraj abhi bujh jaaye … aath minute … bujh jaayega | Full Moon (NASA LRO) upper frame, Sun (NASA SDO) top left, flat switch | Frame 0: "If the Sun went out now…" + SUN: ON. 0.80 switch → OFF, Sun black. 2.06 `08:20` slams in, races to 00:00. 2.87 Moon dark in 0.3 s | — |
| 2 | 3.42–7.12 | Kyunki chaand ki apni roshni … lautata hai | Dark Moon; 4.42 hard push in; 5.6 Sun back at left, amber sheet lights the near half; 6.52 rays scatter toward viewer | "No light of its own." · "sunlight, sent back to you" | Established science · NASA, "Moonlight" |
| 3 | 7.12–11.68 | Isi baat pe ek forward … 1400 saal pehle | Generic forward (no app, no account) rises over the dimmed Moon | "The Quran said it 1400 years ago: the Moon's light is reflected." 9.62 "1400 years ago" underlined + push | Viral claim · a forward shared widely |
| 4 | 11.68–16.74 | Saboot, Surah Nuh ki ye aayat … | 71:16 as fetched: moon half (words 1–4) over sun half (5–7); each half lights as recited (13.46 / 15.24), نورا underlined (14.86), سراجا amber (16.22); small Moon and Sun beside their halves | "Surah Nuh, 71:16" · captions hidden 13.46–16.80 | Quranic text · Nuh 71:16 |
| 5 | 16.74–20.68 | Chaand ko banaya nur … jalta hua chiragh | Moon full; 18.02 split: real clay lamp rises into the lower half | نورا "nur, light" (17.64) · سراجا in amber "siraj" (18.80) · "a burning lamp" (19.66) | Quranic context · Nuh 71:16 · Photo: Saral Shots, CC0 |
| 6 | 20.68–25.80 | English translation … reflected bracket mein hai | Moon-paper page | "And made the moon therein a [reflected] light" (Saheeh International); 22.58 highlighter on "[reflected]"; 24.36 push in ×1.42; 24.98 ring drawn round it | Translation · Saheeh International, 71:16 (quran.com) |
| 7 | 25.80–27.54 | Arabic mein ye lafz hai hi nahi | Paper page: the four Arabic words with meanings, right to left | "and made · the moon · therein · a light"; "[reflected]" under an empty dashed box (26.44), falls away (27.20) | Linguistic observation · the Arabic of 71:16, word by word |
| 8 | 27.54–31.98 | nur ka matlab udhaar … Allah ko bhi nur | "nur ≠ borrowed light", struck on "udhaar" (28.42); 30.12 cut to 24:35 words 1–4, نور underlined on "nur" (31.18) | "Allah is the Light of the heavens and the earth." | Quranic text · An-Nur 24:35 · Saheeh International |
| 9 | 31.98–36.44 | Toh forward galat nikla? Poora nahi … siraj mein hai | Forward back; tilts and dims on "galat" (32.60); "Not entirely." (33.38); slides off (34.28); "nur" muted (34.72); سراجا huge in amber over the lamp (35.62) | "Not entirely." · "siraj" | — |
| 10 | 36.44–44.36 | Ye lafz … chaar baar … teen suraj … Nabi ﷺ … chaand ek baar bhi nahi | Four siraj words (from 25:61, 33:46, 71:16, 78:13, as fetched) light in a row; "4" (37.86); columns Sun / the Prophet ﷺ / Moon (38.80); three fly to the Sun (39.24), one to the Prophet ﷺ (40.52); Moon's dashed empty place (42.30); "0" (43.20) | "4 times in the whole Quran" · 3 · 1 · 0 | Numerical observation · Quranic Arabic Corpus, root s-r-j |
| 11 | 44.36–50.06 | Aur ye fark sahi baithta hai … Chaand kuch nahi jalata | Real pictures, hard cuts: clay lamp (push at 46.02), NASA SDO Sun (47.66), NASA Moon, grey (48.64) | "A lamp burns its own oil." · "The Sun, its own fuel." · "The Moon burns nothing." | Established science · nuclear fusion · NASA/SDO; NASA/GSFC/ASU |
| 12 | 50.06–55.26 | Haan, chaand ki roshni udhaar ki hai … Greek shayar | Parmenides bust (CC BY-SA), dimmed, right; quote (51.28); timeline c. 475 BCE → 610 CE drawn on "hazaar saal" (53.02); name on "Greek" (54.04) | "Shining by night with borrowed light" · "about 1,100 years" · "Parmenides, Greek poet, c. 475 BCE" | Historical record · Parmenides, fr. 14, tr. Burnet |
| 13 | 55.26–59.92 | Toh Quran ne koi nayi khoj nahi … galti nahi ki … aasaan | "Half true." lands (55.38); the two halves (56.42); "the easy mistake: “The Moon is a lamp”" (57.88), struck on "aasaan" (59.20) | "Half true." · "“Reflected” is the translator’s word, not the Quran’s." · "The Sun is called a lamp. The Moon, never." | Interpretation · our verdict |
| 14 | 59.92–63.58 | Aasmaan mein chiragh ek hi hai … usi ko kaha | Night sky: Sun (amber) and the Moon lit from its side; slow push | "One lamp in the sky." (60.52, holds to the cut) · سراجا rises over the Sun on "usi" (62.90) | — |
| 15 | 63.58–67.50 | Agli baar chaand dekho … Follow kar lo | The real Moon rises | Comment ask (63.64–65.74): "Which Quran ‘fact’ forward have you seen most?"; Follow card with real Instagram and Facebook icons in the caption band (65.81–end) | Image: NASA/GSFC/ASU |

Mid-video CTA: Follow card at the top, 44.42–47.0 (over the proof footage; not the hook, not the payoff).

## Captions

`editorial`, spelling only from `script.txt`, timing from Whisper (`reel.json`). Hidden under the
recited Ayah (13.46–16.80; the Roman transliteration in line 4 never shows) and under the end
Follow card. On the paper page they take the paper ink.

## Accuracy notes

- Arabic only from `src/data/quran/*.json` via `ayahTokens`/`ayahWords` (fetched by
  `scripts/fetch_ayah.py`); no Quranic text typed by hand.
- The siraj words are 25:61 word 9, 33:46 word 5, 71:16 word 7, 78:13 word 2 (Corpus numbering).
- "about 1,100 years": Parmenides' poem early 5th c. BCE (c. 475) to 610 CE ≈ 1,085; the voice
  says "hazaar saal" (over a thousand), which the number supports.
- The forward is a generic message, not a copy of any real account or app.
