import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  label?: string;
  icon?: ReactNode;
  variant?: 'default' | 'accent' | 'ghost';
  size?: 'sm' | 'md';
  isActive?: boolean;
  isDisabled?: boolean;
  draggable?: boolean;
  activeIcon?: ReactNode;
  className?: string;
  ariaLabel?: string;
  as?: 'button' | 'span';
}

const SIZE_CLASSES = {
  sm: 'h-7 px-2 text-dcx-2xs',
  md: 'h-8 px-3 text-dcx-xs',
} as const;

const VARIANT_CLASSES = {
  default: 'border-[var(--theme-border-subtle)] bg-black/20 text-[var(--theme-text-primary)] hover:bg-white/10',
  accent: 'border-[var(--theme-accent)]/30 bg-[var(--theme-accent)]/10 text-[var(--theme-accent)] hover:bg-[var(--theme-accent)]/20',
  ghost: 'border-transparent bg-transparent text-[var(--theme-text-muted)] hover:border-[var(--theme-border-subtle)] hover:text-[var(--theme-text-primary)]',
} as const;

export function Chip({
  label,
  icon,
  variant = 'default',
  size = 'md',
  isActive = false,
  isDisabled = false,
  draggable = false,
  activeIcon,
  onClick,
  className = '',
  id,
  title,
  ariaLabel,
  as = 'button',
  ...buttonProps
}: ChipProps) {
  const classes = `inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border font-semibold uppercase tracking-wider backdrop-blur-md transition-all ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${
    isActive ? 'ring-1 ring-[var(--theme-accent)]/30 shadow-[0_0_14px_var(--theme-selected-glow)]' : ''
  } ${isDisabled ? 'cursor-not-allowed opacity-35' : as === 'button' ? 'cursor-pointer' : ''} ${className}`;
  const content = (
    <>
      {isActive && activeIcon ? activeIcon : icon}
      {label && <span className="leading-none">{label}</span>}
    </>
  );

  if (as === 'span') {
    return (
      <span id={id} title={title} className={classes}>
        {content}
      </span>
    );
  }

  return (
    <button
      {...buttonProps}
      type={buttonProps.type ?? 'button'}
      id={id}
      title={title}
      aria-label={ariaLabel ?? title ?? label}
      disabled={isDisabled}
      draggable={draggable && !isDisabled}
      onClick={onClick}
      className={classes}
    >
      {content}
    </button>
  );
}
