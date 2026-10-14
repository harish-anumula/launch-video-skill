# Launch video template (Remotion)

## Setup
```bash
npx create-video@latest --yes --blank --no-tailwind video
cd video && npm i
npx remotion add @remotion/media @remotion/google-fonts
rm src/Composition.tsx
cp -R <skill>/template/src/. src/            # overwrites src/Root.tsx
cd .. && mkdir -p config && for f in script timeline music; do cp <skill>/template/config/$f.example.json config/$f.json; done
cp -R <skill>/scripts .
python3 scripts/draft_timing.py              # animatic timing (no audio) so you can build scenes before the VO exists
cd video && npx remotion studio              # Launch, StyleTest, Catalog, Thumbnail
```
Project layout (run scripts from the project root): `config/` (script, timeline, music), `audio/`, `scripts/`, `video/` (this Remotion project).

## What to edit
| File | Edit |
|---|---|
| `src/theme.ts` | Brand colours, fonts, background |
| `src/brand/logo.ts` | Product name, logo mark paths (split into pieces so they assemble) |
| `src/scenes/config.ts` | HUD labels per scene, which scenes are on the brand colour, CTA |
| `src/video.config.tsx` | **The storyboard.** One entry per scene id: a scene component and, for features, a visual from `src/visuals/` |
| `src/components/Ui.tsx` | `INTEGRATIONS`: replace the letter placeholders with your real items and official logos |
| `src/scenes/Thumbnail.tsx` | Thumbnail copy and hero visual |
| `config/*.json` | VO lines and voice, scene timeline, music prompt |

Scene ids in `config/timeline.json`, `config/script.json` and `video.config.tsx` must match. Scenes read the spoken words from `src/data/timing.json`, so headlines reveal word by word in sync with the VO.

## Real audio
```bash
uv run --with requests scripts/vo_lines.py                  # 3 takes per line (needs ELEVENLABS_API_KEY)
uvx ... python scripts/vo_pick.py [--ref ref.wav]           # see the script header for the uvx line
uv run --with requests scripts/music.py a && ... music.py b # a few music options
scripts/music_options.sh audio/options.mp3 audio/music/a.mp3 audio/music/b.mp3   # let the person choose by ear
uvx --python 3.11 --with librosa python scripts/build_timing.py audio/music/<chosen>.mp3   # beat-snapped timing + copies audio into public/
```

## Render
```bash
npx remotion render StyleTest out/style-test.mp4 --codec=h264 --crf=16
npx remotion render Launch out/raw.mp4 --codec=h264 --crf=16
npx remotion still Thumbnail out/thumbnail.png && ffmpeg -i out/thumbnail.png -vf scale=1280:720 out/cover.jpg
../scripts/finalize.sh out/raw.mp4 out/launch.mp4 out/cover.jpg   # -14 LUFS, cover art, contact sheet, transcript
```
Frame 0 of `Launch` is the thumbnail (1/30s, invisible at playback) because many apps preview the first frame. Pass `poster: false` to disable.
