export interface AvatarGroupItem {
  id: string;
  /** Short initials shown inside the avatar (e.g. "MS"). */
  initials: string;
  /** Native tooltip / accessible label. */
  title?: string;
}

export interface AvatarGroupProps {
  items: AvatarGroupItem[];
  /** Maximum avatars to render before collapsing the rest into a "+N" chip. */
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-5 w-5 text-dcx-4xs',
  md: 'h-6 w-6 text-dcx-3xs',
} as const;

/**
 * Compact, overlapping avatar cluster with a "+N" overflow chip. Presentational and
 * domain-agnostic — callers pass pre-computed initials. Colours/borders come from theme
 * tokens so it stays consistent with the glass surfaces it sits on.
 */
export function AvatarGroup({ items, max = 3, size = 'sm', className = '' }: AvatarGroupProps) {
  if (items.length === 0) return null;

  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;
  const sizeClass = SIZE_CLASSES[size];
  const ringClass = 'ring-2 ring-[var(--theme-surface-raised)]';

  return (
    <div className={`flex -space-x-1.5 ${className}`}>
      {visible.map((item) => (
        <span
          key={item.id}
          title={item.title}
          className={`${sizeClass} ${ringClass} inline-flex items-center justify-center rounded-full border border-[var(--theme-border)] bg-[var(--theme-accent)]/15 font-bold text-[var(--theme-accent)]`}
        >
          {item.initials}
        </span>
      ))}
      {overflow > 0 && (
        <span
          title={`${overflow} more`}
          className={`${sizeClass} ${ringClass} inline-flex items-center justify-center rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface-raised-hover)] font-bold text-[var(--theme-text-secondary)]`}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
