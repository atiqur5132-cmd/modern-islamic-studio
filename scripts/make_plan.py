"""Build the planning doc where the creator picks a visual for every line of a reel.

Usage: .venv\\Scripts\\python scripts/make_plan.py <clip>

Reads projects/<clip>/script.txt and projects/<clip>/plan_options.json, and writes
projects/<clip>/plan.html: each spoken line beside 2-4 visual options (Claude's pick first),
with a note box. The creator opens it in a browser, picks, and presses "Copy choices";
the pasted choices become beats.md. The creator plans, Claude builds.

plan_options.json:
{
  "title": "Yawm 365",
  "lines": [
    {"line": "<exactly one line of script.txt>", "section": "hook",
     "options": [
       {"layout": "split: speaker top, visual below", "visual": "what moves, beat by beat",
        "text": "on-screen English", "tag": "VIRAL CLAIM", "sound": "impact on frame 0",
        "ref": "references/<reel>/hook.jpg", "why": "why it serves the line"}
     ]}
  ]
}
Every script line appears once, in order. Lines in the "hook" section need 3 options
(QUALITY.md section 1 storyboards), other lines 2-4. "ref" is optional: a picture from
the reference library or a sketch, relative to the project root.
"""
import argparse
import html
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
MIN_OPTIONS, MAX_OPTIONS, HOOK_OPTIONS = 2, 4, 3
FIELDS = ("layout", "visual", "text", "tag", "sound", "why")
LETTERS = "ABCD"


def script_lines(text):
    return [line.strip() for line in text.splitlines() if line.strip()]


def check(plan, lines, root=ROOT):
    """Every problem with the plan, as readable sentences (empty when it is usable)."""
    problems = []
    planned = [entry.get("line", "").strip() for entry in plan.get("lines", [])]
    if planned != lines:
        missing = [line for line in lines if line not in planned]
        extra = [line for line in planned if line not in lines]
        for line in missing:
            problems.append(f"script line not in the plan: {line}")
        for line in extra:
            problems.append(f"plan line not in script.txt (spelling must match): {line}")
        if not missing and not extra:
            problems.append("plan lines are not in script order")
    for number, entry in enumerate(plan.get("lines", []), 1):
        options = entry.get("options", [])
        low = HOOK_OPTIONS if entry.get("section") == "hook" else MIN_OPTIONS
        if not low <= len(options) <= MAX_OPTIONS:
            problems.append(f"line {number}: {len(options)} options, needs {low}-{MAX_OPTIONS}")
        for letter, option in zip(LETTERS, options):
            if not option.get("visual"):
                problems.append(f"line {number} option {letter}: no visual described")
            ref = option.get("ref")
            if ref and not (root / ref).exists():
                problems.append(f"line {number} option {letter}: ref not found: {ref}")
    return problems


def spoken(line):
    """The script line with *emphasis* shown in bold."""
    parts = html.escape(line).split("*")
    return "".join(f"<b>{part}</b>" if i % 2 else part for i, part in enumerate(parts))


def option_html(number, letter, option, pick):
    ref = option.get("ref")
    image = ""
    if ref:
        src = html.escape(pathlib.Path("../../", ref).as_posix())
        image = f'<a href="{src}" target="_blank"><img src="{src}" alt="reference"></a>'
    rows = "".join(
        f'<div class="f"><span>{name}</span>{html.escape(str(option[name]))}</div>'
        for name in FIELDS if option.get(name))
    badge = '<em class="pick">Claude\'s pick</em>' if pick else ""
    return (f'<label class="opt"><input type="radio" name="l{number}" value="{letter}">'
            f'<div class="card"><div class="head"><strong>{letter}</strong> {badge}</div>'
            f"{image}{rows}</div></label>")


def build(clip, plan):
    blocks = []
    for number, entry in enumerate(plan["lines"], 1):
        options = "".join(option_html(number, letter, option, i == 0)
                          for i, (letter, option) in enumerate(zip(LETTERS, entry["options"])))
        section = html.escape(entry.get("section", ""))
        blocks.append(
            f'<section class="line" data-n="{number}"><div class="say"><div class="n">{number}'
            f'<small>{section}</small></div><p>{spoken(entry["line"])}</p></div>'
            f'<div class="opts">{options}<textarea placeholder="Note, or your own idea for this line"'
            f' data-n="{number}"></textarea></div></section>')
    title = html.escape(plan.get("title", clip))
    data = json.dumps({"clip": clip, "lines": [e["line"] for e in plan["lines"]]}, ensure_ascii=False)
    return PAGE.replace("{title}", title).replace("{blocks}", "\n".join(blocks)).replace(
        "{data}", data.replace("</", "<\\/"))


PAGE = """<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Plan: {title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{font:15px/1.45 system-ui,sans-serif;margin:0;background:#f5f3ef;color:#1b1b1b}
header{padding:20px 24px 8px}h1{margin:0 0 4px;font-size:22px}header p{margin:0;color:#6e665c}
.line{display:grid;grid-template-columns:300px 1fr;gap:16px;padding:16px 24px;border-top:1px solid #e3ddd2}
.say{position:sticky;top:8px;align-self:start}.say p{margin:6px 0 0;font-size:17px}
.n{font-weight:700;color:#6e665c}.n small{margin-left:8px;text-transform:uppercase;letter-spacing:.06em;color:#d9480f}
.opts{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}
.opt input{position:absolute;opacity:0}.card{background:#fff;border:2px solid #e3ddd2;border-radius:10px;padding:10px;height:100%;box-sizing:border-box;cursor:pointer}
.opt input:checked+.card{border-color:#d9480f;box-shadow:0 0 0 3px #d9480f33}
.head{margin-bottom:6px}.pick{font-style:normal;font-size:12px;background:#1b1b1b;color:#fff;border-radius:4px;padding:1px 6px;margin-left:6px}
.card img{width:100%;border-radius:6px;margin-bottom:6px}.f{margin:3px 0}.f span{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:#6e665c}
textarea{grid-column:1/-1;min-height:38px;font:inherit;padding:8px;border:1px solid #e3ddd2;border-radius:8px}
footer{position:sticky;bottom:0;background:#1b1b1b;color:#fff;padding:12px 24px;display:flex;gap:16px;align-items:center}
button{font:inherit;font-weight:700;background:#d9480f;color:#fff;border:0;border-radius:8px;padding:9px 16px;cursor:pointer}
@media(max-width:700px){.line{grid-template-columns:1fr}.say{position:static}}
</style></head><body>
<header><h1>Plan: {title}</h1><p>Pick one visual per line (or write your own in the note). Unpicked lines get Claude's pick. Then press Copy choices and paste them in the chat.</p></header>
{blocks}
<footer><span id="count"></span><button id="copy">Copy choices</button><span id="done"></span></footer>
<script>
const DATA = {data};
const KEY = "plan:" + DATA.clip;
const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
function store() {
  const state = {};
  document.querySelectorAll("section.line").forEach(s => {
    const n = s.dataset.n, c = s.querySelector("input:checked"), t = s.querySelector("textarea").value;
    state[n] = {pick: c ? c.value : "", note: t};
  });
  localStorage.setItem(KEY, JSON.stringify(state));
  const picked = Object.values(state).filter(v => v.pick).length;
  document.getElementById("count").textContent = picked + " of " + DATA.lines.length + " lines picked";
  return state;
}
document.querySelectorAll("section.line").forEach(s => {
  const v = saved[s.dataset.n] || {};
  if (v.pick) { const i = s.querySelector('input[value="' + v.pick + '"]'); if (i) i.checked = true; }
  s.querySelector("textarea").value = v.note || "";
});
document.addEventListener("input", store); document.addEventListener("change", store);
document.getElementById("copy").onclick = async () => {
  const state = store();
  const out = ["Plan choices for " + DATA.clip];
  DATA.lines.forEach((line, i) => {
    const v = state[i + 1] || {};
    out.push("L" + (i + 1) + " " + (v.pick || "A (default)") + (v.note ? " | note: " + v.note.replace(/\\s+/g, " ") : ""));
  });
  const text = out.join("\\n");
  try { await navigator.clipboard.writeText(text); document.getElementById("done").textContent = "Copied. Paste it in the chat."; }
  catch (e) { prompt("Copy this:", text); }
};
store();
</script></body></html>
"""


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("clip")
    args = parser.parse_args()
    project_dir = ROOT / "projects" / args.clip
    lines = script_lines((project_dir / "script.txt").read_text(encoding="utf-8"))
    plan = json.loads((project_dir / "plan_options.json").read_text(encoding="utf-8"))
    problems = check(plan, lines)
    if problems:
        print("plan_options.json is not ready:")
        for problem in problems:
            print("  - " + problem)
        sys.exit(1)
    out = project_dir / "plan.html"
    out.write_text(build(args.clip, plan), encoding="utf-8")
    print(f"{out} ({len(lines)} lines)")


if __name__ == "__main__":
    main()
