import { Plus, X } from "lucide-react";
import { useTheme } from "../../../../../../hooks/useTheme";


interface MissingFieldsSectionProps {
  missingFields: string[];
  onChange: (updated: string[]) => void;
}

export function MissingFieldsSection({ missingFields, onChange }: MissingFieldsSectionProps) {
  const { isDark } = useTheme();
  const inputClass = `w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none ${
    isDark ? "bg-black/35 border-white/10 text-white" : "bg-white border-black/10 text-black"
  }`;

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-[9px] font-black tracking-[0.25em] uppercase text-[#75E2FF]">Missing Data</span>
          <span className="text-[10px] font-bold opacity-45">Setup items still needed</span>
        </div>
        <button
          type="button"
          onClick={() => onChange([...missingFields, ""])}
          className="p-1.5 rounded-full bg-[#75E2FF]/15 text-[#75E2FF]"
          title="Add missing item"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-2">
        {missingFields.map((item, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_auto] gap-2">
            <input
              value={item}
              onChange={(e) => onChange(missingFields.map((field, fieldIdx) => (fieldIdx === idx ? e.target.value : field)))}
              className={inputClass}
              placeholder="Missing item"
            />
            <button
              type="button"
              onClick={() => onChange(missingFields.filter((_, fieldIdx) => fieldIdx !== idx))}
              className="p-2 rounded-full text-rose-400 hover:bg-rose-500/10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {missingFields.length === 0 && (
          <p className="text-[10px] font-semibold opacity-35">No missing setup items.</p>
        )}
      </div>
    </section>
  );
}
