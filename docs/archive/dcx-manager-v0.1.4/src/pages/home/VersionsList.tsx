import React from 'react';
import { VersionCard } from "./VersionCard";
import { getEnrichedVersions } from "../../mock/versions";
import { FilterState, EnrichedVersion } from "../../types";

interface VersionsListProps {
  isDark: boolean;
  searchTerm: string;
  filters: FilterState;
  onSelectVersion?: (versionId: string) => void;
  versions: EnrichedVersion[];
}

export function VersionsList({ isDark, searchTerm, filters, onSelectVersion, versions }: VersionsListProps) {
  const allVersions = versions;
  
  const filteredVersions = React.useMemo(() => {
    return allVersions.filter(version => {
      // Search term check
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = searchTerm === "" || (
        version.dcx.projectName.toLowerCase().includes(searchLower) ||
        version.versionNumber.toLowerCase().includes(searchLower) ||
        version.dcx.product.toLowerCase().includes(searchLower) ||
        version.dcx.client.toLowerCase().includes(searchLower) ||
        version.dcx.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );

      // Advanced filters check
      const matchesStatus = filters.status.length === 0 || filters.status.includes(version.status);
      const matchesClient = filters.clients.length === 0 || filters.clients.includes(version.dcx.client);
      const matchesProduct = filters.products.length === 0 || filters.products.includes(version.dcx.product);

      return matchesSearch && matchesStatus && matchesClient && matchesProduct;
    });
  }, [allVersions, searchTerm, filters]);
  
  return (
    <div 
      className="space-y-4 h-full overflow-y-auto overflow-x-hidden pr-1 sm:pr-10 pl-1 sm:pl-2 pb-10 custom-scrollbar snap-y snap-mandatory"
    >
      {filteredVersions.length > 0 ? (
        filteredVersions.map((version, i) => (
          <VersionCard 
            key={version.id} 
            version={version} 
            index={i} 
            isDark={isDark} 
            onSelect={onSelectVersion}
          />
        ))
      ) : (
        <div className={`flex flex-col items-center justify-center py-20 opacity-30 ${isDark ? 'text-white' : 'text-black'}`}>
          <p className="text-sm font-bold tracking-widest uppercase mb-2">No results found</p>
          <p className="text-[10px] font-medium tracking-tight">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
