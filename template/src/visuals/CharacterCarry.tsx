import React from "react";
import { AbsoluteFill } from "remotion";
import { clamp01, lerp, ramp, springAt } from "../lib/kit";
import { useT } from "../lib/time";
import type { SpringCfg } from "../presets";
import { C, DEVICE, DISPLAY, EASE, SANS, SPRING, TEXT, TYPE, mix } from "../theme";

// Character acting (references/motion-cheatsheet.md, *Character acting*). The pose is computed per frame from the scene time.
type Pose = {
  squash: number; // > 0 squashes (wider, shorter), < 0 stretches; same volume
  lookX: number; // -1 left .. 1 right
  lookY: number; // -1 up .. 1 down
  blink: number; // 0 open .. 1 shut
  prop: number; // 0 off .. 1 seated (the headset's own spring)
  propLag: number; // px the prop trails the body (follow-through)
  invert: number; // 0 ink body on a light canvas .. 1 light body for a dark slot
};

/** The placeholder character: a round body with two pill eyes and a headset as its one prop. Swap in the brand's own
 *  character, keeping the pose inputs. `size` is the body's diameter in px; the headset reaches a little past it. */
export const Mascot: React.FC<{ size: number; pose: Pose }> = ({ size, pose }) => {
  const { squash: a, lookX, lookY, blink, prop, propLag, invert } = pose;
  const body = mix(C.ink, "#FFFFFF", invert);
  const eye = mix("#FFFFFF", C.ink, invert);
  const sx = 1 + 0.8 * a;
  const sy = 1 - a;
  const squashAt = `translate(0 90) scale(${sx} ${sy}) translate(0 -90)`; // squash from the feet, not the centre
  const eh = Math.max(3, 34 * (1 - blink));
  return (
    <svg width={size * 1.3} height={size * 1.3} viewBox="-130 -130 260 260" style={{ overflow: "visible", display: "block" }}>
      <g transform={squashAt}>
        <circle r={90} fill={body} />
        <ellipse cx={-36} cy={-52} rx={22} ry={12} fill="#FFFFFF" opacity={0.07 * (1 - invert)} transform="rotate(-30 -36 -52)" />
        {[-24, 24].map((x) => (
          <rect key={x} x={x - 8 + lookX * 14} y={-8 + lookY * 12 - eh / 2} width={16} height={eh} rx={8} fill={eye} />
        ))}
      </g>
      {prop > 0.001 && (
        <g transform={`translate(0 ${-(1 - prop) * 170 + propLag}) ${squashAt}`} opacity={clamp01(prop * 3)}>
          <path d="M -86 -6 A 88 88 0 0 1 86 -6" stroke={C.brand} strokeWidth={14} fill="none" strokeLinecap="round" />
          <rect x={-106} y={-28} width={32} height={60} rx={15} fill={C.brand} />
          <rect x={74} y={-28} width={32} height={60} rx={15} fill={C.brand} />
          <path d="M -92 28 Q -82 72 -40 74" stroke={C.brand} strokeWidth={9} fill="none" strokeLinecap="round" />
          <circle cx={-34} cy={74} r={10} fill={C.brand} />
        </g>
      )}
    </svg>
  );
};

/** A landing: a squash that springs back (decaying, one or two wobbles). */
const land = (t: number, at: number, amp: number) => (t < at ? 0 : amp * Math.exp(-(t - at) * 8) * Math.cos((t - at) * 24));
/** Piecewise look direction: each key turns the eyes over 0.12 s. Keys come 4 to 6 frames before the thing they look at. */
const look = (t: number, keys: readonly (readonly [number, number, number])[]) => {
  let x = 0,
    y = 0;
  for (const [at, kx, ky] of keys) {
    const k = ramp(t, at, at + 0.12, EASE.out);
    x = lerp(x, kx, k);
    y = lerp(y, ky, k);
  }
  return { x, y };
};
const blinkAt = (t: number, times: number[]) => Math.max(0, ...times.map((b) => 1 - Math.abs(t - b) / 0.07));

/** One word of the inline headline: rises out of its mask on entry, slides up and out on exit. No blur (product-native). */
const Word: React.FC<{ t: number; at: number; out: number; children: string }> = ({ t, at, out, children }) => {
  const inK = ramp(t, at, at + TEXT.wordIn, EASE.out);
  const outK = ramp(t, out, out + 0.3, EASE.in);
  return (
    <span style={{ display: "inline-block", overflow: "hidden", padding: "0.08em 0.02em", verticalAlign: "middle" }}>
      <span style={{ display: "inline-block", translate: `0 ${(1 - inK) * 105 - outK * 140}%` }}>{children}</span>
    </span>
  );
};

const HandsetIcon: React.FC<{ rotate: number }> = ({ rotate }) => (
  <svg width={44} height={44} viewBox="-22 -22 44 44">
    <g transform={`rotate(${rotate})`}>
      <path d="M -15 4 C -10 -7, 10 -7, 15 4" stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" />
      <rect x={-18} y={1} width={10} height={8} rx={3} fill="#FFFFFF" />
      <rect x={8} y={1} width={10} height={8} rx={3} fill="#FFFFFF" />
    </g>
  </svg>
);

/** Mascot Carry signature: the character never cuts away. It drops in with a squash, blinks, gets its prop (a costume
 *  reveal), sits inside the headline as one of its words (Inline Glyph), then hops on an arc into a slot the next shot
 *  already has: the caller's avatar in a phone's call pill, where it turns light for the dark slot. Full-frame, authored at
 *  6 s; a shorter `dur` plays it faster. Placeholder copy is fictional; swap `before`/`after` and the pill's labels. */
export const CharacterCarry: React.FC<{
  dur?: number;
  before?: string[]; // headline words before the character
  after?: string[]; // headline words after it
  caller?: string; // the placeholder caller the character replaces
  label?: string; // the pill's small label once the character is in
  status?: string;
}> = ({ dur = 6, before = ["Let"], after = ["answer", "for", "you"], caller = "Jordan Ellis", label = "Front desk", status = "Answering" }) => {
  const t = useT() * Math.max(1, 6 / Math.max(dur, 3));

  // Sizes and beats (seconds). Body diameter 220 px as the hero, 0.44 as a word (about 1.3x the cap height), 0.38 in the slot.
  const HERO = 220;
  const GLYPH = 0.44;
  const SLOT = 0.38;
  const LAND = 0.42; // drop lands
  const PROP = 1.42; // headset drops on
  const SHRINK = 2.0; // becomes a word
  const WORDS = 2.2; // first word of the line
  const HOP = 3.8; // take-off
  const ARRIVE = 4.32; // lands in the slot
  const EXPAND = 3.95; // the pill opens before the character arrives, so the slot exists
  const PHONE_SPRING: SpringCfg = { mass: 1, damping: 20, stiffness: 120 };

  // Phone (only its top is in frame) and the call pill.
  const PT = 610; // phone top when seated
  const phoneTop = PT + (1 - springAt(t - 3.45, PHONE_SPRING)) * 560;
  const PW = 1120;
  const BEZ = 24;
  const islandTop = phoneTop + BEZ + 22;
  const open = springAt(t - EXPAND, SPRING.pop);
  const pillW = lerp(230, 920, open);
  const pillH = lerp(68, 140, open);
  const slotX = 960 - 920 / 2 + 70;
  const slotY = islandTop + 70;

  // Headline layout: the glyph's slot sits at the frame centre, words right-aligned before it and left-aligned after it.
  const FONT = 104;
  const glyphW = HERO * GLYPH;
  const wordGap = TEXT.wordGap;
  const lineOut = HOP - 0.2; // the words clear before it takes off, so the hop never crosses them

  // Character position and scale: centre, then a word, then an arc into the slot.
  const hop = ramp(t, HOP, ARRIVE, EASE.inOut);
  const fall = ramp(t, 0, LAND, (x) => x * x); // gravity
  const shrink = springAt(t - SHRINK, SPRING.pop);
  const x0 = 960;
  const y0 = t < LAND ? lerp(-220, 540, fall) : 540;
  const cx = 740; // arc control point, up and toward the slot
  const cy = 380;
  const bez = (a: number, c: number, b: number, k: number) => (1 - k) * (1 - k) * a + 2 * (1 - k) * k * c + k * k * b;
  const px = t < HOP ? x0 : bez(x0, cx, slotX, hop);
  const py = t < HOP ? y0 : bez(540, cy, slotY, hop);
  const scale = t < HOP ? lerp(1, GLYPH, shrink) : lerp(GLYPH, SLOT, hop);

  // Pose.
  const fallStretch = t < LAND ? -0.16 * ramp(t, 0.15, LAND) : 0;
  const antic = t < HOP ? 0.14 * ramp(t, HOP - 0.22, HOP - 0.04, EASE.out) : -0.12 * Math.exp(-(t - HOP) * 6) * (1 - hop);
  const squashFn = (u: number) =>
    (u < LAND ? (u < 0 ? 0 : -0.16 * ramp(u, 0.15, LAND)) : 0) + land(u, LAND, 0.2) + land(u, PROP + 0.2, 0.06) + land(u, ARRIVE, 0.16);
  const squash = fallStretch + land(t, LAND, 0.2) + land(t, PROP + 0.2, 0.06) + antic + land(t, ARRIVE, 0.16);
  const eyes = look(t, [
    [0, 0, 0],
    [1.22, 0, -1], // up at the headset, which enters at PROP
    [1.8, 0, 0],
    [2.05, -1, 0.1], // toward the word before it
    [WORDS + 0.1, 1, 0.1], // toward the words after it
    [3.05, 0, 0],
    [3.5, -0.5, 1], // down at the phone rising
    [ARRIVE + 0.15, 1, 0], // at its own name in the pill
    [5.3, 0, 0],
  ]);
  const pose: Pose = {
    squash,
    lookX: eyes.x,
    lookY: eyes.y,
    blink: blinkAt(t, [1.05, 3.2, 5.55]),
    prop: springAt(t - PROP, SPRING.pop),
    propLag: 22 * squashFn(t - 0.08), // the headset settles a few frames after the body
    invert: ramp(t, ARRIVE - 0.14, ARRIVE + 0.04),
  };

  // Contact shadow while it stands on the canvas.
  const shadowK = (t < LAND ? fall : 1) * (1 - shrink);
  const push = 1 + 0.02 * ramp(t, ARRIVE, 6, EASE.inOut);
  const landed = ramp(t, ARRIVE + 0.1, ARRIVE + 0.3, EASE.out); // the pill swaps to the character's call
  const statusHidden = ramp(t, EXPAND - 0.05, EXPAND + 0.12);

  const textStyle: React.CSSProperties = {
    position: "absolute",
    top: 540,
    translate: "0 -50%",
    fontFamily: DISPLAY,
    fontWeight: TYPE.weight,
    fontSize: FONT,
    letterSpacing: TYPE.tracking,
    lineHeight: 1,
    color: C.ink,
    whiteSpace: "nowrap",
    display: "flex",
    gap: FONT * 0.26,
  };

  return (
    <AbsoluteFill style={{ background: C.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ scale: String(push), transformOrigin: "50% 70%" }}>
        {/* headline around the glyph's slot */}
        <div style={{ ...textStyle, right: 960 + glyphW / 2 + FONT * 0.26 }}>
          {before.map((w, i) => (
            <Word key={i} t={t} at={WORDS + i * wordGap} out={lineOut}>
              {w}
            </Word>
          ))}
        </div>
        <div style={{ ...textStyle, left: 960 + glyphW / 2 + FONT * 0.26 }}>
          {after.map((w, i) => (
            <Word key={i} t={t} at={WORDS + (before.length + i) * wordGap} out={lineOut}>
              {w}
            </Word>
          ))}
        </div>

        {/* phone: the top of the screen with the status bar, the call pill and a row of app tiles */}
        <div
          style={{
            position: "absolute",
            left: 960 - PW / 2,
            top: phoneTop,
            width: PW,
            height: 900,
            padding: BEZ,
            borderRadius: 160,
            background: DEVICE.bezel,
            boxShadow: `${DEVICE.rim}, 0 50px 120px -40px ${DEVICE.shadow}`,
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 136,
              overflow: "hidden",
              background: `linear-gradient(180deg, ${mix(C.brand, "#FFFFFF", 0.18)} 0%, ${C.brand} 60%)`,
            }}
          >
            <div style={{ position: "absolute", left: 110, top: 34, fontFamily: SANS, fontWeight: 600, fontSize: 38, color: "#FFFFFF", opacity: 1 - statusHidden }}>
              9:41
            </div>
            <div style={{ position: "absolute", right: 104, top: 44, display: "flex", gap: 8, alignItems: "flex-end", opacity: 1 - statusHidden }}>
              {[12, 18, 24, 30].map((h) => (
                <div key={h} style={{ width: 8, height: h, borderRadius: 3, background: "#FFFFFF" }} />
              ))}
              <div style={{ width: 58, height: 28, marginLeft: 12, borderRadius: 9, border: "3px solid #FFFFFF", padding: 3 }}>
                <div style={{ width: "80%", height: "100%", borderRadius: 4, background: "#FFFFFF" }} />
              </div>
            </div>
            <div style={{ position: "absolute", left: 120, right: 120, top: 210, display: "flex", justifyContent: "space-between" }}>
              {[C.brandLight, C.amber, C.green, C.accent2, C.brandDeep, mix(C.amber, "#FFFFFF", 0.4)].map((c, i) => (
                <div key={i} style={{ width: 128, height: 128, borderRadius: 32, background: C.card, display: "grid", placeItems: "center" }}>
                  <div style={{ width: 54, height: 54, borderRadius: i % 2 ? 14 : 27, background: c }} />
                </div>
              ))}
            </div>
          </div>
          {/* the call pill (the phone's expanded top bar), drawn over the screen */}
          <div
            style={{
              position: "absolute",
              left: PW / 2 - pillW / 2,
              top: 22 + BEZ,
              width: pillW,
              height: pillH,
              borderRadius: pillH / 2,
              background: DEVICE.island,
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", inset: 0, opacity: ramp(t, EXPAND + 0.12, EXPAND + 0.3) }}>
              {/* placeholder caller avatar, replaced by the character */}
              <div
                style={{
                  position: "absolute",
                  left: 70 - 42 - (920 - pillW) / 2,
                  top: pillH / 2 - 42,
                  width: 84,
                  height: 84,
                  borderRadius: 42,
                  background: "#3A3F48",
                  color: "#C9CED6",
                  fontFamily: SANS,
                  fontWeight: 600,
                  fontSize: 30,
                  display: "grid",
                  placeItems: "center",
                  opacity: 1 - ramp(t, ARRIVE - 0.12, ARRIVE + 0.02),
                }}
              >
                {caller
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </div>
              {[
                { small: "mobile", big: caller, k: 1 - landed },
                { small: label, big: status, k: landed },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 140 - (920 - pillW) / 2,
                    top: pillH / 2 - 40,
                    fontFamily: SANS,
                    opacity: s.k,
                    translate: `0 ${(i === 0 ? -1 : 1) * (1 - s.k) * 12}px`,
                  }}
                >
                  <div style={{ fontSize: 24, color: "#8E949E", lineHeight: 1.1 }}>{s.small}</div>
                  <div style={{ fontSize: 38, color: "#FFFFFF", fontWeight: 600, lineHeight: 1.2 }}>{s.big}</div>
                </div>
              ))}
              {/* right side: accept turns into a live waveform once the character has the call */}
              <div style={{ position: "absolute", right: 28 - (920 - pillW) / 2, top: pillH / 2 - 44, display: "flex", gap: 24, alignItems: "center" }}>
                <div style={{ position: "relative", width: 150, height: 88 }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", gap: 7, alignItems: "center", justifyContent: "center", opacity: landed }}>
                    {Array.from({ length: 11 }, (_, i) => {
                      const h = 12 + 46 * Math.abs(Math.sin(t * 7.3 + i * 1.7) * Math.sin(t * 3.1 + i * 0.6));
                      return <div key={i} style={{ width: 7, height: h * landed, borderRadius: 4, background: C.green }} />;
                    })}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      width: 88,
                      height: 88,
                      borderRadius: 44,
                      background: C.green,
                      display: "grid",
                      placeItems: "center",
                      opacity: 1 - landed,
                      scale: String(1 - 0.4 * landed),
                    }}
                  >
                    <HandsetIcon rotate={-30} />
                  </div>
                </div>
                <div style={{ width: 88, height: 88, borderRadius: 44, background: "#EF4444", display: "grid", placeItems: "center" }}>
                  <HandsetIcon rotate={180} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* contact shadow, then the character itself (always on top: it is the thread) */}
        <div
          style={{
            position: "absolute",
            left: 960 - 90,
            top: 540 + HERO / 2 - 4,
            width: 180,
            height: 26,
            borderRadius: "50%",
            background: C.ink,
            opacity: 0.12 * shadowK,
            filter: "blur(8px)",
            scale: String(lerp(0.4, 1, shadowK) * (1 + 0.6 * Math.max(0, squash))),
          }}
        />
        <div style={{ position: "absolute", left: px, top: py, translate: "-50% -50%", scale: String(scale) }}>
          <Mascot size={HERO} pose={pose} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
