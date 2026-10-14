"""Rank stock voices on your ElevenLabs account by similarity to a reference voice (ECAPA speaker embeddings).
Use only to find a similar *premade/stock* voice. Do not clone real people's voices without consent.
usage: uvx --python 3.11 --with speechbrain --with "torchaudio<2.9" --with "torch<2.9" --with librosa --with soundfile --with requests \
         python scripts/voice_match.py --ref vocals.wav --text "A line close to the reference's delivery." [--gender female] [--models eleven_v3,eleven_multilingual_v2]
Tip: isolate the reference voice first:  uvx --python 3.11 --with "torchaudio<2.9" --with soundfile demucs --two-stems=vocals ref.wav"""
import argparse, pathlib, sys, requests
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from _common import ROOT, api_key
ap = argparse.ArgumentParser(); ap.add_argument("--ref", required=True); ap.add_argument("--text", required=True)
ap.add_argument("--gender", default=""); ap.add_argument("--models", default="eleven_multilingual_v2"); A = ap.parse_args()
key = api_key()
vs = requests.get("https://api.elevenlabs.io/v2/voices?page_size=100", headers={"xi-api-key": key}, timeout=60).json()["voices"]
vs = [v for v in vs if not A.gender or (v.get("labels") or {}).get("gender") == A.gender]
out = ROOT / "audio/voice_match"; out.mkdir(parents=True, exist_ok=True)
for v in vs:
    for m in A.models.split(","):
        f = out / f"{v['voice_id']}_{m}.mp3"
        if f.exists(): continue
        r = requests.post(f"https://api.elevenlabs.io/v1/text-to-speech/{v['voice_id']}?output_format=mp3_44100_128", headers={"xi-api-key": key},
                          json={"text": A.text, "model_id": m}, timeout=120)
        if r.ok: f.write_bytes(r.content)
import librosa, numpy as np, torch
from speechbrain.inference.speaker import EncoderClassifier
enc = EncoderClassifier.from_hparams(source="speechbrain/spkrec-ecapa-voxceleb", savedir=str(ROOT / ".cache/ecapa"))
def emb(p):
    y, _ = librosa.load(p, sr=16000); y, _ = librosa.effects.trim(y, top_db=30)
    e = enc.encode_batch(torch.tensor(y)[None]).squeeze().numpy(); return e / np.linalg.norm(e)
ref = emb(A.ref); names = {v["voice_id"]: v["name"] for v in vs}
rows = sorted(((float(ref @ emb(str(f))), f.stem) for f in out.glob("*.mp3")), reverse=True)
for s, stem in rows[:15]:
    vid, m = stem.split("_", 1); print(f"{s:.3f}  {names.get(vid, vid)}  [{vid}]  {m}")
print("Same speaker usually scores > ~0.7 on clean speech; compare relative ranks, not absolutes.")
