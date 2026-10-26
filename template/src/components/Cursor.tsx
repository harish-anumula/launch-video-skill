import { clampI } from "../lib/time";
import { C, EASE, alpha } from "../theme";

export type CursorKey = { t: number; x: number; y: number };

/** macOS-style pointer moving along gently arced ease-in-out paths, with click squash + ripple. */
export const Cursor: React.FC<{ t: number; keys: CursorKey[]; clicks?: number[]; appearAt?: number; hideAt?: number; scale?: number }> = ({
  t,
  keys,
  clicks = [],
  appearAt,
  hideAt,
  scale = 1,
}) => {
  let x = keys[0].x,
    y = keys[0].y;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i],
      b = keys[i + 1];
    if (t >= a.t) {
      const p = clampI(t, [a.t, b.t], [0, 1], EASE.inOut);
      const arc = Math.sin(p * Math.PI) * Math.min(80, Math.hypot(b.x - a.x, b.y - a.y) * 0.12);
      const nx = -(b.y - a.y),
        ny = b.x - a.x,
        nl = Math.hypot(nx, ny) || 1;
      x = a.x + (b.x - a.x) * p + (nx / nl) * arc;
      y = a.y + (b.y - a.y) * p + (ny / nl) * arc;
    }
  }
  const op =
    (appearAt === undefined ? 1 : clampI(t, [appearAt, appearAt + 0.2], [0, 1])) *
    (hideAt === undefined ? 1 : clampI(t, [hideAt, hideAt + 0.2], [1, 0]));
  let squash = 1,
    ripple = -1;
  for (const c of clicks) {
    if (t >= c - 0.08 && t <= c + 0.5) {
      squash = 1 - 0.18 * Math.sin(clampI(t, [c - 0.08, c + 0.14], [0, 1], (v) => v) * Math.PI);
      ripple = clampI(t, [c, c + 0.5], [0, 1]);
    }
  }
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: op, pointerEvents: "none", zIndex: 50 }}>
      {ripple >= 0 && ripple < 1 && (
        <div
          style={{
            position: "absolute",
            left: -30 * scale,
            top: -30 * scale,
            width: 60 * scale,
            height: 60 * scale,
            borderRadius: "50%",
            border: `3px solid ${alpha(C.brand, 0.6 * (1 - ripple))}`,
            scale: String(0.3 + ripple * 1.2),
          }}
        />
      )}
      <svg
        width={34 * scale}
        height={34 * scale}
        viewBox="0 0 24 24"
        style={{ scale: String(squash), transformOrigin: "4px 3px", filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.25))" }}
      >
        <path
          d="M5 2.5 L5 19.5 L9.3 15.4 L12.1 21.6 L15 20.3 L12.2 14.2 L18.2 14.2 Z"
          fill="#111"
          stroke="#fff"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
