import { AbsoluteFill } from "remotion";
import { Grain } from "../components/Grain";
import { Headline } from "../components/Headline";
import { LogoMark, Wordmark } from "../components/Logo";
import { clampI, scene, useT, wordAt } from "../lib/time";
import { voLines } from "../lib/vo";
import { BRAND_BG, C, EASE, SANS } from "../theme";

// Reveal: brand field whips in, optional lead words rise, the mark assembles, the name wipes in, the tagline is spoken.
// Set LEAD_TEXT to the words spoken before the product name (for example "Introducing"), or leave "" to go straight to the name.
// TAGLINE_FROM counts the lead words plus the product name's words; adjust NAME_WORDS for multi-word names.
const ID = "reveal";
export const REVEAL_LEAD = 0.42;
const LEAD_TEXT: string = "";
const LEAD_WORDS = LEAD_TEXT ? LEAD_TEXT.split(" ").length : 0;
const NAME_WORDS = 1;
const TAGLINE_FROM = LEAD_WORDS + NAME_WORDS;
export const LOCKUP = { markH: 160, top: 400 };
export const MARK_CENTER = { x: 960 - 200, y: LOCKUP.top + LOCKUP.markH / 2 }; // approx; used by the next scene's iris

export const Reveal: React.FC = () => {
  const t = useT(REVEAL_LEAD);
  const w = (i: number) => wordAt(ID, i);
  const n = scene(ID).words.length;
  const wipe = clampI(t, [-REVEAL_LEAD, 0], [0, 1], EASE.inOut);
  const nameAt = w(LEAD_WORDS);
  const leadIn = clampI(t, [w(0) - 0.05, w(0) + 0.35], [0, 1]);
  const leadUp = clampI(t, [nameAt - 0.1, nameAt + 0.5], [0, 1], EASE.inOut);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ background: BRAND_BG, transform: `translateX(${(1 - wipe) * 2200}px) skewX(${(1 - wipe) * -14}deg)` }}>
        <AbsoluteFill style={{ scale: String(clampI(t, [0, 5], [1.06, 1])) }}>
          {LEAD_TEXT ? (<div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              fontFamily: SANS,
              fontWeight: 600,
              color: C.onBrand,
              letterSpacing: "-0.04em",
              top: 380 - leadUp * 160,
              fontSize: 170 - leadUp * 118,
              opacity: leadIn * (1 - leadUp * 0.25),
              translate: `0px ${(1 - leadIn) * 60}px`,
            }}
          >
            {LEAD_TEXT}
          </div>) : null}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: LOCKUP.top,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 34,
            }}
          >
            <LogoMark size={LOCKUP.markH} color={C.onBrand} p={clampI(t, [nameAt - 0.05, nameAt + 1.0], [0, 1], (x) => x)} />
            <Wordmark height={LOCKUP.markH} color={C.onBrand} p={clampI(t, [nameAt + 0.15, nameAt + 0.9], [0, 1], (x) => x)} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 640 }}>
            <Headline
              t={t}
              size={62}
              color={C.onBrand}
              accent={C.onBrand}
              align="center"
              weight={500}
              lines={[voLines(ID, { from: TAGLINE_FROM, perLine: 99, accent: [n - 2, n - 1] }).flat()]}
            />
          </div>
        </AbsoluteFill>
        <Grain opacity={0.12} blend="soft-light" />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
