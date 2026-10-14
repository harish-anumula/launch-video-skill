import React from "react";
import { Img, staticFile } from "remotion";
import { Laptop } from "../components/Laptop";
import { clampI, useSpringAt } from "../lib/time";
import { EASE, SPRING } from "../theme";

/** A laptop rises in and the camera eases from looking down to face-on with a slow push. Put either a rebuilt, animated screen
 *  (children, 1320x800 px) or a real screenshot (`image`, in public/) on it. Put a <Cursor> inside `children` so clicks stay
 *  aligned through the 3D move. Good for any product with a screen. */
export const Device: React.FC<{
  t: number;
  at: number;
  end: number;
  image?: string;
  children?: React.ReactNode;
  left?: number;
  top?: number;
}> = ({ t, at, end, image, children, left = 1060 - 1526 * 0.4, top = 372 }) => {
  const sp = useSpringAt();
  const win = sp(at, SPRING.heavy);
  const cam = clampI(t, [at, end], [0, 1], EASE.inOut);
  return (
    <div style={{ position: "absolute", left, top, width: 1526 * 0.8, perspective: 2800, opacity: win }}>
      <div
        style={{
          transform: `translateY(${(1 - win) * 360}px) rotateX(${(1 - win) * 16 + 16 * (1 - cam) + 5}deg) rotateY(${-7 * (1 - cam) - 1}deg) scale(${0.8 + cam * 0.035})`,
          transformOrigin: "50% 0%",
        }}
      >
        <Laptop screenW={1320} screenH={800}>
          {image ? (
            <Img src={staticFile(image)} style={{ width: 1320, height: 800, objectFit: "cover", maxWidth: "none", display: "block" }} />
          ) : (
            children
          )}
        </Laptop>
      </div>
    </div>
  );
};
