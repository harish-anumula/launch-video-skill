import React from "react";
import { Notification } from "../components/App";
import { clampI, useSpringAt } from "../lib/time";
import { C, SHADOW, SPRING, glass } from "../theme";

export type Note = { at: number; icon: React.ReactNode; app: string; title: string; body: React.ReactNode };
/** Notifications drop in from above; each new one pushes the previous down. `stackAt` shows older ones peeking behind.
 *  Good for anything the product sends: alerts, reports, reminders, messages, deliveries. */
export const Notifications: React.FC<{ t: number; notes: Note[]; x?: number; y?: number; width?: number; stackAt?: number }> = ({
  t,
  notes,
  x = 1090,
  y = 400,
  width = 650,
  stackAt,
}) => {
  const sp = useSpringAt();
  const ps = notes.map((n) => sp(n.at, SPRING.card));
  const stackP = stackAt === undefined ? 0 : clampI(t, [stackAt, stackAt + 0.4], [0, 1]);
  return (
    <div style={{ position: "absolute", left: x, top: y, width }}>
      {[2, 1].map((k) => (
        <div
          key={k}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: (notes.length - 1) * 150 + 26 + k * 14,
            height: 120,
            borderRadius: 26,
            background: glass(0.9),
            border: `1px solid ${C.line}`,
            boxShadow: SHADOW.card,
            scale: `${1 - k * 0.05} 1`,
            opacity: stackP * (0.75 - k * 0.2),
          }}
        />
      ))}
      {notes.map((n, i) => {
        const below = ps.slice(i + 1).reduce((a, p) => a + p, 0); // newer notes push this one down
        return (
          <Notification
            key={i}
            p={ps[i]}
            y={below * 150}
            icon={n.icon}
            app={n.app}
            when={below > 0.5 ? `${Math.round(below)}m ago` : "now"}
            title={n.title}
            body={n.body}
          />
        );
      })}
    </div>
  );
};
