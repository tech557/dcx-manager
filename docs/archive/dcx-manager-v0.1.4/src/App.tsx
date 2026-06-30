import { useState, useEffect } from "react";
import { Background } from "./components/Background";
import { BrandIsland } from "./components/topbar/BrandIsland";
import UserIsland from "./components/topbar/UserIsland";
import Home from "./pages/home/Home";
import VersionPage from "./pages/version/VersionPage";
import BuilderPage from "./pages/builder/BuilderPage";
import { EnrichedVersion } from "./types";
import { useBuilderStore } from "./store/builderStore";
import { useTheme } from "./hooks/useTheme";
import {
  useVersionsQuery,
  useUpdateVersionMutation,
  useCreateVersionMutation,
  useUpdateVersionStatusMutation,
} from "./queries/builderQueries";

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState<'home' | 'version' | 'builder'>('home');
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  const { data: versions = [], isLoading } = useVersionsQuery();
  const updateVersionMutation = useUpdateVersionMutation();
  const createVersionMutation = useCreateVersionMutation();
  const updateVersionStatusMutation = useUpdateVersionStatusMutation();

  const handleUpdateVersionData = (updatedVersion: EnrichedVersion) => {
    updateVersionMutation.mutate(updatedVersion);
  };

  // Update favicon dynamically
  useEffect(() => {
    const svg = `
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
        <rect x='20' y='20' width='60' height='60' rx='18' fill='${isDark ? "black" : "white"}' />
        <circle cx='50' cy='50' r='7' fill='${isDark ? "white" : "black"}' />
      </svg>
    `;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    // @ts-ignore
    link.type = 'image/svg+xml';
    // @ts-ignore
    link.rel = 'icon';
    // @ts-ignore
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
    
    return () => URL.revokeObjectURL(url);
  }, [isDark]);

  const activeVersion = versions.find(v => v.id === selectedVersionId) || versions[0];

  useEffect(() => {
    if (currentPage === "builder") {
      useBuilderStore.getState().setActiveVersion(activeVersion);
    } else {
      useBuilderStore.getState().setActiveVersion(null);
    }
  }, [currentPage, activeVersion]);

  if (currentPage === "builder") {
    return (
      <BuilderPage
        isDark={isDark}
        currentVersion={activeVersion}
        toggleTheme={toggleTheme}
        onClose={() => setCurrentPage(selectedVersionId ? "version" : "home")}
        onUpdateVersionData={handleUpdateVersionData}
      />
    );
  }

  return (
    <div className={`relative min-h-screen w-full font-sans overflow-x-hidden lg:overflow-hidden selection:bg-primary/30 selection:text-primary transition-colors duration-1000 ${isDark ? 'text-white' : 'text-black'}`}>
      <Background isDark={isDark} />
      
      {/* Top Header Section */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-10 pt-6 sm:pt-8 w-full max-w-[1800px] mx-auto">
        <BrandIsland isDark={isDark} onClick={() => setCurrentPage('home')} />
        <UserIsland isDark={isDark} toggleTheme={toggleTheme} />
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center min-h-[60vh] relative z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="relative flex h-10 w-10">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#75E2FF]/35 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-10 w-10 bg-[#75E2FF]/10 border border-[#75E2FF]/40 items-center justify-center text-xs text-[#75E2FF] font-black font-sans">...</span>
            </div>
            <span className="text-[10px] font-black tracking-[0.25em] text-[#75E2FF]/80 uppercase font-sans animate-pulse">Initializing Experience sequence...</span>
          </div>
        </div>
      ) : currentPage === 'home' ? (
        <Home 
          isDark={isDark} 
          versions={versions}
          onAddVersion={(newVer) => {
            createVersionMutation.mutate(newVer);
          }}
          onSelectVersion={(versionId) => {
            setSelectedVersionId(versionId);
            setCurrentPage('version');
          }} 
        />
      ) : (
        <VersionPage 
          isDark={isDark} 
          versionId={selectedVersionId!} 
          versions={versions}
          onBack={() => setCurrentPage('home')} 
          onSelectVersion={setSelectedVersionId}
          onLaunchBuilder={() => setCurrentPage("builder")}
          onUpdateVersionStatus={(id, status) => {
            updateVersionStatusMutation.mutate({ id, status });
          }}
          onAddVersion={(newVer) => {
            createVersionMutation.mutate(newVer);
            setSelectedVersionId(newVer.id);
          }}
        />
      )}
    </div>
  );
}

