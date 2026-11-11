# Research: "We clothed the bones with flesh" (Al-Mu'minun 23:12–14)

Series: C (Quran ke Lafz). Creator's idea, 2026-11-11. Status: story version confirmed by the creator 2026-11-11 (about 66 s plus recitation); not yet recorded.

## The one idea

Quran tells the story of every human body in a handful of words, each one a picture, and
the most beautiful of them is *kasawnā*: Allah did not say He "joined" flesh to the bones,
He said He *clothed* them, the way you put clothes on someone.

Picture for it: a bare skeleton outline, and a soft layer drawn over it like cloth being pulled on.

Skeleton of the reel (different from Naml, Khunnas, Qibla): a story told in order, one word per
step, with the climax word (*kasawnā*) in the middle and the verse's own ending as the payoff.
It opens on the viewer ("Tum kabhi ek boond the") and closes back on them.

## Freshness (web search, 2026-11-11)

The verse is everywhere in "embryology miracle" material (missionislam.com PDF, radianceweekly,
countless English videos) and in critic pages that attack "bones then flesh". No Hindi short was
found that makes *kasawnā* (clothing) the payoff, or that tells the verse as a story with its own
ending. Our angle: the word, not a miracle claim.

## Quranic text (fetched with `scripts/fetch_ayah.py`, both sources agreed, 2026-11-11)

- `src/data/quran/23-12.json`, `23-13.json`, `23-14.json`.
- Arabic words in the script are copied by code from these files (word index in the
  space-split `textUthmani`): nutfah 23:13 [2]; 'alaqah 23:14 [3]; mudghah [6]; 'izam [9];
  fa-kasawnā [10]; lahm [12]; khalqan ākhar [15–16]; aḥsanu al-khāliqīn [20–21].

Translation for the Ayah card: fetch Sahih International 23:14 from quran.com when the graphic
is built and name the translator; not quoted here from memory.

## Sources read

1. **Ibn Kathir (abridged English), 23:12–16.** https://quran.com/23:14/tafsirs/en-tafisr-ibn-kathir (accessed 2026-11-11)
   - nutfah: "the water gushing forth that comes from the loins of man"
   - 'alaqah: "a red clot, like an elongated clot"; cites 'Ikrimah: "This is blood."
   - mudghah: "like a piece of flesh with no shape or features"
   - bones: "We gave it shape, with a head, two arms and two legs"
   - kasawnā: "We gave it something to cover it and strengthen it"
   - khalqan ākhar: "then We breathed the soul into it"; he then quotes the Ibn Mas'ud hadith
     (stated as recorded by al-Bukhari and Muslim) on the angel breathing in the soul.
   - Ibn Kathir does **not** mention a leech, and does **not** say "chewed".
2. **Quranic Arabic Corpus dictionary.** https://corpus.quran.com/qurandictionary.jsp?q=Elq ,
   ?q=mDg , ?q=ksw (accessed 2026-11-11)
   - ع ل ق: 'alaqah glossed "a clinging substance"; the root also gives "the suspended one" (4:129).
   - م ض غ: mudghah glossed "an embryonic lump".
   - ك س و: kasā "to clothe, to cover"; kiswah "clothing" (same root, 2:259, 4:5, 23:14).
   - Lane's Lexicon could not be opened (TLS failure; JS-only viewer). The "leech" and "chewed
     morsel" senses are therefore unverified and are **not used** in the script.
3. **UNSW Embryology (Mark Hill).** accessed 2026-11-11
   - Implantation: https://embryology.med.unsw.edu.au/embryology/index.php/Implantation
     "implantation commences about day 6 to 7"; "process complete by about day 9".
   - Somites: https://embryology.med.unsw.edu.au/embryology/index.php/Somitogenesis
     "the first somite pair appears at day 20"; "Somites give rise to many different connective
     tissues including: cartilage, bone, muscle and tendon."
   - Muscle timeline: https://embryology.med.unsw.edu.au/embryology/index.php/Musculoskeletal_System_-_Muscle_Development_Timeline
     dermomyotomes formed by stage 14 (day 33); limb myoblasts separate at stage 18–19 (days 44–48).
   - Bone timeline: https://embryology.med.unsw.edu.au/embryology/index.php/Musculoskeletal_System_-_Bone_Development_Timeline
     "Endochondral ossification within the limb begins at Carnegie stage 18" (day 44);
     cartilage template replaced by bone over "week 5-12".
   - Limb development: https://embryology.med.unsw.edu.au/embryology/index.php/Musculoskeletal_System_-_Limb_Development
     (accessed 2026-11-11): the early limb bud has "a mesoderm core that vascularises and both somite
     mesoderm and nerves invade"; "Embryonic skeletal muscles arise from the somite myotome region".
   - Reading: in the limb, cartilage forms from the bud's own core and muscle from somite cells that
     move in; both form at about the same time (days 44–48). (Corrected 2026-11-11: an earlier reading
     here said both come from the same somites, which holds for the trunk, not the limb.) No source
     gives a clean "all bones first, then all flesh" order.
4. **Galen, On Semen (170s CE).** https://en.wikipedia.org/wiki/On_Semen (accessed 2026-11-11),
   citing Debru, "Physiology", in Hankinson (ed.), *The Cambridge Companion to Galen* (2008),
   pp. 278–280: Galen describes "an initial phase of semen, followed by an undifferentiated
   growth", then the main organs, then full formation. So the idea that the embryo grows in
   stages was written down about 440 years before the Quran (170s CE → 610 CE).

## Claim ledger

| # | Claim in the script | Label | Source | Caveat |
|---|---|---|---|---|
| 1 | 23:13–14 name the stages nutfah, 'alaqah, mudghah, 'izam, lahm | Quranic text | fetched JSON | — |
| 2 | nutfah = a drop | Quranic context | Ibn Kathir; Sahih Intl "sperm-drop" | — |
| 3 | 'alaqah has two meanings: something that clings, and clotted blood | Linguistic observation | Corpus gloss; Ibn Kathir, 'Ikrimah | Classical tafsir took it as blood; "clinging" is the root sense |
| 4 | The embryo attaches to the womb wall around day 6–7 | Established science | UNSW Implantation | — |
| 5 | Linking "clinging" to implantation | Interpretation | modern reading | Not in classical tafsir; tag `INTERPRETATION` |
| 6 | mudghah = a small piece of flesh with no shape yet | Quranic context | Ibn Kathir | "Chewed" sense unverified, not used |
| 7 | kasawnā = "We clothed"; same root as kiswah, clothing | Linguistic observation | Corpus ك س و | Ibn Kathir: "cover it and strengthen it" |
| 8 | Bone (cartilage) and muscle form at about the same time | Established science | UNSW Limb Development, Muscle and Bone timelines | Limb: days 44–48; ossification later. Not from the same place: limb cartilage from the bud's core, limb muscle from somite cells (corrected 2026-11-11; the reel never claimed the same place) |
| 9 | The verse gives a picture, not a timetable | Interpretation | ours, from 7 and 8 | Some scholars read a strict sequence; we do not claim one either way |
| 10 | Greek doctors (Galen) wrote of the embryo growing in stages centuries before the Quran | Historical report | On Semen; Debru 2008 | Galen's stages are not the same five; we claim only "stages" |
| 11 | khalqan ākhar = "another creation"; many scholars, as Ibn Kathir, link it to the soul | Quranic context / interpretation | Ibn Kathir; Ibn Mas'ud hadith (Bukhari, Muslim) | Script says only "a new creation"; the soul is not claimed in the spoken line |
| 12 | 23:14 ends "fa-tabāraka Allāhu aḥsanu al-khāliqīn" | Quranic text | fetched JSON | — |

## What the script deliberately does not say

- No "1400 saal pehle kisi ko nahi pata tha" (Galen, row 10).
- No "leech" and no "teeth marks" (unverified lexicon; modern apologetic readings).
- No claim that science confirms "bones first, then flesh" (row 8).
- No Keith Moore story.

## Parked for another reel

- 23:13 *qarārin makīn* ("a firm lodging"): the womb as a safe place.
- 39:6 "three darknesses".
- The Ibn Mas'ud hadith on the stages and the soul (needs its own careful reel).

## Before shooting

- Creator confirms the script; any change while speaking goes back into `script.txt`.
- Hadith wording: confirm the Ibn Mas'ud hadith number on sunnah.com if it is ever put on screen (it is not in this script).
- Embryo images: only after recording ([[plan-after-recording]]). UNSW/Kyoto photos are permission-only;
  look for public-domain Carnegie plates (Davis 1923, Atwell 1930) on Wikimedia Commons, or draw
  clearly labelled illustrations. No AI embryos.

## Comment ask

On screen at the end card (English): "Which word stayed with you: drop, clinging, or clothed?"
Spoken CTA is the last line of `script.txt`.

## Recording guide (told to the creator 2026-11-11, before the take)

Planned off-camera lines, where the creator's face will not be used, so they may read from the
script: 4, 5, 6, 8, 9, 12, 13, 15, 16, 17, 19 (Ayah cards, embryo visuals, word graphics).
On camera: 1–3 (hook), 7, 10, 11, 14, 18, 20. Keep these when writing beats.md unless the take
shows a better choice; tell the creator if a planned off-camera line has to come back on camera.
