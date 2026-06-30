import { useAppStore } from "../store/appStore";
import { SURFACE } from "../styles/tokens";

export function useTheme() {
  const isDark = useAppStore((s) => s.isDark);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const setIsDark = useAppStore((s) => s.setIsDark);
  
  return {
    isDark,
    toggleTheme,
    setIsDark,
    surface: isDark ? SURFACE.dark : SURFACE.light,
    text: {
      primary: isDark ? "text-white" : "text-[#1a1a1b]",
      secondary: isDark ? "text-white/50" : "text-black/40",
      accent: "text-[#75E2FF]",
    },
    divider: isDark ? "border-white/10 bg-white/10" : "border-black/10 bg-black/10",
    inputBg: isDark ? "bg-white/[0.04]" : "bg-black/[0.04]",
    inputBorder: isDark ? "border-white/[0.06]" : "border-black/[0.08]",
  };
}
