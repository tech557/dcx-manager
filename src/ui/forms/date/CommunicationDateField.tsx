import { useRef, useState, type MouseEvent, type TouchEvent } from 'react';
import { CalendarDays, HelpCircle, Link2 } from 'lucide-react';
import type { ApiTaskDate } from '@/types/api';
import { useTheme } from '@/hooks/useTheme';
import { DatePickerPopup } from './DatePickerPopup';
import { formatFriendlyDate, getDateForWeekAndDay, getDayIndexForOffset } from './date.utils';
import { useToggle } from '@/hooks/useToggle';
import { FIELD_HINT_CLASS, FIELD_LABEL_CLASS } from '@/ui/atoms/Input';

interface CommunicationDateFieldProps {
  value: ApiTaskDate;
  onChange: (value: ApiTaskDate) => void;
  anchorDateStr: string;
  label?: string;
  showLinkMode?: boolean;
  disabled?: boolean;
  triggerStyle?: 'default' | 'minimalist';
}

export function CommunicationDateField({
  value,
  onChange,
  anchorDateStr,
  label = 'Communication Date',
  showLinkMode = true,
  disabled = false,
  triggerStyle = 'default',
}: CommunicationDateFieldProps) {
  const { isDark } = useTheme();
  const [isOpen, toggleOpen, , closeOpen] = useToggle();
  const [isPressing, setIsPressing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressedRef = useRef(false);

  const displayValue = value.mode === 'unset'
    ? 'To Be Decided'
    : value.mode === 'fixed'
      ? formatFriendlyDate(value.date, true)
      : `Week ${value.weekOffset} - Day ${value.dayOffset} (${formatFriendlyDate(
          getDateForWeekAndDay(
            value.weekOffset,
            getDayIndexForOffset(value.weekOffset, value.dayOffset, anchorDateStr),
            anchorDateStr,
          ),
        )})`;

  const startPress = (event: MouseEvent | TouchEvent) => {
    if (disabled || ('button' in event && event.button !== 0)) return;
    longPressedRef.current = false;
    if (value.mode !== 'linked') return;
    setIsPressing(true);
    timeoutRef.current = setTimeout(() => {
      longPressedRef.current = true;
      setIsPressing(false);
      const dayIndex = getDayIndexForOffset(value.weekOffset, value.dayOffset, anchorDateStr);
      onChange({ mode: 'fixed', date: getDateForWeekAndDay(value.weekOffset, dayIndex, anchorDateStr) });
    }, 600);
  };

  const cancelPress = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setIsPressing(false);
  };

  const endPress = () => {
    cancelPress();
    if (!disabled && !longPressedRef.current) toggleOpen();
  };

  const icon = value.mode === 'linked'
    ? <Link2 className="w-3.5 h-3.5 text-[var(--theme-accent)] shrink-0" />
    : value.mode === 'fixed'
      ? <CalendarDays className="w-3.5 h-3.5 text-[var(--theme-accent)]/80 shrink-0" />
      : <HelpCircle className="w-3.5 h-3.5 text-neutral-400/50 shrink-0" />;

  const trigger = (
    <button
      type="button"
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      onTouchCancel={cancelPress}
      disabled={disabled}
      className={triggerStyle === 'minimalist'
        ? 'flex items-center gap-1.5 text-left hover:text-[var(--theme-accent)] disabled:opacity-50'
        : `relative overflow-hidden w-full px-3 py-2.5 rounded-xl text-left text-dcx-sm font-mono border font-bold flex items-center justify-between transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
            isDark
              ? 'bg-white/[0.02] border-[var(--theme-border-subtle)] text-neutral-200 enabled:hover:border-white/15 enabled:hover:bg-white/[0.04]'
              : 'bg-neutral-100 border-black/5 text-neutral-700 enabled:hover:border-black/15'
          } ${isOpen ? 'ring-2 ring-[var(--theme-accent)]/15 border-[var(--theme-accent)]/50 bg-white/[0.05]' : ''}`}
    >
      <span className="truncate">{displayValue}</span>
      {icon}
      {triggerStyle === 'default' && (
        <span className="absolute bottom-0 left-0 h-1 bg-[var(--theme-accent)]/80" style={{ width: isPressing ? '100%' : '0%' }} />
      )}
    </button>
  );

  return (
    <div id="editor-field-comm-date" className="relative flex select-none flex-col gap-1.5 text-left">
      {label && <label className={FIELD_LABEL_CLASS}>{label}</label>}
      {trigger}
      {value.mode === 'linked' && triggerStyle === 'default' && (
        <p className={FIELD_HINT_CLASS}>Hold to detach relative date</p>
      )}
      {isOpen && (
        <DatePickerPopup
          value={value}
          onChange={onChange}
          onClose={closeOpen}
          anchorDateStr={anchorDateStr}
          showLinkMode={showLinkMode}
        />
      )}
    </div>
  );
}
