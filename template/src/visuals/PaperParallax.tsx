import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain } from "../components/Grain";
import { Headline, Tok, tokLines } from "../components/Headline";
import { lerp, ramp, springAt } from "../lib/kit";
import { useT } from "../lib/time";
import { C, EASE, SPRING, mix } from "../theme";

// Seeded random for the ridge shapes.
const sr = (seed: number) => {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};
// Smooth hill silhouette through points (Catmull-Rom to cubic Bezier), closed to the bottom of the frame.
const ridgePath = (kind: "peaks" | "hills", base: number, seed: number) => {
  const r = sr(seed);
  const waves = Array.from({ length: 3 }, (_, i) => ({
    a: ((kind === "peaks" ? 70 : 36) / (i + 1)) * (0.7 + r() * 0.6),
    f: (0.0024 + r() * 0.0016) * (i + 1),
    p: r() * 6.28,
  }));
  const fn = (x: number) => {
    let y = base;
    for (const w of waves) y -= w.a * Math.sin(w.f * x + w.p);
    if (kind === "peaks") y -= 60 * Math.pow(1 - Math.abs(Math.sin(0.0032 * x + seed)), 2.2);
    return y;
  };
  const pts: [number, number][] = [];
  for (let x = -500; x <= 2500; x += kind === "peaks" ? 30 : 46) pts.push([x, fn(x)]);
  let d = `M ${pts[0][0]} 1700 L ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)],
      p1 = pts[i],
      p2 = pts[i + 1],
      p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)}, ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)}, ${p2[0]} ${p2[1].toFixed(1)}`;
  }
  return d + ` L ${pts[pts.length - 1][0]} 1700 Z`;
};
const cloudPath = (cx: number, cy: number, s: number) =>
  `M ${cx - 120 * s} ${cy} A ${46 * s} ${46 * s} 0 0 1 ${cx - 52 * s} ${cy - 40 * s} A ${62 * s} ${62 * s} 0 0 1 ${cx + 46 * s} ${cy - 52 * s} A ${44 * s} ${44 * s} 0 0 1 ${cx + 112 * s} ${cy - 8 * s} A ${12 * s} ${12 * s} 0 0 1 ${cx + 118 * s} ${cy} Z`;

/** Paper texture plus a soft drop shadow, as one SVG filter. */
const PaperFilter: React.FC<{ id: string; seed: number; shadow: number; blur: number; dy: number; tint: string }> = ({ id, seed, shadow, blur, dy, tint }) => (
  <filter id={id} x="-20%" y="-30%" width="140%" height="160%" colorInterpolationFilters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} seed={seed} result="n" />
    <feColorMatrix in="n" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" result="ng" />
    <feComponentTransfer in="ng" result="nt">
      <feFuncR type="linear" slope="0.22" intercept="0.86" />
      <feFuncG type="linear" slope="0.22" intercept="0.86" />
      <feFuncB type="linear" slope="0.22" intercept="0.86" />
    </feComponentTransfer>
    <feBlend in="SourceGraphic" in2="nt" mode="multiply" result="tex" />
    <feComposite in="tex" in2="SourceAlpha" operator="in" result="paper" />
    <feGaussianBlur in="SourceAlpha" stdDeviation={blur} result="b" />
    <feOffset in="b" dy={dy} dx={dy * 0.25} result="bo" />
    <feFlood floodColor={tint} floodOpacity={shadow} />
    <feComposite in2="bo" operator="in" result="sh" />
    <feMerge>
      <feMergeNode in="sh" />
      <feMergeNode in="paper" />
    </feMerge>
  </filter>
);

/** Paper Cut signature (Paper Parallax). Six layered paper hills, light to dark, slide up into place one after another on a
 *  spring with no bounce, each with paper grain and a soft shadow; the sun rises behind them with halo rings and one cloud
 *  drifts, while a slow 5% push moves near layers more than far ones. The headline builds slowly in the serif above.
 *  Full-frame scene, 5 to 6 s; a breather, not wallpaper (once per 20 s at most). */
export const PaperParallax: React.FC<{ dur?: number; title?: Tok[][] }> = ({
  dur = 6,
  title = tokLines("A calm start|to every *morning.*", 0.6),
}) => {
  const t = useT();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const layers = React.useMemo(() => {
    // hill colours from the preset: brandLight toward ink, through brand and brandDeep
    const cols = [
      mix(C.brandLight, C.brandSoft, 0.45),
      C.brandLight,
      mix(C.brand, C.brandLight, 0.35),
      C.brandDeep,
      mix(C.brandDeep, C.ink, 0.5),
      C.ink,
    ];
    const spec = [
      { base: 690, kind: "peaks" as const, seed: 3, k: 0.1 },
      { base: 770, kind: "hills" as const, seed: 7, k: 0.22 },
      { base: 840, kind: "hills" as const, seed: 11, k: 0.38 },
      { base: 910, kind: "hills" as const, seed: 19, k: 0.58 },
      { base: 985, kind: "hills" as const, seed: 23, k: 0.82 },
      { base: 1060, kind: "hills" as const, seed: 31, k: 1.05 },
    ];
    return spec.map((l, i) => ({ ...l, color: cols[i], d: ridgePath(l.kind, l.base, l.seed) }));
  }, []);

  const glide = EASE.inOut;
  const push = glide(Math.min(1, t / dur));
  const sunP = ramp(t, 0.3, dur - 0.3, EASE.out);
  const sun = { x: 1340, y: lerp(820, 470, sunP) };
  const focus = { x: 1000, y: 760 };
  const layerT = (k: number, enter = 1) => {
    const sc = 1 + push * 0.12 * k;
    const ty = push * 60 * k - push * 16 + (1 - enter) * (220 + 160 * k);
    const tx = -push * 40 * k;
    return `translate(${focus.x + tx} ${focus.y + ty}) scale(${sc}) translate(${-focus.x} ${-focus.y})`;
  };
  const shadowTint = mix(C.ink, "#000000", 0.25);
  const ringCols = [mix(C.paper, C.brandSoft, 0.35), mix(C.paper, C.brandSoft, 0.7), C.brandSoft];
  return (
    <AbsoluteFill style={{ background: C.brandSoft, overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={mix(C.paper, C.brandLight, 0.28)} />
            <stop offset="0.6" stopColor={mix(C.paper, C.brandSoft, 0.8)} />
            <stop offset="0.85" stopColor={C.paper} />
          </linearGradient>
          <radialGradient id={`glow${uid}`}>
            <stop offset="0" stopColor={C.paper} stopOpacity="0.95" />
            <stop offset="0.4" stopColor={C.paper} stopOpacity="0.45" />
            <stop offset="1" stopColor={C.paper} stopOpacity="0" />
          </radialGradient>
          {layers.map((l, i) => (
            <PaperFilter key={i} id={`p${i}${uid}`} seed={2 + i * 2} shadow={0.2 + i * 0.07} blur={8 + i * 1.3} dy={5 + i} tint={shadowTint} />
          ))}
          <PaperFilter id={`ps${uid}`} seed={14} shadow={0.16} blur={10} dy={4} tint={shadowTint} />
        </defs>
        <rect width={1920} height={1080} fill={`url(#sky${uid})`} />

        {/* the sun with soft halo rings, behind every layer */}
        <g transform={layerT(0.04)}>
          <circle cx={sun.x} cy={sun.y} r={460} fill={`url(#glow${uid})`} opacity={0.5 + 0.5 * sunP} />
          {[300, 232, 172].map((r, i) => {
            const rp = ramp(t, 0.4 + i * 0.35, 2.8 + i * 0.35, EASE.out);
            return <circle key={i} cx={sun.x} cy={sun.y + (1 - rp) * 40} r={r * lerp(0.92, 1, rp)} fill={ringCols[i]} opacity={rp} filter={`url(#ps${uid})`} />;
          })}
          <circle cx={sun.x} cy={sun.y} r={112} fill={mix(C.paper, "#FFFFFF", 0.4)} filter={`url(#ps${uid})`} />
        </g>
        <g transform={layerT(0.08)}>
          <path d={cloudPath(1010 + t * 16, 640, 0.95)} fill={mix(C.paper, "#FFFFFF", 0.3)} filter={`url(#p0${uid})`} opacity={ramp(t, 0.6, 1.6)} />
        </g>

        {/* the paper layers slide up into place, back to front, then drift at depth-scaled speeds */}
        {layers.map((l, i) => {
          const enter = springAt(t - 0.12 * i, SPRING.card);
          return (
            <g key={i} transform={layerT(l.k, enter)}>
              <path d={l.d} fill="none" stroke={C.paper} strokeOpacity={0.35 - i * 0.04} strokeWidth={3} />
              <path d={l.d} fill={l.color} filter={`url(#p${i}${uid})`} />
            </g>
          );
        })}
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(90% 80% at 60% 45%, rgba(0,0,0,0) 55%, ${mix(C.ink, "#000000", 0.2)}26 100%)` }} />
      <div style={{ position: "absolute", left: 150, top: 150 }}>
        <Headline t={t} size={104} lines={title} />
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
