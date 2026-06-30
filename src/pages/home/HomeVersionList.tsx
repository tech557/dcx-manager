import { AnimatePresence, motion } from 'motion/react';
import type { Version } from '@/types/domain';
import type { VersionStatus } from '@/types/lifecycle';
import { HomeVersionCard } from './HomeVersionCard';

export interface HomeFilterState {
  search: string;
  client: string;
  project: string;
  status: VersionStatus | '';
  createdBy: string;
}

function getMetaString(version: Version, key: string): string {
  if (version.metadata && typeof version.metadata === 'object' && !Array.isArray(version.metadata)) {
    const val = (version.metadata as Record<string, unknown>)[key];
    if (typeof val === 'string') return val;
  }
  return '';
}

function matchesFilter(version: Version, filters: HomeFilterState): boolean {
  const { search, client, project, status, createdBy } = filters;
  const vClient = getMetaString(version, 'client');
  const vProject = getMetaString(version, 'project');

  if (search) {
    const q = search.toLowerCase();
    const haystack = [version.versionNumber, vClient, vProject, version.status, version.createdBy].join(' ').toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (client && vClient !== client) return false;
  if (project && vProject !== project) return false;
  if (status && version.status !== status) return false;
  if (createdBy && version.createdBy !== createdBy) return false;
  return true;
}

interface HomeVersionListProps {
  versions: Version[];
  filters: HomeFilterState;
}

export function HomeVersionList({ versions, filters }: HomeVersionListProps) {
  const filtered = versions.filter((v) => matchesFilter(v, filters));

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-2 text-center px-4">
        <p className="text-dcx-sm font-semibold text-[var(--theme-text-secondary)]">No versions match your filters</p>
        <p className="text-dcx-xs text-[var(--theme-text-secondary)]/60">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 p-1">
      <AnimatePresence initial={false}>
        {filtered.map((version, i) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
          >
            <HomeVersionCard version={version} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
