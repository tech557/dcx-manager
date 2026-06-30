import React from 'react';

export interface GlassSurfaceProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  radius?: 'sm' | 'md' | 'lg';
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  backdropClassName?: string;
  opacity?: number;
  noBackground?: boolean;
  variant?: 'card' | 'island' | 'popup' | 'popover';
}

const VARIANT_STYLES = {
  card: { radius: 'var(--radius-3xl)', blur: 'backdrop-blur-xl' },
  island: { radius: 'var(--radius-3xl)', blur: 'backdrop-blur-xl' },
  popup: { radius: 'var(--radius-md)', blur: 'backdrop-blur-md' },
  popover: { radius: 'var(--radius-sm)', blur: 'backdrop-blur-sm' },
} as const;

const RADIUS_STYLES = {
  sm: 'var(--radius-md)',
  md: 'var(--radius-xl)',
  lg: 'var(--radius-3xl)',
} as const;

const INTENSITY_STYLES = {
  low: { blur: 'backdrop-blur-sm', opacity: 0.72 },
  medium: { blur: 'backdrop-blur-md', opacity: 0.86 },
  high: { blur: 'backdrop-blur-xl', opacity: 0.95 },
} as const;

export function GlassSurface({
  children,
  width,
  height,
  borderRadius,
  radius,
  intensity = 'high',
  className = '',
  backdropClassName = '',
  opacity,
  noBackground = false,
  variant,
}: GlassSurfaceProps) {
  const variantStyle = variant ? VARIANT_STYLES[variant] : undefined;
  const intensityStyle = INTENSITY_STYLES[intensity];
  const resolvedBorderRadius = borderRadius !== undefined 
    ? (typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius) 
    : radius ? RADIUS_STYLES[radius] : variantStyle?.radius ?? RADIUS_STYLES.md;
  const resolvedOpacity = opacity ?? intensityStyle.opacity;
  const resolvedBlur = variantStyle?.blur ?? intensityStyle.blur;

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ 
        width: width || '100%', 
        height: height || '100%', 
        borderRadius: resolvedBorderRadius 
      }}
    >
      {/* 1. Frosted Backdrop Blur Layer */}
      {!noBackground && (
        <div 
          className={`absolute inset-0 z-0 pointer-events-none ${resolvedBlur}`}
          style={{
            borderRadius: resolvedBorderRadius,
          }}
        />
      )}

      {/* 2. Glass Base & Shiny Diagonal Gloss Highlight */}
      <div 
        className={`absolute inset-0 z-0 pointer-events-none transition-all duration-300 ease-out ${backdropClassName}`} 
        style={{ 
          borderRadius: resolvedBorderRadius,
          opacity: noBackground ? 0 : resolvedOpacity,
          backgroundImage: noBackground ? 'none' : `
            radial-gradient(circle at 50% 0%, var(--theme-component-fill-subtle), transparent 60%),
            linear-gradient(135deg, var(--theme-component-fill-faint) 0%, var(--theme-component-surface-glass-dark) 100%)
          `,
        }}
      />

      {/* 3. Real pristine text and content layer layered on top */}
      <div className="relative z-10 w-full h-full min-h-0 flex flex-col pointer-events-auto">
        {children}
      </div>
    </div>
  );
}

export default GlassSurface;
