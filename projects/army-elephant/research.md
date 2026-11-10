# Research: "Wo army jo Kaaba nahi gira saki" (Surah al-Fil, 105)

Series B, Forgotten History. Faceless reel, 3D terrain + archival. Researched 2026-11-08.
The creator reads this before the script. No script yet.

## The angle

Everyone tells the story. Nobody shows that the man behind it left his own record: Abraha,
the Aksumite ruler of Yemen, had his campaigns carved in stone. The Murayghan inscription
(Ry 506, 552 CE) records a raid deep into Arabia. It does not name Makkah, and scholars
argue over whether it is the same campaign. The Quran itself tells the event in five
verses; the famous details (the church, the camels, the elephant Mahmud kneeling) come
from later sira and tafsir. The reel shows all three layers and labels each.

## Sources opened

| Source | What it gives | Accessed |
| --- | --- | --- |
| Wikipedia, "Abraha" (full) | Aksumite viceroy of Himyar, 6th c.; seized power, based at Sana'a; inscriptions cover 547–559 CE; Ry 506 "dated 552", Himyarite year 662, month dhu-'allan (September); raided Ma'add "for the fourth time"; battles at "the water hole of Turaban"; assembly at Haliban "approximately 300 km southwest of Riyadh"; invokes "Rahmanan… and His Messiah"; "Mecca is not mentioned in the inscription" (Gajda); Gajda dates the expedition 552; Robin argues Abraha "died by 570"; Bāriqī & Robin 2025 fragment "with the hypothetical mention of elephants"; Quran 105 "the earliest Islamic reference"; pre-Islamic poet Abu Qays bin al-Aslat mentions the "elephant of the Abyssinians"; some historians read the story as later tradition (note 23); Beck vs Charles on war elephants | 2026-11-08 |
| Wikipedia, "Year of the Elephant" (full) | Traditionally c. 570–571 CE; others place it one or two decades earlier (Esposito 1995); Watt: 568/569; lead elephant "Mahmud" stopped at Makkah's boundary (Kistler 2007) | 2026-11-08 |
| Ibn Kathir on 105, alim.org | ababil = groups "following after others" (Ibn Abbas, ad-Dahhak); sijjil "hard and solid" (Ibn Hisham), Persian *sang* + *gil*; 'asf = straw / husk; church al-Qullays in Sana'a; about 200 camels of Abdul Muttalib; "As for the House, it has its Lord Who will defend it" (no isnad); the elephant kneels (unattributed narrative); hadith at Hudaybiyyah: "stopped by He Who restrained the Elephant" (Bukhari, per Ibn Kathir) | 2026-11-08 |
| Tafhim-ul-Quran (Maududi), quranx.com/tafsirs/105.1 | ababil = "many separate and scattered groups"; keeps the literal birds with stones; rejects Farahi's reading that the birds came to eat the dead | 2026-11-08 |
| Muhammad Asad, *The Message of the Quran*, notes on 105 (alim.org) | No authentic evidence on the nature of the birds; leans to "a sudden epidemic of extreme virulence"; quotes Waqidi/Ibn Ishaq that smallpox and spotted fever first appeared in Arabia that year (we could not find this line in Ibn Kathir's text on alim) | 2026-11-08 |
| Wikimedia Commons, transcription of Ry 506 (Mr. Ibrahem, CC0) | Usable drawing of the inscription's letters. No photo of the stone found yet | 2026-11-08 |

Not opened (lead only): Robin 2018 on Abraha's campaigns 548–565; Gajda; the
ancientarabia.huma-num.fr dictionary (refused our fetch); Bāriqī & Robin 2025.

## The Ayahs (fetched by `scripts/fetch_ayah.py`, cross-checked, 2026-11-08)

Arabic in `src/data/quran/105-1.json` … `105-5.json`. Never retype. Sahih International:

| Key | Translation |
| --- | --- |
| 105:1 | Have you not considered, [O Muhammad], how your Lord dealt with the companions of the elephant? |
| 105:2 | Did He not make their plan into misguidance? |
| 105:3 | And He sent against them birds in flocks, |
| 105:4 | Striking them with stones of hard clay, |
| 105:5 | And He made them like eaten straw. |

## Claim ledger (draft, for the script)

| # | Claim | Label | Source | Caveat |
| --- | --- | --- | --- | --- |
| 1 | Abraha ruled Yemen for the Aksumite (Ethiopian) kingdom in the 6th century, from Sana'a | Historical record | Wikipedia "Abraha" (inscriptions) | Exact years differ |
| 2 | In 552 CE he had a raid into central Arabia carved in stone (Ry 506) | Historical record | Wikipedia "Abraha" (Gajda, Robin) | — |
| 3 | That stone does not mention Makkah, the Kaaba or elephants | Historical record | Wikipedia "Abraha" (Gajda) | Say plainly |
| 4 | Some scholars link it to the Year of the Elephant; the traditional date is about 570 | Scholarly view, disputed | Wikipedia "Year of the Elephant"; "Abraha" | Name no side as proved |
| 5 | A fragment published in 2025 may mention elephants | Scholarly view (restoration) | Bāriqī & Robin 2025 via Wikipedia | "Shayad", never "proof" |
| 6 | The Quran tells the event in five verses | Quranic text | 105:1–5 | — |
| 7 | Its first listeners knew the event (a pre-Islamic poet mentions "the elephant of the Abyssinians") | Historical record | Wikipedia "Abraha" | One poet; keep it light |
| 8 | Church in Sana'a, Abdul Muttalib's camels and reply, the elephant kneeling, the name Mahmud | Later report (sira/tafsir) | Ibn Kathir; Jalalayn; Ibn Ishaq via Ibn Kathir | Label LATER REPORT on screen |
| 9 | ababil = flocks coming one after another; sijjil = hard baked clay | Linguistic (tafsir) | Ibn Kathir; Maududi | — |
| 10 | Some (Asad, citing early historians) read it as an epidemic; others (Maududi) keep the literal birds | Interpretation, scholars differ | Asad notes; Tafhim | Do not choose |
| 11 | The Prophet ﷺ was born in the Year of the Elephant | Historical report (traditional) | Year of the Elephant page | Not if we use the 552 date; say "riwayat ke mutabiq" |

## Visual rules for this reel

- 3D terrain is real (elevation + Sentinel-2 2016, see `public/terrain/hijaz-makkah/meta.json`);
  modern Makkah is painted over for 6th-century shots. Every army, camp or Kaaba shot is
  tagged `RECONSTRUCTION`.
- No faces: not Abraha, not Abdul Muttalib, nobody. Armies as dust, silhouettes at distance.
- Never depict the Prophet ﷺ (birth mention = text only).
- Birds: show as flocks at distance, with the honesty card that scholars differ on what
  they were.

## Freshness

Web search 2026-11-08: animated retellings exist (e.g. Really Maktoob); none found showing
the inscription or the dating question. YouTube counts not checked.
