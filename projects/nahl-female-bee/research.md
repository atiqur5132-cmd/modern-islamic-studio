# Shahad ki makkhi female hai, Quran ko pata tha? (16:68–69)

Series A, Viral Claim Check. Researched 2026-11-13. TOPICS.md #56. Talking head (tripod).

## The claim

Forwarded as: "In Surah an-Nahl the verbs for the bee are feminine, and only female bees
gather nectar and make honey. In the 7th century people thought bees had a king. How did
the Quran know?" The best-known English version is Gary Miller's *The Amazing Quran*,
chapter "The Female Bee" (reposted at knowingallah.com/en/articles/2934, opened
2026-11-13). It also cites Shakespeare's bees with "a king" (the page says *Henry IV*; the
speech is in *Henry V*, Act 1 Scene 2, but we do not use it).

## The one idea

The feminine verbs are a normal Arabic rule for words like *nahl*, the same rule that
makes *ghulibat ar-Rūm* ("Rum haar **gayi**") feminine for an army of men. So the verb does
not prove the Quran is pointing at female bees. The bees really are female, but that fact
does not come from the grammar. The verse itself says where the sign is: the bee and what
comes out of her, "for people who think".

Picture: Hindi "police **aa gayi**" (feminine verb, whoever the officers are), then 30:2.

Verdict stamp: `TRUE, BUT…` (the bee fact is true; the grammar is not proof).

## The verses (fetched with `scripts/fetch_ayah.py`, 2026-11-13)

| Ref | Used for | File |
| --- | --- | --- |
| 16:68 An-Nahl | ittakhidhī (feminine "take/make") | `src/data/quran/16-68.json` |
| 16:69 An-Nahl, words 1–18 | kulī (eat), fa-slukī (follow), buṭūnihā (her bellies), shifā' | `16-69.json` (excerpt) |
| 30:2 Ar-Rum | ghulibat ar-Rūm, feminine verb for the Byzantines | `30-2.json` |
| 49:14 Al-Hujurat | qālat al-a'rāb, a second example (backup) | `49-14.json` |
| 12:30 Yusuf | wa qāla niswatun, the mirror case (backup) | `12-30.json` |
| 54:20 / 69:7 | a'jāzu nakhlin munqa'ir (masc.) vs. khāwiyah (fem.), same noun type (backup) | `54-20.json`, `69-7.json` |

**16:69 is saved only as words 1–18.** quran.com and alquran.cloud differ in how they spell
the hamza of word 22 (*la-āyatan*), so the script stops on the full Ayah. The ending
"inna fī dhālika la-āyatan li-qawmin yatafakkarūn" is **spoken in translation only**; no
Arabic card for it unless the creator wants it, in which case we fetch it as its own
excerpt after a scholar or a printed mushaf settles the spelling.

Translations (Sahih International, quran.com API, 2026-11-13):
- 16:68 "And your Lord inspired to the bee, 'Take for yourself among the mountains, houses, and among the trees and [in] that which they construct.'"
- 16:69 "Then eat from all the fruits and follow the ways of your Lord laid down [for you].' There emerges from their bellies a drink, varying in colors, in which there is healing for people. Indeed in that is a sign for a people who give thought."
- 30:2 "The Byzantines have been defeated."

## Grammar

- **al-Qurtubi, on 16:68**, quoting the lexicographer **al-Jawhari** (quran.ksu.edu.sa/tafseer/qortobi/sura16-aya68.html, opened 2026-11-13):
  - "والنحل والنحلة الدبر يقع على الذكر والأنثى": *nahl* and *nahla* apply to the male and the female.
  - "والنحل يؤنث في لغة أهل الحجاز، وكل جمع ليس بينه وبين واحده إلا الهاء": *nahl* is treated as feminine in the dialect of the people of the Hijaz, as is every plural that differs from its singular only by the -a ending (nahl / nahla).
  - Also: "لا خلاف بين المتأولين أن الوحي هنا بمعنى الإلهام": the *wahy* to the bee is inspiration (instinct), with no disagreement.
- **al-Qurtubi, on 16:69** (…/sura16-aya69.html, opened 2026-11-13): "واليعسوب سيد النحل، إذا وقف وقفت وإذا سار سارت". The leader is called *ya'sūb*, "sayyid", a masculine word, with masculine verbs (waqafa, sāra). The scholars who knew this Arabic best did not read the bees' sex from it: they named the queen a male "chief".
- **Agreement rule** (Diwan al-Arab, "الجموع وما يرافقها من تذكير وتأنيث", opened 2026-11-13; cites al-Radi, *Sharh al-Kafiya* 2/159): for a collective noun of kind (*ism jins jam'i*, e.g. 'Arab, Rum, tuffāh/tuffāha), "نقول: قال العرب أو قالت العرب، غلب الروم أو غلبت الروم". Both genders of the verb are correct. *Nahl / nahla* is exactly this type (like tuffāh / tuffāha).
- **30:2** uses the feminine: غُلِبَتِ ٱلرُّومُ. The Rum here are the Byzantine forces defeated by Persia (tafsir context of 30:2–4; the year is in `projects/adnal-ard/research.md`).
- **49:14** qālat al-a'rāb: Qurtubi says it came down about Bedouin men of Banu Asad ibn Khuzayma (…/qortobi/sura49-aya14.html, opened 2026-11-13). A feminine verb for a group of men; a backup example.

Hindi analogy: "police aa gayi", "fauj aa gayi", "sarkar ne kaha" (feminine verbs, whoever
is in them). Everyday usage, no source needed.

## Bee science

- **UF/IFAS Extension, ENY-166 "The Social Organization of Honey Bees"** (ask.ifas.ufl.edu/publication/in1102, opened 2026-11-13): "Each honey bee colony consists of a queen (reproductive female), workers (non-reproductive females), and drones (males). Each caste has a clearly defined role that is not performed by any other caste." Workers' "bodies are specialized for pollen and nectar collection"; they build comb, process honey and forage.
- **Mississippi State University Extension, "How Is Honey Made?"** (extension.msstate.edu, opened 2026-11-13): nectar is stored in the crop, or honey stomach; foragers add invertase; a forager "regurgitates her nectar load" to food-handling bees; fanning brings water from up to 80% down to about 18%.
- **History of "king" bees** (aleteia.org 2018 and Wikipedia on Swammerdam, search results only, **not opened, not used in the script**): Aristotle called the leader a king; Luis Méndez de Torres (1586) described an egg-laying female; Swammerdam found ovaries in the queen (1670s); Butler, *The Feminine Monarchy* (1609). Open a museum or academic source before using any of this.

## Claim ledger

| # | Claim in the script | Label | Source | Caveat |
| --- | --- | --- | --- | --- |
| 1 | The viral post says the Quran knew 1400 years ago that the bee is female | (the claim) | Gary Miller, knowingallah.com/en/articles/2934 | Shown as `VIRAL CLAIM`, no person named |
| 2 | In 16:68–69 the bee is addressed with feminine forms: kulī (eat), fa-slukī (go/follow) | Quranic context | 16-68.json, 16-69.json | ittakhidhī (16:68) is feminine too |
| 3 | All the bees that gather nectar and make honey are female; drones (males) do not | Established science | UF/IFAS ENY-166; MSU Extension | "Make honey" = workers; the queen does not forage either |
| 4 | In Hindi we say "police aa gayi" whoever the officers are | Linguistic observation | Everyday usage | — |
| 5 | 30:2 says ghulibat ar-Rūm, a feminine verb, about the Byzantine army | Quranic context / linguistic | 30-2.json; Diwan al-Arab | Arabic allows "ghuliba" too |
| 6 | Nahl is the same kind of word: one nahla, many nahl | Linguistic observation | Qurtubi/Jawhari on 16:68 | — |
| 7 | The people of the Hijaz spoke of nahl as feminine (Qurtubi records it) | Linguistic observation (classical report) | Qurtubi quoting al-Jawhari | Jawhari: the word can be either gender |
| 8 | The same classical books call the bees' leader ya'sūb, "sardar", a masculine word | Linguistic observation | Qurtubi on 16:69 | Shows the ulama did not read sex from grammar; not a mockery of them |
| 9 | So the verb is not proof; the bee being female is still true | Interpretation (ours) | follows from 3–8 | Some Muslims hold the choice of feminine is still meaningful; we do not say it is meaningless, only that it is not proof |
| 10 | "Their bellies" a drink of many colours with healing for people; a sign for people who think | Quranic text (translation) | 16:69, Sahih International | Spoken in translation only; "shifa'" is indefinite: Qurtubi says not a cure for every illness (not used) |

## Parked for another reel

- **Mouth or belly?** Qurtubi on 16:69: "most people hold that honey comes out of the bees' mouths"; he answers "min buṭūnihā" because food is transformed only inside the belly. Science: nectar is changed in the honey stomach (crop) with invertase and then regurgitated; UC Davis's Eric Mussen argues it is not "vomit" since it never mixes with digesting food (ucanr.edu, search only). A two-sided reel on the critic's "bee vomit" line.
- **"Bees don't eat fruit" (kulī min kulli ath-thamarāt):** Qurtubi says she eats the blossoms (nawwār). Check thamarāt's range of meaning.
- **"Butun plural = three stomachs"** overclaim (blog only). Weak.

## Open checks

- A qualified scholar or Arabic teacher to confirm the grammar line ("Arabic mein ye normal rule hai") and the wording about Hijazi usage.
- Whether the creator wants the 16:69 ending as an Arabic card (see the note above).
