# Research: "Quran kehta hai zameen chapti hai?" — a viral claim, checked both ways

Series A, Viral Claim Check. Researched 2026-11-06. The creator reads this before the script.
No script yet.

## The claims we check

1. **The critics' claim.** The Quran says the earth is flat. Verses they quote: 88:20
   (*sutihat*), 71:19 (*bisat*), 15:19 (*madadnaha*). In India this circulates widely in Hindi
   (see Freshness).
2. **The Muslim overclaim.** 79:30 *dahaha* means "made it egg-shaped, like an ostrich egg",
   so the Quran described the earth's real shape. This comes from Dr Zakir Naik's booklet
   *The Qur'an & Modern Science: Compatible or Incompatible?* (archive.org OCR copy, seen in
   search results; the egg sentence was in the search snippet, the booklet was not opened in
   full). Naik says *dahaha* "is derived from *duhiya*, which means an egg… of an ostrich".

The channel's angle: both claims fail the same test. Read what the word means and what the
mufassirun said, not what either side needs it to mean.

## The Ayahs (fetched by `scripts/fetch_ayah.py`, cross-checked, 2026-11-06)

Arabic is in `src/data/quran/<key>.json`. Never retype it. English is Sahih International
(quran.com translation 20, fetched from api.quran.com the same day).

| Key | Word | Sahih International |
| --- | --- | --- |
| 88:20 | سُطِحَتْ *sutihat* | "And at the earth - how it is spread out?" |
| 71:19 | بِسَاطًا *bisatan* | "And Allāh has made for you the earth an expanse" |
| 15:19 | مَدَدْنَـٰهَا *madadnaha* | "And the earth - We have spread it…" |
| 79:30 | دَحَىٰهَآ *dahaha* | "And after that He spread the earth." |
| 39:5 | يُكَوِّرُ *yukawwiru* | "He wraps the night over the day…" (context only, see below) |

Context of 88:17–20: a desert traveller is told to look at four things in front of him:
the camel he rides, the sky above, the mountains around, the ground below (Qurtubi, Ibn
Kathir, Razi, Ma'ariful Quran all read it this way). The verse asks him to reflect on how
the ground was made level for him; it is not a lesson on the planet's shape.

## What the words mean

- **سطح *sataha*** : to level, make even. Tabari on 88:20: "بُسطت", and "a mountain is
  *musattah* when its top is level". Ibn Ashur: "سُويت… ومنه سَطْح الدار" (levelled, as the
  flat roof of a house), and "المراد بالأرض أرض كل قوم لا مجموع الكرة الأرضية" — the earth here
  is each people's land, not the whole globe.
- **دحو *dahw*** : to spread out. Qurtubi on 79:30: "دحوت الشيء… إذا بسطته" (I spread it out).
  The ostrich link is real but it is about the **nest, not the egg**. Qurtubi: the ostrich's
  nest is called *udhiyy* "لأنه مبسوط على وجه الأرض" (because it is spread on the ground).
  Lane's Lexicon, entry أُدْحِىٌّ: "The place of the laying of eggs… of the ostrich, in the
  sand; because that bird expands it, and makes it wide, with its foot". So the word that
  comes from *dahw* names the scraped-out ground where the eggs lie, not the egg.
- Ibn Kathir on 79:30 (from Ibn Abbas, chosen by Tabari): *dahaha* is explained by the next
  verse, "He brought out its water and pasture" (79:31): the earth was made ready to live on.
- No tafsir we opened reads *dahaha* as "egg-shaped".

## What the classical scholars actually said (the honesty beat)

They did **not** agree. That is the point the reel must not hide.

| Scholar | Died | Position | Exact source (opened) |
| --- | --- | --- | --- |
| Abu al-Husayn Ibn al-Munadi | 336 AH / 947 CE | Reports consensus: "أجمعوا على أن الأرض بجميع حركاتها من البر والبحر مثل الكرة" | Quoted by Ibn Taymiyyah, *Majmu' al-Fatawa* 25/195, via islamqa.info/ar/answers/118698 |
| Ibn Hazm (al-Andalus) | 456 AH / 1064 CE | Round. No true imam of the Muslims "لم ينكروا تكوير الأرض ولا يحفظ لأحد منهم في دفعه كلمة" | *al-Fisal fi al-Milal*, vol. 2, section "مطلب بيان كروية الأرض" (ar.wikisource.org); islamqa gives 2/78 |
| Ibn Atiyya (al-Andalus) | 541 AH / 1147 CE | Flat reading: the verse's surface meaning is that the earth is flat, and sphericity "قول لا يثبته علماء الشرع", though it does not break any pillar of the faith | *al-Muharrar al-Wajiz* on 88:20 (quran-tafsir.net/atia) |
| Fakhr al-Din al-Razi | 606 AH / 1210 CE | Using this verse against a round earth "ضعيف, لأن الكرة إذا كانت في غاية العظمة يكون كل قطعة منها كالسطح" | *Mafatih al-Ghayb* on 88:20 (quran-tafsir.net/alrazy); same answer on 13:3 |
| Ibn Taymiyyah | 728 AH / 1328 CE | Cites Ibn al-Munadi's consensus; says several scholars reported it | *Majmu' al-Fatawa* 25/195 and 6/586 (the second is about the heavens) |
| Jalal al-Din al-Mahalli (*Tafsir al-Jalalayn*; Surah 88 is in al-Mahalli's half) | 864 AH / 1459 CE | Flat: "سُطحت ظاهر في الأرض سطح، وعليه علماء الشرع، لا كرة كما قاله أهل الهيئة وإن لم ينقض ركناً من أركان الشرع" | *Tafsir al-Jalalayn* on 88:20 (quran-tafsir.net/jalalen) |
| Abd al-Rahman al-Sa'di | 1376 AH / 1956 CE | "تسطيحها لا ينافي أنها كرة"; a body this large is "كرويًا مسطحًا" | *Taysir al-Karim al-Rahman* on 88:20 (quran-tafsir.net/saady) |
| Ibn Ashur | 1393 AH / 1973 CE | "the earth" here = each people's land, not the globe | *al-Tahrir wa al-Tanwir* on 88:20 (quran-tafsir.net/ashour) |

So:
- Some respected mufassirun (Ibn Atiyya, al-Mahalli) **did** read 88:20 as a flat earth. The
  critics are not inventing that. Say so on screen.
- Others, earlier and later (Ibn al-Munadi, Ibn Hazm, Razi), said the earth is round and that
  the verse does not say otherwise. Razi's reason is the one any phone user can test: a very
  large sphere looks flat from where you stand.
- The disagreement was about how to read a word, not a teaching of the Quran on astronomy.
  Ibn Atiyya and al-Mahalli both say the round view breaks no pillar of the faith.

## History note (optional beat)

Under Caliph al-Ma'mun (r. 813–833 CE / 198–218 AH) astronomers measured the length of one
degree of latitude in the plain of Sinjar to compute the earth's size (Encyclopaedia
Iranica, "Banu Musa"; the team and exact figures differ between sources, so give no number).
Label: historical record. The earth's roundness was also known before Islam (Greek
astronomy; Eratosthenes c. 240 BCE). Say so if this beat is used: Muslims inherited and
tested it, they did not discover it.

## What we will NOT claim

- That the Quran "proves" or "predicted" a round earth. Neither 79:30 nor 39:5 (*yukawwiru*,
  wrapping night over day) is a statement of the planet's shape in any tafsir we opened.
  Ibn Hazm did use *yukawwiru* as evidence; that is his argument, labelled interpretation,
  and we do not need it.
- That the flat reading was "never" held. It was.
- Any mocking of the critics or of Dr Naik. Name the claim, not the person, on screen
  (same rule as Yawm 365); "ek bahut mashhoor claim" is enough.

## Claim ledger

| # | Claim the script may make | Label | Source | Caveat |
| --- | --- | --- | --- | --- |
| 1 | Critics say the Quran calls the earth flat, quoting 88:20 | Report of a popular claim | YouTube results 2026-11-06; WikiIslam (critic side, search result only) | Shown as "the claim" |
| 2 | *Sutihat* means levelled / spread out for living on | Linguistic observation | Tabari, Qurtubi, Ibn Kathir, Ibn Ashur on 88:20 | — |
| 3 | 88:20 is about a traveller looking at the ground under him | Quranic context | 88:17–20; Qurtubi, Razi, Ma'ariful Quran | — |
| 4 | Some classical mufassirun read it as flat | Scholarly view | Ibn Atiyya, Jalalayn on 88:20 | Must be said |
| 5 | Others said round, and that the verse doesn't contradict it | Scholarly view | Ibn Hazm *al-Fisal*; Razi on 88:20; Ibn al-Munadi via Ibn Taymiyyah 25/195 | "Consensus" is Ibn al-Munadi's report, not ours |
| 6 | A huge sphere looks flat from any spot on it | Established science (and Razi's argument) | Razi on 88:20; basic geometry | — |
| 7 | *Dahaha* means spread out | Linguistic observation | Qurtubi on 79:30; Lane | — |
| 8 | The ostrich word *udhiyy* is the spread-out nest, not the egg | Linguistic observation | Qurtubi on 79:30; Lane's Lexicon, أُدْحِىٌّ | — |
| 9 | "Dahaha = ostrich egg" is a modern claim, not classical tafsir | Interpretation (our finding) | None of Tabari, Qurtubi, Ibn Kathir, Razi on 79:30 says egg | We opened 4 tafsirs, not all; say "classical tafsir mein nahi milta", not "koi nahi kehta" |
| 10 | Roundness was known before Islam | Established history | Eratosthenes (Britannica, to open before use) | Only if the history beat is used |
| 11 | Al-Ma'mun's astronomers measured a degree of the earth | Historical record | Iranica "Banu Musa" (to open before use) | No figures on screen |
| 12 | "Ye aayat planet ki shape bata hi nahi rahi" | Interpretation | Context 88:17–20; Razi, Ibn Ashur, Sa'di on 88:20 | Ibn Atiyya and Jalalayn disagree; the next beat says so |
| 13 | "Dono claims ne lafz se wo kehlwaya, jo unhe chahiye tha" | Interpretation (our conclusion) | Rows 2, 7, 8 | About the claims, not about any person |
| 14 | "Phir bhi gol hai" | Established science | Any physics/geodesy textbook; NASA Earth fact sheet (to cite in credits) | — |

## Script (draft 4, 2026-11-06)

Drafts 1–3 were written to a word count, which made them read like notes (colons, clipped
phrases, no breath). Draft 4 is written for the ear, the way a human scriptwriter would
write it: full spoken sentences, the viewer's own question asked aloud before each answer
("Par baat kis cheez ki ho rahi hai?"), one picture to hold ("registan mein ek aadmi oont pe
baitha hai"), plain signposts ("Pehle flat wala", "Ab ande wala claim"), and a last line that
calls back to the verse itself. Ibn Hazm was cut so the honest beat has one voice per side
(Jalalayn, Razi); row 5 now rests on Razi.
The Arabic in brackets for 88:20 and 79:30 was copied by code from the fetched Ayah files; أُدْحِيّ is
from Lane's Lexicon. `make_captions.py` drops bracketed Arabic.

`script.txt`: 20 lines, 252 spoken words, about 76 s at 3.3 words/s. That is over the 60 s
target. The creator chose to keep 76 s on 2026-11-06 (options were: keep, split into two reels,
or squeeze the egg half). The wording still needs the creator's read-aloud confirmation before the shoot.
Line → ledger row: 1–3 → 1, 9; 4–5 → 2; 6–10 → 3, 12 (lines 7–8 paraphrase 88:17–20,
label them as translation, and fetch 88:17–19 before showing them); 11 → 4; 12–13 → 5, 6, 14;
14–17 → 7, 8, 9; 18–19 → 13.

- Mid-video CTA: after line 13 (about 50 s, at the end of the flat half).
- Comment ask (on screen, end card): "Which viral claim should we check next?"
- Not used: Ibn Hazm, the al-Ma'mun history beat (rows 10–11), and 71:19 / 15:19 / 39:5.

## Freshness (YouTube, 2026-11-06, Hindi search "quran zameen chapti flat earth")

The topic is hot in Hindi: "Kya Quran Mein Earth Flat Hai? Reply to Nupur Sharma" 155K;
"Reply From Quran to Dhruv Rathee" 1M; several 13K–55K. The replies we saw are defences
("Quran says round"). None in the titles shows the classical disagreement or checks the egg
claim. A second search for the ostrich-egg angle did not load; not checked. Score
freshness 4: the topic is crowded, the honest two-sided angle is not.

## Risks

- Politically charged in India (Nupur Sharma context). Keep the reel about the words; name
  no politician, no channel.
- Saying "some scholars read it flat" may upset viewers. Frame it as strength: the tradition
  argued in the open, and the verse never needed the shape of the earth to make its point.
- Ibn Taymiyyah's 25/195 page was read through islamqa's quotation, not a printed edition;
  name it as "Ibn al-Munadi, quoted by Ibn Taymiyyah" and keep 25/195 off screen until checked.
- A scholar should glance at the Ibn Atiyya / Jalalayn wording before the final render.

## Sources (accessed 2026-11-06)

- api.quran.com v4: Ayahs, Sahih International, tafsirs 90 (Qurtubi), 14 (Ibn Kathir),
  15 (Tabari), 168 (Ma'ariful Quran) on 88:20 and 79:30. Raw copies in `work/flat-earth/`.
- quran-tafsir.net, 88:20: /jalalen/, /atia/, /alrazy/, /saady/, /ashour/; 13:3: /alrazy/.
- ar.wikisource.org, الفصل في الملل والأهواء والنحل/الجزء الثاني, "مطلب بيان كروية الأرض".
- islamqa.info/ar/answers/118698, "الإجماع على كروية الأرض".
- Lane's Lexicon, laneslexicon.com/word/أدحى/n12225.
- Search results only (not opened, not to be cited on screen): Zakir Naik booklet on
  archive.org; Iranica "Banu Musa"; WikiIslam.
