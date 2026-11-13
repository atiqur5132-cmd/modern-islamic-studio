# Beats: "Do samandar jo mix nahi hote?" (55:19–21, 25:53, talking head)

Series A, Viral Claim Check (two-sided, like flat-earth). Take: `public/footage/two-seas.mp4`
(76.3 s, recorded and cut by the creator in CapCut on 2026-11-13, vertical 1080x1920, no
`--vertical`). `auto_edit.py` kept the whole take as one segment: no pause over 0.5 s, no
retakes, `lostWords` and `untranscribedSoundKept` empty. Whisper skipped 50.8–61.5 s; patched
in two pieces (`merge_transcript.py`). Source time is output time.

Creator's jump cuts (FFmpeg scene > 0.05), where every layout change sits:
3.43, 5.57, 8.53, 11.67, 13.67, 15.40, 17.43, 20.30, 21.63, 23.67, 25.77, 29.37, 31.03, 33.07,
35.77, 38.73, 40.23, 44.77, 47.33, 49.77, 51.97, 54.97, 58.07, 58.60, 60.43, 63.77, 66.20,
68.07, 69.97, 72.93.

## Rules for this reel from the creator (2026-11-13)

- **0–5.57 s, the creator is not on screen** ("pehle 4–5 second, samandar ki baat, mujhe mat
  dikhao"). The hook is full-screen footage and graphics; the creator first appears on the cut at
  5.57 ("Lekin ye Gibraltar nahi"). This overrides QUALITY §1's "creator on screen from frame 0"
  for this reel only; the report will say so rather than mark it passed.
- Music: the creator's nasheed (`Raw footages/sufisama99-nasheed-islamic-background-133345.mp3`,
  Pixabay) under the whole reel, very low. Mixed by `master_audio.py`: ducked by the voice to about
  20 dB under it (music −37.9 LUFS against voice −17.6 LUFS before the final −14 normalise).
- Eye line: the creator looks into the lens for the whole take (1 fps sheet checked), so every
  layout may show them.

## Recording note (QUALITY §0: fail, worked around)

Eyes sit at y ≈ 885 and the beard ends at y ≈ 1230, so the usual caption band (1100–1310) would
sit on the beard. With the speaker full screen, captions go in the clear wall above the cap
(foot at y ≈ 470); in splits they ride with the speaker window. Next shoot: camera a little
lower or tilted down so the eyes land near y 640.

## The three biggest visual decisions

1. **The hook shows the viral picture, then breaks it.** Real sea footage of a colour line fills
   the frame from frame 0, with "Two seas that *never mix*?" set beside it; at 5.57 the creator
   cuts in and the same line is labelled for what it is: Gulf of Alaska, glacial silt.
2. **One drawn cross-section explains Gibraltar.** A side view of the strait: heavy salty
   Mediterranean water slides out along the floor, light Atlantic water slides in on top, and a
   soft band between them is named *pycnocline*. On "mixing ko rokti nahi, balki dheema karti hai" the band
   blurs and the two colours visibly bleed into each other: it slows mixing, it does not stop it.
3. **One accent means fresh water.** Deep sea-ink ground, foam-white ink, and a silt-ochre accent
   that only ever marks sweet/river water (the *ʿadhb furāt* word in 25:53, the river in the
   estuary drawing, "meetha paani" at the payoff). Salt water is the ground colour itself.

## Look

| Role | Value |
| --- | --- |
| Ground | deep sea ink #10242A (fine grain), never black |
| Ink | foam #ECEFE8 |
| Muted | #8FA3A3 (credits, words that step back) |
| Accent | silt ochre #C9A267. One meaning: fresh / sweet water |
| Sans | Bricolage Grotesque 500/700 (labels, credits) |
| Serif | Fraunces italic (meanings, the hook line, the payoff) |
| Captions | `punch` (Viral Claim Check energy): Anton caps ~96 px, thin outline + soft shadow, emphasis word in the accent |
| Arabic | Amiri Quran |
| Footage grade | pale cream wall and white kurta: slight contrast lift, highlights pulled down so the kurta does not clip, skin natural |
| Motion | arrivals 16 frames eased out, exits 8, the cross-section's water layers flow slowly the whole time it is up |
| Sound | voice + nasheed bed; soft whooshes on the hook cuts, soft ticks (three takes, rotated) on labels and lit words, one low impact on the verdict |

## Beats (as built in build_edit.py; assets and licences in credits.txt)

| # | Time | Line (short) | Layout | On screen | Claim tag |
| --- | --- | --- | --- | --- | --- |
| 1 | 0.00–1.47 | Do samandar, beech mein | Full-screen footage, creator off | Frame 0: aerial sea with a hard colour line already moving; "Two seas" big | — |
| 2 | 1.47–2.63 | ek sharp line | Full-screen | Cut tight on the line; a thin drawn stroke runs along it on "sharp line" | — |
| 3 | 2.63–3.43 | aur paani mix nahi hota | Full-screen | "*never mix*?" lands in the serif beside the line | — |
| 4 | 3.43–5.57 | ye viral video tumne zaroor dekha hoga | Full-screen | The clip shrinks into a phone-shaped window on the ink ground ("viral clip", one credit line) | Viral claim |
| 5 | 5.57–8.53 | Lekin ye Gibraltar nahi, Gulf of Alaska hai | Split: creator top, map below | Map: Gibraltar is struck off, the camera flies to the Gulf of Alaska, pin lands on "Alaska" | — |
| 6 | 8.53–13.67 | glacier ka mitti wala paani … mix bhi ho jaata hai | Circle PiP over full-screen | NASA satellite image of glacial silt plumes in the Gulf of Alaska; on "mix" the plume edges are traced as they fade into blue. Bruland's quote "They do eventually mix" as the credit | Established science · Ken Bruland, UC Santa Cruz (ADN, 2013) · Image: NASA |
| 7 | 13.67–17.43 | Toh kya Quran ki baat galat hui? | Creator full screen, punch-in | Captions above the cap; punch to 1.12 on "galat" | — |
| 8 | 17.43–25.77 | Surah Rahman … barzakh … hadd se nahi badhte | Full-screen Ayah page, creator off on 17.43–21.63, circle from 21.63 | 55:19 then 55:20 (fetched), meanings in Fraunces; *barzakh* lit on "barzakh", "a barrier" | Quranic text |
| 9 | 25.77–31.03 | Surah Al-Furqan … ek meetha aur ek khaara | Split: creator top, Ayah below | 25:53: *ʿadhbun furāt* lights in the accent on "meetha", *milḥun ujāj* in foam on "khaara" | Quranic text |
| 10 | 31.03–35.77 | Imam Ibn Kathir … dariya ka meetha paani aur samandar ka khaara | Creator beside a pull quote | "The fresh and salty waters, the former from running rivers." — Ibn Kathir on 55:19 | Classical tafsir |
| 11 | 35.77–38.73 | Aur yahi balance do samandaron ke beech bhi | Creator full screen | Captions above the cap; punch-in on "balance" | — |
| 12 | 38.73–51.97 | Gibraltar ki science … pycnocline … invisible layer | Full-screen cross-section, creator off; circle back at 47.33 | The strait from the side: Mediterranean water out along the floor (44.2 "bahar nikalta"), Atlantic in on top (46.6 "andar aata"), the band named *pycnocline* (48.7), "a layer of density" | Established science · two-layer exchange at Gibraltar (Ocean Science, 2018) · Illustration |
| 13 | 51.97–58.07 | Ye layer mixing ko rokti nahi, balki dheema karti hai … viral daawa galat hai | Same drawing, creator in circle | The band blurs, colours bleed (54.3 "dheema"); 57.5 "galat": verdict "FALSE: they do mix" | Established science |
| 14 | 58.07–63.77 | Quran ki aayat ye kehti bhi nahi … hadd se zyada nahi dabata | Split: creator top, 55:20 below | *lā yabghiyān* marked; "neither oversteps" | Interpretation |
| 15 | 63.77–68.07 | Samandar ka namak dariya ko khatam nahi karta … meethe paani se jeete hain | Full-screen footage, creator off | Real river-mouth aerial (sweet water meeting the sea), then a hand drinking water on "meethe paani" | — |
| 16 | 68.07–72.93 | agli aayat poochti hai … nematon ko jhutlaoge | Full-screen Ayah, creator in circle | 55:21 (fetched), meaning in Fraunces; held still | Quranic text |
| 17 | 72.93–76.28 | follow kar lo | Creator full screen | Follow animation with real Instagram and Facebook icons; like/comment with "Which viral claim should we check next?" | — |

Mid-video CTA (2–3 s, clear of hook and payoff): around 35.8–38.7 (beat 11).

## Captions

`punch`, Anton caps ~96 px. Spelling only from `script.txt`. Hidden in the hook (the hook words
carry it) and under every Ayah while it is the hero. Full screen speaker: foot at y ≈ 470 (above
the cap). Splits and circles: placed per layout, off the face.
