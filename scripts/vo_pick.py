"""Pick the best take per line: transcript match (Whisper) x2 + speaker similarity to an optional reference voice.
usage: uvx --python 3.11 --with speechbrain --with "torchaudio<2.9" --with "torch<2.9" --with librosa --with soundfile --with mlx-whisper \
         python scripts/vo_pick.py [--ref path/to/reference_vocals.wav] [--asr mlx|openai]
writes audio/vo/picks.json. On non-Apple machines use --asr openai (needs `--with openai-whisper` instead of mlx-whisper)."""
import argparse, difflib, glob, json, pathlib, re, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from _common import ROOT, load
ap = argparse.ArgumentParser(); ap.add_argument("--ref", default=""); ap.add_argument("--asr", default="mlx"); A = ap.parse_args()
import librosa, numpy as np, torch
from speechbrain.inference.speaker import EncoderClassifier
enc = EncoderClassifier.from_hparams(source="speechbrain/spkrec-ecapa-voxceleb", savedir=str(ROOT / ".cache/ecapa"))
def emb(y):
    y, _ = librosa.effects.trim(y, top_db=30); e = enc.encode_batch(torch.tensor(y)[None]).squeeze().numpy(); return e / np.linalg.norm(e)
ref = emb(librosa.load(A.ref, sr=16000)[0]) if A.ref else None
if A.asr == "mlx":
    import mlx_whisper
    asr = lambda f: mlx_whisper.transcribe(f, path_or_hf_repo="mlx-community/whisper-small-mlx")["text"]
else:
    import whisper; _m = whisper.load_model("small"); asr = lambda f: _m.transcribe(f)["text"]
norm = lambda s: re.sub(r"[^a-z0-9 ]", "", re.sub(r"\[.*?\]", "", s.lower())).split()
cfg = load("config/script.json"); picks = {}
for line in cfg["lines"]:
    rows = []
    for f in sorted(glob.glob(str(ROOT / f"audio/vo/lines/{line['id']}_s*.mp3"))):
        y, _ = librosa.load(f, sr=16000); t = asr(f).strip()
        match = difflib.SequenceMatcher(None, norm(line["text"]), norm(t)).ratio()
        sim = float(ref @ emb(y)) if ref is not None else 0.0
        rows.append((match * 2 + sim, match, sim, len(y) / 16000, f, t))
    if not rows: print("no takes for", line["id"]); continue
    rows.sort(reverse=True); picks[line["id"]] = str(pathlib.Path(rows[0][4]).relative_to(ROOT))
    for r in rows: print(f"{'*' if r is rows[0] else ' '} {line['id']:<12} match={r[1]:.2f} sim={r[2]:.2f} dur={r[3]:.1f}s  {pathlib.Path(r[4]).name}: {r[5]}")
(ROOT / "audio/vo/picks.json").write_text(json.dumps(picks, indent=1))
print("wrote audio/vo/picks.json (edit it by hand to override a pick, e.g. for pace)")
