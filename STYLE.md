# Editor's style guide

How on-screen text, themes and captions look in new reels. Set by the creator on
2026-11-10 after the Qibla quote card read as "AI template": every frame should look like a
senior human editor made it. Earlier reels stay as they are. QUALITY.md §4–5 point here.

## The editor's question

Before any text goes on screen, ask: would a senior editor at a good documentary channel
put this here, like this? Show the real thing first (photo, scan, footage, map). Type only
what the picture cannot say. One idea per screen.

## Template tells we never use

- Tracked all-caps eyebrow labels with a square bullet ("■ HISTORICAL RECORD").
- UI cards: a rounded box with a drop shadow holding a label, a heading and a grey line.
- Tilted rubber stamps ("WRONG WAY?", "?"), red crosses and ticks as decoration.
- The same frame and layout on every graphic; everything centred.
- Whole sentences or paragraphs set in heavy black sans; tiny grey source text tacked on.
- Glows, gradients, neon, emoji, particles, lens flares.
- Title Case or ALL CAPS sentences; stock words ("SHOCKING", "FACT", "DID YOU KNOW").
- Sticker captions: thick black outline, coloured pill behind the spoken word.

## What an editor does instead

- **Real artifact first.** A newspaper scan, manuscript page or document with a usable
  licence goes on screen itself, cropped tight on the line, with the words marked as they
  are spoken. Never make a fake artifact. When none exists, set the words as type (a pull
  quote) and say where they come from.
- **One phrase big, the rest supporting.** The words the viewer must remember are the
  largest thing on screen; the attribution is small and on one line.
- **Type sits on the page or the picture, not in a box.** Left-aligned on a margin,
  balanced against the speaker's circle or half of the frame.
- **Credit like a documentary.** "— Passers-by, 1953" then "Historical record · The
  Washington Daily News, 15 April 1953". The claim tag CLAUDE.md asks for lives in this
  credit line, in sentence case.
- **Marks with meaning.** A highlighter sweep, an underline drawn in, a ring, landing on the
  spoken word. Not decoration.
- **Typesetting details.** Balanced lines (no lone word on the last line), hanging quote
  marks, curly quotes, a real ellipsis, proper dashes.
- **Calm motion.** Arrivals of 14–20 frames, eased out, no bounce or overshoot; one slow
  drift on held frames; exits about half as long as arrivals.

Built example: `pullquote` (`src/overlays/PullQuote.tsx`): serif quote beside the speaker's
circle, hung opening mark, the key phrase marked when spoken, one credit line.

## Theme: premium and relaxing, chosen per reel

Each reel's look is written in `beats.md` as numbers before building:

- **Ground:** never pure white or black. A light ground has a tint taken from the subject
  (paper, sand, stone, linen); a dark one is a deep colour (ink, night, deep green).
- **Ink:** a dark colour from the same family, never #000.
- **One accent:** medium saturation, one meaning for the whole reel.
- **Low saturation overall;** footage graded to sit with the ground.
- **Space:** side margins of at least 90 px; at most one text block on screen besides the
  captions; empty space is allowed.
- **Texture:** fine grain only.
- **Sound:** soft cues; not a whoosh on every cut (QUALITY.md §6).

Starting points, not templates: chart paper, navy and orange (Qibla); sand, umber and teal
for desert history; linen, ink and green for Quranic words; night, ivory and gold for
astronomy. Do not reuse the previous reel's palette.

## Type

The kit (`src/fonts.ts`, all free Google fonts, SIL OFL):

| Role | Faces |
| --- | --- |
| Sans: spoken words, labels, credits | Inter Tight, Plus Jakarta Sans, Bricolage Grotesque |
| Serif: quotes, emphasis, considered titles | Instrument Serif, Newsreader, Fraunces (italic) |
| Condensed: "punch" captions only | Anton |

A reel uses one sans and at most one serif, plus a numbers face when it counts things.
Nothing meant to be read is under 28 px; a pull quote is about 90–110 px.

## Captions

**What the research found (November 2026).** Caption tools and their guides (Submagic,
OpusClip, OpenClip, Blitzcut) still recommend a bold sans, 3–5 words per group, white with
one accent colour and a word-level highlight; the Hormozi style (now Anton, formerly
TheBoldFont) is still the most common for education. They discourage serif for running
captions but use it for mood and emphasis. All of these are vendor opinions, without
published data. Our reference library (`references/LIBRARY.md`) is better evidence for our
niche: Towards Eternity keeps captions small and quiet and lets the picture work; Aashqeen
Plus and yevorqq drop the caption track and set only the key word, big.

**So a new reel picks one of three looks** (`captionStyle`, with fonts in `captionDesign`),
and names it in `beats.md`:

| Look | When | How it looks |
| --- | --- | --- |
| `editorial` (default: used when `captionStyle` is left out) | most reels | Sentence case in the reel's sans, ~68 px, soft shadow instead of an outline. Words not yet said wait at half strength and light up as spoken. `*emphasis*` words switch to the serif italic, 1.28× larger. Over footage everything is warm white; on a light page graphic the words take the reel's ink and the emphasis takes the accent. |
| `punch` | Viral Claim Check energy | Anton caps, ~100 px, a thin outline plus soft shadow, the emphasis word in the accent, the spoken word grows 5%. |
| `quiet` | picture-led story reels | ~54 px sentence case, no highlight; emphasis only by the serif italic. |

The older looks (`pill`, `highlight`, `ledger`) are kept for the earlier reels only.
Captions still never repeat words a graphic already shows, hide where a graphic is the hero,
and move with the layout (QUALITY.md §4). Hook lines may drop the caption track for words
placed beside the speaker (key word big, the rest small), as in the yevorqq reference.

Sources: [Submagic on Hormozi captions](https://www.submagic.co/blog/how-to-make-alex-hormozi-captions),
[OpusClip caption design](https://www.opus.pro/blog/video-caption-design-placement),
[OpenClip styling guide](https://openclip.app/guides/caption-styling-guide),
[Blitzcut: professional captions](https://blitzcutai.com/blog/how-to-make-captions-look-professional),
[Blitzcut: caption fonts 2026](https://blitzcutai.com/blog/best-caption-fonts-reels-2026),
[FluxNote subtitle styles](https://fluxnote.io/guides/faceless-video-subtitle-styles-guide).
