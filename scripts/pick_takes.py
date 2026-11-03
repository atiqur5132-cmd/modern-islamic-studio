"""Pick the best take of every script line from a raw recording with many retakes.

Usage: .venv\\Scripts\\python scripts/pick_takes.py public/footage/clip.mp4
           [--transcript work/clip.medium.transcript.json]

Reads projects/<clip>/script.txt (one line per row) and the Whisper transcript, finds
every attempt at each line by how it sounds, and keeps the last complete one. Cuts sit
on word edges, snapped to the quietest point nearby; pauses inside a take shrink to
200 ms. Writes the segments into projects/<clip>/edit.json, keeping its overlays, and
every decision into projects/<clip>/cutlist.json and cutlist.md. Cuts placed by hand
after listening go in projects/<clip>/take_overrides.json, as {"line": {"from", "to", "why"}}.
"""
import argparse
import json
import pathlib
import re
import subprocess
import wave

import numpy as np
from rapidfuzz import fuzz

from auto_edit import HOP_SECONDS, LOW_MARGIN_DB, HIGH_MARGIN_DB, SAMPLE_RATE, loudness_db, regions_of, tighten_words
from hinglish import similarity, sound_forms

ROOT = pathlib.Path(__file__).resolve().parent.parent

LEAD_SECONDS = 0.08
TAIL_SECONDS = 0.12
SNAP_SECONDS = 0.06  # how far a cut may move to find the quietest point
MAX_PAUSE_SECONDS = 0.35
KEPT_PAUSE_SECONDS = 0.2
MIN_ATTEMPT_SCORE = 55
COMPLETE_SCORE = 72  # Whisper mishears Hinglish (बाद for baat); 72 still rejects stumbles
EDGE_SIMILARITY = 0.55
WINDOW_RANGE = (0.6, 1.6)  # attempt length, in words, against the script line
BREATH_SECONDS = 0.35
RESTART_MARKERS = ("sorry", "सॉरी", "सारी", "फिर से", "एक बार और", "दोबारा", "कट", "रुको", "नहीं नहीं")
HALLUCINATION_PROBABILITY = 0.4
RETAKE_SCORE_SPREAD = 10
SAME_BREATH_SECONDS = 0.6
EDGE_SEARCH_SECONDS = 0.4
MIN_GAP_SECONDS = 0.05
MIN_PIECE_SECONDS = 0.15
FILLERS = {"umm", "um", "hmm", "अं", "उम", "उम्म", "हम्म"}  # never आ or ए: they are real words


def hallucinated(segment):
    """Whisper invents text over unclear sound: words with no length, low confidence."""
    words = segment["words"]
    instant = sum(w["end"] - w["start"] < 0.02 for w in words)
    confidence = sum(w["probability"] for w in words) / max(1, len(words))
    return instant > len(words) / 3 or confidence < HALLUCINATION_PROBABILITY


def script_lines(path):
    lines = [line.strip() for line in path.read_text(encoding="utf-8").splitlines()]
    return [line for line in lines if line]


def line_tokens(line):
    return [t for t in re.split(r"[^\w']+", line.replace("*", "")) if t]


def joined_sound(words):
    return "".join(sound_forms(w)[0] for w in words)


def attempts_of(tokens, words, forms):
    """Every place the line was tried, best window per place, oldest first."""
    target = joined_sound(tokens)
    n = len(tokens)
    low, high = max(1, int(n * WINDOW_RANGE[0])), max(2, int(round(n * WINDOW_RANGE[1])))
    scored = []
    for i in range(len(words)):
        best = None
        for j in range(i + low, min(len(words), i + high) + 1):
            score = fuzz.ratio(target, "".join(forms[i:j]))
            if best is None or score > best[0]:
                best = (score, i, j)
        if best and best[0] >= MIN_ATTEMPT_SCORE:
            scored.append(best)
    picked = []
    for score, i, j in sorted(scored, reverse=True):
        if all(j <= pi or i >= pj for _, pi, pj in picked):
            picked.append((score, i, j))
    return sorted(picked, key=lambda p: p[1])


def problems_in(tokens, words, i, j, score):
    """Why an attempt is not a clean take. Empty when it is."""
    problems = []
    if score < COMPLETE_SCORE:
        problems.append(f"match {score:.0f} < {COMPLETE_SCORE}")
    text = " ".join(w["text"] for w in words[i:j]).lower()
    if any(marker in text for marker in RESTART_MARKERS):
        problems.append("restart word")
    head = max(similarity(tokens[0], words[k]["text"]) for k in range(i, min(j, i + 2)))
    tail = max(similarity(tokens[-1], words[k]["text"]) for k in range(max(i, j - 2), j))
    if head < EDGE_SIMILARITY:
        problems.append("start missing")
    if tail < EDGE_SIMILARITY:
        problems.append("end missing")
    texts = [w["text"] for w in words[i:j]]
    for size in (1, 2, 3):
        for k in range(len(texts) - 2 * size + 1):
            if texts[k : k + size] == texts[k + size : k + 2 * size] and size * 2 <= len(texts):
                problems.append(f"repeat: {' '.join(texts[k:k + size])}")
                break
    return problems


def voice_edge(db, t, step, limit):
    """Walk from t (a Whisper word edge) out to where the voice really falls to the
    room tone, at most EDGE_SEARCH_SECONDS and never past limit. Whisper often
    starts a word late, which would clip its first consonant."""
    around = db[max(0, int((t - 5) / HOP_SECONDS)) : int((t + 5) / HOP_SECONDS)]
    quiet = float(np.percentile(around, 5)) + LOW_MARGIN_DB  # this take's own room tone
    k = int(t / HOP_SECONDS)
    for _ in range(int(EDGE_SEARCH_SECONDS / HOP_SECONDS)):
        nxt = k + step
        if nxt < 0 or nxt >= len(db) or (nxt * HOP_SECONDS - limit) * step >= 0 or db[nxt] < quiet:
            break
        k = nxt
    return k * HOP_SECONDS


def snap(db, t, lo, hi):
    """Move a cut to the quietest 10 ms within reach, staying between lo and hi."""
    a = max(lo, t - SNAP_SECONDS)
    b = min(hi, t + SNAP_SECONDS)
    if b <= a:
        return t
    first, last = int(a / HOP_SECONDS), int(b / HOP_SECONDS) + 1
    return round((first + int(np.argmin(db[first:last]))) * HOP_SECONDS, 3)


def split_pauses(db, start, end, words, floor):
    """Split a take where it goes quiet for longer than MAX_PAUSE_SECONDS."""
    low, high = floor + LOW_MARGIN_DB, floor + HIGH_MARGIN_DB
    first = int(start / HOP_SECONDS)
    part = db[first : int(end / HOP_SECONDS)]
    pieces, cursor, removed = [], start, []
    for s, e in regions_of(part < low):
        q_start, q_end = (first + s) * HOP_SECONDS, (first + e) * HOP_SECONDS
        if q_start <= start + 0.01 or q_end >= end - 0.01:
            continue
        if q_end - q_start > MAX_PAUSE_SECONDS and not any(w["start"] < q_end and w["end"] > q_start for w in words):
            keep = KEPT_PAUSE_SECONDS / 2
            pieces.append((cursor, q_start + keep))
            removed.append({"from": round(q_start + keep, 3), "to": round(q_end - keep, 3), "why": "pause"})
            cursor = q_end - keep
    pieces.append((cursor, end))

    # Short untranscribed bursts that never reach speech level are breaths.
    result = []
    for s, e in pieces:
        cut_at = s
        part = db[int(s / HOP_SECONDS) : int(e / HOP_SECONDS)]
        for bs, be in regions_of(part > low):
            b_start, b_end = s + bs * HOP_SECONDS, s + be * HOP_SECONDS
            peak = float(np.max(part[bs:be]))
            spoken = any(w["start"] < b_end and w["end"] > b_start for w in words)
            if not spoken and b_end - b_start < BREATH_SECONDS and peak < high:
                if b_start - cut_at > 0.05:
                    result.append((cut_at, b_start))
                removed.append({"from": round(b_start, 3), "to": round(b_end, 3), "why": "breath"})
                cut_at = b_end
        if e - cut_at > 0.05:
            result.append((cut_at, e))

    # Join pieces split by a gap too short to hear; drop slivers with no word in them.
    joined = []
    for s, e in result:
        if joined and s - joined[-1][1] < MIN_GAP_SECONDS:
            joined[-1] = (joined[-1][0], e)
        else:
            joined.append((s, e))
    joined = [(s, e) for s, e in joined
              if e - s >= MIN_PIECE_SECONDS or any(w["start"] < e and w["end"] > s for w in words)]
    return joined, removed


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("video", type=pathlib.Path)
    parser.add_argument("--transcript", type=pathlib.Path)
    args = parser.parse_args()

    stem = args.video.stem
    project = ROOT / "projects" / stem
    transcript_path = args.transcript or ROOT / "work" / f"{stem}.medium.transcript.json"
    transcript = json.loads(transcript_path.read_text(encoding="utf-8"))
    invented = [s for s in transcript["segments"] if hallucinated(s)]
    words = [w for segment in transcript["segments"] if segment not in invented
             for w in segment["words"] if w["text"].strip()]

    wav = ROOT / "work" / f"{stem}.16k.wav"
    if not wav.exists():
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(args.video),
                        "-vn", "-ac", "1", "-ar", str(SAMPLE_RATE), str(wav)], check=True)
    with wave.open(str(wav)) as audio:
        samples = np.frombuffer(audio.readframes(audio.getnframes()), dtype=np.int16)
    db = loudness_db(samples.astype(np.float32) / 32768)
    floor = float(np.percentile(db, 10))
    duration = len(samples) / SAMPLE_RATE

    words = tighten_words(db, words)
    fillers = [w for w in words if re.sub(r"[^\w]", "", w["text"]).lower() in FILLERS]
    words = [w for w in words if w not in fillers]
    forms = [sound_forms(w["text"])[0] for w in words]

    overrides_path = project / "take_overrides.json"
    overrides = json.loads(overrides_path.read_text(encoding="utf-8")) if overrides_path.exists() else {}

    lines = []
    for number, line in enumerate(script_lines(project / "script.txt"), 1):
        tokens = line_tokens(line)
        attempts = []
        for score, i, j in attempts_of(tokens, words, forms):
            attempts.append({"start": round(words[i]["start"], 2), "end": round(words[j - 1]["end"], 2),
                             "score": round(score), "heard": " ".join(w["text"] for w in words[i:j]),
                             "problems": problems_in(tokens, words, i, j, score), "i": i, "j": j})
        lines.append({"line": number, "script": line, "attempts": attempts})

    # Lines with the surest match choose first, so a loose window of one line
    # never takes the words of its neighbour.
    used = []
    for entry in sorted(lines, key=lambda e: -max((a["score"] for a in e["attempts"]), default=0)):
        free = [a for a in entry["attempts"] if all(a["j"] <= i or a["i"] >= j for i, j in used)]
        clean = [a for a in free if not a["problems"]]
        # "Last" only among real retakes, not a loose window that half-matches.
        clean = [a for a in clean if a["score"] >= max(c["score"] for c in clean) - RETAKE_SCORE_SPREAD]
        chosen = clean[-1] if clean else max(free, key=lambda a: a["score"], default=None)
        if clean:
            reason = (f"last of {len(clean)} clean takes" if len(clean) > 1 else "only clean take")
        elif chosen:
            reason = "FLAG: no clean take; best match used (" + ", ".join(chosen["problems"]) + ")"
        else:
            reason = "FLAG: line not found in the recording"
        if chosen:
            used.append((chosen["i"], chosen["j"]))
        entry.update(chosen=chosen, reason=reason)

    # Lines spoken in one breath from the same take stay one piece, so the
    # words between them are neither doubled nor clipped.
    runs = []
    for entry in lines:
        take = entry["chosen"]
        if not take:
            continue
        previous = runs[-1][-1]["chosen"] if runs else None
        if previous and previous["j"] == take["i"] and take["start"] - previous["end"] < SAME_BREATH_SECONDS:
            runs[-1].append(entry)
        else:
            runs.append([entry])

    segments, cutlist = [], []
    for run in runs:
        i, j = run[0]["chosen"]["i"], run[-1]["chosen"]["j"]
        before = words[i - 1]["end"] if i > 0 else 0
        after = words[j]["start"] if j < len(words) else duration
        first = voice_edge(db, words[i]["start"], -1, before)
        last = voice_edge(db, words[j - 1]["end"], 1, after)
        start = snap(db, max(0, first - LEAD_SECONDS), before, first)
        end = snap(db, last + TAIL_SECONDS, last, after)
        # Cuts placed by hand after listening, for spots the rules get wrong.
        start = overrides.get(str(run[0]["line"]), {}).get("from", start)
        end = overrides.get(str(run[-1]["line"]), {}).get("to", end)
        pieces, removed = split_pauses(db, start, end, words[i:j], floor)
        for s, e in pieces:
            segments.append({"from": round(s, 3), "to": round(e, 3), "zoom": 1})
        for entry in run:
            take = entry["chosen"]
            cutlist.append({
                "line": entry["line"], "script": entry["script"],
                "sourceIn": round(max(start, take["start"] - LEAD_SECONDS), 3),
                "sourceOut": round(min(end, take["end"] + TAIL_SECONDS), 3),
                "sameTakeAs": [e["line"] for e in run if e is not entry],
                "pieces": [{"from": round(s, 3), "to": round(e, 3)} for s, e in pieces
                           if e > take["start"] and s < take["end"]],
                "removedInside": [r for r in removed if take["start"] <= r["from"] < take["end"]],
                "matchScore": take["score"], "heard": take["heard"], "reason": entry["reason"],
                "override": overrides.get(str(entry["line"]), {}).get("why"),
                "otherAttempts": [{k: a[k] for k in ("start", "end", "score", "problems")}
                                  for a in entry["attempts"] if a is not take],
            })

    edit_path = project / "edit.json"
    edit = json.loads(edit_path.read_text(encoding="utf-8")) if edit_path.exists() else {"overlays": []}
    edit["footage"] = args.video.name
    edit["segments"] = [{k: s[k] for k in ("from", "to", "zoom")} for s in segments]
    edit_path.write_text(json.dumps(edit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    kept = sum(s["to"] - s["from"] for s in segments)
    flagged = [e for e in lines if e["reason"].startswith("FLAG")]
    report = {"sourceSeconds": round(duration, 2), "keptSeconds": round(kept, 2),
              "segments": len(segments), "fillersRemoved": [{"text": w["text"], "start": w["start"]} for w in fillers],
              "flaggedLines": [e["line"] for e in flagged],
              "inventedByWhisper": [{"start": s["start"], "end": s["end"], "text": s["text"]} for s in invented],
              "lines": cutlist}
    (project / "cutlist.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    md = [f"# Cut list: {stem}", "",
          f"Source {duration:.1f} s, kept {kept:.1f} s in {len(segments)} segments.", ""]
    if flagged:
        md += ["## Flagged lines", ""] + [f"- Line {e['line']}: {e['reason']}" for e in flagged] + [""]
    if invented:
        md += ["## Ignored: text Whisper invented over unclear sound", ""]
        md += [f"- {s['start']:.2f}–{s['end']:.2f} s: {s['text']}" for s in invented] + [""]
    md += ["## Lines", ""]
    for c in cutlist:
        md += [f"### {c['line']}. {c['script']}", "",
               f"- Source {c['sourceIn']:.2f}–{c['sourceOut']:.2f} s, match {c['matchScore']}, {c['reason']}",
               f"- Heard (Whisper, Devanagari): {c['heard']}",
               f"- Pauses/breaths removed inside: {len(c['removedInside'])}"]
        if c["override"]:
            md.append(f"- Cut placed by hand: {c['override']}")
        for a in c["otherAttempts"]:
            md.append(f"- Other attempt {a['start']:.2f}–{a['end']:.2f} s, match {a['score']}"
                      + (f" ({', '.join(a['problems'])})" if a["problems"] else " (clean, earlier)"))
        md.append("")
    (project / "cutlist.md").write_text("\n".join(md), encoding="utf-8")

    print(f"{duration:.1f}s -> {kept:.1f}s in {len(segments)} segments; flagged lines: {[e['line'] for e in flagged]}")


if __name__ == "__main__":
    main()
