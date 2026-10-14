"""Generate an instrumental track with ElevenLabs Music from config/music.json.
usage: uv run --with requests scripts/music.py <name> [--seed N]     -> audio/music/<name>.mp3
config/music.json either {"model": "...", "prompt": "...", "length_ms": 72000}   (prompt mode, forced instrumental)
or {"model": "...", "composition_plan": {...}} (plan mode; the plan's shape depends on the model version, see the API docs)."""
import argparse, sys, requests
from _common import ROOT, api_key, load
ap = argparse.ArgumentParser(); ap.add_argument("name"); ap.add_argument("--seed", type=int, default=None); A = ap.parse_args()
cfg = load("config/music.json"); body = {"model_id": cfg.get("model", "music_v1")}
if "composition_plan" in cfg:
    body["composition_plan"] = cfg["composition_plan"]
    if A.seed is not None: body["seed"] = A.seed
else:
    body.update({"prompt": cfg["prompt"], "music_length_ms": cfg.get("length_ms", 60000), "force_instrumental": True})
r = requests.post("https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128", headers={"xi-api-key": api_key()}, json=body, timeout=900)
if not r.ok: sys.exit(f"{r.status_code} {r.text[:400]}")
out = ROOT / "audio/music"; out.mkdir(parents=True, exist_ok=True)
(out / f"{A.name}.mp3").write_bytes(r.content); print("wrote", out / f"{A.name}.mp3")
