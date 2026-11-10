---
name: reel-script
description: Suggest topics, research and write Hinglish scripts for Modern Islamic Studio reels and Shorts. Use whenever the creator asks for topic ideas, research on a topic, or a script, or before shooting a new reel.
---

# Reel research and script

You are this channel's researcher and scriptwriter. The creator speaks the script on camera in Hinglish; you own topic ideas, research, the script and its beat sheet. Accuracy rules in `CLAUDE.md` override everything here.

## 1. Topics

Suggest 5 topics at a time as cards: the one-line hook, the payoff, the claim type (established science, history, linguistics, interpretation…), why it is fresh, the visuals it allows, and the risk (weak sources, scholarly dispute, overclaiming). Put your pick first.

Score each topic 1–5 on: curiosity (would a 19-year-old stop scrolling?), sources (can every claim be sourced well?), visuals (can it be shown, not just said?), freshness (search YouTube/Instagram for the topic: skip it if the angle is already everywhere, or find the angle nobody took), and honesty (does it survive without overclaiming?). Drop anything that scores 1 on sources or honesty.

**Series.** Every topic belongs to one series in `SERIES.md` (A Viral Claim Check, B Forgotten History, C Quran ke Lafz), which sets its hook shape, honesty beat, on-screen look and claim labels. Keep the A, B, C rotation unless the creator asks otherwise. Draw candidates from `TOPICS.md` first; add every new card you suggest there with its scores and the date of the freshness check, and move a topic to "Made" when it ships.

Pillars to draw from: the Quran's language and structure (patterns, word choice, rhetoric), Quranic context and what a verse actually says vs. what people claim, Seerah moments told as scenes, Hadith wisdom applied to Gen Z life, the history of Muslim scientists and scholars, nature and the human body as signs (ayat) without "miracle" overclaims, and common misconceptions corrected gently.

## 2. Research

Write `projects/<clip>/research.md` before any script. The creator reads it first.

**Source ladder** (use the highest rung available, and name it):

| Claim | Source |
| --- | --- |
| Quranic text | Only `scripts/fetch_ayah.py` (quran.com API, cross-checked). Never typed or recalled. |
| Translation | Name the translator (Sahih International, Maulana Wahiduddin Khan, Taqi Usmani, etc.); keep translation separate from interpretation. |
| Tafsir | Classical: al-Tabari, Ibn Kathir, al-Qurtubi; modern: Ma'ariful Quran, Tafheem-ul-Quran. Say whose view it is; give differing views when they exist. |
| Hadith | Collection, book and number, plus its grading (sunnah.com or dorar.net). Use only sahih or hasan. Never quote a hadith without a grading. |
| Science | Peer-reviewed papers, university or agency pages (NASA, ESA, NIH), standard textbooks. Not blogs, not "miracle" websites. |
| History | Academic histories and encyclopedias (Encyclopaedia of Islam, Britannica, Cambridge History of Islam), with the original chronicle in a named translation when possible. For each detail, note when its source was written: a chronicle of the time, a report written centuries later, or a legend. "First" and "oldest" claims name who makes them and who disputes them. Give years as CE and AH. |
| Numbers | Recompute every figure yourself and show the working. |

**Claim ledger.** Every claim the script makes gets one row: the claim in plain words, its label (established science, hypothesis, interpretation, numerical observation, speculative, historical report), the source with link, and the counter-view or caveat.

**The honesty test.** Many Muslim scholars and scientists (e.g. Nidhal Guessoum, Hamza Tzortzis) warn against "scientific miracle" (i'jaz 'ilmi) claims. Science changes, every tradition can find such matches, and forcing modern theory onto a verse skips tafsir method. So:
- Never say the Quran "predicted" or "proved" a modern finding. Say what the verse says, what science says, and let the viewer reflect.
- Check whether the meaning was known before (Greek, Indian or classical Arab sources). If it was, say so.
- State what the claim is NOT, or where scholars differ. This builds trust. Say it in the topic's own words, where it naturally belongs in the explanation, never as a stock line (no fixed "Lekin main honest rahunga").
- A fiqh ruling or a disputed matter goes to the creator with a note to check it with a qualified scholar.
- History visuals: never depict the Prophets or the Companions; never present an AI-generated person or place as real; no film stills. Use maps, manuscripts, archival photos and real places (visual-sourcing rules), and tag any reconstruction `RECONSTRUCTION`.

Research process: search broadly first (several queries in one turn; `/deep-research` for a big topic), read the primary pages, never cite a page you did not open, and note the access date.

## 3. The script

**Length:** 45–60 s including the CTA. The creator speaks about 3.3 Hinglish words a second (measured: 275 words in 79 s, 146 words in 49 s), so 150–200 words.

**Clarity first (creator, 2026-11-09).** Viewers of the flat-earth reel commented that the concept was not clear: it packed two claims, two Arabic words, a nest-vs-egg detail and a scholar's quote into 70 s. A human scriptwriter picks ONE idea per reel and makes sure it lands. Before writing, state that idea in one sentence a 15-year-old could repeat to a friend. Explain it with one concrete picture or analogy (map vs globe, chadar bichhana), build it step by step, and cut every fact that does not serve it, however true or interesting (park it in research.md for another reel). Read the draft as a viewer who knows nothing: at each line, would they still follow?

**No template.** Each script gets the structure its topic needs: a story told in order, a question chased to its answer, a mistake taken apart, a demonstration. Do not reuse lines or scaffolding across reels. Before handing over, compare the draft with the last three `projects/*/script.txt` and remove any repeated stock phrase, opener or transition ("Maine khud check kiya/gina", "Sach bataun", "Lekin main honest rahunga", "Ab … wala", the same CTA wording). The caveat and the scholarly difference still have to be there, said in the words of this topic, at the point where they matter.

**Controversy check.** The creator found the moon-split topic too controversial (2026-11-09). Avoid topics whose check would seem to question a core belief, a miracle reported in sahih hadith, or a living community's cherished story; prefer claims where the honest answer clarifies rather than unsettles.

**What every script needs (in whatever order and words fit the topic):**
- Hook, 0–5 s, spoken on camera: the creator is on screen from the first frame for at least 2–3 s, with the hook's B-roll and motion graphics beside them (split, circle over a visual, or footage and cards around them); after that each scene's layout is chosen for the reel. One surprising, concrete line; the picture shows it. No "Kya aap jaante hain", no greeting, no "aaj hum baat karenge". Put the key word (the number, the name, the contradiction) in the first 4–5 spoken words so it lands inside 1.5 s ("365 baar? Galat." not "Quran mein din ka lafz poore 365 baar…"). Plan the hook's visuals with the line: a visible change at least every 1.5 s to 6 s, and frame 0 strong enough to be the thumbnail (QUALITY.md §1, strict).
- A question the viewer now needs answered.
- The one idea, explained so it is understood, each step shown on screen.
- The caveat: what this does not prove, or what scholars differ on, in the topic's own words.
- A payoff that lands, ideally turning back on the hook, and a short quotable last line held 2 s.
- CTA, one line under 3 s, after the last line: tied to this topic and worded fresh for it, never a generic "like, share, subscribe". Reels go to Instagram and Facebook only for now, so the CTA asks for a follow.

**Comment ask:** pick one specific question about the topic that a viewer can answer in a few words, and place it as on-screen text (with the comment icon) at a mid-video CTA or the end card.

**Mid-video CTAs:** mark 1–2 spots in `beats.md` for a small follow/subscribe or like/comment animation, 2–3 s each, at a calm moment after a mini-payoff (about 40–60% in). Never during the hook or the payoff.

**Voice.** Learn it from `projects/*/script.txt`: talk to one friend ("tum", "Ab ek kaam karo"); sentences of 5–12 words; Hindi grammar with natural English words (orbit, speed, fingerprints); an Arabic term stays and gets its meaning beside it; `*word*` marks spoken emphasis. Avoid: "Kya aap jaante hain", "Aaiye jaante hain", "doston", "dosto aaj ki video mein", "shocking", "you won't believe", stacked adjectives, rhetorical triplets, and any line that sounds like a translation from English.

**Numbers and names:** say them the way a person speaks them ("lagbhag 23 crore saal"), and every number matches the ledger.

## 4. Deliverables

- `projects/<clip>/research.md`: sources and claim ledger.
- `projects/<clip>/script.txt`: spoken lines only, one sentence per line, `*emphasis*` marked. This file is the caption spelling source, so it must be exactly what the creator will say. The CTA line is the last line.
- `projects/<clip>/plan_options.json`, then `.venv\Scripts\python scripts/make_plan.py <clip>` → `projects/<clip>/plan.html`. The creator plans the edit, Claude builds it: for every script line offer 2–4 visual options (3 for hook lines, each a storyboard to 6 s), your pick first, each with layout, what moves, on-screen English, claim tag, sound and why. Draw them from `references/LIBRARY.md` and its breakdowns, pointing `ref` at a reference picture where one shows the idea. The creator picks in the browser and pastes "Copy choices" back; their picks and notes decide `beats.md`. Do not build graphics before the choices come back.
- `projects/<clip>/beats.md`, written from the creator's choices: one row per line: time, line, visual and layout (speaker-led hook, split, circle, speaker, full-screen graphic, B-roll), on-screen English text, claim tag, the sound, and the asset with its source and licence. CTA rows (mid-video and end) say which animation plays (follow, or like and comment).
- `projects/<clip>/credits.txt`: every source and asset.

Then self-review before handing over:
- Read the script aloud in your head at 3.3 words a second. Fix any line that is hard to say.
- Check each line against the ledger: no claim without a row, no label stronger than its evidence.
- Ask: is this something only this channel would say? If a generic channel could post it, sharpen the angle.

The creator rehearses it aloud and confirms it before shooting. Any change they make while speaking goes back into `script.txt` before captions are made.
