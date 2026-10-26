import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain } from "../components/Grain";
import { Headline, Tok, tokLines } from "../components/Headline";
import { BEAT, lerp, ramp, springAt } from "../lib/kit";
import { useT } from "../lib/time";
import { C, DISPLAY, EASE, MONO, SPRING, mix } from "../theme";

const CX = 1250; // the chart sits in the right column; the headline takes the left
const W = 680,
  X0 = CX - W / 2,
  BASE = 830,
  HMAX = 480;
const BAR_W = 52,
  DOT = 18;
const R_RING = 210,
  RING_CY = 540;

const arcPath = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  // angles in radians, 0 at the top, clockwise
  const p = (a: number) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};

/** Data Story signature (Chart Morph). One dataset told several ways on the beat: bars grow, collapse into dots, a line
 *  threads the dots, the line curls into a ring, the ring splits into proportional slices (colour swept on, never blended),
 *  and the slices merge into a thin ring around one big number with a plain-language caption. Full-frame scene, 5 to 6 s.
 *  Use only real, approved numbers in a real video; the defaults are fictional. */
export const ChartMorph: React.FC<{
  dur?: number;
  values?: number[];
  title?: Tok[][];
  value?: number;
  prefix?: string;
  unit?: string;
  caption?: string;
}> = ({
  dur = 6,
  values = [32, 45, 38, 56, 50, 68, 74, 92],
  title = tokLines("Signups grew|every *week.*", 0.2),
  value = 188,
  prefix = "+",
  unit = "%",
  caption = "signups, week 1 to 8",
}) => {
  const k = Math.min(1, dur / 6); // shorter slots run the same morph a little faster
  const tReal = useT();
  const t = tReal / k;
  const B = BEAT;
  const N = values.length;
  const max = Math.max(...values);
  const xs = values.map((_, j) => X0 + ((j + 0.5) * W) / N);
  const ys = values.map((v) => BASE - (v / max) * HMAX);

  // Smooth curve through the points (Catmull-Rom), sampled densely so it can bend into a ring.
  const samples: [number, number][] = [];
  for (let i = 0; i < N - 1; i++) {
    const p0 = [xs[Math.max(0, i - 1)], ys[Math.max(0, i - 1)]],
      p1 = [xs[i], ys[i]],
      p2 = [xs[i + 1], ys[i + 1]],
      p3 = [xs[Math.min(N - 1, i + 2)], ys[Math.min(N - 1, i + 2)]];
    for (let s = 0; s < 24; s++) {
      const u = s / 24,
        u2 = u * u,
        u3 = u2 * u;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3);
      samples.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  samples.push([xs[N - 1], ys[N - 1]]);
  const XMID = (xs[0] + xs[N - 1]) / 2;
  const YREF = ys.reduce((a, b) => a + b, 0) / N;
  const SPAN = xs[N - 1] - xs[0];
  const L1 = 2 * Math.PI * R_RING;
  // e = 0 straight, e = 1 a closed ring of radius R_RING around (CX, RING_CY)
  const bend = (x: number, y: number, e: number): [number, number] => {
    const L = lerp(SPAN, L1, e);
    const s = ((x - XMID) / SPAN) * L;
    const d = (YREF - y) * (1 - e);
    const M: [number, number] = [lerp(XMID, CX, e), lerp(YREF, RING_CY + R_RING, e)];
    const kk = (e * 2 * Math.PI) / L;
    if (kk < 1e-6) return [M[0] + s, M[1] - d];
    const th = kk * s;
    const r = 1 / kk - d;
    return [M[0] + r * Math.sin(th), M[1] - 1 / kk + r * Math.cos(th)];
  };

  // stages, one or two beats each
  const grow = (j: number) => springAt(t - j * 0.07, SPRING.card);
  const toDot = ramp(t, 3 * B, 4 * B, EASE.inOut);
  const lineP = ramp(t, 4 * B, 5.2 * B, EASE.inOut);
  const curl = ramp(t, 5.2 * B, 7 * B, EASE.inOut);
  const slice = ramp(t, 7 * B, 8.2 * B, EASE.inOut);
  const merge = ramp(t, 9 * B, 10.2 * B, EASE.inOut);
  const num = ramp(t, 9.2 * B, 11 * B, EASE.out);

  const pts = samples.map(([x, y]) => bend(x, y, curl));
  const lineD = "M " + pts.map((p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" L ");
  const total = values.reduce((a, b) => a + b, 0);
  let acc = 0;
  const cum = values.map((v) => (acc += v));
  const ringR = lerp(R_RING, 300, merge);
  const ringW = lerp(lerp(5, 42, curl), 7, merge);
  const gap = 0.035 * slice * (1 - merge);
  const sliceCol = (j: number) => (j === N - 1 ? C.accent2 : mix(C.brandSoft, C.brand, 0.25 + (0.75 * j) / (N - 2)));
  const slices = values.map((v, j) => {
    const u0 = j === 0 ? 0 : (j - 0.5) / (N - 1);
    const u1 = j === N - 1 ? 1 : (j + 0.5) / (N - 1);
    const a0 = lerp(u0, (cum[j] - v) / total, slice);
    const a1 = lerp(u1, cum[j] / total, slice);
    const on = ramp(t, 7.15 * B + j * 0.05, 7.95 * B + j * 0.05, EASE.inOut);
    const off = ramp(t, 9 * B + (N - 1 - j) * 0.03, 9.7 * B + (N - 1 - j) * 0.03, EASE.inOut);
    return { A0: 2 * Math.PI * (1 - a1) + gap / 2, A1: 2 * Math.PI * (1 - a0) - gap / 2, col: sliceCol(j), reveal: on * (1 - off) };
  });
  const labels = 1 - ramp(t, 5 * B, 5.6 * B);
  const shown = Math.round(value * num);

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div style={{ position: "absolute", left: 150, top: RING_CY - (title.length * 96) / 2 - 10 }}>
        <Headline t={tReal} size={92} lines={title} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {[0.25, 0.5, 0.75, 1].map((g, i) => (
          <line
            key={g}
            x1={X0}
            x2={X0 + W * ramp(t, i * 0.06, 0.7 + i * 0.06, EASE.out)}
            y1={BASE - g * HMAX}
            y2={BASE - g * HMAX}
            stroke={C.line}
            strokeWidth={1.5}
            strokeDasharray="2 8"
            strokeLinecap="round"
            opacity={1 - curl}
          />
        ))}
        <line x1={X0} x2={X0 + W * ramp(t, 0, 0.6, EASE.out)} y1={BASE} y2={BASE} stroke={C.ink} strokeWidth={2.5} opacity={1 - curl} />
        <path
          d={`${lineD} L ${pts[pts.length - 1][0]} ${BASE} L ${pts[0][0]} ${BASE} Z`}
          fill={C.brand}
          opacity={0.1 * ramp(t, 4.4 * B, 5 * B) * (1 - ramp(t, 5.2 * B, 6 * B))}
        />
        {values.map((v, j) => {
          const barH = (BASE - ys[j]) * grow(j);
          const w = lerp(BAR_W, DOT, toDot);
          const h = Math.max(0, lerp(barH, DOT, toDot));
          const cy = lerp(BASE - barH / 2, ys[j], toDot);
          const [bx, by] = bend(xs[j], cy, curl);
          const s = 1 - ramp(t, 5.4 * B, 6.4 * B, EASE.in);
          const fill = j === N - 1 ? mix(C.brand, C.accent2, ramp(t, 1.8 * B, 2.6 * B)) : mix(C.brand, C.ink, toDot);
          return s > 0.01 ? (
            <rect key={j} x={bx - (w * s) / 2} y={by - (h * s) / 2} width={w * s} height={h * s} rx={lerp(6, DOT / 2, toDot) * s} fill={fill} />
          ) : null;
        })}
        {values.map((v, j) => {
          const o = ramp(t, 0.35 + j * 0.07, 0.65 + j * 0.07) * labels;
          const y = lerp(BASE - (BASE - ys[j]) * grow(j), ys[j], toDot) - lerp(16, 26, toDot);
          return (
            <text key={j} x={xs[j]} y={y} textAnchor="middle" fontFamily={MONO} fontWeight={500} fontSize={22} fill={j === N - 1 ? C.ink : C.inkSoft} opacity={o}>
              {v}
            </text>
          );
        })}
        {t < 7 * B ? (
          <path d={lineD} fill="none" stroke={C.brand} strokeWidth={ringW} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - lineP} />
        ) : (
          slices.map((sl, j) => {
            const d = arcPath(CX, RING_CY, ringR, sl.A0, sl.A1);
            return (
              <g key={j}>
                <path d={d} fill="none" stroke={C.brand} strokeWidth={ringW} strokeLinecap={slice > 0.05 && merge < 0.95 ? "butt" : "round"} />
                {sl.reveal > 0.001 && (
                  <path d={d} fill="none" stroke={sl.col} strokeWidth={ringW + 0.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={-(1 - sl.reveal)} />
                )}
              </g>
            );
          })
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          left: CX - 300,
          width: 600,
          top: RING_CY - 100,
          textAlign: "center",
          opacity: ramp(t, 9.2 * B, 9.8 * B),
          scale: String(lerp(0.86, 1, num)),
        }}
      >
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 136, letterSpacing: "-0.05em", color: C.ink, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          <span style={{ color: C.brand }}>{prefix}</span>
          {shown}
          <span style={{ fontWeight: 600 }}>{unit}</span>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 24, letterSpacing: "0.28em", textTransform: "uppercase", color: C.inkSoft, marginTop: 20, opacity: ramp(t, 10 * B, 10.8 * B) }}>
          {caption}
        </div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
