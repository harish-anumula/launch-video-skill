# Gotchas and fixes

## Remotion / React
- **CSS transitions and animations don't render.** Drive everything from `useCurrentFrame()` with `interpolate()`/`spring()`.
- **Tailwind's preflight sets `img { max-width: 100% }`.** A large image inside a small positioned box gets squashed. Set `maxWidth: "none"` on images you size explicitly.
- **Exited headline words can leave artefacts** (underline strokes peeking past the mask). Fade the whole headline to opacity 0 once its exit completes.
- **Scenes that overlap for transitions:** start the incoming `<Sequence>` a little early (a "lead") and let the scene treat negative time as its entrance. Later sequences render on top.
- **Cursor inside 3D-transformed UI:** place the cursor inside the transformed element and use its local coordinates; screen coordinates drift as the camera moves.
- **Many parallel `remotion still` calls** compete for CPU/GPU with other renders; batch them or run them after heavy renders finish.
- **Keep one timing source.** Write scene starts, VO offsets and word times to one JSON file that both the audio and the visuals read.

## Voiceover
- Generating the whole script in one call runs lines together (one line's ending blurs into the next). Generate per line.
- Pick takes by measurement (Whisper transcript match + speaker similarity), then listen to the chosen ones if you can.
- Short takes score lower on speaker similarity; compare takes of the same line, not across lines.
- An expressive model may read inline tags (like `[whispers]`) as delivery, not words, but check the transcript.
- Higher output bitrates can be tier-gated; fall back to 128 kbps.

## Music
- Generated tracks often ignore the requested BPM and section plan. Measure tempo, beat times and loudness per section, then adapt the edit to the music.
- If the track ends early or starts too quietly, time-stretch a few percent (`rubberband -T <ratio>`) and lift the intro gain rather than cutting or looping.
- Composition-plan formats differ between music model versions; a 422 "invalid composition_plan" usually means the wrong shape for the model.
- Ducking music to near-silence for a dramatic line reads as a dropout. Dip gently.

## Visual taste
- A sidebar or tab highlight that moves while the content doesn't change looks like a bug. Change the page with it, or don't move the highlight.
- Off-palette scene colours (a sudden navy or black) feel wrong in an otherwise branded video.
- Approximated third-party icons look wrong to everyone who uses that product. Use official marks.
- Small UI on a device mockup loses legibility; push the camera in for the moment that matters.

## Explainers and social videos
- Web-fetch summaries can invent numbers (one claimed "24 rounds" that the source never said). Fact-check against the full source text.
- A faithful script can still lose people: replace jargon with one everyday analogy and cut each screen to one idea.
- Slow, smooth music undersells a short social video; a drum-forward track that starts on beat one reads as "product video".
- If entrances take most of a scene, viewers never get a still screen to read. Land the content fast, then hold.
- Boosted posts (friends asked to like or repost) aren't a baseline for comparing formats.

## Shell
- In zsh, `set -- $var` doesn't word-split. Iterate over explicit lists or use `${var%%:*}` / `${var##*:}`.
- Avoid `rm` of globs after `cd` in one command; many safety hooks block it. Write to a new folder instead.
