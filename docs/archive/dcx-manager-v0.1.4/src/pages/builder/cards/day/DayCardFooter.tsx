interface DayCardFooterProps {
  tasksCount: number;
  isMonthly?: boolean;
}

export function DayCardFooter({ tasksCount, isMonthly }: DayCardFooterProps) {
  return (
    <div className={`pt-3 mt-3 border-t border-current/5 flex items-center justify-between shrink-0 ${isMonthly ? "text-[7px]" : "text-[9px]"}`}>
      <span className="font-black tracking-widest uppercase opacity-35">Tasks</span>
      <span className="px-2 py-0.5 rounded-full font-mono font-black bg-[#75E2FF]/10 text-[#75E2FF] border border-[#75E2FF]/15">
        {tasksCount}
      </span>
    </div>
  );
}
