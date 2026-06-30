import React, { useState } from "react";
import { Hero } from "./Hero";
import { SearchFilters } from "./SearchFilters";
import { StatsOverview } from "./StatsOverview";
import { VersionsList } from "./VersionsList";
import { RecentlyOpened } from "./RecentlyOpened";
import { FilterState, SavedView, EnrichedVersion } from "../../types";
import { Popup } from "../../components/popup/Popup";
import { GlassCard } from "../../components/ui";
import { CreateDCXForm } from "../../components/forms";
import { generateId } from "../../utils/id.helpers";

interface HomeProps {
  isDark: boolean;
  versions: EnrichedVersion[];
  onAddVersion: (newVer: EnrichedVersion) => void;
  onSelectVersion?: (versionId: string) => void;
}

const INITIAL_FILTERS: FilterState = {
  status: [],
  clients: [],
  products: [],
};

const DEFAULT_VIEWS: SavedView[] = [
  {
    id: "view-active",
    name: "Active",
    isDefault: true,
    filters: {
      status: ["Draft", "In Progress", "Ready for Review", "Approved"],
      clients: [],
      products: [],
    }
  },
  {
    id: "view-hsa",
    name: "HSA",
    isDefault: true,
    filters: {
      status: ["Draft", "In Progress", "Ready for Review", "Approved"],
      clients: ["HSA"],
      products: [],
    }
  },
  {
    id: "view-snb",
    name: "SNB",
    isDefault: true,
    filters: {
      status: ["Draft", "In Progress", "Ready for Review", "Approved"],
      clients: ["SNB"],
      products: [],
    }
  }
];

export default function Home({ isDark, versions, onAddVersion, onSelectVersion }: HomeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>(DEFAULT_VIEWS[0].filters);
  const [savedViews, setSavedViews] = useState<SavedView[]>(DEFAULT_VIEWS);
  const [activeViewId, setActiveViewId] = useState<string | null>(DEFAULT_VIEWS[0].id);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCreateCampaignSubmit = (newVersion: EnrichedVersion) => {
    onAddVersion(newVersion);
    setIsPopupOpen(false);
  };

  const handleSaveView = (name: string, currentFilters: FilterState) => {
    const newView: SavedView = {
      id: `view-${generateId()}`,
      name,
      filters: currentFilters,
    };
    setSavedViews([...savedViews, newView]);
    setActiveViewId(newView.id);
  };

  const handleDeleteView = (id: string) => {
    setSavedViews(savedViews.filter(v => v.id !== id));
    if (activeViewId === id) {
      setActiveViewId(null);
      setFilters(INITIAL_FILTERS);
    }
  };

  const handleSelectView = (view: SavedView) => {
    if (activeViewId === view.id) {
      setActiveViewId(null);
      setFilters(INITIAL_FILTERS);
    } else {
      setActiveViewId(view.id);
      setFilters(view.filters);
    }
  };

  return (
    <main className="relative z-10 px-4 sm:px-10 pt-2 w-full max-w-[1800px] mx-auto h-auto lg:h-[calc(100vh-140px)] overflow-hidden pb-10 lg:pb-0 font-sans">
      <GlassCard
        padding="none"
        radius="xl"
        className="w-full h-full overflow-hidden flex flex-col"
      >
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[2.1fr_0.9fr] divide-y lg:divide-y-0 lg:divide-x divide-current/[0.06] overflow-hidden">
          
          {/* LEFT COMPONENT AREA: Main Campaign / Design Hub */}
          <div className="flex flex-col h-full overflow-hidden p-6 sm:p-8 space-y-5">
            {/* Hero & Searching Filters Area */}
            <div className="space-y-5 flex-shrink-0">
              <Hero isDark={isDark} onAddClick={() => setIsPopupOpen(true)} />
              <div className="h-px bg-current/[0.04]" />
              <SearchFilters 
                isDark={isDark} 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm} 
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters);
                  setActiveViewId(null);
                }}
                savedViews={savedViews}
                activeViewId={activeViewId}
                onSaveView={handleSaveView}
                onSelectView={handleSelectView}
                onDeleteView={handleDeleteView}
              />
            </div>

            {/* Campaign Versions list */}
            <div className="flex-1 min-h-[350px] lg:min-h-0 overflow-hidden relative">
              <VersionsList 
                isDark={isDark} 
                searchTerm={searchTerm} 
                filters={filters}
                onSelectVersion={onSelectVersion}
                versions={versions}
              />
            </div>
          </div>

          {/* RIGHT COMPONENT AREA: Analytics & Activity Widgets */}
          <div className="flex flex-col h-full divide-y divide-current/[0.06] bg-current/[0.01] overflow-hidden">
            {/* Stats Summary Widget */}
            <div className="p-6 sm:p-8 flex-shrink-0">
              <h4 className="text-[10px] font-black tracking-[0.25em] uppercase opacity-35 mb-4 select-none">
                Workspace Analytics
              </h4>
              <StatsOverview isDark={isDark} />
            </div>

            {/* Activity Log / Recently Opened widget */}
            <div className="flex-1 p-6 sm:p-8 overflow-hidden flex flex-col min-h-[300px] lg:min-h-0">
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                <RecentlyOpened isDark={isDark} />
              </div>
            </div>
          </div>

        </div>
      </GlassCard>

      {/* Premium Template Popup Container containing isolated CreateDCXForm */}
      <Popup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title="Initialize Experience Sequence"
        subtitle="Campaign Workspace Creator"
        description="Select a Client to query their specific projects catalog. Choose a project to retrieve the next auto-incremented version sequence, assign collaborators, and attach files."
        isDark={isDark}
        maxWidthClass="max-w-5xl"
      >
        <CreateDCXForm
          isDark={isDark}
          versions={versions}
          onSubmit={handleCreateCampaignSubmit}
          onCancel={() => setIsPopupOpen(false)}
        />
      </Popup>
    </main>
  );
}
