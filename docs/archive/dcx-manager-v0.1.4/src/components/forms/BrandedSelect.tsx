import React from "react";

interface BrandedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  isDark: boolean;
  label?: string;
  id?: string;
  options: { value: string; label: string }[];
  className?: string;
}

export function BrandedSelect({ id, isDark, label, options, className = "", ...props }: BrandedSelectProps) {
  return (
    <div id={id ? `${id}-container` : undefined} className="flex flex-col gap-1.5 w-full font-sans relative z-30">
      {label && (
        <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-30 text-current select-none">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          id={id}
          className={`w-full px-4 py-2.5 rounded-xl border text-xs transition-all duration-300 font-medium outline-none appearance-none cursor-pointer ${
            isDark
              ? "bg-[#121214] border-white/5 text-white focus:border-[#75E2FF]/40"
              : "bg-black/[0.02] border-black/5 text-black focus:border-[#75E2FF]/40"
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className={isDark ? "bg-[#18181b] text-white" : "bg-white text-black"}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-current opacity-40">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
