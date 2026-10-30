import { Easing } from "remotion";
import { loadFont as loadDMMono } from "@remotion/google-fonts/DMMono";
import { loadFont as loadDMSans } from "@remotion/google-fonts/DMSans";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadGeist } from "@remotion/google-fonts/Geist";
import { loadFont as loadGeistMono } from "@remotion/google-fonts/GeistMono";
import { loadFont as loadIBMPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadIBMPlexSans } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadInterTight } from "@remotion/google-fonts/InterTight";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadNewsreader } from "@remotion/google-fonts/Newsreader";
import { FontName, MonoName, PRESETS, PresetId, SerifName } from "./presets";

// THE LOOK. Pick a named preset (see references/style-presets.md), then swap its placeholder brand colours for the product's.
// "clean-launch" | "fast-concept" | "kinetic-type" | "bento-product" | "data-story" | "system-diagram" | "night-signal" | "paper-cut" | "mascot-carry"
export const PRESET: PresetId = "clean-launch";

export const P = PRESETS[PRESET];

// Brand tokens: the preset's palette. Override single values here with the product's (read them from its CSS variables), e.g.
// export const C = { ...P.colors, brand: "#...", brandDeep: "#...", brandLight: "#...", brandSoft: "#..." };
export const C = { ...P.colors };

// Fonts: only the chosen preset's fonts are loaded. Swap for the brand's own if it has them.
const SANS_FONTS: Record<FontName, () => string> = {
  Geist: () => loadGeist("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }).fontFamily,
  InterTight: () => loadInterTight("normal", { weights: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"] }).fontFamily,
  IBMPlexSans: () => loadIBMPlexSans("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }).fontFamily,
  Figtree: () => loadFigtree("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] }).fontFamily,
  Fraunces: () => loadFraunces("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }).fontFamily,
  DMSans: () => loadDMSans("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }).fontFamily,
};
const MONO_FONTS: Record<MonoName, () => string> = {
  GeistMono: () => loadGeistMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily,
  IBMPlexMono: () => loadIBMPlexMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily,
  JetBrainsMono: () => loadJetBrainsMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily,
  DMMono: () => loadDMMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily,
};
const SERIF_FONTS: Record<SerifName, () => string> = {
  InstrumentSerif: () => loadInstrumentSerif("italic", { weights: ["400"], subsets: ["latin"] }).fontFamily,
  Newsreader: () => loadNewsreader("italic", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily,
  Fraunces: () => loadFraunces("italic", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily,
};

export const SANS = SANS_FONTS[P.fonts.body]();
export const DISPLAY = P.fonts.display === P.fonts.body ? SANS : SANS_FONTS[P.fonts.display]();
export const MONO = MONO_FONTS[P.fonts.mono]();
// Italic serif for the one accent word. Presets without one fall back to the display face (the accent is colour only).
export const SERIF = P.fonts.serif ? SERIF_FONTS[P.fonts.serif]() : DISPLAY;

export const EASE = {
  out: Easing.bezier(...P.ease.out),
  inOut: Easing.bezier(...P.ease.inOut),
  in: Easing.bezier(...P.ease.in),
  snap: Easing.bezier(...P.ease.snap),
};

export const SPRING = P.springs;
export const SHADOW = P.texture.shadow;

/** Headline type and text motion (Headline, Feature, Hud read these). */
export const TYPE = { ...P.type, weight: P.fonts.displayWeight };
export const TEXT = P.text;
export const SCENE_MOTION = P.scene;
export const PACING = P.pacing;
export const GRAIN = { canvas: P.texture.grain, block: P.texture.grainOnBlock, blend: P.texture.grainBlend };
export const HUD_ON = P.hud;

export const BRAND_BG =
  P.blocks === "gradient"
    ? `radial-gradient(120% 90% at 35% 35%, ${C.brandLight} 0%, ${C.brand} 45%, ${C.brandDeep} 100%)`
    : C.block;

/** Frosted surface for floating banners and toasts: translucent white on light presets, the card colour on dark ones. */
export const glass = (alpha: number) => (P.mode === "dark" ? C.card : `rgba(255,255,255,${alpha})`);

// Colour helpers, so every surface derives from the preset tokens instead of hard-coded light greys.
const rgb = (hex: string) => {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16));
};
/** Mix two hex colours (k = 0 gives a, 1 gives b). */
export const mix = (a: string, b: string, k: number) =>
  "#" +
  rgb(a)
    .map((v, i) => Math.round(v + (rgb(b)[i] - v) * k).toString(16).padStart(2, "0"))
    .join("");
/** A hex colour at an opacity, as rgba(). */
export const alpha = (hex: string, a: number) => `rgba(${rgb(hex).join(",")},${a})`;
const lum = (hex: string) => {
  const [r, g, b] = rgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
/** Readable text or icon colour on a filled shape: white unless white would fall under 3:1 contrast, then the darkest token. */
export const onFill = (fill: string) => (1.05 / (lum(fill) + 0.05) >= 3 ? "#FFFFFF" : P.mode === "dark" ? C.paper : C.ink);

/** Derived UI surfaces. Cards, windows, bubbles and banners read these, so a dark preset gets dark chrome everywhere. */
const DARK = P.mode === "dark";
export const UI = {
  screen: C.paper, // the area behind cards inside a rebuilt app screen
  bubble: C.muted, // a sent chat bubble
  body: mix(C.ink, C.inkSoft, 0.3), // body copy inside cards
  placeholder: mix(C.inkSoft, C.card, 0.4),
  titleBar: DARK ? C.muted : C.brand, // app window title bar
  onTitleBar: DARK ? C.ink : C.onBrand,
  windowShadow: DARK
    ? `0 0 0 1px ${C.line}, 0 40px 120px -30px rgba(0,0,0,0.75)`
    : "0 40px 120px -30px rgba(17,19,24,0.35), 0 0 0 1px rgba(17,19,24,0.06)",
  bannerShadow: DARK ? `0 0 0 1px ${C.line}, 0 18px 50px -18px rgba(0,0,0,0.7)` : "0 18px 50px -18px rgba(17,19,24,0.35)",
  dropShadow: DARK ? "rgba(0,0,0,0.6)" : "rgba(17,19,24,0.35)",
  shadowInk: DARK ? "#000000" : "#111318", // base colour for computed shadows
  danger: DARK ? { fg: "#F87171", bg: "rgba(248,113,113,0.14)" } : { fg: "#DC2626", bg: "#FEE2E2" },
};

/** Laptop and phone finish (Laptop.tsx, Phone.tsx). Aluminium for light canvases; graphite with a lit rim for dark ones. */
export const DEVICE =
  P.device === "graphite"
    ? {
        bezel: `linear-gradient(180deg,${mix(C.card, "#FFFFFF", 0.07)},${C.card})`,
        rim: `0 0 0 1.5px ${mix(C.line, "#FFFFFF", 0.14)} inset, 0 0 0 1px ${alpha("#FFFFFF", 0.04)}`,
        camera: mix(C.line, "#FFFFFF", 0.1),
        cameraRing: C.card,
        base: `linear-gradient(180deg,${mix(C.line, "#FFFFFF", 0.3)} 0%,${mix(C.line, "#FFFFFF", 0.12)} 55%,${C.line} 100%)`,
        notch: `linear-gradient(180deg,${C.card},${mix(C.line, "#FFFFFF", 0.1)})`,
        island: C.paper,
        shadow: "rgba(0,0,0,0.8)",
        baseShadow: "rgba(0,0,0,0.7)",
        glare: 0.05,
      }
    : {
        bezel: "linear-gradient(180deg,#1A1D24,#0C0E12)",
        rim: "0 0 0 2px #2A2E37 inset",
        camera: "#2B303A",
        cameraRing: "#15181E",
        base: "linear-gradient(180deg,#E4E7EC 0%,#C9CDD5 55%,#A9AEB8 100%)",
        notch: "linear-gradient(180deg,#B7BBC4,#D3D6DC)",
        island: "#0C0E12",
        shadow: "rgba(17,19,24,0.55)",
        baseShadow: "rgba(17,19,24,0.45)",
        glare: 0.16,
      };
