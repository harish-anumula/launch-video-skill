"""Shared helpers. Project layout (run scripts from the project root):
  config/script.json   config/timeline.json   config/music.json
  audio/vo/lines/      audio/music/           video/ (Remotion project)
The ElevenLabs key is read from $ELEVENLABS_API_KEY, or from a git-ignored ./.env (ELEVENLABS_API_KEY=...)."""
import json, os, pathlib, sys

ROOT = pathlib.Path.cwd()

def api_key() -> str:
    k = os.environ.get("ELEVENLABS_API_KEY")
    env = ROOT / ".env"
    if not k and env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("ELEVENLABS_API_KEY="):
                k = line.split("=", 1)[1].strip()
    if not k:
        sys.exit("Set ELEVENLABS_API_KEY (environment or ./.env). Never commit it.")
    return k

def load(rel: str):
    p = ROOT / rel
    if not p.exists():
        sys.exit(f"missing {rel} (copy it from the skill's template/config/*.example.json)")
    return json.loads(p.read_text())

def words_from_alignment(al: dict):
    """Group ElevenLabs character timings into words; drop [bracketed] delivery tags."""
    import re
    words, cur, ws, pe = [], "", 0.0, 0.0
    for c, s, e in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if c.isspace():
            if cur: words.append({"w": cur, "s": ws, "e": pe}); cur = ""
        else:
            if not cur: ws = s
            cur += c; pe = e
    if cur: words.append({"w": cur, "s": ws, "e": pe})
    return [w for w in words if not re.fullmatch(r"\[.*\]", w["w"])]
