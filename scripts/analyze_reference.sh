#!/usr/bin/env bash
# Study an example video you were given: contact sheets, loudness, transcript.  usage: scripts/analyze_reference.sh video.mp4 [outdir]
set -euo pipefail
V="$1"; O="${2:-research/$(basename "${V%.*}")}"; mkdir -p "$O"
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$V")
ffmpeg -loglevel error -y -i "$V" -vf "fps=24/$D,scale=480:-1,tile=6x4" -frames:v 1 "$O/overview.jpg"
ffmpeg -loglevel error -y -i "$V" -t 6 -vf "fps=6,scale=480:-1,tile=6x6" -frames:v 1 "$O/first6s.jpg"
ffmpeg -i "$V" -af ebur128 -f null - 2>&1 | grep -E " I:| LRA:" > "$O/loudness.txt" || true
(uvx --from mlx-whisper mlx_whisper --model mlx-community/whisper-small-mlx -f txt -o "$O" "$V" >/dev/null 2>&1 \
  || uvx --from openai-whisper whisper "$V" --model small --output_format txt --output_dir "$O" >/dev/null 2>&1) || echo "(no transcript)"
echo "duration ${D}s -> $O (overview.jpg, first6s.jpg, loudness.txt, transcript .txt if speech)"
