import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain } from "../components/Grain";
import { INTEGRATIONS, IntegrationIcon } from "../components/Ui";
import { MotionBlur, clamp01, lerp, ramp, springAt } from "../lib/kit";
import { C, DISPLAY, EASE, MONO, SANS, SHADOW, SPRING, alpha, mix, onFill } from "../theme";

// Grid: 4 columns x 3 rows inside the frame's safe area.
const X0 = 150,
  Y0 = 112,
  W = 1620,
  H = 856,
  G = 22;
const CW = (W - 3 * G) / 4;
const RH = (H - 2 * G) / 3;
const cell = (c: number, r: number, cw: number, rh: number) => ({ x: X0 + c * (CW + G), y: Y0 + r * (RH + G), w: cw * CW + (cw - 1) * G, h: rh * RH + (rh - 1) * G });

type Entry = "left" | "right" | "top" | "bottom" | "flipY" | "flipX" | "pop";
type Id = "chart" | "stat" | "toggle" | "chat" | "bars" | "apps" | "ask";
const CARDS: { id: Id; c: number; r: number; cw: number; rh: number; entry: Entry; delay: number }[] = [
  { id: "chart", c: 0, r: 0, cw: 2, rh: 2, entry: "left", delay: 0.0 },
  { id: "stat", c: 2, r: 0, cw: 1, rh: 1, entry: "top", delay: 0.08 },
  { id: "toggle", c: 3, r: 0, cw: 1, rh: 1, entry: "flipY", delay: 0.2 },
  { id: "chat", c: 2, r: 1, cw: 2, rh: 1, entry: "right", delay: 0.14 },
  { id: "bars", c: 0, r: 2, cw: 1, rh: 1, entry: "bottom", delay: 0.28 },
  { id: "apps", c: 1, r: 2, cw: 1, rh: 1, entry: "flipX", delay: 0.36 },
  { id: "ask", c: 2, r: 2, cw: 2, rh: 1, entry: "bottom", delay: 0.44 },
];

const pop = (t: number) => springAt(t, SPRING.pop);
const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: MONO, fontSize: 18, letterSpacing: "0.08em", color: C.inkSoft, textTransform: "uppercase", ...style }}>{children}</div>
);
const big: React.CSSProperties = { fontFamily: DISPLAY, fontWeight: 600, letterSpacing: "-0.045em", color: C.ink, fontVariantNumeric: "tabular-nums", lineHeight: 1 };

const ChartCard: React.FC<{ t: number; w: number; h: number }> = ({ t, w, h }) => {
  const pts = [0.18, 0.26, 0.22, 0.38, 0.34, 0.5, 0.46, 0.62, 0.58, 0.78, 0.92];
  const cw = w - 72,
    ch = h - 300;
  const xy = pts.map((v, i) => [(i / (pts.length - 1)) * cw, ch - v * ch] as const);
  let d = `M ${xy[0][0]} ${xy[0][1]}`;
  for (let i = 0; i < xy.length - 1; i++) {
    const p0 = xy[Math.max(0, i - 1)],
      p1 = xy[i],
      p2 = xy[i + 1],
      p3 = xy[Math.min(xy.length - 1, i + 2)];
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`;
  }
  const reveal = ramp(t, 0.7, 1.9, EASE.inOut);
  const end = xy[xy.length - 1];
  const dot = pop(t - 1.85);
  const chip = pop(t - 1.7);
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <div style={{ padding: 36, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      <Label>Revenue · this quarter</Label>
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18 }}>
        <div style={{ ...big, fontSize: 92 }}>${(2.48 * ramp(t, 0.7, 1.9, EASE.out)).toFixed(2)}M</div>
        <div
          style={{
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 26,
            color: C.brand,
            background: C.brandSoft,
            borderRadius: 20,
            padding: "6px 14px",
            scale: String(Math.max(0, chip)),
            transformOrigin: "left center",
          }}
        >
          +38%
        </div>
      </div>
      <svg width={cw} height={ch + 10} style={{ marginTop: "auto", overflow: "visible" }}>
        <defs>
          <linearGradient id={`ba${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.brand} stopOpacity="0.22" />
            <stop offset="1" stopColor={C.brand} stopOpacity="0" />
          </linearGradient>
          <clipPath id={`bc${uid}`}>
            <rect x={-10} y={-20} width={(cw + 20) * reveal} height={ch + 40} />
          </clipPath>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1={0} x2={cw} y1={ch * g} y2={ch * g} stroke={C.line} strokeWidth={1.5} strokeDasharray="4 6" />
        ))}
        <g clipPath={`url(#bc${uid})`}>
          <path d={`${d} L ${cw} ${ch} L 0 ${ch} Z`} fill={`url(#ba${uid})`} />
          <path d={d} fill="none" stroke={C.brand} strokeWidth={4} strokeLinecap="round" />
        </g>
        <circle cx={end[0]} cy={end[1]} r={15 * Math.max(0, dot)} fill={C.brand} opacity={0.18} />
        <circle cx={end[0]} cy={end[1]} r={7 * Math.max(0, dot)} fill={C.brand} stroke={C.card} strokeWidth={3} />
      </svg>
    </div>
  );
};

const StatCard: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ padding: 30, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <Label>On time</Label>
    <div style={{ ...big, fontSize: 84 }}>
      {Math.round(98 * ramp(t, 0.75, 1.7, EASE.out))}
      <span style={{ color: C.brand }}>%</span>
    </div>
    <div style={{ display: "flex", gap: 7, alignItems: "flex-end", height: 34 }}>
      {[0.3, 0.5, 0.4, 0.7, 0.6, 0.9, 1].map((b, i) => (
        <div key={i} style={{ flex: 1, height: 34 * b * ramp(t, 0.9 + i * 0.05, 1.4 + i * 0.05, EASE.out), borderRadius: 3, background: i === 6 ? C.brand : C.brandSoft }} />
      ))}
    </div>
  </div>
);

const ToggleCard: React.FC<{ t: number }> = ({ t }) => {
  const on = pop(t - 1.35);
  const k = clamp01(on);
  return (
    <div style={{ padding: 30, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <Label>Automation</Label>
        <div style={{ fontFamily: SANS, fontSize: 28, fontWeight: 600, color: C.ink, marginTop: 10, letterSpacing: "-0.02em" }}>Daily summary</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 118, height: 66, borderRadius: 40, background: mix(C.muted, C.brand, k), position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: 6,
              left: 6 + on * 52,
              width: 54,
              height: 54,
              borderRadius: 30,
              background: C.card,
              boxShadow: "0 3px 8px rgba(0,0,0,0.18)",
              scale: `${1 + Math.sin(k * Math.PI) * 0.18} 1`,
            }}
          />
        </div>
        <div style={{ fontFamily: MONO, fontSize: 20, color: k > 0.5 ? C.brand : C.inkSoft }}>{k > 0.5 ? "ON" : "OFF"}</div>
      </div>
    </div>
  );
};

const Bubble: React.FC<{ mine?: boolean; children: React.ReactNode; p: number }> = ({ mine, children, p }) => (
  <div
    style={{
      alignSelf: mine ? "flex-end" : "flex-start",
      scale: String(Math.max(0, p)),
      transformOrigin: mine ? "right bottom" : "left bottom",
      opacity: clamp01(p * 2),
      background: mine ? C.brand : C.muted,
      color: mine ? onFill(C.brand) : C.ink,
      borderRadius: mine ? "22px 22px 6px 22px" : "22px 22px 22px 6px",
      padding: "14px 22px",
      fontFamily: SANS,
      fontSize: 26,
      fontWeight: 500,
      letterSpacing: "-0.01em",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);
const ChatCard: React.FC<{ t: number }> = ({ t }) => {
  const typing = t > 1.45 && t < 2.3;
  return (
    <div style={{ padding: "24px 30px", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
      <Bubble mine p={pop(t - 1.0)}>What changed this week?</Bubble>
      <Bubble p={pop(t - 1.45)}>
        {typing ? (
          <span style={{ display: "inline-flex", gap: 7, height: 31, alignItems: "center" }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{ width: 10, height: 10, borderRadius: 5, background: C.inkSoft, translate: `0px ${-Math.max(0, Math.sin((t - 1.45) * 9 - i * 0.9)) * 6}px` }}
              />
            ))}
          </span>
        ) : (
          <span style={{ opacity: ramp(t, 2.3, 2.6) }}>
            <b>12 tasks</b> closed, 2 need you.
          </span>
        )}
      </Bubble>
    </div>
  );
};

const BarsCard: React.FC<{ t: number }> = ({ t }) => {
  const vals = [0.35, 0.52, 0.44, 0.66, 0.58, 0.74, 1];
  return (
    <div style={{ padding: 30, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      <Label>Weekly active</Label>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginTop: "auto", height: 140 }}>
        {vals.map((v, i) => (
          <div
            key={i}
            style={{ flex: 1, height: 140 * v * Math.max(0, springAt(t - (1.0 + i * 0.05), SPRING.card)), borderRadius: 7, background: i === vals.length - 1 ? C.brand : C.brandSoft }}
          />
        ))}
      </div>
    </div>
  );
};

const AppsCard: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ padding: 30, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
    <Label>Connected</Label>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, justifyItems: "center", marginTop: "auto" }}>
      {[0, 5, 8, 2, 4, 7].map((k, i) => (
        <div key={k} style={{ scale: String(Math.max(0, pop(t - (0.95 + i * 0.07)))) }}>
          <IntegrationIcon it={INTEGRATIONS[k]} size={62} />
        </div>
      ))}
    </div>
  </div>
);

const AskCard: React.FC<{ t: number }> = ({ t }) => {
  const text = "Plan next week's launch";
  const n = Math.floor(ramp(t, 1.35, 2.3) * text.length);
  const caret = t < 1.35 || t > 2.3 ? Math.floor(t * 2.4) % 2 === 0 : true;
  const send = clamp01(pop(t - 2.5));
  return (
    <div style={{ padding: "0 30px", height: "100%", boxSizing: "border-box", display: "flex", alignItems: "center" }}>
      <div
        style={{
          flex: 1,
          height: 104,
          borderRadius: 52,
          border: `2px solid ${n > 0 ? mix(C.line, C.brand, 0.35) : C.line}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px 0 34px",
          gap: 14,
          background: C.card,
        }}
      >
        <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 34, letterSpacing: "-0.02em", color: n > 0 ? C.ink : C.inkSoft, whiteSpace: "nowrap" }}>
          {n > 0 ? text.slice(0, n) : "Ask anything"}
        </div>
        <div style={{ width: 3, height: 40, background: C.brand, marginLeft: -10, opacity: caret && n > 0 ? 1 : 0 }} />
        <div
          style={{
            marginLeft: "auto",
            width: 72,
            height: 72,
            borderRadius: 36,
            background: mix(C.muted, C.brand, send),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: String(1 + Math.sin(send * Math.PI) * 0.12),
          }}
        >
          <svg width={32} height={32} viewBox="0 0 24 24">
            <path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke={send > 0.5 ? onFill(C.brand) : C.inkSoft} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/** Bento Product signature (Bento Snap). Seven small product cards fly into a bento grid from different directions on a soft
 *  spring while the camera settles from a 12 degree tilt; once seated each card comes alive (the chart draws, the toggle flips,
 *  the chat answers, the input types and sends), then a slow 3.5% push. Motion blur only during the fly-in.
 *  Full-frame scene, 4 to 6 s. Rebuild the cards from the real product's pieces. */
export const BentoSnap: React.FC<{ dur?: number }> = ({ dur = 5 }) => {
  const scene = (t: number) => {
    const cam = ramp(t, 0, 1.9, EASE.out);
    const sc = lerp(0.84, 1, cam) * (1 + 0.035 * ramp(t, 2.2, dur, EASE.inOut));
    return (
      <AbsoluteFill style={{ background: C.paper, perspective: 2400, overflow: "hidden" }}>
        <AbsoluteFill style={{ background: `radial-gradient(70% 70% at 50% 35%, ${C.card} 0%, ${alpha(C.paper, 0)} 70%)` }} />
        <AbsoluteFill style={{ transform: `scale(${sc}) rotateX(${lerp(12, 0, cam)}deg) rotateZ(${lerp(-4, 0, cam)}deg)` }}>
          {CARDS.map((cd) => {
            const p = cell(cd.c, cd.r, cd.cw, cd.rh);
            const s = springAt(t - cd.delay, SPRING.card);
            const inv = 1 - s;
            let tf = "";
            let op = 1;
            if (cd.entry === "left") tf = `translateX(${inv * -1100}px) rotate(${inv * -8}deg)`;
            if (cd.entry === "right") tf = `translateX(${inv * 1100}px) rotate(${inv * 8}deg)`;
            if (cd.entry === "top") tf = `translateY(${inv * -900}px)`;
            if (cd.entry === "bottom") tf = `translateY(${inv * 900}px)`;
            if (cd.entry === "flipY" || cd.entry === "flipX") {
              tf = `${cd.entry === "flipY" ? "rotateY" : "rotateX"}(${inv * 90}deg) scale(${0.8 + 0.2 * s})`;
              op = s > 0.02 ? clamp01(s * 3) : 0;
            }
            if (cd.entry === "pop") {
              tf = `scale(${0.4 + 0.6 * s})`;
              op = clamp01(s * 2.5);
            }
            const body =
              cd.id === "chart" ? <ChartCard t={t} w={p.w} h={p.h} /> :
              cd.id === "stat" ? <StatCard t={t} /> :
              cd.id === "toggle" ? <ToggleCard t={t} /> :
              cd.id === "chat" ? <ChatCard t={t} /> :
              cd.id === "bars" ? <BarsCard t={t} /> :
              cd.id === "apps" ? <AppsCard t={t} /> : <AskCard t={t} />;
            return (
              <div
                key={cd.id}
                style={{
                  position: "absolute",
                  left: p.x,
                  top: p.y,
                  width: p.w,
                  height: p.h,
                  borderRadius: 30,
                  background: C.card,
                  border: `1px solid ${C.line}`,
                  boxShadow: SHADOW.card,
                  overflow: "hidden",
                  transform: tf,
                  opacity: op,
                  backfaceVisibility: "hidden",
                  boxSizing: "border-box",
                }}
              >
                {body}
              </div>
            );
          })}
        </AbsoluteFill>
      </AbsoluteFill>
    );
  };
  return (
    <AbsoluteFill>
      <MotionBlur samples={8} shutter={0.5} render={(t) => scene(t + 0.1)} enabled={(t) => t < 1.3} />
      <Grain />
    </AbsoluteFill>
  );
};
