"""Write script.txt to match the recorded take, with Arabic copied from the Ayah files.

Usage: .venv\\Scripts\\python projects/muminun-kasawna/build_script.py

Every bracketed Arabic word is a slice of textUthmani from src/data/quran/23-13.json
or 23-14.json (fetched by scripts/fetch_ayah.py), picked by word position, so no
Quranic text is typed by hand. {23-14:15-16} means words 15 to 16 of 23:14.
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parents[2]
HERE = pathlib.Path(__file__).resolve().parent

# Prose follows what the creator said in the take (2026-11-11, 65 s).
LINES = """\
Tum kabhi ek *boond* the.
Itni chhoti, ki aankh se dikhti bhi nahi.
Aur Surah Mu'minun tumhari ye poori kahani ko, ek hi verse mein sunati hai.
Pehle tum the "nutfah" ({23-13:2}). Bas ek boond.
Phir wo boond ek jagah *chipak* gayi. Quran kehta hai "alaqah" ({23-14:3}). Jo chipak jaaye.
Aur sach mein, chhathe-saatwe din embryo womb ki wall se chipak jaata hai.
Is word ka meaning blood clot bhi hai, aur Ibn Kathir ne yahi samjha.
Phir wo ban gayi "mudghah" ({23-14:6}). Gosht ka chhota sa piece, bina kisi shape ke.
Phir usme bones bani, "izam" ({23-14:9}).
Itne stages toh Greek doctor Galen ne bhi Quran se pehle likh chuke the.
Lekin ab aata hai mera favourite word.
"Fa-kasawnal izama lahma" ({23-14:10}). Yaani humne bones ko gosht ke *kapde* pehnaye.
Allah ne *joda* nahi kaha. *Pehnaya* kaha.
Jaise maa apne bachche ko pyaar se kapde pehnati hai.
Science ke hisaab se bones aur muscles saath-saath bante hain. Toh ye timetable nahi, pyaar ki ek picture hai.
Aur phir, "khalqan akhar" ({23-14:15-16}). Humne use bilkul *nayi* creation bana diya.
Ek boond se, ek insaan.
Wahi boond, aaj video dekh raha hai.
Isliye verse kehta hai, "Fatabarakallahu ahsanul khaliqin" ({23-14:20-21}). Allah bahut barkat wala hai, sabse best creator.
Video pasand aaya toh share kar dena, aur like comment bhi, aur follow bhi kar dena.
I'm very bad at call to action.
"""


def ayah_words(key):
    data = json.loads((ROOT / "src" / "data" / "quran" / f"{key}.json").read_text(encoding="utf-8"))
    return data["textUthmani"].split()


def arabic(match):
    key, first, last = match.group(1), int(match.group(2)), int(match.group(3) or match.group(2))
    return " ".join(ayah_words(key)[first : last + 1])


def main():
    text = re.sub(r"\{(\d+-\d+):(\d+)(?:-(\d+))?\}", arabic, LINES)
    (HERE / "script.txt").write_text(text, encoding="utf-8")
    print(text)


if __name__ == "__main__":
    main()
