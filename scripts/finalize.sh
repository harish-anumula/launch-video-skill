#!/usr/bin/env bash
# Loudness-normalize a render, embed a cover image, and write QA artefacts (1 fps contact sheet, loudness, transcript).
# usage: scripts/finalize.sh raw.mp4 final.mp4 [cover.jpg]
set -euo pipefail
IN="$1"; OUT="$2"; COVER="${3:-}"
if [ -n "$COVER" ]; then
  ffmpeg -loglevel error -y -i "$IN" -i "$COVER" -map 0:v -map 0:a -map 1 -c:v:0 copy -af loudnorm=I=-14:TP=-1.0:LRA=7 -ar 48000 -c:a aac -b:a 256k -c:v:1 mjpeg -disposition:v:1 attached_pic "$OUT"
else
  ffmpeg -loglevel error -y -i "$IN" -c:v copy -af loudnorm=I=-14:TP=-1.0:LRA=7 -ar 48000 -c:a aac -b:a 256k "$OUT"
fi
ffmpeg -loglevel error -y -i "$OUT" -map 0:v:0 -vf "fps=1,scale=400:-1,tile=8x10" -frames:v 1 "${OUT%.*}-sheet.jpg"
ffmpeg -hide_banner -i "$OUT" -af ebur128 -f null - 2>&1 | grep -A6 Summary | grep -E " I:|Peak" || true
(uvx --from mlx-whisper mlx_whisper --model mlx-community/whisper-small-mlx -f txt -o "$(dirname "$OUT")" "$OUT" >/dev/null 2>&1 \
  || uvx --from openai-whisper whisper "$OUT" --model small --output_format txt --output_dir "$(dirname "$OUT")" >/dev/null 2>&1) && echo "transcript written next to $OUT" || true
