// Theme surfaces
export const SURFACE = {
  dark: {
    base:     "bg-[#0D0D0E]/60 border-white/[0.04]",
    raised:   "bg-[#151516]/80 border-white/[0.06]",
    glass:    "bg-black/20 border-white/[0.03]",
    pill:     "bg-white/5 border-white/[0.04]",
    pillHover:"hover:bg-white/10 hover:border-white/[0.08]",
    selected: "bg-[#75E2FF]/5 border-white/[0.06] shadow-[0_0_15px_rgba(117,226,255,0.15)]",
    overlay:  "bg-[#0d0d0e]/95 border-white/[0.04]",
  },
  light: {
    base:     "bg-white/85 border-[#151516]/10",
    raised:   "bg-white/95 border-black/[0.08]",
    glass:    "bg-white/75 border-black/[0.07]",
    pill:     "bg-black/[0.04] border-black/5",
    pillHover:"hover:bg-neutral-100",
    selected: "bg-[#75E2FF]/2 border-black/[0.06] shadow-[0_0_10px_rgba(117,226,255,0.1)]",
    overlay:  "bg-white/95 border-black/[0.08]",
  }
} as const;

// Shared radii
export const RADIUS = {
  pill:   "rounded-full",
  island: "rounded-[2rem]",
  card:   "rounded-[2.2rem]",
  panel:  "rounded-[1.6rem]",
  chip:   "rounded-xl",
  sm:     "rounded-lg",
} as const;

// Shared blur
export const BLUR = {
  heavy: "backdrop-blur-3xl",
  mid:   "backdrop-blur-xl",
  light: "backdrop-blur-md",
} as const;

// Shared shadows
export const SHADOW = {
  island: "shadow-[0_12px_40px_rgba(0,0,0,0.2)]",
  card:   "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
  overlay:"shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
  glow:   "shadow-[0_0_15px_rgba(117,226,255,0.15)]",
} as const;

// Shared motion spring config (used by all island expand animations)
export const SPRING = {
  island: { type: "spring", stiffness: 180, damping: 24, mass: 0.95 },
  card:   { type: "spring", stiffness: 200, damping: 20 },
  gentle: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
} as const;

// Accent color
export const PRIMARY = "#75E2FF";

// Helper: compose surface + blur + radius for the standard island pill
export function islandClass(isDark: boolean, isExpanded: boolean): string {
  const surface = isDark ? SURFACE.dark : SURFACE.light;
  return [
    BLUR.heavy,
    RADIUS.island,
    "border transition-all duration-500 select-none pointer-events-auto",
    isExpanded ? surface.base : `${surface.pill} ${surface.pillHover}`,
  ].join(" ");
}

// Helper: card selected state
export function cardSelectedClass(isDark: boolean, isSelected: boolean): string {
  if (!isSelected) return "";
  return isDark ? SURFACE.dark.selected : SURFACE.light.selected;
}
