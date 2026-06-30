import { BuilderBrandIsland } from "../islands/identity/BrandIsland";
import { BuilderUserIsland } from "../islands/identity/UserIsland";
import { MetadataIsland } from "../islands/MetadataIsland/MetadataIsland";
import { EnrichedVersion } from "../../../types";
import { BLUR } from "../../../styles/tokens";
import { useTheme } from "../../../hooks/useTheme";


type ViewMode = "kanban" | "timeline";

interface BuilderHeaderProps {
  currentVersion: EnrichedVersion;
  toggleTheme: () => void;
  onClose: () => void;
  saveStatus: "idle" | "saving" | "saved" | "error";
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function BuilderHeader({
currentVersion,
  toggleTheme,
  onClose,
  saveStatus,
  viewMode,
  onViewModeChange,
}: BuilderHeaderProps) {
  const { isDark } = useTheme();
  return (
    <header className="absolute top-0 inset-x-0 z-50 flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 pt-6 sm:pt-4 pointer-events-none gap-4">
      <div className="pointer-events-auto w-full lg:w-auto flex justify-between lg:justify-start items-center gap-4">
        <div className="flex items-center gap-3">
          <BuilderBrandIsland onClick={onClose} />

          <div className={`p-1.5 px-3 rounded-full flex items-center gap-2 border text-[9px] font-black font-mono tracking-widest uppercase transition-all duration-500 ${BLUR.light} ${
            isDark
              ? "bg-black/30 border-white/[0.04] text-white/50"
              : "bg-white/40 border-black/[0.05] text-black/50"
          }`}>
            {saveStatus === "saving" && (
              <>
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#75E2FF] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#75E2FF]" />
                </div>
                <span className="text-[#75E2FF]">Syncing</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-emerald-400">Synced</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-rose-400 font-bold">Sync Error</span>
              </>
            )}
            {saveStatus === "idle" && (
              <>
                <div className="h-2 w-2 rounded-full bg-current/20" />
                <span>Grid Connected</span>
              </>
            )}
          </div>
        </div>

        <div className="lg:hidden">
          <BuilderUserIsland toggleTheme={toggleTheme} onClose={onClose} />
        </div>
      </div>

      <div className="pointer-events-auto flex justify-center max-w-full">
        <MetadataIsland
          currentVersion={currentVersion}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>

      <div className="pointer-events-auto hidden lg:block">
        <BuilderUserIsland toggleTheme={toggleTheme} onClose={onClose} />
      </div>
    </header>
  );
}
