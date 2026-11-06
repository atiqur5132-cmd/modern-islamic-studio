# Reference library

What "world class" looks like, taken from real reels the creator picks, so every new reel is
built and judged against them instead of against our own earlier reels.

## Adding a reel

1. The creator picks a reel that stopped them scrolling (Islamic, education, or any niche
   with a hook worth learning from) and saves it on the laptop, for example in
   `Raw footages/references/`. Videos are never committed.
2. Run:

   ```bash
   .venv\Scripts\python scripts/study_reel.py "Raw footages/references/reel.mp4" --name short-name --source https://...
   ```

   It writes `references/<name>/`: `hook.jpg` (0–6 s, every 0.5 s), `sheet.jpg` (every
   2 s), `frame0.jpg`, `frame0_270.jpg` (thumbnail test), `study.json` and a
   `breakdown.md` skeleton. The pictures stay on the laptop (the repo is public).
3. Claude looks at the sheets and fills `breakdown.md`: the hook beat by beat, captions,
   graphic vocabulary (which line type gets which graphic), transitions, pacing, and what
   we take or leave.
4. Add one row below.

## Use

- Before planning a reel, read this table and the breakdowns of the reels nearest its topic.
- Options in `plan.html` (`scripts/make_plan.py`) may point at a reference picture with
  `ref`, so the creator sees what an option will look like.
- Our own render gets the same measurement: `study_reel.py out/local/clip.mp4 --ours`.

## Reels

| Name | Creator / link | Hook beats in 0–6 s | Longest still | What we learn |
| --- | --- | --- | --- | --- |
| [yevorqq-ai-websites](yevorqq-ai-websites/breakdown.md) | yevorqq, edited by BeTheCut ([YouTube 0:00–0:18](https://www.youtube.com/watch?v=PZgIO2vCwuM)) | 0.0, 1.7, 2.6, 3.3, 4.8, 5.6 (read from frames) | about 1.7 s, moving | Speaker plus a huge gap-opening line, then a new full-screen collage world every 1.5–3 s; B&W cut-outs on one bold colour; kinetic big/small text; riser through the hook |
| [towards-eternity-ant-crush](towards-eternity-ant-crush/breakdown.md) | Towards Eternity ([YouTube](https://www.youtube.com/watch?v=w6iV6gZIYkY), 717K) | 0.0, 1.5, 2.5, 3.5, 5.5 | 2.0 s, moving | Closest to us: Quranic word topic. Ayah on a torn paper card with the word ringed in orange; the rejected word crossed out; macro B-roll every 3–5 s; quiet captions |
| [towards-eternity-machhar](towards-eternity-machhar/breakdown.md) | Towards Eternity, Hindi/Urdu ([YouTube](https://www.youtube.com/watch?v=U0Pu2bm0VuA), 156K) | 0.0, 2.5, 3.5 | 2.5 s | Ayah card with an orange Surah:Ayah tag on graph paper; push-in to the ringed word; top/bottom macro comparison |
| [nitish-rajput-black-box](nitish-rajput-black-box/breakdown.md) | Nitish Rajput, Hindi ([YouTube](https://www.youtube.com/watch?v=IGWdptXSUp0), 1.8M) | 0.0, 2.0, 2.6, 4.5, 5.5 | about 2.0 s, moving | Split hook: presenter + title on top, the event already happening below, full screen by 2.6 s; one continuous 3D world with numbers placed in it |
| [aashqeen-plus-billi](aashqeen-plus-billi/breakdown.md) | Aashqeen Plus, Hindi ([YouTube](https://www.youtube.com/watch?v=EkpC96dModg), 3.8M) | 0.0, 1.0, 1.5, 2.5, 3.5, 5.0 | about 1.5 s | Frame 0 = thumbnail poster; one person as questioner and explainer (two shirts, two backdrops); cut-outs in front of the speaker; one giant yellow keyword |
| [seerah-atlas-badr](seerah-atlas-badr/breakdown.md) | Seerah Atlas ([YouTube](https://www.youtube.com/watch?v=p2PjoAuEVPo), 2.5K: style only) | 0.0, 2.8, 3.5 | 2.8 s | Seerah without depicting anyone: armies as light particles, 3D relief, red routes, gold place names, parchment quotes |

Looked at on 2026-11-06 and not added: Dhruv Rathee Shorts "Instagram posts blocked" (selfie
plus pasted screenshots, plain editing), Ruhani Hikayat "Lost city of Iram" (12M, but
AI-generated giants presented as history), top comparison "Birthplace of the Prophets"
(depicts the Prophets), Aashqeen Plus "Hajj explained" (same grammar as the billi reel).

## Our own reels, for comparison

Measured 2026-11-06 with `study_reel.py --ours`:

| Reel | Hook beats in 0–6 s | Longest still | Sound from | Hook gate |
| --- | --- | --- | --- | --- |
| Yawm 365 | 0.0, 5.4 | 5.4 s | 0.08 s | Fail: one pale graphic held, calendar filled slowly |
| Kullun fi Falak | 0.0, 2.2, 3.2, 3.7 (gestures) | 2.3 s | 0.18 s | Fail: talking head with captions only |
