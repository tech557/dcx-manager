import { Maximize2 } from "lucide-react";
import { useTheme } from "../../../../hooks/useTheme";


interface ExpandButtonProps {
  hasSelection: boolean;
  canExpand: boolean;
  onClick: () => void;
}

export function ExpandButton({ hasSelection, canExpand, onClick }: ExpandButtonProps) {
  const { isDark } = useTheme();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!canExpand}
      className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
        canExpand
          ? isDark ? "hover:bg-white/10 text-[#75E2FF]" : "hover:bg-black/10 text-neutral-800"
          : "opacity-25 cursor-not-allowed"
      }`}
      title={hasSelection ? "Expand selection" : "Expand all"}
    >
      <Maximize2 className="w-3.5 h-3.5" />
    </button>
  );
}
