// launch-video skill by Harish Reddy Anumula · MIT · https://github.com/harish-anumula/launch-video-skill
// Named style presets. Each one is a complete look: palette, type, easing and springs, text motion, pacing, texture.
// Pick one with PRESET in theme.ts; theme.ts exports the chosen preset's tokens to every scene and visual.
// When to use each, its signature moves and what not to do: references/style-presets.md.
// Every `brand` value is a placeholder. Swap in the product's own colour (and its brandDeep/brandLight/brandSoft shades).

export type PresetId =
  | "clean-launch"
  | "fast-concept"
  | "kinetic-type"
  | "bento-product"
  | "data-story"
  | "system-diagram"
  | "night-signal"
  | "paper-cut"
  | "mascot-carry";

/** Google fonts the presets use (all in @remotion/google-fonts). theme.ts loads only the chosen preset's. */
export type FontName = "Geist" | "InterTight" | "IBMPlexSans" | "Figtree" | "Fraunces" | "DMSans";
export type MonoName = "GeistMono" | "IBMPlexMono" | "JetBrainsMono" | "DMMono";
/** Loaded in italic, for the one accent word per headline. */
export type SerifName = "InstrumentSerif" | "Newsreader" | "Fraunces";

export type Bezier = readonly [number, number, number, number];
export type SpringCfg = { mass?: number; damping?: number; stiffness?: number };

export type Colors = {
  brand: string; // placeholder: swap for the product's colour
  brandDeep: string;
  brandLight: string;
  brandSoft: string; // tints, selected rows, highlights
  onBrand: string; // text and marks on a brand block
  block: string; // full-frame colour block when blocks are "flat"
  accent2: string; // second accent, used sparingly (a second pulse, a negative word)
  ink: string; // main text
  inkSoft: string; // secondary text, labels
  paper: string; // canvas
  card: string; // UI card surface
  line: string; // hairlines
  muted: string; // quiet fills
  green: string;
  greenSoft: string;
  amber: string;
};

export type Preset = {
  id: PresetId;
  name: string;
  feel: string;
  mode: "light" | "dark";
  colors: Colors;
  /** "gradient": radial brandLight → brand → brandDeep. "flat": solid `block`. */
  blocks: "gradient" | "flat";
  fonts: { display: FontName; displayWeight: number; body: FontName; mono: MonoName; serif: SerifName | null };
  type: {
    tracking: string; // headline letter-spacing
    accent: "serif" | "color"; // how the one accent word stands out
    underline: boolean; // hand-drawn underline under the accent word
    underlineStyle: "hand" | "painted"; // "painted": rough painted edge plus a soft glow of the same colour
  };
  ease: { out: Bezier; inOut: Bezier; in: Bezier; snap: Bezier };
  springs: { soft: SpringCfg; card: SpringCfg; pop: SpringCfg; heavy: SpringCfg; slam: SpringCfg };
  text: {
    wordIn: number; // seconds for one word's masked rise
    wordGap: number; // seconds between words when there is no VO timing
    blurPx: number; // de-blur on entry (0 = none)
  };
  scene: {
    exitFade: number; // seconds; 0 = hard cut
    exitPush: number; // scale added during the exit (0.05 = 5%)
    push: number; // slow push across a scene (0.04 = 4%)
    transition: "cut" | "whip" | "wipe" | "rise" | "dissolve"; // how colour blocks enter
    motionBlur: boolean; // only on slams and whips, never on held frames
  };
  pacing: {
    secondsPerBeat: number; // typical scene length
    beatRange: readonly [number, number];
    colorBlocks: readonly [number, number]; // full-frame colour blocks per video
    bpm: readonly [number, number]; // music tempo range
  };
  texture: {
    grain: number; // opacity on the canvas
    grainOnBlock: number; // opacity on colour blocks
    grainBlend: "multiply" | "overlay" | "soft-light";
    shadow: { card: string; float: string };
  };
  hud: boolean; // mono scene label top-left, name and timecode top-right
  /** Laptop and phone finish. "aluminium": light base, dark bezel. "graphite": dark base and bezel with a lit rim, for dark canvases. */
  device: "aluminium" | "graphite";
};

const STD_EASE = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  in: [0.7, 0, 0.84, 0],
  snap: [0.87, 0, 0.13, 1],
} as const;

const STD_SPRINGS = {
  soft: { damping: 200 },
  card: { mass: 0.6, damping: 14, stiffness: 180 },
  pop: { mass: 0.5, damping: 11, stiffness: 220 },
  heavy: { mass: 1.4, damping: 30, stiffness: 90 },
  slam: { mass: 1, damping: 24, stiffness: 310 },
};

const SOFT_SHADOW = {
  card: "0 1px 2px rgba(17,19,24,0.04), 0 8px 24px -6px rgba(17,19,24,0.10), 0 24px 60px -20px rgba(17,19,24,0.18)",
  float: "0 2px 4px rgba(17,19,24,0.05), 0 18px 40px -10px rgba(17,19,24,0.22)",
};

export const PRESETS: Record<PresetId, Preset> = {
  // The default look. Light canvas, one brand colour, HUD, word-by-word headline with one serif accent, one card per scene.
  "clean-launch": {
    id: "clean-launch",
    name: "Clean Launch",
    feel: "Calm, confident, editorial product launch on a light canvas.",
    mode: "light",
    colors: {
      brand: "#4F46E5",
      brandDeep: "#3730A3",
      brandLight: "#6366F1",
      brandSoft: "#EEF2FF",
      onBrand: "#FFFFFF",
      block: "#4F46E5",
      accent2: "#16A34A",
      ink: "#111318",
      inkSoft: "#5B6272",
      paper: "#FBFBFD",
      card: "#FFFFFF",
      line: "#E4E7EE",
      muted: "#F1F5F9",
      green: "#16A34A",
      greenSoft: "#DCFCE7",
      amber: "#F59E0B",
    },
    blocks: "gradient",
    fonts: { display: "Geist", displayWeight: 600, body: "Geist", mono: "GeistMono", serif: "InstrumentSerif" },
    type: { tracking: "-0.04em", accent: "serif", underline: true, underlineStyle: "hand" },
    ease: STD_EASE,
    springs: STD_SPRINGS,
    text: { wordIn: 0.55, wordGap: 0.38, blurPx: 10 },
    scene: { exitFade: 0.3, exitPush: 0.05, push: 0.04, transition: "whip", motionBlur: false },
    pacing: { secondsPerBeat: 5.5, beatRange: [4.3, 8], colorBlocks: [2, 3], bpm: [100, 115] },
    texture: { grain: 0.07, grainOnBlock: 0.12, grainBlend: "multiply", shadow: SOFT_SHADOW },
    hud: true,
    device: "aluminium",
  },

  // Clean Launch's grammar at about 4 s a beat, two near-black blocks, one kinetic slam on the reveal.
  "fast-concept": {
    id: "fast-concept",
    name: "Fast Concept",
    feel: "The clean launch grammar, quicker and punchier, with two hard black blocks.",
    mode: "light",
    colors: {
      brand: "#4F46E5",
      brandDeep: "#3730A3",
      brandLight: "#6366F1",
      brandSoft: "#EEF2FF",
      onBrand: "#FFFFFF",
      block: "#0B0B0D",
      accent2: "#16A34A",
      ink: "#111318",
      inkSoft: "#5B6272",
      paper: "#FBFBFD",
      card: "#FFFFFF",
      line: "#E4E7EE",
      muted: "#F1F5F9",
      green: "#16A34A",
      greenSoft: "#DCFCE7",
      amber: "#F59E0B",
    },
    blocks: "flat",
    fonts: { display: "Geist", displayWeight: 600, body: "Geist", mono: "GeistMono", serif: "InstrumentSerif" },
    type: { tracking: "-0.04em", accent: "serif", underline: true, underlineStyle: "hand" },
    ease: STD_EASE,
    springs: STD_SPRINGS,
    text: { wordIn: 0.5, wordGap: 0.3, blurPx: 10 },
    scene: { exitFade: 0.3, exitPush: 0.06, push: 0.035, transition: "wipe", motionBlur: true },
    pacing: { secondsPerBeat: 4, beatRange: [3, 6.8], colorBlocks: [2, 2], bpm: [120, 145] },
    texture: { grain: 0.07, grainOnBlock: 0.1, grainBlend: "multiply", shadow: SOFT_SHADOW },
    hud: true,
    device: "aluminium",
  },

  // Huge heavy words slamming in on the beat, hard colour cuts between ink, paper and one signal colour.
  "kinetic-type": {
    id: "kinetic-type",
    name: "Kinetic Type",
    feel: "Loud, rhythmic, type-only energy for teasers and sign-offs.",
    mode: "light",
    colors: {
      brand: "#FF4A1C",
      brandDeep: "#D63A12",
      brandLight: "#FF6A44",
      brandSoft: "#FFE2D9",
      onBrand: "#F2EEE6",
      block: "#0E0E0E",
      accent2: "#0E0E0E",
      ink: "#0E0E0E",
      inkSoft: "#5E5A52",
      paper: "#F2EEE6",
      card: "#FFFFFF",
      line: "#DDD6CA",
      muted: "#E9E4DA",
      green: "#1F9D55",
      greenSoft: "#DCF2E3",
      amber: "#F2A93B",
    },
    blocks: "flat",
    fonts: { display: "InterTight", displayWeight: 900, body: "Geist", mono: "GeistMono", serif: null },
    type: { tracking: "-0.045em", accent: "color", underline: false, underlineStyle: "hand" },
    ease: STD_EASE,
    springs: { ...STD_SPRINGS, pop: { mass: 1, damping: 20, stiffness: 267 }, slam: { mass: 1, damping: 24, stiffness: 310 } },
    text: { wordIn: 0.24, wordGap: 0.45, blurPx: 0 },
    scene: { exitFade: 0, exitPush: 0, push: 0.045, transition: "cut", motionBlur: true },
    pacing: { secondsPerBeat: 0.45, beatRange: [0.4, 2.5], colorBlocks: [2, 3], bpm: [120, 150] },
    texture: {
      grain: 0.07,
      grainOnBlock: 0.07,
      grainBlend: "overlay",
      shadow: { card: "none", float: "none" },
    },
    hud: false,
    device: "aluminium",
  },

  // UI cards fly into a bento grid, then each comes alive. Cool light canvas, crisp cards.
  "bento-product": {
    id: "bento-product",
    name: "Bento Product",
    feel: "Keynote-style product overview, many small live cards in one tidy grid.",
    mode: "light",
    colors: {
      brand: "#2563EB",
      brandDeep: "#1D4ED8",
      brandLight: "#3B82F6",
      brandSoft: "#DEE9FE",
      onBrand: "#FFFFFF",
      block: "#2563EB",
      accent2: "#22C55E",
      ink: "#171717",
      inkSoft: "#5B6475",
      paper: "#F8FAFF",
      card: "#FFFFFF",
      line: "#E6ECF8",
      muted: "#EEF1F7",
      green: "#22C55E",
      greenSoft: "#DCFCE7",
      amber: "#F59E0B",
    },
    blocks: "gradient",
    fonts: { display: "Geist", displayWeight: 600, body: "Geist", mono: "GeistMono", serif: null },
    type: { tracking: "-0.045em", accent: "color", underline: false, underlineStyle: "hand" },
    ease: STD_EASE,
    springs: {
      ...STD_SPRINGS,
      card: { mass: 1, damping: 11, stiffness: 57 }, // the fly-in into the grid
      pop: { mass: 1, damping: 15, stiffness: 191 }, // chips, dots and buttons inside cards
    },
    text: { wordIn: 0.5, wordGap: 0.34, blurPx: 8 },
    scene: { exitFade: 0.3, exitPush: 0.04, push: 0.035, transition: "rise", motionBlur: true },
    pacing: { secondsPerBeat: 4.5, beatRange: [3.5, 6], colorBlocks: [1, 2], bpm: [105, 120] },
    texture: {
      grain: 0.04,
      grainOnBlock: 0.1,
      grainBlend: "multiply",
      shadow: {
        card: "0 1px 2px rgba(23,23,23,0.04), 0 10px 30px -12px rgba(23,23,23,0.14)",
        float: "0 2px 4px rgba(23,23,23,0.05), 0 22px 44px -14px rgba(23,23,23,0.22)",
      },
    },
    hud: false,
    device: "aluminium",
  },

  // Editorial paper, one dataset told several ways, numbers that count and roll over.
  "data-story": {
    id: "data-story",
    name: "Data Story",
    feel: "Editorial and precise, like a good chart in a newspaper, ending on one number.",
    mode: "light",
    colors: {
      brand: "#127C71",
      brandDeep: "#0B5A52",
      brandLight: "#1E9C8E",
      brandSoft: "#D3EDE6",
      onBrand: "#F5F2EC",
      block: "#127C71",
      accent2: "#F2B33D",
      ink: "#1B1B1F",
      inkSoft: "#6F6A61",
      paper: "#F5F2EC",
      card: "#FFFDF8",
      line: "#D9D3C7",
      muted: "#ECE7DD",
      green: "#2E9E6A",
      greenSoft: "#DDF1E6",
      amber: "#F2B33D",
    },
    blocks: "flat",
    fonts: { display: "InterTight", displayWeight: 700, body: "Geist", mono: "GeistMono", serif: "Newsreader" },
    type: { tracking: "-0.045em", accent: "serif", underline: false, underlineStyle: "hand" },
    ease: STD_EASE,
    springs: {
      ...STD_SPRINGS,
      card: { mass: 1, damping: 16, stiffness: 101 }, // bars growing, cards settling
      pop: { mass: 1, damping: 21, stiffness: 288 }, // a counter reel locking
    },
    text: { wordIn: 0.55, wordGap: 0.38, blurPx: 8 },
    scene: { exitFade: 0.35, exitPush: 0.03, push: 0.03, transition: "cut", motionBlur: false },
    pacing: { secondsPerBeat: 6, beatRange: [5, 8], colorBlocks: [0, 1], bpm: [90, 110] },
    texture: {
      grain: 0.05,
      grainOnBlock: 0.08,
      grainBlend: "multiply",
      shadow: {
        card: "0 1px 0 rgba(27,27,31,0.06), 0 12px 32px -18px rgba(27,27,31,0.18)",
        float: "0 2px 4px rgba(27,27,31,0.05), 0 18px 40px -14px rgba(27,27,31,0.2)",
      },
    },
    hud: true,
    device: "aluminium",
  },

  // A technical diagram draws itself, then pulses of light run through it. Blueprint-light canvas.
  "system-diagram": {
    id: "system-diagram",
    name: "System Diagram",
    feel: "Clear and technical, the product explained as a diagram that draws itself.",
    mode: "light",
    colors: {
      brand: "#0284C7",
      brandDeep: "#075985",
      brandLight: "#0EA5E9",
      brandSoft: "#E0F2FE",
      onBrand: "#FFFFFF",
      block: "#0F172A",
      accent2: "#7C3AED",
      ink: "#0F172A",
      inkSoft: "#64748B",
      paper: "#F7F8FA",
      card: "#FFFFFF",
      line: "#D5DBE5",
      muted: "#EDF0F5",
      green: "#16A34A",
      greenSoft: "#DCFCE7",
      amber: "#F59E0B",
    },
    blocks: "flat",
    fonts: { display: "IBMPlexSans", displayWeight: 600, body: "IBMPlexSans", mono: "IBMPlexMono", serif: null },
    type: { tracking: "-0.03em", accent: "color", underline: false, underlineStyle: "hand" },
    ease: STD_EASE,
    springs: {
      ...STD_SPRINGS,
      card: { mass: 1, damping: 15, stiffness: 101 }, // nodes and output cards settling
      pop: { mass: 1, damping: 14, stiffness: 227 }, // the hub when a pulse arrives
    },
    text: { wordIn: 0.5, wordGap: 0.36, blurPx: 6 },
    scene: { exitFade: 0.3, exitPush: 0.02, push: 0.03, transition: "cut", motionBlur: false },
    pacing: { secondsPerBeat: 6.5, beatRange: [5, 8], colorBlocks: [0, 1], bpm: [95, 115] },
    texture: {
      grain: 0.03,
      grainOnBlock: 0.06,
      grainBlend: "multiply",
      shadow: {
        card: "0 0 0 1px rgba(15,23,42,0.06), 0 8px 24px -12px rgba(15,23,42,0.14)",
        float: "0 0 0 1px rgba(15,23,42,0.06), 0 16px 36px -14px rgba(15,23,42,0.2)",
      },
    },
    hud: true,
    device: "aluminium",
  },

  // Near-black canvas, one signal green, violet for the hidden or wrong. For explainers in the feed.
  "night-signal": {
    id: "night-signal",
    name: "Night Signal Explainer",
    feel: "Dark, focused and glowing, one idea per screen for a feed explainer.",
    mode: "dark",
    colors: {
      brand: "#48D597",
      brandDeep: "#2FA374",
      brandLight: "#7BE3B6",
      brandSoft: "#123326",
      onBrand: "#F2F4F8",
      block: "#8B5CF6",
      accent2: "#8B5CF6",
      ink: "#F2F4F8",
      inkSoft: "#A7B0BE",
      paper: "#080A0F",
      card: "#0F131B",
      line: "#1C222D",
      muted: "#151A23",
      green: "#48D597",
      greenSoft: "#123326",
      amber: "#F2B33D",
    },
    blocks: "flat",
    fonts: { display: "Figtree", displayWeight: 700, body: "Figtree", mono: "JetBrainsMono", serif: null },
    type: { tracking: "-0.035em", accent: "color", underline: true, underlineStyle: "painted" },
    ease: STD_EASE,
    springs: STD_SPRINGS,
    text: { wordIn: 0.4, wordGap: 0.28, blurPx: 10 },
    scene: { exitFade: 0.12, exitPush: 0.03, push: 0.04, transition: "cut", motionBlur: false },
    pacing: { secondsPerBeat: 5, beatRange: [4, 6.5], colorBlocks: [0, 1], bpm: [118, 124] },
    texture: {
      grain: 0.06,
      grainOnBlock: 0.08,
      grainBlend: "overlay",
      shadow: {
        card: "0 0 0 1px #1C222D, 0 24px 60px -24px rgba(0,0,0,0.7)",
        float: "0 0 0 1px #1C222D, 0 0 40px -10px rgba(72,213,151,0.25), 0 24px 60px -24px rgba(0,0,0,0.7)",
      },
    },
    hud: false,
    device: "graphite",
  },

  // Warm layered paper, slow parallax, soft serif. For calm, human stories.
  "paper-cut": {
    id: "paper-cut",
    name: "Paper Cut",
    feel: "Calm and warm, layered paper and slow light, like the start of a story.",
    mode: "light",
    colors: {
      brand: "#C8553D",
      brandDeep: "#8F4458",
      brandLight: "#DB916F",
      brandSoft: "#F9DDB8",
      onBrand: "#FFF3DC",
      block: "#8F4458",
      accent2: "#3B1734",
      ink: "#3B1734",
      inkSoft: "#8F4458",
      paper: "#FFF3DC",
      card: "#FFF9EE",
      line: "#EBD3B5",
      muted: "#F7E6CC",
      green: "#6B8F5E",
      greenSoft: "#E3EAD5",
      amber: "#E9A23B",
    },
    blocks: "gradient",
    fonts: { display: "Fraunces", displayWeight: 600, body: "DMSans", mono: "DMMono", serif: "Fraunces" },
    type: { tracking: "-0.02em", accent: "serif", underline: true, underlineStyle: "hand" },
    ease: { out: [0.22, 1, 0.36, 1], inOut: [0.45, 0, 0.55, 1], in: [0.55, 0, 0.78, 0.2], snap: [0.65, 0, 0.35, 1] },
    springs: {
      soft: { damping: 200 },
      card: { mass: 1, damping: 18, stiffness: 80 },
      pop: { mass: 1, damping: 14, stiffness: 120 },
      heavy: { mass: 1.4, damping: 30, stiffness: 90 },
      slam: { mass: 1, damping: 18, stiffness: 120 },
    },
    text: { wordIn: 0.8, wordGap: 0.42, blurPx: 8 },
    scene: { exitFade: 0.6, exitPush: 0.02, push: 0.05, transition: "dissolve", motionBlur: false },
    pacing: { secondsPerBeat: 7, beatRange: [6, 9], colorBlocks: [0, 1], bpm: [70, 90] },
    texture: {
      grain: 0.1,
      grainOnBlock: 0.12,
      grainBlend: "multiply",
      shadow: {
        card: "0 2px 0 rgba(59,23,52,0.06), 0 14px 30px -16px rgba(43,15,37,0.28)",
        float: "0 3px 0 rgba(59,23,52,0.06), 0 22px 44px -18px rgba(43,15,37,0.32)",
      },
    },
    hud: false,
    device: "aluminium",
  },
  // Light and friendly. One character (mascot, agent avatar, app icon with a face) carries the film and docks into the UI.
  "mascot-carry": {
    id: "mascot-carry",
    name: "Mascot Carry",
    feel: "Light, friendly and product-native; one character carries every scene.",
    mode: "light",
    colors: {
      brand: "#2F7DF6",
      brandDeep: "#0A1B3D",
      brandLight: "#5B9BFF",
      brandSoft: "#E6F0FF",
      onBrand: "#FFFFFF",
      block: "#0A1B3D", // the end card's dark shade (the one light-to-dark flip)
      accent2: "#F472B6",
      ink: "#0B0B0C",
      inkSoft: "#6B6F76",
      paper: "#F7F8FA",
      card: "#FFFFFF",
      line: "#E5E7EB",
      muted: "#F1F3F6",
      green: "#22C55E",
      greenSoft: "#DCFCE7",
      amber: "#F59E0B",
    },
    blocks: "flat",
    fonts: { display: "Geist", displayWeight: 600, body: "Geist", mono: "GeistMono", serif: null },
    type: { tracking: "-0.03em", accent: "color", underline: false, underlineStyle: "hand" },
    ease: STD_EASE,
    springs: {
      soft: { damping: 200 },
      card: { mass: 1, damping: 12, stiffness: 220 }, // the character's body: visible overshoot
      pop: { mass: 1, damping: 14, stiffness: 260 }, // props and chips
      heavy: { mass: 1.4, damping: 30, stiffness: 90 },
      slam: { mass: 1, damping: 24, stiffness: 310 },
    },
    text: { wordIn: 0.3, wordGap: 0.24, blurPx: 0 },
    scene: { exitFade: 0, exitPush: 0, push: 0.02, transition: "cut", motionBlur: false },
    pacing: { secondsPerBeat: 2.5, beatRange: [2, 3.5], colorBlocks: [0, 1], bpm: [95, 120] },
    texture: { grain: 0, grainOnBlock: 0.04, grainBlend: "multiply", shadow: SOFT_SHADOW },
    hud: false,
    device: "aluminium",
  },
};
