import { useCallback, useState } from 'react';

export function useWeekState() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [totalWeeks, setTotalWeeks] = useState(4);

  const prevWeek = useCallback(() => {
    setActiveWeek((week) => Math.max(1, week - 1));
  }, []);

  const nextWeek = useCallback(() => {
    setActiveWeek((week) => Math.min(totalWeeks, week + 1));
  }, [totalWeeks]);

  return {
    activeWeek,
    setActiveWeek,
    prevWeek,
    nextWeek,
    totalWeeks,
    setTotalWeeks,
  };
}
