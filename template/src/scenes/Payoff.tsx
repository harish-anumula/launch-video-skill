import { AbsoluteFill } from "remotion";
import { Grain } from "../components/Grain";
import { Headline } from "../components/Headline";
import { LogoMark } from "../components/Logo";
import { clampI, scene, useT } from "../lib/time";
import { voLines } from "../lib/vo";
import { BRAND_BG, EASE } from "../theme";

// Payoff: brand panel rises, big white type, the last words in the serif accent. Keep the music playing underneath.
const ID = "payoff";
export const PAYOFF_LEAD = 0.4;
export const Payoff: React.FC<{ accentLast?: number; perLine?: number }> = ({ accentLast = 2, perLine = 2 }) => {
  const t = useT(PAYOFF_LEAD);
  const s = scene(ID);
  const n = s.words.length;
  const dur = s.end - s.start;
  const wipe = clampI(t, [-PAYOFF_LEAD, 0], [0, 1], EASE.inOut);
  return (
    <AbsoluteFill style={{ background: BRAND_BG, overflow: "hidden", translate: `0px ${(1 - wipe) * 1100}px` }}>
      <div style={{ position: "absolute", right: 150, top: 250, opacity: 0.12, rotate: `${t * 6}deg` }}>
        <LogoMark size={600} color="#fff" />
      </div>
      <AbsoluteFill style={{ opacity: 1 - clampI(t, [dur - 0.25, dur], [0, 1], EASE.in) }}>
        <div style={{ position: "absolute", left: 214, top: 250 }}>
          <Headline
            t={t}
            size={140}
            color="#fff"
            accent="#fff"
            lineHeight={1.02}
            lines={voLines(ID, { perLine, sentences: true, accent: Array.from({ length: accentLast }, (_, k) => n - 1 - k) })}
          />
        </div>
      </AbsoluteFill>
      <Grain opacity={0.12} blend="soft-light" />
    </AbsoluteFill>
  );
};
