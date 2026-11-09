# QA: "America mein qibla north-east kyun?" against QUALITY.md (2026-11-09)

State: final render on GitHub (run 42655935258, commit 09104a0), finished by `finalize.py` into
`out/qibla/qibla-north-east-final.mp4` (not committed). Two earlier renders were reviewed and
rejected: run 42641659477 (hook still for 1.9 s; Ayah note under two-line captions; one blank
frame at 44.07 s from a texture race) and run 42645991670 (two globe labels overlapping at
37.6-40.1 s; hook without a claim-kind tag; "qibla" without its meaning), then run 42650240210
(the creator saw the second compass's title and calculation line hidden behind the dial; fixed,
). All were fixed.

**Not finished:** the gates marked fail or unchecked below. The creator has not watched the render.

## The take against the script

`script.txt` holds the take's wording, so captions match the voice; the draft is kept as
`script.original.txt`. Whisper skipped 26.7-46.8 s; that stretch was transcribed in pieces and
joined (`merge_transcript.py`). The creator approved the render with the script as listed
(2026-11-09, "Yes, render it"), including "pehla qibla" at 41.9 s and the 2:144 card.

| Line | Draft | Take |
| --- | --- | --- |
| 5 | Masjid galat nahi thi. | Masjid *galat* nahi thi. (emphasis only) |
| 8 | …kahin *khinchega*. | …kahin *stretch* ho jaayega. |
| 11 | …Makkah tak dhaaga *tight* karke lagao. | …Makkah tak ek dhaaga *tight* karke lagao. |
| 14 | Wo pehli direction hi Washington ka qibla hai. Masjid bilkul sahi bani thi. | Wo pehli direction hi Washington ka **pehla** qibla hai. / Toh masjid bilkul *sahi* bani thi. |
| 15 | Alaska mein toh qibla lagbhag seedha *north* hai, pole ke upar se. | Alaska mein toh qibla seedha, lagbhag *north* ki taraf hai, pole ke upar se. |
| 16 | …hazaar saal pehle spherical trigonometry se… | …hazaar saal pehle hi spherical trigonometry se… |
| 19 | Map jhooth nahi bolta… | Map *jhooth* nahi bolta… (emphasis only) |
| 20 | Roz dikhne wali cheezon ke peeche ki aisi baatein chahiye, toh channel follow kar lo. | Follow kar lo, aise hi fascinating videos ke liye. |

## Gates

| § | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 0 | Eyes at y ≈ 640, chin above 1050 | Pass | Frame at 52.2 s with a 100 px grid (`final_chin_grid.jpg`): eyes at y ≈ 610, beard tip at y ≈ 940. `track_face.py` aim point y 623-683. Captions (y ≈ 1210-1310) sit on the chest. |
| 1 | Opens on full-screen visuals; creator after, at a sentence break | Pass | Speaker off 0-5.23 s; appears on the creator's own cut before "1953" (`final_hook.jpg`). |
| 1 | Frame 0 is the thumbnail, not black/logo/fade | Pass | Frame 0: prayer hall of the Islamic Center of Washington, compass, HISTORICAL RECORD / NORTH-EAST? / "The qibla (prayer direction) in America". |
| 1 | Frame 0 reads at 270 px; subject ≥ 40 %, strong contrast | Pass | `final_frame0_270.jpg`: NORTH-EAST? and the compass read at 270 px; the compass ring is 760 px of 1080 (70 % of the width); frame-0 contrast 44.4. |
| 1 | Motion from frame 0; change every ≤ 1.5 s, 4+ beats | Pass (measured) | `study_reel.py --ours` on the final file: beats 0.0, 1.2, 1.9, 2.7, 3.6, 4.2, 4.3, 5.2, 5.4, 5.5 s; longest still 1.2 s. The needle swings from frame 0. |
| 1 | Each beat a new idea for the eye | Pass | Prayer hall + swinging needle; the lock with a jump in on the mihrab; the minaret; the map; the map punching in on the line; SOUTH-EAST with the map snapping out; the speaker with the 1954 photo. |
| 1 | Key word said and shown within 1.5 s | Pass | "north-east" spoken at 1.20 s; NORTH-EAST? on screen from frame 0. |
| 1 | Opens a gap | Pass | Qibla north-east, but the map says south-east: who is wrong? |
| 1 | Sound at frame 0; every beat has a sound cause | Pass | Sound from 0.0 s (measured). Cues (`sfx.ts`): impact at 0, tick on the lock, whooshes on the two hard cuts, soft tick on the line, impact on SOUTH-EAST, whoosh as the board rises. |
| 1 | Muted test, first 3 s | Pass (frames) | HISTORICAL RECORD / NORTH-EAST? / "The qibla (prayer direction) in America" over a mosque, then the minaret with the NE arrow, then THE MAP SAYS. Captions are hidden in the hook. |
| 1 | 3 storyboards in `plan.html`, one picked; `study_reel.py --ours` on the render; hook judged against `references/LIBRARY.md` | Partly | `plan.html` has 3 hook storyboards; Claude picked option A by the creator's standing choice. `study_reel.py --ours` ran; `final_hook.jpg` and `final_frame0_270.jpg` sent to the creator. **Not done:** a side-by-side against the reference library reels. |
| 2 | No pause over 0.5 s, `lostWords` empty | Pass | `work/qibla-north-east.auto_edit.json`: 65.73 of 65.76 s kept, 0 retakes, `untranscribedSoundKept` [], `lostWords` []. |
| 2 | Change every 2-4 s; no shot unchanged past 4 s | Pass | 31 shots on the creator's cuts, the longest 3.63 s (30.6-34.2, while the map wraps into the globe and the string snaps tight). `final_contact_sheet.jpg` (every 2 s): no two neighbouring frames alike. |
| 2 | Payoff before the swipe; end card short; last line holds ≥ 2 s | Pass | "The map isn't lying. It's stretched." lands at 61.4 and holds still to 63.73 (2.3 s); the end card runs 2.0 s. |
| 2a | Spoken CTA: one line under 3 s, tied to the topic, asks for a follow | **Partly** | "Follow kar lo, aise hi fascinating videos ke liye", 63.72-65.6 s (1.9 s), asks for a follow; **not tied to the topic**. The creator's own wording, kept by their standing choice (take-over-script). |
| 2a | Follow animation with real, unaltered IG/FB icons; like + comment with a question | Pass | `Cta.tsx` (icons checked for flat-earth); comment question "What's the qibla direction from your city?". |
| 2a | CTA at the end and 1-2 times mid-video, not in the hook or payoff, not on the face, clear of the rail | Pass | Mid-video 51.95-54.45 s (2.5 s) on the chest, card x 236-844, y ≈ 1000-1100 (`final_chin_grid.jpg`); end card 63.75-65.77 s. |
| 3 | `face` in edit.json, misses < 5 % | Pass | 329 samples, 0 missed. |
| 3 | Face never cut off by a zoom, card or the circle | Pass (frames) | `final_cuts.jpg`, `final_contact_sheet.jpg`: the circle shows cap to beard; stack windows show the full head; the RIGHT ALL ALONG chip sits below the beard (y 975). |
| 3 | Zoom ≤ 1.16; emphasis words punched; every cut changes framing | Pass | Shot zooms ≤ 1.12, punches to 1.16 (`punchToZoom`). Punches on *galat* (13.1), *sahi* (43.5), *jhooth* (60.2); the other starred words fall on full-screen graphics, which mark them (needle lock, SOUTH-EAST, STRETCHES, the string snapping on "tight", ALMOST DUE NORTH, the payoff line). Every cut changes picture or zoom. |
| 4 | Hinglish Roman captions from `script.txt`, timing from Whisper; script confirmed | Pass | 252 of 253 script words matched to spoken words; 14 words with loose timing listed in `work/qibla-north-east.captions_review.txt`; "jaayega" fixed by hand (24.36 s). The creator approved the render with this script on 2026-11-09. |
| 4 | Other text English; Ayah in Arabic; terms with their meaning | Pass | All labels and tags English; Arabic only on the 2:144 card, from `src/data/quran/2-144.json` (tokens 12-16, cut by code); "qibla" glossed as "prayer direction" in the hook. |
| 4 | 2-4 words a group, one at a time, spoken word highlighted | Pass | 93 groups, sizes 2-4 (`edit.json`); ledger look. |
| 4 | Caption position follows the shot | Pass (frames) | Hidden in the hook; ride up with the speaker window in the three stack shots; band foot y 1310 elsewhere, clear of the Ayah note (which ends at y ≈ 1060). |
| 4 | Text inside y 168-1330, clear of the right rail; nothing under 28 px | Pass (frames) | Lowest text: the hook chip at y 1260-1310, x 120-915; all labels ≥ 28 px (tags 28, sources 28, chips 34 and up). No text hidden behind a graphic: both compasses checked on the final file (, 8.5, 9.5, 40.4, 41.9 s). |
| 4 | Captions never cover the face or repeat a graphic | Pass (frames) | Hidden where the hook carries the words; the English graphics never repeat the Hinglish line. |
| 5 | Every graphic serves its sentence | Pass | `beats.md`: each graphic lands on the spoken word it shows. |
| 5 | Full-screen claims carry their tag | Pass | HISTORICAL RECORD, ESTABLISHED SCIENCE, NUMERICAL OBSERVATION · OUR CALCULATION, QURANIC CONTEXT + SCHOLARLY VIEW. The wall-map B-roll (no claim) is labelled THE MAP WE ALL LEARNED. |
| 5 | Titles land and hold still; exits shorter than entrances; long-tail arrivals | Pass | Arrivals ease out (exponential, 10-12 frames); titles and chips land in 4-5 frames and hold; graphics leave on hard cuts. |
| 5 | 3-5 kinds of transition, each with a cause | Pass | Hard cut (the creator's cuts); board rising (stack); circle shrinking and growing (PiP); the sheet wrapping into the globe and unwrapping (the reel's own idea); scale jumps (lock, line, SOUTH-EAST). |
| 5 | Look written as numbers; one accent with one meaning; no dark void, glow or particles | Pass | `beats.md` Look table; orange means the true qibla (string, needle, 56°, ALMOST DUE NORTH, RIGHT ALL ALONG, MAKKAH, the 2:144 label). The ledger captions colour numbers in their own count orange (#D9480F), as in earlier reels. |
| 5 | B-roll layout per beat, varied | Pass | Full-screen photo and map (hook), stack (3), full-screen graphic, circle PiP (3), full-screen B-roll, speaker + chest chip, speaker + mid CTA. |
| 6 | −14 LUFS ±1, true peak ≤ −1 dBTP on the file | Pass (measured) | FFmpeg `ebur128` on the final MP4: I −14.0 LUFS, true peak −1.8 dBTP, LRA 1.6 LU. |
| 6 | Voice clear on a phone speaker; nothing clips | **Unchecked (ear)** | True peak −1.8 dBTP, so nothing clips; clarity on a phone speaker not listened to (Claude cannot listen). |
| 6 | Effects: cause on screen, one frame after the picture, 3-6 dB over the bed, repeats rotate | Partly | Cause and timing set in code (`AFTER_PICTURE` = 1 frame); whooshes and soft ticks rotate 3 takes. **Level over the bed not measured.** |
| 6 | Music only with approval | Pass | No music. |
| 7 | Speaker graded: natural skin, no cast, no crushed shadows or clipped highlights | Pass (frames) | Grade contrast 1.05, saturation 1.02, vignette 0.10; skin natural on `final_chin_grid.jpg` and the contact sheet. |
| 7 | TV range | Pass | `ffprobe`: yuv420p, color_range=tv. |
| 7 | 1080×1920, 30 fps, H.264 + AAC 48 kHz, +faststart | Pass | `ffprobe`: h264 High 1080×1920 30/1, AAC LC 48000; `moov` before `mdat`. 65.8 s, 41 MB. |
| 8 | CLAUDE.md accuracy rules; sources in credits.txt | Partly | Ayah only via `fetch_ayah.py`; Whisper text never on screen; bearings recomputed (`make_maps.py`: Washington 56.5°, matching the 1953 record 56°33′ and Abdali's 56°35′; Anchorage 350.9° = Abdali's 9°06′ W of N); Greenland/Africa 14× checked on Wikipedia; every claim tagged; sources in `credits.txt`. Spoken "pole ke upar se": the Anchorage path passes within about 500 km of the pole (85.6° N) and the screen shows it passing beside the NORTH POLE mark. **Open:** the scholar check of line 19 ("direction ki taraf muh karna hi kaafi hai"), research.md claim 11. |
| 9 | Contact sheet every 2 s looked at | Pass | `final_contact_sheet.jpg`. |
| 9 | Frames before and after every cut and graphic entrance | Pass | `final_cuts.jpg`: 23 cuts × 3 frames, plus 37.7-39.5 s; no jumps or blank frames (render 1 had a blank globe frame at 44.07 s, fixed). |
| 9 | Loudness and true peak with `ebur128` on the final MP4 | Pass | Above (§6). |

## Not checked

- Listening: voice clarity on a phone speaker, and effect levels over the voice.
- The hook compared side by side with `references/LIBRARY.md`.
- The creator has not watched the render.
- The scholar check of the "direction kaafi hai" line before posting.
