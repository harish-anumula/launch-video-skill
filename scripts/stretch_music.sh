#!/usr/bin/env bash
# Fit a track to the edit: time-stretch so its natural ending lands at TARGET seconds, and lift a too-quiet intro.
# usage: scripts/stretch_music.sh in.mp3 out.mp3 <content_end_s> <target_end_s> [intro_gain=3.2] [intro_s=9]
set -euo pipefail
IN="$1"; OUT="$2"; END="$3"; TGT="$4"; G="${5:-3.2}"; I="${6:-9}"; T=$(mktemp -d)
R=$(python3 -c "print(round($END/$TGT,5))")   # tempo ratio (<1 slows down)
ffmpeg -loglevel error -y -i "$IN" -ar 44100 "$T/a.wav"
if command -v rubberband >/dev/null; then rubberband -q --fine -T "$R" "$T/a.wav" "$T/b.wav"; else ffmpeg -loglevel error -y -i "$T/a.wav" -af "atempo=$R" "$T/b.wav"; fi
ffmpeg -loglevel error -y -i "$T/b.wav" -af "volume='if(lt(t,$I),$G,if(lt(t,$I+7),$G-($G-1)*(t-$I)/7,1))':eval=frame" -b:a 192k "$OUT"
echo "wrote $OUT (tempo ratio $R)"
