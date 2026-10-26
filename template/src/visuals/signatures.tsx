// One signature scene per style preset. Each is a full-frame scene (3 to 6 s, on the beat grid) built from the preset's
// tokens, so it also works in another preset as the one borrowed move. The default storyboard (video.config.tsx) plays the
// active preset's signature for one beat; `beat` names which scene id it replaces. Clean Launch has no swap: its signature
// is the template's own Feature beat (headline, serif accent, underline, one card), shown standalone as HeadlineProof.
import React from "react";
import { BEAT } from "../lib/kit";
import { scene, wordAt } from "../lib/time";
import { voLines } from "../lib/vo";
import { tokLines } from "../components/Headline";
import { REVEAL_LEAD } from "../scenes/Reveal";
import { PRESETS, type PresetId } from "../presets";
import { BentoSnap } from "./BentoSnap";
import { BrandWhip } from "./BrandWhip";
import { ChartMorph } from "./ChartMorph";
import { HeadlineProof } from "./HeadlineProof";
import { KineticSlam } from "./KineticSlam";
import { LineDraw } from "./LineDraw";
import { PaperParallax } from "./PaperParallax";
import { SignalDiagram } from "./SignalDiagram";

export type Signature = {
  name: string; // the move's name in references/style-presets.md
  file: string;
  seconds: number; // natural length in the Catalog and the sample
  Scene: React.FC<{ dur: number }>; // standalone, with fictional placeholder copy
  beat: { id: string; lead: number; C: React.FC } | null; // the storyboard beat it takes, reading that beat's words
};

const len = (id: string) => scene(id).end - scene(id).start;
const words = (id: string) => scene(id).words.map((w) => w.w);
const hasVo = (id: string) => !!scene(id).vo;

export const SIGNATURES: Record<PresetId, Signature> = {
  "clean-launch": {
    name: "Headline and card proof",
    file: "visuals/HeadlineProof.tsx",
    seconds: 5,
    Scene: ({ dur }) => <HeadlineProof dur={dur} />,
    beat: null,
  },
  "fast-concept": {
    name: "Two-block brand reveal",
    file: "visuals/BrandWhip.tsx",
    seconds: 5,
    Scene: ({ dur }) => <BrandWhip dur={dur} />,
    beat: {
      id: "reveal",
      lead: REVEAL_LEAD,
      C: () => {
        const id = "reveal";
        const second = 4 * BEAT;
        const half = PRESETS["clean-launch"].text;
        // with a real voiceover the tagline follows the spoken words; without one it builds at half the Clean Launch pace
        const tagline = hasVo(id)
          ? voLines(id, { from: 1, perLine: 3, accent: [words(id).length - 2, words(id).length - 1] })
          : tokLines(
              words(id)
                .slice(1)
                .map((w, i, a) => (i >= a.length - 2 ? `*${w}*` : w))
                .join(" ")
                .replace(/^((?:\S+\s){2}\S+)\s/, "$1|"),
              second + 0.45,
              half.wordGap / 2,
            );
        return <BrandWhip dur={len(id)} lead={REVEAL_LEAD} nameAt={hasVo(id) ? wordAt(id, 0) : 0} secondAt={second} tagline={tagline} />;
      },
    },
  },
  "kinetic-type": {
    name: "Kinetic Slam",
    file: "visuals/KineticSlam.tsx",
    seconds: 4.5,
    Scene: ({ dur }) => <KineticSlam dur={dur} />,
    beat: {
      id: "payoff",
      lead: 0,
      C: () => {
        // first sentence slams one word per beat; the last sentence is the final line
        const w = words("payoff");
        const cut = w.findIndex((x) => /[.?!]$/.test(x)) + 1 || 1;
        return <KineticSlam dur={len("payoff")} words={w.slice(0, cut).map((x) => x.replace(/[.,!?]$/, "").toUpperCase())} final={w.slice(cut).join(" ")} recap={false} />;
      },
    },
  },
  "bento-product": {
    name: "Bento Snap",
    file: "visuals/BentoSnap.tsx",
    seconds: 5,
    Scene: ({ dur }) => <BentoSnap dur={dur} />,
    beat: { id: "ask", lead: 0, C: () => <BentoSnap dur={len("ask")} /> },
  },
  "data-story": {
    name: "Chart Morph",
    file: "visuals/ChartMorph.tsx",
    seconds: 6,
    Scene: ({ dur }) => <ChartMorph dur={dur} />,
    beat: {
      id: "notify",
      lead: 0,
      C: () => <ChartMorph dur={len("notify")} title={voLines("notify", { perLine: 2, accent: [words("notify").length - 2, words("notify").length - 1] })} caption="tasks summarised, weeks 1 to 8" />,
    },
  },
  "system-diagram": {
    name: "Line Draw",
    file: "visuals/LineDraw.tsx",
    seconds: 5,
    Scene: ({ dur }) => <LineDraw dur={dur} />,
    beat: {
      id: "ask",
      lead: 0,
      C: () => <LineDraw dur={len("ask")} title={voLines("ask", { breaks: [0, 4], accent: [words("ask").length - 1] })} />,
    },
  },
  "night-signal": {
    name: "Signal diagram",
    file: "visuals/SignalDiagram.tsx",
    seconds: 6,
    Scene: ({ dur }) => <SignalDiagram dur={dur} />,
    beat: {
      id: "notify",
      lead: 0,
      C: () => (
        <SignalDiagram
          dur={len("notify")}
          title={voLines("notify", { breaks: [0, 4], accent: [words("notify").length - 2, words("notify").length - 1] })}
          steps={["OVERNIGHT UPDATES", "READ AND SORT", "8 AM SUMMARY"]}
        />
      ),
    },
  },
  "paper-cut": {
    name: "Paper Parallax",
    file: "visuals/PaperParallax.tsx",
    seconds: 6,
    Scene: ({ dur }) => <PaperParallax dur={dur} />,
    beat: {
      id: "notify",
      lead: 0,
      C: () => <PaperParallax dur={len("notify")} title={voLines("notify", { breaks: [0, 4], accent: [3] })} />,
    },
  },
};
