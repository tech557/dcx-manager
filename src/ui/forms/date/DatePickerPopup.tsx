import { useEffect, useRef } from 'react';
import type { ApiTaskDate } from '@/types/api';
import { useTheme } from '@/hooks/useTheme';
import { PopoverShell } from '@/ui/PopoverShell';
import { EffectLayer } from '@/ui/motion/EffectLayer';
import { CalendarGrid } from './CalendarGrid';
import { DatePickerToggle } from './DatePickerToggle';
import { LinkedDateGrid } from './LinkedDateGrid';
import { useDatePickerState } from './useDatePickerState';

interface DatePickerPopupProps {
  value: ApiTaskDate;
  onChange: (value: ApiTaskDate) => void;
  onClose: () => void;
  anchorDateStr: string;
  showLinkMode?: boolean;
}

export function DatePickerPopup({
  value,
  onChange,
  onClose,
  anchorDateStr,
  showLinkMode = true,
}: DatePickerPopupProps) {
  const { isDark } = useTheme();
  const popupRef = useRef<HTMLDivElement>(null);
  const pickerState = useDatePickerState({
    value,
    anchorDateStr,
    showLinkMode,
    onChange,
  });

  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) onClose();
    };
    document.addEventListener('mousedown', closeOutside);
    return () => document.removeEventListener('mousedown', closeOutside);
  }, [onClose]);

  return (
    <div
      ref={popupRef}
      className="absolute left-0 mt-1.5 z-[999] font-sansCode text-xs select-none"
      onClick={(event) => event.stopPropagation()}
      id="date-picker-popup-dropdown"
    >
      <EffectLayer effect="expandCollapse" active>
        <PopoverShell width="w-[310px]" className="p-3">
          {pickerState.mode === 'custom' ? (
            <CalendarGrid
              currentDate={pickerState.currentDate}
              isDark={isDark}
              value={value}
              anchorDateStr={anchorDateStr}
              onCurrentDateChange={pickerState.setCurrentDate}
              onSelect={(date) => {
                onChange({ mode: 'fixed', date });
                onClose();
              }}
            />
          ) : (
            <LinkedDateGrid
              value={value}
              anchorDateStr={anchorDateStr}
              selectedWeek={pickerState.selectedWeek}
              totalWeeks={pickerState.totalWeeks}
              isDark={isDark}
              onWeekChange={pickerState.setSelectedWeek}
              onTotalWeeksChange={pickerState.setTotalWeeks}
              onSelect={(week, day) => {
                onChange({ mode: 'linked', weekOffset: week, dayOffset: day });
                onClose();
              }}
            />
          )}
          <div className={`my-2 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`} />
          <DatePickerToggle
            mode={pickerState.mode}
            onModeChange={pickerState.handleModeChange}
            showLinkMode={showLinkMode}
          />
        </PopoverShell>
      </EffectLayer>
    </div>
  );
}
