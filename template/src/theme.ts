import { Easing } from "remotion";
import { loadFont as loadSans } from "@remotion/google-fonts/Geist";
import { loadFont as loadMono } from "@remotion/google-fonts/GeistMono";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

// Fonts: a grotesk sans, a mono for labels, an italic serif for accent words. Swap for your brand's.
export const SANS = loadSans("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] }).fontFamily;
export const MONO = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;
export const SERIF = loadSerif("italic", { weights: ["400"], subsets: ["latin"] }).fontFamily;

// Brand tokens: replace with your product's (read them from the product's CSS variables).
export const C = {
  brand: "#4F46E5",
  brandDeep: "#3730A3",
  brandLight: "#6366F1",
  brandSoft: "#EEF2FF",
  ink: "#111318",
  inkSoft: "#5B6272",
  paper: "#FBFBFD",
  card: "#FFFFFF",
  line: "#E4E7EE",
  muted: "#F1F5F9",
  green: "#16A34A",
  greenSoft: "#DCFCE7",
  amber: "#F59E0B",
};

export const EASE = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
  snap: Easing.bezier(0.87, 0, 0.13, 1),
};

export const SPRING = {
  soft: { damping: 200 },
  card: { mass: 0.6, damping: 14, stiffness: 180 },
  pop: { mass: 0.5, damping: 11, stiffness: 220 },
  heavy: { mass: 1.4, damping: 30, stiffness: 90 },
};

export const SHADOW = {
  card: "0 1px 2px rgba(17,19,24,0.04), 0 8px 24px -6px rgba(17,19,24,0.10), 0 24px 60px -20px rgba(17,19,24,0.18)",
  float: "0 2px 4px rgba(17,19,24,0.05), 0 18px 40px -10px rgba(17,19,24,0.22)",
};

export const BRAND_BG = `radial-gradient(120% 90% at 35% 35%, ${C.brandLight} 0%, ${C.brand} 45%, ${C.brandDeep} 100%)`;
