import React, { useState, useRef, useEffect } from "react";
import { Trash2, Clock, Check, ChevronDown, Plus, Minus } from "lucide-react";
import { PopoverShell } from "../../../../../../components/ui/PopoverShell";
import { useTheme } from "../../../../../../hooks/useTheme";


interface SubtaskItem {
  id: string;
  label: string;
  done: boolean;
  duration?: string;
}

interface SubtaskCardProps {
  key?: string;
  subtask: SubtaskItem;
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: any) => void;
  onRemove: (id: string) => void;
}

const parseHours = (durStr: string | undefined): number => {
  if (!durStr) return 2;
  const num = parseInt(durStr);
  if (isNaN(num)) return 2;
  // Starting at a minimum of 2, and ensuring increments of 2
  if (num < 2) return 2;
  const rounded = Math.round(num / 2) * 2;
  return rounded < 2 ? 2 : rounded;
};

export function SubtaskCard({
  subtask,
onToggle,
  onUpdate,
  onRemove
}: SubtaskCardProps) {
  const { isDark } = useTheme();
  const gilroyStyle = { fontFamily: "Gilroy, -apple-system, BlinkMacSystemFont, sans-serif" };
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const currentHours = parseHours(subtask.duration);

  // Close popup if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    }
    if (showPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPopup]);

  const handleStep = (stepCount: number) => {
    const next = Math.max(2, currentHours + stepCount);
    onUpdate(subtask.id, { duration: `${next} hrs` });
  };

  return (
    <div
      className={`h-[72px] p-2.5 rounded-2xl border flex flex-col justify-between tracking-tight select-none relative group/subtask-card transition-all duration-300 ${
        isDark
          ? "bg-[#75E2FF]/[0.05] border-[#75E2FF]/20 text-[#75E2FF] hover:bg-[#75E2FF]/[0.09] hover:border-[#75E2FF]/40 hover:shadow-[0_0_12px_rgba(117,226,255,0.1)]"
          : "bg-[#75E2FF]/[0.03] border-[#75E2FF]/20 text-neutral-800 hover:bg-[#75E2FF]/[0.07] hover:border-[#75E2FF]/45 hover:shadow-[0_0_15px_rgba(117,226,255,0.08)]"
      }`}
    >
      {/* Top Header Row: Duration Trigger & Delete button */}
      <div className="flex items-center justify-between w-full h-5 shrink-0 gap-1.5 relative">
        {/* Clickable Duration Popup Trigger */}
        <div className="relative" ref={popupRef}>
          <button
            type="button"
            onClick={() => setShowPopup(!showPopup)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-black tracking-tight cursor-pointer transition-colors duration-200 ${
              isDark 
                ? "bg-[#75E2FF]/10 text-[#75E2FF] hover:bg-[#75E2FF]/20" 
                : "bg-black/[0.04] text-[#4ea0b5] hover:bg-black/[0.08]"
            }`}
            style={gilroyStyle}
          >
            <Clock className="w-2.5 h-2.5 shrink-0" />
            <span>{currentHours} hrs</span>
            <ChevronDown className="w-2 h-2 opacity-50 shrink-0" />
          </button>

          {/* Absolute Popup Overlay */}
          {showPopup && (
            <PopoverShell
              width="w-[130px]"
              className="absolute top-full left-0 mt-1 p-2"
            >
              <div className="text-[7px] font-black uppercase tracking-widest pb-1.5 opacity-40 select-none text-center">
                Step Duration
              </div>
              
              {/* Custom numerical controller */}
              <div className="flex items-center justify-between gap-1 mt-0.5">
                {/* Decrement Button */}
                <button
                  type="button"
                  onClick={() => handleStep(-2)}
                  disabled={currentHours <= 2}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors duration-200 cursor-pointer ${
                    currentHours <= 2
                      ? "opacity-20 cursor-not-allowed border-transparent"
                      : isDark
                        ? "bg-white/5 border-white/10 hover:bg-white/10 text-[#75E2FF]"
                        : "bg-black/5 border-black/10 hover:bg-black/10 text-[#4ea0b5]"
                  }`}
                  title="Subtract 2 Hours"
                >
                  <Minus className="w-3 h-3 stroke-[2.5px]" />
                </button>

                {/* Display Value in Hours */}
                <span className="flex-1 text-center font-mono text-[10px] font-black tracking-tight">
                  {currentHours}h
                </span>

                {/* Increment Button */}
                <button
                  type="button"
                  onClick={() => handleStep(2)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors duration-200 cursor-pointer ${
                    isDark
                      ? "bg-white/5 border-white/10 hover:bg-white/10 text-[#75E2FF]"
                      : "bg-black/5 border-[#151516]/10 hover:bg-black/10 text-[#4ea0b5]"
                  }`}
                  title="Add 2 Hours"
                >
                  <Plus className="w-3 h-3 stroke-[2.5px]" />
                </button>
              </div>

              {/* Numerical details info indicator */}
              <div className="text-[6.5px] text-center opacity-30 mt-1.5 font-bold uppercase tracking-wider select-none leading-none">
                min. 2 hr step
              </div>
            </PopoverShell>
          )}
        </div>

        {/* Floating Trash Action */}
        <button
          type="button"
          onClick={() => onRemove(subtask.id)}
          className={`absolute right-0 top-0.5 p-0.5 rounded cursor-pointer opacity-0 group-hover/subtask-card:opacity-100 transition-opacity ${
            isDark ? "hover:bg-rose-500/15 text-rose-400" : "hover:bg-rose-500/10 text-rose-500"
          }`}
          title="Delete subtask"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Static Subtask Title Label */}
      <div className="flex-1 flex items-end w-full min-h-0 pt-1">
        <span 
          className={`w-full text-[10.5px] font-extrabold truncate pb-0.5 select-all leading-snug ${
            isDark ? "text-neutral-100" : "text-neutral-800"
          }`}
          title={subtask.label}
        >
          {subtask.label}
        </span>
      </div>
    </div>
  );
}
