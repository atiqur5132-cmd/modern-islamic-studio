# Research: "Yawm 365 baar?" — a viral number claim, counted

Reel type: misconception corrected gently, with a numerical observation shown step by step.

**Script status:** first draft approved 2026-11-05; rewritten the same day in a more natural spoken voice at the creator's request (same claims, same numbers). New wording approved by the creator on 2026-11-05. Any line changed while speaking goes back into `script.txt` before captions.
Researched 2026-11-05. Creator reads this before the script.

## The claim

Popular posts say the word for "day" (يوم, yawm) occurs 365 times in the Quran, matching
the days of a solar year (often paired with "month" (shahr) = 12). The claim is usually
credited to Abd al-Razzaq Nawfal's books on numerical patterns (per IslamQA 69741 quoting
al-Roomi; his book itself was not opened), and, per search results (masjidtucson.org, not opened), in Rashad Khalifa's translation footnote on 9:36.
Do not name Khalifa on screen; his wider claims are rejected by mainstream scholars and
naming him would distract.

## Our own count (recomputed, two independent data sets)

**Data A: morphology.** Quranic Arabic Corpus morphology (Kais Dukes, corpus.quran.com),
the corrected copy at github.com/mustafa0x/quran-morphology (`quran-morphology.txt`,
130,030 segment lines). Every word with ROOT يوم counted by number and form.
Script: `projects/yawm-365/rules.py`.

**Data B: plain text.** Tanzil "quran-simple-clean" from api.alquran.cloud
(`/v1/quran/quran-simple-clean`), Basmala stripped from Ayah 1 of each Surah except 1 and 9.
Every word containing يوم counted. Script: `projects/yawm-365/regex.py`.

| Step | Rule | Data A | Data B |
| --- | --- | --- | --- |
| 1 | All words from root y-w-m (singular, dual يومين, plural أيام) | 475 | — (plural spelled أيام, not matched) |
| 2 | Singular only (drop 27 plural + 3 dual) | 445 | 451 matches − 3 القيوم (al-Qayyum, not "day") − 3 dual = 445 |
| 3 | Drop يومئذ yawma'idhin "that day" and its prefixed forms (70) | 375 | 445 − 70 = 375 |
| 4 | Drop forms with a pronoun suffix (يومكم yawmukum, يومهم yawmuhum…, 10) | **365** | 375 − 10 = **365** |

Both data sets agree at every step. Working for step 4 in Data A: يَوْمِكُمْ 4 + يَوْمَهُمُ 3 +
يَوْمِهِمْ 1 + يَوْمُكُمُ 1 + يَوْمِهِمُ 1 = 10. In Data B: يومكم 5 + يومهم 5 = 10.
The 365 words fall in 341 distinct Ayahs.

What the 365 rule keeps: the bare singular with or without al-, wa-, fa-, bi-, li-
(e.g. اليوم, ويوم, بيوم, يوما). What it drops: "that day" and "your/their day".

Side note (not in the script): singular *shahr* (month) in Data A = 12 (plural أشهر/شهور 7,
dual 2). That one comes out at 12 without exclusions beyond "singular only".

**Conclusion:** 365 is reproducible, but only under one specific rule. Equally reasonable
rules give 475, 445 or 375. This is a numerical observation, not a proof.

## Scholarly view on such counts

- IslamQA answer 69741, "Discussion of numerical miracles in the Qur'aan and use of the
  solar calendar" (2011-11-23), https://islamqa.info/en/answers/69741 (accessed 2026-11-05):
  - Quotes Dr. Fahd al-Roomi, *Ittijahat al-Tafsir* 2/699–700: Nawfal counted *al-yawm*
    and *yawman* but skipped *yawmukum* and *yawmuhum*, so the total depends on selection.
    This matches our step 4 exactly.
  - Quotes Dr. Ashraf Abd al-Razzaq Qatanah (reviewing Nawfal, Bassam Jarrar, Adnan
    al-Rifa'i): these numerical miracles are selective; "is not real at all".
  - Points out the calendar Allah prescribes is lunar (Yunus 10:5, al-Baqarah 2:189), so a
    365-day match would not even fit the Islamic year.
  - Says the real miracle is the Quran's challenge to produce a surah like it.
- Critical (non-Muslim) pages make the same counting point: wikiislam.net
  "365 days miracle in the Qur'an" (seen in search results, not opened). Not cited on screen.

## Lunar year

Mean synodic month = 29.53059 days (NASA, "Eclipses and the Moon's Orbit", section 4.2,
https://eclipse.gsfc.nasa.gov/SEhelp/moonorbit.html, accessed 2026-11-05).
Working: 12 × 29.53059 = 354.367 days. Hijri months are whole 29- or 30-day months, so a
Hijri year is 354 or 355 days. Established astronomy.

## The challenge verse

Al-Baqarah 2:23, fetched and cross-checked by `scripts/fetch_ayah.py` →
`src/data/quran/2-23.json`. Sahih International (quran.com translation 20): "And if you are
in doubt about what We have sent down upon Our Servant, then produce a surah the like
thereof…". The spoken line is the creator's Hinglish rendering of the meaning, labelled as
translation. The same challenge: 10:38, 11:13 (ten surahs), 17:88 (the whole Quran).
Classical works on the Quran's inimitability: al-Baqillani, *I'jaz al-Quran*; Abd al-Qahir
al-Jurjani, *Dala'il al-I'jaz*.

10:5 (moon's phases "that you may know the number of years") was considered for the
calendar beat, but `fetch_ayah.py` stopped: the two sources differ in tajweed marks
(U+06ED and the hamza form in الآيات). Not used on screen; needs a human review before any use.

## Claim ledger

| # | Claim in the script | Label | Source | Caveat |
| --- | --- | --- | --- | --- |
| 1 | Viral posts say "day" occurs 365 times | Report of a popular claim | IslamQA 69741; Nawfal | Shown as "the claim", not as fact |
| 2 | All forms of yawm = 475 | Numerical observation | Data A, rules.py | Counts depend on the edition; Hafs text |
| 3 | Singular forms = 445 | Numerical observation | Data A and B | — |
| 4 | Without yawma'idhin = 375 | Numerical observation | Data A and B | — |
| 5 | Without pronoun-suffixed forms = 365 | Numerical observation | Data A and B; al-Roomi via IslamQA | Only under this rule |
| 6 | "Us din" bhi din hai; rule badlo, number badle | Interpretation of method | Steps above | — |
| 7 | Islamic year ≈ 354 days | Established science | NASA synodic month, working above | 354 or 355 |
| 8 | Many scholars warn against making such counts a miracle | Scholarly view | IslamQA 69741 (al-Roomi, Qatanah) | Some writers still support numerical i'jaz; we say "kai ulama", not "sab" |
| 9 | Quran's own challenge: bring a surah like it | Quranic text (translation) | 2:23 via fetch_ayah; Sahih International | Translation, not Arabic text |

## Freshness

Searches on 2026-11-05 found the claim on many apologetics pages and the counter-claim on
critical sites, but no Hindi/Hinglish reel that counts it step by step on screen. The angle
"a Muslim channel counts it live and stays honest" is fresh.

## Risks

- Some viewers will feel the reel "attacks" a miracle. Tone: curious, not mocking; end on the
  Quran's real challenge so the reel strengthens faith rather than doubt.
- Word counts can differ slightly between concordances; we name our data and keep scripts in
  the project so anyone can recheck.

## Recording decision (2026-11-06)

The creator deliberately did not record the 2:23 challenge lines ("Quran ne apna challenge
khud diya hai…"). The reel now ends on "Quran ko kisi number game ki zaroorat nahi hai."
Ledger row 9 (2:23) is therefore not used on screen; every other row stands unchanged.
`script.txt` now matches the spoken take; the approved wording is in `script.original.txt`.
