import React from "react";
import { AbsoluteFill } from "remotion";
import { Bars, Composer } from "../components/App";
import { Card } from "../components/Ui";
import { clampI, useSpringAt } from "../lib/time";
import { C, EASE, SANS, SPRING, UI } from "../theme";

/** Type a request -> it becomes a sent bubble -> a result card rises (title, body, optional bars).
 *  Good for AI assistants, search, commands, forms: anything where the user asks and the product answers. */
export const ComposerAnswer: React.FC<{
  t: number;
  at: number;
  question: string;
  title: string;
  body: React.ReactNode;
  bars?: { label: string; v: number; color?: string }[];
  fmt?: (v: number) => string;
}> = ({ t, at, question, title, body, bars, fmt }) => {
  const sp = useSpringAt();
  const typedEnd = at + question.length / 30,
    send = typedEnd + 0.12;
  const sent = clampI(t, [send, send + 0.45], [0, 1], EASE.inOut);
  const answer = sp(send + 0.25, SPRING.card);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 460 + sent * 520,
          top: 420 - sent * 120,
          opacity: clampI(t, [at - 0.3, at], [0, 1]),
          scale: String(1 - sent * 0.45),
          transformOrigin: "100% 0%",
        }}
      >
        <div style={{ opacity: 1 - sent }}>
          <Composer
            text={question}
            typed={clampI(t, [at, typedEnd], [0, question.length], (x) => x)}
            t={t}
            width={1000}
            send={clampI(t, [send - 0.1, send + 0.1], [0, 1], (x) => x)}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 214,
          top: 300,
          opacity: sent,
          background: UI.bubble,
          color: C.ink,
          borderRadius: 22,
          padding: "16px 24px",
          fontFamily: SANS,
          fontSize: 26,
        }}
      >
        {question}
      </div>
      <Card
        style={{
          position: "absolute",
          left: 214,
          top: 400,
          width: 1492,
          height: 560,
          padding: "36px 44px",
          opacity: answer,
          translate: `0px ${(1 - answer) * 120}px`,
          display: "flex",
          gap: 56,
        }}
        radius={24}
      >
        <div style={{ width: bars ? 520 : 1400 }}>
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em" }}>{title}</div>
          <div style={{ fontSize: 23, lineHeight: 1.5, marginTop: 18, color: UI.body }}>{body}</div>
        </div>
        {bars && (
          <div style={{ flex: 1, paddingTop: 10 }}>
            <Bars t={t} at={send + 0.55} width={820} height={470} data={bars} fmt={fmt} />
          </div>
        )}
      </Card>
    </AbsoluteFill>
  );
};
