import pathlib
import sys
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "scripts"))

from fetch_ayah import comparable, excerpt  # noqa: E402

# Escaped so no Quranic text is typed into the project: 21:33's last four words as
# the two sources give them (alquran.cloud adds the iqlab meem marks U+06ED, U+06E2).
QURAN_COM = "كُلٌّ فِى فَلَكٍ"
ALQURAN_CLOUD = "كُلٌّۭ فِى فَلَكٍۢ"


class ComparableTest(unittest.TestCase):
    def test_tajweed_only_marks_do_not_count(self):
        self.assertEqual(comparable(QURAN_COM), comparable(ALQURAN_CLOUD))

    def test_a_different_vowel_still_counts(self):
        changed = QURAN_COM.replace("ُ", "َ", 1)  # damma to fatha on the first letter
        self.assertNotEqual(comparable(QURAN_COM), comparable(changed))

    def test_a_different_letter_still_counts(self):
        changed = QURAN_COM.replace("ى", "ي")  # alif maqsura to ya
        self.assertNotEqual(comparable(QURAN_COM), comparable(changed))


PAUSE = "ۖ"  # a pause mark standing alone, as the sources print it


class ExcerptTest(unittest.TestCase):
    def test_counts_only_words_with_letters(self):
        text = f"{PAUSE} {QURAN_COM} {PAUSE}"
        self.assertEqual(excerpt(text, 2, 3), " ".join(QURAN_COM.split()[1:3]))

    def test_keeps_a_pause_mark_between_kept_words(self):
        first, second, third = QURAN_COM.split()
        text = f"{first} {PAUSE} {second} {third}"
        self.assertEqual(excerpt(text, 1, 2), f"{first} {PAUSE} {second}")

    def test_a_range_past_the_end_fails(self):
        with self.assertRaises(ValueError):
            excerpt(QURAN_COM, 2, 4)


if __name__ == "__main__":
    unittest.main()
