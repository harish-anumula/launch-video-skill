import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { Stamp } from "./components/App";
import { Headline } from "./components/Headline";
import { Card } from "./components/Ui";
import { useT } from "./lib/time";
import { C, MONO, SANS } from "./theme";
import { BeforeAfter } from "./visuals/BeforeAfter";
import { ComposerAnswer } from "./visuals/ComposerAnswer";
import { DashboardMock } from "./visuals/DashboardMock";
import { DepthCloud } from "./visuals/DepthCloud";
import { Device } from "./visuals/Device";
import { Notifications } from "./visuals/Notifications";
import { Phone } from "./visuals/Phone";
import { StatCountUp } from "./visuals/StatCountUp";
import { Steps } from "./visuals/Steps";
import { IntegrationIcon, INTEGRATIONS } from "./components/Ui";

/** Preview every visual building block, 4s each, so you can pick moves for a new product. */
const Slot: React.FC<{ name: string; children: (t: number) => React.ReactNode }> = ({ name, children }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: C.paper, fontFamily: SANS, color: C.ink }}>
      <div style={{ position: "absolute", left: 56, top: 44, fontFamily: MONO, fontSize: 18, color: C.inkSoft }}>// visuals/{name}</div>
      {children(t)}
    </AbsoluteFill>
  );
};
const Messy = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: "#FEF3C7",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 40,
      color: "#92400E",
    }}
  >
    12 tabs, 3 spreadsheets
  </div>
);
const Clean = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      background: C.brandSoft,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 40,
      color: C.brand,
    }}
  >
    One view
  </div>
);
const ITEMS: [string, (t: number) => React.ReactNode][] = [
  ["DepthCloud", (t) => <DepthCloud t={t} dealAt={[0.2, 0.5, 0.8, 1.1]} cloudAt={1.6} clickAt={2.6} />],
  [
    "ComposerAnswer",
    (t) => (
      <ComposerAnswer
        t={t}
        at={0.2}
        question="Summarise this week"
        title="This week"
        body="Three things changed."
        bars={[
          { label: "A", v: 3 },
          { label: "B", v: 5 },
          { label: "C", v: 4 },
        ]}
      />
    ),
  ],
  [
    "Notifications",
    (t) => (
      <Notifications
        t={t}
        x={635}
        y={380}
        stackAt={2.4}
        notes={[
          {
            at: 0.4,
            icon: <IntegrationIcon it={INTEGRATIONS[5]} size={40} />,
            app: "CHAT",
            title: "Report ready",
            body: "Up 18% week over week",
          },
          { at: 1.4, icon: <IntegrationIcon it={INTEGRATIONS[7]} size={40} />, app: "EMAIL", title: "Your Monday report", body: "Open it" },
        ]}
      />
    ),
  ],
  [
    "Device",
    (t) => (
      <Device t={t} at={0.1} end={4}>
        <DashboardMock t={t} at={0.3} filterAt={2.4} />
      </Device>
    ),
  ],
  [
    "Phone",
    (t) => (
      <Phone t={t} at={0.1} end={4} x={750} y={110}>
        <div style={{ padding: 30, paddingTop: 70, fontSize: 30, fontWeight: 600 }}>Your app screen</div>
      </Phone>
    ),
  ],
  ["BeforeAfter", (t) => <BeforeAfter t={t} at={1.2} before={<Messy />} after={<Clean />} />],
  [
    "Steps",
    (t) => (
      <Steps
        t={t}
        x={550}
        title="Setup"
        steps={[
          { label: "Connect your data", at: 0.8 },
          { label: "Pick a template", at: 1.6 },
          { label: "Share with the team", at: 2.4 },
        ]}
      />
    ),
  ],
  ["StatCountUp", (t) => <StatCountUp t={t} at={0.3} value={1200} caption="example number: use only real, approved figures" />],
  [
    "Stamp + Headline",
    (t) => (
      <>
        <div style={{ position: "absolute", left: 150, top: 300 }}>
          <Headline
            t={t}
            size={120}
            lines={[
              [
                { text: "Saved", at: 0.3 },
                { text: "for", at: 0.5 },
              ],
              [{ text: "everyone.", at: 0.7, serif: true, underline: true }],
            ]}
          />
        </div>
        <Card style={{ position: "absolute", left: 1100, top: 380, width: 520, height: 260 }} />
        <div style={{ position: "absolute", left: 1180, top: 460 }}>
          <Stamp t={t} at={1.5} text="Done." />
        </div>
      </>
    ),
  ],
];
export const CATALOG_SECONDS = 4;
export const Catalog: React.FC = () => (
  <Series>
    {ITEMS.map(([name, render]) => (
      <Series.Sequence key={name} durationInFrames={CATALOG_SECONDS * 30}>
        <Slot name={name}>{render}</Slot>
      </Series.Sequence>
    ))}
  </Series>
);
export const CATALOG_COUNT = ITEMS.length;
