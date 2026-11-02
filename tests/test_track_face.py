"""Run with: .venv\\Scripts\\python -m unittest discover tests"""
import pathlib
import sys
import unittest

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "scripts"))
import track_face  # noqa: E402


def detection(x, y, w, h, score=0.9):
    """A YuNet row with level eyes a third of the way down and the mouth two thirds down."""
    eyes, mouth = y + h / 3, y + 2 * h / 3
    return [x, y, w, h, x + w / 3, eyes, x + 2 * w / 3, eyes, x + w / 2, y + h / 2,
            x + w / 3, mouth, x + 2 * w / 3, mouth, score]


class FacePoint(unittest.TestCase):
    def test_largest_confident_face_wins(self):
        small = detection(10, 10, 20, 20)
        large = detection(100, 100, 60, 60)
        unsure = detection(0, 0, 200, 200, score=0.3)
        x, y = track_face.face_point(np.array([small, large, unsure]))
        self.assertAlmostEqual(x, 130 * track_face.DOWNSCALE)

    def test_aim_sits_between_eyes_and_mouth(self):
        _, y = track_face.face_point(np.array([detection(0, 0, 60, 60)]))
        eyes, mouth = 20 * track_face.DOWNSCALE, 40 * track_face.DOWNSCALE
        self.assertTrue(eyes < y < mouth)
        self.assertLess(y, (eyes + mouth) / 2)

    def test_no_face(self):
        self.assertIsNone(track_face.face_point(None))


class Path(unittest.TestCase):
    def test_gaps_are_interpolated_and_ends_held(self):
        filled = track_face.fill_gaps([None, (100, 100), None, (300, 100), None])
        self.assertEqual(filled[:, 0].tolist(), [100, 100, 200, 300, 300])

    def test_no_face_anywhere(self):
        self.assertIsNone(track_face.fill_gaps([None, None]))

    def test_one_frame_glitch_is_ignored(self):
        path = np.full((20, 2), 500.0)
        path[10] = [900, 900]
        smoothed = track_face.smooth(path)
        self.assertTrue(np.all(np.abs(smoothed - 500) < 1))

    def test_real_move_is_followed(self):
        path = np.array([[500.0, 700.0]] * 10 + [[700.0, 700.0]] * 10)
        smoothed = track_face.smooth(path)
        self.assertAlmostEqual(smoothed[0, 0], 500)
        self.assertAlmostEqual(smoothed[-1, 0], 700)

    def test_small_drift_holds_still(self):
        path = np.array([[500.0 + (i % 2) * 8, 700.0] for i in range(20)])
        smoothed = track_face.smooth(path)
        self.assertEqual(len(set(smoothed[:, 0].tolist())), 1)


if __name__ == "__main__":
    unittest.main()
