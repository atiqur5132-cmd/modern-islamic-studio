"""Run with: .venv\\Scripts\\python -m unittest discover tests"""
import pathlib
import sys
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "scripts"))
import hinglish  # noqa: E402


class Transliteration(unittest.TestCase):
    def test_devanagari_becomes_latin(self):
        self.assertEqual(hinglish.to_latin("इंसान"), "insaan")
        self.assertEqual(hinglish.to_latin("क़ुरान"), "quraan")

    def test_latin_passes_through(self):
        self.assertEqual(hinglish.to_latin("Quran"), "Quran")


class Matching(unittest.TestCase):
    def test_same_word_in_both_scripts_matches(self):
        for hinglish_word, devanagari in (("insaan", "इंसान"), ("Quran", "कुरान"), ("hai", "है"),
                                          ("mein", "में"), ("haddiyon", "हड्डियों"),
                                          ("Allah", "अल्लाह"), ("fingerprints", "फिंगरप्रिंट्स")):
            with self.subTest(hinglish_word):
                self.assertGreater(hinglish.similarity(hinglish_word, devanagari), 0.7)

    def test_different_words_do_not_match(self):
        for hinglish_word, devanagari in (("insaan", "हड्डियों"), ("Quran", "साइंस"), ("padho", "जिस्म")):
            with self.subTest(hinglish_word):
                self.assertLess(hinglish.similarity(hinglish_word, devanagari), 0.5)
