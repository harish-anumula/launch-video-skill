import { AbsoluteFill } from "remotion";
import React from "react";
import { Cursor } from "../components/Cursor";
import { Card, Check, INTEGRATIONS, IntegrationIcon, Spinner, type Integration } from "../components/Ui";
import { clampI, rand, useSpringAt } from "../lib/time";
import { C, EASE, MONO, SANS, SPRING } from "../theme";

type CloudIcon = { it: Integration; x: number; y: number; z: number; dealt: number };
const buildCloud = (DEALT: Integration[], POOL: Integration[]): CloudIcon[] => {
  const out: CloudIcon[] = [];
  const COLS = 9,
    ROWS = 5;
  const FRONT: Record<string, [number, number, number]> = {
    "1,1": [0, -0.5, 0.93],
    "3,3": [1, 0.35, 0.95],
    "6,1": [2, -0.4, 0.9],
    "5,2": [3, 0.0, 1.0],
  };
  let k = 4;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c,
        f = FRONT[`${c},${r}`];
      const x = ((c + 0.5) / COLS) * 2 - 1 + (rand(i * 3 + 1) - 0.5) * 0.14;
      const y = ((r + 0.5) / ROWS) * 2 - 1 + (rand(i * 7 + 2) - 0.5) * 0.3;
      if (f) out.push({ it: DEALT[f[0]], x, y: f[1], z: f[2], dealt: f[0] });
      else out.push({ it: POOL[k++ % POOL.length], x, y, z: 0.14 + 0.62 * rand(i * 11 + 3), dealt: -1 });
    }
  return out.sort((p, q) => p.z - q.z);
};
/** "A few named things… and many more": 4 cards deal in (one per spoken name), then fly back into a cloud of icons floating in
 *  3D depth. Optional interaction: click the front icon -> connecting -> connected, checks ripple outward, toast.
 *  Good for integrations, templates, customers' logos (with permission), file types, languages… */
export const DepthCloud: React.FC<{
  t: number;
  items?: Integration[];
  dealAt: number[];
  cloudAt: number;
  clickAt?: number;
  successLabel?: string;
}> = ({ t, items = INTEGRATIONS, dealAt, cloudAt, clickAt, successLabel = "Connected" }) => {
  const DEALT = items.slice(0, 4);
  const ROW_X = (i: number) => (1920 - (4 * 250 + 3 * 36)) / 2 + i * 286;

  const sp = useSpringAt();
  const CLOUD = buildCloud(DEALT, items.slice(4).length ? items.slice(4) : items);
  const DEAL = dealAt;
  const T_CLOUD = cloudAt;
  const T_CLICK = clickAt ?? 1e9;
  const T_DONE = T_CLICK + 0.8;
  const project = (c: CloudIcon, tt: number, zIn = 0) => {
    const drift = Math.max(0, tt - T_CLOUD) * 0.035;
    const zz = Math.min(1.12, c.z + drift - zIn);
    const k = 0.42 + 0.78 * zz;
    return {
      x: 960 + c.x * 880 * (0.72 + 0.28 * zz) + (zz - 0.5) * Math.max(0, tt - T_CLOUD) * 14,
      y: 668 + c.y * 290 * (0.78 + 0.22 * zz),
      size: 140 * k,
      blur: zz < 0.6 ? (0.6 - zz) * 11 : 0,
      op: 0.35 + 0.65 * Math.min(1, Math.max(0, zz)),
      zz,
    };
  };
  const HUB = CLOUD.find((c) => c.dealt === 3)!;
  const hub = project(HUB, T_CLICK);
  const gather = clampI(t, [T_CLOUD, T_CLOUD + 0.6], [0, 1], EASE.inOut);
  const connecting = sp(T_CLICK + 0.08, SPRING.pop) * clampI(t, [T_DONE + 0.5, T_DONE + 0.75], [1, 0], EASE.in);
  const done = clampI(t, [T_DONE, T_DONE + 0.3], [0, 1]);
  const dim = clampI(t, [T_CLICK + 0.05, T_CLICK + 0.3], [0, 1]) * clampI(t, [T_DONE + 0.5, T_DONE + 0.8], [1, 0]);
  const toast = sp(T_DONE + 0.05, SPRING.card);
  return (
    <AbsoluteFill>
      {CLOUD.map((c, i) => {
        const pIn = sp(T_CLOUD + (1 - c.z) * 0.35 + rand(i * 5) * 0.18, SPRING.soft);
        const pr = project(c, t, (1 - pIn) * 0.7);
        const badge = sp(T_DONE + 0.1 + Math.hypot(pr.x - hub.x, pr.y - hub.y) / 900, SPRING.pop);
        const press = c.dealt === 3 ? 1 - 0.06 * Math.sin(clampI(t, [T_CLICK - 0.05, T_CLICK + 0.2], [0, 1], (v) => v) * Math.PI) : 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pr.x - pr.size / 2,
              top: pr.y - pr.size / 2,
              width: pr.size,
              height: pr.size,
              borderRadius: pr.size * 0.24,
              background: "#fff",
              border: `1px solid ${C.line}`,
              boxShadow: `0 ${pr.size * 0.08}px ${pr.size * 0.25}px -${pr.size * 0.08}px rgba(17,19,24,${0.12 + 0.14 * pr.zz})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: pr.op * Math.min(1, pIn * 1.6),
              filter: pr.blur > 0.3 ? `blur(${pr.blur}px)` : undefined,
              scale: String(press),
            }}
          >
            <IntegrationIcon it={c.it} size={pr.size * 0.56} />
            {badge > 0.01 && pr.zz > 0.45 && (
              <div
                style={{
                  position: "absolute",
                  top: -pr.size * 0.07,
                  right: -pr.size * 0.07,
                  width: pr.size * 0.26,
                  height: pr.size * 0.26,
                  borderRadius: "50%",
                  background: C.green,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  scale: String(badge),
                  boxShadow: "0 0 0 3px #fff",
                }}
              >
                <Check size={pr.size * 0.16} color="#fff" p={badge} />
              </div>
            )}
          </div>
        );
      })}
      {DEALT.map((it, i) => {
        const p = sp(DEAL[i] - 0.12, SPRING.card);
        const target = project(CLOUD.find((c) => c.dealt === i)!, T_CLOUD + 0.5);
        const fade = clampI(t, [T_CLOUD + 0.3, T_CLOUD + 0.55], [1, 0]);
        if (fade <= 0) return null;
        return (
          <Card
            key={it.id}
            style={{
              position: "absolute",
              left: ROW_X(i) + (target.x - 125 - ROW_X(i)) * gather,
              top: 420 + (target.y - 145 - 420) * gather,
              width: 250,
              height: 290,
              padding: 26,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              opacity: Math.min(1, p * 1.4) * fade,
              translate: `${(1 - p) * 760}px ${(1 - p) * 420}px`,
              rotate: `${(1 - p) * 32 + (i - 1.5) * 1.6 * (1 - gather)}deg`,
              scale: String((0.8 + 0.2 * p) * (1 - 0.45 * gather)),
            }}
            radius={24}
          >
            <div style={{ fontFamily: MONO, fontSize: 15, color: C.inkSoft }}>
              // {it.id} · 0{i + 1}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <IntegrationIcon it={it} size={96} />
            </div>
            <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.03em" }}>{it.name}</div>
          </Card>
        );
      })}
      <AbsoluteFill style={{ background: `rgba(251,251,253,${0.72 * dim})` }} />
      {clickAt !== undefined && connecting > 0.01 && (
        <Card
          style={{
            position: "absolute",
            left: 670,
            top: 520,
            width: 580,
            padding: 34,
            display: "flex",
            alignItems: "center",
            gap: 22,
            scale: String(0.85 + 0.15 * connecting),
            opacity: connecting,
          }}
          radius={22}
        >
          <IntegrationIcon it={DEALT[3]} size={64} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 30, fontWeight: 600 }}>
              {done > 0.5 ? `${DEALT[3].name}: ${successLabel.toLowerCase()}` : `Linking ${DEALT[3].name}…`}
            </div>
            <div style={{ fontSize: 19, color: C.inkSoft, marginTop: 4 }}>
              {done > 0.5 ? "Ready to use" : "Approve access in the new tab"}
            </div>
          </div>
          {done < 0.5 ? (
            <Spinner t={t} size={40} />
          ) : (
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                background: C.green,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check size={28} color="#fff" p={done} />
            </div>
          )}
        </Card>
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 70,
          display: "flex",
          justifyContent: "center",
          opacity: toast,
          translate: `0px ${(1 - toast) * 60}px`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: C.ink,
            color: "#fff",
            borderRadius: 14,
            padding: "14px 22px",
            fontFamily: SANS,
            fontSize: 21,
            fontWeight: 500,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              background: C.green,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Check size={16} color="#fff" />
          </div>
          {successLabel}
        </div>
      </div>
      {clickAt !== undefined && (
        <Cursor
          t={t}
          appearAt={T_CLICK - 0.75}
          hideAt={T_DONE + 0.9}
          clicks={[T_CLICK]}
          keys={[
            { t: T_CLICK - 0.75, x: 1680, y: 1010 },
            { t: T_CLICK - 0.05, x: hub.x + 10, y: hub.y + 6 },
            { t: T_DONE + 1.2, x: hub.x + 180, y: hub.y + 160 },
          ]}
          scale={1.3}
        />
      )}
    </AbsoluteFill>
  );
};
