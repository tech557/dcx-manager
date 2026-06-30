import React, { useState, useRef, useEffect, ReactElement } from "react";
import { createPortal } from "react-dom";
import { AlertCircle } from "lucide-react";
import { BLUR } from "../../../../styles/tokens";
import { useTooltipCoords } from "../../tooltips/useTooltipCoords";
import { useTooltipResize } from "../../tooltips/useTooltipResize";
import { useTheme } from "../../../../hooks/useTheme";


interface InteractiveTooltipProps {
  defaultSize?: { width: number; height: number };
  nonEditingWidth?: number | string;
  disableHover?: boolean;
  alwaysResizable?: boolean;
  compact?: boolean;
  content: 
    | ((props: {
        isEditing: boolean;
        setIsEditing: (val: boolean) => void;
        close: (force?: boolean) => void;
        size: { width: number; height: number };
        setHasUnsavedChanges: (val: boolean) => void;
        onSaveTriggerRef: React.MutableRefObject<(() => void) | null>;
        onDiscardTriggerRef: React.MutableRefObject<(() => void) | null>;
      }) => React.ReactNode)
    | React.ReactNode;
  children: ReactElement;
  onTriggerClick?: () => void;
}

interface ContentRendererProps {
  content: any;
  props: {
    isEditing: boolean;
    setIsEditing: (val: boolean) => void;
    close: (force?: boolean) => void;
    size: { width: number; height: number };
    setHasUnsavedChanges: (val: boolean) => void;
    onSaveTriggerRef: React.MutableRefObject<(() => void) | null>;
    onDiscardTriggerRef: React.MutableRefObject<(() => void) | null>;
  };
}

function ContentRenderer({ content, props }: ContentRendererProps) {
  if (typeof content === "function") {
    return content(props);
  }
  return content;
}

export function InteractiveTooltip({
defaultSize,
  nonEditingWidth = "290px",
  content,
  children,
  onTriggerClick,
  disableHover,
  alwaysResizable,
  compact
}: InteractiveTooltipProps) {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showUnsavedAlert, setShowUnsavedAlert] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const onSaveTriggerRef = useRef<(() => void) | null>(null);
  const onDiscardTriggerRef = useRef<(() => void) | null>(null);

  const { size, startResize } = useTooltipResize(
    defaultSize || { width: 340, height: 220 }
  );

  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>(null);

  const coords = useTooltipCoords(isOpen, isEditing, triggerRef);

  const handleConfirmSave = () => {
    if (onSaveTriggerRef.current) {
      onSaveTriggerRef.current();
    }
    setShowUnsavedAlert(false);
    setIsEditing(false);
    setIsOpen(false);
  };

  const handleDiscard = () => {
    if (onDiscardTriggerRef.current) {
      onDiscardTriggerRef.current();
    }
    setShowUnsavedAlert(false);
    setIsEditing(false);
    setIsOpen(false);
  };

  const handleSafeClose = () => {
    if (isEditing && hasUnsavedChanges) {
      setShowUnsavedAlert(true);
    } else {
      setIsEditing(false);
      setIsOpen(false);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditing && !isOpen) return;

      if (e.key === "Escape") {
        e.stopPropagation();
        e.preventDefault();
        
        if (showUnsavedAlert) {
          handleDiscard();
        } else if (isEditing && hasUnsavedChanges) {
          setShowUnsavedAlert(true);
        } else {
          setIsEditing(false);
          setIsOpen(false);
        }
      } else if (e.key === "Enter") {
        if (showUnsavedAlert) {
          e.stopPropagation();
          e.preventDefault();
          handleConfirmSave();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isEditing, isOpen, hasUnsavedChanges, showUnsavedAlert]);

  // Click outside listener to dismiss when editing is active or click-to-open is active
  useEffect(() => {
    if (!isEditing && (!isOpen || !disableHover)) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        triggerRef.current?.contains(target) ||
        contentRef.current?.contains(target) ||
        target.closest("[role='option']") || 
        target.closest("select") ||
        target.closest("option") ||
        target.closest(".no-close-on-click")
      ) {
        return;
      }
      
      if (isEditing && hasUnsavedChanges) {
        setShowUnsavedAlert(true);
      } else {
        setIsEditing(false);
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isEditing, isOpen, disableHover, hasUnsavedChanges]);

  const handleMouseEnter = () => {
    if (disableHover) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (disableHover) return;
    timeoutRef.current = setTimeout(() => {
      if (!isEditing) {
        setIsOpen(false);
      }
    }, 180);
  };

  const handleContentMouseEnter = () => {
    if (disableHover) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleContentMouseLeave = () => {
    if (disableHover) return;
    timeoutRef.current = setTimeout(() => {
      if (!isEditing) {
        setIsOpen(false);
      }
    }, 180);
  };

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (onTriggerClick) {
      onTriggerClick();
    }
    if (disableHover) {
      e.stopPropagation();
      if (isOpen) {
        handleSafeClose();
      } else {
        setIsOpen(true);
      }
    }
  };

  const active = isOpen || isEditing;

  const glassStyleClass = isDark
    ? `bg-[#0d0d0e]/95 border border-white/[0.04] shadow-[0_20px_50px_rgba(0,0,0,0.8)] ${BLUR.heavy} text-[#F2F3F5]`
    : `bg-white/95 border border-black/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.14)] ${BLUR.heavy} text-[#1a1a1b]`;

  return (
    <>
      <div 
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTriggerClick}
        className="inline-block"
      >
        {children}
      </div>

      {active && coords && createPortal(
        <div 
          ref={contentRef}
          onMouseEnter={handleContentMouseEnter}
          onMouseLeave={handleContentMouseLeave}
          style={{
            position: "absolute",
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            transform: "translate(-50%, -100%)",
            marginTop: "-8px",
            width: isEditing ? `${size.width}px` : (typeof nonEditingWidth === 'number' ? `${nonEditingWidth}px` : (compact ? "auto" : nonEditingWidth)),
            height: isEditing ? `${size.height}px` : "auto",
            maxHeight: isEditing ? `${size.height}px` : "320px",
            fontFamily: "Gilroy, -apple-system, BlinkMacSystemFont, sans-serif"
          }}
          className={`z-[999999] rounded-[1.8rem] flex flex-col overflow-hidden select-none transition-all duration-150 ${compact && !isEditing ? "rounded-[1rem]" : ""} ${glassStyleClass}`}
        >
          <div className={`flex-1 w-full h-full flex flex-col relative overflow-y-auto min-h-0 ${compact && !isEditing ? "p-1 px-2.5" : "p-4"}`}>
            <ContentRenderer
              content={content}
              props={{
                isEditing,
                setIsEditing,
                close: (force?: boolean) => {
                  if (force === true) {
                    setIsEditing(false);
                    setIsOpen(false);
                  } else {
                    handleSafeClose();
                  }
                },
                size,
                setHasUnsavedChanges,
                onSaveTriggerRef,
                onDiscardTriggerRef
              }}
            />
          </div>

          {(isEditing || alwaysResizable) && (
            <>
              <div 
                className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-[#75E2FF]/20 active:bg-[#75E2FF]/40 transition-colors z-[10002]"
                onPointerDown={(e) => startResize(e, "r")}
              />

              <div 
                className="absolute top-0 right-0 w-5 h-5 cursor-nesw-resize z-[10003]"
                onPointerDown={(e) => startResize(e, "tr")}
              />

              <div 
                className="absolute top-0 left-0 w-5 h-5 cursor-nwse-resize z-[10003]"
                onPointerDown={(e) => startResize(e, "tl")}
              />
            </>
          )}

          {showUnsavedAlert && (
            <div 
              style={{ fontFamily: "'Gilroy', -apple-system, sans-serif" }}
              className={`absolute inset-0 z-[10005] flex flex-col items-center justify-center p-6 text-center animate-fade-in ${
                isDark 
                  ? "bg-[#0d0d0e]/95 text-[#F2F3F5]" 
                  : "bg-white/95 text-[#1a1a1b]"
              }`}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-4 animate-pulse">
                <AlertCircle className="w-6 h-6 stroke-[2]" />
              </div>

              <h3 className="text-sm font-bold tracking-wide uppercase opacity-90 mb-1.5">
                Unsaved Changes
              </h3>
              
              <p className="text-[11px] opacity-60 max-w-[280px] leading-relaxed mb-6">
                You have modified these specification values. Would you like to save this draft?
              </p>

              <div className="w-full space-y-2 mb-6 max-w-[260px]">
                <button
                  onClick={handleConfirmSave}
                  className="w-full py-2 rounded-xl font-bold text-xs bg-[#75E2FF] hover:bg-[#5fc0db] text-neutral-900 transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/15 font-semibold">ENTER</span>
                  Save and Apply
                </button>

                <button
                  onClick={handleDiscard}
                  className="w-full py-2 rounded-xl font-bold text-xs bg-rose-500/10 border border-rose-500/15 hover:bg-rose-500/20 text-rose-450 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-950/20 text-rose-400 font-semibold">ESC</span>
                  Discard changes
                </button>
              </div>

              <button
                onClick={() => setShowUnsavedAlert(false)}
                className="text-[10px] font-bold text-neutral-450 hover:text-neutral-300 uppercase tracking-widest cursor-pointer transition-colors"
              >
                Cancel & Keep Editing
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
