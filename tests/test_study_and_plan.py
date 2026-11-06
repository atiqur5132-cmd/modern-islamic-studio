"""Run with: .venv\Scripts\python -m unittest discover tests"""
import pathlib
import sys
import tempfile
import unittest

import numpy as np

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent / "scripts"))
import make_plan  # noqa: E402
import study_reel  # noqa: E402


def still(value, count):
    return [np.full((96, 54), value, np.uint8)] * count


class HookBeats(unittest.TestCase):
    def test_cuts_are_beats_and_a_still_picture_is_not(self):
        grey = np.array(still(20, 10) + still(200, 10) + still(20, 10))
        self.assertEqual(study_reel.beats(grey, 10), [0.0, 1.0, 2.0])

    def test_slow_fill_counts_once_it_has_changed_the_picture(self):
        grey = np.array([np.full((96, 54), 5 * i, np.uint8) for i in range(30)])
        found = study_reel.beats(grey, 10)
        self.assertEqual(found[1], 0.5)  # 25 grey levels from the start picture
        self.assertTrue(all(b - a >= 0.5 for a, b in zip(found, found[1:])))

    def test_longest_still_runs_to_the_end_of_the_hook(self):
        self.assertEqual(study_reel.longest_still([0.0, 1.0, 2.0], 6.0), 4.0)
        self.assertEqual(study_reel.longest_still([0.0, 1.5, 3.0, 4.5], 6.0), 1.5)

    def test_gates(self):
        good = {"hook": {"beats": [0.0, 1.4, 2.8, 4.2, 5.6], "longest_still": 1.4, "sound_onset": 0.0}}
        self.assertTrue(all(study_reel.hook_gates(good).values()))
        weak = {"hook": {"beats": [0.0, 5.4], "longest_still": 5.4, "sound_onset": None}}
        self.assertFalse(any(study_reel.hook_gates(weak).values()))


def option(visual="a calendar fills", **extra):
    return {"visual": visual, **extra}


class PlanCheck(unittest.TestCase):
    lines = ["Quran mein *365* baar.", "Phir maine gina."]

    def plan(self, hook_options=3, body_options=2):
        return {"lines": [
            {"line": self.lines[0], "section": "hook", "options": [option()] * hook_options},
            {"line": self.lines[1], "options": [option()] * body_options}]}

    def test_good_plan_has_no_problems(self):
        self.assertEqual(make_plan.check(self.plan(), self.lines), [])

    def test_script_spelling_must_match(self):
        plan = self.plan()
        plan["lines"][1]["line"] = "Phir maine ginaa."
        problems = make_plan.check(plan, self.lines)
        self.assertTrue(any("not in the plan" in p for p in problems))
        self.assertTrue(any("not in script.txt" in p for p in problems))

    def test_order_matters(self):
        plan = self.plan()
        plan["lines"].reverse()
        self.assertIn("plan lines are not in script order", make_plan.check(plan, self.lines))

    def test_hook_needs_three_options_and_others_two_to_four(self):
        self.assertTrue(make_plan.check(self.plan(hook_options=2), self.lines))
        self.assertTrue(make_plan.check(self.plan(body_options=1), self.lines))
        self.assertTrue(make_plan.check(self.plan(body_options=5), self.lines))

    def test_missing_ref_and_empty_visual_are_reported(self):
        plan = self.plan()
        plan["lines"][1]["options"] = [option(ref="references/nope/hook.jpg"), option(visual="")]
        with tempfile.TemporaryDirectory() as root:
            problems = make_plan.check(plan, self.lines, pathlib.Path(root))
        self.assertTrue(any("ref not found" in p for p in problems))
        self.assertTrue(any("no visual" in p for p in problems))

    def test_page_escapes_text_and_marks_the_pick(self):
        plan = self.plan()
        plan["lines"][0]["options"][0] = option(visual="<script>x</script>", text="'DAY' = 365?")
        page = make_plan.build("clip", plan)
        self.assertNotIn("<script>x</script>", page)
        self.assertIn("<b>365</b>", page)
        self.assertEqual(page.count("Claude's pick</em>"), 2)
        self.assertEqual(page.count('type="radio" name="l1"'), 3)


if __name__ == "__main__":
    unittest.main()
