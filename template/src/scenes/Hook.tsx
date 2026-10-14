import { AbsoluteFill } from "remotion";
import { Grain } from "../components/Grain";
import { Headline } from "../components/Headline";
import { Avatar } from "../components/App";
import { Card } from "../components/Ui";
import { clampI, scene, useSpringAt, useT, wordAt } from "../lib/time";
import { voLines } from "../lib/vo";
import { C, EASE, MONO, SPRING } from "../theme";

// Hook: one example hook (a pile of busywork cards lands while the line is spoken). It's a starting point, not a formula:
// replace it with the hook your story shape needs (references/storyboard-template.md).
const ID = "hook";
// Optional small chip above the headline (a time, a sound cue, a label). Leave "" for none. Write your own; don't reuse another video's opener.
const KICKER: string = "";
const Sheet = () => (
  <Card style={{ width: 440, padding: 0, overflow: "hidden" }} radius={16}>
    <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.line}`, fontSize: 17, fontWeight: 600 }}>plan_v7_final(2).xlsx</div>
    <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", fontFamily: MONO, fontSize: 14 }}>
      {["Item", "Q2", "Q3", "Alpha", "48,200", "51,900", "Beta", "#REF!", "22,750", "Gamma", "120,000", "118,400"].map((c, i) => (
        <div
          key={i}
          style={{
            padding: "8px 12px",
            borderBottom: `1px solid ${C.line}`,
            borderRight: `1px solid ${C.line}`,
            color: c === "#REF!" ? "#DC2626" : i < 3 ? C.inkSoft : C.ink,
            background: c === "#REF!" ? "#FEE2E2" : i < 3 ? C.muted : undefined,
          }}
        >
          {c}
        </div>
      ))}
    </div>
  </Card>
);
const Message = () => (
  <Card style={{ width: 420, padding: 20, display: "flex", gap: 14 }} radius={16}>
    <Avatar initials="AB" color="#0EA5E9" size={44} />
    <div>
      <div style={{ fontSize: 17, fontWeight: 700 }}>
        A teammate <span style={{ fontWeight: 400, color: C.inkSoft, fontSize: 14 }}>4:38 PM</span>
      </div>
      <div style={{ fontSize: 19, marginTop: 4, lineHeight: 1.35 }}>Can you send the update before you log off?</div>
    </div>
  </Card>
);
const Formula = () => (
  <Card style={{ padding: "14px 18px", fontFamily: MONO, fontSize: 18 }} radius={14}>
    =VLOOKUP(A2, Sheet3!A:F, 6, FALSE)
  </Card>
);
const Clock = () => (
  <Card style={{ padding: "12px 20px", display: "flex", gap: 10, alignItems: "center", fontSize: 20, fontWeight: 600 }} radius={999}>
    <div style={{ width: 10, height: 10, borderRadius: 5, background: C.amber }} /> Tue 4:41 PM
  </Card>
);
const PILE = [
  { el: <Sheet />, x: 1180, y: 250, r: -5, at: 0.3 },
  { el: <Message />, x: 1280, y: 560, r: 3.5, at: 0.9 },
  { el: <Formula />, x: 1120, y: 800, r: -3, at: 1.5 },
  { el: <Clock />, x: 1580, y: 180, r: 5, at: 2.1 },
];

export const Hook: React.FC = () => {
  const t = useT();
  const sp = useSpringAt();
  const s = scene(ID);
  const DUR = s.end - s.start;
  const exit = clampI(t, [DUR - 0.42, DUR], [0, 1], EASE.in);
  const bubble = sp(wordAt(ID, 0) - 0.25, SPRING.pop);
  const n = s.words.length || 6;
  return (
    <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ translate: `${-exit * 520}px 0px`, filter: `blur(${exit * 14}px)`, opacity: 1 - exit * 0.6 }}>
        {KICKER ? (<div
          style={{
            position: "absolute",
            left: 150,
            top: 262,
            transformOrigin: "0% 100%",
            scale: String(bubble),
            opacity: bubble,
            border: `2px solid ${C.ink}`,
            borderRadius: "22px 22px 22px 6px",
            padding: "8px 18px",
            fontFamily: MONO,
            fontSize: 24,
            background: "#fff",
          }}
        >
          {KICKER}
        </div>) : null}
        <div style={{ position: "absolute", left: 150, top: 360 }}>
          <Headline t={t} size={112} lines={voLines(ID, { perLine: 2, accent: [n - 1] })} />
        </div>
        {PILE.map((c, i) => {
          const p = sp(c.at, SPRING.card);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: c.x,
                top: c.y,
                opacity: Math.min(1, p * 1.5),
                translate: `${(1 - p) * 520}px ${(1 - p) * 260 + Math.sin(t * 1.6 + i * 1.7) * 6}px`,
                rotate: `${c.r + (1 - p) * 28}deg`,
                scale: String(0.82 + 0.18 * p),
              }}
            >
              {c.el}
            </div>
          );
        })}
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
