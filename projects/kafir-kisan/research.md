# "Kafir" gaali hai? Quran kisaan ko bhi kuffar kehta hai (57:20)

Series A, Viral Claim Check (answer-objections track), with a Quran ke Lafz core.
Researched 2026-11-12. Script not written yet.

## The claim

Online, mostly in India: "Kafir ek gaali hai, Muslims Hinduon ko gaali dete hain" /
"Quran mein kafir ka matlab Hindu hai". On the Muslim side the word is also thrown at
people as an insult, including at other Muslims.

## The one idea (draft)

k-f-r means *to cover*. The Quran calls farmers "kuffar" once, because they cover the seed
with soil. In the Quran, kufr is covering a truth or a favour, and its opposite is
**shukr** (gratitude), so the word names a stance towards Allah, not a slur, and the
Quran forbids insults (6:108). Picture: a farmer's hand pressing soil over a seed.

## Freshness (YouTube, 2026-11-12, built-in browser, query "kafir ka matlab kisan quran")

The question "kafir ka matlab kya hai" is hot: "Kafir ka matalab kya hai | conflict in
Quran & Islam" 1.2M; Dr Zakir Naik clips 68K, 117K, 178K; "Kafir kon He?" 151K; "Kya
Quran mein kafir ka matlab Hindu hai? Jawab" 7.4K; Shadab Ahmad 37K. All are talks or
clips. None in the top results shows the farmer image or the shukr/kufr pair visually.
Freshness 3: the topic is crowded, the angle (the seed, and kufr as the opposite of
shukr) is not.

## Verses (fetch_ayah.py, 2026-11-12)

| Ref | What it shows | File |
| --- | --- | --- |
| 57:20 Al-Hadid, words 14–18 only | كَمَثَلِ غَيْثٍ أَعْجَبَ ٱلْكُفَّارَ نَبَاتُهُۥ, rain whose plants please the kuffar (farmers) | `57-20.json` (`excerptWords: 14-18`) |
| 27:40 An-Naml | Sulaiman: لِيَبْلُوَنِىٓ ءَأَشْكُرُ أَمْ أَكْفُرُ, "to test me, will I be grateful or ungrateful" | `27-40.json` |
| 76:3 Al-Insan | إِمَّا شَاكِرًا وَإِمَّا كَفُورًا, grateful or ungrateful | `76-3.json` |
| 14:7 Ibrahim | لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ ۖ وَلَئِن كَفَرْتُمْ, if you are grateful I will give more; if you deny | `14-7.json` |
| 2:152 Al-Baqarah | وَٱشْكُرُوا۟ لِى وَلَا تَكْفُرُونِ | `2-152.json` |
| 6:108 Al-An'am | وَلَا تَسُبُّوا۟, do not insult those they call on besides Allah | `6-108.json` |
| 109:1, 109:6 | قُلْ يَـٰٓأَيُّهَا ٱلْكَـٰفِرُونَ … لَكُمْ دِينُكُمْ وَلِىَ دِينِ | `109-1.json`, `109-6.json` |

### 57:20: saved as an excerpt (creator's choice, 2026-11-12)

Resolved: `fetch_ayah.py 57:20 --words 14-18` cross-checks and saves only the five words
the reel shows; both sources agree on them. The Ayah card must label it as part of 57:20.
The history of the problem:

`fetch_ayah.py` stopped on 57:20. After its normal tajweed-mark rules, one difference is
left, in وَفِى ٱلْـَٔاخِرَةِ: quran.com writes the hamza as a hamza-above on a kashida
(U+0640 U+0654), alquran.cloud as a standalone hamza (U+0621). It is a spelling
convention for the same word, but the script's rule is that every letter must match, so
nothing was written and nothing was edited by hand. **Creator's call:** either show only
the 57:20 words up to نَبَاتُهُۥ (needs the script to save an excerpt), or allow this one
hamza convention in the comparison. Both change the verification tool, so not done
without OK.

## Lexicon and tafsir (accessed 2026-11-12)

- **Lane's Lexicon**, root كفر, Form 1: "He veiled, concealed, hid, or covered, the thing";
  example كَفَرَ البَذْرَ ٱلْمَبْذُورَ, "He covered the sown seed with earth". كَفْرٌ: the
  darkness of night "because it conceals things"; earth "because it conceals what is beneath
  it". Form 2 sense: "ungrateful", "denied ... the favour". (laneslexicon.com/word/كفر)
- **al-Qurtubi** on 57:20: "الكفار هنا: الزراع لأنهم يغطون البذر", the kuffar here are
  the cultivators, because they cover the seed. He also gives a second reading, unbelievers,
  and calls it "قول حسن" (a good view). (tafsir.app/qurtubi/57/20)
- **al-Baghawi** on 57:20: "أي: الزراع". **al-Jalalayn**: "الزارع". (surahquran.com)
- **Ibn Kathir** (abridged English): "farmers admire the vegetation that grows in the
  aftermath of rain", then applies it: "just as farmers admire vegetation, the
  disbelievers admire this life". (quran.com/57:20/tafsirs/en-tafisr-ibn-kathir)
- **al-Tabari**: does not gloss الكفار in this verse on the page read; not cited.
- **al-Wasit** (Tantawi, modern) reports from Ibn Mas'ud that the kuffar here are the
  cultivators, named from kufr = covering: "كفر الزارع بذره ... إذا أخفاه في الأرض".
- **Wikipedia "Kafir"**: "The most fundamental sense of kufr in the Quran is
  'ingratitude'"; pre-Islamic use for farmers burying seed. Secondary; used only as a
  pointer.

## Hadith

- **Sahih al-Bukhari 6104** (Book of Adab; in-book 78:131), from Abdullah ibn Umar: "أيما
  رجل قال لأخيه يا كافر فقد باء بها أحدهما", whoever says to his brother "O kafir", it
  returns to one of them. Sahih (in Bukhari). Read on sunnah.com in the built-in browser,
  2026-11-12. (Muslim 60 is the parallel; sunnah.com refused the fetch, not yet opened.)

## Modern scholarly view

- **Nahdlatul Ulama (Indonesia), February 2019**, Bahtsul Masail forum at its national
  meeting in Banjar: clerics urged Muslims not to call non-Muslim fellow citizens
  "kafir", and to use *muwathinun* (citizens). Abdul Moqsith Ghazali: the word "hurts some
  non-Muslims". Not in the official recommendation; criticised by other groups. (The
  Jakarta Post, 1 March 2019)

## Claim ledger

| # | Claim | Label | Source | Caveat |
| --- | --- | --- | --- | --- |
| 1 | k-f-r's base meaning is to cover, hide | Linguistic observation | Lane, Form 1 | — |
| 2 | Arabic says a sower "kafara" the seed: covered it with earth | Linguistic observation | Lane (كفر البذر); al-Wasit | — |
| 3 | In 57:20 the "kuffar" are farmers | Interpretation (majority) | Qurtubi, Baghawi, Jalalayn, Ibn Kathir; Ibn Mas'ud via al-Wasit | Qurtubi also allows "unbelievers"; Ibn Kathir applies the image to them. Say "mufassirin ke mutabiq" |
| 4 | Night and earth are called kafr because they cover | Linguistic observation | Lane, كَفْرٌ | optional line |
| 5 | In the Quran kufr's opposite is shukr | Quranic context | 27:40, 76:3, 14:7, 2:152 | — |
| 6 | Kufr is covering a truth or a favour: a stance towards Allah | Interpretation | Lane Form 2; Wikipedia (Izutsu line) | It is still a serious word in the Quran with warnings (14:7); not neutral |
| 7 | The Quran forbids insulting others' gods | Quranic context | 6:108 | about insulting deities; we apply it to manners, say so |
| 8 | The Prophet warned against calling a Muslim "kafir" | Hadith, sahih | Bukhari 6104 | it is about Muslims (a brother); do not stretch it to everyone |
| 9 | Kafir is not a word for any one community ("Hindu") | Interpretation | 109:1–6 address Makkah's deniers; the word is about belief, not birth | scholars differ on who is a kafir in the full sense (e.g. those the message never properly reached); keep it general, scholar check |
| 10 | NU (2019) asked Muslims to say "citizens" instead | Historical report | Jakarta Post | one organisation's forum, not a ruling for all |

## Honest beats for the script

- The farmer meaning is **one verse**. Kafir in the rest of the Quran does mean those who
  reject; the reel must not say "kafir just means farmer".
- The word is not a compliment either. The point: it names a stance, not a person to abuse.
- Our own side misuses it as a gaali, against non-Muslims and against Muslims; Bukhari 6104.
- No communal framing: no "Hindu" on screen beyond quoting the claim, no remarks about
  other religions. Answer the claim, not anyone.

## Sources (accessed 2026-11-12)

- https://www.laneslexicon.com/word/%D9%83%D9%81%D8%B1 and /n37096, /n37101
- https://tafsir.app/qurtubi/57/20
- https://surahquran.com/aya-tafsir-20-57.html (Baghawi, Jalalayn, al-Wasit)
- https://quran.com/57:20/tafsirs/en-tafisr-ibn-kathir
- https://quran.com/ar/57:20/tafsirs/ar-tafsir-al-tabari
- https://sunnah.com/bukhari:6104
- https://www.thejakartapost.com/news/2019/03/01/nu-calls-for-end-to-word-infidels-to-describe-non-muslims.html
- https://en.wikipedia.org/wiki/Kafir
- YouTube search, 2026-11-12
