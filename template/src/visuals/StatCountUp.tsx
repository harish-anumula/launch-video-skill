import React from "react";
import { clampI } from "../lib/time";
import { C, EASE, MONO, SANS } from "../theme";

/** One big number counting up, with a caption. Only use numbers that are true and approved for publication. */
export const StatCountUp: React.FC<{
  t: number;
  at: number;
  value: number;
  format?: (v: number) => string;
  caption: string;
  color?: string;
}> = ({ t, at, value, format = (v) => Math.round(v).toLocaleString("en-US"), caption, color = C.ink }) => {
  const p = clampI(t, [at, at + 1.2], [0, 1], EASE.out);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 420,
        textAlign: "center",
        fontFamily: SANS,
        color,
        opacity: clampI(t, [at, at + 0.2], [0, 1]),
      }}
    >
      <div style={{ fontSize: 220, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1 }}>{format(value * p)}</div>
      <div style={{ fontFamily: MONO, fontSize: 26, marginTop: 18, opacity: 0.7 }}>{caption}</div>
    </div>
  );
};
