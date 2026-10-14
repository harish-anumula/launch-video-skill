// Replace with your product name and your logo mark's SVG paths (viewBox 0 0 32 32).
// Each path animates in separately (outside -> in), so split the mark into its natural pieces.
export const PRODUCT = "Acme";
export const LOGO_VIEWBOX = 32;
export const LOGO_CENTER = { x: 16, y: 16 }; // the point the pieces rotate around (and where iris transitions start)
// Placeholder mark: three rising bars. Swap in your own logo's paths.
export const LOGO_PATHS = [
  "M5 18h6v9H5Z",
  "M13 11h6v16h-6Z",
  "M21 5h6v22h-6Z",
];
