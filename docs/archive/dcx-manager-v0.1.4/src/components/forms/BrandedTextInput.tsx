import React from "react";

interface BrandedTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isDark: boolean;
  label?: string;
  id?: string;
  className?: string;
}

export function BrandedTextInput({ id, isDark, label, className = "", ...props }: BrandedTextInputProps) {
  return (
    <div id={id ? `${id}-container` : undefined} className="flex flex-col gap-1.5 w-full font-sans relative z-30">
      {label && (
        <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-30 text-current select-none">
          {label}
        </span>
      )}
      <input
        id={id}
        className={`px-4 py-2.5 rounded-xl border text-xs transition-all duration-300 font-medium outline-none ${
          isDark
            ? "bg-[#121214] border-white/5 text-white placeholder-white/30 focus:border-[#75E2FF]/40 focus:bg-black/40"
            : "bg-black/[0.02] border-black/5 text-black placeholder-black/30 focus:border-[#75E2FF]/40 focus:bg-white"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
