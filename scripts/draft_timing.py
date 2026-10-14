"""Animatic timing without audio: spaces each line's words evenly (~2.6 words/s) so scenes can be built before the VO exists.
usage (project root): python3 scripts/draft_timing.py   -> video/src/data/timing.json (vo and music null)"""
import json, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from _common import ROOT, load
tl = load("config/timeline.json"); lines = {l["id"]: l["text"] for l in load("config/script.json")["lines"]}
scenes = []
for s in tl["scenes"]:
    ws = [w for w in lines.get(s["id"], "").split() if not (w.startswith("[") and w.endswith("]"))]
    words = [{"w": w, "s": round(i / 2.6, 3), "e": round((i + 0.8) / 2.6, 3)} for i, w in enumerate(ws)]
    scenes.append({"id": s["id"], "start": s["start"], "end": s["end"], "voOffset": round(s.get("vo_at", s["start"] + 0.3) - s["start"], 3),
                   "voDur": round(len(ws) / 2.6, 3), "vo": None, "words": words})
out = {"fps": tl.get("fps", 30), "tempo": 0, "duration": tl["scenes"][-1]["end"], "music": None, "scenes": scenes}
p = ROOT / "video/src/data/timing.json"; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(json.dumps(out, indent=1)); print("wrote", p)
