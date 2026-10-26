import React from "react";
import { AppWindow, Mono } from "../components/App";
import { Cursor } from "../components/Cursor";
import { clampI } from "../lib/time";
import { C, MONO, UI } from "../theme";

/** Example rebuilt screen for <Device>: KPIs + line + bars; a filter click at `filterAt` updates every number live.
 *  Replace with a simplified rebuild of your product's real screen (keep its real copy and layout). */
export const DashboardMock: React.FC<{ t: number; at: number; filterAt: number }> = ({ t, at, filterAt }) => {
  const count = clampI(t, [at + 0.15, at + 1.1], [0, 1]);
  const f = clampI(t, [filterAt + 0.1, filterAt + 0.8], [0, 1]);
  const lerp = (a: number, b: number) => (a + (b - a) * f) * count;
  const K = [
    ["REVENUE", 2.7, 0.9, (v: number) => `$${v.toFixed(1)}M`],
    ["NEW USERS", 9.6, 3.1, (v: number) => `${v.toFixed(1)}K`],
    ["ACTIVE TEAMS", 527, 174, (v: number) => `${Math.round(v)}`],
    ["NPS", 58, 63, (v: number) => `${Math.round(v)}`],
  ] as const;
  const pts = (scale: number) => Array.from({ length: 13 }, (_, i) => [i * 55, 200 - (60 + i * 8 + Math.sin(i) * 10) * scale] as const);
  const line = (scale: number) =>
    pts(scale)
      .map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`)
      .join(" ");
  const draw = clampI(t, [at + 0.3, at + 1.2], [0, 1]);
  return (
    <AppWindow title="Dashboard" width={1320} height={800} style={{ borderRadius: 0, boxShadow: "none" }}>
      <div style={{ padding: "22px 28px", background: UI.screen, height: "100%" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>Overview</div>
          <div
            style={{
              marginLeft: 16,
              border: `1px solid ${f > 0.5 ? C.brand : C.line}`,
              background: f > 0.5 ? C.brandSoft : C.card,
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 15,
            }}
          >
            Region: <b>{f > 0.5 ? "Europe" : "All"}</b> ▾
          </div>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
          {K.map(([k, a, b, fmt]) => (
            <div key={k} style={{ flex: 1, background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: "14px 18px" }}>
              <Mono style={{ fontSize: 13, letterSpacing: "0.06em" }}>{k}</Mono>
              <div style={{ fontSize: 34, fontWeight: 600, marginTop: 4 }}>{fmt(lerp(a, b))}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
          <div style={{ flex: 1.4, background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 17, fontWeight: 600 }}>Trend</div>
            <svg width={660} height={220} style={{ marginTop: 10 }}>
              <defs>
                <clipPath id="d">
                  <rect width={660 * draw} height={220} />
                </clipPath>
              </defs>
              <path clipPath="url(#d)" d={line(1 - f * 0.55)} fill="none" stroke={C.brand} strokeWidth={3} />
            </svg>
          </div>
          <div
            style={{
              flex: 1,
              background: C.card,
              border: `1px solid ${C.line}`,
              borderRadius: 14,
              padding: 18,
              display: "flex",
              alignItems: "flex-end",
              gap: 18,
              height: 270,
            }}
          >
            {[0.4, 0.75, 1, 0.6].map((v, i) => (
              <div
                key={i}
                style={{ flex: 1, height: `${v * (1 - f * 0.45) * 80 * draw}%`, background: C.brand, borderRadius: "5px 5px 0 0" }}
              />
            ))}
          </div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 14, color: C.inkSoft, marginTop: 16 }}>Fictional example data</div>
      </div>
      <Cursor
        t={t}
        appearAt={filterAt - 0.6}
        hideAt={filterAt + 0.7}
        clicks={[filterAt]}
        keys={[
          { t: filterAt - 0.6, x: 640, y: 700 },
          { t: filterAt - 0.04, x: 300, y: 36 },
          { t: filterAt + 0.8, x: 420, y: 300 },
        ]}
        scale={1.5}
      />
    </AppWindow>
  );
};
