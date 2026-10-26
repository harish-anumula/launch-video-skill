import React from "react";
import { AbsoluteFill } from "remotion";
import { Grain } from "../components/Grain";
import { BEAT, MotionBlur, ramp, springAt } from "../lib/kit";
import { C, DISPLAY, EASE, GRAIN, SPRING, TYPE } from "../theme";

/** Kinetic Type signature. One huge word per beat lands from 2.5x on a stiff spring (started a frame early so it settles on
 *  the beat), with a small decaying shake, real motion blur only while the scale moves, and a hard colour cut on every word.
 *  Optional stutter recap at double speed, then a short final line whose last word takes the brand colour and holds with a
 *  slow push. Full-frame scene, 3 to 6 s. Keep it to about six words; it carries energy, not information. */
export const KineticSlam: React.FC<{
  dur?: number;
  words?: string[];
  final?: string;
  recap?: boolean;
  beat?: number;
}> = ({ dur = 4.5, words = ["PLAN", "BUILD", "SHIP"], final = "See it live.", recap = true, beat = BEAT }) => {
  const cuts = [
    { bg: C.ink, fg: C.paper },
    { bg: C.paper, fg: C.ink },
    { bg: C.brand, fg: C.ink },
  ];
  const n = words.length;
  const recapAt = n * beat;
  const finalAt = recapAt + (recap ? beat : 0);
  const finalWords = final.split(" ");
  const lastAt = finalAt + beat; // the brand-colour word lands one beat after the rest of the line
  const slamScale = (lt: number) => 1 + 1.5 * (1 - springAt(lt + 1 / 30, SPRING.slam));
  const shake = (lt: number) => {
    const d = lt < 0 ? 0 : Math.exp(-lt * 16) * 5;
    return `${Math.sin(lt * 95) * d}px ${Math.cos(lt * 71) * d * 0.7}px`;
  };
  const sizeFor = (w: string) => Math.min(400, 1640 / (w.length * 0.66));
  const moving = (t: number) => {
    const marks = [...words.map((_, i) => i * beat), finalAt, lastAt];
    return marks.some((m) => t >= m - 0.02 && t < m + 0.3);
  };
  const word = (text: string, size: number, color: string) => (
    <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: size, letterSpacing: TYPE.tracking, wordSpacing: "0.1em", lineHeight: 0.84, color, whiteSpace: "nowrap" }}>
      {text}
    </div>
  );
  const render = (t: number) => {
    if (t < recapAt) {
      const i = Math.min(n - 1, Math.floor(t / beat));
      const lt = t - i * beat;
      const cut = cuts[i % cuts.length];
      return (
        <AbsoluteFill style={{ background: cut.bg, alignItems: "center", justifyContent: "center" }}>
          <div style={{ translate: shake(lt - 0.07), scale: String(slamScale(lt)) }}>
            {word(words[i], sizeFor(words[i]), cut.fg)}
          </div>
        </AbsoluteFill>
      );
    }
    if (t < finalAt) {
      // stutter recap: every word again, five frames each, colours shifted by one
      const step = beat / n;
      const i = Math.min(n - 1, Math.floor((t - recapAt) / step));
      const lt = t - recapAt - i * step;
      const cut = cuts[(i + 1) % cuts.length];
      return (
        <AbsoluteFill style={{ background: cut.bg, alignItems: "center", justifyContent: "center" }}>
          <div style={{ scale: String(1.1 - 0.1 * ramp(lt, 0, step, EASE.out)) }}>
            {word(words[i], sizeFor(words[i]), cut.fg)}
          </div>
        </AbsoluteFill>
      );
    }
    const lt = t - finalAt;
    const pop = springAt(t - lastAt + 1 / 30, SPRING.pop);
    const push = 1 + 0.045 * ramp(t, lastAt, dur, EASE.inOut);
    const head = finalWords.slice(0, -1).join(" ");
    const tail = finalWords[finalWords.length - 1];
    const size = Math.min(300, 1700 / (final.length * 0.52));
    return (
      <AbsoluteFill style={{ background: C.ink, alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", gap: size * 0.24, alignItems: "baseline", translate: shake(lt - 0.07), scale: String(push) }}>
          {head && (
            <div style={{ scale: String(slamScale(lt)), transformOrigin: "50% 60%" }}>
              {word(head, size, C.paper)}
            </div>
          )}
          <div style={{ opacity: pop > 0.01 ? 1 : 0, scale: String(0.4 + 0.6 * pop), rotate: `${(1 - pop) * -10}deg`, transformOrigin: "30% 85%" }}>
            {word(tail, size, C.brand)}
          </div>
        </div>
      </AbsoluteFill>
    );
  };
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <MotionBlur samples={12} shutter={0.6} render={render} enabled={moving} />
      <Grain opacity={GRAIN.canvas} blend="overlay" />
    </AbsoluteFill>
  );
};
