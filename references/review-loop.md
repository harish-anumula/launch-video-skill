# Review loop: point at the frame, not "around three seconds"

Typed notes like "the thing near the start is too big" cost a round each. Instead, the person reviews the real render in a small local page. They pause, click the spot that's wrong (or drag across the timeline for a stretch), and type the note. The agent then gets every note at once, each with its exact time, frame number and a frame image with the spot circled.

## The round

1. **Render and finalize** the version (`out/<name>-vN.mp4`). Always review the render, never the Remotion preview: encoding, audio and timing only show up in the render.
2. **Open the review page.**
   - Open `scripts/review/review.html` in a browser.
   - Press **Open video…** and pick the mp4, or drag the file onto the page. Opening the file directly keeps frame-accurate seeking.
   - If you'd rather pass a URL (`review.html?src=out/video.mp4&round=v3`), serve the folder with something that supports range requests, such as `npx serve`. Python's `http.server` can't seek.
   - Set **Round** to the version (v2, v3, …) and **FPS** to the composition's frame rate.
3. **The person reviews.**
   - Click the picture to pin a spot.
   - Drag on the bar to mark a range.
   - Type a note, then press **Add note** (or Cmd/Ctrl+Enter).
   - Keys: Space plays and pauses, `,` and `.` step one frame, `N` jumps to the note box.
   - Notes save in the browser per video and round, so a reload loses nothing.
4. **Finish review.** This downloads `review-<round>.json` and copies it to the clipboard. The person drops the file into the project, or pastes the JSON into the chat.
5. **The agent grabs the frames:**
   ```bash
   uv run scripts/review_frames.py review-v3.json out/video-v3.mp4 review/v3
   ```
   This writes `review/v3/FEEDBACK.md` (numbered notes with time, frame, pin position and image paths) and one PNG per note with the pin circled. Ranges also get an `NN-end.png`.
6. **The agent fixes every note in one pass.**
   - Read `FEEDBACK.md` and look at every image before touching code.
   - Map each note to the scene and the timing constant behind that frame.
   - Fix them all, re-render, and reply with what changed **per note number**.
   - Keep `review/vN/` with the version, so later rounds show what was asked and why.

## A storyboard round first

Before animating, render one still per shot (`npx remotion still … --frame=<n>`) and join them into a short mp4. Hold each still for about 1 s:
```bash
ffmpeg -framerate 1 -pattern_type glob -i 'stills/*.png' -c:v libx264 -pix_fmt yuv420p -r 30 storyboard.mp4
```
Review it with the same page. Fixing a layout here costs a still; fixing it after animation costs a scene.

## What the JSON looks like

```json
{"video": "launch-v3.mp4", "round": "v3", "fps": 30, "duration": 48,
 "notes": [
  {"t": 9.5, "frame": 285, "end": null, "x": 0.784, "y": 0.387, "text": "Logo lands a frame early"},
  {"t": 14.73, "frame": 442, "end": 22.68, "x": null, "y": null, "text": "This stretch drags, cut a beat"}]}
```
- `t` and `end` are in seconds.
- `x` and `y` run from 0 to 1, measured from the frame's top-left. `null` means no pin was placed.

## Rules for the agent

- Never ask the person to describe a moment again if a note already pins it. Look at the image.
- If a note is ambiguous even with the frame, ask one specific question about that note number. Don't guess on more than one.
- Don't change things nobody pinned in the same round, unless a fix forces it. Say so when it does.
