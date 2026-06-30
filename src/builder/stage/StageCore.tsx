import { useState, useEffect, useRef, useCallback } from 'react';
import { getStageRenderer, stageViewOrder } from './stage.registry';
import { StageEdgeNavigation } from './StageEdgeNavigation';
import { useStageContext } from './StageProvider';
import { useStageMovement } from './useStageMovement';
import type { ViewKind } from '@/types/stage.types';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { effectsRegistry } from '@/ui/motion/effects.registry';

export function StageCore() {
  const {
    view,
    position,
    selectedNodeIds,
    setSelectedNodeIds,
    isEditorOpen,
    isDragging,
    prevWeek,
    nextWeek,
  } = useStageContext();
  const { stageRef, handlePointerMove, handlePointerLeave } = useStageMovement(view);
  const { Renderer } = getStageRenderer(view);

  const prefersReduced = useReducedMotion();
  const prevViewRef = useRef<ViewKind>(view);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (prevViewRef.current !== view) {
      const currentIndex = stageViewOrder.indexOf(view);
      const prevIndex = stageViewOrder.indexOf(prevViewRef.current);
      const newDirection = currentIndex > prevIndex ? 1 : -1;
      setDirection(newDirection);
      prevViewRef.current = view;
    }
  }, [view]);

  const hasFocusedNode = isEditorOpen;

  const [isHoveredOverLeft, setIsHoveredOverLeft] = useState(false);
  const [isHoveredOverRight, setIsHoveredOverRight] = useState(false);

  const scrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const weekNavTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopScrolling = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);

  const cancelWeekNav = useCallback(() => {
    if (weekNavTimerRef.current) {
      clearTimeout(weekNavTimerRef.current);
      weekNavTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopScrolling();
      cancelWeekNav();
    };
  }, [cancelWeekNav, stopScrolling]);

  const startScrolling = (direction: 'left' | 'right') => {
    stopScrolling();
    scrollIntervalRef.current = setInterval(() => {
      const container = document.querySelector('[data-kanban-view="true"]') || document.getElementById('days-horizontal-columns');
      if (container) {
        container.scrollLeft += direction === 'left' ? -25 : 25;
      }
    }, 20);
  };

  const triggerWeekNav = (direction: 'left' | 'right') => {
    cancelWeekNav();
    weekNavTimerRef.current = setTimeout(() => {
      if (direction === 'left') prevWeek();
      else nextWeek();
    }, 600);
  };

  const handleStageBackdropClick = (e: React.MouseEvent<HTMLElement>) => {
    // REQ-SBC-DES-001: clicking empty stage (not a card) clears the selection.
    // The inner stage-canvas-wrapper fills this <section>, so a strict
    // `target === currentTarget` check only ever matches the thin padding edge and
    // never the visible canvas. Instead, deselect for any bubbled click that did
    // not originate inside a card (cards carry data-card-kind).
    if (selectedNodeIds.length === 0) return;
    if (e.target instanceof Element && e.target.closest('[data-card-kind]')) return;
    setSelectedNodeIds([]);
  };

  return (
    <section
      className={`w-full h-full flex items-center p-2 overflow-hidden relative select-none transition-all duration-500 ease-out ${
        hasFocusedNode ? 'justify-end md:pr-4' : 'justify-center'
      }`}
      aria-label="Builder stage"
      id="stage-core"
      onClick={handleStageBackdropClick}
    >
      {/* Centered central stage workspace with exact fixed dimensions, scaled responsively */}
      <div
        ref={stageRef}
        className="w-full h-full transition-all duration-300 overflow-hidden bg-transparent border-none pointer-events-auto relative flex flex-col justify-center items-center"
        data-view={view}
        data-selected-count={selectedNodeIds.length}
        data-position={`${position.x}:${position.y}:${position.zoom}`}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        id="stage-canvas-wrapper"
      >
        <AnimatePresence mode="wait" initial={false}>
          {prefersReduced ? (
            <motion.div
              key={view}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
              className="w-full h-full relative z-10"
            >
              <Renderer className="w-full h-full" />
            </motion.div>
          ) : (
            <motion.div
              key={view}
              custom={direction}
              variants={{
                ...effectsRegistry.viewTransitionIn.variants,
                ...effectsRegistry.viewTransitionOut.variants,
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              className="w-full h-full relative z-10"
            >
              <Renderer className="w-full h-full" />
            </motion.div>
          )}
        </AnimatePresence>

        <StageEdgeNavigation
          direction="left"
          view={view}
          isDragging={isDragging}
          isHovered={isHoveredOverLeft}
          onDragEnter={() => {
            setIsHoveredOverLeft(true);
            if (view === 'kanban') startScrolling('left');
            else triggerWeekNav('left');
          }}
          onDragLeave={() => {
            setIsHoveredOverLeft(false);
            stopScrolling();
            cancelWeekNav();
          }}
        />

        <StageEdgeNavigation
          direction="right"
          view={view}
          isDragging={isDragging}
          isHovered={isHoveredOverRight}
          onDragEnter={() => {
            setIsHoveredOverRight(true);
            if (view === 'kanban') startScrolling('right');
            else triggerWeekNav('right');
          }}
          onDragLeave={() => {
            setIsHoveredOverRight(false);
            stopScrolling();
            cancelWeekNav();
          }}
        />
      </div>
    </section>
  );
}

export function createStageRegistryEntry(view: ViewKind) {
  return getStageRenderer(view);
}
