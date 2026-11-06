# QA: "Quran mein zameen flat?" against QUALITY.md (2026-11-07)

State: edit built and checked on still frames only. No render yet (not local, not GitHub).
**Not finished:** gates fail or are unchecked below. Stills are in `out/preview/flat-earth/`
(not committed); `stills.mjs` there renders any frames without a full render.

## The take against the script

The creator cut the take and dropped or changed some words. `script.txt` now holds the
take's wording, so captions match the voice; draft 4 is kept as `script.original.txt`.
Whisper skipped 34.7–37.2 s and 49.3–62.8 s on the first pass; those stretches were
transcribed alone and joined (`merge_transcript.py`). The creator confirmed the updated `script.txt` on 2026-11-07.

| Line | Draft 4 | Take |
| --- | --- | --- |
| 2 | …zameen ko *anda* bola hai | …zameen ko *ande* jaisa bola hai |
| 3 | Maine dono check kiye. Sach bataun? Dono hi galat nikle. | Maine dono ko check kiya, aur sach bataun, dono galat nikle. |
| 4 | …verse 20 mein word hai | …verse number 20 mein ek word hai |
| 6 | …ho rahi hai? | …ho rahi thi? |
| 8 | …kaise *bichhayi* gayi | …kaisi *bichhayi* gayi |
| 9 | …oont pe baitha hai | …oont par baitha hai |
| 11 | Kuch purane scholars ne bhi ise flat hi samjha tha, jaise Tafsir Jalalayn. | Kuch purane scholars bhi ise flat hi samajh rahe the. (Jalalayn not named; no card either, by the creator's choice) |
| 12 | …ball ka har hissa *flat* hi dikhta hai | …ball ka har chhota hissa *flat* hi dikhta hai |
| 13 | Tum abhi jahan khade ho, zameen flat lag rahi hai na? | Tum abhi jahan pe khade ho ya baithe ho, toh zameen flat hi lag rahi hai na? |
| 14 | Surah Nazi'at ke verse 30 mein word hai "dahaha" | Surah Nazi'at ke ayat number 30 pe ek word hai, "dahaha" |
| 15 | Par dictionary mein iska matlab bhi wahi hai, *phailana*. | Par iska matlab bhi hai, *phailana*. |
| 17 | …aur usi ko "udhiyy" kehte hain. | …Uske liye Arabic mein doosra word hai. (udhiyy not said; shown on screen as that word) |
| 18 | …flat zameen nikaal li. Doosre ne anda. | …flat zameen nikaali, aur doosre ne anda. |
| 19 | Aur verse bas itna keh raha tha, dekho… kaise | Aur verse sirf itna keh raha hai ki dekho… kaisi |
| 20 | Aise aur viral claims ke liye follow kar lo. | Aise aur videos ke liye follow kar lo, aur video ko share bhi kar dena. |

Lines 1, 5, 7, 10 and 16 match. Nine caption words have loose timing
(`work/flat-earth.captions_review.txt`); none sits on an Ayah card's Arabic.

## Gates

| § | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 0 | Eyes at y ≈ 640, chin above 1050 | **Fail (eyes)** / pass (chin) | `track_face.py` aim point (between eyes and mouth) y 709–774, so the eyes sit around y 690–750, 50–110 px low. Chin about y 950. Captions at 1214–1310 still sit on the chest in every still. A recording note for next time, not fixable in the edit. |
| 1 | Opens on full-screen visuals; creator after, at a sentence break | Pass (stills) | Speaker off 0–5.77 s; appears on the creator's cut at 5.77 ("Maine dono…"). `hook_0-3s.jpg`, `hook_3.5-6s.jpg` |
| 1 | Frame 0 is the thumbnail, not black/logo/fade | Pass (still) | Frame 0: Ferguson disc + "FLAT EARTH?" + VIRAL CLAIM tag. |
| 1 | Frame 0 reads at 270 px; subject ≥ 40 %, strong contrast | Pass (still), measured by eye | `frame0_270.jpg`: the line and the map read at 270 px. The disc covers y ≈ 600–1640 across the full width, about 50 % of the frame. Ink on sand, high contrast. |
| 1 | Motion from frame 0; change every ≤ 1.5 s, 4+ beats | Pass on paper and stills | Push from frame 0. Beats 0.0 map, 0.5 jump closer ("flat"), 1.3 post, 2.3 hard cut to the egg, 3.6 globe snaps in, 4.82 "?" stamps, 5.77 speaker = 7 beats; longest gap 1.3 s. Still to measure on a render with `study_reel.py --ours`. |
| 1 | Each beat a new idea for the eye | Pass (stills) | Map, post, egg photo, Earth photo, stamps, speaker. |
| 1 | Key word said and shown within 1.5 s | Pass | "flat" is spoken at 0.50 s and "FLAT EARTH?" is on screen from frame 0. |
| 1 | Opens a gap | Pass | "…Quran mein likha hai" → "egg" → "dono galat nikle" (8.5 s). |
| 1 | Sound at frame 0; every beat has a sound cause | Built, **unchecked** | Voice from 0.00 s plus an impact cue at frame 0; tick, whoosh, whip, snap and stamp cues on the beats (`sfx.ts`). Not heard: no render yet. |
| 1 | Muted test, first 3 s | Pass (stills) | "FLAT EARTH?" + map + "The Quran says the earth is flat!" Captions are hidden in the hook, because the posts carry the claim. |
| 1 | 3 storyboards in `plan.html`, one picked; `study_reel.py --ours` on the render | Partly | `plan.html` exists and Claude picked (beats.md). `study_reel.py --ours` **not run** (needs the render). |
| 2 | No pause over 0.5 s, `lostWords` empty | Pass | `work/flat-earth.auto_edit.json`: 74.37 s kept, 0 retakes, `untranscribedSoundKept` [], `lostWords` []. |
| 2 | Change every 2–4 s; no shot unchanged past 4 s | Pass on paper | Longest still stretch: 9.0–12.2 s on the 88:20 card (3.2 s before the push to the ring). Speaker stretches ≤ 3.0 s before a punch, card or cut (line 11: close 33.0–34.46, wider 34.46–37.47). |
| 2 | Payoff before the swipe; last line holds ≥ 2 s | Pass on paper | The 88:20 card is held 4.5 s (66.7–71.17); the end card runs 3.2 s. |
| 2a | Spoken CTA: one line under 3 s, tied to the topic | **Fail, kept by the creator** | 71.04–74.2 s (about 3.1 s), and it says "videos", not "viral claims", plus a share ask. The creator chose on 2026-11-07 to keep the CTA as spoken. The gate stays failed on paper. |
| 2a | Follow animation with real, unaltered IG/FB icons; like + comment with a question | Pass (stills) | `Cta.tsx` with the Simple Icons glyphs, sourced to Meta brand resources (`credits.txt`). Comment question: "Which viral claim should we check next?" |
| 2a | CTA at end and 1–2 times mid-video, never in the hook or payoff, not on the face, clear of the rail | Pass (stills) | Mid-video 47.36–49.9 s on the chest at y 1030, x 237–842 (frame 1455); end 71.2–74.37 s. |
| 3 | `face` in edit.json, misses < 5 % | Pass | 372 samples, 0 missed (0 %). |
| 3 | Face never cut off by a zoom, card or the circle | Pass (stills) | Frames 172, 258, 1455, 1710, 1760: cards sit beside or below the head; the circle shows cap to beard. |
| 3 | Zoom ≤ 1.16; emphasis words get a punch-in; every cut changes framing | Partly | Max zoom 1.16 (`punchToZoom`, camera MAX_ZOOM). Every visible cut changes framing or picture, including 58.3 inside the circle (1.0 → 1.12). **Emphasis punches: none visible.** All 8 starred words fall on full-screen graphics, where the ring, stamp or label marks the word instead. |
| 4 | Hinglish Roman captions from `script.txt`, timing from Whisper; creator confirmed the script | Pass | Spelling comes from `script.txt` (267/267 words matched); the creator confirmed the updated script on 2026-11-07. |
| 4 | Other text English; Ayah in Arabic; terms with their meaning | Pass | All labels, tags and cards are English; Arabic only from `src/data/quran` (and udhiyy from Lane); *sutihat* / *dahaha* / *udhiyy* each come with "= meaning". |
| 4 | 2–4 words a group, one at a time, spoken word highlighted | Pass | `regroup()` in `build_edit.py`: 94 groups, min 2, max 4; ledger caption style. |
| 4 | Caption position follows the shot; clear of graphics and face | Pass (stills) | Band foot y 1310; rides up to the speaker window in the stacks; hidden only in the hook. Credits moved to y 1160 after they clashed. |
| 4 | Text inside y 168–1330, clear of the right rail, nothing under 28 px | Pass (stills, after fixes) | Fixed: "Illustrative posts" note (was at y 1420), lower-half cards pulled in to right 140. Highest text: egg-half tag at y 190. |
| 5 | Every graphic serves its sentence; full-screen claims tagged | Pass | Tags: VIRAL CLAIM, QURANIC TEXT, LINGUISTICS, TRANSLATION (PARAPHRASE), QURANIC CONTEXT, SCHOLARLY VIEW, ESTABLISHED SCIENCE, VERDICT. |
| 5 | Titles land and hold; exits 40–50 % shorter; ease-out arrivals | Pass in code | arrive 10–12 frames ease-out exp; leave 5–6 frames; stamps slam in 4 frames then hold. Motion not yet seen. |
| 5 | 3–5 kinds of transition, each with a cause | Pass on paper | Hard cut on the creator's cuts, slide-up (posts, lexicon card), snap (egg/globe), the board rising (stack), circle shrink (PiP). |
| 5 | Look written as numbers; one accent | Pass | beats.md "Look": #EFE4CF / #1B1B1B / #6E665C / accent #E4572E (rings, stamps, Surah:Ayah tags only). |
| 5 | Layout chosen per beat and varied | Pass | Full-screen graphic, speaker full, speaker + side cards, Ayah card, full B-roll, stack ×3, circle PiP. |
| 6 | −14 LUFS ±1, TP ≤ −1 dBTP; voice clear; SFX 3–6 dB over the bed | **Unchecked** | Needs the render + `finalize.py`. No music. |
| 7 | Speaker graded; TV range, yuv420p; 1080×1920 30 fps H.264 + AAC 48 kHz | **Unchecked** | Grade set (contrast 1.04, saturation 1.03, vignette 0.12); the rest needs the render + `finalize.py`. |
| 8 | Accuracy rules; sources in credits.txt | Pass, one open item | Quranic text read only from `src/data/quran` (AyahLine, fetched by `fetch_ayah.py`); translation labelled as after Sahih International and paraphrase; The Razi card carries its source and dates (Razi is named in the take); line 11 names no scholar on screen, by the creator's choice, and its sources stay in research.md and credits.txt. |
| 9 | Contact sheet of the render, frames around every cut, ebur128 | **Unchecked** | No render yet. |

## Before the final render

1. Done 2026-11-07: script confirmed; spoken CTA kept as recorded (§2a stays a failed gate).
2. A short GitHub preview render of 0–6 s and one stack beat, to hear the sound and see the
   motion; then `render_on_github.py`, `finalize.py`, `study_reel.py --ours` and the §9 review.
