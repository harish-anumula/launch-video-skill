---
name: launch-video
description: Plan and produce a 30–75s motion-design launch video for any product, in code, with Remotion (React), an optional AI voiceover and instrumental music, beat-synced cuts, kinetic typography and UI rebuilt from the product's real screens. Use when someone asks for a launch video, product explainer, feature showreel, What's new video, animated product demo, or social cutdowns (16:9, 1:1, 9:16).
---

# Launch video

You direct and build a short launch video end to end: discovery questions → storyboard → product captures → script and voiceover → music → Remotion scenes → review → render → thumbnail and cutdowns. The person brings taste and product knowledge; you bring the pipeline and the craft. Ask the questions below, make every other decision yourself, and say what you chose.

Everything here is generic. Bring the product's own brand, screens, API keys and music licence.

## Install (any agent)
- **Claude Code:** copy this folder to `~/.claude/skills/launch-video/` (personal) or `<repo>/.claude/skills/launch-video/` (project).
- **Codex:** copy it to `~/.codex/skills/launch-video/`, or reference `SKILL.md` from your `AGENTS.md`.
- **Other agents:** put it anywhere and tell the agent to read `SKILL.md` first. Paths, versions and APIs change over time; if a command or API shape has moved on, check the current docs and adapt rather than stopping.

## What is in this skill

| Path | What it is |
|---|---|
| `references/storyboard-template.md` | Story shapes, hook types, how to use reference videos, a beat sheet and a feature-beat recipe |
| `references/visual-catalog.md` | The visual building blocks, what each shows, and which products/features each suits |
| `references/motion-cheatsheet.md` | Easing, springs, pacing, style families and type, transitions, camera over UI, texture, cursor |
| `references/audio.md` | Voiceover vs music, TTS and music API shapes, mixing, loudness |
| `references/style-presets.md` | Eight named looks (Clean Launch, Fast Concept, Kinetic Type, Bento Product, Data Story, System Diagram, Night Signal Explainer, Paper Cut): palette, type, motion, pacing, signature moves, don'ts, fitting visuals, music, and a 6 s sample for each |
| `references/review-loop.md` | Frame-pinned review: the review page, the feedback JSON, and how the agent turns it into one fix pass |
| `references/review-checklist.md` | What to check per scene, on the full cut, and before sharing |
| `references/gotchas.md` | Failure modes and their fixes |
| `scripts/` | Reference analysis, voice ranking, per-line VO with word timings, take picking, music generation/QA/options/stretch, beat-snapped timing, contact sheets, finalize |
| `template/` | Remotion starter: brand tokens, timing helpers, kinetic headline, cursor, grain, HUD, logo assembly, generic Hook/Reveal/Feature/Payoff/End/Thumbnail scenes, a library of visuals with one signature scene per preset, a Catalog preview, and `video.config.tsx` (the storyboard in code) |

## Tools
- Node 20+, `ffmpeg`, Python 3.11 via `uv`/`uvx` (scripts declare their own deps).
- Remotion: `npx create-video@latest --yes --blank --no-tailwind video`. Install the official agent skills (`npx skills add remotion-dev/skills`) and read `remotion-best-practices` before writing scenes.
- Optional: `rubberband` (clean time-stretch), `demucs` and Whisper via `uvx` (analysis and QA), an ElevenLabs (or other TTS/music) account.
- **Licences:** Remotion is free for individuals and companies of up to 3 people; larger companies need a Remotion company licence. Check your TTS/music provider's commercial terms. Third-party logos are trademarks; show them only for real integrations.

## 1. Discovery questions (ask before planning)

Ask these in one batch (use the question/multiple-choice tool if your client has one; otherwise a short numbered list). Offer a recommended default for each so the person can just confirm.

1. **Product:** its name exactly as it should appear, and one sentence on what it does and for whom.
2. **Audience and goal:** who watches (customers, prospects, investors, the internal team) and what they should do after (sign up, book a demo, try a feature), and how that will be counted (signups, downloads, people still using it a week later; not views).
3. **What to show, in priority order:** the 3–6 features or moments that matter most. Screen time follows this order.
4. **Size, length and format:** a polished launch (a few a year) or a quick demo (weekly; see *Quick demos*), then e.g. 45–75s main cut at 16:9; which cutdowns (15–20s, 1:1, 9:16) and where it will be posted.
5. **Sound:** voiceover + music (recommended when the product needs explaining), or music only. Voice preference (gender, accent, energy) or "match this example".
6. **Story and look:** the story shape and hook type (see `references/storyboard-template.md`; recommend one with a reason). For the look, offer the named presets in `references/style-presets.md` by name (Clean Launch, Fast Concept, Kinetic Type, Bento Product, Data Story, System Diagram, Night Signal Explainer, Paper Cut) with its *How to pick* table and a recommended one, so the person can pick a preset instead of describing a look. If none fits, ask for light or dark, the style family (product-native, editorial, showreel, playful, cinematic; `references/motion-cheatsheet.md`) and any videos they like. One preset per video, plus at most one borrowed move. Brand assets: logo (SVG), colours, fonts, or where to read them (the product's CSS).
7. **Screens:** can you run the product with a demo account and fictional data, or will they provide screenshots? Anything that must not appear.
8. **End card:** CTA text and URL; launch date/"now in beta" wording.
9. **Keys:** where the TTS/music API key lives (environment variable or a git-ignored `.env`). Never ask them to paste keys into chat.

If they've already answered some of these, don't ask again.

## 2. Plan the storyboard
- Choose a story shape and hook type from `references/storyboard-template.md` (problem → product → proof is only one of several). Feature beats follow the priority order.
- If the person shares reference videos, borrow their craft (pacing, cuts, camera, type), never their lines, openings or sequences; check the script against the reference transcripts before recording.
- Write the post first: its first line and frame 0, then run the stop test (`references/storyboard-template.md`). Plan story beats, not only cuts.
- Write the VO as one short line per scene (≈2.5 words/s; 60s ≈ 140 words). Each line should land on its scene's visual moment. Write it the way the person talks: if it would be dull as a text from a friend, it will be dull to hear.
- For each feature beat, pick a visual from `references/visual-catalog.md` that fits *this* product (a mobile app might be `Phone` → `Steps` → `Notifications`; a dev tool `ComposerAnswer` → `BeforeAfter` → `Device`). Vary moves between consecutive beats.
- Share the storyboard as a short table and confirm it before building.

## 3. Capture the product
- Run the product with a demo account and **fictional data**. Never show real customers, colleagues, emails or production data.
- Capture reference screenshots (Playwright, 2x DPR) of every screen the storyboard uses and note the exact visible copy. Rebuild those screens as simplified React components inside `Device`/`Phone`/cards so they stay crisp and animate. Real screenshots can go straight into `Device`/`Phone` when a rebuild isn't worth it.
- If a state can't be reached honestly, stylize it and say so.

## 4. Voiceover (if chosen)
- Put the lines in `config/script.json`. `scripts/vo_lines.py` makes 3 takes per line with word timings; `scripts/vo_pick.py` picks the best by transcript match (and similarity to a reference voice, if given).
- Generate per line, never the whole script at once: one-pass reads run lines together and you can't start each line on its cut.
- Use stock/premade voices. To resemble a voice from an example, rank stock voices with `scripts/voice_match.py`; never clone a real person without consent.

## 5. Music
- Generate 3–4 instrumental options (`scripts/music.py`) or license tracks. Make an A/B/C/D excerpt file (`scripts/music_options.sh`) and let the person choose by ear.
- Measure the chosen track (`scripts/music_qa.py`); generated tracks rarely follow the requested tempo or sections, so snap the cuts to the detected beats (`scripts/build_timing.py`). If the natural ending falls in the wrong place, time-stretch a few percent (`scripts/stretch_music.sh`).

## 6. Build
- Set up the template (`template/README.md`). Set `PRESET` in `src/theme.ts` to the chosen preset (`references/style-presets.md`), then swap its placeholder brand colours for the product's. Set the logo and CTA, and write the storyboard into `video.config.tsx`, pacing scenes at the preset's seconds per beat.
- Render a 6 s sample in the chosen preset before the full build (what it shows is in each preset's *6 s sample* line) and get a yes on it.
- Before the VO exists, `scripts/draft_timing.py` gives animatic timing so scenes can be built; after, `build_timing.py` replaces it with real word times.
- Build one scene at a time. After each, render 6–10 stills across it at half scale and look at them as a contact sheet (`scripts/sheet.py`).
- Render and send the `StyleTest` composition (hook, reveal, first feature) for approval before building the rest.

## 7. Review and iterate
- Render the full cut, run `scripts/finalize.sh` (−14 LUFS, cover art, 1-fps contact sheet, transcript of the final mix) and go through `references/review-checklist.md`.
- **Collect notes with the review page** (`references/review-loop.md`). The person opens `scripts/review/review.html`, clicks the frame that's wrong or drags across a range, and types the note. "Finish review" exports a JSON file. Run `scripts/review_frames.py` on it to get every note with its time, frame and a pinned frame image. Optionally do a storyboard round first, with one still per shot.
- For each round of notes, change only what was asked, re-render, and say exactly what changed per note number. Commit each version.
- You can't watch in real time: say which checks you did (stills, transcript, loudness) and ask the person to watch once before sharing.
- Makers often think a good take is bad. After two rounds of notes, recommend posting and let the audience decide; the next video learns more from this one's numbers than from another polish pass.

## 8. Deliver
- Master 1920×1080, 30 fps (60 for dense UI motion), H.264 CRF 16–18, AAC 256k, −14 LUFS, −1 dBTP.
- Thumbnail: the `Thumbnail` composition, readable at ~360px wide; it's also frame 0 of the video (many apps preview the first frame) and the MP4 cover art. Export a PNG and a 1280×720 JPG for platforms with custom thumbnails.
- Cutdowns when asked: a 15–20s hook cut, 1:1 and 9:16 (stack type above UI), a silent website loop, SRT captions from the VO word timings.
- **Channels and measurement:** give each channel its own tracked link (UTM tags or a short link) and judge the video by signups or downloads and who keeps using the product, not by views (for a product without accounts: downloads, release or package-manager installs, stars, or opt-in usage pings). Channels convert very differently: in one founder's numbers a 20k-view YouTube video converted far better than a 3M-view X post, and YouTube keeps serving a video for years. Post the same cut everywhere first, then make the next one for the channel that brings users. A video that keeps converting can become a paid ad.

## Quick demos

Most launches should be small and frequent: one short video for each thing shipped, not one big launch. Keep the full pipeline above for a few big moments a year.

- **Defaults:** 30–60 s, in the shape of the main channel (16:9 for X and YouTube, 9:16 for Reels, TikTok and Shorts), shape H (first-person demo) or I (what we shipped) from `references/storyboard-template.md`, the maker's own voice with a quiet stock track under it, and captions burned in from the VO word timings (or a Whisper transcript of the recording).
- **What stays from the full pipeline:** the discovery questions that aren't already answered, a three-to-six-row storyboard confirmed in one message, the post first and the stop test, the *Hook and feed* and *Before sharing* parts of `references/review-checklist.md`, and the master settings. **What goes:** rebuilt screens (§3), generated music and beat-snapping (§5; cut by ear on the stock track), the `StyleTest` round (§6) and cutdowns unless asked. Ship the same day.
- **The screen recording** (a recorder that smooths the cursor and zooms helps) goes into `Device`. It is real footage, so the fictional-data rule matters more, not less: record in a demo account or a clean profile and check every frame for real names, emails, window titles and notifications. The maker's own numbers ("I switched windows 400 times yesterday") may appear only if they are true and the maker agrees to show them.
- After a few weeks, compare videos per channel by what they brought in (signups, or downloads, installs and stars for a product without accounts). Repeat what worked (channel, length, shape); still write a new hook each time.

These habits come from Farza Majeed's Startup School talk with Y Combinator (Oct 2026).

## Explainer and social videos

The same pipeline makes short explainers (a blog post, paper, feature or idea) for LinkedIn and X. What changes:

- **Facts come from the source, read in full.** Summaries from web-fetch tools can invent or merge numbers. Write a fact-check list from the original text before scripting.
- **Script for anyone, not specialists.** One idea per screen, at most ~10 big words, one everyday analogy for the core concept (for example, an eval becomes "a practice test vs the real test"), no jargon or model names, at most two rounded numbers, and end with something the viewer can do. "Accurate but too technical" is the most likely first note.
- **Pacing:** each screen's content lands within about a second (fast entrances, quick ~0.12s cuts on the beat), then holds 4–5s for reading. In the template, wrap a scene in `SpeedCtx.Provider value={1.6}` to play an authored entrance faster without retiming it.
- **Format:** 4:5 (1080×1350) for the LinkedIn/X feed, 30–50s, music only. The on-screen text is the caption (most feed video is watched muted). Frame 0 is a finished cover.
- **Look:** match the person's existing visual identity (their carousels, site), not the product template.
- **Music:** for social, punchy drum-forward product-ad tracks (clear kick, snare, claps, deep bass, starting on beat one) usually beat smooth ambient ones. Generate 3 options and let the person pick by ear; same-tempo tracks can share one beat grid.
- **Deliver with the post:** post copy, link placement, tags, alt text, cover, and a posting time based on the person's own audience analytics (where followers are, when their network is awake).

## Rules
- Fictional data only on screen; no real people unless they agreed.
- Don't claim numbers or capabilities the product doesn't have. Confirm any "hundreds of…" or statistic is true and approved.
- Write original copy. Don't reuse another video's hook, catchphrase or tagline, and don't default to one formula across videos.
- Stay in the brand palette; sudden off-palette scenes read as glitches.
- Keep music under the payoff line (gentle dip, never near-silence).
- Use official marks for third-party logos, never approximations.
