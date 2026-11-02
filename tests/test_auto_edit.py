"""Run with: .venv\\Scripts\\python -m unittest discover tests"""
import pathlib
import sys
import unittest

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "scripts"))
import auto_edit  # noqa: E402


def word(text, start, end):
    return {"text": text, "start": start, "end": end}


def timed(phrase, start):
    return [word(text, start + i * 0.3, start + i * 0.3 + 0.25)
            for i, text in enumerate(phrase.split())]


def loudness(sections, seconds):
    """Quiet room with louder (start, end, dB) sections, at 10 ms steps."""
    db = np.full(int(seconds * 100), -40.0)
    for start, end, level in sections:
        db[int(start * 100):int(end * 100)] = level
    return db


class Retakes(unittest.TestCase):
    def test_repeated_phrase_drops_the_first_take(self):
        first = timed("हम तो उसकी उंगलियों", 0)
        second = timed("हम तो उसकी उंगलियों के पोरों तक", 3)
        retakes = auto_edit.find_retakes(auto_edit.phrases_of(first + second))
        self.assertEqual(len(retakes), 1)
        self.assertEqual(retakes[0]["start"], 0)
        self.assertEqual(retakes[0]["end"], 3)

    def test_different_phrases_stay(self):
        phrases = auto_edit.phrases_of(timed("अब ज़रा गौर करो", 0) + timed("आज मॉडर्न साइंस जानती है", 3))
        self.assertEqual(auto_edit.find_retakes(phrases), [])

    def test_short_emphasis_is_not_a_retake(self):
        phrases = auto_edit.phrases_of(timed("सोचो सोचो", 0) + timed("सोचो सोचो", 3))
        self.assertEqual(auto_edit.find_retakes(phrases), [])


class Speech(unittest.TestCase):
    def test_breath_is_removed(self):
        db = loudness([(1, 3, -16), (4, 4.1, -18), (6, 8, -16)], 10)
        words = [word("क", 1, 3), word("ख", 6, 8)]
        spans, flagged = auto_edit.speech_spans(db, words)
        self.assertEqual(len(spans), 2)
        self.assertEqual(flagged, [])

    def test_sound_without_words_is_kept_and_flagged(self):
        db = loudness([(1, 3, -16), (5, 7, -16)], 10)
        spans, flagged = auto_edit.speech_spans(db, [word("क", 1, 3)])
        self.assertEqual(len(spans), 2)
        self.assertEqual(flagged, [{"start": 5.0, "end": 7.0}])

    def test_short_pause_stays(self):
        db = loudness([(1, 3, -16), (3.4, 5, -16)], 10)
        spans, _ = auto_edit.speech_spans(db, [word("क", 1, 3), word("ख", 3.4, 5)])
        self.assertEqual(len(spans), 1)

    def test_quiet_word_is_never_cut(self):
        db = loudness([(1, 3, -16), (6, 8, -16)], 10)
        words = [word("क", 1, 3), word("धीमा", 4.5, 4.8), word("ख", 6, 8)]
        spans, _ = auto_edit.speech_spans(db, words)
        self.assertTrue(any(s <= 4.5 and e >= 4.8 for s, e in spans))


class Segments(unittest.TestCase):
    def test_cuts_land_on_frames_and_zoom_alternates(self):
        segments = auto_edit.to_segments([(1, 2), (4, 5)], 10)
        for segment in segments:
            self.assertAlmostEqual(segment["from"] * 30, round(segment["from"] * 30), places=1)
        self.assertEqual([s["zoom"] for s in segments], [1, auto_edit.PUNCH_IN])

    def test_retake_is_cut_out(self):
        spans = auto_edit.subtract([(0, 10)], [{"start": 2, "end": 5}])
        self.assertEqual(spans, [(0, 2), (5, 10)])

    def test_lost_word_is_reported(self):
        segments = [{"from": 0, "to": 2, "zoom": 1}]
        lost = auto_edit.lost_words([word("क", 1, 1.5), word("ख", 3, 3.5)], segments, [])
        self.assertEqual([w["text"] for w in lost], ["ख"])


if __name__ == "__main__":
    unittest.main()
