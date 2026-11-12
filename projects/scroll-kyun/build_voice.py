"""Cut the finished voiceover from the raw take: one clean take per script line.

Usage: .venv\\Scripts\\python projects/scroll-kyun/build_voice.py

Starts from scripts/pick_takes.py's choices (projects/scroll-kyun/cutlist.json) and replaces
the lines it could not settle with pieces chosen by hand from the word timings (HAND below,
each with the reason). Every piece edge walks out to where the voice really ends and snaps
to the quietest 10 ms; pauses inside a piece longer than 0.35 s shrink to 0.2 s. Lines
from different takes are joined with a short breath of room tone, a longer one where a
chapter turns. The voice chain of scripts/voice_chain.py runs on the whole take first, so
every piece has the same sound.

Writes public/footage/scroll-kyun.voice.wav and projects/scroll-kyun/voice_map.json (every
piece: source range, output range, line).
"""
import json
import pathlib
import subprocess
import sys
import wave

import numpy as np

ROOT = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
from auto_edit import HOP_SECONDS, loudness_db  # noqa: E402
from pick_takes import split_pauses, voice_edge, snap  # noqa: E402
from voice_chain import CHAIN, VOICE_LUFS, VOICE_PEAK, WORKING_LUFS, loudness  # noqa: E402

PROJECT = ROOT / "projects" / "scroll-kyun"
RAW = ROOT / "public" / "footage" / "scroll-kyun.m4a"
PROCESSED = ROOT / "work" / "scroll-kyun.voice_full.wav"
OUT = ROOT / "public" / "footage" / "scroll-kyun.voice.wav"
RATE = 48000
LEAD, TAIL = 0.08, 0.12
LINE_GAP = 0.14  # added room tone between lines from different takes
CHAPTER_GAP = 0.55  # where the picture turns to a new chapter
CHAPTERS = {17, 30, 43, 48, 55, 59, 64, 78, 87, 98, 106, 114, 120, 126, 130}

# Lines pick_takes got wrong or could not place, cut from the word timings by hand.
# Each piece is (first word start, last word end) on the source.
HAND = {
    # A [list] piece is exact: its edges were read off the loudness by hand and are not
    # walked outward (they sit right next to a broken take). A (tuple) piece is walked.
    7: ([(48.48, 51.78)], "two tries at 43,800; the second, whole one"),
    14: ([[78.74, 81.20]], "an unheard false start at 76.4-77.6 is left out"),
    29: ([[175.50, 182.30]], "the end of 'laga raha' runs to 182.25"),
    35: ([[222.26, 224.25]], "line said twice in a row; the retake (222.3-224.2)"),
    43: ([[246.98, 249.55]], "the first take, which has 'Lekin'; the retake that follows drops it"),
    47: ([[265.55, 268.25]], "ends before the broken first try at the Schultz line (268.85)"),
    20: ([(111.98, 114.20), (116.55, 118.77)], "'daana kirta' re-said as 'toh khaane ka ek daana girta'"),
    21: ([(118.95, 120.03)], "the end of that retake"),
    23: ([(128.32, 131.14)], "kept clear of the broken 'dusre' that follows"),
    24: ([[133.08, 134.88]], "first try broke off at 'dusre mein har das-' (131.3-132.3); the second, whole one"),
    26: ([(156.92, 160.04), (165.07, 166.85)], "'kabhi do...' broke off; restarted 'kabhi do baar lagataar'"),
    30: ([(183.00, 186.44)], "pick_takes clipped 'Psychology'; the voice starts at 182.94"),
    46: ([(263.23, 265.57)], "started 'log ise' twice; the second start"),
    48: ([[271.35, 279.60]], "first try broke off after the name (268.5-270.3); the full second try"),
    56: ([(338.01, 341.13)], "pick_takes stopped before 'fifty-fifty'"),
    66: ([(403.06, 410.00)], "pick_takes clipped 'two thousand six'"),
    69: ([(457.31, 460.57), (464.21, 466.65)], "'toh tum bas...' broke off and was re-said"),
    71: ([[479.60, 482.42], (487.81, 495.00)], "the name said twice; the clear second 'Sandy Parakilas ne kaha' (first try starts 482.6)"),
    78: ([(535.72, 538.55)], "the first take is whole; the retake breaks for 0.6 s after 'seedha'"),
    81: ([[561.88, 564.05], [565.72, 566.50]], "'kuch p-' broke off (564.2-564.6); 'kuch par kam' re-said"),
    82: ([[573.86, 581.30]], "first try broke off after 'hissa... zyada' (567.2-572.3); the whole retake"),
    83: ([[586.36, 592.10]], "'aur teenagers bhi unhi-' broke off (584.5-585.8); the restart"),
    85: ([[593.38, 595.18], [597.46, 599.35]], "'resear-' broke off (596.1-596.8); 'researchers ne khud lagaye the' re-said"),
    90: ([(627.69, 628.80), [630.20, 633.75]], "'do researchers' said twice; the second"),
    93: ([[650.55, 655.25]], "pick_takes cut the end of 'percent' (voice runs to 655.2)"),
    100: ([[689.72, 696.10]], "'Harvard Health par ek doct-' broke off (687.5-689.0); the restart"),
    104: ([[720.55, 721.58], [723.78, 726.25]], "'lekin idea ek hissa-' broke off; 'lekin idea ka ek hissa kaam ka hai' re-said"),
    107: ([[731.90, 737.74], [740.76, 743.02]], "stumble 'jin mein bahut sa-' cut; 'jin mein bahut se log ghaate mein rehte hain'"),
    109: ([(753.07, 757.92)], "the retake: 'lafz hai maghbun, aur ye bazaar ka lafz hai'"),
    113: ([[791.85, 794.52], [800.12, 802.85]], "'...kis cheez ke liye badle gaye' re-said as 'aur pata hi na chale ki kis cheez ke badle gaya'"),
    123: ([[837.00, 840.44], (850.05, 852.75)], "'bore hote hi haath ka jeb mein jaana', third try, as scripted"),
    130: ([[900.40, 904.98]], "'agar ye video tumhare liye...' restarted; the second 'agar ye video tumhe...'"),
    124: ([(864.67, 870.50)], "first try broke off at 'taaki apps itna...'; the full second try"),
}


def main():
    cut = json.loads((PROJECT / "cutlist.json").read_text(encoding="utf-8"))
    transcript = json.loads((ROOT / "work" / "scroll-kyun.merged.transcript.json").read_text(encoding="utf-8"))
    words = sorted((w for s in transcript["segments"] for w in s["words"] if w["text"].strip()), key=lambda w: w["start"])

    if not PROCESSED.exists():
        source = loudness(RAW, "pan=mono|c0=0.5*c0+0.5*c1,highpass=f=80:poles=2")
        chain = CHAIN.format(pre_gain=WORKING_LUFS - float(source["input_i"]))
        measured = loudness(RAW, chain)
        match = (f"loudnorm=I={VOICE_LUFS}:TP={VOICE_PEAK}:LRA=11:measured_I={measured['input_i']}"
                 f":measured_TP={measured['input_tp']}:measured_LRA={measured['input_lra']}"
                 f":measured_thresh={measured['input_thresh']}:offset={measured['target_offset']}:linear=true")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(RAW), "-vn", "-af", f"{chain},{match}",
                        "-ar", str(RATE), "-ac", "1", "-c:a", "pcm_s16le", str(PROCESSED)], check=True)
    with wave.open(str(PROCESSED)) as audio:
        voice = np.frombuffer(audio.readframes(audio.getnframes()), dtype=np.int16).astype(np.float32) / 32768

    # Loudness on the 16 kHz analysis copy, as pick_takes measures it.
    with wave.open(str(ROOT / "work" / "scroll-kyun.16k.wav")) as audio:
        analysis = np.frombuffer(audio.readframes(audio.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    db = loudness_db(analysis)
    floor = float(np.percentile(db, 10))

    def neighbours(t0, t1):
        before = max([w["end"] for w in words if w["end"] <= t0 + 0.01] or [0])
        after = min([w["start"] for w in words if w["start"] >= t1 - 0.01] or [len(analysis) / 16000])
        return before, after

    def walk(t, step, limit):
        """From a Whisper word edge, step out 10 ms at a time to where the voice has been
        quiet for 40 ms (this stretch's own room tone + 8 dB), at most 1 s, never past limit."""
        around = db[max(0, int((t - 5) / HOP_SECONDS)) : int((t + 5) / HOP_SECONDS)]
        quiet = float(np.percentile(around, 5)) + 8
        k, calm = int(t / HOP_SECONDS), 0
        for _ in range(100):
            nxt = k + step
            if nxt < 0 or nxt >= len(db) or (nxt * HOP_SECONDS - limit) * step >= 0:
                break
            k = nxt
            calm = calm + 1 if db[k] < quiet else 0
            if calm >= 4:
                k -= step * 3
                break
        return k * HOP_SECONDS

    def edges(t0, t1):
        before, after = neighbours(t0, t1)
        first = walk(t0, -1, before)
        last = walk(t1, 1, after)
        start = min(first, max(before, snap(db, max(0, first - LEAD), before, first)))
        end = max(last, min(after, snap(db, last + TAIL, last, after)))
        return start, end

    pieces = []  # (line, from, to)
    for entry in cut["lines"]:
        n = entry["line"]
        if n in HAND:
            for piece in HAND[n][0]:
                a, b = (piece[0], piece[1]) if isinstance(piece, list) else edges(*piece)
                pieces.append((n, a, b))
        else:
            # pick_takes trusts Whisper's word edges, which often end a word early or start it
            # late; walk both edges out to where the voice really stops.
            a, b = edges(entry["sourceIn"] + LEAD, entry["sourceOut"] - TAIL)
            pieces.append((n, a, b))
    if 48 not in {p[0] for p in pieces}:
        a, b = edges(*HAND[48][0][0])
        pieces.append((48, a, b))
    pieces.sort(key=lambda p: (p[0], p[1]))

    # Consecutive lines from one breath (less than 0.6 s apart in the take) stay one piece,
    # so nothing between them is dropped.
    joined = []
    for n, a, b in pieces:
        if joined and a <= joined[-1]["to"] + 0.6 and a >= joined[-1]["from"]:
            joined[-1]["to"] = max(joined[-1]["to"], b)
            joined[-1]["lines"].append(n)
        else:
            joined.append({"from": a, "to": b, "lines": [n]})

    out, mapping, cursor = [], [], 0.0
    fade = int(0.012 * RATE)
    for k, piece in enumerate(joined):
        inside = [w for w in words if piece["from"] <= w["start"] < piece["to"]]
        parts, _ = split_pauses(db, piece["from"], piece["to"], inside, floor)
        if k > 0:
            first_line = piece["lines"][0]
            gap = CHAPTER_GAP if first_line in CHAPTERS and first_line not in joined[k - 1]["lines"] else LINE_GAP
            if first_line in joined[k - 1]["lines"]:
                gap = 0.06  # a splice inside one line
            out.append(np.zeros(int(gap * RATE), dtype=np.float32))
            cursor += gap
        for s, e in parts:
            chunk = voice[int(s * RATE) : int(e * RATE)].copy()
            chunk[:fade] *= np.linspace(0, 1, fade)
            chunk[-fade:] *= np.linspace(1, 0, fade)
            mapping.append({"lines": piece["lines"], "sourceFrom": round(s, 3), "sourceTo": round(e, 3),
                            "outFrom": round(cursor, 3), "outTo": round(cursor + len(chunk) / RATE, 3)})
            out.append(chunk)
            cursor += len(chunk) / RATE

    tail = np.zeros(int(0.8 * RATE), dtype=np.float32)
    audio = np.concatenate(out + [tail])
    with wave.open(str(OUT), "wb") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(RATE)
        f.writeframes((np.clip(audio, -1, 1) * 32767).astype(np.int16).tobytes())
    (PROJECT / "voice_map.json").write_text(json.dumps({"seconds": round(len(audio) / RATE, 3), "pieces": mapping,
                                                         "hand": {str(k): v[1] for k, v in HAND.items()}},
                                                        ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines_out = sorted({n for p in joined for n in p["lines"]})
    missing = [n for n in range(1, 131) if n not in lines_out]
    print(f"{len(joined)} pieces, {len(mapping)} parts, {len(audio) / RATE:.1f} s -> {OUT.relative_to(ROOT)}; missing lines: {missing}")


if __name__ == "__main__":
    main()
