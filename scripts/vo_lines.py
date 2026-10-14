"""Generate N takes per VO line with word timings.
usage (from project root):  uv run --with requests scripts/vo_lines.py [--takes 3] [--only id1,id2]
reads config/script.json -> writes audio/vo/lines/<id>_s<k>.mp3 + .json (words with start/end seconds). Existing takes are skipped."""
import argparse, base64, json, sys, requests
from _common import ROOT, api_key, load, words_from_alignment
ap = argparse.ArgumentParser(); ap.add_argument("--takes", type=int, default=3); ap.add_argument("--only", default="")
A = ap.parse_args()
cfg = load("config/script.json"); key = api_key()
out = ROOT / "audio/vo/lines"; out.mkdir(parents=True, exist_ok=True)
only = set(filter(None, A.only.split(",")))
for line in cfg["lines"]:
    if only and line["id"] not in only: continue
    for k in range(1, A.takes + 1):
        f = out / f"{line['id']}_s{k}.mp3"
        if f.exists(): continue
        body = {"text": line["text"], "model_id": cfg.get("model", "eleven_multilingual_v2"), "seed": k * 11,
                "voice_settings": cfg.get("voice_settings", {"stability": 0.5, "similarity_boost": 0.8, "style": 0.0, "use_speaker_boost": True})}
        r = requests.post(f"https://api.elevenlabs.io/v1/text-to-speech/{cfg['voice_id']}/with-timestamps?output_format={cfg.get('output_format', 'mp3_44100_128')}",
                          headers={"xi-api-key": key}, json=body, timeout=300)
        if not r.ok: sys.exit(f"{r.status_code} {r.text[:300]}")
        d = r.json(); f.write_bytes(base64.b64decode(d["audio_base64"]))
        al = d.get("normalized_alignment") or d["alignment"]
        f.with_suffix(".json").write_text(json.dumps({"text": line["text"], "words": words_from_alignment(al)}, indent=1))
        print("take", f.name)
