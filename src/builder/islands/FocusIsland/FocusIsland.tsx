import React, { useCallback, useState, useEffect } from 'react';
import { Target, X } from 'lucide-react';
import { IslandToggleButton } from '@/builder/ui/buttons/IslandToggleButton';
import { BuilderIslandShell } from '../BuilderIslandShell';
import { WeekOption } from './options/WeekOption/WeekOption';
import { PropertyOption } from './options/PropertyOption/PropertyOption';
import { useStageContext } from '@/builder/stage/StageProvider';
import { getAllTasks } from '@/utils/node.helpers';
import { useToggle } from '@/hooks/useToggle';

type PropertyKey = 'senderId' | 'receiverId';

export function FocusIsland() {
  const [isFocusIslandExpanded, , openFocusIsland, closeFocusIsland] = useToggle();
  const { nodes, selectedNodeIds, setSelectedNodeIds } = useStageContext();

  const [activeWeek, setActiveWeek] = useState<number | null>(null);
  const [activeProperty, setActiveProperty] = useState<{ key: PropertyKey; val: string } | null>(null);
  const [focusMode, setFocusMode] = useState<'and' | 'or'>('and');

  const activeFiltersCount = (activeWeek !== null ? 1 : 0) + (activeProperty !== null ? 1 : 0);

  const getTasksForWeek = useCallback((wNum: number) => {
    return getAllTasks(nodes).filter((task) => {
      const date = task.date;
      if (!date) return false;
      if (date.mode === 'linked') {
        return date.weekOffset === wNum - 1;
      }
      return false;
    });
  }, [nodes]);

  const getTasksWithVal = useCallback((key: PropertyKey, val: string) => {
    return getAllTasks(nodes).filter((task) => {
      return task[key] === val;
    });
  }, [nodes]);

  // Apply active filters directly to selectedNodeIds
  useEffect(() => {
    if (activeWeek === null && activeProperty === null) {
      return;
    }

    const weekTaskIds = activeWeek ? getTasksForWeek(activeWeek).map((t) => t.id) : [];
    const propTaskIds = activeProperty ? getTasksWithVal(activeProperty.key, activeProperty.val).map((t) => t.id) : [];

    let nextIds: string[] = [];
    if (activeWeek !== null && activeProperty !== null) {
      if (focusMode === 'and') {
        nextIds = weekTaskIds.filter((id) => propTaskIds.includes(id));
      } else {
        nextIds = Array.from(new Set([...weekTaskIds, ...propTaskIds]));
      }
    } else if (activeWeek !== null) {
      nextIds = weekTaskIds;
    } else if (activeProperty !== null) {
      nextIds = propTaskIds;
    }

    setSelectedNodeIds(nextIds);
  }, [activeWeek, activeProperty, focusMode, setSelectedNodeIds, getTasksForWeek, getTasksWithVal]);

  // Synchronize local active filters when selection changes externally
  useEffect(() => {
    if (selectedNodeIds.length === 0) {
      const weekIds = activeWeek ? getTasksForWeek(activeWeek).map((t) => t.id) : [];
      const propIds = activeProperty ? getTasksWithVal(activeProperty.key, activeProperty.val).map((t) => t.id) : [];

      let expectedIds: string[] = [];
      if (activeWeek !== null && activeProperty !== null) {
        if (focusMode === 'and') {
          expectedIds = weekIds.filter((id) => propIds.includes(id));
        } else {
          expectedIds = Array.from(new Set([...weekIds, ...propIds]));
        }
      } else if (activeWeek !== null) {
        expectedIds = weekIds;
      } else if (activeProperty !== null) {
        expectedIds = propIds;
      }

      if (expectedIds.length > 0) {
        // Clear stale filter controls when selection was cleared outside this island.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveWeek(null);
        setActiveProperty(null);
      }
      return;
    }

    const weekIds = activeWeek ? getTasksForWeek(activeWeek).map((t) => t.id) : [];
    const propIds = activeProperty ? getTasksWithVal(activeProperty.key, activeProperty.val).map((t) => t.id) : [];

    let expectedIds: string[] = [];
    if (activeWeek !== null && activeProperty !== null) {
      if (focusMode === 'and') {
        expectedIds = weekIds.filter((id) => propIds.includes(id));
      } else {
        expectedIds = Array.from(new Set([...weekIds, ...propIds]));
      }
    } else if (activeWeek !== null) {
      expectedIds = weekIds;
    } else if (activeProperty !== null) {
      expectedIds = propIds;
    } else {
      return;
    }

    const hasExternalSelection = selectedNodeIds.some((id) => !expectedIds.includes(id));
    if (hasExternalSelection) {
      // Clear stale filter controls when another selection source takes over.
      setActiveWeek(null);
      setActiveProperty(null);
    }
  }, [selectedNodeIds, activeWeek, activeProperty, focusMode, getTasksForWeek, getTasksWithVal]);

  return (
    <div
      className="relative z-40"
      id="focus-island-container"
    >
      <BuilderIslandShell
        isExpanded={isFocusIslandExpanded}
        shape="panel"
        collapsedWidth={56}
        collapsedHeight={56}
        expandedWidth={56}
        expandedHeight="auto"
        onToggle={openFocusIsland}
        collapsedIcon={
          <div className="relative">
            <IslandToggleButton
              isActive={isFocusIslandExpanded}
              onClick={openFocusIsland}
              icon={Target}
              title="Open Focus & Locator"
            />
            {activeFiltersCount > 0 && (
              <span
                id="focus-active-badge"
                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--theme-accent)] text-black text-dcx-2xs font-bold font-mono shadow-md border border-black animate-in scale-in duration-200"
              >
                {activeFiltersCount}
              </span>
            )}
          </div>
        }
        id="focus-island"
        className={isFocusIslandExpanded ? 'p-1.5' : ''}
        style={{ transformOrigin: 'top center' }}
      >
        {isFocusIslandExpanded && (
          <div className="flex flex-col items-center gap-2.5 py-2 w-full h-auto" id="focus-island-expanded-view">
            {/* Active Toggle Button flipping to close (X) */}
            <IslandToggleButton
              id="focus-island-toggle-expanded"
              isActive={isFocusIslandExpanded}
              onClick={closeFocusIsland}
              icon={Target}
              activeIcon={X}
              title="Close Focus Panel"
            />

            {/* Vertical divider */}
            <div className="h-[1px] w-6 bg-white/10 shrink-0 select-none mt-1" />

            {/* Metadata Block similar to Kanban Builder */}
            <div className="flex flex-col select-none pointer-events-none text-center items-center shrink-0 overflow-hidden leading-none mb-1">
              <span className="text-dcx-3xs font-black tracking-[0.2em] uppercase text-[var(--theme-accent)]/40 font-mono leading-none">
                Focus
              </span>
              <span className="text-dcx-xs font-bold text-white/95 leading-none mt-1.5 tracking-tight font-sans">
                Controls
              </span>
            </div>

            {/* Vertical divider */}
            <div className="h-[1px] w-6 bg-white/10 shrink-0 select-none mb-1" />

            {/* Focus option triggers */}
            <div className="flex flex-col gap-3 items-center" id="focus-island-options">
              {/* Week Focus Option Icon */}
              <WeekOption
                id="focus-option-week"
                activeWeek={activeWeek}
                setActiveWeek={setActiveWeek}
                focusMode={focusMode}
              />

              {/* Property Focus Option Icon */}
              <PropertyOption
                id="focus-option-property"
                activeProperty={activeProperty}
                setActiveProperty={setActiveProperty}
                focusMode={focusMode}
              />

              {/* AND/OR Toggle */}
              {activeFiltersCount >= 2 && (
                <>
                  <div className="h-[1px] w-6 bg-white/10 shrink-0 select-none my-0.5" />
                  <button
                    type="button"
                    onClick={() => setFocusMode(focusMode === 'and' ? 'or' : 'and')}
                    className="w-10 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-between p-0.5 relative cursor-pointer hover:bg-white/10 transition-all duration-200"
                    id="focus-mode-toggle"
                    title={`Focus logic: ${focusMode.toUpperCase()}. Click to switch.`}
                  >
                    <span className={`absolute top-0.5 bottom-0.5 w-[18px] rounded-full bg-[var(--theme-accent)] transition-all duration-300 ${
                      focusMode === 'and' ? 'left-0.5' : 'left-[19px]'
                    }`} />
                    <span className={`text-dcx-3xs font-bold font-mono z-10 w-1/2 text-center select-none transition-colors ${
                      focusMode === 'and' ? 'text-black' : 'text-white/50'
                    }`}>
                      &
                    </span>
                    <span className={`text-dcx-3xs font-bold font-mono z-10 w-1/2 text-center select-none transition-colors ${
                      focusMode === 'or' ? 'text-black' : 'text-white/50'
                    }`}>
                      |
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </BuilderIslandShell>
    </div>
  );
}
