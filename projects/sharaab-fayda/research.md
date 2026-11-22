# Sharaab mein fayda? Phir mana kyun? — research

Topic #91, proposed series D "Why Muslims…?" (content for all communities, 2026-11-22).
All pages accessed 2026-11-22.

## The one idea

The Quran does not call alcohol pure evil: it puts benefit and harm on a scale and says the
harm is bigger. Today's numbers show the same scale, and the ban was brought in steps, so
people actually followed it.

A 15-year-old could repeat it as: "Quran ne sharaab ka fayda bhi maana, par bola nuksaan
zyada hai, aur aaj ka data bhi yahi dikhata hai."

## Quranic text (fetched with scripts/fetch_ayah.py, never typed)

| Ayah | File | Sahih International |
| --- | --- | --- |
| 2:219, words 1–14 (excerpt) | `src/data/quran/2-219.json` | "They ask you about wine and gambling. Say, 'In them is great sin and [yet, some] benefit for people. But their sin is greater than their benefit.'" |
| 4:43 | `src/data/quran/4-43.json` | "O you who have believed, do not approach prayer while you are intoxicated until you know what you are saying…" |
| 5:90 | `src/data/quran/5-90.json` | "…intoxicants, gambling, [sacrificing on] stone altars…, and divining arrows are but defilement from the work of Satan, so avoid it that you may be successful." |
| 5:91 | `src/data/quran/5-91.json` | "Satan only wants to cause between you animosity and hatred through intoxicants and gambling and to avert you from the remembrance of Allah and from prayer. So will you not desist?" |

Full 2:219 did not pass the cross-check (the two sources write a hamza and tatweel
differently in the second half); the excerpt we need (words 1–14) passed.
16:67 (a Makkan verse that mentions "sakar", intoxicant, beside "good provision") also
failed the cross-check; some scholars count it as an earlier first hint. Not used in the script.

## Tafsir

- **Ibn Kathir on 2:219** (quran.com, tafsir 169,
  https://quran.com/2:219/tafsirs/en-tafsir-ibn-kathir): the harm is to the religion; the
  benefit is material: "benefit for the body, digesting the food… sharpening the mind,
  bringing about a joyous sensation and financially benefiting" from selling it.
  He reports from Ibn Umar, al-Sha'bi, Mujahid, Qatadah, al-Rabi' ibn Anas and Abd
  al-Rahman ibn Aslam that 2:219 was the first verse on khamr, then 4:43, then 5:90–91.
- **Ma'arif al-Quran on 2:219** (quran.com): four verses deal with wine; 2:219 is the first.
- Ahsan al-Bayan (tohed.com): 2:219 did not yet make it haram; it laid the ground.

## Hadith

| Report | Grading | Use |
| --- | --- | --- |
| **Bukhari 2464** (Anas): he was serving drinks in Abu Talha's house; the Prophet ﷺ had it announced that khamr was forbidden; Abu Talha told him to pour it out; "it flowed in the streets of Medina." https://sunnah.com/bukhari:2464 | Sahih (Bukhari) | Script: the scene when the ban came |
| Tirmidhi 3049 (Umar: "O Allah, make the ruling on khamr clear", then 2:219, 4:43, 5:91, and "We abstained, we abstained") https://sunnah.com/tirmidhi:3049 | Da'if (Darussalam); Tirmidhi notes a mursal version | **Not used.** The order of verses is taken from the tafsir reports above instead |
| Abu Dawud 3670 (same story) | Sahih per al-Albani; da'if per Zubair Ali Zai (search result, page not opened in full) | Not used: grading disputed |

## Science and data

- **WHO, 25 June 2024** (Global status report on alcohol and health and treatment of
  substance use disorders; news release
  https://www.who.int/news/item/25-06-2024-over-3-million-annual-deaths-due-to-alcohol-and-drug-use-majority-among-men,
  fact sheet https://www.who.int/news-room/fact-sheets/detail/alcohol): 2.6 million deaths
  attributable to alcohol in 2019, 4.7% of all deaths; 1.6 million from noncommunicable
  diseases, 700,000 from injuries, 300,000 from communicable diseases.
- **GBD 2020 Alcohol Collaborators, The Lancet, 14 July 2022**
  (https://healthdata.org/research-article/population-level-risks-alcohol-consumption-amount-geography-age-sex-and-year):
  for ages 15–39 the minimum-risk intake is zero or close to zero in every region; for 40+
  without underlying conditions, small amounts may lower ischemic heart disease, stroke and
  diabetes risk. A Lancet comment (Burton and Sheron) notes the tension with the 2018 GBD
  estimate.
- **WHO Europe, 4 January 2023**, "No level of alcohol consumption is safe for our health"
  (https://www.who.int/europe/news/item/04-01-2023-no-level-of-alcohol-consumption-is-safe-for-our-health;
  Lancet Public Health 8(1):e6–e7): no safe threshold for cancer; claimed protective effects
  depend on comparison groups and methods. Parked: not in the script.

## Numbers, worked

- 2.6 million = 26,00,000 = **26 lakh**.
- 700,000 = **7 lakh**.
- 1.6 + 0.7 + 0.3 = 2.6 million ✓.
- Per day: 26,00,000 ÷ 365 = 7,123 → **lagbhag 7 hazaar**.

## Wording note

The script renders 2:219's ithm (Sahih Intl "sin") as "buraai" (wrong / evil), so viewers of every community follow it. The Ayah card shows the fetched Arabic and the Sahih International English.

## Claim ledger

| Claim in the script | Label | Source | Caveat |
| --- | --- | --- | --- |
| The Quran says there is some benefit in alcohol, and its sin is bigger | Quranic text | 2:219 (fetched), Sahih Intl | "Benefit for people" is worldly; classical tafsir lists what it means |
| Old scholars listed the benefits: joy, a good feeling, profit from selling | Tafsir | Ibn Kathir on 2:219 | Ibn Kathir also lists digestion and "sharpening the mind": we name only some |
| About 26 lakh deaths a year from alcohol | Established data | WHO 2024 report (2019 data) | Estimate for 2019; rate fell 20% from 2010 to 2019 |
| That is about 7 hazaar a day | Numerical (our arithmetic) | 26,00,000 ÷ 365 = 7,123 | Yearly estimate spread evenly; not a daily count |
| (parked) 7 lakh of them from injuries | Established data | WHO fact sheet | Cut 2026-11-22: the creator found it confusing |
| The Quran's stated reason is enmity and hatred, and forgetting Allah and prayer, not health | Quranic text | 5:91 (fetched) | — |
| Lancet 2022: maybe a small benefit for some people over 40; zero benefit, only risk, for 15–39 | Established science (one large study, debated) | GBD 2020, Lancet 2022 | WHO says no safe level for cancer; the 40+ benefit is contested |
| For a Muslim the ruling is from Allah whatever the numbers | Belief statement | — | Said so the data is not presented as the reason for the ruling |
| (parked) The ban came in steps: 2:219, then 4:43, then 5:90–91 | Scholarly view (early reports) | Ibn Kathir naming Ibn Umar, Mujahid, Qatadah and others | The Umar hadith with this order is graded weak; we do not cite it |
| (parked) When it was announced, drinks were poured out and flowed in Madinah's streets | Historical report, sahih hadith | Bukhari 2464 | It describes one house (Abu Talha's) and the streets; we do not say "every house" |

## Freshness (2026-11-22)

Searches found Islamic lectures and articles on "why alcohol is haram" (IslamicFinder,
Yaqeen, Dawat-e-Islami), all speaking to Muslims, plus generic "3 things haram" shorts. No
Hindi short found that starts from "the Quran admits a benefit" and sets it beside WHO and
Lancet data for a mixed audience. YouTube and Instagram were not searched directly
(site search returned nothing). Score F = 4, provisional.

## Parked (true, not in this reel)

- The three steps (2:219, then 4:43, then 5:90–91) and the Bukhari 2464 Madinah scene: cut 2026-11-22 to keep one idea and bring the reel from ~99 s to ~75 s. Good seed for its own reel ("Madinah ki galiyon mein sharaab kyun bahi?"). Cut lines:
  - Aur yeh rule ek din mein nahi aaya.
  - Ibn Kathir jaise purane scholars batate hain, yeh teen steps mein aaya.
  - Pehle bas itna bataya gaya ki nuksaan zyada hai.
  - Phir kaha, nashe mein namaz ke paas mat aao.
  - Aur aakhir mein, *saaf* mana.
  - Jis din elaan hua, Madinah ke ek ghar mein mehfil chal rahi thi, drinks serve ho rahe the.
  - Elaan suna, aur saari sharaab bahar *gali* mein baha di gayi.
  - Sahih Bukhari kehti hai, woh Madinah ki galiyon mein *behne* lagi.

- The US Prohibition (1920–1933) as a contrast: drops the one idea and risks sounding like a jab.
- WHO's "no safe level" for cancer.
- 16:67 as a first hint.
- The Umar dua story (weak grading).

## Not depicted

No Companions shown (Anas, Abu Talha): the Madinah scene is shown with an old street
texture, a poured-out jar and a map, never people.

## Checks added 2026-11-22 (build)

- The Lancet paper has one correction (Department of Error, Lancet 2022; 400: 358,
  https://pmc.ncbi.nlm.nih.gov/articles/PMC9350421/): only Appendices 1 and 2 were corrected
  (19 July 2022). The age-band finding we use is unaffected. A second "Department of Error"
  that a search returned (PMC9671653) is for the Lancet Countdown climate report, unrelated.
- The paper is open access, CC BY 4.0 (PubMed Central PMC9289789). On screen we show the PMC
  record (citation line, title, authors, the first Background sentences), captured
  2026-11-22: `public/footage/sf-lancet-gbd2020-pmc.png` (not committed). The PDF could not be fetched
  (bot check), so the page is the PMC web record, not the journal's typeset page.
- WHO news release, 25 June 2024, captured 2026-11-22 and cropped to headline, date and first
  paragraph (no emblem, no WHO photo): `public/footage/sf-who-2024-06-25.png` (not committed). The headline's
  "over 3 million" includes drug deaths; the script uses the alcohol figure only (2.6 million),
  which the first paragraph states and the reel highlights.
- Line 20: the creator confirmed they said "39" (Whisper heard "49").
