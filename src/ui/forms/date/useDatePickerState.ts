import { useState } from 'react';
import type { ApiTaskDate } from '@/types/api';
import { formatDateString, parseDateString } from './date.utils';

type DatePickerMode = 'custom' | 'link';

interface UseDatePickerStateOptions {
  value: ApiTaskDate;
  anchorDateStr: string;
  showLinkMode: boolean;
  onChange: (value: ApiTaskDate) => void;
}

export function useDatePickerState({
  value,
  anchorDateStr,
  showLinkMode,
  onChange,
}: UseDatePickerStateOptions) {
  const [mode, setMode] = useState<DatePickerMode>(
    showLinkMode && value.mode === 'linked' ? 'link' : 'custom',
  );
  const [currentDate, setCurrentDate] = useState(() =>
    value.mode === 'fixed' ? parseDateString(value.date) : parseDateString(anchorDateStr),
  );
  const [selectedWeek, setSelectedWeek] = useState(value.mode === 'linked' ? value.weekOffset : 1);
  const [totalWeeks, setTotalWeeks] = useState(Math.max(4, selectedWeek));

  const handleModeChange = (nextMode: DatePickerMode) => {
    setMode(nextMode);
    onChange(
      nextMode === 'custom'
        ? { mode: 'fixed', date: formatDateString(currentDate) }
        : { mode: 'linked', weekOffset: selectedWeek, dayOffset: 1 },
    );
  };

  return {
    mode,
    currentDate,
    selectedWeek,
    totalWeeks,
    setCurrentDate,
    setSelectedWeek,
    setTotalWeeks,
    handleModeChange,
  };
}
