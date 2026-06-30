import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Link2, Trash2, Plus, Calendar } from "lucide-react";
import { useTooltipDraft } from "./useTooltipDraft";
import { DatePickerToggle } from "../islands/EditorIsland/task-editor/components/DatePickerToggle";
import { useBuilderStore } from "../../../store/builderStore";
import { useTheme } from "../../../hooks/useTheme";


interface DateTooltipEditorProps {
  value: any;
  hasValue: boolean;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  close: (force?: boolean) => void;
  onSave: (newValue: any) => void;
  setHasUnsavedChanges?: (val: boolean) => void;
  onSaveTriggerRef?: React.MutableRefObject<(() => void) | null>;
  onDiscardTriggerRef?: React.MutableRefObject<(() => void) | null>;
}

export function DateTooltipEditor({
value,
  hasValue,
  isEditing,
  setIsEditing,
  close,
  onSave,
  setHasUnsavedChanges,
  onSaveTriggerRef,
  onDiscardTriggerRef
}: DateTooltipEditorProps) {
  const { isDark } = useTheme();
  const { draft, setDraft, handleSave } = useTooltipDraft<string>(
    value || "2026-06-12",
    isEditing,
    setHasUnsavedChanges,
    onSave,
    close,
    onSaveTriggerRef,
    onDiscardTriggerRef
  );

  const currentVersion = useBuilderStore.getState().activeVersion;
  const baseDate = currentVersion?.communicatedDate || "2026-06-13";

  const isSyncedVal = draft.toLowerCase().includes("week");
  const [mode, setMode] = useState<"custom" | "link">(isSyncedVal ? "link" : "custom");

  // Keep mode in sync if draft changes external/mode initialization
  useEffect(() => {
    const isL = draft.toLowerCase().includes("week");
    setMode(isL ? "link" : "custom");
  }, [isEditing, draft]);

  // --- CALENDAR REQUISITES ---
  const [currentDate, setCurrentDate] = useState(() => {
    if (!isSyncedVal && draft) {
      const parsed = new Date(draft);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return new Date(2026, 5, 13); // Default June 13, 2026
  });

  const parsedYear = currentDate.getFullYear();
  const parsedMonth = currentDate.getMonth();

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
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(parsedYear, parsedMonth);
  const firstDayIndex = getFirstDayOfMonth(parsedYear, parsedMonth);

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
    setDraft(formattedDate);
  };

  // --- LINKED DATES REQUISITES ---
  const getBaseDateDayOfWeek = () => {
    if (!baseDate) return 0;
    const d = new Date(baseDate);
    if (isNaN(d.getTime())) return 0;
    return d.getDay();
  };

  const baseDayOfWeek = getBaseDateDayOfWeek();

  const getResolvedCampaignDate = (weekNum: number, dayIdx: number) => {
    const d = new Date(baseDate);
    if (isNaN(d.getTime())) return null;
    const dayOfWeek = d.getDay();
    
    const startSunday = new Date(d);
    startSunday.setDate(d.getDate() - dayOfWeek);
    
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
        const isWeekend = wd.dayIdx === 5 || wd.dayIdx === 6;
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

  const parseLinkedValue = (str: string) => {
    const regex = /week\s*(\d+)\s*-\s*day\s*(\d+)/i;
    const match = str.match(regex);
    if (match) {
      return {
        week: parseInt(match[1], 10),
        day: parseInt(match[2], 10),
      };
    }
    return { week: 1, day: 1 };
  };

  const linked = parseLinkedValue(draft);
  const [selectedWeek, setSelectedWeek] = useState<number>(linked.week);
  const [selectedDay, setSelectedDay] = useState<number>(linked.day);

  // Sync state if draft changes
  useEffect(() => {
    if (isSyncedVal) {
      const parsed = parseLinkedValue(draft);
      setSelectedWeek(parsed.week);
      setSelectedDay(parsed.day);
    }
  }, [draft, isSyncedVal]);

  const [activeWeeks, setActiveWeeks] = useState<number[]>(() => {
    if (currentVersion?.weeks && currentVersion.weeks.length > 0) {
      return currentVersion.weeks.map((w: any) => w.weekNumber).sort((a: number, b: number) => a - b);
    }
    return [1];
  });

  const handleAddWeek = () => {
    const nextWeek = activeWeeks.length > 0 ? Math.max(...activeWeeks) + 1 : 1;
    const updated = [...activeWeeks, nextWeek].sort((a, b) => a - b);
    setActiveWeeks(updated);

    if (currentVersion) {
      currentVersion.weeks = updated.map((num) => ({
        id: `wk-${num}-${currentVersion.id}`,
        weekNumber: num,
      }));
    }
  };

  const handleDeleteWeek = (weekNumToDelete: number) => {
    if (weekNumToDelete === 1) return;
    const updated = activeWeeks.filter((num) => num !== weekNumToDelete);
    setActiveWeeks(updated);

    if (currentVersion) {
      currentVersion.weeks = updated.map((num) => ({
        id: `wk-${num}-${currentVersion.id}`,
        weekNumber: num,
      }));
    }

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
      setDraft(`Week 1 - Day ${dayToSet}`);
    }
  };

  const handleLinkedSelect = (weekNum: number, dayNum: number) => {
    setSelectedWeek(weekNum);
    setSelectedDay(dayNum);
    setDraft(`Week ${weekNum} - Day ${dayNum}`);
  };

  const handleModeChange = (newMode: "custom" | "link") => {
    setMode(newMode);
    if (newMode === "custom") {
      const formattedMonth = String(parsedMonth + 1).padStart(2, "0");
      const formattedDay = String(currentDate.getDate()).padStart(2, "0");
      const formattedDate = `${parsedYear}-${formattedMonth}-${formattedDay}`;
      setDraft(formattedDate);
    } else {
      let dayToSet = selectedDay;
      if (selectedWeek === 1) {
        const weekDays = getWeekDaysForWeek(1);
        const exists = weekDays.some(wd => wd.dayNum === dayToSet && wd.isEnabled);
        if (!exists) {
          const firstEnabled = weekDays.find(wd => wd.isEnabled);
          if (firstEnabled && firstEnabled.dayNum !== null) {
            dayToSet = firstEnabled.dayNum;
          }
        }
      }
      setSelectedDay(dayToSet);
      setDraft(`Week ${selectedWeek} - Day ${dayToSet}`);
    }
  };

  const gilroyStyle = { fontFamily: "Gilroy, -apple-system, BlinkMacSystemFont, sans-serif" };

  return (
    <div className="flex-1 flex flex-col justify-between min-h-0 w-full" style={gilroyStyle}>
      <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2 shrink-0">
        <Calendar className="w-4 h-4 text-[#75E2FF] shrink-0" />
        <span className="text-[10px] font-extrabold tracking-[0.15em] uppercase opacity-45">
          Communication Date Specs
        </span>
      </div>

      {isEditing ? (
        <div className="flex-1 flex flex-col gap-2.5 pt-2.5 min-h-0 w-full no-close-on-click" style={gilroyStyle}>
          {mode === "custom" ? (
            <div className="space-y-3.5 flex-1 flex flex-col min-h-0 justify-center">
              {/* Month Selector Header */}
              <div className="flex items-center justify-between shrink-0">
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

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold opacity-30 text-[9px] uppercase tracking-wider shrink-0">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 flex-1 min-h-0 overflow-y-auto">
                {calendarDays.map((day, idx) => {
                  if (day === null) return <div key={`empty-${idx}`} />;
                  
                  const isSelected = !isSyncedVal && draft && (
                    (() => {
                      const check = new Date(draft);
                      return check.getDate() === day && check.getMonth() === parsedMonth && check.getFullYear() === parsedYear;
                    })()
                  );

                  return (
                    <button
                      key={`day-${day}`}
                      type="button"
                      onClick={() => handleCustomDateSelect(day)}
                      className={`py-1 rounded-lg text-center font-mono font-bold transition-all duration-200 cursor-pointer text-xs ${
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
            /* Split Linked Week Layout */
            <div className="flex gap-3 h-[180px] min-h-[180px] pt-1 flex-1">
              {/* Weeks List */}
              <div className="w-[42%] flex flex-col border-r border-white/[0.05] pr-1.5 h-full">
                <span className="text-[8px] font-black tracking-wider uppercase opacity-30 block mb-1.5 ml-1 shrink-0">
                  Select Week
                </span>
                <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {activeWeeks.map((weekNum) => {
                    const isActive = weekNum === selectedWeek;
                    return (
                      <div key={`week-container-editor-${weekNum}`} className="flex items-center gap-1 group">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedWeek(weekNum);
                            if (weekNum === 1) {
                              const weekDays = getWeekDaysForWeek(1);
                              const match = weekDays.some(wd => wd.dayNum === selectedDay && wd.isEnabled);
                              if (!match) {
                                const firstEnabled = weekDays.find(wd => wd.isEnabled);
                                if (firstEnabled && firstEnabled.dayNum !== null) {
                                  setSelectedDay(firstEnabled.dayNum);
                                  setDraft(`Week ${weekNum} - Day ${firstEnabled.dayNum}`);
                                }
                              } else {
                                setDraft(`Week ${weekNum} - Day ${selectedDay}`);
                              }
                            } else {
                              setDraft(`Week ${weekNum} - Day ${selectedDay}`);
                            }
                          }}
                          className={`flex-1 py-1 px-2 rounded-lg text-left font-sans font-bold transition-all duration-200 cursor-pointer flex items-center justify-between text-xs ${
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

                  <button
                    type="button"
                    onClick={handleAddWeek}
                    className={`w-full py-1 px-2 rounded-lg font-sans font-bold text-[9px] uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 ${
                      isDark
                        ? "bg-white/5 hover:bg-white/10 text-neutral-350 hover:text-white border border-dashed border-white/10"
                        : "bg-black/5 hover:bg-black/10 text-neutral-600 hover:text-black border border-dashed border-black/10"
                    }`}
                  >
                    <Plus className="w-2.5 h-2.5 text-[#75E2FF]" />
                    <span>Add Week</span>
                  </button>
                </div>
              </div>

              {/* Weekday List */}
              <div className="flex-1 flex flex-col pl-1.5 h-full">
                <span className="text-[8px] font-black tracking-wider uppercase opacity-30 block mb-1.5 shrink-0">
                  Select Weekday
                </span>
                <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {getWeekDaysForWeek(selectedWeek).map((wd) => {
                    const isActive = selectedWeek === linked.week && wd.dayNum !== null && wd.dayNum === selectedDay && isSyncedVal;
                    const targetDate = getResolvedCampaignDate(selectedWeek, wd.dayIdx);
                    const formattedDateStr = formatCampaignDate(targetDate);

                    return (
                      <button
                        key={`editor-day-idx-${wd.dayIdx}`}
                        type="button"
                        disabled={!wd.isEnabled}
                        onClick={() => wd.dayNum !== null && handleLinkedSelect(selectedWeek, wd.dayNum)}
                        className={`w-full py-1 px-2 rounded-lg text-left text-xs font-sans font-semibold transition-all duration-200 cursor-pointer flex items-center justify-between ${
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
                            <span className="w-8 shrink-0" />
                          )}
                          <span className="truncate">{formattedDateStr || wd.name}</span>
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

          {/* Toggle and save button and Tip */}
          <div className="space-y-2 shrink-0">
            <DatePickerToggle mode={mode} onModeChange={handleModeChange} />
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider bg-[#75E2FF] hover:bg-[#5fc0db] text-neutral-900 transition-colors shrink-0 cursor-pointer shadow-md"
              style={gilroyStyle}
            >
              Save Comm Date
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between pt-2.5 min-h-0 w-full" style={gilroyStyle}>
          <div 
            className="overflow-y-auto max-h-[160px] pr-1 cursor-pointer hover:opacity-80 transition-all"
            onClick={() => {
              setDraft(value || "2026-06-12");
              setIsEditing(true);
            }}
          >
            {hasValue ? (
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg border ${isDark ? "bg-[#75E2FF]/10 border-[#75E2FF]/20 text-[#75E2FF]" : "bg-neutral-50 border-black/[0.05] text-[#42afcb]"}`}>
                  {isSyncedVal ? <Link2 className="w-4 h-4" /> : <CalendarDays className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-extrabold text-sm tracking-tight text-current">
                    {value}
                  </p>
                  {isSyncedVal && (
                    <p className="text-[10px] opacity-50 font-bold">
                      {(() => {
                        const parsed = parseLinkedValue(value);
                        const baseD = new Date(baseDate);
                        if (isNaN(baseD.getTime())) return "";
                        const baseDayOfWeek = baseD.getDay();
                        let dayIdx = 0;
                        if (parsed.week === 1) {
                          dayIdx = parsed.day - 1 + baseDayOfWeek;
                        } else {
                          dayIdx = parsed.day - 1;
                        }
                        const targetDate = getResolvedCampaignDate(parsed.week, dayIdx);
                        return formatCampaignDate(targetDate);
                      })()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="font-bold text-xs opacity-40 italic">No communication milestone date selected</p>
            )}
          </div>

          <div 
            className="pt-3 text-left text-[#75E2FF] hover:text-[#5fc0db] font-extrabold text-[10px] tracking-widest uppercase cursor-pointer border-t border-white/[0.04] shrink-0 mt-2 transition-colors"
            onClick={() => {
              setDraft(value || "2026-06-12");
              setIsEditing(true);
            }}
            style={gilroyStyle}
          >
            ● Click to edit date
          </div>
        </div>
      )}
    </div>
  );
}
