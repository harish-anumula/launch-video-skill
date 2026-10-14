# launch-video

An agent skill for making short product launch videos in code. You bring the product, the taste and the notes. The agent plans the story, rebuilds the product's screens in React, writes and records the voiceover, cuts the scenes to the music and renders the video with [Remotion](https://www.remotion.dev).

I built it while making a product launch video with Claude Code, then cleaned it up so it works for any product. It works with Claude Code and Codex, and with any agent that can read a `SKILL.md` and run shell commands.

## Install

Claude Code (personal skill):

```bash
git clone https://github.com/harish-anumula/launch-video-skill ~/.claude/skills/launch-video
```

Codex:

```bash
git clone https://github.com/harish-anumula/launch-video-skill ~/.codex/skills/launch-video
```

For a project-level skill, clone it into `<repo>/.claude/skills/launch-video/` instead. Then ask your agent for a launch video. It starts with a short set of discovery questions.

## What it does

1. Asks what the product is, who the video is for, what to show first, the format, the sound and the look.
2. Proposes a story shape and a hook. There's no single formula: problem to proof, a cold open inside the product, one hero flow, before and after, a day with the product, idea first, or a teaser (`references/storyboard-template.md`).
3. Captures the product's screens with fictional data and rebuilds them as React components, so they stay sharp and every part can animate.
4. Records the voiceover one line at a time with word timings, and picks the best take by transcript match (`scripts/vo_lines.py`, `scripts/vo_pick.py`).
5. Generates or measures the music and snaps every cut to the beat (`scripts/music_qa.py`, `scripts/build_timing.py`).
6. Builds scenes from a small library of visuals (device and phone mockups, a composer with answers, notifications, before and after, steps, a depth cloud of integrations) and renders contact sheets for review.
7. Renders the master at −14 LUFS with a finished cover as frame 0, plus a thumbnail and optional cutdowns.

## What you need

- Node 20+, `ffmpeg`, and Python 3.11 via `uv` (`uvx`). The scripts declare their own dependencies.
- Remotion. Run `npx create-video@latest --yes --blank --no-tailwind video`, or copy `template/` (see `template/README.md`).
- Optional: an ElevenLabs account for voiceover and music, `rubberband` for clean time-stretching, Whisper via `uvx` for transcript checks.

Keys stay out of the repo. The scripts read `ELEVENLABS_API_KEY` from your environment or a git-ignored `.env`.

## Licences and fair use

- This skill is MIT licensed (see `LICENSE`).
- Remotion has its own licence. It's free for individuals and companies of up to three people; larger companies need a company licence.
- Check your text-to-speech and music provider's commercial terms before publishing.
- Product names and logos are trademarks of their owners. Show third-party logos only for real integrations, and label unofficial or fan-made videos as unofficial.
- Use fictional data on screen, and don't clone a real person's voice without their consent.

## Layout

| Path | What it is |
| --- | --- |
| `SKILL.md` | The instructions the agent follows |
| `references/` | Story shapes and hooks, the visual catalog, motion and style notes, audio, review checklist, gotchas |
| `scripts/` | Voiceover, music, timing, contact sheets and finalizing |
| `template/` | A Remotion starter with brand tokens, timing helpers, generic scenes and visuals, and a Catalog preview |

Issues and pull requests are welcome.
