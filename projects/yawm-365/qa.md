# QA: Yawm 365 against QUALITY.md

File: `out/yawm-365/yawm-365-final.mp4` (GitHub run 42108061483, commit 9b876da, then
`scripts/finalize.py --final`). Checked 2026-11-06. Evidence files in `out/yawm-365/`:
`contact-2s.jpg` (a frame every 2 s), `cuts.jpg` (the frame before and after each of the
21 cuts), `frame0.png`, `cta-crop.png`.

**Verdict: not finished.** Three gates fail and two are unchecked; see the end.

## 0. Recording

| Gate | Result | Evidence |
| --- | --- | --- |
| Eyes at y ≈ 640, chin above y ≈ 1050 | **FAIL** | Eyes at y ≈ 820, chin at y ≈ 1060 (still at 10 s). Captions still sit on the chest (band 1100–1310). Only a reshoot fixes it: camera a little lower or phone a little higher. |

## 1. Hook

| Gate | Result | Evidence |
| --- | --- | --- |
| Full-screen graphics first, creator at a sentence break | Pass | Graphics 0–5.43 s; creator appears at the cut after "utne hi" (5.43 s, a little past the usual 3–5 s). |
| Frame 0 is the thumbnail | Pass | `frame0.png`: يوم, 365, "‘DAY’ = 365 TIMES?", tag. |
| Claim spoken and shown within 1.5 s | **FAIL (strict)** | Shown at 0 s; spoken from 0.0 s, but "365" itself is said at 2.0 s. Fixable only by re-recording the first line. |
| Muted test, first 3 s | Pass | The word, the number and the question read without sound. |

## 2. Pacing

| Gate | Result | Evidence |
| --- | --- | --- |
| No pause over 0.5 s; lostWords empty | Pass | silencedetect (−40 dB, 0.5 s): 0 found. `work/yawm-365.auto_edit.json`: lostWords []. |
| A change every 2–4 s, no shot unchanged past 4 s | Pass | 21 cuts plus graphic beats; the longest shot (36.1–41.4 s) changes at 36.4, 37.3, 39.2, 40.7. |
| Payoff in time; last line holds ≥ 2 s | Pass | Last line card 62.0–67.0 s (5 s), kept on through the follow card. |

## 2a. Call to action

| Gate | Result | Evidence |
| --- | --- | --- |
| Spoken CTA, one line under 3 s, after the last line | Pass | "Aise aur viral claims ke liye follow kar lo." 64.7–66.9 s (2.2 s). |
| Follow animation with real icons; like + comment with a specific question | Pass | End follow card (Instagram + Facebook glyphs); `cta-crop.png`: "Which rule is fair: 445 or 365?" |
| End + 1–2 mid; not in hook/payoff, not on the face, clear of the rail | Pass | One mid card 44.3–47.3 s in the headroom, centred; end card on the chest. |

## 3. Camera

| Gate | Result | Evidence |
| --- | --- | --- |
| track_face ran, face missed < 5% | Pass | 335 samples, 0 missed. |
| Face never cut off by zoom, card or circle | Pass | `contact-2s.jpg`, `cuts.jpg`: cards above the cap, stack window shows cap to chest, circle shows cap to beard. |
| Zoom ≤ 1.16 | Pass | Shot zooms 1.0–1.1, clamp at 1.16. |
| Emphasis words get a punch-in | **FAIL** | Every emphasised word (365, 475, 445, 375, 365, 354, wah) lands on a graphic (hook, board, moon) or under the posts, where the graphic lands on the word instead; the camera never punches in this reel. |
| Every cut changes framing or picture | Pass | `cuts.jpg`: 21 of 21 (after the second render). |

## 4. Captions and on-screen text

| Gate | Result | Evidence |
| --- | --- | --- |
| Hinglish, spelling from script.txt, timing from Whisper | Pass | make_captions: 197 of 197 script words matched. |
| Creator confirmed the script | Pass | The pre-shoot script was approved; `script.txt` was then matched to the take, and on 2026-11-06 the creator confirmed the two words read from the audio: "aaya" (line 3) and "Jaise" (line 12, about 38.5 s). |
| English elsewhere; Arabic from verified Ayahs | Pass | Words from 1:4, 2:203, 99:4, 32:14, 43:83 via fetch_ayah.py. |
| 2–4 words a group, one group at a time, spoken word marked | Mostly | 66 of 70 groups have 2–4 words; three single words ("wah!", "445.", "365.") and one of five. |
| Position follows the shot | Pass | Captions ride up with the stack window; band elsewhere. |
| Text inside y 168–1330, clear of the rail, ≥ 28 px | Pass | Lowest board text ≈ y 1326; smallest text 28 px. |
| Never on the face, never repeating a graphic | Pass | Sheets above. |

## 5. Motion graphics

| Gate | Result | Evidence |
| --- | --- | --- |
| Every graphic serves its sentence | Pass | beats.md. |
| Full-screen claims tagged | Pass | VIRAL CLAIM, NUMERICAL OBSERVATION, ESTABLISHED SCIENCE, SCHOLARLY VIEW. |
| Titles land and hold still; exits shorter | Pass | Entrances 10–12 frames, exits 5–6; the moon cuts in and out. |
| 3–5 transition kinds, each with a cause | Pass | Hard cut, board rise, circle shrink/grow, card land, dots falling. |
| Look written as numbers; one accent; no dark void | Pass | beats.md "Look"; orange only for the count (the CTA keeps the platforms' own icon colours); black only under the moon. |
| Layout chosen per beat and varied | Pass | Graphic, speaker, circle, stack, full-screen footage, headroom cards. |

## 6. Sound

| Gate | Result | Evidence |
| --- | --- | --- |
| −14 LUFS ±1, true peak ≤ −1 dBTP | Pass | finalize.py: −14.0 LUFS, −1.8 dBTP; ebur128 on the file: I −14.0, LRA 1.8. |
| Voice clear on a phone speaker; nothing clips | **UNCHECKED** / Pass | Not listened to on a phone. Peak −1.8 dBFS. |
| Effects: cause on screen, one frame after, 3–6 dB over the bed | Pass by design / **UNCHECKED** by ear | Cues are computed from the graphics (sfx.ts, AFTER_PICTURE = 1); there is no music bed, and the level over the voice was not judged by ear. |
| Repeated sounds rotate | Pass | Whooshes and soft ticks rotate three takes. |
| Music only with approval | Pass | No music. |

## 7. Picture

| Gate | Result | Evidence |
| --- | --- | --- |
| Speaker graded, natural skin | Pass (by eye) | Contrast 1.04, saturation 1.03, cool shadows / warm highlights; judged on stills, not scopes. |
| TV range, yuv420p | Pass | ffprobe: yuv420p, color_range tv. |
| 1080×1920, 30 fps, H.264 + AAC 48 kHz, +faststart | Pass | ffprobe: h264 High, aac LC 48 kHz, moov before mdat, 67.0 s. |

## 8. Accuracy

| Gate | Result | Evidence |
| --- | --- | --- |
| CLAUDE.md accuracy rules | Pass | research.md ledger; counts recomputed on two data sets; credits.txt lists every source and asset. |

## 9. Review

Contact sheet, frames around every cut, and loudness on the final file: done (above).
Graphic entrances that are not on cuts (posts, mid CTA, card lines) were checked on stills
of the same code and on the ledger motion preview, not frame by frame in this file.

## Open

1. **Fail, reshoot only:** framing (gate 0); "365" spoken at 2.0 s (gate 1).
2. **Fail, fixable:** no camera punch-ins (gate 3) — allow punches in the stack window on the spoken totals, or accept the graphics as the emphasis.
3. **Unchecked:** the creator listens on a phone for voice clarity and effect levels.
4. **Minor:** four caption groups outside 2–4 words.

## Creator's decision (2026-11-06)

The creator accepted the reel as it is for upload, with the open items above: framing and
the 2.0 s "365" stay (reshoot only), the graphics stand in for camera punch-ins, and the
phone-speaker listen was not done here. The reel clears every other gate; it is not
recorded as having cleared the full bar.
