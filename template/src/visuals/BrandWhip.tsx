import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain } from "../components/Grain";
import { Headline, Tok, tokLines } from "../components/Headline";
import { LogoMark, Wordmark } from "../components/Logo";
import { BEAT, MotionBlur, lerp, ramp } from "../lib/kit";
import { PRESETS } from "../presets";
import { C, EASE, GRAIN, onFill } from "../theme";

const CLEAN = PRESETS["clean-launch"].text;

/** Fast Concept signature. Two blocks reveal the brand. A near-black block whips in from the right (skew plus real motion
 *  blur) and covers the frame exactly on the beat while the logo lockup assembles; one bar later the brand block rises in
 *  pill-shaped bars and the tagline builds at half the Clean Launch headline time. Full-frame scene, 4 to 6 s.
 *  Set `lead` to the seconds the whip starts before the beat (the scene's Sequence must start that early). */
export const BrandWhip: React.FC<{
  dur?: number;
  lead?: number;
  nameAt?: number; // seconds when the lockup assembles (default: the beat)
  secondAt?: number; // seconds when the brand block starts rising
  tagline?: Tok[][];
}> = ({ dur = 5, lead = 0.4, nameAt = 0, secondAt = 4 * BEAT, tagline }) => {
  const half = CLEAN.wordIn / 2; // the tagline builds in half the Clean Launch headline time
  const lines = tagline ?? tokLines("Your team's work,|in *one place.*", secondAt + 0.45, CLEAN.wordGap / 2);
  const bars = 6;
  const barAt = (i: number) => secondAt + i * 0.04;
  const moving = (t: number) => (t > -lead && t < 0.05) || (t > secondAt - 0.02 && t < barAt(bars - 1) + 0.4);
  const ink = onFill(C.block);
  const onB = onFill(C.brand);
  const clipId = "bw" + React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const render = (t: number) => {
    const whip = ramp(t, -lead, 0, EASE.inOut);
    const push = 1 + 0.035 * ramp(t, 0, dur, EASE.inOut);
    const w = 1920 / bars;
    const rise = (i: number) => EASE.snap(Math.max(0, Math.min(1, (t - barAt(i)) / 0.36)));
    const second = rise(bars - 1) > 0 || rise(0) > 0;
    const lockSmall = ramp(t, secondAt + 0.1, secondAt + 0.6, EASE.inOut);
    const cid = `${clipId}${Math.round((t + 10) * 3000)}`; // one clip per motion-blur sample
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        {/* block 1: whips in from the right */}
        <AbsoluteFill
          style={{
            background: C.block,
            transform: `translateX(${(1 - whip) * 2300}px) skewX(${(1 - whip) * -12}deg)`,
            transformOrigin: "0% 100%",
          }}
        >
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", scale: String(push) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 40, translate: `0px ${lerp(0, -40, ramp(t, 0, 0.6, EASE.out))}px` }}>
              <LogoMark size={220} color={ink} p={ramp(t, nameAt - 0.05, nameAt + 0.55)} />
              <Wordmark height={220} color={ink} p={ramp(t, nameAt + 0.1, nameAt + 0.6)} />
            </div>
          </AbsoluteFill>
          <Grain opacity={GRAIN.block} blend="soft-light" />
        </AbsoluteFill>
        {/* block 2: brand colour rises in pill bars, staggered 40 ms */}
        {second && (
          <>
          <svg width={0} height={0} style={{ position: "absolute" }}>
            <defs>
              <clipPath id={cid}>
                {Array.from({ length: bars }, (_, i) => (
                  <rect key={i} x={i * w - 0.5} y={lerp(1080 + w / 2, -w / 2, rise(i))} width={w + 1} height={1400} rx={w / 2} />
                ))}
              </clipPath>
            </defs>
          </svg>
          <AbsoluteFill style={{ background: C.brand, clipPath: `url(#${cid})` }}>
            <AbsoluteFill style={{ scale: String(push) }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: lerp(390, 290, lockSmall),
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: lerp(40, 22, lockSmall),
                  scale: String(lerp(1, 0.45, lockSmall)),
                }}
              >
                <LogoMark size={220} color={onB} />
                <Wordmark height={220} color={onB} />
              </div>
              <div style={{ position: "absolute", left: 0, right: 0, top: 490 }}>
                <Headline t={t} lines={lines} size={112} color={onB} accent={onB} align="center" wordIn={half} />
              </div>
            </AbsoluteFill>
            <Grain opacity={GRAIN.block} blend="soft-light" />
          </AbsoluteFill>
          </>
        )}
      </AbsoluteFill>
    );
  };
  // MotionBlur hands each sample its own Sequence time; the scene clock starts `lead` seconds in
  return <MotionBlur samples={32} shutter={0.6} render={(ts) => render(ts - lead)} enabled={(ts) => moving(ts - lead)} />;
};
