import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { BLUR, SPRING } from "../../../styles/tokens";
import { useTheme } from "../../../hooks/useTheme";

export interface BuilderIslandShellProps {
  isExpanded: boolean;
  onToggle?: () => void;
  
  // Collapsed state
  collapsedIcon: React.ReactNode;        // icon shown when pill
  collapsedWidth?: number;               // default 56
  collapsedHeight?: number;              // default 56
  
  // Expanded state
  expandedWidth?: number | "auto";
  expandedHeight?: number | "auto";
  
  // Shape
  shape?: "pill" | "panel";              // pill = rounded-full→island, panel = always island
  
  // Layout
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;            // content when expanded
  
  // Positioning behavior
  position?: "bottom-bar" | "side" | "overlay"; // for layout awareness
}

export function BuilderIslandShell({
  isExpanded,
  onToggle,
  collapsedIcon,
  collapsedWidth = 56,
  collapsedHeight = 56,
  expandedWidth = "auto",
  expandedHeight = "auto",
  shape = "pill",
  id,
  className = "",
  style,
  children,
  position
}: BuilderIslandShellProps) {
  const { isDark } = useTheme();
  const { surface } = useTheme();
  
  // Default values
  const borderRadius = isExpanded 
    ? "2rem" 
    : (shape === "pill" ? "9999px" : "2rem");

  // Determine standard colors and layouts
  const baseTheme = isExpanded
    ? `${surface.base} text-current ${isDark ? "shadow-[0_12px_40px_rgba(0,0,0,0.4)]" : "shadow-[0_12px_40px_rgba(0,0,0,0.06)]"}`
    : `${surface.pill} ${surface.pillHover} cursor-pointer group hover:scale-[1.03] justify-center`;

  const mergedClasses = [
    "relative select-none pointer-events-auto border transition-all duration-500 flex shrink-0 items-center",
    BLUR.heavy,
    isExpanded ? "overflow-visible" : "overflow-hidden",
    baseTheme,
    className
  ].join(" ");

  // Gentle transition or spring
  const motionTransition = SPRING.island;

  return (
    <motion.div
      id={id}
      layout
      animate={{
        width: isExpanded ? (expandedWidth === "auto" ? "auto" : expandedWidth) : collapsedWidth,
        height: isExpanded ? (expandedHeight === "auto" ? "auto" : expandedHeight) : collapsedHeight,
        borderRadius
      }}
      transition={motionTransition}
      onClick={!isExpanded && onToggle ? onToggle : undefined}
      className={mergedClasses}
      style={style}
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex flex-col"
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            className="w-full h-full flex items-center justify-center relative"
          >
            {collapsedIcon}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
