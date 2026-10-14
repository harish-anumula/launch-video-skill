import { useCurrentFrame, useVideoConfig } from "remotion";
import { PRODUCT } from "../brand/logo";
import { TIMING, rand } from "../lib/time";
import { SCENE_LABELS, toneOf } from "../scenes/config";
import { MONO } from "../theme";

const GLYPHS = "abcdefghijklmnopqrstuvwxyz0123456789/—:.";
/** Corner HUD: the scene label decodes in on each cut; product name + running timecode top-right. */
export const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  const cur = [...TIMING.scenes].reverse().find((s) => t >= s.start) ?? TIMING.scenes[0];
  const color = toneOf(cur.id) === "light" ? "rgba(17,19,24,0.5)" : "rgba(255,255,255,0.72)";
  const label = SCENE_LABELS[cur.id] ?? `// ${cur.id}`;
  const since = t - cur.start;
  const shown = label
    .split("")
    .map((ch, i) => {
      const reveal = 0.05 + i * 0.018;
      if (since >= reveal || ch === " ") return ch;
      if (since < reveal - 0.25) return "";
      return GLYPHS[Math.floor(rand(i * 7 + f) * GLYPHS.length)];
    })
    .join("");
  const style = {
    fontFamily: MONO,
    fontSize: 17,
    letterSpacing: "0.04em",
    color,
    position: "absolute" as const,
    top: 44,
    whiteSpace: "pre" as const,
    opacity: t > TIMING.duration - 0.6 ? 0 : 1,
  };
  return (
    <>
      <div style={{ ...style, left: 56 }}>{shown}</div>
      <div style={{ ...style, right: 56, textTransform: "uppercase" }}>
        {PRODUCT}&nbsp;&nbsp;&nbsp;00:00:{String(Math.floor(t) % 60).padStart(2, "0")}:{String(f % fps).padStart(2, "0")}
      </div>
    </>
  );
};
