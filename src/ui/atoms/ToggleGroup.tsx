import type { ReactNode } from 'react';

export interface ToggleGroupItem<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

export interface ToggleGroupProps<T extends string> {
  items: Array<ToggleGroupItem<T>>;
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
  ariaLabel?: string;
}

const SIZE_CLASSES = {
  sm: 'h-7 min-w-7 px-2 text-dcx-2xs',
  md: 'h-8 min-w-8 px-2.5 text-dcx-xs',
} as const;

export function ToggleGroup<T extends string>({
  items,
  value,
  onChange,
  size = 'sm',
  className = '',
  ariaLabel = 'Choose option',
}: ToggleGroupProps<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className={`inline-flex items-center gap-1 rounded-full bg-black/20 p-1 ${className}`}>
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            aria-pressed={isActive}
            title={item.label}
            className={`inline-flex items-center justify-center gap-1 rounded-full font-semibold transition-all ${SIZE_CLASSES[size]} ${
              isActive
                ? 'bg-[var(--theme-accent)] text-black shadow-md'
                : 'text-[var(--theme-text-muted)] hover:bg-white/5 hover:text-[var(--theme-text-primary)]'
            }`}
          >
            {item.icon}
            <span className="sr-only">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
