"""Run with: .venv\\Scripts\\python -m unittest discover tests"""
import pathlib
import sys
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "scripts"))
import make_captions as mc  # noqa: E402


def spoken(text, start=0.0, step=0.5):
    return [{"text": word, "start": start + i * step, "end": start + i * step + 0.4}
            for i, word in enumerate(text.split())]


def build(script, whisper):
    words = mc.parse_script(script)
    return mc.timed_words(words, whisper, mc.align(words, whisper))


class Script(unittest.TestCase):
    def test_stars_mark_one_word(self):
        words = mc.parse_script("हर *इंसान* का")
        self.assertEqual([w["emphasis"] for w in words], [False, True, False])
        self.assertEqual(words[1]["text"], "इंसान")

    def test_stars_mark_several_words(self):
        words = mc.parse_script("इस *असल कॉन्टेक्स्ट,* का")
        self.assertEqual([w["emphasis"] for w in words], [False, True, True, False])
        self.assertEqual(words[2]["text"], "कॉन्टेक्स्ट,")


class Alignment(unittest.TestCase):
    def test_spelling_comes_from_the_script(self):
        words = build("क़ुरान को पढ़ो", spoken("कुरान को पढो"))
        self.assertEqual([w["text"] for w in words], ["क़ुरान", "को", "पढ़ो"])
        self.assertEqual(words[2]["start"], 1.0)

    def test_number_spoken_as_two_words_owns_both(self):
        words = build("क़ुरान में 1400 साल पहले", spoken("कुरान में चोदा सो साल पहले"))
        by_text = {w["text"]: w for w in words}
        self.assertEqual(by_text["साल"]["start"], 2.0)
        self.assertLess(by_text["1400"]["start"], by_text["साल"]["start"])

    def test_word_whisper_missed_gets_a_time_between_neighbours(self):
        words = build("अब ज़रा ग़ौर करो", spoken("अब गौर करो"))
        missing = words[1]
        self.assertGreater(missing["start"], words[0]["start"])
        self.assertLess(missing["start"], words[2]["start"])

    def test_times_never_go_backwards(self):
        words = build("एक दो तीन चार पांच", spoken("एक तीन पांच"))
        starts = [w["start"] for w in words]
        self.assertEqual(starts, sorted(starts))


class Phrases(unittest.TestCase):
    def word(self, text, start):
        return {"text": text, "start": start, "end": start + 0.3, "emphasis": False}

    def test_breaks_after_sentence_end(self):
        words = [self.word("क्यों", 0), self.word("नहीं?", 0.3), self.word("हम", 0.6)]
        self.assertEqual([len(p) for p in mc.group_phrases(words)], [2, 1])

    def test_never_more_than_the_word_limit(self):
        words = [self.word("क", i * 0.3) for i in range(9)]
        self.assertTrue(all(len(p) <= mc.MAX_PHRASE_WORDS for p in mc.group_phrases(words)))

    def test_caption_never_starts_with_a_clinging_word(self):
        for text in ("अ ब स द के पोरों", "a b c ke poron ka zikr", "a b c d e ke f"):
            with self.subTest(text):
                words = [self.word(t, i * 0.3) for i, t in enumerate(text.split())]
                for phrase in mc.group_phrases(words)[1:]:
                    self.assertNotIn(phrase[0]["text"], mc.CLINGING_WORDS)

    def test_word_starting_just_before_a_cut_is_kept(self):
        segments = [{"from": 12.4, "to": 16}]
        word = [{"text": "क्या", "start": 12.31, "end": 12.7}]
        self.assertEqual(mc.kept_words(word, segments), word)

    def test_breaks_where_the_speaker_pauses(self):
        words = [self.word("क", 0), self.word("ख", 1.0)]
        self.assertEqual(len(mc.group_phrases(words)), 2)

    def test_removed_words_are_left_out(self):
        segments = [{"from": 5, "to": 10}]
        kept = mc.kept_words(spoken("एक दो", 0) + spoken("तीन", 6), segments)
        self.assertEqual([w["text"] for w in kept], ["तीन"])


if __name__ == "__main__":
    unittest.main()
