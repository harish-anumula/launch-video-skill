// THE FILE TO EDIT PER PRODUCT. One entry per scene id in config/timeline.json, in order.
// Pick a visual per feature beat from visuals/ (or write a new one); anything without a visual renders as a big VO-synced headline.
import React from "react";
import { Card, IntegrationIcon, INTEGRATIONS } from "./components/Ui";
import { End } from "./scenes/End";
import { Feature } from "./scenes/Feature";
import { Hook } from "./scenes/Hook";
import { Payoff, PAYOFF_LEAD } from "./scenes/Payoff";
import { Reveal, REVEAL_LEAD } from "./scenes/Reveal";
import { C, MONO, PRESET } from "./theme";
import { ComposerAnswer } from "./visuals/ComposerAnswer";
import { DashboardMock } from "./visuals/DashboardMock";
import { DepthCloud } from "./visuals/DepthCloud";
import { Device } from "./visuals/Device";
import { Notifications } from "./visuals/Notifications";
import { SIGNATURES } from "./visuals/signatures";

export type SceneDef = { C: React.FC; lead?: number };

export const SCENES: Record<string, SceneDef> = {
  hook: { C: Hook },
  reveal: { C: Reveal, lead: REVEAL_LEAD },

  // "Bring in A, B, C… and dozens more": cards deal in, fly into a depth cloud, click the front one.
  connect: {
    C: () => (
      <Feature
        id="connect"
        perLine={5}
        visual={(c) => (
          <DepthCloud
            t={c.t}
            dealAt={[0, 1, 2, 3].map((i) => c.vo0 + (c.vo1 - c.vo0) * (0.08 + i * 0.12))}
            cloudAt={c.vo0 + (c.vo1 - c.vo0) * 0.6}
            clickAt={c.vo0 + (c.vo1 - c.vo0) * 0.6 + 1.6}
          />
        )}
      />
    ),
  },

  // Ask: type a request, get a result.
  ask: {
    C: () => (
      <Feature
        id="ask"
        visual={(c) => (
          <ComposerAnswer
            t={c.t}
            at={c.vo0 + 0.15}
            question="What changed this week?"
            title="This week"
            body={
              <>
                Three projects moved to review and <b>12 tasks</b> closed. Two items are waiting on you.
              </>
            }
            bars={[
              { label: "Mon", v: 5 },
              { label: "Tue", v: 8 },
              { label: "Wed", v: 6 },
              { label: "Thu", v: 11, color: C.green },
            ]}
          />
        )}
      />
    ),
  },

  // "A summary every morning": the product delivers; notifications arrive.
  notify: {
    C: () => (
      <Feature
        id="notify"
        visual={(c) => (
          <>
            <Card style={{ position: "absolute", left: 150, top: 440, width: 800, padding: "28px 32px" }} radius={22}>
              <div style={{ fontFamily: MONO, fontSize: 14, color: C.brand }}>SCHEDULE</div>
              <div style={{ fontSize: 30, fontWeight: 600, marginTop: 6 }}>Daily summary · Every morning at 8 AM</div>
              <div style={{ fontSize: 20, color: C.inkSoft, marginTop: 8 }}>Delivered to chat and email</div>
            </Card>
            <Notifications
              t={c.t}
              stackAt={c.vo1 + 0.4}
              notes={[
                {
                  at: c.w(4),
                  icon: <IntegrationIcon it={INTEGRATIONS[5]} size={40} />,
                  app: "CHAT",
                  title: "Your morning summary",
                  body: "3 updates, 2 waiting on you.",
                },
                {
                  at: c.w(5) + 0.4,
                  icon: <IntegrationIcon it={INTEGRATIONS[7]} size={40} />,
                  app: "EMAIL",
                  title: "Daily summary",
                  body: "Open the full summary",
                },
              ]}
            />
          </>
        )}
      />
    ),
  },

  // "Everything on one live board": device mockup with a rebuilt screen and a live filter change.
  laptop: {
    C: () => (
      <Feature
        id="laptop"
        visual={(c) => (
          <Device t={c.t} at={c.vo0 + 0.9} end={c.dur}>
            <DashboardMock t={c.t} at={c.vo0 + 1.1} filterAt={c.vo0 + 3.2} />
          </Device>
        )}
      />
    ),
  },

  payoff: { C: () => <Payoff />, lead: PAYOFF_LEAD },
  end: { C: () => <End /> },
};

// The active preset's signature scene takes one beat (visuals/signatures.tsx), so a render in any preset shows its own move.
// Clean Launch keeps the storyboard above as is: its signature is the Feature beat itself. Delete these lines to opt out.
const SIG = SIGNATURES[PRESET].beat;
if (SIG && SCENES[SIG.id]) SCENES[SIG.id] = { C: SIG.C, lead: SIG.lead };
