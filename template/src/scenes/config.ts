// Per-scene HUD label and tone. Keep ids in sync with config/timeline.json.
export const SCENE_LABELS: Record<string, string> = {
  hook: "// 00 — tuesday, 4:41 pm",
  reveal: "// intro",
  connect: "// 01 — connect",
  ask: "// 02 — ask",
  notify: "// 03 — automate",
  laptop: "// 04 — dashboards",
  payoff: "// handled",
  end: "// launch",
};
export type Tone = "light" | "brand";
export const SCENE_TONE: Record<string, Tone> = { reveal: "brand", payoff: "brand" }; // default light
export const toneOf = (id: string): Tone => SCENE_TONE[id] ?? "light";
export const CTA = { button: "Get started", url: "example.com" };
