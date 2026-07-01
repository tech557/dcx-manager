import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { EffectLayer } from '@/ui/motion/EffectLayer';
import type { CardKind } from '@/types/card.types';
import { useStageContext } from '@/builder/stage/StageProvider';
import { useCardBehavior, type CardData } from './useCardBehavior';
import { useCardDrag } from './useCardDrag';
import { useCardEffects } from './useCardEffects';
import { getSelectionInfo } from './cardSelection.helpers';
import { CardShellContent } from './CardShellContent';

interface CardShellProps extends PropsWithChildren {
  kind: CardKind;
  data: CardData;
  selected?: boolean;
  locked?: boolean;
  highlight?: boolean;
  className?: string;
  onSelect?: (id: string, multi: boolean) => void;
  onLongPress?: () => void;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export function CardShell({
  kind,
  data,
  selected = false,
  locked = false,
  highlight = false,
  className,
  onSelect,
  onLongPress,
  onClick,
  children,
}: CardShellProps) {
  const stage = useStageContext();
  const elementRef = useRef<HTMLElement>(null);
  const [isJustCreated, setIsJustCreated] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = stage.selectedNodeIds.includes(data.id);
  const selectionInfo = getSelectionInfo(stage.nodes, stage.selectedNodeIds);
  const invalidSelection = isSelected
    && stage.selectedNodeIds.length > 1
    && (selectionInfo.mixed || selectionInfo.anyLocked);
  const effectiveSelected = stage.isDragging ? false : selected;
  const behavior = useCardBehavior({ kind, data, selected: effectiveSelected, locked, onSelect });
  const isExpanded = stage.expandedNodeIds.includes(data.id);
  const isJustEdited = stage.recentlyEditedIds?.includes(data.id) ?? false;
  const isReceivingChild = stage.receivingChildId === data.id;

  const {
    isDragOver,
    isDraggable,
    isLifted,
    consumeLongPressClick,
    dragHandlers,
    pointerHandlers,
  } = useCardDrag({
    kind,
    data,
    locked,
    isSelected,
    isSelectionInvalid: invalidSelection,
    behavior,
    onLongPress,
  });
  const cardEffects = useCardEffects({
    kind,
    isDragOver,
    isLifted,
    isJustCreated,
    isJustEdited,
    isReceivingChild,
    isSelected: effectiveSelected,
    isHighlighted: highlight,
    isLocked: locked,
    readinessState: behavior.readiness.state,
    isHovered,
  });

  useEffect(() => {
    if (!isExpanded || kind !== 'task') return;
    const timer = setTimeout(() => {
      elementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }, 100);
    return () => clearTimeout(timer);
  }, [isExpanded, kind]);

  useEffect(() => {
    if (!effectiveSelected || kind !== 'task') return;
    const timer = setTimeout(() => {
      elementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }, 80);
    return () => clearTimeout(timer);
  }, [effectiveSelected, kind]);

  useEffect(() => {
    const timer = setTimeout(() => setIsJustCreated(false), 850);
    return () => clearTimeout(timer);
  }, []);

  if (stage.isolatedNodeIds && !stage.isolatedNodeIds.includes(data.id)) return null;

  const handleDoubleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    stage.setExpandedNodeIds(
      isExpanded
        ? stage.expandedNodeIds.filter((id) => id !== data.id)
        : [...stage.expandedNodeIds, data.id],
    );
  };

  return (
    <EffectLayer effect={cardEffects.effectName} active={cardEffects.effectActive} className={className}>
      <article
        ref={elementRef}
        id={`card-${data.id}`}
        className={`w-full min-h-0 flex flex-col relative select-none border-none bg-transparent outline-none shadow-none ${
          isLifted ? 'cursor-grabbing z-30' : 'cursor-pointer'
        } ${kind === 'phase' ? 'h-full max-h-full overflow-hidden' : 'h-auto shrink-0'}`}
        data-testid={`card-${kind}-${data.id}`}
        data-card-kind={kind}
        data-movement-axis={behavior.movementAxis}
        data-readiness={behavior.readiness.state}
        data-expanded={isExpanded}
        data-selected={effectiveSelected}
        data-lifted={isLifted}
        draggable={isDraggable}
        onClick={(e) => {
          if (consumeLongPressClick()) return;
          behavior.handleClick(e);
          onClick?.(e);
        }}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...dragHandlers}
        {...pointerHandlers}
      >
        <CardShellContent
          kind={kind}
          dataId={data.id}
          isExpanded={isExpanded}
          glassBorderClass={cardEffects.glassBorderClass}
          surfaceClass={cardEffects.surfaceClass}
          showCorners={cardEffects.showCorners}
          noBackground={cardEffects.noBackground}
        >
          {children}
        </CardShellContent>
      </article>
    </EffectLayer>
  );
}
