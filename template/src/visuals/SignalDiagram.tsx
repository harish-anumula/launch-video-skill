import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain } from "../components/Grain";
import { Headline, Tok, tokLines } from "../components/Headline";
import { BEAT, clamp01, hash, lerp, ramp, rrect, springAt } from "../lib/kit";
import { useT } from "../lib/time";
import { C, EASE, MONO, SPRING, alpha, mix } from "../theme";

const CY = 690;
const A = { x: 430, y: CY }; // step 1: scattered points (violet: unseen, unsorted)
const Bn = { x: 960, y: CY, r: 104 }; // step 2: a ring that gathers them
const Cc = { x: 1480, y: CY, w: 330, h: 200 }; // step 3: the result (signal green)

/** Night Signal signature. A dark diagram built step by step with labelled parts, lit in two colours: violet for the hidden or
 *  unsorted, signal green for the result. Points of light drift (step 1), flow along a path into a ring that draws itself
 *  and pools them (step 2), then leave as green light into the result card, which glows once (step 3). The headline's
 *  accent phrase gets the painted underline and glow. Full-frame scene, 5 to 6 s; one idea per screen. */
export const SignalDiagram: React.FC<{
  dur?: number;
  title?: Tok[][];
  steps?: [string, string, string];
  result?: { kicker: string; lines: number };
}> = ({
  dur = 6,
  title = tokLines("Scattered updates become|*one clear summary.*", 0.15),
  steps = ["SCATTERED UPDATES", "READ AND SORT", "ONE SUMMARY"],
  result = { kicker: "08:00 · SUMMARY", lines: 3 },
}) => {
  const t = useT();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const B = BEAT;
  const s1 = 2 * B,
    s2 = 4 * B,
    s3 = 6 * B; // one step every bar of two beats, after the headline has landed
  const step = (at: number) => springAt(t - at, SPRING.card);
  const V = C.accent2;
  const G = C.brand;
  // path A -> B and B -> C (gentle arcs)
  const ab = `M ${A.x + 120} ${CY} C ${A.x + 220} ${CY - 70}, ${Bn.x - 220} ${CY - 70}, ${Bn.x - Bn.r - 14} ${CY}`;
  const bc = `M ${Bn.x + Bn.r + 14} ${CY} C ${Bn.x + 220} ${CY + 70}, ${Cc.x - Cc.w / 2 - 160} ${CY + 70}, ${Cc.x - Cc.w / 2 - 12} ${CY}`;
  const bez = (p0: number[], p1: number[], p2: number[], p3: number[], u: number) => {
    const m = 1 - u;
    return [0, 1].map((i) => m * m * m * p0[i] + 3 * m * m * u * p1[i] + 3 * m * u * u * p2[i] + u * u * u * p3[i]);
  };
  const onAB = (u: number) => bez([A.x + 120, CY], [A.x + 220, CY - 70], [Bn.x - 220, CY - 70], [Bn.x - Bn.r - 14, CY], u);
  const onBC = (u: number) =>
    bez([Bn.x + Bn.r + 14, CY], [Bn.x + 220, CY + 70], [Cc.x - Cc.w / 2 - 160, CY + 70], [Cc.x - Cc.w / 2 - 12, CY], u);
  const drawAB = ramp(t, s2 - 0.1, s2 + 0.5, EASE.inOut);
  const drawBC = ramp(t, s3 - 0.1, s3 + 0.45, EASE.inOut);
  const ringP = ramp(t, s2 + 0.2, s2 + 0.85, EASE.inOut);
  const ring = rrect(Bn.x, Bn.y, Bn.r * 2, Bn.r * 2, Bn.r);
  const card = rrect(Cc.x, Cc.y, Cc.w, Cc.h, 22);
  const cardP = ramp(t, s3 + 0.25, s3 + 0.85, EASE.inOut);
  const glowOnce = t < s3 + 0.9 ? 0 : Math.exp(-(t - s3 - 0.9) * 1.6);

  // Points of light. A few stay drifting around step 1 (more updates keep arriving); the rest loop: drift at step 1, travel
  // into the ring, pool there while they turn green, travel on into the result card, then reappear at step 1.
  const N = 24,
    AMBIENT = 8,
    P = 2.4;
  const home = (i: number) => {
    const r0 = 30 + hash(i * 3) * 95,
      a0 = hash(i * 7) * Math.PI * 2,
      drift = t * (0.35 + hash(i) * 0.4);
    return [A.x + Math.cos(a0 + drift) * r0, A.y + Math.sin(a0 + drift) * r0 * 0.75];
  };
  const pool = (i: number) => {
    const a = hash(i * 7) * Math.PI * 2 + t * 1.6,
      r = 30 + hash(i * 5) * 48;
    return [Bn.x + Math.cos(a) * r, Bn.y + Math.sin(a) * r];
  };
  const pts = Array.from({ length: N }, (_, i) => {
    const appear = clamp01((t - s1 - hash(i * 19) * 0.4) * 3);
    const base = { r: 4 + hash(i * 29) * 3, o: appear * (0.55 + 0.45 * hash(i * 23)) };
    const start = s2 + 0.3 + ((i - AMBIENT) / (N - AMBIENT)) * P;
    const jt = t - start;
    if (i < AMBIENT || jt < 0) {
      const h = home(i);
      return { ...base, x: h[0], y: h[1], col: V };
    }
    const c = jt % P;
    if (c < 0.75) {
      const u = EASE.inOut(c / 0.75);
      const h = home(i),
        q = onAB(u),
        k = (1 - u) * (1 - u);
      return { ...base, x: q[0] + k * (h[0] - (A.x + 120)), y: q[1] + k * (h[1] - CY), col: V };
    }
    if (c < 1.35) {
      const settle = EASE.out(clamp01((c - 0.75) / 0.3));
      const e = onAB(1),
        q = pool(i);
      return { ...base, x: lerp(e[0], q[0], settle), y: lerp(e[1], q[1], settle), col: mix(V, G, clamp01((c - 0.8) / 0.5)) };
    }
    if (c < 1.95) {
      const u = EASE.inOut((c - 1.35) / 0.6);
      const q = pool(i),
        e = onBC(u);
      const k = Math.min(1, u * 4);
      return { ...base, x: lerp(q[0], e[0], k), y: lerp(q[1], e[1], k), col: G };
    }
    if (c < 2.05) return { ...base, x: 0, y: 0, o: 0, col: G };
    const h = home(i);
    return { ...base, x: h[0], y: h[1], o: base.o * clamp01((c - 2.05) / 0.3), col: V };
  });

  const label = (x: number, y: number, n: number, text: string, at: number, col: string) => {
    const p = step(at);
    return (
      <div
        style={{
          position: "absolute",
          left: x - 220,
          width: 440,
          top: y,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 22,
          letterSpacing: "0.14em",
          color: C.inkSoft,
          opacity: clamp01(p * 1.4),
          translate: `0px ${(1 - p) * 16}px`,
        }}
      >
        <span style={{ color: col }}>0{n}</span>&nbsp;&nbsp;{text}
      </div>
    );
  };

  const push = 1 + 0.04 * ramp(t, 0, dur, EASE.inOut);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <AbsoluteFill style={{ scale: String(push), transformOrigin: "50% 60%" }}>
      <AbsoluteFill style={{ background: `radial-gradient(40% 50% at 78% 64%, ${alpha(G, 0.07 + 0.08 * glowOnce)} 0%, ${alpha(G, 0)} 100%)` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id={`g${uid}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1.2" fill={C.inkSoft} />
          </pattern>
          <filter id={`b${uid}`} x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id={`c${uid}`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>
        <rect width="1920" height="1080" fill={`url(#g${uid})`} opacity={0.07} />

        {/* connections, drawn as their step lands */}
        <path d={ab} fill="none" stroke={V} strokeOpacity={0.35} strokeWidth={2} pathLength={1} strokeDasharray={`${drawAB} 1`} />
        <path d={bc} fill="none" stroke={G} strokeOpacity={0.45} strokeWidth={2} pathLength={1} strokeDasharray={`${drawBC} 1`} />

        {/* step 2: the ring */}
        <circle cx={Bn.x} cy={Bn.y} r={Bn.r} fill={C.card} opacity={ringP} />
        <path d={ring.d} fill="none" stroke={mix(V, G, ramp(t, s2 + 1.2, s3 + 0.3))} strokeWidth={2.5} strokeDasharray={`${ring.len} ${ring.len}`} strokeDashoffset={ring.len * (1 - ringP)} />

        {/* step 3: the result card */}
        <path d={card.d} fill={C.card} opacity={cardP} />
        <path d={card.d} fill="none" stroke={G} strokeWidth={8} opacity={0.5 * glowOnce} filter={`url(#c${uid})`} />
        <path d={card.d} fill="none" stroke={mix(C.line, G, cardP)} strokeWidth={2} strokeDasharray={`${card.len} ${card.len}`} strokeDashoffset={card.len * (1 - cardP)} />
        {Array.from({ length: result.lines }, (_, k) => {
          const lp = ramp(t, s3 + 0.6 + k * 0.12, s3 + 1.0 + k * 0.12, EASE.out);
          const w = [230, 190, 150][k % 3];
          return <rect key={k} x={Cc.x - Cc.w / 2 + 34} y={Cc.y - 22 + k * 30} width={w * lp} height={10} rx={5} fill={k === 0 ? C.ink : C.inkSoft} opacity={k === 0 ? 0.9 : 0.5} />;
        })}

        {/* points of light: a soft halo plus a bright core */}
        {pts.map((p, i) =>
          p.o > 0.01 ? (
            <g key={i} opacity={p.o}>
              <circle cx={p.x} cy={p.y} r={p.r * 3.2} fill={p.col} opacity={0.35} filter={`url(#b${uid})`} />
              <circle cx={p.x} cy={p.y} r={p.r} fill={mix(p.col, "#FFFFFF", 0.35)} />
            </g>
          ) : null,
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          left: Cc.x - Cc.w / 2 + 34,
          top: Cc.y - Cc.h / 2 + 24,
          fontFamily: MONO,
          fontSize: 20,
          letterSpacing: "0.12em",
          color: G,
          opacity: ramp(t, s3 + 0.5, s3 + 0.8),
        }}
      >
        {result.kicker}
      </div>
      {label(A.x, CY + 175, 1, steps[0], s1, V)}
      {label(Bn.x, CY + 175, 2, steps[1], s2, mix(V, G, 0.5))}
      {label(Cc.x, CY + 175, 3, steps[2], s3, G)}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 150, top: 140 }}>
        <Headline t={t} size={88} lines={title} />
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
