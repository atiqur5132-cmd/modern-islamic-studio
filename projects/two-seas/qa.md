# QA: "Do samandar jo mix nahi hote?" (final render)

File: `projects/two-seas/two-seas-final.mp4` (GitHub run 43427994168, branch `feat/two-seas-reel`
at f47436d, finished with `scripts/finalize.py`). 76.67 s. Checked 2026-11-13.
Evidence files: `final_hook.jpg`, `final_frame0_270.jpg`, `final_contact_sheet.jpg` (every 2 s),
`final_cuts.jpg` (the frame before and after all 34 cuts and graphic entrances).

Earlier renders: run 43419543282 failed the hook beat gate (beats 0, 2.5, 4.3 s: a punch-in on the
same water and a slow shrink did not register); run 43422953166 still had 3.3 -> 5.5 s with no beat
(the swap inside the small plate). Both fixed; run 43427169116 broke on a half-uploaded footage
release after a dropped connection and was re-run clean.

| Gate | Result | Evidence |
| --- | --- | --- |
| 0. Recording: eyes near y 640 | FAIL (worked around) | Eyes y ≈ 885, beard to y ≈ 1230. Captions moved above the cap when the speaker is full frame (foot y 415). Next shoot: camera lower / tilted down |
| 1. Creator on screen from frame 0 | Overridden by the creator | Their instruction for this reel: not on screen in 0–5.57 s. Creator appears at 5.57 s |
| 1. Frame 0 is a strong thumbnail, reads at 270 px | PASS | `final_frame0_270.jpg`: the green/ochre line with "Two seas." |
| 1. Picture change at least every 1.5 s, 4+ beats | PASS | study_reel.py: beats 0.0, 1.4, 2.5, 3.3, 4.3, 5.5 s; longest still 1.4 s |
| 1. Key word inside 1.5 s, gap opened | PASS | "Do samandar" at 0.1 s, "mix nahi hota" by 3.1 s; a claim the reel then breaks |
| 1. Sound at frame 0; muted test | PASS | Sound from 0.02 s; "Two seas. That never mix?" and the quoted claim carry it muted |
| 1. Three hook storyboards in plan.html | NOT DONE | The creator trusts first picks (memory); one hook was built and shown as stills |
| 2. No pause over 0.5 s, lostWords empty | PASS | auto_edit.py: one segment, lostWords [] |
| 2. Change every 2–4 s | PASS | `final_contact_sheet.jpg`; layouts change on the creator's 30 jump cuts |
| 2a. Spoken CTA, follow + like/comment, 1–2 mid | PASS | "follow kar lo" at 75.7 s; follow card mid (35.85 s) and end (74.95 s); comment card (73.35 s). End follow card is 1.3 s, shorter than the 2–3 s target |
| 3. Face tracked, under 5% missed | PASS | track_face.py: 0% missed |
| 3. Zoom ≤ 1.16, face never cut | PASS | Max zoom 1.12 (punch); `final_cuts.jpg` |
| 4. Captions Hinglish, spelling from script.txt, confirmed | PASS | Creator confirmed the script (incl. "mixing ko") |
| 4. Other text English, Ayah in Arabic script | PASS | Contact sheet |
| 4. Text inside y 168–1330, clear of the rail | PASS | Stills and contact sheet |
| 4. Captions off the face and graphics | PASS | Above the cap full frame, in the board band in splits, hidden under the pull quote and CTAs |
| 5. Claim tags, look written as numbers, 3–5 transitions | PASS | beats.md Look; cut, circle, split board, cover, burst |
| 6. −14 LUFS ±1, true peak ≤ −1 dBTP | PASS | ebur128 on the final MP4: −13.9 LUFS, peak −2.1 dBTP |
| 6. Music with the creator's approval | PASS | Their nasheed, about 20 dB under the voice |
| 6. Voice clear on a phone; SFX 3–6 dB over the bed | NOT CHECKED BY EAR | Claude cannot listen; the voice/music mix was approved by the creator, the sound effects were not heard |
| 7. TV range, 1080×1920, 30 fps, H.264 + AAC 48 kHz, faststart | PASS | ffprobe: yuv420p, color_range=tv, 30/1, aac 48000; moov at the front |
| 8. Accuracy, sources in credits.txt | PASS | References verified; Ayahs fetched and cross-checked; Gibraltar exchange checked (Ocean Science 2018) |
| 9. Contact sheet, cut frames, loudness | PASS | Files above. Arabic glyphs clean on the Linux render |
| Cover held for the last 0.5 s | PASS | 76.17–76.67 s |
