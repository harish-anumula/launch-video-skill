"""Measure tracks so the edit can follow the music: tempo, first beat, loudness per second.
usage: uvx --python 3.11 --with librosa python scripts/music_qa.py audio/music/a.mp3 [audio/music/b.mp3 ...]"""
import sys, librosa, numpy as np
for f in sys.argv[1:]:
    y, sr = librosa.load(f, sr=22050)
    tempo, bf = librosa.beat.beat_track(y=y, sr=sr); bt = librosa.frames_to_time(bf, sr=sr)
    rms = librosa.feature.rms(y=y, frame_length=sr, hop_length=sr)[0]
    print(f"{f}: {len(y)/sr:.1f}s  tempo≈{float(np.atleast_1d(tempo)[0]):.1f} BPM  first beat {bt[0] if len(bt) else float('nan'):.2f}s  beats {len(bt)}")
    print("  dB/s: " + " ".join(f"{i}:{20*np.log10(v+1e-9):.0f}" for i, v in enumerate(rms)))
print("Look for: a silent intro (lift it), an early fade (stretch the track), and a quiet dip you can use for the payoff.")
