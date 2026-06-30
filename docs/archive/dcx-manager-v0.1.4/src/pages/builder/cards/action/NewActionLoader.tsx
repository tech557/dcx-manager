import { useTheme } from "../../../../hooks/useTheme";
export function NewActionLoader({}) {
  const { isDark } = useTheme();
  return (
    <div className={`h-20 rounded-2xl border flex items-center justify-center ${
      isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"
    }`}>
      <span className="text-[9px] font-black tracking-[0.25em] uppercase text-[#75E2FF] animate-pulse">
        Creating Action
      </span>
    </div>
  );
}
