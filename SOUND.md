# Sound

The studio's sound standard. It applies to every reel, together with `QUALITY.md` §6. Read
it when writing `beats.md` and again before the final render. Spoken words carry these
reels, so sound has one job: make each change on screen feel physical and keep the
viewer inside the story, without ever competing with the voice.

## 1. What we never use

- **No music:** no melody, no instruments, no beat or loop, and no "Islamic background"
  tracks with instruments.
- **No pitched chords or notes** that read as music. A single tone inside an effect (the
  body of a tick or a hit) is fine; a chord is not. For this reason `shimmer` (four notes,
  A–E–A–C) is retired for new reels.
- **Vocal-only nasheed or humming** only when the creator approves it for that reel, with
  clean voices and no processing that makes the voice sound like an instrument. Scholars
  differ on vocals and on the daff, so the creator decides.
- **Nothing over the Quran.** No effect, bed or swell under or over a recitation or an Ayah
  being read; the bed fades out 10 frames before and comes back 10 frames after. The same
  applies to the azaan.
- **No bells and no horns,** even when the story is about one. Sahih Muslim 2114: "the bell
  is the musical instrument of Satan" (الْجَرَسُ مَزَامِيرُ الشَّيْطَانِ), opened on
  sunnah.com 2026-11-18. Show the object and give it a foley sound instead (set down on
  wood, a cloth thrown over it, a clapper caught by a hand).
- **No clichés:** no record scratch, "vine boom", laugh track, airhorn, "bruh", cash
  register or cartoon boing. The channel is premium and calm (`STYLE.md`).

## 2. The palette

Every sound in a reel comes from one of these families. Files live in `public/sfx/`
(shared library) or `projects/<clip>/sfx/` (sounds only that story needs, such as a bell).

| Family | Use it for | Files | Level vs. voice | Rule |
| --- | --- | --- | --- | --- |
| **Room tone** | Under the whole reel, so the cuts never drop to digital silence | `bed-room` | −30 to −35 dB | Always on except under Quran, azaan, and the payoff's silent beat |
| **Ambience** | The scene's world: night, wind, morning, rain, a distant city, a desert | `amb-night`, `amb-wind` (desert wind), `amb-morning`, `amb-rain`, `amb-city` | −22 to −28 dB | One at a time, crossfaded over 15 frames; it changes when the place changes |
| **Transition** | A graphic or B-roll sliding in or out, a whip | `whoosh`, `whoosh-2`, `whoosh-3` | −14 to −18 dB | The peak sits on the cut; never on every cut |
| **Interface** | Text appearing, a chip or label landing, the follow tap | `tick`, `tick-soft-1/2/3` | −18 to −22 dB | Small and dry; rotate the three takes |
| **Foley** | Real objects: paper cards, torn edges, the hand-drawn ring, a page, a map unrolling | `paper-slide-1/2`, `paper-tear-1/2`, `pen-circle-1/2/3`, `page-turn-1/2`, `map-unroll`, `cloth` | −14 to −20 dB | The look already uses paper and ink, so the paper should be heard |
| **Emphasis** | A number or verdict landing; the reel's one big moment | `impact`, `sub-hit` | −10 to −14 dB | At most 3 impacts and 1 sub-hit per reel |
| **Build** | Leading into the payoff only | `riser` | −16 to −20 dB | Once per reel at most; it stops dead on the hit or on a silence |
| **Story** | Sounds the script talks about (footsteps, a door, birds over Madinah; never a bell or horn, see §1) | `projects/<clip>/sfx/` | Like foley | Only when the line names or shows it |

"Level vs. voice" is the effect's peak below the voice's peaks in the same passage. When an
effect falls between words it can come up to −8 dB; when it overlaps a word it stays at the
low end of its range.

## 3. How we place sounds (spotting)

1. **A sound needs a cause.** Every effect matches something the viewer sees or hears named.
   No cause, no sound.
2. **Sync:** hits land one frame after their picture; a whoosh peaks on the cut, so it
   starts 6–10 frames early (`src/timeline/sfx.ts` does this).
3. **Frame 0 has sound:** the voice, or a story or emphasis sound, from the first frame
   (QUALITY.md §1).
4. **Density:** about one effect every 2–3 s on average. The hook can be denser (a change
   every 1.5 s); the explanation calms down. If two sounds fall within 4 frames, keep the
   stronger one.
5. **Silence is a tool.** Pull the bed out 6–10 frames before the payoff line, and let the
   line land in near silence. Professionals make the biggest moment the quietest.
6. **The voice wins.** Beds duck 6 dB while the voice speaks and recover over 10 frames in
   the pauses. Cut 2–4 kHz on any effect that overlaps a word.
7. **Variation:** a repeated action rotates two or three takes, and never uses the same
   file twice in a row.
8. **Phone first:** everything is mono-safe, beds are high-passed at 80 Hz, and only the
   sub-hit goes lower. Check the mix on a phone speaker before upload.
9. **Fades:** beds fade in and out over at least 10 frames, and effects are trimmed so none
   ends with a click.
10. **CTA:** the follow tap and the heart get a soft tick each; the end card adds nothing
    more.

## 4. The sound map

`beats.md` has a **Sound** column. For each line it lists the bed, the effects and their
cause, for example `amb-night → whoosh-2 on card in → paper-slide → tick-soft-1 on "bell"`.
The cues go into `edit.json` overlays as `sounds: [{at, sound, volume}]`, timed on the
source footage like every other overlay, so a re-edit never moves a sound off its picture.

## 5. Files and licences

- **Format:** 48 kHz WAV, mono, peak at −3 dBFS, silence trimmed, 2–5 ms fades at both ends.
  Name files `family-what-take.wav` (`paper-slide-2.wav`). Add each file's length to
  `SOUND_SECONDS` in `src/timeline/sfx.ts`.
- **What may be committed:** this repo is public. Commit only sounds we made
  (`scripts/make_sfx.py`, or recorded by the creator) or files under CC0 (for example
  Freesound files marked CC0). Pixabay's licence forbids sharing its files as standalone
  files, so Pixabay sounds stay out of git and reach the GitHub render through the draft
  release, like footage.
- **Every outside file** gets a row in `public/sfx/CREDITS.md`: file, source page, author,
  licence, date checked. A reel's own sounds go in its `credits.txt`.
- **Azaan and recitation** come from a recording with a clear licence (for example
  Wikimedia Commons, with its licence noted), or from the creator's own recording made with
  the mu'adhdhin's permission. Never use a clip taken from someone's video.

## 6. Before the final render

- [ ] Every effect in the sound map has a cause on screen.
- [ ] No music, no chord, and nothing over the Quran or the azaan.
- [ ] At most 3 impacts, 1 sub-hit and 1 riser.
- [ ] The payoff has its quiet beat.
- [ ] Every outside file is in `CREDITS.md` with its licence.
- [ ] `scripts/finalize.py` passes: −14 LUFS ±1, true peak at or under −1 dBTP.
- [ ] Listened to on a phone speaker: the voice is clear and nothing is harsh.
