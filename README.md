# Modern Islamic Studio

Remotion studio for 9:16 Islamic education shorts (1080x1920, 30 fps, H.264/AAC).

- **Laptop:** Whisper, FFmpeg, Remotion preview.
- **GitHub Actions:** final Remotion render only, started by hand.
- **Footage:** never committed. Prepared clips go in a draft release.

```bash
npm run dev
```

```bash
.venv\Scripts\python scripts/transcribe.py path/to/video.mp4
```

Quranic text enters the project only through `scripts/fetch_ayah.py`, which cross-checks two sources. Never type or edit it by hand.
