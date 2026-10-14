import React from "react";
import { Card, Check } from "../components/Ui";
import { clampI, useSpringAt } from "../lib/time";
import { C, SANS, SPRING } from "../theme";

/** A checklist that ticks itself off, one step per beat. Good for workflows, onboarding, "set up in 3 steps", agents doing work. */
export const Steps: React.FC<{
  t: number;
  steps: { label: string; at: number }[];
  x?: number;
  y?: number;
  width?: number;
  title?: string;
}> = ({ t, steps, x = 900, y = 380, width = 820, title }) => {
  const sp = useSpringAt();
  return (
    <Card style={{ position: "absolute", left: x, top: y, width, padding: "26px 30px" }} radius={22}>
      {title && <div style={{ fontSize: 26, fontWeight: 600, marginBottom: 12 }}>{title}</div>}
      {steps.map((s, i) => {
        const inP = sp(s.at - 0.35, SPRING.card);
        const done = clampI(t, [s.at, s.at + 0.3], [0, 1]);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: "12px 0",
              borderBottom: i < steps.length - 1 ? `1px solid ${C.muted}` : "none",
              opacity: inP,
              translate: `${(1 - inP) * 30}px 0px`,
              fontFamily: SANS,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                border: `2px solid ${done > 0.5 ? C.green : C.line}`,
                background: done > 0.5 ? C.green : "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {done > 0 && <Check size={20} color="#fff" p={done} />}
            </div>
            <div style={{ fontSize: 24, color: done > 0.5 ? C.ink : C.inkSoft }}>{s.label}</div>
          </div>
        );
      })}
    </Card>
  );
};
