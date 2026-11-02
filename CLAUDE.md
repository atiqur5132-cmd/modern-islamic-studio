# Modern Islamic Studio

Premium Islamic education shorts for Gen Z, in Hindi/Hinglish. Quality over quantity, accuracy over sensationalism, storytelling over effects.

Output: 1080x1920, 30 fps, H.264 + AAC, MP4. Keep captions inside platform-safe areas.

## Where work runs

- Laptop: Whisper, FFmpeg, Remotion preview. i3-1115G4, 8 GB RAM, Intel UHD; ask the user to close Chrome before heavy jobs.
- GitHub Actions: final Remotion render only, started by hand. Keep renders short and purposeful; do not run them on push.
- Raw footage is never committed. Prepared clips reach GitHub only through a draft release, which `scripts/render_on_github.py` deletes afterwards.

## Religious and factual accuracy

- Quranic text enters the project only through `scripts/fetch_ayah.py`. Never type, edit or trim it by hand.
- Whisper output is never a source for Quranic text.
- Verify every Surah and Ayah reference. Keep translation separate from interpretation.
- Use reliable Tafsir and authentic Hadith references; state scholarly differences.
- Label claims as established science, hypothesis, interpretation, numerical observation or speculative. Never manufacture a scientific or mathematical miracle.
- Verify calculations independently. Do not present numerical coincidences as proof.
- Give sources for historical and scientific claims.

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
.venv\Scripts\python scripts/render_on_github.py Short --props projects/clip/edit.json --footage public/footage/clip.mp4
```

```bash
.venv\Scripts\python -m unittest discover tests
```

`auto_edit.py` writes every decision to `work/<clip>.auto_edit.json`. Read it before rendering: `lostWords` must be empty, and `untranscribedSoundKept` may be recitation that needs a human ear. Overlay times are on the source footage, so re-running it never moves an Ayah off its spoken words.

Each video has `projects/<name>/edit.json`: its footage, kept segments and overlays. Add `--vertical` to the prepare step only for real landscape footage; phone clips marked with rotation are already vertical.
