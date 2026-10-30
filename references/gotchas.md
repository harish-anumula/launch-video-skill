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

## 3D (Three.js)
- Blank canvas / "Error creating WebGL context" → render with `--gl=angle` (or `swangle` on a GPU-less Linux box), or set `Config.setChromiumOpenGlRenderer("angle")`. A failed render leaves the previous output file in place; delete outputs before rendering so later steps don't process a stale video.
- A texture, SVG or model shows up blank in renders but fine in the Studio → it was loaded with Suspense/`useLoader`; hold it with `delayRender`/`continueRender` (see `three-d.md`).
- Brand colours look dull or dark in 3D → `flat` on `ThreeCanvas`, `toneMapped={false}` on unlit materials.

## Multi-part films and studio workflow
- **Long films from parts.** Build 15–30 s parts whose events all come from one prop-driven timing table (`beat0`, `beat`, beat indices, accents). Give each part `endCard`, `music`, `sfx`, `joinIn`/`joinOut` props, and make its first and last 0.5 s clean. An assembler then re-snaps every part to one film track and designs match cuts on downbeats.
- **Fictional names are often real.** Web-search every invented company, person and handle before rendering. In one run, 16 plausible names turned out to be real businesses (e.g. "Juniper Health", "Indigo Payments", "Marlow Studios"). Keep a list of each name and what the search found.
- **Gain staging before finalize.** If the mix is quiet, the −14 LUFS master adds lots of gain, and the limiter then flattens every hit (the climax fell below the median onset). Balance beds up and SFX/sub down so the limiter takes ≤3 dB. Check that the raw render doesn't clip.
- **Small speakers.** A sub-only impact disappears on laptop and phone speakers. Add harmonics from its own sub, or layer a mid-range hit.
- **ElevenLabs music uses the same character credits as TTS** (about 10–13 credits per second of music). Budget for it. Concurrent agents will drain the pool.
- **Independent reviewers find real defects every round.** Give them a fixed brief (frame strips at every join, beat-sync tables from the FINAL mp4's audio, phone and 1 Mbps checks, accuracy against sources). Expect to fix and re-review.
- **Don't Mickey-Mouse the music.** Viewers found music bent to hit every visual event (dips before hits, accents on every landing, a different track per scene) weird. They found pre-hit dips "too silent" on phones, and scene-to-scene track changes jarring. Use one continuous track with a natural arc. Cut the picture to its sections, and sync only the big moments. UI-led storytelling with clean cuts beat elaborate 3D match-cut transitions.
