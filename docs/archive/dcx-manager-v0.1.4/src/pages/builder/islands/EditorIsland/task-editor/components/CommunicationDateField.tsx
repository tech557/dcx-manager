import React, { useState, useRef } from "react";
import { CalendarDays, Link2 } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { DatePickerPopup } from "./DatePickerPopup";
import { EnrichedVersion } from "../../../../../../types";
import { useTheme } from "../../../../../../hooks/useTheme";


interface CommunicationDateFieldProps {
  value: string;
  onChange: (val: string, isSyncedRel?: boolean, week?: number, day?: number) => void;
  currentVersion?: EnrichedVersion;
}

export function CommunicationDateField({ value, onChange, currentVersion }: CommunicationDateFieldProps) {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isPressing, setIsPressing] = useState(false);

  const isSyncedRel = value.toLowerCase().includes("week");

  // Timer Ref for long press
  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLongPressedRef = useRef(false);

  // Calculates Sunday-Saturday indexes dynamically based on overall campaign/communication date
  const baseDate = currentVersion?.communicatedDate || "2026-06-13";

  const getResolvedCampaignDate = (weekNum: number, dayIdx: number) => {
    const d = new Date(baseDate);
    if (isNaN(d.getTime())) return null;
    const dayOfWeek = d.getDay(); // 0-6
    
    // Start of Week 1 Sunday
    const startSunday = new Date(d);
    startSunday.setDate(d.getDate() - dayOfWeek);
    
    // Target date
    const targetDate = new Date(startSunday);
    targetDate.setDate(startSunday.getDate() + (weekNum - 1) * 7 + dayIdx);
    return targetDate;
  };

  const formatCampaignDate = (date: Date | null): string => {
    if (!date || isNaN(date.getTime())) return "";
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dName = days[date.getDay()];
    const dNum = date.getDate();
    const mName = months[date.getMonth()];
    return `${dName} ${dNum} ${mName}`;
  };

  const parseLinkedValue = (str: string) => {
    const regex = /week\s*(\d+)\s*-\s*day\s*(\d+)/i;
    const match = str.match(regex);
    if (match) {
      return {
        week: parseInt(match[1], 10),
        day: parseInt(match[2], 10),
      };
    }
    return null;
  };

  const getDisplayValue = () => {
    if (!value) return "Select Date...";
    if (!isSyncedRel) return value;
    
    const parsed = parseLinkedValue(value);
    if (!parsed) return value;
    
    const baseD = new Date(baseDate);
    if (isNaN(baseD.getTime())) return value;
    
    const baseDayOfWeek = baseD.getDay();
    let dayIdx = 0;
    if (parsed.week === 1) {
      dayIdx = parsed.day - 1 + baseDayOfWeek;
    } else {
      dayIdx = parsed.day - 1;
    }
    
    const targetDate = getResolvedCampaignDate(parsed.week, dayIdx);
    const dateStr = formatCampaignDate(targetDate);
    
    if (dateStr) {
      return `${value} (${dateStr})`;
    }
    return value;
  };

  // Convert linked week mode to hardcoded custom date string upon long-press trigger
  const handleLongPressDetach = () => {
    if (!isSyncedRel) return;
    const parsed = parseLinkedValue(value);
    if (!parsed) return;
    
    const baseD = new Date(baseDate);
    if (isNaN(baseD.getTime())) return;
    
    const baseDayOfWeek = baseD.getDay();
    let dayIdx = 0;
    if (parsed.week === 1) {
      dayIdx = parsed.day - 1 + baseDayOfWeek;
    } else {
      dayIdx = parsed.day - 1;
    }
    
    const targetDate = getResolvedCampaignDate(parsed.week, dayIdx);
    if (targetDate && !isNaN(targetDate.getTime())) {
      const yyyy = targetDate.getFullYear();
      const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
      const dd = String(targetDate.getDate()).padStart(2, "0");
      const customDateStr = `${yyyy}-${mm}-${dd}`;
      onChange(customDateStr, false);
    }
  };

  // Touch and pointer interactions for smooth, lag-free triggers
  const startPress = (e: React.MouseEvent | React.TouchEvent) => {
    // Left click only
    if ("button" in e && e.button !== 0) return;
    
    hasLongPressedRef.current = false;
    if (!isSyncedRel) return; // Only process longpress when in linked mode
    
    setIsPressing(true);
    
    longPressTimeoutRef.current = setTimeout(() => {
      hasLongPressedRef.current = true;
      setIsPressing(false);
      handleLongPressDetach();
    }, 600); // 600ms hold timeline
  };

  const endPress = (e: React.MouseEvent | React.TouchEvent) => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    
    setIsPressing(false);
    
    // Toggle calendar only if they did not long press
    if (!hasLongPressedRef.current) {
      setIsOpen((prev) => !prev);
    }
  };

  const cancelPress = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
    setIsPressing(false);
  };

  return (
    <div id="editor-field-comm-date" className="space-y-1.5 relative select-none">
      <label className="text-[9px] font-black tracking-[0.2em] font-sans uppercase opacity-40 block ml-1 font-bold">
        Communication Date
      </label>
      
      {/* Branded Trigger Button */}
      <button
        type="button"
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={cancelPress}
        onTouchStart={startPress}
        onTouchEnd={endPress}
        onTouchCancel={cancelPress}
        className={`relative overflow-hidden w-full px-4 py-2.5 rounded-[1.2rem] text-left text-xs font-mono border outline-none font-bold transition-all duration-300 flex items-center justify-between cursor-pointer ${
          isDark 
            ? "bg-black/60 border-white/10 text-white hover:border-[#75E2FF]/40" 
            : "bg-white border-[#151516]/10 text-neutral-800 hover:border-[#75E2FF]/40"
        } ${isOpen ? "ring-1 ring-[#75E2FF] border-[#75E2FF]" : ""} ${isPressing ? "scale-[0.98] border-[#75E2FF]/30" : ""}`}
      >
        <span className="truncate relative z-10">
          {getDisplayValue()}
        </span>
        {isSyncedRel ? (
          <Link2 className="w-3.5 h-3.5 text-[#75E2FF] shrink-0 ml-1.5 relative z-10" />
        ) : (
          <CalendarDays className="w-3.5 h-3.5 text-neutral-400 shrink-0 ml-1.5 relative z-10" />
        )}

        {/* Custom micro interaction progress bar during button hold */}
        <div 
          className="absolute bottom-0 left-0 h-1 bg-[#75E2FF] transition-all ease-linear"
          style={{
            width: isPressing ? "100%" : "0%",
            transitionDuration: isPressing ? "600ms" : "0ms"
          }}
        />
      </button>

      {isSyncedRel && (
        <span className="text-[8px] font-sans opacity-40 block ml-1 transition-all">
          Tip: Hold / Long-press to detach link and set as custom date
        </span>
      )}

      {/* Date Picker Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <DatePickerPopup
            value={value}
            onChange={onChange}
            onClose={() => setIsOpen(false)}
            currentVersion={currentVersion}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
