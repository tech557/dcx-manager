import type { CSSProperties, ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'status' | 'readiness' | 'lock';
  color?: string;
  size?: 'xs' | 'sm';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<BadgeProps['size']>, string> = {
  xs: 'px-1.5 py-0.5 text-dcx-3xs',
  sm: 'px-2.5 py-1 text-dcx-xs',
};

const VARIANT_CLASSES: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: '',
  status: '',
  readiness: '',
  lock: '',
};

export function Badge({ children, variant = 'default', color, size = 'sm', className = '' }: BadgeProps) {
  const style: CSSProperties | undefined = color
    ? {
        color,
        borderColor: `color-mix(in srgb, ${color} 30%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
      }
    : undefined;

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 rounded-full border font-mono font-black uppercase tracking-wider ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
