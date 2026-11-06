# Modern Islamic Studio

Premium Islamic education shorts for Gen Z, in Hindi/Hinglish. Quality over quantity, accuracy over sensationalism, storytelling over effects.

Output: 1080x1920, 30 fps, H.264 + AAC, MP4. Keep captions inside platform-safe areas.

Spoken captions are Hinglish (Roman Hindi), never Devanagari. All other on-screen text (titles, labels, graphics, claim tags) is English, from new reels onward; earlier reels stay as they are. Quranic Arabic stays in Arabic script on Ayah cards, and explanatory terms (Tafsir, Sahih, Falak) keep their original word with the meaning beside it. Full-screen graphics carry a tag saying what kind of claim they show (science, forensic science, Quranic context).

## Where work runs

- Laptop: Whisper, FFmpeg, Remotion preview. i3-1115G4, 8 GB RAM, Intel UHD; ask the user to close Chrome before heavy jobs.
- GitHub Actions: final Remotion render only, started by hand. Keep renders short and purposeful; do not run them on push.
- Raw footage is never committed. Prepared clips reach GitHub only through a draft release, which `scripts/render_on_github.py` deletes afterwards.

## Religious and factual accuracy

- Quranic text enters the project only through `scripts/fetch_ayah.py`. Never type, edit or trim it by hand.
- Whisper output is never a source for Quranic text, and never reaches the screen: captions take their spelling from `projects/<clip>/script.txt` and only their timing from Whisper. The creator confirms the script before a final render.
- Verify every Surah and Ayah reference. Keep translation separate from interpretation.
- Use reliable Tafsir and authentic Hadith references; state scholarly differences.
- Label claims as established science, hypothesis, interpretation, numerical observation or speculative. Never manufacture a scientific or mathematical miracle.
- Verify calculations independently. Do not present numerical coincidences as proof.
- Give sources for historical and scientific claims.

## Quality bar

Every reel must clear `QUALITY.md`, the world-class standard the creator set. Read it before starting a reel and again before delivery; report every gate as pass or fail with evidence. Never call a reel finished or world class while a gate fails or is unchecked.

## Working rules

- Build one phase at a time and show a preview after each major phase.
- Never say a feature works unless it was tested.
- Explain and get approval before installing paid or heavy software.
- Do not force Islamic ornament into every scene. Every B-roll shot must serve the narrative.

## Commands

```bash
npm run dev
```

```bash
.venv\Scripts\python scripts/prepare_footage.py path/to/raw.mp4
```

```bash
.venv\Scripts\python scripts/transcribe.py public/footage/clip.mp4
```

```bash
.venv\Scripts\python scripts/auto_edit.py public/footage/clip.mp4
```

```bash
.venv\Scripts\python scripts/make_captions.py clip
```

```bash
.venv\Scripts\python scripts/track_face.py public/footage/clip.mp4
```

```bash
.venv\Scripts\python scripts/render_on_github.py Short --props projects/clip/edit.json --footage public/footage/clip.mp4
```

```bash
.venv\Scripts\python scripts/make_plan.py clip
```

```bash
.venv\Scripts\python scripts/study_reel.py path/to/reel.mp4 --name some-reel --source https://...
```

```bash
.venv\Scripts\python -m unittest discover tests
```

`make_plan.py` turns `projects/<clip>/plan_options.json` into `plan.html`, where the creator picks a visual for every script line; their choices decide `beats.md`. `study_reel.py` adds a reel to the reference library (`references/LIBRARY.md`; its pictures are never committed), or with `--ours` measures our own render's hook against the QUALITY.md gates.

Laptop render (about 6 minutes for a 49 s Short with 3D; ask the user to close Chrome first, keep concurrency at 2 for 8 GB RAM):

```bash
npx remotion render Short out/local/clip.mp4 --props=projects/clip/edit.json --concurrency=2 --gl=angle
```

The Windows render comes out full range (`yuvj420p`), which can look washed out after upload, and its mix can peak above −1 dBTP. Always finish it with this script, which converts to TV range, brings the sound to −14 LUFS with the true peak under −1 dBTP, measures the written file and fails when it is out of spec:

```bash
.venv\Scripts\python scripts/finalize.py out/local/clip.mp4
```

`auto_edit.py` writes every decision to `work/<clip>.auto_edit.json`. Read it before rendering: `lostWords` must be empty, and `untranscribedSoundKept` may be recitation that needs a human ear. Overlay times are on the source footage, so re-running it never moves an Ayah off its spoken words.

`track_face.py` writes the face path into `edit.json` as `face`; the camera in `src/timeline/camera.ts` uses it to keep the face framed on punch-ins and to centre the picture-in-picture. Without it the camera assumes a centred face. It needs the YuNet model at `models/yunet/face_detection_yunet_2023mar.onnx` (from github.com/opencv/opencv_zoo, not committed).

Each video has `projects/<name>/edit.json`: its footage, kept segments and overlays. Add `--vertical` to the prepare step only for real landscape footage; phone clips marked with rotation are already vertical.
