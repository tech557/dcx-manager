import { CalendarDays, Link2 } from "lucide-react";
import { useTheme } from "../../../../../../hooks/useTheme";


interface DatePickerToggleProps {
  mode: "custom" | "link";
  onModeChange: (mode: "custom" | "link") => void;
}

export function DatePickerToggle({ mode, onModeChange }: DatePickerToggleProps) {
  const { isDark } = useTheme();
  const inactive = isDark ? "text-neutral-400 hover:text-white" : "text-neutral-500 hover:text-black";
  return (
    <div className={`grid grid-cols-2 gap-1 rounded-xl p-1 border ${isDark ? "border-white/10 bg-black/25" : "border-black/10 bg-white/80"}`}>
      <button
        type="button"
        onClick={() => onModeChange("custom")}
        className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[9px] font-black uppercase ${
          mode === "custom" ? "bg-[#75E2FF]/20 text-[#75E2FF]" : inactive
        }`}
      >
        <CalendarDays className="w-3.5 h-3.5" />
        Date
      </button>
      <button
        type="button"
        onClick={() => onModeChange("link")}
        className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[9px] font-black uppercase ${
          mode === "link" ? "bg-[#75E2FF]/20 text-[#75E2FF]" : inactive
        }`}
      >
        <Link2 className="w-3.5 h-3.5" />
        Link
      </button>
    </div>
  );
}
