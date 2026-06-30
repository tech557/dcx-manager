import React from "react";
import { RADIUS, BLUR, SHADOW } from "../../styles/tokens";
import { useTheme } from "../../hooks/useTheme";

interface PopoverShellProps {
  children: React.ReactNode;
  className?: string;
  width?: string;
}

export function PopoverShell({
  children,
  className = "",
  width = "w-auto"
}: PopoverShellProps) {
  const { surface } = useTheme();
  
  return (
    <div
      className={`absolute z-50 ${BLUR.heavy} border ${RADIUS.panel} ${SHADOW.overlay} ${surface.overlay} ${width} ${className}`}
    >
      {children}
    </div>
  );
}
