import { TaskDate } from "../types/domain";

/**
 * Safely parses a YYYY-MM-DD date string to a local Date object set at midnight.
 */
export function parseDateString(dateStr: string | undefined): Date {
  if (!dateStr) return new Date();
  const parts = dateStr.split("-");
  if (parts.length !== 3) return new Date();
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(year, month, day, 0, 0, 0, 0);
}

/**
 * Formats a Date object back to a YYYY-MM-DD string.
 */
export function formatDateString(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Returns the Sunday at midnight of the week containing the specified date.
 */
export function getSundayOfWeek(d: Date): Date {
  const day = d.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const sunday = new Date(d);
  sunday.setDate(d.getDate() - day);
  // Normalize time to midnight to avoid DST or timezone shift edge cases
  sunday.setHours(0, 0, 0, 0);
  return sunday;
}

export interface DayCellConfig {
  dayIndex: number; // 0 (Sunday) to 6 (Saturday)
  label: string;
  dateString: string;
  isEnabled: boolean;
  isWeekend: boolean;
  isAnchorDay: boolean;
}

/**
 * Computes individual daily grids for a targeted 1-indexed week offset.
 */
export function getDaysForWeek(
  weekNumber: number,
  anchorDateStr: string
): DayCellConfig[] {
  const anchorDate = parseDateString(anchorDateStr);
  const week1Sunday = getSundayOfWeek(anchorDate);
  const targetSunday = new Date(week1Sunday);
  
  // Offset Sunday matching the targeted week
  targetSunday.setDate(week1Sunday.getDate() + (weekNumber - 1) * 7);

  const anchorDayOfWeek = anchorDate.getDay();
  const dayLabels = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return Array.from({ length: 7 }, (_, dayIndex) => {
    const currentDayDate = new Date(targetSunday);
    currentDayDate.setDate(targetSunday.getDate() + dayIndex);
    const dateStr = formatDateString(currentDayDate);

    const isWeekend = dayIndex === 5 || dayIndex === 6; // Friday, Saturday are weekend days
    const isAnchorDay = weekNumber === 1 && dayIndex === anchorDayOfWeek;

    let isEnabled = !isWeekend;
    if (weekNumber === 1) {
      if (dayIndex < anchorDayOfWeek) {
        isEnabled = false;
      }
    }

    return {
      dayIndex,
      label: dayLabels[dayIndex],
      dateString: dateStr,
      isEnabled,
      isWeekend,
      isAnchorDay,
    };
  });
}

/**
 * Resolves a clean TaskDate struct relative to the campaign anchor start date.
 */
export function resolveTaskDate(date: TaskDate, versionStart: string): string {
  if (date.mode === "unset") {
    return "";
  }
  if (date.mode === "fixed") {
    return date.date;
  }
  if (date.mode === "linked") {
    const anchorDate = parseDateString(versionStart);
    const baseDayOfWeek = anchorDate.getDay();
    const week1Sunday = getSundayOfWeek(anchorDate);
    
    const targetDate = new Date(week1Sunday);
    let dayIdx = 0;
    if (date.weekOffset === 1) {
      dayIdx = date.dayOffset - 1 + baseDayOfWeek;
    } else {
      dayIdx = date.dayOffset - 1;
    }
    
    targetDate.setDate(week1Sunday.getDate() + (date.weekOffset - 1) * 7 + dayIdx);
    return formatDateString(targetDate);
  }
  return "";
}

/**
 * Safe, polymorphic translator of physical task coordinates on the weekly grid,
 * accepting unified domain-oriented Task shapes.
 */
export function mapTaskToTimeline(
  task: { date?: TaskDate },
  anchorDateStr: string
): { week: number; day: number; isScheduled: boolean } {
  const tDate = task.date || { mode: "unset" };

  if (tDate.mode === "linked") {
    const anchorDate = parseDateString(anchorDateStr);
    const baseDayOfWeek = anchorDate.getDay();
    let day = 0;
    if (tDate.weekOffset === 1) {
      day = tDate.dayOffset - 1 + baseDayOfWeek;
    } else {
      day = tDate.dayOffset - 1;
    }
    return {
      week: tDate.weekOffset,
      day,
      isScheduled: true,
    };
  }

  const communicationDate = tDate.mode === "fixed" ? tDate.date : undefined;

  // Handle unset / unassigned / fixed date parsing
  if (!communicationDate || communicationDate.toLowerCase().includes("week")) {
    const anchorDate = parseDateString(anchorDateStr);
    return {
      week: 1,
      day: anchorDate.getDay(),
      isScheduled: false,
    };
  }

  const anchorDate = parseDateString(anchorDateStr);
  const week1Sunday = getSundayOfWeek(anchorDate);
  const taskDate = parseDateString(communicationDate);

  const diffTime = taskDate.getTime() - week1Sunday.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      week: 1,
      day: anchorDate.getDay(),
      isScheduled: false,
    };
  }

  const week = Math.floor(diffDays / 7) + 1;
  const day = diffDays % 7;

  return {
    week,
    day,
    isScheduled: true,
  };
}

/**
 * Calculates targeted timeline offset dates.
 */
export function getDateForWeekAndDay(
  weekNumber: number,
  dayIndex: number,
  anchorDateStr: string
): string {
  const anchorDate = parseDateString(anchorDateStr);
  const week1Sunday = getSundayOfWeek(anchorDate);
  const targetDate = new Date(week1Sunday);
  targetDate.setDate(week1Sunday.getDate() + (weekNumber - 1) * 7 + dayIndex);
  return formatDateString(targetDate);
}

/**
 * Automatically calculates targeted ending dates.
 */
export function calculateEndDate(startDateStr: string, taskCount: number): string {
  if (!startDateStr) return "";
  try {
    const d = new Date(startDateStr);
    if (isNaN(d.getTime())) return startDateStr;
    d.setDate(d.getDate() + Math.max(0, taskCount));
    return formatDateString(d);
  } catch {
    return startDateStr;
  }
}
