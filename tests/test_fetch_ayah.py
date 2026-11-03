import pathlib
import sys
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "scripts"))

from fetch_ayah import comparable  # noqa: E402

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


if __name__ == "__main__":
    unittest.main()
