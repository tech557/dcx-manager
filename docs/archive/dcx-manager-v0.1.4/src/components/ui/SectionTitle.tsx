import React from "react";

interface SectionTitleProps {
  children: React.ReactNode;
  isDark: boolean;
  size?: "sm" | "md" | "lg";
  tracking?: "tight" | "wide" | "widest";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "black";
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  isDark,
  size = "md",
  tracking = "tight",
  weight = "bold",
  className = ""
}) => {
  const sizeMap = {
    sm: "text-sm sm:text-base",
    md: "text-base sm:text-lg lg:text-xl",
    lg: "text-xl sm:text-2xl lg:text-3xl"
  };

  const trackingMap = {
    tight: "tracking-tight",
    wide: "tracking-wide",
    widest: "tracking-[0.15em] sm:tracking-[0.2em] sm:tracking-[0.3em]"
  };

  const weightMap = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    black: "font-black"
  };

  const colorTheme = isDark ? "text-white" : "text-black";

  return (
    <h3
      className={`font-sans ${sizeMap[size]} ${trackingMap[tracking]} ${weightMap[weight]} ${colorTheme} ${className}`}
    >
      {children}
    </h3>
  );
};
