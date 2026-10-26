import React from "react";
import { AbsoluteFill } from "remotion";
import { Bars, Mono } from "../components/App";
import { Grain } from "../components/Grain";
import { Headline, Tok, tokLines } from "../components/Headline";
import { Card, INTEGRATIONS, IntegrationIcon } from "../components/Ui";
import { clampI, useSpringAt, useT } from "../lib/time";
import { BEAT } from "../lib/kit";
import { C, EASE, SCENE_MOTION, SPRING, UI } from "../theme";

/** Clean Launch signature. A headline builds word by word with one italic serif accent and its hand-drawn underline, and one
 *  UI card rises on the headline's left edge to prove the claim (bars grow, then its sources land one per beat).
 *  Full-frame scene, 4 to 6 s. Replace the card's content with a rebuilt piece of the real product. */
export const HeadlineProof: React.FC<{
  dur?: number;
  lines?: Tok[][];
  cardAt?: number; // seconds when the card rises
  title?: string;
  body?: React.ReactNode;
  bars?: { label: string; v: number }[];
  sources?: number[]; // indices into INTEGRATIONS
}> = ({
  dur = 5,
  lines = tokLines("Every answer comes|with its *sources.*", 0.2),
  cardAt = 2 * BEAT,
  title = "Signups rose 18% this week",
  body = "Most came from the new onboarding flow. Fictional example data.",
  bars = [
    { label: "Mon", v: 42 },
    { label: "Tue", v: 48 },
    { label: "Wed", v: 45 },
    { label: "Thu", v: 53 },
    { label: "Fri", v: 61 },
  ],
  sources = [8, 2],
}) => {
  const t = useT();
  const sp = useSpringAt();
  const card = sp(cardAt, SPRING.card);
  const push = 1 + SCENE_MOTION.push * clampI(t, [0, dur], [0, 1], EASE.inOut);
  const fade = SCENE_MOTION.exitFade;
  const exit = fade > 0 ? clampI(t, [dur - fade, dur], [0, 1], EASE.in) : 0;
  const chipsAt = cardAt + 4 * BEAT;
  return (
    <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(push + exit * SCENE_MOTION.exitPush), opacity: 1 - exit, transformOrigin: "30% 45%" }}>
        <div style={{ position: "absolute", left: 150, top: 150 }}>
          <Headline t={t} size={108} lines={lines} />
        </div>
        <Card
          style={{
            position: "absolute",
            left: 150,
            top: 455,
            width: 1620,
            height: 470,
            padding: "40px 48px",
            display: "flex",
            gap: 64,
            opacity: Math.min(1, card * 1.4),
            translate: `0px ${(1 - card) * 120}px`,
          }}
          radius={26}
        >
          <div style={{ width: 600, display: "flex", flexDirection: "column" }}>
            <Mono style={{ fontSize: 18, letterSpacing: "0.08em", color: C.brand }}>ANSWER</Mono>
            <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", marginTop: 10, lineHeight: 1.15 }}>{title}</div>
            <div style={{ fontSize: 24, lineHeight: 1.5, marginTop: 16, color: UI.body }}>{body}</div>
            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 14 }}>
              <Mono style={{ fontSize: 17, letterSpacing: "0.06em" }}>SOURCES</Mono>
              {sources.map((k, i) => {
                const p = sp(chipsAt + i * BEAT, SPRING.pop);
                return (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 16px 8px 8px",
                      borderRadius: 999,
                      border: `1px solid ${C.line}`,
                      background: C.muted,
                      fontSize: 20,
                      fontWeight: 500,
                      opacity: Math.min(1, p * 1.5),
                      scale: String(0.7 + 0.3 * p),
                    }}
                  >
                    <IntegrationIcon it={INTEGRATIONS[k]} size={30} />
                    {INTEGRATIONS[k].name}
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ flex: 1, paddingTop: 6 }}>
            <Bars
              t={t}
              at={cardAt + 0.35}
              width={850}
              height={386}
              data={bars.map((b, i) => ({ ...b, color: i === bars.length - 1 ? C.brand : C.brandSoft }))}
            />
          </div>
        </Card>
      </AbsoluteFill>
      <Grain />
    </AbsoluteFill>
  );
};
