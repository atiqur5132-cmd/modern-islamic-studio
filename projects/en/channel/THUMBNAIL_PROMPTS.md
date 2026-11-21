# The Rich Rules — thumbnail identity and prompt system

The creator makes thumbnails in an image AI (creator's choice, 2026-11-21); Claude writes every
prompt. The goal is **recognition**: anyone scrolling should know it's a Rich Rules thumbnail
before reading a word. That comes from five things never changing, and only the object and the
words changing per video. The rest of the craft rules live in `THUMBNAILS.md`.

## The five fixed signatures (never change without the creator)

1. **The teal studio.** The same smooth, spotlit deep-teal background every time
   (`#2a625a` centre → `#0c2321` edges), no texture, no scenery.
2. **Gold hero object.** The main object is always made of, or trimmed in, **brushed champagne
   gold** metal, shot like a luxury product photo. (The gold card is the channel's mascot object;
   it can return, but the material is the signature.)
3. **The same light.** Warm key light from the upper left, teal rim light from behind, soft floor
   shadow.
4. **The same type and layout.** Huge Anton-style condensed capitals on the **left 40%**, 2–4
   words, white with **one key word in yellow `#ffd23f`**, soft shadow, no outline. Object on the
   right. Bottom-right corner empty.
5. **The red verdict mark.** At most one red element (`#a50f08`), and only as an object that gives
   the verdict: a rubber stamp, a total, a price, a warning tag. Red never on the background or the
   headline.

## Brand style block v1 (paste at the end of every prompt, word for word)

```
Style: The Rich Rules thumbnail style. Photorealistic 3D product render, luxury product photography. The main object is made of brushed champagne-gold metal. Lighting: warm key light from the upper left, teal rim light from behind, soft realistic floor shadow, shallow depth of field. Background: smooth spotlit deep teal (#2a625a in the centre fading to #0c2321 at the edges), no texture, no pattern, no scenery. Layout: 16:9 YouTube thumbnail, 1280x720; the object on the right 55% of the frame; huge bold condensed sans-serif capital letters (like the Anton font) on the left 40%, white with one word in bright yellow (#ffd23f), soft dark drop shadow, no outline; the text never overlaps the object; the bottom-right corner is empty. At most one red (#a50f08) element, only on an object (a stamp, a price, a total). High contrast, crisp, minimal, one focal point. No people, no faces, no hands, no logos, no brand names, no card-network marks, no watermark, no extra text.
```

## Prompt template (Claude fills the brackets per video)

```
[HERO]: A [object], made of glossy brushed champagne-gold metal, [pose/angle], on the right side of the frame.
[TENSION]: [one prop that tells the story, e.g. hanging on a fishing hook / wearing a stamped tag / cracked in half / on a scale].
[VERDICT, optional]: [the one red element, e.g. a red rubber stamp reading "X"].
[WORDS]: On the left, on [2–3] lines: "[LINE 1]" and "[LINE 2]" in white, "[KEY WORD]" in bright yellow (#ffd23f).
[brand style block v1]
```

How Claude writes one for a new video:
1. Promise in one sentence (what the viewer gets).
2. Three concepts, each a different reason to click (anger, doubt, fear of cost, surprise).
3. One gold hero object per concept + one tension prop; never two stories.
4. 2–4 words that don't repeat the title.
5. Fill the template, add the style block word for word, and add the matching title.

## Keep it consistent in the image AI

- **The anchor image** is `projects/en/channel/anchor_thumbnail.jpg`: the creator's favourite
  AI-made thumbnail. The first video ("Deadbeats") is generated without a reference; its best
  result becomes the anchor. From then on, attach the anchor with every prompt:
  - ChatGPT image / Gemini: upload it and start the prompt with "Match the exact style,
    background, lighting, colours and typography of the attached thumbnail."
  - Midjourney: use it as a style reference (`--sref <image URL>`) and add `--ar 16:9`.
  - Ideogram: use it as a style reference ("Remix"/style upload).
- When a thumbnail wins a Test & Compare, it can become the new anchor, but only with the
  creator's OK.
- Text: if the AI misspells, regenerate without words ("leave the left 40% empty teal") and add the
  words in Canva: Anton, white + `#ffd23f`, soft shadow.

## Check before upload (every thumbnail)

- [ ] Teal studio, gold object, same light: it sits next to the previous thumbnails like a set
- [ ] Words spelled right, Anton-like, white + one yellow word, left 40%
- [ ] Readable at 168×94 px
- [ ] Black-and-white: yellow word doesn't melt into the gold object
- [ ] No faces, logos, card brands, stray text; bottom-right empty
- [ ] Words don't repeat the title

## Example: "Deadbeats" (card rewards)

Prompts for the three concepts are in `projects/en/card-rewards/thumb_prompts.md`.
