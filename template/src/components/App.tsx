import React from "react";
import { clampI } from "../lib/time";
import { C, EASE, MONO, SANS, SERIF, SHADOW } from "../theme";

/** App window chrome (title bar in the brand colour). Rebuild your product's real screens inside it. */
export const AppWindow: React.FC<{
  title: string;
  width: number;
  height: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, width, height, children, style }) => (
  <div
    style={{
      width,
      height,
      borderRadius: 18,
      overflow: "hidden",
      background: "#fff",
      boxShadow: "0 40px 120px -30px rgba(17,19,24,0.35), 0 0 0 1px rgba(17,19,24,0.06)",
      fontFamily: SANS,
      color: C.ink,
      display: "flex",
      flexDirection: "column",
      ...style,
    }}
  >
    <div style={{ height: 44, background: C.brand, display: "flex", alignItems: "center", padding: "0 18px", gap: 9, flexShrink: 0 }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
        <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
      ))}
      <div style={{ color: "#fff", fontSize: 15, fontWeight: 500, marginLeft: 14 }}>{title}</div>
    </div>
    <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
  </div>
);
/** Prompt composer; shows `typed` characters of `text` with a blinking caret. */
export const Composer: React.FC<{ text: string; typed: number; t: number; width?: number; placeholder?: string; send?: number }> = ({
  text,
  typed,
  t,
  width = 900,
  placeholder = "Ask anything...",
  send = 0,
}) => {
  const shown = text.slice(0, Math.max(0, Math.floor(typed)));
  return (
    <div
      style={{
        width,
        background: "#fff",
        borderRadius: 22,
        border: `1px solid ${C.line}`,
        boxShadow: SHADOW.float,
        padding: "22px 22px 16px 26px",
        fontFamily: SANS,
      }}
    >
      <div style={{ fontSize: 28, minHeight: 40, color: shown ? C.ink : "#9AA1AE" }}>
        {shown || placeholder}
        {shown && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: 30,
              background: C.brand,
              marginLeft: 3,
              verticalAlign: "-4px",
              opacity: Math.floor(t * 2.4) % 2 ? 0.2 : 1,
            }}
          />
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            background: shown ? C.brand : C.brandSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: String(1 - 0.12 * Math.sin(send * Math.PI)),
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path d="M12 19V5M5 12l7-7 7 7" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
};
/** Bars that grow and count up. */
export const Bars: React.FC<{
  t: number;
  at: number;
  data: { label: string; v: number; color?: string }[];
  height: number;
  width: number;
  fmt?: (v: number) => string;
}> = ({ t, at, data, height, width, fmt = (v) => Math.round(v).toLocaleString("en-US") }) => {
  const max = Math.max(...data.map((d) => d.v));
  return (
    <div style={{ width, height, display: "flex", alignItems: "flex-end", gap: width * 0.05, fontFamily: SANS }}>
      {data.map((d, i) => {
        const p = clampI(t, [at + i * 0.08, at + i * 0.08 + 0.7], [0, 1], EASE.out);
        return (
          <div
            key={d.label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              height: "100%",
              justifyContent: "flex-end",
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 600, opacity: p }}>{fmt(d.v * p)}</div>
            <div
              style={{ width: "100%", height: `${(d.v / max) * 78 * p}%`, background: d.color ?? C.brand, borderRadius: "6px 6px 2px 2px" }}
            />
            <div style={{ fontSize: 15, color: C.inkSoft, whiteSpace: "nowrap" }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
};
/** Rubber stamp ("Done.", "Saved.") slamming in. */
export const Stamp: React.FC<{ t: number; at: number; text: string; color?: string; size?: number; rotate?: number }> = ({
  t,
  at,
  text,
  color = C.brand,
  size = 100,
  rotate = -8,
}) => {
  const p = clampI(t, [at, at + 0.22], [0, 1], EASE.in);
  const settle = clampI(t, [at + 0.22, at + 0.5], [0, 1], EASE.out);
  const scale = p < 1 ? 2.4 - 1.4 * p : 1 + 0.06 * Math.sin(settle * Math.PI);
  return (
    <div
      style={{
        opacity: p,
        scale: String(scale),
        rotate: `${rotate}deg`,
        display: "inline-flex",
        border: `${size * 0.06}px solid ${color}`,
        borderRadius: size * 0.3,
        padding: `${size * 0.05}px ${size * 0.32}px ${size * 0.12}px`,
        color,
        fontFamily: SERIF,
        fontSize: size,
        lineHeight: 1.05,
        background: "rgba(255,255,255,0.85)",
      }}
    >
      {text}
    </div>
  );
};
export const Mono: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: MONO, fontSize: 15, color: C.inkSoft, letterSpacing: "0.01em", ...style }}>{children}</div>
);
/** Fictional person avatar (initials). Never use real people's names or photos. */
export const Avatar: React.FC<{ initials: string; color: string; size?: number }> = ({ initials, color, size = 30 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: color,
      color: "#fff",
      fontSize: size * 0.4,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SANS,
    }}
  >
    {initials}
  </div>
);
/** macOS/iOS-style notification that drops in from above. */
export const Notification: React.FC<{
  p: number;
  y: number;
  icon: React.ReactNode;
  app: string;
  when: string;
  title: string;
  body: React.ReactNode;
}> = ({ p, y, icon, app, when, title, body }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      top: y,
      opacity: Math.min(1, p * 1.5),
      translate: `0px ${(1 - p) * -140}px`,
      scale: String(0.94 + 0.06 * p),
      display: "flex",
      gap: 16,
      alignItems: "center",
      padding: "18px 22px",
      borderRadius: 26,
      background: "rgba(255,255,255,0.94)",
      border: `1px solid ${C.line}`,
      boxShadow: "0 18px 50px -18px rgba(17,19,24,0.35)",
      fontFamily: SANS,
    }}
  >
    <div
      style={{
        width: 58,
        height: 58,
        borderRadius: 14,
        background: "#fff",
        border: `1px solid ${C.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: MONO,
          fontSize: 13,
          color: C.inkSoft,
          letterSpacing: "0.06em",
        }}
      >
        <span>{app}</span>
        <span>{when}</span>
      </div>
      <div style={{ fontSize: 21, fontWeight: 600, marginTop: 3 }}>{title}</div>
      <div style={{ fontSize: 18, color: "#2A2F3A", marginTop: 2, lineHeight: 1.35 }}>{body}</div>
    </div>
  </div>
);
