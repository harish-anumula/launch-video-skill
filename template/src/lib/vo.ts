import type { Tok } from "../components/Headline";
import { scene, wordAt } from "./time";

/** Headline lines built from a scene's spoken words, revealed as each is said. Words at `accent` indices get the serif accent;
 *  the last accent word gets the hand-drawn underline. `from`/`to` pick a slice of the line;
 *  `sentences: true` starts a new line after each . ? ! (good for short two-sentence lines). */
export const voLines = (
  id: string,
  o: { perLine?: number; accent?: number[]; from?: number; to?: number; breaks?: number[]; sentences?: boolean; accentColor?: string } = {},
): Tok[][] => {
  const s = scene(id);
  const idx = s.words.map((_, i) => i).slice(o.from ?? 0, o.to ?? s.words.length);
  const accent = new Set(o.accent ?? []);
  const lastAccent = Math.max(-1, ...(o.accent ?? []));
  const lines: Tok[][] = [];
  idx.forEach((i, k) => {
    const prev = k > 0 ? s.words[idx[k - 1]].w : "";
    const brk = o.breaks ? o.breaks.includes(i) : o.sentences ? /[.?!]$/.test(prev) : k % (o.perLine ?? 4) === 0;
    if (!lines.length || brk) lines.push([]);
    lines[lines.length - 1].push({
      text: s.words[i].w,
      at: wordAt(id, i),
      serif: accent.has(i),
      underline: i === lastAccent,
      color: accent.has(i) ? o.accentColor : undefined,
    });
  });
  return lines;
};
