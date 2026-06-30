import type React from "react";
import { X, Check } from "lucide-react";
import { useTheme } from "../../../../hooks/useTheme";


interface CreateDirectiveFormProps {
  cardName: string;
  setCardName: (val: string) => void;
  cardDescription: string;
  setCardDescription: (val: string) => void;
  cardStartDate: string;
  setCardStartDate: (val: string) => void;
  cardEndDate: string;
  cardDurationDays: number;
  setCardDurationDays: (val: number) => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateDirectiveForm({
cardName,
  setCardName,
  cardDescription,
  setCardDescription,
  cardStartDate,
  setCardStartDate,
  cardDurationDays,
  setCardDurationDays,
  onCancel,
  onSubmit,
}: CreateDirectiveFormProps) {
  const { isDark } = useTheme();
  const inputClass = `w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none transition-all ${
    isDark
      ? "bg-black/35 border-white/10 text-white placeholder-white/30 focus:border-[#75E2FF]/60"
      : "bg-white border-black/10 text-black placeholder-black/40 focus:border-[#75E2FF]/60"
  }`;

  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-[1.25rem] border p-3 space-y-2 ${
        isDark ? "bg-black/25 border-white/10" : "bg-white/70 border-black/10"
      }`}
    >
      <input
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        placeholder="Action directive name"
        className={inputClass}
        autoFocus
      />
      <textarea
        value={cardDescription}
        onChange={(e) => setCardDescription(e.target.value)}
        placeholder="Directive notes"
        className={`${inputClass} resize-none min-h-16`}
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          type="date"
          value={cardStartDate}
          onChange={(e) => setCardStartDate(e.target.value)}
          className={inputClass}
        />
        <input
          type="number"
          min={1}
          value={cardDurationDays}
          onChange={(e) => setCardDurationDays(Math.max(1, Number(e.target.value) || 1))}
          className={inputClass}
          title="Duration in days"
        />
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
