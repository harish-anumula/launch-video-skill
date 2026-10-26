# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow"]
# ///
"""Turn a review JSON (from scripts/review/review.html) into frames the agent can see.

Usage: uv run scripts/review_frames.py review-v2.json out/video-v2.mp4 review/v2
Writes review/v2/NN.png (the frame, with the reviewer's pin drawn on it), NN-end.png for ranges,
and review/v2/FEEDBACK.md: one numbered item per note with its time, frame, pin and image paths.
The agent reads FEEDBACK.md and the images, then fixes every note in one pass.
"""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw


def grab(video, t, out):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", str(video),
                    "-frames:v", "1", str(out)], check=True)


def draw_pin(path, x, y):
    im = Image.open(path).convert("RGB")
    d = ImageDraw.Draw(im)
    w, h = im.size
    r = max(14, round(min(w, h) * 0.025))
    cx, cy = x * w, y * h
    for rad, col, wd in ((r + 4, (255, 255, 255), 4), (r, (255, 59, 92), max(4, r // 4))):
        d.ellipse((cx - rad, cy - rad, cx + rad, cy + rad), outline=col, width=wd)
    im.save(path)


def main(review_json, video, out_dir):
    data = json.loads(Path(review_json).read_text())
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    fps = data.get("fps", 30)
    lines = [f"# Review notes: {data.get('video', Path(video).name)}, round {data.get('round', '?')}", "",
             f"{len(data['notes'])} notes. Fix every one in a single pass, then re-render and say what changed per note.", ""]
    for i, n in enumerate(data["notes"], 1):
        img = out / f"{i:02d}.png"
        grab(video, n["t"], img)
        pin = n.get("x") is not None
        if pin:
            draw_pin(img, n["x"], n["y"])
        when = f"{n['t']:.2f} s (frame {round(n['t'] * fps)})"
        if n.get("end") is not None:
            end_img = out / f"{i:02d}-end.png"
            grab(video, n["end"], end_img)
            when = f"{n['t']:.2f}–{n['end']:.2f} s (frames {round(n['t'] * fps)}–{round(n['end'] * fps)})"
        where = f", pin at {n['x'] * 100:.0f}% across and {n['y'] * 100:.0f}% down" if pin else ""
        lines.append(f"{i}. **{when}{where}.** {n['text'].strip()}")
        lines.append(f"   Frame: `{img}`" + (f", end frame: `{out / f'{i:02d}-end.png'}`" if n.get("end") is not None else ""))
    (out / "FEEDBACK.md").write_text("\n".join(lines) + "\n")
    print(f"wrote {out / 'FEEDBACK.md'} and {len(data['notes'])} frames")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    main(*sys.argv[1:])
