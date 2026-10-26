import { AbsoluteFill, useCurrentFrame } from "remotion";
import { GRAIN } from "../theme";

/** Animated film grain; re-seeded every other frame so it never reads as a static overlay. */
export const Grain: React.FC<{ opacity?: number; blend?: "multiply" | "overlay" | "soft-light" }> = ({
  opacity = GRAIN.canvas,
  blend = GRAIN.blend,
}) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 17;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: blend, opacity }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
