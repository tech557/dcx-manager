export interface DayCellConfig {
  dayIndex: number;
  label: string;
  dateString: string;
  isEnabled: boolean;
  isWeekend: boolean;
}

export function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatDateString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getSundayOfWeek(date: Date): Date {
  const sunday = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  sunday.setUTCDate(sunday.getUTCDate() - date.getUTCDay());
  return sunday;
}

export function getDateForWeekAndDay(week: number, dayIndex: number, anchorDateStr: string): string {
  const sunday = getSundayOfWeek(parseDateString(anchorDateStr));
  sunday.setUTCDate(sunday.getUTCDate() + (week - 1) * 7 + dayIndex);
  return formatDateString(sunday);
}

export function getDaysForWeek(week: number, anchorDateStr: string): DayCellConfig[] {
  const anchorDate = parseDateString(anchorDateStr);
  const labels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return labels.map((label, dayIndex) => {
    const isWeekend = dayIndex === 5 || dayIndex === 6;
    return {
      dayIndex,
      label,
      dateString: getDateForWeekAndDay(week, dayIndex, anchorDateStr),
      isEnabled: !isWeekend && (week > 1 || dayIndex >= anchorDate.getUTCDay()),
      isWeekend,
    };
  });
}

export function getDayIndexForOffset(week: number, day: number, anchorDateStr: string): number {
  if (week === 1) {
    return day - 1 + parseDateString(anchorDateStr).getUTCDay();
  }
  return day - 1;
}

export function formatFriendlyDate(dateStr: string, includeYear = false): string {
  const date = parseDateString(dateStr);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = includeYear ? ` ${date.getUTCFullYear()}` : '';
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]}${year} (${days[date.getUTCDay()]})`;
}

