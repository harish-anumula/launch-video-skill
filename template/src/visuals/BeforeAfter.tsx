import React from "react";
import { clampI } from "../lib/time";
import { C, EASE, MONO } from "../theme";

/** Two states in one frame; a vertical wipe reveals "after" over "before" at `at`. Good for cleanups, automation, redesigns,
 *  "from 40 tabs to one view". Pass any two nodes of the same size. */
export const BeforeAfter: React.FC<{
  t: number;
  at: number;
  before: React.ReactNode;
  after: React.ReactNode;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  labels?: [string, string];
}> = ({ t, at, before, after, x = 360, y = 380, w = 1200, h = 600, labels = ["BEFORE", "AFTER"] }) => {
  const p = clampI(t, [at, at + 0.9], [0, 1], EASE.inOut);
  const tag = (s: string, show: number) => (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        fontFamily: MONO,
        fontSize: 15,
        letterSpacing: "0.08em",
        color: C.inkSoft,
        background: "#fff",
        padding: "4px 10px",
        borderRadius: 6,
        opacity: show,
      }}
    >
      {s}
    </div>
  );
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: "0 30px 80px -30px rgba(17,19,24,0.35)",
      }}
    >
      <div style={{ position: "absolute", inset: 0 }}>
        {before}
        {tag(labels[0], 1 - p)}
      </div>
      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>
        {after}
        {tag(labels[1], p)}
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${p * 100}%`,
          width: 4,
          marginLeft: -2,
          background: C.brand,
          opacity: p > 0 && p < 1 ? 1 : 0,
        }}
      />
    </div>
  );
};
