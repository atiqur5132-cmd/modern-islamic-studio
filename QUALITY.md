# World-class reel standard

Every Short from this studio clears this bar before it is called finished. Each gate is
measured, not felt: the final report lists every gate as pass or fail with its evidence
(a number, a frame, a file). One failed gate means the reel is not done.

## 0. Recording

- Eyes about a third of the way down the frame (y ≈ 640), chin above y ≈ 1050, so captions at y 1100–1310 sit on the chest, not the face, even at zoom 1.

## 1. Hook (0–6 s), strict

The first 6 s decide whether the reel is watched (Yawm 365, Nov 2026: viewers skipped
because the opening visual was weak). Every gate here is strict: a fail cannot be passed
with a note. It is fixed by rebuilding the hook, rewriting or re-recording the first line,
or the reel does not ship.

- The reel opens on full-screen motion graphics or real visuals timed to the spoken hook; the creator appears only after it, at a sentence break, usually 3–5 s in.
- Frame 0 is the thumbnail: a strong visual plus one bold line already on screen. Never black, a logo or a fade-in.
- Frame 0 reads at thumbnail size: shrunk to 270 px wide, the subject and the line are still clear. One subject fills at least 40% of the frame, with strong contrast between subject and ground; no pale-on-pale, no small element floating in space.
- Motion from the first frame: something is already moving at frame 0, and the picture makes a visible change (new image, cut, scale jump, number hit, reveal) at least every 1.5 s through 0–6 s, so 4 or more distinct visual beats. Nothing holds still, fills slowly or fades for longer than 1.5 s.
- Each beat is a new idea for the eye, not the same layout decorating itself: a real image, footage or a bold graphic change, not only text appearing or a counter ticking.
- The question, claim or surprise is spoken and shown within 1.5 s. The key word itself (the number, the name, the contradiction) is said inside 1.5 s, not just the start of the sentence; the script is written so it comes first.
- The hook opens a gap the viewer must close (a contradiction, a "galat", a stake), not a setup or a topic announcement.
- Sound hits at frame 0 (the voice or a cut-in impact), and each hook beat has a sound cause; no soft or silent start.
- Muted test: the first 3 s make sense with the sound off.
- Before building, 2–3 hook storyboards (frame 0 plus the beats to 6 s) go to the creator and one is approved. Before the final render, a strip of frames at 0, 0.5, 1 … 6 s and frame 0 at 270 px go to the creator, and the hook is judged against the strongest reels in the niche, not against our own earlier reels.

## 2. Pacing

- No pause over 0.5 s survives (`auto_edit.py`), and `lostWords` is empty.
- Something changes on screen every 2–4 s: a cut, a punch-in, a graphic, B-roll. No shot holds unchanged past 4 s.
- The payoff lands before the viewer would swipe; the end card is short and the last line holds at least 2 s.

## 2a. Call to action

- A spoken CTA of one line under 3 s, tied to the topic, after the last line, asking for a follow (reels go to Instagram and Facebook; YouTube is set aside for now).
- A Follow animation with real, unaltered Instagram and Facebook icons; like and comment icons with a specific comment question.
- CTA graphics appear at the end and 1–2 times mid-video (2–3 s each), never during the hook or payoff, never over the face, and clear of the right-hand action rail.

## 3. Camera on the speaker

- `track_face.py` has run: `face` exists in `edit.json`, face missed in under 5% of samples.
- The face is never cut off by a zoom, a card or the picture-in-picture circle.
- Zoom never exceeds 1.16; emphasis words get a punch-in; every cut changes framing or picture.

## 4. Captions and on-screen text

- Spoken captions are Hinglish in Roman script, spelling from `script.txt`, timing from Whisper; the creator confirmed the script.
- Every other on-screen text (titles, labels, graphics, claim tags) is English. Ayah stays in Arabic script; explanatory terms keep the original word with its meaning beside it.
- 2–4 words per caption group, one group on screen at a time, the spoken word highlighted.
- Caption position follows the shot: off the face, clear of graphics and B-roll, moved per layout (split, circle, full-screen). The caption look (fonts, colour, animation) is planned per reel to fit its theme, with at most 3 type roles used by fixed rules.
- All text sits inside y 168–1330 px on 1080×1920 (above the Shorts/Reels caption, handle and buttons) and clear of the right-hand action rail. Nothing meant to be read is under 28 px.
- Captions never cover the face or repeat a graphic that already shows the words.

## 5. Motion graphics

- Every graphic serves the sentence it sits on; none is decoration.
- Full-screen claims carry their tag (science, forensic science, Quranic context, …).
- Titles land and hold dead still; exits are 40–50% shorter than entrances; arrivals ease out on a long tail.
- 3–5 kinds of transition in a reel, each with a cause on screen; never the same entrance on every graphic.
- Each reel's look comes from its subject and is written down as numbers before building (ground, ink, one accent, faces and sizes). One accent colour carries meaning. No dark void with floating elements, glow rings or decorative particles unless the subject itself calls for them.
- B-roll layout is chosen per beat (circle, top/bottom split, speaker full screen with a card, or full-screen B-roll), with a reason, and varies across the reel.

## 6. Sound

- Final mix at −14 LUFS integrated (±1), true peak at or under −1 dBTP, measured on the rendered file (`scripts/finalize.py` does both and prints the numbers).
- Voice is clear on a phone speaker; nothing clips.
- Each sound effect has a cause on screen, peaks one frame after its picture and sits 3–6 dB over the bed; a repeated sound rotates two or three takes.
- Music only with the creator's approval for that reel.

## 7. Picture

- The speaker is graded: natural skin, no colour cast, shadows not crushed, highlights not clipped.
- Render converted to TV range by `scripts/finalize.py`: `yuv420p`, `color_range=tv`.
- 1080×1920, 30 fps, H.264 + AAC 48 kHz, `+faststart`.

## 8. Accuracy

- Every rule under "Religious and factual accuracy" in CLAUDE.md holds; sources are listed in `projects/<clip>/credits.txt`.

## 9. Review before delivery

- A contact sheet every 2 s of the final render, looked at frame by frame.
- Frames just before and after every cut and every graphic entrance checked for jumps.
- Loudness and true peak measured with FFmpeg `ebur128` on the final MP4.
- The report to the creator: each gate pass or fail with its evidence, and what was not checked.
