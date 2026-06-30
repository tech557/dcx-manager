import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check } from "lucide-react";
import { BLUR } from "../../styles/tokens";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  description?: string;
  isDark?: boolean;
  children?: React.ReactNode;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  tertiaryButtonText?: string;
  headerSecondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onTertiaryAction?: () => void;
  onHeaderSecondaryAction?: () => void;
  maxWidthClass?: string;
}

export function Popup({
  isOpen,
  onClose,
  title,
  subtitle = "System Notification",
  description,
  isDark = true,
  children,
  primaryButtonText = "Confirm",
  secondaryButtonText,
  tertiaryButtonText,
  headerSecondaryButtonText,
  onPrimaryAction,
  onSecondaryAction,
  onTertiaryAction,
  onHeaderSecondaryAction,
  maxWidthClass = "max-w-lg",
}: PopupProps) {
  // Prevent scrolling behind the modal when it is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape keyboard key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
          {/* Ambient Backdrop Blur Overlay */}
          <motion.div
            id="popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className={`absolute inset-0 w-full h-full cursor-pointer pointer-events-auto transition-colors duration-500 ${
              isDark ? `bg-black/20 ${BLUR.heavy}` : `bg-white/20 ${BLUR.heavy}`
            }`}
          />

          {/* Dialog Container Glass Panel */}
          <motion.div
            id="popup-panel"
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 15 }}
            transition={{ 
              type: "spring",
              damping: 30,
              stiffness: 300
            }}
            className={`relative z-10 w-full ${maxWidthClass} overflow-hidden ${BLUR.heavy} transition-all duration-500 p-8 flex flex-col gap-6 select-none ${
              isDark 
                ? "bg-black/20 border border-white/[0.03] shadow-[0_24px_64px_rgba(0,0,0,0.4)] text-white rounded-[2rem]" 
                : "bg-white/75 border border-black/[0.07] shadow-[0_24px_64px_rgba(0,0,0,0.06)] text-black rounded-[2rem]"
            }`}
          >
            {/* Soft inner glow gradient for dynamic glass refraction */}
            <div className={`absolute -inset-px -z-10 bg-gradient-to-b rounded-[2rem] opacity-30 pointer-events-none ${
              isDark ? "from-white/10 to-transparent" : "from-white/80 to-transparent"
            }`} />

            {/* Header section */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                {/* Visual indicator / Subtitle flag */}
                {subtitle && (
                  <span className={`text-[10px] font-black tracking-[0.3em] uppercase opacity-30 ${
                    isDark ? "text-white" : "text-black"
                  }`}>
                    {subtitle}
                  </span>
                )}
                {/* Title */}
                <h3 className={`text-2xl font-black tracking-tight leading-none ${
                  isDark ? "text-white" : "text-black"
                }`}>
                  {title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {headerSecondaryButtonText && onHeaderSecondaryAction && (
                  <button
                    id="popup-header-secondary-btn"
                    onClick={onHeaderSecondaryAction}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer ${
                      isDark
                        ? "bg-[#75E2FF]/10 hover:bg-[#75E2FF]/20 border-[#75E2FF]/15 hover:border-[#75E2FF]/30 text-primary"
                        : "bg-black/5 hover:bg-black/10 border-black/5 hover:border-black/10 text-black/85"
                    }`}
                  >
                    {headerSecondaryButtonText}
                  </button>
                )}

                {/* Close Button element */}
                <button
                  id="popup-close-btn"
                  onClick={onClose}
                  className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isDark
                      ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-white/50 hover:text-white"
                      : "bg-black/5 border-black/5 hover:bg-black/10 hover:border-black/10 text-black/50 hover:text-black"
                  }`}
                  title="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content/Body section */}
            <div className="flex flex-col gap-4">
              {description && (
                <p className={`text-xs leading-relaxed font-medium transition-all duration-300 ${
                  isDark ? "text-white/50" : "text-black/60"
                }`}>
                  {description}
                </p>
              )}

              {/* Injected custom children template */}
              {children && (
                <div className={`mt-2 ${isDark ? "text-white" : "text-black"}`}>
                  {children}
                </div>
              )}
            </div>

            {/* Footer controls section with buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Tertiary Close/Cancel Button */}
                {(tertiaryButtonText || onTertiaryAction) && (
                  <button
                    id="popup-tertiary-btn"
                    onClick={onTertiaryAction || onClose}
                    className={`px-5 py-2.5 rounded-xl border transition-all duration-300 text-xs font-bold cursor-pointer ${
                      isDark
                        ? "bg-white/5 border-white/5 hover:bg-white/10 text-white/50 hover:text-white"
                        : "bg-black/5 border-black/5 hover:bg-black/10 text-black/50 hover:text-black"
                    }`}
                  >
                    {tertiaryButtonText || "Cancel"}
                  </button>
                )}

                {/* Secondary Save as Draft Button */}
                {(secondaryButtonText || onSecondaryAction) && (
                  <button
                    id="popup-secondary-btn"
                    onClick={onSecondaryAction || onClose}
                    className={`px-5 py-2.5 rounded-xl border transition-all duration-300 text-xs font-bold cursor-pointer transition-all duration-300 ${
                      isDark
                        ? "bg-white/10 border-white/10 hover:bg-white/20 text-white"
                        : "bg-black/10 border-black/10 hover:bg-black/20 text-black"
                    }`}
                  >
                    {secondaryButtonText || "Save as Draft"}
                  </button>
                )}
              </div>

              {/* Primary action button */}
              {(primaryButtonText || onPrimaryAction) && (
                <button
                  id="popup-primary-btn"
                  onClick={onPrimaryAction || onClose}
                  className={`px-5 py-2.5 rounded-xl border transition-all duration-300 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm ${
                    isDark
                      ? "bg-primary border-primary/20 text-neutral-950 hover:bg-opacity-90 hover:scale-[1.02]"
                      : "bg-[#0D0D0E] border-black/10 text-white hover:bg-opacity-95 hover:scale-[1.02]"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3px]" />
                  <span>{primaryButtonText}</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
