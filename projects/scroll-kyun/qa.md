# QA: "Scroll kyun nahi rukta?" (YouTube long form, faceless, 16:9)

Final file: `out/local/scroll-kyun-final.mp4`, 8 min 53 s, 1920×1080 (GitHub run 43323474192,
then `scripts/finalize.py`). Checked 2026-11-13 overnight. QUALITY.md is written for vertical
Shorts with the creator on camera; this video is the creator's faceless long-form pilot, so
gates about the face, the 1080×1920 frame and the Instagram follow are marked N/A with the
reason, and every other gate is reported with its evidence.

## Voiceover (the creator's main ask: "ek bhi bad take na rahe")

- Built by `build_voice.py` from the 15-min take: 130 script lines, one take each; 38 lines
  cut by hand (HAND table, each with its reason) where Whisper hid a false start or clipped
  a word. PASS.
- The finished voiceover was transcribed in full twice (`work/scroll-kyun.voice2…`,
  `work/scroll-kyun.voicefinal…`) and read line by line against `script.txt`; every doubled,
  broken or missing phrase found was fixed and re-heard in isolation. Final pass: all 130
  lines once, in order. Lines Whisper skipped in the text (44–47, 84–86) were re-heard in
  short pieces of the final file: present and whole. PASS.
- Speech rate per line: highest 0.35 s/word (line 79, numbers), median 0.25; a doubled line
  would be ≥ 0.45. PASS.
- Not checked by ear: no human listened to the cut (Claude cannot). Timbre jumps between
  takes at a splice (lines 20, 26, 69, 71, 75, 81, 85, 90, 104, 107, 113, 123) may be audible.

## §0 Recording — N/A (faceless; voice only, by the creator's choice)

## §1 Hook (0–6 s)

| Gate | Result | Evidence |
| --- | --- | --- |
| Creator on screen 0–3 s; frame 0 = creator + visual | N/A | Faceless video (creator, 2026-11-12) |
| Frame 0 strong, not black | PASS | Phone in a dark room, reel 1, big "1" counter (`work/scroll-kyun-final.study/frame0_270.jpg`) |
| Motion from frame 0, change every 1.5 s, 4+ beats | PASS by eye; tool FAIL | `work/scroll-kyun-final.study/hook.jpg`: camera cuts and reel changes at 0.7, 1.6, 2.5, 3.6, 3.9, 4.4, 4.9 s, clock at 5.2 s. `study_reel.py --ours` counts 1 beat: it squeezes the frame into a 54×96 portrait thumbnail and its threshold (24 grey levels) is set for bright vertical reels; changes on this dark ground stay under it. Judged by the frames, not the tool |
| Key word in 1.5 s | PASS | "Ek reel" spoken from 0.7 s |
| Opens a gap | PASS | "Phir bas aakhri" → the clock jumps 9:00 → 10:30 pm |
| Sound at frame 0 | PASS | tick at 0, voice at 0.7 s |
| Muted test | PASS | counter + clock read without sound |
| 3 storyboards in plan.html before building | FAIL (waived) | Creator said to finish without asking; storyboards not made |

## §2 Pacing

- Pauses: inside lines ≤ 0.35 s → 0.2 s; between lines 0.14 s added; at 15 chapter turns
  0.55 s added (a breath for the picture to change). Chapter breaths exceed the Shorts 0.5 s
  rule on purpose. PARTIAL.
- Picture changes: every scene is keyed to spoken lines; contact sheet every 5 s shows a new
  element in every frame. Near-empty holds of 1–3 s at scene starts (lines 4, 17, 22, 59, 74,
  120) where a label waits for the spoken word. PARTIAL.
- Last line held: "Your time is your capital. Don't sell it cheap." ~4 s before the CTA. PASS.

## §2a CTA

- Spoken CTA tied to the topic: "Agar ye video tumhe ek achha sauda laga, toh channel
  subscribe kar lo." (4.7 s; over the 3 s Shorts rule). PARTIAL.
- YouTube subscribe (not the Instagram/Facebook follow of the reels: this is the long-form
  channel); our own drawn button, no platform logo. Comment question on the end card:
  "What's your biggest trigger? Tell us in the comments." PASS.
- Mid-video notes (2.5 s, top left) after line 63 and line 97. PASS.

## §3 Camera on the speaker — N/A (no speaker on screen)

## §4 Captions and on-screen text

- Hinglish, Roman script, spelling from `script.txt`, timing from Whisper on the finished
  voiceover. PASS. 50 words matched weakly and were timed by interpolation; line 12 "Kyun?"
  timed by hand.
- `script.txt` was rewritten to what was said (`script.original.txt` keeps the draft); the
  creator has NOT confirmed it yet. PENDING.
- Groups of 2–4 words, one at a time, spoken word lit; `editorial` look (Bricolage 54 px,
  Newsreader italic amber for emphasis). PASS.
- All other text English; claim tags in credit lines. PASS.
- Safe area: 16:9, 120 px side margins, captions bottom centre clear of graphics (fixed
  overlaps found in stills at data/detox scenes before the final render). PASS.

## §5 Motion graphics

- Every graphic belongs to its sentence (beats.md table). PASS.
- Claim tags: Numerical illustration, Illustration, Established science, One study, Their own
  words, Company statement, Expert view, Hadith Sahih, His own habit. PASS.
- Look written as numbers in beats.md; amber means "the reward" throughout. PASS.
- Transition kinds: hard cut, fade up from the ground (no two scenes' words overlap), camera
  cuts in the hook, the slot machine shrinking as the phone takes its place, paper for the
  hadith. PASS.
- No stamps, UI cards or glows; one real-artifact-style element (the hadith in Arabic).
  Quotes are set as pull quotes with a one-line credit. PASS.
- "Heavy 3D": the phone is CSS 3D with real perspective; the rest is 2D line drawing. Not
  three.js scenes. NOTE.

## §6 Sound

- Final mix −14.0 LUFS integrated, true peak −1.8 dBTP, measured by `finalize.py` on
  `out/local/scroll-kyun-final.mp4`. PASS.
- Effects: soft ticks on swipes, sub hits on the clock, "Why?", the 0.4% and "You do.", an
  impact on "5 years", shimmer on the jackpot, whooshes on five chapter turns only; each has a
  cause on screen. Peaks not measured one by one. PARTIAL.
- No music (none approved for this video). Phone-speaker check not done.

## §7 Picture

- 1920×1080 (long form), 30 fps, H.264 + AAC 48 kHz, TV range after finalize. PASS.

## §8 Accuracy

- research.md ledger, credits.txt. Ayahs: none on screen (Surah al-'Asr cut from the script).
  Hadith Arabic and English copied from sunnah.com (Bukhari 6412). PASS.
- Ledger row 10 (DSM/ICD) is not used in the script. Pigeon and light/juice details checked
  2026-11-13. PASS.

## §9 Review before delivery

- Contact sheet every 5 s of the render (not every 2 s): `work/qa_scroll/sheet_1..4.jpg`.
- Frames around every scene change checked from stills (`out/stills/scroll-kyun/trans.jpg`).
- Loudness measured by finalize.py on the final MP4.
- Not checked: listening to the whole video (no ears), playback on a phone speaker.
