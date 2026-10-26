import React from "react";
import { C, DEVICE } from "../theme";

/** Minimal laptop: bezel with camera, 16:10 screen, base with a finger notch, soft glare. The finish follows the preset
 *  (DEVICE in theme.ts): aluminium on light canvases, graphite with a lit rim on dark ones. */
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
          background: DEVICE.bezel,
          borderRadius: "30px 30px 14px 14px",
          boxShadow: `${DEVICE.rim}, 0 60px 120px -40px ${DEVICE.shadow}`,
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
            background: DEVICE.camera,
            boxShadow: `0 0 0 2px ${DEVICE.cameraRing}`,
          }}
        />
        <div style={{ position: "relative", width: screenW, height: screenH, borderRadius: 6, overflow: "hidden", background: C.card }}>
          {children}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background: `linear-gradient(115deg, rgba(255,255,255,${DEVICE.glare * glare}) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 100%)`,
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
          background: DEVICE.base,
          borderRadius: "4px 4px 22px 22px",
          boxShadow: `0 30px 50px -20px ${DEVICE.baseShadow}`,
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
            background: DEVICE.notch,
            borderRadius: "0 0 10px 10px",
          }}
        />
      </div>
    </div>
  );
};
