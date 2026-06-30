import { Minimize2 } from "lucide-react";
import { useTheme } from "../../../../hooks/useTheme";


interface CollapseButtonProps {
  hasSelection: boolean;
  canCollapse: boolean;
  onClick: () => void;
}

export function CollapseButton({ hasSelection, canCollapse, onClick }: CollapseButtonProps) {
  const { isDark } = useTheme();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!canCollapse}
      className={`p-1.5 rounded-full transition-colors flex items-center justify-center ${
        canCollapse
          ? isDark ? "hover:bg-white/10 text-[#75E2FF]" : "hover:bg-black/10 text-neutral-800"
          : "opacity-25 cursor-not-allowed"
      }`}
      title={hasSelection ? "Collapse selection" : "Collapse all"}
    >
      <Minimize2 className="w-3.5 h-3.5" />
    </button>
  );
}
