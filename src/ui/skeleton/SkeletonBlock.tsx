interface SkeletonBlockProps {
  className?: string;
  style?: React.CSSProperties;
  /** Use 'light' on light-theme surfaces (Home/Version), 'dark' on dark-glass surfaces (Builder) */
  surface?: 'dark' | 'light';
}

/** Layout-preserving skeleton block. Shimmer is suppressed under prefers-reduced-motion via CSS. */
export function SkeletonBlock({ className = '', style, surface = 'dark' }: SkeletonBlockProps) {
  return (
    <div
      className={`${surface === 'light' ? 'skeleton-block-light' : 'skeleton-block'} ${className}`}
      style={style}
    />
  );
}
