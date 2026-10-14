# Audio: voiceover, music, mix

## Voiceover or music only?
- VO + music when the product category needs a sentence of explanation, or for LinkedIn/exec audiences. Burn the words in as kinetic type anyway (feeds autoplay muted).
- Music only suits design-led brands and well-understood products.

## ElevenLabs TTS (check current docs; APIs change)
- Endpoint with timings: `POST /v1/text-to-speech/{voice_id}/with-timestamps` → `audio_base64` + `alignment` (characters with start/end seconds). Group characters into words for animation.
- Models: an expressive model (e.g. `eleven_v3`) for character reads with inline tags like `[whispers]`; `eleven_multilingual_v2` for a steady, safe read; newer models may exist — compare takes.
- Settings to start from: stability 0.5, similarity_boost 0.8, style 0, speaker boost on; fix `seed` per take for reproducibility.
- Output format: higher bitrates can require higher plan tiers; `mp3_44100_128` works on all paid plans.
- Generate each line separately (3 takes), then pick by transcript match + speaker similarity (`scripts/vo_pick.py`).
- Premade voices are safe to use commercially under the provider's terms. Don't clone someone's voice without consent.

## Music
- ElevenLabs Music: `POST /v1/music`. Prompt-only (`prompt`, `music_length_ms`, `force_instrumental: true`) or a composition plan. Plan shapes differ by model (older models: `sections` with local styles; newer: `chunks` with `text`, `duration_ms`, `positive_styles`) — read the current API reference before calling.
- Expect the requested BPM and section boundaries to be ignored; measure the result and adapt the edit.
- Royalty-free alternatives: Pixabay Music, YouTube Audio Library, Uppbeat, or a paid library (Artlist, Musicbed, Epidemic Sound).
- Search words that work: "minimal electronic", "warm plucks", "soft punchy kick", "airy pads", "confident, optimistic", 100–125 BPM, a lift ~70% through.

## Mix
- Music ~8 dB under the VO during speech; lift the very quiet intro of a track if the hook would otherwise be silent.
- A payoff line gets a gentle dip (to ~70%), never a drop to near silence.
- Fade out over the last 1.5s.
- Master to −14 LUFS integrated, −1 dBTP: `ffmpeg -i in.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.0:LRA=7 -ar 48000 -c:a aac -b:a 256k out.mp4`.
- QA: transcribe the final mix (Whisper) and diff against the script; measure loudness with `-af ebur128`.
