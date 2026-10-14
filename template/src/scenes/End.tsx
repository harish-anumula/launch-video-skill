import { AbsoluteFill } from "remotion";
import { Grain } from "../components/Grain";
import { Headline } from "../components/Headline";
import { LogoMark, Wordmark } from "../components/Logo";
import { clampI, scene, useSpringAt, useT, wordAt } from "../lib/time";
import { voLines } from "../lib/vo";
import { C, MONO, SANS, SPRING } from "../theme";
import { CTA } from "./config";

// End card: lockup assembles, tagline (VO words after the product name), CTA button + URL. Holds ≥2s after the last word.
const ID = "end";
export const End: React.FC<{ taglineFrom?: number }> = ({ taglineFrom = 1 }) => {
  const t = useT();
  const sp = useSpringAt();
  const n = scene(ID).words.length;
  const cta = sp(wordAt(ID, n - 1) + 0.5, SPRING.card);
  return (
    <AbsoluteFill style={{ background: C.paper, clipPath: `circle(${clampI(t, [0, 0.4], [0, 1500])}px at 50% 45%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(70% 60% at 50% 42%, ${C.brandSoft} 0%, rgba(251,251,253,0) 70%)` }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 330,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 36,
        }}
      >
        <LogoMark size={176} color={C.brand} p={clampI(t, [0.05, 1.0], [0, 1], (x) => x)} />
        <Wordmark height={176} color={C.ink} p={clampI(t, [0.35, 1.3], [0, 1], (x) => x)} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 580 }}>
        <Headline
          t={t}
          size={68}
          weight={500}
          align="center"
          lines={[voLines(ID, { from: taglineFrom, perLine: 99, accent: [n - 1] }).flat()]}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 760,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
          opacity: cta,
          translate: `0px ${(1 - cta) * 40}px`,
        }}
      >
        <div
          style={{
            background: C.brand,
            color: "#fff",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 26,
            padding: "16px 34px",
            borderRadius: 999,
          }}
        >
          {CTA.button} →
        </div>
        <div style={{ fontFamily: MONO, fontSize: 24, color: C.inkSoft }}>{CTA.url}</div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
