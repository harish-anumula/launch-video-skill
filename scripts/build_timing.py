"""Snap scene cuts to the music's beats, place each VO line, and write the timing file the Remotion scenes read.
usage: uvx --python 3.11 --with librosa python scripts/build_timing.py audio/music/<track>.mp3 [--snap 0.3]
reads config/timeline.json + audio/vo/picks.json; copies audio into video/public/{music,vo}; writes video/src/data/timing.json."""
import argparse, json, shutil, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
from _common import ROOT, load
import librosa, numpy as np
ap = argparse.ArgumentParser(); ap.add_argument("track"); ap.add_argument("--snap", type=float, default=0.3); A = ap.parse_args()
tl = load("config/timeline.json"); picks = load("audio/vo/picks.json")
y, sr = librosa.load(A.track, sr=22050); tempo, bf = librosa.beat.beat_track(y=y, sr=sr); beats = librosa.frames_to_time(bf, sr=sr)
def snap(t):
    if t <= 0 or not len(beats): return max(t, 0.0)
    b = float(beats[np.abs(beats - t).argmin()]); return b if abs(b - t) <= A.snap else t
pub = ROOT / "video/public"; (pub / "vo").mkdir(parents=True, exist_ok=True); (pub / "music").mkdir(exist_ok=True)
shutil.copy(A.track, pub / "music/track.mp3")
scenes = []
for s in tl["scenes"]:
    words, dur, vo = [], 0.0, None
    if s["id"] in picks:
        src = ROOT / picks[s["id"]]; shutil.copy(src, pub / f"vo/{s['id']}.mp3"); vo = f"vo/{s['id']}.mp3"
        words = json.loads(src.with_suffix(".json").read_text())["words"]; dur = librosa.get_duration(path=str(src))
    scenes.append({"id": s["id"], "start": round(snap(s["start"]), 3), "voOffset": round(s.get("vo_at", s["start"] + 0.3) - s["start"], 3),
                   "voDur": round(dur, 3), "vo": vo, "words": words})
end = tl["scenes"][-1]["end"]
for a, b in zip(scenes, scenes[1:] + [{"start": end}]): a["end"] = b["start"]
out = {"fps": tl.get("fps", 30), "tempo": float(np.atleast_1d(tempo)[0]), "duration": end, "music": "music/track.mp3", "scenes": scenes}
(ROOT / "video/src/data").mkdir(parents=True, exist_ok=True)
(ROOT / "video/src/data/timing.json").write_text(json.dumps(out, indent=1))
for s in scenes: print(f"{s['id']:<12} {s['start']:6.2f}-{s['end']:6.2f}  vo {s['voDur']:.1f}s  slack {s['end']-s['start']-s['voOffset']-s['voDur']:+.1f}s")
