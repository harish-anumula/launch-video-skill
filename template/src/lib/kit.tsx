// Motion kit for the signature scenes: analytic springs and ramps that work on fractional times, and real motion blur.
// Plain React and SVG; no extra dependencies.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { SpringCfg } from "../presets";
import { TIMING } from "./time";

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** 0..1 ramp from `a` to `b` seconds, eased. Unlike interpolate() it takes any time, so motion blur samples stay smooth. */
export const ramp = (t: number, a: number, b: number, e: (x: number) => number = (x) => x) => e(clamp01((t - a) / (b - a)));
/** Deterministic noise in [0, 1). */
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** One beat of the music grid in seconds (data/timing.json `tempo`). Signature scenes place their moves on these. */
export const BEAT = 60 / (TIMING.tempo || 120);

/** Damped spring 0 -> 1 starting at t = 0 seconds, from a Remotion-style config (mass, damping, stiffness).
 *  Solved in closed form, so it can be sampled between frames. */
export const springAt = (t: number, cfg: SpringCfg) => {
  if (t <= 0) return 0;
  const m = cfg.mass ?? 1;
  const k = cfg.stiffness ?? 100;
  const c = cfg.damping ?? 10;
  const w = Math.sqrt(k / m);
  const z = c / (2 * Math.sqrt(k * m));
  if (z < 1) {
    const wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + ((z * w) / wd) * Math.sin(wd * t));
  }
  if (z === 1) return 1 - Math.exp(-w * t) * (1 + w * t);
  const s = Math.sqrt(z * z - 1);
  const r1 = -w * (z - s);
  const r2 = -w * (z + s);
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
};

/** Real motion blur: renders `samples` opaque copies of the scene across the shutter and averages them.
 *  Samples run forward in time, so a hard cut on a frame boundary stays hard. `render` must paint its own background.
 *  Pass `enabled` to switch it off on held frames (it costs one render per sample). */
export const MotionBlur: React.FC<{
  samples?: number;
  shutter?: number; // fraction of a frame the shutter stays open
  render: (t: number) => React.ReactNode;
  enabled?: (t: number) => boolean;
}> = ({ samples = 10, shutter = 0.5, render, enabled }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t0 = frame / fps;
  const n = enabled && !enabled(t0) ? 1 : samples;
  const layers: React.ReactNode[] = [];
  for (let k = 0; k < n; k++) {
    layers.push(
      <AbsoluteFill key={k} style={{ opacity: 1 / (k + 1) }}>
        {render(t0 + (k / n) * (shutter / fps))}
      </AbsoluteFill>,
    );
  }
  return <AbsoluteFill>{layers}</AbsoluteFill>;
};

/** Rounded rectangle path with its exact perimeter, for stroke draw-ons. */
export const rrect = (cx: number, cy: number, w: number, h: number, r: number) => {
  const x = cx - w / 2,
    y = cy - h / 2;
  const d = `M ${x + r} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} V ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + h - r} V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`;
  return { d, len: 2 * (w + h - 4 * r) + 2 * Math.PI * r };
};

type Pt = readonly [number, number];
/** Right-angle route through points with rounded corners: the path, its exact length, and the point at any length. */
export const route = (pts: Pt[], r = 22) => {
  type Seg = { kind: "L"; a: Pt; b: Pt; len: number } | { kind: "A"; c: Pt; r: number; a0: number; da: number; len: number };
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  const segs: Seg[] = [];
  let cur: Pt = pts[0];
  const addL = (a: Pt, b: Pt) => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (l > 0) segs.push({ kind: "L", a, b, len: l });
  };
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i];
    if (i < pts.length - 1) {
      const n = pts[i + 1];
      const din: Pt = [Math.sign(p[0] - cur[0]), Math.sign(p[1] - cur[1])];
      const dout: Pt = [Math.sign(n[0] - p[0]), Math.sign(n[1] - p[1])];
      const a: Pt = [p[0] - din[0] * r, p[1] - din[1] * r];
      const b: Pt = [p[0] + dout[0] * r, p[1] + dout[1] * r];
      addL(cur, a);
      const cross = din[0] * dout[1] - din[1] * dout[0];
      const c: Pt = [a[0] + dout[0] * r, a[1] + dout[1] * r];
      const a0 = Math.atan2(a[1] - c[1], a[0] - c[0]);
      segs.push({ kind: "A", c, r, a0, da: (cross > 0 ? 1 : -1) * (Math.PI / 2), len: (Math.PI * r) / 2 });
      d += ` L ${a[0]} ${a[1]} A ${r} ${r} 0 0 ${cross > 0 ? 1 : 0} ${b[0]} ${b[1]}`;
      cur = b;
    } else {
      addL(cur, p);
      d += ` L ${p[0]} ${p[1]}`;
    }
  }
  const len = segs.reduce((acc, q) => acc + q.len, 0);
  const at = (sv: number): Pt => {
    let x = Math.max(0, Math.min(len, sv));
    for (const q of segs) {
      if (x <= q.len) {
        const k = x / q.len;
        if (q.kind === "L") return [q.a[0] + (q.b[0] - q.a[0]) * k, q.a[1] + (q.b[1] - q.a[1]) * k];
        const ang = q.a0 + q.da * k;
        return [q.c[0] + Math.cos(ang) * q.r, q.c[1] + Math.sin(ang) * q.r];
      }
      x -= q.len;
    }
    return pts[pts.length - 1];
  };
  return { d, len, at };
};
export type Route = ReturnType<typeof route>;
