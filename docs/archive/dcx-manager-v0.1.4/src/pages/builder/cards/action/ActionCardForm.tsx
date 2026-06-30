import type React from "react";
import { Check, X } from "lucide-react";
import { useTheme } from "../../../../hooks/useTheme";


interface ActionCardFormProps {
  name: string;
  setName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  calculatedTaskCount: number;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ActionCardForm({
name,
  setName,
  description,
  setDescription,
  startDate,
  setStartDate,
  calculatedTaskCount,
  onCancel,
  onSubmit,
}: ActionCardFormProps) {
  const { isDark } = useTheme();
  const inputClass = `w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition-all ${
    isDark
      ? "bg-black/35 border-white/10 text-white placeholder-white/30 focus:border-[#75E2FF]/60"
      : "bg-white border-black/10 text-black placeholder-black/40 focus:border-[#75E2FF]/60"
  }`;

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Action name" autoFocus />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={`${inputClass} resize-none min-h-16`}
        placeholder="Action description"
      />
      <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
        <span className="text-[9px] font-black font-mono opacity-40 px-2">{calculatedTaskCount}T</span>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel} className="p-2 rounded-full hover:bg-current/10 text-current/60">
          <X className="w-3.5 h-3.5" />
        </button>
        <button type="submit" className="p-2 rounded-full bg-[#75E2FF]/20 text-[#75E2FF] hover:bg-[#75E2FF]/30">
          <Check className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}
