import { LOGO_CENTER, LOGO_PATHS, LOGO_VIEWBOX, PRODUCT } from "../brand/logo";
import { clampI } from "../lib/time";
import { EASE, SANS } from "../theme";

/** Logo mark from brand/logo.ts. `p` 0..1 assembles the pieces from the outside in (rotate + scale). */
export const LogoMark: React.FC<{ size: number; color: string; p?: number }> = ({ size, color, p = 1 }) => (
  <svg width={size} height={size} viewBox={`0 0 ${LOGO_VIEWBOX} ${LOGO_VIEWBOX}`} style={{ overflow: "visible" }}>
    {LOGO_PATHS.map((d, i) => {
      const local = clampI(p, [i * 0.14, i * 0.14 + 0.62], [0, 1], EASE.out);
      return (
        <path
          key={i}
          d={d}
          fill={color}
          fillRule="evenodd"
          style={{
            transformBox: "view-box",
            transformOrigin: `${LOGO_CENTER.x}px ${LOGO_CENTER.y}px`,
            rotate: `${(1 - local) * (-160 + i * 50)}deg`,
            scale: String(0.55 + 0.45 * local),
            opacity: local,
          }}
        />
      );
    })}
  </svg>
);

/** Product name set in the brand font; `p` 0..1 reveals letters left to right. Swap for your real wordmark SVG if you have one. */
export const Wordmark: React.FC<{ height: number; color: string; p?: number }> = ({ height, color, p = 1 }) => (
  <div
    style={{ fontFamily: SANS, fontWeight: 600, fontSize: height * 0.72, lineHeight: 1, letterSpacing: "-0.035em", color, display: "flex" }}
  >
    {PRODUCT.split("").map((ch, i, a) => {
      const lp = clampI(p, [(i / a.length) * 0.7, (i / a.length) * 0.7 + 0.3], [0, 1]);
      return (
        <span key={i} style={{ opacity: lp, translate: `0px ${(1 - lp) * height * 0.08}px`, whiteSpace: "pre" }}>
          {ch}
        </span>
      );
    })}
  </div>
);
