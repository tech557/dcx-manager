import { CalendarDays, Link2 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface DatePickerToggleProps {
  mode: 'custom' | 'link';
  onModeChange: (mode: 'custom' | 'link') => void;
  showLinkMode?: boolean;
}

export function DatePickerToggle({ mode, onModeChange, showLinkMode = true }: DatePickerToggleProps) {
  const { isDark } = useTheme();
  const surface = isDark ? 'border-white/10 bg-black/25' : 'border-black/10 bg-white/80';
  const inactive = isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-black';

  if (!showLinkMode) {
    return (
      <div className={`flex rounded-xl p-1 border ${surface}`}>
        <div className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-dcx-2xs font-black uppercase bg-[var(--theme-accent)]/20 text-[var(--theme-accent)]">
          <CalendarDays className="w-3.5 h-3.5" />
          Date Selection Only
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 gap-1 rounded-xl p-1 border ${surface}`}>
      {([
        ['custom', CalendarDays, 'Date'],
        ['link', Link2, 'Link'],
      ] as const).map(([value, Icon, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => onModeChange(value)}
          className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-dcx-2xs font-black uppercase ${
            mode === value ? 'bg-[var(--theme-accent)]/20 text-[var(--theme-accent)]' : inactive
          }`}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}

