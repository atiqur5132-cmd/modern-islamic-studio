# Neki ek beej: ek daana, teen zameenein (2:261–265)

Series C, Quran ke Lafz. Researched 2026-11-14. TOPICS.md #39 (angle widened, see below).
**Faceless reel**: the creator records the voiceover only and never appears on screen.
Freshness (YouTube, 2026-11-10): many "1 neki 10 se 700 guna" shorts, all spoken or
text-on-photo, top about 9K; none shows the seed, and none carries the parable on to
2:264–265.

## The one idea

The Quran calls spending for Allah a seed: on good ground one grain becomes 700 (2:261),
but three verses later the same seed falls on a smooth rock with a little soil, and one
heavy rain washes it bare: charity given for show, or followed by reminders and hurt
(2:264). The next verse gives the third ground, a garden on a hill (2:265). The size of
the seed is the same; the ground decides what grows.

One-sentence version for a 15-year-old: "Neki ek beej hai; dikhawa aur ehsaan jataana use
chattan pe gira dete hain."

Picture: one grain in 3D, growing into 7 ears; then the same grain on a rock in rain; then
a hillside garden. Faceless suits it: the seed is the main character.

## Why the angle changed from the backlog card

The backlog card was "one grain → 700, then the four rows of Bukhari 6491". That packs two
ideas (the parable and the hadith's accounting table). The Quran's own sequence 2:261–265
is one continuous farming picture, which is a single idea told as a story, with its own
turn (the rock) and payoff (the ground). Bukhari 6491 is kept below for a later reel
("Sunnah aur Zindagi" or a part 2), not used in this script.

## The verses (fetched with `scripts/fetch_ayah.py`, 2026-11-14)

| Ref | Used for | File | Translation (Saheeh International, quran.com API resource 20) |
| --- | --- | --- | --- |
| 2:261 Al-Baqara | The seed, 7 ears, 100 grains; wallahu yuda'ifu li man yasha' | `src/data/quran/2-261.json` (full) | "The example of those who spend their wealth in the way of Allāh is like a seed [of grain] which grows seven spikes; in each spike is a hundred grains. And Allāh multiplies [His reward] for whom He wills. And Allāh is all-Encompassing and Knowing." |
| 2:264 Al-Baqara, words 4–8 | lā tubṭilū ṣadaqātikum bil-manni wal-adhā | `src/data/quran/2-264.json` (excerpt) | "O you who have believed, do not invalidate your charities with reminders [of it] or injury as does one who spends his wealth [only] to be seen by the people… His example is like that of a [large] smooth stone upon which is dust and is hit by a downpour that leaves it bare. They are unable [to keep] anything of what they have earned…" |
| 2:265 Al-Baqara | The garden on high ground, double fruit, drizzle enough | `src/data/quran/2-265.json` (full) | "And the example of those who spend their wealth seeking means to the approval of Allāh and assuring [reward for] themselves is like a garden on high ground which is hit by a downpour — so it yields its fruits in double. And [even] if it is not hit by a downpour, then a drizzle [is sufficient]. And Allāh, of what you do, is Seeing." |

**2:264 is saved only as words 4–8.** The full Ayah stops the script: quran.com writes the
hamza of *al-ākhir* (word 18) on a kashida, alquran.cloud as a standalone hamza. Words
19–27 (the rock: *fa-mathaluhu ka-mathali ṣafwānin 'alayhi turābun fa-aṣābahu wābilun
fa-tarakahu ṣaldā*) also verified as an excerpt on 2026-11-14, but the file now holds
words 4–8, the spoken part. If the edit wants an Arabic card for the rock, it needs the
excerpt saved under its own name (the script writes one file per Ayah); ask before
changing the script. The rock is shown, not quoted, in the current script.

The script's Arabic is spoken in Roman transliteration only (caption spelling); Ayah cards
take their Arabic from the JSON files.

## Tafsir (all opened 2026-11-14 via api.quran.com/api/v4/tafsirs)

- **Ibn Kathir** (abridged English, resource 169) on 2:261: "a parable … of the
  multiplication of rewards for those who spend in His cause"; the parable "is more
  impressive on the heart than merely mentioning the number seven hundred". On *yuḍā'ifu li
  man yashā'*: "according to the person's sincerity in his deeds". Cites the camel hadith
  (Muslim: a man gave a bridled camel in Allah's way, "you will have seven hundred camels"),
  not used.
- **Ibn Kathir** on 2:264: *mann* = reminding the receiver by word or action; *adhā* =
  harming them; ad-Dahhak: the rock example fits one who follows charity with reminders or
  harm, as well as the show-off. Cites Muslim (Abu Dharr): "al-mannān bimā a'ṭā" among three
  whom Allah will not speak to, not used.
- **Ibn Kathir** on 2:265: *rabwah* = ground raised above the land (majority view);
  *ṭall* = light rain (ad-Dahhak): "the believer's good deeds … never become barren".
- **al-Tabari** (d. 310 AH / 923 CE), Arabic, resource 15, on 2:261: "If someone asks: have
  you seen an ear with a hundred grains …? It is said: if it exists, then that is it;
  otherwise the meaning may be … *if Allah were to put that in it*." He also reports
  ad-Dahhak's reading (each ear, when sown, produces 100 grains). Source of script line 6–7.
- **al-Qurtubi** (d. 671 AH / 1273 CE), Arabic, resource 90, on 2:261: some said the ear
  meant is millet (*dukhn*); Qurtubi: millet carries twice that and more, "as we have seen";
  Ibn 'Atiyya: wheat ears with 100 grains can be found, other grains more, "but the example
  fell on this amount". On *yuḍā'ifu li man yashā'*, two views: it confirms the 700 with
  nothing beyond, or it means more than 700 for whom He wills; Qurtubi prefers the second.
  His farmer picture: a skilled farmer, good seed and living land give a bigger crop; so a
  righteous giver, good (halal) wealth, given in its right place, gets more reward.

## Hadith (kept for later, not in the script)

Sahih al-Bukhari 6491 (Book 81 Ar-Riqaq, hadith 80; USC-MSA Vol. 8, Book 76, Hadith 498),
narrated Ibn 'Abbas, opened on sunnah.com 2026-11-14 in the built-in browser (sunnah.com
refuses automated fetch). Sahih by inclusion in al-Bukhari. Good deed intended and not
done: one full good deed; done: "from ten to seven hundred times to many more times"
(*'ashra ḥasanātin ilā sab'imi'ati ḍi'fin ilā aḍ'āfin kathīrah*); bad deed intended and
left: one full good deed; done: one bad deed.

## Claim ledger

| # | Line(s) | Claim | Label | Source | Caveat |
| --- | --- | --- | --- | --- | --- |
| 1 | 1–4 | 2:261 likens those who spend in Allah's way to one grain giving 7 ears of 100 grains | Quranic context (translation) | 2:261, Saheeh International | The Ayah is about spending in Allah's way, not every deed; the script says "Allah ki raah mein kharch" |
| 2 | 5 | 7 × 100 = 700 | Numerical observation | Arithmetic: 7 × 100 = 700 | "Diya ek, mila saat sau" is the parable's ratio, not a fixed rate card; Qurtubi reports two views on going beyond it |
| 3 | 6 | Tabari himself asked whether an ear of 100 grains exists, about 1,100 years ago | Historical report (tafsir) | Tabari, Jami' al-Bayan on 2:261 | Tabari d. 310 AH / 923 CE; 2026 − 923 = 1,103 years, "gyarah sau saal pehle" holds for the tafsir, written before his death |
| 4 | 7 | His answer: if it exists, that is it; otherwise it is a parable (if Allah put that in it) | Interpretation (Tabari) | Tabari on 2:261 | Qurtubi and Ibn 'Atiyya say such ears do exist (millet, some wheat); not stated in the script |
| 5 | 8 | Three verses later (2:264) the same picture continues with another ground | Quranic context | 2:261 → 2:264 | "Wahi beej" is our framing: 2:264 speaks of charity (sadaqah), the same spending as 2:261. Interpretation |
| 6 | 9–10 | A smooth rock with soil, heavy rain leaves it bare | Quranic context (translation) | 2:264 | — |
| 7 | 11 | That seed is charity given for show or followed by reminders | Quranic context + tafsir | 2:264 text; Ibn Kathir, ad-Dahhak | The Ayah names riya (show) and mann/adha; the script names both |
| 8 | 12 | lā tubṭilū ṣadaqātikum bil-manni wal-adhā: do not ruin your charity with reminders and hurt | Quranic context (translation) | 2:264 words 4–8 | Spoken in Roman; card Arabic from the JSON |
| 9 | 13 | "Maine hi toh tumhari fees bhari thi" as an example of mann | Interpretation (our example) | Ibn Kathir: mann by word or action | An illustration, not from tafsir; on screen tag it as an example |
| 10 | 14–15 | 2:265: a garden on high ground, double fruit in heavy rain, drizzle enough | Quranic context (translation) | 2:265; Ibn Kathir (rabwah, ṭall) | — |
| 11 | 16 | That ground is giving only for Allah's pleasure | Quranic context | 2:265 "ibtighā'a marḍātillāh" | — |
| 12 | 17 | "Zameen sabki alag hoti hai": the ground is the giver's intention | Interpretation | Ibn Kathir (multiplication by sincerity); Qurtubi's farmer picture | Our closing line; says nothing about who is accepted |

## What this reel does not say

- Not that every good deed is worth exactly 700. 2:261 is about spending in Allah's way,
  and the number is a parable's picture (Ibn Kathir).
- No science claim: the reel says nothing about how many grains a real wheat ear holds.
  Typical wheat ears carry far fewer than 100; Qurtubi and Ibn 'Atiyya say 100 occurs. If
  a viewer asks, point to Tabari's answer, already in the script. (No agronomy source
  checked yet; do not put a grain figure on screen.)
- Not a fiqh ruling on what invalidates charity; the reel only reports the Ayah's words.

## Comment ask and CTA

- Comment ask (on screen with the comment icon, end card or mid-video): "Ek chhoti neki
  jo tum chupke se karte ho? Sirf ek lafz mein likho." English on-screen version per
  CLAUDE.md: "One small good deed you do quietly? Say it in one word."
- CTA (spoken, last line): "Quran ki aisi aur misaalein samajhni hain, toh follow kar lo."
  Different from the last four reels' CTAs.
- Mid-video CTA spot: after line 7 (Tabari's answer, a calm mini-payoff about 35–40% in)
  or after line 10 (the rock washed bare). Not during the hook or the last three lines.

## Length

211 words; at 3.3 words a second about 64 s, plus pauses. Slightly over 60 s; the
continuity rule keeps the bridges. If it must be cut, drop line 13's second half first.

## Voice-recording note (faceless)

The creator records the voice only. Per the voiceover lesson (scroll-kyun, 2026-11-13):
after cutting the take, send the cut audio for the creator's OK before any visuals.
