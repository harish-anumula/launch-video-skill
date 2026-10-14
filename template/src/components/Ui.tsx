import React from "react";
import { C, SANS, SHADOW } from "../theme";

export const Card: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; radius?: number }> = ({
  style,
  children,
  radius = 18,
}) => (
  <div
    style={{
      background: C.card,
      border: `1px solid ${C.line}`,
      borderRadius: radius,
      boxShadow: SHADOW.card,
      fontFamily: SANS,
      color: C.ink,
      ...style,
    }}
  >
    {children}
  </div>
);
export const Check: React.FC<{ size: number; color: string; p?: number }> = ({ size, color, p = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M4.5 12.5l5 5L19.5 7"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={24}
      strokeDashoffset={24 * (1 - p)}
    />
  </svg>
);
export const Spinner: React.FC<{ t: number; size: number; color?: string }> = ({ t, size, color = C.brand }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ rotate: `${t * 360 * 1.4}deg` }}>
    <circle cx="12" cy="12" r="9" fill="none" stroke={C.line} strokeWidth="3" />
    <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/** Integration icon. Placeholder: a coloured letter badge. Replace `INTEGRATIONS` with your real integrations and official SVG logos
 *  (logos are their owners' trademarks; show them only for integrations you actually support). */
export type Integration = { id: string; name: string; color: string };
export const INTEGRATIONS: Integration[] = [
  { id: "crm", name: "CRM", color: "#0EA5E9" },
  { id: "warehouse", name: "Warehouse", color: "#22C55E" },
  { id: "billing", name: "Billing", color: "#F97316" },
  { id: "marketing", name: "Marketing", color: "#EC4899" },
  { id: "support", name: "Support", color: "#8B5CF6" },
  { id: "docs", name: "Docs", color: "#14B8A6" },
  { id: "calendar", name: "Calendar", color: "#EAB308" },
  { id: "email", name: "Email", color: "#EF4444" },
  { id: "analytics", name: "Analytics", color: "#6366F1" },
  { id: "tickets", name: "Tickets", color: "#F43F5E" },
  { id: "files", name: "Files", color: "#0284C7" },
  { id: "calls", name: "Calls", color: "#84CC16" },
];
export const IntegrationIcon: React.FC<{ it: Integration; size: number }> = ({ it, size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: it.color,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: size * 0.5,
    }}
  >
    {it.name[0]}
  </div>
);
