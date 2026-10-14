import React from "react";
import { Img, staticFile } from "remotion";
import { clampI, useSpringAt } from "../lib/time";
import { EASE, SPRING } from "../theme";

/** A phone rises and turns slightly toward camera. Put a rebuilt 390x844 screen (children) or a real screenshot (`image`) in it.
 *  Good for mobile apps, notifications on the go, checkout/pay flows. */
export const Phone: React.FC<{
  t: number;
  at: number;
  end: number;
  x?: number;
  y?: number;
  image?: string;
  children?: React.ReactNode;
  scale?: number;
}> = ({ t, at, end, x = 1180, y = 150, image, children, scale = 0.95 }) => {
  const sp = useSpringAt();
  const p = sp(at, SPRING.heavy);
  const cam = clampI(t, [at, end], [0, 1], EASE.inOut);
  return (
    <div style={{ position: "absolute", left: x, top: y, perspective: 2200, opacity: p }}>
      <div
        style={{
          transform: `translateY(${(1 - p) * 420}px) rotateY(${-18 + cam * 12}deg) rotateX(${6 - cam * 4}deg) scale(${scale})`,
          transformOrigin: "50% 50%",
        }}
      >
        <div
          style={{
            width: 390 + 28,
            height: 844 + 28,
            padding: 14,
            borderRadius: 64,
            background: "linear-gradient(180deg,#1A1D24,#0C0E12)",
            boxShadow: "0 0 0 2px #2A2E37 inset, 0 60px 120px -40px rgba(17,19,24,0.55)",
            position: "relative",
          }}
        >
          <div style={{ width: 390, height: 844, borderRadius: 50, overflow: "hidden", background: "#fff", position: "relative" }}>
            {image ? <Img src={staticFile(image)} style={{ width: 390, height: 844, objectFit: "cover", maxWidth: "none" }} /> : children}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: "50%",
                width: 120,
                height: 34,
                marginLeft: -60,
                borderRadius: 20,
                background: "#0C0E12",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
