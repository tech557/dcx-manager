export type ThemeMode = 'light' | 'dark';

export const colorTokens = {
  accent: 'var(--theme-accent)',
  accentVariant: 'var(--theme-accent-variant)',
  accentDeep: 'var(--theme-accent-deep)',
  accentScale: {
    subtle: 'var(--theme-accent-subtle)',
    soft: 'var(--theme-accent-soft)',
    selectedGlow: 'var(--theme-selected-glow)',
    bg: 'var(--theme-accent-bg)',
    medium: 'var(--theme-accent-medium)',
    strong: 'var(--theme-accent-strong)',
  },
  status: {
    error: 'var(--theme-error)',
    errorAlt: 'var(--theme-error-alt)',
    errorBg: 'var(--theme-error-bg)',
    errorDeepBg: 'var(--theme-error-deep-bg)',
    errorBgAlt: 'var(--theme-error-bg-alt)',
    warning: 'var(--theme-warning)',
    warningBg: 'var(--theme-warning-bg)',
    warningGlow: 'var(--theme-warning-glow)',
    success: 'var(--theme-success)',
    successBg: 'var(--theme-success-bg)',
    successGlow: 'var(--theme-success-glow)',
  },
  info: 'var(--theme-info)',
  infoBg: 'var(--theme-info-bg)',
  surface: {
    deepBg: 'var(--theme-surface-deep)',
    void: 'var(--theme-surface-void)',
    deepAlt: 'var(--theme-surface-deep-alt)',
    dark: 'var(--theme-surface-dark)',
    dropdown: 'var(--theme-dropdown-bg)',
    alternate: 'var(--theme-surface-alternate)',
  },
  dark: {
    base: '#0D0D0E',
    raised: '#151516',
    text: '#F7F7F8',
    mutedText: 'rgba(247,247,248,0.72)',
    borderSubtle: 'rgba(255,255,255,0.08)',
    borderHairline: 'rgba(255,255,255,0.04)',
    glass: 'rgba(0,0,0,0.2)',
    pill: 'rgba(255,255,255,0.05)',
    selectedGlow: 'var(--theme-selected-glow)',
  },
  light: {
    base: '#FFFFFF',
    raised: '#F7F7F8',
    text: '#151516',
    mutedText: 'rgba(21,21,22,0.68)',
    borderSubtle: 'rgba(21,21,22,0.1)',
    borderHairline: 'rgba(0,0,0,0.07)',
    glass: 'rgba(255,255,255,0.75)',
    pill: 'rgba(0,0,0,0.04)',
    selectedGlow: 'var(--theme-selected-glow)',
  },
} as const;

export const blurTokens = {
  heavy: 'backdrop-blur-3xl',
  mid: 'backdrop-blur-xl',
  light: 'backdrop-blur-md',
} as const;

export const shadowStyleTokens = {
  island: '0 12px 40px rgba(0,0,0,0.2)',
  card: '0 8px 32px rgba(0,0,0,0.3)',
  overlay: '0 20px 50px rgba(0,0,0,0.3)',
  glow: '0 0 15px var(--theme-selected-glow)',
} as const;

export const springTokens = {
  island: { type: 'spring', stiffness: 180, damping: 24, mass: 0.95 },
  card: { type: 'spring', stiffness: 200, damping: 20 },
  gentle: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
} as const;

export const brandTokens = {
  color: colorTokens,
  blur: blurTokens,
  shadowStyle: shadowStyleTokens,
  spring: springTokens,
} as const;

export const alpha = (hex: string, opacity: number): string => {
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
};
