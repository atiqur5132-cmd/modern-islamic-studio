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
"1400 saal pehle hi bata diya tha" (no "ye"), line 16 "yaad rakhna". Line 11 keeps "ke liye"
after the durood: Whisper missed it, the creator confirmed it is said; its words are timed by hand
from the voice's loudness (`MEASURED` in build_props.py). The creator confirmed the script on
2026-11-14. Original kept as `script.original.txt`.

## Rules for this reel

- QUALITY §1 "creator on screen from frame 0" and §0/§3 (recording, face tracking) do not apply:
  the reel is faceless by design (series brief and research). The report says so, not "pass".
- No music (none approved for this reel).

## Rebuild (2026-11-14, after the creator's review)

The first render (flat graphics on a dark ground, mostly type) was rejected by the creator:
"jyadatar texts the and visuals and motion graphics promising nahi the". It also failed the
hook gates (study_reel.py: beats 0.0 and 3.1 s only). The reel was rebuilt in one continuous
3D sky (`src/chaand/Space3D.tsx`, three.js): a real Moon sphere with the Solar System Scope
map (NASA LRO data, CC BY 4.0) lit only by the Sun's direction, so its terminator is real; an
animated Sun sphere with a corona; the Milky Way behind. The creator approved the 3D hook
preview ("Yes, build the rest") before the other scenes were rebuilt.

## The three biggest visual decisions

1. **The hook is the physics itself.** The Sun dies on "bujh", its last light leaves as a ring;
   side on, the ring travels to the Moon under a racing `08:20`; close up, the Moon goes dark
   as it arrives. Then the Moon's real surface: lit, dark ("roshni hi nahi"), lit again from
   the side as the Sun returns.
2. **Words on real paper.** Every Ayah and the translation sit on a torn paper card floating
   in the sky (the Towards Eternity reference), the word ringed by hand as it is said: nur in
   ink, siraj in amber, "[reflected]" in rust; then "[reflected]" falls off the card into the dark.
3. **One accent means "a light of its own".** Amber marks only the Sun, the lamp and siraj; the
   count ends with three siraj words flying into the burning 3D Sun, one to the Prophet ﷺ, and
   a 0 beside the Moon.

## Look

| Role | Value |
| --- | --- |
| World | 3D night sky (#0B0E16), the Milky Way at 55%, Moon and Sun spheres |
| Ink | moon ivory #ECE5D5, with a soft dark shadow over the sky |
| Paper | warm card #F1EADB→#DDD2BA, fibre grain, torn edge; ink #1D2230; tag rust #A4572A |
| Accent | lamp amber #E1A24A. One meaning: a light of its own (Sun, lamp, siraj) |
| Sans | Plus Jakarta Sans 600/700/800 (labels, credits, numbers) |
| Serif | Newsreader 500 and italic (big lines, meanings, the quote) |
| Arabic | Amiri Quran (whole file) |
| Captions | `editorial`, Plus Jakarta Sans 66 px, emphasis in Newsreader italic; none in the hook (0–3.4 s) |
| Motion | camera moves in the 3D sky; hard cuts between lines; cards land on a 3D tilt and drift; rings drawn 12–14 frames |
| Sound | voice; sub-hit at frame 0, impacts and soft ticks (three takes rotated) on beats, whooshes on chapter cuts |

## Beats (times on the voiceover; `src/chaand/Hook3D.tsx`, `scenes3D.tsx`)

| # | Time | Line (short) | Picture | Claim tag |
| --- | --- | --- | --- | --- |
| 1 | 0.00–3.42 | Suraj abhi bujh jaaye … | 3D Moon and burning Sun, "If the Sun went out now…"; 0.8 Sun dies, ring leaves; 2.06 side shot, ring travels, `08:20`; 2.7 close, Moon goes dark | — |
| 2 | 3.42–7.12 | Kyunki chaand ki apni roshni … | Moon surface lit, dark on "nahi", sunlight sweeps back; pull back to Sun and half-lit Moon; "No light of its own." | Established science · NASA |
| 3 | 7.12–11.68 | forward … 1400 saal | A phone tilts up out of the sky with the generic forward; "1400 years ago?" bursts out of it | Viral claim |
| 4 | 11.68–16.74 | Saboot, Surah Nuh ki ye aayat | 71:16 on a paper card; halves darken as recited; نورا ringed in ink, سراجا in amber | Quranic text · Nuh 71:16 |
| 5 | 16.74–20.68 | nur … siraj, jalta hua chiragh | Whole 3D Moon, "nur, light"; split: the real clay lamp, "siraj, a burning lamp" | Quranic context |
| 6 | 20.68–25.80 | English translation … bracket | Saheeh International line on a card; "[reflected]" marked, push in, ringed | Translation · Saheeh International |
| 7 | 25.80–27.54 | Arabic mein ye lafz hai hi nahi | The four Arabic words with meanings; "[reflected]" falls off the card | Linguistic observation |
| 8 | 27.54–31.98 | nur ≠ udhaar … Allah ko bhi nur | "nur / borrowed light?" struck; 24:35 on a card, نور ringed | Quranic text · An-Nur 24:35 |
| 9 | 31.98–36.44 | forward galat? Poora nahi … siraj | The phone tilts and falls, "Not entirely."; سراجا huge in amber over the lamp's flame | — |
| 10 | 36.44–44.36 | chaar baar … teen suraj … Nabi ﷺ … chaand: 0 | Four siraj words in the sky, "4"; the Sun ignites, three fly into it, one to the Prophet ﷺ, 0 by the Moon | Numerical observation · Quranic Arabic Corpus |
| 11 | 44.36–50.06 | Chiragh tel … suraj fuel … chaand kuch nahi | Real lamp; 3D Sun surface close; 3D Moon, cold | Established science |
| 12 | 50.06–55.26 | Greek shayar … hazaar saal | Parmenides on a paper card, the quote, a line of light to 610 CE: "about 1,100 years" | Historical record |
| 13 | 55.26–59.92 | nayi khoj nahi … galti nahi ki | "Half true." and its two halves; "The Moon is a lamp" struck | Interpretation · our verdict |
| 14 | 59.92–63.58 | Aasmaan mein chiragh ek hi hai | The Sun burning, the Moon lit by it; "One lamp in the sky."; سراجا over the Sun on "usi" | — |
| 15 | 63.58–67.50 | Agli baar chaand dekho … Follow | The Moon rises; comment ask, then Follow with real Instagram/Facebook icons | — |

Mid-video CTA: Follow card at the top, 44.42–47.0 (proof footage; not hook or payoff).

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
