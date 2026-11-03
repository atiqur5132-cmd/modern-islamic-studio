"""Build Hinglish captions: spelling from the script, timing from Whisper.

The script is written in Hinglish (Roman Hindi). Whisper writes Devanagari; the two
are matched by sound.

Usage: .venv\\Scripts\\python scripts/make_captions.py <clip>
           [--transcript work/clip.medium.transcript.json]

Reads projects/<clip>/script.txt, where *stars* mark words to emphasise, and writes
the captions into projects/<clip>/edit.json. Run it after auto_edit.py. Times measured
by hand for words Whisper missed go in projects/<clip>/caption_times.json. Words whose
timing is uncertain are listed in work/<clip>.captions_review.txt.

Whisper text never reaches the screen. It only says when each script word was spoken.
"""
import argparse
import json
import pathlib
import re
import unicodedata

import hinglish

ROOT = pathlib.Path(__file__).resolve().parent.parent

NUKTA = "़"
CHANDRABINDU = "ँ"
ANUSVARA = "ं"
MATCH_THRESHOLD = 0.5
GAP_PENALTY = -0.3
REVIEW_BELOW = 0.6
MAX_PHRASE_WORDS = 3
MAX_PHRASE_CHARS = 16
PHRASE_BREAK_SECONDS = 0.25
SENTENCE_END = (",", ".", "?", "!", "।", ":", ";")
# Hindi words that lean on the word before, so a caption must not start with them.
CLINGING_WORDS = {"ka", "ki", "ke", "ko", "mein", "me", "par", "se", "tak", "hai", "hain", "tha",
                  "thi", "the", "ho", "gaya", "gayi", "gaye",
                  "का", "की", "के", "को", "में", "पर", "से", "तक", "है", "हैं", "था", "थी", "थे",
                  "हो", "गया", "गई", "गए"}
MIN_KEPT_OVERLAP_SECONDS = 0.1
ABSORB_GAP_SECONDS = 0.35
ABSORB_MAX_CHARS = 22  # may wrap to a second line, still inside the caption band


def parse_script(text):
    """Split the script into words, tracking which sit between *stars*."""
    words = []
    emphasis = False
    for token in text.split():
        starts = token.startswith("*")
        ends = token.rstrip(",.?!।:;").endswith("*")
        emphasis = emphasis or starts
        words.append({"text": token.replace("*", ""), "emphasis": emphasis})
        if ends:
            emphasis = False
    return words


def normalise(text):
    decomposed = unicodedata.normalize("NFD", text)
    cleaned = re.sub(r"[^\wऀ-ॿ]", "", decomposed)
    return cleaned.replace(NUKTA, "").replace(CHANDRABINDU, ANUSVARA).lower()


def similarity(script_word, whisper_word):
    return hinglish.similarity(script_word, whisper_word)


def align(script_words, whisper_words):
    """Global alignment of the two word lists. Returns (script i, whisper j, score)."""
    rows, columns = len(script_words) + 1, len(whisper_words) + 1
    scores = [[0.0] * columns for _ in range(rows)]
    moves = [[""] * columns for _ in range(rows)]
    for i in range(1, rows):
        scores[i][0], moves[i][0] = i * GAP_PENALTY, "script"
    for j in range(1, columns):
        scores[0][j], moves[0][j] = j * GAP_PENALTY, "whisper"

    match_scores = {}
    for i in range(1, rows):
        for j in range(1, columns):
            match = similarity(script_words[i - 1]["text"], whisper_words[j - 1]["text"])
            match_scores[i, j] = match
            options = [(scores[i - 1][j - 1] + 2 * (match - MATCH_THRESHOLD), "match"),
                       (scores[i - 1][j] + GAP_PENALTY, "script"),
                       (scores[i][j - 1] + GAP_PENALTY, "whisper")]
            scores[i][j], moves[i][j] = max(options, key=lambda option: option[0])

    pairs = []
    i, j = rows - 1, columns - 1
    while i > 0 and j > 0:
        move = moves[i][j]
        if move == "match":
            pairs.append((i - 1, j - 1, match_scores[i, j]))
            i, j = i - 1, j - 1
        elif move == "script":
            i -= 1
        else:
            j -= 1
    return pairs[::-1]


def timed_words(script_words, whisper_words, pairs):
    """Give each script word its time. Words without a match share the gap around them."""
    words = [dict(word, start=None, end=None, score=0.0) for word in script_words]
    for index, (i, j, score) in enumerate(pairs):
        # A number spoken as several words matches on the first and owns the rest.
        next_j = pairs[index + 1][1] if index + 1 < len(pairs) else j + 1
        last_j = next_j - 1 if any(c.isdigit() for c in words[i]["text"]) else j
        words[i].update(start=whisper_words[j]["start"],
                        end=whisper_words[last_j]["end"], score=round(score, 2))

    index = 0
    while index < len(words):
        if words[index]["start"] is not None:
            index += 1
            continue
        stop = index
        while stop < len(words) and words[stop]["start"] is None:
            stop += 1
        begin = words[index - 1]["end"] if index else whisper_words[0]["start"]
        finish = words[stop]["start"] if stop < len(words) else whisper_words[-1]["end"]
        step = max(finish - begin, 0) / (stop - index)
        for offset in range(stop - index):
            words[index + offset].update(start=round(begin + offset * step, 3),
                                         end=round(begin + (offset + 1) * step, 3))
        index = stop
    return words


def apply_measured_times(words, path):
    """Words Whisper never wrote (recitation, single letters) get times measured by hand
    from the audio, in projects/<clip>/caption_times.json; each goes to the word of
    that text nearest its `near` time."""
    if not path.exists():
        return
    for fixed in json.loads(path.read_text(encoding="utf-8"))["words"]:
        same = [w for w in words if w["text"] == fixed["text"]]
        if not same:
            raise SystemExit(f"caption_times.json: no script word {fixed['text']!r}")
        word = min(same, key=lambda w: abs(w["start"] - fixed["near"]))
        word.update(start=fixed["start"], end=fixed["end"], score=1.0)


def group_phrases(words):
    """Group words into short captions that break where the speaker breaks."""
    phrases = [[]]
    for word in words:
        current = phrases[-1]
        if current:
            characters = sum(len(w["text"]) + 1 for w in current) + len(word["text"])
            spoken_break = word["start"] - current[-1]["end"] > PHRASE_BREAK_SECONDS
            sentence_ended = current[-1]["text"].endswith(SENTENCE_END)
            too_long = len(current) >= MAX_PHRASE_WORDS or characters > MAX_PHRASE_CHARS
            clings = normalise(word["text"]) in {normalise(w) for w in CLINGING_WORDS}
            # A last word that ends the sentence joins the caption rather than standing alone.
            closes = word["text"].endswith(SENTENCE_END) and len(current) < MAX_PHRASE_WORDS + 1
            if spoken_break or sentence_ended or (too_long and not clings and not closes):
                phrases.append([])
        phrases[-1].append(word)
    return phrases


def absorb_single_words(phrases):
    """A caption of one word flashes by; join it to a neighbour spoken close to it.
    An emphasised word may stand alone, and so may a word with no close neighbour.
    A full neighbour lends its last word instead, so no caption passes four words."""
    def chars(words):
        return sum(len(w["text"]) + 1 for w in words)

    def close(a, b):
        """Spoken close together, and inside one sentence (a comma may sit between)."""
        ends_sentence = a["text"].rstrip('"').endswith(SENTENCE_END) and not a["text"].endswith(",")
        return b["start"] - a["end"] <= ABSORB_GAP_SECONDS and not ends_sentence

    result = []
    for phrase in phrases:
        result.append(list(phrase))
    index = 0
    while index < len(result):
        phrase = result[index]
        if len(phrase) != 1 or phrase[0]["emphasis"]:
            index += 1
            continue
        before = result[index - 1] if index else None
        after = result[index + 1] if index + 1 < len(result) else None
        if before and close(before[-1], phrase[0]) and len(before) < MAX_PHRASE_WORDS + 1                 and chars(before + phrase) <= ABSORB_MAX_CHARS and not before[-1]["emphasis"]:
            before.extend(phrase)
            del result[index]
        elif after and close(phrase[0], after[0]) and len(after) < MAX_PHRASE_WORDS + 1                 and chars(phrase + after) <= ABSORB_MAX_CHARS and not after[0]["emphasis"]:
            after[:0] = phrase
            del result[index]
        elif before and len(before) >= MAX_PHRASE_WORDS + 1 and close(before[-1], phrase[0]):
            phrase.insert(0, before.pop())
            index += 1
        elif after and len(after) >= 2 and close(phrase[0], after[0]) and not after[0]["emphasis"]:
            phrase.append(after.pop(0))
            index += 1
        else:
            index += 1
    return result


def kept_words(words, segments):
    """Words heard in the edit. Whisper's edges are loose, so overlap decides, not start."""
    def heard(word):
        needed = min(MIN_KEPT_OVERLAP_SECONDS, (word["end"] - word["start"]) / 2)
        return any(min(word["end"], s["to"]) - max(word["start"], s["from"]) >= needed
                   for s in segments)

    return [w for w in words if heard(w)]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("clip")
    parser.add_argument("--transcript", type=pathlib.Path)
    args = parser.parse_args()

    project = ROOT / "projects" / args.clip
    edit_path = project / "edit.json"
    edit = json.loads(edit_path.read_text(encoding="utf-8"))
    transcript_path = args.transcript or ROOT / "work" / f"{args.clip}.medium.transcript.json"
    transcript = json.loads(transcript_path.read_text(encoding="utf-8"))

    whisper_words = kept_words([w for s in transcript["segments"] for w in s["words"]],
                               edit["segments"])
    script_words = parse_script((project / "script.txt").read_text(encoding="utf-8"))
    pairs = align(script_words, whisper_words)
    words = timed_words(script_words, whisper_words, pairs)
    apply_measured_times(words, project / "caption_times.json")

    edit["captions"] = [
        [{"text": w["text"], "start": w["start"], "end": w["end"], "emphasis": w["emphasis"]}
         for w in phrase]
        for phrase in absorb_single_words(group_phrases(words))
    ]
    edit_path.write_text(json.dumps(edit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    uncertain = [w for w in words if w["score"] < REVIEW_BELOW]
    review_path = ROOT / "work" / f"{args.clip}.captions_review.txt"
    review_path.write_text(
        "\n".join(f'{w["start"]:7.2f}s  {w["text"]}  (match {w["score"]})' for w in uncertain) + "\n",
        encoding="utf-8",
    )
    print(f"{len(script_words)} script words, {len(whisper_words)} spoken words, "
          f"{len(pairs)} matched, {len(edit['captions'])} captions")
    print(f"Check the timing of {len(uncertain)} words in {review_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
