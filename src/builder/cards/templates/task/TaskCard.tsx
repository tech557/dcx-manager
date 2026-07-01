import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useVersionQuery } from '@/queries/versions.queries';
import { resolveTaskDate } from '@/utils/date.helpers';
import { getChannelIcon } from '@/builder/shared/channel.icons';
import { CardShell } from '../../CardShell';
import type { TaskCardData } from '@/types/builder-node.types';
import { useStageContext } from '@/builder/stage/StageProvider';
import { TaskProperties } from './task-properties/TaskProperties';
import { Calendar, Link2, CornerDownLeft } from 'lucide-react';
import { TaskHoverCard } from './TaskHoverCard';
import { useCardBehavior } from '../../useCardBehavior';

interface TaskCardProps {
  task: TaskCardData;
  selected?: boolean;
  locked?: boolean;
  onSelect?: (id: string, isMulti: boolean) => void;
  disableExpand?: boolean;
}

export function TaskCard({ task, selected = false, locked = false, onSelect, disableExpand = false }: TaskCardProps) {
  const { expandedNodeIds, setFocusedNodeId } = useStageContext();
  const isExpanded = !disableExpand && expandedNodeIds.includes(task.id);
  const anchorRef = useRef<HTMLDivElement>(null);
  const behavior = useCardBehavior({ kind: 'task', data: task, selected, locked, onSelect });

  const { versionId = 'v-1' } = useParams();
  const versionQuery = useVersionQuery(versionId);
  const communicatedDate = versionQuery.data?.communicatedDate || null;

  // Inline Title Editor states
  const [editedName, setEditedName] = useState(task.name);
  const [isHovering, setIsHovering] = useState(false);

  const openEditor = () => setFocusedNodeId(task.id);

  useEffect(() => {
    // Keep the inline draft name in sync when the backing task changes externally.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEditedName(task.name);
  }, [task.name]);

  const handleNameSubmit = () => {
    if (editedName.trim() && editedName.trim() !== task.name) {
      behavior.actions.updateTask({ actionId: task.actionId, taskId: task.id, changes: { name: editedName.trim() } });
    } else {
      setEditedName(task.name);
    }
  };

  const IconComponent = getChannelIcon(task.channelId);
  const resolvedDate = resolveTaskDate(task.date, communicatedDate);
  const isFilled = task.specsState?.status === 'filled';
  const isLinked = task.date?.mode === 'linked';

  let dateDisplay = resolvedDate || '';
  let dayNum = '', monthStr = '';
  const parsedDate = resolvedDate ? resolvedDate.split('-').map(Number) : null;
  if (parsedDate && parsedDate.length === 3) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    dateDisplay = `${parsedDate[2]} ${months[parsedDate[1] - 1]}`;
    dayNum = String(parsedDate[2]);
    monthStr = months[parsedDate[1] - 1] || '';
  }

  if (!isExpanded) {
    return (
      <div
        ref={anchorRef}
        className="relative flex-none"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <CardShell
          kind="task"
          data={task || {}}
          selected={selected}
          locked={locked}
          onSelect={onSelect}
          className="w-14 h-[60px] flex-none relative group/card overflow-hidden select-none px-1.5"
        >
          <div className="flex flex-col items-center justify-center w-full h-full gap-1.5" id={`task-card-collapsed-${task.id}`}>
            {/* Bigger channel icon container */}
            <div className={`flex items-center justify-center w-6.5 h-6.5 rounded-md border transition-all duration-200 shrink-0 ${
              selected ? 'bg-[var(--theme-accent)]/20 border-[var(--theme-accent)]/30 text-[var(--theme-accent)]' : isFilled ? 'bg-[var(--theme-accent)]/10 border-[var(--theme-accent)]/20 text-[var(--theme-accent)]' : 'bg-white/5 border-white/10 text-neutral-400'
            }`}>
              {React.createElement(IconComponent, { className: 'w-4 h-4' })}
            </div>

            {/* Date indicator or date icon instead of 'no date' */}
            {!resolvedDate ? (
              <div className="flex items-center justify-center h-3.5 select-none" title="No Date set">
                <Calendar className="w-3.5 h-3.5 text-neutral-500/80" />
              </div>
            ) : (
              <div className="flex items-center gap-0.5 h-3.5 select-none font-mono" title={isLinked ? "Linked Date" : "Custom Date"}>
                {isLinked ? (
                  <Link2 className="w-2.5 h-2.5 text-[var(--theme-accent)]/80 shrink-0" />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-neutral-600 shrink-0" />
                )}
                <span className={`text-dcx-4xs font-bold tracking-tighter leading-none ${
                  isLinked ? 'text-[var(--theme-accent)]/90' : 'text-neutral-450'
                }`}>
                  {dayNum} {monthStr}
                </span>
              </div>
            )}
          </div>
        </CardShell>
        <TaskHoverCard name={task.name || 'Untitled Task'} isOpen={isHovering} anchorRef={anchorRef} />
      </div>
    );
  }

  return (
    <div ref={anchorRef} className="relative w-full">
      <CardShell
        kind="task"
        data={task || {}}
        selected={selected}
        locked={locked}
        onSelect={onSelect}
        className="w-full h-[60px] relative group/card select-none px-2 py-1"
      >
        <div
          className="flex items-center h-full gap-1.5 w-full"
          id={`task-card-expanded-${task.id}`}
        >
          {/* Left Side: Channel Icon */}
          <div className="flex items-center justify-center shrink-0">
            <div className={`flex items-center justify-center w-5 h-5 rounded-md border transition-all duration-200 shrink-0 ${
              selected
                ? 'bg-[var(--theme-accent)]/20 border-[var(--theme-accent)]/30 text-[var(--theme-accent)]'
                : isFilled
                  ? 'bg-[var(--theme-accent)]/10 border-[var(--theme-accent)]/20 text-[var(--theme-accent)]'
                  : 'bg-white/5 border-white/10 text-neutral-400'
            }`}>
              {React.createElement(IconComponent, { className: 'w-3.5 h-3.5' })}
            </div>
          </div>

          {/* Center / Stacking Area: Two lines */}
          <div className="flex flex-col justify-center flex-1 min-w-0 h-full gap-0.5">
            {/* Line 1: Name Input */}
            <div className="flex items-center w-full min-w-0">
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={handleNameSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNameSubmit();
                    e.currentTarget.blur();
                  }
                  if (e.key === 'Escape') {
                    setEditedName(task.name);
                    e.currentTarget.blur();
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
                className="bg-transparent border border-transparent hover:border-white/10 focus:border-[var(--theme-accent)]/30 hover:bg-white/[0.02] focus:bg-black/30 font-semibold text-dcx-2xs-plus text-neutral-200 px-1 py-0 rounded outline-none transition-all w-full truncate focus:text-white"
                title="Click to edit task name"
              />
            </div>

            {/* Line 2: Properties (TaskProperties deck + Date) */}
            <div className="flex items-center justify-between w-full gap-1.5" onClick={(e) => e.stopPropagation()}>
              <TaskProperties task={task} />

              {/* Date Indicator with Calendar/Link Icon */}
              <div className="flex items-center gap-1 shrink-0 pr-0.5 select-none font-mono" id={`task-card-date-${task.id}`}>
                {isLinked ? (
                  <Link2 className="w-2.5 h-2.5 text-[var(--theme-accent)] animate-pulse shrink-0" />
                ) : (
                  <Calendar className="w-2 h-2 text-neutral-500 shrink-0" />
                )}
                {dateDisplay ? (
                  <span className={`text-dcx-3xs font-bold tracking-tighter ${isLinked ? 'text-[var(--theme-accent)] font-extrabold' : 'text-neutral-400'}`} title={isLinked ? "Linked Date" : "Custom Date"}>
                    {dateDisplay}
                  </span>
                ) : (
                  <span className="text-dcx-3xs font-bold tracking-tighter text-neutral-500" title="No Date set">
                    No Date
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Open-in-editor button (Enter glyph) — opens the task editor directly */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); openEditor(); }}
            onDoubleClick={(e) => e.stopPropagation()}
            className="shrink-0 flex items-center justify-center w-5 h-5 rounded-md border border-white/10 bg-white/5 text-neutral-400 hover:text-[var(--theme-accent)] hover:border-[var(--theme-accent)]/30 hover:bg-[var(--theme-accent)]/10 transition-all cursor-pointer"
            title="Open in editor"
            aria-label="Open task in editor"
            id={`task-open-editor-${task.id}`}
          >
            <CornerDownLeft className="w-3 h-3" />
          </button>
        </div>
      </CardShell>
    </div>
  );
}
