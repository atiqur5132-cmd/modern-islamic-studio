# QA: "Duniya ki sabse purani university?" (render 44130907655)

Final file: `projects/oldest-university/oldest-university-final.mp4` (not committed), made by
`scripts/finalize.py` from the GitHub render of branch `feat/oldest-university` at fd4efdb
(76.4 s: the reel, then the cover held for 0.5 s). Checked 2026-11-17. The first render
(44121363077, at 11e1740) failed §4 on text size; this one fixes it.

| Gate | Result | Evidence |
|---|---|---|
| §0 Recording: eyes near y 640 | **Fail (worked around)** | Eyes at y ≈ 870, beard to y ≈ 1240; captions stand above the cap while the speaker fills the frame (`captionSpeakerBottom` 1505) |
| §1 Creator on screen from frame 0 | Pass | Split 0-2.5 s, circle 2.5-6.9 s (`final_hook.jpg`) |
| §1 Frame 0 reads at 270 px | Pass | `final_frame0_270.jpg`: face, two photos, "The world's oldest university?"; frame-0 contrast 65.2 |
| §1 Change every 1.5 s, 4+ beats | Pass | study_reel: beats 0, 1.4, 2.5, 3.7, 3.8, 4.6, 4.8, 5.4, 5.5, 5.7, 5.8; longest still 1.4 s |
| §1 Key word inside 1.5 s | Pass | "sabse purani university" said 0.64-1.84; "university" starts 1.44 |
| §1 Sound at frame 0 | Pass | Sound from 0.04 s (voice + soft hit) |
| §1 Muted test | Pass | The question is on screen from frame 0 |
| §1 Three storyboards before building | Pass | `plan.html` line 1-4, three options each; creator approved option A |
| §1 Judged against LIBRARY | Not checked | |
| §2 No pause over 0.5 s, `lostWords` empty | Pass | auto_edit: one segment, `lostWords` and `untranscribedSoundKept` empty |
| §2 Change every 2-4 s | Pass | Every line has its own picture; longest hold the Guinness quote (49.2-54.2 s) changes at 49.6 and 51.7 |
| §2 Last line holds 2 s | Pass | "al-Qarawiyyin" 70.39 → 72.6 s |
| §2a Spoken CTA under 3 s, topic-tied | **Fail (creator's wording kept)** | 4.8 s, as spoken in the take |
| §2a Follow + comment animations, mid-reel CTA | Pass | Follow card 39.4-41.85 s (52 %), comment card 72.7-74.4 s ("Nalanda or al-Qarawiyyin?"), Follow 74.4-76.1 s |
| §3 Face track | Pass | 381 samples, missed 0 % |
| §3 Face never cut, zoom ≤ 1.16 | Pass | punchToZoom 1.1; circle and stack keep the face (contact sheet) |
| §4 Captions from script.txt, timing from Whisper | Pass | make_captions: 239 of 243 words matched |
| §4 Creator confirmed the script | **Not confirmed in words** | The take's changes were listed on 2026-11-17; the creator did not object and approved the year fix |
| §4 English on-screen text, Arabic only for her name | Pass | |
| §4 Text inside y 168-1330 | Pass | Checked on stills and the contact sheet |
| §4 Nothing meant to be read under 28 px | Pass | Credits and labels 28 px or more (`Credit` in `src/overlays/uni/Scenes.tsx`); the coin's credit joined the scene credit line. The shared follow/comment cards are the existing `Cta` component |
| §4 STYLE caption look named | Pass | `editorial`, Plus Jakarta Sans + Instrument Serif (beats.md) |
| §5 Claim tags on full-screen graphics | Pass | Historical record / Later report / Record / Reconstruction in each credit line |
| §5 Look written as numbers, not the previous palette | Pass | beats.md: night umber, ivory, Nalanda brick |
| §5 3-5 transition kinds | Pass | Hard cuts, camera flights and whips (with motion blur), prints standing up, layout cuts, the face-off push |
| §5 No template tells | Pass | No stamps, ticks or eyebrow labels; type on the picture with a one-line credit |
| §6 −14 LUFS ±1, true peak ≤ −1 dBTP | Pass | finalize: −14.0 LUFS, −1.4 dBTP; the 0.5 s cover hold is silent (mean −91 dB) |
| §6 Voice clear on a phone speaker | Not checked | Claude cannot listen |
| §6 Music only with approval | Pass | No music |
| §7 TV range, 1080x1920, 30 fps, H.264 + AAC 48 kHz, faststart | Pass | ffprobe: yuv420p tv, 48000 Hz; moov at byte 36 |
| End cover (creator rule, 2026-11-13) | Pass | `OldestThumbnail` → `ou-cover.png` full screen 75.9-76.4 s; text reads at 128 px; checked in the 4:5, 3:4 and 9:16 crops |
| §8 Accuracy | Pass, with notes | research.md and credits.txt; Guinness wording read on its page; Dharmasvamin's figures from a summary of Roerich's translation (primary not opened); Khalji line dropped by the creator |
| §9 Contact sheet every 2 s | Pass | `final_contact_sheet.jpg` looked at |
| §9 Frames around every cut | Partly | The "-teen" cut (38.40-38.54 s) has no visible jump; other cuts judged from stills and the sheet only |
| Linux render: Arabic glyphs | Pass | فاطمة الفهرية joined, no boxes (43.6 s) |

Fixed in this render: the Fez label now sits clear of its pin; the Gupta coin's label no longer
crosses the Nalanda name.

Open: the two gates failed by choice or by the take (§0 framing, §2a CTA length as spoken), and
the checks only the creator can do (voice on a phone speaker, watching the motion), plus the
LIBRARY comparison.
