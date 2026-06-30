import {
  forwardRef,
  type ChangeEventHandler,
  type ForwardedRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
  as?: 'input' | 'textarea';
  size?: 'sm' | 'lg' | 'inline';
  variant?: 'default' | 'ghost';
  label?: string;
  error?: string;
  rows?: TextareaHTMLAttributes<HTMLTextAreaElement>['rows'];
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export const INPUT_SIZE_CLASSES = {
  sm: 'h-7 px-2 py-1 text-dcx-sm',
  lg: 'min-h-9 px-2.5 py-1.5 text-dcx-sm',
  inline: 'h-auto p-0 text-inherit',
} as const;

export const INPUT_VARIANT_CLASSES = {
  default: 'border border-[var(--theme-border-subtle)] bg-black/20 hover:border-white/20 focus:border-[var(--theme-accent)]/50',
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
  { as = 'input', size = 'sm', variant = 'default', label, error, className = '', id, rows, ...props },
  ref,
) {
  const controlClassName = getInputClassName({ size, variant, className });
  const describedBy = error && id ? `${id}-error` : props['aria-describedby'];
  const invalid = error ? true : props['aria-invalid'];

  const input = as === 'textarea' ? (
    <textarea
      {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
      ref={ref as ForwardedRef<HTMLTextAreaElement>}
      id={id}
      rows={rows}
      className={controlClassName}
      aria-invalid={invalid}
      aria-describedby={describedBy}
    />
  ) : (
    <input
      {...(props as InputHTMLAttributes<HTMLInputElement>)}
      ref={ref as ForwardedRef<HTMLInputElement>}
      id={id}
      className={controlClassName}
      aria-invalid={invalid}
      aria-describedby={describedBy}
    />
  );

  if (!label && !error) return input;

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label htmlFor={id} className="font-mono text-dcx-2xs font-bold uppercase tracking-wider text-[var(--theme-text-muted)]">
          {label}
        </label>
      )}
      {input}
      {error && (
        <span id={id ? `${id}-error` : undefined} className="text-dcx-2xs text-[var(--theme-error)]">
          {error}
        </span>
      )}
    </div>
  );
});
