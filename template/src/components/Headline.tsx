import React from "react";
import { clampI } from "../lib/time";
import { C, DISPLAY, EASE, MONO, SERIF, TEXT, TYPE } from "../theme";

export type Tok = {
  text: string;
  at: number; // scene seconds when the word starts revealing
  serif?: boolean; // italic serif accent
  color?: string;
  underline?: boolean; // hand-drawn underline stroke
  highlight?: string; // marker highlight colour behind the word
};

const Underline: React.FC<{ p: number; color: string }> = ({ p, color }) => {
  const len = 420;
  const id = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const painted = TYPE.underlineStyle === "painted";
  const d = "M3 15 C 40 8, 80 19, 120 11 S 180 9, 197 13";
  const dash = { strokeDasharray: len, strokeDashoffset: len * (1 - p) };
  return (
    <svg
      viewBox="0 0 200 24"
      preserveAspectRatio="none"
      style={{ position: "absolute", left: "-2%", bottom: "-0.08em", width: "104%", height: "0.26em", overflow: "visible" }}
    >
      {painted && (
        <defs>
          {/* a rough painted edge, plus a soft glow of the same colour */}
          <filter id={`pe${id}`} x="-5%" y="-150%" width="110%" height="400%">
            <feTurbulence type="fractalNoise" baseFrequency="0.08 0.9" numOctaves={2} seed={4} />
            <feDisplacementMap in="SourceGraphic" scale={4} />
          </filter>
          <filter id={`pg${id}`} x="-10%" y="-300%" width="120%" height="700%">
            <feGaussianBlur stdDeviation={3} />
          </filter>
        </defs>
      )}
      {painted && <path d={d} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" opacity={0.32} filter={`url(#pg${id})`} {...dash} />}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={painted ? 6 : 5}
        strokeLinecap="round"
        filter={painted ? `url(#pe${id})` : undefined}
        {...dash}
      />
    </svg>
  );
};

/** Word-by-word masked reveal (slide up + de-blur), with serif / underline / highlight accents.
 *  Timing, weight, tracking and the accent style come from the preset (theme.ts). */
export const Headline: React.FC<{
  lines: Tok[][];
  t: number;
  size?: number;
  color?: string;
  accent?: string;
  weight?: number;
  lineHeight?: number;
  align?: "left" | "center";
  exitAt?: number;
  wordIn?: number; // seconds for one word's rise (default: the preset's)
  style?: React.CSSProperties;
}> = ({
  lines,
  t,
  size = 96,
  color = C.ink,
  accent = C.brand,
  weight = TYPE.weight,
  lineHeight = 1.04,
  align = "left",
  exitAt,
  wordIn = TEXT.wordIn,
  style,
}) => {
  const serifAccent = TYPE.accent === "serif";
  const exit = exitAt === undefined ? 0 : clampI(t, [exitAt, exitAt + 0.35], [0, 1], EASE.in);
  return (
    <div
      style={{
        fontFamily: DISPLAY,
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: TYPE.tracking,
        lineHeight,
        textAlign: align,
        opacity: exit >= 1 ? 0 : 1 - exit * 0.4,
        ...style,
      }}
    >
      {lines.map((line, li) => (
        <div
          key={li}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: "0.24em" }}
        >
          {line.map((tok, i) => {
            const p = clampI(t, [tok.at, tok.at + wordIn], [0, 1], EASE.out);
            const hp = clampI(t, [tok.at + 0.15, tok.at + 0.6], [0, 1], EASE.out);
            const up = clampI(t, [tok.at + 0.25, tok.at + 0.95], [0, 1], EASE.inOut);
            return (
              <span
                key={i}
                style={{ display: "inline-block", overflow: "hidden", padding: "0.06em 0.04em 0.16em", margin: "-0.06em -0.04em -0.16em" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    position: "relative",
                    translate: `0px ${(1 - p) * 105 + exit * -105}%`,
                    filter: TEXT.blurPx ? `blur(${(1 - p) * TEXT.blurPx}px)` : undefined,
                    opacity: Math.min(p * 1.4, 1),
                    fontFamily: tok.serif && serifAccent ? SERIF : undefined,
                    fontWeight: tok.serif && serifAccent ? 400 : undefined,
                    fontSize: tok.serif && serifAccent ? "1.14em" : undefined,
                    letterSpacing: tok.serif && serifAccent ? "-0.01em" : undefined,
                    color: tok.color ?? (tok.serif ? accent : undefined),
                  }}
                >
                  {tok.highlight && (
                    <span
                      style={{
                        position: "absolute",
                        left: "-0.06em",
                        right: "-0.06em",
                        top: "0.12em",
                        bottom: "0.02em",
                        background: tok.highlight,
                        borderRadius: "0.08em",
                        transformOrigin: "left center",
                        scale: `${hp} 1`,
                        zIndex: -1,
                      }}
                    />
                  )}
                  {tok.text}
                  {tok.underline && TYPE.underline && <Underline p={up} color={tok.color ?? accent} />}
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Small mono section label, e.g. "// 01 — connect". */
export const Label: React.FC<{ text: string; t: number; at?: number; color?: string; size?: number }> = ({
  text,
  t,
  at = 0,
  color = C.inkSoft,
  size = 20,
}) => {
  const n = Math.floor(clampI(t, [at, at + 0.4], [0, text.length], (x) => x));
  return (
    <div style={{ fontFamily: MONO, fontSize: size, letterSpacing: "0.02em", color, whiteSpace: "pre" }}>
      {text.slice(0, n)}
      <span style={{ opacity: n < text.length ? 1 : 0 }}>▍</span>
    </div>
  );
};

/** Headline lines from plain text for scenes without voiceover: "|" breaks a line, *one or more words* mark the accent
 *  (the last accent word also gets the underline). Words start at `start` seconds, `gap` apart (default: the preset's gap). */
export const tokLines = (text: string, start = 0.2, gap = TEXT.wordGap): Tok[][] => {
  let inAccent = false;
  const lines = text.split("|").map((line) =>
    line
      .trim()
      .split(/\s+/)
      .map((w) => {
        if (w.startsWith("*")) inAccent = true;
        const tok: Tok = { text: w.replace(/\*/g, ""), at: 0, serif: inAccent };
        if (w.endsWith("*")) inAccent = false;
        return tok;
      }),
  );
  const flat = lines.flat();
  flat.forEach((tok, i) => (tok.at = start + gap * i));
  const last = flat.filter((x) => x.serif).pop();
  if (last) last.underline = true;
  return lines;
};
