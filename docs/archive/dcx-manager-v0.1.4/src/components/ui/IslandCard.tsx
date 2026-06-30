import React from "react";
import { SURFACE, SHADOW } from "../../styles/tokens";

interface IslandCardProps {
  children: React.ReactNode;
  isDark: boolean;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

export const IslandCard: React.FC<IslandCardProps> = ({
  children,
  isDark,
  className = "",
  title,
  icon
}) => {
  const baseTheme = isDark
    ? `${SURFACE.dark.glass} ${SHADOW.card} hover:bg-black/35 hover:border-white/[0.08]`
    : `${SURFACE.light.glass} shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:bg-white/95 hover:border-black/[0.12]`;

  return (
    <div
      className={`glass px-5 rounded-full flex items-center justify-between gap-5 pointer-events-auto border transition-all duration-300 select-none max-w-full ${baseTheme} ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
        </div>
      )}
      {children}
    </div>
  );
};
