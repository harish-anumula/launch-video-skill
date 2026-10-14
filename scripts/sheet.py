"""Labelled contact sheet from stills.  usage: uv run --with pillow scripts/sheet.py out.jpg img1.jpg img2.jpg ..."""
import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
W, cols = 640, 3
ims = [Image.open(f).convert("RGB") for f in files]; H = int(ims[0].height * W / ims[0].width); rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W + (cols + 1) * 6, rows * H + (rows + 1) * 6), (40, 40, 40)); d = ImageDraw.Draw(sheet)
for i, (im, f) in enumerate(zip(ims, files)):
    x, y = 6 + (i % cols) * (W + 6), 6 + (i // cols) * (H + 6)
    sheet.paste(im.resize((W, H)), (x, y)); d.rectangle([x, y, x + 120, y + 26], fill=(220, 30, 30)); d.text((x + 6, y + 5), f.split("/")[-1], fill="white")
sheet.save(out, quality=88); print("wrote", out)
