# QA: "Suraj chiragh hai, chaand nahi" (final render)

File: `projects/chaand-nur/chaand-nur-final.mp4` (GitHub run 43608696682, branch
`feat/chaand-nur-reel` at 71adf70, finished with `scripts/finalize.py`). 68.2 s. Checked 2026-11-14.
Evidence (laptop only, not committed): `final_hook.jpg`, `final_frame0_270.jpg`,
`final_contact_sheet.jpg` (every 2 s), `final_cuts.jpg` (the frame before and after all 14 scene cuts).

History: the first render (run 43603540989, flat 2D graphics) failed the hook gates (beats 0.0 and
3.1 s only) and the creator rejected its look ("jyadatar texts the … promising nahi the"). The reel
was rebuilt in a 3D sky; the creator approved a 7 s hook preview (run 43604769983) before the rest
was rebuilt. Run 43606008616 then showed the dead Sun as a black dot outside the hook and a 1.7 s
end card (both fixed); the creator confirmed the script and that "ke liye" is said after the
durood (put back, timed by hand from the voice). Runs 43607888022 and 43607991903 were
superseded and cancelled.

| Gate | Result | Evidence |
| --- | --- | --- |
| 0. Recording: eyes near y 640 | Not applicable | Faceless reel by design (series brief, research.md) |
| 1. Creator on screen from frame 0 | Not applicable | Faceless: the creator's voice only |
| 1. Frame 0 is a strong thumbnail, reads at 270 px | PASS | `final_frame0_270.jpg`: the 3D Moon and burning Sun with "If the Sun went out now…"; frame-0 contrast 60.7 |
| 1. Picture change at least every 1.5 s, 4+ beats | PASS | study_reel.py: beats 0.0, 1.0, 2.1, 2.7, 2.9, 3.0, 3.1, 3.4, 4.9, 5.6, 5.8 s; longest still 1.5 s |
| 1. Key word inside 1.5 s, gap opened | PASS | "Suraj abhi bujh" by 0.8 s, the line on screen from frame 0; the gap: the Moon goes out too |
| 1. Sound at frame 0; muted test | PASS | Sound from 0.0 s (voice + sub-hit); title, the dying Sun, the travelling ring with `08:20` and the dark Moon carry it muted |
| 1. Three hook storyboards in plan.html; judged against references | PASS | `plan.html` had 3 hook options, the creator took the first; the rebuild follows the Nitish Rajput reference (one continuous 3D world) and the preview was approved |
| 2. No pause over 0.5 s; no words lost | PASS | build_voice.py: one 0.54 s pause shrunk to 0.32 s; the whole take kept (no retakes, nothing cut), Whisper on the cut's spliced end clean |
| 2. Change every 2–4 s | PASS | `final_contact_sheet.jpg`; longest hold 2.4 s (60.5 → 62.9 s, payoff line, then siraj) |
| 2. Payoff before the swipe; last line holds 2 s+ | PASS | "One lamp in the sky." 60.5–63.6 s; end Follow card 65.8–68.2 s (2.3 s) |
| 2a. Spoken CTA, Follow + like/comment, 1–2 mid | PASS | "Follow kar lo" 65.9–66.5 s; comment card "Which Quran ‘fact’ forward have you seen most?" 63.6–65.7 s; mid Follow card 44.4–47.0 s (proof footage, not hook or payoff); real Instagram and Facebook icons |
| 3. Face tracked, zoom, face never cut | Not applicable | No speaker on screen |
| 4. Captions Hinglish, spelling from script.txt, confirmed | PASS | build_props.py (spelling from script.txt, timing from Whisper + hand-measured line 11); the creator confirmed the script 2026-11-14 |
| 4. Other text English; Ayah in Arabic script | PASS | Contact sheet; Arabic only from the fetched JSONs (71:16, 24:35, 25:61, 33:46, 78:13) |
| 4. 2–4 words per caption group | PASS | 80 groups: 25 of 2, 36 of 3, 19 of 4 words |
| 4. Captions off graphics, look named | PASS | `editorial` (Plus Jakarta Sans + Newsreader), foot y 1310, graphics text above y 1076; captions off in the hook, under the recited Ayah and under the end card |
| 4. Text inside y 168–1330, 28 px+, clear of the rail | PASS | Stills and contact sheet; smallest text 28 px ("Forwarded many times" on the phone) |
| 4. Arabic glyphs on the Linux render | PASS | Frames 15.9–63.4 s from the GitHub render: no boxes; rings land on نورا, سراجا, نور |
| 5. Graphics serve their sentence; claim tags | PASS | Every full-screen claim carries its credit line (Established science, Viral claim, Quranic text, Translation, Linguistic observation, Numerical observation, Historical record, Interpretation) |
| 5. Transitions: 3–5 kinds with a cause | PASS | Hard cuts on line starts, camera pull-backs and dollies in the 3D sky, cards landing on a 3D tilt, the "1400" burst, falls (phone, "[reflected]"), the lamp's split rise |
| 5. Look written as numbers, calm, not the last reel's palette | PASS (note) | beats.md Look; night ink, ivory, one amber accent (the Sun, the lamp, siraj). Note: the Sun is the most saturated thing on screen, as the subject of the accent |
| 5. Editor check (no template tells) | PASS (note) | Real paper cards, hand rings, one big phrase per screen. Note: the phone forward is a generic illustration of the viral message (no app, no account), labelled "Viral claim" |
| 6. −14 LUFS ±1, true peak ≤ −1 dBTP | PASS | ebur128 on the final MP4: I −14.0 LUFS, peak −1.8 dBTP |
| 6. Voice clear, sfx with causes, music | PASS | Voice cut approved by the creator; each sfx one frame after its picture, ticks rotate three takes; no music (none approved) |
| 7. Picture: TV range, format | PASS | ffprobe: h264 1080x1920 30 fps yuv420p color_range=tv, AAC 48 kHz, moov before mdat (faststart) |
| 8. Accuracy, sources | PASS | research.md claim ledger; credits.txt (images, textures, Quran sources, NASA, Parmenides tr. Burnet) |
| 9. Contact sheet, cuts, loudness | PASS | `final_contact_sheet.jpg`, `final_cuts.jpg` (14 cuts, no stray frames), ebur128 above |

Not checked by Claude: how the joins and the sound effects sound (the creator's ear), how the
reel looks after an Instagram/Facebook upload, the cover image and upload copy (not made yet).
