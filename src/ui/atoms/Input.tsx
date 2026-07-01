import {
  forwardRef,
  type ChangeEventHandler,
  type ForwardedRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from 'react';
import { Lock } from 'lucide-react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  as?: 'input' | 'textarea';
  size?: 'sm' | 'lg' | 'inline';
  variant?: 'default' | 'ghost';
  label?: string;
  /** Supporting text rendered directly under the control, visually grouped with the field. */
  hint?: ReactNode;
  error?: string;
  /** Read-only, rule-enforced field. Shows a lock affordance and a distinct surface. */
  locked?: boolean;
  rows?: TextareaHTMLAttributes<HTMLTextAreaElement>['rows'];
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

/** Shared field-label style so labels across the builder read as one group. */
export const FIELD_LABEL_CLASS =
  'font-mono text-dcx-2xs font-semibold uppercase tracking-[0.12em] text-[var(--theme-text-muted)]';

/** Shared helper-text style, tightly connected to its control. */
export const FIELD_HINT_CLASS = 'font-mono text-dcx-3xs-plus leading-snug text-neutral-500';

export const INPUT_SIZE_CLASSES = {
  sm: 'h-7 px-2.5 py-1 text-dcx-sm',
  lg: 'min-h-9 px-3 py-2 text-dcx-sm',
  inline: 'h-auto p-0 text-inherit',
} as const;

export const INPUT_VARIANT_CLASSES = {
  default: [
    'border border-[var(--theme-border-subtle)] bg-white/[0.02]',
    'hover:border-white/15 hover:bg-white/[0.04]',
    // Filled: settle into a slightly brighter surface so a completed field reads as done.
    '[&:not(:placeholder-shown)]:border-white/12 [&:not(:placeholder-shown)]:bg-white/[0.035]',
    // Focus: accent border + soft ring, clearly the active field.
    'focus:border-[var(--theme-accent)]/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-[var(--theme-accent)]/15',
    // Disabled: dim and inert, no hover response.
    'disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:border-[var(--theme-border-subtle)] disabled:hover:bg-white/[0.02]',
  ].join(' '),
  ghost: 'border border-transparent bg-transparent focus:border-transparent',
} as const;

export function getInputClassName({
  size = 'sm',
  variant = 'default',
  className = '',
}: Pick<InputProps, 'size' | 'variant' | 'className'> = {}) {
  return `w-full rounded-lg text-[var(--theme-text-primary)] outline-none transition-all placeholder:text-[var(--theme-text-muted)] ${INPUT_SIZE_CLASSES[size]} ${INPUT_VARIANT_CLASSES[variant]} ${className}`;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(function Input(
  { as = 'input', size = 'sm', variant = 'default', label, hint, error, locked = false, className = '', id, rows, ...props },
  ref,
) {
  const lockedClass = locked
    ? 'border-amber-500/25 bg-amber-500/[0.03] text-amber-100/80 cursor-not-allowed hover:border-amber-500/25 hover:bg-amber-500/[0.03]'
    : '';
  const controlClassName = getInputClassName({ size, variant, className: `${lockedClass} ${className}`.trim() });
  const hintId = hint && id ? `${id}-hint` : undefined;
  const errorId = error && id ? `${id}-error` : undefined;
  const describedBy = [props['aria-describedby'], errorId, hintId].filter(Boolean).join(' ') || undefined;
  const invalid = error ? true : props['aria-invalid'];

  const input = as === 'textarea' ? (
    <textarea
      {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
      ref={ref as ForwardedRef<HTMLTextAreaElement>}
      id={id}
      rows={rows}
      disabled={locked || (props as TextareaHTMLAttributes<HTMLTextAreaElement>).disabled}
      className={controlClassName}
      aria-invalid={invalid}
      aria-describedby={describedBy}
    />
  ) : (
    <input
      {...(props as InputHTMLAttributes<HTMLInputElement>)}
      ref={ref as ForwardedRef<HTMLInputElement>}
      id={id}
      disabled={locked || (props as InputHTMLAttributes<HTMLInputElement>).disabled}
      className={controlClassName}
      aria-invalid={invalid}
      aria-describedby={describedBy}
    />
  );

  if (!label && !error && !hint) return input;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {(label || locked) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label htmlFor={id} className={FIELD_LABEL_CLASS}>
              {label}
            </label>
          )}
          {locked && (
            <span className="flex items-center gap-1 text-dcx-3xs font-mono uppercase tracking-wider text-amber-400/80" aria-hidden="true">
              <Lock className="h-2.5 w-2.5" />
              Locked
            </span>
          )}
        </div>
      )}
      {input}
      {hint && !error && (
        <p id={hintId} className={FIELD_HINT_CLASS}>
          {hint}
        </p>
      )}
      {error && (
        <span id={errorId} className="text-dcx-2xs text-[var(--theme-error)]">
          {error}
        </span>
      )}
    </div>
  );
});
