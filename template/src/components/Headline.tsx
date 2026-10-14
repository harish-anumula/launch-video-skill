import React from "react";
import { clampI } from "../lib/time";
import { C, EASE, MONO, SANS, SERIF } from "../theme";

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
  return (
    <svg
      viewBox="0 0 200 24"
      preserveAspectRatio="none"
      style={{ position: "absolute", left: "-2%", bottom: "-0.08em", width: "104%", height: "0.26em", overflow: "visible" }}
    >
      <path
        d="M3 15 C 40 8, 80 19, 120 11 S 180 9, 197 13"
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
    </svg>
  );
};

/** Word-by-word masked reveal (slide up + de-blur), with serif / underline / highlight accents. */
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
  style?: React.CSSProperties;
}> = ({ lines, t, size = 96, color = C.ink, accent = C.brand, weight = 600, lineHeight = 1.04, align = "left", exitAt, style }) => {
  const exit = exitAt === undefined ? 0 : clampI(t, [exitAt, exitAt + 0.35], [0, 1], EASE.in);
  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: "-0.04em",
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
            const p = clampI(t, [tok.at, tok.at + 0.55], [0, 1], EASE.out);
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
                    filter: `blur(${(1 - p) * 10}px)`,
                    opacity: Math.min(p * 1.4, 1),
                    fontFamily: tok.serif ? SERIF : undefined,
                    fontWeight: tok.serif ? 400 : undefined,
                    fontSize: tok.serif ? "1.14em" : undefined,
                    letterSpacing: tok.serif ? "-0.01em" : undefined,
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
                  {tok.underline && <Underline p={up} color={tok.color ?? accent} />}
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
