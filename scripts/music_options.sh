#!/usr/bin/env bash
# One file with 14s excerpts of each candidate track (A, B, C...) so the person can choose by ear.
# usage: scripts/music_options.sh out.mp3 track_a.mp3 track_b.mp3 [...]   (excerpt start: START=20)
set -euo pipefail
OUT="$1"; shift; S="${START:-20}"; T=$(mktemp -d); args=(); n=0
ffmpeg -loglevel error -y -f lavfi -t 1.2 -i anullsrc=r=44100:cl=stereo "$T/gap.wav"
for f in "$@"; do ffmpeg -loglevel error -y -ss "$S" -t 14 -i "$f" -af "afade=t=in:d=0.5,afade=t=out:st=13:d=1" -ar 44100 -ac 2 "$T/$n.wav"
  args+=(-i "$T/$n.wav" -i "$T/gap.wav"); n=$((n+1)); done
ffmpeg -loglevel error -y "${args[@]}" -filter_complex "concat=n=$((n*2)):v=0:a=1,loudnorm=I=-16" "$OUT"; echo "wrote $OUT ($n options, in the order given)"
