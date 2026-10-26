import { AbsoluteFill } from "remotion";
import { Grain } from "../components/Grain";
import { Laptop } from "../components/Laptop";
import { LogoMark, Wordmark } from "../components/Logo";
import { BRAND_BG, C, DISPLAY, SERIF } from "../theme";
import { DashboardMock } from "../visuals/DashboardMock";

// Thumbnail / poster: big type readable at ~360px wide, one hero visual. Used as frame 0 of the video and as cover art.
export const THUMB = { line1: "Work,", accent: "simplified." };
export const Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: BRAND_BG, overflow: "hidden" }}>
    <div style={{ position: "absolute", left: 120, top: 150, display: "flex", alignItems: "center", gap: 20 }}>
      <LogoMark size={70} color={C.onBrand} />
      <Wordmark height={70} color={C.onBrand} />
    </div>
    <div
      style={{
        position: "absolute",
        left: 114,
        top: 320,
        fontFamily: DISPLAY,
        fontWeight: 600,
        fontSize: 150,
        lineHeight: 0.98,
        letterSpacing: "-0.045em",
        color: C.onBrand,
      }}
    >
      <div>{THUMB.line1}</div>
      <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: "1.16em", letterSpacing: "-0.01em" }}>{THUMB.accent}</div>
    </div>
    <div style={{ position: "absolute", left: 880, top: 260, perspective: 2400 }}>
      <div style={{ transform: "rotateY(-20deg) rotateX(8deg) scale(0.66)", transformOrigin: "0% 0%" }}>
        <Laptop screenW={1320} screenH={800}>
          <DashboardMock t={99} at={0} filterAt={1e9} />
        </Laptop>
      </div>
    </div>
    <Grain opacity={0.1} blend="soft-light" />
  </AbsoluteFill>
);
