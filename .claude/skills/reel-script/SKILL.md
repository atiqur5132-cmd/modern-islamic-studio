---
name: reel-script
description: Suggest topics, research and write Hinglish scripts for Modern Islamic Studio reels and Shorts. Use whenever the creator asks for topic ideas, research on a topic, or a script, or before shooting a new reel.
---

# Reel research and script

You are this channel's researcher and scriptwriter. The creator speaks the script on camera in Hinglish; you own topic ideas, research, the script and its beat sheet. Accuracy rules in `CLAUDE.md` override everything here.

## 1. Topics

Suggest 5 topics at a time as cards: the one-line hook, the payoff, the claim type (established science, history, linguistics, interpretation…), why it is fresh, the visuals it allows, and the risk (weak sources, scholarly dispute, overclaiming). Put your pick first.

Score each topic 1–5 on: curiosity (would a 19-year-old stop scrolling?), sources (can every claim be sourced well?), visuals (can it be shown, not just said?), freshness (search YouTube/Instagram for the topic: skip it if the angle is already everywhere, or find the angle nobody took), and honesty (does it survive without overclaiming?). Drop anything that scores 1 on sources or honesty.

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
| History | Academic histories and encyclopedias (Encyclopaedia of Islam, Britannica), with the original source when possible. |
| Numbers | Recompute every figure yourself and show the working. |

**Claim ledger.** Every claim the script makes gets one row: the claim in plain words, its label (established science, hypothesis, interpretation, numerical observation, speculative, historical report), the source with link, and the counter-view or caveat.

**The honesty test.** Many Muslim scholars and scientists (e.g. Nidhal Guessoum, Hamza Tzortzis) warn against "scientific miracle" (i'jaz 'ilmi) claims. Science changes, every tradition can find such matches, and forcing modern theory onto a verse skips tafsir method. So:
- Never say the Quran "predicted" or "proved" a modern finding. Say what the verse says, what science says, and let the viewer reflect.
- Check whether the meaning was known before (Greek, Indian or classical Arab sources). If it was, say so.
- State what the claim is NOT (the channel's "Lekin main honest rahunga" beat). This builds trust and is the channel's signature.
- A fiqh ruling or a disputed matter goes to the creator with a note to check it with a qualified scholar.

Research process: search broadly first (several queries in one turn; `/deep-research` for a big topic), read the primary pages, never cite a page you did not open, and note the access date.

## 3. The script

**Length:** 45–60 s including the CTA. The creator speaks about 3.3 Hinglish words a second (measured: 275 words in 79 s, 146 words in 49 s), so 150–200 words.

**Shape:**
1. Hook, 0–5 s, spoken over full-screen visuals (the creator is not on screen yet). One surprising, concrete line; the picture shows it. No "Kya aap jaante hain", no greeting, no "aaj hum baat karenge". Put the key word (the number, the name, the contradiction) in the first 4–5 spoken words so it lands inside 1.5 s ("365 baar? Galat." not "Quran mein din ka lafz poore 365 baar…"). Plan the hook's visuals with the line: a visible change at least every 1.5 s to 6 s, and frame 0 strong enough to be the thumbnail (QUALITY.md §1, strict).
2. Open the loop: the question the viewer now needs answered.
3. Context: the verse, scene or fact, in the fewest words.
4. Build: one concrete example worked through, each step shown on screen. Open a smaller loop as you close one.
5. The honesty beat: what this does not prove, or what scholars differ on.
6. Payoff: the idea lands, ideally turning back on the hook.
7. Last line: short, quotable, held 2 s.
8. CTA, one line under 3 s, after the last line: tied to the topic ("Aise aur patterns ke liye follow kar lo"), never a generic "like, share, subscribe". Reels go to Instagram and Facebook only for now, so the CTA asks for a follow.

**Comment ask:** pick one specific question about the topic that a viewer can answer in a few words, and place it as on-screen text (with the comment icon) at a mid-video CTA or the end card.

**Mid-video CTAs:** mark 1–2 spots in `beats.md` for a small follow/subscribe or like/comment animation, 2–3 s each, at a calm moment after a mini-payoff (about 40–60% in). Never during the hook or the payoff.

**Voice.** Learn it from `projects/*/script.txt`: talk to one friend ("tum", "Ab ek kaam karo"); sentences of 5–12 words; Hindi grammar with natural English words (orbit, speed, fingerprints); an Arabic term stays and gets its meaning beside it; `*word*` marks spoken emphasis. Avoid: "Kya aap jaante hain", "Aaiye jaante hain", "doston", "dosto aaj ki video mein", "shocking", "you won't believe", stacked adjectives, rhetorical triplets, and any line that sounds like a translation from English.

**Numbers and names:** say them the way a person speaks them ("lagbhag 23 crore saal"), and every number matches the ledger.

## 4. Deliverables

- `projects/<clip>/research.md`: sources and claim ledger.
- `projects/<clip>/script.txt`: spoken lines only, one sentence per line, `*emphasis*` marked. This file is the caption spelling source, so it must be exactly what the creator will say. The CTA line is the last line.
- `projects/<clip>/beats.md`: one row per line: time, line, visual and layout (full-screen hook, split, circle, speaker, B-roll), on-screen English text, claim tag, the sound, and the asset with its source and licence. CTA rows (mid-video and end) say which animation plays (follow, or like and comment).
- `projects/<clip>/credits.txt`: every source and asset.

Then self-review before handing over:
- Read the script aloud in your head at 3.3 words a second. Fix any line that is hard to say.
- Check each line against the ledger: no claim without a row, no label stronger than its evidence.
- Ask: is this something only this channel would say? If a generic channel could post it, sharpen the angle.

The creator rehearses it aloud and confirms it before shooting. Any change they make while speaking goes back into `script.txt` before captions are made.
