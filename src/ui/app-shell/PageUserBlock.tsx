import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useTheme } from '@/hooks/useTheme';

export function PageUserBlock() {
  const setThemeMode = useAppStore((state) => state.setThemeMode);
  const { isDark } = useTheme();

  function handleToggleTheme() {
    setThemeMode(isDark ? 'light' : 'dark');
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={handleToggleTheme}
        type="button"
        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-surface-raised)]"
        aria-label="Toggle visual theme"
        title="Toggle visual theme"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <div
        className="w-8 h-8 rounded-full bg-[var(--theme-accent)] flex items-center justify-center text-xs font-black text-black/80 cursor-default select-none"
        title="MS (Admin)"
        aria-label="User: MS"
      >
        MS
      </div>
    </div>
  );
}
