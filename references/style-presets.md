# Style presets

A preset is a complete look with a name. It sets the palette, type, easing and springs, how text enters and leaves, transitions, pacing, texture and a few signature moves. Someone can say "make it in the Fast Concept style" instead of describing a look in words.

In code, set `PRESET` in `src/theme.ts`. Every token in `src/presets.ts` (colours, fonts, springs, easing, word timing, exit fade and push, grain, HUD, block style, seconds per beat, device finish) then flows into the scenes and visuals. Swap the preset's placeholder `brand`, `brandDeep`, `brandLight` and `brandSoft` for the product's own colours. The template already builds the shared moves (word build, accent word, HUD, card proof, whip and rise blocks, push).

Each preset also has a **signature scene** in the template, a full-frame Remotion component in plain React, SVG and CSS that shows its one strong move. They live in `src/visuals/` and are listed in `src/visuals/signatures.tsx`. The default storyboard plays the active preset's signature for one beat, the `Signature` composition plays it alone, `Sample` plays it at 6 s, and the Catalog ends with all nine. Every surface, device and chrome element reads the preset tokens (`UI` and `DEVICE` in `theme.ts`), so dark presets get dark cards, windows and a graphite laptop. Build the remaining moves per video from the recipes below.

## Rules for every preset
- **One preset per video, plus at most one borrowed move** from another preset (for example one Slot Counter inside a Clean Launch video). The borrowed move takes the host preset's palette and type.
- **At most one depth moment per video** (a depth cloud, an isometric build or a card fan). A gentle device tilt doesn't count. No 3D library; every move here is plain Remotion (DOM, CSS transforms, SVG).
- **Few techniques, used with restraint.** If an effect doesn't explain the product, cut it. No showy or forced effects.
- **One music track from the first frame to the last.** Cut the picture to the track's own beats, breaks and hits. Don't bend the music to every cut, don't add silent dips, and don't change tracks between scenes.
- **Render a 6 s sample in the chosen preset before the full build**, and get a yes on it. Each preset below says what its sample should show.

## How to pick

| The video is | Pick | Why |
|---|---|---|
| A polished launch with voiceover and real screens, 45 to 75 s | **Clean Launch** | Calm and clear; every claim gets a UI proof |
| A fast feature or concept cut for social, music only, 40 to 55 s | **Fast Concept** | Same clarity at about 4 s a beat, with two hard blocks for energy |
| A teaser, cold open, date announcement or closing call to action, under 20 s | **Kinetic Type** | Pure rhythm and type; carries energy, not information |
| An "everything in one place" overview, a suite or a roundup | **Bento Product** | Many small live features in one tidy frame |
| Results, analytics, a milestone or a report | **Data Story** | Numbers that read, told one at a time |
| How it works, integrations, an API, a data flow | **System Diagram** | The product as a diagram that draws itself |
| An idea or concept explainer for the LinkedIn or X feed, 4:5 | **Night Signal Explainer** | Dark, focused, one idea per screen |
| A calm human story, a fresh start, a consumer or wellbeing product | **Paper Cut** | Warm and slow; a breather, not a pitch |
| Only when the product already has a character (a mascot, an agent's avatar, an app icon with a face), 15 to 30 s for social | **Mascot Carry** | One friendly thread through every scene; each feature gets one small native proof |

If two fit, ask which feeling matters more (calm or energy, product UI or ideas) and recommend one.

Mascot Carry is an optional mode, not a default. A product with a character can still use any other preset; the character then appears as that preset's one borrowed move (Character Carry for the transitions, or an Inline Glyph in one headline). Without a character, ignore it.

## Shared moves (recipes)
Presets name these moves. Values are for 1920×1080 at 30 fps; Remotion `spring()` configs use mass 1 unless given.

- **Word build** (template `Headline`). Each word sits in an `overflow: hidden` mask and rises from 105% with a blur that clears, on ease-out-expo `(0.16, 1, 0.3, 1)`, starting at the word's voiceover time (or every 0.3 to 0.4 s without voice). Lines leave by sliding up out of their masks over 0.35 s.
- **Accent word.** One word per headline (usually the last meaningful one) in the accent style, either the italic serif at 1.14em in the brand colour or the brand colour alone. Optional hand-drawn underline drawn with `strokeDashoffset`, starting 0.25 s after the word lands and taking 0.7 s.
- **HUD** (template `Hud`). A mono scene label top-left at 50% ink that decodes glyph by glyph on each cut, the product name and a running timecode top-right.
- **Card proof.** One real UI card per scene on the headline's left edge (white, 1 px hairline, three-layer soft shadow). It rises on one spring and holds while its content proves the claim (a chart builds, a list fills, a message lands).
- **Push.** Scale 1.00 to 1.03 to 1.06 across a scene on in-out cubic `(0.65, 0, 0.35, 1)`. Exit with a short fade plus a few percent more push; the next card rises.
- **Whip block.** A colour block slides in from the right with an 8 to 12° skew and motion blur, starting about 0.4 s early so it covers the frame exactly on the beat.
- **Rise block.** A colour block slides up from the bottom over 0.4 to 0.5 s on in-out cubic.
- **Kinetic Slam.** One huge word per beat (Inter Tight 900, 300 to 420 px, tracking -0.045em). Scale lands from 2.5 to 1 on a stiff spring (`{ stiffness: 310, damping: 24 }`) started one frame early so it settles on the beat. Letters pop with a 45 ms stagger (`{ stiffness: 267, damping: 20 }`). A camera shake under 6 px decays over 0.25 s. The background hard-cuts between ink, paper and brand on each word. Motion blur (10 to 16 samples) only while the scale is moving. End on a short line whose last word takes the brand colour and holds with a 4.5% push.
- **Mask Wipe.** A shape already on screen becomes the transition. The full stop of a word grows into a circle iris (`clip-path: circle()`), pill bars rise with a 40 ms stagger, or a diamond sweeps in from a corner. Each runs about 0.4 s on the snap curve `(0.87, 0, 0.13, 1)`. The last wipe can land the logo lockup.
- **Bento Snap.** Six to eight small cards (area chart, stat, toggle, chat, donut, bars, integration icons, an input field) fly into a grid from different directions (slide, drop, flip up to 90°), staggered 60 to 90 ms on a soft spring (`{ stiffness: 57, damping: 11 }`). The camera settles over 1.9 s from scale 0.84 and a 10 to 15° tilt to flat. Once seated, each card comes alive on a stiffer pop (`{ stiffness: 191, damping: 15 }`). The chart reveals, the toggle flips, the chat answers, the input types and sends. Then a slow 3.5% push. Motion blur only during the fly-in.
- **Card Fan.** Five stacked cards fan out like a hand around a pivot below the stack (`{ stiffness: 44, damping: 9 }`, 60 ms stagger), the group turns about 40°, gathers back, and the hero card lifts and turns to face the camera (`{ stiffness: 36, damping: 9 }`). Use one shared depth value so the draw order never flips. This is a depth moment.
- **Chart Morph.** One dataset told several ways. Bars grow (`{ stiffness: 101, damping: 16 }`, 70 ms stagger), collapse into dots, a line threads the dots, the line curls into a ring, the ring splits into proportional slices, and the slices merge into a thin ring around one big figure. Each stage takes 0.6 to 1 s on in-out cubic. Sweep colours on with dash reveals instead of blending them.
- **Slot Counter.** A big odometer counts up on an exponential curve, adding a column at each power of ten. Reels lock right to left on a spring (`{ stiffness: 288, damping: 21 }`) and roll over to the milestone on an impact the music already has, then a small mono label appears. Blur fast reels vertically by their speed, capped near 13 px so digits still read on a phone.
- **Line Draw.** A diagram draws itself stroke by stroke (`strokeDashoffset` over exact path lengths, 0.45 to 0.6 s each, in-out cubic, 60 to 120 ms apart). Sources sit left, the product hub centre, outputs right, joined by rounded right-angle routes. Then comet pulses (a bright head with a tail about 15% of the path) run from sources to hub to outputs. The hub pops when they arrive (`{ stiffness: 227, damping: 14 }`) and the outputs light up one by one.
- **Iso Build.** An isometric platform rises, then cubes drop with a small squash into a skyline (orthographic projection in SVG, faces sorted back to front and shaded from one light direction) on a slow turntable. A brand-colour keystone lands last and sends a ripple through. This is a depth moment.
- **Paper Parallax.** Five or six layered SVG hill silhouettes from light to dark, each with paper-grain turbulence and a soft drop shadow, moving at depth-scaled speeds during a slow 4 to 6% push. A sun rises with soft halo rings; a few birds or a cloud drift.
- **Painted underline and glow.** A stroke under the accent phrase drawn on with `feTurbulence` plus `feDisplacementMap` for a painted edge, with a soft glow of the same colour (8 to 16 px blur, 25 to 40% opacity).

- **Character Carry** (template `CharacterCarry`). One element, usually the product's character, never cuts away. It is the transition: at the end of each beat it hops into a slot the next scene already has (the caller's avatar in a phone's call pill, the sender's avatar in a chat, the active row of an app sidebar, the logo spot of the end lockup). The hop is an arc of 0.4 to 0.6 s on in-out cubic, with a squash before take-off and on landing; the character scales to the slot's size on the way and the slot's placeholder fades as it lands. Plan the slots in the storyboard: every scene needs one.
- **Inline Glyph** (template `CharacterCarry`). An image stands in for a word inside the headline ("Meet your [avatar] assistant"). Leave its gap in the line, build the words around it, then drop the glyph in last with a pop at 1.1 to 1.3 times the cap height. For the next line the glyph leaves the sentence and the words close up behind it.
- **Chip Unfold** (recipe only). A pill grows from zero width between two words and pushes them apart (animate the chip's width on a spring inside a flex row, so the line reflows), then its content arrives: an icon, then a short value typing in. Use it to show the thing the line names ("Arrives [Fri 6 Nov]", "Saved [£1,240]").

Motion blur is `MotionBlur` in `src/lib/kit.tsx`. It renders several time samples of the moving layer and averages them, and its `enabled` test keeps it off held frames. The same file has `springAt` (a closed-form spring that takes any time, so blur samples stay smooth), `ramp`, `route` and `BEAT`. No extra dependency.

---

## 1. Clean Launch (`clean-launch`)
*Calm, confident and editorial. A light canvas, one brand colour, and one real UI card proving each claim.* The template's default.

- **Use it for** flagship product launches, What's new videos, B2B and SaaS tools, anything with a voiceover and real screens. 45 to 75 s at 16:9.
- **Palette** (`brand` is a placeholder)
  ```
  paper #FBFBFD   card #FFFFFF   ink #111318   inkSoft #5B6272   line #E4E7EE   muted #F1F5F9
  brand #4F46E5   brandDeep #3730A3   brandLight #6366F1   brandSoft #EEF2FF   onBrand #FFFFFF
  green #16A34A   amber #F59E0B
  blocks: radial gradient brandLight → brand → brandDeep
  ```
- **Type.** Geist 600 for headlines (96 to 112 px, tracking -0.04em), Geist for body, Geist Mono for the HUD and labels, Instrument Serif italic for the one accent word.
- **Motion.** Springs `soft { damping: 200 }`, `card { mass: 0.6, damping: 14, stiffness: 180 }`, `pop { mass: 0.5, damping: 11, stiffness: 220 }`, `heavy { mass: 1.4, damping: 30, stiffness: 90 }`. Ease-out-expo for entrances, in-out cubic for camera moves and wipes, `(0.7, 0, 0.84, 0)` for exits. Words build in 0.55 s with a 10 px de-blur. Scenes end with a 0.3 s fade and a 5% push. The reveal block whips in; the payoff block rises. The end card opens with an iris from the logo's centre.
- **Pacing.** About 5 to 6 s a beat (4.3 to 8), so roughly 12 scenes in 72 s. Two or three colour blocks; everything else is light.
- **Signature moves.** Word build with one accent word and its underline. The HUD. One card proof per scene. A 3 to 6% push per scene, light grain (7%) and soft shadows.
- **Signature scene.** `HeadlineProof` (`src/visuals/HeadlineProof.tsx`). A headline builds word by word with one italic serif accent and its hand-drawn underline, and one card rises on the headline's left edge to prove it (bars grow, then its sources land one per beat). The template's own Feature beats are this look, so the default storyboard keeps them and swaps nothing.
- **Don't** add particles, glows or 3D (a subtle laptop tilt is the limit), use more than three blocks, put two accent words in one headline, or show cards that only decorate.
- **Visuals that fit.** `ComposerAnswer`, `Notifications`, `Device` with a rebuilt screen, `Steps`, `BeforeAfter`, `StatCountUp`, `Stamp`; `DepthCloud` once as the depth moment.
- **Music.** 100 to 115 BPM, warm modern electronic or pop with a steady pulse. One track, time-stretched a few percent at most so the ending lands. It sits under the voice and dips only to about 70% under the payoff line.
- **6 s sample.** The hook headline building word by word with its accent and underline, the HUD running, then the whip into the brand block with the logo. The first 180 frames of `StyleTest`, or `Sample` for `HeadlineProof` alone.

## 2. Fast Concept (`fast-concept`)
*The Clean Launch grammar at a quicker pace, with two hard black blocks and one kinetic slam.*

- **Use it for** concept videos, feature drops and social launch cuts with music only, 40 to 55 s at 16:9 or 4:5. Teams that want energy without losing clarity.
- **Palette.** Clean Launch's light canvas and tokens, with flat near-black blocks.
  ```
  paper #FBFBFD   card #FFFFFF   ink #111318   inkSoft #5B6272   line #E4E7EE
  brand #4F46E5 (placeholder; accent words, a selected tab, one indicator, the second block of the brand reveal)
  block #0B0B0D   onBrand #FFFFFF
  blocks: flat
  ```
  If the brand colour is itself dark, the blocks can be the brand.
- **Type.** As Clean Launch, plus Inter Tight 900 for the one slam.
- **Motion.** Clean Launch springs, plus `slam { stiffness: 310, damping: 24 }`. Words build in 0.5 s. Scenes exit with a 0.3 s fade and a 6% push. Both blocks enter with a Mask Wipe. The end card is a clean cut on a break in the music. Motion blur only on the block wipes and the slam.
- **Pacing.** About 4 s a beat (3 to 6.8). Exactly two blocks, the reveal and the payoff. Vary the layout between scenes (headline above a window; a stacked headline left with the UI large on the right; a close crop bleeding off the frame) so the faster pace doesn't feel repetitive.
- **Signature moves.** Kinetic Slam on the reveal block only. Slot Counter for any number. Mask Wipes into the two blocks. UI windows bleeding off the frame edge, with a slow focus push on what changes and one new item landing per beat.
- **Signature scene.** `BrandWhip` (`src/visuals/BrandWhip.tsx`), a two-block brand reveal. A near-black block whips in from the right with a skew and real motion blur, covering the frame on the beat while the lockup assembles. Two beats later the brand block rises in pill bars, 40 ms apart, and the tagline builds in half the Clean Launch headline time. It takes the `reveal` beat of the default storyboard.
- **Don't** slam anywhere but the reveal, add a third block, stack an iris on top of the wipes, hold a beat where nothing changes, or set UI text below about 32 px (it has to read on a phone).
- **Visuals that fit.** `ComposerAnswer`, `Notifications`, `Device`, `BeforeAfter`, `StatCountUp` rebuilt as a Slot Counter. `DepthCloud` only as the one depth moment.
- **Music.** 120 to 145 BPM, punchy and drum-forward, with written breaks and impacts. Put cuts and the slam on the track's own breaks and hits (the reveal on the drop). To lengthen a track, repeat a whole bar-aligned section rather than stretching it.
- **6 s sample.** `Sample`, the two-block brand reveal, with the whip landing on the beat and the tagline building on the brand block.

## 3. Kinetic Type (`kinetic-type`)
*Loud, rhythmic and type-only. Huge words hit one per beat with hard colour cuts.*

- **Use it for** teasers, cold opens, event or date announcements, a closing call to action and 6 to 20 s cutdowns. Inside a longer video it is the borrowed move (one slam sequence), never the whole film.
- **Palette.** Three colours on screen, no more.
  ```
  paper #F2EEE6   ink #0E0E0E   inkSoft #5E5A52
  brand #FF4A1C (placeholder signal colour)   onBrand #F2EEE6
  block #0E0E0E   blocks: flat
  ```
- **Type.** Inter Tight 900 at 300 to 420 px, tracking -0.045em, single words in caps. Geist for any small line, Geist Mono for a date or URL. No serif; the accent is colour.
- **Motion.** `slam { stiffness: 310, damping: 24 }` for scale 2.5 to 1, letter `pop { stiffness: 267, damping: 20 }`, the snap curve for wipes. Words enter in 0.24 s and leave on a hard cut. The background hard-cuts between the three colours; no fades. Shake under 6 px that dies within 0.25 s. Motion blur only while scale moves.
- **Pacing.** One word per beat (0.4 to 0.5 s at 120 to 150 BPM), a short stutter recap of the earlier words at double speed, then the final line holds 1.5 to 2.5 s with a 4.5% push. A colour cut on every word.
- **Signature moves.** Kinetic Slam. The stutter recap. The final line with its last word in the brand colour. A Mask Wipe that lands the logo.
- **Signature scene.** `KineticSlam` (`src/visuals/KineticSlam.tsx`). One word per beat lands from 2.5x on the stiff spring, with a shake under 6 px, motion blur only while the scale moves and a hard cut between ink, paper and the brand colour. An optional stutter recap, then the final line, its last word in the brand colour, holds with a 4.5% push. It takes the `payoff` beat, slamming the first sentence and holding the second.
- **Don't** use more than about six slam words, a second typeface, shake that keeps going, slams off the beat, or this style to explain features. It carries energy, not information.
- **Visuals that fit.** None from the catalog; it is type. `Stamp` is the nearest single move, and `StatCountUp` can be the final number.
- **Music.** 120 to 150 BPM with hard transients (kick, claps, stabs) and at least one break before an impact. Slam the words on kicks the track already has and land the final line on its impact.
- **6 s sample.** `Sample`, three words slamming on three beats with colour cuts, the recap, and the final line holding in the brand colour.

## 4. Bento Product (`bento-product`)
*Keynote-style overview. Many small live cards snap into one tidy grid, then each comes alive.*

- **Use it for** "everything in one place" overviews, platform or suite launches, changelog and year-in-review roundups, or a summary beat before or after single-feature scenes. 30 to 60 s.
- **Palette** (`brand` is a placeholder)
  ```
  paper #F8FAFF   card #FFFFFF   ink #171717   inkSoft #5B6475   line #E6ECF8   muted #EEF1F7
  brand #2563EB   brandDeep #1D4ED8   brandLight #3B82F6   brandSoft #DEE9FE   onBrand #FFFFFF
  green #22C55E
  blocks: radial gradient
  ```
- **Type.** Geist 600 with tight tracking (-0.045em) and big tabular numbers in stat cards. Geist Mono for small labels. No serif; the accent is the brand colour.
- **Motion.** Fly-in `card { stiffness: 57, damping: 11 }`, inner `pop { stiffness: 191, damping: 15 }`, a 1.9 s ease-out-expo camera settle, then a 3.5% push. Words build in 0.5 s with an 8 px de-blur. Feature scenes start with a match cut, zooming from one grid card into its full-size version, and can return to the grid. Blocks rise.
- **Pacing.** 4 to 5 s a beat; the bento itself 4.5 to 6 s. One or two blocks.
- **Signature moves.** Bento Snap. The grid-to-card match cut. Every card animating something real. Card Fan as the optional depth moment for templates or use cases.
- **Signature scene.** `BentoSnap` (`src/visuals/BentoSnap.tsx`). Seven cards fly into a 4 by 3 grid from different directions while the camera settles from a 12° tilt, with motion blur only during the fly-in. Once seated each card comes alive (the chart draws, the stat counts, the toggle flips, the chat answers, the input types and sends), then a 3.5% push. It takes the `ask` beat.
- **Don't** use more than eight cards, filler cards with fake controls that never move, the same flip on every card, a second grid later in the video, or heavy grain (keep it near 4%).
- **Visuals that fit.** Pieces of `DashboardMock` as cards, `ComposerAnswer` as the chat card, `Notifications`, `Steps`, `StatCountUp`; `DepthCloud` or a Card Fan as the one depth moment.
- **Music.** 105 to 120 BPM, bright and tidy (plucks, keys, a light groove). Seat the cards on the track's eighth notes and bring each one alive on a beat.
- **6 s sample.** `Sample`, the full Bento Snap with the cards coming alive, then the push.

## 5. Data Story (`data-story`)
*Editorial and precise, like a good newspaper chart. One dataset told several ways, ending on one number.*

- **Use it for** analytics and reporting features, results and case studies, usage milestones, research or report explainers, investor updates. 30 to 60 s at 16:9 or 4:5.
- **Palette** (`brand` is a placeholder)
  ```
  paper #F5F2EC   card #FFFDF8   ink #1B1B1F   inkSoft #6F6A61   line #D9D3C7   muted #ECE7DD
  brand #127C71   brandDeep #0B5A52   brandSoft #D3EDE6   accent2 (amber) #F2B33D   onBrand #F5F2EC
  blocks: flat brand, only for the final number if at all
  ```
- **Type.** Inter Tight 700 for headlines and big numbers (tabular figures, 120 to 160 px). Geist for body. Geist Mono for axes and labels, in caps with wide tracking (0.28em). Newsreader italic for the accent word.
- **Motion.** Bars `card { stiffness: 101, damping: 16 }`, counter locks `pop { stiffness: 288, damping: 21 }`, morph stages on in-out cubic. Words build in 0.55 s. Clean cuts between scenes, with numbers carried across as match cuts (the figure in one scene becomes the headline number of the next).
- **Pacing.** 5 to 8 s a beat, because numbers need reading time. No block, or one for the final number.
- **Signature moves.** Chart Morph. Slot Counter to the milestone. Dotted gridlines drawing on. One number per scene with its unit and a plain-language caption.
- **Signature scene.** `ChartMorph` (`src/visuals/ChartMorph.tsx`). The headline sits in the left column; on the right one dataset grows as bars, collapses into dots, threads into a line, curls into a ring, splits into proportional slices and merges into a thin ring around one big number with a mono caption, one or two beats a stage. It takes the `notify` beat. A Slot Counter stays a recipe below, for a video that needs one.
- **Don't** put more than two numbers on screen at once, use 3D charts, pies with more than five slices, a rainbow palette (brand, amber and ink only), count-ups too fast to read, or any number that isn't real and approved.
- **Visuals that fit.** `StatCountUp`, `ComposerAnswer` with bars, `DashboardMock`, `BeforeAfter` for before and after numbers; an Iso Build as the depth moment for a data stack.
- **Music.** 90 to 110 BPM, minimal and thoughtful (felt piano, a soft pulse, light percussion) with one written impact for the milestone. A steady bed makes reading easy.
- **6 s sample.** `Sample`, the full Chart Morph ending on the headline number and its caption.

## 6. System Diagram (`system-diagram`)
*Clear and technical. The product explained as a diagram that draws itself, then signal flows through it.*

- **Use it for** how-it-works beats, integrations and data flows, developer tools, APIs, infrastructure and security architecture. 30 to 60 s, or one 6 to 8 s beat borrowed into another preset.
- **Palette** (`brand` is a placeholder and the first pulse colour)
  ```
  paper #F7F8FA with a 24 px dot grid at 6% ink   card #FFFFFF   ink #0F172A   inkSoft #64748B   line #D5DBE5
  brand #0284C7   brandSoft #E0F2FE   accent2 (second pulse) #7C3AED   green (done) #16A34A
  block #0F172A   blocks: flat
  ```
  On a dark canvas this becomes Night Signal; use that preset rather than darkening this one.
- **Type.** IBM Plex Sans 600 for headlines (tracking -0.03em), IBM Plex Sans for body, IBM Plex Mono for node labels, ports and code. No serif; the accent is colour.
- **Motion.** Strokes draw on in-out cubic, 0.45 to 0.6 s each. Nodes settle on `card { stiffness: 101, damping: 15 }`; the hub pops on `pop { stiffness: 227, damping: 14 }`. Words build in 0.5 s with a 6 px de-blur. Clean cuts; a detail scene starts by zooming into one node.
- **Pacing.** 6 to 8 s a beat, so the diagram can finish drawing and then be read. No block, or one.
- **Signature moves.** Line Draw. Comet pulses in two colours (in and out). A shockwave ring on the hub. Outputs lighting up one by one with a check.
- **Signature scene.** `LineDraw` (`src/visuals/LineDraw.tsx`). Sources, the product hub and outputs draw themselves stroke by stroke on a dot grid. On beat five a comet pulse runs through, the hub pops with a shockwave ring and the outputs light up one by one with a check. A second pulse in `accent2` runs only when the slot is 5.5 s or longer. It takes the `ask` beat.
- **Don't** use more than about five inputs and three outputs, crossing lines, pulses that run all the time (they are the payoff, once or twice), glow on everything, or labels under 20 px.
- **Visuals that fit.** `DepthCloud` for "and many more" sources, `Steps`, `ComposerAnswer` as a terminal, `BeforeAfter` as a diff, `Device` for the output screen.
- **Music.** 95 to 115 BPM, steady minimal electronic (a pulse, an arpeggio). Strokes draw on the eighth notes and the first pulse arrives on a downbeat the track already has.
- **6 s sample.** `Sample`, four sources, the hub and three outputs drawing in, then the pulses and the outputs lighting up.

## 7. Night Signal Explainer (`night-signal`)
*Dark, focused and quietly glowing. One idea per screen, made for the feed.*

- **Use it for** explaining an idea, a paper, a concept or how a technology works, on LinkedIn and X, or a carousel turned into video. 4:5 (1080×1350), 30 to 50 s, music only; the on-screen text is the caption.
- **Palette** (`brand` is a placeholder signal colour)
  ```
  paper #080A0F   card #0F131B   line #1C222D   muted #151A23
  ink #F2F4F8   inkSoft #A7B0BE
  brand (signal green) #48D597   brandSoft #123326   onBrand #F2F4F8
  accent2 (violet) #8B5CF6, only for hidden, never, wrong and other negative or invisible ideas
  block #8B5CF6   blocks: flat, at most once
  ```
- **Type.** Figtree 700 for headlines (tracking -0.035em), Figtree for body, JetBrains Mono for labels, counters and code. No serif; one phrase per headline in the signal colour.
- **Motion.** Standard springs. Words build fast (0.4 s) so each screen lands within about a second, then hold 4 to 5 s for reading. Quick 0.12 s fades between screens, on the beat. Glow only on the accent phrase and on moving light.
- **Pacing.** About 5 s a screen (4 to 6.5), six to nine screens. No block, or one. A small page counter (`3/8`) replaces the HUD.
- **Signature moves.** The painted underline and glow under the accent phrase. Light as data (grid and contour lines, points of light that flow and pool). One everyday analogy drawn on screen. One signal-colour highlight per headline.
- **Signature scene.** `SignalDiagram` (`src/visuals/SignalDiagram.tsx`). A dark three-step diagram with numbered mono labels builds one step per bar. Violet points of light drift at step one, flow into a ring that draws itself at step two, turn green as they pool, and land in the result card at step three, which glows once. The accent phrase gets the painted underline and glow (`underlineStyle: "painted"`). It takes the `notify` beat.
- **Don't** use more than one green phrase a screen, violet as decoration, neon on everything, jargon or model names on screen, dense UI screenshots (simplify them into diagrams), or more than about ten big words a screen.
- **Visuals that fit.** `Steps`, `BeforeAfter`, `StatCountUp`, `ComposerAnswer` on dark cards, Line Draw diagrams, a Slot Counter for one number.
- **Music.** 118 to 124 BPM, a punchy drum-forward product-ad track (clear kick, snare, claps, deep bass) starting on beat one. Offer three options by ear; same-tempo tracks can share one beat grid.
- **6 s sample.** `Sample`, the headline landing with its green phrase and painted underline, then the diagram building step by step under it.

## 8. Paper Cut (`paper-cut`)
*Calm and warm. Layered paper, slow light and a soft serif.*

- **Use it for** human stories, a fresh start or new version, consumer and wellbeing products, nonprofits, thank-you or anniversary videos, or the calm opening of a longer film. 30 to 60 s.
- **Palette** (`brand` is a placeholder)
  ```
  paper (cream) #FFF3DC   card #FFF9EE   ink (plum) #3B1734   inkSoft (rosewood) #8F4458
  brand (terracotta) #C8553D   brandLight #DB916F   brandSoft #F9DDB8   accent2 (peach) #F4CBA8
  hill layers, light to dark: #E8B29A #DB916F #BF6B5E #8F4458 #5C2748 #3B1734
  blocks: radial gradient brandLight → brand → brandDeep (a sunset)
  ```
- **Type.** Fraunces 600 for headlines (tracking -0.02em), DM Sans for body, DM Mono for small captions, Fraunces italic for the accent word with a hand-drawn underline.
- **Motion.** Springs without bounce (`card { stiffness: 80, damping: 18 }`, `pop { stiffness: 120, damping: 14 }`, `soft { damping: 200 }`). Gentle easing (out `(0.22, 1, 0.36, 1)`, in-out `(0.45, 0, 0.55, 1)`). Words build slowly, 0.8 s each with an 8 px de-blur. Scenes cross-dissolve over 0.6 s with a slow 5% push and parallax.
- **Pacing.** 6 to 9 s a beat. No block, or one sunset gradient for the payoff.
- **Signature moves.** Paper Parallax. A sun rising with halo rings. Paper grain at about 10%. UI shown as paper cards with a soft offset shadow.
- **Signature scene.** `PaperParallax` (`src/visuals/PaperParallax.tsx`). Six paper hill layers, coloured from the preset's brand shades toward ink, slide up into place back to front on a spring with no bounce, each with paper grain and a soft shadow. The sun rises behind them with halo rings, one cloud drifts, and a slow 5% push moves near layers more than far ones. It takes the `notify` beat.
- **Don't** use fast cuts, slams, motion blur, saturated blues or neon, hard drop shadows, cartoon bounces, or more than one landscape scene in 20 s (it is a breather, not wallpaper).
- **Visuals that fit.** `Phone`, gentle `Notifications`, `Steps`, `StatCountUp` for one warm number, `Device` sparingly.
- **Music.** 70 to 90 BPM, felt piano, warm pads, light acoustic guitar or strings, swelling slowly toward the payoff. No hard drops.
- **6 s sample.** `Sample`, the layers settling with the sun rising and a slow push, the headline building in Fraunces with its italic accent and underline.

## 9. Mascot Carry (`mascot-carry`)
*Light, friendly and product-native. One character carries the whole film and docks into each scene's UI.*

- **Use it for** consumer and small-business apps, AI agents and assistants that have an avatar, and 15 to 30 s feature teasers for social. It needs a character the brand already has (a mascot, an agent avatar, an app icon that can take a face). Never invent a mascot for a brand without the person's yes.
- **Palette.** Near-white paper, ink, one brand colour for the character's prop and the UI accents, and the brand's darkest shade kept back for the end card (`brand` and `brandDeep` are placeholders).
  ```
  paper #F7F8FA   card #FFFFFF   ink #0B0B0C   inkSoft #6B6F76
  brand #2F7DF6   brandDeep #0A1B3D   onBrand #FFFFFF
  end card: radial gradient brandDeep → near-black
  ```
- **Type.** One grotesk sans at 600 (Inter Display or Geist), 72 to 96 px, sentence case, tracking -0.03em. No accent serif; the character is the accent. UI text in the same sans at smaller sizes so the phone and desktop rebuilds read as the real OS.
- **Motion.** The character on a bouncy spring (`body { stiffness: 220, damping: 12 }`), props and chips on `pop { stiffness: 260, damping: 14 }`, UI on ease-out-expo. Words build at about 0.25 s each with no blur. Character acting as in `motion-cheatsheet.md` (*Character acting*): squash on every landing, a blink every 2 to 3 s, eyes that look at what comes next. Clean cuts for everything except the character, which carries.
- **Pacing.** 15 to 25 s. A cold open on the character alone (1.5 to 2.5 s, no words), then one line of three to five words per feature at about 2.5 s a beat, each with one small native proof, then the end card. The light-to-dark flip happens once, on the end card.
- **Signature moves.** Character Carry. Inline Glyph in the first line. A costume reveal: one prop snaps onto the character and says what the product lets it do (a headset for calls, a pen for writing). Chip Unfold for one concrete value. The end card flips to the brand's dark shade: app icon, then wordmark, then (if there is one) a partner lockup with the character in the partner slot.
- **Signature scene.** `CharacterCarry` (`src/visuals/CharacterCarry.tsx`). A placeholder character (round ink body, pill eyes) drops in with a stretch and a squash, blinks, looks up as a headset drops on, shrinks into the headline as an Inline Glyph while its eyes follow the words, then hops on an arc into the avatar slot of a phone's call pill, turning light for the dark slot; the pill swaps from a placeholder caller to the character's call with a live waveform. It takes no single beat: Character Carry runs through the whole film, so build each scene's slot per video. The `Mascot` component in the same file takes the pose inputs (squash, look, blink, prop, follow-through, invert); swap its drawing for the brand's character.
- **Don't** make the character act in every frame (it rests while the UI proves the claim), give it more than one prop at a time, cut away from it between feature beats, let a line run past five words, show a full screen where one native element proves the claim, or add sound effects to UI events (only the character's own actions get one).
- **Visuals that fit.** `Phone` with a call or alert pill at the top, `Notifications`, `ComposerAnswer` as a chat thread with the character as the avatar, `Device` for one desktop beat, `Steps` for an agent doing work.
- **Music.** 95 to 120 BPM, light and bouncy (plucks, marimba, a soft kick). Small sound effects on the character's landings and pops only.
- **6 s sample.** The character drops in and squashes, blinks, its prop pops on, it slides into a headline as an Inline Glyph, then hops down and docks into a phone's call pill.

---

## Building the 6 s sample
1. Set `PRESET` in `src/theme.ts` and swap the placeholder brand colours for the product's.
2. Render `Sample`, the preset's signature scene at 6 s (`npx remotion render Sample out/sample.mp4`), after swapping its placeholder copy for one real headline. For Clean Launch the first six seconds of `StyleTest` also work (`npx remotion render StyleTest out/sample.mp4 --frames=0-179`).
3. Put it on a stretch of the candidate music, share it, and wait for a yes before building the rest. If the answer is "close but not quite", change tokens first (colour, type, timing) before changing moves.
