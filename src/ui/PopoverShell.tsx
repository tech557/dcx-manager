import React from 'react';
import { useTheme } from '@/hooks/useTheme';

// Adapter seam: feature code should keep importing PopoverShell, while any
// future shadcn/MCP popover primitive stays behind this children/className/width contract.
interface PopoverShellProps {
  children: React.ReactNode;
  className?: string;
  width?: string;
}

export function PopoverShell({
  children,
  className = '',
  width = 'w-auto'
}: PopoverShellProps) {
  const { isDark } = useTheme();
  
  return (
    <div
      className={`absolute z-[999] rounded-2xl shadow-2xl border backdrop-blur-xl ${
        isDark 
          ? 'bg-[var(--theme-surface-deep)]/95 border-white/10 text-white' 
          : 'bg-white/95 border-black/10 text-neutral-800'
      } ${width} ${className}`}
    >
      {children}
    </div>
  );
}
