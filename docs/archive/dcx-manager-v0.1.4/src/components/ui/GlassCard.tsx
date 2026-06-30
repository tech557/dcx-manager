import React from "react";
import { RADIUS, BLUR, SHADOW } from "../../styles/tokens";
import { useTheme } from "../../hooks/useTheme";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  radius?: "md" | "lg" | "xl";
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  padding = "md",
  radius = "xl"
}) => {
  const { isDark, surface } = useTheme();

  const paddingMap = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-6 sm:p-8"
  };

  const radiusMap = {
    md: "rounded-xl",
    lg: "rounded-2xl",
    xl: "rounded-[2rem]"
  };

  const baseTheme = isDark
    ? `${surface.glass} shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-white/[0.06]`
    : `${surface.glass} shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:border-black/[0.12]`;

  return (
    <div
      className={`${BLUR.heavy} border transition-all duration-500 ${paddingMap[padding]} ${radiusMap[radius]} ${baseTheme} ${className}`}
    >
      {children}
    </div>
  );
};
