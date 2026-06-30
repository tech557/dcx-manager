import { CalendarDays } from "lucide-react";
import { useTheme } from "../../../../hooks/useTheme";


interface DayCardHeaderProps {
  dayIndex: number;
  dayLabel: string;
  isAnchorDay: boolean;
  dateString: string;
  isMonthly?: boolean;
}

export function DayCardHeader({ dayIndex, dayLabel, isAnchorDay, dateString, isMonthly }: DayCardHeaderProps) {
  const { isDark } = useTheme();
  return (
    <div className={`flex items-center justify-between shrink-0 ${isMonthly ? "mb-1.5" : "mb-3"}`}>
      <div>
        <span className="block text-[8px] font-black tracking-widest uppercase opacity-40 font-mono">
          {dayLabel}
        </span>
        <span className={`block font-black tracking-tight ${isMonthly ? "text-[11px]" : "text-lg"} ${isAnchorDay ? "text-[#75E2FF]" : ""}`}>
          D{dayIndex + 1}
        </span>
      </div>
      <div className={`rounded-full flex items-center justify-center ${
        isMonthly ? "w-7 h-7" : "w-10 h-10"
      } ${isAnchorDay ? "bg-[#75E2FF]/15 text-[#75E2FF]" : isDark ? "bg-white/5 text-white/60" : "bg-black/5 text-black/60"}`}>
        <CalendarDays className={isMonthly ? "w-3.5 h-3.5" : "w-4 h-4"} />
      </div>
      {!isMonthly && (
        <span className="absolute top-5 right-16 text-[9px] font-bold font-mono opacity-35 uppercase">
          {dateString}
        </span>
      )}
    </div>
  );
}
