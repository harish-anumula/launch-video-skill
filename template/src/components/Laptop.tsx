import React from "react";

/** Minimal laptop: dark bezel with camera, 16:10 screen, aluminium base with a finger notch, soft glare. */
export const Laptop: React.FC<{ screenW: number; screenH: number; children: React.ReactNode; glare?: number }> = ({
  screenW,
  screenH,
  children,
  glare = 0.5,
}) => {
  const bez = 18;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          padding: bez,
          paddingTop: bez + 6,
          background: "linear-gradient(180deg,#1A1D24,#0C0E12)",
          borderRadius: "30px 30px 14px 14px",
          boxShadow: "0 0 0 2px #2A2E37 inset, 0 60px 120px -40px rgba(17,19,24,0.55)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 9,
            left: "50%",
            width: 8,
            height: 8,
            marginLeft: -4,
            borderRadius: 4,
            background: "#2B303A",
            boxShadow: "0 0 0 2px #15181E",
          }}
        />
        <div style={{ position: "relative", width: screenW, height: screenH, borderRadius: 6, overflow: "hidden", background: "#fff" }}>
          {children}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: `linear-gradient(115deg, rgba(255,255,255,${0.16 * glare}) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 100%)`,
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "relative",
          width: screenW + bez * 2 + 170,
          height: 26,
          marginTop: -2,
          background: "linear-gradient(180deg,#E4E7EC 0%,#C9CDD5 55%,#A9AEB8 100%)",
          borderRadius: "4px 4px 22px 22px",
          boxShadow: "0 30px 50px -20px rgba(17,19,24,0.45)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            width: 230,
            height: 9,
            marginLeft: -115,
            background: "linear-gradient(180deg,#B7BBC4,#D3D6DC)",
            borderRadius: "0 0 10px 10px",
          }}
        />
      </div>
    </div>
  );
};
