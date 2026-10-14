import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain } from "../components/Grain";
import { Headline } from "../components/Headline";
import { clampI, scene, useSpringAt, useT, wordAt } from "../lib/time";
import { voLines } from "../lib/vo";
import { BRAND_BG, C, EASE } from "../theme";
import { toneOf } from "./config";

export type Ctx = {
  t: number;
  id: string;
  dur: number;
  vo0: number;
  vo1: number;
  w: (i: number) => number;
  sp: ReturnType<typeof useSpringAt>;
};
/** Generic feature beat: VO-synced kinetic headline (top-left) + one visual. The visual is a render function so any product
 *  can plug in any move (see visuals/). `accent` = indices of spoken words to set in the italic serif. */
export const Feature: React.FC<{
  id: string;
  accent?: number[];
  perLine?: number;
  lead?: number;
  visual?: (c: Ctx) => React.ReactNode;
  headlineTop?: number;
}> = ({ id, accent, perLine = 4, lead = 0, visual, headlineTop = 150 }) => {
  const t = useT(lead);
  const sp = useSpringAt();
  const s = scene(id);
  const dur = s.end - s.start;
  const n = s.words.length;
  const brand = toneOf(id) === "brand";
  const enter = lead > 0 ? clampI(t, [-lead, 0], [0, 1], EASE.inOut) : 1;
  const exit = clampI(t, [dur - 0.3, dur], [0, 1], EASE.in);
  const ctx: Ctx = { t, id, dur, vo0: s.voOffset, vo1: s.voOffset + (s.voDur || n * 0.38), w: (i) => wordAt(id, i), sp };
  return (
    <AbsoluteFill
      style={{ background: brand ? BRAND_BG : C.paper, overflow: "hidden", translate: lead ? `0px ${(1 - enter) * 1100}px` : undefined }}
    >
      <AbsoluteFill style={{ opacity: 1 - exit, scale: String(1 + exit * 0.05) }}>
        <div style={{ position: "absolute", left: 150, top: headlineTop, zIndex: 5 }}>
          <Headline
            t={t}
            size={visual ? 96 : 112}
            color={brand ? "#fff" : C.ink}
            accent={brand ? "#fff" : C.brand}
            lines={voLines(id, { perLine, accent: accent ?? [n - 1] })}
          />
        </div>
        {visual?.(ctx)}
      </AbsoluteFill>
      <Grain opacity={brand ? 0.12 : 0.07} blend={brand ? "soft-light" : "multiply"} />
    </AbsoluteFill>
  );
};
