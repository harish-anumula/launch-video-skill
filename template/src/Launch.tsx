import { AbsoluteFill, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { Hud } from "./components/Hud";
import { TIMING } from "./lib/time";
import { Thumbnail } from "./scenes/Thumbnail";
import { C } from "./theme";
import { SCENES } from "./video.config";

/** Main timeline: scenes on their (beat-snapped) starts, overlapping by `lead` for transitions; VO lines; music with gentle dips. */
export const Launch: React.FC<{ upTo?: number; poster?: boolean }> = ({ upTo, poster = true }) => {
  const { fps } = useVideoConfig();
  const end = upTo ?? TIMING.duration;
  const payoff = TIMING.scenes.find((s) => s.id === "payoff");
  const musicVolume = (f: number) => {
    const t = f / fps;
    const introLift = interpolate(t, [0, 4.5, 9], [2.2, 1.8, 1], { extrapolateRight: "clamp" }); // generated intros are often very quiet
    const dip = payoff
      ? interpolate(t, [payoff.start - 0.5, payoff.start + 0.2, payoff.end - 0.4, payoff.end + 0.3], [1, 0.72, 0.72, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;
    const out = interpolate(t, [end - 1.6, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return 0.42 * introLift * dip * out;
  };
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      {TIMING.scenes.map((s) => {
        const def = SCENES[s.id];
        if (!def) return null;
        const from = Math.round((s.start - (def.lead ?? 0)) * fps);
        return (
          <Sequence key={s.id} name={s.id} from={from} durationInFrames={Math.round((s.end + 0.02) * fps) - from} premountFor={fps}>
            <def.C />
          </Sequence>
        );
      })}
      <Hud />
      {poster && (
        <Sequence name="poster" from={0} durationInFrames={1} layout="absolute-fill">
          <Thumbnail />
        </Sequence>
      )}
      {TIMING.music && <Audio src={staticFile(TIMING.music)} volume={musicVolume} />}
      {TIMING.scenes
        .filter((s) => s.vo)
        .map((s) => (
          <Sequence key={`vo-${s.id}`} name={`vo ${s.id}`} from={Math.round((s.start + s.voOffset) * fps)} layout="none">
            <Audio src={staticFile(s.vo!)} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};
