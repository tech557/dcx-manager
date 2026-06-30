import { Plus, X } from "lucide-react";
import { generateId } from "../../../../../../utils/id.helpers";
import { SpecItem } from "../components/SpecsIdentifierField";
import { useTheme } from "../../../../../../hooks/useTheme";


interface SpecsSectionProps {
  specsList: SpecItem[];
  onChange: (updated: SpecItem[]) => void;
}

export function SpecsSection({ specsList, onChange }: SpecsSectionProps) {
  const { isDark } = useTheme();
  const inputClass = `w-full rounded-xl border px-3 py-2 text-xs font-semibold outline-none ${
    isDark ? "bg-black/35 border-white/10 text-white" : "bg-white border-black/10 text-black"
  }`;

  const update = (idx: number, patch: Partial<SpecItem>) => {
    onChange(specsList.map((item, itemIdx) => (itemIdx === idx ? { ...item, ...patch } : item)));
  };

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="block text-[9px] font-black tracking-[0.25em] uppercase text-[#75E2FF]">Specs</span>
          <span className="text-[10px] font-bold opacity-45">Identifiers and requirements</span>
        </div>
        <button
          type="button"
          onClick={() => onChange([...specsList, { label: `Spec ${specsList.length + 1}`, value: "" }])}
          className="p-1.5 rounded-full bg-[#75E2FF]/15 text-[#75E2FF]"
          title="Add spec"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-2">
        {specsList.map((item, idx) => (
          <div key={`${item.label}-${idx}`} className="grid grid-cols-[120px_1fr_auto] gap-2">
            <input value={item.label} onChange={(e) => update(idx, { label: e.target.value })} className={inputClass} />
            <input value={item.value} onChange={(e) => update(idx, { value: e.target.value })} className={inputClass} />
            <button
              type="button"
              onClick={() => onChange(specsList.filter((_, itemIdx) => itemIdx !== idx))}
              className="p-2 rounded-full text-rose-400 hover:bg-rose-500/10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {specsList.length === 0 && (
          <button
            type="button"
            onClick={() => onChange([{ label: "Spec Code", value: "" }])}
            className="w-full py-3 rounded-xl border border-dashed border-current/10 text-[10px] font-black uppercase opacity-50 hover:opacity-100"
          >
            Add first spec
          </button>
        )}
      </div>
    </section>
  );
}
