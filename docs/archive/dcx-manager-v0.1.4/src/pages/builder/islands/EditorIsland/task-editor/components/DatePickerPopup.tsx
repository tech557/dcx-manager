import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, CalendarDays, Link2, Trash2, Plus } from "lucide-react";
import { DatePickerToggle } from "./DatePickerToggle";
import { EnrichedVersion } from "../../../../../../types";
import { PopoverShell } from "../../../../../../components/ui/PopoverShell";
import { useTheme } from "../../../../../../hooks/useTheme";


interface DatePickerPopupProps {
  value: string;
  onChange: (val: string, isSyncedVal?: boolean, week?: number, day?: number) => void;
  onClose: () => void;
  currentVersion?: EnrichedVersion;
}

export function DatePickerPopup({
value,
  onChange,
  onClose,
  currentVersion,
}: DatePickerPopupProps) {
  const { isDark } = useTheme();
  // Determine initial mode based on value structure
  const isSyncedVal = value.toLowerCase().includes("week");
  const [mode, setMode] = useState<"custom" | "link">(isSyncedVal ? "link" : "custom");

  // --- CALENDAR REQUISITES (Custom Date Mode) ---
  const [currentDate, setCurrentDate] = useState(() => {
    if (!isSyncedVal && value) {
      const parsed = new Date(value);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date(2026, 5, 13); // Default June 13, 2026 (incorporating local reference context)
  });

  const parsedYear = currentDate.getFullYear();
  const parsedMonth = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(parsedYear, parsedMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(parsedYear, parsedMonth + 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 is Sunday
  };

  const daysInMonth = getDaysInMonth(parsedYear, parsedMonth);
  const firstDayIndex = getFirstDayOfMonth(parsedYear, parsedMonth);

  // Generate array of calendar cells [null, null, ..., 1, 2, ..., lastDay]
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const handleCustomDateSelect = (day: number) => {
    const formattedMonth = String(parsedMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const formattedDate = `${parsedYear}-${formattedMonth}-${formattedDay}`;
    onChange(formattedDate);
    onClose();
  };

  // --- LINKED DATES REQUISITES (Week / Day Mode) ---
  // Calculates Sunday-Saturday indexes dynamically based on overall communication date
  const baseDate = currentVersion?.communicatedDate || "2026-06-13";

  const getBaseDateDayOfWeek = () => {
    if (!baseDate) return 0;
    const d = new Date(baseDate);
    if (isNaN(d.getTime())) return 0;
    return d.getDay(); // 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  };

  const baseDayOfWeek = getBaseDateDayOfWeek();

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

  const getWeekDaysForWeek = (weekNum: number) => {
    const weekdays = [
      { dayIdx: 0, name: "Sunday" },
      { dayIdx: 1, name: "Monday" },
      { dayIdx: 2, name: "Tuesday" },
      { dayIdx: 3, name: "Wednesday" },
      { dayIdx: 4, name: "Thursday" },
      { dayIdx: 5, name: "Friday" },
      { dayIdx: 6, name: "Saturday" },
    ];

    if (weekNum === 1) {
      return weekdays.map((wd) => {
        const isBeforeStart = wd.dayIdx < baseDayOfWeek;
        // Friday and Saturday are always disabled as weekend
        const isWeekend = wd.dayIdx === 5 || wd.dayIdx === 6;

        const dayNum = isBeforeStart ? null : (wd.dayIdx - baseDayOfWeek + 1);
        const label = dayNum ? `Day ${dayNum}` : "";
        const isEnabled = !isBeforeStart && !isWeekend;

        return {
          dayIdx: wd.dayIdx,
          name: wd.name,
          dayNum,
          label,
          isEnabled,
          isWeekend,
          isBeforeStart,
        };
      });
    } else {
      return weekdays.map((wd) => {
        const isWeekend = wd.dayIdx === 5 || wd.dayIdx === 6; // Friday & Saturday are standard weekend
        const dayNum = wd.dayIdx + 1;
        const label = `Day ${dayNum}`;
        const isEnabled = !isWeekend;

        return {
          dayIdx: wd.dayIdx,
          name: wd.name,
          dayNum,
          label,
          isEnabled,
          isWeekend,
          isBeforeStart: false,
        };
      });
    }
  };

  // Value example: "Week 2 - Day 3"
  const parseLinkedValue = (str: string) => {
    const regex = /week\s*(\d+)\s*-\s*day\s*(\d+)/i;
    const match = str.match(regex);
    if (match) {
      return {
        week: parseInt(match[1], 10),
        day: parseInt(match[2], 10),
      };
    }
    return { week: 1, day: 1 }; // Default to week 1, day 1 (which refers to communication day)
  };

  const linked = parseLinkedValue(value);
  const [selectedWeek, setSelectedWeek] = useState<number>(linked.week);
  const [selectedDay, setSelectedDay] = useState<number>(linked.day);

  // Sync state if external value changes
  useEffect(() => {
    if (isSyncedVal) {
      const parsed = parseLinkedValue(value);
      setSelectedWeek(parsed.week);
      setSelectedDay(parsed.day);
    }
  }, [value, isSyncedVal]);

  // Read dynamic campaign weeks list initialized on currentVersion, sorted numerically
  const [activeWeeks, setActiveWeeks] = useState<number[]>(() => {
    if (currentVersion?.weeks && currentVersion.weeks.length > 0) {
      return currentVersion.weeks.map((w) => w.weekNumber).sort((a, b) => a - b);
    }
    return [1];
  });

  const handleAddWeek = () => {
    const nextWeek = activeWeeks.length > 0 ? Math.max(...activeWeeks) + 1 : 1;
    const updated = [...activeWeeks, nextWeek].sort((a, b) => a - b);
    setActiveWeeks(updated);

    // Sync back by reference immediately so other views get updated lists
    if (currentVersion) {
      currentVersion.weeks = updated.map((num) => ({
        id: `wk-${num}-${currentVersion.id}`,
        weekNumber: num,
      }));
    }
  };

  const handleDeleteWeek = (weekNumToDelete: number) => {
    if (weekNumToDelete === 1) return; // Week 1 cannot be deleted
    const updated = activeWeeks.filter((num) => num !== weekNumToDelete);
    setActiveWeeks(updated);

    if (currentVersion) {
      currentVersion.weeks = updated.map((num) => ({
        id: `wk-${num}-${currentVersion.id}`,
        weekNumber: num,
      }));
    }

    // If deleting the active week, re-activate Week 1
    if (selectedWeek === weekNumToDelete) {
      setSelectedWeek(1);
      const weekDays = getWeekDaysForWeek(1);
      let dayToSet = selectedDay;
      const match = weekDays.some((wd) => wd.dayNum === selectedDay && wd.isEnabled);
      if (!match) {
        const firstEnabled = weekDays.find((wd) => wd.isEnabled);
        if (firstEnabled && firstEnabled.dayNum !== null) {
          dayToSet = firstEnabled.dayNum;
        }
      }
      setSelectedDay(dayToSet);
      onChange(`Week 1 - Day ${dayToSet}`, true, 1, dayToSet);
    }
  };

  const handleLinkedSelect = (weekNum: number, dayNum: number) => {
    setSelectedWeek(weekNum);
    setSelectedDay(dayNum);
    const linkedStr = `Week ${weekNum} - Day ${dayNum}`;
    onChange(linkedStr, true, weekNum, dayNum);
    onClose();
  };

  // Switch modes safely and load corresponding format
  const handleModeChange = (newMode: "custom" | "link") => {
    setMode(newMode);
    if (newMode === "custom") {
      // Re-evaluate or format today/default value to input
      const formattedMonth = String(parsedMonth + 1).padStart(2, "0");
      const formattedDay = String(currentDate.getDate()).padStart(2, "0");
      const formattedDate = `${parsedYear}-${formattedMonth}-${formattedDay}`;
      onChange(formattedDate, false);
    } else {
      // Verify chosen day is valid for week 1
      let dayToSet = selectedDay;
      if (selectedWeek === 1) {
        const weekDays = getWeekDaysForWeek(1);
        const exists = weekDays.some(wd => wd.dayNum === dayToSet && wd.isEnabled);
        if (!exists) {
          // Default to the first enabled day in week 1
          const firstEnabled = weekDays.find(wd => wd.isEnabled);
          if (firstEnabled && firstEnabled.dayNum !== null) {
            dayToSet = firstEnabled.dayNum;
          }
        }
      }
      setSelectedDay(dayToSet);
      const linkedStr = `Week ${selectedWeek} - Day ${dayToSet}`;
      onChange(linkedStr, true, selectedWeek, dayToSet);
    }
  };

  // Detect click outside to request onClose
  const popupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute right-0 z-50 mt-1.5 font-sans text-xs"
      onClick={(e) => e.stopPropagation()}
    >
      <motion.div
        initial={{ opacity: 0, y: -4, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.97 }}
      >
        <PopoverShell
          width="w-[300px]"
          className="relative p-3.5"
        >
      {/* 1. View Grid Content dynamically */}
      {mode === "custom" ? (
        <div className="space-y-3.5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="font-sans font-black tracking-wider text-xs">
              {monthNames[parsedMonth]} {parsedYear}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className={`p-1 rounded-lg cursor-pointer transition-colors ${
                  isDark ? "hover:bg-white/5 text-neutral-400" : "hover:bg-black/5 text-neutral-600"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className={`p-1 rounded-lg cursor-pointer transition-colors ${
                  isDark ? "hover:bg-white/5 text-neutral-400" : "hover:bg-black/5 text-neutral-600"
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold opacity-30 text-[9px] uppercase tracking-wider">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Month Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              if (day === null) return <div key={`empty-${idx}`} />;
              
              const isSelected = !isSyncedVal && value && (
                (() => {
                  const check = new Date(value);
                  return check.getDate() === day && check.getMonth() === parsedMonth && check.getFullYear() === parsedYear;
                })()
              );

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => handleCustomDateSelect(day)}
                  className={`py-1.5 rounded-lg text-center font-mono font-bold transition-all duration-200 cursor-pointer text-xs ${
                    isSelected
                      ? "bg-[#75E2FF] text-black shadow-[0_4px_12px_rgba(117,226,255,0.4)]"
                      : isDark
                        ? "hover:bg-white/10 text-neutral-100"
                        : "hover:bg-neutral-100 text-neutral-800"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Split Link Dates Layout */
        <div className="flex gap-3 h-[210px] min-h-[210px]">
          {/* Week column (Left side scrollable) */}
          <div className="w-[42%] flex flex-col border-r border-white/[0.05] pr-1.5">
            <span className="text-[8px] font-black tracking-wider uppercase opacity-30 block mb-1.5 ml-1">
              Select Week
            </span>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {activeWeeks.map((weekNum) => {
                const isActive = weekNum === selectedWeek;
                return (
                  <div key={`week-container-${weekNum}`} className="flex items-center gap-1 group">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedWeek(weekNum);
                        // Auto-adjust selectedDay if switching to week 1 has an issue
                        if (weekNum === 1) {
                          const weekDays = getWeekDaysForWeek(1);
                          const match = weekDays.some(wd => wd.dayNum === selectedDay && wd.isEnabled);
                          if (!match) {
                            const firstEnabled = weekDays.find(wd => wd.isEnabled);
                            if (firstEnabled && firstEnabled.dayNum !== null) {
                              setSelectedDay(firstEnabled.dayNum);
                            }
                          }
                        }
                      }}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-left font-sans font-bold transition-all duration-200 cursor-pointer flex items-center justify-between text-xs ${
                        isActive
                          ? "bg-[#75E2FF]/10 text-[#75E2FF] border border-[#75E2FF]/20 font-black"
                          : isDark
                            ? "hover:bg-white/5 text-neutral-400 hover:text-white"
                            : "hover:bg-black/5 text-neutral-600 hover:text-black"
                      }`}
                    >
                      <span className="truncate">Week {weekNum}</span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#75E2FF]" />}
                    </button>
                    {weekNum > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWeek(weekNum);
                        }}
                        className={`p-1 rounded-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer ${
                          isDark ? "hover:bg-rose-500/10 text-rose-400" : "hover:bg-rose-500/10 text-rose-500"
                        }`}
                        title={`Delete Week ${weekNum}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}

              {/* Beautiful Add Week Button */}
              <button
                type="button"
                onClick={handleAddWeek}
                className={`w-full py-1.5 px-2 px-2.5 rounded-lg font-sans font-bold text-[10px] uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
                  isDark
                    ? "bg-white/5 hover:bg-white/10 text-neutral-350 hover:text-white border border-dashed border-white/10"
                    : "bg-black/5 hover:bg-black/10 text-neutral-600 hover:text-black border border-dashed border-black/10"
                }`}
              >
                <Plus className="w-3 h-3 text-[#75E2FF]" />
                <span>Add Week</span>
              </button>
            </div>
          </div>

          {/* Weekday column (Right side) */}
          <div className="flex-1 flex flex-col pl-1.5">
            <span className="text-[8px] font-black tracking-wider uppercase opacity-30 block mb-1.5">
              Select Weekday
            </span>
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {getWeekDaysForWeek(selectedWeek).map((wd) => {
                const isActive = selectedWeek === linked.week && wd.dayNum !== null && wd.dayNum === selectedDay && isSyncedVal;
                const targetDate = getResolvedCampaignDate(selectedWeek, wd.dayIdx);
                const formattedDate = formatCampaignDate(targetDate);

                return (
                  <button
                    key={`day-idx-${wd.dayIdx}`}
                    type="button"
                    disabled={!wd.isEnabled}
                    onClick={() => wd.dayNum !== null && handleLinkedSelect(selectedWeek, wd.dayNum)}
                    className={`w-full py-1.5 px-2.5 rounded-lg text-left text-xs font-sans font-semibold transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      !wd.isEnabled
                        ? "opacity-25 saturate-50 cursor-not-allowed pointer-events-none"
                        : isActive
                          ? "bg-[#75E2FF] text-black font-extrabold shadow-sm"
                          : isDark
                            ? "hover:bg-white/5 text-neutral-200"
                            : "hover:bg-neutral-100 text-neutral-800"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {wd.dayNum !== null ? (
                        <span className="font-mono text-[9px] font-black bg-black/10 px-1 py-0.5 rounded text-current">
                          Day {wd.dayNum}
                        </span>
                      ) : (
                        <span className="w-8 shrink-0" /> // Blank box
                      )}
                      <span className="truncate">{formattedDate || wd.name}</span>
                    </div>
                    {wd.isWeekend && (
                      <span className="text-[7px] font-black uppercase tracking-wider opacity-60 bg-black/5 px-1 py-0.5 rounded font-sans shrink-0 ml-1">
                        Wknd
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Divider */}
      <div className={`my-3 border-t ${isDark ? "border-white/[0.04]" : "border-black/[0.04]"}`} />

      {/* 3. Toggle */}
      <DatePickerToggle mode={mode} onModeChange={handleModeChange} />
        </PopoverShell>
      </motion.div>
    </div>
  );
}
