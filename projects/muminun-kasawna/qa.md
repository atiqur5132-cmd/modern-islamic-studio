# QA: "Fa-kasawnā: We clothed the bones" (final render, 2026-11-11)

**Approved by the creator on 2026-11-11.**

Final file: `projects/muminun-kasawna/muminun-kasawna-final.mp4` (not committed), from GitHub run
43035113556 on commit 2de6fcd, finished with `scripts/finalize.py`. Review sheets beside it:
`final_hook.jpg` (study_reel, every 0.5 s to 6 s), `final_frame0_270.jpg`, `final_contact_sheet.jpg`
(every 2 s), `final_cuts.jpg` (frames before and after all 15 layout changes).

Renders before this one: 43024445353 (hook failed the beat gates), 43029826841 (hook passed; the 23:14
pause mark showed as a box), 43032701110 (box still there). See beats.md and memory notes.

| § | Gate | Result | Evidence |
| --- | --- | --- | --- |
| 0 | Eyes about a third down, chin above y 1050 | Pass | Face centre y 675-781 (track_face); chin near y 960 on the take's stills |
| 1 | Creator on screen from frame 0 for 2-3 s+, with B-roll | Pass | Split 0-0.92 s, circle over the drop 0.92-3.43 s (final_hook.jpg) |
| 1 | Frame 0 readable at 270 px | Pass | final_frame0_270.jpg: face, the drop's crown, "You were once a drop."; frame-0 contrast 70.4 |
| 1 | Change at least every 1.5 s, 4+ beats | Pass | study_reel --ours: beats 0.0, 0.9, 2.0, 2.1, 3.4, 4.3, 5.6 s; longest still 1.3 s |
| 1 | Key word inside 1.5 s | Pass | "boond" spoken at 0.92 s, "a drop" on screen from frame 0 |
| 1 | Opens a gap | Pass | "You were once a drop": how does a drop become you? |
| 1 | Sound at frame 0 | Pass | Sound from 0.08 s (study_reel) |
| 1 | Muted test, first 3 s | Pass | The line over the drop beside the creator |
| 1 | Three hook storyboards in plan.html | Not done | Three storyboards were in beats.md (approved by the creator); no plan.html for this reel |
| 2 | No pause over 0.5 s, lostWords empty | Pass | auto_edit: one segment, lostWords [], no retakes |
| 2 | A change every 2-4 s | Pass | final_contact_sheet.jpg |
| 2 | Last line holds 2 s+ | Pass | End cards 60.3-64.75 s, the hand over the lens ends at 65.1 s |
| 2a | Spoken CTA under 3 s, tied to the topic | **Fail (creator's choice)** | The creator's own CTA, 58.5-65.1 s, kept as spoken, with "I'm very bad at call to action" |
| 2a | Follow animation, like and comment icons, a specific question | Pass | Comment card "Which word stayed with you: drop, clinging, or clothed?"; Follow card |
| 2a | CTA mid-video 1-2 times, 2-3 s, not in hook or payoff | Pass | Follow card 28.5-30.55 s (2.05 s), before the payoff word |
| 3 | Face tracked, missed under 5% | Pass | Missed 1 of 326 samples |
| 3 | Face never cut off; zoom at most 1.16 | Pass | Max zoom 1.12 (50.1 s); circle and splits checked on final_cuts.jpg |
| 4 | Captions from script.txt, timing from Whisper | Pass | make_captions.py; 10 word times split by hand in caption_times.json |
| 4 | Creator confirmed the script | Pass | The creator approved the final reel, captions as built from script.txt with the 8 take changes, on 2026-11-11 |
| 4 | Other text English; Ayah in Arabic script; terms with meaning | Pass | Word cards: Arabic, transliteration, English meaning |
| 4 | Editorial captions, no sticker look; 2-4 words; spoken word lit | Pass | captionStyle editorial, Plus Jakarta Sans 64 + Newsreader italic |
| 4 | Text inside y 168-1330, off the face, clear of graphics | Pass | Contact sheet; titles at y 172 clear the cap |
| 5 | Full-screen claims tagged | Pass | Credits: Quranic text, Quranic context, Linguistic observation, Established science, Classical tafsir, Historical record, Interpretation |
| 5 | No template tells; palette by numbers, not the last reel's | Pass | Aubergine #231A21, ivory #F1E8DC, rose #C98170 (beats.md) |
| 5 | B-roll layout varies with a reason | Pass | Split, circle, full-screen page, footage, boards under the speaker |
| 6 | -14 LUFS (±1), true peak ≤ -1 dBTP | Pass | ebur128 on the final: I -14.0 LUFS, peak -1.8 dBFS |
| 6 | Sound effects have causes; no music | Pass | Soft ticks on landing words only; no whoosh on layout changes; no music |
| 6 | Voice clear on a phone speaker | Not checked | Needs a listen on a phone |
| 7 | TV range, 1080x1920, 30 fps, H.264 + AAC 48 kHz, faststart | Pass | ffprobe: High, yuv420p, tv, 30/1, AAC LC 48000; moov before mdat |
| 8 | Accuracy | Pass | Arabic only from fetched JSON by Corpus word number; translation fetched and cross-checked. research.md claim 8 corrected against UNSW Limb Development (limb cartilage from the bud's core, muscle from somite cells); the reel claims only "at about the same time" |
| 9 | Contact sheet, frames around cuts, loudness measured | Pass | final_contact_sheet.jpg, final_cuts.jpg, ebur128 above |

Not checked: the voice on a phone speaker; a side-by-side with references/LIBRARY.md reels.
