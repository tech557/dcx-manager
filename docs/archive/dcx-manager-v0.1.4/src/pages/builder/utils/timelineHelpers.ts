import { TaskCardData } from "../../../types";

/**
 * Parses a YYYY-MM-DD date string safely to a Date object at midnight local time.
 */
export function parseDateString(dateStr: string): Date {
  const parts = dateStr.split("-");
  if (parts.length !== 3) return new Date();
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
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
  // Normalize time to avoid timezone edge cases
  sunday.setHours(0, 0, 0, 0);
  return sunday;
}

/**
 * Interface mapping layout info for a single day block.
 */
export interface DayCellConfig {
  dayIndex: number; // 0 (Sunday) to 6 (Saturday)
  label: string; // "Sunday", "Monday", etc.
  dateString: string; // "2026-03-08"
  isEnabled: boolean; // false if before mid-week start in Week 1, or is weekend
  isWeekend: boolean; // Friday / Saturday are weekends
  isAnchorDay: boolean; // true if matches communicatedDate
}

/**
 * Computes the details for all days in a specific target week (1-indexed).
 */
export function getDaysForWeek(
  weekNumber: number,
  anchorDateStr: string
): DayCellConfig[] {
  const anchorDate = parseDateString(anchorDateStr);
  const week1Sunday = getSundayOfWeek(anchorDate);
  const targetSunday = new Date(week1Sunday);
  
  // Offset by weeks
  targetSunday.setDate(week1Sunday.getDate() + (weekNumber - 1) * 7);

  const anchorDayOfWeek = anchorDate.getDay(); // e.g., 3 for Wednesday
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

    const isWeekend = dayIndex === 5 || dayIndex === 6; // Friday, Saturday are always disabled
    const isAnchorDay = weekNumber === 1 && dayIndex === anchorDayOfWeek;

    let isEnabled = !isWeekend;
    if (weekNumber === 1) {
      // For week 1, any day before the anchor day is disabled
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
 * Translates a task's communicationDate or link parameters to find which Week and Day spacing it maps to.
 */
export function mapTaskToTimeline(
  task: TaskCardData,
  anchorDateStr: string
): { week: number; day: number; isScheduled: boolean } {
  // Respect explicit overrides first
  if (task.date && task.date.mode === "linked") {
    const anchorDate = parseDateString(anchorDateStr);
    const baseDayOfWeek = anchorDate.getDay();
    let day = 0;
    if (task.date.weekOffset === 1) {
      day = task.date.dayOffset - 1 + baseDayOfWeek;
    } else {
      day = task.date.dayOffset - 1;
    }
    return {
      week: task.date.weekOffset,
      day,
      isScheduled: true,
    };
  }

  const targetFixedDate = task.date?.mode === "fixed" ? task.date.date : undefined;

  if (!targetFixedDate || targetFixedDate.toLowerCase().includes("week")) {
    // Return unassigned fallback or default to Week 1 Anchor day
    const anchorDate = parseDateString(anchorDateStr);
    return {
      week: 1,
      day: anchorDate.getDay(),
      isScheduled: false,
    };
  }

  const anchorDate = parseDateString(anchorDateStr);
  const week1Sunday = getSundayOfWeek(anchorDate);
  const taskDate = parseDateString(targetFixedDate);

  const diffTime = taskDate.getTime() - week1Sunday.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    // Before start of Week 1 Sunday
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
 * Calculates the exact communicationDate for a task based on targeted Week and Day index.
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
