import React, { useRef } from "react";
import { Calendar } from "lucide-react";

interface BrandedDateInputProps {
  value: string; // e.g., "2026-06-15" or "TBH"
  onChange: (value: string) => void;
  isDark: boolean;
  label?: string;
}

export function BrandedDateInput({
  value,
  onChange,
  isDark,
  label = "Communicated Date",
}: BrandedDateInputProps) {
  const isTBH = value === "TBH";
  const dateValue = isTBH ? "" : value;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTBHOff = () => {
    const today = new Date().toISOString().split("T")[0];
    onChange(today);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full font-sans select-none relative z-30">
      {label && (
        <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-30 text-current select-none">
          {label}
        </span>
      )}
      <div className="flex gap-2.5 w-full items-stretch relative">
        {/* Main date wrapper container */}
        <div
          onClick={isTBH ? handleTBHOff : undefined}
          className={`relative flex-1 flex items-center justify-between px-4 py-2.5 rounded-xl border text-xs transition-all duration-300 font-medium overflow-hidden ${
            isTBH
              ? isDark
                ? "bg-white/[0.02] border-white/[0.04] text-white/30 hover:bg-white/[0.05] cursor-pointer"
                : "bg-black/[0.01] border-black/[0.04] text-black/30 hover:bg-black/[0.03] cursor-pointer"
              : isDark
              ? "bg-black/20 border-white/5 text-white hover:bg-black/30 hover:border-white/10"
              : "bg-black/[0.02] border-black/5 text-black hover:bg-black/[0.04] hover:border-black/10"
          }`}
        >
          {isTBH ? (
            <div className="flex items-center gap-2 pointer-events-none relative z-0">
              <Calendar className="w-3.5 h-3.5 opacity-40 text-current text-primary" />
              <span className={`text-xs font-mono font-bold tracking-tight ${isDark ? "text-white/45" : "text-black/50"}`}>
                Date is set to TBH
              </span>
            </div>
          ) : (
            <>
              {/* Beautiful custom styled text & icon rendered beneath the transparent native input click target */}
              <div className="flex items-center gap-2 w-full pointer-events-none relative z-0">
                <Calendar className="w-3.5 h-3.5 opacity-60 text-primary" />
                <span className="font-mono font-bold tracking-tight">
                  {dateValue ? dateValue.replace(/-/g, ".") : "Select Target Date..."}
                </span>
              </div>

              {/* Fully transparent native date input that fills the entire container, capturing clicks perfectly */}
              <input
                ref={inputRef}
                type="date"
                value={dateValue}
                onChange={(e) => {
                  if (e.target.value) {
                    onChange(e.target.value);
                  }
                }}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10 pointer-events-auto"
                style={{ colorScheme: isDark ? "dark" : "light" }}
              />
            </>
          )}
        </div>

        {/* TBH Toggle Button */}
        <button
          type="button"
          onClick={() => {
            if (isTBH) {
              const today = new Date().toISOString().split("T")[0];
              onChange(today);
            } else {
              onChange("TBH");
            }
          }}
          className={`tbh-toggle-btn px-5 rounded-xl border font-black text-xs transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 select-none relative z-20 ${
            isTBH
              ? isDark
                ? "bg-[#75E2FF]/15 border-[#75E2FF]/35 text-primary hover:bg-[#75E2FF]/25 shadow-[0_0_20px_rgba(117,226,255,0.15)]"
                : "bg-[#75E2FF]/20 border-[#75E2FF]/45 text-[#006A80] hover:bg-[#75E2FF]/30 shadow-[0_0_20px_rgba(117,226,255,0.15)]"
              : isDark
              ? "bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:border-white/10"
              : "bg-black/5 border-black/5 text-black/50 hover:bg-black/10 hover:border-black/10"
          }`}
          title="Mark date as TBH (To Be Handled / Confirmed)"
        >
          <span className="tracking-widest text-[11px]">TBH</span>
        </button>
      </div>
    </div>
  );
}
