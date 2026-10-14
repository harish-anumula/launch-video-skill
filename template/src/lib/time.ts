import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, EasingFunction } from "remotion";
import timing from "../data/timing.json";
import { EASE } from "../theme";

export type Word = { w: string; s: number; e: number };
export type SceneTiming = { id: string; start: number; end: number; voOffset: number; voDur: number; vo: string | null; words: Word[] };
export const TIMING = timing as { fps: number; tempo: number; duration: number; music: string | null; scenes: SceneTiming[] };
export const scene = (id: string) => {
  const s = TIMING.scenes.find((x) => x.id === id);
  if (!s) throw new Error(`scene "${id}" missing from data/timing.json`);
  return s;
};
/** Scene-relative time (s) when the i-th spoken word starts (or ends). */
export const wordAt = (id: string, i: number, edge: "s" | "e" = "s") => {
  const s = scene(id);
  if (!s.words.length) return s.voOffset + i * 0.38;
  return s.voOffset + s.words[Math.min(i, s.words.length - 1)][edge];
};
/** Seconds since this Sequence started, minus an optional lead-in (negative during a transition-in). */
/** Entrance speed for the scene inside (1 = as authored). Wrap a scene in <SpeedCtx.Provider value={1.6}> to land content faster, then hold. */
export const SpeedCtx = React.createContext(1);
export const useT = (lead = 0) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (f / fps) * React.useContext(SpeedCtx) - lead;
};
export const clampI = (t: number, input: number[], output: number[], easing: EasingFunction = EASE.out) =>
  interpolate(t, input, output, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
/** Spring 0..1 starting `at` seconds (scene time). */
export const useSpringAt = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (at: number, config: Parameters<typeof spring>[0]["config"], lead = 0) =>
    spring({ frame: f - Math.round((at + lead) * fps), fps, config });
};
export const rand = (seed: number) => {
  const x = Math.sin(seed * 9301.1 + 49297.7) * 233280.3;
  return x - Math.floor(x);
};
