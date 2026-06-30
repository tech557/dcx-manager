import type { Task } from '@/types/domain';
import type { TaskCardData } from '@/types/builder-node.types';

/**
 * Parses a YYYY-MM-DD date string safely to a UTC Date object at midnight to avoid local timezone offsets.
 */
export function parseDateString(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date();
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  return new Date(Date.UTC(year, month, day));
}

/**
 * Formats a Date object (using UTC getters to match the parsing) back to a YYYY-MM-DD string.
 */
export function formatDateString(date: Date): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Returns the Sunday UTC at midnight of the week containing the specified UTC date.
 */
export function getSundayOfWeek(d: Date): Date {
  const day = d.getUTCDay(); // 0 = Sunday, 1 = Monday, etc.
  const sunday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  sunday.setUTCDate(sunday.getUTCDate() - day);
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
export function getDaysForWeek(weekNumber: number, anchorDateStr: string): DayCellConfig[] {
  const anchorDate = parseDateString(anchorDateStr);
  const week1Sunday = getSundayOfWeek(anchorDate);
  const targetSunday = new Date(week1Sunday);

  // Offset by weeks
  targetSunday.setUTCDate(week1Sunday.getUTCDate() + (weekNumber - 1) * 7);

  const anchorDayOfWeek = anchorDate.getUTCDay(); // e.g., 3 for Wednesday
  const dayLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return Array.from({ length: 7 }, (_, dayIndex) => {
    const currentDayDate = new Date(targetSunday);
    currentDayDate.setUTCDate(targetSunday.getUTCDate() + dayIndex);
    const dateStr = formatDateString(currentDayDate);

    const isWeekend = dayIndex === 5 || dayIndex === 6; // Friday, Saturday are always disabled/weekends in this framework's requirements
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
 * Translates a task's date configuration to find which Week and Day index it maps to.
 */
export function mapTaskToTimeline(
  task: TaskCardData | Task,
  anchorDateStr: string,
): { week: number; day: number; isScheduled: boolean } {
  if (task.date && task.date.mode === 'linked') {
    const anchorDate = parseDateString(anchorDateStr);
    const baseDayOfWeek = anchorDate.getUTCDay();
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

  const targetFixedDate = task.date?.mode === 'fixed' ? task.date.date : undefined;

  if (!targetFixedDate || targetFixedDate.toLowerCase().includes('week')) {
    const anchorDate = parseDateString(anchorDateStr);
    return {
      week: 1,
      day: anchorDate.getUTCDay(),
      isScheduled: false,
    };
  }

  const anchorDate = parseDateString(anchorDateStr);
  const week1Sunday = getSundayOfWeek(anchorDate);
  const taskDate = parseDateString(targetFixedDate);

  const diffTime = taskDate.getTime() - week1Sunday.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      week: 1,
      day: anchorDate.getUTCDay(),
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
 * Calculates the exact ISO date string for a task based on targeted Week and Day index.
 */
export function getDateForWeekAndDay(weekNumber: number, dayIndex: number, anchorDateStr: string): string {
  const anchorDate = parseDateString(anchorDateStr);
  const week1Sunday = getSundayOfWeek(anchorDate);
  const targetDate = new Date(week1Sunday);
  targetDate.setUTCDate(week1Sunday.getUTCDate() + (weekNumber - 1) * 7 + dayIndex);
  return formatDateString(targetDate);
}
