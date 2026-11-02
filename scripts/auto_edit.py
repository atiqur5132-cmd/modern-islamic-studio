"""Build the cut list of a talking-head video from its audio and transcript.

Usage: .venv\\Scripts\\python scripts/auto_edit.py public/footage/clip.mp4
           [--transcript work/clip.medium.transcript.json] [--keep-repeats]

Removes silence, breaths and retakes, then writes the segments into
projects/<clip>/edit.json, keeping its overlays. Lists every decision in
work/<clip>.auto_edit.json. Sustained sound without transcribed words is kept
and flagged, because it may be recitation Whisper did not write down.
"""
import argparse
import difflib
import json
import pathlib
import re
import subprocess
import wave

import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent

HOP_SECONDS = 0.01
SAMPLE_RATE = 16000
LOW_MARGIN_DB = 6  # above the room noise: catches quiet word endings
HIGH_MARGIN_DB = 12  # above the room noise: clearly voiced sound
MIN_VOICED_SECONDS = 0.3  # shorter bursts are breaths or mouth noise
FLAG_UNTRANSCRIBED_SECONDS = 0.5
BRIDGE_SECONDS = 0.25  # dips shorter than this are part of the same phrase
MIN_PAUSE_SECONDS = 0.5  # the creator's rule: every longer pause gets cut
KEPT_PAUSE_SECONDS = 0.3  # the breath left where a pause was cut
LEAD_IN_SECONDS = 0.1
TAIL_SECONDS = 0.3
CUT_MARGIN_SECONDS = 0.1  # room tone either side of a cut, for the audio crossfade
PHRASE_GAP_SECONDS = 0.3
MIN_RETAKE_WORDS = 3
RETAKE_SIMILARITY = 0.75
PUNCH_IN = 1.07
PUNCH_IN_ABOVE_DIFFERENCE = 6  # mean grey-level change that still reads as a jump
FPS = 30
THUMB_WIDTH, THUMB_HEIGHT = 54, 96


def loudness_db(samples):
    hop = int(HOP_SECONDS * SAMPLE_RATE)
    frames = samples[: len(samples) // hop * hop].reshape(-1, hop)
    return 20 * np.log10(np.sqrt(np.mean(frames**2, axis=1)) + 1e-9)


def regions_of(mask):
    """Return (start, end) index pairs of every True run."""
    edges = np.flatnonzero(np.diff(np.concatenate(([0], mask.astype(np.int8), [0]))))
    return list(zip(edges[::2].tolist(), edges[1::2].tolist()))


def merge(spans, max_gap):
    merged = []
    for start, end in sorted(spans):
        if merged and start - merged[-1][1] < max_gap:
            merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        else:
            merged.append((start, end))
    return merged


def tighten_words(db, words):
    """Trim silence from word edges. Whisper often runs a word on into the pause.

    A word with no measurable sound stays as it is, so it can never be cut away.
    """
    low = float(np.percentile(db, 10)) + LOW_MARGIN_DB
    tightened = []
    for word in words:
        first = int(word["start"] / HOP_SECONDS)
        loud = np.flatnonzero(db[first : int(word["end"] / HOP_SECONDS)] > low)
        if loud.size == 0:
            tightened.append(word)
            continue
        tightened.append({**word, "start": (first + int(loud[0])) * HOP_SECONDS,
                          "end": (first + int(loud[-1]) + 1) * HOP_SECONDS})
    return tightened


def speech_spans(db, words):
    """Find speech as seconds. Returns (spans, untranscribed sounds)."""
    floor = float(np.percentile(db, 10))
    low, high = floor + LOW_MARGIN_DB, floor + HIGH_MARGIN_DB
    candidates = merge(
        [(s * HOP_SECONDS, e * HOP_SECONDS) for s, e in regions_of(db > low)], BRIDGE_SECONDS
    )

    spans, flagged = [], []
    for start, end in candidates:
        part = db[int(start / HOP_SECONDS) : int(end / HOP_SECONDS)]
        voiced = float(np.sum(part > high)) * HOP_SECONDS
        has_word = any(w["start"] < end and w["end"] > start for w in words)
        if has_word or voiced >= MIN_VOICED_SECONDS:
            spans.append((start, end))
        if not has_word and voiced >= FLAG_UNTRANSCRIBED_SECONDS:
            flagged.append({"start": round(start, 2), "end": round(end, 2)})
    # Every transcribed word stays, even where its sound is too quiet to measure.
    spans += [(w["start"], w["end"]) for w in words]
    return merge(spans, MIN_PAUSE_SECONDS), flagged


def phrases_of(words):
    phrases = []
    for word in words:
        if phrases and word["start"] - phrases[-1][-1]["end"] <= PHRASE_GAP_SECONDS:
            phrases[-1].append(word)
        else:
            phrases.append([word])
    return phrases


def tokens(phrase):
    cleaned = (re.sub(r"[^\wऀ-ॿ]", "", w["text"]) for w in phrase)
    return [t for t in cleaned if t]


def similarity(a, b):
    return difflib.SequenceMatcher(None, a, b).ratio()


def find_retakes(phrases):
    """Return phrases to drop: a phrase repeated right after, or a false start."""
    retakes = []
    for first, second in zip(phrases, phrases[1:]):
        a, b = tokens(first), tokens(second)
        if len(a) < MIN_RETAKE_WORDS:
            continue
        if max(similarity(a, b), similarity(a, b[: len(a)])) >= RETAKE_SIMILARITY:
            retakes.append(
                {"start": first[0]["start"], "end": second[0]["start"],
                 "dropped": " ".join(w["text"] for w in first),
                 "kept": " ".join(w["text"] for w in second)}
            )
    return retakes


def subtract(spans, removals):
    for removal in removals:
        result = []
        for start, end in spans:
            if end <= removal["start"] or start >= removal["end"]:
                result.append((start, end))
                continue
            if start < removal["start"]:
                result.append((start, removal["start"]))
            if end > removal["end"]:
                result.append((removal["end"], end))
        spans = result
    return spans


def read_thumbnails(video):
    """Tiny grey frames, enough to compare head position across a cut."""
    raw = subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-i", str(video),
         "-vf", f"fps={FPS},scale={THUMB_WIDTH}:{THUMB_HEIGHT},format=gray",
         "-f", "rawvideo", "-"],
        check=True, capture_output=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.uint8).reshape(-1, THUMB_HEIGHT, THUMB_WIDTH).astype(np.int16)


def best_cut(thumbs, speech_end, speech_start):
    """Choose the out and in frames, inside the pause, where the picture matches best."""
    removed_frames = round((speech_start - speech_end - KEPT_PAUSE_SECONDS) * FPS)
    first = round((speech_end + CUT_MARGIN_SECONDS) * FPS)
    last = round((speech_start - CUT_MARGIN_SECONDS) * FPS) - removed_frames
    last = min(last, len(thumbs) - 1 - removed_frames)
    candidates = range(first, max(first, last) + 1)
    differences = [float(np.mean(np.abs(thumbs[f] - thumbs[f + removed_frames]))) for f in candidates]
    best = int(np.argmin(differences))
    return candidates[best], candidates[best] + removed_frames, differences[best]


def to_segments(spans, duration, thumbs):
    """Join the speech, with a cut at every pause left between the spans."""
    segments = []
    zoom = 1
    start_frame = round(max(0, spans[0][0] - LEAD_IN_SECONDS) * FPS)
    for (_, speech_end), (speech_start, _) in zip(spans, spans[1:]):
        out_frame, in_frame, difference = best_cut(thumbs, speech_end, speech_start)
        segments.append({"from": round(start_frame / FPS, 3), "to": round(out_frame / FPS, 3),
                         "zoom": zoom, "cutDifference": round(difference, 1)})
        if difference > PUNCH_IN_ABOVE_DIFFERENCE:
            zoom = 1 if zoom != 1 else PUNCH_IN
        start_frame = in_frame
    end_frame = round(min(duration, spans[-1][1] + TAIL_SECONDS) * FPS)
    segments.append({"from": round(start_frame / FPS, 3), "to": round(end_frame / FPS, 3),
                     "zoom": zoom})
    return segments


def lost_words(words, segments, retakes):
    """Words that fall outside the kept video and were not removed on purpose."""
    def kept(t):
        return any(s["from"] <= t < s["to"] for s in segments)

    def in_retake(t):
        return any(r["start"] <= t < r["end"] for r in retakes)

    return [w for w in words
            if not kept((w["start"] + w["end"]) / 2) and not in_retake(w["start"])]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("video", type=pathlib.Path)
    parser.add_argument("--transcript", type=pathlib.Path)
    parser.add_argument("--keep-repeats", action="store_true")
    args = parser.parse_args()

    stem = args.video.stem
    transcript_path = args.transcript or ROOT / "work" / f"{stem}.medium.transcript.json"
    transcript = json.loads(transcript_path.read_text(encoding="utf-8"))
    words = [w for segment in transcript["segments"] for w in segment["words"]]

    wav = ROOT / "work" / f"{stem}.16k.wav"
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", str(args.video),
         "-vn", "-ac", "1", "-ar", str(SAMPLE_RATE), str(wav)],
        check=True,
    )
    with wave.open(str(wav)) as audio:
        samples = np.frombuffer(audio.readframes(audio.getnframes()), dtype=np.int16)
    duration = len(samples) / SAMPLE_RATE

    db = loudness_db(samples.astype(np.float32) / 32768)
    words = tighten_words(db, words)
    spans, flagged = speech_spans(db, words)
    retakes = [] if args.keep_repeats else find_retakes(phrases_of(words))
    segments = to_segments(subtract(spans, retakes), duration, read_thumbnails(args.video))
    lost = lost_words(words, segments, retakes)

    project = ROOT / "projects" / stem
    project.mkdir(parents=True, exist_ok=True)
    edit_path = project / "edit.json"
    edit = json.loads(edit_path.read_text(encoding="utf-8")) if edit_path.exists() else {"overlays": []}
    edit["footage"] = args.video.name
    edit["segments"] = segments
    edit_path.write_text(json.dumps(edit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    kept_seconds = sum(s["to"] - s["from"] for s in segments)
    report = {"sourceSeconds": round(duration, 2), "keptSeconds": round(kept_seconds, 2),
              "segments": len(segments), "retakesRemoved": retakes,
              "untranscribedSoundKept": flagged,
              "lostWords": [{"text": w["text"], "start": w["start"]} for w in lost]}
    report_path = ROOT / "work" / f"{stem}.auto_edit.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    print(f"{duration:.1f}s -> {kept_seconds:.1f}s in {len(segments)} segments")
    print(f"Retakes removed: {len(retakes)}. Untranscribed sound kept: {len(flagged)}. "
          f"Words lost: {len(lost)}")
    print(f"Saved {edit_path.relative_to(ROOT)} and {report_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
