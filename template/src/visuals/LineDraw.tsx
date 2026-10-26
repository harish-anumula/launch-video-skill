import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain } from "../components/Grain";
import { Headline, Tok, tokLines } from "../components/Headline";
import { LogoMark } from "../components/Logo";
import { INTEGRATIONS, IntegrationIcon } from "../components/Ui";
import { PRODUCT } from "../brand/logo";
import { BEAT, Route, clamp01, ramp, route, rrect, springAt } from "../lib/kit";
import { useT } from "../lib/time";
import { C, EASE, MONO, SPRING, onFill } from "../theme";

const CY = 615; // diagram centre line (the headline sits above)
const SRC_X = 400,
  SRC_R = 50;
const HUB = { x: 960, y: CY, s: 210 };
const OUT_X = 1500,
  OUT_W = 220,
  OUT_H = 140;
const TAIL = 150;

const Draw: React.FC<{ d: string; len: number; p: number; stroke: string; w?: number; o?: number }> = ({ d, len, p, stroke, w = 2, o = 1 }) =>
  p <= 0 ? null : (
    <path d={d} fill="none" stroke={stroke} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${len} ${len}`} strokeDashoffset={len * (1 - p)} opacity={o} />
  );

/** A comet: a bright head with a tail about 15% of the path, glowing softly. */
const Pulse: React.FC<{ path: Route; pos: number; color: string; glow: string }> = ({ path, pos, color, glow }) => {
  const { d, len } = path;
  if (pos <= 0 || pos >= len + TAIL) return null;
  const parts: React.ReactNode[] = [];
  const n = 8;
  for (let k = 0; k < n; k++) {
    const b = Math.min(len, pos - (k * TAIL) / n);
    const a = Math.max(0, pos - ((k + 1) * TAIL) / n);
    if (b <= a) continue;
    const o = Math.pow(1 - k / n, 1.6);
    const common = { d, fill: "none", strokeDasharray: `${b - a} ${len * 2}`, strokeDashoffset: -a };
    if (k < 4) parts.push(<path key={`g${k}`} {...common} stroke={color} strokeWidth={12} opacity={0.25 * o} filter={`url(#${glow})`} />);
    parts.push(<path key={`c${k}`} {...common} stroke={color} strokeWidth={3.4} opacity={o} />);
  }
  const head = pos <= len ? path.at(pos) : null;
  return (
    <g>
      {parts}
      {head && <circle cx={head[0]} cy={head[1]} r={5} fill={color} />}
    </g>
  );
};

/** System Diagram signature (Line Draw). Sources on the left, the product hub in the centre and outputs on the right draw
 *  themselves stroke by stroke over exact path lengths, joined by rounded right-angle routes. Then a comet pulse runs from
 *  the sources through the hub (which pops and sends a shockwave ring) to the outputs, which light up one by one with a
 *  check. A second pulse in the second colour runs only when the slot is long enough. Full-frame scene, 4 to 6 s. */
export const LineDraw: React.FC<{
  dur?: number;
  title?: Tok[][];
  sources?: number[]; // indices into INTEGRATIONS
  outputs?: string[];
}> = ({ dur = 5, title = tokLines("Every source,|one *answer.*", 0.15), sources = [5, 0, 1, 2], outputs = ["ANSWER", "SOURCES", "ALERT"] }) => {
  const t = useT();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const B = BEAT;
  const ns = sources.length;
  const srcY = sources.map((_, i) => CY + (i - (ns - 1) / 2) * 130);
  const outY = outputs.map((_, i) => CY + (i - (outputs.length - 1) / 2) * 180);
  const inPaths = srcY.map((y, i) => {
    const yEnd = CY + (i - (ns - 1) / 2) * 28;
    const lane = 560 + Math.abs(i - (ns - 1) / 2) * 50;
    return route([
      [SRC_X + SRC_R, y],
      [lane, y],
      [lane, yEnd],
      [HUB.x - HUB.s / 2, yEnd],
    ]);
  });
  const outPaths = outY.map((y, i) => {
    const yStart = CY + (i - (outputs.length - 1) / 2) * 36;
    if (Math.abs(y - yStart) < 1)
      return route([
        [HUB.x + HUB.s / 2, y],
        [OUT_X - OUT_W / 2, y],
      ]);
    return route([
      [HUB.x + HUB.s / 2, yStart],
      [1230, yStart],
      [1230, y],
      [OUT_X - OUT_W / 2, y],
    ]);
  });
  // timeline: the build fills the first five beats, the pulse lands on beat 5
  const T = {
    hub: [0, 0.55] as const,
    src: (i: number) => 0.12 + i * 0.08,
    inLine: (i: number) => 0.55 + Math.abs(i - (ns - 1) / 2) * 0.08,
    mark: 1.0,
    outLine: (i: number) => 1.45 + i * 0.09,
    card: (i: number) => 1.85 + i * 0.09,
    waves: dur >= 5.5 ? [5 * B, 7.5 * B] : [5 * B],
  };
  const PULSE_IN = 0.7,
    PULSE_OUT = 0.55;
  const arrive = T.waves.map((w) => w + PULSE_IN);
  const flash = (a: number) => (t < a ? 0 : Math.exp(-(t - a) * 4.5));
  const hubFlash = Math.max(...arrive.map((a, k) => flash(a) * (k ? 0.8 : 1)));
  const hubPop = 1 + 0.06 * Math.max(...arrive.map((a) => (t < a ? 0 : Math.sin(Math.min(Math.PI, (t - a) * 9)) * Math.exp(-(t - a) * 3))));
  const outLit = (i: number) => ramp(t, arrive[0] + PULSE_OUT + i * 0.12 - 0.05, arrive[0] + PULSE_OUT + 0.3 + i * 0.12, EASE.out);
  const hubBox = rrect(HUB.x, HUB.y, HUB.s, HUB.s, 46);
  const hubP = ramp(t, T.hub[0], T.hub[1], EASE.inOut);
  const waveCol = (k: number) => (k === 0 ? C.brand : C.accent2);
  const base = C.inkSoft;

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id={`dots${uid}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="1.3" fill={C.ink} />
          </pattern>
          <filter id={`glow${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>
        <rect width="1920" height="1080" fill={`url(#dots${uid})`} opacity={0.06} />

        {inPaths.map((p, i) => (
          <Draw key={`i${i}`} d={p.d} len={p.len} p={ramp(t, T.inLine(i), T.inLine(i) + 0.55, EASE.inOut)} stroke={base} w={2} o={0.55} />
        ))}
        {outPaths.map((p, i) => (
          <Draw key={`o${i}`} d={p.d} len={p.len} p={ramp(t, T.outLine(i), T.outLine(i) + 0.5, EASE.inOut)} stroke={base} w={2} o={0.55} />
        ))}
        {/* connections stay lit once the first pulse has passed */}
        {[...inPaths.map((p, i) => ({ p, start: T.waves[0] + Math.abs(i - (ns - 1) / 2) * 0.05, dur: PULSE_IN })), ...outPaths.map((p, i) => ({ p, start: arrive[0] + 0.05 + i * 0.04, dur: PULSE_OUT }))].map(
          ({ p, start, dur: pd }, k) => {
            const lit = Math.max(0, EASE.inOut(clamp01((t - start) / pd)) * (p.len + TAIL) - TAIL * 0.6);
            return lit > 0 ? <path key={`l${k}`} d={p.d} fill="none" stroke={C.brand} strokeWidth={2.2} opacity={0.6} strokeDasharray={`${lit} ${p.len * 2}`} /> : null;
          },
        )}
        {T.waves.map((w, k) => [
          ...inPaths.map((p, i) => {
            const start = w + Math.abs(i - (ns - 1) / 2) * 0.05;
            const pos = EASE.inOut(clamp01((t - start) / PULSE_IN)) * (p.len + TAIL);
            return t >= start ? <Pulse key={`pi${k}${i}`} path={p} pos={pos} color={waveCol(k)} glow={`glow${uid}`} /> : null;
          }),
          ...outPaths.map((p, i) => {
            const start = arrive[k] + 0.05 + i * 0.04;
            const pos = EASE.inOut(clamp01((t - start) / PULSE_OUT)) * (p.len + TAIL);
            return t >= start ? <Pulse key={`po${k}${i}`} path={p} pos={pos} color={waveCol(k)} glow={`glow${uid}`} /> : null;
          }),
        ])}

        {/* shockwave rings from the hub */}
        {arrive.map((a, k) => {
          const x = t - a;
          if (x < 0 || x > 1.1) return null;
          const p = EASE.out(x / 1.1);
          return <path key={`r${k}`} d={rrect(HUB.x, HUB.y, HUB.s + p * 180, HUB.s + p * 180, 46 + p * 60).d} fill="none" stroke={waveCol(k)} strokeWidth={2} opacity={(1 - p) * 0.6} />;
        })}
        <g transform={`translate(${HUB.x} ${HUB.y}) scale(${hubPop}) translate(${-HUB.x} ${-HUB.y})`}>
          <path d={hubBox.d} fill={C.card} fillOpacity={hubP} />
          <Draw d={hubBox.d} len={hubBox.len} p={hubP} stroke={C.ink} w={2.4} />
          <path d={hubBox.d} fill="none" stroke={C.brand} strokeWidth={3.5} opacity={hubFlash} />
        </g>

        {srcY.map((y, i) => {
          const c = rrect(SRC_X, y, SRC_R * 2, SRC_R * 2, SRC_R);
          const hit = flash(T.waves[0] + Math.abs(i - (ns - 1) / 2) * 0.05);
          return (
            <g key={`s${i}`}>
              <circle cx={SRC_X} cy={y} r={SRC_R} fill={C.card} opacity={ramp(t, T.src(i), T.src(i) + 0.45)} />
              <Draw d={c.d} len={c.len} p={ramp(t, T.src(i), T.src(i) + 0.45, EASE.inOut)} stroke={C.ink} w={2} o={0.85} />
              <circle cx={SRC_X} cy={y} r={SRC_R} fill="none" stroke={C.brand} strokeWidth={3} opacity={hit} />
            </g>
          );
        })}

        {outY.map((y, i) => {
          const box = rrect(OUT_X, y, OUT_W, OUT_H, 18);
          const p = ramp(t, T.card(i), T.card(i) + 0.5, EASE.inOut);
          const ip = ramp(t, T.card(i) + 0.3, T.card(i) + 0.85, EASE.inOut);
          const lit = outLit(i);
          const x0 = OUT_X - OUT_W / 2,
            y0 = y - OUT_H / 2;
          const ink = lit > 0.5 ? C.brand : C.ink;
          const icon: React.ReactNode[] = [];
          if (i % 3 === 0) {
            [0.42, 0.68, 0.52, 0.86].forEach((b, k) => {
              const h = 70 * b * ramp(t, T.card(i) + 0.35 + k * 0.06, T.card(i) + 0.75 + k * 0.06, EASE.out);
              icon.push(<rect key={k} x={x0 + 44 + k * 34} y={y0 + OUT_H - 30 - h} width={18} height={h} rx={3} fill={C.brand} fillOpacity={lit * 0.9} stroke={ink} strokeWidth={1.6} />);
            });
          } else if (i % 3 === 1) {
            for (let k = 0; k < 3; k++) {
              const ry = y0 + 42 + k * 28;
              const l1 = route([
                [x0 + 32, ry],
                [x0 + 76, ry],
              ]);
              const l2 = route([
                [x0 + 92, ry],
                [x0 + OUT_W - 32, ry],
              ]);
              const pk = ramp(t, T.card(i) + 0.3 + k * 0.07, T.card(i) + 0.7 + k * 0.07, EASE.inOut);
              icon.push(<Draw key={`a${k}`} d={l1.d} len={l1.len} p={pk} stroke={ink} w={6} o={0.85} />);
              icon.push(<Draw key={`b${k}`} d={l2.d} len={l2.len} p={pk} stroke={ink} w={6} o={0.35 + 0.4 * lit} />);
            }
          } else {
            const pts = [
              [x0 + 34, y0 + 100],
              [x0 + 74, y0 + 78],
              [x0 + 110, y0 + 88],
              [x0 + 148, y0 + 54],
              [x0 + 184, y0 + 40],
            ];
            let len = 0;
            for (let k = 1; k < pts.length; k++) len += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
            icon.push(<Draw key="l" d={"M " + pts.map((q) => q.join(" ")).join(" L ")} len={len} p={ip} stroke={ink} w={3.5} o={0.9} />);
          }
          const check = springAt(t - (arrive[0] + PULSE_OUT + 0.25 + i * 0.12), SPRING.pop);
          return (
            <g key={`c${i}`}>
              <path d={box.d} fill={C.card} fillOpacity={p} />
              <Draw d={box.d} len={box.len} p={p} stroke={C.ink} w={2} o={0.85} />
              <path d={box.d} fill="none" stroke={C.brand} strokeWidth={3} opacity={lit} />
              {icon}
              {check > 0.01 && (
                <g transform={`translate(${x0 + OUT_W} ${y0}) scale(${check})`}>
                  <circle r={17} fill={C.green} />
                  <path d="M -7 0.5 L -2 5.5 L 7.5 -4.5" fill="none" stroke={onFill(C.green)} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* mark in the hub, icons in the source rings, mono labels */}
      <div
        style={{
          position: "absolute",
          left: HUB.x - 60,
          top: HUB.y - 60,
          scale: String(hubPop),
        }}
      >
        <LogoMark size={120} color={C.brand} p={ramp(t, T.mark, T.mark + 0.8)} />
      </div>
      {srcY.map((y, i) => {
        const p = springAt(t - (T.src(i) + 0.3), SPRING.pop);
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: SRC_X - 26, top: y - 26, scale: String(Math.max(0, p)), opacity: clamp01(p * 2) }}>
              <IntegrationIcon it={INTEGRATIONS[sources[i]]} size={52} />
            </div>
            <div
              style={{
                position: "absolute",
                right: 1920 - (SRC_X - SRC_R - 26),
                top: y - 14,
                fontFamily: MONO,
                fontSize: 22,
                letterSpacing: "0.08em",
                color: C.inkSoft,
                textTransform: "uppercase",
                opacity: ramp(t, T.src(i) + 0.2, T.src(i) + 0.5),
              }}
            >
              {INTEGRATIONS[sources[i]].name}
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: HUB.x - 150, width: 300, top: HUB.y + HUB.s / 2 + 22, textAlign: "center", fontFamily: MONO, fontSize: 22, letterSpacing: "0.12em", color: C.ink, textTransform: "uppercase", opacity: ramp(t, 0.6, 1) }}>
        {PRODUCT}
      </div>
      {outY.map((y, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: OUT_X + OUT_W / 2 + 30,
            top: y - 14,
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: "0.08em",
            color: outLit(i) > 0.5 ? C.brand : C.inkSoft,
            opacity: ramp(t, T.card(i) + 0.3, T.card(i) + 0.6),
          }}
        >
          {outputs[i]}
        </div>
      ))}
      <div style={{ position: "absolute", left: 150, top: 120 }}>
        <Headline t={t} size={76} lines={title} />
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
