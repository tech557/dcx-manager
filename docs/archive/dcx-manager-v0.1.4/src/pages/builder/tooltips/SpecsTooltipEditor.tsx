import { ListChecks } from "lucide-react";
import { useTooltipDraft } from "./useTooltipDraft";
import { useTheme } from "../../../hooks/useTheme";


interface SpecsTooltipEditorProps {
  value: any;
  hasValue: boolean;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  close: (force?: boolean) => void;
  onSave: (newValue: any) => void;
}

export function SpecsTooltipEditor({
value,
  hasValue,
  isEditing,
  setIsEditing,
  close,
  onSave,
}: SpecsTooltipEditorProps) {
  const { isDark } = useTheme();
  const { draft, setDraft, handleSave } = useTooltipDraft<string>(
    value || "",
    isEditing,
    undefined,
    onSave,
    close
  );

  const preview = (() => {
    if (!hasValue) return "No specs assigned";
    try {
      const parsed = JSON.parse(String(value));
      if (Array.isArray(parsed)) return parsed.map((item) => `${item.label || item.key}: ${item.value}`).join("\n");
    } catch {}
    return String(value);
  })();

  return (
    <div className="flex-1 flex flex-col gap-3 min-h-0">
      <div className="flex items-center gap-2 border-b border-current/[0.06] pb-2">
        <ListChecks className="w-4 h-4 text-[#75E2FF]" />
        <span className="text-[10px] font-black tracking-[0.15em] uppercase opacity-45">Specifications</span>
      </div>
      {isEditing ? (
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className={`flex-1 min-h-24 rounded-xl border p-3 text-xs font-semibold resize-none outline-none ${
              isDark ? "bg-black/35 border-white/10 text-white" : "bg-white border-black/10 text-black"
            }`}
            autoFocus
          />
          <button onClick={handleSave} className="py-2 rounded-xl bg-[#75E2FF] text-black text-[10px] font-black uppercase">
            Save Specs
          </button>
        </>
      ) : (
        <>
          <p className="text-xs font-semibold leading-relaxed opacity-75 whitespace-pre-wrap">{preview}</p>
          <button onClick={() => setIsEditing(true)} className="text-left text-[10px] font-black uppercase tracking-widest text-[#75E2FF]">
            Click to edit specs
          </button>
        </>
      )}
    </div>
  );
}
